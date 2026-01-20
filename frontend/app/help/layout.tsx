/**
 * Help & Info Layout
 * Wireframe: task-0.5.1.14-dashboard-layout-structure.md
 * Implements: Dashboard layout wrapper (header + sidebar + main content) for Help routes
 */

import { DashboardLayout } from '@/components/layout/dashboard-layout'

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>
}
