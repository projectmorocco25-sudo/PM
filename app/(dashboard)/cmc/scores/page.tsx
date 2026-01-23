/**
 * Wireframe: task-0.5.5.1-compliance-scores-list.md
 * Route: /cmc/scores
 * Implements: Placeholder for compliance scores list page.
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/04-cmc/task-0.5.5.1-compliance-scores-list.md
 */
import { PlaceholderPage } from '@/components/PlaceholderPage';

export default function ComplianceScoresListPage() {
  return (
    <PlaceholderPage
      title="Compliance Scores"
      description="List of regulatory compliance ratings filterable by year. This page will display a searchable and filterable list of compliance scores with their details."
      route="/cmc/scores"
      wireframeLink="../../docs/04-design/user-experience/wireframes/04-cmc/task-0.5.5.1-compliance-scores-list.md"
      backHref="/cmc"
    />
  );
}
