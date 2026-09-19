"use client";

import { Code } from "@/components/docs/code";
import { Notes } from "@/components/docs/notes";
import { PageShell, Section } from "@/components/docs/page-shell";

const CSS_SNIPPET = `@import "tailwindcss";
@import "./compacto/index.css";

@custom-variant dark (&:is(.dark *));

/* Supply your own faces to the design system's font namespaces. */
:root {
  --app-font-sans: var(--font-open-sans);
  --app-font-title: var(--font-poppins);
  --app-font-display: var(--font-poppins);
  --app-font-description: var(--font-open-sans);
  --app-font-mono: var(--font-jetbrains-mono);
}`;

export default function Page() {
  return (
    <PageShell
      title="Installation"
      lede="No npm install. An AI agent copies component source out of this repo's registry, you add its npm dependencies, and wire up one Tailwind import."
      toc={[
        { id: "copy", label: "Copy a component" },
        { id: "deps", label: "Install its dependencies" },
        { id: "stylesheet", label: "Stylesheet" },
        { id: "migrating", label: "Migrating from shadcn tokens" },
        { id: "troubleshooting", label: "If classes don't generate" },
      ]}
    >
      <Section id="copy" title="Copy a component">
        <p className="mb-3 text-[13px] leading-relaxed text-app-text">
          There is no package to install. Point your AI agent (or the{" "}
          <code className="font-mono">shadcn</code> CLI) at this repo and name
          the component — it reads{" "}
          <code className="font-mono">registry.json</code>, resolves
          dependencies, and writes source into your app at{" "}
          <code className="font-mono">components/ui/*.tsx</code> and{" "}
          <code className="font-mono">lib/*.ts</code>. Full protocol:{" "}
          <code className="font-mono">AI-REFERENCE.md</code> at the repo root.
        </p>
        <Code>{`import { Button } from "@/components/ui/button";`}</Code>
      </Section>

      <Section id="deps" title="Install its dependencies">
        <p className="mb-4 text-[13px] leading-relaxed text-app-dim">
          Every registry item lists the npm packages it needs. The core four
          cover most components:
        </p>
        <Code>
          pnpm add class-variance-authority clsx radix-ui tailwind-merge
        </Code>
        <p className="mt-3 text-[13px] leading-relaxed text-app-dim">
          Plus whichever of these a copied component's item actually lists:{" "}
          <code className="font-mono">cmdk</code>,{" "}
          <code className="font-mono">date-fns</code>,{" "}
          <code className="font-mono">lucide-react</code>,{" "}
          <code className="font-mono">react-day-picker</code>,{" "}
          <code className="font-mono">react-resizable-panels</code>. Requires
          React 19.2+ and Tailwind v4.
        </p>
      </Section>

      <Section id="stylesheet" title="Stylesheet">
        <p className="mb-3 text-[13px] leading-relaxed text-app-text">
          Copy the <code className="font-mono">styles</code> registry item
          (tokens.css, theme.css, texture.css, index.css) to{" "}
          <code className="font-mono">styles/compacto/</code> once, then:
        </p>
        <div className="overflow-x-auto rounded-md border border-app-border-mid bg-app-editor p-4">
          <pre className="font-mono text-[12px] leading-relaxed text-app-text">
            {CSS_SNIPPET}
          </pre>
        </div>
      </Section>

      <Section id="migrating" title="Migrating from shadcn tokens">
        <p className="mb-3 text-[13px] leading-relaxed text-app-text">
          If your own feature code still writes{" "}
          <code className="font-mono">bg-primary</code> or{" "}
          <code className="font-mono">text-muted-foreground</code>, copy the
          opt-in <code className="font-mono">compat-shadcn</code> registry
          item too. It aliases the semantic variables onto{" "}
          <code className="font-mono">--app-*</code>.
        </p>
        <Code>{`@import "./compacto/compat-shadcn.css";`}</Code>
        <p className="mt-3 text-[13px] leading-relaxed text-app-dim">
          Drop the import once a grep for semantic utilities in your{" "}
          <code className="font-mono">src/</code> comes back empty. Scheduled
          for removal in v2.
        </p>
      </Section>

      <Section id="troubleshooting" title="If classes don't generate">
        <Notes
          notes={[
            "The symptom is silent: components render unstyled because Tailwind never scanned the copied files.",
            "theme.css assumes Tailwind's default content auto-detection sees the copied components — true once they live under your app's own src/. If your build customizes content scanning, add an explicit @source pointing at wherever you copied components/ui and styles/compacto to.",
          ]}
        />
      </Section>
    </PageShell>
  );
}
