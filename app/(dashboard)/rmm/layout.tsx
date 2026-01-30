/**
 * Wireframe: task-0.5.1.14-dashboard-layout-structure.md, task-0.5.1.16-sidebar-navigation.md
 * Route: /rmm (all RMM pages)
I need you  * Implements: RMM module layout — content area. Breadcrumbs are rendered per-page (no duplicate).
 * Task: 1.1.2.16 — RMM Module Layout and Navigation (MUST BE FIRST)
 * Wireframe Link (layout): ../../docs/04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.14-dashboard-layout-structure.md
 * Wireframe Link (sidebar): ../../docs/04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.16-sidebar-navigation.md
 */

export default function RmmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-0">{children}</div>;
}
