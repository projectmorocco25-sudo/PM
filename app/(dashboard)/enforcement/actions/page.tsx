/**
 * Wireframe: task-0.5.2.1-enforcement-actions-list.md
 * Route: /enforcement/actions
 * Implements: Placeholder for enforcement actions list page.
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/01-rmm/task-0.5.2.1-enforcement-actions-list.md
 */
import { PlaceholderPage } from '@/components/PlaceholderPage';

export default function EnforcementActionsListPage() {
  return (
    <PlaceholderPage
      title="Enforcement Actions"
      description="List of all enforcement actions filterable and searchable. This page will display a searchable and filterable list of enforcement actions with their status and details."
      route="/enforcement/actions"
      wireframeLink="../../docs/04-design/user-experience/wireframes/01-rmm/task-0.5.2.1-enforcement-actions-list.md"
      backHref="/enforcement"
    />
  );
}
