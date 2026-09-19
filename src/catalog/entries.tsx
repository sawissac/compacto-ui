"use client";

import {
  Copy,
  Database,
  Download,
  FileLock,
  FolderOpen,
  FolderPlus,
  Grid2x2,
  LayoutTemplate,
  MoreVertical,
  Palette,
  PanelLeftRightDashed,
  Plus,
  RotateCw,
  Search,
  Settings,
  SlidersHorizontal,
  Trash2,
  TvMinimal,
} from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { DataTable, dataTableColumnHelper } from "@/components/ui/data-table";
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
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Input } from "@/components/ui/input";
import { OptionGrid } from "@/components/ui/option-grid";
import { OptionList } from "@/components/ui/option-list";
import { OptionPalette } from "@/components/ui/option-palette";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ResizableGroup,
  ResizableHandle,
  ResizablePanel,
} from "@/components/ui/resizable";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarItem,
  SidebarRail,
  SidebarRailButton,
  SidebarRailSpacer,
  SidebarRailTablist,
  type SidebarTexture,
  SidebarTitle,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { ColorThemeKey } from "@/lib/color-themes";

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

type RequestRow = {
  id: string;
  method: string;
  path: string;
  status: number;
  ms: number;
};

const requestColumns = dataTableColumnHelper<RequestRow>();

// Module scope on purpose: TanStack rebuilds its row model whenever `columns`
// or `data` change identity, so neither may be recreated per render.
const REQUEST_COLUMNS = requestColumns.columns([
  requestColumns.accessor("method", { header: "Method", size: 88 }),
  requestColumns.accessor("path", { header: "Path", size: 260 }),
  requestColumns.accessor("status", { header: "Status", size: 88 }),
  requestColumns.accessor("ms", {
    header: "Time",
    size: 96,
    cell: (c) => `${c.getValue()} ms`,
  }),
]);

const REQUEST_ROWS: RequestRow[] = Array.from({ length: 5000 }, (_, i) => {
  const methods = ["GET", "POST", "PUT", "DELETE"];
  const paths = ["/users", "/invoices", "/tokens/refresh", "/webhooks", "/exports"];
  const statuses = [200, 200, 200, 201, 204, 400, 404, 500];
  return {
    id: `req_${i.toString().padStart(4, "0")}`,
    method: methods[i % methods.length],
    path: `${paths[(i * 7) % paths.length]}/${(i * 31) % 997}`,
    status: statuses[(i * 13) % statuses.length],
    ms: 12 + ((i * 37) % 1900),
  };
});

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
    slug: "option-grid",
    name: "OptionGrid",
    blurb: "Standalone swatch cards for a choice that deserves a real preview.",
    Preview: function OptionGridPreview() {
      const [value, setValue] = React.useState("mint");
      return (
        <OptionGrid
          value={value}
          onValueChange={setValue}
          options={[
            {
              value: "mint",
              label: "Mint",
              swatch: (
                <span
                  aria-hidden
                  className="block h-11 w-full rounded-md"
                  style={{
                    background: "linear-gradient(135deg, #34d399, #047857)",
                  }}
                />
              ),
            },
            {
              value: "sky",
              label: "Sky",
              swatch: (
                <span
                  aria-hidden
                  className="block h-11 w-full rounded-md"
                  style={{
                    background: "linear-gradient(135deg, #38bdf8, #0369a1)",
                  }}
                />
              ),
            },
            {
              value: "rose",
              label: "Rose",
              swatch: (
                <span
                  aria-hidden
                  className="block h-11 w-full rounded-md"
                  style={{
                    background: "linear-gradient(135deg, #fb7185, #be123c)",
                  }}
                />
              ),
            },
            {
              value: "none",
              label: "None",
              swatch: (
                <span
                  aria-hidden
                  className="block h-11 w-full rounded-md bg-app-sidebar"
                />
              ),
            },
          ]}
        />
      );
    },
  },
  {
    slug: "option-list",
    name: "OptionList",
    blurb: "Full-width selectable rows — icon, label, description, check.",
    Preview: function OptionListPreview() {
      const [value, setValue] = React.useState("balanced");
      return (
        <OptionList
          className="max-w-sm"
          value={value}
          onValueChange={setValue}
          options={[
            {
              value: "balanced",
              label: "Balanced",
              description: "Panes split evenly.",
              icon: PanelLeftRightDashed,
            },
            {
              value: "editor-focus",
              label: "Editor Focus",
              description: "One pane takes most of the width.",
              icon: TvMinimal,
            },
          ]}
        />
      );
    },
  },
  {
    slug: "option-palette",
    name: "OptionPalette",
    blurb:
      "The --app-* theme picker — every palette as a card, grouped by hue, each previewing itself.",
    Preview: function OptionPalettePreview() {
      // Local state on purpose: picking here previews the choice without
      // repainting the gallery around it. Wire onValueChange to the app's
      // theming provider for the real thing.
      const [value, setValue] = React.useState<ColorThemeKey>("midnight-dark");
      return <OptionPalette value={value} onValueChange={setValue} />;
    },
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
        <Tabs
          defaultValue="theme"
          orientation="vertical"
          className="w-fit overflow-hidden rounded-lg border-2 border-app-border-mid"
        >
          <TabsList variant="nav">
            <TabsTrigger value="theme">
              <Palette size={14} />
              Theme
            </TabsTrigger>
            <TabsTrigger value="layout">
              <LayoutTemplate size={14} />
              Layout
            </TabsTrigger>
            <TabsTrigger value="background">
              <Grid2x2 size={14} />
              Background
            </TabsTrigger>
            <TabsTrigger value="network">
              <SlidersHorizontal size={14} />
              Network
            </TabsTrigger>
          </TabsList>
          <TabsContent value="theme" className="p-3 text-xs text-app-dim">
            Nav variant — a settings dialog&rsquo;s section rail.
          </TabsContent>
          <TabsContent value="layout" className="p-3 text-xs text-app-dim">
            Layout panel.
          </TabsContent>
          <TabsContent value="background" className="p-3 text-xs text-app-dim">
            Background panel.
          </TabsContent>
          <TabsContent value="network" className="p-3 text-xs text-app-dim">
            Network panel.
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
    slug: "data-table",
    name: "DataTable",
    blurb:
      "Sortable, row-virtualized table — 5,000 rows here, ~20 in the DOM.",
    peer: "@tanstack/react-table, @tanstack/react-virtual",
    Preview: function DataTablePreview() {
      return (
        <DataTable
          columns={REQUEST_COLUMNS}
          data={REQUEST_ROWS}
          getRowId={(r) => r.id}
          height={320}
          defaultSorting={[{ id: "ms", desc: true }]}
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
    slug: "sidebar",
    name: "Sidebar",
    blurb:
      "The rail-plus-pane shell both apps hand-roll: a 48px icon strip that selects a full-height pane.",
    serverSafe: true,
    Preview: function SidebarPreview() {
      const TABS = [
        { id: "files", label: "Requests", Icon: FolderOpen },
        { id: "env", label: "Environments", Icon: FileLock },
        { id: "db", label: "Databases", Icon: Database },
      ];
      const ROWS: Record<string, string[]> = {
        files: ["Profile service", "Billing", "Webhooks"],
        env: ["local", "staging", "production"],
        db: ["primary", "analytics"],
      };
      const [tab, setTab] = React.useState("files");
      const [open, setOpen] = React.useState("Profile service");
      const [texture, setTexture] = React.useState<SidebarTexture>("checker");
      const active = TABS.find((t) => t.id === tab);
      const TEXTURES: SidebarTexture[] = ["none", "checker", "dots", "graph"];

      return (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-app-dim">texture</span>
            <ButtonGroup>
              {TEXTURES.map((t) => (
                <Button
                  key={t}
                  variant="outline"
                  size="xs"
                  aria-pressed={t === texture}
                  data-testid={`texture-${t}`}
                  onClick={() => setTexture(t)}
                  className={
                    t === texture
                      ? "relative z-10 bg-app-selected text-app-bright"
                      : undefined
                  }
                >
                  {t}
                </Button>
              ))}
            </ButtonGroup>
          </div>

          <div className="flex h-72 overflow-hidden rounded-lg border border-app-border-mid">
            <SidebarRail aria-label="Primary">
              <SidebarRailTablist aria-label="Sections">
                {TABS.map((t) => (
                  <SidebarRailButton
                    key={t.id}
                    role="tab"
                    aria-label={t.label}
                    aria-selected={t.id === tab}
                    aria-controls="demo-sidebar-pane"
                    data-active={t.id === tab || undefined}
                    onClick={() => setTab(t.id)}
                  >
                    <t.Icon />
                  </SidebarRailButton>
                ))}
              </SidebarRailTablist>
              <SidebarRailSpacer />
              <SidebarRailButton aria-label="Settings">
                <Settings />
              </SidebarRailButton>
            </SidebarRail>

            <Sidebar
              id="demo-sidebar-pane"
              role="tabpanel"
              aria-label={active?.label}
              texture={texture}
              className="w-56"
            >
              <SidebarHeader>
                <SidebarTitle>{active?.label}</SidebarTitle>
                <Button variant="ghost" size="icon-sm" aria-label="New">
                  <Plus />
                </Button>
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>All</SidebarGroupLabel>
                  {ROWS[tab].map((name) => (
                    <SidebarItem
                      key={name}
                      data-selected={name === open || undefined}
                      onClick={() => setOpen(name)}
                    >
                      {name}
                    </SidebarItem>
                  ))}
                </SidebarGroup>
              </SidebarContent>
              <SidebarFooter>
                <span className="font-mono text-[11px] text-app-dim">
                  {ROWS[tab].length} items
                </span>
              </SidebarFooter>
            </Sidebar>

            {/* Stub work area. Without something on the other side of the seam
              the pane reads as a floating box rather than the edge of an app
              shell, which is the whole thing this component is for. */}
            <div className="flex min-w-0 flex-1 items-center justify-center bg-app-bg">
              <span className="font-mono text-[11px] text-app-dim">{open}</span>
            </div>
          </div>
        </div>
      );
    },
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
