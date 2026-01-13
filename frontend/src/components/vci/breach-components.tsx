'use client'

import * as React from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Breach, BreachStatus, BreachPriority } from '@/hooks/use-vci'
import { cn } from '@/lib/utils'
import {
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingDown,
  Calendar,
} from 'lucide-react'
import { format } from 'date-fns'

// Task 1.1.5.16a: BreachFilters component (implemented in page)
// Task 1.1.5.17a: BreachDetailCard component

// Status configuration
const STATUS_CONFIG: Record<BreachStatus, {
  label: string
  icon: React.ElementType
  variant: 'default' | 'secondary' | 'destructive' | 'outline'
  color: string
}> = {
  detected: {
    label: 'Detected',
    icon: AlertOctagon,
    variant: 'destructive',
    color: 'text-red-600',
  },
  tier2_analyzing: {
    label: 'Analyzing',
    icon: Clock,
    variant: 'secondary',
    color: 'text-yellow-600',
  },
  tier2_suggested: {
    label: 'Awaiting Approval',
    icon: Clock,
    variant: 'default',
    color: 'text-blue-600',
  },
  tier1_reviewed: {
    label: 'Reviewed',
    icon: CheckCircle2,
    variant: 'secondary',
    color: 'text-green-600',
  },
  action_taken: {
    label: 'Action Taken',
    icon: CheckCircle2,
    variant: 'default',
    color: 'text-green-600',
  },
  completed: {
    label: 'Completed',
    icon: CheckCircle2,
    variant: 'outline',
    color: 'text-muted-foreground',
  },
}

const PRIORITY_CONFIG: Record<BreachPriority, {
  label: string
  variant: 'default' | 'secondary' | 'destructive' | 'outline'
  color: string
}> = {
  critical: {
    label: 'Critical',
    variant: 'destructive',
    color: 'bg-red-100 text-red-800',
  },
  high: {
    label: 'High',
    variant: 'default',
    color: 'bg-orange-100 text-orange-800',
  },
  standard: {
    label: 'Standard',
    variant: 'secondary',
    color: 'bg-gray-100 text-gray-800',
  },
}

// Status Badge
export function BreachStatusBadge({ status }: { status: BreachStatus }) {
  const config = STATUS_CONFIG[status]
  const Icon = config.icon
  return (
    <Badge variant={config.variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  )
}

// Priority Badge
export function BreachPriorityBadge({ priority }: { priority: BreachPriority }) {
  const config = PRIORITY_CONFIG[priority]
  return (
    <Badge variant={config.variant}>
      {priority === 'critical' && <AlertOctagon className="h-3 w-3 mr-1" />}
      {config.label}
    </Badge>
  )
}

// Task 1.1.5.17a: BreachDetailCard component
interface BreachDetailCardProps {
  breach: Breach
  className?: string
}

export function BreachDetailCard({ breach, className }: BreachDetailCardProps) {
  const shortagePercent = breach.shortage_percent || 
    (breach.threshold_value > 0 
      ? Math.round((1 - breach.stock_level / breach.threshold_value) * 100)
      : 0)
  
  const stockPercent = breach.threshold_value > 0 
    ? Math.round((breach.stock_level / breach.threshold_value) * 100) 
    : 0

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-destructive" />
            Stock Level Analysis
          </CardTitle>
          <div className="flex gap-2">
            <BreachPriorityBadge priority={breach.priority} />
            <BreachStatusBadge status={breach.status} />
          </div>
        </div>
        <CardDescription>
          {breach.sku_name} - {breach.company_name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stock vs Threshold Visualization */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Stock Level vs Threshold</span>
            <span className="font-medium">{stockPercent}%</span>
          </div>
          <Progress value={stockPercent} className="h-4" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span className="text-destructive font-medium">
              Threshold: {breach.threshold_value.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border p-4 text-center">
            <div className="text-sm text-muted-foreground">Current Stock</div>
            <div className="text-2xl font-bold text-destructive">
              {breach.stock_level.toLocaleString()}
            </div>
          </div>
          <div className="rounded-lg border p-4 text-center">
            <div className="text-sm text-muted-foreground">Required Threshold</div>
            <div className="text-2xl font-bold">
              {breach.threshold_value.toLocaleString()}
            </div>
          </div>
          <div className="rounded-lg border p-4 text-center">
            <div className="text-sm text-muted-foreground">Shortage</div>
            <div className="text-2xl font-bold text-orange-600">
              {shortagePercent}%
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Breach Date</div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {format(new Date(breach.breach_date), 'PPP')}
            </div>
          </div>
          {breach.replenishment_date && (
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Expected Replenishment</div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {format(new Date(breach.replenishment_date), 'PPP')}
              </div>
            </div>
          )}
        </div>

        {/* Breach Reason */}
        {breach.breach_reason && (
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Breach Reason</div>
            <div className="p-3 rounded-md bg-muted">
              {breach.breach_reason}
            </div>
          </div>
        )}

        {/* Critical Medicine Indicator */}
        {breach.is_critical_medicine && (
          <div className="flex items-center gap-2 p-3 rounded-md bg-red-50 text-red-800">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">Critical Medicine - Requires immediate attention</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Compact breach card for lists
export function BreachCard({ breach, onClick }: { breach: Breach; onClick?: () => void }) {
  const shortagePercent = breach.shortage_percent || 
    (breach.threshold_value > 0 
      ? Math.round((1 - breach.stock_level / breach.threshold_value) * 100)
      : 0)

  return (
    <div
      className={cn(
        'p-4 rounded-lg border space-y-3',
        onClick && 'cursor-pointer hover:bg-muted/50 transition-colors'
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="font-medium">{breach.sku_name}</div>
          <div className="text-sm text-muted-foreground">{breach.company_name}</div>
        </div>
        <BreachPriorityBadge priority={breach.priority} />
      </div>
      <div className="flex items-center gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Stock:</span>{' '}
          <span className="font-mono">{breach.stock_level.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Threshold:</span>{' '}
          <span className="font-mono">{breach.threshold_value.toLocaleString()}</span>
        </div>
        <div className="text-destructive font-medium">-{shortagePercent}%</div>
      </div>
      <div className="flex items-center justify-between">
        <BreachStatusBadge status={breach.status} />
        <span className="text-xs text-muted-foreground">
          {format(new Date(breach.breach_date), 'MMM d, yyyy')}
        </span>
      </div>
    </div>
  )
}
