'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DetailPage,
  DetailField,
  DetailGrid,
} from '@/components/ui/detail-page'
import { EntityStatusBadge } from '@/components/rmm/workflow-status-indicator'
import { useSKU } from '@/hooks/use-rmm'
import { useUserRole } from '@/hooks/use-user-role'
import { format } from 'date-fns'
import { Edit, Pill } from 'lucide-react'

// Task 1.1.2.24: SKU detail page

export default function SKUDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isMOH } = useUserRole()
  const skuId = params.id as string

  const { data: skuData, isLoading } = useSKU(skuId)
  const sku = skuData?.sku

  return (
    <DetailPage
      title={sku?.name || 'Loading...'}
      subtitle={sku?.sku_code}
      description={sku?.product_name}
      status={sku && <EntityStatusBadge isActive={sku.is_active} />}
      onBack={() => router.push('/dashboard/rmm/skus')}
      backLabel="Back to SKUs"
      loading={isLoading}
      actions={
        isMOH
          ? [
              {
                label: 'Edit',
                icon: <Edit className="mr-2 h-4 w-4" />,
                onClick: () =>
                  router.push(`/dashboard/rmm/skus/${skuId}/edit`),
              },
            ]
          : []
      }
      sections={[
        {
          id: 'basic',
          title: 'SKU Information',
          content: (
            <DetailGrid columns={2}>
              <DetailField label="SKU Code" value={<span className="font-mono">{sku?.sku_code}</span>} />
              <DetailField label="Name" value={sku?.name} />
              <DetailField label="Product" value={sku?.product_name} />
              <DetailField label="Company" value={sku?.company_name} />
              <DetailField
                label="Status"
                value={sku && <EntityStatusBadge isActive={sku.is_active} />}
              />
              <DetailField
                label="Created"
                value={
                  sku?.created_at &&
                  format(new Date(sku.created_at), 'PPP')
                }
              />
            </DetailGrid>
          ),
        },
        {
          id: 'pharmaceutical',
          title: 'Pharmaceutical Attributes',
          description: 'Dosage and packaging information',
          content: (
            <DetailGrid columns={2}>
              <DetailField label="Dosage Strength" value={sku?.dosage_strength} />
              <DetailField label="Dosage Form" value={sku?.dosage_form} />
              <DetailField label="Pack Size" value={sku?.pack_size} />
              <DetailField label="Unit of Measure" value={sku?.unit_of_measure} />
              <DetailField
                label="ATC Code"
                value={
                  sku?.atc_code ? (
                    <div>
                      <span className="font-mono">{sku.atc_code}</span>
                      {sku.atc_name && (
                        <span className="text-muted-foreground ml-2">
                          ({sku.atc_name})
                        </span>
                      )}
                    </div>
                  ) : (
                    '—'
                  )
                }
              />
              <DetailField
                label="MOH Authorized Unregistered"
                value={sku?.is_moh_authorized_unregistered ? 'Yes' : 'No'}
              />
            </DetailGrid>
          ),
        },
      ]}
    />
  )
}
