'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ModuleGuard } from '@/components/guards/module-guard'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useUserRole } from '@/hooks/use-user-role'
import {
  Building2,
  Package,
  Boxes,
  FileText,
  Pill,
  AlertTriangle,
  Settings,
} from 'lucide-react'

// Task 1.1.2.16: RMM Module Layout and Navigation
// Task 1.1.2.16a: Module activation banner/indicator

const RMM_NAV_ITEMS = [
  {
    title: 'Companies',
    href: '/dashboard/rmm/companies',
    icon: Building2,
    description: 'Manage pharmaceutical companies',
  },
  {
    title: 'Products',
    href: '/dashboard/rmm/products',
    icon: Package,
    description: 'Manage pharmaceutical products',
  },
  {
    title: 'SKUs',
    href: '/dashboard/rmm/skus',
    icon: Boxes,
    description: 'Manage stock keeping units',
  },
  {
    title: 'Submissions',
    href: '/dashboard/rmm/submissions',
    icon: FileText,
    description: 'Registry submissions & approvals',
  },
  {
    title: 'ATC Codes',
    href: '/dashboard/rmm/atc-codes',
    icon: Pill,
    description: 'ATC classification codes',
  },
  {
    title: 'Critical Medicines',
    href: '/dashboard/rmm/critical-medicines',
    icon: AlertTriangle,
    description: 'Critical medicine designations',
    mohOnly: true,
  },
]

interface RMMLayoutProps {
  children: React.ReactNode
}

export default function RMMLayout({ children }: RMMLayoutProps) {
  const pathname = usePathname()
  const { role, isMOH } = useUserRole()
  const [moduleActive, setModuleActive] = React.useState(true) // Would come from system config

  const filteredNavItems = RMM_NAV_ITEMS.filter(
    (item) => !item.mohOnly || isMOH
  )

  return (
    <ModuleGuard module="rmm">
      <div className="space-y-6">
        {/* Task 1.1.2.16a: Module activation banner */}
        {!moduleActive && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Module Inactive</AlertTitle>
            <AlertDescription>
              The Registry Master Management module is currently inactive. Some
              features may be unavailable.
            </AlertDescription>
          </Alert>
        )}

        {/* Module Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Registry Master Management
            </h1>
            <p className="text-muted-foreground">
              Manage companies, products, and SKUs in the pharmaceutical registry
            </p>
          </div>
          {isMOH && (
            <Button variant="outline" asChild>
              <Link href="/dashboard/rmm/submissions">
                <FileText className="mr-2 h-4 w-4" />
                Pending Submissions
              </Link>
            </Button>
          )}
        </div>

        {/* Navigation Tabs */}
        <nav className="flex flex-wrap gap-2 border-b pb-4">
          {filteredNavItems.map((item) => {
            const Icon = item.icon
            const isActive =
              pathname === item.href ||
              (pathname.startsWith(item.href + '/') && item.href !== '/dashboard/rmm')

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
