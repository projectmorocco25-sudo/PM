/**
 * Route: /dashboard
 * Implements: Role-based dashboard home page
 * Task: 0.5.1.18, 0.5.1.19, 0.5.1.20 - Dashboards per wireframes
 * Reference: Navigation & Layout Patterns, Role-Based UI Patterns, Fatima Wireframe Review
 */

'use client'

import { MainContent } from '@/components/layout/main-content'
import { useUserRole } from '@/lib/hooks/use-user-role'
import { CompanyDashboard } from '@/components/dashboard/company-dashboard'
import { MOHTier1Dashboard } from '@/components/dashboard/moh-tier1-dashboard'
import { MOHTier2Dashboard } from '@/components/dashboard/moh-tier2-dashboard'

export default function DashboardPage() {
  const { data: userRole, isLoading } = useUserRole()

  if (isLoading) {
    return (
      <MainContent
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Dashboard' },
        ]}
        title="Dashboard"
      >
        <div className="p-6">
          <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
        </div>
      </MainContent>
    )
  }

  // Route to appropriate dashboard based on role
  let dashboardContent
  if (userRole?.isCompanyUser) {
    dashboardContent = <CompanyDashboard />
  } else if (userRole?.isTier1) {
    dashboardContent = <MOHTier1Dashboard />
  } else if (userRole?.isTier2) {
    dashboardContent = <MOHTier2Dashboard />
  } else if (userRole?.isVendor) {
    // TODO: Create VendorDashboard component per Task 1.1.1.20a enhancement
    dashboardContent = (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Vendor Dashboard</h2>
        <p className="text-gray-600">
          Module licensing and control dashboard coming soon. For now, you can access{' '}
          <a href="/system-config" className="text-blue-600 hover:underline">
            System Configuration
          </a>{' '}
          to manage module activation.
        </p>
      </div>
    )
  } else if (userRole?.isAuditor) {
    // TODO: Create AuditorDashboard component per Task 1.1.1.20a enhancement
    dashboardContent = (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Auditor Dashboard</h2>
        <p className="text-gray-600">
          Audit and compliance monitoring dashboard coming soon. You can access{' '}
          <a href="/audit" className="text-blue-600 hover:underline">
            Audit Logs
          </a>{' '}
          for read-only access to system audit data.
        </p>
      </div>
    )
  } else if (userRole?.isSystemAdmin) {
    // TODO: Create SystemAdminDashboard component per Task 1.1.1.20a enhancement
    dashboardContent = (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">System Administrator Dashboard</h2>
        <p className="text-gray-600">
          System administration dashboard coming soon. You can access{' '}
          <a href="/system-config" className="text-blue-600 hover:underline">
            System Configuration
          </a>{' '}
          for system management.
        </p>
      </div>
    )
  } else if (!userRole?.role) {
    // User not authenticated or role not found
    dashboardContent = (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 shadow-sm">
        <p className="text-red-800">
          Unable to determine your user role. Please contact your administrator or{' '}
          <a href="/auth/login" className="underline">
            log in again
          </a>
          .
        </p>
      </div>
    )
  } else {
    // Unknown role (should not happen if schema is correct)
    dashboardContent = (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 shadow-sm">
        <p className="text-yellow-800">
          Your role ({userRole.role}) does not have a dashboard assigned yet. Please contact your administrator.
        </p>
      </div>
    )
  }

  return (
    <MainContent
      breadcrumbs={[
        { label: 'Home', href: '/dashboard' },
        { label: 'Dashboard' },
      ]}
      title="Dashboard"
    >
      <div className="p-6">{dashboardContent}</div>
    </MainContent>
  )
}
