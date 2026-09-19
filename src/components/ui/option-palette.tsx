"use client";

import * as React from "react";

import { OptionGrid } from "@/components/ui/option-grid";
import { cn } from "@/lib/cn";
import {
  appThemeCssVars,
  COLOR_THEME_PAIRS,
  COLOR_THEMES,
  type ColorThemeKey,
} from "@/lib/color-themes";

/** The four tones that read as a palette at a glance, as a row of squares. */
function paletteSwatch(key: ColorThemeKey) {
  const theme = COLOR_THEMES[key];
  return (
    <span aria-hidden className="flex gap-1">
      {[theme.bg, theme.bgSidebar, theme.accent, theme.textBright].map(
        (color, i) => (
          <span
            key={i}
            className="size-4 rounded-sm border border-app-border"
            style={{ background: color }}
          />
        ),
      )}
    </span>
  );
}

/**
 * The theme picker for the `--app-*` palettes: every {@link COLOR_THEMES}
 * entry as an {@link OptionGrid} card, grouped by hue so a palette sits next
 * to its light counterpart rather than somewhere else in one long strip.
 *
 * Each card carries its own palette's variables inline (via
 * {@link appThemeCssVars}), so it previews the theme it selects — surface,
 * label, accent ring and check badge included — on a page painted in a
 * different one.
 *
 * Controlled only, and it does not apply the palette: it reports a
 * {@link ColorThemeKey} and the app decides what that means. Write
 * `appThemeCssVars(COLOR_THEMES[key])` onto `document.documentElement` in
 * whatever provider already owns theming.
 *
 * @param props.value - The selected {@link ColorThemeKey}.
 * @param props.onValueChange - Called with a key when its card is clicked.
 * @param props.darkLabel - Copy under a dark palette's name.
 * @param props.lightLabel - Copy under a light palette's name.
 * @param props.className - Extra classes merged onto the outer grid — most
 *   often the column count (defaults to 1-up, 2-up from `sm`).
 *
 * @example
 * ```tsx
 * const [palette, setPalette] = React.useState<ColorThemeKey>("midnight-dark");
 *
 * <OptionPalette value={palette} onValueChange={setPalette} />
 * ```
 */
function OptionPalette({
  className,
  value,
  onValueChange,
  darkLabel = "dark",
  lightLabel = "light",
  "data-testid": testId,
  ...props
}: Omit<React.ComponentProps<"div">, "onChange"> & {
  value: ColorThemeKey;
  onValueChange: (value: ColorThemeKey) => void;
  darkLabel?: string;
  lightLabel?: string;
  /** Base id. Each hue's grid derives `${data-testid}-<hue>`, each card `${data-testid}-<hue>-<theme key>`. */
  "data-testid"?: string;
}) {
  return (
    <div
      data-slot="option-palette"
      data-testid={testId}
      className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2", className)}
      {...props}
    >
      {COLOR_THEME_PAIRS.map((pair) => (
        <div
          key={pair.label}
          data-slot="option-palette-group"
          className="flex flex-col gap-2 rounded-xl border border-app-border p-2"
        >
          <span
            data-slot="option-palette-group-label"
            className="px-1 font-mono text-[11px] text-app-dim"
          >
            {pair.label}
          </span>
          <OptionGrid
            className="grid-cols-2"
            data-testid={
              testId ? `${testId}-${pair.label.toLowerCase()}` : undefined
            }
            value={value}
            onValueChange={(v) => onValueChange(v as ColorThemeKey)}
            options={[pair.dark, pair.light]
              .filter((key): key is ColorThemeKey => Boolean(key))
              .map((key) => ({
                value: key,
                label: key,
                description: COLOR_THEMES[key].isLight ? lightLabel : darkLabel,
                style: appThemeCssVars(COLOR_THEMES[key]),
                swatch: paletteSwatch(key),
              }))}
          />
        </div>
      ))}
    </div>
  );
}

export { OptionPalette };
