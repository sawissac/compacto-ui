"use client";

import Link from "next/link";

import { ENTRIES } from "@/catalog/entries";
import { PageShell, Section } from "@/components/docs/page-shell";

const SERVER_SAFE = ENTRIES.filter((e) => e.serverSafe);
const WITH_PEERS = ENTRIES.filter((e) => e.peer);

function ComponentGrid({ entries }: { entries: typeof ENTRIES }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
      {[...entries]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((e) => (
          <Link
            key={e.slug}
            href={`/docs/components/${e.slug}`}
            data-testid={`index-${e.slug}`}
            className="text-[15px] font-medium text-app-bright transition-colors duration-(--motion-duration-fast) hover:text-app-accent"
          >
            {e.name}
          </Link>
        ))}
    </div>
  );
}

export default function Page() {
  return (
    <PageShell
      title="Components"
      lede="Every primitive in @compacto/ui. Each one is live on its own page — switch palettes in the header to see it across all ten."
      toc={[
        { id: "all", label: "All Components" },
        { id: "server-safe", label: "Server-safe" },
        { id: "optional-peers", label: "Optional peers" },
      ]}
    >
      <Section id="all" title="All Components">
        <ComponentGrid entries={ENTRIES} />
      </Section>

      <Section id="server-safe" title="Server-safe">
        <p className="mb-4 text-[13px] leading-relaxed text-app-dim">
          These carry no{" "}
          <code className="font-mono">&quot;use client&quot;</code> directive,
          so a Server Component can render them without opening a client
          boundary.
        </p>
        <ComponentGrid entries={SERVER_SAFE} />
      </Section>

      <Section id="optional-peers" title="Optional peers">
        <p className="mb-4 text-[13px] leading-relaxed text-app-dim">
          Each of these is the only consumer of one dependency, so it is an
          optional peer — install it if you import that module, skip it
          otherwise.
        </p>
        <div className="flex flex-col gap-2">
          {WITH_PEERS.map((e) => (
            <div key={e.slug} className="flex items-center gap-3 text-[13px]">
              <Link
                href={`/docs/components/${e.slug}`}
                className="w-32 font-medium text-app-bright hover:text-app-accent"
              >
                {e.name}
              </Link>
              <code className="font-mono text-[12px] text-app-dim">
                {e.peer}
              </code>
            </div>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
