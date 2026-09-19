"use client";

import {
  Bell,
  Clock,
  Copy,
  Database,
  FileLock,
  FolderOpen,
  Grid2x2,
  History,
  LayoutTemplate,
  MoreVertical,
  Palette,
  PanelLeftRightDashed,
  Plus,
  Search,
  Send,
  Settings,
  SlidersHorizontal,
  Trash2,
  TvMinimal,
} from "lucide-react";
import * as React from "react";

import { PaletteGrid } from "@/components/docs/palette-grid";
import { TextureGrid } from "@/components/docs/texture-grid";
import { PaletteSwitcher } from "@/components/palette-switcher";
import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Input } from "@/components/ui/input";
import { OptionList } from "@/components/ui/option-list";
import {
  Popover,
  PopoverContent,
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
  SelectItem,
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

const RAIL_TABS = [
  { id: "collections", label: "Collections", Icon: FolderOpen },
  { id: "environments", label: "Environments", Icon: FileLock },
  { id: "databases", label: "Databases", Icon: Database },
  { id: "history", label: "History", Icon: History },
] as const;

const REQUESTS: Record<string, string[]> = {
  collections: ["List users", "Create invoice", "Refresh token"],
  environments: ["local", "staging", "production"],
  databases: ["primary", "analytics"],
  history: ["GET /users — 200", "POST /invoices — 201", "GET /users — 500"],
};

/** The Settings dialog's left nav rail — one {@link Tabs} `variant="nav"` entry per section. */
const SETTINGS_SECTIONS = [
  { id: "theme", label: "Theme", Icon: Palette },
  { id: "layout", label: "Layout", Icon: LayoutTemplate },
  { id: "background", label: "Background", Icon: Grid2x2 },
  { id: "network", label: "Network", Icon: SlidersHorizontal },
] as const;

const LAYOUT_OPTIONS = [
  {
    value: "balanced",
    label: "Balanced",
    description: "Sidebar, editor and response split evenly.",
    icon: PanelLeftRightDashed,
  },
  {
    value: "editor-focus",
    label: "Editor Focus",
    description: "Editor takes most of the width; sidebar and response narrow.",
    icon: TvMinimal,
  },
];

/** Throws on demand so the response panel's ErrorBoundary has something real to catch. */
function ResponseBody({ crashed }: { crashed: boolean }): React.ReactElement {
  if (crashed) {
    throw new Error("Simulated response parse failure");
  }
  return (
    <pre className="overflow-x-auto rounded-md bg-app-bg p-3 font-mono text-[11px] leading-relaxed text-app-dim">
      {`{
  "id": "usr_01H8",
  "email": "issacmm64@gmail.com",
  "status": "active"
}`}
    </pre>
  );
}

export default function DemoPage() {
  const [rail, setRail] = React.useState<(typeof RAIL_TABS)[number]["id"]>(
    "collections",
  );
  const [openRequest, setOpenRequest] = React.useState("List users");
  const [method, setMethod] = React.useState("GET");
  const [url, setUrl] = React.useState("https://api.compacto.dev/v1/users");
  const [tab, setTab] = React.useState("params");
  const [commandOpen, setCommandOpen] = React.useState(false);
  const [newRequestOpen, setNewRequestOpen] = React.useState(false);
  const [scheduleDate, setScheduleDate] = React.useState<Date | undefined>();
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState(true);
  const [crashed, setCrashed] = React.useState(false);

  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [settingsSection, setSettingsSection] =
    React.useState<(typeof SETTINGS_SECTIONS)[number]["id"]>("theme");
  const [layout, setLayout] = React.useState(LAYOUT_OPTIONS[0].value);
  const [texture, setTexture] = React.useState<SidebarTexture>("none");
  const [callTimeout, setCallTimeout] = React.useState("");

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function handleSend() {
    setSending(true);
    setSent(false);
    window.setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 900);
  }

  const activeRail = RAIL_TABS.find((t) => t.id === rail)!;

  return (
    <div className="flex h-dvh flex-col bg-app-bg">
      <header className="flex h-14 shrink-0 items-center gap-4 border-b border-app-border bg-app-sidebar px-4">
        <span className="font-display text-[15px] font-bold tracking-[-0.01em] text-app-bright">
          compacto
        </span>

        <button
          type="button"
          onClick={() => setCommandOpen(true)}
          data-testid="demo-search-trigger"
          className="flex h-8 w-72 items-center gap-2 rounded-md border border-app-border-mid bg-app-bg px-2.5 text-[12px] text-app-dim transition-colors duration-(--motion-duration-fast) hover:border-app-border-accent focus-visible:border-app-accent focus-visible:ring-2 focus-visible:ring-app-accent/30 focus-visible:outline-none"
        >
          <Search size={13} aria-hidden />
          <span className="flex-1 text-left">Search requests…</span>
          <kbd className="rounded-sm border border-app-border px-1 font-mono text-[10px] text-app-dim">
            ⌘K
          </kbd>
        </button>

        <div className="ml-auto flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Notifications">
                <Bell />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>

          <div className="h-6 w-px bg-app-border" />
          <PaletteSwitcher />
          <div className="h-6 w-px bg-app-border" />

          <Dialog open={newRequestOpen} onOpenChange={setNewRequestOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus />
                New request
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New request</DialogTitle>
                <DialogDescription>
                  Added to the current collection.
                </DialogDescription>
              </DialogHeader>
              <DialogBody>
                <Input placeholder="Request name" aria-label="Request name" />
              </DialogBody>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={() => setNewRequestOpen(false)}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <CommandDialog
        open={commandOpen}
        onOpenChange={setCommandOpen}
        title="Search requests"
        description="Jump to a request or a collection."
      >
        <CommandInput placeholder="Search requests…" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="Requests">
            {REQUESTS.collections.map((name) => (
              <CommandItem
                key={name}
                value={name}
                onSelect={() => {
                  setRail("collections");
                  setOpenRequest(name);
                  setCommandOpen(false);
                }}
              >
                {name}
                <CommandShortcut>collections</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="h-[min(560px,88vh)] w-[min(820px,94vw)]">
          <DialogHeader data-testid="demo-settings-header">
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <Tabs
            value={settingsSection}
            onValueChange={(v) =>
              setSettingsSection(v as typeof settingsSection)
            }
            orientation="vertical"
            className="min-h-0 flex-1"
          >
            <TabsList aria-label="Settings sections" variant="nav">
              {SETTINGS_SECTIONS.map(({ id, label, Icon }) => (
                <TabsTrigger key={id} value={id}>
                  <Icon size={14} />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent
              value="theme"
              className="min-h-0 overflow-y-auto px-4 py-3"
            >
              <PaletteGrid />
            </TabsContent>

            <TabsContent
              value="layout"
              className="min-h-0 overflow-y-auto px-4 py-3"
            >
              <OptionList
                value={layout}
                onValueChange={setLayout}
                options={LAYOUT_OPTIONS}
              />
            </TabsContent>

            <TabsContent
              value="background"
              className="min-h-0 overflow-y-auto px-4 py-3"
            >
              <TextureGrid value={texture} onValueChange={setTexture} />
            </TabsContent>

            <TabsContent
              value="network"
              className="min-h-0 overflow-y-auto px-4 py-3"
            >
              <div className="flex items-center gap-2">
                <Input
                  icon={Clock}
                  type="number"
                  min={0}
                  step={500}
                  value={callTimeout}
                  onChange={(e) => setCallTimeout(e.target.value)}
                  onClear={() => setCallTimeout("")}
                  placeholder="Enter timeout in ms…"
                  aria-label="Call timeout"
                  className="font-mono"
                />
                <span className="font-mono text-[11px] text-app-dim">ms</span>
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button onClick={() => setSettingsOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="min-h-0 flex-1">
        <ResizableGroup orientation="horizontal">
          <ResizablePanel defaultSize="20%" minSize="14%" maxSize="32%">
            <div className="flex h-full">
              <SidebarRail aria-label="Primary">
                <SidebarRailTablist aria-label="Sections">
                  {RAIL_TABS.map((t) => (
                    <Tooltip key={t.id}>
                      <TooltipTrigger asChild>
                        <SidebarRailButton
                          role="tab"
                          aria-label={t.label}
                          aria-selected={t.id === rail}
                          aria-controls="demo-sidebar-pane"
                          data-active={t.id === rail || undefined}
                          onClick={() => setRail(t.id)}
                        >
                          <t.Icon />
                        </SidebarRailButton>
                      </TooltipTrigger>
                      <TooltipContent side="right">{t.label}</TooltipContent>
                    </Tooltip>
                  ))}
                </SidebarRailTablist>
                <SidebarRailSpacer />
                <SidebarRailButton
                  aria-label="Settings"
                  onClick={() => setSettingsOpen(true)}
                >
                  <Settings />
                </SidebarRailButton>
              </SidebarRail>

              <Sidebar
                id="demo-sidebar-pane"
                role="tabpanel"
                aria-label={activeRail.label}
                texture="checker"
                className="min-w-0 flex-1"
              >
                <SidebarHeader>
                  <SidebarTitle>{activeRail.label}</SidebarTitle>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon-sm" aria-label="New">
                        <Plus />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>New</TooltipContent>
                  </Tooltip>
                </SidebarHeader>
                <SidebarContent>
                  <SidebarGroup>
                    <SidebarGroupLabel>All</SidebarGroupLabel>
                    {REQUESTS[rail].map((name) => (
                      <div key={name} className="group/row flex items-center">
                        <SidebarItem
                          data-selected={name === openRequest || undefined}
                          onClick={() => setOpenRequest(name)}
                          className="flex-1"
                        >
                          {name}
                        </SidebarItem>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              aria-label={`Actions for ${name}`}
                              className="mr-1 opacity-0 group-hover/row:opacity-100"
                            >
                              <MoreVertical />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Copy /> Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem variant="destructive">
                              <Trash2 /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                  <ErrorBoundary
                    resetKeys={[crashed]}
                    fallback={() => (
                      <span className="font-mono text-[11px] text-app-error">
                        sync failed
                      </span>
                    )}
                  >
                    <SyncStatus crashed={crashed} />
                  </ErrorBoundary>
                  <Button
                    variant="ghost"
                    size="xs"
                    className="ml-auto"
                    onClick={() => setCrashed((v) => !v)}
                  >
                    {crashed ? "repair" : "break"}
                  </Button>
                </SidebarFooter>
              </Sidebar>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel>
            <div className="flex h-full min-w-0 flex-col overflow-y-auto p-5">
              <div className="flex items-center gap-2">
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger className="w-28" aria-label="HTTP method">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  aria-label="Request URL"
                  className="flex-1"
                />

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      {scheduleDate
                        ? scheduleDate.toLocaleDateString()
                        : "Schedule"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <PopoverHeader className="px-3 pt-3">
                      <PopoverTitle>Run later</PopoverTitle>
                    </PopoverHeader>
                    <Calendar
                      mode="single"
                      selected={scheduleDate}
                      onSelect={setScheduleDate}
                    />
                  </PopoverContent>
                </Popover>

                <ButtonGroup>
                  <Button variant="outline" size="sm">
                    Save
                  </Button>
                  <ButtonGroupSeparator />
                  <Button size="sm" onClick={handleSend}>
                    <Send /> Send
                  </Button>
                </ButtonGroup>
              </div>

              <Separator className="my-4" />

              <Tabs value={tab} onValueChange={setTab}>
                <TabsList>
                  <TabsTrigger value="params">Params</TabsTrigger>
                  <TabsTrigger value="headers">Headers</TabsTrigger>
                  <TabsTrigger value="body">Body</TabsTrigger>
                  <TabsTrigger value="auth">Auth</TabsTrigger>
                </TabsList>

                <TabsContent value="params" className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Input placeholder="Key" defaultValue="limit" className="w-40" />
                    <Input placeholder="Value" defaultValue="20" className="flex-1" />
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder="Key" defaultValue="cursor" className="w-40" />
                    <Input placeholder="Value" className="flex-1" />
                  </div>
                </TabsContent>

                <TabsContent value="headers" className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Key"
                      defaultValue="Authorization"
                      className="w-40"
                    />
                    <Input
                      placeholder="Value"
                      defaultValue="Bearer •••••••"
                      className="flex-1"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="body" className="text-xs text-app-dim">
                  No body for a {method} request.
                </TabsContent>

                <TabsContent value="auth">
                  <Command className="max-w-sm rounded-lg border border-app-border-mid">
                    <CommandInput placeholder="Choose auth type…" />
                    <CommandList>
                      <CommandGroup heading="Type">
                        <CommandItem>Bearer token</CommandItem>
                        <CommandItem>Basic auth</CommandItem>
                        <CommandItem>No auth</CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </TabsContent>
              </Tabs>

              <Separator className="my-4" />

              <div className="min-h-0 flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <span className="font-mono text-[11px] font-semibold text-app-bright">
                    Response
                  </span>
                  {sent && (
                    <span className="rounded-sm border border-app-border px-1.5 py-0.5 font-mono text-[10px] text-app-dim">
                      200 · 84ms
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="xs"
                    className="ml-auto"
                    onClick={() => setCrashed((v) => !v)}
                  >
                    {crashed ? "repair response" : "break response"}
                  </Button>
                </div>

                {sending ? (
                  <div className="flex flex-col gap-2 rounded-md bg-app-bg p-3">
                    <Skeleton className="h-3.5 w-3/4" />
                    <Skeleton className="h-3.5 w-1/2" />
                    <Skeleton className="h-3.5 w-2/3" />
                  </div>
                ) : (
                  <ErrorBoundary
                    resetKeys={[crashed]}
                    fallback={() => (
                      <p className="rounded-md border border-app-error/30 bg-app-error/10 p-3 text-xs text-app-error">
                        Couldn&apos;t parse the response body.
                      </p>
                    )}
                  >
                    <ResponseBody crashed={crashed} />
                  </ErrorBoundary>
                )}
              </div>
            </div>
          </ResizablePanel>
        </ResizableGroup>
      </div>
    </div>
  );
}

function SyncStatus({ crashed }: { crashed: boolean }): React.ReactElement {
  if (crashed) {
    throw new Error("Simulated sync failure");
  }
  return (
    <span className="font-mono text-[11px] text-app-dim">
      synced · {REQUESTS.collections.length} requests
    </span>
  );
}
