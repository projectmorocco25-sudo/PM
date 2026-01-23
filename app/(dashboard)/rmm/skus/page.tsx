/**
 * Wireframe: task-0.5.2.6-skus-list.md
 * Route: /rmm/skus
 * Implements: Placeholder for SKUs list page.
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/01-rmm/task-0.5.2.6-skus-list.md
 */
import { PlaceholderPage } from '@/components/PlaceholderPage';

export default function SKUsListPage() {
  return (
    <PlaceholderPage
      title="SKUs"
      description="List of all registered SKUs. This page will display a searchable and filterable list of SKUs with their details."
      route="/rmm/skus"
      wireframeLink="../../docs/04-design/user-experience/wireframes/01-rmm/task-0.5.2.6-skus-list.md"
      backHref="/rmm"
    />
  );
}
