# compacto-ui

Flat, token-driven React primitives shared by [waux-ai-studio](https://github.com/sawissac/waux-ai-studio)
and [bulky-api](https://github.com/sawissac/bulky-api).

Both apps grew the same design system by copying files between repos, and the
copies had started to drift. This repo is the single source of truth: the
components are published as `@compacto/ui`, the apps install it.

## Layout

| Path          | What                                                      |
| ------------- | --------------------------------------------------------- |
| `packages/ui` | the published package, `@compacto/ui`                     |
| `apps/docs`   | Next.js gallery — every primitive across all ten palettes |

## Getting started

```bash
pnpm install
pnpm build      # build the package first; the docs app consumes its dist
pnpm dev        # docs gallery on http://localhost:3100
```

## Using it in an app

```bash
pnpm add @compacto/ui
```

One import in your Tailwind entry stylesheet:

```css
@import "tailwindcss";
@import "@compacto/ui/styles.css";

@custom-variant dark (&:is(.dark *));

/* Supply your own faces to the package's font namespaces. */
:root {
  --app-font-sans: var(--font-open-sans);
  --app-font-title: var(--font-poppins);
  --app-font-display: var(--font-poppins);
  --app-font-description: var(--font-open-sans);
  --app-font-mono: var(--font-jetbrains-mono);
}
```

Then:

```tsx
import { Button } from "@compacto/ui/button";
```

Both the root barrel (`@compacto/ui`) and per-component subpaths
(`@compacto/ui/button`) work. Prefer the subpath in a Server Component — it is
unambiguous about which modules are client modules.

### Design tokens

The library speaks one vocabulary: `--app-*`, exposed to Tailwind as the
`app-*` color namespace (`bg-app-panel`, `text-app-dim`,
`border-app-border-mid`). Ten complete palettes ship in
`@compacto/ui/color-themes`; apply one by writing its variables onto
`document.documentElement`:

```ts
import { appThemeCssVars, COLOR_THEMES } from "@compacto/ui/color-themes";

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
`text-muted-foreground` / `border-border`, add the opt-in compatibility layer
while you migrate:

```css
@import "@compacto/ui/compat-shadcn.css";
```

It aliases the semantic variables onto `--app-*`. Drop the import once a grep
for semantic utilities in your `src/` comes back empty. Scheduled for removal
in v2.0.0.

### If utilities don't generate

The package registers its own Tailwind scan path from inside
`theme.css` (`@source "../"`). If your build does not honour it, the symptom is
silent — classes simply missing. Add an explicit source:

```css
@source "../../node_modules/@compacto/ui/dist";
/* or, where the pnpm symlink is not followed: */
@source "../../node_modules/.pnpm/@compacto+ui@*/node_modules/@compacto/ui/dist";
```

## Releasing

Manual, from your machine, after `npm login` once.

```bash
cd packages/ui && npm version minor   # or patch / major — commits and tags
cd ../.. && pnpm release              # full build + verification, then publish
```

`pnpm release` refuses to publish from a dirty tree or a branch other than
`main`, and the build it runs first ends in the directive check, publint and
attw — so a broken package cannot ship. Add a line to
`packages/ui/CHANGELOG.md` by hand when you bump.

## Contributing

`CLAUDE.md` is the code-style contract. `pnpm gates` enforces the token rules
mechanically. There is no CI; run the checks before you commit:

```bash
pnpm format:check && pnpm lint && pnpm typecheck && pnpm gates && pnpm build && pnpm test
```
