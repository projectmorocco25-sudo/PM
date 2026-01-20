/**
 * Route: /vci/submissions/history
 * Status: Placeholder - To be implemented in Phase 1.1.7
 * Wireframe: task-0.5.3.19-submission-history.md (when available - see Phase 0.5 missing wireframes)
 * Database: Historical data RPC functions (verified in Phase 0.6)
 */

'use client'

import { MainContent } from '@/components/layout/main-content'

export default function SubmissionHistoryPlaceholder() {
  return (
    <MainContent
      breadcrumbs={[
        { label: 'Home', href: '/dashboard' },
        { label: 'VCI', href: '/vci' },
        { label: 'Submissions', href: '/vci/submissions' },
        { label: 'History' },
      ]}
      title="Submission History"
    >
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <h2 className="text-xl font-semibold mb-4">Submission History</h2>
        <p className="text-gray-600 mb-4 text-center max-w-md">
          This page will be implemented in Phase 1.1.7 (Historical Data Frontend)
        </p>
        <p className="text-sm text-gray-500">
          Route: /vci/submissions/history
        </p>
      </div>
    </MainContent>
  )
}
