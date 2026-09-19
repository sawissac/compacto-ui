"use client";

import { COLOR_THEME_KEYS, COLOR_THEMES } from "@compacto/ui/color-themes";

import { usePalette } from "@/providers/palette-provider";

/**
 * All ten palettes as pickable cards, each previewing its own surfaces rather
 * than a single accent dot — the switcher in the header is for flipping fast,
 * this is for choosing.
 */
export function PaletteGrid() {
  const { palette, setPalette } = usePalette();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {COLOR_THEME_KEYS.map((key) => {
        const t = COLOR_THEMES[key];
        const active = key === palette;
        return (
          <button
            key={key}
            type="button"
            onClick={() => setPalette(key)}
            aria-pressed={active}
            data-testid={`palette-card-${key}`}
            className={[
              "flex flex-col gap-2 rounded-lg border p-3 text-left transition-colors duration-(--motion-duration-fast)",
              active
                ? "border-app-accent ring-2 ring-app-accent/30"
                : "border-app-border-mid hover:border-app-border-accent",
            ].join(" ")}
            style={{ background: t.bgPanel }}
          >
            <div className="flex gap-1">
              {[t.bg, t.bgSidebar, t.accent, t.textBright].map((c, i) => (
                <span
                  key={i}
                  aria-hidden
                  className="size-4 rounded-sm"
                  style={{ background: c, border: `1px solid ${t.border}` }}
                />
              ))}
            </div>
            <span
              className="font-title text-[12px] font-semibold"
              style={{ color: t.textBright }}
            >
              {key}
            </span>
            <span
              className="font-mono text-[10px]"
              style={{ color: t.textDim }}
            >
              {t.isLight ? "light" : "dark"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
