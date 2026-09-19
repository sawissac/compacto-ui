"use client";

import { Notes } from "@/components/docs/notes";
import { PageShell, Section } from "@/components/docs/page-shell";
import { PaletteGrid } from "@/components/docs/palette-grid";

const APPLY_SNIPPET = `import { appThemeCssVars, COLOR_THEMES } from "@/lib/color-themes";

const theme = COLOR_THEMES.midnight;

for (const [name, value] of Object.entries(appThemeCssVars(theme))) {
  document.documentElement.style.setProperty(name, value);
}
document.documentElement.classList.toggle("dark", !theme.isLight);`;

export default function Page() {
  return (
    <PageShell
      title="Theming"
      lede="Twenty-three complete palettes across twelve hues. Pick one and every primitive below follows — this page is itself the reference implementation."
      toc={[
        { id: "palettes", label: "Palettes" },
        { id: "applying", label: "Applying a palette" },
        { id: "no-dark", label: "Why there is no dark: variant" },
      ]}
    >
      <Section id="palettes" title="Palettes">
        <PaletteGrid />
      </Section>

      <Section id="applying" title="Applying a palette">
        <p className="mb-4 text-[13px] leading-relaxed text-app-text">
          Write the palette&apos;s variables onto the root element. That is the
          whole mechanism — there is no provider to mount and no context to
          thread.
        </p>
        <div className="overflow-x-auto rounded-md border border-app-border-mid bg-app-editor p-4">
          <pre className="font-mono text-[12px] leading-relaxed text-app-text">
            {APPLY_SNIPPET}
          </pre>
        </div>
      </Section>

      <Section id="no-dark" title="Why there is no dark: variant">
        <Notes
          notes={[
            "A palette here is complete — background, three surface elevations, one accent, text — not a light/dark pair layered over a fixed accent. `light` is simply the palette whose isLight flag is true.",
            "So --app-* already resolves to the right value for whichever palette is active. A dark: clause would be a second, parallel answer to a question the palette has already answered, and the two would drift.",
            "The .dark class still goes on the root element, but only so third-party CSS (Monaco, KaTeX, shiki) and the pre-hydration defaults in tokens.css can key off it.",
            "A CI gate greps the library for `dark:` and fails the build on a hit.",
          ]}
        />
      </Section>
    </PageShell>
  );
}
