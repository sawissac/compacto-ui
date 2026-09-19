"use client";

import { ENTRIES } from "@/catalog/entries";
import { EntryCard } from "@/components/entry-card";
import { GalleryShell } from "@/components/gallery-shell";
import { TokenTable } from "@/components/token-table";

export default function Page() {
  return (
    <GalleryShell>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-app-bright">
          Components
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-app-dim">
          Every primitive in <code className="font-mono">@compacto/ui</code>,
          live. Switch palettes in the header — a primitive that only looks
          right on one palette is the exact failure this gallery exists to
          catch.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {ENTRIES.map((entry) => (
          <EntryCard key={entry.slug} entry={entry} />
        ))}
      </div>

      <div className="mt-12">
        <h2 className="font-display text-lg font-bold text-app-bright">
          Tokens
        </h2>
        <p className="mt-1 mb-4 max-w-2xl text-sm text-app-dim">
          The <code className="font-mono">--app-*</code> vocabulary as the
          active palette resolves it. These are the only color names the library
          speaks.
        </p>
        <TokenTable />
      </div>
    </GalleryShell>
  );
}
