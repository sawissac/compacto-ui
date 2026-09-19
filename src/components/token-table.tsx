"use client";

import { COLOR_THEMES } from "@/lib/color-themes";

import { usePalette } from "@/providers/palette-provider";

/**
 * Every `--app-*` token as the active palette resolves it. This is the answer
 * to "which token do I reach for" — the swatch shows what a name actually
 * means, and flipping palettes shows which names carry the palette's character
 * and which stay put.
 */
const TOKENS = [
  ["--app-bg", "bg"],
  ["--app-panel", "bgPanel"],
  ["--app-sidebar", "bgSidebar"],
  ["--app-hover", "bgHover"],
  ["--app-selected", "bgSelected"],
  ["--app-border", "border"],
  ["--app-border-mid", "borderMid"],
  ["--app-border-accent", "borderAccent"],
  ["--app-accent", "accent"],
  ["--app-accent-dim", "accentDim"],
  ["--app-accent-faint", "accentFaint"],
  ["--app-text", "text"],
  ["--app-bright", "textBright"],
  ["--app-dim", "textDim"],
  ["--app-editor", "editorBg"],
  ["--app-gutter", "gutterBg"],
  ["--app-success", "success"],
  ["--app-warn", "warn"],
  ["--app-error", "error"],
] as const;

export function TokenTable() {
  const { palette } = usePalette();
  const theme = COLOR_THEMES[palette] as unknown as Record<string, string>;

  return (
    <div className="overflow-x-auto rounded-lg border border-app-border-mid">
      <table className="w-full min-w-[34rem] border-collapse text-left">
        <thead>
          <tr className="border-b border-app-border bg-app-panel">
            <th className="px-3 py-2 text-[11px] font-semibold tracking-[0.08em] text-app-dim uppercase">
              Token
            </th>
            <th className="px-3 py-2 text-[11px] font-semibold tracking-[0.08em] text-app-dim uppercase">
              Utility
            </th>
            <th className="px-3 py-2 text-[11px] font-semibold tracking-[0.08em] text-app-dim uppercase">
              Value
            </th>
            <th className="w-16 px-3 py-2 text-[11px] font-semibold tracking-[0.08em] text-app-dim uppercase">
              Swatch
            </th>
          </tr>
        </thead>
        <tbody>
          {TOKENS.map(([token, key]) => (
            <tr
              key={token}
              className="border-b border-app-border last:border-0"
            >
              <td className="px-3 py-1.5 font-mono text-[11px] text-app-text">
                {token}
              </td>
              <td className="px-3 py-1.5 font-mono text-[11px] text-app-dim">
                {token.replace("--app-", "")}
              </td>
              <td className="px-3 py-1.5 font-mono text-[11px] text-app-dim">
                {theme[key]}
              </td>
              <td className="px-3 py-1.5">
                <span
                  aria-hidden
                  className="block size-5 rounded-sm border border-app-border-mid"
                  style={{ background: theme[key] }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
