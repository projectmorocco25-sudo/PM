'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DataTable, Column } from '@/components/ui/data-table'
import { YearFilter } from '@/components/filters/year-filter'
import { DateRangePicker, DateRange } from '@/components/history/date-range-picker'
import { ExportButton } from '@/components/history/export-button'
import { useUserRole } from '@/hooks/use-user-role'
import { useCompanies } from '@/hooks/use-rmm'
import { format } from 'date-fns'
import { History, FileSpreadsheet, Calendar, TrendingUp, BarChart3 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Task 1.1.5.42: /vci/submissions/history route

type SubmissionType = 'aams' | 'msq' | 'wsl' | 'all'

interface HistoricalSubmission {
  id: string
  type: SubmissionType
  company_name: string
  period: string
  status: string
  submitted_at: string
}

// Mock data
const MOCK_SUBMISSIONS: HistoricalSubmission[] = Array.from({ length: 50 }, (_, i) => ({
  id: `sub-${i}`,
  type: (['aams', 'msq', 'wsl'] as SubmissionType[])[i % 3],
  company_name: ['Pharma Industries', 'MedLab Morocco', 'PharmaDist'][i % 3],
  period: i % 3 === 0 ? '2025' : i % 3 === 1 ? 'Dec 2025' : 'W52 2025',
  status: ['completed', 'approved', 'submitted'][i % 3],
  submitted_at: new Date(Date.now() - i * 86400000 * 7).toISOString(),
}))

export default function SubmissionsHistoryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isMOH } = useUserRole()

  const [type, setType] = React.useState<SubmissionType>('all')
  const [companyFilter, setCompanyFilter] = React.useState<string>('all')
  const [dateRange, setDateRange] = React.useState<DateRange>({ from: undefined, to: undefined })

  const { data: companiesData } = useCompanies({ limit: 100 })
  const companies = companiesData?.companies || []

  const filteredSubmissions = React.useMemo(() => {
    return MOCK_SUBMISSIONS.filter((sub) => {
      if (type !== 'all' && sub.type !== type) return false
      if (companyFilter !== 'all' && sub.company_name !== companyFilter) return false
      return true
    })
  }, [type, companyFilter])

  const columns: Column<HistoricalSubmission>[] = [
    {
      key: 'type',
      header: 'Type',
      render: (value) => (
        <Badge variant="outline" className="uppercase">
          {String(value)}
        </Badge>
      ),
    },
    ...(isMOH ? [{ key: 'company_name' as keyof HistoricalSubmission, header: 'Company' }] : []),
    { key: 'period', header: 'Period' },
    {
      key: 'status',
      header: 'Status',
      render: (value) => {
        const status = String(value)
        const variant = status === 'completed' ? 'default' : status === 'approved' ? 'secondary' : 'outline'
        return <Badge variant={variant}>{status}</Badge>
      },
    },
    {
      key: 'submitted_at',
      header: 'Submitted',
      render: (value) => format(new Date(String(value)), 'MMM d, yyyy'),
    },
  ]

  const handleExport = async () => {
    const csv = filteredSubmissions.map((s) =>
      `${s.type},${s.company_name},${s.period},${s.status},${s.submitted_at}`
    ).join('\n')
    return new Blob([csv], { type: 'text/csv' })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <History className="h-6 w-6" />
            Submission History
          </h1>
          <p className="text-muted-foreground">
            Historical VCI submissions (AAMS, MSQ, WSL)
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isMOH && (
            <Button variant="outline" asChild>
              <Link href="/dashboard/vci/submissions/history/trends">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Trends
              </Link>
            </Button>
          )}
          <ExportButton onExport={handleExport} formats={['csv', 'excel']} />
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <Tabs value={type} onValueChange={(v) => setType(v as SubmissionType)} className="w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="aams">AAMS</TabsTrigger>
                <TabsTrigger value="msq">MSQ</TabsTrigger>
                <TabsTrigger value="wsl">WSL</TabsTrigger>
              </TabsList>
            </Tabs>

            <YearFilter showQuickFilters />

            {isMOH && (
              <Select value={companyFilter} onValueChange={setCompanyFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Companies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  {companies.map((c) => (
                    <SelectItem key={c.id} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <DateRangePicker value={dateRange} onChange={setDateRange} />
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {filteredSubmissions.filter((s) => s.type === 'aams').length}
                </div>
                <div className="text-sm text-muted-foreground">AAMS Submissions</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100">
                <FileSpreadsheet className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {filteredSubmissions.filter((s) => s.type === 'msq').length}
                </div>
                <div className="text-sm text-muted-foreground">MSQ Submissions</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-orange-100">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {filteredSubmissions.filter((s) => s.type === 'wsl').length}
                </div>
                <div className="text-sm text-muted-foreground">WSL Submissions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredSubmissions}
        onRowClick={(sub) => router.push(`/dashboard/vci/${sub.type}/${sub.id}`)}
        emptyMessage="No historical submissions found"
      />
    </div>
  )
}
