'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DataTable, Column } from '@/components/ui/data-table'
import { EntityStatusBadge } from '@/components/rmm/workflow-status-indicator'
import { Badge } from '@/components/ui/badge'
import { useProducts, useCompanies, Product } from '@/hooks/use-rmm'
import { useUserRole } from '@/hooks/use-user-role'
import { Plus, AlertTriangle } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Task 1.1.2.20: Products list page

export default function ProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isMOH, userCompanyId } = useUserRole()

  const [filters, setFilters] = React.useState({
    company_id: searchParams.get('company') || undefined,
    is_active: undefined as boolean | undefined,
    is_critical_medicine: undefined as boolean | undefined,
    search: '',
    limit: 10,
    offset: 0,
  })

  const { data: productsData, isLoading: productsLoading } = useProducts(filters)
  const { data: companiesData } = useCompanies({ limit: 100 })

  const products = productsData?.products || []
  const total = productsData?.total || 0
  const companies = companiesData?.companies || []

  const columns: Column<Product>[] = [
    {
      key: 'name',
      header: 'Product Name',
      sortable: true,
      render: (_, row) => (
        <div className="font-medium">{row.name}</div>
      ),
    },
    {
      key: 'company_name',
      header: 'Company',
      sortable: true,
    },
    {
      key: 'is_critical_medicine',
      header: 'Critical',
      render: (value) =>
        value ? (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            Critical
          </Badge>
        ) : null,
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (_, row) => <EntityStatusBadge isActive={row.is_active} />,
    },
  ]

  const handleRowClick = (product: Product) => {
    router.push(`/dashboard/rmm/products/${product.id}`)
  }

  const handlePageChange = (page: number) => {
    setFilters((f) => ({ ...f, offset: (page - 1) * f.limit }))
  }

  const mobileCardRender = (product: Product) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-medium">{product.name}</span>
        <EntityStatusBadge isActive={product.is_active} />
      </div>
      <div className="text-sm text-muted-foreground">{product.company_name}</div>
      {product.is_critical_medicine && (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          Critical Medicine
        </Badge>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Products</h2>
          <p className="text-sm text-muted-foreground">
            View and manage pharmaceutical products
          </p>
        </div>
        {isMOH && (
          <Button asChild>
            <Link href="/dashboard/rmm/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
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
            filters.is_critical_medicine === undefined
              ? 'all'
              : filters.is_critical_medicine
              ? 'critical'
              : 'regular'
          }
          onValueChange={(v) =>
            setFilters((f) => ({
              ...f,
              is_critical_medicine:
                v === 'all' ? undefined : v === 'critical',
              offset: 0,
            }))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Products" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            <SelectItem value="critical">Critical Medicines</SelectItem>
            <SelectItem value="regular">Regular Products</SelectItem>
          </SelectContent>
        </Select>

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
        data={products}
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
        searchPlaceholder="Search products..."
        onRowClick={handleRowClick}
        loading={productsLoading}
        emptyMessage="No products found"
        mobileCardRender={mobileCardRender}
      />
    </div>
  )
}
