/**
 * Route: /system-config
 * Status: Placeholder - To be implemented in Phase 1.1.1
 * Wireframe: task-0.5.1.35-system-configuration.md (when available - see Phase 0.5 missing wireframes)
 * Database: system_config table (verified in Phase 0.6)
 * Access: MOH Tier 1 only
 */

'use client'

import { MainContent } from '@/components/layout/main-content'
import { RoleGuard } from '@/components/guards/role-guard'

export default function SystemConfigPlaceholder() {
  return (
    <RoleGuard allowedRoles={['moh_tier1']}>
      <MainContent
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'System Configuration' },
        ]}
        title="System Configuration"
      >
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <h2 className="text-xl font-semibold mb-4">System Configuration</h2>
          <p className="text-gray-600 mb-4 text-center max-w-md">
            This page will be implemented in Phase 1.1.1
          </p>
          <p className="text-sm text-gray-500">
            Route: /system-config (MOH Tier 1 only)
          </p>
        </div>
      </MainContent>
    </RoleGuard>
  )
}
