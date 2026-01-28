/**
 * Wireframe: task-0.5.1.14-dashboard-layout-structure.md
 * Route: /dashboard, /dashboard/*, /rmm/*, /vci/*, etc.
 * Implements: Protected dashboard layout (header + sidebar + main).
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.14-dashboard-layout-structure.md
 */

import { DashboardShell } from "@/components/layout/DashboardShell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
