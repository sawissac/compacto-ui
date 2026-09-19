#!/usr/bin/env node
/**
 * Build (or verify) the copy-in registry artifacts.
 *
 *   node scripts/build-registry.mjs          # write public/r/*.json
 *   node scripts/build-registry.mjs --check  # exit 1 if public/r is stale
 *
 * Reads `registry.json` (the manifest: where each item's source lives) and
 * inlines every `files[].source` as `content`, producing one self-contained
 * `public/r/<name>.json` per item — the artifact the `shadcn` CLI or an AI
 * agent actually copies — plus the `public/r/registry.json` index.
 *
 * Zero dependencies on purpose, so it runs in any checkout with only Node.
 * `--check` is what `pnpm check` runs; it is the mechanical guard against a
 * component edit that never reached its snapshot.
 */
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "r");
const CHECK = process.argv.includes("--check");

const manifest = JSON.parse(readFileSync(join(ROOT, "registry.json"), "utf8"));

/** Item JSON in the exact key order the existing snapshots use. */
function buildItem(item) {
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    dependencies: item.dependencies ?? [],
    registryDependencies: item.registryDependencies ?? [],
    files: item.files.map((f) => ({
      path: f.target,
      type: f.type ?? item.type,
      content: readFileSync(join(ROOT, f.source), "utf8"),
    })),
  };
}

function buildIndex() {
  return {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: manifest.name,
    homepage: manifest.homepage,
    items: manifest.items.map(({ name, type, title, description }) => ({
      name,
      type,
      title,
      description,
    })),
  };
}

const serialize = (obj) => JSON.stringify(obj, null, 2) + "\n";

const outputs = new Map();
for (const item of manifest.items) {
  outputs.set(`${item.name}.json`, serialize(buildItem(item)));
}
outputs.set("registry.json", serialize(buildIndex()));

// Files copied verbatim so the docs gallery can serve them at the site root.
const VERBATIM = ["llms.txt"];
const verbatim = new Map();
for (const name of VERBATIM) {
  const src = join(ROOT, name);
  if (existsSync(src)) {
    verbatim.set(name, readFileSync(src, "utf8"));
  }
}

mkdirSync(OUT, { recursive: true });

const stale = [];
const orphans = readdirSync(OUT).filter(
  (f) => f.endsWith(".json") && !outputs.has(f),
);

for (const [file, content] of outputs) {
  const dest = join(OUT, file);
  const current = existsSync(dest) ? readFileSync(dest, "utf8") : null;
  if (current !== content) {
    stale.push(`public/r/${file}`);
    if (!CHECK) {
      writeFileSync(dest, content);
    }
  }
}
for (const [file, content] of verbatim) {
  const dest = join(ROOT, "public", file);
  const current = existsSync(dest) ? readFileSync(dest, "utf8") : null;
  if (current !== content) {
    stale.push(`public/${file}`);
    if (!CHECK) {
      writeFileSync(dest, content);
    }
  }
}
for (const file of orphans) {
  stale.push(`public/r/${file} (not in registry.json)`);
  if (!CHECK) {
    unlinkSync(join(OUT, file));
  }
}

if (CHECK) {
  if (stale.length) {
    console.error(
      "Registry snapshots are stale. Run `pnpm registry:build` and commit:",
    );
    for (const s of stale) {
      console.error(`  - ${s}`);
    }
    process.exit(1);
  }
  console.log(`registry: ${outputs.size} artifacts up to date`);
} else {
  console.log(
    stale.length
      ? `registry: wrote ${stale.length} file(s)\n${stale.map((s) => `  - ${s}`).join("\n")}`
      : `registry: ${outputs.size} artifacts already up to date`,
  );
}
