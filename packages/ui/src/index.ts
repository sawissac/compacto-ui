/**
 * Public surface of `@compacto/ui`.
 *
 * This barrel carries NO `"use client"` directive, and must not gain one. It is
 * a pure re-export module: a Server Component importing `{ Button }` from here
 * resolves to the server-safe `components/button.js`, because the package
 * declares `sideEffects: ["**\/*.css"]` and the bundler drops the client
 * re-exports it did not ask for.
 *
 * Per-component subpaths (`@compacto/ui/button`) do the same thing without
 * relying on tree-shaking, so prefer them in Server Components — and note that
 * `./calendar`, `./command` and `./resizable` are the three modules whose peer
 * dependencies are optional, so a subpath import is also what makes that
 * coupling visible at the import site.
 */

export { Button, buttonVariants } from "./components/button.js";
export {
  ButtonGroup,
  ButtonGroupSeparator,
  buttonGroupVariants,
} from "./components/button-group.js";
export {
  Calendar,
  CalendarDayButton,
  type CalendarProps,
} from "./components/calendar.js";
export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./components/command.js";
export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "./components/dialog.js";
export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/dropdown-menu.js";
export {
  ErrorBoundary,
  type ErrorBoundaryProps,
} from "./components/error-boundary.js";
export { Input, type InputProps } from "./components/input.js";
export {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "./components/popover.js";
export {
  ResizableGroup,
  ResizableHandle,
  ResizablePanel,
} from "./components/resizable.js";
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./components/select.js";
export { Separator } from "./components/separator.js";
export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarItem,
  SidebarRail,
  SidebarRailButton,
  sidebarRailButtonVariants,
  SidebarRailSpacer,
  SidebarRailTablist,
  SidebarSeparator,
  SidebarTitle,
} from "./components/sidebar.js";
export { Skeleton } from "./components/skeleton.js";
export {
  Tabs,
  TabsContent,
  TabsList,
  tabsListVariants,
  TabsTrigger,
} from "./components/tabs.js";
export {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./components/tooltip.js";
export {
  appThemeCssVars,
  COLOR_THEME_KEYS,
  COLOR_THEMES,
  type ColorTheme,
  type ColorThemeKey,
  PREVIEW_APPEARANCES,
  PREVIEW_PALETTES,
  type PreviewAppearance,
  toPreviewAppearance,
} from "./constants/color-themes.js";
export { cn } from "./lib/cn.js";
