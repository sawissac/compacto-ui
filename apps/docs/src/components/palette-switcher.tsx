"use client";

import { Button } from "@compacto/ui/button";
import { ButtonGroup } from "@compacto/ui/button-group";
import { COLOR_THEME_KEYS, COLOR_THEMES } from "@compacto/ui/color-themes";
import { Tooltip, TooltipContent, TooltipTrigger } from "@compacto/ui/tooltip";

import { usePalette } from "@/providers/palette-provider";

/**
 * Cycles the gallery through all ten palettes. This is the control that makes
 * the gallery worth having: a primitive that looks right on `midnight` and
 * wrong on `light` is the exact failure the token conversion could introduce,
 * and the only way to see it is to flip between them.
 */
export function PaletteSwitcher() {
  const { palette, setPalette } = usePalette();

  return (
    <ButtonGroup className="flex-wrap">
      {COLOR_THEME_KEYS.map((key) => {
        const theme = COLOR_THEMES[key];
        return (
          <Tooltip key={key}>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label={key}
                aria-pressed={key === palette}
                data-testid={`palette-${key}`}
                onClick={() => setPalette(key)}
                className={
                  key === palette
                    ? "relative z-10 ring-2 ring-app-accent"
                    : undefined
                }
              >
                <span
                  aria-hidden
                  className="size-3.5 rounded-full border border-app-border-mid"
                  style={{ background: theme.accent }}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{key}</TooltipContent>
          </Tooltip>
        );
      })}
    </ButtonGroup>
  );
}
