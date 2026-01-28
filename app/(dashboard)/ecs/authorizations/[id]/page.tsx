/**
 * Task 1.1.1.12 placeholder. Route: /ecs/authorizations/[id]
 * Wireframe: N/A (placeholder). Ref: routing-structure.md
 */

import { PlaceholderPage } from "@/components/PlaceholderPage";

export default async function AuthorizationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PlaceholderPage
      title="Authorization Detail"
      route={`/ecs/authorizations/${id}`}
      backHref="/ecs/authorizations"
      backLabel="Back to Authorizations"
    />
  );
}
