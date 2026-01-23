/**
 * Wireframe: task-0.5.3.14-compliance-violations-list.md
 * Route: /vci/breaches
 * Implements: Placeholder for compliance violations list page.
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/02-vci/task-0.5.3.14-compliance-violations-list.md
 */
import { PlaceholderPage } from '@/components/PlaceholderPage';

export default function ComplianceViolationsListPage() {
  return (
    <PlaceholderPage
      title="Compliance Violations"
      description="List of compliance violations filterable by status and year. This page will display a searchable and filterable list of compliance violations with their details."
      route="/vci/breaches"
      wireframeLink="../../docs/04-design/user-experience/wireframes/02-vci/task-0.5.3.14-compliance-violations-list.md"
      backHref="/vci"
    />
  );
}
