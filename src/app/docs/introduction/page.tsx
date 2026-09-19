"use client";

import Link from "next/link";

import { ENTRIES } from "@/catalog/entries";
import { Code } from "@/components/docs/code";
import { Notes } from "@/components/docs/notes";
import { PageShell, Section } from "@/components/docs/page-shell";

export default function Page() {
  return (
    <PageShell
      title="Introduction"
      lede="Flat, token-driven React primitives shared by waux-ai-studio and bulky-api."
      toc={[
        { id: "why", label: "Why this exists" },
        { id: "principles", label: "Design rules" },
        { id: "quick-start", label: "Quick start" },
      ]}
    >
      <Section id="why" title="Why this exists">
        <div className="flex flex-col gap-4 text-[13px] leading-relaxed text-app-text">
          <p>
            Two apps grew the same design system by copying files between
            repositories, and the copies had started to drift — different
            primitive counts, different Radix packaging, and, inside one app,
            two different token vocabularies in the same component folder.
          </p>
          <p>
            This repo is the copy that wins. {ENTRIES.length} primitives, one
            token vocabulary, maintained once and copied into both — not
            published to npm, an AI agent (or the shadcn CLI) copies component
            source straight out of this repo's registry.
          </p>
        </div>
      </Section>

      <Section id="principles" title="Design rules">
        <Notes
          notes={[
            "Flat: no shadows, no gradients. Borders only where a block boundary is not enough, and feedback through color and border rather than depth.",
            "Focus rings are explicit, because there is no elevation to fall back on.",
            "One color vocabulary: --app-*. No shadcn semantic utilities anywhere in the library.",
            "No dark: variants. A palette here is a complete palette, not a light/dark pair, so --app-* already resolves correctly for whichever one is active.",
            "Every user-visible string is a prop with an English default, so the library carries no i18n dependency and your app keeps its own.",
            "No forwardRef — React 19 passes ref as a plain prop.",
            "Every element carries a data-slot, so you can target our internals from your own CSS and tests.",
          ]}
        />
      </Section>

      <Section id="quick-start" title="Quick start">
        <div className="flex flex-col gap-3">
          <p className="text-[13px] leading-relaxed text-app-dim">
            No install. Point an AI agent at this repo's{" "}
            <code className="text-app-text">registry.json</code> and ask it to
            add a component — see{" "}
            <Link
              href="/docs/installation"
              className="text-app-accent hover:underline"
            >
              Installation
            </Link>{" "}
            for the full protocol, and{" "}
            <Link
              href="/docs/skills"
              className="text-app-accent hover:underline"
            >
              Skills
            </Link>{" "}
            for keeping the copies in sync afterwards.
          </p>
          <Code>{`import { Button } from "@/components/ui/button";`}</Code>
        </div>
      </Section>
    </PageShell>
  );
}
