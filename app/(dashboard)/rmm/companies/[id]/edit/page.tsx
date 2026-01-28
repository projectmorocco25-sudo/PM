/**
 * Task 1.1.1.12 placeholder. Route: /rmm/companies/[id]/edit
 * Wireframe: N/A (placeholder). Ref: routing-structure.md
 */

import { PlaceholderPage } from "@/components/PlaceholderPage";

export default async function CompanyEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PlaceholderPage
      title="Edit Company"
      route={`/rmm/companies/${id}/edit`}
      backHref={`/rmm/companies/${id}`}
      backLabel="Back to Company"
    />
  );
}
