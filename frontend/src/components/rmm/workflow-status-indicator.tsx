'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  FileEdit,
  FileCheck,
  UserCheck,
  Settings2,
} from 'lucide-react'

// Task 1.1.2.27a: WorkflowStatusIndicator component

export type RegistrySubmissionStatus =
  | 'draft'
  | 'submitted'
  | 'tier2_verified'
  | 'tier2_peer_reviewed'
  | 'tier1_approved'
  | 'tier2_implemented'
  | 'completed'
  | 'rejected'

interface StatusConfig {
  label: string
  variant: 'default' | 'secondary' | 'destructive' | 'outline'
  icon: React.ReactNode
  color: string
  step: number
}

const STATUS_CONFIG: Record<RegistrySubmissionStatus, StatusConfig> = {
  draft: {
    label: 'Draft',
    variant: 'outline',
    icon: <FileEdit className="h-3.5 w-3.5" />,
    color: 'text-muted-foreground',
    step: 0,
  },
  submitted: {
    label: 'Submitted',
    variant: 'secondary',
    icon: <Clock className="h-3.5 w-3.5" />,
    color: 'text-blue-600',
    step: 1,
  },
  tier2_verified: {
    label: 'Tier 2 Verified',
    variant: 'secondary',
    icon: <FileCheck className="h-3.5 w-3.5" />,
    color: 'text-blue-600',
    step: 2,
  },
  tier2_peer_reviewed: {
    label: 'Peer Reviewed',
    variant: 'secondary',
    icon: <UserCheck className="h-3.5 w-3.5" />,
    color: 'text-blue-600',
    step: 2,
  },
  tier1_approved: {
    label: 'Tier 1 Approved',
    variant: 'default',
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    color: 'text-green-600',
    step: 3,
  },
  tier2_implemented: {
    label: 'Implemented',
    variant: 'default',
    icon: <Settings2 className="h-3.5 w-3.5" />,
    color: 'text-green-600',
    step: 4,
  },
  completed: {
    label: 'Completed',
    variant: 'default',
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    color: 'text-green-600',
    step: 5,
  },
  rejected: {
    label: 'Rejected',
    variant: 'destructive',
    icon: <XCircle className="h-3.5 w-3.5" />,
    color: 'text-destructive',
    step: -1,
  },
}

export interface WorkflowStatusIndicatorProps {
  status: RegistrySubmissionStatus
  showIcon?: boolean
  showProgress?: boolean
  size?: 'sm' | 'default' | 'lg'
  className?: string
}

export function WorkflowStatusIndicator({
  status,
  showIcon = true,
  showProgress = false,
  size = 'default',
  className,
}: WorkflowStatusIndicatorProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft

  const sizeClasses = {
    sm: 'text-xs',
    default: 'text-sm',
    lg: 'text-base',
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Badge
        variant={config.variant}
        className={cn(
          'flex items-center gap-1',
          sizeClasses[size],
          config.color
        )}
      >
        {showIcon && config.icon}
        {config.label}
      </Badge>
      {showProgress && status !== 'rejected' && (
        <span className="text-xs text-muted-foreground">
          Step {config.step + 1} of 6
        </span>
      )}
    </div>
  )
}

// Progress indicator showing workflow stages
export interface WorkflowProgressProps {
  status: RegistrySubmissionStatus
  isMOHSubmission?: boolean
  className?: string
}

const COMPANY_STAGES = [
  { key: 'draft', label: 'Draft' },
  { key: 'submitted', label: 'Submitted' },
  { key: 'tier2_verified', label: 'Verified' },
  { key: 'tier1_approved', label: 'Approved' },
  { key: 'tier2_implemented', label: 'Implemented' },
  { key: 'completed', label: 'Completed' },
]

const MOH_STAGES = [
  { key: 'draft', label: 'Draft' },
  { key: 'submitted', label: 'Submitted' },
  { key: 'tier2_peer_reviewed', label: 'Peer Reviewed' },
  { key: 'tier1_approved', label: 'Approved' },
  { key: 'tier2_implemented', label: 'Implemented' },
  { key: 'completed', label: 'Completed' },
]

export function WorkflowProgress({
  status,
  isMOHSubmission = false,
  className,
}: WorkflowProgressProps) {
  const stages = isMOHSubmission ? MOH_STAGES : COMPANY_STAGES
  const config = STATUS_CONFIG[status]
  const currentStep = config?.step ?? 0

  if (status === 'rejected') {
    return (
      <div className={cn('flex items-center gap-2 text-destructive', className)}>
        <XCircle className="h-5 w-5" />
        <span className="font-medium">Submission Rejected</span>
      </div>
    )
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between">
        {stages.map((stage, index) => {
          const isCompleted = currentStep > index
          const isCurrent = currentStep === index
          const isLast = index === stages.length - 1

          return (
            <React.Fragment key={stage.key}>
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                    isCompleted && 'bg-green-600 text-white',
                    isCurrent && 'bg-blue-600 text-white',
                    !isCompleted && !isCurrent && 'bg-muted text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    'mt-1 text-xs',
                    isCurrent ? 'font-medium text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {stage.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2',
                    isCompleted ? 'bg-green-600' : 'bg-muted'
                  )}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

// Entity status badge (active/inactive/suspended)
export interface EntityStatusBadgeProps {
  isActive: boolean
  isSuspended?: boolean
  className?: string
}

export function EntityStatusBadge({
  isActive,
  isSuspended,
  className,
}: EntityStatusBadgeProps) {
  if (isSuspended) {
    return (
      <Badge variant="destructive" className={cn('flex items-center gap-1', className)}>
        <AlertCircle className="h-3 w-3" />
        Suspended
      </Badge>
    )
  }

  return (
    <Badge
      variant={isActive ? 'default' : 'secondary'}
      className={cn('flex items-center gap-1', className)}
    >
      {isActive ? (
        <>
          <CheckCircle2 className="h-3 w-3" />
          Active
        </>
      ) : (
        <>
          <XCircle className="h-3 w-3" />
          Inactive
        </>
      )}
    </Badge>
  )
}
