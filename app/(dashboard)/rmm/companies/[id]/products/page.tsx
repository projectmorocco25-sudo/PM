/**
 * Wireframe: task-0.5.2.3-company-detail.md (Products tab)
 * Route: /rmm/companies/[id]/products
 * Implements: Placeholder for company products view.
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/01-rmm/task-0.5.2.3-company-detail.md
 */
import { PlaceholderPage } from '@/components/PlaceholderPage';

export default function CompanyProductsPage() {
  return (
    <PlaceholderPage
      title="Company Products"
      description="List of products associated with this company. This page will display all products registered under the company."
      route="/rmm/companies/[id]/products"
      wireframeLink="../../docs/04-design/user-experience/wireframes/01-rmm/task-0.5.2.3-company-detail.md"
      backHref="/rmm/companies"
    />
  );
}
