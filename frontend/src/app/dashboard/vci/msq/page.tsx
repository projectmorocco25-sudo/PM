'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DataTable, Column } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MSQStatusBadge } from '@/components/vci/validation-status-indicator'
import { GracePeriodBadge } from '@/components/vci/correction-interface'
import { useMSQSubmissions, MSQSubmission, getMonthName } from '@/hooks/use-vci'
import { useUserRole } from '@/hooks/use-user-role'
import { format } from 'date-fns'
import { Plus, Calendar, Flag } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Task 1.1.4.8: MSQ submissions list page
// Task 1.1.5.34: Year/month filters with query parameters

export default function MSQListPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isMOH, userCompanyId } = useUserRole()
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1

  // Task 1.1.5.34: Read year/month from URL query params
  const yearParam = searchParams.get('year')
  const monthParam = searchParams.get('month')
  const defaultYear = yearParam ? parseInt(yearParam) : currentYear
  const defaultMonth = monthParam ? parseInt(monthParam) : undefined

  const [tab, setTab] = React.useState<'all' | 'flagged'>('all')
  const [filters, setFilters] = React.useState({
    year: defaultYear as number | undefined,
    month: defaultMonth as number | undefined,
    status: undefined as string | undefined,
    limit: 10,
    offset: 0,
  })

  // Sync URL params when filter changes
  React.useEffect(() => {
    const params = new URLSearchParams()
    if (filters.year && filters.year !== currentYear) {
      params.set('year', filters.year.toString())
    }
    if (filters.month) {
      params.set('month', filters.month.toString())
    }
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname
    window.history.replaceState({}, '', newUrl)
  }, [filters.year, filters.month, currentYear])

  // Adjust status filter based on tab
  const effectiveFilters = React.useMemo(() => ({
    ...filters,
    status: tab === 'flagged' ? 'flagged_for_review' : filters.status,
  }), [filters, tab])

  const { data: submissionsData, isLoading } = useMSQSubmissions(effectiveFilters)

  const submissions = submissionsData?.submissions || []
  const total = submissionsData?.total || 0

  // Check if current month submission exists
  const hasCurrentMonthSubmission = !isMOH && submissions.some(
    (s) => s.year === currentYear && s.month === currentMonth && s.status !== 'rejected'
  )

  const columns: Column<MSQSubmission>[] = [
    {
      key: 'year',
      header: 'Period',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">
            {getMonthName(row.month)} {row.year}
          </span>
        </div>
      ),
    },
    ...(isMOH
      ? [
          {
            key: 'company_name' as keyof MSQSubmission,
            header: 'Company',
          },
        ]
      : []),
    {
      key: 'submission_data',
      header: 'SKUs',
      render: (_, row) => (
        <Badge variant="outline">
          {row.submission_data?.length || 0} SKU(s)
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (_, row) => <MSQStatusBadge status={row.status} />,
    },
    {
      key: 'validation_flags',
      header: 'Flags',
      render: (_, row) => {
        const anomalies = row.validation_flags?.filter((f) => f.type === 'anomaly') || []
        const warnings = row.validation_flags?.filter((f) => f.type === 'warning') || []
        if (anomalies.length === 0 && warnings.length === 0) return '—'
        return (
          <div className="flex gap-1">
            {anomalies.length > 0 && (
              <Badge variant="default" className="text-xs">
                {anomalies.length} anomaly
              </Badge>
            )}
            {warnings.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {warnings.length} warning
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      key: 'submitted_at',
      header: 'Submitted',
      render: (value) =>
        value ? format(new Date(String(value)), 'MMM d, yyyy') : '—',
    },
    ...(!isMOH
      ? [
          {
            key: 'within_grace_period' as keyof MSQSubmission,
            header: 'Grace',
            render: (_: unknown, row: MSQSubmission) =>
              row.submitted_at && row.status === 'submitted' ? (
                <GracePeriodBadge submittedAt={row.submitted_at} />
              ) : (
                '—'
              ),
          },
        ]
      : []),
  ]

  const handleRowClick = (submission: MSQSubmission) => {
    router.push(`/dashboard/vci/msq/${submission.id}`)
  }

  const handlePageChange = (page: number) => {
    setFilters((f) => ({ ...f, offset: (page - 1) * f.limit }))
  }

  const mobileCardRender = (submission: MSQSubmission) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">
            {getMonthName(submission.month)} {submission.year}
          </span>
        </div>
        <MSQStatusBadge status={submission.status} />
      </div>
      {isMOH && (
        <div className="text-sm text-muted-foreground">{submission.company_name}</div>
      )}
      <div className="flex items-center justify-between text-sm">
        <Badge variant="outline">{submission.submission_data?.length || 0} SKU(s)</Badge>
        {submission.submitted_at && submission.status === 'submitted' && !isMOH && (
          <GracePeriodBadge submittedAt={submission.submitted_at} />
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">MSQ Submissions</h2>
          <p className="text-sm text-muted-foreground">
            Monthly Sales Quantity declarations
          </p>
        </div>
        {!isMOH && (
          <Button asChild>
            <Link href="/dashboard/vci/msq/new">
              <Plus className="mr-2 h-4 w-4" />
              Submit MSQ
            </Link>
          </Button>
        )}
      </div>

      {/* Tabs for MOH */}
      {isMOH && (
        <Tabs value={tab} onValueChange={(v) => setTab(v as 'all' | 'flagged')}>
          <TabsList>
            <TabsTrigger value="all">All Submissions</TabsTrigger>
            <TabsTrigger value="flagged" className="gap-2">
              <Flag className="h-4 w-4" />
              Flagged for Review
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select
          value={filters.year?.toString() || 'all'}
          onValueChange={(v) =>
            setFilters((f) => ({
              ...f,
              year: v === 'all' ? undefined : parseInt(v),
              offset: 0,
            }))
          }
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {Array.from({ length: 3 }, (_, i) => currentYear - i).map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.month?.toString() || 'all'}
          onValueChange={(v) =>
            setFilters((f) => ({
              ...f,
              month: v === 'all' ? undefined : parseInt(v),
              offset: 0,
            }))
          }
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Months</SelectItem>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <SelectItem key={month} value={month.toString()}>
                {getMonthName(month)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {tab !== 'flagged' && (
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
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="flagged_for_review">Flagged for Review</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        )}
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
        emptyMessage={
          tab === 'flagged'
            ? 'No flagged submissions'
            : 'No MSQ submissions found'
        }
        mobileCardRender={mobileCardRender}
      />
    </div>
  )
}
