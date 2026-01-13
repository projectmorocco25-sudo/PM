'use client'

/**
 * Task 1.1.1.16j: SentMessages component
 * 
 * Displays sent conversations list with status indicators.
 * 
 * @see docs/02-architecture/frontend/ui-component-specifications.md
 * @see docs/04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.27-sent-messages.md
 */

import { useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow, format } from 'date-fns'
import {
  Send,
  Search,
  Filter,
  ChevronRight,
  CheckCircle2,
  Clock,
  Eye,
  Users,
  FileText,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCommunications, type Conversation } from '@/hooks/use-communications'
import { Spinner } from '@/components/ui/loading'
import { cn } from '@/lib/utils'

// ============================================================================
// Types
// ============================================================================

type MessageStatus = 'sent' | 'delivered' | 'read' | 'all'

// ============================================================================
// Component
// ============================================================================

interface SentMessagesProps {
  onSelectConversation?: (id: string) => void
  selectedId?: string
}

export function SentMessages({ onSelectConversation, selectedId }: SentMessagesProps) {
  const { conversations, isLoading } = useCommunications()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<MessageStatus>('all')

  // Filter to only show conversations where user is the initiator
  const sentConversations = conversations.filter((conv) => {
    // In a real implementation, check if current user initiated the conversation
    // For now, show all non-archived conversations
    return conv.lifecycle_state !== 'ARCHIVED'
  })

  const filteredConversations = sentConversations.filter((conv) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSubject = conv.subject.toLowerCase().includes(query)
      const matchesParticipant = conv.participants.some(
        (p) => p.user.full_name.toLowerCase().includes(query)
      )
      if (!matchesSubject && !matchesParticipant) return false
    }

    // Status filter (mock implementation)
    // In production, check actual read receipts
    if (statusFilter !== 'all') {
      // For demo, filter based on unread_count as proxy for status
      if (statusFilter === 'read' && conv.unread_count > 0) return false
      if (statusFilter === 'sent' && conv.unread_count === 0) return false
    }

    return true
  })

  // Get status icon and label
  const getStatusInfo = (conv: Conversation) => {
    // Mock status based on conversation data
    // In production, use actual read receipt data
    const allRead = conv.unread_count === 0
    const hasMultipleRecipients = conv.participants.length > 2

    if (allRead) {
      return {
        icon: Eye,
        label: 'Read',
        className: 'text-green-600',
      }
    }
    return {
      icon: CheckCircle2,
      label: 'Delivered',
      className: 'text-blue-600',
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Send className="h-5 w-5" />
            Sent Messages
          </h2>
          <Button size="sm" asChild>
            <Link href="/dashboard/communications/compose">
              Compose New
            </Link>
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sent messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as MessageStatus)}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="read">Read</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sent Messages List */}
      <ScrollArea className="flex-1">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center p-4">
            <Send className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-medium text-lg">No sent messages</h3>
            <p className="text-muted-foreground text-sm mt-1">
              {searchQuery || statusFilter !== 'all'
                ? 'No messages match your filters'
                : 'Messages you send will appear here'}
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredConversations.map((conv) => {
              const statusInfo = getStatusInfo(conv)
              const StatusIcon = statusInfo.icon
              const recipients = conv.participants
                .filter((p) => p.role !== 'initiator')
                .map((p) => p.user.full_name)

              return (
                <button
                  key={conv.id}
                  onClick={() => onSelectConversation?.(conv.id)}
                  className={cn(
                    'w-full text-left p-4 hover:bg-muted/50 transition-colors',
                    selectedId === conv.id && 'bg-muted'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      {/* Recipients */}
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">
                          To: {recipients.length > 2
                            ? `${recipients.slice(0, 2).join(', ')} +${recipients.length - 2}`
                            : recipients.join(', ')}
                        </span>
                        {recipients.length > 1 && (
                          <Users className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>

                      {/* Subject */}
                      <p className="text-sm font-medium mt-1 truncate">
                        {conv.subject}
                      </p>

                      {/* Preview */}
                      {conv.last_message && (
                        <p className="text-sm text-muted-foreground mt-1 truncate">
                          {conv.last_message.content}
                        </p>
                      )}

                      {/* Workflow Link */}
                      {conv.workflow_entity_type && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <FileText className="h-3 w-3" />
                          <span className="capitalize">
                            {conv.workflow_entity_type.replace('_', ' ')}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {/* Timestamp */}
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(conv.last_message_at), { addSuffix: true })}
                      </span>

                      {/* Status */}
                      <div className={cn('flex items-center gap-1 text-xs', statusInfo.className)}>
                        <StatusIcon className="h-3 w-3" />
                        <span>{statusInfo.label}</span>
                      </div>

                      <ChevronRight className="h-4 w-4 text-muted-foreground mt-1" />
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t text-center">
        <p className="text-sm text-muted-foreground">
          {filteredConversations.length} sent message{filteredConversations.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}
