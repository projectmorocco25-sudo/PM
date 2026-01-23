/**
 * Wireframe: task-0.5.2.1c-pending-approvals.md
 * Route: /enforcement/pending-approvals
 * Implements: Placeholder for pending approvals page.
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/01-rmm/task-0.5.2.1c-pending-approvals.md
 */
import { PlaceholderPage } from '@/components/PlaceholderPage';

export default function PendingApprovalsPage() {
  return (
    <PlaceholderPage
      title="Pending Approvals"
      description="Actions pending Tier 1 approval. This page will display all enforcement actions awaiting Tier 1 approval."
      route="/enforcement/pending-approvals"
      wireframeLink="../../docs/04-design/user-experience/wireframes/01-rmm/task-0.5.2.1c-pending-approvals.md"
      backHref="/enforcement"
    />
  );
}
