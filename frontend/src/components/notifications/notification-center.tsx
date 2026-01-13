'use client'

import { useState } from 'react'
import { Bell, Check, CheckCheck, ExternalLink, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useNotifications } from '@/hooks/use-notifications'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

// Task 1.1.1.16a: NotificationCenter component
// Task 1.1.1.16b: NotificationItem component
// Task 1.1.1.16c: Notification badge

export function NotificationCenter() {
  const [open, setOpen] = useState(false)
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h4 className="font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllAsRead()}
              className="text-xs"
            >
              <CheckCheck className="h-4 w-4 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-80">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Bell className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">No notifications</span>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={() => markAsRead(notification.id)}
                  onClose={() => setOpen(false)}
                />
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="border-t px-4 py-2">
          <Link
            href="/dashboard/notifications"
            className="text-sm text-primary hover:underline flex items-center justify-center"
            onClick={() => setOpen(false)}
          >
            View all notifications
            <ExternalLink className="h-3 w-3 ml-1" />
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface NotificationItemProps {
  notification: {
    id: string
    type: string
    title: string
    message: string
    link: string | null
    is_read: boolean
    created_at: string
  }
  onMarkAsRead: () => void
  onClose: () => void
}

function NotificationItem({ notification, onMarkAsRead, onClose }: NotificationItemProps) {
  const typeIcons: Record<string, string> = {
    new_message: '💬',
    announcement: '📢',
    breach: '⚠️',
    submission: '📄',
    approval: '✅',
    follow_up: '📌',
    meeting: '📅',
    default: '🔔',
  }

  const icon = typeIcons[notification.type] || typeIcons.default

  const handleClick = () => {
    if (!notification.is_read) {
      onMarkAsRead()
    }
    onClose()
  }

  const content = (
    <div
      className={cn(
        'flex gap-3 px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors',
        !notification.is_read && 'bg-primary/5'
      )}
    >
      <div className="text-lg">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn('text-sm font-medium', !notification.is_read && 'font-semibold')}>
            {notification.title}
          </p>
          {!notification.is_read && (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 shrink-0"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onMarkAsRead()
              }}
            >
              <Check className="h-3 w-3" />
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">{notification.message}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
        </p>
      </div>
    </div>
  )

  if (notification.link) {
    return (
      <Link href={notification.link} onClick={handleClick}>
        {content}
      </Link>
    )
  }

  return <div onClick={handleClick}>{content}</div>
}

// Standalone notification badge for use in other places
export function NotificationBadge() {
  const { unreadCount } = useNotifications()

  if (unreadCount === 0) return null

  return (
    <Badge variant="destructive" className="ml-2">
      {unreadCount > 99 ? '99+' : unreadCount}
    </Badge>
  )
}
