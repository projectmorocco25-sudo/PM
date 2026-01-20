/**
 * Wireframe: task-0.5.1.31-notifications-page.md
 * Implements: Notification list item with priority indicators, unread indicators, and regulatory compliance features
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.31-notifications-page.md
 */

'use client'

import { formatDistanceToNow } from 'date-fns'
import {
  FileText,
  AlertTriangle,
  MessageSquare,
  CheckCircle,
  Shield,
  Info,
  DollarSign,
  Ban,
  Scale,
  Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Notification } from '@/lib/hooks/use-notifications'
import { Button } from '@/components/ui/button'
import { useMarkNotificationAsRead } from '@/lib/hooks/use-notifications'

interface NotificationListItemProps {
  notification: Notification
  onClick?: () => void
}

function getNotificationIcon(type: string) {
  const iconMap: Record<string, React.ElementType> = {
    submission_status: FileText,
    submission_approved: CheckCircle,
    submission_rejected: AlertTriangle,
    breach_alert: AlertTriangle,
    threshold_exceeded: AlertTriangle,
    critical_breach: AlertTriangle,
    new_message: MessageSquare,
    message_reply: MessageSquare,
    approval_required: CheckCircle,
    workflow_action_required: Clock,
    workflow_completed: CheckCircle,
    enforcement_warning: AlertTriangle,
    enforcement_fine: DollarSign,
    enforcement_suspension: Ban,
    enforcement_appeal: Scale,
    enforcement_action_executed: Shield,
    enforcement_action_created: Shield,
    enforcement_action_requires_approval: Shield,
    appeal_submitted: Scale,
    appeal_requires_review: Scale,
    appeal_status_update: Scale,
    appeal_deadline_reminder: AlertTriangle,
    threshold_reversion_7d: Info,
    threshold_reversion_1d: AlertTriangle,
    threshold_reversion_completed: CheckCircle,
    threshold_reversion_review_required: Clock,
    system_maintenance: Info,
    feature_update: Info,
    policy_change: Info,
  }

  return iconMap[type] || Info
}

function getNotificationIconColor(type: string, isRead: boolean) {
  if (isRead) return 'text-gray-400'

  // Wireframe color coding
  if (type.includes('submission') && type.includes('approved')) return 'text-green-500' // #22c55e
  if (type.includes('submission') && type.includes('rejected')) return 'text-red-500' // #ef4444
  if (type.includes('breach') || type.includes('critical')) return 'text-orange-500' // #f59e0b
  if (type.includes('enforcement')) return 'text-red-500' // #ef4444
  if (type.includes('message')) return 'text-green-500' // #22c55e
  if (type.includes('appeal')) return 'text-purple-500' // #8b5cf6
  if (type.includes('submission')) return 'text-blue-500' // #3b82f6

  return 'text-blue-500' // Default: #3b82f6
}

function getNotificationPriority(
  type: string,
  createdAt: string,
  message: string
): 'urgent' | 'high' | 'normal' {
  // URGENT: Deadline-critical (<7 days for appeals, <3 days for approvals)
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

  if (urgentTypes.includes(type)) return 'urgent'

  // HIGH: Important deadlines (7-14 days remaining)
  const highTypes = [
    'enforcement_action_created',
    'appeal_submitted',
    'threshold_reversion_7d',
  ]

  if (highTypes.includes(type)) return 'high'

  return 'normal'
}

function parseNotificationMessage(message: string): {
  hasUrgentMarker: boolean
  hasHighMarker: boolean
  sections: string[]
} {
  const hasUrgentMarker = message.includes('🔴 URGENT') || message.includes('URGENT')
  const hasHighMarker = message.includes('🟡') || message.includes('HIGH')
  
  // Split message into sections for better formatting
  const sections = message.split('\n').filter((s) => s.trim())

  return { hasUrgentMarker, hasHighMarker, sections }
}

export function NotificationListItem({
  notification,
  onClick,
}: NotificationListItemProps) {
  const markAsRead = useMarkNotificationAsRead()
  const Icon = getNotificationIcon(notification.type)
  const iconColor = getNotificationIconColor(notification.type, notification.is_read)
  const priority = getNotificationPriority(
    notification.type,
    notification.created_at,
    notification.message
  )
  const { hasUrgentMarker, hasHighMarker, sections } = parseNotificationMessage(
    notification.message
  )
  const timeAgo = formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })

  const handleMarkRead = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!notification.is_read) {
      markAsRead.mutate(notification.id)
    }
  }

  // Determine border color based on priority (per Fatima's requirements)
  const borderColor =
    priority === 'urgent' || hasUrgentMarker
      ? '#ef4444' // Red border for URGENT
      : priority === 'high' || hasHighMarker
      ? '#f59e0b' // Yellow border for HIGH
      : notification.is_read
      ? 'transparent'
      : '#3b82f6' // Blue border for unread normal

  return (
    <div
      className={cn(
        'relative flex min-h-[64px] items-start gap-3 px-4 py-3 transition-colors',
        !notification.is_read && 'bg-blue-50', // Unread background: #eff6ff
        'hover:bg-gray-50 cursor-pointer' // Hover: #f9fafb
      )}
      style={{
        minHeight: '64px', // Wireframe: min 64px (touch target)
        padding: '12px 16px', // Wireframe: 16px horizontal, 12px vertical
        backgroundColor: !notification.is_read ? '#eff6ff' : '#ffffff',
        transition: 'background-color 150ms ease-in-out',
        borderLeft: priority === 'urgent' || hasUrgentMarker
          ? '3px solid #ef4444' // Red border for URGENT
          : priority === 'high' || hasHighMarker
          ? '3px solid #f59e0b' // Yellow border for HIGH
          : !notification.is_read
          ? '3px solid #3b82f6' // Blue border for unread
          : 'none',
        paddingLeft:
          (priority === 'urgent' || hasUrgentMarker || priority === 'high' || hasHighMarker || !notification.is_read)
            ? '13px' // 16px - 3px border
            : '16px',
      }}
      onClick={onClick}
      role="listitem"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
      aria-label={`${notification.title}. ${notification.message}. ${timeAgo}. ${notification.is_read ? 'Read' : 'Unread'}`}
    >
      {/* Unread Indicator - Blue dot (●) for unread, Gray circle (○) or none for read */}
      {!notification.is_read && (
        <div
          className="absolute left-4 top-6 h-2 w-2 rounded-full"
          style={{
            left: '16px',
            top: '24px',
            width: '8px',
            height: '8px',
            backgroundColor: '#3b82f6', // Blue dot for unread
          }}
          aria-hidden="true"
        />
      )}

      {/* Icon */}
      <div
        className="mt-0.5 flex-shrink-0"
        style={{ marginTop: '2px' }}
      >
        <Icon
          className={cn('h-5 w-5', iconColor)}
          style={{ width: '20px', height: '20px' }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Title with Priority Marker */}
        <div
          className={cn(
            'text-sm font-medium flex items-center gap-2',
            notification.is_read ? 'text-gray-600 font-normal' : 'text-gray-900 font-semibold'
          )}
          style={{
            fontSize: '14px',
            fontWeight: notification.is_read ? 400 : 600,
            color: notification.is_read ? '#6b7280' : '#111827',
            lineHeight: 1.5,
          }}
        >
          {hasUrgentMarker && <span>🔴</span>}
          {hasHighMarker && !hasUrgentMarker && <span>🟡</span>}
          <span>{notification.title}</span>
        </div>

        {/* Message - Support multi-line formatting */}
        <div
          className="mt-1 text-sm text-gray-600"
          style={{
            fontSize: '14px',
            color: '#6b7280',
            marginTop: '4px',
            lineHeight: 1.5,
          }}
        >
          {sections.length > 1 ? (
            sections.map((section, idx) => (
              <div key={idx} className={idx > 0 ? 'mt-1' : ''}>
                {section}
              </div>
            ))
          ) : (
            <div>{notification.message}</div>
          )}
        </div>

        {/* Timestamp */}
        <div
          className="mt-2 text-xs text-gray-400"
          style={{
            fontSize: '12px',
            color: '#9ca3af',
            marginTop: '8px',
          }}
        >
          {timeAgo}
        </div>
      </div>

      {/* Mark Read Button */}
      <div className="flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleMarkRead}
          disabled={notification.is_read || markAsRead.isPending}
          className="h-8 min-w-[80px] text-xs"
          style={{
            height: '32px',
            minWidth: '80px',
            fontSize: '12px',
          }}
          aria-label={notification.is_read ? 'Already read' : 'Mark as read'}
        >
          {notification.is_read ? 'Read' : 'Mark read'}
        </Button>
      </div>
    </div>
  )
}
