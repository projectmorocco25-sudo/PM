/**
 * Wireframe: task-0.5.2.1-rmm-overview.md
 * Route: /rmm
 * Implements: Placeholder for RMM overview page.
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/01-rmm/task-0.5.2.1-rmm-overview.md
 */
import { PlaceholderPage } from '@/components/PlaceholderPage';

export default function RMMOverviewPage() {
  return (
    <PlaceholderPage
      title="RMM Overview"
      description="Registry Management Module overview page. This page will display RMM module statistics, recent activity, and quick access to key RMM features."
      route="/rmm"
      wireframeLink="../../docs/04-design/user-experience/wireframes/01-rmm/task-0.5.2.1-rmm-overview.md"
      backHref="/dashboard"
    />
  );
}
