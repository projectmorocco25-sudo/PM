/**
 * Status Layout (Legacy - routes redirect to /help/status)
 * Wireframe: task-0.5.1.14-dashboard-layout-structure.md
 * Implements: Dashboard layout wrapper (header + sidebar + main content) for Status routes
 * Note: Sidebar uses /help/status route, but /status route should still have layout
 */

import { DashboardLayout } from '@/components/layout/dashboard-layout'

export default function StatusLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>
}
