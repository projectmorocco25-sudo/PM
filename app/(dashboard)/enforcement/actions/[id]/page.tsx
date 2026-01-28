/**
 * Task 1.1.1.12 placeholder. Route: /enforcement/actions/[id]
 * Wireframe: N/A (placeholder). Ref: routing-structure.md
 */

import { PlaceholderPage } from "@/components/PlaceholderPage";

export default async function EnforcementActionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PlaceholderPage
      title="Enforcement Action Detail"
      route={`/enforcement/actions/${id}`}
      backHref="/enforcement/actions"
      backLabel="Back to Actions"
    />
  );
}
