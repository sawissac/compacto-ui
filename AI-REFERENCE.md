# AI-REFERENCE

How an AI coding agent (or the `shadcn` CLI) consumes this repo. There is no
npm package — every component is copied into the consuming app's own source
tree, the same pattern as shadcn/ui. This file is the protocol; the design
language itself is in [DESIGN.md](DESIGN.md), and the code-style rules the
components follow are in [CLAUDE.md](CLAUDE.md).

## TL;DR — copy `button` into a Next.js app

```bash
# 1. Read the built item (self-contained; source inlined as `content`).
curl -s https://raw.githubusercontent.com/sawissac/compacto-ui/main/public/r/button.json
#    -> registryDependencies: ["cn"]  dependencies: ["class-variance-authority","radix-ui"]

# 2. Recurse into registryDependencies (cn -> clsx, tailwind-merge) and install
#    the union of npm deps once.
pnpm add class-variance-authority radix-ui clsx tailwind-merge

# 3. Write each files[].content to files[].path under the app's src/:
#    src/lib/cn.ts, src/components/ui/button.tsx

# 4. First time only: copy the `styles` item (4 css files) to
#    src/styles/compacto/ and import it from the app's Tailwind entry.
```

Or, with the shadcn CLI (it resolves `registryDependencies` itself):

```bash
npx shadcn@latest add https://raw.githubusercontent.com/sawissac/compacto-ui/main/public/r/button.json
npx shadcn@latest add https://raw.githubusercontent.com/sawissac/compacto-ui/main/public/r/styles.json
```

Then `import { Button } from "@/components/ui/button"`.

## Where the items are

| Artifact                 | What it is                                                                                                                                                                                |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `registry.json`          | The **manifest**: every item's `name`, `type`, `description`, npm `dependencies`, `registryDependencies` (other items here), and `files[]` as `source` (this repo) → `target` (consumer). |
| `public/r/<name>.json`   | The **built item**: same metadata with each file's source inlined as `content`. This is what gets copied. One per item.                                                                   |
| `public/r/registry.json` | Index of built items (name/type/title/description only).                                                                                                                                  |
| `src/**`                 | The source the built items are generated from — and the docs gallery.                                                                                                                     |

Prefer `public/r/<name>.json`. Fall back to `registry.json` + the `source`
paths only when the built artifacts are unavailable. Both are kept in sync by
`pnpm registry:build`; `pnpm registry:check` (part of `pnpm check`) fails if
they drift, so what you read in `public/r/` is what is in `src/`.

Raw URL pattern for a hosted read:
`https://raw.githubusercontent.com/sawissac/compacto-ui/main/public/r/<name>.json`

## Item types and targets

| `type`               | Target in the consumer       | Items                                        |
| -------------------- | ---------------------------- | -------------------------------------------- |
| `registry:ui`        | `components/ui/<name>.tsx`   | every component                              |
| `registry:lib`       | `lib/<name>.ts`              | `cn`, `ui-styles`, `color-themes`            |
| `registry:component` | `providers/<name>.tsx`       | `palette-provider`                           |
| `registry:file`      | `styles/compacto/<file>.css` | `styles` (4 files), `compat-shadcn` (opt-in) |

Targets are relative to the directory the consumer's `@/*` alias points at
(usually `src/`). Every copied file imports its siblings via `@/...`
(`@/lib/cn`, `@/components/ui/button`), so keeping these targets is what makes
the copies resolve without edits.

## Dependency graph

Resolve top-down; `cn` is a dependency of nearly everything and is written once.

| Item               | Type      | Registry deps                         | npm deps                                                           |
| ------------------ | --------- | ------------------------------------- | ------------------------------------------------------------------ |
| `cn`               | lib       | —                                     | `clsx`, `tailwind-merge`                                           |
| `ui-styles`        | lib       | `cn`                                  | `class-variance-authority`                                         |
| `color-themes`     | lib       | —                                     | —                                                                  |
| `styles`           | file      | —                                     | —                                                                  |
| `compat-shadcn`    | file      | —                                     | —                                                                  |
| `palette-provider` | component | `color-themes`                        | —                                                                  |
| `button`           | ui        | `cn`                                  | `class-variance-authority`, `radix-ui`                             |
| `button-group`     | ui        | `cn`, `separator`                     | `class-variance-authority`                                         |
| `calendar`         | ui        | `cn`, `button`                        | `react-day-picker`, `date-fns`, `lucide-react`                     |
| `command`          | ui        | `cn`, `dialog`                        | `cmdk`, `lucide-react`                                             |
| `data-table`       | ui        | `cn`                                  | `@tanstack/react-table`, `@tanstack/react-virtual`, `lucide-react` |
| `date-picker`      | ui        | `cn`, `button`, `calendar`, `popover` | `lucide-react`                                                     |
| `dialog`           | ui        | `cn`, `button`                        | `radix-ui`, `lucide-react`                                         |
| `dropdown-menu`    | ui        | `cn`                                  | `radix-ui`, `lucide-react`                                         |
| `error-boundary`   | ui        | `cn`                                  | `lucide-react`                                                     |
| `file-upload`      | ui        | `cn`, `button`, `progress`            | `react-dropzone`, `lucide-react`                                   |
| `input`            | ui        | `cn`, `ui-styles`                     | `lucide-react`                                                     |
| `option-grid`      | ui        | `cn`                                  | `lucide-react`                                                     |
| `option-list`      | ui        | `cn`                                  | `lucide-react`                                                     |
| `option-palette`   | ui        | `cn`, `color-themes`, `option-grid`   | —                                                                  |
| `popover`          | ui        | `cn`                                  | `radix-ui`                                                         |
| `progress`         | ui        | `cn`, `ui-styles`                     | `class-variance-authority`, `radix-ui`                             |
| `resizable`        | ui        | `cn`                                  | `react-resizable-panels`                                           |
| `select`           | ui        | `cn`                                  | `radix-ui`, `lucide-react`                                         |
| `separator`        | ui        | `cn`                                  | `radix-ui`                                                         |
| `sidebar`          | ui        | `cn`, `ui-styles`                     | `class-variance-authority`, `radix-ui`                             |
| `skeleton`         | ui        | `cn`                                  | —                                                                  |
| `slider`           | ui        | `cn`, `ui-styles`                     | `class-variance-authority`, `radix-ui`                             |
| `tabs`             | ui        | `cn`                                  | `class-variance-authority`, `radix-ui`                             |
| `tooltip`          | ui        | `cn`                                  | `radix-ui`                                                         |

This table is derived from `registry.json`; if they ever disagree, the JSON
wins.

## Resolution algorithm

Given a request for item `X`:

1. Read `public/r/X.json`.
2. For every name in `registryDependencies`, recurse — resolve and copy it
   first, deduped.
3. Union every `dependencies` entry across all resolved items into **one**
   `pnpm add` (or `npm install` / `yarn add`).
4. Write each resolved item's `files[].content` to `<alias root>/files[].path`
   in the consumer, creating directories as needed. **Do not silently
   overwrite** a file that already exists and differs — show a diff or ask.
   (The consumer may have local edits; the `data-slot` and export names are
   the stable contract, so a merge is usually mechanical.)
5. If the consumer has never installed `styles`, copy it too — every component
   assumes `--app-*` variables exist. `compat-shadcn` is opt-in only.
6. If the consumer has no theming yet, copy `palette-provider` (or fold its
   effect into an existing provider) and mount it in the root layout.

## One-time app setup

**Stylesheet.** After copying `styles` to `src/styles/compacto/`, the app's
Tailwind entry becomes:

```css
@import "tailwindcss";
@import "./compacto/index.css";

@custom-variant dark (&:is(.dark *));

/* Supply your own faces to the design system's font slots. */
:root {
  --app-font-sans: var(--font-open-sans);
  --app-font-title: var(--font-poppins);
  --app-font-display: var(--font-poppins);
  --app-font-description: var(--font-open-sans);
  --app-font-mono: var(--font-jetbrains-mono);
}

body {
  background-color: var(--app-bg);
  color: var(--app-text);
  font-family: var(--font-sans);
}
```

The `@custom-variant dark` line is for third-party CSS in the app, not for
these components — they carry no `dark:` classes. Omit it if nothing else
needs it.

**Fonts.** The reference faces are Poppins (title/display), Open Sans
(sans/description) and JetBrains Mono. Any face works; unset slots fall back
to system stacks.

**Theming.** Mount `PaletteProvider` once (root layout) and drive it with
`OptionPalette` or `usePalette()`:

```tsx
import { PaletteProvider } from "@/providers/palette-provider";

<PaletteProvider defaultPalette="midnight-dark">{children}</PaletteProvider>;
```

It writes `appThemeCssVars(theme)` onto `document.documentElement` and toggles
`.dark` from `theme.isLight`. Persistence is the app's job: read the saved
key into `defaultPalette`, save from wherever `setPalette` is called.

**Tailwind content.** Tailwind v4 auto-detects sources under the project, so
copied files under `src/` are scanned with no config. If the build restricts
scanning, add `@source "./components/ui"; @source "./styles/compacto";`.

## Reach for a registry item before hand-rolling

When a consuming app needs one of these, copy the item — do not write the
markup from scratch and do not add a second library for the same job:

- **`data-table`** — any list of more than a screenful of homogeneous rows:
  request history, logs, a collection's entries, an audit trail. Sortable or
  not. Never a hand-rolled `<table>` over `.map()` for this.
- **`option-grid`** — a picker where a preview matters more than a label
  (a colour, a texture, a layout thumbnail).
- **`option-palette`** — the `--app-*` theme picker itself.
- **`option-list`** — rows with icon + label + one-line description + check.
- **`date-picker`** — a date, time or datetime on a form: the trigger button,
  the popover and the calendar wired to one `Date`. Never a bare `Calendar`
  dropped inline where a field belongs.
- **`command`** — any searchable list or command palette (`CommandDialog`).
- **`file-upload`** — any "choose or drop files" surface with a list of what
  was picked. `accept` and `maxSize` are enforced by the component; the
  upload itself is yours — mirror its state into `files`.
- **`progress`** — any determinate progress readout, and the indeterminate
  one via `value={null}`. Never a hand-rolled `<div>` with a width style.
- **`slider`** — any single-value numeric range control (a temperature, a
  width, a zoom). It is scalar: `onValueChange` gives you a number.
- **`sidebar`** — an app rail/sidebar shell, with optional `texture`.
- **`error-boundary`** — wrap any subtree that fetches or renders untrusted
  data; it has the flat fallback and a retry button already.

### `data-table` specifically

- It is `@tanstack/react-table` **v9** + `@tanstack/react-virtual`. v9's API
  is not v8's: `useTable({ features, columns, data })`, not `useReactTable`
  with `getCoreRowModel()`; features are registered explicitly. The component
  hides all of that, but if you extend it, read the skills the package ships
  (`node_modules/@tanstack/react-table/skills/`) rather than v8 memory.
- Build columns with the exported `dataTableColumnHelper<Row>()` at module
  scope. A def from a bare `createColumnHelper()` will not type-check against
  the table's registered feature set.
- Keep `columns` and `data` referentially stable. Rows are virtualised over the
  _sorted_ model; give it a bounded height (`height` prop or a `className`
  like `h-full` inside a constrained parent).
- Columns are resizable by default (drag the hairline at a header's right
  edge; double-click resets). Persist widths through `onColumnSizingChange`
  and hand them back as `defaultColumnSizing`; `resizable={false}` turns the
  handles off.
- Its `dependencies` list both TanStack packages — install them with the copy.

## Per-component facts

`src/catalog/api.ts` is plain data: for every component, its named `exports`,
the `props` worth knowing (name, type, default, description) and `notes` —
the gotchas (a prop a component throws without, an attribute a third party
overwrites, a variant that is a tint rather than a block). Read it before
using a component you have not used before; it is shorter than the source.

## Writing new components that match

When the consumer needs something this library does not have, write it to
the same rules so it sits next to the copied ones without looking foreign:

1. Read [DESIGN.md](DESIGN.md) for tokens, type scale, states and motion.
2. Follow [CLAUDE.md](CLAUDE.md): function declarations, no `forwardRef`,
   `data-slot` on every element, `cn(...)` with `className` last, `--app-*`
   only, no `dark:`, no colourless `border`, every user-visible string a prop
   with an English default.
3. Compose from `@/lib/ui-styles` recipes (`ui.input`, `ui.label`,
   `ui.iconBtn`, `ui.card`, `ui.row`, …) before writing new class strings.
4. Copy `scripts/check-conventions.mjs` into the consumer if you want the
   same mechanical guard there — it is a zero-dependency Node script.

If the new component is generic enough for both consuming apps, add it
**here** instead and copy it out — that is the whole point of this repo.

## Conventions the copied code assumes

- Path alias `@/*` resolves to the consumer app's `src/` (or app root) —
  standard for a Next.js app scaffolded with `create-next-app` or an existing
  shadcn/ui setup. If the target app uses a different alias, rewrite imports
  accordingly after copying.
- Tailwind v4 with the `app-*` colour namespace generated from `--app-*`
  variables (`styles/compacto/tokens.css` and `theme.css` after copying).
- React 19 (`ref` as a plain prop — the components never `forwardRef`).
- `lucide-react` for icons wherever an item lists it.

## Verification checklist after a copy

Run in the consumer:

```bash
pnpm typecheck                                  # @/ imports resolve, React 19 types
grep -rn "dark:" src/components/ui              # expect nothing
grep -rnE "\b(bg|text|border)-(primary|muted|border|foreground)\b" src/components/ui   # expect nothing
grep -rn "from \"\.\./" src/components/ui       # expect nothing — all @/
```

Then render one component in a page and confirm it is coloured — an unstyled
result means Tailwind never scanned the copied files or `styles` was not
imported.

## Maintaining this repo

```bash
pnpm registry:build     # regenerate public/r/*.json from registry.json + src
pnpm registry:check     # fail if public/r is stale
pnpm conventions        # fail on dark:, shadcn tokens, relative imports, bare border, …
pnpm check              # format:check + lint + typecheck + conventions + registry:check
```

Adding a component: write `src/components/ui/<name>.tsx`, add its entry to
`registry.json` (deps, registryDependencies, source → target), add it to
`src/catalog/api.ts` and `src/catalog/entries.tsx` for the gallery, then
`pnpm registry:build`. Editing a component: edit the source, then
`pnpm registry:build`. Commit the regenerated `public/r/` with the change.

## Keeping a consumer in sync

`skills/cui-diff/SKILL.md` and `skills/cui-sync/SKILL.md` are Claude Code
skills for the consuming repo: `/cui-diff` reports which copied items differ
from `public/r/` upstream; `/cui-sync` rewrites them. Install instructions
and the copyable prompt are in the README's **Skills** section. Both resolve
files the same way this document does — `tsconfig` alias root +
`files[].path` — so they need no configuration.

## What NOT to do

- Don't `npm install @compacto/ui` or `npm publish` from this repo — that
  flow was removed. There is no package.
- Don't hand-edit `public/r/*.json`; it is generated. Edit `src/` and
  `registry.json`, then `pnpm registry:build`.
- Don't invent a `target` path other than what the item specifies unless the
  user asks for a different layout — the whole point of a fixed convention is
  that components' `registryDependencies` imports (`@/components/ui/button`,
  `@/lib/cn`) resolve without per-copy edits.
- Don't add `dark:` variants or shadcn semantic tokens to a copied component
  "to make it fit" — switch the palette instead, or import `compat-shadcn.css`
  during a migration.
