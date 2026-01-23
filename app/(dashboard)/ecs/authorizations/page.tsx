/**
 * Wireframe: task-0.5.4.5-export-authorizations-list.md
 * Route: /ecs/authorizations
 * Implements: Placeholder for export authorizations list page.
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/03-ecs/task-0.5.4.5-export-authorizations-list.md
 */
import { PlaceholderPage } from '@/components/PlaceholderPage';

export default function ExportAuthorizationsListPage() {
  return (
    <PlaceholderPage
      title="Export Authorizations"
      description="List of export authorizations. This page will display a searchable and filterable list of export authorizations with their status and details."
      route="/ecs/authorizations"
      wireframeLink="../../docs/04-design/user-experience/wireframes/03-ecs/task-0.5.4.5-export-authorizations-list.md"
      backHref="/ecs"
    />
  );
}
