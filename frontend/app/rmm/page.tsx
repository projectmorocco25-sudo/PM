/**
 * Route: /rmm
 * Status: Placeholder - To be implemented in Phase 1.1.2
 * Wireframe: task-0.5.2.1-rmm-overview.md (when available - see Phase 0.5 missing wireframes)
 * Database: RMM tables (companies, products, skus) - verified in Phase 0.6
 */

'use client'

import { MainContent } from '@/components/layout/main-content'

export default function RMMPlaceholder() {
  return (
    <MainContent
      breadcrumbs={[
        { label: 'Home', href: '/dashboard' },
        { label: 'RMM' },
      ]}
      title="Registry Management (RMM)"
    >
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <h2 className="text-xl font-semibold mb-4">RMM Overview</h2>
        <p className="text-gray-600 mb-4 text-center max-w-md">
          This page will be implemented in Phase 1.1.2 (RMM Module)
        </p>
        <p className="text-sm text-gray-500">
          Route: /rmm
        </p>
      </div>
    </MainContent>
  )
}
