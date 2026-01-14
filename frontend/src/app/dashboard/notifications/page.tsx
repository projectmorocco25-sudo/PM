'use client'

import { useState, useMemo } from 'react'
import { formatDistanceToNow, isToday, isYesterday, format } from 'date-fns'
import { Bell, Check, CheckCheck, Filter, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useNotifications } from '@/hooks/use-notifications'
import { NoNotifications } from '@/components/ui/empty-states'
import { Spinner } from '@/components/ui/loading'
import { cn } from '@/lib/utils'
import Link from 'next/link'

// Task: Enhanced notifications page with grouping and categories

interface NotificationItem {
  id: string
  type: string
  title: string
  message: string
  link: string | null
  is_read: boolean
  created_at: string
}

export default function NotificationsPage() {
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications()
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [category, setCategory] = useState<'all' | 'messages' | 'system' | 'workflow'>('all')

  // Categorize notifications
  const getCategoryForType = (type: string): 'messages' | 'system' | 'workflow' => {
    if (type === 'new_message' || type === 'announcement') return 'messages'
    if (type === 'approval' || type === 'submission' || type === 'follow_up') return 'workflow'
    return 'system'
  }

  // Filter notifications
  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread' && n.is_read) return false
    if (category !== 'all' && getCategoryForType(n.type) !== category) return false
    return true
  })

  // Group by date
  const groupedNotifications = useMemo(() => {
    const groups: { label: string; notifications: NotificationItem[] }[] = []
    const dateGroups: Record<string, NotificationItem[]> = {}

    filteredNotifications.forEach((n) => {
      const date = new Date(n.created_at)
      let label: string
      
      if (isToday(date)) {
        label = 'Today'
      } else if (isYesterday(date)) {
        label = 'Yesterday'
      } else {
        label = format(date, 'MMMM d, yyyy')
      }

      if (!dateGroups[label]) {
        dateGroups[label] = []
      }
      dateGroups[label].push(n)
    })

    // Convert to array maintaining order
    Object.entries(dateGroups).forEach(([label, items]) => {
      groups.push({ label, notifications: items })
    })

    return groups
  }, [filteredNotifications])

  // Count by category
  const categoryCounts = useMemo(() => {
    const counts = { messages: 0, system: 0, workflow: 0 }
    notifications.filter(n => !n.is_read).forEach((n) => {
      const cat = getCategoryForType(n.type)
      counts[cat]++
    })
    return counts
  }, [notifications])

  const typeIcons: Record<string, string> = {
    new_message: '💬',
    announcement: '📢',
    breach: '⚠️',
    submission: '📄',
    approval: '✅',
    follow_up: '📌',
    meeting: '📅',
    system: '⚙️',
    default: '🔔',
  }

  const typeColors: Record<string, string> = {
    breach: 'border-l-red-500',
    follow_up: 'border-l-amber-500',
    approval: 'border-l-green-500',
    meeting: 'border-l-blue-500',
    default: 'border-l-transparent',
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={(v) => setFilter(v as 'all' | 'unread')}>
            <SelectTrigger className="w-32">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
            </SelectContent>
          </Select>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={() => markAllAsRead()}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark all read
            </Button>
          )}
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/profile">
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={category} onValueChange={(v) => setCategory(v as typeof category)}>
        <TabsList>
          <TabsTrigger value="all">
            All
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="messages">
            Messages
            {categoryCounts.messages > 0 && (
              <Badge variant="secondary" className="ml-2">
                {categoryCounts.messages}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="workflow">
            Workflow
            {categoryCounts.workflow > 0 && (
              <Badge variant="secondary" className="ml-2">
                {categoryCounts.workflow}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="system">
            System
            {categoryCounts.system > 0 && (
              <Badge variant="secondary" className="ml-2">
                {categoryCounts.system}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={category} className="mt-4">
          {groupedNotifications.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <NoNotifications />
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {groupedNotifications.map((group) => (
                <div key={group.label}>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {group.label}
                  </h3>
                  <Card>
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {group.notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={cn(
                              'flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors border-l-4',
                              typeColors[notification.type] || typeColors.default,
                              !notification.is_read && 'bg-primary/5'
                            )}
                          >
                            <div className="text-2xl">
                              {typeIcons[notification.type] || typeIcons.default}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className={cn('font-medium', !notification.is_read && 'font-semibold')}>
                                      {notification.title}
                                    </p>
                                    {!notification.is_read && (
                                      <span className="h-2 w-2 rounded-full bg-primary" />
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {!notification.is_read && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => markAsRead(notification.id)}
                                      title="Mark as read"
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                  )}
                                  {notification.link && (
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      asChild
                                      onClick={() => !notification.is_read && markAsRead(notification.id)}
                                    >
                                      <Link href={notification.link}>View</Link>
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
