/**
 * Wireframe: task-0.5.2.2-companies-list.md
 * Route: /rmm/companies
 * Implements: Placeholder for companies list page.
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/01-rmm/task-0.5.2.2-companies-list.md
 */
import { PlaceholderPage } from '@/components/PlaceholderPage';

export default function CompaniesListPage() {
  return (
    <PlaceholderPage
      title="Companies"
      description="List of all registered companies. This page will display a searchable and filterable list of companies with their registration details."
      route="/rmm/companies"
      wireframeLink="../../docs/04-design/user-experience/wireframes/01-rmm/task-0.5.2.2-companies-list.md"
      backHref="/rmm"
    />
  );
}
