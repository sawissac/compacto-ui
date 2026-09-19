---
"@compacto/ui": minor
---

Initial release: fifteen flat, token-driven React primitives extracted from the
copies that had been living in `waux-ai-studio` and `bulky-api`.

- `Button`, `ButtonGroup`, `Input`, `Select`, `Dialog`, `Popover`,
  `DropdownMenu`, `Tooltip`, `Tabs`, `Command`, `Calendar`, `Separator`,
  `Skeleton`, `Resizable`, `ErrorBoundary`, plus `cn`, the `ui.styles` class
  recipes, and the ten runtime colour palettes.
- Standardized on the `--app-*` token vocabulary. Every shadcn semantic
  utility and every `dark:` variant is gone: a palette is a complete palette,
  so `--app-*` already resolves correctly for whichever one is active.
  `@compacto/ui/compat-shadcn.css` aliases the semantic variables for apps
  still migrating.
- Ships ESM only, with a root barrel and per-component subpaths. `Button`,
  `ButtonGroup` and `Skeleton` are server-safe.
- No `tw-animate-css` dependency — the package owns its overlay keyframes.
- `forwardRef` is gone; React 19 passes `ref` as a plain prop.
- Every user-visible string is a prop with an English default, so the library
  needs no i18n dependency of its own.
