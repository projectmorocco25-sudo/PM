'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useVCIMutations, AAMSStatus } from '@/hooks/use-vci'
import { useUserRole } from '@/hooks/use-user-role'
import { CheckCircle2, XCircle, Loader2, Calculator, ThumbsUp } from 'lucide-react'

// Task 1.1.3.15: AAMS workflow actions

interface AAMSWorkflowActionsProps {
  submissionId: string
  status: AAMSStatus
  onSuccess?: () => void
}

export function AAMSWorkflowActions({ submissionId, status, onSuccess }: AAMSWorkflowActionsProps) {
  const { role, isMOH } = useUserRole()
  const { verifyAAMS, approveAAMS, rejectAAMS } = useVCIMutations()

  const [showVerifyDialog, setShowVerifyDialog] = React.useState(false)
  const [showApproveDialog, setShowApproveDialog] = React.useState(false)
  const [showRejectDialog, setShowRejectDialog] = React.useState(false)
  const [notes, setNotes] = React.useState('')
  const [rejectReason, setRejectReason] = React.useState('')

  const isTier1 = role === 'tier1'
  const isTier2 = role === 'tier2_officer' || role === 'tier2_registrar'

  const canVerify = isTier2 && status === 'submitted'
  const canApprove = isTier1 && status === 'verified'
  const canReject = isMOH && status !== 'rejected' && status !== 'completed'

  const isLoading = verifyAAMS.isPending || approveAAMS.isPending || rejectAAMS.isPending

  const handleVerify = async (approve: boolean) => {
    try {
      await verifyAAMS.mutateAsync({ id: submissionId, approve, notes })
      setShowVerifyDialog(false)
      setNotes('')
      onSuccess?.()
    } catch {
      // Error handled by mutation
    }
  }

  const handleApprove = async (approve: boolean) => {
    try {
      await approveAAMS.mutateAsync({ id: submissionId, approve, notes })
      setShowApproveDialog(false)
      setNotes('')
      onSuccess?.()
    } catch {
      // Error handled by mutation
    }
  }

  const handleReject = async () => {
    if (rejectReason.length < 20) return
    try {
      await rejectAAMS.mutateAsync({ id: submissionId, reason: rejectReason })
      setShowRejectDialog(false)
      setRejectReason('')
      onSuccess?.()
    } catch {
      // Error handled by mutation
    }
  }

  if (!canVerify && !canApprove && !canReject) {
    return null
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {canVerify && (
          <Button onClick={() => setShowVerifyDialog(true)} disabled={isLoading}>
            <Calculator className="mr-2 h-4 w-4" />
            Verify & Calculate Thresholds
          </Button>
        )}
        {canApprove && (
          <Button onClick={() => setShowApproveDialog(true)} disabled={isLoading}>
            <ThumbsUp className="mr-2 h-4 w-4" />
            Approve & Activate Thresholds
          </Button>
        )}
        {canReject && (
          <Button
            variant="destructive"
            onClick={() => setShowRejectDialog(true)}
            disabled={isLoading}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Reject
          </Button>
        )}
      </div>

      {/* Verify Dialog */}
      <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify AAMS Submission</DialogTitle>
            <DialogDescription>
              Verification will calculate thresholds (B × AAMS) for each SKU.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>Verification Notes (Optional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter any verification notes..."
              className="mt-2"
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => handleVerify(false)}
              disabled={isLoading}
            >
              Return for Revision
            </Button>
            <Button onClick={() => handleVerify(true)} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-2 h-4 w-4" />
              )}
              Verify & Calculate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve AAMS Thresholds</DialogTitle>
            <DialogDescription>
              Approval will activate the calculated thresholds for monitoring.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>Approval Notes (Optional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter any approval notes..."
              className="mt-2"
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => handleApprove(false)}
              disabled={isLoading}
            >
              Return for Review
            </Button>
            <Button onClick={() => handleApprove(true)} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-2 h-4 w-4" />
              )}
              Approve & Activate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject AAMS Submission</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this submission.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>
              Rejection Reason <span className="text-destructive">*</span>
            </Label>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason (minimum 20 characters)..."
              className="mt-2"
              rows={4}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {rejectReason.length}/20 characters minimum
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={rejectReason.length < 20 || isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="mr-2 h-4 w-4" />
              )}
              Reject Submission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
