"use client";

import { Check } from "lucide-react";

import {
  COLOR_THEME_PAIRS,
  COLOR_THEMES,
  type ColorTheme,
  type ColorThemeKey,
} from "@/lib/color-themes";
import { usePalette } from "@/providers/palette-provider";

function PaletteCard({
  themeKey,
  theme,
  active,
  onSelect,
}: {
  themeKey: ColorThemeKey;
  theme: ColorTheme;
  active: boolean;
  onSelect: (key: ColorThemeKey) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(themeKey)}
      aria-pressed={active}
      data-testid={`palette-card-${themeKey}`}
      className={[
        "relative flex flex-1 flex-col gap-2 rounded-lg border p-3 text-left transition-colors duration-(--motion-duration-fast)",
        active
          ? "border-app-accent ring-2 ring-app-accent/30"
          : "border-app-border-mid hover:border-app-border-accent",
      ].join(" ")}
      style={{ background: theme.bgPanel }}
    >
      {active && (
        <span
          aria-hidden
          className="absolute top-2 right-2 flex size-4 items-center justify-center rounded-full border"
          style={{
            background: theme.accent,
            borderColor: theme.border,
            color: theme.isLight ? "#ffffff" : theme.bg,
          }}
        >
          <Check className="size-2.5" strokeWidth={3} />
        </span>
      )}
      <div className="flex gap-1">
        {[theme.bg, theme.bgSidebar, theme.accent, theme.textBright].map(
          (c, i) => (
            <span
              key={i}
              aria-hidden
              className="size-4 rounded-sm"
              style={{ background: c, border: `1px solid ${theme.border}` }}
            />
          ),
        )}
      </div>
      <span
        className="font-title text-[12px] font-semibold"
        style={{ color: theme.textBright }}
      >
        {themeKey}
      </span>
      <span className="font-mono text-[10px]" style={{ color: theme.textDim }}>
        {theme.isLight ? "light" : "dark"}
      </span>
    </button>
  );
}

/**
 * Every palette as pickable cards, grouped by hue with its light counterpart
 * beside it — the switcher in the header is for flipping fast, this is for
 * choosing, and the grouping is what lets you compare a hue's two moods
 * without hunting for its pair across an unrelated grid position.
 */
export function PaletteGrid() {
  const { palette, setPalette } = usePalette();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {COLOR_THEME_PAIRS.map((pair) => (
        <div
          key={pair.label}
          className="flex flex-col gap-2 rounded-xl border border-app-border p-2"
        >
          <span className="px-1 font-mono text-[11px] text-app-dim">
            {pair.label}
          </span>
          <div className="flex gap-2">
            {pair.dark && (
              <PaletteCard
                themeKey={pair.dark}
                theme={COLOR_THEMES[pair.dark]}
                active={palette === pair.dark}
                onSelect={setPalette}
              />
            )}
            {pair.light && (
              <PaletteCard
                themeKey={pair.light}
                theme={COLOR_THEMES[pair.light]}
                active={palette === pair.light}
                onSelect={setPalette}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
