import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pehchan",
  description:
    "Saaf bijli, samjhdaar cheezein. Asli products, wajib qeemat aur bharosay ki service — Green Electronics Pakistan.",
};

const PRINCIPLES = ["Asli products", "Wajib qeemat", "Bharosay ki service"];

export default function PehchanPage() {
  return (
    <div className="flex min-h-[calc(100dvh-4rem)] w-full flex-col justify-between bg-chalk px-6 py-16 text-ink sm:px-12 md:px-20 md:py-24 lg:px-28">
      <div className="flex w-full items-start justify-between gap-4 font-display text-technical-code uppercase tracking-widest text-ink/40">
        <span>SEC // 02</span>
        <span>Ta&apos;aruf // Introduction</span>
      </div>

      <div className="my-auto w-full max-w-6xl py-12 md:py-20">
        <h1 className="max-w-4xl font-display text-[44px] font-bold leading-[0.98] tracking-[-0.04em] text-ink sm:text-[64px] md:text-[80px] lg:text-[96px]">
          Saaf bijli, samjhdaar cheezein.
        </h1>

        <ul className="mt-20 flex max-w-xl flex-col gap-10 md:mt-32 md:gap-14">
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
    </div>
  );
}
