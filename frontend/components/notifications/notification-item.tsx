/**
 * Wireframe: task-0.5.1.17-notification-center-component.md
 * Implements: NotificationItem component (notification types, icons, read/unread states)
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.17-notification-center-component.md
 */

'use client'

import { formatDistanceToNow } from 'date-fns'
import { FileText, AlertTriangle, MessageSquare, CheckCircle, Shield, Info, DollarSign, Ban, Scale } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Notification } from '@/lib/hooks/use-notifications'
import Link from 'next/link'

interface NotificationItemProps {
  notification: Notification
  onClick?: () => void
}

function getNotificationIcon(type: string) {
  // Map notification types to icons
  const iconMap: Record<string, React.ElementType> = {
    submission_status: FileText,
    submission_approved: FileText,
    submission_rejected: FileText,
    breach_alert: AlertTriangle,
    threshold_exceeded: AlertTriangle,
    critical_breach: AlertTriangle,
    new_message: MessageSquare,
    message_reply: MessageSquare,
    approval_required: CheckCircle,
    workflow_action_required: CheckCircle,
    workflow_completed: CheckCircle,
    enforcement_warning: AlertTriangle,
    enforcement_fine: DollarSign,
    enforcement_suspension: Ban,
    enforcement_appeal: Scale,
    threshold_reversion_7d: Info,
    threshold_reversion_review: Info,
    system_maintenance: Info,
    feature_update: Info,
    policy_change: Info,
  }
  
  return iconMap[type] || Info
}

function getNotificationIconColor(type: string, isRead: boolean) {
  if (isRead) return 'text-gray-400'
  
  // Color coding based on notification type
  if (type.includes('breach') || type.includes('critical')) return 'text-orange-500'
  if (type.includes('enforcement') && type.includes('warning')) return 'text-orange-500'
  if (type.includes('enforcement') && type.includes('fine')) return 'text-red-500'
  if (type.includes('enforcement') && type.includes('suspension')) return 'text-red-500'
  if (type.includes('submission') && type.includes('approved')) return 'text-green-500'
  if (type.includes('workflow') && type.includes('completed')) return 'text-green-500'
  if (type.includes('submission') && type.includes('rejected')) return 'text-red-500'
  if (type.includes('message')) return 'text-blue-500'
  
  return 'text-blue-500'
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const Icon = getNotificationIcon(notification.type)
  const iconColor = getNotificationIconColor(notification.type, notification.is_read)
  
  const timeAgo = formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })
  
  const content = (
    <div
      className={cn(
        'relative flex min-h-[64px] items-start gap-3 px-4 py-3 transition-colors',
        !notification.is_read && 'bg-gray-50',
        'hover:bg-gray-100 cursor-pointer'
      )}
      style={{
        minHeight: '64px',
        padding: '12px 16px',
        ...(!notification.is_read && {
          borderLeft: '3px solid #3b82f6',
          paddingLeft: '13px', // 16px - 3px border
        }),
      }}
      onClick={onClick}
    >
      {/* Unread Indicator - 3px left border (handled via style above) */}
      
      {/* Icon */}
      <Icon className={cn('mt-0.5 h-5 w-5 flex-shrink-0', iconColor)} style={{ width: '20px', height: '20px' }} />
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Title */}
        <div
          className={cn(
            'text-sm font-medium',
            notification.is_read ? 'text-gray-600 font-normal' : 'text-gray-900 font-semibold'
          )}
          style={{ fontSize: '14px', fontWeight: notification.is_read ? 400 : 600 }}
        >
          {notification.title}
        </div>
        
        {/* Message - 2-3 lines max, truncate */}
        <div
          className="mt-1 text-sm text-gray-600 line-clamp-2"
          style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}
        >
          {notification.message}
        </div>
        
        {/* Timestamp */}
        <div
          className="mt-2 text-xs text-gray-400"
          style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}
        >
          {timeAgo}
        </div>
      </div>
    </div>
  )
  
  // If notification has a link, wrap in Link component
  if (notification.link) {
    return (
      <Link href={notification.link} className="block border-b border-gray-200 last:border-b-0">
        {content}
      </Link>
    )
  }
  
  return <div className="border-b border-gray-200 last:border-b-0">{content}</div>
}
