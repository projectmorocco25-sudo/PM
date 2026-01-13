'use client'

/**
 * Task 1.1.1.18g: Archived Conversations Page
 */

import { useState } from 'react'
import { ArchivedConversations } from '@/components/communications/archived-conversations'
import { ConversationDetail } from '@/components/communications/conversation-detail'

export default function ArchivedPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      {/* Archived List */}
      <div className="w-[400px] border-r">
        <ArchivedConversations
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
            <p>Select an archived conversation to view</p>
          </div>
        )}
      </div>
    </div>
  )
}
