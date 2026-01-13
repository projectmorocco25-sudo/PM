'use client'

import { useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { SKUForm } from '@/components/rmm/sku-form'
import { RoleGuard } from '@/components/guards/role-guard'
import { useSKU } from '@/hooks/use-rmm'

export default function EditSKUPage() {
  const params = useParams()
  const skuId = params.id as string
  const { data, isLoading } = useSKU(skuId)

  return (
    <RoleGuard allowedRoles={['tier1', 'tier2_officer', 'tier2_registrar']}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/dashboard/rmm/skus/${skuId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            {isLoading ? (
              <Skeleton className="h-6 w-48" />
            ) : (
              <h2 className="text-xl font-semibold">
                Edit {data?.sku?.name}
              </h2>
            )}
            <p className="text-sm text-muted-foreground">
              Update SKU information
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : (
          <SKUForm sku={data?.sku} />
        )}
      </div>
    </RoleGuard>
  )
}
