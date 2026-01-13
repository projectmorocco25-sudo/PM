'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DataTable, Column } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { useWSLSubmissions, WSLSubmission, formatWeekEnding } from '@/hooks/use-vci'
import { useUserRole } from '@/hooks/use-user-role'
import { format } from 'date-fns'
import { Plus, Calendar, AlertTriangle, X } from 'lucide-react'
import { Button as Btn } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Task 1.1.5.13: WSL submissions list page
// Task 1.1.5.35: Week filter with query parameters

const STATUS_CONFIG: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  submitted: { label: 'Submitted', variant: 'secondary' },
  late: { label: 'Late', variant: 'destructive' },
  non_compliant: { label: 'Non-Compliant', variant: 'destructive' },
  accepted: { label: 'Accepted', variant: 'default' },
}

export default function WSLListPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isMOH } = useUserRole()

  // Task 1.1.5.35: Read week from URL query params
  const weekParam = searchParams.get('week')

  const [weekFilter, setWeekFilter] = React.useState(weekParam || '')
  const [filters, setFilters] = React.useState({
    status: undefined as string | undefined,
    limit: 10,
    offset: 0,
  })

  // Sync URL params when filter changes
  React.useEffect(() => {
    const params = new URLSearchParams()
    if (weekFilter) {
      params.set('week', weekFilter)
    }
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname
    window.history.replaceState({}, '', newUrl)
  }, [weekFilter])

  const { data: submissionsData, isLoading } = useWSLSubmissions(filters)

  const submissions = submissionsData?.submissions || []
  const total = submissionsData?.total || 0

  const columns: Column<WSLSubmission>[] = [
    {
      key: 'week_ending_date',
      header: 'Week Ending',
      render: (value) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">
            {format(new Date(String(value)), 'MMM d, yyyy')}
          </span>
        </div>
      ),
    },
    ...(isMOH
      ? [{ key: 'company_name' as keyof WSLSubmission, header: 'Company' }]
      : []),
    {
      key: 'sku_count',
      header: 'SKUs',
      render: (value) => <Badge variant="outline">{value} SKU(s)</Badge>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (_, row) => {
        const config = STATUS_CONFIG[row.status] || STATUS_CONFIG.submitted
        return <Badge variant={config.variant}>{config.label}</Badge>
      },
    },
    {
      key: 'breach_count',
      header: 'Breaches',
      render: (value) =>
        Number(value) > 0 ? (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            {value}
          </Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      key: 'submitted_at',
      header: 'Submitted',
      render: (value) =>
        value ? format(new Date(String(value)), 'MMM d, yyyy HH:mm') : '—',
    },
  ]

  const handleRowClick = (submission: WSLSubmission) => {
    router.push(`/dashboard/vci/wsl/${submission.id}`)
  }

  const handlePageChange = (page: number) => {
    setFilters((f) => ({ ...f, offset: (page - 1) * f.limit }))
  }

  const mobileCardRender = (submission: WSLSubmission) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">
            {format(new Date(submission.week_ending_date), 'MMM d, yyyy')}
          </span>
        </div>
        <Badge variant={STATUS_CONFIG[submission.status]?.variant || 'secondary'}>
          {STATUS_CONFIG[submission.status]?.label || submission.status}
        </Badge>
      </div>
      {isMOH && (
        <div className="text-sm text-muted-foreground">{submission.company_name}</div>
      )}
      <div className="flex items-center gap-4 text-sm">
        <Badge variant="outline">{submission.sku_count} SKU(s)</Badge>
        {(submission.breach_count || 0) > 0 && (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            {submission.breach_count} breach(es)
          </Badge>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">WSL Submissions</h2>
          <p className="text-sm text-muted-foreground">
            Weekly Stock Level declarations
          </p>
        </div>
        {!isMOH && (
          <Button asChild>
            <Link href="/dashboard/vci/wsl/new">
              <Plus className="mr-2 h-4 w-4" />
              Submit WSL
            </Link>
          </Button>
        )}
      </div>

      {/* Filters - Task 1.1.5.35: Week filter */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <input
            type="week"
            value={weekFilter}
            onChange={(e) => setWeekFilter(e.target.value)}
            className="flex h-9 w-[180px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
          {weekFilter && (
            <Btn variant="ghost" size="sm" onClick={() => setWeekFilter('')} className="h-8 px-2">
              <X className="h-4 w-4" />
            </Btn>
          )}
        </div>

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
            {Object.entries(STATUS_CONFIG).map(([value, config]) => (
              <SelectItem key={value} value={value}>
                {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={submissions}
        total={total}
        page={Math.floor(filters.offset / filters.limit) + 1}
        pageSize={filters.limit}
        onPageChange={handlePageChange}
        onPageSizeChange={(size) =>
          setFilters((f) => ({ ...f, limit: size, offset: 0 }))
        }
        onRowClick={handleRowClick}
        loading={isLoading}
        emptyMessage="No WSL submissions found"
        mobileCardRender={mobileCardRender}
      />
    </div>
  )
}
