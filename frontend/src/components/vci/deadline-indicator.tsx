'use client'

import * as React from 'react'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import {
  getAAMSDeadline,
  getAAMSGracePeriodEnd,
  getDaysUntilDeadline,
  isWithinSubmissionWindow,
  isWithinGracePeriod,
} from '@/hooks/use-vci'
import { format, differenceInDays } from 'date-fns'
import { Clock, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'

// Task 1.1.3.13d: Deadline indicators

interface DeadlineIndicatorProps {
  year: number
  variant?: 'badge' | 'alert' | 'compact'
  className?: string
}

export function DeadlineIndicator({ year, variant = 'badge', className }: DeadlineIndicatorProps) {
  const now = new Date()
  const deadline = getAAMSDeadline(year)
  const graceEnd = getAAMSGracePeriodEnd(year)
  const daysUntil = getDaysUntilDeadline(year)
  const withinWindow = isWithinSubmissionWindow(year)
  const withinGrace = isWithinGracePeriod(year)
  const isPastGrace = now > graceEnd

  // Determine status
  let status: 'ok' | 'warning' | 'urgent' | 'grace' | 'overdue'
  if (withinWindow) {
    if (daysUntil > 14) {
      status = 'ok'
    } else if (daysUntil > 7) {
      status = 'warning'
    } else {
      status = 'urgent'
    }
  } else if (withinGrace) {
    status = 'grace'
  } else {
    status = 'overdue'
  }

  const statusConfig = {
    ok: {
      label: `${daysUntil} days until deadline`,
      variant: 'secondary' as const,
      icon: Clock,
      color: 'text-muted-foreground',
    },
    warning: {
      label: `${daysUntil} days left`,
      variant: 'secondary' as const,
      icon: Clock,
      color: 'text-yellow-600',
    },
    urgent: {
      label: `Only ${daysUntil} days left!`,
      variant: 'destructive' as const,
      icon: AlertTriangle,
      color: 'text-red-600',
    },
    grace: {
      label: 'Grace period',
      variant: 'secondary' as const,
      icon: AlertTriangle,
      color: 'text-orange-600',
    },
    overdue: {
      label: 'Overdue',
      variant: 'destructive' as const,
      icon: XCircle,
      color: 'text-red-600',
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  if (variant === 'badge') {
    return (
      <Badge variant={config.variant} className={cn('flex items-center gap-1', className)}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-2 text-sm', config.color, className)}>
        <Icon className="h-4 w-4" />
        <span>{config.label}</span>
      </div>
    )
  }

  // Alert variant
  return (
    <Alert
      variant={status === 'urgent' || status === 'overdue' ? 'destructive' : 'default'}
      className={className}
    >
      <Icon className="h-4 w-4" />
      <AlertTitle>
        {status === 'overdue' ? 'Submission Overdue' : `AAMS ${year} Deadline`}
      </AlertTitle>
      <AlertDescription>
        {withinWindow ? (
          <>
            Submit your AAMS by <strong>{format(deadline, 'MMMM d, yyyy')}</strong>.
            {daysUntil <= 7 && (
              <span className="block mt-1 font-medium">
                Only {daysUntil} day{daysUntil !== 1 ? 's' : ''} remaining!
              </span>
            )}
          </>
        ) : withinGrace ? (
          <>
            The deadline has passed. You are in the grace period until{' '}
            <strong>{format(graceEnd, 'MMMM d, yyyy')}</strong>.
            Submissions will be marked as late.
          </>
        ) : (
          <>
            The deadline and grace period have passed. Your submission will be marked as
            non-compliant. Previous year's AAMS will be used as fallback.
          </>
        )}
      </AlertDescription>
    </Alert>
  )
}

interface DeadlineProgressProps {
  year: number
  className?: string
}

export function DeadlineProgress({ year, className }: DeadlineProgressProps) {
  const now = new Date()
  const startOfYear = new Date(year, 0, 1)
  const deadline = getAAMSDeadline(year)
  
  const totalDays = differenceInDays(deadline, startOfYear)
  const daysPassed = differenceInDays(now, startOfYear)
  const progress = Math.min(100, Math.max(0, (daysPassed / totalDays) * 100))
  
  const daysRemaining = Math.max(0, differenceInDays(deadline, now))

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Progress to deadline</span>
        <span className="font-medium">
          {daysRemaining > 0 ? `${daysRemaining} days left` : 'Past deadline'}
        </span>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Jan 1, {year}</span>
        <span>Jan 31, {year}</span>
      </div>
    </div>
  )
}
