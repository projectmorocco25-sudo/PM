'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DetailPage, DetailField, DetailGrid } from '@/components/ui/detail-page'
import { BreachDetailCard } from '@/components/vci/breach-components'
import { BreachAnalysisForm, BreachApprovalForm } from '@/components/vci/breach-analysis-form'
import { ApprovalHistory } from '@/components/rmm/approval-history'
import { useBreach, BreachAnalysis } from '@/hooks/use-vci'
import { useApprovalHistory } from '@/hooks/use-rmm'
import { useUserRole } from '@/hooks/use-user-role'
import { format } from 'date-fns'
import { Clock, User, FileText, AlertCircle, History } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { SimpleHistoryTab } from '@/components/history/history-tab'

// Task 1.1.5.17: Breach detail page
// Task 1.1.5.31: History tab on Breach detail page

export default function BreachDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { role, isMOH } = useUserRole()
  const breachId = params.id as string

  const { data: breachData, isLoading, refetch } = useBreach(breachId)
  const { data: approvals, isLoading: approvalsLoading } = useApprovalHistory(breachId)

  const breach = breachData?.breach
  const analyses = breachData?.analyses || []
  const deadlineInfo = breachData?.deadline_info as {
    deadline?: string
    is_overdue?: boolean
    working_days_allowed?: number
  } | undefined

  const isTier1 = role === 'tier1'
  const isTier2 = role === 'tier2_officer' || role === 'tier2_registrar'

  const canAnalyze = isTier2 && breach?.status === 'detected' || breach?.status === 'tier2_analyzing'
  const canApprove = isTier1 && breach?.status === 'tier2_suggested'

  // Get latest analysis
  const latestAnalysis = analyses[0]

  // Count rejections
  const rejectionCount = approvals?.filter(
    (a) => a.action === 'review' && a.status === 'rejected'
  ).length || 0

  return (
    <DetailPage
      title={breach ? `Breach: ${breach.sku_name}` : 'Breach Details'}
      subtitle={breach?.company_name}
      onBack={() => router.push('/dashboard/vci/breaches')}
      backLabel="Back to Breaches"
      loading={isLoading}
    >
      {breach && (
        <div className="space-y-6">
          {/* Deadline Warning */}
          {deadlineInfo?.is_overdue && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Analysis Overdue</AlertTitle>
              <AlertDescription>
                This breach is past its analysis deadline of {deadlineInfo.working_days_allowed} working day(s).
              </AlertDescription>
            </Alert>
          )}

          {/* Deadline Info */}
          {deadlineInfo?.deadline && !deadlineInfo.is_overdue && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertTitle>Analysis Deadline</AlertTitle>
              <AlertDescription>
                Must be analyzed by {format(new Date(deadlineInfo.deadline), 'PPP')}
                ({deadlineInfo.working_days_allowed} working day{deadlineInfo.working_days_allowed !== 1 ? 's' : ''} allowed)
              </AlertDescription>
            </Alert>
          )}

          {/* Task 1.1.5.17a: BreachDetailCard */}
          <BreachDetailCard breach={breach} />

          {/* Task 1.1.5.18: Analysis Form for Tier 2 */}
          {canAnalyze && (
            <BreachAnalysisForm breach={breach} onSuccess={() => refetch()} />
          )}

          {/* Task 1.1.5.19: Approval Form for Tier 1 */}
          {canApprove && (
            <BreachApprovalForm
              breach={breach}
              suggestedAction={latestAnalysis?.suggested_action}
              rejectionCount={rejectionCount}
              onSuccess={() => refetch()}
            />
          )}

          {/* Analysis History */}
          {analyses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Analysis History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyses.map((analysis) => (
                    <div
                      key={analysis.id}
                      className="p-4 rounded-lg border space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{analysis.analyzed_by_name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(analysis.analyzed_at), 'PPP p')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="capitalize">
                          {analysis.suggested_action.replace('_', ' ')}
                        </Badge>
                      </div>
                      {analysis.suggested_action_details && (
                        <div className="text-sm text-muted-foreground">
                          {analysis.suggested_action_details}
                        </div>
                      )}
                      {analysis.analysis_notes && (
                        <div className="text-sm p-2 bg-muted rounded">
                          <FileText className="h-3 w-3 inline mr-1" />
                          {analysis.analysis_notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Approval History */}
          <Card>
            <CardHeader>
              <CardTitle>Workflow History</CardTitle>
            </CardHeader>
            <CardContent>
              <ApprovalHistory approvals={approvals || []} loading={approvalsLoading} />
            </CardContent>
          </Card>

          {/* History Tab - Task 1.1.5.31 */}
          <SimpleHistoryTab
            entityType="breach"
            entityId={breachId}
            entityName={breach?.sku_name}
          />
        </div>
      )}
    </DetailPage>
  )
}
