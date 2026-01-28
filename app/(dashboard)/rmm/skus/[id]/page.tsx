/**
 * Task 1.1.1.12 placeholder. Route: /rmm/skus/[id]
 * Wireframe: N/A (placeholder). Ref: routing-structure.md
 */

import { PlaceholderPage } from "@/components/PlaceholderPage";

export default async function SkuDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PlaceholderPage
      title="SKU Detail"
      route={`/rmm/skus/${id}`}
      backHref="/rmm/skus"
      backLabel="Back to SKUs"
    />
  );
}
