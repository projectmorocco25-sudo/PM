/**
 * Task 1.1.1.12 placeholder. Route: /vci/breaches/[id]
 * Wireframe: N/A (placeholder). Ref: routing-structure.md
 */

import { PlaceholderPage } from "@/components/PlaceholderPage";

export default async function BreachDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PlaceholderPage
      title="Compliance Violation Detail"
      route={`/vci/breaches/${id}`}
      backHref="/vci/breaches"
      backLabel="Back to Violations"
    />
  );
}
