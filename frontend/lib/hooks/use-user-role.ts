/**
 * useUserRole Hook
 * Task: 1.1.1.14a
 * Reference: Role-Based UI Patterns, State Management UI Patterns
 * 
 * Hook for role detection, permissions, and helper functions
 */

'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { rpcQuery } from '@/lib/api/client'

export type UserRole =
  | 'company_admin'
  | 'company_manager'
  | 'company_user'
  | 'tier1'              // MOH DMP Tier 1 (NOT 'moh_tier1' - matches database schema)
  | 'tier2_officer'      // MOH DMP Tier 2 Officer (NOT 'moh_tier2_officer' - matches database schema)
  | 'tier2_registrar'    // MOH DMP Tier 2 Registrar (NOT 'moh_tier2_registrar' - matches database schema)
  | 'auditor'
  | 'system_admin'
  | 'vendor'

export type Permission = 'approve' | 'edit' | 'view' | 'delete' | 'manage'

export interface UserRoleData {
  role: UserRole | null
  permissions: Permission[]
  companyId: string | null
  isCompanyUser: boolean
  isMOHUser: boolean
  isTier1: boolean
  isTier2: boolean
  isVendor: boolean
  isAuditor: boolean
  isSystemAdmin: boolean
  canApprove: boolean
  canEdit: boolean
  canView: boolean
  canDelete: boolean
  canManage: boolean
}

/**
 * Fetch user role and permissions
 */
async function fetchUserRole(userId: string): Promise<UserRoleData> {
  const supabase = createClient()

  // Get user from users table
  const { data: userData, error } = await supabase
    .from('users')
    .select('role, company_id')
    .eq('id', userId)
    .single()

  if (error || !userData) {
    console.error('[useUserRole] Error fetching user role:', error)
    return {
      role: null,
      permissions: [],
      companyId: null,
      isCompanyUser: false,
      isMOHUser: false,
      isTier1: false,
      isTier2: false,
      isVendor: false,
      isAuditor: false,
      isSystemAdmin: false,
      canApprove: false,
      canEdit: false,
      canView: false,
      canDelete: false,
      canManage: false,
    }
  }

  // DEBUG: Log raw role from database
  if (process.env.NODE_ENV === 'development') {
    console.log('[useUserRole] Raw role from database:', {
      userId,
      rawRole: userData.role,
      rawRoleType: typeof userData.role,
      companyId: userData.company_id,
    })
  }

  // Get permissions from RPC function
  const role = userData.role as UserRole | string
  const companyId = userData.company_id as string | null
  let permissions: Permission[] = []
  
  try {
    const permissionsData = await rpcQuery<{ permissions: string[] }>(
      'shared_get_user_permissions',
      { user_id: userId }
    )
    permissions = (permissionsData?.permissions || []) as Permission[]
  } catch {
    // Fallback: determine permissions from role
    // Handle both legacy ('moh_tier1', 'moh_tier2') and new ('tier1', 'tier2_officer', 'tier2_registrar') role formats
    const roleStr = typeof role === 'string' ? role : String(role || '')
    if (roleStr?.startsWith('company_')) {
      if (roleStr === 'company_admin') {
        permissions = ['approve', 'edit', 'view', 'delete', 'manage']
      } else if (roleStr === 'company_manager') {
        permissions = ['edit', 'view']
      } else {
        permissions = ['view']
      }
    } else if (roleStr === 'tier1' || roleStr === 'moh_tier1') {
      permissions = ['approve', 'edit', 'view', 'manage']
    } else if (roleStr === 'tier2_officer' || roleStr === 'tier2_registrar' || roleStr === 'moh_tier2') {
      permissions = ['edit', 'view']
    } else if (roleStr === 'auditor') {
      permissions = ['view']
    } else if (roleStr === 'system_admin') {
      permissions = ['approve', 'edit', 'view', 'delete', 'manage']
    } else if (roleStr === 'vendor') {
      permissions = ['approve', 'edit', 'view', 'manage'] // Module licensing control
    } else {
      permissions = ['view']
    }
  }

  // PROACTIVE APPROACH: Handle legacy role format ('moh_tier1', 'moh_tier2') during migration period
  // Migration 20260118000001 changed roles from 'moh_tier1'/'moh_tier2' to 'tier1'/'tier2_officer'/'tier2_registrar'
  // Some users might still have legacy roles, so check both formats
  // CRITICAL: Ensure case-insensitive comparison and handle all variations
  const roleStr = typeof role === 'string' ? role.toLowerCase().trim() : String(role || '').toLowerCase().trim()
  const isTier1 = roleStr === 'tier1' || roleStr === 'moh_tier1'
  const isTier2Officer = roleStr === 'tier2_officer' || roleStr === 'moh_tier2' || roleStr === 'tier2_officer'
  const isTier2Registrar = roleStr === 'tier2_registrar'
  const isTier2 = isTier2Officer || isTier2Registrar
  const isMOHUser = isTier1 || isTier2

  // Debug logging for role detection
  if (process.env.NODE_ENV === 'development' && (isTier1 || isTier2)) {
    console.log('[useUserRole Debug]', {
      rawRole: role,
      normalizedRole: roleStr,
      isTier1,
      isTier2,
      isMOHUser,
      userId,
    })
  }

  // Normalize role to new format if it's legacy format
  let normalizedRole: UserRole | null = null
  if (role === 'tier1' || role === 'moh_tier1') {
    normalizedRole = 'tier1'
  } else if (role === 'tier2_officer' || role === 'moh_tier2') {
    normalizedRole = 'tier2_officer'
  } else if (role === 'tier2_registrar') {
    normalizedRole = 'tier2_registrar'
  } else if (typeof role === 'string' && (role.startsWith('company_') || ['auditor', 'system_admin', 'vendor'].includes(role))) {
    normalizedRole = role as UserRole
  }

  return {
    role: normalizedRole,
    permissions,
    companyId,
    isCompanyUser: role?.startsWith('company_') || false,
    isMOHUser,
    isTier1,
    isTier2,
    isVendor: role === 'vendor',
    isAuditor: role === 'auditor',
    isSystemAdmin: role === 'system_admin',
    canApprove: permissions.includes('approve'),
    canEdit: permissions.includes('edit'),
    canView: permissions.includes('view'),
    canDelete: permissions.includes('delete'),
    canManage: permissions.includes('manage'),
  }
}

/**
 * Hook to get current user's role and permissions
 */
export function useUserRole() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['userRole'],
    queryFn: async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user) {
        return {
          role: null,
          permissions: [],
          companyId: null,
          isCompanyUser: false,
          isMOHUser: false,
          isTier1: false,
          isTier2: false,
          isVendor: false,
          isAuditor: false,
          isSystemAdmin: false,
          canApprove: false,
          canEdit: false,
          canView: false,
          canDelete: false,
          canManage: false,
        } as UserRoleData
      }

      return fetchUserRole(user.id)
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })
}
