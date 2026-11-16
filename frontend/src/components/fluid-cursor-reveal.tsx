"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Eulerian Navier-Stokes fluid reveal.
 *
 * The engine keeps every simulation field on the GPU as a half-float texture.
 * Pressure is solved with 10 Jacobi relaxation passes per frame, velocity is
 * made divergence-free through gradient subtraction, and vorticity confinement
 * replaces the energy lost to numerical dissipation. Pointer movements are
 * injected as Gaussian impulse splats into both the velocity and dye fields.
 */

const VELOCITY_GRID_SIZE = 128;
const DYE_GRID_SIZE = 768;
const SPLAT_RADIUS = 0.001;
const SIMULATION_TIMESTEP = 0.016;
const VELOCITY_DISSIPATION = 0.98;
const DYE_DISSIPATION = 0.975;
const VORTICITY_STRENGTH = 20;
const PRESSURE_ITERATIONS = 10;

const VERTEX_SHADER = `#version 300 es
layout(location = 0) in vec2 pos;
out vec2 v;
out vec2 vL;
out vec2 vR;
out vec2 vT;
out vec2 vB;
uniform vec2 ts;
void main() {
  v = pos * 0.5 + 0.5;
  vL = v - vec2(ts.x, 0.0);
  vR = v + vec2(ts.x, 0.0);
  vT = v + vec2(0.0, ts.y);
  vB = v - vec2(0.0, ts.y);
  gl_Position = vec4(pos, 0.0, 1.0);
}`;

const FRAGMENT_HEADER = `#version 300 es
precision highp float;
in vec2 v;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 o;
uniform vec2 ts;
`;

const FRAGMENT_SHADERS = {
  splat: `
uniform sampler2D t;
uniform vec2 pt;
uniform float ar;
uniform float r;
uniform vec3 c;
void main() {
  vec2 p = v - pt;
  p.x *= ar;
  o = vec4(texture(t, v).xyz + exp(-dot(p, p) / r) * c, 1.0);
}`,
  adv: `
uniform sampler2D u;
uniform sampler2D s;
uniform float dt;
uniform float dis;
void main() {
  o = dis * texture(s, v - dt * texture(u, v).xy * ts);
  o.a = 1.0;
}`,
  curl: `
uniform sampler2D u;
void main() {
  o = vec4(
    0.5 * (texture(u, vR).y - texture(u, vL).y - texture(u, vT).x + texture(u, vB).x),
    0.0,
    0.0,
    1.0
  );
}`,
  vort: `
uniform sampler2D u;
uniform sampler2D k;
uniform float cu;
uniform float dt;
void main() {
  float L = texture(k, vL).x;
  float R = texture(k, vR).x;
  float T = texture(k, vT).x;
  float B = texture(k, vB).x;
  float C = texture(k, v).x;
  vec2 f = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  f /= length(f) + 1e-4;
  f *= cu * C;
  f.y *= -1.0;
  o = vec4(texture(u, v).xy + f * dt, 0.0, 1.0);
}`,
  div: `
uniform sampler2D u;
void main() {
  float L = texture(u, vL).x;
  float R = texture(u, vR).x;
  float T = texture(u, vT).y;
  float B = texture(u, vB).y;
  vec2 C = texture(u, v).xy;
  if (vL.x < 0.0) L = -C.x;
  if (vR.x > 1.0) R = -C.x;
  if (vT.y > 1.0) T = -C.y;
  if (vB.y < 0.0) B = -C.y;
  o = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`,
  clr: `
uniform sampler2D t;
uniform float val;
void main() {
  o = val * texture(t, v);
}`,
  prs: `
uniform sampler2D p;
uniform sampler2D d;
void main() {
  o = vec4(
    (texture(p, vL).x + texture(p, vR).x + texture(p, vB).x + texture(p, vT).x - texture(d, v).x) * 0.25,
    0.0,
    0.0,
    1.0
  );
}`,
  grad: `
uniform sampler2D p;
uniform sampler2D u;
void main() {
  o = vec4(
    texture(u, v).xy - vec2(
      texture(p, vR).x - texture(p, vL).x,
      texture(p, vT).x - texture(p, vB).x
    ),
    0.0,
    1.0
  );
}`,
  show: `
uniform sampler2D f;
uniform sampler2D a;
uniform sampler2D b;
void main() {
  vec4 fl = texture(f, v);
  vec2 d = clamp(fl.rg * 0.00025, -0.05, 0.05);
  vec2 uv = v - d;
  float m = smoothstep(0.30, 0.42, fl.b);
  o = mix(texture(a, uv), texture(b, uv), m);
  o.a = 1.0;
}`,
} as const;

type ProgramName = keyof typeof FRAGMENT_SHADERS;

type GpuTexture = { t: WebGLTexture };

type RenderTarget = GpuTexture & {
  fb: WebGLFramebuffer;
  w: number;
  h: number;
};

type DoubleBuffer = {
  r: RenderTarget;
  w: RenderTarget;
  swap: () => void;
};

type UniformValue = number | number[] | GpuTexture;

type Splat = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  w: number;
};

type FluidEngineOptions = {
  isActive: { current: boolean };
};

/** Reads the family stack emitted by next/font so canvas text matches the DOM. */
function resolveFontStack(cssVariable: string, fallback: string): string {
  const value = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(cssVariable)
    .trim();

  return value.length > 0 ? value : fallback;
}

function createFluidEngine(
  canvas: HTMLCanvasElement,
  options: FluidEngineOptions,
): () => void {
  const gl = canvas.getContext("webgl2", {
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: false,
  });

  if (!gl) {
    throw new Error("WebGL2 is not available in this browser.");
  }

  if (
    !gl.getExtension("EXT_color_buffer_float") &&
    !gl.getExtension("EXT_color_buffer_half_float")
  ) {
    throw new Error("Floating-point color buffers are not supported.");
  }

  const createdTextures: WebGLTexture[] = [];
  const createdFramebuffers: WebGLFramebuffer[] = [];
  const createdPrograms: WebGLProgram[] = [];

  let vertexBuffer: WebGLBuffer | null = null;
  let animationFrame = 0;
  let resizeTimer: number | null = null;
  let isDisposed = false;

  const displayFontStack = resolveFontStack(
    "--font-space-grotesk",
    '"Space Grotesk", Inter, sans-serif',
  );
  const sansFontStack = resolveFontStack("--font-inter", "Inter, sans-serif");

  const compileShader = (type: number, source: string): WebGLShader => {
    const shader = gl.createShader(type);
    if (!shader) throw new Error("Unable to allocate a WebGL shader.");

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(shader) ?? "unknown compile error";
      gl.deleteShader(shader);
      throw new Error(`Shader compilation failed: ${info}`);
    }

    return shader;
  };

  const createProgram = (fragmentSource: string): WebGLProgram => {
    const program = gl.createProgram();
    if (!program) throw new Error("Unable to allocate a WebGL program.");

    const vertexShader = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(program) ?? "unknown link error";
      gl.deleteProgram(program);
      throw new Error(`Program link failed: ${info}`);
    }

    createdPrograms.push(program);
    return program;
  };

  const createTexture = (): WebGLTexture => {
    const texture = gl.createTexture();
    if (!texture) throw new Error("Unable to allocate a WebGL texture.");

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    createdTextures.push(texture);
    return texture;
  };

  const createRenderTarget = (width: number, height: number): RenderTarget => {
    const texture = createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA16F,
      width,
      height,
      0,
      gl.RGBA,
      gl.HALF_FLOAT,
      null,
    );

    const framebuffer = gl.createFramebuffer();
    if (!framebuffer) throw new Error("Unable to allocate a framebuffer.");

    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0,
    );

    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      throw new Error("Floating-point framebuffer is incomplete.");
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    createdFramebuffers.push(framebuffer);

    return { t: texture, fb: framebuffer, w: width, h: height };
  };

  const createDoubleBuffer = (size: number): DoubleBuffer => {
    const buffer: DoubleBuffer = {
      r: createRenderTarget(size, size),
      w: createRenderTarget(size, size),
      swap() {
        [buffer.r, buffer.w] = [buffer.w, buffer.r];
      },
    };

    return buffer;
  };

  const programs = Object.fromEntries(
    (Object.keys(FRAGMENT_SHADERS) as ProgramName[]).map((name) => [
      name,
      createProgram(FRAGMENT_HEADER + FRAGMENT_SHADERS[name]),
    ]),
  ) as Record<ProgramName, WebGLProgram>;

  vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) throw new Error("Unable to allocate the vertex buffer.");

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const velocity = createDoubleBuffer(VELOCITY_GRID_SIZE);
  const dye = createDoubleBuffer(DYE_GRID_SIZE);
  const pressure = createDoubleBuffer(VELOCITY_GRID_SIZE);
  const curl = createRenderTarget(VELOCITY_GRID_SIZE, VELOCITY_GRID_SIZE);
  const divergence = createRenderTarget(VELOCITY_GRID_SIZE, VELOCITY_GRID_SIZE);
  const layerA: GpuTexture = { t: createTexture() };
  const layerB: GpuTexture = { t: createTexture() };

  const run = (
    program: WebGLProgram,
    target: RenderTarget | null,
    uniforms: Record<string, UniformValue>,
  ) => {
    gl.useProgram(program);
    let textureUnit = 0;

    for (const [name, value] of Object.entries(uniforms)) {
      const location = gl.getUniformLocation(program, name);
      if (location === null) continue;

      if (typeof value === "number") {
        gl.uniform1f(location, value);
      } else if ("t" in value) {
        gl.activeTexture(gl.TEXTURE0 + textureUnit);
        gl.bindTexture(gl.TEXTURE_2D, value.t);
        gl.uniform1i(location, textureUnit);
        textureUnit += 1;
      } else if (value.length === 2) {
        gl.uniform2f(location, value[0], value[1]);
      } else if (value.length === 3) {
        gl.uniform3f(location, value[0], value[1], value[2]);
      }
    }

    const texelSizeLocation = gl.getUniformLocation(program, "ts");
    if (texelSizeLocation) {
      gl.uniform2f(
        texelSizeLocation,
        1 / VELOCITY_GRID_SIZE,
        1 / VELOCITY_GRID_SIZE,
      );
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, target ? target.fb : null);
    gl.viewport(
      0,
      0,
      target ? target.w : canvas.width,
      target ? target.h : canvas.height,
    );
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const paintLayer = (
    target: GpuTexture,
    background: string,
    foreground: string,
    traceColor: string,
  ) => {
    const width = canvas.width;
    const height = canvas.height;
    const layer = document.createElement("canvas");
    layer.width = width;
    layer.height = height;

    const context = layer.getContext("2d");
    if (!context) return;

    const scale = width / Math.max(1, window.innerWidth);
    let seed = 7;
    const random = () =>
      (seed = (seed * 16807) % 2147483647) / 2147483647;

    context.fillStyle = background;
    context.fillRect(0, 0, width, height);

    context.strokeStyle = traceColor;
    context.fillStyle = traceColor;
    context.lineWidth = 1.2 * scale;

    const grid = 56 * scale;

    for (let index = 0; index < 80; index += 1) {
      let px = Math.floor((random() * width) / grid) * grid;
      let py = Math.floor((random() * height) / grid) * grid;
      let isVertical = random() < 0.5;

      context.beginPath();
      context.moveTo(px, py);

      for (let segment = 0; segment < 5; segment += 1) {
        const length =
          (1 + Math.floor(random() * 3)) * grid * (random() < 0.5 ? -1 : 1);

        if (isVertical) py += length;
        else px += length;

        context.lineTo(px, py);
        isVertical = !isVertical;
      }

      context.stroke();
      context.beginPath();
      context.arc(px, py, 3.5 * scale, 0, Math.PI * 2);
      context.fill();
    }

    context.fillStyle = foreground;
    context.textBaseline = "middle";

    const headlineSize = Math.min((width * 0.82) / 6.8, height * 0.28);
    context.font = `700 ${headlineSize}px ${displayFontStack}`;
    context.textAlign = "center";

    if ("letterSpacing" in context) {
      context.letterSpacing = `${-0.04 * headlineSize}px`;
    }

    context.fillText("GREEN", width / 2, height / 2 - headlineSize * 0.48);
    context.fillText(
      "ELECTRONICS",
      width / 2,
      height / 2 + headlineSize * 0.48,
    );

    const labelSize = 12 * scale;
    context.font = `600 ${labelSize}px ${sansFontStack}`;

    if ("letterSpacing" in context) {
      context.letterSpacing = `${0.14 * labelSize}px`;
    }

    context.textAlign = "left";
    context.fillRect(32 * scale, 28 * scale, 16 * scale, 16 * scale);
    context.fillText("GE", 56 * scale, 37 * scale);

    context.textAlign = "right";
    context.fillText("CONTACT", width - 32 * scale, 37 * scale);

    context.textAlign = "center";
    context.fillText(
      "[ MOVE CURSOR TO EXPLORE ]",
      width / 2,
      height - 40 * scale,
    );

    gl.bindTexture(gl.TEXTURE_2D, target.t);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      layer,
    );
  };

  const build = () => {
    if (isDisposed) return;

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(window.innerWidth * pixelRatio));
    canvas.height = Math.max(1, Math.round(window.innerHeight * pixelRatio));

    paintLayer(layerA, "#F8FAFC", "#0F172A", "rgba(15,23,42,0.10)");
    paintLayer(layerB, "#059669", "#F8FAFC", "rgba(248,250,252,0.28)");

    // A single composite keeps Layer A visible before the first splat (and for
    // reduced-motion visitors) without starting the simulation loop.
    run(programs.show, null, { f: dye.r, a: layerA, b: layerB });
  };

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  build();

  void Promise.all([
    document.fonts.load(`700 64px ${displayFontStack}`),
    document.fonts.load(`600 12px ${sansFontStack}`),
  ]).then(build, build);

  const handleResize = () => {
    if (resizeTimer !== null) window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(build, 150);
  };
  window.addEventListener("resize", handleResize);

  const splats: Splat[] = [];
  let lastPointerX: number | null = null;
  let lastPointerY = 0;
  let hasTouched = false;

  const pushPointer = (x: number, y: number) => {
    if (lastPointerX !== null && (x !== lastPointerX || y !== lastPointerY)) {
      splats.push({
        x: x / window.innerWidth,
        y: 1 - y / window.innerHeight,
        dx: (x - lastPointerX) * 5,
        dy: -(y - lastPointerY) * 5,
        w: 1,
      });
    }

    lastPointerX = x;
    lastPointerY = y;
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (!hasTouched) {
      hasTouched = true;
      lastPointerX = null;
    }
    pushPointer(event.clientX, event.clientY);
  };

  const handlePointerDown = (event: PointerEvent) => {
    hasTouched = true;
    splats.push({
      x: event.clientX / window.innerWidth,
      y: 1 - event.clientY / window.innerHeight,
      dx: 0,
      dy: 0,
      w: 0.8,
    });
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
  };

  const handlePointerLeave = () => {
    hasTouched = false;
  };

  window.addEventListener("pointermove", handlePointerMove, { passive: true });
  window.addEventListener("pointerdown", handlePointerDown, { passive: true });
  document.documentElement.addEventListener(
    "pointerleave",
    handlePointerLeave,
  );

  const startedAt = performance.now();

  const frame = () => {
    animationFrame = requestAnimationFrame(frame);

    if (!options.isActive.current) return;

    const elapsedSeconds = (performance.now() - startedAt) / 1000;

    // Autonomous Lissajous sweep demonstrates the reveal before first contact.
    if (!hasTouched && elapsedSeconds < 3) {
      pushPointer(
        window.innerWidth * (0.2 + (0.6 * elapsedSeconds) / 3),
        window.innerHeight * (0.5 + 0.14 * Math.sin(elapsedSeconds * 4)),
      );
    }

    // Stationary hover keeps a micro orbital current alive around the cursor.
    if (hasTouched && lastPointerX !== null && splats.length === 0) {
      splats.push({
        x: lastPointerX / window.innerWidth,
        y: 1 - lastPointerY / window.innerHeight,
        dx: Math.sin(elapsedSeconds * 7) * 6,
        dy: Math.cos(elapsedSeconds * 6) * 6,
        w: 0.04,
      });
    }

    for (const splat of splats.splice(0)) {
      const point = [splat.x, splat.y];
      const color = [splat.dx, splat.dy, splat.w];
      const aspectRatio = canvas.width / canvas.height;

      run(programs.splat, velocity.w, {
        t: velocity.r,
        pt: point,
        ar: aspectRatio,
        r: SPLAT_RADIUS,
        c: color,
      });
      velocity.swap();

      run(programs.splat, dye.w, {
        t: dye.r,
        pt: point,
        ar: aspectRatio,
        r: SPLAT_RADIUS,
        c: color,
      });
      dye.swap();
    }

    run(programs.curl, curl, { u: velocity.r });
    run(programs.vort, velocity.w, {
      u: velocity.r,
      k: curl,
      cu: VORTICITY_STRENGTH,
      dt: SIMULATION_TIMESTEP,
    });
    velocity.swap();

    run(programs.div, divergence, { u: velocity.r });

    run(programs.clr, pressure.w, { t: pressure.r, val: 0.8 });
    pressure.swap();

    for (let iteration = 0; iteration < PRESSURE_ITERATIONS; iteration += 1) {
      run(programs.prs, pressure.w, { p: pressure.r, d: divergence });
      pressure.swap();
    }

    run(programs.grad, velocity.w, { p: pressure.r, u: velocity.r });
    velocity.swap();

    run(programs.adv, velocity.w, {
      u: velocity.r,
      s: velocity.r,
      dt: SIMULATION_TIMESTEP,
      dis: VELOCITY_DISSIPATION,
    });
    velocity.swap();

    run(programs.adv, dye.w, {
      u: velocity.r,
      s: dye.r,
      dt: SIMULATION_TIMESTEP,
      dis: DYE_DISSIPATION,
    });
    dye.swap();

    run(programs.show, null, { f: dye.r, a: layerA, b: layerB });
  };

  if (!prefersReducedMotion) {
    animationFrame = requestAnimationFrame(frame);
  }

  return () => {
    isDisposed = true;
    cancelAnimationFrame(animationFrame);

    if (resizeTimer !== null) window.clearTimeout(resizeTimer);

    window.removeEventListener("resize", handleResize);
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerdown", handlePointerDown);
    document.documentElement.removeEventListener(
      "pointerleave",
      handlePointerLeave,
    );

    for (const texture of createdTextures) gl.deleteTexture(texture);
    for (const framebuffer of createdFramebuffers) {
      gl.deleteFramebuffer(framebuffer);
    }
    for (const program of createdPrograms) gl.deleteProgram(program);
    if (vertexBuffer) gl.deleteBuffer(vertexBuffer);
  };
}

function StaticFallback() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-chalk px-6 text-center text-ink">
      <p className="font-display text-[clamp(44px,8.5vw,120px)] font-bold uppercase leading-[0.88] tracking-[-0.04em]">
        <span className="block">Green</span>
        <span className="block">Electronics</span>
      </p>
      <p className="mt-8 font-display text-technical-code font-bold uppercase tracking-[0.24em] text-ink/60">
        WebGL2 zaroori hai
      </p>
    </div>
  );
}

type FluidCursorRevealProps = {
  isActive?: boolean;
};

export function FluidCursorReveal({ isActive = true }: FluidCursorRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isActiveRef = useRef(isActive);
  const [isUnsupported, setIsUnsupported] = useState(false);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposeEngine: (() => void) | null = null;
    let isDisposed = false;

    const startEngine = () => {
      try {
        disposeEngine = createFluidEngine(canvas, { isActive: isActiveRef });
        if (!isDisposed) setIsUnsupported(false);
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Fluid cursor engine failed to initialise.", error);
        }
        if (!isDisposed) setIsUnsupported(true);
      }
    };

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      disposeEngine?.();
      disposeEngine = null;
    };

    const handleContextRestored = () => {
      startEngine();
    };

    canvas.addEventListener("webglcontextlost", handleContextLost);
    canvas.addEventListener("webglcontextrestored", handleContextRestored);
    startEngine();

    return () => {
      isDisposed = true;
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
      disposeEngine?.();
    };
  }, []);

  return (
    <>
      <canvas
        aria-hidden="true"
        className="absolute inset-0 h-full w-full select-none"
        onContextMenu={(event) => event.preventDefault()}
        ref={canvasRef}
      />
      {isUnsupported ? <StaticFallback /> : null}
    </>
  );
}
