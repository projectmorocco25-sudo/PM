'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useUserRole } from '@/hooks/use-user-role'
import type { RegistrySubmissionStatus } from './workflow-status-indicator'
import {
  Send,
  CheckCircle2,
  XCircle,
  Settings2,
  Eye,
  FileCheck,
} from 'lucide-react'

// Task 1.1.2.28, 1.1.2.28a, 1.1.2.28b: Workflow action buttons with role-based visibility

interface WorkflowAction {
  id: string
  label: string
  icon: React.ReactNode
  variant: 'default' | 'secondary' | 'destructive' | 'outline'
  requiresComment?: boolean
  commentLabel?: string
  commentPlaceholder?: string
  confirmTitle?: string
  confirmDescription?: string
}

const WORKFLOW_ACTIONS: Record<string, WorkflowAction> = {
  verify: {
    id: 'verify',
    label: 'Verify',
    icon: <FileCheck className="h-4 w-4" />,
    variant: 'default',
    requiresComment: false,
    confirmTitle: 'Verify Submission',
    confirmDescription: 'Are you sure you want to verify this submission?',
  },
  peer_review: {
    id: 'peer_review',
    label: 'Peer Review',
    icon: <Eye className="h-4 w-4" />,
    variant: 'default',
    requiresComment: false,
    confirmTitle: 'Complete Peer Review',
    confirmDescription: 'Are you sure you want to approve this peer review?',
  },
  approve: {
    id: 'approve',
    label: 'Approve',
    icon: <CheckCircle2 className="h-4 w-4" />,
    variant: 'default',
    requiresComment: false,
    confirmTitle: 'Approve Submission',
    confirmDescription: 'Are you sure you want to approve this submission?',
  },
  implement: {
    id: 'implement',
    label: 'Implement',
    icon: <Settings2 className="h-4 w-4" />,
    variant: 'default',
    requiresComment: false,
    confirmTitle: 'Implement Submission',
    confirmDescription: 'Are you sure you want to implement this submission?',
  },
  reject: {
    id: 'reject',
    label: 'Reject',
    icon: <XCircle className="h-4 w-4" />,
    variant: 'destructive',
    requiresComment: true,
    commentLabel: 'Rejection Reason',
    commentPlaceholder: 'Please provide a reason for rejection (minimum 10 characters)...',
    confirmTitle: 'Reject Submission',
    confirmDescription: 'This will reject the submission and notify the submitter.',
  },
}

// Role-based action permissions
interface ActionPermissions {
  canVerify: boolean
  canPeerReview: boolean
  canApprove: boolean
  canImplement: boolean
  canReject: boolean
}

function getActionPermissions(
  status: RegistrySubmissionStatus,
  role: string | null,
  isMOHSubmission: boolean
): ActionPermissions {
  const isTier1 = role === 'tier1'
  const isTier2 = role === 'tier2_officer' || role === 'tier2_registrar'
  const isRegistrar = role === 'tier2_registrar'

  return {
    canVerify: isTier2 && status === 'submitted' && !isMOHSubmission,
    canPeerReview: isTier2 && status === 'submitted' && isMOHSubmission,
    canApprove:
      isTier1 &&
      (status === 'tier2_verified' || status === 'tier2_peer_reviewed'),
    canImplement: isRegistrar && status === 'tier1_approved',
    canReject:
      (isTier1 || isTier2) &&
      ['submitted', 'tier2_verified', 'tier2_peer_reviewed', 'tier1_approved'].includes(status),
  }
}

export interface WorkflowActionButtonsProps {
  status: RegistrySubmissionStatus
  isMOHSubmission?: boolean
  submittedBy?: string
  onVerify?: (comments?: string) => void
  onPeerReview?: (comments?: string) => void
  onApprove?: (comments?: string) => void
  onImplement?: (comments?: string) => void
  onReject?: (reason: string, feedback?: string) => void
  loading?: boolean
  className?: string
}

export function WorkflowActionButtons({
  status,
  isMOHSubmission = false,
  submittedBy,
  onVerify,
  onPeerReview,
  onApprove,
  onImplement,
  onReject,
  loading = false,
  className,
}: WorkflowActionButtonsProps) {
  const { role, userId } = useUserRole()
  const [activeAction, setActiveAction] = React.useState<string | null>(null)
  const [comment, setComment] = React.useState('')
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  const permissions = getActionPermissions(status, role, isMOHSubmission)

  // Peer review must be by different person
  const canPeerReview = permissions.canPeerReview && submittedBy !== userId

  const handleActionClick = (actionId: string) => {
    setActiveAction(actionId)
    setComment('')
    setIsDialogOpen(true)
  }

  const handleConfirm = () => {
    if (!activeAction) return

    switch (activeAction) {
      case 'verify':
        onVerify?.(comment || undefined)
        break
      case 'peer_review':
        onPeerReview?.(comment || undefined)
        break
      case 'approve':
        onApprove?.(comment || undefined)
        break
      case 'implement':
        onImplement?.(comment || undefined)
        break
      case 'reject':
        onReject?.(comment)
        break
    }

    setIsDialogOpen(false)
    setActiveAction(null)
    setComment('')
  }

  const activeActionConfig = activeAction ? WORKFLOW_ACTIONS[activeAction] : null
  const isRejectValid = activeAction !== 'reject' || comment.length >= 10

  // Check if any actions are available
  const hasActions =
    (permissions.canVerify && onVerify) ||
    (canPeerReview && onPeerReview) ||
    (permissions.canApprove && onApprove) ||
    (permissions.canImplement && onImplement) ||
    (permissions.canReject && onReject)

  if (!hasActions) {
    return null
  }

  return (
    <>
      <div className={cn('flex flex-wrap items-center gap-2', className)}>
        {permissions.canVerify && onVerify && (
          <Button
            variant="default"
            onClick={() => handleActionClick('verify')}
            disabled={loading}
          >
            <FileCheck className="h-4 w-4 mr-2" />
            Verify
          </Button>
        )}

        {canPeerReview && onPeerReview && (
          <Button
            variant="default"
            onClick={() => handleActionClick('peer_review')}
            disabled={loading}
          >
            <Eye className="h-4 w-4 mr-2" />
            Peer Review
          </Button>
        )}

        {permissions.canApprove && onApprove && (
          <Button
            variant="default"
            onClick={() => handleActionClick('approve')}
            disabled={loading}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Approve
          </Button>
        )}

        {permissions.canImplement && onImplement && (
          <Button
            variant="default"
            onClick={() => handleActionClick('implement')}
            disabled={loading}
          >
            <Settings2 className="h-4 w-4 mr-2" />
            Implement
          </Button>
        )}

        {permissions.canReject && onReject && (
          <Button
            variant="destructive"
            onClick={() => handleActionClick('reject')}
            disabled={loading}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Reject
          </Button>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{activeActionConfig?.confirmTitle}</DialogTitle>
            <DialogDescription>
              {activeActionConfig?.confirmDescription}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Label htmlFor="comment">
              {activeActionConfig?.requiresComment
                ? activeActionConfig.commentLabel
                : 'Comments (optional)'}
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                activeActionConfig?.commentPlaceholder ||
                'Add any comments...'
              }
              className="mt-2"
              rows={3}
            />
            {activeAction === 'reject' && comment.length < 10 && (
              <p className="text-sm text-destructive mt-1">
                Rejection reason must be at least 10 characters
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant={activeActionConfig?.variant}
              onClick={handleConfirm}
              disabled={!isRejectValid || loading}
            >
              {activeActionConfig?.icon}
              <span className="ml-2">{activeActionConfig?.label}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
