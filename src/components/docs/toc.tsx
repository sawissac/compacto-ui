"use client";

import * as React from "react";

export type TocItem = { id: string; label: string };

/**
 * "On This Page", with the active heading tracked by an IntersectionObserver.
 *
 * `rootMargin` pins the detection band near the top of the viewport rather
 * than its middle: a heading counts as current once it reaches the top, which
 * is where your eye is, not when it happens to cross the centre.
 */
export function Toc({ items }: { items: TocItem[] }) {
  const [active, setActive] = React.useState<string | null>(
    items[0]?.id ?? null,
  );

  React.useEffect(() => {
    if (items.length === 0) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) {
        observer.observe(el);
      }
    }
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="On this page" className="flex flex-col gap-1">
      <p className="px-2.5 pb-2 font-title text-[11px] font-semibold tracking-[0.12em] text-app-dim uppercase">
        On This Page
      </p>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          aria-current={active === item.id ? "true" : undefined}
          className={[
            "rounded-md px-2.5 py-1 text-[13px] transition-colors duration-(--motion-duration-fast)",
            active === item.id
              ? "font-medium text-app-accent"
              : "text-app-dim hover:text-app-bright",
          ].join(" ")}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
