"use client";

import type { Entry } from "@/catalog/entries";

/** Badges that answer "can I use this here" at a glance. */
export function EntryBadges({ entry }: { entry: Entry }) {
  return (
    <div className="flex flex-wrap gap-1.5">
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
  );
}

/** The live example, on the page background so it sits on a real surface. */
export function Preview({ entry }: { entry: Entry }) {
  const { Preview: P } = entry;
  return (
    <div className="rounded-lg border border-app-border-mid bg-app-bg p-6">
      <P />
    </div>
  );
}
