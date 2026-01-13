'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DetailPage,
  DetailSection,
  DetailField,
  DetailGrid,
} from '@/components/ui/detail-page'
import { DataTable, Column } from '@/components/ui/data-table'
import { EntityStatusBadge } from '@/components/rmm/workflow-status-indicator'
import { useCompany, useProducts, useCompanyMutations, Product } from '@/hooks/use-rmm'
import { useUserRole } from '@/hooks/use-user-role'
import { formatDistanceToNow, format } from 'date-fns'
import { Edit, Package, Plus, Trash2, History } from 'lucide-react'
import { CompanyHistoryTab } from '@/components/history/history-tab'

// Task 1.1.2.18: Company detail page
// Task 1.1.5.25: History tab on Company detail page

export default function CompanyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isMOH } = useUserRole()
  const companyId = params.id as string

  const { data: companyData, isLoading: companyLoading } = useCompany(companyId)
  const { data: productsData, isLoading: productsLoading } = useProducts({
    company_id: companyId,
    limit: 100,
  })

  const company = companyData?.company
  const products = productsData?.products || []

  const productColumns: Column<Product>[] = [
    {
      key: 'name',
      header: 'Product Name',
      sortable: true,
    },
    {
      key: 'is_critical_medicine',
      header: 'Critical',
      render: (value) => (value ? 'Yes' : 'No'),
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (_, row) => <EntityStatusBadge isActive={row.is_active} />,
    },
  ]

  const handleProductClick = (product: Product) => {
    router.push(`/dashboard/rmm/products/${product.id}`)
  }

  return (
    <DetailPage
      title={company?.name || 'Loading...'}
      subtitle={company?.registration_number}
      status={
        company && (
          <EntityStatusBadge
            isActive={company.is_active}
            isSuspended={!!company.suspended_at}
          />
        )
      }
      onBack={() => router.push('/dashboard/rmm/companies')}
      backLabel="Back to Companies"
      loading={companyLoading}
      actions={
        isMOH
          ? [
              {
                label: 'Edit',
                icon: <Edit className="mr-2 h-4 w-4" />,
                onClick: () =>
                  router.push(`/dashboard/rmm/companies/${companyId}/edit`),
              },
            ]
          : []
      }
      moreActions={
        isMOH
          ? [
              {
                label: 'Deactivate',
                variant: 'destructive',
                icon: <Trash2 className="h-4 w-4" />,
                onClick: () => {
                  /* TODO: Implement deactivation */
                },
              },
            ]
          : []
      }
      tabs={[
        {
          id: 'details',
          label: 'Details',
          content: (
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent>
                <DetailGrid columns={2}>
                  <DetailField label="Company Name" value={company?.name} />
                  <DetailField
                    label="Registration Number"
                    value={company?.registration_number}
                  />
                  <DetailField
                    label="Company Type"
                    value={
                      <span className="capitalize">{company?.company_type}</span>
                    }
                  />
                  <DetailField label="Status" value={
                    company && (
                      <EntityStatusBadge
                        isActive={company.is_active}
                        isSuspended={!!company.suspended_at}
                      />
                    )
                  } />
                  <DetailField label="Address" value={company?.address} />
                  <DetailField label="Email" value={company?.contact_email} />
                  <DetailField label="Phone" value={company?.contact_phone} />
                  <DetailField
                    label="Created"
                    value={
                      company?.created_at &&
                      format(new Date(company.created_at), 'PPP')
                    }
                  />
                </DetailGrid>

                {company?.suspended_at && (
                  <div className="mt-6 p-4 bg-destructive/10 rounded-lg">
                    <h4 className="font-medium text-destructive">
                      Suspended
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Suspended on{' '}
                      {format(new Date(company.suspended_at), 'PPP')}
                    </p>
                    {company.suspended_reason && (
                      <p className="text-sm mt-2">{company.suspended_reason}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ),
        },
        {
          id: 'products',
          label: 'Products',
          badge: products.length,
          content: (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Products</h3>
                {isMOH && (
                  <Button size="sm" asChild>
                    <a href={`/dashboard/rmm/products/new?company=${companyId}`}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Product
                    </a>
                  </Button>
                )}
              </div>
              <DataTable
                columns={productColumns}
                data={products}
                loading={productsLoading}
                onRowClick={handleProductClick}
                emptyMessage="No products found"
              />
            </div>
          ),
        },
        {
          id: 'history',
          label: 'History',
          icon: <History className="h-4 w-4" />,
          content: (
            <CompanyHistoryTab companyId={companyId} companyName={company?.name} />
          ),
        },
      ]}
    />
  )
}
