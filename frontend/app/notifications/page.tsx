/**
 * Wireframe: task-0.5.1.31-notifications-page.md
 * Route: /notifications
 * Implements: Full Notifications Page with filters, settings, and regulatory compliance features
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.31-notifications-page.md
 */

'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MainContent } from '@/components/layout/main-content'
import { Button } from '@/components/ui/button'
import { Settings, Filter, CheckCircle2, Inbox, Loader2 } from 'lucide-react'
import { NotificationsList } from '@/components/notifications/notifications-list'
import { NotificationsFilters } from '@/components/notifications/notifications-filters'
import { NotificationsSettings } from '@/components/notifications/notifications-settings'
import {
  useNotifications,
  useMarkAllNotificationsAsRead,
  useNotificationRealtime,
} from '@/lib/hooks/use-notifications'
import { toast } from 'sonner'

export type NotificationType =
  | 'submission_status'
  | 'submission_approved'
  | 'submission_rejected'
  | 'breach_alert'
  | 'threshold_exceeded'
  | 'critical_breach'
  | 'new_message'
  | 'message_reply'
  | 'approval_required'
  | 'workflow_action_required'
  | 'workflow_completed'
  | 'enforcement_warning'
  | 'enforcement_fine'
  | 'enforcement_suspension'
  | 'enforcement_appeal'
  | 'enforcement_action_executed'
  | 'enforcement_action_created'
  | 'enforcement_action_requires_approval'
  | 'appeal_submitted'
  | 'appeal_requires_review'
  | 'appeal_status_update'
  | 'appeal_deadline_reminder'
  | 'threshold_reversion_7d'
  | 'threshold_reversion_1d'
  | 'threshold_reversion_completed'
  | 'threshold_reversion_review_required'
  | 'system_maintenance'
  | 'feature_update'
  | 'policy_change'

export type NotificationStatus = 'all' | 'unread' | 'read'
export type NotificationPriority = 'all' | 'urgent' | 'high' | 'normal'
export type DateRange = 'last_7_days' | 'last_30_days' | 'custom' | 'all'
export type DeadlineStatus = 'all' | 'critical' | 'approaching' | 'safe' | 'none'

export interface NotificationFilters {
  type: NotificationType | 'all'
  status: NotificationStatus
  dateRange: DateRange
  priority: NotificationPriority
  deadlineStatus: DeadlineStatus
  searchQuery: string
}

export default function NotificationsPage() {
  const router = useRouter()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [filters, setFilters] = useState<NotificationFilters>({
    type: 'all',
    status: 'all',
    dateRange: 'all',
    priority: 'all',
    deadlineStatus: 'all',
    searchQuery: '',
  })
  const [page, setPage] = useState(1)
  const limit = 50

  // Fetch notifications - using larger limit for full page view (wireframe shows load more functionality)
  const { data: notifications = [], isLoading, error } = useNotifications(1000)
  const markAllAsRead = useMarkAllNotificationsAsRead()

  // Set up real-time updates
  useNotificationRealtime()

  // Handle mark all as read
  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead.mutateAsync()
      toast.success('All notifications marked as read')
    } catch (error) {
      toast.error('Failed to mark all notifications as read')
    }
  }

  // Filter and sort notifications based on wireframe requirements
  const filteredNotifications = useMemo(() => {
    if (!notifications || notifications.length === 0) return []

    let filtered = [...notifications]

    // Filter by type
    if (filters.type !== 'all') {
      filtered = filtered.filter((n) => n.type === filters.type)
    }

    // Filter by status
    if (filters.status === 'unread') {
      filtered = filtered.filter((n) => !n.is_read)
    } else if (filters.status === 'read') {
      filtered = filtered.filter((n) => n.is_read)
    }

    // Filter by date range
    if (filters.dateRange !== 'all') {
      const now = new Date()
      const cutoffDate = new Date()
      if (filters.dateRange === 'last_7_days') {
        cutoffDate.setDate(now.getDate() - 7)
      } else if (filters.dateRange === 'last_30_days') {
        cutoffDate.setDate(now.getDate() - 30)
      }
      filtered = filtered.filter((n) => new Date(n.created_at) >= cutoffDate)
    }

    // Filter by search query
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase()
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(query) ||
          n.message.toLowerCase().includes(query)
      )
    }

    // Filter by priority (before sorting, per wireframe)
    if (filters.priority !== 'all') {
      filtered = filtered.filter((n) => {
        const priority = getNotificationPriority(n.type, n.created_at, n.message)
        return priority === filters.priority
      })
    }

    // Filter by deadline status
    if (filters.deadlineStatus !== 'all') {
      filtered = filtered.filter((n) => {
        const deadlineDays = extractDeadlineDays(n.message)
        if (filters.deadlineStatus === 'none') return deadlineDays === null
        if (filters.deadlineStatus === 'critical') return deadlineDays !== null && deadlineDays < 7
        if (filters.deadlineStatus === 'approaching') return deadlineDays !== null && deadlineDays >= 7 && deadlineDays <= 14
        if (filters.deadlineStatus === 'safe') return deadlineDays !== null && deadlineDays > 14
        return true
      })
    }

    // Sort per wireframe: Primary by regulatory deadline urgency, secondary by unread status, tertiary by timestamp
    filtered.sort((a, b) => {
      // Primary: Regulatory deadline urgency (per Fatima's requirements)
      const aPriority = getNotificationPriority(a.type, a.created_at, a.message)
      const bPriority = getNotificationPriority(b.type, b.created_at, b.message)

      if (aPriority !== bPriority) {
        const priorityOrder = { urgent: 0, high: 1, normal: 2 }
        return priorityOrder[aPriority] - priorityOrder[bPriority]
      }

      // Secondary: Unread status (unread first)
      if (a.is_read !== b.is_read) {
        return a.is_read ? 1 : -1
      }

      // Tertiary: Timestamp (newest first)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

    return filtered
  }, [notifications, filters])

  // Pagination - wireframe shows "Load More" button
  const paginatedNotifications = useMemo(() => {
    const start = (page - 1) * limit
    return filteredNotifications.slice(start, start + limit)
  }, [filteredNotifications, page, limit])

  const hasMore = filteredNotifications.length > page * limit

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.type,
    filters.status,
    filters.dateRange,
    filters.priority,
    filters.deadlineStatus,
    filters.searchQuery,
  ])

  return (
    <MainContent
      breadcrumbs={[
        { label: 'Home', href: '/dashboard' },
        { label: 'Notifications' },
      ]}
      title="Notifications"
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            disabled={markAllAsRead.isPending || !notifications.some((n) => !n.is_read)}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Mark all read
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSettingsOpen(true)}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={filtersOpen ? 'bg-gray-100' : ''}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {Object.values(filters).some((v) => v !== 'all' && v !== '') && (
              <span className="ml-2 rounded-full bg-blue-500 px-1.5 py-0.5 text-xs text-white">
                {Object.values(filters).filter((v) => v !== 'all' && v !== '').length}
              </span>
            )}
          </Button>
        </div>
      }
    >
      {/* Filters Panel */}
      {filtersOpen && (
        <NotificationsFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClose={() => setFiltersOpen(false)}
        />
      )}

      {/* Settings Panel */}
      {settingsOpen && (
        <NotificationsSettings
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {/* Notifications List */}
      <div className="mt-6">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2 text-sm text-gray-600">Loading notifications...</span>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800">Failed to load notifications. Please try again.</p>
          </div>
        )}

        {!isLoading && !error && (
          <NotificationsList
            notifications={paginatedNotifications}
            totalCount={filteredNotifications.length}
            onLoadMore={() => hasMore && setPage((p) => p + 1)}
            hasMore={hasMore}
          />
        )}
      </div>
    </MainContent>
  )
}

/**
 * Get notification priority based on type and message content (per Fatima's requirements)
 */
function getNotificationPriority(
  type: string,
  createdAt: string,
  message: string
): 'urgent' | 'high' | 'normal' {
  // URGENT: Deadline-critical notifications (<7 days for appeals, <3 days for approvals)
  const urgentTypes = [
    'enforcement_action_executed',
    'appeal_deadline_reminder',
    'threshold_reversion_1d',
    'enforcement_action_requires_approval',
  ]

  // Check for deadline urgency in message
  const deadlineMatch = message.match(/(\d+)\s*days?\s*remaining/i)
  if (deadlineMatch) {
    const daysRemaining = parseInt(deadlineMatch[1], 10)
    if (daysRemaining < 7) return 'urgent'
    if (daysRemaining < 14) return 'high'
  }

  // Check type
  if (urgentTypes.includes(type)) return 'urgent'

  // HIGH: Important deadlines (7-14 days remaining)
  const highTypes = [
    'enforcement_action_created',
    'appeal_submitted',
    'threshold_reversion_7d',
  ]

  if (highTypes.includes(type)) return 'high'

  // NORMAL: Standard notifications
  return 'normal'
}

/**
 * Extract deadline days from notification message
 */
function extractDeadlineDays(message: string): number | null {
  const match = message.match(/(\d+)\s*days?\s*remaining/i)
  return match ? parseInt(match[1], 10) : null
}
