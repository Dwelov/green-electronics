"use client";

const SECTIONS = [
  { code: "01", label: "Home" },
  { code: "02", label: "Services" },
  { code: "03", label: "Contact" },
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
            className="group flex items-center"
            onClick={() => onSelect(index)}
            type="button"
          >
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
