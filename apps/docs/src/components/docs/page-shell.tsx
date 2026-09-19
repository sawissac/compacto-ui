"use client";

import type { TocItem } from "@/components/docs/toc";
import { Toc } from "@/components/docs/toc";

/**
 * The content column plus its table of contents.
 *
 * The TOC is the first thing to go at narrow widths — it is a convenience for
 * a long page on a wide screen, and on a phone it would just push the content
 * it indexes off the viewport.
 */
export function PageShell({
  title,
  lede,
  toc = [],
  children,
}: {
  title: string;
  lede?: React.ReactNode;
  toc?: TocItem[];
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-1 justify-center gap-10 px-6 py-10">
      <div className="max-w-3xl min-w-0 flex-1">
        <header className="mb-10">
          <h1 className="font-display text-3xl font-bold tracking-[-0.02em] text-app-bright">
            {title}
          </h1>
          {lede && (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-app-dim">
              {lede}
            </p>
          )}
        </header>
        {children}
      </div>

      {toc.length > 0 && (
        <aside className="sticky top-[calc(3.5rem+2.5rem)] hidden h-fit w-52 shrink-0 xl:block">
          <Toc items={toc} />
        </aside>
      )}
    </div>
  );
}

/** A linkable section heading, matched to an entry in the page's TOC. */
export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12 scroll-mt-24" id={id}>
      <h2 className="mb-4 font-display text-xl font-bold tracking-[-0.01em] text-app-bright">
        {title}
      </h2>
      {children}
    </section>
  );
}
