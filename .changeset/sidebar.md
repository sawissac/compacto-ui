---
"@compacto/ui": minor
---

Add `Sidebar` — the rail-plus-pane shell both consuming apps were hand-rolling.

`SidebarRail` is the 48px vertical icon strip (with `SidebarRailButton`,
`SidebarRailTablist`, `SidebarRailSpacer`); `Sidebar` is the full-height pane it
selects (with `SidebarHeader`, `SidebarTitle`, `SidebarContent`, `SidebarFooter`,
`SidebarGroup`, `SidebarGroupLabel`, `SidebarItem`, `SidebarSeparator`).
Server-safe.

Both the rail and the pane take a `texture` prop — `checker`, `dots` or `graph`
— which draws a decorative wash from the active palette's accent behind the
content. Strength is `--app-texture-alpha`. The classes ship in
`@compacto/ui/texture.css`, included by `styles.css`.
