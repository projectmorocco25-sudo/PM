/**
 * Task 1.1.1.12 placeholder. Route: /ecs/export-requests/[id]
 * Wireframe: N/A (placeholder). Ref: routing-structure.md
 */

import { PlaceholderPage } from "@/components/PlaceholderPage";

export default async function ExportRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PlaceholderPage
      title="Export Request Detail"
      route={`/ecs/export-requests/${id}`}
      backHref="/ecs/export-requests"
      backLabel="Back to Export Requests"
    />
  );
}
