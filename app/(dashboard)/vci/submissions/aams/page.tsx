/**
 * Wireframe: task-0.5.3.1-aams-submissions-list.md
 * Route: /vci/submissions/aams
 * Implements: Placeholder for AAMS submissions list page.
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/02-vci/task-0.5.3.1-aams-submissions-list.md
 */
import { PlaceholderPage } from '@/components/PlaceholderPage';

export default function AAMSSubmissionsListPage() {
  return (
    <PlaceholderPage
      title="AAMS Submissions"
      description="List of AAMS (Annual Active Medicine Stock) submissions. This page will display a searchable and filterable list of AAMS submissions with their status and details."
      route="/vci/submissions/aams"
      wireframeLink="../../docs/04-design/user-experience/wireframes/02-vci/task-0.5.3.1-aams-submissions-list.md"
      backHref="/vci"
    />
  );
}
