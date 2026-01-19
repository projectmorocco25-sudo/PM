/**
 * PermissionGuard Component
 * Task: 1.1.1.14c
 * Reference: Role-Based UI Patterns, UI Component Specifications
 * 
 * Component to protect actions based on user permissions
 */

'use client'

import { type ReactNode } from 'react'
import { useUserRole, type Permission } from '@/lib/hooks/use-user-role'
import { InlineLoader } from '@/components/ui/loading/spinner'

interface PermissionGuardProps {
  children: ReactNode
  permission: Permission
  fallback?: ReactNode
  requireAll?: boolean
  // If requireAll is true, all permissions must be present
  // If requireAll is false (default), any permission is sufficient
}

export function PermissionGuard({
  children,
  permission,
  fallback = null,
  requireAll = false,
}: PermissionGuardProps) {
  const { data: roleData, isLoading } = useUserRole()

  if (isLoading) {
    return fallback || <InlineLoader message="Checking permissions..." />
  }

  if (!roleData || !roleData.permissions || roleData.permissions.length === 0) {
    return fallback
  }

  const permissions = Array.isArray(permission) ? permission : [permission]
  const userPermissions = roleData.permissions

  // Check if user has the required permission(s)
  const hasPermission = requireAll
    ? permissions.every((p) => userPermissions.includes(p))
    : permissions.some((p) => userPermissions.includes(p))

  if (!hasPermission) {
    return fallback
  }

  return <>{children}</>
}

// Helper components for common permission checks
export function CanApprove({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <PermissionGuard permission="approve" fallback={fallback}>
      {children}
    </PermissionGuard>
  )
}

export function CanEdit({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <PermissionGuard permission="edit" fallback={fallback}>
      {children}
    </PermissionGuard>
  )
}

export function CanView({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <PermissionGuard permission="view" fallback={fallback}>
      {children}
    </PermissionGuard>
  )
}

export function CanDelete({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <PermissionGuard permission="delete" fallback={fallback}>
      {children}
    </PermissionGuard>
  )
}

export function CanManage({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <PermissionGuard permission="manage" fallback={fallback}>
      {children}
    </PermissionGuard>
  )
}
