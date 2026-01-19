/**
 * Wireframe: task-0.5.1.16-sidebar-navigation.md
 * Implements: Sidebar navigation (collapsible, module grouping, active states, badges)
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.16-sidebar-navigation.md
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAppContext } from '@/lib/context/app-context'
import { useUserRole } from '@/lib/hooks/use-user-role'
import { useModuleStatus } from '@/lib/hooks/use-module-status'
import { useUnreadNotificationCount } from '@/lib/hooks/use-notifications'
import {
  LayoutDashboard,
  Mail,
  History,
  Bell,
  FileSearch,
  Settings,
  Building2,
  Package,
  Box,
  BarChart2,
  FileText,
  Target,
  AlertTriangle,
  TrendingUp,
  Plane,
  CheckCircle,
  PlaneTakeoff,
  BarChart,
  MessageSquare,
  FileCheck,
  Shield,
  HelpCircle,
  Book,
  LifeBuoy,
  Activity,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarItemProps {
  href: string
  icon: React.ElementType
  children: React.ReactNode
  badge?: number | string
  active?: boolean
}

function SidebarItem({ href, icon: Icon, children, badge, active }: SidebarItemProps) {
  const pathname = usePathname()
  const { sidebarOpen } = useAppContext()
  const isActive = active || pathname === href || pathname?.startsWith(href + '/')

  return (
    <Link
      href={href}
      className={cn(
        'relative flex h-10 items-center rounded-md text-sm font-medium transition-colors',
        sidebarOpen ? 'gap-3 px-3' : 'justify-center px-2',
        isActive
          ? 'border-l-3 bg-blue-50 font-semibold text-gray-900'
          : 'text-gray-700 hover:bg-gray-100'
      )}
      style={{
        height: '40px',
        padding: sidebarOpen ? '8px 12px' : '8px',
        fontSize: '14px',
        ...(isActive && {
          borderLeft: '3px solid #3b82f6',
          backgroundColor: '#eff6ff',
          color: '#111827',
        }),
      }}
      title={!sidebarOpen ? String(children) : undefined}
    >
      <Icon className={cn('h-5 w-5 flex-shrink-0', isActive ? 'text-blue-500' : 'text-gray-500')} style={{ width: '20px', height: '20px' }} />
      {sidebarOpen && (
        <>
          <span className="flex-1">{children}</span>
          {typeof badge !== 'undefined' && badge !== null && badge !== 0 && (
            <span
              className="ml-auto rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold text-white"
              style={{ minWidth: '18px', height: '18px', fontSize: '11px', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {badge}
            </span>
          )}
        </>
      )}
      {!sidebarOpen && typeof badge !== 'undefined' && badge !== null && badge !== 0 && (
        <span
          className="absolute top-1 right-1 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold text-white"
          style={{ minWidth: '18px', height: '18px', fontSize: '11px', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {badge}
        </span>
      )}
    </Link>
  )
}

interface SidebarGroupProps {
  label: string
  labelAbbr?: string
  icon?: React.ElementType
  children: React.ReactNode
}

function SidebarGroup({ label, labelAbbr, icon: Icon, children }: SidebarGroupProps) {
  const { sidebarOpen } = useAppContext()

  return (
    <div className="mb-6" style={{ marginTop: '16px', marginBottom: '16px' }}>
      {sidebarOpen && (
        <div className="mb-2 px-3" style={{ padding: '8px 12px' }}>
          <div className="text-sm font-semibold text-gray-900" style={{ fontSize: '14px', fontWeight: 600, lineHeight: 1.5 }}>
            {label}
          </div>
          {labelAbbr && (
            <div className="text-xs text-gray-600" style={{ fontSize: '12px', fontWeight: 400, lineHeight: 1.5 }}>
              {labelAbbr}
            </div>
          )}
        </div>
      )}
      <nav className="space-y-1" style={{ gap: '4px' }}>
        {children}
      </nav>
    </div>
  )
}

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useAppContext()
  const { data: roleData } = useUserRole()
  const { data: isECSActive } = useModuleStatus('ecs')
  const { data: isCMCActive } = useModuleStatus('cmc')
  const { data: unreadNotificationData } = useUnreadNotificationCount()
  const unreadNotificationCount = unreadNotificationData || 0

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 flex h-[calc(100vh-64px)] flex-col border-r border-gray-200 bg-white transition-all duration-300',
        sidebarOpen ? 'w-[280px]' : 'w-16'
      )}
      style={{
        width: sidebarOpen ? '280px' : '64px',
        height: 'calc(100vh - 64px)',
        top: '64px',
        zIndex: 100,
      }}
    >
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" style={{ padding: '16px 12px' }}>
        {/* Global Section */}
        <SidebarGroup label="Global" icon={LayoutDashboard}>
          <SidebarItem href="/dashboard" icon={LayoutDashboard}>
            Dashboard
          </SidebarItem>
          <SidebarItem href="/communications/inbox" icon={Mail} badge={unreadNotificationCount > 0 ? unreadNotificationCount : undefined}>
            Communications
          </SidebarItem>
          <SidebarItem href="/history" icon={History}>
            Regulatory Activity History
          </SidebarItem>
          <SidebarItem href="/notifications" icon={Bell} badge={unreadNotificationCount > 0 ? unreadNotificationCount : undefined}>
            Notifications
          </SidebarItem>
          {(roleData?.isMOHUser || roleData?.isTier1 || roleData?.isTier2) && (
            <SidebarItem href="/audit/logs" icon={FileSearch}>
              Audit
            </SidebarItem>
          )}
          {roleData?.isTier1 && (
            <SidebarItem href="/system/config" icon={Settings}>
              System Configuration
            </SidebarItem>
          )}
        </SidebarGroup>

        {/* Registry Management (RMM) Section */}
        <SidebarGroup label="Registry Management" labelAbbr="(RMM)" icon={Building2}>
          <SidebarItem href="/rmm/overview" icon={LayoutDashboard}>
            Overview
          </SidebarItem>
          <SidebarItem href="/rmm/companies" icon={Building2}>
            Companies
          </SidebarItem>
          <SidebarItem href="/rmm/products" icon={Package}>
            Products
          </SidebarItem>
          <SidebarItem href="/rmm/skus" icon={Box}>
            SKUs
          </SidebarItem>
        </SidebarGroup>

        {/* Value Chain Intelligence (VCI) Section */}
        <SidebarGroup label="Value Chain Intelligence" labelAbbr="(VCI)" icon={BarChart2}>
          <SidebarItem href="/vci/dashboard" icon={LayoutDashboard}>
            Dashboard
          </SidebarItem>
          <SidebarItem href="/vci/submissions" icon={FileText} badge={2}>
            Submissions
          </SidebarItem>
          <SidebarItem href="/vci/thresholds" icon={Target}>
            Thresholds
          </SidebarItem>
          <SidebarItem href="/vci/breaches" icon={AlertTriangle} badge={1}>
            Compliance Violations
          </SidebarItem>
          {(roleData?.isMOHUser || roleData?.isTier1 || roleData?.isTier2) && (
            <SidebarItem href="/vci/governance" icon={TrendingUp}>
              Governance
            </SidebarItem>
          )}
        </SidebarGroup>

        {/* Export Control System (ECS) Section - Conditional */}
        {isECSActive && (
          <SidebarGroup label="Export Control System" labelAbbr="(ECS)" icon={Plane}>
            <SidebarItem href="/ecs/overview" icon={LayoutDashboard}>
              Overview
            </SidebarItem>
            <SidebarItem href="/ecs/export-requests" icon={PlaneTakeoff}>
              Export Authorization Requests
            </SidebarItem>
            <SidebarItem href="/ecs/authorizations" icon={CheckCircle}>
              Export Authorizations
            </SidebarItem>
          </SidebarGroup>
        )}

        {/* Compliance Monitoring Center (CMC) Section - Conditional */}
        {isCMCActive && (
          <SidebarGroup label="Compliance Monitoring Center" labelAbbr="(CMC)" icon={BarChart}>
            <SidebarItem href="/cmc/overview" icon={LayoutDashboard}>
              Overview
            </SidebarItem>
            <SidebarItem href="/cmc/scores" icon={BarChart}>
              Regulatory Compliance Ratings
            </SidebarItem>
            <SidebarItem href="/cmc/disputes" icon={MessageSquare}>
              Compliance Disputes
            </SidebarItem>
            <SidebarItem href="/cmc/reports" icon={FileText}>
              Compliance Monitoring Reports
            </SidebarItem>
          </SidebarGroup>
        )}

        {/* Enforcement Section - MOH Tier 1 & Tier 2 Only */}
        {(roleData?.isTier1 || roleData?.isTier2) && (
          <SidebarGroup label="Enforcement" icon={Shield}>
            <SidebarItem href="/enforcement" icon={LayoutDashboard}>
              Dashboard
            </SidebarItem>
            <SidebarItem href="/enforcement/actions" icon={FileCheck}>
              Actions
            </SidebarItem>
            <SidebarItem href="/enforcement/pending-approvals" icon={AlertTriangle} badge={3}>
              Pending Regulatory Approvals
            </SidebarItem>
            <SidebarItem href="/enforcement/reports" icon={FileText}>
              Enforcement Activity Reports
            </SidebarItem>
          </SidebarGroup>
        )}

        {/* Help & Info Section */}
        <SidebarGroup label="Help & Info" icon={HelpCircle}>
          <SidebarItem href="/help/support" icon={LifeBuoy}>
            Support Center
          </SidebarItem>
          <SidebarItem href="/help/faq" icon={HelpCircle}>
            FAQ
          </SidebarItem>
          <SidebarItem href="/help/docs" icon={Book}>
            Documentation
          </SidebarItem>
          <SidebarItem href="/help/contact" icon={Mail}>
            Contact Support
          </SidebarItem>
          <SidebarItem href="/help/status" icon={Activity}>
            System Status
          </SidebarItem>
        </SidebarGroup>
      </nav>

      {/* Collapse Toggle - Bottom of sidebar, fixed */}
      <div
        className="flex h-12 items-center justify-center border-t border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{ height: '48px', borderTop: '1px solid #e5e7eb' }}
        aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {sidebarOpen ? (
          <ChevronLeft className="h-5 w-5 text-gray-600" style={{ width: '20px', height: '20px' }} />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-600" style={{ width: '20px', height: '20px' }} />
        )}
      </div>
    </aside>
  )
}
