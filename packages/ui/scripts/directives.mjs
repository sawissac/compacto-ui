#!/usr/bin/env node
/**
 * Mirror each source file's `"use client"` directive onto its build output,
 * then prove the result against the rules that actually matter.
 *
 * Why this exists rather than an esbuild plugin: esbuild's transform has
 * historically dropped leading directives it does not recognise, and which
 * versions do that has changed more than once. Rather than bet the build on a
 * third-party plugin tracking that, we read the truth off the source tree and
 * write it onto the output ourselves. The operation is idempotent — if esbuild
 * already preserved the directive, nothing is changed.
 *
 * Two classes of check, both fatal:
 *
 *   1. **Mirror.** A source file that opens with `"use client"` must produce an
 *      output file that opens with it too. Missing ones are prepended.
 *   2. **Server-safe allowlist.** Six modules must NEVER carry the directive.
 *      Three of them are primitives a consumer is entitled to render from a
 *      Server Component (`button`, `button-group`, `skeleton`); the other three
 *      are the pure-data modules (`cn`, `ui.styles`, `color-themes`) and the
 *      barrel. A directive appearing on any of them is a source-authoring bug
 *      that would poison a consumer's server tree, so it fails the build rather
 *      than being silently stripped.
 *
 * The directive must also be the FIRST statement in the file — Next only
 * honours it there, and a sourcemap comment or hoisted import ahead of it makes
 * it dead text.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const PKG = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(PKG, "src");
const DIST = join(PKG, "dist");

/** Modules that must never carry `"use client"`. See the block comment above. */
const SERVER_SAFE = new Set([
  "index.js",
  "lib/cn.js",
  "styles/ui.styles.js",
  "constants/color-themes.js",
  "components/button.js",
  "components/button-group.js",
  "components/skeleton.js",
]);

const DIRECTIVE = '"use client";';

/** Recursively list files under `dir` matching `test`, as paths relative to it. */
function walk(dir, test, base = dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      out.push(...walk(full, test, base));
    } else if (test(name)) {
      out.push(relative(base, full));
    }
  }
  return out;
}

/** True when `source` opens with a use-client directive, ignoring leading blanks. */
function opensWithUseClient(source) {
  return /^\s*(["'])use client\1\s*;?/.test(source);
}

const errors = [];
let patched = 0;

const sources = walk(SRC, (n) => /\.tsx?$/.test(n) && !/\.test\.tsx?$/.test(n));

for (const rel of sources) {
  const outRel = rel.replace(/\.tsx?$/, ".js");
  const outPath = join(DIST, outRel);

  let out;
  try {
    out = readFileSync(outPath, "utf8");
  } catch {
    errors.push(`${outRel} — source exists but nothing was emitted for it`);
    continue;
  }

  const wantsClient = opensWithUseClient(readFileSync(join(SRC, rel), "utf8"));
  const hasClient = opensWithUseClient(out);

  if (SERVER_SAFE.has(outRel) && (wantsClient || hasClient)) {
    errors.push(
      `${outRel} — must stay server-safe, but carries "use client". ` +
        `Remove the directive from src/${rel}.`,
    );
    continue;
  }

  if (wantsClient && !hasClient) {
    writeFileSync(outPath, `${DIRECTIVE}\n${out}`);
    patched += 1;
  }
}

// Anything in dist with a directive that is not first is worse than useless:
// it reads as a plain string expression and the module is treated as server.
for (const rel of walk(DIST, (n) => n.endsWith(".js"))) {
  const body = readFileSync(join(DIST, rel), "utf8");
  if (/["']use client["']/.test(body) && !opensWithUseClient(body)) {
    errors.push(
      `${rel} — "use client" appears but is not the first statement, so it has no effect.`,
    );
  }
}

if (errors.length > 0) {
  console.error("\n\x1b[31mdirective check failed\x1b[0m");
  for (const e of errors) {
    console.error(`  • ${e}`);
  }
  process.exit(1);
}

const clientCount = sources.filter((rel) =>
  opensWithUseClient(readFileSync(join(SRC, rel), "utf8")),
).length;
console.log(
  `directives ok — ${clientCount} client module(s), ` +
    `${sources.length - clientCount} server-safe (${patched} patched)`,
);
