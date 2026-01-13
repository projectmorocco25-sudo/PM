'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { DataTable, Column } from '@/components/ui/data-table'
import { EnforcementStatusBadge, EnforcementTypeBadge } from '@/components/enforcement/enforcement-status-badge'
import { useEnforcementActions, EnforcementAction } from '@/hooks/use-enforcement'
import { useUserRole } from '@/hooks/use-user-role'
import { RoleGuard } from '@/components/guards/role-guard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { format } from 'date-fns'

// Task 1.1.2.41: Pending approvals page

export default function PendingApprovalsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { role } = useUserRole()

  const defaultTab = searchParams.get('status') || 'pending_review'

  const { data: reviewData, isLoading: reviewLoading } = useEnforcementActions({
    status: 'pending_review',
    limit: 50,
  })

  const { data: approvalData, isLoading: approvalLoading } = useEnforcementActions({
    status: 'pending_approval',
    limit: 50,
  })

  const pendingReview = reviewData?.actions || []
  const pendingApproval = approvalData?.actions || []

  const isTier1 = role === 'tier1'

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
      key: 'fine_amount',
      header: 'Fine',
      render: (value, row) =>
        row.action_type === 'fine' && value
          ? `${Number(value).toLocaleString()} MAD`
          : '—',
    },
    {
      key: 'created_by_name',
      header: 'Created By',
    },
    {
      key: 'created_at',
      header: 'Created',
      render: (value) => format(new Date(String(value)), 'MMM d, yyyy'),
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
      <div className="text-xs text-muted-foreground">
        By {action.created_by_name} • {format(new Date(action.created_at), 'PPP')}
      </div>
    </div>
  )

  return (
    <RoleGuard allowedRoles={['tier1', 'tier2_officer', 'tier2_registrar']}>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Pending Approvals</h2>
          <p className="text-sm text-muted-foreground">
            Review and approve enforcement actions
          </p>
        </div>

        <Tabs defaultValue={defaultTab}>
          <TabsList>
            <TabsTrigger value="pending_review">
              Pending Review
              {pendingReview.length > 0 && (
                <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {pendingReview.length}
                </span>
              )}
            </TabsTrigger>
            {isTier1 && (
              <TabsTrigger value="pending_approval">
                Pending Approval
                {pendingApproval.length > 0 && (
                  <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                    {pendingApproval.length}
                  </span>
                )}
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="pending_review">
            <DataTable
              columns={columns}
              data={pendingReview}
              loading={reviewLoading}
              onRowClick={handleRowClick}
              emptyMessage="No actions pending review"
              mobileCardRender={mobileCardRender}
            />
          </TabsContent>

          {isTier1 && (
            <TabsContent value="pending_approval">
              <DataTable
                columns={columns}
                data={pendingApproval}
                loading={approvalLoading}
                onRowClick={handleRowClick}
                emptyMessage="No actions pending approval"
                mobileCardRender={mobileCardRender}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </RoleGuard>
  )
}
