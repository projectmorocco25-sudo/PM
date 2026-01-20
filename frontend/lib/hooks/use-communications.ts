/**
 * useCommunications Hook
 * Task: 1.1.1.16m
 * Reference: State Management UI Patterns
 * 
 * Hook to fetch conversations, messages, mark as read, and handle real-time communication updates
 */

'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useEffect } from 'react'

export interface Conversation {
  id: string
  type: 'direct_message' | 'workflow_related' | 'announcement' | 'internal_moh'
  subject: string
  company_id: string | null
  workflow_entity_type: string | null
  workflow_entity_id: string | null
  lifecycle_state: 'CREATED' | 'SENT' | 'DELIVERED' | 'READ' | 'THREADED' | 'WORKFLOW_LINKED' | 'ARCHIVED'
  created_by: string
  created_at: string
  updated_at: string
  archived_at: string | null
  is_announcement: boolean
  announcement_expires_at: string | null
  // Computed fields from joins
  participant_ids?: string[]
  unread_count?: number
  last_message?: Message
  sender_name?: string
  recipient_name?: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  recipient_id: string | null
  content: string
  is_system_message: boolean
  delivered_at: string | null
  created_at: string
  updated_at: string
  edited_at: string | null
  deleted_at: string | null
  // Computed fields
  sender_name?: string
  recipient_name?: string
  is_read?: boolean
  read_at?: string | null
}

/**
 * Fetch user conversations with filters
 */
async function fetchConversations(params?: {
  type?: string[]
  lifecycle_state?: string[]
  workflow_entity_type?: string[]
  company_id?: string[]
  search?: string
  date_from?: string
  date_to?: string
  limit?: number
  offset?: number
}): Promise<{ conversations: Conversation[]; total: number }> {
  const supabase = createClient()
  const userId = (await supabase.auth.getUser()).data.user?.id
  
  if (!userId) {
    throw new Error('User not authenticated')
  }
  
  // First, get conversation IDs where user is a participant
  const { data: participantData } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .eq('user_id', userId)
  
  const conversationIds = participantData?.map((p) => p.conversation_id) || []
  
  if (conversationIds.length === 0) {
    return { conversations: [], total: 0 }
  }
  
  // Build query for conversations
  let query = supabase
    .from('conversations')
    .select('*', { count: 'exact' })
    .in('id', conversationIds)
  
  // Apply filters
  if (params?.type && params.type.length > 0) {
    query = query.in('type', params.type)
  }
  
  if (params?.lifecycle_state && params.lifecycle_state.length > 0) {
    query = query.in('lifecycle_state', params.lifecycle_state)
  }
  
  if (params?.workflow_entity_type && params.workflow_entity_type.length > 0) {
    query = query.in('workflow_entity_type', params.workflow_entity_type)
  }
  
  if (params?.company_id && params.company_id.length > 0) {
    query = query.in('company_id', params.company_id)
  }
  
  if (params?.search) {
    // Search in subject field only (content is in messages table, search that separately if needed)
    query = query.ilike('subject', `%${params.search}%`)
  }
  
  if (params?.date_from) {
    query = query.gte('created_at', params.date_from)
  }
  
  if (params?.date_to) {
    query = query.lte('created_at', params.date_to)
  }
  
  // Order by updated_at desc (most recent first)
  query = query.order('updated_at', { ascending: false })
  
  // Apply pagination
  if (params?.limit) {
    query = query.limit(params.limit)
  }
  
  if (params?.offset) {
    query = query.range(params.offset, params.offset + (params.limit || 20) - 1)
  }
  
  const { data, error, count } = await query
  
  if (error) {
    throw new Error(`Failed to fetch conversations: ${error.message}`)
  }
  
  // Transform data to Conversation[] format
  const conversations: Conversation[] = (data || []).map((conv: any) => ({
    id: conv.id,
    type: conv.type,
    subject: conv.subject,
    company_id: conv.company_id,
    workflow_entity_type: conv.workflow_entity_type,
    workflow_entity_id: conv.workflow_entity_id,
    lifecycle_state: conv.lifecycle_state,
    created_by: conv.created_by,
    created_at: conv.created_at,
    updated_at: conv.updated_at,
    archived_at: conv.archived_at,
    is_announcement: conv.is_announcement,
    announcement_expires_at: conv.announcement_expires_at,
  }))
  
  // TODO: Enhance with unread_count, last_message, participant names via separate queries if needed
  
  return {
    conversations,
    total: count || 0,
  }
}

/**
 * Fetch conversation messages and conversation data
 */
async function fetchConversationMessages(conversationId: string): Promise<{ messages: Message[]; conversation: Conversation | null }> {
  const supabase = createClient()
  
  // Fetch conversation data
  const { data: conversationData, error: conversationError } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', conversationId)
    .single()
  
  if (conversationError) {
    throw new Error(`Failed to fetch conversation: ${conversationError.message}`)
  }
  
  // Fetch messages
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:users!messages_sender_id_fkey(full_name),
      recipient:users!messages_recipient_id_fkey(full_name),
      message_read_receipts(user_id, read_at)
    `)
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
  
  if (error) {
    throw new Error(`Failed to fetch messages: ${error.message}`)
  }
  
  // Transform data to Message[] format
  // TODO: Fetch sender/recipient names and read receipts separately if needed for better performance
  const messages: Message[] = (data || []).map((msg: any) => ({
    id: msg.id,
    conversation_id: msg.conversation_id,
    sender_id: msg.sender_id,
    recipient_id: msg.recipient_id,
    content: msg.content,
    is_system_message: msg.is_system_message,
    delivered_at: msg.delivered_at,
    created_at: msg.created_at,
    updated_at: msg.updated_at,
    edited_at: msg.edited_at,
    deleted_at: msg.deleted_at,
    sender_name: msg.sender?.full_name,
    recipient_name: msg.recipient?.full_name,
    is_read: msg.message_read_receipts && msg.message_read_receipts.length > 0,
    read_at: msg.message_read_receipts?.[0]?.read_at || null,
  }))
  
  // Transform conversation data
  const conversation: Conversation | null = conversationData ? {
    id: conversationData.id,
    type: conversationData.type,
    subject: conversationData.subject,
    company_id: conversationData.company_id,
    workflow_entity_type: conversationData.workflow_entity_type,
    workflow_entity_id: conversationData.workflow_entity_id,
    lifecycle_state: conversationData.lifecycle_state,
    created_by: conversationData.created_by,
    created_at: conversationData.created_at,
    updated_at: conversationData.updated_at,
    archived_at: conversationData.archived_at,
    is_announcement: conversationData.is_announcement,
    announcement_expires_at: conversationData.announcement_expires_at,
  } : null
  
  return { messages, conversation }
}

/**
 * Mark conversation messages as read
 */
async function markConversationAsRead(conversationId: string): Promise<void> {
  const supabase = createClient()
  const userId = (await supabase.auth.getUser()).data.user?.id
  
  if (!userId) {
    throw new Error('User not authenticated')
  }
  
  // Get all unread messages in conversation
  const { data: messages, error: messagesError } = await supabase
    .from('messages')
    .select('id')
    .eq('conversation_id', conversationId)
    .or(`recipient_id.eq.${userId},sender_id.neq.${userId}`)
  
  if (messagesError) {
    throw new Error(`Failed to fetch messages: ${messagesError.message}`)
  }
  
  if (!messages || messages.length === 0) {
    return
  }
  
  // Create read receipts for unread messages
  const readReceipts = messages.map((msg) => ({
    message_id: msg.id,
    user_id: userId,
    read_at: new Date().toISOString(),
  }))
  
  // Use upsert to avoid duplicates
  const { error } = await supabase
    .from('message_read_receipts')
    .upsert(readReceipts, { onConflict: 'message_id,user_id' })
  
  if (error) {
    throw new Error(`Failed to mark messages as read: ${error.message}`)
  }
  
  // Update conversation lifecycle_state to READ if all messages read
  // (This logic could also be handled by RPC function)
}

/**
 * Hook to fetch conversations list
 */
export function useConversations(params?: {
  type?: string[]
  lifecycle_state?: string[]
  workflow_entity_type?: string[]
  company_id?: string[]
  search?: string
  date_from?: string
  date_to?: string
  limit?: number
  offset?: number
}) {
  return useQuery({
    queryKey: ['conversations', params],
    queryFn: () => fetchConversations(params),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Poll every 30 seconds for real-time updates
  })
}

/**
 * Hook to fetch conversation messages
 */
export function useConversationMessages(conversationId: string) {
  return useQuery({
    queryKey: ['conversation-messages', conversationId],
    queryFn: () => fetchConversationMessages(conversationId),
    enabled: !!conversationId,
    staleTime: 10 * 1000, // 10 seconds
    refetchInterval: 10 * 1000, // Poll every 10 seconds for new messages
  })
}

/**
 * Hook to mark conversation as read
 */
export function useMarkConversationAsRead() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: markConversationAsRead,
    onSuccess: (_, conversationId) => {
      // Invalidate conversations and messages queries
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      queryClient.invalidateQueries({ queryKey: ['conversation-messages', conversationId] })
    },
  })
}

/**
 * Create a new conversation and send the first message
 */
async function createConversation(params: {
  type: 'direct_message' | 'workflow_related' | 'announcement' | 'internal_moh'
  subject: string
  content: string
  recipientIds: string[]
  workflowEntityType?: string | null
  workflowEntityId?: string | null
  attachments?: File[]
}): Promise<{ conversation: Conversation; message: Message }> {
  const supabase = createClient()
  const userId = (await supabase.auth.getUser()).data.user?.id
  
  if (!userId) {
    throw new Error('User not authenticated')
  }
  
  // Get user's company_id (needed for conversation)
  const { data: userData } = await supabase
    .from('users')
    .select('company_id')
    .eq('id', userId)
    .single()
  
  const companyId = userData?.company_id || null
  
  // Create conversation
  const { data: conversationData, error: conversationError } = await supabase
    .from('conversations')
    .insert({
      type: params.type,
      subject: params.subject,
      company_id: companyId,
      workflow_entity_type: params.workflowEntityType || null,
      workflow_entity_id: params.workflowEntityId || null,
      lifecycle_state: params.workflowEntityType ? 'WORKFLOW_LINKED' : 'CREATED',
      created_by: userId,
      is_announcement: params.type === 'announcement',
    })
    .select()
    .single()
  
  if (conversationError) {
    throw new Error(`Failed to create conversation: ${conversationError.message}`)
  }
  
  // Add participants (creator + recipients)
  const participantIds = [userId, ...params.recipientIds]
  const participants = participantIds.map((participantId) => ({
    conversation_id: conversationData.id,
    user_id: participantId,
    role: participantId === userId ? 'creator' : 'participant',
  }))
  
  const { error: participantsError } = await supabase
    .from('conversation_participants')
    .insert(participants)
  
  if (participantsError) {
    throw new Error(`Failed to add participants: ${participantsError.message}`)
  }
  
  // Create first message (sent to first recipient or broadcast)
  const recipientId = params.recipientIds.length > 0 ? params.recipientIds[0] : null
  
  const { data: messageData, error: messageError } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationData.id,
      sender_id: userId,
      recipient_id: recipientId,
      content: params.content,
      is_system_message: false,
    })
    .select()
    .single()
  
  if (messageError) {
    throw new Error(`Failed to send message: ${messageError.message}`)
  }
  
  // Upload attachments if any
  // TODO: Implement attachment upload to Supabase Storage
  
  // Update conversation lifecycle_state to SENT
  await supabase
    .from('conversations')
    .update({ lifecycle_state: 'SENT', updated_at: new Date().toISOString() })
    .eq('id', conversationData.id)
  
  const conversation: Conversation = {
    id: conversationData.id,
    type: conversationData.type,
    subject: conversationData.subject,
    company_id: conversationData.company_id,
    workflow_entity_type: conversationData.workflow_entity_type,
    workflow_entity_id: conversationData.workflow_entity_id,
    lifecycle_state: conversationData.lifecycle_state,
    created_by: conversationData.created_by,
    created_at: conversationData.created_at,
    updated_at: conversationData.updated_at,
    archived_at: conversationData.archived_at,
    is_announcement: conversationData.is_announcement,
    announcement_expires_at: conversationData.announcement_expires_at,
  }
  
  const message: Message = {
    id: messageData.id,
    conversation_id: messageData.conversation_id,
    sender_id: messageData.sender_id,
    recipient_id: messageData.recipient_id,
    content: messageData.content,
    is_system_message: messageData.is_system_message,
    delivered_at: messageData.delivered_at,
    created_at: messageData.created_at,
    updated_at: messageData.updated_at,
    edited_at: messageData.edited_at,
    deleted_at: messageData.deleted_at,
  }
  
  return { conversation, message }
}

/**
 * Hook to create a conversation
 */
export function useCreateConversation() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createConversation,
    onSuccess: () => {
      // Invalidate conversations query
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })
}

/**
 * Send a message in a conversation
 */
async function sendMessage(params: {
  conversationId: string
  content: string
  recipientId: string | null
  attachments?: File[]
}): Promise<Message> {
  const supabase = createClient()
  const userId = (await supabase.auth.getUser()).data.user?.id
  
  if (!userId) {
    throw new Error('User not authenticated')
  }
  
  // Create message
  const { data: messageData, error: messageError } = await supabase
    .from('messages')
    .insert({
      conversation_id: params.conversationId,
      sender_id: userId,
      recipient_id: params.recipientId,
      content: params.content,
      is_system_message: false,
    })
    .select()
    .single()
  
  if (messageError) {
    throw new Error(`Failed to send message: ${messageError.message}`)
  }
  
  // Upload attachments if any
  // TODO: Implement attachment upload to Supabase Storage
  // For now, attachment metadata would be stored in message_attachments table
  
  // Update conversation lifecycle_state to THREADED if multiple messages exist
  const { data: messageCount } = await supabase
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('conversation_id', params.conversationId)
  
  if (messageCount && messageCount > 1) {
    await supabase
      .from('conversations')
      .update({ lifecycle_state: 'THREADED', updated_at: new Date().toISOString() })
      .eq('id', params.conversationId)
  } else {
    await supabase
      .from('conversations')
      .update({ lifecycle_state: 'SENT', updated_at: new Date().toISOString() })
      .eq('id', params.conversationId)
  }
  
  return {
    id: messageData.id,
    conversation_id: messageData.conversation_id,
    sender_id: messageData.sender_id,
    recipient_id: messageData.recipient_id,
    content: messageData.content,
    is_system_message: messageData.is_system_message,
    delivered_at: messageData.delivered_at,
    created_at: messageData.created_at,
    updated_at: messageData.updated_at,
    edited_at: messageData.edited_at,
    deleted_at: messageData.deleted_at,
  }
}

/**
 * Hook to send a message
 */
export function useSendMessage() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: sendMessage,
    onSuccess: (_, variables) => {
      // Invalidate conversations and messages queries
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      queryClient.invalidateQueries({ queryKey: ['conversation-messages', variables.conversationId] })
    },
  })
}

/**
 * Hook to set up real-time communication subscriptions
 */
export function useCommunicationRealtime() {
  const queryClient = useQueryClient()
  
  useEffect(() => {
    const supabase = createClient()
    
    // Subscribe to conversations changes
    const conversationsChannel = supabase
      .channel('conversations-changes')
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
    
    // Subscribe to messages changes
    const messagesChannel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const conversationId = payload.new?.conversation_id || payload.old?.conversation_id
          queryClient.invalidateQueries({ queryKey: ['conversation-messages', conversationId] })
          queryClient.invalidateQueries({ queryKey: ['conversations'] })
        }
      )
      .subscribe()
    
    // Subscribe to read receipts changes
    const readReceiptsChannel = supabase
      .channel('read-receipts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_read_receipts',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['conversation-messages'] })
          queryClient.invalidateQueries({ queryKey: ['conversations'] })
        }
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(conversationsChannel)
      supabase.removeChannel(messagesChannel)
      supabase.removeChannel(readReceiptsChannel)
    }
  }, [queryClient])
}
