/**
 * Wireframe: task-0.5.1.29-communication-integration-workflow.md
 * Implements: CommunicationWorkflowIntegration component (message button, conversation list, context display on workflow pages)
 * Wireframe Link: ../../../../../docs/04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.29-communication-integration-workflow.md
 */

'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useConversations, useCommunicationRealtime } from '@/lib/hooks/use-communications'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/loading/skeleton'
import { MessageSquare, Link as LinkIcon, Lock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

interface WorkflowCommunicationPanelProps {
  workflowEntityType: string
  workflowEntityId: string
  className?: string
}

interface ConversationItemProps {
  conversation: any
  onClick: () => void
}

function ConversationItem({ conversation, onClick }: ConversationItemProps) {
  const isUnread = conversation.lifecycle_state === 'DELIVERED' || conversation.lifecycle_state === 'SENT'
  const isRead = conversation.lifecycle_state === 'READ'
  const isThreaded = conversation.lifecycle_state === 'THREADED'
  
  const timeAgo = formatDistanceToNow(new Date(conversation.updated_at || conversation.created_at), { addSuffix: true })
  
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-lg border border-gray-200 bg-white p-3 transition-colors hover:bg-gray-50"
      style={{
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        marginBottom: '8px',
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {/* Sender and Timestamp */}
          <div className="mb-1 flex items-center gap-2">
            <span
              className="text-sm font-semibold text-gray-900"
              style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}
            >
              {conversation.sender_name || 'Sender'}
            </span>
            {isUnread && (
              <div
                className="h-2 w-2 rounded-full bg-blue-500"
                style={{ width: '8px', height: '8px', backgroundColor: '#3b82f6' }}
                aria-label="Unread"
              />
            )}
            {isRead && (
              <span className="text-xs text-green-600" style={{ fontSize: '12px', color: '#22c55e' }}>
                ✓✓ Read
              </span>
            )}
          </div>
          
          {/* Preview */}
          <div
            className="line-clamp-2 text-sm text-gray-600"
            style={{ fontSize: '14px', color: '#6b7280' }}
          >
            {conversation.preview || conversation.subject || 'Message preview...'}
          </div>
          
          {/* Metadata */}
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xs text-gray-400" style={{ fontSize: '12px', color: '#9ca3af' }}>
              {timeAgo}
            </span>
            {isThreaded && (
              <span className="text-xs text-blue-600" style={{ fontSize: '12px', color: '#2563eb' }}>
                Thread
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function WorkflowCommunicationPanel({
  workflowEntityType,
  workflowEntityId,
  className,
}: WorkflowCommunicationPanelProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(true)
  
  // Set up real-time updates
  useCommunicationRealtime()
  
  // Fetch conversations linked to this workflow entity
  const { data, isLoading, error } = useConversations({
    workflow_entity_type: [workflowEntityType],
    limit: 20,
  })
  
  // Filter conversations by workflow_entity_id
  const linkedConversations = useMemo(() => {
    if (!data?.conversations) return []
    return data.conversations.filter(
      (conv) => conv.workflow_entity_id === workflowEntityId && conv.workflow_entity_type === workflowEntityType
    )
  }, [data?.conversations, workflowEntityId, workflowEntityType])
  
  const unreadCount = useMemo(() => {
    return linkedConversations.filter(
      (conv) => conv.lifecycle_state === 'DELIVERED' || conv.lifecycle_state === 'SENT'
    ).length
  }, [linkedConversations])
  
  const handleConversationClick = (conversationId: string) => {
    router.push(`/communications/inbox/${conversationId}`)
  }
  
  const handleCompose = () => {
    // Navigate to compose with workflow entity pre-filled
    router.push(`/communications/compose?entity_type=${workflowEntityType}&entity_id=${workflowEntityId}`)
  }
  
  return (
    <div
      className={cn('rounded-lg border border-gray-200 bg-white', className)}
      style={{
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between border-b border-gray-200 p-4"
        style={{
          padding: '16px',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <div className="flex items-center gap-2">
          <h3
            className="text-base font-semibold text-gray-900"
            style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}
          >
            Related Conversations
          </h3>
          {unreadCount > 0 && (
            <span
              className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700"
              style={{ fontSize: '11px', fontWeight: 600 }}
            >
              {unreadCount}
            </span>
          )}
          <span
            className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700"
            style={{ fontSize: '11px' }}
          >
            <LinkIcon className="h-3 w-3" />
            Workflow-Linked
          </span>
          <span
            className="flex items-center gap-1 text-xs text-gray-500"
            style={{ fontSize: '12px', color: '#6b7280' }}
            title="Links cannot be changed (immutable per lifecycle requirements)"
          >
            <Lock className="h-3 w-3" />
          </span>
        </div>
        
        <Button
          onClick={handleCompose}
          size="sm"
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          New
        </Button>
      </div>
      
      {/* Regulatory Context (Fatima's Requirement - for enforcement actions) */}
      {workflowEntityType === 'enforcement_action' && (
        <div
          className="border-b border-gray-200 bg-blue-50 p-3"
          style={{
            padding: '12px',
            backgroundColor: '#eff6ff',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <div className="mb-1 text-xs font-semibold text-blue-900" style={{ fontSize: '12px', fontWeight: 600, color: '#1e3a8a', marginBottom: '4px' }}>
            Regulatory Context
          </div>
          <div className="space-y-1 text-xs text-blue-800" style={{ fontSize: '11px', color: '#1e40af' }}>
            <div>• All workflow-linked conversations are retained for 7 years per regulatory requirements (Law No. 09-08)</div>
            <div>• Conversations become part of regulatory audit trail</div>
            <div>
              <a
                href={`/enforcement/actions/${workflowEntityId}`}
                className="text-blue-600 underline hover:text-blue-800"
              >
                [View Regulatory Framework]
              </a>
            </div>
          </div>
        </div>
      )}
      
      {/* Conversation List */}
      <div
        className="max-h-[600px] overflow-y-auto p-4"
        style={{
          maxHeight: '600px',
          padding: '16px',
        }}
      >
        {isLoading && (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-lg border border-gray-200 bg-white p-3">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        )}
        
        {error && (
          <div className="px-4 py-8 text-center">
            <p className="text-xs text-red-600">Failed to load conversations. Please try again.</p>
          </div>
        )}
        
        {!isLoading && !error && linkedConversations.length === 0 && (
          <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
            <MessageSquare
              className="h-12 w-12 text-gray-400"
              style={{ width: '48px', height: '48px', color: '#9ca3af' }}
            />
            <p
              className="mt-2 text-sm text-gray-600"
              style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}
            >
              No conversations yet
            </p>
            <p
              className="mt-1 text-xs text-gray-500"
              style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}
            >
              Click "New" to start a conversation
            </p>
          </div>
        )}
        
        {!isLoading && !error && linkedConversations.length > 0 && (
          <div>
            {linkedConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                onClick={() => handleConversationClick(conversation.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
