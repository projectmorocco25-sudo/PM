/**
 * Support Layout (Legacy - routes redirect to /help)
 * Wireframe: task-0.5.1.14-dashboard-layout-structure.md
 * Implements: Dashboard layout wrapper (header + sidebar + main content) for Support routes
 * Note: Sidebar uses /help/* routes, but /support/* routes should still have layout
 */

import { DashboardLayout } from '@/components/layout/dashboard-layout'

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>
}
