'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SKUForm } from '@/components/rmm/sku-form'
import { RoleGuard } from '@/components/guards/role-guard'

export default function NewSKUPage() {
  return (
    <RoleGuard allowedRoles={['tier1', 'tier2_officer', 'tier2_registrar']}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/rmm/skus">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <h2 className="text-xl font-semibold">Add New SKU</h2>
            <p className="text-sm text-muted-foreground">
              Create a new stock keeping unit
            </p>
          </div>
        </div>

        <SKUForm />
      </div>
    </RoleGuard>
  )
}
