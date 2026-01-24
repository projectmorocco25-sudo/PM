/**
 * RMM Module Layout
 * 
 * Wireframe: task-0.5.1.14-dashboard-layout-structure.md, task-0.5.1.16-sidebar-navigation.md
 * Route: /rmm/* (all RMM module pages)
 * Implements: RMM module-specific layout wrapper
 * Wireframe Links: 
 *   - ../../docs/04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.14-dashboard-layout-structure.md
 *   - ../../docs/04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.16-sidebar-navigation.md
 * 
 * Database: users table, system_config table
 * RPC Functions: shared_get_user_permissions(user_id)
 * 
 * Features:
 * - Module-specific layout wrapper for RMM pages
 * - Inherits from dashboard layout (Header, Sidebar)
 * - Module indicator in header (handled by Header component)
 * - Breadcrumbs support
 * - Role-based access control
 */

export default function RMMLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // RMM layout inherits from dashboard layout
  // This file exists to provide module-specific context if needed
  // The actual layout structure is handled by the parent dashboard layout
  return <>{children}</>;
}
