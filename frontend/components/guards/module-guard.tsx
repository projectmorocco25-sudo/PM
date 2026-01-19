/**
 * ModuleGuard Component
 * Task: 1.1.1.14d
 * Reference: Role-Based UI Patterns, Navigation & Layout Patterns
 * 
 * Component to hide/redirect modules if not active
 */

'use client'

import { type ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useModuleStatus, type ModuleName } from '@/lib/hooks/use-module-status'
import { InlineLoader } from '@/components/ui/loading/spinner'

interface ModuleGuardProps {
  children: ReactNode
  moduleName: ModuleName
  fallback?: ReactNode
  redirectTo?: string
  hideOnInactive?: boolean
}

export function ModuleGuard({
  children,
  moduleName,
  fallback,
  redirectTo,
  hideOnInactive = false,
}: ModuleGuardProps) {
  const router = useRouter()
  const { data: isActive, isLoading } = useModuleStatus(moduleName)

  useEffect(() => {
    if (!isLoading && !isActive && redirectTo) {
      router.push(redirectTo)
    }
  }, [isActive, isLoading, redirectTo, router])

  if (isLoading) {
    return fallback || <InlineLoader message="Checking module status..." />
  }

  if (!isActive) {
    if (redirectTo) {
      // Redirect will happen in useEffect
      return null
    }

    if (hideOnInactive) {
      return fallback || null
    }

    // Show inactive message
    return (
      fallback || (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-950">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            The {moduleName.toUpperCase()} module is currently inactive.
          </p>
        </div>
      )
    )
  }

  return <>{children}</>
}
