type PehchanSectionProps = {
  className?: string;
};

const PRINCIPLES = ["Asli products", "Wajib qeemat", "Bharosay ki service"];

/** Section 02 — editorial identity and the three operating principles. */
export function PehchanSection({ className = "" }: PehchanSectionProps) {
  return (
    <section
      aria-label="Green Electronics — Pehchan"
      className={`flex w-full flex-col justify-between bg-chalk px-6 pb-12 pt-20 text-ink sm:px-12 md:px-20 lg:px-28 ${className}`}
      id="pehchan"
    >
      <div className="flex w-full items-start justify-between gap-4 font-display text-technical-code uppercase tracking-widest text-ink/40">
        <span>SEC // 02</span>
        <span>Ta&apos;aruf // Introduction</span>
      </div>

      <div className="my-auto w-full max-w-6xl py-8 md:py-12">
        <h2 className="max-w-4xl font-display text-[44px] font-bold leading-[0.98] tracking-[-0.04em] text-ink sm:text-[64px] md:text-[80px] lg:text-[96px]">
          Saaf bijli, samjhdaar cheezein.
        </h2>

        <ul className="mt-12 flex max-w-xl flex-col gap-8 md:mt-20 md:gap-12">
          {PRINCIPLES.map((principle) => (
            <li className="group flex items-center gap-6" key={principle}>
              <span
                aria-hidden="true"
                className="h-px w-12 shrink-0 bg-primary transition-all duration-300 group-hover:w-20"
              />
              <span className="font-sans text-body-lg tracking-tight text-ink">
                {principle}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex w-full flex-col items-start justify-between gap-4 font-display text-technical-code uppercase tracking-wider text-ink/40 sm:flex-row sm:items-end">
        <span>Green Electronics Pakistan</span>
        <span>02 — 03</span>
      </div>
    </section>
  );
}
