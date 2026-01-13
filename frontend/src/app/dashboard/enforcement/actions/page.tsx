'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DataTable, Column } from '@/components/ui/data-table'
import { EnforcementStatusBadge, EnforcementTypeBadge } from '@/components/enforcement/enforcement-status-badge'
import { useEnforcementActions, EnforcementAction, ActionStatus, ActionType } from '@/hooks/use-enforcement'
import { useCompanies } from '@/hooks/use-rmm'
import { useUserRole } from '@/hooks/use-user-role'
import { format } from 'date-fns'
import { Plus } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Task 1.1.2.38: Enforcement actions list page

export default function EnforcementActionsPage() {
  const router = useRouter()
  const { isMOH } = useUserRole()

  const [filters, setFilters] = React.useState({
    company_id: undefined as string | undefined,
    status: undefined as string | undefined,
    action_type: undefined as string | undefined,
    limit: 10,
    offset: 0,
  })

  const { data, isLoading } = useEnforcementActions(filters)
  const { data: companiesData } = useCompanies({ limit: 100 })

  const actions = data?.actions || []
  const total = data?.total || 0
  const companies = companiesData?.companies || []

  const columns: Column<EnforcementAction>[] = [
    {
      key: 'id',
      header: 'ID',
      render: (_, row) => (
        <span className="font-mono text-xs">{row.id.slice(0, 8)}</span>
      ),
    },
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
      key: 'status',
      header: 'Status',
      render: (_, row) => <EnforcementStatusBadge status={row.status} />,
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
      key: 'created_at',
      header: 'Created',
      render: (value) => format(new Date(String(value)), 'MMM d, yyyy'),
    },
  ]

  const handleRowClick = (action: EnforcementAction) => {
    router.push(`/dashboard/enforcement/actions/${action.id}`)
  }

  const handlePageChange = (page: number) => {
    setFilters((f) => ({ ...f, offset: (page - 1) * f.limit }))
  }

  const mobileCardRender = (action: EnforcementAction) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <EnforcementTypeBadge type={action.action_type} />
        <EnforcementStatusBadge status={action.status} />
      </div>
      <div className="font-medium">{action.company_name}</div>
      <div className="text-sm text-muted-foreground">{action.violation_type}</div>
      {action.action_type === 'fine' && action.fine_amount && (
        <div className="text-sm font-medium text-destructive">
          {Number(action.fine_amount).toLocaleString()} MAD
        </div>
      )}
      <div className="text-xs text-muted-foreground">
        {format(new Date(action.created_at), 'PPP')}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Enforcement Actions</h2>
          <p className="text-sm text-muted-foreground">
            View and manage all enforcement actions
          </p>
        </div>
        {isMOH && (
          <Button asChild>
            <Link href="/dashboard/enforcement/actions/new">
              <Plus className="mr-2 h-4 w-4" />
              New Action
            </Link>
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select
          value={filters.action_type || 'all'}
          onValueChange={(v) =>
            setFilters((f) => ({
              ...f,
              action_type: v === 'all' ? undefined : v,
              offset: 0,
            }))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Action Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="fine">Fine</SelectItem>
            <SelectItem value="suspension">Suspension</SelectItem>
            <SelectItem value="license_revocation">License Revocation</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.status || 'all'}
          onValueChange={(v) =>
            setFilters((f) => ({
              ...f,
              status: v === 'all' ? undefined : v,
              offset: 0,
            }))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="pending_review">Pending Review</SelectItem>
            <SelectItem value="pending_approval">Pending Approval</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="executed">Executed</SelectItem>
            <SelectItem value="appealed">Under Appeal</SelectItem>
            <SelectItem value="appeal_upheld">Appeal Upheld</SelectItem>
            <SelectItem value="appeal_rejected">Appeal Rejected</SelectItem>
          </SelectContent>
        </Select>

        {isMOH && (
          <Select
            value={filters.company_id || 'all'}
            onValueChange={(v) =>
              setFilters((f) => ({
                ...f,
                company_id: v === 'all' ? undefined : v,
                offset: 0,
              }))
            }
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Companies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Companies</SelectItem>
              {companies.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <DataTable
        columns={columns}
        data={actions}
        total={total}
        page={Math.floor(filters.offset / filters.limit) + 1}
        pageSize={filters.limit}
        onPageChange={handlePageChange}
        onPageSizeChange={(size) =>
          setFilters((f) => ({ ...f, limit: size, offset: 0 }))
        }
        onRowClick={handleRowClick}
        loading={isLoading}
        emptyMessage="No enforcement actions found"
        mobileCardRender={mobileCardRender}
      />
    </div>
  )
}
