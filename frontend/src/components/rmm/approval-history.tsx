'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { formatDistanceToNow, format } from 'date-fns'
import {
  CheckCircle2,
  XCircle,
  Clock,
  FileEdit,
  FileCheck,
  UserCheck,
  Settings2,
  Send,
  Eye,
} from 'lucide-react'
import type { Approval } from '@/hooks/use-rmm'

// Task 1.1.2.27b: ApprovalHistory component - timeline view of approvals

interface ApprovalTypeConfig {
  label: string
  icon: React.ReactNode
  color: string
}

const APPROVAL_TYPES: Record<string, ApprovalTypeConfig> = {
  submit: {
    label: 'Submitted',
    icon: <Send className="h-4 w-4" />,
    color: 'bg-blue-500',
  },
  verify: {
    label: 'Verified',
    icon: <FileCheck className="h-4 w-4" />,
    color: 'bg-blue-600',
  },
  peer_review: {
    label: 'Peer Reviewed',
    icon: <Eye className="h-4 w-4" />,
    color: 'bg-indigo-500',
  },
  approve: {
    label: 'Approved',
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: 'bg-green-600',
  },
  implement: {
    label: 'Implemented',
    icon: <Settings2 className="h-4 w-4" />,
    color: 'bg-green-500',
  },
  complete: {
    label: 'Completed',
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: 'bg-green-600',
  },
  reject: {
    label: 'Rejected',
    icon: <XCircle className="h-4 w-4" />,
    color: 'bg-red-500',
  },
}

export interface ApprovalHistoryProps {
  approvals: Approval[]
  loading?: boolean
  className?: string
}

export function ApprovalHistory({
  approvals,
  loading = false,
  className,
}: ApprovalHistoryProps) {
  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-3 w-48 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (approvals.length === 0) {
    return (
      <div className={cn('text-center py-8 text-muted-foreground', className)}>
        No approval history yet
      </div>
    )
  }

  return (
    <div className={cn('relative', className)}>
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted" />

      <div className="space-y-6">
        {approvals.map((approval, index) => {
          const config = APPROVAL_TYPES[approval.approval_type] || {
            label: approval.approval_type,
            icon: <Clock className="h-4 w-4" />,
            color: 'bg-muted',
          }

          return (
            <div key={approval.id} className="relative flex gap-4">
              {/* Icon */}
              <div
                className={cn(
                  'relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-white',
                  config.color
                )}
              >
                {config.icon}
              </div>

              {/* Content */}
              <div className="flex-1 pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div className="font-medium">{config.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(approval.created_at), 'MMM d, yyyy h:mm a')}
                    <span className="ml-2">
                      ({formatDistanceToNow(new Date(approval.created_at), { addSuffix: true })})
                    </span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  <span className="font-medium">{approval.approver_name || 'System'}</span>
                  {approval.from_status && approval.to_status && (
                    <span className="ml-2">
                      ({approval.from_status} → {approval.to_status})
                    </span>
                  )}
                </div>
                {approval.comments && (
                  <div className="mt-2 p-3 bg-muted rounded-md text-sm">
                    {approval.comments}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Compact inline history for lists
export interface ApprovalHistoryInlineProps {
  approvals: Approval[]
  maxItems?: number
  className?: string
}

export function ApprovalHistoryInline({
  approvals,
  maxItems = 3,
  className,
}: ApprovalHistoryInlineProps) {
  const displayApprovals = approvals.slice(-maxItems)
  const hiddenCount = approvals.length - maxItems

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {hiddenCount > 0 && (
        <span className="text-xs text-muted-foreground mr-1">+{hiddenCount}</span>
      )}
      {displayApprovals.map((approval) => {
        const config = APPROVAL_TYPES[approval.approval_type] || {
          label: approval.approval_type,
          icon: <Clock className="h-3 w-3" />,
          color: 'bg-muted',
        }

        return (
          <div
            key={approval.id}
            className={cn(
              'w-6 h-6 rounded-full flex items-center justify-center text-white',
              config.color
            )}
            title={`${config.label} by ${approval.approver_name || 'System'}`}
          >
            {React.cloneElement(config.icon as React.ReactElement, {
              className: 'h-3 w-3',
            })}
          </div>
        )
      })}
    </div>
  )
}
