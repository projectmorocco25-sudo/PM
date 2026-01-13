'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CompanyForm } from '@/components/rmm/company-form'
import { RoleGuard } from '@/components/guards/role-guard'

export default function NewCompanyPage() {
  return (
    <RoleGuard allowedRoles={['tier1', 'tier2_officer', 'tier2_registrar']}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/rmm/companies">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <h2 className="text-xl font-semibold">Add New Company</h2>
            <p className="text-sm text-muted-foreground">
              Create a new pharmaceutical company in the registry
            </p>
          </div>
        </div>

        <CompanyForm />
      </div>
    </RoleGuard>
  )
}
