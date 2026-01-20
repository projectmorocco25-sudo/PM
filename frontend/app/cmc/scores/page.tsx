/**
 * Route: /cmc/scores
 * Status: Placeholder - To be implemented in Phase 1.3
 * Wireframe: task-0.5.5.1-compliance-scores-list.md (when available - see Phase 0.5 missing wireframes)
 * Database: compliance_scores table (verified in Phase 0.6)
 * Access: Module activation check required
 */

'use client'

import { MainContent } from '@/components/layout/main-content'
import { ModuleGuard } from '@/components/guards/module-guard'

export default function ComplianceScoresPlaceholder() {
  return (
    <ModuleGuard moduleName="cmc">
      <MainContent
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'CMC', href: '/cmc' },
          { label: 'Compliance Scores' },
        ]}
        title="Compliance Scores"
      >
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <h2 className="text-xl font-semibold mb-4">Compliance Scores</h2>
          <p className="text-gray-600 mb-4 text-center max-w-md">
            This page will be implemented in Phase 1.3 (CMC Development)
          </p>
          <p className="text-sm text-gray-500">
            Route: /cmc/scores
          </p>
        </div>
      </MainContent>
    </ModuleGuard>
  )
}
