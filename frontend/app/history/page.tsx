/**
 * Route: /history
 * Status: Placeholder - To be implemented in Phase 1.1.7
 * Wireframe: task-0.5.1.30-history-overview.md (when available - see Phase 0.5 missing wireframes)
 * Database: Historical data RPC functions (verified in Phase 0.6)
 * Reference: [Historical Data Routing Proposal](../../docs/02-architecture/frontend/historical-data-routing-proposal.md)
 */

'use client'

import { MainContent } from '@/components/layout/main-content'

export default function HistoryPlaceholder() {
  return (
    <MainContent
      breadcrumbs={[
        { label: 'Home', href: '/dashboard' },
        { label: 'History' },
      ]}
      title="History"
    >
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <h2 className="text-xl font-semibold mb-4">History Overview</h2>
        <p className="text-gray-600 mb-4 text-center max-w-md">
          This page will be implemented in Phase 1.1.7 (Historical Data Frontend)
        </p>
        <p className="text-sm text-gray-500">
          Route: /history
        </p>
      </div>
    </MainContent>
  )
}
