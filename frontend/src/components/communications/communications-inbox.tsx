'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Archive, 
  Star,
  MoreVertical,
  ChevronRight,
  Plus
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCommunications } from '@/hooks/use-communications'
import { NoMessages } from '@/components/ui/empty-states'
import { Spinner } from '@/components/ui/loading'
import { cn } from '@/lib/utils'

// Task 1.1.1.16g: CommunicationsInbox component

interface CommunicationsInboxProps {
  onSelectConversation?: (id: string) => void
  selectedId?: string
}

export function CommunicationsInbox({ onSelectConversation, selectedId }: CommunicationsInboxProps) {
  const { conversations, isLoading, archiveConversation } = useCommunications()
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'unread' | 'archived'>('all')

  const filteredConversations = conversations.filter((conv) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSubject = conv.subject.toLowerCase().includes(query)
      const matchesParticipant = conv.participants.some(
        (p) => p.user.full_name.toLowerCase().includes(query)
      )
      if (!matchesSubject && !matchesParticipant) return false
    }

    // Status filter
    if (filter === 'unread' && conv.unread_count === 0) return false
    if (filter === 'archived' && conv.lifecycle_state !== 'ARCHIVED') return false
    if (filter === 'all' && conv.lifecycle_state === 'ARCHIVED') return false

    return true
  })

  return (
    <div className="flex flex-col h-full border-r">
      {/* Header */}
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Messages</h2>
          <Button size="sm" asChild>
            <Link href="/dashboard/communications/compose">
              <Plus className="h-4 w-4 mr-1" />
              Compose
            </Link>
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-1">
          {(['all', 'unread', 'archived'] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setFilter(f)}
              className="capitalize"
            >
              {f}
              {f === 'unread' && conversations.filter((c) => c.unread_count > 0).length > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {conversations.filter((c) => c.unread_count > 0).length}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Conversation list */}
      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-4">
            <NoMessages />
          </div>
        ) : (
          <div className="divide-y">
            {filteredConversations.map((conversation) => (
              <ConversationListItem
                key={conversation.id}
                conversation={conversation}
                isSelected={selectedId === conversation.id}
                onClick={() => onSelectConversation?.(conversation.id)}
                onArchive={() => archiveConversation(conversation.id)}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

interface ConversationListItemProps {
  conversation: {
    id: string
    subject: string
    type: string
    lifecycle_state: string
    unread_count: number
    last_message?: {
      content: string
      created_at: string
      sender?: { full_name: string }
    }
    participants: { user: { full_name: string } }[]
    created_at: string
  }
  isSelected?: boolean
  onClick?: () => void
  onArchive?: () => void
}

function ConversationListItem({ 
  conversation, 
  isSelected, 
  onClick, 
  onArchive 
}: ConversationListItemProps) {
  const otherParticipants = conversation.participants
    .filter((p) => p.user.full_name)
    .slice(0, 3)
    .map((p) => p.user.full_name)
    .join(', ')

  const typeLabels: Record<string, string> = {
    direct: '',
    announcement: '📢',
    workflow: '📋',
    support: '🎧',
  }

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 hover:bg-muted/50 cursor-pointer transition-colors',
        isSelected && 'bg-muted',
        conversation.unread_count > 0 && 'bg-primary/5'
      )}
      onClick={onClick}
    >
      {/* Avatar / Icon */}
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
        <MessageSquare className="h-5 w-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn('font-medium truncate', conversation.unread_count > 0 && 'font-semibold')}>
            {typeLabels[conversation.type]}
            {conversation.subject}
          </span>
          {conversation.unread_count > 0 && (
            <Badge variant="default" className="shrink-0">
              {conversation.unread_count}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {otherParticipants || 'No participants'}
        </p>
        {conversation.last_message && (
          <p className="text-xs text-muted-foreground truncate mt-1">
            {conversation.last_message.sender?.full_name}: {conversation.last_message.content}
          </p>
        )}
      </div>

      {/* Timestamp & Actions */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(conversation.last_message?.created_at || conversation.created_at), {
            addSuffix: false,
          })}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => e.stopPropagation()}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onArchive?.() }}>
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
