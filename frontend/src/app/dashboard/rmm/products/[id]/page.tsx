'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DetailPage,
  DetailField,
  DetailGrid,
} from '@/components/ui/detail-page'
import { DataTable, Column } from '@/components/ui/data-table'
import { EntityStatusBadge } from '@/components/rmm/workflow-status-indicator'
import { useProduct, useSKUs, SKU } from '@/hooks/use-rmm'
import { useUserRole } from '@/hooks/use-user-role'
import { format } from 'date-fns'
import { Edit, Boxes, Plus, AlertTriangle, History } from 'lucide-react'
import { ProductHistoryTab } from '@/components/history/history-tab'

// Task 1.1.2.21: Product detail page
// Task 1.1.5.26: History tab on Product detail page

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isMOH } = useUserRole()
  const productId = params.id as string

  const { data: productData, isLoading: productLoading } = useProduct(productId)
  const { data: skusData, isLoading: skusLoading } = useSKUs({
    product_id: productId,
    limit: 100,
  })

  const product = productData?.product
  const skus = skusData?.skus || []

  const skuColumns: Column<SKU>[] = [
    {
      key: 'sku_code',
      header: 'SKU Code',
      sortable: true,
    },
    {
      key: 'name',
      header: 'Name',
      sortable: true,
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

  const handleSKUClick = (sku: SKU) => {
    router.push(`/dashboard/rmm/skus/${sku.id}`)
  }

  return (
    <DetailPage
      title={product?.name || 'Loading...'}
      subtitle={product?.company_name}
      status={
        product && (
          <div className="flex items-center gap-2">
            <EntityStatusBadge isActive={product.is_active} />
            {product.is_critical_medicine && (
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="h-3 w-3" />
                Critical Medicine
              </Badge>
            )}
          </div>
        )
      }
      onBack={() => router.push('/dashboard/rmm/products')}
      backLabel="Back to Products"
      loading={productLoading}
      actions={
        isMOH
          ? [
              {
                label: 'Edit',
                icon: <Edit className="mr-2 h-4 w-4" />,
                onClick: () =>
                  router.push(`/dashboard/rmm/products/${productId}/edit`),
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
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent>
                <DetailGrid columns={2}>
                  <DetailField label="Product Name" value={product?.name} />
                  <DetailField label="Company" value={product?.company_name} />
                  <DetailField
                    label="Description"
                    value={product?.description}
                  />
                  <DetailField
                    label="Status"
                    value={
                      product && <EntityStatusBadge isActive={product.is_active} />
                    }
                  />
                  <DetailField
                    label="Critical Medicine"
                    value={product?.is_critical_medicine ? 'Yes' : 'No'}
                  />
                  <DetailField
                    label="Created"
                    value={
                      product?.created_at &&
                      format(new Date(product.created_at), 'PPP')
                    }
                  />
                </DetailGrid>
              </CardContent>
            </Card>
          ),
        },
        {
          id: 'skus',
          label: 'SKUs',
          badge: skus.length,
          content: (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Stock Keeping Units</h3>
                {isMOH && (
                  <Button size="sm" asChild>
                    <Link href={`/dashboard/rmm/skus/new?product=${productId}`}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add SKU
                    </Link>
                  </Button>
                )}
              </div>
              <DataTable
                columns={skuColumns}
                data={skus}
                loading={skusLoading}
                onRowClick={handleSKUClick}
                emptyMessage="No SKUs found"
              />
            </div>
          ),
        },
        {
          id: 'history',
          label: 'History',
          icon: <History className="h-4 w-4" />,
          content: (
            <ProductHistoryTab productId={productId} productName={product?.name} />
          ),
        },
      ]}
    />
  )
}
