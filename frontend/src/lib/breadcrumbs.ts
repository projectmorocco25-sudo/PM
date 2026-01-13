// Task 1.1.5.56: Breadcrumb configuration for historical routes

export interface BreadcrumbItem {
  label: string
  href?: string
}

export function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/dashboard' }]

  let currentPath = ''

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    currentPath += `/${segment}`

    // Skip 'dashboard' as it's the home
    if (segment === 'dashboard') continue

    // Handle special routes
    if (segment === 'history') {
      breadcrumbs.push({ label: 'History', href: '/dashboard/history' })
      continue
    }

    if (segment === 'audit') {
      breadcrumbs.push({ label: 'Audit', href: '/dashboard/audit' })
      continue
    }

    if (segment === 'logs') {
      if (segments[i - 1] === 'audit') {
        breadcrumbs.push({ label: 'Logs', href: '/dashboard/audit/logs' })
      }
      continue
    }

    if (segment === 'reports' && segments[i - 1] === 'audit') {
      breadcrumbs.push({ label: 'Reports', href: '/dashboard/audit/reports' })
      continue
    }

    if (segment === 'vci') {
      breadcrumbs.push({ label: 'VCI', href: '/dashboard/vci' })
      continue
    }

    if (segment === 'submissions') {
      if (segments[i - 1] === 'vci') {
        breadcrumbs.push({ label: 'Submissions', href: '/dashboard/vci/submissions/history' })
      }
      continue
    }

    if (segment === 'trends') {
      if (segments[i - 2] === 'history') {
        breadcrumbs.push({ label: 'Trends', href: '/dashboard/vci/submissions/history/trends' })
      }
      continue
    }

    if (segment === 'rmm') {
      breadcrumbs.push({ label: 'RMM', href: '/dashboard/rmm' })
      continue
    }

    if (segment === 'cmc') {
      breadcrumbs.push({ label: 'CMC', href: '/dashboard/cmc' })
      continue
    }

    if (segment === 'ecs') {
      breadcrumbs.push({ label: 'ECS', href: '/dashboard/ecs' })
      continue
    }

    // Handle subsections
    if (['aams', 'msq', 'wsl', 'breaches', 'thresholds', 'governance'].includes(segment)) {
      breadcrumbs.push({
        label: segment.toUpperCase(),
        href: `/dashboard/vci/${segment}`,
      })
      continue
    }

    if (['companies', 'products', 'skus'].includes(segment)) {
      breadcrumbs.push({
        label: segment.charAt(0).toUpperCase() + segment.slice(1),
        href: `/dashboard/rmm/${segment}`,
      })
      continue
    }

    if (segment === 'scores') {
      breadcrumbs.push({ label: 'Scores', href: '/dashboard/cmc/scores' })
      continue
    }

    // Handle dynamic [id] segments
    if (segment.match(/^[a-z0-9-]+$/i) && segments[i - 1] && !['dashboard', 'vci', 'rmm', 'cmc'].includes(segments[i - 1])) {
      // This is likely an ID segment, don't add href
      breadcrumbs.push({ label: 'Details' })
      continue
    }

    // Handle 'new' routes
    if (segment === 'new') {
      breadcrumbs.push({ label: 'New' })
      continue
    }
  }

  return breadcrumbs
}

// ROUTE_TITLES for historical routes
export const ROUTE_TITLES: Record<string, string> = {
  '/dashboard/history': 'History',
  '/dashboard/audit': 'Audit',
  '/dashboard/audit/logs': 'Audit Logs',
  '/dashboard/audit/reports': 'Audit Reports',
  '/dashboard/vci/submissions/history': 'Submission History',
  '/dashboard/vci/submissions/history/trends': 'Submission Trends',
}
