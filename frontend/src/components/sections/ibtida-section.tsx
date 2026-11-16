import { LiquidReveal } from "@/components/liquid-reveal";

type IbtidaSectionProps = {
  className?: string;
  isActive?: boolean;
};

/** Section 01 — WebGL2 fluid cursor reveal plus the technical ledgers. */
export function IbtidaSection({
  className = "",
  isActive = true,
}: IbtidaSectionProps) {
  return (
    <section
      aria-label="Green Electronics — Home"
      className={`relative w-full cursor-crosshair select-none overflow-hidden bg-chalk [-webkit-touch-callout:none] ${className}`}
      id="ibtida"
    >
      <h1 className="sr-only">
        Green Electronics — Genuine Hardware &amp; Engineering
      </h1>
      <LiquidReveal isActive={isActive} />
    </section>
  );
}
