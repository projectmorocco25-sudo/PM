/**
 * Notifications Layout
 * Wireframe: task-0.5.1.14-dashboard-layout-structure.md
 * Implements: Dashboard layout wrapper (header + sidebar + main content) for Notifications routes
 */

import { DashboardLayout } from '@/components/layout/dashboard-layout'

export default function NotificationsLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>
}
