"use client";

import {
  appThemeCssVars,
  COLOR_THEMES,
  type ColorThemeKey,
} from "@compacto/ui/color-themes";
import * as React from "react";

type PaletteContext = {
  palette: ColorThemeKey;
  setPalette: (next: ColorThemeKey) => void;
};

const Ctx = React.createContext<PaletteContext | null>(null);

/**
 * Applies one of the library's ten palettes to the document.
 *
 * This is the reference implementation of the theming contract the package
 * documents: write `appThemeCssVars(theme)` onto `document.documentElement`
 * and toggle `.dark` from `theme.isLight`. Every consuming app does the same
 * thing; the gallery does it here so the docs cannot drift from the advice.
 */
export function PaletteProvider({ children }: { children: React.ReactNode }) {
  const [palette, setPalette] = React.useState<ColorThemeKey>("midnight");

  React.useEffect(() => {
    const theme = COLOR_THEMES[palette];
    const root = document.documentElement;
    for (const [name, value] of Object.entries(appThemeCssVars(theme))) {
      root.style.setProperty(name, value);
    }
    root.classList.toggle("dark", !theme.isLight);
  }, [palette]);

  const value = React.useMemo(() => ({ palette, setPalette }), [palette]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePalette() {
  const ctx = React.useContext(Ctx);
  if (!ctx) {
    throw new Error("usePalette must be used inside a PaletteProvider");
  }
  return ctx;
}
