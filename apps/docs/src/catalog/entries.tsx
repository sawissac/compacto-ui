"use client";

import { Button } from "@compacto/ui/button";
import { ButtonGroup, ButtonGroupSeparator } from "@compacto/ui/button-group";
import { Calendar } from "@compacto/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@compacto/ui/command";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@compacto/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@compacto/ui/dropdown-menu";
import { ErrorBoundary } from "@compacto/ui/error-boundary";
import { Input } from "@compacto/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@compacto/ui/popover";
import {
  ResizableGroup,
  ResizableHandle,
  ResizablePanel,
} from "@compacto/ui/resizable";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@compacto/ui/select";
import { Separator } from "@compacto/ui/separator";
import { Skeleton } from "@compacto/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@compacto/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@compacto/ui/tooltip";
import {
  Copy,
  Download,
  FolderPlus,
  MoreVertical,
  RotateCw,
  Search,
  Trash2,
} from "lucide-react";
import * as React from "react";

export type Entry = {
  slug: string;
  name: string;
  /** One line on what the primitive is for. Shown under its heading. */
  blurb: string;
  /** Optional peer dependency this primitive needs. */
  peer?: string;
  /** Server-safe: no "use client" directive in the source module. */
  serverSafe?: boolean;
  Preview: () => React.ReactElement;
};

/**
 * Throws on demand rather than on render.
 *
 * A component that throws unconditionally also throws during Next's static
 * prerender, which fails the build — an error boundary catches the error at
 * runtime but the prerender still counts it as fatal. Gating on state keeps
 * the page prerenderable, and makes the better demo besides: you see the
 * healthy state, the fallback, and the reset.
 */
function Boom({ armed }: { armed: boolean }): React.ReactElement {
  if (armed) {
    throw new Error("Example failure");
  }
  return (
    <p className="p-4 text-center text-xs text-app-dim">Rendering normally.</p>
  );
}

export const ENTRIES: Entry[] = [
  {
    slug: "button",
    name: "Button",
    blurb: "Six roles, eight sizes, a 1px press settle and no elevation.",
    serverSafe: true,
    Preview: () => (
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button>Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="xs">xs</Button>
          <Button size="sm">sm</Button>
          <Button>default</Button>
          <Button size="lg">lg</Button>
          <Button size="icon-sm" variant="outline" aria-label="Copy">
            <Copy />
          </Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>
    ),
  },
  {
    slug: "button-group",
    name: "ButtonGroup",
    blurb: "Adjacent buttons as one connected control; touching borders merge.",
    serverSafe: true,
    Preview: () => (
      <div className="flex flex-wrap items-center gap-4">
        <ButtonGroup>
          <Button variant="outline" size="icon-sm" aria-label="Download">
            <Download />
          </Button>
          <Button variant="outline" size="icon-sm" aria-label="New folder">
            <FolderPlus />
          </Button>
          <Button variant="outline" size="icon-sm" aria-label="Delete">
            <Trash2 />
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button size="sm">Save</Button>
          <ButtonGroupSeparator />
          <Button size="sm">Publish</Button>
        </ButtonGroup>
        <ButtonGroup orientation="vertical">
          <Button variant="outline" size="sm">
            Top
          </Button>
          <Button variant="outline" size="sm">
            Bottom
          </Button>
        </ButtonGroup>
      </div>
    ),
  },
  {
    slug: "input",
    name: "Input",
    blurb: "Text field with an optional leading icon and an auto-clear button.",
    Preview: function InputPreview() {
      const [a, setA] = React.useState("");
      const [b, setB] = React.useState("has a value");
      return (
        <div className="flex max-w-sm flex-col gap-2">
          <Input
            placeholder="Plain field"
            value={a}
            onChange={(e) => setA(e.target.value)}
            aria-label="Plain field"
          />
          <Input
            icon={Search}
            placeholder="With icon"
            value={b}
            onChange={(e) => setB(e.target.value)}
            aria-label="Search"
          />
          <Input disabled value="Disabled" aria-label="Disabled" />
        </div>
      );
    },
  },
  {
    slug: "select",
    name: "Select",
    blurb: "The same box as Input, so fields and selects read as one family.",
    Preview: function SelectPreview() {
      const [value, setValue] = React.useState("GET");
      return (
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger className="w-44" aria-label="HTTP method">
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent>
            {/* SelectLabel throws unless it is inside a SelectGroup — Radix
                reads the group's context for the label's aria wiring. */}
            <SelectGroup>
              <SelectLabel>Safe</SelectLabel>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="HEAD">HEAD</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Mutating</SelectLabel>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    slug: "dialog",
    name: "Dialog",
    blurb: "Header / body / footer anatomy baked in, so every dialog matches.",
    Preview: () => (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Open dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename collection</DialogTitle>
            <DialogDescription>
              This only affects your local copy.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <Input defaultValue="Profile service" aria-label="Name" />
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ),
  },
  {
    slug: "popover",
    name: "Popover",
    blurb: "A small aside anchored to a control. Heavier edge than a tooltip.",
    Preview: () => (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Filters</Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Filter results</PopoverTitle>
            <PopoverDescription>
              Applies to the current view only.
            </PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
    ),
  },
  {
    slug: "dropdown-menu",
    name: "DropdownMenu",
    blurb: "Row actions, with a tinted (not solid) destructive variant.",
    Preview: function MenuPreview() {
      const [checked, setChecked] = React.useState(true);
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="More">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>Rename</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuCheckboxItem
              checked={checked}
              onCheckedChange={(v) => setChecked(Boolean(v))}
            >
              Show hidden
            </DropdownMenuCheckboxItem>
            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    slug: "tooltip",
    name: "Tooltip",
    blurb: "A hint, never the only place information lives.",
    Preview: () => (
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon-sm" aria-label="Refresh">
              <RotateCw />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Refresh the list</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              Below
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Anchored below</TooltipContent>
        </Tooltip>
      </div>
    ),
  },
  {
    slug: "tabs",
    name: "Tabs",
    blurb: "Filled segmented track, or a bare line with a rule marker.",
    Preview: () => (
      <div className="flex flex-col gap-6">
        <Tabs defaultValue="body">
          <TabsList>
            <TabsTrigger value="body">Body</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
            <TabsTrigger value="auth">Auth</TabsTrigger>
          </TabsList>
          <TabsContent value="body" className="text-xs text-app-dim">
            Filled variant.
          </TabsContent>
          <TabsContent value="headers" className="text-xs text-app-dim">
            Headers panel.
          </TabsContent>
          <TabsContent value="auth" className="text-xs text-app-dim">
            Auth panel.
          </TabsContent>
        </Tabs>
        <Tabs defaultValue="one">
          <TabsList variant="line">
            <TabsTrigger value="one">One</TabsTrigger>
            <TabsTrigger value="two">Two</TabsTrigger>
          </TabsList>
          <TabsContent value="one" className="text-xs text-app-dim">
            Line variant.
          </TabsContent>
          <TabsContent value="two" className="text-xs text-app-dim">
            Second panel.
          </TabsContent>
        </Tabs>
      </div>
    ),
  },
  {
    slug: "command",
    name: "Command",
    blurb: "Filterable command list; wrap in CommandDialog for a palette.",
    peer: "cmdk",
    Preview: () => (
      <Command className="max-w-sm rounded-lg border border-app-border-mid">
        <CommandInput placeholder="Type a command…" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem>
              Run request
              <CommandShortcut>⌘↵</CommandShortcut>
            </CommandItem>
            <CommandItem>
              New collection
              <CommandShortcut>⌘N</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    ),
  },
  {
    slug: "calendar",
    name: "Calendar",
    blurb: "Month grid; selected day is a solid accent block, today a ring.",
    peer: "react-day-picker",
    Preview: function CalendarPreview() {
      const [date, setDate] = React.useState<Date | undefined>(new Date());
      return (
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-lg border border-app-border-mid"
        />
      );
    },
  },
  {
    slug: "resizable",
    name: "Resizable",
    blurb: "Split panes; the 1px rule claims a 12px invisible hit area.",
    peer: "react-resizable-panels",
    Preview: () => (
      <div className="h-40 overflow-hidden rounded-lg border border-app-border-mid">
        <ResizableGroup orientation="horizontal">
          <ResizablePanel defaultSize="40%" minSize="20%">
            <div className="p-3 text-xs text-app-dim">Left</div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>
            <div className="p-3 text-xs text-app-dim">Right</div>
          </ResizablePanel>
        </ResizableGroup>
      </div>
    ),
  },
  {
    slug: "separator",
    name: "Separator",
    blurb: "Hairline rule on app-border, never competing with its content.",
    Preview: () => (
      <div className="flex flex-col gap-3">
        <Separator />
        <div className="flex h-8 items-center gap-3 text-xs">
          <span>One</span>
          <Separator orientation="vertical" />
          <span>Two</span>
          <Separator orientation="vertical" />
          <span>Three</span>
        </div>
      </div>
    ),
  },
  {
    slug: "skeleton",
    name: "Skeleton",
    blurb: "Loading placeholder. aria-hidden, no intrinsic size.",
    serverSafe: true,
    Preview: () => (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="size-10 rounded-full" />
      </div>
    ),
  },
  {
    slug: "error-boundary",
    name: "ErrorBoundary",
    blurb: "Catches render errors so one broken widget doesn't take the view.",
    Preview: function ErrorBoundaryPreview() {
      const [armed, setArmed] = React.useState(false);
      return (
        <div className="flex max-w-sm flex-col gap-3">
          <div className="rounded-lg border border-app-border-mid">
            {/* resetKeys clears the fallback as soon as the input that broke
                it changes — the same pattern an app uses to recover on a
                route or id change. */}
            <ErrorBoundary resetKeys={[armed]} onError={() => {}}>
              <Boom armed={armed} />
            </ErrorBoundary>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setArmed((v) => !v)}
            className="self-start"
          >
            {armed ? "Repair child" : "Break child"}
          </Button>
        </div>
      );
    },
  },
];

export const ENTRY_BY_SLUG = new Map(ENTRIES.map((e) => [e.slug, e]));
