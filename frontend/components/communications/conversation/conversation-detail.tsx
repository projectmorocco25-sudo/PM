/**
 * Wireframe: task-0.5.1.25-conversation-detail.md
 * Implements: ConversationDetail component (message thread, reply interface, attachments, read receipts, workflow context)
 * Wireframe Link: ../../../../../docs/04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.25-conversation-detail.md
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MainContent } from '@/components/layout/main-content'
import {
  useConversationMessages,
  useSendMessage,
  useMarkMessageAsRead,
  useCommunicationRealtime,
} from '@/lib/hooks/use-communications'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/loading/skeleton'
import { Archive, MoreVertical, Link as LinkIcon, Paperclip, Send, Save, CheckCheck } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

interface ConversationDetailProps {
  conversationId: string
}

interface MessageItemProps {
  message: any
  isOwnMessage: boolean
}

function MessageItem({ message, isOwnMessage }: MessageItemProps) {
  // Determine read receipt status (mandatory per governance)
  const isRead = message.is_read
  const isDelivered = message.delivered_at && !message.is_read
  const isSent = !message.delivered_at
  
  const timeAgo = formatDistanceToNow(new Date(message.created_at), { addSuffix: true })
  
  return (
    <div
      className={cn(
        'mb-4 rounded-lg border border-gray-200 bg-white p-4',
        isOwnMessage && 'bg-blue-50',
      )}
      style={{
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        backgroundColor: isOwnMessage ? '#eff6ff' : '#ffffff',
        marginBottom: '16px',
      }}
    >
      {/* Message Header */}
      <div className="mb-2 flex items-center justify-between" style={{ marginBottom: '8px' }}>
        <div
          className="text-sm font-semibold text-gray-900"
          style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}
        >
          {message.sender_name || 'Sender'} {/* Placeholder - needs participant data */}
        </div>
        <div className="flex items-center gap-2">
          <div
            className="text-xs text-gray-400"
            style={{ fontSize: '12px', color: '#9ca3af' }}
          >
            {timeAgo}
          </div>
          {/* Read Receipt (mandatory per governance) */}
          {isRead ? (
            <span
              className="text-xs text-green-600"
              style={{ fontSize: '12px', color: '#22c55e' }}
              title={`Read at ${message.read_at ? new Date(message.read_at).toLocaleString() : ''}`}
            >
              <CheckCheck className="h-3 w-3 inline" /> Read
            </span>
          ) : isDelivered ? (
            <span
              className="text-xs text-blue-600"
              style={{ fontSize: '12px', color: '#3b82f6' }}
            >
              <CheckCheck className="h-3 w-3 inline" /> Delivered
            </span>
          ) : (
            <span
              className="text-xs text-gray-500"
              style={{ fontSize: '12px', color: '#6b7280' }}
            >
              ✓ Sent
            </span>
          )}
        </div>
      </div>
      
      {/* Message Content */}
      <div
        className="text-sm text-gray-900"
        style={{ fontSize: '14px', color: '#111827', lineHeight: '1.5' }}
      >
        {message.content}
      </div>
      
      {/* Attachments - Placeholder (needs message_attachments query) */}
      {false && (
        <div className="mt-2 flex flex-wrap gap-2" style={{ marginTop: '8px' }}>
          {/* Attachment items will be rendered here */}
        </div>
      )}
    </div>
  )
}

export function ConversationDetail({ conversationId }: ConversationDetailProps) {
  const router = useRouter()
  const [replyText, setReplyText] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Set up real-time updates
  useCommunicationRealtime()
  
  // Fetch conversation messages
  const { data: messagesData, isLoading, error } = useConversationMessages(conversationId)
  const messages = messagesData?.messages || []
  const conversation = messagesData?.conversation || null
  
  // Determine thread indicator visibility (THREADED state when message count > 1)
  const isThreaded = messages.length > 1
  const isWorkflowLinked = conversation?.lifecycle_state === 'WORKFLOW_LINKED'
  
  // Mark messages as read when viewing
  const { mutate: markAsRead } = useMarkMessageAsRead()
  useEffect(() => {
    if (messages.length > 0) {
      // Mark unread messages as read
      messages
        .filter((m) => !m.is_read && m.sender_id !== (typeof window !== 'undefined' ? undefined : undefined)) // TODO: Get current user ID
        .forEach((m) => markAsRead({ messageId: m.id }))
    }
  }, [messages, markAsRead])
  
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])
  
  // Send message
  const sendMessageMutation = useSendMessage()
  const isSending = sendMessageMutation.isPending
  
  const handleSend = () => {
    if (!replyText.trim()) return
    
    sendMessageMutation.mutate(
      {
        conversationId,
        content: replyText,
        recipientId: null, // Will be determined by server based on conversation participants
      },
      {
        onSuccess: () => {
          setReplyText('')
          setAttachments([])
        },
      }
    )
  }
  
  const handleArchive = () => {
    // TODO: Implement archive confirmation modal and archive action
    if (confirm('Archive this conversation? It will be moved to Archived folder but remain accessible for 7 years (regulatory requirement - Law No. 09-08). This action is irreversible.')) {
      // Archive conversation
    }
  }
  
  return (
    <MainContent
      breadcrumbs={[
        { label: 'Home', href: '/dashboard' },
        { label: 'Communications', href: '/communications/inbox' },
        { label: 'Inbox', href: '/communications/inbox' },
        { label: 'Conversation' },
      ]}
      title={conversation?.subject || 'Conversation'}
      actions={
        <div className="flex items-center gap-2" style={{ gap: '16px' }}>
          <Button
            variant="outline"
            onClick={handleArchive}
          >
            <Archive className="mr-2 h-4 w-4" />
            Archive
          </Button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100"
            aria-label="More actions"
            style={{ width: '40px', height: '40px' }}
          >
            <MoreVertical className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      }
    >
      <div className="flex h-full flex-col">
        {/* Workflow Context Panel (if linked) */}
        {isWorkflowLinked && conversation?.workflow_entity_type && (
          <div
            className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4"
            style={{
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',
              marginBottom: '16px',
            }}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Workflow Context</span>
                <span
                  className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700"
                  style={{ fontSize: '11px' }}
                >
                  🔗 Workflow-Linked
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-600" style={{ fontSize: '14px', color: '#6b7280' }}>
              Linked to: {conversation.workflow_entity_type} #{conversation.workflow_entity_id}
            </div>
            
            {/* Regulatory Context (Fatima's Requirement - for enforcement actions) */}
            {conversation.workflow_entity_type === 'enforcement_action' && (
              <div
                className="my-3 rounded border border-blue-200 bg-blue-50 p-3"
                style={{
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #bfdbfe',
                  backgroundColor: '#eff6ff',
                  marginTop: '12px',
                  marginBottom: '12px',
                }}
              >
                <div
                  className="mb-1 text-sm font-semibold text-blue-900"
                  style={{ fontSize: '14px', fontWeight: 600, color: '#1e3a8a', marginBottom: '4px' }}
                >
                  Regulatory Information
                </div>
                <div className="space-y-1 text-xs text-blue-800" style={{ fontSize: '12px', color: '#1e40af' }}>
                  <div>
                    <strong>Legal Basis:</strong> DMP Regulation Article 12
                  </div>
                  <div>
                    <strong>Regulatory Reference:</strong> Law No. 09-08 - 30-day appeal window
                  </div>
                  <div>
                    <strong>Appeal Deadline:</strong>{' '}
                    {conversation.workflow_entity_id ? (
                      <a
                        href={`/enforcement/actions/${conversation.workflow_entity_id}#appeal-deadline`}
                        className="underline hover:text-blue-900"
                      >
                        View appeal deadline
                      </a>
                    ) : (
                      'Check enforcement action details'
                    )}
                  </div>
                  <div>
                    <a
                      href={`/enforcement/actions/${conversation.workflow_entity_id}#legal-basis`}
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      View full legal basis
                    </a>
                  </div>
                </div>
              </div>
            )}
            
            {/* TODO: Add entity details and action buttons based on entity type */}
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push(`/${conversation.workflow_entity_type === 'enforcement_action' ? 'enforcement/actions' : conversation.workflow_entity_type}/${conversation.workflow_entity_id}`)}
              >
                View {conversation.workflow_entity_type.replace('_', ' ')}
              </Button>
            </div>
          </div>
        )}
        
        {/* Thread Indicator (if multiple messages) */}
        {isThreaded && (
          <div
            className="mb-2 text-sm text-gray-600"
            style={{
              fontSize: '14px',
              color: '#6b7280',
              backgroundColor: '#f9fafb',
              padding: '8px 12px',
              borderRadius: '4px',
              marginBottom: '8px',
            }}
          >
            Thread ({messages.length} messages)
          </div>
        )}
        
        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto" style={{ minHeight: '400px' }}>
          {isLoading && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-lg border border-gray-200 bg-white p-4">
                  <Skeleton className="h-5 w-1/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          )}
          
          {error && (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-red-600">Failed to load messages. Please try again.</p>
            </div>
          )}
          
          {!isLoading && !error && messages.length === 0 && (
            <div className="px-4 py-12 text-center">
              <p className="text-sm text-gray-500">No messages in this conversation yet.</p>
            </div>
          )}
          
          {!isLoading && !error && messages.length > 0 && (
            <div>
              {messages.map((message) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  isOwnMessage={false} // TODO: Compare with current user ID
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        {/* Reply Interface */}
        <div
          className="mt-4 border-t border-gray-200 bg-white p-4"
          style={{
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#ffffff',
            padding: '16px',
            marginTop: '16px',
          }}
        >
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your message..."
            className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              minHeight: '100px',
              maxHeight: '300px',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              fontSize: '14px',
            }}
            rows={4}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
          
          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100"
                aria-label="Attach file"
                style={{ width: '40px', height: '40px' }}
                onClick={() => {
                  // TODO: Implement file picker
                }}
              >
                <Paperclip className="h-5 w-5 text-gray-600" />
              </button>
              {attachments.length > 0 && (
                <div className="text-xs text-gray-600">
                  {attachments.length} file(s) attached
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  // TODO: Implement save draft
                }}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </Button>
              <Button
                onClick={handleSend}
                disabled={!replyText.trim() || isSending}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                {isSending ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainContent>
  )
}
