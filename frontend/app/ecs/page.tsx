/**
 * Route: /ecs
 * Status: Placeholder - To be implemented in Phase 1.2
 * Wireframe: task-0.5.4.0-ecs-overview.md (when available - see Phase 0.5 missing wireframes)
 * Database: ECS tables (export_requests, export_authorizations) - verified in Phase 0.6
 * Access: Module activation check required
 */

'use client'

import { MainContent } from '@/components/layout/main-content'
import { ModuleGuard } from '@/components/guards/module-guard'

export default function ECSPlaceholder() {
  return (
    <ModuleGuard moduleName="ecs">
      <MainContent
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'ECS' },
        ]}
        title="Export Control System (ECS)"
      >
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <h2 className="text-xl font-semibold mb-4">ECS Overview</h2>
          <p className="text-gray-600 mb-4 text-center max-w-md">
            This page will be implemented in Phase 1.2 (ECS Development)
          </p>
          <p className="text-sm text-gray-500">
            Route: /ecs
          </p>
        </div>
      </MainContent>
    </ModuleGuard>
  )
}
