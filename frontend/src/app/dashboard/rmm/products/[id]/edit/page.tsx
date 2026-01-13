'use client'

import { useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ProductForm } from '@/components/rmm/product-form'
import { RoleGuard } from '@/components/guards/role-guard'
import { useProduct } from '@/hooks/use-rmm'

export default function EditProductPage() {
  const params = useParams()
  const productId = params.id as string
  const { data, isLoading } = useProduct(productId)

  return (
    <RoleGuard allowedRoles={['tier1', 'tier2_officer', 'tier2_registrar']}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/dashboard/rmm/products/${productId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            {isLoading ? (
              <Skeleton className="h-6 w-48" />
            ) : (
              <h2 className="text-xl font-semibold">
                Edit {data?.product?.name}
              </h2>
            )}
            <p className="text-sm text-muted-foreground">
              Update product information
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
          </div>
        ) : (
          <ProductForm product={data?.product} />
        )}
      </div>
    </RoleGuard>
  )
}
