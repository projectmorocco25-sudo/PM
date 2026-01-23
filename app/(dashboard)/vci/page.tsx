/**
 * Wireframe: task-0.5.3.0-vci-overview.md
 * Route: /vci
 * Implements: Placeholder for VCI overview/dashboard page.
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/02-vci/task-0.5.3.0-vci-overview.md
 */
import { PlaceholderPage } from '@/components/PlaceholderPage';

export default function VCIOverviewPage() {
  return (
    <PlaceholderPage
      title="VCI Overview"
      description="Value Chain Intelligence Module overview page. This page will display VCI module statistics, recent submissions, and quick access to key VCI features."
      route="/vci"
      wireframeLink="../../docs/04-design/user-experience/wireframes/02-vci/task-0.5.3.0-vci-overview.md"
      backHref="/dashboard"
    />
  );
}
