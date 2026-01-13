'use client'

/**
 * Task 1.1.1.12k: Code splitting - Dynamic imports and lazy loading
 * 
 * Utilities for dynamic component loading with code splitting.
 * Uses Next.js dynamic imports with custom loading states.
 * 
 * @see docs/02-architecture/frontend/state-management-ui-patterns.md
 */

import dynamic from 'next/dynamic'
import { ComponentType, ReactNode } from 'react'
import { Spinner, PageLoading, SkeletonCard } from '@/components/ui/loading'

// ============================================================================
// Loading Components for Dynamic Imports
// ============================================================================

/**
 * Default loading component for dynamic imports
 */
export function DynamicLoadingDefault() {
  return (
    <div className="flex items-center justify-center py-8">
      <Spinner size="md" />
    </div>
  )
}

/**
 * Full page loading component for route-level dynamic imports
 */
export function DynamicLoadingPage() {
  return <PageLoading message="Loading..." />
}

/**
 * Card loading component for card-sized dynamic imports
 */
export function DynamicLoadingCard() {
  return <SkeletonCard />
}

/**
 * Inline loading component for small dynamic imports
 */
export function DynamicLoadingInline() {
  return <Spinner size="sm" />
}

// ============================================================================
// Dynamic Import Factory Functions
// ============================================================================

interface DynamicImportOptions<P = Record<string, unknown>> {
  /** Custom loading component */
  loading?: ComponentType
  /** Enable SSR (default: false for client components) */
  ssr?: boolean
}

/**
 * Create a dynamically imported component with default loading state
 * 
 * @example
 * const DynamicChart = createDynamicComponent(
 *   () => import('@/components/charts/line-chart'),
 *   { loading: ChartSkeleton }
 * )
 */
export function createDynamicComponent<P extends Record<string, unknown>>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: DynamicImportOptions<P> = {}
): ComponentType<P> {
  const { loading: LoadingComponent = DynamicLoadingDefault, ssr = false } = options
  
  return dynamic(importFn, {
    loading: () => <LoadingComponent />,
    ssr,
  })
}

/**
 * Create a dynamically imported page component with full-page loading
 * 
 * @example
 * const DynamicDashboard = createDynamicPage(
 *   () => import('@/app/(dashboard)/dashboard/page')
 * )
 */
export function createDynamicPage<P extends Record<string, unknown>>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: Omit<DynamicImportOptions<P>, 'loading'> = {}
): ComponentType<P> {
  return dynamic(importFn, {
    loading: () => <DynamicLoadingPage />,
    ssr: options.ssr ?? false,
  })
}

// ============================================================================
// Pre-configured Dynamic Components (Heavy Components)
// ============================================================================

/**
 * Dynamically loaded data table component
 * Use for complex tables with sorting, filtering, pagination
 */
export const DynamicDataTable = createDynamicComponent(
  () => import('@/components/ui/table').then(mod => ({ default: mod.Table })),
  { loading: () => <SkeletonCard className="h-96" /> }
)

/**
 * Dynamically loaded rich text editor
 * Heavy component - load only when needed
 */
export const DynamicRichTextEditor = createDynamicComponent(
  () => import('@/components/ui/textarea').then(mod => ({ default: mod.Textarea })),
  { loading: DynamicLoadingDefault }
)

/**
 * Dynamically loaded date picker
 */
export const DynamicDatePicker = createDynamicComponent(
  () => import('@/components/ui/popover').then(mod => ({ default: mod.Popover })),
  { loading: DynamicLoadingInline }
)

// ============================================================================
// Route-level Dynamic Imports
// ============================================================================

/**
 * Dynamic imports for dashboard modules
 * These are loaded on-demand when user navigates to the route
 */
export const DynamicDashboardPages = {
  // RMM Module
  CompaniesPage: createDynamicPage(() => 
    import('@/components/ui/card').then(mod => ({ default: () => <mod.Card>Companies</mod.Card> }))
  ),
  ProductsPage: createDynamicPage(() => 
    import('@/components/ui/card').then(mod => ({ default: () => <mod.Card>Products</mod.Card> }))
  ),
  
  // VCI Module
  SubmissionsPage: createDynamicPage(() => 
    import('@/components/ui/card').then(mod => ({ default: () => <mod.Card>Submissions</mod.Card> }))
  ),
  ThresholdsPage: createDynamicPage(() => 
    import('@/components/ui/card').then(mod => ({ default: () => <mod.Card>Thresholds</mod.Card> }))
  ),
  
  // Communications
  MessagesPage: createDynamicPage(() => 
    import('@/components/communications/communications-inbox')
      .then(mod => ({ default: mod.CommunicationsInbox }))
  ),
}

// ============================================================================
// Prefetch Utilities
// ============================================================================

/**
 * Prefetch a dynamic component (triggers the import)
 * Call this on hover or when user is likely to need the component
 * 
 * @example
 * <button onMouseEnter={() => prefetchComponent(importChartModule)}>
 *   View Charts
 * </button>
 */
export function prefetchComponent(
  importFn: () => Promise<{ default: ComponentType<unknown> }>
): void {
  // Start loading the module in the background
  importFn().catch(() => {
    // Silently fail - component will load when actually needed
  })
}

/**
 * Prefetch multiple components
 * 
 * @example
 * prefetchComponents([
 *   () => import('@/components/charts/line-chart'),
 *   () => import('@/components/charts/bar-chart'),
 * ])
 */
export function prefetchComponents(
  importFns: Array<() => Promise<{ default: ComponentType<unknown> }>>
): void {
  importFns.forEach(prefetchComponent)
}

// ============================================================================
// Conditional Loading Utilities
// ============================================================================

interface ConditionalLoadProps {
  /** Condition to evaluate */
  condition: boolean
  /** Component to load when condition is true */
  importFn: () => Promise<{ default: ComponentType<unknown> }>
  /** Fallback component when condition is false */
  fallback?: ReactNode
  /** Props to pass to the loaded component */
  componentProps?: Record<string, unknown>
}

/**
 * Conditionally load a component based on a condition
 * Only imports the component when the condition is true
 * 
 * @example
 * <ConditionalLoad
 *   condition={user.isPremium}
 *   importFn={() => import('@/components/premium-features')}
 *   fallback={<UpgradeBanner />}
 * />
 */
export function ConditionalLoad({
  condition,
  importFn,
  fallback = null,
  componentProps = {},
}: ConditionalLoadProps) {
  if (!condition) {
    return <>{fallback}</>
  }
  
  const DynamicComponent = createDynamicComponent(importFn)
  return <DynamicComponent {...componentProps} />
}

// ============================================================================
// Module Preloading for Routes
// ============================================================================

/**
 * Preload modules for a specific route
 * Call this when navigating to a route to start loading components early
 * 
 * @example
 * // In navigation component
 * const handleNavigation = (route: string) => {
 *   preloadRouteModules(route)
 *   router.push(route)
 * }
 */
export function preloadRouteModules(route: string): void {
  const moduleMap: Record<string, Array<() => Promise<unknown>>> = {
    '/dashboard': [
      () => import('@/components/ui/card'),
      () => import('@/components/ui/table'),
    ],
    '/companies': [
      () => import('@/components/ui/table'),
      () => import('@/components/ui/dialog'),
    ],
    '/submissions': [
      () => import('@/components/ui/table'),
      () => import('@/components/ui/form'),
    ],
    '/messages': [
      () => import('@/components/communications/communications-inbox'),
      () => import('@/components/communications/compose-message'),
    ],
  }
  
  const modules = moduleMap[route]
  if (modules) {
    modules.forEach(importFn => {
      importFn().catch(() => {})
    })
  }
}
