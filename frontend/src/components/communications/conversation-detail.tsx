'use client'

import { useState, useRef, useEffect } from 'react'
import { formatDistanceToNow, format } from 'date-fns'
import { 
  Send, 
  ArrowLeft, 
  MoreVertical, 
  Archive, 
  Users,
  Paperclip,
  Check,
  CheckCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCommunications } from '@/hooks/use-communications'
import { useAuth } from '@/providers/auth-provider'
import { Spinner } from '@/components/ui/loading'
import { cn } from '@/lib/utils'
import Link from 'next/link'

// Task 1.1.1.16h: ConversationDetail component

interface MessageType {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  message_type: string
  delivered_at: string | null
  created_at: string
  sender?: {
    full_name: string
    email: string
  }
}

interface ParticipantType {
  user_id: string
  role: string
  user: {
    full_name: string
    email: string
  }
}

interface ConversationDetailProps {
  conversationId: string
  onBack?: () => void
}

export function ConversationDetail({ conversationId, onBack }: ConversationDetailProps) {
  const { user } = useAuth()
  const { useConversation, sendMessage, markAsRead, archiveConversation, isSending } = useCommunications()
  const { data: conversation, isLoading } = useConversation(conversationId)
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation?.messages])

  // Mark messages as read when viewing
  useEffect(() => {
    if (conversation?.messages && user) {
      (conversation.messages as MessageType[])
        .filter((m) => m.sender_id !== user.id)
        .forEach((m) => markAsRead(m.id))
    }
  }, [conversation?.messages, user, markAsRead])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    sendMessage({
      conversationId,
      content: newMessage.trim(),
    })
    setNewMessage('')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Conversation not found
      </div>
    )
  }

  const otherParticipants = (conversation.participants as ParticipantType[])
    .filter((p) => p.user_id !== user?.id)
    .map((p) => p.user.full_name)
    .join(', ')

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold truncate">{conversation.subject}</h2>
          <p className="text-sm text-muted-foreground truncate">
            <Users className="h-3 w-3 inline mr-1" />
            {otherParticipants || 'No other participants'}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => archiveConversation(conversationId)}>
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {(conversation.messages as MessageType[])?.map((message, index) => {
            const messages = conversation.messages as MessageType[]
            const isOwnMessage = message.sender_id === user?.id
            const showDate =
              index === 0 ||
              new Date(message.created_at).toDateString() !==
                new Date(messages[index - 1].created_at).toDateString()

            return (
              <div key={message.id}>
                {showDate && (
                  <div className="flex justify-center my-4">
                    <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      {format(new Date(message.created_at), 'MMMM d, yyyy')}
                    </span>
                  </div>
                )}
                <div
                  className={cn(
                    'flex gap-3',
                    isOwnMessage ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="text-xs">
                      {message.sender?.full_name?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      'max-w-[70%] rounded-lg px-4 py-2',
                      isOwnMessage
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    {!isOwnMessage && (
                      <p className="text-xs font-medium mb-1">{message.sender?.full_name}</p>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <div
                      className={cn(
                        'flex items-center gap-1 mt-1 text-xs',
                        isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      )}
                    >
                      <span>{format(new Date(message.created_at), 'h:mm a')}</span>
                      {isOwnMessage && message.delivered_at && (
                        <CheckCheck className="h-3 w-3" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t">
        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="icon" disabled>
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            disabled={isSending}
          />
          <Button type="submit" disabled={!newMessage.trim() || isSending}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
