/**
 * Task 1.1.1.12 placeholder. Route: /rmm/companies/[id]/products
 * Wireframe: N/A (placeholder). Ref: routing-structure.md
 */

import { PlaceholderPage } from "@/components/PlaceholderPage";

export default async function CompanyProductsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PlaceholderPage
      title="Company Products"
      route={`/rmm/companies/${id}/products`}
      backHref={`/rmm/companies/${id}`}
      backLabel="Back to Company"
    />
  );
}
