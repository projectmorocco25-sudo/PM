/**
 * Route: /vci/submissions/wsl
 * Status: Placeholder - To be implemented in Phase 1.1.5
 * Wireframe: task-0.5.3.11-wsl-submissions-list.md (when available - see Phase 0.5 missing wireframes)
 * Database: wsl_submissions table (verified in Phase 0.6)
 */

'use client'

import { MainContent } from '@/components/layout/main-content'

export default function WSLSubmissionsPlaceholder() {
  return (
    <MainContent
      breadcrumbs={[
        { label: 'Home', href: '/dashboard' },
        { label: 'VCI', href: '/vci' },
        { label: 'Submissions', href: '/vci/submissions' },
        { label: 'WSL' },
      ]}
      title="WSL Submissions"
    >
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <h2 className="text-xl font-semibold mb-4">WSL Submissions</h2>
        <p className="text-gray-600 mb-4 text-center max-w-md">
          This page will be implemented in Phase 1.1.5 (VCI WSL Workflow)
        </p>
        <p className="text-sm text-gray-500">
          Route: /vci/submissions/wsl
        </p>
      </div>
    </MainContent>
  )
}
