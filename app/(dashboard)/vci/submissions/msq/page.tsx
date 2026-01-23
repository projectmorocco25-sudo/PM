/**
 * Wireframe: task-0.5.3.7-msq-submissions-list.md
 * Route: /vci/submissions/msq
 * Implements: Placeholder for MSQ submissions list page.
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/02-vci/task-0.5.3.7-msq-submissions-list.md
 */
import { PlaceholderPage } from '@/components/PlaceholderPage';

export default function MSQSubmissionsListPage() {
  return (
    <PlaceholderPage
      title="MSQ Submissions"
      description="List of MSQ (Monthly Stock Quantity) submissions. This page will display a searchable and filterable list of MSQ submissions with their status and details."
      route="/vci/submissions/msq"
      wireframeLink="../../docs/04-design/user-experience/wireframes/02-vci/task-0.5.3.7-msq-submissions-list.md"
      backHref="/vci"
    />
  );
}
