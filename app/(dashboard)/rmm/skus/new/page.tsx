/**
 * Wireframe: task-0.5.2.10-create-edit-sku.md
 * Route: /rmm/skus/new
 * Implements: Placeholder for create SKU form.
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/01-rmm/task-0.5.2.10-create-edit-sku.md
 */
import { PlaceholderPage } from '@/components/PlaceholderPage';

export default function CreateSKUPage() {
  return (
    <PlaceholderPage
      title="Create SKU"
      description="Create new SKU registration form. This page will allow authorized users to register a new SKU in the system."
      route="/rmm/skus/new"
      wireframeLink="../../docs/04-design/user-experience/wireframes/01-rmm/task-0.5.2.10-create-edit-sku.md"
      backHref="/rmm/skus"
    />
  );
}
