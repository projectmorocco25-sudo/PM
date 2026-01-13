'use client'

import { useUserRole } from '@/hooks/use-user-role'

interface PermissionGuardProps {
  children: React.ReactNode
  permission: string
  fallback?: React.ReactNode
}

export function PermissionGuard({ children, permission, fallback = null }: PermissionGuardProps) {
  const { hasPermission } = useUserRole()

  if (!hasPermission(permission)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// Convenience components for common permission checks
export function CanApprove({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <PermissionGuard permission="approve_submissions" fallback={fallback}>
      {children}
    </PermissionGuard>
  )
}

export function CanVerify({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <PermissionGuard permission="verify_submissions" fallback={fallback}>
      {children}
    </PermissionGuard>
  )
}

export function CanCreateSubmissions({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <PermissionGuard permission="create_submissions" fallback={fallback}>
      {children}
    </PermissionGuard>
  )
}

export function CanManageUsers({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <PermissionGuard permission="manage_users" fallback={fallback}>
      {children}
    </PermissionGuard>
  )
}
