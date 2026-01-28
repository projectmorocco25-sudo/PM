/**
 * Task 1.1.1.12 placeholder. Route: /rmm/companies/[id]
 * Wireframe: N/A (placeholder). Ref: routing-structure.md
 */

import { PlaceholderPage } from "@/components/PlaceholderPage";

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PlaceholderPage
      title="Company Detail"
      route={`/rmm/companies/${id}`}
      backHref="/rmm/companies"
      backLabel="Back to Companies"
    />
  );
}
