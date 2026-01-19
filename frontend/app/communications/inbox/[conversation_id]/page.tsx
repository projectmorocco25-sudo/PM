/**
 * Wireframe: task-0.5.1.25-conversation-detail.md
 * Route: /communications/inbox/[conversation_id]
 * Implements: Conversation Detail page
 * Wireframe Link: ../../../../../docs/04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.25-conversation-detail.md
 */

'use client'

import { ConversationDetail } from '@/components/communications/conversation/conversation-detail'

export default function ConversationDetailPage({
  params,
}: {
  params: { conversation_id: string }
}) {
  return <ConversationDetail conversationId={params.conversation_id} />
}
