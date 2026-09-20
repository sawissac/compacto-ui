# data-testid registry

Not copied — this file documents the contract, it is not one of the files a
component's registry item copies into a consumer. Each consuming app keeps
its own registry for the ids it chooses at its call sites.

## Library primitives — forwarding contract

Every primitive spreads `...props` onto a real DOM node, so **a caller's
`data-testid` reaches the DOM with no work from us**. Single-element primitives
need nothing beyond not breaking that.

Derivation applies only where a primitive renders a node the caller has no
other way to reach. The base is read from `props["data-testid"]`; **when the
caller supplies no base, nothing is derived** — we never invent ids.

| Component        | Derived id                                       | Node                                                             |
| ---------------- | ------------------------------------------------ | ---------------------------------------------------------------- |
| `Input`          | `${base}-clear-button`                           | the inline clear X                                               |
| `DialogHeader`   | `${base}-close-button`                           | the title-row close X                                            |
| `DialogFooter`   | `${base}-close-button`                           | the footer Close button, when `showCloseButton`                  |
| `ErrorBoundary`  | `${base}-error-fallback`                         | the fallback root                                                |
| `ErrorBoundary`  | `${base}-retry-button`                           | the retry button                                                 |
| `Calendar`       | `${base}-day-<yyyy-mm-dd>`                       | each day button                                                  |
| `Calendar`       | `${base}-prev-button` / `${base}-next-button`    | month navigation                                                 |
| `Calendar`       | `${base}-time-<HH:mm>`                           | each time slot, under `granularity` time/datetime                |
| `DatePicker`     | `${base}-calendar`                               | the calendar in the popover; its days and slots derive from that |
| `Slider`         | `${base}-thumb`                                  | the drag handle                                                  |
| `FileUpload`     | `${base}-dropzone` / `${base}-dropzone-input`    | the drop well, and the hidden file input inside it               |
| `FileUpload`     | `${base}-item-<entry.id>`                        | each row (a `FileUploadItem`)                                    |
| `FileUploadItem` | `${base}-remove-button` / `${base}-retry-button` | the row's trash and retry buttons                                |
| `OptionGrid`     | `${base}-<value>`                                | each card                                                        |
| `OptionList`     | `${base}-<value>`                                | each row                                                         |
| `OptionPalette`  | `${base}-<hue>`                                  | each hue's inner `OptionGrid`                                    |
| `OptionPalette`  | `${base}-<hue>-<theme key>`                      | each palette card (via `OptionGrid`)                             |
| `DataTable`      | `${base}-header-<columnId>`                      | each header cell                                                 |
| `DataTable`      | `${base}-row-<rowId>`                            | each rendered row (only rows in view exist)                      |

`Input`'s `-clear-button` suffix is deliberately byte-identical to the contract
bulky-api already documents in its own registry, so that app's existing ids
keep resolving after it migrates to the package.

### No derivation

`Select`, `Tabs`, `Popover`, `DropdownMenu`, `Tooltip`, `Command`,
`ButtonGroup`, `Dialog` (root), `Button`, `Progress`, `Separator`, `Skeleton`,
`Sidebar`
(every part).

Each part of these is its own exported component, so the caller already owns
every id it could want. Deriving here would guess at structure the caller can
see perfectly well.

### Exception: `ResizableGroup` / `ResizablePanel`

These are the one place where a caller's `data-testid` **does not reach the
DOM**. `react-resizable-panels` generates its own `data-testid` and `id` on
both elements for layout persistence, and overwrites whatever we pass.

Target them with `[data-slot="resizable-group"]` / `[data-slot="resizable-panel"]`,
or put the test id on a wrapper element you control.

## Docs gallery

_(ids used by the docs gallery, `src/app` and friends, go here as it is built)_
