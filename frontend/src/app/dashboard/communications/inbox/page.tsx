'use client'

/**
 * Task 1.1.1.18g: Communications Inbox Page
 * 
 * Dedicated inbox route.
 */

import { useState } from 'react'
import { CommunicationsInbox } from '@/components/communications/communications-inbox'
import { ConversationDetail } from '@/components/communications/conversation-detail'

export default function InboxPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      {/* Inbox List */}
      <div className="w-[400px] border-r">
        <CommunicationsInbox
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
            <p>Select a conversation to view</p>
          </div>
        )}
      </div>
    </div>
  )
}
