/**
 * Wireframe: task-0.5.2.4-products-list.md
 * Route: /rmm/products
 * Implements: Placeholder for products list page.
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/01-rmm/task-0.5.2.4-products-list.md
 */
import { PlaceholderPage } from '@/components/PlaceholderPage';

export default function ProductsListPage() {
  return (
    <PlaceholderPage
      title="Products"
      description="List of all registered products. This page will display a searchable and filterable list of products with their details."
      route="/rmm/products"
      wireframeLink="../../docs/04-design/user-experience/wireframes/01-rmm/task-0.5.2.4-products-list.md"
      backHref="/rmm"
    />
  );
}
