"use client";

import { FluidCursorReveal } from "@/components/fluid-cursor-reveal";

type LiquidRevealProps = {
  isActive?: boolean;
};

/**
 * Section 01 backdrop. The SVG clip-path prototype was replaced by the WebGL2
 * Eulerian fluid engine; this wrapper keeps the public component contract while
 * delegating rendering to `FluidCursorReveal`.
 */
export function LiquidReveal({ isActive = true }: LiquidRevealProps) {
  return <FluidCursorReveal isActive={isActive} />;
}
