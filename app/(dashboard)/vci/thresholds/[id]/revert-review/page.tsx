/**
 * Task 1.1.1.12 placeholder. Route: /vci/thresholds/[id]/revert-review
 * Wireframe: N/A (placeholder). Ref: routing-structure.md
 */

import { PlaceholderPage } from "@/components/PlaceholderPage";

export default async function RevertReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PlaceholderPage
      title="Revert Review"
      route={`/vci/thresholds/${id}/revert-review`}
      backHref={`/vci/thresholds/${id}`}
      backLabel="Back to Threshold"
    />
  );
}
