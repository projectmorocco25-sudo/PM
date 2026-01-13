'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { DataTable, Column } from '@/components/ui/data-table'
import { WorkflowStatusIndicator } from '@/components/rmm/workflow-status-indicator'
import { ApprovalHistoryInline } from '@/components/rmm/approval-history'
import { useRegistrySubmissions, useApprovalHistory, RegistrySubmission } from '@/hooks/use-rmm'
import { useUserRole } from '@/hooks/use-user-role'
import { format } from 'date-fns'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Task 1.1.2.26: Registry submission list page

export default function SubmissionsPage() {
  const router = useRouter()
  const { role, isMOH, userId } = useUserRole()
  const [statusFilter, setStatusFilter] = React.useState<string>('all')

  const { data: submissions, isLoading } = useRegistrySubmissions()

  // Filter submissions based on role
  const mySubmissions = submissions?.filter(
    (s) => s.submitted_by === userId
  ) || []

  const pendingApprovals = submissions?.filter((s) => {
    if (role === 'tier2_officer' || role === 'tier2_registrar') {
      return s.status === 'submitted' || s.status === 'tier1_approved'
    }
    if (role === 'tier1') {
      return s.status === 'tier2_verified' || s.status === 'tier2_peer_reviewed'
    }
    return false
  }) || []

  const allSubmissions = submissions || []

  const filterByStatus = (list: RegistrySubmission[]) => {
    if (statusFilter === 'all') return list
    return list.filter((s) => s.status === statusFilter)
  }

  const columns: Column<RegistrySubmission>[] = [
    {
      key: 'id',
      header: 'ID',
      render: (_, row) => (
        <span className="font-mono text-xs">{row.id.slice(0, 8)}</span>
      ),
    },
    {
      key: 'submission_type',
      header: 'Type',
      render: (value) => (
        <span className="capitalize">{String(value)}</span>
      ),
    },
    {
      key: 'entity_type',
      header: 'Entity',
      render: (value) => (
        <span className="capitalize">{String(value)}</span>
      ),
    },
    {
      key: 'company_name',
      header: 'Company',
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => (
        <WorkflowStatusIndicator
          status={value as RegistrySubmission['status']}
          size="sm"
        />
      ),
    },
    {
      key: 'submitted_at',
      header: 'Submitted',
      render: (value) =>
        value ? format(new Date(String(value)), 'MMM d, yyyy') : '—',
    },
    {
      key: 'submitted_by_name',
      header: 'Submitter',
    },
  ]

  const handleRowClick = (submission: RegistrySubmission) => {
    router.push(`/dashboard/rmm/submissions/${submission.id}`)
  }

  const mobileCardRender = (submission: RegistrySubmission) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs">{submission.id.slice(0, 8)}</span>
        <WorkflowStatusIndicator
          status={submission.status}
          size="sm"
        />
      </div>
      <div className="font-medium capitalize">
        {submission.submission_type} {submission.entity_type}
      </div>
      <div className="text-sm text-muted-foreground">
        {submission.company_name}
      </div>
      <div className="text-xs text-muted-foreground">
        {submission.submitted_at &&
          format(new Date(submission.submitted_at), 'PPP')}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Registry Submissions</h2>
        <p className="text-sm text-muted-foreground">
          {isMOH
            ? 'Review and process registry submissions'
            : 'View your registry submissions'}
        </p>
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="tier2_verified">Tier 2 Verified</SelectItem>
            <SelectItem value="tier2_peer_reviewed">Peer Reviewed</SelectItem>
            <SelectItem value="tier1_approved">Tier 1 Approved</SelectItem>
            <SelectItem value="tier2_implemented">Implemented</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue={isMOH ? 'pending' : 'my'}>
        <TabsList>
          {isMOH && (
            <TabsTrigger value="pending">
              Pending Actions
              {pendingApprovals.length > 0 && (
                <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {pendingApprovals.length}
                </span>
              )}
            </TabsTrigger>
          )}
          <TabsTrigger value="my">My Submissions</TabsTrigger>
          {isMOH && <TabsTrigger value="all">All Submissions</TabsTrigger>}
        </TabsList>

        {isMOH && (
          <TabsContent value="pending">
            <DataTable
              columns={columns}
              data={filterByStatus(pendingApprovals)}
              loading={isLoading}
              onRowClick={handleRowClick}
              emptyMessage="No pending submissions"
              mobileCardRender={mobileCardRender}
            />
          </TabsContent>
        )}

        <TabsContent value="my">
          <DataTable
            columns={columns}
            data={filterByStatus(mySubmissions)}
            loading={isLoading}
            onRowClick={handleRowClick}
            emptyMessage="You have no submissions"
            mobileCardRender={mobileCardRender}
          />
        </TabsContent>

        {isMOH && (
          <TabsContent value="all">
            <DataTable
              columns={columns}
              data={filterByStatus(allSubmissions)}
              loading={isLoading}
              onRowClick={handleRowClick}
              emptyMessage="No submissions found"
              mobileCardRender={mobileCardRender}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
