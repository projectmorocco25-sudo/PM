'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DataTable, Column } from '@/components/ui/data-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BreachStatusBadge,
  BreachPriorityBadge,
  BreachCard,
} from '@/components/vci/breach-components'
import { BatchBreachAnalysis } from '@/components/vci/breach-analysis-form'
import { useBreaches, Breach, BreachStatus, BreachPriority } from '@/hooks/use-vci'
import { useCompanies } from '@/hooks/use-rmm'
import { useUserRole } from '@/hooks/use-user-role'
import { format } from 'date-fns'
import { AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Task 1.1.5.16: Breaches list page
// Task 1.1.5.16a: BreachFilters component (integrated)
// Task 1.1.5.36: Status/year filters with query parameters

export default function BreachesListPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isMOH, role } = useUserRole()
  const currentYear = new Date().getFullYear()

  // Task 1.1.5.36: Read status/year from URL query params
  const statusParam = searchParams.get('status')
  const yearParam = searchParams.get('year')
  const defaultYear = yearParam ? parseInt(yearParam) : undefined

  const [tab, setTab] = React.useState<'active' | 'resolved'>(
    statusParam === 'resolved' || statusParam === 'completed' || statusParam === 'action_taken' 
      ? 'resolved' 
      : 'active'
  )
  const [selectedBreaches, setSelectedBreaches] = React.useState<Breach[]>([])
  const [yearFilter, setYearFilter] = React.useState<number | undefined>(defaultYear)
  const [filters, setFilters] = React.useState({
    company_id: undefined as string | undefined,
    priority: undefined as string | undefined,
    status: statusParam || undefined as string | undefined,
    limit: 10,
    offset: 0,
  })

  // Sync URL params when filter changes
  React.useEffect(() => {
    const params = new URLSearchParams()
    if (filters.status) {
      params.set('status', filters.status)
    }
    if (yearFilter) {
      params.set('year', yearFilter.toString())
    }
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname
    window.history.replaceState({}, '', newUrl)
  }, [filters.status, yearFilter])

  const { data: companiesData } = useCompanies({ limit: 100 })
  const companies = companiesData?.companies || []

  // Adjust filters based on tab
  const effectiveFilters = React.useMemo(() => {
    if (tab === 'active') {
      return {
        ...filters,
        status: filters.status && ['action_taken', 'completed'].includes(filters.status) 
          ? undefined 
          : filters.status,
      }
    } else {
      return {
        ...filters,
        status: 'action_taken',
      }
    }
  }, [filters, tab])

  const { data: breachesData, isLoading, refetch } = useBreaches(effectiveFilters)
  const breaches = breachesData?.breaches || []
  const total = breachesData?.total || 0

  // Filter for active vs resolved
  const displayBreaches = tab === 'active'
    ? breaches.filter((b) => !['action_taken', 'completed'].includes(b.status))
    : breaches.filter((b) => ['action_taken', 'completed'].includes(b.status))

  const isTier2 = role === 'tier2_officer' || role === 'tier2_registrar'

  const columns: Column<Breach>[] = [
    ...(isTier2 && tab === 'active'
      ? [
          {
            key: 'select' as keyof Breach,
            header: '',
            render: (_: unknown, row: Breach) => (
              <Checkbox
                checked={selectedBreaches.some((b) => b.id === row.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedBreaches((prev) => [...prev, row])
                  } else {
                    setSelectedBreaches((prev) => prev.filter((b) => b.id !== row.id))
                  }
                }}
                onClick={(e) => e.stopPropagation()}
              />
            ),
          },
        ]
      : []),
    {
      key: 'sku_name',
      header: 'SKU',
      render: (_, row) => (
        <div>
          <div className="font-medium">{row.sku_name}</div>
          <div className="text-xs text-muted-foreground">{row.sku_code}</div>
        </div>
      ),
    },
    ...(isMOH
      ? [{ key: 'company_name' as keyof Breach, header: 'Company' }]
      : []),
    {
      key: 'stock_level',
      header: 'Stock',
      render: (_, row) => (
        <div className="text-right">
          <div className="font-mono">{row.stock_level.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">
            / {row.threshold_value.toLocaleString()}
          </div>
        </div>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (_, row) => <BreachPriorityBadge priority={row.priority} />,
    },
    {
      key: 'status',
      header: 'Status',
      render: (_, row) => <BreachStatusBadge status={row.status} />,
    },
    {
      key: 'breach_date',
      header: 'Date',
      render: (value) => format(new Date(String(value)), 'MMM d, yyyy'),
    },
  ]

  const handleRowClick = (breach: Breach) => {
    router.push(`/dashboard/vci/breaches/${breach.id}`)
  }

  const handlePageChange = (page: number) => {
    setFilters((f) => ({ ...f, offset: (page - 1) * f.limit }))
  }

  const mobileCardRender = (breach: Breach) => (
    <BreachCard
      breach={breach}
      onClick={() => handleRowClick(breach)}
    />
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Breaches
          </h2>
          <p className="text-sm text-muted-foreground">
            Stock level violations requiring attention
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as 'active' | 'resolved')}>
        <TabsList>
          <TabsTrigger value="active">Active Breaches</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Task 1.1.5.16a & 1.1.5.36: Filters with year */}
      <div className="flex flex-wrap gap-4">
        {/* Task 1.1.5.36: Year filter with quick chips */}
        <div className="flex gap-1">
          {[currentYear, currentYear - 1, currentYear - 2].map((year) => (
            <Badge
              key={year}
              variant={yearFilter === year ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setYearFilter(yearFilter === year ? undefined : year)}
            >
              {year}
            </Badge>
          ))}
        </div>

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

        <Select
          value={filters.priority || 'all'}
          onValueChange={(v) =>
            setFilters((f) => ({
              ...f,
              priority: v === 'all' ? undefined : v,
              offset: 0,
            }))
          }
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
          </SelectContent>
        </Select>

        {tab === 'active' && (
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
              <SelectItem value="detected">Detected</SelectItem>
              <SelectItem value="tier2_analyzing">Analyzing</SelectItem>
              <SelectItem value="tier2_suggested">Awaiting Approval</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Batch Analysis for Tier 2 */}
      {isTier2 && tab === 'active' && (
        <BatchBreachAnalysis
          selectedBreaches={selectedBreaches.filter(
            (b) => b.status === 'detected' || b.status === 'tier2_analyzing'
          )}
          onClear={() => setSelectedBreaches([])}
          onSuccess={() => refetch()}
        />
      )}

      {/* Table */}
      <DataTable
        columns={columns}
        data={displayBreaches}
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
          tab === 'active' ? 'No active breaches' : 'No resolved breaches'
        }
        mobileCardRender={mobileCardRender}
      />
    </div>
  )
}
