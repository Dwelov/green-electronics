export function SiteFooter() {
  return (
    <footer className="w-full border-t border-surface-high bg-surface-low">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 md:flex-row md:px-12">
        <div className="flex items-center gap-2">
          <span className="font-display text-technical-code uppercase text-muted">
            GE // SPEC-SYSTEM-2024
          </span>
          <span aria-hidden="true" className="font-display text-technical-code text-outline-variant">
            /
          </span>
          <span className="font-display text-technical-code uppercase text-muted">
            Paiydar Funn
          </span>
        </div>
        <div className="font-display text-technical-code uppercase text-muted">
          © 2024 Green Electronics. Asal Khara Maal.
        </div>
      </div>
    </footer>
  );
}
