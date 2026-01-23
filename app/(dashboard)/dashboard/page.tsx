/**
 * Wireframe: task-0.5.1.18-company-dashboard.md, task-0.5.1.19-moh-tier1-dashboard.md, task-0.5.1.20-moh-tier2-dashboard.md
 * Route: /dashboard
 * Implements: Role-based dashboard page with widgets, metrics, and quick actions.
 * Wireframe Links:
 *   - ../../../../04-design/user-experience/wireframes/00-core-foundation/dashboard/task-0.5.1.18-company-dashboard.md
 *   - ../../../../04-design/user-experience/wireframes/00-core-foundation/dashboard/task-0.5.1.19-moh-tier1-dashboard.md
 *   - ../../../../04-design/user-experience/wireframes/00-core-foundation/dashboard/task-0.5.1.20-moh-tier2-dashboard.md
 */
'use client';

import { useUserPermissions } from '@/lib/hooks/use-user-permissions';
import { USER_ROLES } from '@/lib/constants/roles';

export default function DashboardPage() {
  const { role, isLoading } = useUserPermissions();

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-text-secondary">Loading dashboard...</div>
      </div>
    );
  }

  // Role-based dashboard content
  // Full implementation with widgets, metrics, and quick actions will be added in future tasks
  // This is a placeholder structure that shows role-specific content

  let dashboardContent;
  switch (role) {
    case USER_ROLES.COMPANY_ADMIN:
    case USER_ROLES.COMPANY_MANAGER:
    case USER_ROLES.COMPANY_USER:
    case USER_ROLES.VENDOR:
      dashboardContent = (
        <div className="container mx-auto py-8">
          <h1 className="mb-4 text-3xl font-bold text-text-primary">Company Dashboard</h1>
          <p className="mb-6 text-text-secondary">
            Welcome to your company dashboard. Full implementation with widgets, metrics, and quick actions will be
            added in future tasks.
          </p>
          <div className="rounded-lg border border-default bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold text-text-primary">Regulatory Compliance Status</h2>
            <p className="text-text-secondary">Compliance status widget will be implemented here.</p>
          </div>
        </div>
      );
      break;
    case USER_ROLES.MOH_TIER1:
      dashboardContent = (
        <div className="container mx-auto py-8">
          <h1 className="mb-4 text-3xl font-bold text-text-primary">MOH Tier 1 Dashboard</h1>
          <p className="mb-6 text-text-secondary">
            Governance overview dashboard. Full implementation with tabs, widgets, metrics, and quick actions will be
            added in future tasks.
          </p>
          <div className="rounded-lg border border-default bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold text-text-primary">Submission Compliance (%SC)</h2>
            <p className="text-text-secondary">Submission compliance metrics will be implemented here.</p>
          </div>
        </div>
      );
      break;
    case USER_ROLES.MOH_TIER2_OFFICER:
    case USER_ROLES.MOH_TIER2_REGISTRAR:
      dashboardContent = (
        <div className="container mx-auto py-8">
          <h1 className="mb-4 text-3xl font-bold text-text-primary">MOH Tier 2 Dashboard</h1>
          <p className="mb-6 text-text-secondary">
            Operational dashboard. Full implementation with widgets, metrics, and quick actions will be added in
            future tasks.
          </p>
          <div className="rounded-lg border border-default bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold text-text-primary">Pending Approvals</h2>
            <p className="text-text-secondary">Pending approvals widget will be implemented here.</p>
          </div>
        </div>
      );
      break;
    case USER_ROLES.MOH_AUDITOR:
      dashboardContent = (
        <div className="container mx-auto py-8">
          <h1 className="mb-4 text-3xl font-bold text-text-primary">MOH Auditor Dashboard</h1>
          <p className="mb-6 text-text-secondary">
            Audit dashboard. Full implementation with widgets, metrics, and audit tools will be added in future tasks.
          </p>
          <div className="rounded-lg border border-default bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold text-text-primary">Audit Logs</h2>
            <p className="text-text-secondary">Audit logs widget will be implemented here.</p>
          </div>
        </div>
      );
      break;
    case USER_ROLES.SYSTEM_ADMIN:
      dashboardContent = (
        <div className="container mx-auto py-8">
          <h1 className="mb-4 text-3xl font-bold text-text-primary">System Admin Dashboard</h1>
          <p className="mb-6 text-text-secondary">
            System administration dashboard. Full implementation with widgets, metrics, and system management tools
            will be added in future tasks.
          </p>
          <div className="rounded-lg border border-default bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold text-text-primary">System Status</h2>
            <p className="text-text-secondary">System status widget will be implemented here.</p>
          </div>
        </div>
      );
      break;
    default:
      dashboardContent = (
        <div className="container mx-auto py-8">
          <h1 className="mb-4 text-3xl font-bold text-text-primary">Welcome to the Dashboard</h1>
          <p className="text-text-secondary">
            Dashboard content will be populated with role-specific widgets and information in future tasks.
          </p>
        </div>
      );
      break;
  }

  return dashboardContent;
}
