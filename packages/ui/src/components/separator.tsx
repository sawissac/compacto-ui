"use client";

import { Separator as SeparatorPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "../lib/cn.js";

/**
 * Thin rule that divides content, either horizontally or vertically.
 *
 * Sits on `app-border` — the hairline tone, not the text color — so a divider
 * never competes with the content on either side of it.
 *
 * @param props.orientation - Rule direction; `"horizontal"` (default) spans the
 *   full width, `"vertical"` stretches to the parent's height.
 * @param props.decorative - When true (default) the rule is hidden from
 *   assistive tech; set false when it carries real structural meaning.
 * @param props.className - Extra classes merged onto the rule.
 */
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-app-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
