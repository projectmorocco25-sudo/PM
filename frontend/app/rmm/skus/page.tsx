/**
 * Route: /rmm/skus
 * Status: Placeholder - To be implemented in Phase 1.1.2
 * Wireframe: task-0.5.2.6-skus-list.md (when available - see Phase 0.5 missing wireframes)
 * Database: skus table with pharmaceutical attributes (verified in Phase 0.6)
 */

'use client'

import { MainContent } from '@/components/layout/main-content'

export default function SKUsPlaceholder() {
  return (
    <MainContent
      breadcrumbs={[
        { label: 'Home', href: '/dashboard' },
        { label: 'RMM', href: '/rmm' },
        { label: 'SKUs' },
      ]}
      title="SKUs"
    >
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <h2 className="text-xl font-semibold mb-4">SKUs</h2>
        <p className="text-gray-600 mb-4 text-center max-w-md">
          This page will be implemented in Phase 1.1.2 (RMM Module)
        </p>
        <p className="text-sm text-gray-500">
          Route: /rmm/skus
        </p>
      </div>
    </MainContent>
  )
}
