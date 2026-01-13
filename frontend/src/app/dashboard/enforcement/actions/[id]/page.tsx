'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import {
  DetailPage,
  DetailField,
  DetailGrid,
} from '@/components/ui/detail-page'
import { EnforcementStatusBadge, EnforcementTypeBadge } from '@/components/enforcement/enforcement-status-badge'
import { ApprovalHistory } from '@/components/rmm/approval-history'
import { AppealForm, AppealReviewForm } from '@/components/enforcement/appeal-form'
import { useEnforcementAction, useEnforcementMutations, useApprovalHistory } from '@/hooks/use-enforcement'
import { useApprovalHistory as useApprovalHistoryRMM } from '@/hooks/use-rmm'
import { useUserRole } from '@/hooks/use-user-role'
import { format, differenceInDays } from 'date-fns'
import {
  CheckCircle2,
  XCircle,
  Gavel,
  Scale,
  AlertCircle,
  Loader2,
} from 'lucide-react'

// Task 1.1.2.39: Enforcement action detail page

export default function EnforcementActionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { role, isMOH, userId, userCompanyId } = useUserRole()
  const actionId = params.id as string

  const { data: actionData, isLoading: actionLoading } = useEnforcementAction(actionId)
  const { data: approvals, isLoading: approvalsLoading } = useApprovalHistoryRMM(actionId)
  const { reviewAction, approveAction, executeAction } = useEnforcementMutations()

  const [showReviewDialog, setShowReviewDialog] = React.useState(false)
  const [showApprovalDialog, setShowApprovalDialog] = React.useState(false)
  const [showExecuteDialog, setShowExecuteDialog] = React.useState(false)
  const [showAppealForm, setShowAppealForm] = React.useState(false)
  const [showAppealReview, setShowAppealReview] = React.useState(false)
  const [notes, setNotes] = React.useState('')

  const action = actionData?.action

  const isTier1 = role === 'tier1'
  const isTier2 = role === 'tier2_officer' || role === 'tier2_registrar'
  const isCompanyUser = !isMOH && action?.company_id === userCompanyId

  // Calculate appeal window
  const daysUntilAppealExpires = action?.executed_at
    ? 30 - differenceInDays(new Date(), new Date(action.executed_at))
    : 0

  const canReview = isTier2 && action?.status === 'pending_review'
  const canApprove = isTier1 && action?.status === 'pending_approval'
  const canExecute = isMOH && action?.status === 'approved'
  const canAppeal = isCompanyUser && action?.status === 'executed' && daysUntilAppealExpires > 0
  const canReviewAppeal = isTier1 && action?.status === 'appealed'

  const handleReview = async (approve: boolean) => {
    await reviewAction.mutateAsync({ id: actionId, approve, review_notes: notes })
    setShowReviewDialog(false)
    setNotes('')
  }

  const handleApproval = async (approve: boolean) => {
    await approveAction.mutateAsync({ id: actionId, approve, approval_notes: notes })
    setShowApprovalDialog(false)
    setNotes('')
  }

  const handleExecute = async () => {
    await executeAction.mutateAsync({ id: actionId, execution_notes: notes })
    setShowExecuteDialog(false)
    setNotes('')
  }

  const isLoading = reviewAction.isPending || approveAction.isPending || executeAction.isPending

  return (
    <DetailPage
      title={`Enforcement Action`}
      subtitle={action?.id.slice(0, 8)}
      status={
        action && (
          <div className="flex items-center gap-2">
            <EnforcementTypeBadge type={action.action_type} />
            <EnforcementStatusBadge status={action.status} />
          </div>
        )
      }
      onBack={() => router.push('/dashboard/enforcement/actions')}
      backLabel="Back to Actions"
      loading={actionLoading}
    >
      <div className="space-y-6">
        {/* Action Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {canReview && (
              <Button onClick={() => setShowReviewDialog(true)} disabled={isLoading}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Review
              </Button>
            )}
            {canApprove && (
              <Button onClick={() => setShowApprovalDialog(true)} disabled={isLoading}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Approve
              </Button>
            )}
            {canExecute && (
              <Button onClick={() => setShowExecuteDialog(true)} disabled={isLoading}>
                <Gavel className="mr-2 h-4 w-4" />
                Execute
              </Button>
            )}
            {canAppeal && (
              <Button variant="secondary" onClick={() => setShowAppealForm(true)}>
                <Scale className="mr-2 h-4 w-4" />
                Submit Appeal ({daysUntilAppealExpires} days left)
              </Button>
            )}
            {canReviewAppeal && (
              <Button onClick={() => setShowAppealReview(true)}>
                <Scale className="mr-2 h-4 w-4" />
                Review Appeal
              </Button>
            )}
            {!canReview && !canApprove && !canExecute && !canAppeal && !canReviewAppeal && (
              <p className="text-sm text-muted-foreground">
                No actions available at this time.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Appeal Form */}
        {showAppealForm && (
          <AppealForm
            actionId={actionId}
            onSuccess={() => setShowAppealForm(false)}
            onCancel={() => setShowAppealForm(false)}
          />
        )}

        {/* Appeal Review */}
        {showAppealReview && action?.appeal_grounds && action?.appeal_explanation && (
          <AppealReviewForm
            actionId={actionId}
            appealGrounds={action.appeal_grounds}
            appealExplanation={action.appeal_explanation}
            onSuccess={() => setShowAppealReview(false)}
            onCancel={() => setShowAppealReview(false)}
          />
        )}

        {/* Action Details */}
        <Card>
          <CardHeader>
            <CardTitle>Action Details</CardTitle>
          </CardHeader>
          <CardContent>
            <DetailGrid columns={2}>
              <DetailField label="Action ID" value={<span className="font-mono">{action?.id}</span>} />
              <DetailField label="Type" value={action && <EnforcementTypeBadge type={action.action_type} />} />
              <DetailField label="Company" value={action?.company_name} />
              <DetailField label="Violation Type" value={action?.violation_type} />
              <DetailField label="Status" value={action && <EnforcementStatusBadge status={action.status} />} />
              <DetailField label="Created" value={action?.created_at && format(new Date(action.created_at), 'PPP p')} />
              <DetailField label="Created By" value={action?.created_by_name} />
              {action?.action_type === 'fine' && (
                <DetailField label="Fine Amount" value={`${Number(action.fine_amount).toLocaleString()} ${action.fine_currency}`} />
              )}
              {action?.action_type === 'suspension' && (
                <>
                  <DetailField label="Start Date" value={action.suspension_start_date && format(new Date(action.suspension_start_date), 'PPP')} />
                  <DetailField label="End Date" value={action.suspension_end_date && format(new Date(action.suspension_end_date), 'PPP')} />
                </>
              )}
            </DetailGrid>

            <div className="mt-6 space-y-4">
              <div>
                <Label className="text-muted-foreground">Legal Basis</Label>
                <p className="mt-1">{action?.legal_basis}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Justification</Label>
                <p className="mt-1 p-3 bg-muted rounded-md">{action?.justification}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appeal Information */}
        {action?.appeal_submitted_at && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Appeal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DetailGrid columns={2}>
                <DetailField label="Submitted" value={format(new Date(action.appeal_submitted_at), 'PPP p')} />
                <DetailField label="Grounds" value={action.appeal_grounds} />
                {action.appeal_resolved_at && (
                  <>
                    <DetailField label="Resolved" value={format(new Date(action.appeal_resolved_at), 'PPP p')} />
                    <DetailField label="Resolution" value={action.appeal_resolution} />
                    <DetailField label="Resolved By" value={action.appeal_resolved_by_name} />
                  </>
                )}
              </DetailGrid>
              <div className="mt-4">
                <Label className="text-muted-foreground">Appeal Explanation</Label>
                <p className="mt-1 p-3 bg-muted rounded-md">{action.appeal_explanation}</p>
              </div>
              {action.appeal_resolution_notes && (
                <div className="mt-4">
                  <Label className="text-muted-foreground">Resolution Notes</Label>
                  <p className="mt-1 p-3 bg-muted rounded-md">{action.appeal_resolution_notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Approval History */}
        <Card>
          <CardHeader>
            <CardTitle>Approval History</CardTitle>
          </CardHeader>
          <CardContent>
            <ApprovalHistory approvals={approvals || []} loading={approvalsLoading} />
          </CardContent>
        </Card>
      </div>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Enforcement Action</DialogTitle>
            <DialogDescription>
              Provide your review decision and notes.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>Review Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter review notes (minimum 10 characters)..."
              className="mt-2"
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="destructive" onClick={() => handleReview(false)} disabled={notes.length < 10 || isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
              Return for Revision
            </Button>
            <Button onClick={() => handleReview(true)} disabled={notes.length < 10 || isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
              Approve & Forward
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Enforcement Action</DialogTitle>
            <DialogDescription>
              Provide your approval decision and notes.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>Approval Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter approval notes (minimum 10 characters)..."
              className="mt-2"
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="destructive" onClick={() => handleApproval(false)} disabled={notes.length < 10 || isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
              Return for Review
            </Button>
            <Button onClick={() => handleApproval(true)} disabled={notes.length < 10 || isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Execute Dialog */}
      <Dialog open={showExecuteDialog} onOpenChange={setShowExecuteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Execute Enforcement Action</DialogTitle>
            <DialogDescription>
              This will execute the enforcement action. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>Execution Notes (Optional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter any execution notes..."
              className="mt-2"
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExecuteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleExecute} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Gavel className="mr-2 h-4 w-4" />}
              Execute Action
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DetailPage>
  )
}
