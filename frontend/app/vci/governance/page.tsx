/**
 * Route: /vci/governance
 * Status: Placeholder - To be implemented in Phase 1.1.5
 * Wireframe: task-0.5.3.18-governance-dashboard.md (when available - see Phase 0.5 missing wireframes)
 * Database: Governance dashboard aggregation queries (verified in Phase 0.6)
 * Access: MOH only
 */

'use client'

import { MainContent } from '@/components/layout/main-content'
import { RoleGuard } from '@/components/guards/role-guard'

export default function VCIGovernancePlaceholder() {
  return (
    <RoleGuard allowedRoles={['moh_tier1', 'moh_tier2']}>
      <MainContent
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'VCI', href: '/vci' },
          { label: 'Governance' },
        ]}
        title="Governance Dashboard"
      >
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <h2 className="text-xl font-semibold mb-4">Governance Dashboard</h2>
          <p className="text-gray-600 mb-4 text-center max-w-md">
            This page will be implemented in Phase 1.1.5 (VCI WSL Workflow & Breach Detection)
          </p>
          <p className="text-sm text-gray-500">
            Route: /vci/governance (MOH only)
          </p>
        </div>
      </MainContent>
    </RoleGuard>
  )
}
