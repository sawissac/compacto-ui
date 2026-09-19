# DESIGN — the compacto-ui design language

This file is the design _specification_, independent of any component. Read
it when you need to reproduce the look in a codebase that does not copy the
React primitives — a different framework, hand-written CSS, a mockup — or
when you write a new component in a consuming app and need it to sit next to
the copied ones without looking foreign.

For copying the actual components see [AI-REFERENCE.md](AI-REFERENCE.md).
For the code-style rules the components follow see [CLAUDE.md](CLAUDE.md).

## 1. Principles

1. **Flat.** No box-shadows for elevation, no gradients, no glass. Layers are
   distinguished by surface tone (`bg` → `panel` → `sidebar`) and hairline
   borders, never by depth.
2. **One accent voice.** Each palette has exactly one accent hue. It is used
   for the primary action, focus rings, selected outlines and links. Status
   colours (`success` / `warn` / `error`) are the only other hues.
3. **Feedback by colour, not motion or size.** Hover changes fill; press
   settles by 1px; selection is a border/ring change. Nothing scales on hover
   except the deliberately playful `solidBtn` recipe.
4. **Rest state reserves its border.** Interactive elements carry a
   transparent 1px border at rest so hover/focus can paint it without shifting
   layout. This is also what lets grouped controls collapse their seams.
5. **Palettes are complete.** A theme is a whole palette, not a light/dark
   overlay on a fixed accent. There is no `dark:` styling anywhere; the active
   palette decides everything through `--app-*` variables.
6. **Dense but breathable.** Control height is 32px (`h-8`), body copy is
   12–13px, labels 11px. Spacing steps are Tailwind's 0.5/1/1.5/2/2.5/3/4.
7. **Two kinds of text.** Aside from code, every string is either a **title**
   (heading, label, button text — `font-title`) or a **description** (body,
   help, captions — `font-description`).

## 2. Colour tokens

Every colour the system uses is one of these twenty custom properties. In
Tailwind they surface as the `app-*` namespace (`bg-app-panel`,
`text-app-dim`, `border-app-border-mid`, `ring-app-accent`).

| Token                 | Role                                                              | Typical use                                     |
| --------------------- | ----------------------------------------------------------------- | ----------------------------------------------- |
| `--app-bg`            | Page background — the deepest surface                             | `<body>`, input fields, outline-button fill     |
| `--app-panel`         | Card / popover / dialog surface, one step up from `bg`            | `DialogContent`, `PopoverContent`, table body   |
| `--app-sidebar`       | Sidebar / secondary / muted surface — a third distinct tone       | `Sidebar`, secondary button fill                |
| `--app-hover`         | Translucent hover wash (composites over any surface)              | `hover:bg-app-hover`, grouped-control container |
| `--app-selected`      | Translucent selected/active wash                                  | active row, active tab, `data-selected`         |
| `--app-border`        | Hairline border                                                   | cards, dividers, outline buttons                |
| `--app-border-mid`    | Slightly stronger border                                          | inputs, selects, table frame                    |
| `--app-border-accent` | Accent-tinted border                                              | hovered inputs, active outlines                 |
| `--app-accent`        | The palette's single accent hue                                   | primary button fill, focus ring, links, checks  |
| `--app-accent-dim`    | Accent at ~55%                                                    | dimmed accent text and icons                    |
| `--app-accent-faint`  | Accent at ~8–14%                                                  | faint accent washes, `data-active` fills        |
| `--app-text`          | Default body text                                                 | paragraphs, table cells                         |
| `--app-bright`        | High-contrast text                                                | headings, emphasis, selected row label          |
| `--app-dim`           | De-emphasised text                                                | captions, placeholders, section labels, icons   |
| `--app-editor`        | Code-surface background                                           | code blocks, editors                            |
| `--app-gutter`        | Code gutter background                                            | line-number column                              |
| `--app-success`       | Status: positive                                                  | tags, inline status                             |
| `--app-warn`          | Status: caution                                                   | tags, inline status                             |
| `--app-error`         | Status: destructive / invalid                                     | destructive button tint, `aria-invalid` ring    |
| `--app-on-solid`      | Foreground for solid accent blocks (white on light, `bg` on dark) | text on `bg-app-accent`                         |

Rules of use:

- Never hard-code a hex in a component. Every colour is a token reference.
- `hover` and `selected` are **translucent** so they read correctly on any of
  the three surfaces.
- A **tag** (a small tinted label) sets only its text colour and uses the
  `tint-current` utility for fill/border derived from `currentColor`.
- Status colours are _tints_ for backgrounds (`bg-app-error/10`) and solid
  for text/icons. A destructive button is `bg-app-error/10 text-app-error`,
  never a solid red block.

## 3. Palettes

Twenty-three palettes across twelve hues live in `src/lib/color-themes.ts`
(registry item `color-themes`). Each hue has a dark and a light variant except
**Chocolate**, which is light-only (key `light`, the default).

| Hue       | dark key         | light key         |
| --------- | ---------------- | ----------------- |
| Midnight  | `midnight-dark`  | `midnight-light`  |
| Ocean     | `ocean-dark`     | `ocean-light`     |
| Chocolate | —                | `light`           |
| Amethyst  | `purple-dark`    | `purple-light`    |
| Nature    | `green-dark`     | `green-light`     |
| Rose      | `rose-dark`      | `rose-light`      |
| Amber     | `amber-dark`     | `amber-light`     |
| Slate     | `slate-dark`     | `slate-light`     |
| Sunset    | `flat-dark`      | `flat-light`      |
| Coffee    | `coffee-dark`    | `coffee-light`    |
| Cyberpunk | `cyberpunk-dark` | `cyberpunk-light` |
| Retro     | `retro-dark`     | `retro-light`     |

Applying one is a pure mapping: `appThemeCssVars(theme)` returns the twenty
`--app-*` values; write them onto `document.documentElement` and toggle the
`.dark` class from `!theme.isLight`. The `.dark` class exists **only** for
third-party CSS (Monaco, KaTeX, shiki) and the pre-hydration defaults in
`tokens.css` — component styling never reads it.

`tokens.css` ships a neutral light default (`:root`) and a neutral dark
default (`.dark`) so SSR output and the first frame before hydration already
look right.

## 4. Typography

Five font slots, supplied by the consumer via `--app-font-*` (unset, they
fall back to system stacks):

| Slot                    | CSS var                  | Tailwind class     | Reference face |
| ----------------------- | ------------------------ | ------------------ | -------------- |
| Titles, labels, buttons | `--app-font-title`       | `font-title`       | Poppins        |
| Body, help, captions    | `--app-font-description` | `font-description` | Open Sans      |
| Display (large titles)  | `--app-font-display`     | `font-display`     | Poppins        |
| Base sans               | `--app-font-sans`        | `font-sans`        | Open Sans      |
| Code                    | `--app-font-mono`        | `font-mono`        | JetBrains Mono |

Type scale (pixel sizes are deliberate — the system is dense):

| Role                     | Classes                                                                               |
| ------------------------ | ------------------------------------------------------------------------------------- |
| Section label            | `font-title text-[11px] font-semibold uppercase tracking-[0.14em] text-app-dim`       |
| Field label              | `font-title text-[11px] font-semibold leading-none text-app-dim`                      |
| Ghost/secondary button   | `text-[11px] font-semibold uppercase tracking-[0.07em]`                               |
| Solid button             | `text-[11px] font-bold uppercase tracking-[0.08em]`                                   |
| Control / input text     | `text-[12px] leading-[18px]`                                                          |
| Row title                | `font-title text-[12px] font-semibold`                                                |
| Body / docs prose        | `text-[13px] leading-relaxed text-app-text`                                           |
| Help / caption           | `font-description text-[11px] leading-snug text-app-dim`                              |
| Metadata (ids, counts)   | `font-mono text-[11px] text-app-dim`                                                  |
| Dialog title             | `font-display text-[13px] leading-6 font-semibold tracking-[-0.01em] text-app-bright` |
| Nav tab / list row label | `font-title text-[11px] font-semibold uppercase tracking-[0.06em]`                    |

## 5. Shape, spacing, motion

**Radius.** One base token, `--radius: 0.625rem`, mapped to Tailwind as
`rounded-sm` (−4px), `rounded-md` (−2px), `rounded-lg` (base), `rounded-xl`
(+4px). Controls and cards use `rounded-md`; overlays and grouped wrappers
use `rounded-lg`. A child inside a bordered `rounded-lg` wrapper uses
`calc(var(--radius-lg) - 1px)` so its curve meets the wrapper's inner edge.

**Sizes.** Control height `h-8` (32px) is the desktop minimum hit target;
`h-6` for `xs`, `h-9`/`h-10` for larger. Icon-only controls are square
(`size-8` default). Icons are 14–16px (`size-4` default, `size-3` inside
`xs`).

**Borders.** Always `1px`, always coloured explicitly — `border-app-border`
(hairline), `border-app-border-mid` (inputs), `border-app-border-accent`
(hover/active), `border-transparent` (reserved rest state). There is no base
rule that supplies a default border colour, so a bare `border` is a bug.

**Motion tokens** (in `tokens.css`; every transition references them):

| Token                       | Value                               |
| --------------------------- | ----------------------------------- |
| `--motion-duration-instant` | 80ms                                |
| `--motion-duration-fast`    | 150ms                               |
| `--motion-duration-base`    | 220ms                               |
| `--motion-duration-slow`    | 320ms                               |
| `--motion-ease-standard`    | `cubic-bezier(0.2, 0, 0, 1)`        |
| `--motion-ease-accelerate`  | `cubic-bezier(0.4, 0, 1, 1)`        |
| `--motion-ease-spring`      | `cubic-bezier(0.34, 1.56, 0.64, 1)` |

Rules: colour transitions use `transition-colors duration-200`. Every
floating surface (tooltip, popover, menu, select, dialog) enters with
`compacto-fade-up` — rises 6px into place, never scales. Exit is the
accelerate ease and ~30% shorter. `prefers-reduced-motion` collapses all of
it to short opacity changes. The library owns its keyframes; it does not use
`tw-animate-css`.

## 6. Interaction states

| State       | Treatment                                                                                                                                                                     |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rest        | transparent or hairline 1px border, no fill (ghost) or surface fill                                                                                                           |
| Hover       | `bg-app-hover` wash, text to `text-app-bright`; inputs go `border-app-border-accent`                                                                                          |
| Press       | `translate-y-px` (1px settle) — skipped on popup triggers so the anchored panel does not jump                                                                                 |
| Focus       | `focus-visible:border-app-accent` + `focus-visible:ring-2` (or `ring-3`) `ring-app-accent/30`; icon controls use `ring-2 ring-app-accent ring-offset-2` on the surface colour |
| Selected    | `bg-app-selected` + `border-app-border-accent`; list rows use an inset ring instead of a border so neighbours do not shift                                                    |
| Active      | `data-active:` → `border-app-border-accent bg-app-accent-faint text-app-accent`                                                                                               |
| Open (menu) | `aria-expanded` holds the hover fill while the menu is showing                                                                                                                |
| Disabled    | `disabled:pointer-events-none disabled:opacity-50`                                                                                                                            |
| Invalid     | `aria-invalid:border-app-error aria-invalid:ring-3 aria-invalid:ring-app-error/20`                                                                                            |

Reveal pattern for row actions: `reveal` (opacity 0 → 100 on group hover /
focus-within) or `dim` (opacity 60 → 100). Never use `display:none` for
hover-only controls — keyboard users need focus to reveal them.

## 7. Surfaces and textures

Three tonal layers: the page (`bg`), panels floating over it (`panel`),
and the rail/sidebar (`sidebar`). Tables and inputs sit on `bg`; cards,
popovers and dialogs on `panel`.

A sidebar may carry a decorative wash — `checker`, `dots` or `graph` — via
the `.compacto-texture--*` classes in `texture.css`. Each is drawn on a
`::before` from `color-mix()` of `--app-accent`, so it follows the palette,
and its strength is `--app-texture-alpha` (default 0.05).

## 8. Reproducing the design without Tailwind

Everything above reduces to the twenty `--app-*` variables plus `--radius`
and the motion tokens. To port to plain CSS or another framework:

1. Copy `src/styles/tokens.css` verbatim — it has no Tailwind at-rules.
2. Copy the palette data from `src/lib/color-themes.ts` (or read
   `public/r/color-themes.json`); it is pure data.
3. Translate the recipes in `src/lib/ui-styles.ts` — each is a short list of
   utilities whose intent the JSDoc states — into your own classes. The
   button variant table in `src/components/ui/button.tsx` and the field box
   in `ui-styles.input` are the two most load-bearing recipes.
4. Keep the invariants: transparent rest border, `hover`/`selected` as
   translucent washes, one accent, 11/12/13px type, 32px controls, 1px
   borders always coloured, no shadows.

## 9. Anti-patterns (things that make a screen look "not compacto")

- Drop shadows, elevation, gradients, blur/glass.
- A second accent colour, or a solid red destructive button.
- `dark:` variants, or a `.dark` selector in component CSS.
- shadcn semantic tokens (`bg-primary`, `text-muted-foreground`,
  `border-border`) — they are not defined unless the opt-in
  `compat-shadcn.css` bridge is imported, and that bridge is for migration only.
- A colourless `border`.
- Body text above 13px or labels that are not uppercase-tracked / sentence
  dim.
- Hover effects that scale or move layout.
