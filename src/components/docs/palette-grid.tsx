"use client";

import { OptionPalette } from "@/components/ui/option-palette";
import { usePalette } from "@/providers/palette-provider";

/**
 * {@link OptionPalette} bound to the gallery's live palette — picking a card
 * here repaints the page you are reading. The primitive itself is controlled
 * and applies nothing; this wrapper is the "and the app decides what that
 * means" half, and exists so a server-rendered docs page can drop the picker
 * in without becoming a client component itself.
 */
export function PaletteGrid() {
  const { palette, setPalette } = usePalette();

  return (
    <OptionPalette
      data-testid="palette"
      value={palette}
      onValueChange={setPalette}
    />
  );
}
