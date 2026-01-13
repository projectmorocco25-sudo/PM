'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  DetailPage,
  DetailField,
  DetailGrid,
} from '@/components/ui/detail-page'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ValidationStatusIndicator } from '@/components/vci/validation-status-indicator'
import { CorrectionInterface } from '@/components/vci/correction-interface'
import { ApprovalHistory } from '@/components/rmm/approval-history'
import {
  useMSQSubmission,
  useMSQMutations,
  getMonthName,
} from '@/hooks/use-vci'
import { useApprovalHistory } from '@/hooks/use-rmm'
import { useUserRole } from '@/hooks/use-user-role'
import { format } from 'date-fns'
import {
  Calendar,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  Flag,
  Loader2,
  History,
} from 'lucide-react'
import { SimpleHistoryTab } from '@/components/history/history-tab'

// Task 1.1.4.10: MSQ submission detail page
// Task 1.1.5.29: History tab on MSQ submission detail page

export default function MSQDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isMOH } = useUserRole()
  const submissionId = params.id as string

  const { data: submissionData, isLoading, refetch } = useMSQSubmission(submissionId)
  const { data: approvals, isLoading: approvalsLoading } = useApprovalHistory(submissionId)
  const { flagMSQ, acceptMSQ, rejectMSQ } = useMSQMutations()

  const [showFlagDialog, setShowFlagDialog] = React.useState(false)
  const [showRejectDialog, setShowRejectDialog] = React.useState(false)
  const [flagReason, setFlagReason] = React.useState('')
  const [rejectReason, setRejectReason] = React.useState('')
  const [notes, setNotes] = React.useState('')

  const submission = submissionData?.submission

  const canFlag = isMOH && submission?.status === 'submitted'
  const canAccept = isMOH && (submission?.status === 'submitted' || submission?.status === 'flagged_for_review')
  const canReject = isMOH && (submission?.status === 'submitted' || submission?.status === 'flagged_for_review')

  const handleFlag = async () => {
    if (flagReason.length < 10) return
    try {
      await flagMSQ.mutateAsync({ id: submissionId, reason: flagReason })
      setShowFlagDialog(false)
      setFlagReason('')
      refetch()
    } catch {
      // Error handled by mutation
    }
  }

  const handleAccept = async () => {
    try {
      await acceptMSQ.mutateAsync({ id: submissionId, notes })
      setNotes('')
      refetch()
    } catch {
      // Error handled by mutation
    }
  }

  const handleReject = async () => {
    if (rejectReason.length < 20) return
    try {
      await rejectMSQ.mutateAsync({ id: submissionId, reason: rejectReason })
      setShowRejectDialog(false)
      setRejectReason('')
      refetch()
    } catch {
      // Error handled by mutation
    }
  }

  const isActioning = flagMSQ.isPending || acceptMSQ.isPending || rejectMSQ.isPending

  return (
    <DetailPage
      title={submission ? `MSQ ${getMonthName(submission.month)} ${submission.year}` : 'MSQ Submission'}
      subtitle={submission?.company_name}
      status={
        submission && (
          <ValidationStatusIndicator status={submission.status} variant="badge" />
        )
      }
      onBack={() => router.push('/dashboard/vci/msq')}
      backLabel="Back to MSQ"
      loading={isLoading}
    >
      <div className="space-y-6">
        {/* MOH Actions */}
        {isMOH && submission && (canFlag || canAccept || canReject) && (
          <Card>
            <CardHeader>
              <CardTitle>Review Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {canAccept && (
                  <Button onClick={handleAccept} disabled={isActioning}>
                    {acceptMSQ.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                    )}
                    Accept
                  </Button>
                )}
                {canFlag && (
                  <Button
                    variant="secondary"
                    onClick={() => setShowFlagDialog(true)}
                    disabled={isActioning}
                  >
                    <Flag className="mr-2 h-4 w-4" />
                    Flag for Review
                  </Button>
                )}
                {canReject && (
                  <Button
                    variant="destructive"
                    onClick={() => setShowRejectDialog(true)}
                    disabled={isActioning}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submission Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Submission Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DetailGrid columns={2}>
              <DetailField
                label="Period"
                value={
                  submission && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {getMonthName(submission.month)} {submission.year}
                    </div>
                  )
                }
              />
              <DetailField
                label="Company"
                value={
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    {submission?.company_name}
                  </div>
                }
              />
              <DetailField
                label="Submitted"
                value={
                  submission?.submitted_at ? (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {format(new Date(submission.submitted_at), 'PPP p')}
                    </div>
                  ) : (
                    '—'
                  )
                }
              />
              <DetailField
                label="Submitted By"
                value={submission?.submitted_by_name}
              />
              <DetailField
                label="SKU Count"
                value={
                  <Badge variant="outline">
                    {submission?.submission_data?.length || 0} SKU(s)
                  </Badge>
                }
              />
              {submission?.correction_of && (
                <DetailField
                  label="Correction Of"
                  value={
                    <Badge variant="secondary">
                      Correction
                    </Badge>
                  }
                />
              )}
            </DetailGrid>
          </CardContent>
        </Card>

        {/* Validation Status - Task 1.1.4.10a */}
        <Card>
          <CardHeader>
            <CardTitle>Validation Status</CardTitle>
          </CardHeader>
          <CardContent>
            {submission && (
              <ValidationStatusIndicator
                status={submission.status}
                flags={submission.validation_flags}
                variant="detailed"
              />
            )}
          </CardContent>
        </Card>

        {/* SKU Data */}
        <Card>
          <CardHeader>
            <CardTitle>Submitted SKU Quantities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-2 text-left text-sm font-medium">SKU ID</th>
                    <th className="px-4 py-2 text-right text-sm font-medium">Monthly Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {submission?.submission_data?.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2 font-mono text-sm">
                        {item.sku_id.slice(0, 8)}...
                      </td>
                      <td className="px-4 py-2 text-right font-mono">
                        {item.quantity.toLocaleString()}
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan={2} className="px-4 py-8 text-center text-muted-foreground">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Correction Interface - Task 1.1.4.11 & 1.1.4.11a */}
        {!isMOH && submission && submission.status !== 'rejected' && (
          <CorrectionInterface
            submission={submission}
            onCorrectionSubmitted={() => refetch()}
          />
        )}

        {/* Approval History */}
        <Card>
          <CardHeader>
            <CardTitle>Review History</CardTitle>
          </CardHeader>
          <CardContent>
            <ApprovalHistory approvals={approvals || []} loading={approvalsLoading} />
          </CardContent>
        </Card>

        {/* History Tab - Task 1.1.5.29 */}
        <SimpleHistoryTab
          entityType="msq_submission"
          entityId={submissionId}
          entityName={submission ? `MSQ ${getMonthName(submission.month)} ${submission.year}` : undefined}
        />
      </div>

      {/* Flag Dialog */}
      <Dialog open={showFlagDialog} onOpenChange={setShowFlagDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Flag for Review</DialogTitle>
            <DialogDescription>
              Provide a reason for flagging this submission
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>
              Reason <span className="text-destructive">*</span>
            </Label>
            <Textarea
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              placeholder="Enter reason (minimum 10 characters)..."
              className="mt-2"
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {flagReason.length}/10 characters minimum
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFlagDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleFlag}
              disabled={flagReason.length < 10 || flagMSQ.isPending}
            >
              {flagMSQ.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Flag className="mr-2 h-4 w-4" />
              )}
              Flag Submission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Submission</DialogTitle>
            <DialogDescription>
              Provide a reason for rejection
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
              disabled={rejectReason.length < 20 || rejectMSQ.isPending}
            >
              {rejectMSQ.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="mr-2 h-4 w-4" />
              )}
              Reject Submission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DetailPage>
  )
}
