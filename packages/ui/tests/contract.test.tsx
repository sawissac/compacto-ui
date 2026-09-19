import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";

import { Button } from "../src/components/button.js";
import { ButtonGroup } from "../src/components/button-group.js";
import { Calendar } from "../src/components/calendar.js";
import { Command, CommandInput } from "../src/components/command.js";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../src/components/dialog.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../src/components/dropdown-menu.js";
import { ErrorBoundary } from "../src/components/error-boundary.js";
import { Input } from "../src/components/input.js";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../src/components/popover.js";
import { ResizableGroup, ResizablePanel } from "../src/components/resizable.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../src/components/select.js";
import { Separator } from "../src/components/separator.js";
import { Skeleton } from "../src/components/skeleton.js";
import { Tabs, TabsList, TabsTrigger } from "../src/components/tabs.js";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../src/components/tooltip.js";

/**
 * The contract every primitive owes its callers, asserted once per component
 * rather than re-litigated in fifteen bespoke test files.
 *
 * Four properties, each of which has a specific way of silently breaking:
 *
 *  1. **`data-slot`** — consumers select our internals with it. Rename one and
 *     nothing fails to compile; someone's CSS just stops applying.
 *  2. **`data-testid` reaches the DOM** — true for free as long as `...props`
 *     lands on a real element. Intercepting a prop without re-applying it is
 *     exactly the mistake this catches, and it is the one the `data-testid`
 *     type declarations introduced.
 *  3. **caller `className` wins** — proves `cn(...)` puts the caller last. Get
 *     the order wrong and every override in both consuming apps silently
 *     stops working.
 *  4. **`ref` reaches a DOM node** — proves the React 19 ref-as-prop refactor
 *     that removed `forwardRef` from `Input`.
 *
 * Overlay parts render open (`defaultOpen`), since their DOM does not exist
 * until they do.
 */

type Case = {
  name: string;
  slot: string;
  /** Renders the component with whatever extra props the case is probing. */
  render: (props: Record<string, unknown>) => React.ReactElement;
  /**
   * Where the caller's `data-testid` actually lands, when it is not on the
   * element itself. `ErrorBoundary` never renders the raw id — it only derives
   * from it — so that is the node to look for.
   */
  testIdTarget?: (base: string) => string;
  /**
   * Set when a third-party dependency claims `data-testid` for itself, so the
   * forwarding assertion cannot hold. The className assertion then falls back
   * to a `data-slot` lookup. Only `resizable` needs this; see its JSDoc.
   */
  testIdOwnedByDependency?: boolean;
  /** Skip the ref assertion for parts that render no host element of their own. */
  skipRef?: boolean;
};

const CASES: Case[] = [
  {
    name: "Button",
    slot: "button",
    render: (p) => <Button {...p}>ok</Button>,
  },
  {
    name: "ButtonGroup",
    slot: "button-group",
    render: (p) => (
      <ButtonGroup {...p}>
        <Button>a</Button>
      </ButtonGroup>
    ),
  },
  {
    name: "Input",
    slot: "input",
    render: (p) => <Input aria-label="field" {...p} />,
  },
  {
    name: "Separator",
    slot: "separator",
    render: (p) => <Separator {...p} />,
  },
  {
    name: "Skeleton",
    slot: "skeleton",
    render: (p) => <Skeleton {...p} />,
  },
  {
    name: "Tabs",
    slot: "tabs",
    render: (p) => (
      <Tabs defaultValue="a" {...p}>
        <TabsList>
          <TabsTrigger value="a">a</TabsTrigger>
        </TabsList>
      </Tabs>
    ),
  },
  {
    name: "Calendar",
    slot: "calendar",
    render: (p) => <Calendar mode="single" {...p} />,
    // DayPicker owns its root element and does not forward a ref to it.
    skipRef: true,
  },
  {
    name: "Command",
    slot: "command",
    render: (p) => (
      <Command {...p}>
        <CommandInput placeholder="search" />
      </Command>
    ),
  },
  {
    name: "ResizableGroup",
    slot: "resizable-group",
    render: (p) => (
      <ResizableGroup orientation="horizontal" {...p}>
        <ResizablePanel>a</ResizablePanel>
      </ResizableGroup>
    ),
    // react-resizable-panels generates its own data-testid and id for layout
    // persistence, and hands back an imperative handle instead of a DOM ref.
    testIdOwnedByDependency: true,
    skipRef: true,
  },
  {
    name: "SelectTrigger",
    slot: "select-trigger",
    render: (p) => (
      <Select>
        <SelectTrigger aria-label="pick" {...p}>
          <SelectValue placeholder="pick" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">a</SelectItem>
        </SelectContent>
      </Select>
    ),
  },
  {
    name: "DialogContent",
    slot: "dialog-content",
    render: (p) => (
      <Dialog defaultOpen>
        <DialogContent {...p}>
          <DialogHeader>
            <DialogTitle>t</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    ),
  },
  {
    name: "PopoverContent",
    slot: "popover-content",
    render: (p) => (
      <Popover defaultOpen>
        <PopoverTrigger>open</PopoverTrigger>
        <PopoverContent {...p}>body</PopoverContent>
      </Popover>
    ),
  },
  {
    name: "DropdownMenuContent",
    slot: "dropdown-menu-content",
    render: (p) => (
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>open</DropdownMenuTrigger>
        <DropdownMenuContent {...p}>
          <DropdownMenuItem>a</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
  {
    name: "TooltipContent",
    slot: "tooltip-content",
    render: (p) => (
      <Tooltip defaultOpen>
        <TooltipTrigger>hover</TooltipTrigger>
        <TooltipContent {...p}>hint</TooltipContent>
      </Tooltip>
    ),
  },
  {
    name: "ErrorBoundary",
    slot: "error-boundary-fallback",
    render: (p) => (
      <ErrorBoundary {...p}>
        <Thrower />
      </ErrorBoundary>
    ),
    testIdTarget: (base) => `${base}-error-fallback`,
    skipRef: true,
  },
];

/** Forces the ErrorBoundary case into its fallback. */
function Thrower(): React.ReactElement {
  throw new Error("boom");
}

/** Silences React's expected console noise for the ErrorBoundary case. */
const quiet = { onError: () => {} };

function propsFor(c: Case, extra: Record<string, unknown>) {
  return c.name === "ErrorBoundary" ? { ...quiet, ...extra } : extra;
}

describe.each(CASES)("$name", (c) => {
  it("carries its data-slot", () => {
    const { container } = render(c.render(propsFor(c, {})));
    expect(
      container.ownerDocument.querySelector(`[data-slot="${c.slot}"]`),
    ).not.toBeNull();
  });

  it("forwards a caller data-testid to the DOM", () => {
    if (c.testIdOwnedByDependency) {
      return;
    }
    render(c.render(propsFor(c, { "data-testid": "probe" })));
    const expected = c.testIdTarget ? c.testIdTarget("probe") : "probe";
    expect(screen.getByTestId(expected)).toBeInTheDocument();
  });

  it("lets a caller className win over the built-in", () => {
    const { container } = render(
      c.render(propsFor(c, { "data-testid": "probe", className: "p-[3px]" })),
    );
    const el = c.testIdOwnedByDependency
      ? container.ownerDocument.querySelector(`[data-slot="${c.slot}"]`)
      : screen.getByTestId(c.testIdTarget ? c.testIdTarget("probe") : "probe");

    // tailwind-merge keeps the last conflicting utility, so the caller's
    // padding must survive — that only holds if cn() puts className last.
    expect(el?.className).toContain("p-[3px]");
  });

  it("sends ref to a DOM node", () => {
    if (c.skipRef) {
      return;
    }
    const ref = React.createRef<HTMLElement>();
    render(c.render(propsFor(c, { ref })));
    expect(ref.current).toBeInstanceOf(Element);
  });
});

describe("derived test ids", () => {
  it("Input derives a clear-button id and drops it without a base", () => {
    const { rerender } = render(
      <Input
        aria-label="field"
        data-testid="search"
        value="hello"
        onChange={() => {}}
      />,
    );
    expect(screen.getByTestId("search-clear-button")).toBeInTheDocument();

    rerender(<Input aria-label="field" value="hello" onChange={() => {}} />);
    expect(screen.queryByTestId("search-clear-button")).toBeNull();
    // The button is still there — it just carries no invented id.
    expect(
      document.querySelector('[data-slot="input-clear-button"]'),
    ).not.toBeNull();
  });

  it("DialogHeader derives a close-button id", () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogHeader data-testid="confirm">
            <DialogTitle>t</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.getByTestId("confirm-close-button")).toBeInTheDocument();
  });

  it("DialogFooter derives a close-button id only when it renders one", () => {
    const { rerender } = render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogHeader showCloseButton={false}>
            <DialogTitle>t</DialogTitle>
          </DialogHeader>
          <DialogFooter data-testid="foot" showCloseButton />
        </DialogContent>
      </Dialog>,
    );
    expect(screen.getByTestId("foot-close-button")).toBeInTheDocument();

    rerender(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogHeader showCloseButton={false}>
            <DialogTitle>t</DialogTitle>
          </DialogHeader>
          <DialogFooter data-testid="foot" />
        </DialogContent>
      </Dialog>,
    );
    expect(screen.queryByTestId("foot-close-button")).toBeNull();
  });

  it("ErrorBoundary derives fallback and retry ids", () => {
    render(
      <ErrorBoundary data-testid="pane" onError={() => {}}>
        <Thrower />
      </ErrorBoundary>,
    );
    expect(screen.getByTestId("pane-error-fallback")).toBeInTheDocument();
    expect(screen.getByTestId("pane-retry-button")).toBeInTheDocument();
  });

  it("Calendar derives ISO day ids regardless of runtime locale", () => {
    render(
      <Calendar
        mode="single"
        data-testid="cal"
        month={new Date(2026, 8, 1)}
        showOutsideDays={false}
      />,
    );
    expect(screen.getByTestId("cal-day-2026-09-19")).toBeInTheDocument();
    expect(screen.getByTestId("cal-prev-button")).toBeInTheDocument();
    expect(screen.getByTestId("cal-next-button")).toBeInTheDocument();
  });
});

describe("known third-party limitations", () => {
  it("ResizableGroup cannot forward data-testid — the library owns it", () => {
    const { container } = render(
      <ResizableGroup orientation="horizontal" data-testid="probe">
        <ResizablePanel>a</ResizablePanel>
      </ResizableGroup>,
    );
    const group = container.ownerDocument.querySelector(
      '[data-slot="resizable-group"]',
    );
    // Documented in resizable.tsx and data-test-id-list.md: react-resizable-panels
    // generates this attribute for its own layout persistence. Pinned here so
    // that if a future version stops doing it, we find out from a failing test
    // rather than from stale documentation.
    expect(group?.getAttribute("data-testid")).not.toBe("probe");
    expect(group).not.toBeNull();
  });
});

describe("copy props", () => {
  it("default to English and are overridable at the call site", () => {
    render(
      <Input
        aria-label="field"
        value="x"
        onChange={() => {}}
        clearLabel="ရှင်းလင်းရန်"
      />,
    );
    expect(screen.getByLabelText("ရှင်းလင်းရန်")).toBeInTheDocument();

    render(
      <ErrorBoundary onError={() => {}} message="Custom" retryLabel="Again">
        <Thrower />
      </ErrorBoundary>,
    );
    expect(screen.getByText("Custom")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Again/ })).toBeInTheDocument();
  });
});
