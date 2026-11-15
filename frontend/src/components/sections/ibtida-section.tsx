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
      aria-label="Green Electronics — Ibtida"
      className={`relative w-full cursor-crosshair select-none overflow-hidden bg-chalk [-webkit-touch-callout:none] ${className}`}
      id="ibtida"
    >
      <h1 className="sr-only">Green Electronics — Asal Khara Maal</h1>
      <LiquidReveal isActive={isActive} />

      {/* Top technical ledger */}
      <div className="pointer-events-none absolute inset-x-5 top-20 z-20 flex items-center justify-between gap-3 md:inset-x-12">
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
            State: Fluid // Active
          </span>
          <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
        </div>
      </div>
    </section>
  );
}
