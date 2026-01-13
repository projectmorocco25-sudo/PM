'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DetailPage, DetailField, DetailGrid } from '@/components/ui/detail-page'
import { useWSLSubmissions, WSLSubmission, formatWeekEnding } from '@/hooks/use-vci'
import { useUserRole } from '@/hooks/use-user-role'
import { format } from 'date-fns'
import {
  Calendar,
  Building2,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Package,
  ExternalLink,
  History,
} from 'lucide-react'
import { SimpleHistoryTab } from '@/components/history/history-tab'

// Task 1.1.5.15: WSL submission detail page
// Task 1.1.5.30: History tab on WSL submission detail page

const STATUS_CONFIG: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  submitted: { label: 'Submitted', variant: 'secondary' },
  late: { label: 'Late', variant: 'destructive' },
  non_compliant: { label: 'Non-Compliant', variant: 'destructive' },
  accepted: { label: 'Accepted', variant: 'default' },
}

export default function WSLDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isMOH } = useUserRole()
  const submissionId = params.id as string

  // Fetch the specific submission
  const { data: submissionsData, isLoading } = useWSLSubmissions({ limit: 100 })
  const submission = submissionsData?.submissions?.find((s) => s.id === submissionId)

  const statusConfig = submission ? STATUS_CONFIG[submission.status] : STATUS_CONFIG.submitted

  return (
    <DetailPage
      title={submission ? formatWeekEnding(submission.week_ending_date) : 'WSL Submission'}
      subtitle={submission?.company_name}
      status={
        submission && (
          <div className="flex items-center gap-2">
            <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
            {submission.is_late && <Badge variant="destructive">Late</Badge>}
            {submission.is_non_compliant && (
              <Badge variant="destructive">Non-Compliant</Badge>
            )}
          </div>
        )
      }
      onBack={() => router.push('/dashboard/vci/wsl')}
      backLabel="Back to WSL"
      loading={isLoading}
    >
      <div className="space-y-6">
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
                label="Week Ending"
                value={
                  submission && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {format(new Date(submission.week_ending_date), 'PPPP')}
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
                    <Package className="h-3 w-3 mr-1" />
                    {submission?.sku_count || submission?.submission_data?.length || 0} SKU(s)
                  </Badge>
                }
              />
              <DetailField
                label="Breaches"
                value={
                  (submission?.breach_count || 0) > 0 ? (
                    <Badge variant="destructive" className="gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {submission?.breach_count} breach(es)
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      No breaches
                    </Badge>
                  )
                }
              />
            </DetailGrid>
          </CardContent>
        </Card>

        {/* Stock Levels Table */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-2 text-left text-sm font-medium">SKU ID</th>
                    <th className="px-4 py-2 text-right text-sm font-medium">Stock Level</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Reason</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Replenishment</th>
                  </tr>
                </thead>
                <tbody>
                  {submission?.submission_data?.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2 font-mono text-sm">
                        {item.sku_id.slice(0, 8)}...
                      </td>
                      <td className="px-4 py-2 text-right font-mono">
                        {item.stock_level.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-sm text-muted-foreground">
                        {item.breach_reason || '—'}
                      </td>
                      <td className="px-4 py-2 text-sm text-muted-foreground">
                        {item.replenishment_date
                          ? format(new Date(item.replenishment_date), 'MMM d, yyyy')
                          : '—'}
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* View Breaches Link */}
        {(submission?.breach_count || 0) > 0 && (
          <Card>
            <CardContent className="py-4">
              <Button variant="outline" asChild>
                <Link href={`/dashboard/vci/breaches?wsl=${submissionId}`}>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  View {submission?.breach_count} Breach(es)
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* History Tab - Task 1.1.5.30 */}
        <SimpleHistoryTab
          entityType="wsl_submission"
          entityId={submissionId}
          entityName={submission ? formatWeekEnding(submission.week_ending_date) : undefined}
        />
      </div>
    </DetailPage>
  )
}
