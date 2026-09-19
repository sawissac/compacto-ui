"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ENTRIES } from "@/catalog/entries";
import { SECTIONS } from "@/catalog/nav";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={[
        "block rounded-md px-2.5 py-1.5 text-[13px] transition-colors duration-(--motion-duration-fast)",
        active
          ? "bg-app-selected font-medium text-app-bright"
          : "text-app-text hover:bg-app-hover hover:text-app-bright",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-2.5 pt-5 pb-2 font-title text-[11px] font-semibold tracking-[0.12em] text-app-dim uppercase">
      {children}
    </p>
  );
}

/**
 * Two lists, matching how you actually navigate a component library: the
 * prose pages you read once, and the components you come back to.
 */
export function Sidebar() {
  return (
    <nav aria-label="Documentation" className="flex flex-col pb-10">
      <GroupLabel>Sections</GroupLabel>
      {SECTIONS.map((s) => (
        <NavLink key={s.href} href={s.href} label={s.label} />
      ))}

      <GroupLabel>Components</GroupLabel>
      {[...ENTRIES]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((e) => (
          <NavLink
            key={e.slug}
            href={`/docs/components/${e.slug}`}
            label={e.name}
          />
        ))}
    </nav>
  );
}
