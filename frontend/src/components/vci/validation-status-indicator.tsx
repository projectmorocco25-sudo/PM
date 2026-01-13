'use client'

import * as React from 'react'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ValidationFlag, MSQStatus } from '@/hooks/use-vci'
import { cn } from '@/lib/utils'
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Flag,
  Info,
  AlertOctagon,
} from 'lucide-react'

// Task 1.1.4.10a: ValidationStatusIndicator component

interface ValidationStatusIndicatorProps {
  status: MSQStatus
  flags?: ValidationFlag[]
  variant?: 'badge' | 'detailed' | 'compact'
  className?: string
}

const STATUS_CONFIG: Record<MSQStatus, {
  label: string
  icon: React.ElementType
  variant: 'default' | 'secondary' | 'destructive' | 'outline'
  color: string
}> = {
  submitted: {
    label: 'Submitted',
    icon: CheckCircle2,
    variant: 'secondary',
    color: 'text-blue-600',
  },
  flagged_for_review: {
    label: 'Flagged for Review',
    icon: Flag,
    variant: 'default',
    color: 'text-orange-600',
  },
  accepted: {
    label: 'Accepted',
    icon: CheckCircle2,
    variant: 'default',
    color: 'text-green-600',
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    variant: 'destructive',
    color: 'text-red-600',
  },
}

export function ValidationStatusIndicator({
  status,
  flags = [],
  variant = 'badge',
  className,
}: ValidationStatusIndicatorProps) {
  const config = STATUS_CONFIG[status]
  const Icon = config.icon

  // Categorize flags
  const errors = flags.filter((f) => f.type === 'error')
  const warnings = flags.filter((f) => f.type === 'warning')
  const anomalies = flags.filter((f) => f.type === 'anomaly')
  const infos = flags.filter((f) => f.type === 'info')
  const manualFlags = flags.filter((f) => f.type === 'manual_flag')

  if (variant === 'badge') {
    return (
      <Badge variant={config.variant} className={cn('gap-1', className)}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-2', config.color, className)}>
        <Icon className="h-4 w-4" />
        <span className="font-medium">{config.label}</span>
        {anomalies.length > 0 && (
          <Badge variant="outline" className="text-xs">
            {anomalies.length} anomal{anomalies.length === 1 ? 'y' : 'ies'}
          </Badge>
        )}
      </div>
    )
  }

  // Detailed variant
  return (
    <div className={cn('space-y-4', className)}>
      {/* Status Header */}
      <div className={cn('flex items-center gap-3', config.color)}>
        <Icon className="h-6 w-6" />
        <div>
          <div className="font-semibold text-lg">{config.label}</div>
          {flags.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {flags.length} validation flag{flags.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Validation Flags */}
      {flags.length > 0 && (
        <Accordion type="multiple" className="w-full">
          {/* Errors */}
          {errors.length > 0 && (
            <AccordionItem value="errors">
              <AccordionTrigger className="text-destructive">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Errors ({errors.length})
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {errors.map((flag, index) => (
                    <Alert key={index} variant="destructive">
                      <AlertDescription>{flag.message}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Anomalies */}
          {anomalies.length > 0 && (
            <AccordionItem value="anomalies">
              <AccordionTrigger className="text-orange-600">
                <div className="flex items-center gap-2">
                  <AlertOctagon className="h-4 w-4" />
                  Anomalies ({anomalies.length})
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {anomalies.map((flag, index) => (
                    <Alert key={index}>
                      <AlertOctagon className="h-4 w-4" />
                      <AlertTitle className="text-sm font-medium">
                        {flag.code === 'AAMS_DEVIATION' ? 'AAMS Deviation' : 'Anomaly Detected'}
                      </AlertTitle>
                      <AlertDescription className="text-sm">
                        {flag.message}
                        {flag.deviation_percent && (
                          <span className="block text-xs text-muted-foreground mt-1">
                            MSQ: {flag.msq_quantity?.toLocaleString()} | 
                            AAMS Avg: {flag.aams_monthly_avg?.toLocaleString()} | 
                            Deviation: {flag.deviation_percent.toFixed(1)}%
                          </span>
                        )}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Warnings */}
          {warnings.length > 0 && (
            <AccordionItem value="warnings">
              <AccordionTrigger className="text-yellow-600">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Warnings ({warnings.length})
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {warnings.map((flag, index) => (
                    <Alert key={index}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        {flag.message}
                        {flag.current_quantity !== undefined && flag.previous_quantity !== undefined && (
                          <span className="block text-xs text-muted-foreground mt-1">
                            Current: {flag.current_quantity.toLocaleString()} | 
                            Previous: {flag.previous_quantity.toLocaleString()}
                          </span>
                        )}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Manual Flags */}
          {manualFlags.length > 0 && (
            <AccordionItem value="manual">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Flag className="h-4 w-4" />
                  Manual Flags ({manualFlags.length})
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {manualFlags.map((flag, index) => (
                    <Alert key={index}>
                      <Flag className="h-4 w-4" />
                      <AlertDescription>{flag.message}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Info */}
          {infos.length > 0 && (
            <AccordionItem value="info">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Information ({infos.length})
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {infos.map((flag, index) => (
                    <Alert key={index}>
                      <Info className="h-4 w-4" />
                      <AlertDescription>{flag.message}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      )}
    </div>
  )
}

// Simple status badge for lists
export function MSQStatusBadge({ status }: { status: MSQStatus }) {
  return <ValidationStatusIndicator status={status} variant="badge" />
}
