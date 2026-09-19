"use client";

import Link from "next/link";

import type { Entry } from "@/catalog/entries";

/**
 * One primitive's panel in the gallery: heading, one-line blurb, the badges
 * that matter when you are deciding whether to use it (server-safe, optional
 * peer), and the live preview itself.
 */
export function EntryCard({
  entry,
  linked = true,
}: {
  entry: Entry;
  linked?: boolean;
}) {
  const { Preview } = entry;

  return (
    <section
      data-testid={`entry-${entry.slug}`}
      className="flex flex-col overflow-hidden rounded-lg border border-app-border-mid bg-app-panel"
    >
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-app-border px-4 py-3">
        <h2 className="font-display text-sm font-semibold text-app-bright">
          {linked ? (
            <Link
              href={`/components/${entry.slug}`}
              className="hover:text-app-accent"
            >
              {entry.name}
            </Link>
          ) : (
            entry.name
          )}
        </h2>
        <p className="min-w-0 flex-1 text-xs text-app-dim">{entry.blurb}</p>
        <div className="flex shrink-0 gap-1.5">
          {entry.serverSafe && (
            <span className="rounded-sm border border-app-border px-1.5 py-0.5 font-mono text-[10px] text-app-dim">
              server-safe
            </span>
          )}
          {entry.peer && (
            <span className="rounded-sm border border-app-border px-1.5 py-0.5 font-mono text-[10px] text-app-dim">
              peer: {entry.peer}
            </span>
          )}
        </div>
      </header>

      <div className="flex-1 bg-app-bg p-5">
        <Preview />
      </div>

      <footer className="border-t border-app-border px-4 py-2 font-mono text-[10px] text-app-dim">
        {`import { ${entry.name} } from "@compacto/ui/${entry.slug}"`}
      </footer>
    </section>
  );
}
