/**
 * Wireframe: task-0.5.4.3-create-export-request.md
 * Route: /ecs/export-requests/new
 * Implements: Placeholder for create export request form.
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/03-ecs/task-0.5.4.3-create-export-request.md
 */
import { PlaceholderPage } from '@/components/PlaceholderPage';

export default function CreateExportRequestPage() {
  return (
    <PlaceholderPage
      title="Create Export Request"
      description="Create new export authorization request form. This page will allow authorized users to submit a new export request."
      route="/ecs/export-requests/new"
      wireframeLink="../../docs/04-design/user-experience/wireframes/03-ecs/task-0.5.4.3-create-export-request.md"
      backHref="/ecs/export-requests"
    />
  );
}
