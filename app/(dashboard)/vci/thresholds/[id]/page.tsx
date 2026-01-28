/**
 * Task 1.1.1.12 placeholder. Route: /vci/thresholds/[id]
 * Wireframe: N/A (placeholder). Ref: routing-structure.md
 */

import { PlaceholderPage } from "@/components/PlaceholderPage";

export default async function ThresholdDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PlaceholderPage
      title="Threshold Detail"
      route={`/vci/thresholds/${id}`}
      backHref="/vci/thresholds"
      backLabel="Back to Thresholds"
    />
  );
}
