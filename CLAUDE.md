# compacto-ui — code style contract

`@compacto/ui` is the shared primitive library for `waux-ai-studio` and
`bulky-api`. Both apps previously kept their own copies of these components;
this repo exists so one edit reaches both. That means every rule below is load
bearing — a slip here ships to two production apps at once.

## Component conventions

- **Function declarations, never arrow consts.** `function Button({...})`, not
  `const Button = ({...}) =>`.
- **No `forwardRef`.** React 19 passes `ref` as a plain prop. ESLint enforces
  this in `packages/ui/src/components/**`.
- **`data-slot="kebab-name"` on every rendered element.** This is how consumers
  target our internals from their own CSS and tests. `Button` additionally
  carries `data-variant` and `data-size`.
- **`cn(...)` with the caller's `className` last**, always — that ordering is
  what lets a consumer override any built-in class, and there is a contract
  test asserting it.
- **One trailing `export { ... }` block**, alphabetized. No inline `export`
  keywords on the declarations.
- **Props typed inline** as `React.ComponentProps<"el">` or
  `React.ComponentProps<typeof Primitive.X>` intersected with a small extras
  object. Export a named props type only when consumers need to spell it.

## Imports

- **Every relative import carries an explicit `.js` extension** —
  `import { cn } from "../lib/cn.js"`. The build runs `bundle: false`, which
  does not rewrite specifiers, so an extensionless import produces invalid
  output. TypeScript accepts `.js` under `moduleResolution: "bundler"`.
- No path aliases inside `packages/ui`. Relative only.

## Tokens

- **`--app-*` vocabulary only.** Never `bg-primary`, `text-muted-foreground`,
  `border-border` or any other shadcn semantic utility.
- **No `dark:` variants.** The ten palettes in `constants/color-themes.ts` are
  complete palettes, not a light/dark pair — `light` is simply the one with
  `isLight: true`. `--app-*` already resolves to the right value for whichever
  palette is active, so a `dark:` clause can only drift away from it.
- **Never write a colorless `border` / `border-b` / `border-x`.** The consuming
  apps have a `@layer base { * { @apply border-border } }` rule that silently
  supplies a color; this library does not, so a bare border falls back to
  `currentColor`. Always pair it with `border-app-*`.
- The library owns its own keyframes. Do not use `tw-animate-css` classes
  (`animate-in`, `fade-in-0`, …) — they are a dependency we deliberately
  do not have.

`pnpm gates` checks the first three of these mechanically; the tw-animate-css
rule is on you.

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
pnpm build       # build the package (runs verify-directives, publint, attw)
pnpm test        # contract + exports tests
pnpm gates       # the four source-level greps above
pnpm lint
pnpm typecheck
pnpm dev         # the docs gallery
```
