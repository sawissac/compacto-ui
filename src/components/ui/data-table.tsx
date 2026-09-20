"use client";

import {
  type ColumnDef,
  columnResizingFeature,
  columnSizingFeature,
  type ColumnSizingState,
  createColumnHelper,
  createSortedRowModel,
  type RowData,
  rowSortingFeature,
  type SortingState,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/cn";

/**
 * The TanStack features this table registers — sorting (with its row model),
 * column sizing and the resize gesture on top of it. In v9 nothing exists on
 * a column until its feature is registered, so column defs must be typed
 * against this exact set; use {@link dataTableColumnHelper} and they will be.
 *
 * `columnResizingFeature` is the gesture only; it writes into the sizing
 * state `columnSizingFeature` owns, which is why both are here and sizing
 * comes first.
 */
const dataTableFeatures = tableFeatures({
  columnSizingFeature,
  columnResizingFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
});

type DataTableFeatures = typeof dataTableFeatures;

/** A column definition typed for {@link DataTable}. Build them with {@link dataTableColumnHelper}. */
type DataTableColumn<TData extends RowData, TValue = any> = ColumnDef<
  DataTableFeatures,
  TData,
  TValue
>;

/**
 * `createColumnHelper` pre-bound to {@link DataTable}'s feature set, so
 * `helper.accessor("age", { header: "Age", size: 80 })` type-checks against
 * exactly what the table can do (sort, size, resize) and nothing it can't.
 *
 * Call it once at module scope per row type.
 */
function dataTableColumnHelper<TData extends RowData>() {
  return createColumnHelper<DataTableFeatures, TData>();
}

const EMPTY: never[] = [];

/**
 * A sortable, row-virtualized data table over `@tanstack/react-table` +
 * `@tanstack/react-virtual`. Reach for it whenever an app renders more than a
 * screenful of homogeneous rows — request history, logs, a collection's
 * entries — instead of hand-rolling `<table>`: sorting comes from the column
 * defs, and only the rows in view are in the DOM, so ten thousand rows cost
 * the same as forty.
 *
 * TanStack Table is headless — it produces header groups and a row model; this
 * component owns the markup, the `--app-*` styling, the sticky header, sort
 * affordances and `aria-sort`. TanStack Virtual is composed on top of the
 * final sorted row model (never the raw `data`), positioning rows with a pair
 * of spacer `<tr>`s so the table keeps native column layout.
 *
 * Rows scroll inside a fixed-height box — virtualization needs a bounded
 * scroll element. Size that box with `height`, or override it with a
 * `className` like `h-full` inside a parent that already constrains height.
 *
 * Columns resize by dragging the hairline at a header's right edge; a double
 * click puts a column back to its `size`. Widths update live as you drag
 * (`columnResizeMode: "onChange"`), which is affordable here because only the
 * rows in view re-render. The table is laid out `table-fixed`, so a dragged
 * width is the width you get rather than a hint the browser reweighs against
 * the content; when the columns add up to less than the box, the slack is
 * shared out across them, and when they add up to more, the box scrolls.
 * Widths stay internal after `defaultColumnSizing`; mirror them out through
 * `onColumnSizingChange` when an app wants to remember them.
 *
 * The handle is mouse and touch only. TanStack's gesture has no keyboard
 * path, and a fake one that moved by fixed steps would promise more than it
 * delivered — the handle is `aria-hidden` and a column's width is never the
 * only way to reach its content.
 *
 * @param props.columns - Column defs from {@link dataTableColumnHelper}. A
 *   column's `size` is its width in px, `minSize` / `maxSize` bound a drag,
 *   `enableSorting: false` removes the sort affordance from its header and
 *   `enableResizing: false` removes its handle.
 * @param props.data - The rows. Keep the reference stable between renders
 *   (state, a query result, a module constant) — a fresh array each render
 *   rebuilds the row model every time.
 * @param props.getRowId - Stable id per row, used for React keys, virtual
 *   measurement and the derived `data-testid`. Defaults to the row index.
 * @param props.height - Height of the scroll box in px. Ignored if a
 *   `className` sets its own height.
 * @param props.rowHeight - Estimated row height in px. Rows are measured after
 *   mount, so this only has to be close.
 * @param props.defaultSorting - Initial sort. Sorting stays internal after
 *   that; clicking a sortable header toggles ascending → descending → off.
 * @param props.resizable - Show resize handles. Default `true`; `false` locks
 *   every column at its `size`.
 * @param props.defaultColumnSizing - Initial widths by column id, on top of
 *   each column's `size` — what an app hands back after remembering a drag.
 * @param props.onColumnSizingChange - Called with the full widths-by-id map
 *   after every drag tick. Persist it, and feed it back as
 *   `defaultColumnSizing` next time.
 * @param props.onRowClick - Makes rows clickable and calls back with the row's
 *   original datum.
 * @param props.emptyLabel - Copy shown in place of rows when `data` is empty.
 *
 * @example
 * ```tsx
 * type Request = { id: string; method: string; path: string; status: number; ms: number };
 *
 * const helper = dataTableColumnHelper<Request>();
 * const columns = helper.columns([
 *   helper.accessor("method", { header: "Method", size: 80 }),
 *   helper.accessor("path", { header: "Path" }),
 *   helper.accessor("status", { header: "Status", size: 80 }),
 *   helper.accessor("ms", { header: "Time", size: 80, cell: (c) => `${c.getValue()} ms` }),
 * ]);
 *
 * <DataTable
 *   columns={columns}
 *   data={requests}
 *   getRowId={(r) => r.id}
 *   defaultSorting={[{ id: "ms", desc: true }]}
 *   onRowClick={(r) => open(r.id)}
 * />
 * ```
 */
function DataTable<TData extends RowData>({
  className,
  style,
  columns,
  data,
  getRowId,
  height = 400,
  rowHeight = 36,
  defaultSorting,
  resizable = true,
  defaultColumnSizing,
  onColumnSizingChange,
  onRowClick,
  emptyLabel = "No rows",
  "data-testid": testId,
  ...props
}: Omit<React.ComponentProps<"div">, "onChange"> & {
  columns: ReadonlyArray<DataTableColumn<TData>>;
  data: ReadonlyArray<TData>;
  getRowId?: (row: TData, index: number) => string;
  height?: number;
  rowHeight?: number;
  defaultSorting?: SortingState;
  resizable?: boolean;
  defaultColumnSizing?: ColumnSizingState;
  onColumnSizingChange?: (sizing: ColumnSizingState) => void;
  onRowClick?: (row: TData) => void;
  emptyLabel?: string;
  /** Base id. Derives `${data-testid}-header-<columnId>` per header and `${data-testid}-row-<rowId>` per row. */
  "data-testid"?: string;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Sizing is held here rather than left to TanStack's own initialState so
  // every change can be mirrored out through onColumnSizingChange as a plain
  // map, not the updater TanStack hands us.
  const [columnSizing, setColumnSizing] = React.useState<ColumnSizingState>(
    () => defaultColumnSizing ?? {},
  );

  const table = useTable({
    features: dataTableFeatures,
    columns: columns as ColumnDef<DataTableFeatures, TData, any>[],
    data: data.length === 0 ? EMPTY : data,
    getRowId,
    enableMultiSort: false,
    enableColumnResizing: resizable,
    columnResizeMode: "onChange",
    initialState: defaultSorting ? { sorting: defaultSorting } : undefined,
    state: { columnSizing },
    onColumnSizingChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(columnSizing) : updater;
      setColumnSizing(next);
      onColumnSizingChange?.(next);
    },
  });

  // v9 has no getState(); `table.state` holds every registered slice when
  // useTable is given no selector, as here.
  const resizingColumn = table.state.columnResizing.isResizingColumn;

  const rows = table.getRowModel().rows;

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => rowHeight,
    getItemKey: (index) => rows[index].id,
    overscan: 8,
    // Lets the server render the first screenful instead of an empty body
    // that fills in on hydration.
    initialRect: { width: 0, height },
  });

  const items = virtualizer.getVirtualItems();
  const paddingTop = items.length > 0 ? items[0].start : 0;
  const paddingBottom =
    items.length > 0
      ? virtualizer.getTotalSize() - items[items.length - 1].end
      : 0;
  const columnCount = table.getAllLeafColumns().length;

  return (
    <div
      ref={scrollRef}
      data-slot="data-table"
      data-testid={testId}
      data-resizing={resizingColumn || undefined}
      className={cn(
        "relative overflow-auto rounded-lg border border-app-border-mid bg-app-panel",
        // Mid-drag the pointer crosses every cell; without this the text
        // under it highlights and the cursor flickers back to an I-beam.
        "data-resizing:cursor-col-resize data-resizing:select-none",
        className,
      )}
      style={{ height, ...style }}
      {...props}
    >
      <table
        data-slot="data-table-table"
        className="w-full table-fixed border-separate border-spacing-0 text-left text-[12px]"
        style={{ minWidth: table.getTotalSize() }}
      >
        <thead data-slot="data-table-head" className="sticky top-0 z-10">
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id} data-slot="data-table-header-row">
              {group.headers.map((header) => {
                const sorted = header.column.getIsSorted();
                const canSort = header.column.getCanSort();
                return (
                  <th
                    key={header.id}
                    data-slot="data-table-header"
                    data-testid={
                      testId
                        ? `${testId}-header-${header.column.id}`
                        : undefined
                    }
                    data-sorted={sorted || undefined}
                    aria-sort={
                      sorted === "asc"
                        ? "ascending"
                        : sorted === "desc"
                          ? "descending"
                          : "none"
                    }
                    colSpan={header.colSpan}
                    style={{ width: header.getSize() }}
                    className="relative border-b border-app-border-mid bg-app-sidebar px-3 py-2 font-title text-[10px] font-semibold tracking-[0.06em] text-app-dim uppercase"
                  >
                    {header.isPlaceholder ? null : canSort ? (
                      <button
                        type="button"
                        data-slot="data-table-sort"
                        onClick={header.column.getToggleSortingHandler()}
                        className="inline-flex max-w-full items-center gap-1 rounded-sm text-inherit transition-colors duration-(--motion-duration-fast) hover:text-app-bright focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:outline-none data-sorted:text-app-accent"
                        data-sorted={sorted || undefined}
                      >
                        <span className="truncate">
                          <table.FlexRender header={header} />
                        </span>
                        {sorted === "asc" ? (
                          <ChevronUp
                            size={12}
                            aria-hidden
                            className="shrink-0"
                          />
                        ) : sorted === "desc" ? (
                          <ChevronDown
                            size={12}
                            aria-hidden
                            className="shrink-0"
                          />
                        ) : (
                          <ChevronsUpDown
                            size={12}
                            aria-hidden
                            className="shrink-0 opacity-50"
                          />
                        )}
                      </button>
                    ) : (
                      <table.FlexRender header={header} />
                    )}
                    {header.column.getCanResize() && (
                      <div
                        aria-hidden
                        data-slot="data-table-resize-handle"
                        data-resizing={
                          header.column.getIsResizing() || undefined
                        }
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        onDoubleClick={() => header.column.resetSize()}
                        // An 8px grab area drawn as a 1px hairline: the strip
                        // is the hit target, the ::after is what you see. The
                        // hairline sits on app-border at rest so the columns
                        // read as columns, and goes accent under the pointer
                        // and for the whole drag.
                        className="absolute inset-y-0 right-0 w-2 cursor-col-resize touch-none select-none after:absolute after:inset-y-1.5 after:right-0 after:w-px after:bg-app-border after:transition-colors after:duration-(--motion-duration-fast) hover:after:bg-app-accent data-resizing:after:bg-app-accent"
                      />
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody data-slot="data-table-body">
          {rows.length === 0 ? (
            <tr data-slot="data-table-empty">
              <td
                colSpan={columnCount}
                className="px-3 py-8 text-center text-app-dim"
              >
                {emptyLabel}
              </td>
            </tr>
          ) : (
            <>
              {paddingTop > 0 && (
                <tr data-slot="data-table-spacer" aria-hidden>
                  <td colSpan={columnCount} style={{ height: paddingTop }} />
                </tr>
              )}
              {items.map((item) => {
                const row = rows[item.index];
                return (
                  <tr
                    key={row.id}
                    ref={virtualizer.measureElement}
                    data-index={item.index}
                    data-slot="data-table-row"
                    data-testid={testId ? `${testId}-row-${row.id}` : undefined}
                    onClick={
                      onRowClick ? () => onRowClick(row.original) : undefined
                    }
                    className={cn(
                      "transition-colors duration-(--motion-duration-fast) hover:bg-app-hover",
                      onRowClick && "cursor-pointer",
                    )}
                  >
                    {row.getAllCells().map((cell) => (
                      <td
                        key={cell.id}
                        data-slot="data-table-cell"
                        style={{ width: cell.column.getSize() }}
                        className="max-w-0 truncate border-b border-app-border px-3 py-2 text-app-text"
                      >
                        <table.FlexRender cell={cell} />
                      </td>
                    ))}
                  </tr>
                );
              })}
              {paddingBottom > 0 && (
                <tr data-slot="data-table-spacer" aria-hidden>
                  <td colSpan={columnCount} style={{ height: paddingBottom }} />
                </tr>
              )}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}

export {
  DataTable,
  type DataTableColumn,
  dataTableColumnHelper,
  type DataTableFeatures,
};
