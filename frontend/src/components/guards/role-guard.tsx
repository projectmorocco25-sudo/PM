'use client'

import { useAuth } from '@/providers/auth-provider'
import type { UserRole } from '@/types/supabase'

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
  fallback?: React.ReactNode
}

export function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
  const { profile, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  if (!profile || !allowedRoles.includes(profile.role)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// Convenience components for common role checks
export function MOHOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleGuard
      allowedRoles={['tier1', 'tier2_officer', 'tier2_registrar', 'auditor', 'system_admin']}
      fallback={fallback}
    >
      {children}
    </RoleGuard>
  )
}

export function Tier1Only({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['tier1']} fallback={fallback}>
      {children}
    </RoleGuard>
  )
}

export function Tier2Only({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['tier2_officer', 'tier2_registrar']} fallback={fallback}>
      {children}
    </RoleGuard>
  )
}

export function CompanyOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['company_admin', 'company_manager', 'company_user']} fallback={fallback}>
      {children}
    </RoleGuard>
  )
}
