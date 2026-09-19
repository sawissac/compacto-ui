"use client";

import { notFound, useParams } from "next/navigation";

import { ENTRY_BY_SLUG } from "@/catalog/entries";
import { EntryCard } from "@/components/entry-card";
import { GalleryShell } from "@/components/gallery-shell";

/**
 * One primitive on its own. Useful when a preview needs room — the calendar
 * and the resizable split in particular — and as a stable link to paste into a
 * review.
 */
export default function Page() {
  const params = useParams<{ slug: string }>();
  const entry = ENTRY_BY_SLUG.get(params.slug);

  if (!entry) {
    notFound();
  }

  return (
    <GalleryShell back>
      <EntryCard entry={entry} linked={false} />
    </GalleryShell>
  );
}
