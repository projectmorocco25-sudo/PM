/**
 * Task 1.1.1.12 placeholder. Route: /rmm/products/[id]
 * Wireframe: N/A (placeholder). Ref: routing-structure.md
 */

import { PlaceholderPage } from "@/components/PlaceholderPage";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PlaceholderPage
      title="Product Detail"
      route={`/rmm/products/${id}`}
      backHref="/rmm/products"
      backLabel="Back to Products"
    />
  );
}
