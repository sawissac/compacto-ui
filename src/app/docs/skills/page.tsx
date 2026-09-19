"use client";

import { Code } from "@/components/docs/code";
import { Notes } from "@/components/docs/notes";
import { PageShell, Section } from "@/components/docs/page-shell";

const RAW =
  "https://raw.githubusercontent.com/sawissac/compacto-ui/main/skills";

const INSTALL_PROMPT = `Install the compacto-ui skills into this repo. Fetch each URL with curl and write the body verbatim to the path shown, creating directories:

${RAW}/cui-diff/SKILL.md -> .claude/skills/cui-diff/SKILL.md
${RAW}/cui-sync/SKILL.md -> .claude/skills/cui-sync/SKILL.md

Then run /cui-diff and show me the report.`;

const SKILLS = [
  {
    name: "/cui-diff",
    args: "[item ...] [--ref <branch>] [--source <path>]",
    summary:
      "Read-only. Compares every copied component against public/r/ upstream and reports in sync, outdated (with a diff and whether the file has local edits), or not installed — plus local-only components and npm packages the outdated items need.",
  },
  {
    name: "/cui-sync",
    args: "[item ...] [--all] [--force] [--ref <branch>] [--source <path>]",
    summary:
      "Rewrites outdated copies from upstream, pulls in any registryDependencies they now need, prints the install command for missing npm packages, and runs typecheck. Skips files with uncommitted local changes unless --force.",
  },
] as const;

export default function Page() {
  return (
    <PageShell
      title="Skills"
      lede="Two Claude Code skills that keep a consuming repo's copies current. They live in skills/ in this repo and install into the consuming repo's .claude/skills/."
      toc={[
        { id: "what", label: "What they do" },
        { id: "install", label: "Install" },
        { id: "usage", label: "Usage" },
        { id: "how", label: "How they resolve files" },
      ]}
    >
      <Section id="what" title="What they do">
        <div className="flex flex-col gap-3">
          {SKILLS.map((s) => (
            <div
              key={s.name}
              className="rounded-md border border-app-border bg-app-hover px-4 py-3"
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <code className="font-mono text-[13px] font-semibold text-app-bright">
                  {s.name}
                </code>
                <code className="font-mono text-[11px] text-app-dim">
                  {s.args}
                </code>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-app-text">
                {s.summary}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="install" title="Install">
        <p className="mb-3 text-[13px] leading-relaxed text-app-text">
          Paste this into Claude Code inside the consuming repo. It fetches both
          skill files from this repository and writes them where Claude Code
          discovers project skills.
        </p>
        <Code block>{INSTALL_PROMPT}</Code>
        <p className="mt-3 text-[13px] leading-relaxed text-app-dim">
          Commit <code className="font-mono">.claude/skills/</code> so every
          contributor gets the same two commands. Re-run the prompt to pick up a
          newer version of a skill.
        </p>
      </Section>

      <Section id="usage" title="Usage">
        <div className="flex flex-col gap-2">
          <Code>{`/cui-diff`}</Code>
          <Code>{`/cui-diff button dialog`}</Code>
          <Code>{`/cui-sync`}</Code>
          <Code>{`/cui-sync data-table --force`}</Code>
          <Code>{`/cui-sync --source ../compacto-ui`}</Code>
        </div>
        <Notes
          notes={[
            "/cui-sync with no arguments updates only items already installed — it never adds a component you did not ask for. Name an item to install it; --all bootstraps everything.",
            "A file with uncommitted local changes is skipped and its diff against upstream printed. Commit or stash, then rerun — or rerun with --force to overwrite.",
            "--ref pins a branch, tag or commit of compacto-ui; --source reads public/r/ from a local checkout instead of the network, for offline work or an unpushed branch.",
            "Neither skill edits compacto-ui. If a local change should go upstream, that is a PR to this repo.",
          ]}
        />
      </Section>

      <Section id="how" title="How they resolve files">
        <Notes
          notes={[
            'The alias root comes from the consuming repo\'s tsconfig.json — compilerOptions.paths["@/*"], usually ./src/*. Every registry file path is joined onto it, so the skills need no configuration.',
            "Comparison is byte-for-byte against files[].content in public/r/<name>.json — the same artifact an agent or the shadcn CLI copies. A formatting-only difference still counts as outdated; the report says when a diff is whitespace-only.",
            "Both skills stop if the fetch fails. They never reconstruct a component from memory.",
          ]}
        />
      </Section>
    </PageShell>
  );
}
