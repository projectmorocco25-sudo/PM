'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DataTable, Column } from '@/components/ui/data-table'
import { EntityStatusBadge } from '@/components/rmm/workflow-status-indicator'
import { useSKUs, useCompanies, SKU } from '@/hooks/use-rmm'
import { useUserRole } from '@/hooks/use-user-role'
import { Plus } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Task 1.1.2.23: SKUs list page

export default function SKUsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isMOH } = useUserRole()

  const [filters, setFilters] = React.useState({
    company_id: searchParams.get('company') || undefined,
    product_id: searchParams.get('product') || undefined,
    is_active: undefined as boolean | undefined,
    search: '',
    limit: 10,
    offset: 0,
  })

  const { data: skusData, isLoading: skusLoading } = useSKUs(filters)
  const { data: companiesData } = useCompanies({ limit: 100 })

  const skus = skusData?.skus || []
  const total = skusData?.total || 0
  const companies = companiesData?.companies || []

  const columns: Column<SKU>[] = [
    {
      key: 'sku_code',
      header: 'SKU Code',
      sortable: true,
      render: (_, row) => <span className="font-mono">{row.sku_code}</span>,
    },
    {
      key: 'name',
      header: 'Name',
      sortable: true,
    },
    {
      key: 'product_name',
      header: 'Product',
    },
    {
      key: 'dosage_strength',
      header: 'Dosage',
    },
    {
      key: 'dosage_form',
      header: 'Form',
    },
    {
      key: 'pack_size',
      header: 'Pack Size',
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (_, row) => <EntityStatusBadge isActive={row.is_active} />,
    },
  ]

  const handleRowClick = (sku: SKU) => {
    router.push(`/dashboard/rmm/skus/${sku.id}`)
  }

  const handlePageChange = (page: number) => {
    setFilters((f) => ({ ...f, offset: (page - 1) * f.limit }))
  }

  const mobileCardRender = (sku: SKU) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm">{sku.sku_code}</span>
        <EntityStatusBadge isActive={sku.is_active} />
      </div>
      <div className="font-medium">{sku.name}</div>
      <div className="text-sm text-muted-foreground">
        {sku.dosage_strength} • {sku.dosage_form} • {sku.pack_size}
      </div>
      <div className="text-sm text-muted-foreground">{sku.product_name}</div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">SKUs</h2>
          <p className="text-sm text-muted-foreground">
            View and manage stock keeping units
          </p>
        </div>
        {isMOH && (
          <Button asChild>
            <Link href="/dashboard/rmm/skus/new">
              <Plus className="mr-2 h-4 w-4" />
              Add SKU
            </Link>
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
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
          value={
            filters.is_active === undefined
              ? 'all'
              : filters.is_active
              ? 'active'
              : 'inactive'
          }
          onValueChange={(v) =>
            setFilters((f) => ({
              ...f,
              is_active: v === 'all' ? undefined : v === 'active',
              offset: 0,
            }))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={skus}
        total={total}
        page={Math.floor(filters.offset / filters.limit) + 1}
        pageSize={filters.limit}
        onPageChange={handlePageChange}
        onPageSizeChange={(size) =>
          setFilters((f) => ({ ...f, limit: size, offset: 0 }))
        }
        searchValue={filters.search}
        onSearchChange={(search) =>
          setFilters((f) => ({ ...f, search, offset: 0 }))
        }
        searchPlaceholder="Search SKUs..."
        onRowClick={handleRowClick}
        loading={skusLoading}
        emptyMessage="No SKUs found"
        mobileCardRender={mobileCardRender}
      />
    </div>
  )
}
