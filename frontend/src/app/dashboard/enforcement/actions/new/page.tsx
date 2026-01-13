'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { EnforcementActionForm } from '@/components/enforcement/enforcement-action-form'
import { RoleGuard } from '@/components/guards/role-guard'

// Task 1.1.2.40: Create enforcement action wizard page

export default function NewEnforcementActionPage() {
  return (
    <RoleGuard allowedRoles={['tier1', 'tier2_officer', 'tier2_registrar']}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/enforcement/actions">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <h2 className="text-xl font-semibold">Create Enforcement Action</h2>
            <p className="text-sm text-muted-foreground">
              Follow the wizard to create a new enforcement action
            </p>
          </div>
        </div>

        <EnforcementActionForm />
      </div>
    </RoleGuard>
  )
}
