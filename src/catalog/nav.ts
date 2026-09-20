/** Sidebar structure. Order here is the order in the sidebar. */
export const SECTIONS = [
  { href: "/docs/introduction", label: "Introduction" },
  { href: "/docs/installation", label: "Installation" },
  { href: "/docs/components", label: "Components" },
  { href: "/docs/recipes", label: "Recipes" },
  { href: "/docs/skills", label: "Skills" },
  { href: "/docs/theming", label: "Theming" },
  { href: "/docs/tokens", label: "Tokens" },
  // Not a /docs page: the gallery of every primitive, live on one screen.
  // Listed here so the top nav and the sidebar (which the mobile menu reuses)
  // both reach it without a second list to keep in sync.
  { href: "/demo", label: "Demo" },
] as const;
