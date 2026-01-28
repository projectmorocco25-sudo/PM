/**
 * Task 1.1.1.12 placeholder. Route: /vci/submissions/msq/[id]
 * Wireframe: N/A (placeholder). Ref: routing-structure.md
 */

import { PlaceholderPage } from "@/components/PlaceholderPage";

export default async function MsqDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PlaceholderPage
      title="MSQ Submission Detail"
      route={`/vci/submissions/msq/${id}`}
      backHref="/vci/submissions/msq"
      backLabel="Back to MSQ"
    />
  );
}
