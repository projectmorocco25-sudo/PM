/**
 * Task 1.1.1.18: Routing Structure
 * 
 * Centralized routing configuration for the PM Platform.
 * Defines public routes, auth routes, and dashboard routes.
 * 
 * @see docs/02-architecture/frontend/navigation-layout-patterns.md
 */

import { type LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  Building2,
  Package,
  Box,
  FileText,
  BarChart,
  BarChart2,
  TrendingUp,
  AlertTriangle,
  Target,
  Shield,
  Map,
  Plane,
  PlaneTakeoff,
  CheckCircle,
  ShieldAlert,
  Clock,
  History,
  MessageSquare,
  Mail,
  Bell,
  FileSearch,
  Settings,
  Users,
  LifeBuoy,
  HelpCircle,
  Book,
  Activity,
  Home,
  User,
  Lock,
  LogIn,
  UserPlus,
} from 'lucide-react'

// ============================================================================
// Types
// ============================================================================

export interface Route {
  /** Route path */
  path: string
  /** Display name */
  name: string
  /** Icon component */
  icon?: LucideIcon
  /** Route description */
  description?: string
  /** Required roles (empty = all authenticated) */
  roles?: string[]
  /** Whether this route is public (no auth required) */
  public?: boolean
  /** Whether this route requires authentication */
  requiresAuth?: boolean
  /** Child routes */
  children?: Route[]
  /** Badge count (for notifications) */
  badgeKey?: string
  /** Whether to hide from navigation */
  hidden?: boolean
  /** Conditional visibility function */
  condition?: 'ecs_active' | 'cmc_active' | 'ecs_historical' | 'cmc_historical'
}

export interface RouteGroup {
  /** Group name */
  name: string
  /** Group abbreviation */
  abbr?: string
  /** Group icon */
  icon?: LucideIcon
  /** Routes in this group */
  routes: Route[]
  /** Required roles for entire group */
  roles?: string[]
  /** Conditional visibility */
  condition?: 'ecs_active' | 'cmc_active' | 'ecs_historical' | 'cmc_historical'
}

// ============================================================================
// Public Routes (No Authentication Required)
// ============================================================================

export const publicRoutes: Route[] = [
  {
    path: '/',
    name: 'Home',
    icon: Home,
    description: 'Public landing page',
    public: true,
  },
  {
    path: '/about',
    name: 'About',
    description: 'About the PM Platform',
    public: true,
    hidden: true,
  },
  {
    path: '/contact',
    name: 'Contact',
    description: 'Contact information',
    public: true,
    hidden: true,
  },
  {
    path: '/status',
    name: 'System Status',
    icon: Activity,
    description: 'System status page',
    public: true,
  },
]

// ============================================================================
// Auth Routes (Login, Register, etc.)
// ============================================================================

export const authRoutes: Route[] = [
  {
    path: '/login',
    name: 'Sign In',
    icon: LogIn,
    description: 'Sign in to your account',
    public: true,
  },
  {
    path: '/register',
    name: 'Register',
    icon: UserPlus,
    description: 'Create a new account',
    public: true,
  },
  {
    path: '/forgot-password',
    name: 'Forgot Password',
    icon: Lock,
    description: 'Reset your password',
    public: true,
  },
  {
    path: '/reset-password',
    name: 'Reset Password',
    icon: Lock,
    description: 'Set a new password',
    public: true,
    hidden: true,
  },
]

// ============================================================================
// Dashboard Routes (Authenticated)
// ============================================================================

export const dashboardRouteGroups: RouteGroup[] = [
  // Global Section
  {
    name: 'Global',
    routes: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        icon: LayoutDashboard,
        description: 'Main dashboard',
        requiresAuth: true,
      },
      {
        path: '/dashboard/communications',
        name: 'Communications',
        icon: Mail,
        description: 'Messages and announcements',
        requiresAuth: true,
        badgeKey: 'unread_messages',
        children: [
          { path: '/dashboard/communications/inbox', name: 'Inbox', icon: Mail },
          { path: '/dashboard/communications/sent', name: 'Sent', icon: Mail },
          { path: '/dashboard/communications/compose', name: 'Compose', icon: Mail },
          { path: '/dashboard/communications/announcements', name: 'Announcements', icon: Bell },
          { path: '/dashboard/communications/archived', name: 'Archived', icon: History },
        ],
      },
      {
        path: '/dashboard/history',
        name: 'History',
        icon: History,
        description: 'Activity history',
        requiresAuth: true,
      },
      {
        path: '/dashboard/notifications',
        name: 'Notifications',
        icon: Bell,
        description: 'System notifications',
        requiresAuth: true,
        badgeKey: 'unread_notifications',
      },
      {
        path: '/dashboard/audit/logs',
        name: 'Audit Logs',
        icon: FileSearch,
        description: 'System audit logs',
        requiresAuth: true,
        roles: ['tier1', 'tier2_officer', 'tier2_registrar', 'auditor'],
      },
      {
        path: '/dashboard/audit/reports',
        name: 'Audit Reports',
        icon: FileText,
        description: 'Generated audit reports',
        requiresAuth: true,
        roles: ['tier1', 'tier2_officer', 'tier2_registrar'],
      },
      {
        path: '/dashboard/admin/config',
        name: 'System Configuration',
        icon: Settings,
        description: 'System settings',
        requiresAuth: true,
        roles: ['tier1', 'system_admin'],
      },
    ],
  },
  
  // Registry Management Module (RMM)
  {
    name: 'Registry Management',
    abbr: 'RMM',
    icon: Building2,
    routes: [
      {
        path: '/dashboard/rmm',
        name: 'Overview',
        icon: LayoutDashboard,
        description: 'RMM dashboard',
        requiresAuth: true,
      },
      {
        path: '/dashboard/rmm/companies',
        name: 'Companies',
        icon: Building2,
        description: 'Manage companies',
        requiresAuth: true,
        children: [
          { path: '/dashboard/rmm/companies/new', name: 'New Company', hidden: true },
          { path: '/dashboard/rmm/companies/[id]', name: 'Company Details', hidden: true },
          { path: '/dashboard/rmm/companies/[id]/edit', name: 'Edit Company', hidden: true },
        ],
      },
      {
        path: '/dashboard/rmm/products',
        name: 'Products',
        icon: Package,
        description: 'Manage products',
        requiresAuth: true,
        children: [
          { path: '/dashboard/rmm/products/new', name: 'New Product', hidden: true },
          { path: '/dashboard/rmm/products/[id]', name: 'Product Details', hidden: true },
          { path: '/dashboard/rmm/products/[id]/edit', name: 'Edit Product', hidden: true },
        ],
      },
      {
        path: '/dashboard/rmm/skus',
        name: 'SKUs',
        icon: Box,
        description: 'Manage SKUs',
        requiresAuth: true,
        children: [
          { path: '/dashboard/rmm/skus/new', name: 'New SKU', hidden: true },
          { path: '/dashboard/rmm/skus/[id]', name: 'SKU Details', hidden: true },
          { path: '/dashboard/rmm/skus/[id]/edit', name: 'Edit SKU', hidden: true },
        ],
      },
      {
        path: '/dashboard/rmm/submissions',
        name: 'Registry Submissions',
        icon: FileText,
        description: 'Registry submission requests',
        requiresAuth: true,
      },
    ],
  },
  
  // Value Chain Intelligence Module (VCI)
  {
    name: 'Value Chain Intelligence',
    abbr: 'VCI',
    icon: BarChart,
    routes: [
      {
        path: '/dashboard/vci',
        name: 'Dashboard',
        icon: LayoutDashboard,
        description: 'VCI overview',
        requiresAuth: true,
      },
      {
        path: '/dashboard/vci/aams',
        name: 'AAMS Submissions',
        icon: FileText,
        description: 'Annual AAMS submissions',
        requiresAuth: true,
        badgeKey: 'pending_aams',
      },
      {
        path: '/dashboard/vci/msq',
        name: 'MSQ Submissions',
        icon: FileText,
        description: 'Monthly stock quantity',
        requiresAuth: true,
        badgeKey: 'pending_msq',
      },
      {
        path: '/dashboard/vci/wsl',
        name: 'WSL Submissions',
        icon: FileText,
        description: 'Weekly stock levels',
        requiresAuth: true,
        badgeKey: 'pending_wsl',
      },
      {
        path: '/dashboard/vci/submissions/history',
        name: 'Submission History',
        icon: History,
        description: 'Regulatory submission history',
        requiresAuth: true,
      },
      {
        path: '/dashboard/vci/submissions/history/trends',
        name: 'Compliance Trends',
        icon: TrendingUp,
        description: 'Compliance trend analysis',
        requiresAuth: true,
        roles: ['tier1'],
      },
      {
        path: '/dashboard/vci/thresholds',
        name: 'Thresholds',
        icon: Target,
        description: 'Manage thresholds',
        requiresAuth: true,
      },
      {
        path: '/dashboard/vci/breaches',
        name: 'Compliance Violations',
        icon: AlertTriangle,
        description: 'Threshold breaches',
        requiresAuth: true,
        badgeKey: 'active_breaches',
      },
      {
        path: '/dashboard/vci/governance',
        name: 'Governance',
        icon: Shield,
        description: 'Governance settings',
        requiresAuth: true,
        roles: ['tier1', 'tier2_officer', 'tier2_registrar'],
      },
      {
        path: '/dashboard/vci/treemap',
        name: 'Supply Chain Map',
        icon: Map,
        description: 'Supply chain visualization',
        requiresAuth: true,
        roles: ['tier1', 'tier2_officer', 'tier2_registrar'],
      },
    ],
  },
  
  // Export Control System (ECS)
  {
    name: 'Export Control System',
    abbr: 'ECS',
    icon: Plane,
    condition: 'ecs_active',
    routes: [
      {
        path: '/dashboard/ecs',
        name: 'Overview',
        icon: LayoutDashboard,
        description: 'ECS dashboard',
        requiresAuth: true,
      },
      {
        path: '/dashboard/ecs/requests',
        name: 'Export Requests',
        icon: PlaneTakeoff,
        description: 'Export authorization requests',
        requiresAuth: true,
        badgeKey: 'pending_exports',
      },
      {
        path: '/dashboard/ecs/authorizations',
        name: 'Authorizations',
        icon: CheckCircle,
        description: 'Approved authorizations',
        requiresAuth: true,
      },
      {
        path: '/dashboard/ecs/history',
        name: 'Export History',
        icon: History,
        description: 'Historical export data',
        requiresAuth: true,
        condition: 'ecs_historical',
      },
    ],
  },
  
  // Enforcement Module
  {
    name: 'Enforcement',
    icon: ShieldAlert,
    roles: ['tier1', 'tier2_officer', 'tier2_registrar'],
    routes: [
      {
        path: '/dashboard/enforcement',
        name: 'Dashboard',
        icon: LayoutDashboard,
        description: 'Enforcement overview',
        requiresAuth: true,
      },
      {
        path: '/dashboard/enforcement/actions',
        name: 'Actions',
        icon: FileText,
        description: 'Enforcement actions',
        requiresAuth: true,
      },
      {
        path: '/dashboard/enforcement/pending',
        name: 'Pending Approvals',
        icon: Clock,
        description: 'Pending regulatory approvals',
        requiresAuth: true,
      },
      {
        path: '/dashboard/enforcement/reports',
        name: 'Reports',
        icon: BarChart,
        description: 'Enforcement reports',
        requiresAuth: true,
      },
    ],
  },
  
  // Compliance Monitoring Center (CMC)
  {
    name: 'Compliance Monitoring',
    abbr: 'CMC',
    icon: BarChart2,
    condition: 'cmc_active',
    routes: [
      {
        path: '/dashboard/cmc',
        name: 'Overview',
        icon: LayoutDashboard,
        description: 'CMC dashboard',
        requiresAuth: true,
      },
      {
        path: '/dashboard/cmc/scores',
        name: 'Compliance Ratings',
        icon: BarChart2,
        description: 'Regulatory compliance ratings',
        requiresAuth: true,
      },
      {
        path: '/dashboard/cmc/scores/history',
        name: 'Rating History',
        icon: History,
        description: 'Historical compliance ratings',
        requiresAuth: true,
        condition: 'cmc_historical',
      },
      {
        path: '/dashboard/cmc/disputes',
        name: 'Disputes',
        icon: MessageSquare,
        description: 'Compliance disputes',
        requiresAuth: true,
      },
      {
        path: '/dashboard/cmc/disputes/history',
        name: 'Dispute History',
        icon: History,
        description: 'Historical disputes',
        requiresAuth: true,
        condition: 'cmc_historical',
      },
      {
        path: '/dashboard/cmc/reports',
        name: 'Reports',
        icon: FileText,
        description: 'Compliance reports',
        requiresAuth: true,
      },
    ],
  },
  
  // Admin Section
  {
    name: 'Administration',
    icon: Settings,
    roles: ['tier1', 'system_admin'],
    routes: [
      {
        path: '/dashboard/admin/users',
        name: 'Users',
        icon: Users,
        description: 'User management',
        requiresAuth: true,
        roles: ['tier1', 'system_admin'],
      },
      {
        path: '/dashboard/admin/roles',
        name: 'Roles & Permissions',
        icon: Shield,
        description: 'Role management',
        requiresAuth: true,
        roles: ['tier1', 'system_admin'],
      },
      {
        path: '/dashboard/admin/config',
        name: 'System Config',
        icon: Settings,
        description: 'System configuration',
        requiresAuth: true,
        roles: ['tier1', 'system_admin'],
      },
    ],
  },
  
  // Help & Info Section
  {
    name: 'Help & Info',
    icon: HelpCircle,
    routes: [
      {
        path: '/dashboard/support',
        name: 'Support Center',
        icon: LifeBuoy,
        description: 'Get help',
        requiresAuth: true,
      },
      {
        path: '/dashboard/support/faq',
        name: 'FAQ',
        icon: HelpCircle,
        description: 'Frequently asked questions',
        requiresAuth: true,
      },
      {
        path: '/dashboard/support/documentation',
        name: 'Documentation',
        icon: Book,
        description: 'User documentation',
        requiresAuth: true,
      },
      {
        path: '/dashboard/support/contact',
        name: 'Contact Support',
        icon: Mail,
        description: 'Contact support team',
        requiresAuth: true,
      },
    ],
  },
]

// ============================================================================
// Profile Routes (Header Menu)
// ============================================================================

export const profileRoutes: Route[] = [
  {
    path: '/dashboard/profile',
    name: 'Profile',
    icon: User,
    description: 'Your profile',
    requiresAuth: true,
  },
  {
    path: '/dashboard/profile/settings',
    name: 'Account Settings',
    icon: Settings,
    description: 'Account settings',
    requiresAuth: true,
  },
  {
    path: '/dashboard/profile/security',
    name: 'Security',
    icon: Lock,
    description: 'Security settings',
    requiresAuth: true,
  },
  {
    path: '/dashboard/profile/notifications',
    name: 'Notification Preferences',
    icon: Bell,
    description: 'Notification settings',
    requiresAuth: true,
  },
]

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get all routes as a flat array
 */
export function getAllRoutes(): Route[] {
  const routes: Route[] = [
    ...publicRoutes,
    ...authRoutes,
    ...profileRoutes,
  ]
  
  dashboardRouteGroups.forEach(group => {
    group.routes.forEach(route => {
      routes.push(route)
      if (route.children) {
        routes.push(...route.children)
      }
    })
  })
  
  return routes
}

/**
 * Find a route by path
 */
export function findRouteByPath(path: string): Route | undefined {
  return getAllRoutes().find(route => 
    route.path === path || 
    route.path.replace('[id]', '*').replace(path.split('/').pop() || '', '*') === path
  )
}

/**
 * Check if a route is accessible by a role
 */
export function canAccessRoute(route: Route, userRole?: string): boolean {
  if (route.public) return true
  if (!route.roles || route.roles.length === 0) return true
  if (!userRole) return false
  return route.roles.includes(userRole)
}

/**
 * Get navigation items for a role
 */
export function getNavigationForRole(
  userRole: string,
  conditions?: {
    isEcsActive?: boolean
    isCmcActive?: boolean
    hasEcsHistorical?: boolean
    hasCmcHistorical?: boolean
  }
): RouteGroup[] {
  return dashboardRouteGroups
    .filter(group => {
      // Check role-based access
      if (group.roles && !group.roles.includes(userRole)) {
        return false
      }
      // Check conditional visibility
      if (group.condition) {
        switch (group.condition) {
          case 'ecs_active':
            return conditions?.isEcsActive || conditions?.hasEcsHistorical
          case 'cmc_active':
            return conditions?.isCmcActive || conditions?.hasCmcHistorical
          default:
            return true
        }
      }
      return true
    })
    .map(group => ({
      ...group,
      routes: group.routes.filter(route => canAccessRoute(route, userRole)),
    }))
}

/**
 * Get breadcrumb items from path
 */
export function getBreadcrumbsFromPath(path: string): Array<{ name: string; path: string }> {
  const segments = path.split('/').filter(Boolean)
  const breadcrumbs: Array<{ name: string; path: string }> = []
  
  let currentPath = ''
  for (const segment of segments) {
    currentPath += `/${segment}`
    const route = findRouteByPath(currentPath)
    if (route && !route.hidden) {
      breadcrumbs.push({
        name: route.name,
        path: currentPath,
      })
    }
  }
  
  return breadcrumbs
}

// ============================================================================
// Route Path Constants
// ============================================================================

export const ROUTES = {
  // Public
  HOME: '/',
  STATUS: '/status',
  
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  // Dashboard
  DASHBOARD: '/dashboard',
  PROFILE: '/dashboard/profile',
  NOTIFICATIONS: '/dashboard/notifications',
  
  // Communications
  COMMUNICATIONS: '/dashboard/communications',
  COMMUNICATIONS_INBOX: '/dashboard/communications/inbox',
  COMMUNICATIONS_SENT: '/dashboard/communications/sent',
  COMMUNICATIONS_COMPOSE: '/dashboard/communications/compose',
  COMMUNICATIONS_ANNOUNCEMENTS: '/dashboard/communications/announcements',
  COMMUNICATIONS_ARCHIVED: '/dashboard/communications/archived',
  
  // RMM
  RMM: '/dashboard/rmm',
  RMM_COMPANIES: '/dashboard/rmm/companies',
  RMM_PRODUCTS: '/dashboard/rmm/products',
  RMM_SKUS: '/dashboard/rmm/skus',
  RMM_SUBMISSIONS: '/dashboard/rmm/submissions',
  
  // VCI
  VCI: '/dashboard/vci',
  VCI_AAMS: '/dashboard/vci/aams',
  VCI_MSQ: '/dashboard/vci/msq',
  VCI_WSL: '/dashboard/vci/wsl',
  VCI_THRESHOLDS: '/dashboard/vci/thresholds',
  VCI_BREACHES: '/dashboard/vci/breaches',
  VCI_TREEMAP: '/dashboard/vci/treemap',
  
  // ECS
  ECS: '/dashboard/ecs',
  ECS_REQUESTS: '/dashboard/ecs/requests',
  ECS_AUTHORIZATIONS: '/dashboard/ecs/authorizations',
  
  // CMC
  CMC: '/dashboard/cmc',
  CMC_SCORES: '/dashboard/cmc/scores',
  CMC_DISPUTES: '/dashboard/cmc/disputes',
  CMC_REPORTS: '/dashboard/cmc/reports',
  
  // Admin
  ADMIN_USERS: '/dashboard/admin/users',
  ADMIN_CONFIG: '/dashboard/admin/config',
  
  // Support
  SUPPORT: '/dashboard/support',
  SUPPORT_FAQ: '/dashboard/support/faq',
  SUPPORT_DOCS: '/dashboard/support/documentation',
} as const

export type RoutePath = typeof ROUTES[keyof typeof ROUTES]
