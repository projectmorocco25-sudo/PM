/**
 * Wireframe: task-0.5.2.9-create-edit-product.md
 * Route: /rmm/products/new
 * Implements: Placeholder for create product form.
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/01-rmm/task-0.5.2.9-create-edit-product.md
 */
import { PlaceholderPage } from '@/components/PlaceholderPage';

export default function CreateProductPage() {
  return (
    <PlaceholderPage
      title="Create Product"
      description="Create new product registration form. This page will allow authorized users to register a new product in the system."
      route="/rmm/products/new"
      wireframeLink="../../docs/04-design/user-experience/wireframes/01-rmm/task-0.5.2.9-create-edit-product.md"
      backHref="/rmm/products"
    />
  );
}
