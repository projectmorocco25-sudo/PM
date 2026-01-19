/**
 * useUserRole Hook
 * Task: 1.1.1.14a
 * Reference: Role-Based UI Patterns, State Management UI Patterns
 * 
 * Hook for role detection, permissions, and helper functions
 */

'use client'

import { useQuery } from '@tanstack/react-query'
import { createBrowserClient } from '@/lib/supabase'
import { rpcQuery } from '@/lib/api/client'

export type UserRole =
  | 'company_admin'
  | 'company_manager'
  | 'company_user'
  | 'moh_tier1'
  | 'moh_tier2_officer'
  | 'moh_tier2_registrar'
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
  const supabase = createBrowserClient()

  // Get user from users table
  const { data: userData, error } = await supabase
    .from('users')
    .select('role, company_id')
    .eq('id', userId)
    .single()

  if (error || !userData) {
    return {
      role: null,
      permissions: [],
      companyId: null,
      isCompanyUser: false,
      isMOHUser: false,
      isTier1: false,
      isTier2: false,
      canApprove: false,
      canEdit: false,
      canView: false,
      canDelete: false,
      canManage: false,
    }
  }

  // Get permissions from RPC function
  let permissions: Permission[] = []
  try {
    const permissionsData = await rpcQuery<{ permissions: string[] }>(
      'shared_get_user_permissions',
      { user_id: userId }
    )
    permissions = (permissionsData?.permissions || []) as Permission[]
  } catch {
    // Fallback: determine permissions from role
    const role = userData.role as UserRole
    if (role?.startsWith('company_')) {
      if (role === 'company_admin') {
        permissions = ['approve', 'edit', 'view', 'delete', 'manage']
      } else if (role === 'company_manager') {
        permissions = ['edit', 'view']
      } else {
        permissions = ['view']
      }
    } else if (role?.startsWith('moh_')) {
      if (role === 'moh_tier1') {
        permissions = ['approve', 'edit', 'view', 'manage']
      } else {
        permissions = ['edit', 'view']
      }
    } else if (role === 'auditor') {
      permissions = ['view']
    } else if (role === 'system_admin') {
      permissions = ['approve', 'edit', 'view', 'delete', 'manage']
    } else {
      permissions = ['view']
    }
  }

  const role = userData.role as UserRole
  const companyId = userData.company_id as string | null

  return {
    role,
    permissions,
    companyId,
    isCompanyUser: role?.startsWith('company_') || false,
    isMOHUser: role?.startsWith('moh_') || false,
    isTier1: role === 'moh_tier1',
    isTier2: role === 'moh_tier2_officer' || role === 'moh_tier2_registrar',
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
  const supabase = createBrowserClient()

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
