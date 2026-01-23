/**
 * Wireframe: task-0.5.4.1-export-requests-list.md
 * Route: /ecs/export-requests
 * Implements: Placeholder for export requests list page.
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/03-ecs/task-0.5.4.1-export-requests-list.md
 */
import { PlaceholderPage } from '@/components/PlaceholderPage';

export default function ExportRequestsListPage() {
  return (
    <PlaceholderPage
      title="Export Requests"
      description="List of export authorization requests. This page will display a searchable and filterable list of export requests with their status and details."
      route="/ecs/export-requests"
      wireframeLink="../../docs/04-design/user-experience/wireframes/03-ecs/task-0.5.4.1-export-requests-list.md"
      backHref="/ecs"
    />
  );
}
