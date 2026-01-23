/**
 * Wireframe: task-0.5.5.10-compliance-reports-list.md
 * Route: /cmc/reports
 * Implements: Placeholder for compliance monitoring reports list page.
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/04-cmc/task-0.5.5.10-compliance-reports-list.md
 */
import { PlaceholderPage } from '@/components/PlaceholderPage';

export default function ComplianceReportsListPage() {
  return (
    <PlaceholderPage
      title="Compliance Reports"
      description="List of compliance monitoring reports. This page will display a searchable and filterable list of reports with their details."
      route="/cmc/reports"
      wireframeLink="../../docs/04-design/user-experience/wireframes/04-cmc/task-0.5.5.10-compliance-reports-list.md"
      backHref="/cmc"
    />
  );
}
