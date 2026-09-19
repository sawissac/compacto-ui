"use client";

import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";

import { cn } from "../lib/cn.js";
import { Button, buttonVariants } from "./button.js";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

/**
 * Month-grid calendar over `react-day-picker`, restyled for the flat design
 * system: `app-*` tokens only, no shadows, the selected day a solid accent
 * block, today a hairline ring, hover a tint.
 *
 * Every `DayPicker` prop passes through (`mode`, `selected`, `onSelect`,
 * `captionLayout`, `disabled`, …), and `className` / `classNames` merge on top
 * of the defaults so a caller can tweak one slot without redeclaring the rest.
 *
 * `react-day-picker` is an optional peer dependency — installing it is only
 * required if you import this module.
 *
 * Test ids derive from a `data-testid` on the calendar: each day becomes
 * `${testId}-day-<yyyy-mm-dd>` (ISO, so a test never has to guess the runtime
 * locale's date format) and the arrows `${testId}-prev-button` /
 * `${testId}-next-button`.
 *
 * @param props.showOutsideDays - Render the leading/trailing days of the
 *   neighbouring months (default `true`).
 * @param props.captionLayout - Month caption: `label` (default) or one of the
 *   `dropdown` variants for month/year selects.
 * @param props.buttonVariant - `Button` variant for the prev/next arrows
 *   (default `ghost`).
 * @param props.locale - `react-day-picker` locale. Also drives the month
 *   dropdown's own labels, so a localized calendar does not end up with
 *   English month abbreviations in its caption.
 * @param props.className - Extra classes merged onto the calendar root.
 *
 * @example
 * ```tsx
 * <Calendar mode="single" selected={date} onSelect={setDate} />
 * ```
 */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  locale,
  "data-testid": testId,
  ...props
}: CalendarProps & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
  /**
   * Base for derived test ids. `DayPicker`'s own props type is a closed union
   * that does not admit arbitrary `data-*`, so this is declared explicitly
   * rather than read off the rest props.
   */
  "data-testid"?: string;
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={locale}
      className={cn(
        "group/calendar bg-app-panel p-2 text-app-text [--cell-size:--spacing(8)]",
        "[[data-slot=popover-content]_&]:bg-transparent",
        className,
      )}
      captionLayout={captionLayout}
      formatters={{
        // Follow the caller's locale rather than the runtime default, so a
        // localized calendar doesn't caption itself in English.
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months,
        ),
        month: cn("flex w-full flex-col gap-3", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant, size: "icon-sm" }),
          "size-(--cell-size) p-0 text-app-dim aria-disabled:opacity-50",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant, size: "icon-sm" }),
          "size-(--cell-size) p-0 text-app-dim aria-disabled:opacity-50",
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5 font-title text-[12px] font-semibold",
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn(
          "relative rounded-md border border-app-border-mid has-focus:border-app-accent has-focus:ring-2 has-focus:ring-app-accent/30",
          defaultClassNames.dropdown_root,
        ),
        dropdown: cn(
          "absolute inset-0 bg-app-panel opacity-0",
          defaultClassNames.dropdown,
        ),
        caption_label: cn(
          "font-title text-[12px] font-semibold text-app-bright select-none",
          captionLayout === "label"
            ? ""
            : "flex h-7 items-center gap-1 rounded-md pr-1 pl-2 [&>svg]:size-3.5 [&>svg]:text-app-dim",
          defaultClassNames.caption_label,
        ),
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 rounded-md font-title text-[10px] font-semibold tracking-[0.08em] text-app-dim uppercase select-none",
          defaultClassNames.weekday,
        ),
        week: cn("mt-1 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-(--cell-size) select-none",
          defaultClassNames.week_number_header,
        ),
        week_number: cn(
          "font-mono text-[10px] text-app-dim select-none",
          defaultClassNames.week_number,
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full p-0 text-center select-none",
          defaultClassNames.day,
        ),
        today: cn("", defaultClassNames.today),
        outside: cn(
          "text-app-dim aria-selected:text-app-dim",
          defaultClassNames.outside,
        ),
        disabled: cn("text-app-dim opacity-40", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...rootProps }) => (
          <div
            data-slot="calendar"
            data-testid={testId}
            ref={rootRef}
            className={cn(className)}
            {...rootProps}
          />
        ),
        Chevron: ({ className, orientation, ...chevronProps }) => {
          if (orientation === "left") {
            return (
              <ChevronLeft
                className={cn("size-4", className)}
                {...chevronProps}
              />
            );
          }
          if (orientation === "right") {
            return (
              <ChevronRight
                className={cn("size-4", className)}
                {...chevronProps}
              />
            );
          }
          return (
            <ChevronDown
              className={cn("size-4", className)}
              {...chevronProps}
            />
          );
        },
        PreviousMonthButton: (navProps) => (
          <button
            data-slot="calendar-prev-button"
            data-testid={testId ? `${testId}-prev-button` : undefined}
            {...navProps}
          />
        ),
        NextMonthButton: (navProps) => (
          <button
            data-slot="calendar-next-button"
            data-testid={testId ? `${testId}-next-button` : undefined}
            {...navProps}
          />
        ),
        DayButton: (dayProps) => (
          <CalendarDayButton testIdBase={testId} {...dayProps} />
        ),
        WeekNumber: ({ children, ...weekProps }) => (
          <td {...weekProps}>
            <div className="flex size-(--cell-size) items-center justify-center text-center">
              {children}
            </div>
          </td>
        ),
        ...components,
      }}
      {...props}
    />
  );
}

/**
 * One day cell. Flat states: selected is a solid accent block, today a hairline
 * accent ring, hover a tint. Focus follows the grid's keyboard cursor.
 *
 * @param props.testIdBase - When set, the cell gets
 *   `${testIdBase}-day-<yyyy-mm-dd>`. {@link Calendar} supplies it from its own
 *   `data-testid`; there is no reason to pass it by hand.
 */
function CalendarDayButton({
  className,
  day,
  modifiers,
  testIdBase,
  ...props
}: React.ComponentProps<typeof import("react-day-picker").DayButton> & {
  testIdBase?: string;
}) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) {
      ref.current?.focus();
    }
  }, [modifiers.focused]);

  // Local ISO date, not toISOString() — the latter converts to UTC and would
  // label the cell with the previous day for anyone east of Greenwich.
  const iso = `${day.date.getFullYear()}-${String(day.date.getMonth() + 1).padStart(2, "0")}-${String(day.date.getDate()).padStart(2, "0")}`;

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon-sm"
      data-slot="calendar-day"
      data-testid={testIdBase ? `${testIdBase}-day-${iso}` : undefined}
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 rounded-md leading-none font-normal text-app-text",
        "transition-colors duration-(--motion-duration-fast) hover:bg-app-hover hover:text-app-bright",
        "data-[today=true]:ring-1 data-[today=true]:ring-app-border-accent",
        "data-[selected-single=true]:bg-app-accent data-[selected-single=true]:text-app-on-solid data-[selected-single=true]:hover:bg-app-accent",
        "data-[range-start=true]:rounded-r-none data-[range-start=true]:bg-app-accent data-[range-start=true]:text-app-on-solid",
        "data-[range-end=true]:rounded-l-none data-[range-end=true]:bg-app-accent data-[range-end=true]:text-app-on-solid",
        "data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-app-accent-faint data-[range-middle=true]:text-app-bright",
        "group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-2 group-data-[focused=true]/day:ring-app-accent/40",
        "[&>span]:text-[10px] [&>span]:opacity-70",
        defaultClassNames.day,
        className,
      )}
      data-today={modifiers.today || undefined}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
