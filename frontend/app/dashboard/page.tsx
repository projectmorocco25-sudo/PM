/**
 * Route: /dashboard
 * Implements: Role-based dashboard home page
 * Reference: Navigation & Layout Patterns, Role-Based UI Patterns
 */

'use client'

import { MainContent } from '@/components/layout/main-content'

export default function DashboardPage() {
  return (
    <MainContent
      breadcrumbs={[
        { label: 'Home', href: '/dashboard' },
        { label: 'Dashboard' },
      ]}
      title="Dashboard"
    >
      <div className="p-6">
        <p className="text-gray-600">Dashboard content - role-based views to be implemented per task 1.1.1.20a</p>
      </div>
    </MainContent>
  )
}
