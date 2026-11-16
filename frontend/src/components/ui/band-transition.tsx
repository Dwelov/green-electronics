"use client";

import { motion } from "motion/react";
import {
  type ReactNode,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

/**
 * Industrial band wipe used for discrete presentation jumps.
 *
 * Five bands stagger across the viewport, fully occlude the screen at the
 * midpoint (so the next section can be committed unseen), then unmask it.
 * Individual bands take `duration` seconds and the whole stagger offsets the
 * band starts by `stagger / bands` seconds each.
 */

const EASE: [number, number, number, number] = [0.77, 0, 0.175, 1];
const REDUCED_MOTION_DURATION = 0.1;

export interface BandTransitionProps {
  /** Fill colour of the bands. */
  color?: string;
  /** Number of bands in the wipe. */
  bands?: number;
  /** Duration of a single band in seconds. */
  duration?: number;
  /** Total inter-band offset in seconds. */
  stagger?: number;
  /** Drives the state machine: covering, midpoint, revealing, settled. */
  isTransitioning: boolean;
  /** Fires while the viewport is fully occluded. */
  onMidpoint?: () => void;
  /** Fires once the bands have fully cleared the viewport. */
  onComplete?: () => void;
  /** Horizontal lays vertical strips out left to right; vertical lays rows top to bottom. */
  direction?: "horizontal" | "vertical";
  children?: ReactNode;
}

type Phase = "idle" | "covering" | "revealing";

function toBandCount(bands: number): number {
  return Math.max(1, Math.floor(bands));
}

function toSeconds(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export function BandTransition({
  color = "#151515",
  bands = 5,
  duration = 0.4,
  stagger = 0.5,
  isTransitioning,
  onMidpoint,
  onComplete,
  direction = "horizontal",
  children,
}: BandTransitionProps) {
  const [isRevealing, setIsRevealing] = useState(false);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const onMidpointRef = useRef(onMidpoint);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onMidpointRef.current = onMidpoint;
  }, [onMidpoint]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!isTransitioning) {
      // Reset for the next cycle once the previous one has settled.
      const resetTimer = window.setTimeout(() => setIsRevealing(false), 0);
      return () => window.clearTimeout(resetTimer);
    }

    const bandCount = toBandCount(bands);
    const bandDuration = prefersReducedMotion
      ? REDUCED_MOTION_DURATION
      : toSeconds(duration);
    const step = prefersReducedMotion ? 0 : toSeconds(stagger) / bandCount;
    const coverDurationMs = (bandDuration + (bandCount - 1) * step) * 1000;

    let revealTimer: number | undefined;

    const midpointTimer = window.setTimeout(() => {
      onMidpointRef.current?.();
      setIsRevealing(true);

      revealTimer = window.setTimeout(() => {
        onCompleteRef.current?.();
      }, coverDurationMs);
    }, coverDurationMs);

    return () => {
      window.clearTimeout(midpointTimer);
      if (revealTimer !== undefined) window.clearTimeout(revealTimer);
    };
  }, [bands, duration, isTransitioning, prefersReducedMotion, stagger]);

  const phase: Phase = !isTransitioning
    ? "idle"
    : isRevealing
      ? "revealing"
      : "covering";
  const isIdle = phase === "idle";
  const isVertical = direction === "vertical";
  const bandCount = toBandCount(bands);
  const bandSize = 100 / bandCount;
  const step = toSeconds(stagger) / bandCount;

  const hiddenClassName = isIdle ? "invisible" : "visible";

  if (prefersReducedMotion) {
    return (
      <>
        {children}
        <div
          aria-hidden="true"
          className={`pointer-events-none fixed inset-0 z-50 h-[100dvh] w-full overflow-hidden ${hiddenClassName}`}
          data-band-transition={phase}
        >
          <motion.div
            className="h-full w-full"
            initial={false}
            animate={{ opacity: phase === "covering" ? 1 : 0 }}
            style={{ backgroundColor: color }}
            transition={{ duration: REDUCED_MOTION_DURATION, ease: "linear" }}
          />
        </div>
      </>
    );
  }

  return (
    <>
      {children}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 z-50 h-[100dvh] w-full overflow-hidden ${hiddenClassName}`}
        data-band-transition={phase}
      >
        {Array.from({ length: bandCount }, (_, index) => (
          <motion.span
            key={index}
            className={
              isVertical
                ? "absolute -left-px -right-px block"
                : "absolute -top-px -bottom-px block"
            }
            initial={false}
            animate={phase}
            style={{
              backgroundColor: color,
              ...(isVertical
                ? {
                    top: `${index * bandSize}%`,
                    height: `calc(${bandSize}% + 1px)`,
                  }
                : {
                    left: `${index * bandSize}%`,
                    width: `calc(${bandSize}% + 1px)`,
                  }),
            }}
            transition={
              isIdle
                ? { duration: 0 }
                : {
                    duration: toSeconds(duration),
                    ease: EASE,
                    delay: index * step,
                  }
            }
            variants={{
              idle: isVertical ? { x: "-100%" } : { y: "-100%" },
              covering: isVertical ? { x: "0%" } : { y: "0%" },
              revealing: isVertical ? { x: "100%" } : { y: "100%" },
            }}
          />
        ))}
      </div>
    </>
  );
}
