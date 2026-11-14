"use client";

import { useEffect, useRef } from "react";
import { CircuitTraces } from "@/components/circuit-traces";

const INITIAL_PATH =
  "M 0.28,0.50 C 0.27,0.30 0.38,0.18 0.54,0.15 C 0.70,0.12 0.85,0.22 0.88,0.38 C 0.91,0.54 0.85,0.70 0.72,0.82 C 0.58,0.94 0.44,0.92 0.35,0.80 C 0.26,0.68 0.29,0.70 0.28,0.50 Z";

const POINT_COUNT = 12;

type HeroMarkProps = {
  tone: "ink" | "chalk";
  ariaHidden?: boolean;
};

function HeroMark({ tone, ariaHidden }: HeroMarkProps) {
  const isInk = tone === "ink";

  return (
    <div
      aria-hidden={ariaHidden || undefined}
      className="relative z-10 flex w-full max-w-6xl flex-col items-center justify-center px-4 text-center"
    >
      <h1
        className={`flex flex-col font-display text-[clamp(44px,8.5vw,120px)] font-bold uppercase leading-[0.88] tracking-[-0.04em] ${
          isInk ? "text-ink" : "text-chalk drop-shadow-md"
        }`}
      >
        <span>Green</span>
        <span>Electronics</span>
      </h1>
      <p
        className={`mt-8 font-display text-technical-code font-bold uppercase tracking-[0.24em] ${
          isInk ? "text-ink/70" : "text-chalk/90"
        }`}
      >
        [ Cursor hilayein ]
      </p>
    </div>
  );
}

export function LiquidReveal() {
  const stageRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const path = pathRef.current;
    if (!stage || !path) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      path.setAttribute("d", INITIAL_PATH);
      return;
    }

    let frame = 0;
    let started = false;
    let time = 0;
    let cx = 0.58;
    let cy = 0.48;
    let radius = 0.28;
    let targetX = 0.58;
    let targetY = 0.48;
    let targetRadius = 0.28;

    const points = Array.from({ length: POINT_COUNT }, (_, index) => ({
      angle: (index / POINT_COUNT) * Math.PI * 2,
      noiseOffset: Math.random() * 10,
      currentDist: 0.28,
    }));

    const updateTarget = (clientX: number, clientY: number) => {
      const rect = stage.getBoundingClientRect();
      targetX = Math.max(0.1, Math.min(0.9, (clientX - rect.left) / rect.width));
      targetY = Math.max(0.1, Math.min(0.9, (clientY - rect.top) / rect.height));
      targetRadius = 0.32;
    };

    const handlePointerMove = (event: PointerEvent) => {
      updateTarget(event.clientX, event.clientY);

      if (!started) {
        started = true;
        cx = targetX;
        cy = targetY;
        frame = requestAnimationFrame(render);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const render = () => {
      time += 0.024;

      // Spring interpolation toward the cursor
      cx += (targetX - cx) * 0.08;
      cy += (targetY - cy) * 0.08;
      radius += (targetRadius - radius) * 0.05;

      const polygon: { x: number; y: number }[] = [];

      for (let index = 0; index < POINT_COUNT; index++) {
        const point = points[index];
        const organicWave =
          Math.sin(time * 2.2 + point.noiseOffset) * 0.05 +
          Math.cos(time * 1.5 + point.angle * 2) * 0.035;
        const distance = Math.max(0.08, radius + organicWave);

        point.currentDist += (distance - point.currentDist) * 0.1;

        polygon.push({
          x: cx + Math.cos(point.angle) * point.currentDist,
          y: cy + Math.sin(point.angle) * point.currentDist * 1.1,
        });
      }

      // Convert the point ring into a smooth closed bezier path
      let d = `M ${polygon[0].x.toFixed(4)},${polygon[0].y.toFixed(4)} `;

      for (let index = 0; index < POINT_COUNT; index++) {
        const current = polygon[index];
        const next = polygon[(index + 1) % POINT_COUNT];
        const midX = ((current.x + next.x) / 2).toFixed(4);
        const midY = ((current.y + next.y) / 2).toFixed(4);

        d += `Q ${current.x.toFixed(4)},${current.y.toFixed(4)} ${midX},${midY} `;
      }

      path.setAttribute("d", `${d}Z`);
      frame = requestAnimationFrame(render);
    };

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <section
      ref={stageRef}
      aria-label="Green Electronics"
      className="relative h-[calc(100dvh-4rem)] min-h-[620px] w-full cursor-crosshair select-none overflow-hidden bg-chalk"
      id="interactive-reveal-stage"
    >
      {/* Object-bounding-box clip path driven by the fluid blob engine */}
      <svg aria-hidden="true" className="pointer-events-none absolute h-0 w-0">
        <defs>
          <clipPath id="liquid-reveal-clip" clipPathUnits="objectBoundingBox">
            <path d={INITIAL_PATH} id="fluid-blob-path" ref={pathRef} />
          </clipPath>
        </defs>
      </svg>

      {/* Layer A — off-white canvas with deep slate type */}
      <div className="pointer-events-none absolute inset-0 flex h-full w-full flex-col items-center justify-center bg-chalk">
        <CircuitTraces variant="base" />
        <HeroMark tone="ink" />
      </div>

      {/* Layer B — emerald liquid reveal with chalk type */}
      <div
        className="pointer-events-none absolute inset-0 z-10 h-full w-full"
        style={{
          clipPath: "url(#liquid-reveal-clip)",
          WebkitClipPath: "url(#liquid-reveal-clip)",
        }}
      >
        <div className="absolute inset-0 flex h-full w-full flex-col items-center justify-center bg-primary">
          <CircuitTraces variant="reveal" />
          <HeroMark ariaHidden tone="chalk" />
        </div>
      </div>

      {/* Top technical ledger */}
      <div className="pointer-events-none absolute inset-x-5 top-6 z-20 flex items-center justify-between gap-3 md:inset-x-12">
        <div className="hidden items-center gap-2 rounded border border-ink/10 bg-chalk/90 px-2.5 py-1.5 backdrop-blur-sm sm:flex">
          <span className="inline-block h-2 w-2 bg-primary" />
          <span className="whitespace-nowrap font-display text-technical-code font-bold uppercase tracking-widest text-ink">
            SYS_REF // GE-PK-01
          </span>
        </div>
        <div className="flex items-center gap-4 rounded border border-ink/10 bg-chalk/90 px-3 py-1.5 backdrop-blur-sm">
          <span className="hidden font-display text-technical-code font-medium uppercase text-muted md:inline">
            24.8607° N, 67.0011° E
          </span>
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap rounded bg-primary/10 px-1.5 py-0.5 font-display text-[10px] font-bold uppercase tracking-wider text-primary-dark">
              Ikayi 01 // Ibtida
            </span>
            <span className="whitespace-nowrap font-display text-technical-code font-bold uppercase tracking-wider text-primary-dark">
              Asal Khara Maal
            </span>
          </div>
        </div>
      </div>

      {/* Bottom technical ledger */}
      <div className="pointer-events-none absolute inset-x-5 bottom-6 z-20 flex flex-col items-start justify-between gap-2 md:inset-x-12 sm:flex-row sm:items-end">
        <div className="flex max-w-[18rem] flex-col gap-1 rounded border border-ink/10 bg-chalk/90 px-3 py-2 backdrop-blur-sm">
          <span className="font-display text-technical-code font-bold uppercase tracking-wider text-ink">
            Paiydar Funn // Bari Kamyabi
          </span>
          <span className="font-sans text-body-sm text-muted">
            Strict local hardware engineering. No compromise.
          </span>
        </div>
        <div className="hidden items-center gap-3 rounded border border-ink/10 bg-chalk/90 px-3 py-2 font-display text-technical-code uppercase text-muted backdrop-blur-sm sm:flex">
          <span className="hidden font-bold text-ink md:inline">
            State: Liquid Reveal // Active
          </span>
          <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
        </div>
      </div>
    </section>
  );
}
