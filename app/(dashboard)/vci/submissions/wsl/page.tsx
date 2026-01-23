/**
 * Wireframe: task-0.5.3.11-wsl-submissions-list.md
 * Route: /vci/submissions/wsl
 * Implements: Placeholder for WSL submissions list page.
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/02-vci/task-0.5.3.11-wsl-submissions-list.md
 */
import { PlaceholderPage } from '@/components/PlaceholderPage';

export default function WSLSubmissionsListPage() {
  return (
    <PlaceholderPage
      title="WSL Submissions"
      description="List of WSL (Weekly Stock Level) submissions. This page will display a searchable and filterable list of WSL submissions with their status and details."
      route="/vci/submissions/wsl"
      wireframeLink="../../docs/04-design/user-experience/wireframes/02-vci/task-0.5.3.11-wsl-submissions-list.md"
      backHref="/vci"
    />
  );
}
