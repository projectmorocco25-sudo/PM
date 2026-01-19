/**
 * useNotifications Hook
 * Task: 1.1.1.16d
 * Reference: State Management UI Patterns
 * 
 * Hook to fetch, mark as read, and handle real-time notification updates
 */

'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createBrowserClient } from '@/lib/supabase'
import { useEffect } from 'react'

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  link: string | null
  is_read: boolean
  read_at: string | null
  created_at: string
}

/**
 * Fetch user notifications
 */
async function fetchNotifications(limit: number = 15): Promise<Notification[]> {
  const supabase = createBrowserClient()
  
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', (await supabase.auth.getUser()).data.user?.id || '')
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    throw new Error(`Failed to fetch notifications: ${error.message}`)
  }
  
  return (data || []) as Notification[]
}

/**
 * Fetch unread notification count
 */
async function fetchUnreadCount(): Promise<number> {
  const supabase = createBrowserClient()
  const userId = (await supabase.auth.getUser()).data.user?.id
  
  if (!userId) {
    return 0
  }
  
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false)
  
  if (error) {
    throw new Error(`Failed to fetch unread count: ${error.message}`)
  }
  
  return count || 0
}

/**
 * Mark notification as read
 */
async function markAsRead(notificationId: string): Promise<void> {
  const supabase = createBrowserClient()
  
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', notificationId)
    .eq('user_id', (await supabase.auth.getUser()).data.user?.id || '')
  
  if (error) {
    throw new Error(`Failed to mark notification as read: ${error.message}`)
  }
}

/**
 * Mark all notifications as read
 */
async function markAllAsRead(): Promise<void> {
  const supabase = createBrowserClient()
  const userId = (await supabase.auth.getUser()).data.user?.id
  
  if (!userId) {
    throw new Error('User not authenticated')
  }
  
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('is_read', false)
  
  if (error) {
    throw new Error(`Failed to mark all notifications as read: ${error.message}`)
  }
}

/**
 * Hook to fetch notifications list
 */
export function useNotifications(limit: number = 15) {
  return useQuery({
    queryKey: ['notifications', limit],
    queryFn: () => fetchNotifications(limit),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Poll every 30 seconds for real-time updates
  })
}

/**
 * Hook to fetch unread notification count
 */
export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: fetchUnreadCount,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Poll every 30 seconds for real-time updates
  })
}

/**
 * Hook to mark notification as read
 */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      // Invalidate notifications queries to refetch
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] })
    },
  })
}

/**
 * Hook to mark all notifications as read
 */
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      // Invalidate notifications queries to refetch
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] })
    },
  })
}

/**
 * Hook to set up real-time notification subscriptions
 */
export function useNotificationRealtime() {
  const queryClient = useQueryClient()
  
  useEffect(() => {
    const supabase = createBrowserClient()
    
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
        },
        () => {
          // Invalidate queries when notifications change
          queryClient.invalidateQueries({ queryKey: ['notifications'] })
          queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] })
        }
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])
}
