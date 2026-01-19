/**
 * Wireframe: task-0.5.1.27-sent-messages.md
 * Implements: SentMessages component (sent conversations list, status indicators)
 * Wireframe Link: ../../../../../docs/04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.27-sent-messages.md
 */

'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { MainContent } from '@/components/layout/main-content'
import { useConversations, useCommunicationRealtime } from '@/lib/hooks/use-communications'
import { Skeleton } from '@/components/ui/loading/skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageSquare, Filter, CheckCheck } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import { createBrowserClient } from '@/lib/supabase'
import { useEffect } from 'react'

interface SentMessageItemProps {
  conversation: any
  onClick: () => void
}

function SentMessageItem({ conversation, onClick }: SentMessageItemProps) {
  // Determine status (Sent, Delivered, Read)
  // Status is based on the first message's delivery/read status
  const status = conversation.lifecycle_state
  const isRead = status === 'READ' || status === 'THREADED'
  const isDelivered = status === 'DELIVERED' && !isRead
  const isSent = status === 'SENT' || status === 'CREATED'
  
  const timeAgo = formatDistanceToNow(new Date(conversation.updated_at || conversation.created_at), { addSuffix: true })
  
  return (
    <div
      onClick={onClick}
      className="flex min-h-[64px] cursor-pointer items-start gap-4 border-b border-gray-200 px-4 py-3 transition-colors hover:bg-gray-50"
      style={{
        minHeight: '64px',
        padding: '12px 16px',
      }}
    >
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {/* Recipient */}
            <div
              className="text-sm text-gray-600"
              style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}
            >
              To: {conversation.recipient_name || 'Recipient'} {/* Placeholder - needs participant data */}
            </div>
            
            {/* Subject */}
            <div
              className="text-base font-semibold text-gray-900"
              style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}
            >
              {conversation.subject}
            </div>
            
            {/* Preview - Placeholder (needs last message content) */}
            <div
              className="line-clamp-2 text-sm text-gray-600"
              style={{ fontSize: '14px', color: '#6b7280' }}
            >
              {conversation.preview || 'Message preview...'}
            </div>
          </div>
          
          {/* Right side - Status and Timestamp */}
          <div className="flex flex-col items-end gap-2">
            {/* Status Indicator */}
            <div className="flex items-center gap-1">
              {isRead ? (
                <span
                  className="text-xs font-medium text-green-600"
                  style={{ fontSize: '12px', color: '#22c55e', fontWeight: 500 }}
                >
                  <CheckCheck className="h-3 w-3 inline" /> Read
                </span>
              ) : isDelivered ? (
                <span
                  className="text-xs font-medium text-blue-600"
                  style={{ fontSize: '12px', color: '#3b82f6', fontWeight: 500 }}
                >
                  <CheckCheck className="h-3 w-3 inline" /> Delivered
                </span>
              ) : (
                <span
                  className="text-xs font-medium text-gray-500"
                  style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}
                >
                  ✓ Sent
                </span>
              )}
            </div>
            
            {/* Timestamp */}
            <div
              className="text-xs text-gray-400"
              style={{ fontSize: '12px', color: '#9ca3af' }}
            >
              {timeAgo}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SentMessages() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState({
    status: [] as string[],
    date_range: 'all' as string,
    recipient: '' as string,
  })
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  
  // Get current user ID
  useEffect(() => {
    const supabase = createBrowserClient()
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id || null)
    })
  }, [])
  
  // Set up real-time updates
  useCommunicationRealtime()
  
  // Build query params from filters - filter by conversations created by current user
  const queryParams = useMemo(() => {
    const params: any = {
      limit: 20,
      search: searchQuery || undefined,
    }
    
    // Filter by status (lifecycle_state)
    if (filters.status.length > 0) {
      params.lifecycle_state = filters.status
    }
    
    // Date range filter
    if (filters.date_range !== 'all') {
      const now = new Date()
      if (filters.date_range === '7d') {
        params.date_from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
      } else if (filters.date_range === '30d') {
        params.date_from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    }
    
    return params
  }, [searchQuery, filters])
  
  const { data, isLoading, error } = useConversations(queryParams)
  
  // Filter conversations where current user is the creator
  const sentConversations = useMemo(() => {
    if (!data?.conversations || !currentUserId) return []
    return data.conversations.filter((conv) => conv.created_by === currentUserId)
  }, [data?.conversations, currentUserId])
  
  const hasMore = sentConversations.length < (data?.total || 0)
  
  const handleMessageClick = (conversationId: string) => {
    router.push(`/communications/inbox/${conversationId}`)
  }
  
  const handleClearFilters = () => {
    setFilters({
      status: [],
      date_range: 'all',
      recipient: '',
    })
    setSearchQuery('')
  }
  
  return (
    <MainContent
      breadcrumbs={[
        { label: 'Home', href: '/dashboard' },
        { label: 'Communications', href: '/communications/inbox' },
        { label: 'Sent Messages' },
      ]}
      title="Sent Messages"
      actions={
        <div className="flex items-center gap-2" style={{ gap: '16px' }}>
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
            style={{ width: '256px' }}
          />
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100"
            aria-label="Toggle filters"
            style={{ width: '40px', height: '40px' }}
          >
            <Filter className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      }
    >
      <div className="flex h-full flex-col">
        {/* Filters Sidebar (if open) */}
        {filtersOpen && (
          <div
            className="mb-4 rounded-lg border border-gray-200 bg-white p-4"
            style={{ padding: '16px', marginBottom: '16px' }}
          >
            <div className="space-y-4">
              {/* Status Filter */}
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-700" style={{ fontSize: '12px', fontWeight: 500 }}>
                  Status
                </label>
                <div className="space-y-2">
                  {['All', 'Sent', 'Delivered', 'Read'].map((status) => (
                    <label key={status} className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={
                          status === 'All'
                            ? filters.status.length === 0
                            : filters.status.includes(status.toUpperCase())
                        }
                        onChange={(e) => {
                          if (status === 'All') {
                            setFilters({ ...filters, status: [] })
                          } else {
                            const statusValue = status.toUpperCase()
                            setFilters({
                              ...filters,
                              status: e.target.checked
                                ? [...filters.status, statusValue]
                                : filters.status.filter((s) => s !== statusValue),
                            })
                          }
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <span>{status}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Date Range Filter */}
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-700" style={{ fontSize: '12px', fontWeight: 500 }}>
                  Date Range
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All' },
                    { value: '7d', label: 'Last 7 days' },
                    { value: '30d', label: 'Last 30 days' },
                  ].map((range) => (
                    <label key={range.value} className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="radio"
                        name="date_range"
                        checked={filters.date_range === range.value}
                        onChange={() => setFilters({ ...filters, date_range: range.value })}
                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <span>{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}
        
        {/* Sent Messages List */}
        <div className="flex-1">
          {isLoading && (
            <div className="space-y-0">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border-b border-gray-200 px-4 py-3">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-1" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          )}
          
          {error && (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-red-600">Failed to load sent messages. Please try again.</p>
            </div>
          )}
          
          {!isLoading && !error && sentConversations.length === 0 && (
            <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
              <MessageSquare
                className="h-16 w-16 text-gray-400"
                style={{ width: '64px', height: '64px', color: '#9ca3af' }}
              />
              <p
                className="mt-4 text-base font-medium text-gray-600"
                style={{ fontSize: '16px', color: '#6b7280', marginTop: '16px' }}
              >
                No sent messages
              </p>
              <p
                className="mt-1 text-sm text-gray-500"
                style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}
              >
                You haven't sent any messages yet.
              </p>
              <Button
                onClick={() => router.push('/communications/compose')}
                className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
              >
                Compose Message
              </Button>
            </div>
          )}
          
          {!isLoading && !error && sentConversations.length > 0 && (
            <div className="space-y-0 border border-gray-200 rounded-lg bg-white">
              {sentConversations.map((conversation) => (
                <SentMessageItem
                  key={conversation.id}
                  conversation={conversation}
                  onClick={() => handleMessageClick(conversation.id)}
                />
              ))}
              
              {hasMore && (
                <div className="border-t border-gray-200 px-4 py-3 text-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      // TODO: Implement load more pagination
                    }}
                  >
                    Load More
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </MainContent>
  )
}
