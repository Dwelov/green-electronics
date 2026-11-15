"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { PersonIcon } from "@/components/icons";

type SiteHeaderProps = {
  activeIndex: number;
  onNavigate: (index: number) => void;
};

const NAV_ITEMS = [
  { index: 0, href: "/", label: "Ibtida // 01" },
  { index: 1, href: "/pehchan", label: "Pehchan // 02" },
  { index: 2, href: "/rabta", label: "Rabta // 03" },
] as const;

export function SiteHeader({ activeIndex, onNavigate }: SiteHeaderProps) {
  const handleNavigate = (
    event: MouseEvent<HTMLAnchorElement>,
    index: number,
  ) => {
    // Preserve modifier clicks so links still open in a new tab.
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();
    onNavigate(index);
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-ink/10 bg-chalk/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-12">
        <div className="flex items-center gap-2">
          <Link
            aria-label="Green Electronics — Ibtida"
            className="flex h-7 w-7 items-center justify-center rounded-sm bg-primary font-display text-sm font-bold tracking-tighter text-white"
            href="/"
            onClick={(event) => handleNavigate(event, 0)}
          >
            GE
          </Link>
          <Link
            className="font-display text-label-md uppercase tracking-tight text-ink transition-colors hover:text-primary-dark"
            href="/"
            onClick={(event) => handleNavigate(event, 0)}
          >
            Green Electronics
          </Link>
        </div>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = activeIndex === item.index;

            return (
              <Link
                key={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`font-display text-label-md uppercase tracking-wider transition-colors ${
                  isActive
                    ? "font-bold text-primary-dark"
                    : "text-muted hover:text-ink"
                }`}
                href={item.href}
                onClick={(event) => handleNavigate(event, item.index)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            className="font-display text-label-md uppercase tracking-wider text-ink transition-colors hover:text-primary-dark"
            href="/rabta"
            onClick={(event) => handleNavigate(event, 2)}
          >
            Rabta
          </Link>
          <Link
            aria-label="Rabta karein"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary-dark"
            href="/rabta"
            onClick={(event) => handleNavigate(event, 2)}
          >
            <PersonIcon className="h-[18px] w-[18px]" />
          </Link>
        </div>
      </div>
    </header>
  );
}
