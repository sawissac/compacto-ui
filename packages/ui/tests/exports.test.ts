import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import * as button from "../src/components/button.js";
import * as buttonGroup from "../src/components/button-group.js";
import * as calendar from "../src/components/calendar.js";
import * as command from "../src/components/command.js";
import * as dialog from "../src/components/dialog.js";
import * as dropdownMenu from "../src/components/dropdown-menu.js";
import * as errorBoundary from "../src/components/error-boundary.js";
import * as input from "../src/components/input.js";
import * as popover from "../src/components/popover.js";
import * as resizable from "../src/components/resizable.js";
import * as select from "../src/components/select.js";
import * as separator from "../src/components/separator.js";
import * as sidebar from "../src/components/sidebar.js";
import * as skeleton from "../src/components/skeleton.js";
import * as tabs from "../src/components/tabs.js";
import * as tooltip from "../src/components/tooltip.js";
import * as barrel from "../src/index.js";

/**
 * Statically imported rather than resolved with a dynamic `import()`: Vite
 * cannot analyse a fully-variable specifier, and a map spelled out by hand is
 * the thing being tested anyway — if a new component is missing here, the
 * subpath assertions below fail on it.
 */
const MODULES: Record<string, Record<string, unknown>> = {
  button,
  "button-group": buttonGroup,
  calendar,
  command,
  dialog,
  "dropdown-menu": dropdownMenu,
  "error-boundary": errorBoundary,
  input,
  popover,
  resizable,
  select,
  separator,
  sidebar,
  skeleton,
  tabs,
  tooltip,
};

/**
 * Guards the seam between the barrel and the `exports` map — the one place
 * where adding a component and forgetting a line produces no error anywhere
 * else in the build. `publint` proves the mapped files exist; nothing proves
 * the map and the barrel agree about which components there are.
 */

const pkg = JSON.parse(
  readFileSync(resolve(__dirname, "../package.json"), "utf8"),
) as { exports: Record<string, unknown> };

/** Every component that must be reachable both ways. */
const COMPONENT_SUBPATHS = [
  "button",
  "button-group",
  "calendar",
  "command",
  "dialog",
  "dropdown-menu",
  "error-boundary",
  "input",
  "popover",
  "resizable",
  "select",
  "separator",
  "sidebar",
  "skeleton",
  "tabs",
  "tooltip",
] as const;

/** One representative runtime export per module, to prove it actually loads. */
const REPRESENTATIVE: Record<(typeof COMPONENT_SUBPATHS)[number], string> = {
  button: "Button",
  "button-group": "ButtonGroup",
  calendar: "Calendar",
  command: "Command",
  dialog: "Dialog",
  "dropdown-menu": "DropdownMenu",
  "error-boundary": "ErrorBoundary",
  input: "Input",
  popover: "Popover",
  resizable: "ResizableGroup",
  select: "Select",
  separator: "Separator",
  sidebar: "Sidebar",
  skeleton: "Skeleton",
  tabs: "Tabs",
  tooltip: "Tooltip",
};

describe("exports map", () => {
  it("declares a subpath for every component", () => {
    const declared = Object.keys(pkg.exports);
    for (const name of COMPONENT_SUBPATHS) {
      expect(declared, `missing "./${name}" in package.json exports`).toContain(
        `./${name}`,
      );
    }
  });

  it("declares the utility and stylesheet subpaths", () => {
    const declared = Object.keys(pkg.exports);
    for (const name of [
      ".",
      "./cn",
      "./ui-styles",
      "./color-themes",
      "./styles.css",
      "./tokens.css",
      "./theme.css",
      "./texture.css",
      "./compat-shadcn.css",
      "./package.json",
    ]) {
      expect(declared, `missing "${name}" in package.json exports`).toContain(
        name,
      );
    }
  });

  it("declares no component subpath that has no source module", () => {
    const known = new Set<string>(COMPONENT_SUBPATHS);
    const stragglers = Object.keys(pkg.exports)
      .filter((k) => k.startsWith("./") && !k.includes("."))
      .map((k) => k.slice(2))
      .filter(
        (k) =>
          !known.has(k) && !["cn", "ui-styles", "color-themes"].includes(k),
      );
    expect(stragglers).toEqual([]);
  });
});

describe("barrel", () => {
  it("has a statically imported module for every subpath", () => {
    expect(Object.keys(MODULES).sort()).toEqual([...COMPONENT_SUBPATHS].sort());
  });

  it.each(COMPONENT_SUBPATHS)("re-exports %s", (name) => {
    const mod = MODULES[name];
    const representative = REPRESENTATIVE[name];

    expect(
      mod[representative],
      `${name}.tsx does not export ${representative}`,
    ).toBeDefined();
    expect(
      (barrel as Record<string, unknown>)[representative],
      `barrel is missing ${representative} from ${name}.tsx`,
    ).toBe(mod[representative]);
  });

  it("re-exports every named export of every component module", () => {
    const missing: string[] = [];
    for (const name of COMPONENT_SUBPATHS) {
      const mod = MODULES[name];
      for (const key of Object.keys(mod)) {
        if (!(key in barrel)) {
          missing.push(`${name}.tsx → ${key}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  it("re-exports cn and the color-theme surface", () => {
    expect(barrel.cn).toBeTypeOf("function");
    expect(barrel.appThemeCssVars).toBeTypeOf("function");
    expect(barrel.COLOR_THEME_KEYS.length).toBeGreaterThan(0);
  });
});
