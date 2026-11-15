"use client";

const SECTIONS = [
  { code: "01", label: "Ibtida" },
  { code: "02", label: "Pehchan" },
  { code: "03", label: "Rabta" },
] as const;

type PaginationHUDProps = {
  activeIndex: number;
  onSelect: (index: number) => void;
};

/** Floating technical pagination ledger pinned to the right viewport edge. */
export function PaginationHUD({ activeIndex, onSelect }: PaginationHUDProps) {
  return (
    <nav
      aria-label="Section navigation"
      className="fixed right-4 top-1/2 z-40 flex -translate-y-1/2 flex-col items-end gap-5 sm:right-6"
    >
      {SECTIONS.map((section, index) => {
        const isActive = index === activeIndex;

        return (
          <button
            key={section.code}
            aria-current={isActive ? "step" : undefined}
            aria-label={`Jump to section ${section.code} ${section.label}`}
            className="group flex items-center gap-3"
            onClick={() => onSelect(index)}
            type="button"
          >
            <span
              className={`rounded-sm bg-chalk/85 px-2 py-1 font-display text-technical-code font-bold uppercase tracking-widest text-ink shadow-sm backdrop-blur-sm transition-opacity duration-200 ${
                isActive
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
              }`}
            >
              {`${section.code} // ${section.label}`}
            </span>
            <span
              aria-hidden="true"
              className={`block w-1.5 rounded-full transition-all duration-300 ${
                isActive
                  ? "h-7 bg-primary"
                  : "h-2 bg-ink/20 group-hover:bg-ink/60"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
