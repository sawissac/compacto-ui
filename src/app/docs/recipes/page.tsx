"use client";

import {
  Clock,
  LayoutTemplate,
  Palette,
  PanelLeftRightDashed,
  SlidersHorizontal,
  TvMinimal,
} from "lucide-react";
import * as React from "react";

import { Code } from "@/components/docs/code";
import { Notes } from "@/components/docs/notes";
import { PageShell, Section } from "@/components/docs/page-shell";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { OptionList } from "@/components/ui/option-list";
import { OptionPalette } from "@/components/ui/option-palette";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type ColorThemeKey } from "@/lib/color-themes";

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

const SETTINGS_SECTIONS = [
  { id: "theme", label: "Theme", Icon: Palette },
  { id: "layout", label: "Layout", Icon: LayoutTemplate },
  { id: "network", label: "Network", Icon: SlidersHorizontal },
] as const;

/**
 * Self-contained preview — its own state, not wired to the docs site's real
 * palette, so clicking a swatch here never repaints the page you're reading
 * this on. A real settings dialog wires the Theme tab to whatever the host
 * app actually uses for theming (`usePalette()` in this gallery's own
 * `/demo`).
 */
function SettingsDialogPreview() {
  const [open, setOpen] = React.useState(false);
  const [section, setSection] =
    React.useState<(typeof SETTINGS_SECTIONS)[number]["id"]>("theme");
  const [theme, setTheme] = React.useState<ColorThemeKey>("midnight-dark");
  const [layout, setLayout] = React.useState(LAYOUT_OPTIONS[0].value);
  const [callTimeout, setCallTimeout] = React.useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Open Settings</Button>
      </DialogTrigger>
      <DialogContent className="h-[min(460px,80vh)] w-[min(760px,92vw)]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <Tabs
          value={section}
          onValueChange={(v) => setSection(v as typeof section)}
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
            <OptionPalette value={theme} onValueChange={setTheme} />
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
          <Button onClick={() => setOpen(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const RECIPE_SNIPPET = `import { Clock, LayoutTemplate, Palette, SlidersHorizontal } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { OptionList } from "@/components/ui/option-list";
import { OptionPalette } from "@/components/ui/option-palette";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type ColorThemeKey } from "@/lib/color-themes";

// One entry per TabsList "nav" row. Add a fourth ("background") the same way
// — see /demo for a texture picker, the same cards from a plain OptionGrid.
const SETTINGS_SECTIONS = [
  { id: "theme", label: "Theme", Icon: Palette },
  { id: "layout", label: "Layout", Icon: LayoutTemplate },
  { id: "network", label: "Network", Icon: SlidersHorizontal },
] as const;

export function SettingsDialog() {
  const [open, setOpen] = React.useState(false);
  const [section, setSection] = React.useState<
    (typeof SETTINGS_SECTIONS)[number]["id"]
  >("theme");

  // Wire these to whatever your app actually persists — a palette context,
  // a layout preset in Redux, a call-timeout field, etc. This recipe only
  // owns the dialog shape, not the settings themselves.
  const [theme, setTheme] = React.useState<ColorThemeKey>("midnight-dark");
  const [layout, setLayout] = React.useState("balanced");
  const [callTimeout, setCallTimeout] = React.useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Open Settings</Button>
      </DialogTrigger>
      <DialogContent className="h-[min(460px,80vh)] w-[min(760px,92vw)]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <Tabs
          value={section}
          onValueChange={(v) => setSection(v as typeof section)}
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

          <TabsContent value="theme" className="min-h-0 overflow-y-auto px-4 py-3">
            <OptionPalette value={theme} onValueChange={setTheme} />
          </TabsContent>

          <TabsContent value="layout" className="min-h-0 overflow-y-auto px-4 py-3">
            <OptionList
              value={layout}
              onValueChange={setLayout}
              options={[
                {
                  value: "balanced",
                  label: "Balanced",
                  description: "Sidebar, editor and response split evenly.",
                  icon: LayoutTemplate,
                },
                // ...one option per layout preset
              ]}
            />
          </TabsContent>

          <TabsContent value="network" className="min-h-0 overflow-y-auto px-4 py-3">
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
          <Button onClick={() => setOpen(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}`;

export default function Page() {
  return (
    <PageShell
      title="Recipes"
      lede="Composed patterns built from more than one primitive — copy the whole shape, not just a component."
      toc={[
        { id: "settings-dialog", label: "Settings dialog" },
        { id: "code", label: "Code" },
        { id: "notes", label: "Notes" },
      ]}
    >
      <Section id="settings-dialog" title="Settings dialog">
        <p className="mb-4 text-[13px] leading-relaxed text-app-text">
          A left-hand icon rail switching between sections, each rendering a
          different picker shape — palette cards, a described row list, a
          plain field — inside one dialog. Built entirely from existing
          primitives: <code className="font-mono">Dialog</code>,{" "}
          <code className="font-mono">Tabs variant=&quot;nav&quot;</code>,{" "}
          <code className="font-mono">OptionPalette</code>,{" "}
          <code className="font-mono">OptionList</code> and{" "}
          <code className="font-mono">Input</code>. The Theme tab is one line —{" "}
          <code className="font-mono">OptionPalette</code> is the whole picker,
          and it reports a key rather than applying it, so the dialog stays out
          of the theming decision. There is no dedicated{" "}
          <code className="font-mono">SettingsDialog</code> component in the
          library — Layout, Background and Network are the kind of app-specific
          concepts a shared library shouldn&apos;t own, so this page documents
          the shape instead of shipping it as one more component to keep in
          sync.
        </p>
        <p className="mb-4 text-[13px] leading-relaxed text-app-text">
          The full four-section version (this one plus a Background pattern
          grid) runs for real in this gallery&apos;s own{" "}
          <code className="font-mono">/demo</code> — click the gear icon at the
          bottom of the sidebar rail.
        </p>
        <div className="rounded-lg border border-app-border-mid bg-app-panel p-6">
          <SettingsDialogPreview />
        </div>
      </Section>

      <Section id="code" title="Code">
        <p className="mb-4 text-[13px] leading-relaxed text-app-dim">
          Three sections instead of four — Background&apos;s texture-swatch
          picker is cut here for length; see it in full at{" "}
          <code className="font-mono">/demo</code>. Paste this, then replace
          the placeholder <code className="font-mono">options</code> array
          and the three pieces of state with whatever your app actually
          persists.
        </p>
        <Code>{RECIPE_SNIPPET}</Code>
      </Section>

      <Section id="notes" title="Notes">
        <Notes
          notes={[
            "Every change applies immediately in this shape — there is no draft or Cancel. Done just closes the dialog.",
            "TabsContent unmounts the inactive sections (Radix's default), so only the open section's OptionPalette/OptionList is ever mounted.",
            "Tabs' nav variant sets h-auto so the rail stretches to match the content pane's height via flex — give the Tabs wrapper min-h-0 flex-1 inside a sized DialogContent, or the rail collapses to fit only its own rows.",
            "OptionPalette reports a ColorThemeKey and applies nothing — wire onValueChange to whatever provider already writes appThemeCssVars() onto the document, or the dialog will look like it does nothing.",
            'The section identifier (here, string literals "theme" | "layout" | "network") is local UI state, not persisted — the dialog always reopens on the first section.',
          ]}
        />
      </Section>
    </PageShell>
  );
}
