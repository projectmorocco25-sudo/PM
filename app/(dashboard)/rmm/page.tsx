/**
 * Wireframe: task-0.5.1.14-dashboard-layout-structure.md, task-0.5.1.16-sidebar-navigation.md
 * Route: /rmm
 * Implements: RMM module landing (layout from task 1.1.2.16).
 * Task: 1.1.2.16 — RMM Module Layout and Navigation
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.16-sidebar-navigation.md
 */

import { PlaceholderPage } from "@/components/PlaceholderPage";
import { RmmPageBreadcrumbs } from "./RmmPageBreadcrumbs";

export default function RmmPage() {
  return (
    <div className="space-y-4">
      <RmmPageBreadcrumbs />
      <PlaceholderPage title="Registry Management (RMM)" route="/rmm" />
    </div>
  );
}
