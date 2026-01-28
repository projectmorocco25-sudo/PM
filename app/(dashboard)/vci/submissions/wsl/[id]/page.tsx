/**
 * Task 1.1.1.12 placeholder. Route: /vci/submissions/wsl/[id]
 * Wireframe: N/A (placeholder). Ref: routing-structure.md
 */

import { PlaceholderPage } from "@/components/PlaceholderPage";

export default async function WslDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PlaceholderPage
      title="WSL Submission Detail"
      route={`/vci/submissions/wsl/${id}`}
      backHref="/vci/submissions/wsl"
      backLabel="Back to WSL"
    />
  );
}
