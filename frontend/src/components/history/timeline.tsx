'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { format } from 'date-fns'
import {
  ChevronDown,
  ChevronRight,
  User,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Edit,
  Plus,
  Trash2,
  Eye,
  FileText,
  Send,
} from 'lucide-react'

// Task 1.1.5.21: Timeline component

export type TimelineEventType =
  | 'created'
  | 'updated'
  | 'deleted'
  | 'approved'
  | 'rejected'
  | 'submitted'
  | 'reviewed'
  | 'status_change'
  | 'comment'
  | 'view'

export interface TimelineEvent {
  id: string
  type: TimelineEventType
  title: string
  description?: string
  user: {
    id: string
    name: string
    role?: string
  }
  timestamp: string
  details?: Record<string, unknown>
  metadata?: {
    oldValue?: string
    newValue?: string
    field?: string
  }
}

const EVENT_CONFIG: Record<TimelineEventType, {
  icon: React.ElementType
  color: string
  bgColor: string
}> = {
  created: { icon: Plus, color: 'text-green-600', bgColor: 'bg-green-100' },
  updated: { icon: Edit, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  deleted: { icon: Trash2, color: 'text-red-600', bgColor: 'bg-red-100' },
  approved: { icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-100' },
  rejected: { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100' },
  submitted: { icon: Send, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  reviewed: { icon: Eye, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  status_change: { icon: AlertTriangle, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  comment: { icon: FileText, color: 'text-gray-600', bgColor: 'bg-gray-100' },
  view: { icon: Eye, color: 'text-gray-500', bgColor: 'bg-gray-50' },
}

interface TimelineItemProps {
  event: TimelineEvent
  isLast?: boolean
  expandable?: boolean
}

function TimelineItem({ event, isLast = false, expandable = true }: TimelineItemProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const config = EVENT_CONFIG[event.type] || EVENT_CONFIG.updated
  const Icon = config.icon
  const hasDetails = event.details && Object.keys(event.details).length > 0

  return (
    <div className="relative flex gap-4">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-border" />
      )}

      {/* Icon */}
      <div
        className={cn(
          'relative z-10 flex h-10 w-10 items-center justify-center rounded-full',
          config.bgColor
        )}
      >
        <Icon className={cn('h-5 w-5', config.color)} />
      </div>

      {/* Content */}
      <div className="flex-1 pb-6">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{event.title}</span>
                <Badge variant="outline" className="text-xs">
                  {event.type.replace('_', ' ')}
                </Badge>
              </div>
              {event.description && (
                <p className="text-sm text-muted-foreground">{event.description}</p>
              )}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {event.user.name}
                  {event.user.role && ` (${event.user.role})`}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(event.timestamp), 'MMM d, yyyy')}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {format(new Date(event.timestamp), 'HH:mm')}
                </span>
              </div>
            </div>

            {expandable && hasDetails && (
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            )}
          </div>

          {hasDetails && (
            <CollapsibleContent className="mt-3">
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  {event.metadata && (
                    <div className="space-y-2 mb-3">
                      {event.metadata.field && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Field: </span>
                          <span className="font-medium">{event.metadata.field}</span>
                        </div>
                      )}
                      {event.metadata.oldValue && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Previous: </span>
                          <span className="line-through text-red-600">
                            {event.metadata.oldValue}
                          </span>
                        </div>
                      )}
                      {event.metadata.newValue && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">New: </span>
                          <span className="text-green-600">{event.metadata.newValue}</span>
                        </div>
                      )}
                    </div>
                  )}
                  {event.details && (
                    <pre className="text-xs overflow-auto max-h-40">
                      {JSON.stringify(event.details, null, 2)}
                    </pre>
                  )}
                </CardContent>
              </Card>
            </CollapsibleContent>
          )}
        </Collapsible>
      </div>
    </div>
  )
}

interface TimelineProps {
  events: TimelineEvent[]
  loading?: boolean
  emptyMessage?: string
  className?: string
  expandable?: boolean
}

export function Timeline({
  events,
  loading,
  emptyMessage = 'No history available',
  className,
  expandable = true,
}: TimelineProps) {
  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 animate-pulse">
            <div className="h-10 w-10 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 bg-muted rounded" />
              <div className="h-3 w-32 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className={cn('text-center py-8 text-muted-foreground', className)}>
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className={className}>
      {events.map((event, index) => (
        <TimelineItem
          key={event.id}
          event={event}
          isLast={index === events.length - 1}
          expandable={expandable}
        />
      ))}
    </div>
  )
}

// Compact timeline for sidebars
export function CompactTimeline({ events, limit = 5 }: { events: TimelineEvent[]; limit?: number }) {
  const displayEvents = events.slice(0, limit)
  const remaining = events.length - limit

  return (
    <div className="space-y-3">
      {displayEvents.map((event) => {
        const config = EVENT_CONFIG[event.type] || EVENT_CONFIG.updated
        const Icon = config.icon

        return (
          <div key={event.id} className="flex items-start gap-3">
            <div className={cn('p-1.5 rounded', config.bgColor)}>
              <Icon className={cn('h-3 w-3', config.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{event.title}</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(event.timestamp), 'MMM d, HH:mm')}
              </p>
            </div>
          </div>
        )
      })}
      {remaining > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          +{remaining} more event{remaining > 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}
