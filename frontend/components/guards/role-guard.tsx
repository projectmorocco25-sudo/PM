/**
 * RoleGuard Component
 * Task: 1.1.1.14b
 * Reference: Role-Based UI Patterns, UI Component Specifications
 * 
 * Component to protect routes/components based on user role
 */

'use client'

import { type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useUserRole, type UserRole } from '@/lib/hooks/use-user-role'
import { InlineLoader } from '@/components/ui/loading/spinner'
import { ErrorPage } from '@/components/ui/error/error-page'

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: UserRole | UserRole[]
  fallback?: ReactNode
  redirectTo?: string
  requireAuth?: boolean
}

export function RoleGuard({
  children,
  allowedRoles,
  fallback,
  redirectTo,
  requireAuth = true,
}: RoleGuardProps) {
  const router = useRouter()
  const { data: roleData, isLoading, error } = useUserRole()

  if (isLoading) {
    return fallback || <InlineLoader message="Checking permissions..." />
  }

  if (error) {
    return fallback || <ErrorPage error={error} />
  }

  if (!roleData) {
    if (requireAuth) {
      if (redirectTo) {
        router.push(redirectTo)
        return null
      }
      router.push('/auth/login')
      return null
    }
    return fallback || null
  }

  const allowedRolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]
  const userRole = roleData.role

  if (!userRole || !allowedRolesArray.includes(userRole)) {
    if (redirectTo) {
      router.push(redirectTo)
      return null
    }
    return (
      fallback || (
        <ErrorPage
          error={new Error('You do not have permission to access this resource')}
        />
      )
    )
  }

  return <>{children}</>
}
