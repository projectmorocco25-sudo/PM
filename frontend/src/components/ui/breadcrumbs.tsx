'use client'

/**
 * Task 1.1.1.17j: Navigation Components - Breadcrumbs
 * 
 * Breadcrumb navigation component for hierarchical navigation.
 * 
 * @see docs/02-architecture/frontend/navigation-layout-patterns.md
 * @see docs/02-architecture/frontend/ui-component-specifications.md
 */

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ChevronRight, Home } from 'lucide-react'

// ============================================================================
// Types
// ============================================================================

export interface BreadcrumbItem {
  /** Display label */
  label: string
  /** Navigation href */
  href?: string
  /** Whether this is the current page */
  isCurrent?: boolean
  /** Custom icon */
  icon?: React.ReactNode
}

interface BreadcrumbsProps {
  /** Breadcrumb items */
  items?: BreadcrumbItem[]
  /** Whether to show home icon */
  showHome?: boolean
  /** Home href */
  homeHref?: string
  /** Separator between items */
  separator?: React.ReactNode
  /** Maximum items to show (collapses middle items) */
  maxItems?: number
  /** Custom className */
  className?: string
}

// ============================================================================
// Route to Label Mapping
// ============================================================================

const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  companies: 'Companies',
  products: 'Products',
  skus: 'SKUs',
  submissions: 'Submissions',
  aams: 'AAMS',
  msq: 'MSQ',
  wsl: 'WSL',
  thresholds: 'Thresholds',
  breaches: 'Breaches',
  exports: 'Export Requests',
  compliance: 'Compliance',
  scores: 'Scores',
  communications: 'Communications',
  inbox: 'Inbox',
  sent: 'Sent',
  compose: 'Compose',
  announcements: 'Announcements',
  settings: 'Settings',
  profile: 'Profile',
  notifications: 'Notifications',
  users: 'Users',
  audit: 'Audit Logs',
}

/**
 * Convert route segment to display label
 */
function getRouteLabel(segment: string): string {
  return routeLabels[segment] || 
    segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
}

// ============================================================================
// Breadcrumbs Component
// ============================================================================

/**
 * Breadcrumb navigation component
 * 
 * @example
 * // Auto-generated from URL
 * <Breadcrumbs />
 * 
 * // Custom items
 * <Breadcrumbs items={[
 *   { label: 'Companies', href: '/companies' },
 *   { label: 'Acme Inc', href: '/companies/123' },
 *   { label: 'Products', isCurrent: true },
 * ]} />
 */
export function Breadcrumbs({
  items,
  showHome = true,
  homeHref = '/dashboard',
  separator,
  maxItems = 5,
  className,
}: BreadcrumbsProps) {
  const pathname = usePathname()
  
  // Generate breadcrumbs from URL if items not provided
  const breadcrumbItems = React.useMemo(() => {
    if (items) return items
    
    const segments = pathname.split('/').filter(Boolean)
    const generatedItems: BreadcrumbItem[] = []
    
    segments.forEach((segment, index) => {
      // Skip dynamic route segments (UUIDs, etc.)
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)
      
      if (!isUuid) {
        const href = '/' + segments.slice(0, index + 1).join('/')
        const isLast = index === segments.length - 1
        
        generatedItems.push({
          label: getRouteLabel(segment),
          href: isLast ? undefined : href,
          isCurrent: isLast,
        })
      }
    })
    
    return generatedItems
  }, [items, pathname])

  // Collapse middle items if too many
  const displayItems = React.useMemo(() => {
    if (breadcrumbItems.length <= maxItems) {
      return breadcrumbItems
    }
    
    const first = breadcrumbItems.slice(0, 1)
    const last = breadcrumbItems.slice(-2)
    
    return [
      ...first,
      { label: '...', isCollapsed: true } as BreadcrumbItem & { isCollapsed: boolean },
      ...last,
    ]
  }, [breadcrumbItems, maxItems])

  const separatorElement = separator || (
    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
  )

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn('flex items-center', className)}
    >
      <ol className="flex items-center gap-2 text-sm">
        {/* Home link */}
        {showHome && (
          <>
            <li>
              <Link
                href={homeHref}
                className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Home"
              >
                <Home className="h-4 w-4" />
              </Link>
            </li>
            {displayItems.length > 0 && (
              <li aria-hidden="true" className="flex items-center">
                {separatorElement}
              </li>
            )}
          </>
        )}
        
        {/* Breadcrumb items */}
        {displayItems.map((item, index) => (
          <React.Fragment key={item.label + index}>
            <li className="flex items-center">
              <BreadcrumbLink item={item} />
            </li>
            {index < displayItems.length - 1 && (
              <li aria-hidden="true" className="flex items-center">
                {separatorElement}
              </li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  )
}

// ============================================================================
// BreadcrumbLink Component
// ============================================================================

interface BreadcrumbLinkProps {
  item: BreadcrumbItem & { isCollapsed?: boolean }
}

function BreadcrumbLink({ item }: BreadcrumbLinkProps) {
  if (item.isCollapsed) {
    return (
      <span className="text-muted-foreground px-1">
        {item.label}
      </span>
    )
  }
  
  if (item.isCurrent || !item.href) {
    return (
      <span
        className="text-foreground font-medium"
        aria-current="page"
      >
        {item.icon}
        {item.label}
      </span>
    )
  }
  
  return (
    <Link
      href={item.href}
      className={cn(
        'text-muted-foreground hover:text-foreground transition-colors',
        'flex items-center gap-1'
      )}
    >
      {item.icon}
      {item.label}
    </Link>
  )
}

// ============================================================================
// Export for use with custom items
// ============================================================================

export { getRouteLabel }
