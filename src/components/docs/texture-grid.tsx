"use client";

import type * as React from "react";

import { OptionGrid } from "@/components/ui/option-grid";
import type { SidebarTexture } from "@/components/ui/sidebar";

/** Previews every swatch at full strength, independent of the live `--app-texture-alpha`. */
const SWATCH_STYLE = { "--app-texture-alpha": 1 } as React.CSSProperties;

const TEXTURE_OPTIONS: { value: SidebarTexture; label: string }[] = [
  { value: "none", label: "None" },
  { value: "checker", label: "Checker" },
  { value: "dots", label: "Dots" },
  { value: "graph", label: "Graph" },
];

/**
 * Every {@link SidebarTexture} as an {@link OptionGrid} card, so the
 * Background tab of a settings dialog reads as the same kind of picker as its
 * Theme tab — just with a texture swatch instead of a palette preview.
 *
 * The swatch sizes itself (`block h-11 w-full`) rather than filling an
 * absolutely-positioned box: `compacto-texture--*` sets its own
 * `position: relative` and loads after Tailwind, so an `absolute inset-0`
 * swatch would collapse to 0×0.
 */
export function TextureGrid({
  value,
  onValueChange,
}: {
  value: SidebarTexture;
  onValueChange: (texture: SidebarTexture) => void;
}) {
  return (
    <OptionGrid
      data-testid="texture-card"
      value={value}
      onValueChange={(v) => onValueChange(v as SidebarTexture)}
      options={TEXTURE_OPTIONS.map((option) => ({
        value: option.value,
        label: option.label,
        style: SWATCH_STYLE,
        swatch: (
          <span
            aria-hidden
            className={[
              "block h-11 w-full rounded-md border border-app-border-mid bg-app-sidebar",
              option.value === "none" ? "" : `compacto-texture--${option.value}`,
            ].join(" ")}
          />
        ),
      }))}
    />
  );
}
