'use client'

/**
 * Task 1.1.1.18g: Conversation Detail Page
 * 
 * Individual conversation view.
 */

import { useParams, useRouter } from 'next/navigation'
import { CommunicationsInbox } from '@/components/communications/communications-inbox'
import { ConversationDetail } from '@/components/communications/conversation-detail'

export default function ConversationPage() {
  const params = useParams()
  const router = useRouter()
  const conversationId = params.conversation_id as string

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      {/* Inbox List */}
      <div className="w-[400px] border-r hidden lg:block">
        <CommunicationsInbox
          onSelectConversation={(id) => router.push(`/dashboard/communications/inbox/${id}`)}
          selectedId={conversationId}
        />
      </div>

      {/* Conversation Detail */}
      <div className="flex-1">
        <ConversationDetail
          conversationId={conversationId}
          onClose={() => router.push('/dashboard/communications/inbox')}
        />
      </div>
    </div>
  )
}
