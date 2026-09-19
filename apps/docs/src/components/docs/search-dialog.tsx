"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@compacto/ui/command";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import { ENTRIES } from "@/catalog/entries";
import { SECTIONS } from "@/catalog/nav";

/**
 * ⌘K search — and a working example of CommandDialog, since the docs may as
 * well be built out of the thing they document.
 */
export function SearchDialog() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-testid="search-trigger"
        className="flex h-8 w-full min-w-0 items-center gap-2 rounded-md border border-app-border-mid bg-app-bg px-2.5 text-[12px] text-app-dim transition-colors duration-(--motion-duration-fast) hover:border-app-border-accent focus-visible:border-app-accent focus-visible:ring-2 focus-visible:ring-app-accent/30 focus-visible:outline-none sm:w-64"
      >
        <Search size={13} aria-hidden />
        <span className="flex-1 text-left">Search documentation…</span>
        <kbd className="hidden rounded-sm border border-app-border px-1 font-mono text-[10px] text-app-dim sm:block">
          ⌘K
        </kbd>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search documentation"
        description="Jump to a page or a component."
      >
        <CommandInput placeholder="Search documentation…" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="Sections">
            {SECTIONS.map((s) => (
              <CommandItem
                key={s.href}
                value={s.label}
                onSelect={() => go(s.href)}
              >
                {s.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Components">
            {[...ENTRIES]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((e) => (
                <CommandItem
                  key={e.slug}
                  value={`${e.name} ${e.blurb}`}
                  onSelect={() => go(`/docs/components/${e.slug}`)}
                >
                  {e.name}
                  <CommandShortcut>{e.slug}</CommandShortcut>
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
