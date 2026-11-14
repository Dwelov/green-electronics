"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PersonIcon } from "@/components/icons";

const NAV_ITEMS = [
  { href: "/", label: "Ibtida // 01" },
  { href: "/pehchan", label: "Pehchan // 02" },
  { href: "/rabta", label: "Rabta // 03" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-ink/10 bg-chalk/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-12">
        <div className="flex items-center gap-2">
          <Link
            aria-label="Green Electronics — Ibtida"
            className="flex h-7 w-7 items-center justify-center rounded-sm bg-primary font-display text-sm font-bold tracking-tighter text-white"
            href="/"
          >
            GE
          </Link>
          <Link
            className="font-display text-label-md uppercase tracking-tight text-ink transition-colors hover:text-primary-dark"
            href="/"
          >
            Green Electronics
          </Link>
        </div>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;

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
          >
            Rabta
          </Link>
          <Link
            aria-label="Rabta karein"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary-dark"
            href="/rabta"
          >
            <PersonIcon className="h-[18px] w-[18px]" />
          </Link>
        </div>
      </div>
    </header>
  );
}
