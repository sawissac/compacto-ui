/**
 * Reference content for each primitive: the props worth knowing and the facts
 * that are not obvious from the signature.
 *
 * Kept apart from `entries.tsx` on purpose — that file is a client module full
 * of live previews, this one is plain serialisable data. Notes are deliberately
 * the things that bite: a prop a component throws without, an attribute a
 * third party steals, a variant that is a tint rather than a block.
 */

export type PropDoc = {
  name: string;
  type: string;
  default?: string;
  desc: string;
};

export type ApiDoc = {
  /** Non-obvious behaviour, gotchas, and the reasoning behind a default. */
  notes?: string[];
  /** The props worth documenting. Not exhaustive — the rest pass through. */
  props?: PropDoc[];
  /** Every named export of the module, for the import line. */
  exports: string[];
};

export const API: Record<string, ApiDoc> = {
  button: {
    exports: ["Button", "buttonVariants"],
    notes: [
      "Server-safe — renders in a Server Component without opening a client boundary.",
      "The rest state carries a transparent 1px border, so hover and focus never shift layout. That is also what lets ButtonGroup collapse the seam between buttons.",
      "`destructive` is a tint, not a solid red block. A toolbar with one filled red bar reads as an error state rather than an option.",
      "`aria-expanded` holds the hover fill while a menu the button opens is showing.",
      "The `icon*` sizes render no text, so they need an `aria-label`.",
    ],
    props: [
      {
        name: "variant",
        type: '"default" | "outline" | "secondary" | "ghost" | "destructive" | "link"',
        default: '"default"',
        desc: "Visual role.",
      },
      {
        name: "size",
        type: '"default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"',
        default: '"default"',
        desc: "Geometry. The icon sizes are square hit areas for a lone glyph.",
      },
      {
        name: "asChild",
        type: "boolean",
        default: "false",
        desc: "Render the caller's child element instead of a <button>, keeping these styles.",
      },
    ],
  },
  "button-group": {
    exports: ["ButtonGroup", "ButtonGroupSeparator", "buttonGroupVariants"],
    notes: [
      "Server-safe.",
      "Only the outer corners stay rounded; touching borders merge into a single hairline.",
      "Nest a ButtonGroup inside another to space clusters apart instead of joining them.",
      "Reach for ButtonGroupSeparator when the merged hairlines do not read as a split — most often between same-colored solid buttons, where there is no border contrast to collapse.",
    ],
    props: [
      {
        name: "orientation",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        desc: "Seam direction.",
      },
    ],
  },
  input: {
    exports: ["Input"],
    notes: [
      "Fully controlled — it holds no value state of its own.",
      "The clear button appears only when there is a value, the field is not disabled, and either `onClear` or `onChange` is supplied.",
      "Without `onClear`, clearing writes an empty value to the DOM node and re-fires `onChange` with that node as `event.target`, then returns focus.",
      "Renders a native <input>, so labelling is yours: `aria-label` or `aria-labelledby`.",
      "A `data-testid` lands on the input; the clear button derives `${testId}-clear-button`.",
    ],
    props: [
      {
        name: "icon",
        type: "LucideIcon",
        desc: "Leading decorative icon. aria-hidden.",
      },
      {
        name: "iconColor",
        type: "string",
        desc: "Fixed color for the icon. Unset falls back to the themed dim tone.",
      },
      {
        name: "onClear",
        type: "() => void",
        desc: "Replaces the default clear behaviour, for when clearing must reset state onChange cannot reach.",
      },
      {
        name: "clearLabel",
        type: "string",
        default: '"Clear"',
        desc: "Accessible name for the clear button. Pass a translated string from the call site.",
      },
    ],
  },
  "file-upload": {
    exports: [
      "FileUpload",
      "FileUploadDropzone",
      "FileUploadItem",
      "formatFileSize",
    ],
    notes: [
      "Transport-agnostic and fully controlled. It never uploads anything: `onFilesAdded` hands you the accepted `File`s, you start the request, and you mirror its state into `files` — each entry's `status`, `progress` and `secondsLeft` are what the list draws.",
      "The well is react-dropzone's `useDropzone`. `accept` is its MIME-to-extensions map, checked on drop and pick alike and fed to the native picker; `maxSize` and `maxFiles` are its options too. Anything else — a `validator`, `minSize`, `noPaste`, `getErrorMessage` for localised errors — goes through `dropzoneOptions`.",
      "`maxFiles` is per drop, not a running total: a batch larger than it is rejected whole with `too-many-files`. Cap the total in `onFilesAdded` if you need one.",
      "Rejections are react-dropzone `FileRejection`s (`file` + `errors[].code`), reported through `onFilesRejected` and never rendered. Show them the way the surrounding form shows its errors.",
      "A drag whose every item is already known to be the wrong MIME type tints the well red (`data-drag-reject`). Extension and size failures are only knowable on drop, so a drag of a too-large file still highlights normally.",
      "`onRemove` and `onRetry` are plain callbacks with the entry. Whether remove means abort, delete-from-server or drop-from-state is yours to decide; omit either and its button does not render.",
      "The `hint` line is built from `accept` and `maxSize` in English by default. Pass your own to translate it.",
      "A caller's data-testid lands on the column; `${base}-dropzone`, `${base}-dropzone-input` and `${base}-item-<id>` derive from it, and each row's buttons add `-remove-button` / `-retry-button`.",
    ],
    props: [
      {
        name: "files",
        type: "FileUploadEntry[]",
        default: "[]",
        desc: "Rows to draw: { id, name, size, status, progress?, secondsLeft?, error? }.",
      },
      {
        name: "accept",
        type: "Accept | AcceptGroup[]",
        desc: 'react-dropzone map of MIME type to extensions: { "text/csv": [".csv"] }. Omit for anything.',
      },
      {
        name: "maxSize",
        type: "number",
        desc: "Largest file allowed, in bytes.",
      },
      {
        name: "maxFiles",
        type: "number",
        desc: "Most files one drop or pick may contain.",
      },
      {
        name: "multiple",
        type: "boolean",
        default: "true",
        desc: "Let the picker choose several at once.",
      },
      {
        name: "onFilesAdded",
        type: "(files: File[]) => void",
        desc: "Files that passed every check. Start uploading them.",
      },
      {
        name: "onFilesRejected",
        type: "(rejections: FileRejection[]) => void",
        desc: "Files that failed a check, each with react-dropzone's errors.",
      },
      {
        name: "dropzoneOptions",
        type: "DropzoneOptions",
        desc: "Anything else for useDropzone: validator, minSize, noPaste, getErrorMessage.",
      },
      {
        name: "onRemove",
        type: "(entry: FileUploadEntry) => void",
        desc: "The row's trash button. Omit to hide it.",
      },
      {
        name: "onRetry",
        type: "(entry: FileUploadEntry) => void",
        desc: "A failed row's retry button. Omit to hide it.",
      },
      {
        name: "title",
        type: "string",
        default: '"Click or drag files to upload"',
        desc: "Dropzone headline.",
      },
      {
        name: "hint",
        type: "string",
        default: "from accept + maxSize",
        desc: "Dropzone second line.",
      },
      {
        name: "removeLabel / retryLabel / uploadedLabel / failedLabel",
        type: "string",
        default: '"Remove" / "Retry" / "Uploaded" / "Upload failed"',
        desc: "Row copy. Pass translated strings from the call site.",
      },
      {
        name: "formatTimeLeft",
        type: "(seconds: number) => string",
        default: '"24 sec left"',
        desc: "Readout for an uploading row's remaining time.",
      },
    ],
  },
  select: {
    exports: [
      "Select",
      "SelectContent",
      "SelectGroup",
      "SelectItem",
      "SelectLabel",
      "SelectScrollDownButton",
      "SelectScrollUpButton",
      "SelectSeparator",
      "SelectTrigger",
      "SelectValue",
    ],
    notes: [
      "SelectLabel throws unless it is inside a SelectGroup — Radix reads the group's context to wire the label to its items. Nothing in the types says so.",
      "The trigger is deliberately the same box as the Input recipe, so a select and a text field in one form read as a family.",
      'position="item-aligned" (the default) lines the selected item up over the trigger like a native select. Switch to "popper" when the list is long enough that alignment would push it off-screen.',
    ],
    props: [
      {
        name: "size (SelectTrigger)",
        type: '"default" | "sm"',
        default: '"default"',
        desc: "36px or 32px, the latter for dense toolbars.",
      },
      {
        name: "position (SelectContent)",
        type: '"item-aligned" | "popper"',
        default: '"item-aligned"',
        desc: "How the open list anchors.",
      },
    ],
  },
  dialog: {
    exports: [
      "Dialog",
      "DialogBody",
      "DialogClose",
      "DialogContent",
      "DialogDescription",
      "DialogFooter",
      "DialogHeader",
      "DialogOverlay",
      "DialogPortal",
      "DialogTitle",
      "DialogTrigger",
    ],
    notes: [
      "DialogContent carries no padding of its own. Header, Body and Footer each bring their own gutter and hairline dividers — that is what keeps every dialog in an app reading as the same object.",
      "The close X lives in DialogHeader, not the panel, so it always sits on the title row rather than floating in a corner.",
      "DialogFooter normalises direct Button children to the compact footer geometry, so callers keep using `variant` for role without restating size.",
      "Turn off `showCloseButton` for dialogs whose footer already carries an explicit Cancel and must not be dismissed casually.",
      "DialogTitle is required by Radix — it is the dialog's accessible name.",
      "Default width is 400px. Pass `w-[min(…px,92vw)]` in className for a wider one.",
    ],
    props: [
      {
        name: "showCloseButton (Header)",
        type: "boolean",
        default: "true",
        desc: "Render the close X on the title row.",
      },
      {
        name: "showCloseButton (Footer)",
        type: "boolean",
        default: "false",
        desc: "Append a plain Close button, for a dialog that only reports something.",
      },
      {
        name: "closeLabel",
        type: "string",
        default: '"Close"',
        desc: "Copy and accessible name for either close control.",
      },
    ],
  },
  "option-grid": {
    exports: ["OptionGrid"],
    notes: [
      "The swatch is entirely the caller's ReactNode, sizing included — this component only owns card chrome, selection state and the Check badge.",
      "Controlled only — value and onValueChange are both required.",
      "Derives `${testId}-<value>` per card from data-testid.",
      "A card paints from the --app-* tokens in scope, so an option's style can repaint one card in a different palette — appThemeCssVars(theme) is how the theming page previews twenty-three palettes on a page rendered in one of them.",
    ],
    props: [
      {
        name: "options",
        type: "{ value, label, description?, swatch: ReactNode, style? }[]",
        desc: "The choices, in order.",
      },
      {
        name: "value",
        type: "string",
        desc: "The selected option's value.",
      },
      {
        name: "onValueChange",
        type: "(value: string) => void",
        desc: "Called with a value when its tile is clicked.",
      },
    ],
  },
  "option-palette": {
    exports: ["OptionPalette"],
    notes: [
      "Reports a ColorThemeKey and applies nothing — wire onValueChange to whatever already writes appThemeCssVars() onto the document. On its own it looks like it does nothing.",
      "Each card carries its own palette's --app-* values inline, so it previews the theme it selects on a page painted in a different one.",
      "Grouped by hue from COLOR_THEME_PAIRS: a dark palette sits next to its light counterpart. Chocolate (`light`) has no dark side, so its group holds one card.",
      "Controlled only — value and onValueChange are both required.",
      "Derives `${testId}-<hue>` per hue grid and `${testId}-<hue>-<theme key>` per card from data-testid.",
    ],
    props: [
      {
        name: "value",
        type: "ColorThemeKey",
        desc: "The selected palette.",
      },
      {
        name: "onValueChange",
        type: "(value: ColorThemeKey) => void",
        desc: "Called with a key when its card is clicked.",
      },
      {
        name: "darkLabel",
        type: "string",
        default: '"dark"',
        desc: "Copy under a dark palette's name.",
      },
      {
        name: "lightLabel",
        type: "string",
        default: '"light"',
        desc: "Copy under a light palette's name.",
      },
    ],
  },
  "option-list": {
    exports: ["OptionList"],
    notes: [
      "A divide-y segmented group inside one outer border — reach for OptionGrid instead when a swatch preview matters more than a description.",
      "Controlled only — value and onValueChange are both required.",
      "Derives `${testId}-<value>` per row from data-testid.",
    ],
    props: [
      {
        name: "options",
        type: "{ value, label, description?, icon? }[]",
        desc: "The choices, in order.",
      },
      {
        name: "value",
        type: "string",
        desc: "The selected option's value.",
      },
      {
        name: "onValueChange",
        type: "(value: string) => void",
        desc: "Called with a value when its row is clicked.",
      },
    ],
  },
  popover: {
    exports: [
      "Popover",
      "PopoverAnchor",
      "PopoverContent",
      "PopoverDescription",
      "PopoverHeader",
      "PopoverTitle",
      "PopoverTrigger",
    ],
    notes: [
      "A border-2 surface — one step heavier than a tooltip's hairline, because a popover is a place you work rather than a hint you read.",
      "Use it for a small aside anchored to a control. Anything that interrupts the task and demands a decision is a Dialog.",
      "Scrolls internally past 60vh instead of growing off-screen, and keeps 8px clear of the viewport edge.",
      "PopoverTitle renders a div, not a heading — a popover is not a landmark.",
    ],
    props: [
      {
        name: "align",
        type: '"start" | "center" | "end"',
        default: '"center"',
        desc: "Alignment against the trigger.",
      },
      {
        name: "sideOffset",
        type: "number",
        default: "6",
        desc: "Gap between trigger and panel, in px.",
      },
    ],
  },
  "dropdown-menu": {
    exports: [
      "DropdownMenu",
      "DropdownMenuCheckboxItem",
      "DropdownMenuContent",
      "DropdownMenuItem",
      "DropdownMenuTrigger",
    ],
    notes: [
      'align defaults to "end", since a menu button usually sits at the right edge of its row.',
      "DropdownMenuCheckboxItem deliberately stays open after a toggle — the whole reason to use one is to pick several things in one pass.",
      '`variant="destructive"` tints the row rather than filling it.',
    ],
    props: [
      {
        name: "variant (Item)",
        type: '"default" | "destructive"',
        default: '"default"',
        desc: "Tints the row for delete-style actions.",
      },
      {
        name: "align (Content)",
        type: '"start" | "center" | "end"',
        default: '"end"',
        desc: "Alignment against the trigger.",
      },
    ],
  },
  tooltip: {
    exports: ["Tooltip", "TooltipContent", "TooltipProvider", "TooltipTrigger"],
    notes: [
      "Tooltip mounts its own provider, so a single tooltip works standalone. Mount a TooltipProvider higher up when a group should share hover timing — that is what makes the second tooltip in a toolbar appear instantly.",
      "A tooltip is a hint, never the only place information lives. An icon-only control still needs its own aria-label.",
      "Capped at 16rem so a hint stays a hint.",
    ],
    props: [
      {
        name: "delayDuration (Provider)",
        type: "number",
        default: "200",
        desc: "Hover time before opening. Long enough not to fire on a pointer passing through.",
      },
      {
        name: "sideOffset (Content)",
        type: "number",
        default: "8",
        desc: "Gap between trigger and panel, in px.",
      },
    ],
  },
  tabs: {
    exports: [
      "Tabs",
      "TabsContent",
      "TabsList",
      "TabsTrigger",
      "tabsListVariants",
    ],
    notes: [
      "The active marker follows orientation: an underline horizontally, a right-hand rule vertically.",
      '`variant="line"` drops the filled track and marks the active tab with a rule, which reads better when the tabs sit directly on a panel edge.',
      '`variant="nav"` is a fixed-width icon rail meant for `orientation="vertical"` — a settings dialog\'s left-hand section list, each row an icon plus an uppercase label.',
    ],
    props: [
      {
        name: "orientation (Tabs)",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        desc: "List direction.",
      },
      {
        name: "variant (TabsList)",
        type: '"default" | "line" | "nav"',
        default: '"default"',
        desc: "Filled segmented track, a bare row, or a bordered icon rail.",
      },
    ],
  },
  command: {
    exports: [
      "Command",
      "CommandDialog",
      "CommandEmpty",
      "CommandGroup",
      "CommandInput",
      "CommandItem",
      "CommandList",
      "CommandSeparator",
      "CommandShortcut",
    ],
    notes: [
      "Optional peer: cmdk. Installing it is only required if you import this module.",
      "CommandDialog's title and description are visually hidden — a palette is self-evident to anyone who can see it and needs a name for anyone who cannot.",
      "The list caps at 300px and scrolls rather than growing.",
      "This documentation site's own ⌘K search is a CommandDialog.",
    ],
    props: [
      {
        name: "title (CommandDialog)",
        type: "string",
        default: '"Command Palette"',
        desc: "Accessible name for the dialog.",
      },
      {
        name: "description (CommandDialog)",
        type: "string",
        default: '"Search for a command to run..."',
        desc: "Accessible description for the dialog.",
      },
    ],
  },
  "data-table": {
    exports: [
      "DataTable",
      "dataTableColumnHelper",
      "DataTableColumn",
      "DataTableFeatures",
    ],
    notes: [
      "Headless core: @tanstack/react-table v9 produces the header groups and the sorted row model; this component owns markup, --app-* styling, the sticky header, sort affordances and aria-sort.",
      "Rows are virtualized with @tanstack/react-virtual over the *sorted* row model, positioned by two spacer <tr>s so the table keeps native column layout. Only rows in view (plus overscan) are in the DOM.",
      "Virtualization needs a bounded scroll box — that is why `height` exists. Override with a className like h-full inside a parent that already constrains height.",
      "Build columns with dataTableColumnHelper<Row>() at module scope. v9 types a column def against the registered feature set, so a def from a bare createColumnHelper() will not type-check here.",
      "Keep `columns` and `data` referentially stable (module constant, state, or a query result). A fresh array per render rebuilds the row model every render.",
      "Sorting is internal after `defaultSorting`; a header click cycles asc → desc → off. `enableSorting: false` on a column removes its affordance.",
      "Derives `${testId}-header-<columnId>` per header and `${testId}-row-<rowId>` per rendered row from data-testid — only rows in view exist to be found.",
    ],
    props: [
      {
        name: "columns",
        type: "DataTableColumn<Row>[]",
        desc: "From dataTableColumnHelper<Row>().columns([...]). `size` is width in px; `minSize` / `maxSize` bound a drag; `enableResizing: false` removes a handle.",
      },
      {
        name: "data",
        type: "Row[]",
        desc: "The rows. Stable reference.",
      },
      {
        name: "getRowId",
        type: "(row: Row, index: number) => string",
        default: "row index",
        desc: "Stable id per row — React key, virtual measurement, derived test id.",
      },
      {
        name: "height",
        type: "number",
        default: "400",
        desc: "Scroll box height in px.",
      },
      {
        name: "rowHeight",
        type: "number",
        default: "36",
        desc: "Estimated row height in px; rows are measured after mount.",
      },
      {
        name: "defaultSorting",
        type: "SortingState",
        desc: 'Initial sort, e.g. [{ id: "ms", desc: true }].',
      },
      {
        name: "resizable",
        type: "boolean",
        default: "true",
        desc: "Show resize handles on every column that allows it.",
      },
      {
        name: "defaultColumnSizing",
        type: "Record<string, number>",
        desc: "Initial widths by column id, over each column's size.",
      },
      {
        name: "onColumnSizingChange",
        type: "(sizing: Record<string, number>) => void",
        desc: "Full widths-by-id map after every drag tick.",
      },
      {
        name: "onRowClick",
        type: "(row: Row) => void",
        desc: "Makes rows clickable; called with the row's original datum.",
      },
      {
        name: "emptyLabel",
        type: "string",
        default: '"No rows"',
        desc: "Copy shown in place of rows when data is empty.",
      },
    ],
  },
  "date-picker": {
    exports: ["DatePicker"],
    notes: [
      "Optional peer: react-day-picker (through calendar).",
      'One Date in and out. The "HH:mm" plumbing Calendar needs for its time column stays inside — you never see getCalendarTime / setCalendarTime.',
      "Closes on the pick that completes the value: the day for date, the slot for time, and the slot for datetime too — picking a day there leaves it open, since the time is still to come.",
      'Under granularity="time" with no value yet, the slot lands on today. A time needs a day to be a moment.',
      "Under datetime, a day picked before any slot reads as 12:00 AM in the trigger until the slot is picked — the value really is midnight on that day.",
      'The trigger is a borderless, filled Button (variant secondary): a flat block that reads as a control to press, with no hairline competing with the popover\'s edge. Pass variant="outline" when it must line up with text inputs. It sizes to its content; pass a width in className when it must fill something.',
      "Single value only. A range picker is a different control, not a mode of this one.",
      "Derives `${testId}-calendar` for the calendar inside; its days and slots derive from that in turn.",
    ],
    props: [
      { name: "value", type: "Date | undefined", desc: "The picked moment." },
      {
        name: "onValueChange",
        type: "(value: Date | undefined) => void",
        desc: "Next value; undefined when the day is deselected.",
      },
      {
        name: "granularity",
        type: '"date" | "time" | "datetime"',
        default: '"date"',
        desc: "Passed to the calendar; also picks the glyph, placeholder and format.",
      },
      {
        name: "placeholder",
        type: "string",
        default: "per granularity",
        desc: "Trigger copy with no value. Pass a translated string.",
      },
      {
        name: "formatValue",
        type: "(value: Date) => string",
        default: "locale medium date / short time",
        desc: "Trigger copy from a value.",
      },
      {
        name: "calendarProps",
        type: "Calendar props",
        desc: "timeStart, timeEnd, timeStep, timeDisabled, disabled… for the calendar inside.",
      },
      {
        name: "align",
        type: '"start" | "center" | "end"',
        default: '"start"',
        desc: "Popover alignment against the trigger.",
      },
    ],
  },
  calendar: {
    exports: [
      "Calendar",
      "CalendarDayButton",
      "CalendarGranularity",
      "getCalendarTime",
      "setCalendarTime",
    ],
    notes: [
      "Optional peer: react-day-picker.",
      'granularity picks the fields: "date" (grid only, the default), "time" (a lone time field — every DayPicker prop is ignored) or "datetime" (both, field on a hairline under the grid).',
      'Time is a "HH:mm" string, not part of `selected`. DayPicker types selected/onSelect as a closed union keyed on mode, so a Date there would mean one thing under mode="single" and nothing under mode="range". getCalendarTime / setCalendarTime bridge the two so a datetime calendar still drives one Date in state.',
      "setCalendarTime returns the date untouched when the field is cleared, and undefined when no date is picked yet — a time with no day is not a moment.",
      "Run onSelect through setCalendarTime too: DayPicker deals in days and hands back midnight, so a bare onSelect={setDate} resets the time to 00:00 whenever a different day is picked. onSelect={(day) => setWhen(setCalendarTime(day, getCalendarTime(when)))}.",
      "Time is a column of slots beside the grid, not a field you type into: one row per timeStep minutes from timeStart to timeEnd, the chosen one a solid accent block like the chosen day. That is the only form that can show which times are unavailable — timeDisabled greys them out in place.",
      "timeStep is minutes (default 30), timeStart/timeEnd bound the generated list, and timeSlots replaces it outright for an irregular set.",
      "Rows are labelled through the calendar's own locale, so the list reads 9:30 AM under en-US and 09:30 under de-DE with no hour12 prop to get wrong. Override with formatTime.",
      "The column brings the selected row into view when it is off screen, by setting its own scrollTop rather than calling scrollIntoView — the latter would also scroll the page behind an open popover. A row already in view is left alone, so clicking never yanks the list.",
      "The rows are a labelled group of aria-pressed buttons, like OptionList's, not a listbox of options — a listbox promises arrow-key roving and aria-activedescendant, and announcing that without implementing it is worse than plain toggles that tab.",
      "A time that is not one of the slots leaves the column with nothing selected — getCalendarTime(new Date()) is almost never on a boundary, so seed state with a slot value.",
      "Below the sm breakpoint the column stacks under the grid, four rows tall, with the hairline on top — a grid plus a column is wider than a phone in portrait. The panel is capped at max-w-full, so it is safe in a full-width sheet.",
      "Uncontrolled unless `time` is given, like the day selection above it.",
      "Under time/datetime the outermost element is the panel, so className and data-testid land there rather than on the grid.",
      "Every DayPicker prop passes through, and className / classNames merge on top of the defaults so you can tweak one slot without redeclaring the rest.",
      "`locale` also drives the month dropdown's own labels, so a localized calendar does not end up with English month abbreviations in its caption.",
      "Day test ids are ISO (`${testId}-day-2026-09-19`) and built from local date parts, not toISOString — the latter converts to UTC and would label the cell with the previous day east of Greenwich.",
    ],
    props: [
      {
        name: "granularity",
        type: '"date" | "time" | "datetime"',
        default: '"date"',
        desc: "Which fields show: the month grid, a time field, or both.",
      },
      {
        name: "time / defaultTime",
        type: "string",
        desc: 'Controlled / initial selection, "HH:mm".',
      },
      {
        name: "onTimeChange",
        type: "(time: string) => void",
        desc: 'Called with the row\'s "HH:mm" value when it is clicked.',
      },
      {
        name: "timeStep",
        type: "number",
        default: "30",
        desc: "Minutes between generated slots.",
      },
      {
        name: "timeStart / timeEnd",
        type: "string",
        default: '"00:00" / "23:30"',
        desc: "Bounds of the generated list, both inclusive.",
      },
      {
        name: "timeSlots",
        type: "string[]",
        desc: 'Explicit "HH:mm" list, for an irregular set of times.',
      },
      {
        name: "timeDisabled",
        type: "(time: string) => boolean",
        desc: "Greys a row out and makes it unclickable.",
      },
      {
        name: "formatTime",
        type: "(time: string) => string",
        default: "locale hour/minute",
        desc: "Row label from a 24-hour value.",
      },
      {
        name: "timeLabel",
        type: "string",
        default: '"Time"',
        desc: "Accessible name for the column. Pass a translated string.",
      },
      {
        name: "mode",
        type: '"single" | "multiple" | "range"',
        desc: "Selection behaviour. Passed through to DayPicker.",
      },
      {
        name: "captionLayout",
        type: '"label" | "dropdown" | …',
        default: '"label"',
        desc: "Month caption style.",
      },
      {
        name: "buttonVariant",
        type: "Button variant",
        default: '"ghost"',
        desc: "Variant for the prev/next arrows.",
      },
      {
        name: "showOutsideDays",
        type: "boolean",
        default: "true",
        desc: "Render neighbouring months' leading/trailing days.",
      },
    ],
  },
  resizable: {
    exports: ["ResizableGroup", "ResizableHandle", "ResizablePanel"],
    notes: [
      "Optional peer: react-resizable-panels.",
      "The handle renders as a 1px line but claims a 12px invisible hit area — a literal 1px drag target is unusable with a mouse and impossible with a trackpad.",
      'data-testid and id are overwritten with generated values on the group and panels; react-resizable-panels claims them for layout persistence. Target [data-slot="resizable-group"] instead, or put your id on a wrapper.',
      "ref yields the library's imperative panel-group handle, not the DOM node. className does pass through normally.",
    ],
    props: [
      {
        name: "orientation (Group)",
        type: '"horizontal" | "vertical"',
        desc: "Lay panels side by side, or stack them.",
      },
      {
        name: "defaultSize / minSize (Panel)",
        type: "string",
        desc: "Passed through to react-resizable-panels.",
      },
    ],
  },
  sidebar: {
    exports: [
      "Sidebar",
      "SidebarContent",
      "SidebarFooter",
      "SidebarGroup",
      "SidebarGroupLabel",
      "SidebarHeader",
      "SidebarItem",
      "SidebarRail",
      "SidebarRailButton",
      "SidebarRailSpacer",
      "SidebarRailTablist",
      "SidebarSeparator",
      "SidebarTitle",
    ],
    notes: [
      "Server-safe — no hooks and no state of its own. The parts that take an onClick put the client boundary in your file, not ours.",
      "Two halves. The rail is the 48px icon strip that selects a section; the pane is the full-height column it selects. They are separate components because plenty of layouts want one without the other.",
      "The pane carries no chrome of its own — compose SidebarHeader, SidebarContent and SidebarFooter inside it. Same reasoning as DialogContent: keeping padding and dividers in the parts is what makes every instance read as the same object.",
      "The rail button's active marker grows from zero height rather than appearing at full size, so switching sections never nudges the icon beside it.",
      '`data-active` is a styling hook and says nothing to a screen reader. When a rail button is a tab, set `aria-selected` and `aria-controls` alongside it, and give the pane `role="tabpanel"` with a matching `id`.',
      "SidebarRail renders a <nav>, so give it an aria-label — on a page with more than one navigation landmark an unnamed one is indistinguishable from the rest.",
      "Only the controls that switch the shared pane belong in SidebarRailTablist. A button that opens a dialog or signs you out is not a tab; leave it a loose child.",
      "SidebarHeader is 48px, the same height as the rail's first control, so the two line up across the seam.",
      'SidebarItem renders a <button type="button">. Inside a form the default would be "submit", which would post the form on every row click.',
      'Pass `side="right"` to both SidebarRail and its buttons for a rail on the trailing edge — the border and the state markers both flip.',
      "The pane fills its parent edge to edge, so it drops straight into a ResizablePanel.",
      "`texture` draws a decorative wash — checker, dots or graph — on a ::before behind the content, from the active palette's accent. It is what makes a side panel read as a distinct layer rather than flat filler.",
      "SidebarHeader and SidebarFooter paint flat above the wash (they carry `relative` and an opaque background), so the pattern belongs to the content area, not the chrome. Leave the rail flat too — a flat strip beside a textured pane is what makes the pane read as a surface — and never texture the work area.",
      "Texture strength is `--app-texture-alpha` (default 0.05). Set it on an ancestor to tune one panel, on :root to tune all of them — the apps expose it as a user setting.",
    ],
    props: [
      {
        name: "side (Rail, RailButton)",
        type: '"left" | "right"',
        default: '"left"',
        desc: "Which edge the rail sits on, and which side its state markers point from. Pass the same value to both.",
      },
      {
        name: "texture (Rail, Sidebar)",
        type: '"none" | "checker" | "dots" | "graph"',
        default: '"none"',
        desc: "Decorative wash over the surface, drawn from the palette accent at --app-texture-alpha.",
      },
      {
        name: "size (RailButton)",
        type: '"default" | "sm"',
        default: '"default"',
        desc: "36px, or 32px for a denser rail.",
      },
      {
        name: "asChild (RailButton, Item)",
        type: "boolean",
        default: "false",
        desc: "Render the caller's child element instead of a <button> — for a control that is really a link.",
      },
      {
        name: "data-active (RailButton)",
        type: "boolean",
        desc: "Marks the current control: drives the tint and the edge marker. Pair with aria-selected when it is a tab.",
      },
      {
        name: "data-selected (Item)",
        type: "boolean",
        desc: "Marks the current row. Uses the same treatment as every other selectable row in the system.",
      },
    ],
  },
  progress: {
    exports: ["Progress", "progressVariants"],
    notes: [
      "The bar is two objects, not one: the fill stops a gap short of the value and the remainder starts a gap after it, both ends round.",
      "Neither segment ever vanishes — each collapses to a single pip the height of the track at its own extreme. The trailing pip at max flips to the accent colour as the 'done' mark; the leading pip at 0 keeps an empty bar from going blank.",
      "Because both pips have to fit inside the caller's width, the track is laid out `calc(100% - 2 * (gap + pip))` wide and centred, with each segment overhanging its own end. Do not add `overflow-hidden` to the wrapper; it would clip them.",
      "`value={null}` is the indeterminate state: the split makes no sense without a value, so the track becomes a solid channel with a segment sweeping across it. The keyframe ships in this library's styles — it is not tw-animate-css.",
      "Values outside 0..max are clamped rather than overflowing the track.",
      "`formatValue` feeds both the visible readout and the bar's aria-valuetext, so the two cannot disagree.",
      'A caller\'s data-testid lands on the wrapper. The internals are reachable as [data-slot="progress-track"] / -indicator / -remainder.',
    ],
    props: [
      {
        name: "value",
        type: "number | null",
        default: "null",
        desc: "Current value. null is the indeterminate sweep.",
      },
      {
        name: "max",
        type: "number",
        default: "100",
        desc: "Value that counts as complete.",
      },
      {
        name: "label",
        type: "ReactNode",
        desc: "Header copy on the left. Pass a translated string; no default.",
      },
      {
        name: "showValue",
        type: "boolean",
        default: "label !== undefined",
        desc: "Render the formatted readout on the right of the header row.",
      },
      {
        name: "formatValue",
        type: "(value: number, max: number) => string",
        default: "rounded percentage",
        desc: "Readout string, and the aria-valuetext with it.",
      },
      {
        name: "size",
        type: '"sm" | "default" | "lg"',
        default: '"default"',
        desc: "Track height; the gap and pip derive from it.",
      },
    ],
  },
  slider: {
    exports: ["Slider", "sliderVariants", "sliderThumbVariants"],
    notes: [
      "Scalar, unlike the Radix primitive underneath: `value` is a number and `onValueChange` hands you a number, not an array.",
      "Single thumb only. The split geometry is positioned from one percentage, so a second thumb would have nowhere to put its gap — compose radix-ui's Slider directly for a two-handle range.",
      "The thumb is a capsule sitting in the gap between fill and remainder. That gap is what keeps it legible against a fill in the same accent, with no ring in the surface colour to go wrong on a panel, a sidebar or a textured pane.",
      "The capsule is dead centre in the gap at every value. Radix nudges a thumb inward near either end so it cannot overflow its track; that nudge is cancelled here with an opposite translateX, and the track is inset by a gap plus a pip at each end instead — at min the fill is a leading pip with the capsule one gap after it, at max the remainder is a trailing pip one gap past it.",
      "Same anatomy as Progress, so a slider and a progress bar at the same value line up exactly.",
      "Works controlled or uncontrolled; either way the component tracks the value itself, because the fill and remainder are placed from it.",
      "onValueChange fires on every step while dragging, onValueCommit once at the end. Put the expensive write in the latter.",
      "Horizontal only — no orientation prop.",
      "Derives `${testId}-thumb`, the one node a caller cannot otherwise reach.",
    ],
    props: [
      {
        name: "value",
        type: "number",
        desc: "Current value, controlled form.",
      },
      {
        name: "defaultValue",
        type: "number",
        default: "min",
        desc: "Starting value, uncontrolled form.",
      },
      {
        name: "onValueChange",
        type: "(value: number) => void",
        desc: "Every step while dragging.",
      },
      {
        name: "onValueCommit",
        type: "(value: number) => void",
        desc: "Once, when the drag or key repeat ends.",
      },
      {
        name: "min / max / step",
        type: "number",
        default: "0 / 100 / 1",
        desc: "Range and increment.",
      },
      {
        name: "label",
        type: "ReactNode",
        desc: "Header copy, and the thumb's accessible name via aria-labelledby.",
      },
      {
        name: "formatValue",
        type: "(value: number, max: number) => string",
        default: "rounded percentage",
        desc: "Readout string. Override for units — v.toFixed(1), `${v}px`.",
      },
      {
        name: "size",
        type: '"sm" | "default" | "lg"',
        default: '"default"',
        desc: "Track height, gap, pip and thumb capsule.",
      },
    ],
  },
  separator: {
    exports: ["Separator"],
    notes: [
      "Sits on app-border — the hairline tone, not the text color — so a divider never competes with the content on either side.",
      "Decorative by default, and therefore hidden from assistive tech. Set `decorative={false}` when the rule carries real structural meaning.",
    ],
    props: [
      {
        name: "orientation",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        desc: "Rule direction.",
      },
      {
        name: "decorative",
        type: "boolean",
        default: "true",
        desc: "Hide from assistive tech.",
      },
    ],
  },
  skeleton: {
    exports: ["Skeleton"],
    notes: [
      "Server-safe — a Server Component can render a loading shell without pulling in a client boundary.",
      "aria-hidden, so a screen reader hears the loading state from whatever live region you own rather than from a wall of empty boxes.",
      "No intrinsic dimensions. Size it with className.",
    ],
    props: [
      {
        name: "className",
        type: "string",
        desc: "Where the size lives: h-4 w-32, and a different radius if needed.",
      },
    ],
  },
  "error-boundary": {
    exports: ["ErrorBoundary"],
    notes: [
      "A class component, unlike everything else here: React exposes no hook equivalent of getDerivedStateFromError.",
      "Does not catch async, event-handler or rAF errors — React never routes those through a boundary. Those need a window-level handler, which belongs in your app: which async failures are benign is an application question, and a library that swallowed them would hide real bugs from you.",
      "resetKeys clears the error when an input changes, so recovery happens on its own once the thing that broke it changes.",
      "Derives `${testId}-error-fallback` and `${testId}-retry-button`.",
    ],
    props: [
      {
        name: "fallback",
        type: "(error, reset) => ReactNode",
        desc: "Full replacement for the default UI. When given, message / retryLabel / className are unused.",
      },
      {
        name: "resetKeys",
        type: "unknown[]",
        desc: "Values that, when changed, clear the error.",
      },
      {
        name: "onError",
        type: "(error, info) => void",
        desc: "Side effect on catch — logging or telemetry.",
      },
      {
        name: "message",
        type: "string",
        default: '"Something went wrong rendering this view."',
        desc: "Copy for the default fallback.",
      },
      {
        name: "retryLabel",
        type: "string",
        default: '"Retry"',
        desc: "Label for the default fallback's retry button.",
      },
    ],
  },
};
