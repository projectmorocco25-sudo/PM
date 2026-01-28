/**
 * Task 1.1.1.12 placeholder. Route: /cmc/scores/[id]
 * Wireframe: N/A (placeholder). Ref: routing-structure.md
 */

import { PlaceholderPage } from "@/components/PlaceholderPage";

export default async function ScoreDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PlaceholderPage
      title="Compliance Score Detail"
      route={`/cmc/scores/${id}`}
      backHref="/cmc/scores"
      backLabel="Back to Scores"
    />
  );
}
