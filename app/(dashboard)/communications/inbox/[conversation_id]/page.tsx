/**
 * Wireframe: task-0.5.1.25-conversation-detail.md
 * Route: /communications/inbox/[conversation_id]
 * Implements: Conversation detail — subject, Archive, thread, reply, Save Draft.
 * APIs: communications_get_conversation, communications_send_message, communications_archive_conversation.
 * Tables: conversations, messages.
 * Wireframe Link: docs/04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.25-conversation-detail.md
 */

"use client";

import { useParams } from "next/navigation";
import { ConversationDetailContent } from "./ConversationDetailContent";

export default function ConversationDetailPage() {
  const params = useParams();
  const conversationId = typeof params?.conversation_id === "string" ? params.conversation_id : null;
  if (!conversationId) return null;
  return <ConversationDetailContent conversationId={conversationId} />;
}
