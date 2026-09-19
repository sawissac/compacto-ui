import { defineConfig } from "tsup";

/**
 * Transpile-only build (`bundle: false`).
 *
 * Every source file maps 1:1 to an output file, module boundaries are kept and
 * nothing is inlined. That is the whole point. A bundling build has to decide
 * which chunk a `"use client"` directive belongs to, and any answer it picks is
 * wrong for at least one of our entry points: `button`, `button-group` and
 * `skeleton` must stay server-safe while sharing `cn` with twelve client
 * modules. With `bundle: false` there are no chunks to get wrong — the
 * directive stays at the top of the file it was written in, and
 * `scripts/directives.mjs` afterwards proves it against an explicit map.
 *
 * Declarations come from `tsc --emitDeclarationOnly`, not tsup's `dts` option:
 * `dts` is a rollup-plugin-dts bundler and produces a flattened layout that
 * would not line up with this unbundled JS tree.
 *
 * Consequence for source code: every relative import must carry an explicit
 * `.js` extension. `bundle: false` does not rewrite specifiers, so an
 * extensionless import would emit invalid ESM.
 */
export default defineConfig({
  entry: ["src/**/*.ts", "src/**/*.tsx", "!src/**/*.test.*"],
  outDir: "dist",
  format: ["esm"],
  bundle: false,
  splitting: false,
  dts: false,
  sourcemap: true,
  clean: false,
  target: "es2022",
  platform: "browser",
  treeshake: false,
  outExtension: () => ({ js: ".js" }),
});
