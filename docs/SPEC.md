# Green Electronics — Technical Specification (SPEC.md)

**Document Reference:** `GE-SPEC-2024-V2`  
**Version:** 2.0.0  
**Status:** Approved for Implementation  
**Target Environment:** Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS 4, TypeScript 5, WebGL2  
**Branding Core:** "Genuine Hardware & Engineering" // "Enduring Engineering" — Karachi Hardware & Electronics Engineering  

---

## 1. Executive Summary & Architectural Vision

Green Electronics is an engineering-first electronics brand originating from Al-Karam Electronics Market, Saddar, Karachi. The web platform embodies the brand's identity: rugged, authentic, high-reliability engineering contrasted with modern high-performance digital craft.

The application architecture combines:
1. **Bulletproof Process Lifecycle Management (`./start.sh`)**: An automated startup and sanitation controller that manages environment integrity, port collision resolution, cache cleanup, and signal handling (including `Ctrl+C`, `Ctrl+Z`, and unexpected terminates).
2. **High-Fidelity WebGL2 Eulerian Fluid Simulation Engine**: A full Navier-Stokes GPU-accelerated fluid dynamic cursor reveal effect that peels back an Off-White (`#F8FAFC`) slate base layer to reveal an Emerald (`#059669`) core layer with procedural circuit traces and Space Grotesk typography.
3. **Continuous Full-Page Viewport & Gesture Navigation Engine**: Seamless multi-section navigation replacing discrete click-only pagination with inertia-aware wheel, touch swipe, and keyboard gestures.
4. **Nested Scroll Arbitration & Deep Route Synchronization**: Intelligent boundary detection allowing tall internal page sections (e.g., the Contact section) to scroll naturally while maintaining bidirectional URL route synchronization and browser history fidelity.

---

## 2. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             ./start.sh (Root)                               │
│  - Port 3000 collision detection & cleanup (fuser/lsof)                      │
│  - Stale Turbopack/.next cache purging                                      │
│  - Signal trapping (SIGINT / SIGTSTP / EXIT) with process-group teardown   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Launches
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Next.js 16 / React 19 Presentation                     │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                    Full-Page Scroll Orchestrator                      │  │
│  │  - Gesture Recognizer (Wheel, Touch Swipe, Keyboard)                  │  │
│  │  - Scroll Debounce & Physics Lockout (750ms cooldown)                 │  │
│  │  - Nested Scroll Boundary Arbiter (Contact internal scroll protection)│  │
│  │  - History/Route Syncer (/, /pehchan, /rabta via replaceState)        │  │
│  └───────────────────────────────────┬───────────────────────────────────┘  │
│                                      │                                      │
│     ┌────────────────────────────────┼────────────────────────────────┐     │
│     ▼                                ▼                                ▼     │
│ ┌──────────────────────┐   ┌──────────────────────┐   ┌───────────────────┐ │
│ │ Sec 01: Home         │   │ Sec 02: Identity     │   │ Sec 03: Contact   │ │
│ │                      │   │                      │   │                   │ │
│ │ WebGL2 Fluid Engine  │   │ Editorial Identity   │   │ Direct Dispatch   │ │
│ │ - Navier-Stokes      │   │ - 3 Core Principles  │   │ - WhatsApp Hook   │ │
│ │ - Ping-Pong FBOs     │   │ - Industrial Layout  │   │ - Call Action     │ │
│ │ - Dual Canvas Layers │   │ - Asymmetrical Grid  │   │ - Store Map       │ │
│ └──────────────────────┘   └──────────────────────┘   └───────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Detailed Feature Specifications

### Feature 1: Lifecycle & Environment Sanitation Controller (`./start.sh`)

#### 1.1 Problem Statement
Developers and operators encounter recurrent runtime issues:
- Ports (default `3000`) remain bound by orphaned `node` or `turbopack` processes when terminals are closed or when processes are suspended via `Ctrl+Z` (`SIGTSTP`).
- Stale `.next` caches cause hydration mismatches, un-rebuilt styles, or Turbopack chunk corruption.
- Abrupt process terminations leave dangling temporary files and orphaned subshells.

#### 1.2 Functional Requirements (FR)
- **FR-1.1 (Root Execution):** The script MUST be executable from the project root as `./start.sh` or `bash start.sh` with POSIX/Bash compatibility.
- **FR-1.2 (Port Sanitation):** Before launching, the script MUST scan port `3000` (and optionally port `3001` if configured). If occupied, it MUST identify the PID using `lsof -ti :<PORT>` or `fuser <PORT>/tcp` and issue a graceful `SIGTERM` (`kill -15`), followed by a verified `SIGKILL` (`kill -9`) if the process fails to exit within 1.5 seconds.
- **FR-1.3 (Cache Sanitation):**
  - Delete `.next/cache` and stale Turbopack lockfiles prior to startup.
  - Support an optional `--clean` or `-c` flag to execute a deep purge of `.next` and `node_modules/.cache`.
- **FR-1.4 (Signal Trapping & Process Group Cleanup):**
  - The script MUST trap `SIGINT` (Ctrl+C), `SIGTSTP` (Ctrl+Z), `SIGTERM`, `SIGHUP`, and shell `EXIT`.
  - **Handling `Ctrl+Z` (`SIGTSTP`):** In standard UNIX shells, `Ctrl+Z` suspends the process group and places it in the background, leaving port 3000 held hostage. The script MUST intercept `SIGTSTP`, initiate the termination routine, kill child processes, release all ports, and exit cleanly to the command line.
- **FR-1.5 (Dependency Verification):** Validate that `node` (>= 18.18) and `npm` are installed and that `frontend/node_modules` exists. If `node_modules` is absent, automatically offer or trigger `npm install`.
- **FR-1.6 (Terminal Feedback):** Print branded, colorized status diagnostics:
  - Cyan: Information & checks (`[GE-SYS] Checking environment...`)
  - Emerald Green: Active status & URL (`[GE-RUN] Serving at http://localhost:3000`)
  - Amber/Yellow: Warnings & cleanup actions (`[GE-WARN] Releasing port 3000...`)
  - Red: Critical failures.

---

### Feature 2: High-Performance Eulerian WebGL2 Fluid Simulation Cursor Reveal Engine

#### 2.1 Problem Statement & Background
The current implementation in `frontend/src/components/liquid-reveal.tsx` utilizes an SVG `<clipPath>` blob polygon driven by 12 points and simple trigonometric sine waves. This lacks the fluidity, physical advection, organic vorticity, and fluid displacement present in the original prototype.

The original prototype (embedded below) implements a 2D Eulerian Navier-Stokes fluid dynamics engine rendered in WebGL2 with floating-point textures, Jacobi pressure iterations, and semi-Lagrangian advection, blending two offscreen 2D canvas textures (Off-White base and Emerald reveal).

#### 2.2 Original Prototype Specification (Reference Code)
The implementation MUST strictly adhere to the behavior, physics, and rendering fidelity of the following original reference implementation:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Green Electronics</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet">
<style>
:root{--g:#059669;--o:#F8FAFC;--s:#0F172A}
html,body{margin:0;height:100%;overflow:hidden;background:var(--o);touch-action:none}
canvas{position:fixed;inset:0;width:100%;height:100%;display:block}
.r{position:fixed;z-index:2;top:20px;right:24px;padding:6px 8px;font:600 12px Inter,sans-serif;letter-spacing:.14em;color:transparent;text-decoration:none;text-transform:uppercase}
</style>
</head>
<body>
<canvas id="c"></canvas>
<a class="r" href="#rabta">Contact</a>
<script>
const cv=document.getElementById('c'),gl=cv.getContext('webgl2',{antialias:false});
if(!gl||!(gl.getExtension('EXT_color_buffer_float')||gl.getExtension('EXT_color_buffer_half_float'))){document.body.textContent='WebGL2 chahiye.'}
else{
const S=128,DY=768,R=.001;
const VS='#version 300 es\nlayout(location=0) in vec2 pos;out vec2 v,vL,vR,vT,vB;uniform vec2 ts;void main(){v=pos*.5+.5;vL=v-vec2(ts.x,0);vR=v+vec2(ts.x,0);vT=v+vec2(0,ts.y);vB=v-vec2(0,ts.y);gl_Position=vec4(pos,0,1);}';
const H='#version 300 es\nprecision highp float;in vec2 v,vL,vR,vT,vB;out vec4 o;uniform vec2 ts;';
const FS={
splat:'uniform sampler2D t;uniform vec2 pt;uniform float ar,r;uniform vec3 c;void main(){vec2 p=v-pt;p.x*=ar;o=vec4(texture(t,v).xyz+exp(-dot(p,p)/r)*c,1);}',
adv:'uniform sampler2D u,s;uniform float dt,dis;void main(){o=dis*texture(s,v-dt*texture(u,v).xy*ts);o.a=1.;}',
curl:'uniform sampler2D u;void main(){o=vec4(.5*(texture(u,vR).y-texture(u,vL).y-texture(u,vT).x+texture(u,vB).x),0,0,1);}',
vort:'uniform sampler2D u,k;uniform float cu,dt;void main(){float L=texture(k,vL).x,R=texture(k,vR).x,T=texture(k,vT).x,B=texture(k,vB).x,C=texture(k,v).x;vec2 f=.5*vec2(abs(T)-abs(B),abs(R)-abs(L));f/=length(f)+1e-4;f*=cu*C;f.y*=-1.;o=vec4(texture(u,v).xy+f*dt,0,1);}',
div:'uniform sampler2D u;void main(){float L=texture(u,vL).x,R=texture(u,vR).x,T=texture(u,vT).y,B=texture(u,vB).y;vec2 C=texture(u,v).xy;if(vL.x<0.)L=-C.x;if(vR.x>1.)R=-C.x;if(vT.y>1.)T=-C.y;if(vB.y<0.)B=-C.y;o=vec4(.5*(R-L+T-B),0,0,1);}',
clr:'uniform sampler2D t;uniform float val;void main(){o=val*texture(t,v);}',
prs:'uniform sampler2D p,d;void main(){o=vec4((texture(p,vL).x+texture(p,vR).x+texture(p,vB).x+texture(p,vT).x-texture(d,v).x)*.25,0,0,1);}',
grad:'uniform sampler2D p,u;void main(){o=vec4(texture(u,v).xy-vec2(texture(p,vR).x-texture(p,vL).x,texture(p,vT).x-texture(p,vB).x),0,1);}',
show:'uniform sampler2D f,a,b;void main(){vec4 fl=texture(f,v);vec2 d=clamp(fl.rg*.00025,-.05,.05);vec2 uv=v-d;float m=smoothstep(.3,.42,fl.b);o=mix(texture(a,uv),texture(b,uv),m);o.a=1.;}'
};
const P={};
for(const k in FS){const p=gl.createProgram();[[gl.VERTEX_SHADER,VS],[gl.FRAGMENT_SHADER,H+FS[k]]].forEach(([t,s])=>{const h=gl.createShader(t);gl.shaderSource(h,s);gl.compileShader(h);gl.attachShader(p,h)});gl.linkProgram(p);P[k]=p}
gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());
gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);

const tex=()=>{const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);
[[gl.TEXTURE_MIN_FILTER,gl.LINEAR],[gl.TEXTURE_MAG_FILTER,gl.LINEAR],[gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE],[gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE]].forEach(([a,b])=>gl.texParameteri(gl.TEXTURE_2D,a,b));return t};
const mk=(w,h)=>{const t=tex();gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA16F,w,h,0,gl.RGBA,gl.HALF_FLOAT,null);
const fb=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,fb);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,t,0);return{t,fb,w,h}};
const dbl=(w,h)=>{const o={r:mk(w,h),w:mk(w,h),s(){[o.r,o.w]=[o.w,o.r]}};return o};
const V=dbl(S,S),D=dbl(DY,DY),Pr=dbl(S,S),C=mk(S,S),Dv=mk(S,S);
const A={t:tex()},B={t:tex()};

function run(p,tg,u){
  gl.useProgram(p);let n=0;
  for(const k in u){const l=gl.getUniformLocation(p,k),x=u[k];
    if(x.t){gl.activeTexture(gl.TEXTURE0+n);gl.bindTexture(gl.TEXTURE_2D,x.t);gl.uniform1i(l,n++)}
    else if(x.length==2)gl.uniform2f(l,...x);
    else if(x.length==3)gl.uniform3f(l,...x);
    else gl.uniform1f(l,x)}
  gl.uniform2f(gl.getUniformLocation(p,'ts'),1/S,1/S);
  gl.bindFramebuffer(gl.FRAMEBUFFER,tg?tg.fb:null);
  gl.viewport(0,0,tg?tg.w:cv.width,tg?tg.h:cv.height);
  gl.drawArrays(gl.TRIANGLES,0,3);
}

/* the two layers: Off-White base and Emerald reveal, drawn once on 2D canvases */
function paint(tx,bg,fg,ln,W,H){
  const c=document.createElement('canvas');c.width=W;c.height=H;
  const x=c.getContext('2d'),k=W/innerWidth;let s=7;const rnd=()=>(s=s*16807%2147483647)/2147483647;
  x.fillStyle=bg;x.fillRect(0,0,W,H);
  x.strokeStyle=x.fillStyle=ln;x.lineWidth=1.2*k;const g=56*k;
  for(let i=0;i<80;i++){
    let px=Math.floor(rnd()*W/g)*g,py=Math.floor(rnd()*H/g)*g,d=rnd()<.5?0:1;
    x.beginPath();x.moveTo(px,py);
    for(let j=0;j<5;j++){const L=(1+Math.floor(rnd()*3))*g*(rnd()<.5?-1:1);if(d)py+=L;else px+=L;x.lineTo(px,py);d^=1}
    x.stroke();x.beginPath();x.arc(px,py,3.5*k,0,7);x.fill();
  }
  x.fillStyle=fg;x.textBaseline='middle';
  const fs=Math.min(W*.82/6.8,H*.28);
  x.font='700 '+fs+'px "Space Grotesk",Inter,sans-serif';x.textAlign='center';
  if('letterSpacing' in x)x.letterSpacing=(-.04*fs)+'px';
  x.fillText('GREEN',W/2,H/2-fs*.48);x.fillText('ELECTRONICS',W/2,H/2+fs*.48);
  x.font='600 '+12*k+'px Inter,sans-serif';
  if('letterSpacing' in x)x.letterSpacing=(.14*12*k)+'px';
  x.textAlign='left';x.fillRect(32*k,28*k,16*k,16*k);x.fillText('GE',56*k,37*k);
  x.textAlign='right';x.fillText('CONTACT',W-32*k,37*k);
  x.textAlign='center';x.fillText('MOVE CURSOR TO EXPLORE',W/2,H-40*k);
  gl.bindTexture(gl.TEXTURE_2D,tx.t);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,c);
}
function build(){
  const d=Math.min(devicePixelRatio||1,2);cv.width=innerWidth*d;cv.height=innerHeight*d;
  paint(A,'#F8FAFC','#0F172A','rgba(15,23,42,.10)',cv.width,cv.height);
  paint(B,'#059669','#F8FAFC','rgba(248,250,252,.28)',cv.width,cv.height);
}
addEventListener('resize',build);
Promise.all([document.fonts.load('700 64px "Space Grotesk"'),document.fonts.load('600 12px Inter')]).then(build,build);
build();

/* pointer input: each move becomes a splat of velocity + dye */
const sp=[];let lx=null,ly=0,touched=0;
function mv(x,y){
  if(lx!=null&&(x!=lx||y!=ly))sp.push({x:x/innerWidth,y:1-y/innerHeight,dx:(x-lx)*5,dy:-(y-ly)*5});
  lx=x;ly=y;
}
addEventListener('pointermove',e=>{if(!touched){touched=1;lx=null}mv(e.clientX,e.clientY)});
document.documentElement.addEventListener('pointerleave',()=>{touched=0});
const t0=performance.now();

function frame(){
  requestAnimationFrame(frame);
  const q=(performance.now()-t0)/1000;
  if(!touched&&q<3)mv(innerWidth*(.2+.6*q/3),innerHeight*(.5+.14*Math.sin(q*4)));
  if(touched&&lx!=null&&!sp.length)sp.push({x:lx/innerWidth,y:1-ly/innerHeight,dx:Math.sin(q*7)*6,dy:Math.cos(q*6)*6,w:.04});
  for(const s of sp.splice(0)){
    const c=[s.dx,s.dy,s.w||1],ar=cv.width/cv.height,pt=[s.x,s.y];
    run(P.splat,V.w,{t:V.r,pt,ar,r:R,c});V.s();
    run(P.splat,D.w,{t:D.r,pt,ar,r:R,c});D.s();
  }
  run(P.curl,C,{u:V.r});
  run(P.vort,V.w,{u:V.r,k:C,cu:20,dt:.016});V.s();
  run(P.div,Dv,{u:V.r});
  run(P.clr,Pr.w,{t:Pr.r,val:.8});Pr.s();
  for(let i=0;i<10;i++){run(P.prs,Pr.w,{p:Pr.r,d:Dv});Pr.s()}
  run(P.grad,V.w,{p:Pr.r,u:V.r});V.s();
  run(P.adv,V.w,{u:V.r,s:V.r,dt:.016,dis:.98});V.s();
  run(P.adv,D.w,{u:V.r,s:D.r,dt:.016,dis:.975});D.s();
  run(P.show,null,{f:D.r,a:A,b:B});
}
frame();
}
</script>
</body>
</html>
```

#### 2.3 Mathematical & Computational Pipeline
The simulation solves the Navier-Stokes equations for incompressible fluid flow in two dimensions:

$$\frac{\partial \mathbf{u}}{\partial t} = -(\mathbf{u} \cdot \nabla)\mathbf{u} - \frac{1}{\rho}\nabla p + \nu \nabla^2 \mathbf{u} + \mathbf{f}$$

$$\nabla \cdot \mathbf{u} = 0$$

1. **Advection (`adv`):**
   Semi-Lagrangian transport step. For each cell $\mathbf{x}$, backtrace position along velocity field: $\mathbf{x}_{\text{prev}} = \mathbf{x} - \Delta t \cdot \mathbf{u}(\mathbf{x})$. Sample quantities via bilinear texture filtering. Velocity dissipation $\text{dis} = 0.98$, Dye dissipation $\text{dis} = 0.975$.
2. **Impulse Splatting (`splat`):**
   Add external Gaussian force $\mathbf{f}$ at pointer coordinates $\mathbf{p}_t = (x_t, y_t)$ with radius $R = 0.001$:
   $$I(\mathbf{x}) = \exp\left(-\frac{\|\mathbf{x} - \mathbf{p}_t\|^2}{R}\right) \cdot \mathbf{c}$$
   Where $\mathbf{c} = (\Delta x \cdot 5, -\Delta y \cdot 5, w)$.
3. **Vorticity Confinement (`curl` and `vort`):**
   Counteracts numerical dissipation to sustain turbulent swirls.
   $$\omega = \nabla \times \mathbf{u} = \frac{\partial u_y}{\partial x} - \frac{\partial u_x}{\partial y}$$
   $$\mathbf{f}_{\text{vort}} = c_u \cdot \left(\frac{\nabla |\omega|}{\|\nabla |\omega\| + \epsilon} \times \omega\right) \Delta t$$
   With $c_u = 20.0, \Delta t = 0.016$.
4. **Divergence Computation (`div`):**
   Calculates fluid expansion rate on grid edges with no-slip boundary conditions:
   $$\nabla \cdot \mathbf{u} = \frac{1}{2}\left(u_{x}(x+1) - u_{x}(x-1) + u_{y}(y+1) - u_{y}(y-1)\right)$$
5. **Poisson Pressure Solver (`prs` & `clr`):**
   Jacobi iteration solving $\nabla^2 p = \nabla \cdot \mathbf{u}$. Pressure is damped initially by $0.8$ (`clr`), followed by 10 Jacobi relaxation steps:
   $$p^{(k+1)}(x,y) = \frac{1}{4}\left(p^{(k)}(x+1,y) + p^{(k)}(x-1,y) + p^{(k)}(x,y+1) + p^{(k)}(x,y-1) - (\nabla \cdot \mathbf{u})(x,y)\right)$$
6. **Velocity Projection / Gradient Subtraction (`grad`):**
   Enforces divergence-free incompressibility ($\nabla \cdot \mathbf{u} = 0$):
   $$\mathbf{u}_{\text{projected}} = \mathbf{u} - \nabla p$$
7. **Composite Blending & Optical Distortion (`show`):**
   The fluid velocity and dye field drive optical refraction and smoothstep masking:
   $$\mathbf{d} = \text{clamp}(\mathbf{fl}_{rg} \times 0.00025, -0.05, 0.05)$$
   $$\mathbf{uv} = \mathbf{v} - \mathbf{d}$$
   $$m = \text{smoothstep}(0.30, 0.42, \mathbf{fl}_b)$$
   $$C_{\text{final}} = \text{mix}(\text{LayerA}(\mathbf{uv}), \text{LayerB}(\mathbf{uv}), m)$$

#### 2.4 Dynamic Layer Rasterization Specifications
- **Layer A (Base):** Background `#F8FAFC` (Chalk), Foreground `#0F172A` (Deep Ink), Traces `rgba(15,23,42,0.10)`.
- **Layer B (Reveal):** Background `#059669` (Emerald Primary), Foreground `#F8FAFC` (Chalk), Traces `rgba(248,250,252,0.28)`.
- **Procedural PCB Circuit Traces:** Linear Congruential Generator ($s_{n+1} = (s_n \cdot 16807) \pmod{2147483647}$ with seed $s_0 = 7$). Renders 80 multi-segment traces snapped to grid $g = 56 \times k$ with terminal pads of radius $3.5 \times k$.
- **Typography & Font Readiness:** Space Grotesk 700 ("GREEN", "ELECTRONICS") and Inter 600 ("GE", "CONTACT", "MOVE CURSOR TO EXPLORE"). Layers MUST NOT be drawn until `document.fonts.load` confirms availability to prevent FOUT (Flash of Unstyled Text).

#### 2.5 React 19 & Next.js Lifecycle Requirements
- **FR-2.1 (Component Encapsulation):** Encapsulated into `@/components/fluid-cursor-reveal.tsx` (client component `"use client"`).
- **FR-2.2 (Resource Disposal):** On unmount, cancel RAF, detach window/pointer listeners, and free WebGL resources (`gl.deleteTexture`, `gl.deleteFramebuffer`, `gl.deleteProgram`, `gl.deleteBuffer`).
- **FR-2.3 (Context Loss Handling):** Add listeners for `webglcontextlost` (`e.preventDefault()`) and `webglcontextrestored` to reconstruct framebuffers and shaders gracefully without app crashes.
- **FR-2.4 (Performance & DPR Capping):** Device pixel ratio capped at `Math.min(window.devicePixelRatio || 1, 2)` to protect high-DPI displays from GPU fill-rate exhaustion.
- **FR-2.5 (Reduced Motion Fallback):** Check `window.matchMedia('(prefers-reduced-motion: reduce)')`. If reduced motion is requested, render static Layer A with clean accessible layout and disable continuous frame loop.

---

### Feature 3: Full-Page Wheel & Touch Scroll Navigation System

#### 3.1 Problem Statement
Currently, visitors are forced to click top-bar navigation links (`Home // 01`, `Identity // 02`, `Contact // 03`) to view each page. The user requires a continuous presentation where scrolling down moves directly to the next section and scrolling up returns to the previous section, creating a tactile editorial narrative.

#### 3.2 Navigation Architecture
The application transitions from discrete, disjoint route loading to a **Unified Presentation Viewport**:
- The homepage (`/`) contains all three primary sections in contiguous order:
  - **Section 01: Home** (Hero with WebGL2 Fluid Simulation & Cursor Reveal)
  - **Section 02: Identity** (Brand Identity, "Clean power, intelligent systems", 3 Core Principles)
  - **Section 03: Contact** (Store map directions, direct WhatsApp & phone actions)
- Each section occupies full viewport height (`100dvh` / `h-screen`).
- The transition between sections is driven by hardware-accelerated transforms:
  $$\mathbf{Y}_{\text{offset}} = -(\text{currentSectionIndex} \times 100)\,\%$$
  Transition timing: `750ms cubic-bezier(0.65, 0, 0.35, 1)`.

#### 3.3 Gesture & Input Recognition Matrix

| Input Modality | Event Signature | Threshold / Trigger Condition | Action |
|---|---|---|---|
| **Mouse Wheel / Trackpad** | `wheel` | Accumulated $\|\Delta Y\| \ge 40\text{px}$ in one direction | If not locked, trigger transition |
| **Touch Swipe** | `touchstart`, `touchmove`, `touchend` | Swipe displacement $\|\Delta Y\| \ge 50\text{px}$ or velocity $> 0.3\,\text{px/ms}$ | Trigger transition |
| **Keyboard** | `keydown` | `ArrowDown`, `PageDown`, `Space` | Next section |
| **Keyboard** | `keydown` | `ArrowUp`, `PageUp`, `Shift + Space` | Previous section |
| **Keyboard** | `keydown` | `Home` | Jump to Section 01 |
| **Keyboard** | `keydown` | `End` | Jump to Section 03 |

#### 3.4 Kinetic Lockout & Momentum Debouncing
Trackpad and inertia-wheel users produce hundreds of wheel events per stroke.
- **Kinetic Lockout:** When a section transition is initiated, a global transition lock (`isTransitioning = true`) is engaged for `800ms`.
- Subsequent wheel events during this period are absorbed and discarded.
- An idle reset timer (minimum `150ms` of zero delta) confirms physical gesture cessation before the lock is released.

---

### Feature 4: Viewport Arbitration, Nested Scrolling & Route Synchronization

#### 4.1 Nested Scroll Arbitration (Internal Section Overflow)
Section 03 (`Contact`, route `/rabta`) is deliberately reduced to two high-impact elements — a tappable store-map card and a pair of circular contact buttons — so it fits a full viewport on most screens. The arbiter remains as a safeguard for short or rotated viewports where the map's minimum height still overflows.
- **Arbitration Logic:**
  - When the user is on a section that has internal overflow (`scrollHeight > clientHeight`):
    - **Scrolling Down:** If `scrollTop + clientHeight < scrollHeight - 2`, the event MUST scroll the internal content downwards. The section transition to next section (or rubber-band bounce if on last section) is BLOCKED until internal scroll hits the bottom.
    - **Scrolling Up:** If `scrollTop > 2`, the event MUST scroll the internal content upwards. Transition to Section 02 (`Identity`) is BLOCKED until `scrollTop <= 2`.
  - This guarantees the entire map card and both circular contact actions remain reachable on constrained screens without accidental page switches.

#### 4.2 Deep Route & History Synchronization
- **Bidirectional Sync:**
  - As sections change (e.g. from Section 1 to Section 2), the URL updates to `/pehchan` (or hash `#pehchan`) via `window.history.replaceState` or Next.js shallow routing without reloading the page or tearing down WebGL2 context.
  - Section 01: `/` (or `/#ibtida`)
  - Section 02: `/pehchan` (or `/#pehchan`)
  - Section 03: `/rabta` (or `/#rabta`)
- **Direct Link Handling:** Direct navigation to `http://localhost:3000/pehchan` or `http://localhost:3000/rabta` boots the app and immediately positions the viewport at the target section without jarring animation jumps.
- **Browser History Integration:** The `popstate` event listener is hooked into the presentation orchestrator. Clicking the browser's Back button smoothly animates back to the preceding section.

#### 4.3 Visual Pagination HUD & Header Synchronization
- **Floating Pagination Ledger:** Fixed right-side indicator displaying active section notation:
  - `01 // HOME`
  - `02 // IDENTITY`
  - `03 // CONTACT`
  - Interactive clickable dots allowing users to jump directly to any section.
- **Header Navigation Bar Sync:** The top `SiteHeader` highlights the active item (`Home // 01`, `Identity // 02`, `Contact // 03`) according to the active section in real-time.
- **Mobile Responsive Safeguards:**
  - Viewports measured using dynamic viewport height (`100dvh`) to account for mobile browser address bars.
  - If screen height is below `560px` (landscape phones), enable standard natural vertical document scrolling to prevent layout clipping.

#### 4.4 Contact Surface (Two-Element Composition)
Section 03 is a strict two-element surface. All legacy content — contact form, shop dossier, email terminal, opening-hours ledger, and technical footprint grid — is removed from the view.

1. **Store Map Button Card**
   - Coordinates: `32°19'39.8"N 74°20'59.7"E` (`32.327722, 74.349917`) — Model Town, Daska.
   - The entire card is an `<a>` to `https://www.google.com/maps/dir/?api=1&destination=32.327722,74.349917`, opened in a new tab with `rel="noopener noreferrer"`.
   - Directions mode is pre-selected so mobile opens the Google Maps app with turn-by-turn navigation armed.
   - Visual layer: dark night-map with city-block grid, arterial roads, contour lines, canal, area labels, coordinate crosshair, pulsating radar rings, and an emerald store pin. Hover/focus reveals the prompt `Get Directions // Open Google Maps`.
   - The coordinates badge and `Model Town, Daska` store label stay visible at all times.
2. **Direct Contact Actions (Circular Buttons)**
   - WhatsApp: `https://wa.me/923000841013` — a 64px (`h-16 w-16`) emerald (`bg-primary`) circular button (`rounded-full`) with a centered WhatsApp glyph, hover scale, and the caption `WhatsApp`.
   - Local call: `tel:03000841013` — a matching 64px chalk-on-ink circular button with a centered phone glyph, hover scale, and the caption `Call Us`.
   - The phone number is never rendered as visible text or exposed in button labels/metadata; both buttons are one-tap anchors with no intermediate form or confirmation step.

Responsive contract: the map uses `clamp(300px, 42vh, 440px)` height and the circular contact cluster remains horizontally centered within the section footer, with no horizontal overflow at 390×844, 1366×768, or 1920×1080.

---

## 4. Verification & Testing Requirements

1. **Automation & Shell Sanitation Verification:**
   - Test `./start.sh` with port 3000 occupied by dummy listener (`nc -l 3000` or `python3 -m http.server 3000`). Confirm port is cleared and Next.js starts cleanly.
   - Send `SIGINT` (Ctrl+C) and `SIGTSTP` (Ctrl+Z). Confirm zero orphaned node processes and port 3000 is open.
2. **WebGL2 Graphics & Shader Pipeline Verification:**
   - Validate WebGL2 context creation and extension availability (`EXT_color_buffer_float` / `EXT_color_buffer_half_float`).
   - Validate 60fps frame rate during cursor movement and idle sinusoidal sweep.
   - Test unmount memory footprint (no leaked textures or WebGL programs).
3. **Scroll & Gesture Navigation Verification:**
   - Single trackpad flick advances exactly one section (no multi-section skip).
   - Touch drag upwards $>50\text{px}$ advances to next section; touch drag downwards $>50\text{px}$ returns to previous section.
   - Arrow keys (`ArrowDown`, `ArrowUp`) step smoothly between sections.
4. **Nested Content & Route Sync Verification:**
   - On Section 03 (`Contact`), internal content scrolls fully before allowing upward exit on constrained viewports.
   - Map card opens Google Maps Directions with destination `32.327722,74.349917`; WhatsApp opens `wa.me/923000841013`; call button dials `tel:03000841013`.
   - Browser URL updates to match active section; browser Back/Forward buttons navigate smoothly between sections.
5. **Band Transition Verification:**
   - 5 bands render in sequence with color `#151515`, duration 0.6s, stagger 0.5s.
   - View/section swaps cleanly at occlusion midpoint with zero visual artifacting.

---

## 5. Feature 5: Atelier UI Band Transition Page Transition Engine

### 5.1 Problem Statement & Aesthetic Intent
While continuous wheel scrolling smoothly translates the presentation slider, direct jumps between sections (via the navigation header links, pagination HUD dots, or direct route navigation) require a high-impact, editorial visual bridge. 

To provide a distinct, tactile transition inspired by Atelier UI, the application incorporates a cinematic **Band Transition**. The transition slices the viewport into staggered industrial dark bands (`#151515`) that wipe across the screen in sequence, conceal the viewport while the active view or route updates, and then wipe out in a staggered choreography to reveal the target section.

### 5.2 Component Configuration & Props Specification
The component strictly implements the Atelier UI specification with the required parameters:
- **`color`**: `"#151515"` (Deep industrial graphite/slate matching Green Electronics branding)
- **`bands`**: `5` (Five parallel horizontal or vertical bands spanning the viewport)
- **`duration`**: `0.6` (Each individual band wipe duration: 0.6 seconds)
- **`stagger`**: `0.5` (Total stagger offset across the 5 bands, giving a 0.1s inter-band delay)

```tsx
<BandTransition
  color="#151515"
  bands={5}
  duration={0.6}
  stagger={0.5}
  isTransitioning={isTransitioning}
  onTransitionComplete={handleTransitionComplete}
>
  {children}
</BandTransition>
```

### 5.3 CLI & Component Integration Flow
- **CLI Dependency Management**:
  - Check for `frontend/components.json`. If missing, initialize via:
    `npx shadcn@latest init -d`
  - Add the Atelier component via:
    `npx shadcn@latest add @atelier/band-transition`
  - Skill files written to `.agents/skills` and `.claude/skills` are respected and followed by the agent harness.
- **Architectural Integration**:
  - The `BandTransition` overlay is placed at the top layer (`z-50`) of the application layout / presentation orchestrator.
  - When a direct navigation occurs (e.g. clicking `SiteHeader` nav items or `PaginationHUD` indicators), the band transition sequence is triggered:
    1. **Enter Phase (Wipe In)**: 5 bands expand across the screen with staggered delay $t_i = i \times (\text{stagger} / \text{bands})$ over $0.6\,\text{s}$ using cubic easing `cubic-bezier(0.77, 0, 0.175, 1)`.
    2. **Midpoint Swap**: Once the bands completely occlude the viewport, `activeIndex` or route state commits instantaneously.
    3. **Exit Phase (Wipe Out)**: Bands retract or slide out in the same staggered sequence, smoothly unveiling the target section.
  - **Fluid Shader Safety**: The WebGL2 canvas in Section 01 remains undisturbed; no canvas re-allocation or WebGL context recreation is triggered during the band wipe.
  - **Accessibility**: Honors `prefers-reduced-motion` by disabling the staggered wipe and falling back to an instant or simple 150ms opacity crossfade.
