'use client'

import { useAuth } from '@/providers/auth-provider'
import type { UserRole } from '@/types/supabase'

interface UseUserRoleReturn {
  role: UserRole | null
  isMOH: boolean
  isTier1: boolean
  isTier2: boolean
  isTier2Officer: boolean
  isTier2Registrar: boolean
  isCompanyUser: boolean
  isCompanyAdmin: boolean
  isCompanyManager: boolean
  isAuditor: boolean
  isSystemAdmin: boolean
  hasPermission: (permission: string) => boolean
  canAccessModule: (module: 'rmm' | 'vci' | 'ecs' | 'cmc') => boolean
}

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  tier1: [
    'approve_submissions',
    'approve_thresholds',
    'activate_modules',
    'designate_critical_medicines',
    'create_meetings',
    'create_follow_ups',
    'create_announcements',
    'view_all_companies',
    'view_all_submissions',
    'view_all_breaches',
    'view_audit_logs',
    'manage_users',
  ],
  tier2_officer: [
    'verify_submissions',
    'analyze_breaches',
    'create_follow_ups',
    'view_all_companies',
    'view_all_submissions',
    'view_all_breaches',
    'view_audit_logs',
  ],
  tier2_registrar: [
    'implement_registry_changes',
    'view_all_companies',
    'view_all_submissions',
    'view_audit_logs',
  ],
  company_admin: [
    'create_submissions',
    'update_company_info',
    'manage_products',
    'manage_skus',
    'manage_company_users',
    'view_company_submissions',
    'view_company_breaches',
  ],
  company_manager: [
    'create_submissions',
    'manage_products',
    'manage_skus',
    'view_company_submissions',
    'view_company_breaches',
  ],
  company_user: [
    'create_submissions',
    'view_company_submissions',
    'view_company_breaches',
  ],
  auditor: [
    'view_all_companies',
    'view_all_submissions',
    'view_all_breaches',
    'view_audit_logs',
  ],
  system_admin: [
    'manage_system',
    'view_all_companies',
    'view_all_submissions',
    'view_all_breaches',
    'view_audit_logs',
    'manage_users',
  ],
  vendor: [],
}

export function useUserRole(): UseUserRoleReturn {
  const { profile, isMOH, isTier1, isTier2, isCompanyUser } = useAuth()
  const role = profile?.role ?? null

  const isTier2Officer = role === 'tier2_officer'
  const isTier2Registrar = role === 'tier2_registrar'
  const isCompanyAdmin = role === 'company_admin'
  const isCompanyManager = role === 'company_manager'
  const isAuditor = role === 'auditor'
  const isSystemAdmin = role === 'system_admin'

  function hasPermission(permission: string): boolean {
    if (!role) return false
    return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
  }

  function canAccessModule(module: 'rmm' | 'vci' | 'ecs' | 'cmc'): boolean {
    // All authenticated users can access active modules
    // Module activation is checked separately
    return role !== null
  }

  return {
    role,
    isMOH,
    isTier1,
    isTier2,
    isTier2Officer,
    isTier2Registrar,
    isCompanyUser,
    isCompanyAdmin,
    isCompanyManager,
    isAuditor,
    isSystemAdmin,
    hasPermission,
    canAccessModule,
  }
}
