/**
 * Task 1.1.1.12 placeholder. Route: /communications/inbox/[conversation_id]
 * Wireframe: N/A (placeholder). Ref: routing-structure.md
 */

import { PlaceholderPage } from "@/components/PlaceholderPage";

export default async function ConversationDetailPage({
  params,
}: {
  params: Promise<{ conversation_id: string }>;
}) {
  const { conversation_id } = await params;
  return (
    <PlaceholderPage
      title="Conversation"
      route={`/communications/inbox/${conversation_id}`}
      backHref="/communications/inbox"
      backLabel="Back to Inbox"
    />
  );
}
