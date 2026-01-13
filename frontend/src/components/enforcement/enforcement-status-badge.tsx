'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Gavel,
  Scale,
  Ban,
} from 'lucide-react'
import type { ActionStatus, ActionType } from '@/hooks/use-enforcement'

// Status configuration
const STATUS_CONFIG: Record<ActionStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode }> = {
  draft: { label: 'Draft', variant: 'outline', icon: <FileText className="h-3 w-3" /> },
  pending_review: { label: 'Pending Review', variant: 'secondary', icon: <Clock className="h-3 w-3" /> },
  pending_approval: { label: 'Pending Approval', variant: 'secondary', icon: <Clock className="h-3 w-3" /> },
  approved: { label: 'Approved', variant: 'default', icon: <CheckCircle2 className="h-3 w-3" /> },
  executed: { label: 'Executed', variant: 'default', icon: <Gavel className="h-3 w-3" /> },
  appealed: { label: 'Under Appeal', variant: 'secondary', icon: <Scale className="h-3 w-3" /> },
  appeal_upheld: { label: 'Appeal Upheld', variant: 'default', icon: <CheckCircle2 className="h-3 w-3" /> },
  appeal_rejected: { label: 'Appeal Rejected', variant: 'destructive', icon: <XCircle className="h-3 w-3" /> },
  resolved: { label: 'Resolved', variant: 'outline', icon: <CheckCircle2 className="h-3 w-3" /> },
  cancelled: { label: 'Cancelled', variant: 'outline', icon: <Ban className="h-3 w-3" /> },
}

// Action type configuration
const TYPE_CONFIG: Record<ActionType, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode }> = {
  warning: { label: 'Warning', variant: 'secondary', icon: <AlertCircle className="h-3 w-3" /> },
  fine: { label: 'Fine', variant: 'destructive', icon: <Gavel className="h-3 w-3" /> },
  suspension: { label: 'Suspension', variant: 'destructive', icon: <Ban className="h-3 w-3" /> },
  license_revocation: { label: 'License Revocation', variant: 'destructive', icon: <XCircle className="h-3 w-3" /> },
}

export interface EnforcementStatusBadgeProps {
  status: ActionStatus
  showIcon?: boolean
  className?: string
}

export function EnforcementStatusBadge({ status, showIcon = true, className }: EnforcementStatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft
  
  return (
    <Badge variant={config.variant} className={cn('flex items-center gap-1', className)}>
      {showIcon && config.icon}
      {config.label}
    </Badge>
  )
}

export interface EnforcementTypeBadgeProps {
  type: ActionType
  showIcon?: boolean
  className?: string
}

export function EnforcementTypeBadge({ type, showIcon = true, className }: EnforcementTypeBadgeProps) {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.warning
  
  return (
    <Badge variant={config.variant} className={cn('flex items-center gap-1', className)}>
      {showIcon && config.icon}
      {config.label}
    </Badge>
  )
}
