"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";

import { API } from "@/catalog/api";
import { ENTRIES, ENTRY_BY_SLUG } from "@/catalog/entries";
import { Code } from "@/components/docs/code";
import { Notes } from "@/components/docs/notes";
import { PageShell, Section } from "@/components/docs/page-shell";
import { EntryBadges, Preview } from "@/components/docs/preview";
import { PropsTable } from "@/components/docs/props-table";

const SORTED = [...ENTRIES].sort((a, b) => a.name.localeCompare(b.name));

export default function Page() {
  const params = useParams<{ slug: string }>();
  const entry = ENTRY_BY_SLUG.get(params.slug);

  if (!entry) {
    notFound();
  }

  const api = API[entry.slug];
  const index = SORTED.findIndex((e) => e.slug === entry.slug);
  const prev = SORTED[index - 1];
  const next = SORTED[index + 1];

  const toc = [
    { id: "preview", label: "Preview" },
    { id: "installation", label: "Installation" },
    ...(api?.notes?.length ? [{ id: "notes", label: "Notes" }] : []),
    ...(api?.props?.length ? [{ id: "props", label: "Props" }] : []),
  ];

  return (
    <PageShell title={entry.name} lede={entry.blurb} toc={toc}>
      {(entry.serverSafe || entry.peer) && (
        <div className="mb-8">
          <EntryBadges entry={entry} />
        </div>
      )}

      <Section id="preview" title="Preview">
        <Preview entry={entry} />
      </Section>

      <Section id="installation" title="Installation">
        <div className="flex flex-col gap-3">
          <Code>{`pnpm add @compacto/ui${entry.peer ? ` ${entry.peer}` : ""}`}</Code>
          <Code>
            {`import { ${(api?.exports ?? [entry.name]).join(", ")} } from "@compacto/ui/${entry.slug}";`}
          </Code>
          <p className="text-[12px] leading-relaxed text-app-dim">
            The root barrel works too —{" "}
            {/* One template string rather than interleaved JSX children:
                JSX collapses the space before "from", which reads as a typo
                in a code sample. */}
            <code className="font-mono">
              {`import { ${entry.name} } from "@compacto/ui"`}
            </code>
            . Prefer the subpath in a Server Component: it is unambiguous about
            which modules are client modules.
          </p>
        </div>
      </Section>

      {api?.notes?.length ? (
        <Section id="notes" title="Notes">
          <Notes notes={api.notes} />
        </Section>
      ) : null}

      {api?.props?.length ? (
        <Section id="props" title="Props">
          <p className="mb-4 text-[13px] leading-relaxed text-app-dim">
            The props worth knowing. Everything else passes straight through to
            the underlying element, including{" "}
            <code className="font-mono">className</code>, which is merged last
            so it always wins.
          </p>
          <PropsTable props={api.props} />
        </Section>
      ) : null}

      <nav className="mt-14 flex items-center justify-between gap-4 border-t border-app-border pt-6">
        {prev ? (
          <Link
            href={`/docs/components/${prev.slug}`}
            className="text-[13px] text-app-dim hover:text-app-accent"
          >
            ← {prev.name}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/docs/components/${next.slug}`}
            className="text-[13px] text-app-dim hover:text-app-accent"
          >
            {next.name} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </PageShell>
  );
}
