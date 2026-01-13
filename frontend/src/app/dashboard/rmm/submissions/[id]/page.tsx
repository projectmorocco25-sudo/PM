'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DetailPage,
  DetailField,
  DetailGrid,
} from '@/components/ui/detail-page'
import {
  WorkflowStatusIndicator,
  WorkflowProgress,
} from '@/components/rmm/workflow-status-indicator'
import { ApprovalHistory } from '@/components/rmm/approval-history'
import { WorkflowActionButtons } from '@/components/rmm/workflow-action-buttons'
import {
  useRegistrySubmission,
  useApprovalHistory,
  useRegistrySubmissionMutations,
} from '@/hooks/use-rmm'
import { useUserRole } from '@/hooks/use-user-role'
import { format } from 'date-fns'

// Task 1.1.2.27: Registry submission detail page

export default function SubmissionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isMOH } = useUserRole()
  const submissionId = params.id as string

  const { data: submission, isLoading: submissionLoading } =
    useRegistrySubmission(submissionId)
  const { data: approvals, isLoading: approvalsLoading } =
    useApprovalHistory(submissionId)

  const {
    verifySubmission,
    approveSubmission,
    implementSubmission,
    rejectSubmission,
    peerReviewSubmission,
  } = useRegistrySubmissionMutations()

  const isMOHSubmission = submission?.submitted_by_name?.includes('Tier')

  const handleVerify = (comments?: string) => {
    verifySubmission.mutate({ id: submissionId, comments })
  }

  const handlePeerReview = (comments?: string) => {
    peerReviewSubmission.mutate({ id: submissionId, comments })
  }

  const handleApprove = (comments?: string) => {
    approveSubmission.mutate({ id: submissionId, comments })
  }

  const handleImplement = (comments?: string) => {
    implementSubmission.mutate({ id: submissionId, comments })
  }

  const handleReject = (reason: string) => {
    rejectSubmission.mutate({ id: submissionId, rejection_reason: reason })
  }

  const isLoading =
    submissionLoading ||
    verifySubmission.isPending ||
    approveSubmission.isPending ||
    implementSubmission.isPending ||
    rejectSubmission.isPending ||
    peerReviewSubmission.isPending

  return (
    <DetailPage
      title={`Registry Submission`}
      subtitle={submission?.id.slice(0, 8)}
      description={`${submission?.submission_type} ${submission?.entity_type}`}
      status={
        submission && (
          <WorkflowStatusIndicator status={submission.status} />
        )
      }
      onBack={() => router.push('/dashboard/rmm/submissions')}
      backLabel="Back to Submissions"
      loading={submissionLoading}
    >
      <div className="space-y-6">
        {/* Workflow Progress */}
        {submission && submission.status !== 'rejected' && (
          <Card>
            <CardHeader>
              <CardTitle>Workflow Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <WorkflowProgress
                status={submission.status}
                isMOHSubmission={isMOHSubmission}
              />
            </CardContent>
          </Card>
        )}

        {/* Workflow Actions */}
        {submission && (
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <WorkflowActionButtons
                status={submission.status}
                isMOHSubmission={isMOHSubmission}
                submittedBy={submission.submitted_by}
                onVerify={handleVerify}
                onPeerReview={handlePeerReview}
                onApprove={handleApprove}
                onImplement={handleImplement}
                onReject={handleReject}
                loading={isLoading}
              />
              {!isMOH && submission.status !== 'rejected' && (
                <p className="text-sm text-muted-foreground mt-4">
                  Your submission is being processed. You will be notified when
                  there are updates.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Submission Details */}
        <Card>
          <CardHeader>
            <CardTitle>Submission Details</CardTitle>
          </CardHeader>
          <CardContent>
            <DetailGrid columns={2}>
              <DetailField
                label="Submission ID"
                value={
                  <span className="font-mono">{submission?.id}</span>
                }
              />
              <DetailField
                label="Type"
                value={
                  <span className="capitalize">
                    {submission?.submission_type}
                  </span>
                }
              />
              <DetailField
                label="Entity Type"
                value={
                  <span className="capitalize">{submission?.entity_type}</span>
                }
              />
              <DetailField label="Company" value={submission?.company_name} />
              <DetailField
                label="Submitted By"
                value={submission?.submitted_by_name}
              />
              <DetailField
                label="Submitted At"
                value={
                  submission?.submitted_at &&
                  format(new Date(submission.submitted_at), 'PPP p')
                }
              />
              {submission?.verified_at && (
                <DetailField
                  label="Verified At"
                  value={format(new Date(submission.verified_at), 'PPP p')}
                />
              )}
              {submission?.approved_at && (
                <DetailField
                  label="Approved At"
                  value={format(new Date(submission.approved_at), 'PPP p')}
                />
              )}
              {submission?.implemented_at && (
                <DetailField
                  label="Implemented At"
                  value={format(new Date(submission.implemented_at), 'PPP p')}
                />
              )}
              {submission?.rejection_reason && (
                <DetailField
                  label="Rejection Reason"
                  value={
                    <span className="text-destructive">
                      {submission.rejection_reason}
                    </span>
                  }
                />
              )}
            </DetailGrid>

            {submission?.submission_data &&
              Object.keys(submission.submission_data).length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Submission Data</h4>
                  <pre className="p-4 bg-muted rounded-md text-sm overflow-auto">
                    {JSON.stringify(submission.submission_data, null, 2)}
                  </pre>
                </div>
              )}
          </CardContent>
        </Card>

        {/* Approval History */}
        <Card>
          <CardHeader>
            <CardTitle>Approval History</CardTitle>
          </CardHeader>
          <CardContent>
            <ApprovalHistory
              approvals={approvals || []}
              loading={approvalsLoading}
            />
          </CardContent>
        </Card>
      </div>
    </DetailPage>
  )
}
