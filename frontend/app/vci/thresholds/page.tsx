/**
 * Route: /vci/thresholds
 * Status: Placeholder - To be implemented in Phase 1.1.3
 * Wireframe: task-0.5.3.4-threshold-management.md (when available - see Phase 0.5 missing wireframes)
 * Database: thresholds table (verified in Phase 0.6)
 * Access: MOH Tier 1 only
 */

'use client'

import { MainContent } from '@/components/layout/main-content'
import { RoleGuard } from '@/components/guards/role-guard'

export default function ThresholdsPlaceholder() {
  return (
    <RoleGuard allowedRoles={['moh_tier1']}>
      <MainContent
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'VCI', href: '/vci' },
          { label: 'Thresholds' },
        ]}
        title="Threshold Management"
      >
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <h2 className="text-xl font-semibold mb-4">Threshold Management</h2>
          <p className="text-gray-600 mb-4 text-center max-w-md">
            This page will be implemented in Phase 1.1.3 (VCI AAMS Workflow)
          </p>
          <p className="text-sm text-gray-500">
            Route: /vci/thresholds (MOH Tier 1 only)
          </p>
        </div>
      </MainContent>
    </RoleGuard>
  )
}
