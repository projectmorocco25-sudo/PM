/**
 * Wireframe: task-0.5.5.0-cmc-overview.md
 * Route: /cmc
 * Implements: Placeholder for CMC overview page.
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/04-cmc/task-0.5.5.0-cmc-overview.md
 */
import { PlaceholderPage } from '@/components/PlaceholderPage';

export default function CMCOverviewPage() {
  return (
    <PlaceholderPage
      title="CMC Overview"
      description="Compliance Monitoring Center Module overview page. This page will display CMC module statistics, compliance scores, and quick access to key CMC features."
      route="/cmc"
      wireframeLink="../../docs/04-design/user-experience/wireframes/04-cmc/task-0.5.5.0-cmc-overview.md"
      backHref="/dashboard"
    />
  );
}
