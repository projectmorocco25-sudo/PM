/**
 * Route: /support
 * Status: Placeholder - To be implemented in Phase 1.1.1
 * Wireframe: task-0.5.1.3-support-center.md (when available - see Phase 0.5 missing wireframes)
 * Database: No database requirements (static content)
 */

'use client'

import { MainContent } from '@/components/layout/main-content'

export default function SupportPlaceholder() {
  return (
    <MainContent
      breadcrumbs={[
        { label: 'Home', href: '/dashboard' },
        { label: 'Support' },
      ]}
      title="Support Center"
    >
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <h2 className="text-xl font-semibold mb-4">Support Center</h2>
        <p className="text-gray-600 mb-4 text-center max-w-md">
          This page will be implemented in Phase 1.1.1
        </p>
        <p className="text-sm text-gray-500">
          Route: /support
        </p>
      </div>
    </MainContent>
  )
}
