'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DetailPage,
  DetailField,
  DetailGrid,
} from '@/components/ui/detail-page'
import { ThresholdDisplay } from '@/components/vci/threshold-display'
import { AAMSWorkflowActions } from '@/components/vci/aams-workflow-actions'
import { ApprovalHistory } from '@/components/rmm/approval-history'
import { useAAMSSubmission } from '@/hooks/use-vci'
import { useApprovalHistory } from '@/hooks/use-rmm'
import { useUserRole } from '@/hooks/use-user-role'
import { format } from 'date-fns'
import {
  Calendar,
  Building2,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  History,
} from 'lucide-react'
import { SimpleHistoryTab } from '@/components/history/history-tab'

// Task 1.1.3.14: AAMS submission detail page
// Task 1.1.5.28: History tab on AAMS submission detail page

const STATUS_CONFIG: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: 'Draft', variant: 'outline' },
  submitted: { label: 'Submitted', variant: 'secondary' },
  verified: { label: 'Verified', variant: 'secondary' },
  approved: { label: 'Approved', variant: 'default' },
  completed: { label: 'Completed', variant: 'default' },
  rejected: { label: 'Rejected', variant: 'destructive' },
}

export default function AAMSDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isMOH } = useUserRole()
  const submissionId = params.id as string

  const { data: submissionData, isLoading, refetch } = useAAMSSubmission(submissionId)
  const { data: approvals, isLoading: approvalsLoading } = useApprovalHistory(submissionId)

  const submission = submissionData?.submission
  const thresholds = submissionData?.thresholds || []

  const statusConfig = submission ? STATUS_CONFIG[submission.status] : STATUS_CONFIG.draft

  // Can company view thresholds? Only after verification
  const canViewThresholds = isMOH || 
    (submission && ['verified', 'approved', 'completed'].includes(submission.status))

  return (
    <DetailPage
      title={`AAMS ${submission?.year || ''}`}
      subtitle={submission?.company_name}
      status={
        submission && (
          <div className="flex items-center gap-2">
            <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
            {submission.is_late && <Badge variant="destructive">Late</Badge>}
          </div>
        )
      }
      onBack={() => router.push('/dashboard/vci/aams')}
      backLabel="Back to AAMS"
      loading={isLoading}
    >
      <div className="space-y-6">
        {/* Workflow Actions */}
        {submission && (
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <AAMSWorkflowActions
                submissionId={submissionId}
                status={submission.status}
                onSuccess={() => refetch()}
              />
              {!isMOH && submission.status === 'submitted' && (
                <p className="text-sm text-muted-foreground mt-2">
                  Your submission is being reviewed by MOH. Thresholds will be visible after verification.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Submission Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Submission Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DetailGrid columns={2}>
              <DetailField
                label="Year"
                value={
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {submission?.year}
                  </div>
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
                label="Total AAMS"
                value={
                  <span className="font-mono text-lg">
                    {submission?.aams_value.toLocaleString()}
                  </span>
                }
              />
              <DetailField
                label="Status"
                value={
                  submission && (
                    <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                  )
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
                label="Timing"
                value={
                  submission?.is_late ? (
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertTriangle className="h-4 w-4" />
                      Late Submission
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      On Time
                    </div>
                  )
                }
              />
              {submission?.verified_at && (
                <DetailField
                  label="Verified"
                  value={`${format(new Date(submission.verified_at), 'PPP')} by ${submission.verified_by_name}`}
                />
              )}
              {submission?.approved_at && (
                <DetailField
                  label="Approved"
                  value={`${format(new Date(submission.approved_at), 'PPP')} by ${submission.approved_by_name}`}
                />
              )}
            </DetailGrid>
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
                    <th className="px-4 py-2 text-right text-sm font-medium">Annual Quantity</th>
                    <th className="px-4 py-2 text-right text-sm font-medium">Monthly Avg (AAMS)</th>
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
                      <td className="px-4 py-2 text-right font-mono">
                        {(item.quantity / 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Calculated Thresholds - Task 1.1.3.14a */}
        {canViewThresholds && thresholds.length > 0 && (
          <ThresholdDisplay thresholds={thresholds} />
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

        {/* History Tab - Task 1.1.5.28 */}
        <SimpleHistoryTab
          entityType="aams_submission"
          entityId={submissionId}
          entityName={`AAMS ${submission?.year}`}
        />
      </div>
    </DetailPage>
  )
}
