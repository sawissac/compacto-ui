"use client";

import Link from "next/link";

import { PaletteSwitcher } from "@/components/palette-switcher";

/**
 * Chrome shared by the grid and the focus view: brand, the palette switcher,
 * and a back link when you are looking at one primitive.
 */
export function GalleryShell({
  children,
  back,
}: {
  children: React.ReactNode;
  back?: boolean;
}) {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-50 border-b border-app-border bg-app-sidebar">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-6 py-3">
          <Link
            href="/components"
            className="font-display text-sm font-bold tracking-[-0.01em] text-app-bright"
          >
            compacto-ui
          </Link>
          {back && (
            <Link
              href="/components"
              className="text-xs text-app-dim hover:text-app-accent"
            >
              ← All components
            </Link>
          )}
          <div className="ml-auto">
            <PaletteSwitcher />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
