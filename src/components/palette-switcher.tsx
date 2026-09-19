"use client";

import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  COLOR_THEME_PAIRS,
  COLOR_THEMES,
  type ColorThemeKey,
} from "@/lib/color-themes";
import { usePalette } from "@/providers/palette-provider";

function labelFor(key: ColorThemeKey) {
  const pair = COLOR_THEME_PAIRS.find(
    (p) => p.dark === key || p.light === key,
  )!;
  if (pair.dark === key) {
    return `${pair.label} — dark`;
  }
  if (pair.label === "Chocolate") {
    return "Chocolate — light";
  }
  return `${pair.label} — light`;
}

/** One swatch: an accent-colored dot, a check badge when active, on a bordered tile. */
function Swatch({
  themeKey,
  active,
  onSelect,
}: {
  themeKey: ColorThemeKey;
  active: boolean;
  onSelect: (key: ColorThemeKey) => void;
}) {
  const theme = COLOR_THEMES[themeKey];
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label={labelFor(themeKey)}
          aria-pressed={active}
          data-testid={`palette-${themeKey}`}
          onClick={() => onSelect(themeKey)}
          className={cnActive(active)}
        >
          <span
            aria-hidden
            className="size-3.5 rounded-full border border-app-border-mid"
            style={{ background: theme.accent }}
          />
          {active && (
            <span
              aria-hidden
              className="absolute -right-1 -bottom-1 flex size-3.5 items-center justify-center rounded-full border border-app-border-mid bg-app-panel text-app-bright"
            >
              <Check className="size-2.5" strokeWidth={3} />
            </span>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{labelFor(themeKey)}</TooltipContent>
    </Tooltip>
  );
}

function cnActive(active: boolean) {
  return active ? "relative ring-2 ring-app-accent" : "relative";
}

/**
 * Opens a grouped grid of every palette — dark and light side by side per
 * hue — so flipping the gallery across all twenty-three no longer means picking a
 * near-invisible dot out of one long strip. This is the control that makes
 * the gallery worth having: a primitive that looks right on `midnight-dark` and
 * wrong on `light` is the exact failure the token conversion could introduce,
 * and the only way to see it is to flip between them.
 *
 * Icon-only trigger — just the current accent as a dot, name in its tooltip —
 * so it drops into a header next to other controls without eating label
 * width for a value most visitors only need to glance at.
 */
export function PaletteSwitcher() {
  const { palette, setPalette } = usePalette();
  const current = COLOR_THEMES[palette];

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon-sm"
              data-testid="palette-switcher-trigger"
              aria-label={`Theme: ${labelFor(palette)}`}
            >
              <span
                aria-hidden
                className="size-3.5 rounded-full border border-app-border-mid"
                style={{ background: current.accent }}
              />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Theme: {labelFor(palette)}</TooltipContent>
      </Tooltip>
      <PopoverContent align="end" className="w-auto p-3">
        <PopoverHeader className="mb-2 px-1">
          <PopoverTitle>Theme</PopoverTitle>
        </PopoverHeader>
        <div className="flex flex-col gap-1.5">
          {COLOR_THEME_PAIRS.map((pair) => (
            <div key={pair.label} className="flex items-center gap-3">
              <span className="w-20 shrink-0 font-mono text-[11px] text-app-dim">
                {pair.label}
              </span>
              <div className="flex items-center gap-1.5">
                {pair.dark ? (
                  <Swatch
                    themeKey={pair.dark}
                    active={palette === pair.dark}
                    onSelect={setPalette}
                  />
                ) : (
                  <div className="size-8" aria-hidden />
                )}
                {pair.light ? (
                  <Swatch
                    themeKey={pair.light}
                    active={palette === pair.light}
                    onSelect={setPalette}
                  />
                ) : (
                  <div className="size-8" aria-hidden />
                )}
              </div>
            </div>
          ))}
        </div>
        <Separator className="my-3" />
        <p className="px-1 text-[11px] leading-relaxed text-app-dim">
          Left column is the dark theme, right its light counterpart.
        </p>
      </PopoverContent>
    </Popover>
  );
}
