"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SECTIONS } from "@/catalog/nav";
import { SearchDialog } from "@/components/docs/search-dialog";
import { PaletteSwitcher } from "@/components/palette-switcher";

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-100 border-b border-app-border bg-app-sidebar">
      <div className="flex h-14 items-center gap-6 px-5">
        <Link
          href="/docs/components"
          className="shrink-0 font-display text-[15px] font-bold tracking-[-0.01em] text-app-bright"
        >
          compacto-ui
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-5 md:flex">
          {SECTIONS.map((s) => {
            const active = pathname.startsWith(s.href);
            return (
              <Link
                key={s.href}
                href={s.href}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "text-[13px] font-medium text-app-bright"
                    : "text-[13px] text-app-dim transition-colors duration-(--motion-duration-fast) hover:text-app-bright"
                }
              >
                {s.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <SearchDialog />
          <div className="hidden h-6 w-px bg-app-border lg:block" />
          <div className="hidden lg:block">
            <PaletteSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
