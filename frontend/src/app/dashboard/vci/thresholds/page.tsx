'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { DataTable, Column } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { ThresholdModificationModal } from '@/components/vci/threshold-modification-modal'
import { useThresholds, Threshold } from '@/hooks/use-vci'
import { useCompanies } from '@/hooks/use-rmm'
import { RoleGuard } from '@/components/guards/role-guard'
import { format } from 'date-fns'
import { Settings2, Plus, Globe } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Task 1.1.3.16: Threshold management page
// Task 1.1.3.16a: ThresholdTable component

export default function ThresholdsPage() {
  const router = useRouter()

  const [filters, setFilters] = React.useState({
    company_id: undefined as string | undefined,
    is_current: true as boolean | undefined,
    limit: 10,
    offset: 0,
  })

  const [showModifyModal, setShowModifyModal] = React.useState(false)
  const [selectedThreshold, setSelectedThreshold] = React.useState<Threshold | null>(null)

  const { data: thresholdsData, isLoading, refetch } = useThresholds(filters)
  const { data: companiesData } = useCompanies({ limit: 100 })

  const thresholds = thresholdsData?.thresholds || []
  const total = thresholdsData?.total || 0
  const companies = companiesData?.companies || []

  const columns: Column<Threshold>[] = [
    {
      key: 'sku_name',
      header: 'SKU',
      render: (_, row) => (
        <div>
          <div className="font-medium">{row.sku_name}</div>
          <div className="text-xs text-muted-foreground">
            {row.sku_code} • {row.dosage_strength}
          </div>
        </div>
      ),
    },
    {
      key: 'company_name',
      header: 'Company',
    },
    {
      key: 'aams_value',
      header: 'AAMS',
      render: (value) => <span className="font-mono">{Number(value).toLocaleString()}</span>,
    },
    {
      key: 'multiplier_b',
      header: 'B',
      render: (_, row) => (
        <Badge variant={row.multiplier_b > 3.0 ? 'default' : 'secondary'}>
          ×{row.multiplier_b}
        </Badge>
      ),
    },
    {
      key: 'threshold_value',
      header: 'Threshold',
      render: (value) => (
        <span className="font-mono font-medium">{Number(value).toLocaleString()}</span>
      ),
    },
    {
      key: 'is_current',
      header: 'Status',
      render: (_, row) => (
        <div className="flex flex-col gap-1">
          <Badge variant={row.is_current ? 'default' : 'secondary'}>
            {row.is_current ? 'Active' : 'Inactive'}
          </Badge>
          {row.is_critical_medicine && (
            <Badge variant="outline" className="text-xs">Critical</Badge>
          )}
        </div>
      ),
    },
    {
      key: 'effective_from',
      header: 'Effective',
      render: (_, row) => (
        <div className="text-sm">
          <div>From: {format(new Date(row.effective_from), 'MMM d, yyyy')}</div>
          {row.effective_to && (
            <div className="text-muted-foreground">
              To: {format(new Date(row.effective_to), 'MMM d, yyyy')}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'id',
      header: '',
      render: (_, row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            setSelectedThreshold(row)
            setShowModifyModal(true)
          }}
        >
          <Settings2 className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  const handlePageChange = (page: number) => {
    setFilters((f) => ({ ...f, offset: (page - 1) * f.limit }))
  }

  const handleGlobalModify = () => {
    setSelectedThreshold(null)
    setShowModifyModal(true)
  }

  const mobileCardRender = (threshold: Threshold) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="font-medium">{threshold.sku_name}</div>
        <Badge variant={threshold.is_current ? 'default' : 'secondary'}>
          {threshold.is_current ? 'Active' : 'Inactive'}
        </Badge>
      </div>
      <div className="text-sm text-muted-foreground">{threshold.company_name}</div>
      <div className="flex items-center gap-4 text-sm">
        <span>
          <span className="text-muted-foreground">AAMS:</span>{' '}
          <span className="font-mono">{threshold.aams_value.toLocaleString()}</span>
        </span>
        <Badge variant={threshold.multiplier_b > 3.0 ? 'default' : 'secondary'}>
          ×{threshold.multiplier_b}
        </Badge>
        <span>
          <span className="text-muted-foreground">=</span>{' '}
          <span className="font-mono font-medium">{threshold.threshold_value.toLocaleString()}</span>
        </span>
      </div>
    </div>
  )

  return (
    <RoleGuard allowedRoles={['tier1']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              Threshold Management
            </h2>
            <p className="text-sm text-muted-foreground">
              View and modify VCI thresholds
            </p>
          </div>
          <Button onClick={handleGlobalModify}>
            <Globe className="mr-2 h-4 w-4" />
            Global Modification
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Active Thresholds</div>
              <div className="text-2xl font-bold">{total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Standard (×3.0)</div>
              <div className="text-2xl font-bold">
                {thresholds.filter((t) => t.multiplier_b === 3.0).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Critical (×3.5)</div>
              <div className="text-2xl font-bold">
                {thresholds.filter((t) => t.multiplier_b === 3.5).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
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

          <Select
            value={
              filters.is_current === undefined
                ? 'all'
                : filters.is_current
                ? 'active'
                : 'inactive'
            }
            onValueChange={(v) =>
              setFilters((f) => ({
                ...f,
                is_current: v === 'all' ? undefined : v === 'active',
                offset: 0,
              }))
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={thresholds}
          total={total}
          page={Math.floor(filters.offset / filters.limit) + 1}
          pageSize={filters.limit}
          onPageChange={handlePageChange}
          onPageSizeChange={(size) =>
            setFilters((f) => ({ ...f, limit: size, offset: 0 }))
          }
          loading={isLoading}
          emptyMessage="No thresholds found"
          mobileCardRender={mobileCardRender}
        />

        {/* Modification Modal */}
        <ThresholdModificationModal
          open={showModifyModal}
          onOpenChange={setShowModifyModal}
          threshold={selectedThreshold}
          onSuccess={() => refetch()}
        />
      </div>
    </RoleGuard>
  )
}
