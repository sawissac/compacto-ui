"use client";

import { Notes } from "@/components/docs/notes";
import { PageShell, Section } from "@/components/docs/page-shell";
import { TokenTable } from "@/components/token-table";

export default function Page() {
  return (
    <PageShell
      title="Tokens"
      lede="The --app-* vocabulary, resolved against the palette you have active. These are the only color names the library speaks."
      toc={[
        { id: "colors", label: "Colors" },
        { id: "rules", label: "Rules" },
      ]}
    >
      <Section id="colors" title="Colors">
        <p className="mb-4 text-[13px] leading-relaxed text-app-dim">
          Switch palettes in the header with this table in view — it shows which
          tokens carry a palette&apos;s character and which barely move.
        </p>
        <TokenTable />
      </Section>

      <Section id="rules" title="Rules">
        <Notes
          notes={[
            "Every token is exposed to Tailwind as an app-* utility: bg-app-panel, text-app-dim, border-app-border-mid.",
            "--app-on-solid is derived, not stored: text on a solid accent block needs the opposite of the accent, which is white on a light palette and the page background on a dark one.",
            "Nothing is folded. A semantic vocabulary has to collapse bgSelected, borderAccent, accentFaint, text, editorBg and gutterBg into their nearest neighbours; this one keeps them apart.",
            "theme.css uses @theme inline, not @theme, so the --color-app-* entries stay as var() references. A plain @theme would freeze one palette's hex values into the generated utilities and every other palette would silently stop working.",
            "Motion is tokenised too: --motion-duration-instant / fast / base / slow, and three easing curves. No magic numbers in a transition.",
          ]}
        />
      </Section>
    </PageShell>
  );
}
