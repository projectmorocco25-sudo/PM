'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ModuleGuard } from '@/components/guards/module-guard'
import { RoleGuard } from '@/components/guards/role-guard'
import { useUserRole } from '@/hooks/use-user-role'
import { useEnforcementStatistics } from '@/hooks/use-enforcement'
import {
  Gavel,
  FileText,
  Clock,
  BarChart3,
  Scale,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const ENFORCEMENT_NAV_ITEMS = [
  {
    title: 'Dashboard',
    href: '/dashboard/enforcement',
    icon: BarChart3,
  },
  {
    title: 'All Actions',
    href: '/dashboard/enforcement/actions',
    icon: FileText,
  },
  {
    title: 'Pending Approvals',
    href: '/dashboard/enforcement/pending',
    icon: Clock,
    mohOnly: true,
  },
  {
    title: 'Appeals',
    href: '/dashboard/enforcement/appeals',
    icon: Scale,
  },
  {
    title: 'Reports',
    href: '/dashboard/enforcement/reports',
    icon: BarChart3,
    mohOnly: true,
  },
]

interface EnforcementLayoutProps {
  children: React.ReactNode
}

export default function EnforcementLayout({ children }: EnforcementLayoutProps) {
  const pathname = usePathname()
  const { isMOH } = useUserRole()
  const { data: statsData } = useEnforcementStatistics()

  const stats = statsData?.statistics

  const filteredNavItems = ENFORCEMENT_NAV_ITEMS.filter(
    (item) => !item.mohOnly || isMOH
  )

  return (
    <ModuleGuard module="enforcement">
      <div className="space-y-6">
        {/* Module Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Gavel className="h-6 w-6" />
              Enforcement Management
            </h1>
            <p className="text-muted-foreground">
              {isMOH
                ? 'Manage enforcement actions and appeals'
                : 'View enforcement actions and submit appeals'}
            </p>
          </div>
          {isMOH && (
            <Button asChild>
              <Link href="/dashboard/enforcement/actions/new">
                <Plus className="mr-2 h-4 w-4" />
                New Action
              </Link>
            </Button>
          )}
        </div>

        {/* Quick Stats (MOH only) */}
        {isMOH && stats && (
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="rounded-lg border bg-card p-4">
              <div className="text-sm text-muted-foreground">Pending Review</div>
              <div className="text-2xl font-bold">{stats.pending_review}</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-sm text-muted-foreground">Pending Approval</div>
              <div className="text-2xl font-bold">{stats.pending_approval}</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-sm text-muted-foreground">Pending Appeals</div>
              <div className="text-2xl font-bold">{stats.pending_appeals}</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-sm text-muted-foreground">This Month</div>
              <div className="text-2xl font-bold">{stats.this_month}</div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <nav className="flex flex-wrap gap-2 border-b pb-4">
          {filteredNavItems.map((item) => {
            const Icon = item.icon
            const isActive =
              pathname === item.href ||
              (pathname.startsWith(item.href + '/') && item.href !== '/dashboard/enforcement')

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
