'use client'

/**
 * Task 1.1.1.18g: Sent Messages Page
 * Task 1.1.1.16j: SentMessages component
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SentMessages } from '@/components/communications/sent-messages'
import { ConversationDetail } from '@/components/communications/conversation-detail'

export default function SentPage() {
  const router = useRouter()
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      {/* Sent Messages List */}
      <div className="w-[400px] border-r">
        <SentMessages
          onSelectConversation={(id) => setSelectedConversationId(id)}
          selectedId={selectedConversationId || undefined}
        />
      </div>

      {/* Conversation Detail */}
      <div className="flex-1">
        {selectedConversationId ? (
          <ConversationDetail
            conversationId={selectedConversationId}
            onClose={() => setSelectedConversationId(null)}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Select a sent message to view</p>
          </div>
        )}
      </div>
    </div>
  )
}
