/**
 * Wireframe: task-0.5.1.24-communications-inbox-list.md
 * Implements: CommunicationsInbox component (conversation list, unread indicators, filters, search, role-based access)
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.24-communications-inbox-list.md
 */

'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MainContent } from '@/components/layout/main-content'
import { useConversations, useCommunicationRealtime } from '@/lib/hooks/use-communications'
import { useUserRole } from '@/lib/hooks/use-user-role'
import { Skeleton } from '@/components/ui/loading/skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { MessageSquare, Filter, X, Link as LinkIcon, CheckCheck } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

interface ConversationItemProps {
  conversation: any
  onClick: () => void
}

function ConversationItem({ conversation, onClick }: ConversationItemProps) {
  // Determine if conversation has unread messages (placeholder - needs enhancement with actual unread count)
  const isUnread = conversation.lifecycle_state === 'DELIVERED' || conversation.lifecycle_state === 'SENT'
  const isRead = conversation.lifecycle_state === 'READ'
  const isThreaded = conversation.lifecycle_state === 'THREADED'
  const isWorkflowLinked = conversation.lifecycle_state === 'WORKFLOW_LINKED'
  
  const timeAgo = formatDistanceToNow(new Date(conversation.updated_at || conversation.created_at), { addSuffix: true })
  
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex min-h-[80px] cursor-pointer items-start gap-4 border-b border-gray-200 px-4 py-3 transition-colors hover:bg-gray-50',
        isUnread && 'bg-blue-50/50'
      )}
      style={{
        minHeight: '80px',
        padding: '12px 16px',
        ...(isUnread && { backgroundColor: '#eff6ff' }),
      }}
    >
      {/* Unread/Read Indicator */}
      <div className="mt-1 flex-shrink-0">
        {isUnread ? (
          <div
            className="h-2 w-2 rounded-full bg-blue-500"
            style={{ width: '8px', height: '8px', backgroundColor: '#3b82f6' }}
            aria-label="Unread"
          />
        ) : (
          <div
            className="h-2 w-2 rounded-full bg-gray-400"
            style={{ width: '8px', height: '8px', backgroundColor: '#9ca3af' }}
            aria-label="Read"
          />
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {/* Subject */}
            <div
              className={cn(
                'text-base font-medium',
                isUnread ? 'font-semibold text-gray-900' : 'font-normal text-gray-900'
              )}
              style={{
                fontSize: '16px',
                fontWeight: isUnread ? 600 : 400,
                color: '#111827',
              }}
            >
              {conversation.subject}
            </div>
            
            {/* From/To - Placeholder (needs participant data) */}
            <div
              className="mt-1 text-sm text-gray-600"
              style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}
            >
              From: System
            </div>
            
            {/* Preview - Placeholder (needs last message content) */}
            <div
              className="mt-1 line-clamp-2 text-sm text-gray-600"
              style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}
            >
              Conversation preview...
            </div>
            
            {/* Regulatory Context (Fatima's Requirement - for workflow-linked messages) */}
            {conversation.workflow_entity_type === 'enforcement_action' && (
              <div className="mt-2 flex items-center gap-2 text-xs text-blue-600" style={{ fontSize: '12px', color: '#2563eb', marginTop: '8px' }}>
                <LinkIcon className="h-3 w-3" />
                <span>Regulatory: DMP Art.12</span>
                <Link 
                  href={`/enforcement/actions/${conversation.workflow_entity_id}`}
                  className="underline hover:text-blue-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  [View]
                </Link>
                <span>Legal Basis:</span>
                <Link 
                  href={`/enforcement/actions/${conversation.workflow_entity_id}#legal-basis`}
                  className="underline hover:text-blue-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  [Link to enforcement]
                </Link>
              </div>
            )}
          </div>
          
          {/* Right side - Timestamp and status indicators */}
          <div className="flex flex-col items-end gap-2">
            {/* Timestamp */}
            <div
              className="text-xs text-gray-400"
              style={{ fontSize: '12px', color: '#9ca3af' }}
            >
              {timeAgo}
            </div>
            
            {/* Status Indicators */}
            <div className="flex items-center gap-1">
              {isRead && (
                <span
                  className="text-xs text-gray-500"
                  style={{ fontSize: '12px', color: '#6b7280' }}
                >
                  <CheckCheck className="h-3 w-3 inline" /> Read
                </span>
              )}
              {isThreaded && (
                <span
                  className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700"
                  style={{ fontSize: '11px' }}
                >
                  Thread
                </span>
              )}
              {isWorkflowLinked && (
                <LinkIcon
                  className="h-4 w-4 text-blue-600"
                  style={{ width: '16px', height: '16px', color: '#2563eb' }}
                  aria-label="Workflow linked"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CommunicationsInbox() {
  const router = useRouter()
  const { data: roleData } = useUserRole()
  const [searchQuery, setSearchQuery] = useState('')
  // Filters sidebar visible by default on desktop (1024px+), hidden on mobile
  const [filtersOpen, setFiltersOpen] = useState(true)
  const [filters, setFilters] = useState({
    type: [] as string[],
    lifecycle_state: [] as string[],
    workflow_entity_type: [] as string[],
    company_id: [] as string[],
    date_range: 'all' as string,
  })
  
  // Set up real-time updates
  useCommunicationRealtime()
  
  // Build query params from filters
  const queryParams = useMemo(() => {
    const params: any = {
      limit: 20,
      search: searchQuery || undefined,
    }
    
    if (filters.type.length > 0) {
      params.type = filters.type
    }
    
    if (filters.lifecycle_state.length > 0) {
      params.lifecycle_state = filters.lifecycle_state
    }
    
    if (filters.workflow_entity_type.length > 0) {
      params.workflow_entity_type = filters.workflow_entity_type
    }
    
    if (filters.company_id.length > 0) {
      params.company_id = filters.company_id
    }
    
    // Date range filter
    if (filters.date_range && filters.date_range !== 'all') {
      const now = new Date()
      if (filters.date_range === '7d') {
        params.date_from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
      } else if (filters.date_range === '30d') {
        params.date_from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
      } else if (filters.date_range === '90d') {
        params.date_from = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString()
      }
    }
    
    return params
  }, [searchQuery, filters])
  
  const { data, isLoading, error } = useConversations(queryParams)
  
  const conversations = data?.conversations || []
  const hasMore = conversations.length < (data?.total || 0)
  
  const handleConversationClick = (conversationId: string) => {
    router.push(`/communications/inbox/${conversationId}`)
  }
  
  const handleClearFilters = () => {
    setFilters({
      type: [],
      lifecycle_state: [],
      workflow_entity_type: [],
      company_id: [],
      date_range: 'all',
    })
    setSearchQuery('')
  }
  
  return (
    <MainContent
      breadcrumbs={[
        { label: 'Home', href: '/dashboard' },
        { label: 'Communications', href: '/communications/inbox' },
        { label: 'Inbox' },
      ]}
      title="Inbox"
      actions={
        <div className="flex items-center gap-2" style={{ gap: '16px' }}>
          <Button
            onClick={() => router.push('/communications/compose')}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            New Message
          </Button>
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
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10"
              style={{ paddingRight: '40px' }}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <MessageSquare className="h-4 w-4 text-gray-400" />
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-1 gap-4">
          {/* Filters Sidebar - 240px desktop (visible by default), hidden on mobile, toggleable on tablet */}
          <div
            className={cn(
              'hidden lg:block w-[240px] flex-shrink-0 border-r border-gray-200 bg-white p-4',
              // On tablet/mobile, show only if filtersOpen is true
              filtersOpen && 'block'
            )}
            style={{ width: '240px', padding: '16px' }}
          >
            <div className="space-y-6">
              {/* Type Filter */}
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-700" style={{ fontSize: '12px', fontWeight: 500 }}>
                  Type
                </label>
                <div className="space-y-2">
                  {['All', 'Message', 'System Announcement', 'Workflow'].map((type) => (
                    <label key={type} className="flex items-center gap-2 text-sm text-gray-700">
                      <Checkbox
                        checked={
                          type === 'All'
                            ? filters.type.length === 0
                            : filters.type.includes(type.toLowerCase().replace(' ', '_'))
                        }
                        onCheckedChange={(checked) => {
                          if (type === 'All') {
                            setFilters({ ...filters, type: [] })
                          } else {
                            const typeValue = type.toLowerCase().replace(' ', '_')
                            setFilters({
                              ...filters,
                              type: checked
                                ? [...filters.type, typeValue]
                                : filters.type.filter((t) => t !== typeValue),
                            })
                          }
                        }}
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Status Filter (Lifecycle States) */}
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-700" style={{ fontSize: '12px', fontWeight: 500 }}>
                  Status
                </label>
                <div className="space-y-2">
                  {['All', 'Unread', 'Read', 'Threaded', 'Workflow-Linked'].map((status) => (
                    <label key={status} className="flex items-center gap-2 text-sm text-gray-700">
                      <Checkbox
                        checked={
                          status === 'All'
                            ? filters.lifecycle_state.length === 0
                            : filters.lifecycle_state.includes(status.toUpperCase())
                        }
                        onCheckedChange={(checked) => {
                          if (status === 'All') {
                            setFilters({ ...filters, lifecycle_state: [] })
                          } else {
                            const statusValue = status.toUpperCase().replace('-', '_')
                            setFilters({
                              ...filters,
                              lifecycle_state: checked
                                ? [...filters.lifecycle_state, statusValue]
                                : filters.lifecycle_state.filter((s) => s !== statusValue),
                            })
                          }
                        }}
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
                    { value: '90d', label: 'Last 90 days' },
                  ].map((range) => (
                    <label key={range.value} className="flex items-center gap-2 text-sm text-gray-700">
                      <Checkbox
                        checked={filters.date_range === range.value}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFilters({ ...filters, date_range: range.value })
                          } else if (range.value === 'all') {
                            setFilters({ ...filters, date_range: 'all' })
                          }
                        }}
                      />
                      <span>{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Clear Filters Button */}
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
          
          {/* Conversation List */}
          <div className="flex-1 min-w-0">
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
                <p className="text-sm text-red-600">Failed to load conversations. Please try again.</p>
              </div>
            )}
            
            {!isLoading && !error && conversations.length === 0 && (
              <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                <MessageSquare
                  className="h-16 w-16 text-gray-400"
                  style={{ width: '64px', height: '64px', color: '#9ca3af' }}
                />
                <p
                  className="mt-4 text-base font-medium text-gray-600"
                  style={{ fontSize: '16px', color: '#6b7280', marginTop: '16px' }}
                >
                  No conversations
                </p>
                <p
                  className="mt-1 text-sm text-gray-500"
                  style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}
                >
                  You don't have any conversations yet.
                </p>
                <Button
                  onClick={() => router.push('/communications/compose')}
                  className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
                >
                  Compose Message
                </Button>
              </div>
            )}
            
            {!isLoading && !error && conversations.length > 0 && (
              <div className="space-y-0 border border-gray-200 rounded-lg bg-white">
                {conversations.map((conversation) => (
                  <ConversationItem
                    key={conversation.id}
                    conversation={conversation}
                    onClick={() => handleConversationClick(conversation.id)}
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
      </div>
    </MainContent>
  )
}
