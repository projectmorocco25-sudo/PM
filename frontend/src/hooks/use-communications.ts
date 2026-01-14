'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createBrowserClient } from '@supabase/ssr'
import { useAuth } from '@/providers/auth-provider'
import { useEffect } from 'react'

// Task 1.1.1.16m: useCommunications hook
// Task 1.1.1.16n: Real-time updates

interface Conversation {
  id: string
  subject: string
  type: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
  lifecycle_state: string
  related_entity_type: string | null
  related_entity_id: string | null
  last_message_at: string | null
  created_by: string
  created_at: string
  is_deleted: boolean
  is_starred?: boolean
}

interface Message {
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

interface ConversationWithDetails extends Conversation {
  participants: {
    user_id: string
    role: string
    user: {
      full_name: string
      email: string
      avatar_url?: string
    }
  }[]
  unread_count: number
  last_message?: Message
}

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-key'
  return createBrowserClient(url, key)
}

export function useCommunications() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const supabase = getClient()

  // Fetch conversations
  const conversationsQuery = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async (): Promise<ConversationWithDetails[]> => {
      if (!user) return []

      // Get conversations where user is a participant
      const { data: participations, error: partError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id)

      if (partError) throw partError

      const conversationIds = participations?.map((p) => p.conversation_id) || []
      if (conversationIds.length === 0) return []

      // Get conversation details
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select('*')
        .in('id', conversationIds)
        .eq('is_deleted', false)
        .order('last_message_at', { ascending: false, nullsFirst: false })

      if (error) throw error

      // Enhance with participant and unread info
      const enhanced = await Promise.all(
        (conversations || []).map(async (conv) => {
          // Get participants
          const { data: participants } = await supabase
            .from('conversation_participants')
            .select('user_id, role, users(full_name, email)')
            .eq('conversation_id', conv.id)

          // Get unread count
          const { data: messages } = await supabase
            .from('messages')
            .select('id')
            .eq('conversation_id', conv.id)
            .neq('sender_id', user.id)

          const messageIds = messages?.map((m) => m.id) || []
          
          let unreadCount = messageIds.length
          if (messageIds.length > 0) {
            const { count } = await supabase
              .from('message_read_receipts')
              .select('*', { count: 'exact', head: true })
              .in('message_id', messageIds)
              .eq('user_id', user.id)
            unreadCount = messageIds.length - (count || 0)
          }

          // Get last message
          const { data: lastMessages } = await supabase
            .from('messages')
            .select('*, users(full_name, email)')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)

          return {
            ...conv,
            is_starred: isStarred,
            participants: participants?.map((p) => ({
              user_id: p.user_id,
              role: p.role,
              user: (Array.isArray(p.users) ? p.users[0] : p.users) as { full_name: string; email: string; avatar_url?: string },
            })) || [],
            unread_count: unreadCount,
            last_message: lastMessages?.[0] || undefined,
          }
        })
      )

      return enhanced
    },
    enabled: !!user,
  })

  // Fetch single conversation with messages
  const useConversation = (conversationId: string) => {
    return useQuery({
      queryKey: ['conversation', conversationId],
      queryFn: async () => {
        const { data: conversation, error } = await supabase
          .from('conversations')
          .select('*')
          .eq('id', conversationId)
          .single()

        if (error) throw error

        // Get messages
        const { data: messages } = await supabase
          .from('messages')
          .select('*, users(full_name, email)')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true })

        // Get participants
        const { data: participants } = await supabase
          .from('conversation_participants')
          .select('user_id, role, users(full_name, email)')
          .eq('conversation_id', conversationId)

        return {
          ...conversation,
          messages: messages || [],
          participants: participants?.map((p) => ({
            user_id: p.user_id,
            role: p.role,
            user: (Array.isArray(p.users) ? p.users[0] : p.users) as { full_name: string; email: string },
          })) || [],
        }
      },
      enabled: !!conversationId,
    })
  }

  // Create conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: async (params: {
      subject: string
      type?: string
      participants: string[]
      initialMessage?: string
    }) => {
      const { data, error } = await supabase.rpc('communications_create_conversation', {
        p_subject: params.subject,
        p_type: params.type || 'direct',
        p_participants: params.participants,
      })

      if (error) throw error

      // Send initial message if provided
      if (params.initialMessage && data) {
        await supabase.rpc('communications_send_message', {
          p_conversation_id: data,
          p_content: params.initialMessage,
        })
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (params: { conversationId: string; content: string; messageType?: string }) => {
      const { data, error } = await supabase.rpc('communications_send_message', {
        p_conversation_id: params.conversationId,
        p_content: params.content,
        p_message_type: params.messageType || 'text',
      })

      if (error) throw error
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['conversation', variables.conversationId] })
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const { data, error } = await supabase.rpc('communications_mark_read', {
        p_message_id: messageId,
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })

  // Archive conversation mutation
  const archiveConversationMutation = useMutation({
    mutationFn: async (conversationId: string) => {
      const { data, error } = await supabase.rpc('communications_archive_conversation', {
        p_conversation_id: conversationId,
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })

  // Real-time subscription
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('communications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['conversations'] })
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['conversations'] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, queryClient, supabase])

  return {
    conversations: conversationsQuery.data || [],
    isLoading: conversationsQuery.isLoading,
    isError: conversationsQuery.isError,
    useConversation,
    createConversation: createConversationMutation.mutate,
    sendMessage: sendMessageMutation.mutate,
    markAsRead: markAsReadMutation.mutate,
    archiveConversation: archiveConversationMutation.mutate,
    starConversation: (conversationId: string, starred: boolean) => 
      starConversationMutation.mutate({ conversationId, starred }),
    updateLifecycleState: (conversationId: string, state: string) =>
      updateLifecycleStateMutation.mutate({ conversationId, state }),
    isCreating: createConversationMutation.isPending,
    isSending: sendMessageMutation.isPending,
  }
}
