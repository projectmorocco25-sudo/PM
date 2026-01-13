'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ModuleGuard } from '@/components/guards/module-guard'
import { RoleGuard } from '@/components/guards/role-guard'
import { useUserRole } from '@/hooks/use-user-role'
import {
  BarChart3,
  FileSpreadsheet,
  Calendar,
  Settings2,
  TrendingUp,
  Plus,
  AlertTriangle,
  LayoutDashboard,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// Task 1.1.3.11: VCI module layout and navigation

const VCI_NAV_ITEMS = [
  {
    title: 'AAMS',
    href: '/dashboard/vci/aams',
    icon: Calendar,
    description: 'Annual Average Monthly Sales',
  },
  {
    title: 'MSQ',
    href: '/dashboard/vci/msq',
    icon: FileSpreadsheet,
    description: 'Monthly Sales Quantity',
  },
  {
    title: 'WSL',
    href: '/dashboard/vci/wsl',
    icon: TrendingUp,
    description: 'Weekly Stock Levels',
  },
  {
    title: 'Breaches',
    href: '/dashboard/vci/breaches',
    icon: AlertTriangle,
    description: 'Stock level violations',
  },
  {
    title: 'Governance',
    href: '/dashboard/vci/governance',
    icon: LayoutDashboard,
    description: 'Dashboard & analytics',
    mohOnly: true,
  },
  {
    title: 'Thresholds',
    href: '/dashboard/vci/thresholds',
    icon: Settings2,
    mohOnly: true,
  },
]

interface VCILayoutProps {
  children: React.ReactNode
}

export default function VCILayout({ children }: VCILayoutProps) {
  const pathname = usePathname()
  const { isMOH } = useUserRole()

  const filteredNavItems = VCI_NAV_ITEMS.filter(
    (item) => !item.mohOnly || isMOH
  )

  return (
    <ModuleGuard module="vci">
      <div className="space-y-6">
        {/* Module Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              Value Chain Intelligence
            </h1>
            <p className="text-muted-foreground">
              {isMOH
                ? 'Monitor and manage pharmaceutical supply chain data'
                : 'Submit and track your supply chain declarations'}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex flex-wrap gap-2 border-b pb-4">
          {filteredNavItems.map((item) => {
            const Icon = item.icon
            const isActive =
              pathname === item.href ||
              (pathname.startsWith(item.href + '/') && item.href !== '/dashboard/vci')

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            )
          })}
        </nav>

        {/* Page Content */}
        <div>{children}</div>
      </div>
    </ModuleGuard>
  )
}
