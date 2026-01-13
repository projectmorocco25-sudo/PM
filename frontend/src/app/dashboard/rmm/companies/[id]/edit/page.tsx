'use client'

import { useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { CompanyForm } from '@/components/rmm/company-form'
import { RoleGuard } from '@/components/guards/role-guard'
import { useCompany } from '@/hooks/use-rmm'

export default function EditCompanyPage() {
  const params = useParams()
  const companyId = params.id as string
  const { data, isLoading } = useCompany(companyId)

  return (
    <RoleGuard allowedRoles={['tier1', 'tier2_officer', 'tier2_registrar']}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/dashboard/rmm/companies/${companyId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            {isLoading ? (
              <Skeleton className="h-6 w-48" />
            ) : (
              <h2 className="text-xl font-semibold">
                Edit {data?.company?.name}
              </h2>
            )}
            <p className="text-sm text-muted-foreground">
              Update company information
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : (
          <CompanyForm company={data?.company} />
        )}
      </div>
    </RoleGuard>
  )
}
