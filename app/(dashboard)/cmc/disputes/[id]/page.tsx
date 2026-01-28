/**
 * Task 1.1.1.12 placeholder. Route: /cmc/disputes/[id]
 * Wireframe: N/A (placeholder). Ref: routing-structure.md
 */

import { PlaceholderPage } from "@/components/PlaceholderPage";

export default async function DisputeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PlaceholderPage
      title="Dispute Detail"
      route={`/cmc/disputes/${id}`}
      backHref="/cmc/disputes"
      backLabel="Back to Disputes"
    />
  );
}
