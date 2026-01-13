'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { DataTable, Column } from '@/components/ui/data-table'
import { EnforcementStatusBadge, EnforcementTypeBadge } from '@/components/enforcement/enforcement-status-badge'
import { Badge } from '@/components/ui/badge'
import { useEnforcementActions, EnforcementAction } from '@/hooks/use-enforcement'
import { useUserRole } from '@/hooks/use-user-role'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { format, differenceInDays } from 'date-fns'
import { Scale, Clock, CheckCircle2, XCircle } from 'lucide-react'

// Task 1.1.2.43: Appeal review interface (combined with appeals list)

export default function AppealsPage() {
  const router = useRouter()
  const { isMOH, userCompanyId } = useUserRole()

  const { data: appealedData, isLoading: appealedLoading } = useEnforcementActions({
    status: 'appealed',
    limit: 50,
  })

  const { data: upheldData, isLoading: upheldLoading } = useEnforcementActions({
    status: 'appeal_upheld',
    limit: 50,
  })

  const { data: rejectedData, isLoading: rejectedLoading } = useEnforcementActions({
    status: 'appeal_rejected',
    limit: 50,
  })

  // For companies, also get their executed actions that can still be appealed
  const { data: executedData, isLoading: executedLoading } = useEnforcementActions({
    status: 'executed',
    company_id: !isMOH ? userCompanyId : undefined,
    limit: 50,
  })

  const appealedActions = appealedData?.actions || []
  const upheldActions = upheldData?.actions || []
  const rejectedActions = rejectedData?.actions || []
  const executedActions = (executedData?.actions || []).filter(a => {
    if (!a.executed_at) return false
    const daysSinceExecution = differenceInDays(new Date(), new Date(a.executed_at))
    return daysSinceExecution <= 30
  })

  const columns: Column<EnforcementAction>[] = [
    {
      key: 'action_type',
      header: 'Type',
      render: (_, row) => <EnforcementTypeBadge type={row.action_type} />,
    },
    {
      key: 'company_name',
      header: 'Company',
    },
    {
      key: 'violation_type',
      header: 'Violation',
    },
    {
      key: 'appeal_grounds',
      header: 'Appeal Grounds',
      render: (value) => value || '—',
    },
    {
      key: 'appeal_submitted_at',
      header: 'Submitted',
      render: (value) => value ? format(new Date(String(value)), 'MMM d, yyyy') : '—',
    },
    {
      key: 'status',
      header: 'Status',
      render: (_, row) => <EnforcementStatusBadge status={row.status} />,
    },
  ]

  const appealableColumns: Column<EnforcementAction>[] = [
    {
      key: 'action_type',
      header: 'Type',
      render: (_, row) => <EnforcementTypeBadge type={row.action_type} />,
    },
    {
      key: 'violation_type',
      header: 'Violation',
    },
    {
      key: 'executed_at',
      header: 'Executed',
      render: (value) => value ? format(new Date(String(value)), 'MMM d, yyyy') : '—',
    },
    {
      key: 'id',
      header: 'Days Left',
      render: (_, row) => {
        if (!row.executed_at) return '—'
        const daysLeft = 30 - differenceInDays(new Date(), new Date(row.executed_at))
        return (
          <Badge variant={daysLeft <= 7 ? 'destructive' : 'secondary'}>
            {daysLeft} days
          </Badge>
        )
      },
    },
  ]

  const handleRowClick = (action: EnforcementAction) => {
    router.push(`/dashboard/enforcement/actions/${action.id}`)
  }

  const mobileCardRender = (action: EnforcementAction) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <EnforcementTypeBadge type={action.action_type} />
        <EnforcementStatusBadge status={action.status} />
      </div>
      <div className="font-medium">{action.company_name}</div>
      <div className="text-sm text-muted-foreground">{action.violation_type}</div>
      {action.appeal_grounds && (
        <div className="text-sm">
          <span className="text-muted-foreground">Grounds:</span> {action.appeal_grounds}
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Scale className="h-5 w-5" />
          Appeals
        </h2>
        <p className="text-sm text-muted-foreground">
          {isMOH ? 'Review and resolve enforcement appeals' : 'View and submit appeals'}
        </p>
      </div>

      <Tabs defaultValue={isMOH ? 'pending' : 'appealable'}>
        <TabsList>
          {!isMOH && executedActions.length > 0 && (
            <TabsTrigger value="appealable">
              Can Appeal
              <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {executedActions.length}
              </span>
            </TabsTrigger>
          )}
          <TabsTrigger value="pending">
            <Clock className="mr-1 h-3 w-3" />
            Pending
            {appealedActions.length > 0 && (
              <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {appealedActions.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="upheld">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Upheld
          </TabsTrigger>
          <TabsTrigger value="rejected">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </TabsTrigger>
        </TabsList>

        {!isMOH && (
          <TabsContent value="appealable">
            <DataTable
              columns={appealableColumns}
              data={executedActions}
              loading={executedLoading}
              onRowClick={handleRowClick}
              emptyMessage="No actions eligible for appeal"
              mobileCardRender={mobileCardRender}
            />
          </TabsContent>
        )}

        <TabsContent value="pending">
          <DataTable
            columns={columns}
            data={appealedActions}
            loading={appealedLoading}
            onRowClick={handleRowClick}
            emptyMessage="No pending appeals"
            mobileCardRender={mobileCardRender}
          />
        </TabsContent>

        <TabsContent value="upheld">
          <DataTable
            columns={columns}
            data={upheldActions}
            loading={upheldLoading}
            onRowClick={handleRowClick}
            emptyMessage="No upheld appeals"
            mobileCardRender={mobileCardRender}
          />
        </TabsContent>

        <TabsContent value="rejected">
          <DataTable
            columns={columns}
            data={rejectedActions}
            loading={rejectedLoading}
            onRowClick={handleRowClick}
            emptyMessage="No rejected appeals"
            mobileCardRender={mobileCardRender}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
