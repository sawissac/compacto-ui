"use client";

import { Check } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/cn";

export type OptionListItem = {
  value: string;
  label: string;
  /** One line under the label — what picking this option actually does. */
  description?: string;
  icon?: React.ComponentType<{
    size?: number;
    className?: string;
    "aria-hidden"?: boolean;
  }>;
};

/**
 * A vertical list of full-width selectable rows — icon, label, one-line
 * description, trailing `Check` on the active row. A `divide-y` segmented
 * group inside one outer border, unlike {@link OptionGrid}'s standalone
 * gapped cards: reach for this when each choice needs room for a sentence of
 * explanation rather than a swatch preview (a layout preset, a delivery
 * option, anything better described in words than pictured).
 *
 * The active row's selected state is an inset box-shadow ring, not a border
 * (a border would shift the row 1.5px and misalign its neighbors' edges).
 * The first/last row's corners are `calc(var(--radius-lg) - 1px)` — the
 * wrapper's radius minus its 1px border — so a row's curve lands exactly on
 * the wrapper's inner curve. Any other value leaves a wedge of wrapper
 * showing at the corner, or lets `overflow-hidden` slice the ring.
 *
 * @param props.options - The choices, in order.
 * @param props.value - The selected option's `value`.
 * @param props.onValueChange - Called with a `value` when its row is clicked.
 * @param props.className - Extra classes merged onto the list container.
 *
 * @example
 * ```tsx
 * <OptionList
 *   value={layout}
 *   onValueChange={setLayout}
 *   options={[
 *     { value: "balanced", label: "Balanced", description: "Panes split evenly.", icon: PanelLeftRightDashed },
 *     { value: "editor-focus", label: "Editor Focus", description: "Editor takes most of the width.", icon: TvMinimal },
 *   ]}
 * />
 * ```
 */
function OptionList({
  className,
  options,
  value,
  onValueChange,
  "data-testid": testId,
  ...props
}: Omit<React.ComponentProps<"div">, "onChange"> & {
  options: OptionListItem[];
  value: string;
  onValueChange: (value: string) => void;
  /** Base id. Each row derives `${data-testid}-<value>` from it. */
  "data-testid"?: string;
}) {
  return (
    <div
      data-slot="option-list"
      data-testid={testId}
      className={cn(
        "flex flex-col divide-y divide-app-border-mid overflow-hidden rounded-lg border border-app-border-mid",
        className,
      )}
      {...props}
    >
      {options.map((option) => {
        const active = option.value === value;
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            type="button"
            data-slot="option-list-item"
            data-testid={testId ? `${testId}-${option.value}` : undefined}
            aria-pressed={active}
            data-active={active || undefined}
            onClick={() => onValueChange(option.value)}
            className="group relative flex w-full items-center gap-3 bg-app-hover px-3 py-2.5 text-left transition-colors duration-200 first:rounded-t-[calc(var(--radius-lg)-1px)] last:rounded-b-[calc(var(--radius-lg)-1px)] hover:bg-app-selected data-active:bg-app-accent-faint data-active:shadow-[inset_0_0_0_1.5px_var(--app-accent)]"
          >
            {Icon && (
              <Icon
                size={16}
                aria-hidden
                className="shrink-0 text-app-dim group-data-active:text-app-accent"
              />
            )}
            <span className="min-w-0 flex-1">
              <span className="block font-title text-[11px] font-semibold tracking-[0.06em] text-app-bright uppercase">
                {option.label}
              </span>
              {option.description && (
                <span className="mt-0.5 block font-description text-[11px] leading-snug text-app-dim">
                  {option.description}
                </span>
              )}
            </span>
            {active && (
              <Check size={14} aria-hidden className="shrink-0 text-app-accent" />
            )}
          </button>
        );
      })}
    </div>
  );
}

export { OptionList };
