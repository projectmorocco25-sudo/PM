/**
 * Dashboard Layout
 * Wireframe: task-0.5.1.14-dashboard-layout-structure.md
 * Implements: Dashboard layout wrapper (header + sidebar + main content)
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.14-dashboard-layout-structure.md
 * Task: 1.1.1.15c (Route-level integration)
 * 
 * CRITICAL: This layout file was missing, causing Header and Sidebar to not render.
 * All dashboard routes must be wrapped with DashboardLayout to show navigation.
 */

import { DashboardLayout } from '@/components/layout/dashboard-layout'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>
}
