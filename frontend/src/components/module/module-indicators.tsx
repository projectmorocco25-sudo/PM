'use client'

import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import { Info, AlertCircle, History, Clock, Archive, Lock, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

// Task 1.1.5.48-51: Module Activation Impact Components

// Types
interface ModuleStatus {
  isActive: boolean
  hasHistoricalData: boolean
  activationPeriod?: {
    start: string
    end?: string
  }
}

// Task 1.1.5.48: Inactive module indicators
interface InactiveModuleBannerProps {
  moduleName: string
  hasHistoricalData: boolean
  activationPeriod?: {
    start: string
    end?: string
  }
  onViewHistory?: () => void
  className?: string
}

export function InactiveModuleBanner({
  moduleName,
  hasHistoricalData,
  activationPeriod,
  onViewHistory,
  className,
}: InactiveModuleBannerProps) {
  return (
    <Alert className={cn('bg-muted/50', className)}>
      <Info className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-2">
        {moduleName} Module Inactive
        <Badge variant="secondary">
          <Lock className="h-3 w-3 mr-1" />
          Read-only
        </Badge>
      </AlertTitle>
      <AlertDescription className="mt-2 space-y-2">
        <p className="text-muted-foreground">
          This module is currently inactive. Data is available in read-only mode.
        </p>
        {activationPeriod && (
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              Active period: {format(new Date(activationPeriod.start), 'MMM d, yyyy')}
              {activationPeriod.end && ` - ${format(new Date(activationPeriod.end), 'MMM d, yyyy')}`}
            </span>
          </div>
        )}
        {hasHistoricalData && onViewHistory && (
          <Button variant="outline" size="sm" onClick={onViewHistory} className="mt-2">
            <History className="mr-2 h-4 w-4" />
            View Historical Data
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}

// Read-only badge
interface ReadOnlyBadgeProps {
  className?: string
}

export function ReadOnlyBadge({ className }: ReadOnlyBadgeProps) {
  return (
    <Badge variant="secondary" className={cn('gap-1', className)}>
      <Lock className="h-3 w-3" />
      Read-only
    </Badge>
  )
}

// Historical data badge
interface HistoricalBadgeProps {
  className?: string
}

export function HistoricalBadge({ className }: HistoricalBadgeProps) {
  return (
    <Badge variant="outline" className={cn('gap-1 bg-amber-50 text-amber-700 border-amber-200', className)}>
      <Archive className="h-3 w-3" />
      Historical
    </Badge>
  )
}

// Module activation period display
interface ActivationPeriodDisplayProps {
  start: string
  end?: string
  isActive?: boolean
  className?: string
}

export function ActivationPeriodDisplay({
  start,
  end,
  isActive = false,
  className,
}: ActivationPeriodDisplayProps) {
  return (
    <div className={cn('flex items-center gap-2 text-sm', className)}>
      <Clock className="h-4 w-4 text-muted-foreground" />
      <span className="text-muted-foreground">
        {isActive ? 'Active since:' : 'Was active:'}
      </span>
      <span>
        {format(new Date(start), 'MMM d, yyyy')}
        {end && ` - ${format(new Date(end), 'MMM d, yyyy')}`}
      </span>
      {isActive && (
        <Badge variant="default" className="ml-2">Active</Badge>
      )}
    </div>
  )
}

// Task 1.1.5.49: Data existence checks hook
export function useModuleDataExists(module: 'ecs' | 'cmc') {
  const [hasData, setHasData] = React.useState<boolean | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function checkData() {
      try {
        // Would call RPC: has_historical_ecs_data or has_historical_cmc_data
        // For now, mock the check
        await new Promise((r) => setTimeout(r, 500))
        setHasData(module === 'cmc') // Mock: CMC has data, ECS doesn't
      } catch {
        setHasData(false)
      } finally {
        setIsLoading(false)
      }
    }
    checkData()
  }, [module])

  return { hasData, isLoading }
}

// Task 1.1.5.50: Navigation item with historical indicator
interface ModuleNavItemProps {
  name: string
  href: string
  icon: React.ReactNode
  isActive: boolean
  hasHistoricalData: boolean
  onClick?: () => void
  className?: string
}

export function ModuleNavItem({
  name,
  href,
  icon,
  isActive,
  hasHistoricalData,
  onClick,
  className,
}: ModuleNavItemProps) {
  const showItem = isActive || hasHistoricalData

  if (!showItem) return null

  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center justify-between px-3 py-2 rounded-md transition-colors',
        'hover:bg-muted',
        className
      )}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{name}</span>
      </div>
      {!isActive && hasHistoricalData && <HistoricalBadge />}
    </a>
  )
}

// Task 1.1.5.51: Route protection component
interface HistoricalRouteGuardProps {
  module: 'ecs' | 'cmc'
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function HistoricalRouteGuard({
  module,
  children,
  fallback,
}: HistoricalRouteGuardProps) {
  const { hasData, isLoading } = useModuleDataExists(module)

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
  }

  if (!hasData) {
    return fallback || (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Archive className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">No Data Available</h2>
        <p className="text-muted-foreground max-w-md">
          This module has no historical data available. It may not have been active
          during any previous period.
        </p>
      </div>
    )
  }

  return <>{children}</>
}
