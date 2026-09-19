# compacto-ui — code style contract

compacto-ui is the shared primitive library for `waux-ai-studio` and
`bulky-api`. Both apps previously kept their own copies of these components;
this repo exists so one edit reaches both. That means every rule below is load
bearing — a slip here ships to two production apps at once.

## Component conventions

- **Function declarations, never arrow consts.** `function Button({...})`, not
  `const Button = ({...}) =>`.
- **No `forwardRef`.** React 19 passes `ref` as a plain prop. ESLint enforces
  this in `src/components/ui/**`.
- **`data-slot="kebab-name"` on every rendered element.** This is how consumers
  target our internals from their own CSS and tests. `Button` additionally
  carries `data-variant` and `data-size`.
- **`cn(...)` with the caller's `className` last**, always — that ordering is
  what lets a consumer override any built-in class.
- **One trailing `export { ... }` block**, alphabetized. No inline `export`
  keywords on the declarations.
- **Props typed inline** as `React.ComponentProps<"el">` or
  `React.ComponentProps<typeof Primitive.X>` intersected with a small extras
  object. Export a named props type only when consumers need to spell it.

## Imports

- **Import primitives and helpers via the `@/...` alias, never relative** —
  `import { cn } from "@/lib/cn"`, `import { Button } from "@/components/ui/button"`.
  This is what the registry build inlines verbatim into a copied component, so
  a relative import (`../lib/cn`) would resolve to the wrong place once
  copied out of this repo.
- No `.js` extension on the specifier — this is a Next.js app, not the old
  unbundled tsup build that required one.

## Tokens

- **`--app-*` vocabulary only.** Never `bg-primary`, `text-muted-foreground`,
  `border-border` or any other shadcn semantic utility.
- **No `dark:` variants.** The twenty-three palettes in `lib/color-themes.ts`
  are complete palettes, not light/dark pairs over a fixed accent — each one
  says whether it is light via `isLight`. `--app-*` already resolves to the
  right value for whichever palette is active, so a `dark:` clause can only
  drift away from it.
- **Never write a colorless `border` / `border-b` / `border-x`.** The consuming
  apps have a `@layer base { * { @apply border-border } }` rule that silently
  supplies a color; this library does not, so a bare border falls back to
  `currentColor`. Always pair it with `border-app-*`.
- The library owns its own keyframes. Do not use `tw-animate-css` classes
  (`animate-in`, `fade-in-0`, …) — they are a dependency we deliberately
  do not have.

`pnpm conventions` (`scripts/check-conventions.mjs`) catches all four
mechanically, plus relative imports, `.js` specifiers and inline `export`
declarations. It runs as part of `pnpm check`; keep it green.

## Copy and i18n

Every user-visible string is a **prop with an English default**. A published
library cannot reach an app's `t()`, so the i18n boundary lives at the call
site: waux passes `clearLabel={t("input.clear")}`, bulky passes nothing and
gets `"Clear"`. Default _parameter_ values are how this is expressed; a string
literal typed into JSX is an ESLint error.

## `data-testid`

Primitives spread `...props` onto a real DOM node, so a caller's `data-testid`
reaches the DOM for free — do not break that. Derive an id only for a node the
caller cannot otherwise reach (an inline clear button, a header's close X).

To derive one, **declare `"data-testid"?: string` on the props type and
destructure it**, then put it back on the root element by hand. React's
`ComponentProps` does not admit `data-*` keys even though JSX accepts them, so
reading `props["data-testid"]` off the rest props is a type error. When the
caller supplies no base, derive nothing.

The full contract is in `data-test-id-list.md` at the repo root.

## Documentation

JSDoc lives **in the component file**, never in a sidecar `.md`. A block above
the exported component explaining what it is and when to reach for it, plus
`@param props.x` for each meaningful prop, `{@link}` between related parts, and
a fenced `@example` for anything whose usage is not obvious. Describe the
component as it is now — several ported blocks described a design system that
had already been replaced.

## Commands

```bash
pnpm dev              # the docs gallery, localhost:3100
pnpm check            # format:check + lint + typecheck + conventions + registry:check
pnpm registry:build   # regenerate public/r/*.json after editing src/ or registry.json
pnpm build            # next build
```

## Distribution

Not published to npm — no `publishConfig`, no `pnpm publish`, no separate
package. Consuming apps (`waux-ai-studio`, `bulky-api`) copy component source
directly via `registry.json`, shadcn-registry-style. `public/r/<name>.json`
(the artifact an AI agent or the `shadcn` CLI actually reads) is **generated**
from `registry.json` + `src/` by `pnpm registry:build` — never hand-edit it.
After any change to a component, a lib file, a stylesheet, or an item's
`dependencies`, run the build and commit the regenerated JSON with the change;
`pnpm registry:check` fails the `check` script if you forget. Full protocol:
`AI-REFERENCE.md`; the design language itself: `DESIGN.md`.
