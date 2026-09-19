---
name: cui-sync
description: Pull the latest compacto-ui component source into this repo — updates every copied component (or the ones named) from the compacto-ui registry, adds new registry dependencies, and reports npm packages to install. Use when asked to "update ui components", "sync compacto-ui", or "pull the latest button/dialog/…".
---

# /cui-sync — update copied compacto-ui components from the registry

Write side of `/cui-diff`. Rewrites local copies of registry items with the
current upstream `content`. Run `/cui-diff` first if you want to see what
will change.

## Arguments

`/cui-sync [item ...] [--all] [--force] [--ref <branch|tag|sha>] [--source <path>]`

- No items and no `--all` → update every registry item that is **already
  installed** locally. Never installs new components unless named.
- `item ...` → update (or install) exactly these, plus any
  `registryDependencies` they need that are missing.
- `--all` → install every item in the registry (rare; for bootstrapping).
- `--force` → overwrite files that have uncommitted local changes (see step 5).
- `--ref` → git ref of compacto-ui (default `main`).
- `--source` → a local checkout of compacto-ui to read `public/r/` from
  instead of the network.

## Procedure

1. **Locate the alias root** — `tsconfig.json` → `compilerOptions.paths["@/*"]`
   (usually `./src/*`) → `ROOT`. Fall back to the repo root.

2. **Fetch the index** —
   `https://raw.githubusercontent.com/sawissac/compacto-ui/<ref>/public/r/registry.json`
   (or `<source>/public/r/registry.json`).

3. **Build the work list.**
   - Start with the requested items (or every item with at least one file
     already present under `ROOT`, or all, per the arguments).
   - For each, fetch `public/r/<name>.json`, then add every name in its
     `registryDependencies` that is not installed locally. Repeat until
     closed. Dedupe.
   - `styles` counts as installed when `ROOT/styles/compacto/tokens.css`
     exists. `compat-shadcn` is opt-in: never add it unless named.

4. **Guard against clobbering.** For every target file `ROOT/<files[].path>`
   that exists, run `git diff --quiet -- <file>`. If it has uncommitted
   changes and `--force` was not given, **skip it**, print the diff between
   the local file and upstream, and tell the user to commit/stash and rerun,
   or rerun with `--force`. Committed local edits are fine to overwrite —
   they are in history and `git diff` after the sync shows exactly what was
   lost, so the user can re-apply.

5. **Write.** For each remaining file, write `content` verbatim to
   `ROOT/<path>`, creating directories. Do not reformat, do not rewrite
   imports — `@/...` is what the consumer's alias resolves.

6. **Dependencies.** Union every synced item's `dependencies`. Compare against
   `package.json` (`dependencies` + `devDependencies`). Print the install
   command for the missing ones, using the repo's package manager (detect
   from the lockfile: `pnpm-lock.yaml` → `pnpm add`, `package-lock.json` →
   `npm install`, `yarn.lock` → `yarn add`, `bun.lockb` → `bun add`). Run it
   only if the user asked to install, or after confirming.

7. **Verify.** Run the repo's typecheck (`pnpm typecheck` / `npx tsc --noEmit`).
   If it fails on a synced file, report the error verbatim — usually a
   missing npm dependency (step 6) or a missing registry dependency, which
   means step 3 missed something; add it and rerun.

8. **Report.**

   ```
   updated   src/components/ui/button.tsx        +12 −4
   updated   src/styles/compacto/tokens.css      +1 −1
   added     src/lib/ui-styles.ts                (registryDependency of input)
   skipped   src/components/ui/dialog.tsx        uncommitted local changes — rerun with --force
   in sync   src/components/ui/tabs.tsx

   npm: pnpm add lucide-react
   typecheck: ok
   ```

   Then `git status --short` so the user sees the footprint.

## Rules

- Registry items only. Never touch files that are not a `files[].path` of
  some item.
- Never edit `registry.json` or `public/r/` in compacto-ui from here — if a
  local change should go upstream, say so; that is a PR to compacto-ui.
- If the network fetch fails, stop. Do not reconstruct a component from
  memory.
- Do not add `dark:` variants or shadcn semantic tokens to a synced file "to
  make it fit". Switch the palette or import `compat-shadcn.css` instead.
