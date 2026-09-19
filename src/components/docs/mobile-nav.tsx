"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Sidebar } from "@/components/docs/sidebar";

/**
 * Navigation below the `lg` breakpoint, where the sidebar is hidden and the
 * top nav's links have already dropped out. Without it a phone has no way to
 * reach any page but the one it landed on.
 *
 * A disclosure rather than a drawer: the content is a list of links, the
 * page behind it is not something you need to see while choosing, and a
 * drawer would mean a focus trap and a scroll lock to solve a problem this
 * does not have.
 */
export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  // Close on navigation — otherwise the panel stays open over the page you
  // just asked for.
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="border-b border-app-border lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        data-testid="mobile-nav-toggle"
        className="flex h-11 w-full items-center gap-2 px-5 text-[13px] font-medium text-app-text hover:text-app-bright"
      >
        <Menu size={15} aria-hidden />
        Menu
      </button>
      <div
        id="mobile-nav-panel"
        hidden={!open}
        className="max-h-[70dvh] overflow-y-auto px-3 pb-4"
      >
        <Sidebar />
      </div>
    </div>
  );
}
