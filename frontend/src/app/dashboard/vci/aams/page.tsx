'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DataTable, Column } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { DeadlineIndicator } from '@/components/vci/deadline-indicator'
import { useAAMSSubmissions, AAMSSubmission } from '@/hooks/use-vci'
import { useUserRole } from '@/hooks/use-user-role'
import { format } from 'date-fns'
import { Plus, Calendar, History } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Task 1.1.3.12: AAMS submissions list page
// Task 1.1.5.33: Year filter with query parameters

const STATUS_CONFIG: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: 'Draft', variant: 'outline' },
  submitted: { label: 'Submitted', variant: 'secondary' },
  verified: { label: 'Verified', variant: 'secondary' },
  approved: { label: 'Approved', variant: 'default' },
  completed: { label: 'Completed', variant: 'default' },
  rejected: { label: 'Rejected', variant: 'destructive' },
}

export default function AAMSListPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isMOH, userCompanyId } = useUserRole()
  const currentYear = new Date().getFullYear()

  // Task 1.1.5.33: Read year from URL query params, default to current year
  const yearParam = searchParams.get('year')
  const defaultYear = yearParam ? parseInt(yearParam) : currentYear

  const [filters, setFilters] = React.useState({
    year: defaultYear as number | undefined,
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
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname
    window.history.replaceState({}, '', newUrl)
  }, [filters.year, currentYear])

  const { data: submissionsData, isLoading } = useAAMSSubmissions(filters)

  const submissions = submissionsData?.submissions || []
  const total = submissionsData?.total || 0

  // For companies, check if they have a submission for current year
  const hasCurrentYearSubmission = !isMOH && submissions.some(
    (s) => s.year === currentYear && s.status !== 'rejected'
  )

  const columns: Column<AAMSSubmission>[] = [
    {
      key: 'year',
      header: 'Year',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.year}</span>
        </div>
      ),
    },
    ...(isMOH
      ? [
          {
            key: 'company_name' as keyof AAMSSubmission,
            header: 'Company',
          },
        ]
      : []),
    {
      key: 'aams_value',
      header: 'AAMS Value',
      render: (value) => (
        <span className="font-mono">{Number(value).toLocaleString()}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (_, row) => {
        const config = STATUS_CONFIG[row.status] || STATUS_CONFIG.draft
        return <Badge variant={config.variant}>{config.label}</Badge>
      },
    },
    {
      key: 'is_late',
      header: 'Timing',
      render: (_, row) =>
        row.is_late ? (
          <Badge variant="destructive">Late</Badge>
        ) : (
          <Badge variant="outline">On Time</Badge>
        ),
    },
    {
      key: 'submitted_at',
      header: 'Submitted',
      render: (value) =>
        value ? format(new Date(String(value)), 'MMM d, yyyy') : '—',
    },
  ]

  const handleRowClick = (submission: AAMSSubmission) => {
    router.push(`/dashboard/vci/aams/${submission.id}`)
  }

  const handlePageChange = (page: number) => {
    setFilters((f) => ({ ...f, offset: (page - 1) * f.limit }))
  }

  const mobileCardRender = (submission: AAMSSubmission) => {
    const config = STATUS_CONFIG[submission.status] || STATUS_CONFIG.draft
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{submission.year}</span>
          </div>
          <Badge variant={config.variant}>{config.label}</Badge>
        </div>
        {isMOH && (
          <div className="text-sm text-muted-foreground">{submission.company_name}</div>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="font-mono">{submission.aams_value.toLocaleString()}</span>
          {submission.is_late && <Badge variant="destructive">Late</Badge>}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Deadline */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">AAMS Submissions</h2>
            <p className="text-sm text-muted-foreground">
              Annual Average Monthly Sales declarations
            </p>
          </div>
          {!isMOH && !hasCurrentYearSubmission && (
            <Button asChild>
              <Link href="/dashboard/vci/aams/new">
                <Plus className="mr-2 h-4 w-4" />
                Submit AAMS {currentYear}
              </Link>
            </Button>
          )}
          {/* Quick year filter chips */}
          <div className="flex gap-1">
            {[currentYear, currentYear - 1, currentYear - 2].map((year) => (
              <Badge
                key={year}
                variant={filters.year === year ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setFilters((f) => ({ ...f, year, offset: 0 }))}
              >
                {year}
              </Badge>
            ))}
          </div>
        </div>

        {/* Deadline Indicator */}
        {!isMOH && <DeadlineIndicator year={currentYear} variant="alert" />}
      </div>

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
            {Array.from({ length: 5 }, (_, i) => currentYear - i).map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
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
          <SelectTrigger className="w-[150px]">
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
        emptyMessage="No AAMS submissions found"
        mobileCardRender={mobileCardRender}
      />
    </div>
  )
}
