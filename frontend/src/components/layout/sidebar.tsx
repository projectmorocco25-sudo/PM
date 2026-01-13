'use client'

/**
 * Task 1.1.1.20c: Communications link with unread badge count
 * 
 * Sidebar navigation component with role-based menu items.
 * 
 * @see docs/02-architecture/frontend/navigation-layout-patterns.md
 * @see docs/02-architecture/frontend/role-based-ui-patterns.md
 */

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useUserRole } from '@/hooks/use-user-role'
import { useCommunications } from '@/hooks/use-communications'
import {
  Home,
  Building2,
  Package,
  FileText,
  TrendingUp,
  AlertTriangle,
  Truck,
  BarChart3,
  MessageSquare,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  Shield,
  Mail,
  Send,
  Megaphone,
  Archive,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  children?: NavItem[]
  roles?: string[]
}

const navigation: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: 'RMM',
    href: '/dashboard/rmm',
    icon: Building2,
    children: [
      { title: 'Companies', href: '/dashboard/rmm/companies', icon: Building2 },
      { title: 'Products', href: '/dashboard/rmm/products', icon: Package },
      { title: 'SKUs', href: '/dashboard/rmm/skus', icon: Package },
      { title: 'Registry Submissions', href: '/dashboard/rmm/submissions', icon: FileText },
    ],
  },
  {
    title: 'VCI',
    href: '/dashboard/vci',
    icon: TrendingUp,
    children: [
      { title: 'AAMS', href: '/dashboard/vci/aams', icon: FileText },
      { title: 'MSQ', href: '/dashboard/vci/msq', icon: FileText },
      { title: 'WSL', href: '/dashboard/vci/wsl', icon: FileText },
      { title: 'Thresholds', href: '/dashboard/vci/thresholds', icon: TrendingUp },
      { title: 'Breaches', href: '/dashboard/vci/breaches', icon: AlertTriangle, badge: 5 },
    ],
  },
  {
    title: 'ECS',
    href: '/dashboard/ecs',
    icon: Truck,
    roles: ['tier1', 'tier2_officer', 'tier2_registrar', 'company_admin', 'company_manager'],
    children: [
      { title: 'Export Requests', href: '/dashboard/ecs/requests', icon: FileText },
      { title: 'Authorizations', href: '/dashboard/ecs/authorizations', icon: Shield },
    ],
  },
  {
    title: 'CMC',
    href: '/dashboard/cmc',
    icon: BarChart3,
    roles: ['tier1', 'tier2_officer', 'tier2_registrar'],
    children: [
      { title: 'Compliance Scores', href: '/dashboard/cmc/scores', icon: BarChart3 },
      { title: 'Reports', href: '/dashboard/cmc/reports', icon: FileText },
    ],
  },
  // Task 1.1.1.20c: Communications link with unread badge
  {
    title: 'Communications',
    href: '/dashboard/communications',
    icon: MessageSquare,
    badge: undefined, // Dynamic badge set via useCommunications hook
    children: [
      { title: 'Inbox', href: '/dashboard/communications/inbox', icon: Mail },
      { title: 'Sent', href: '/dashboard/communications/sent', icon: Send },
      { title: 'Announcements', href: '/dashboard/communications/announcements', icon: Megaphone, roles: ['tier1'] },
      { title: 'Archived', href: '/dashboard/communications/archived', icon: Archive },
    ],
  },
  {
    title: 'Admin',
    href: '/dashboard/admin',
    icon: Settings,
    roles: ['tier1', 'system_admin'],
    children: [
      { title: 'Users', href: '/dashboard/admin/users', icon: Users },
      { title: 'System Config', href: '/dashboard/admin/config', icon: Settings },
    ],
  },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { role } = useUserRole()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    )
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  const canAccess = (item: NavItem) => {
    if (!item.roles) return true
    if (!role) return false
    return item.roles.includes(role)
  }

  // Apply dynamic badge for Communications
  const filteredNavigation = navigation.filter(canAccess).map(item => {
    if (item.title === 'Communications') {
      return { ...item, badge: unreadCount > 0 ? unreadCount : undefined }
    }
    return item
  })

  return (
    <aside
      className={cn(
        'fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-64 border-r bg-background transition-transform md:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="flex h-full flex-col overflow-y-auto py-4">
        <nav className="flex-1 space-y-1 px-3">
          {filteredNavigation.map((item) => (
            <div key={item.title}>
              {item.children ? (
                <>
                  <Button
                    variant="ghost"
                    className={cn(
                      'w-full justify-start',
                      isActive(item.href) && 'bg-muted'
                    )}
                    onClick={() => toggleExpanded(item.title)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span className="flex-1 text-left">{item.title}</span>
                    {item.badge && (
                      <Badge variant="destructive" className="ml-auto mr-2">
                        {item.badge}
                      </Badge>
                    )}
                    {expandedItems.includes(item.title) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                  {expandedItems.includes(item.title) && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.filter(canAccess).map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onClose}
                          className={cn(
                            'flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-muted',
                            isActive(child.href) && 'bg-muted text-primary'
                          )}
                        >
                          <child.icon className="mr-2 h-4 w-4" />
                          {child.title}
                          {child.badge && (
                            <Badge variant="destructive" className="ml-auto">
                              {child.badge}
                            </Badge>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-muted',
                    isActive(item.href) && 'bg-muted text-primary'
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <Badge variant="destructive" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}
    </aside>
  )
}
