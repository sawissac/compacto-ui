# compacto-ui

Flat, token-driven React primitives shared by [waux-ai-studio](https://github.com/sawissac/waux-ai-studio)
and [bulky-api](https://github.com/sawissac/bulky-api).

Both apps grew the same design system by copying files between repos, and the
copies had started to drift. This repo is the single source of truth — but it
is **not published to npm**. `waux-ai-studio` and `bulky-api` consume it by
copying component source straight out of [`registry.json`](registry.json),
the same way you'd add a component from shadcn/ui: point an AI coding agent
(or the `shadcn` CLI) at this repo and ask it to add what you need. This repo
is also the docs gallery for the library — a single Next.js app.

## Layout

| Path | What |
| --- | --- |
| `src/components/ui` | every primitive's source — the copy-in library |
| `src/lib` | `cn`, `ui-styles`, `color-themes` — shared helpers the primitives depend on |
| `src/styles` | tokens, theme, texture, the shadcn-compat layer |
| `registry.json` | the copy-in manifest — see [AI-REFERENCE.md](AI-REFERENCE.md) |
| `public/r/` | registry-item JSON, one file per component (hand-maintained) |
| `src/app`, `src/catalog`, `src/providers` | the docs gallery — every primitive live, across all ten palettes |

## Getting started

```bash
pnpm install
pnpm dev        # docs gallery on http://localhost:3100
pnpm build      # production build
```

## Using it in an app

This is a copy-in library, not an npm dependency. See
[AI-REFERENCE.md](AI-REFERENCE.md) for the full protocol; the short version:

**1. Copy a component.** Point your AI agent at this repo (or its
`registry.json` / `public/r/*.json` if hosted) and name the component(s) you
want. It resolves `registryDependencies` (other components, `cn`,
`ui-styles`, `color-themes`) and `dependencies` (npm packages to install)
from the item JSON, and writes each file's `content` to its `target` path in
your repo — by default `components/ui/*.tsx` and `lib/*.ts`, importing each
other via `@/...`.

**2. Install its dependencies.**

```bash
pnpm add class-variance-authority clsx radix-ui tailwind-merge
```

Plus whichever peers your chosen components need (`cmdk`, `date-fns`,
`lucide-react`, `react-day-picker`, `react-resizable-panels` — each item's
`dependencies` array says which).

**3. Copy the `styles` item once** (`tokens.css`, `theme.css`, `texture.css`,
`index.css`) to `styles/compacto/`, then:

```css
@import "tailwindcss";
@import "./compacto/index.css";

@custom-variant dark (&:is(.dark *));

/* Supply your own faces to the design system's font namespaces. */
:root {
  --app-font-sans: var(--font-open-sans);
  --app-font-title: var(--font-poppins);
  --app-font-display: var(--font-poppins);
  --app-font-description: var(--font-open-sans);
  --app-font-mono: var(--font-jetbrains-mono);
}
```

Then, once `button.tsx` has been copied to `components/ui/button.tsx`:

```tsx
import { Button } from "@/components/ui/button";
```

`public/r/<name>.json` is a hand-maintained snapshot of the same content —
update it alongside the component when you edit one; there is no build
script for it.

### Design tokens

The library speaks one vocabulary: `--app-*`, exposed to Tailwind as the
`app-*` color namespace (`bg-app-panel`, `text-app-dim`,
`border-app-border-mid`). Ten complete palettes live in the `color-themes`
registry item; apply one by writing its variables onto `document.documentElement`:

```ts
import { appThemeCssVars, COLOR_THEMES } from "@/lib/color-themes";

const theme = COLOR_THEMES.midnight;
Object.entries(appThemeCssVars(theme)).forEach(([k, v]) =>
  document.documentElement.style.setProperty(k, v),
);
document.documentElement.classList.toggle("dark", !theme.isLight);
```

A palette is a whole palette, not a light/dark pair — `light` is just the one
with `isLight: true`. Component classes therefore carry **no `dark:` variants**;
the `.dark` class exists only for third-party CSS (Monaco, KaTeX, shiki) and
for the pre-hydration defaults in `tokens.css`.

### Migrating from shadcn semantic tokens

If your app's own feature code still writes `bg-primary` /
`text-muted-foreground` / `border-border`, copy the opt-in `compat-shadcn`
registry item and import it:

```css
@import "./compacto/compat-shadcn.css";
```

It aliases the semantic variables onto `--app-*`. Drop the import once a grep
for semantic utilities in your `src/` comes back empty. Scheduled for removal
in v2.0.0.

### If utilities don't generate

Tailwind v4's default content auto-detection scans your whole project, so a
component copied under your app's own `src/` gets picked up with no extra
config. If your build customizes content scanning, add an explicit `@source`
pointing at wherever you copied `components/ui` and `styles/compacto` to.

## Contributing

`CLAUDE.md` is the code-style contract. The token rules are enforced by
review, not tooling. There is no CI; run the checks before you commit:

```bash
pnpm format:check && pnpm lint && pnpm typecheck && pnpm build
```
