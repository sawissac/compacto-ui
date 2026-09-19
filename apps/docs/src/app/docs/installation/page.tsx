"use client";

import { Code } from "@/components/docs/code";
import { Notes } from "@/components/docs/notes";
import { PageShell, Section } from "@/components/docs/page-shell";

const CSS_SNIPPET = `@import "tailwindcss";
@import "@compacto/ui/styles.css";

@custom-variant dark (&:is(.dark *));

/* Supply your own faces to the package's font namespaces. */
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
      lede="Two steps: install the package, add one import to your Tailwind entry stylesheet."
      toc={[
        { id: "install", label: "Install" },
        { id: "stylesheet", label: "Stylesheet" },
        { id: "peers", label: "Optional peers" },
        { id: "migrating", label: "Migrating from shadcn tokens" },
        { id: "troubleshooting", label: "If classes don't generate" },
      ]}
    >
      <Section id="install" title="Install">
        <div className="flex flex-col gap-3">
          <Code>pnpm add @compacto/ui</Code>
          <p className="text-[13px] leading-relaxed text-app-dim">
            Requires React 19.2+ and Tailwind v4.{" "}
            <code className="font-mono">lucide-react</code> is a required peer;
            the library imports about eight icons from it.
          </p>
        </div>
      </Section>

      <Section id="stylesheet" title="Stylesheet">
        <div className="overflow-x-auto rounded-md border border-app-border-mid bg-app-editor p-4">
          <pre className="font-mono text-[12px] leading-relaxed text-app-text">
            {CSS_SNIPPET}
          </pre>
        </div>
        <p className="mt-3 text-[13px] leading-relaxed text-app-dim">
          That is the whole integration. The package registers its own Tailwind
          scan path from inside its stylesheet, so you do not add a{" "}
          <code className="font-mono">@source</code> for it.
        </p>
      </Section>

      <Section id="peers" title="Optional peers">
        <p className="mb-4 text-[13px] leading-relaxed text-app-dim">
          Three modules each depend on one library. They are optional peers, so
          a project that only wants a Button does not install a date picker.
        </p>
        <Code>pnpm add cmdk react-day-picker react-resizable-panels</Code>
      </Section>

      <Section id="migrating" title="Migrating from shadcn tokens">
        <p className="mb-3 text-[13px] leading-relaxed text-app-text">
          If your own feature code still writes{" "}
          <code className="font-mono">bg-primary</code> or{" "}
          <code className="font-mono">text-muted-foreground</code>, add the
          opt-in compatibility layer while you migrate. It aliases the semantic
          variables onto <code className="font-mono">--app-*</code>.
        </p>
        <Code>{`@import "@compacto/ui/compat-shadcn.css";`}</Code>
        <p className="mt-3 text-[13px] leading-relaxed text-app-dim">
          Drop the import once a grep for semantic utilities in your{" "}
          <code className="font-mono">src/</code> comes back empty. Scheduled
          for removal in v2.
        </p>
      </Section>

      <Section id="troubleshooting" title="If classes don't generate">
        <Notes
          notes={[
            "The symptom is silent: components render unstyled because Tailwind never saw the package's class names.",
            "The package registers its own scan path from inside theme.css. If your build does not honour a relative @source through a symlink, add an explicit one.",
          ]}
        />
        <div className="mt-4 flex flex-col gap-3">
          <Code>{`@source "../../node_modules/@compacto/ui/dist";`}</Code>
          <p className="text-[12px] leading-relaxed text-app-dim">
            Or, where the pnpm symlink is not followed:
          </p>
          <Code>{`@source "../../node_modules/.pnpm/@compacto+ui@*/node_modules/@compacto/ui/dist";`}</Code>
        </div>
      </Section>
    </PageShell>
  );
}
