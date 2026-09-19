import { MobileNav } from "@/components/docs/mobile-nav";
import { Sidebar } from "@/components/docs/sidebar";
import { TopNav } from "@/components/docs/top-nav";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh">
      <TopNav />
      <MobileNav />
      <div className="flex">
        {/* Sticky under the 3.5rem nav, scrolling independently of the page so
            a long component list never drags the content with it. */}
        <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-60 shrink-0 overflow-y-auto border-r border-app-border px-3 py-4 lg:block">
          <Sidebar />
        </aside>
        {children}
      </div>
    </div>
  );
}
