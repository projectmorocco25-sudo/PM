/**
 * Wireframe: task-0.5.2.0-enforcement-dashboard.md
 * Route: /enforcement
 * Implements: Placeholder for enforcement dashboard (MOH Tier 1 and Tier 2 only).
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/01-rmm/task-0.5.2.0-enforcement-dashboard.md
 */
import { PlaceholderPage } from '@/components/PlaceholderPage';

export default function EnforcementDashboardPage() {
  return (
    <PlaceholderPage
      title="Enforcement Dashboard"
      description="Enforcement dashboard with summary, recent actions, and pending approvals for MOH Tier 1 and Tier 2 users. This page will display enforcement metrics and quick access to key enforcement features."
      route="/enforcement"
      wireframeLink="../../docs/04-design/user-experience/wireframes/01-rmm/task-0.5.2.0-enforcement-dashboard.md"
      backHref="/dashboard"
    />
  );
}
