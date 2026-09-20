"use client";

import { ArrowUpRight, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { ENTRIES } from "@/catalog/entries";
import { EntryBadges } from "@/components/docs/preview";
import { PaletteSwitcher } from "@/components/palette-switcher";
import { Input } from "@/components/ui/input";

const SORTED = [...ENTRIES].sort((a, b) => a.name.localeCompare(b.name));

/**
 * Every primitive on one page, one card per component, three across.
 *
 * Deliberately built from {@link ENTRIES} rather than hand-assembled: the docs
 * pages read the same list, so a component added to the catalog shows up here
 * without a second edit, and a preview can never drift between the two.
 *
 * Every card's preview box is the same fixed height and scrolls inside
 * itself, so the grid reads as a grid. Several previews are deliberately
 * huge — DataTable virtualises five thousand rows, Sidebar renders a whole
 * rail — and left to size themselves one card would set the height of its
 * entire row.
 */
export default function DemoPage() {
  const [query, setQuery] = React.useState("");

  const q = query.trim().toLowerCase();
  const shown = q
    ? SORTED.filter(
        (e) =>
          e.name.toLowerCase().includes(q) || e.blurb.toLowerCase().includes(q),
      )
    : SORTED;

  return (
    <div className="min-h-dvh bg-app-bg">
      <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b border-app-border bg-app-sidebar px-5">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/web-app-manifest-192x192.png"
            alt=""
            width={24}
            height={24}
            priority
            className="rounded-[6px]"
          />
          <span className="font-display text-[15px] font-bold tracking-[-0.01em] text-app-bright">
            compacto-ui
          </span>
        </Link>

        <Link
          href="/docs/introduction"
          className="text-[13px] text-app-dim transition-colors duration-(--motion-duration-fast) hover:text-app-bright"
        >
          Documentation
        </Link>

        <div className="ml-auto flex items-center gap-4">
          <Input
            icon={Search}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery("")}
            placeholder="Filter components…"
            aria-label="Filter components"
            className="h-8 w-64"
          />
          <div className="h-6 w-px bg-app-border" />
          <PaletteSwitcher />
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-5 py-8">
        {shown.length === 0 ? (
          <p className="text-[13px] text-app-dim">
            Nothing matches &ldquo;{query}&rdquo;.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {shown.map((entry) => {
              const { Preview } = entry;
              return (
                <section
                  key={entry.slug}
                  id={entry.slug}
                  data-testid={`demo-${entry.slug}`}
                  className="flex flex-col overflow-hidden rounded-lg border border-app-border-mid bg-app-panel"
                >
                  <div className="flex items-center gap-2 border-b border-app-border px-4 py-3">
                    <h2 className="font-display text-[14px] font-semibold tracking-[-0.01em] text-app-bright">
                      {entry.name}
                    </h2>
                    <Link
                      href={`/docs/components/${entry.slug}`}
                      aria-label={`${entry.name} documentation`}
                      className="ml-auto flex shrink-0 items-center gap-1 text-[12px] text-app-dim transition-colors duration-(--motion-duration-fast) hover:text-app-accent"
                    >
                      Docs
                      <ArrowUpRight size={12} aria-hidden />
                    </Link>
                  </div>

                  <div className="flex flex-col gap-2 px-4 pt-3">
                    {/* Badges under the title, not beside it: DataTable names
                        two peers, and inline they push the Docs link onto a
                        second line while every other card keeps it on one. */}
                    {(entry.serverSafe || entry.peer) && (
                      <EntryBadges entry={entry} />
                    )}
                    <p className="text-[12px] leading-relaxed text-app-dim">
                      {entry.blurb}
                    </p>
                  </div>

                  <div className="m-4 h-72 overflow-auto rounded-md bg-app-bg p-4">
                    <Preview />
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
