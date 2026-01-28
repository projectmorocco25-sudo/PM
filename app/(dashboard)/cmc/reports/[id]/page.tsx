/**
 * Task 1.1.1.12 placeholder. Route: /cmc/reports/[id]
 * Wireframe: N/A (placeholder). Ref: routing-structure.md
 */

import { PlaceholderPage } from "@/components/PlaceholderPage";

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PlaceholderPage
      title="Report Detail"
      route={`/cmc/reports/${id}`}
      backHref="/cmc/reports"
      backLabel="Back to Reports"
    />
  );
}
