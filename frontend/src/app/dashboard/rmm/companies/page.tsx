'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DataTable, Column } from '@/components/ui/data-table'
import { EntityStatusBadge } from '@/components/rmm/workflow-status-indicator'
import { useCompanies, Company } from '@/hooks/use-rmm'
import { useUserRole } from '@/hooks/use-user-role'
import { Plus, Building2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Task 1.1.2.17: Companies list page

export default function CompaniesPage() {
  const router = useRouter()
  const { isMOH } = useUserRole()
  const [filters, setFilters] = React.useState({
    company_type: undefined as string | undefined,
    is_active: undefined as boolean | undefined,
    search: '',
    limit: 10,
    offset: 0,
  })

  const { data, isLoading } = useCompanies(filters)
  const companies = data?.companies || []
  const total = data?.total || 0

  const columns: Column<Company>[] = [
    {
      key: 'name',
      header: 'Company Name',
      sortable: true,
      render: (_, row) => (
        <div className="font-medium">{row.name}</div>
      ),
    },
    {
      key: 'registration_number',
      header: 'Reg. Number',
      sortable: true,
    },
    {
      key: 'company_type',
      header: 'Type',
      render: (value) => (
        <span className="capitalize">{String(value)}</span>
      ),
    },
    {
      key: 'contact_email',
      header: 'Email',
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (_, row) => (
        <EntityStatusBadge
          isActive={row.is_active}
          isSuspended={!!row.suspended_at}
        />
      ),
    },
  ]

  const handleRowClick = (company: Company) => {
    router.push(`/dashboard/rmm/companies/${company.id}`)
  }

  const handlePageChange = (page: number) => {
    setFilters((f) => ({ ...f, offset: (page - 1) * f.limit }))
  }

  const handlePageSizeChange = (size: number) => {
    setFilters((f) => ({ ...f, limit: size, offset: 0 }))
  }

  const handleSearchChange = (search: string) => {
    setFilters((f) => ({ ...f, search, offset: 0 }))
  }

  // Task 1.1.2.17c: Mobile card view
  const mobileCardRender = (company: Company) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-medium">{company.name}</span>
        <EntityStatusBadge
          isActive={company.is_active}
          isSuspended={!!company.suspended_at}
        />
      </div>
      <div className="text-sm text-muted-foreground">
        {company.registration_number}
      </div>
      <div className="text-sm text-muted-foreground capitalize">
        {company.company_type}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Companies</h2>
          <p className="text-sm text-muted-foreground">
            View and manage pharmaceutical companies
          </p>
        </div>
        {isMOH && (
          <Button asChild>
            <Link href="/dashboard/rmm/companies/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Company
            </Link>
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select
          value={filters.company_type || 'all'}
          onValueChange={(v) =>
            setFilters((f) => ({
              ...f,
              company_type: v === 'all' ? undefined : v,
              offset: 0,
            }))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Company Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="ipc">IPC</SelectItem>
            <SelectItem value="wholesaler">Wholesaler</SelectItem>
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

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={companies}
        total={total}
        page={Math.floor(filters.offset / filters.limit) + 1}
        pageSize={filters.limit}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        searchValue={filters.search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search companies..."
        onRowClick={handleRowClick}
        loading={isLoading}
        emptyMessage="No companies found"
        mobileCardRender={mobileCardRender}
      />
    </div>
  )
}
