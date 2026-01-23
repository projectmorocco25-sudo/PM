/**
 * Wireframe: task-0.5.3.6-pending-reversions.md
 * Route: /vci/thresholds/pending-reversions
 * Implements: Placeholder for pending reversions list.
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/02-vci/task-0.5.3.6-pending-reversions.md
 */
import { PlaceholderPage } from '@/components/PlaceholderPage';

export default function PendingReversionsPage() {
  return (
    <PlaceholderPage
      title="Pending Reversions"
      description="List of pending threshold reversion requests for MOH Tier 1 and Tier 2 users. This page will display all pending reversion requests awaiting review."
      route="/vci/thresholds/pending-reversions"
      wireframeLink="../../docs/04-design/user-experience/wireframes/02-vci/task-0.5.3.6-pending-reversions.md"
      backHref="/vci/thresholds"
    />
  );
}
