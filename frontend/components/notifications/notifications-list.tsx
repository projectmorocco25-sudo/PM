/**
 * Wireframe: task-0.5.1.31-notifications-page.md
 * Implements: Notification list with priority indicators and regulatory compliance features
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.31-notifications-page.md
 */

'use client'

import { useRouter } from 'next/navigation'
import { Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NotificationListItem } from './notification-list-item'
import { useMarkNotificationAsRead } from '@/lib/hooks/use-notifications'
import type { Notification } from '@/lib/hooks/use-notifications'

interface NotificationsListProps {
  notifications: Notification[]
  totalCount: number
  onLoadMore: () => void
  hasMore: boolean
}

export function NotificationsList({
  notifications,
  totalCount,
  onLoadMore,
  hasMore,
}: NotificationsListProps) {
  const router = useRouter()
  const markAsRead = useMarkNotificationAsRead()

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read when clicked
    if (!notification.is_read) {
      markAsRead.mutate(notification.id)
    }

    // Navigate to related page per wireframe annotations
    if (notification.link) {
      router.push(notification.link)
    }
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <Inbox className="h-16 w-16 text-gray-400" style={{ width: '64px', height: '64px', color: '#9ca3af' }} />
        <p className="mt-4 text-base font-medium text-gray-600" style={{ fontSize: '16px', color: '#6b7280', marginTop: '16px' }}>
          No notifications
        </p>
        <p className="mt-1 text-sm text-gray-500" style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
          {totalCount === 0 ? "You're all caught up!" : 'No notifications match your filters'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-0">
      {/* ARIA Live Region for new notifications */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {notifications.filter((n) => !n.is_read).length > 0 && (
          <span>{notifications.filter((n) => !n.is_read).length} unread notifications</span>
        )}
      </div>

      {/* Notifications List */}
      <div
        className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white"
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          backgroundColor: '#ffffff',
        }}
        role="list"
        aria-label="Notifications list"
      >
        {notifications.map((notification) => (
          <NotificationListItem
            key={notification.id}
            notification={notification}
            onClick={() => handleNotificationClick(notification)}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            onClick={onLoadMore}
            className="min-w-[120px]"
            style={{
              minWidth: '120px',
              height: '40px', // Touch target minimum
            }}
          >
            Load More
          </Button>
        </div>
      )}

      {/* Results Count */}
      <div className="mt-4 text-center text-sm text-gray-500">
        Showing {notifications.length} of {totalCount} notifications
      </div>
    </div>
  )
}
