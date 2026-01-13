'use client'

/**
 * Task 1.1.1.14d: Module activation check UI
 * 
 * Guards that redirect/hide modules if not active.
 * Supports ECS and CMC conditional modules.
 * 
 * @see docs/02-architecture/frontend/role-based-ui-patterns.md
 * @see docs/02-architecture/frontend/navigation-layout-patterns.md
 */

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Clock, Archive, Info } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/loading'

// ============================================================================
// Types
// ============================================================================

export type ModuleType = 'ecs' | 'cmc' | 'enforcement' | 'vci' | 'rmm'

export interface ModuleStatus {
  isActive: boolean
  hasHistoricalData: boolean
  deactivatedAt?: string
  reason?: string
}

interface ModuleGuardProps {
  /** Module to check */
  module: ModuleType
  /** Children to render if module is accessible */
  children: React.ReactNode
  /** Show historical data banner instead of blocking */
  allowHistorical?: boolean
  /** Custom fallback component */
  fallback?: React.ReactNode
  /** Loading component */
  loadingFallback?: React.ReactNode
}

// ============================================================================
// Mock Hook (replace with actual implementation)
// ============================================================================

/**
 * Hook to check module activation status
 * In production, this should fetch from the backend/context
 */
export function useModuleStatus(module: ModuleType): {
  status: ModuleStatus | null
  isLoading: boolean
  error: Error | null
} {
  const [status, setStatus] = React.useState<ModuleStatus | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    // Simulate fetching module status
    // In production, fetch from API or context
    const fetchStatus = async () => {
      try {
        setIsLoading(true)
        
        // Default: all modules active
        // ECS and CMC can be conditionally active based on system settings
        const moduleStatuses: Record<ModuleType, ModuleStatus> = {
          rmm: { isActive: true, hasHistoricalData: true },
          vci: { isActive: true, hasHistoricalData: true },
          ecs: { isActive: true, hasHistoricalData: true }, // Can be conditional
          cmc: { isActive: true, hasHistoricalData: true }, // Can be conditional
          enforcement: { isActive: true, hasHistoricalData: true },
        }
        
        setStatus(moduleStatuses[module])
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch module status'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchStatus()
  }, [module])

  return { status, isLoading, error }
}

// ============================================================================
// Module Guard Component
// ============================================================================

/**
 * Guards module access based on activation status
 * 
 * @example
 * <ModuleGuard module="ecs" allowHistorical>
 *   <ExportControlContent />
 * </ModuleGuard>
 */
export function ModuleGuard({
  module,
  children,
  allowHistorical = true,
  fallback,
  loadingFallback,
}: ModuleGuardProps) {
  const router = useRouter()
  const { status, isLoading, error } = useModuleStatus(module)

  // Loading state
  if (isLoading) {
    return loadingFallback || (
      <div className="flex items-center justify-center min-h-[200px]">
        <Spinner size="lg" />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to check module status. Please try again later.
        </AlertDescription>
      </Alert>
    )
  }

  // Module not found
  if (!status) {
    return (
      <ModuleNotFound module={module} onNavigateBack={() => router.push('/dashboard')} />
    )
  }

  // Module is active - render children
  if (status.isActive) {
    return <>{children}</>
  }

  // Module inactive but has historical data and historical access is allowed
  if (!status.isActive && status.hasHistoricalData && allowHistorical) {
    return (
      <>
        <HistoricalDataBanner module={module} deactivatedAt={status.deactivatedAt} />
        {children}
      </>
    )
  }

  // Module inactive - show fallback or default inactive message
  if (fallback) {
    return <>{fallback}</>
  }

  return (
    <ModuleInactive
      module={module}
      reason={status.reason}
      hasHistoricalData={status.hasHistoricalData}
      onNavigateBack={() => router.push('/dashboard')}
      onViewHistorical={
        status.hasHistoricalData
          ? () => router.push(`/dashboard/${module}/history`)
          : undefined
      }
    />
  )
}

// ============================================================================
// Sub-components
// ============================================================================

interface ModuleInactiveProps {
  module: ModuleType
  reason?: string
  hasHistoricalData?: boolean
  onNavigateBack: () => void
  onViewHistorical?: () => void
}

function ModuleInactive({
  module,
  reason,
  hasHistoricalData,
  onNavigateBack,
  onViewHistorical,
}: ModuleInactiveProps) {
  const moduleNames: Record<ModuleType, string> = {
    ecs: 'Export Control System',
    cmc: 'Compliance Monitoring Center',
    enforcement: 'Enforcement',
    vci: 'Value Chain Intelligence',
    rmm: 'Registry Management',
  }

  return (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Clock className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle>Module Not Active</CardTitle>
          <CardDescription>
            The {moduleNames[module]} module is currently not active.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {reason && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>{reason}</AlertDescription>
            </Alert>
          )}
          
          <div className="flex flex-col gap-2">
            <Button onClick={onNavigateBack}>
              Return to Dashboard
            </Button>
            {hasHistoricalData && onViewHistorical && (
              <Button variant="outline" onClick={onViewHistorical}>
                <Archive className="h-4 w-4 mr-2" />
                View Historical Data
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface ModuleNotFoundProps {
  module: string
  onNavigateBack: () => void
}

function ModuleNotFound({ module, onNavigateBack }: ModuleNotFoundProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle>Module Not Found</CardTitle>
          <CardDescription>
            The module &quot;{module}&quot; does not exist or is not configured.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onNavigateBack} className="w-full">
            Return to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

interface HistoricalDataBannerProps {
  module: ModuleType
  deactivatedAt?: string
}

/**
 * Banner shown when viewing historical data from an inactive module
 */
export function HistoricalDataBanner({ module, deactivatedAt }: HistoricalDataBannerProps) {
  const moduleNames: Record<ModuleType, string> = {
    ecs: 'Export Control System',
    cmc: 'Compliance Monitoring Center',
    enforcement: 'Enforcement',
    vci: 'Value Chain Intelligence',
    rmm: 'Registry Management',
  }

  return (
    <Alert className="mb-4 border-amber-200 bg-amber-50">
      <Archive className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-800">Historical Data</AlertTitle>
      <AlertDescription className="text-amber-700">
        The {moduleNames[module]} module is no longer active.
        {deactivatedAt && ` It was deactivated on ${new Date(deactivatedAt).toLocaleDateString()}.`}
        {' '}You are viewing historical data only. No new submissions or modifications can be made.
      </AlertDescription>
    </Alert>
  )
}

// ============================================================================
// Utility Hook
// ============================================================================

/**
 * Hook to check if a module is accessible
 */
export function useModuleAccessible(module: ModuleType): {
  isAccessible: boolean
  isHistoricalOnly: boolean
  isLoading: boolean
} {
  const { status, isLoading } = useModuleStatus(module)

  return {
    isAccessible: status?.isActive || (status?.hasHistoricalData ?? false),
    isHistoricalOnly: !status?.isActive && (status?.hasHistoricalData ?? false),
    isLoading,
  }
}
