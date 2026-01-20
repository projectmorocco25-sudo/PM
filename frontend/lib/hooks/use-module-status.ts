/**
 * useModuleStatus Hook
 * Task: 1.1.1.14d, 0.5.1.19 - MOH Tier 1 Dashboard
 * Reference: Role-Based UI Patterns, Navigation & Layout Patterns, Dashboard wireframes
 * 
 * Hook to check module activation status with regulatory validation
 */

'use client'

import { useQuery } from '@tanstack/react-query'
import { rpcQuery } from '@/lib/api/client'

export type ModuleName = 'rmm' | 'vci' | 'ecs' | 'cmc'

export interface ModuleStatusDetail {
  status: 'on' | 'off'
  regulatory: 'authorized' | 'pending_verification' | 'not_authorized'
  auth: string | null // Regulatory authorization reference (e.g., "DMP Art.10")
  prerequisitesMet: boolean
  stakeholderNotified: boolean
}

export interface AllModuleStatus {
  ecs: ModuleStatusDetail | null
  cmc: ModuleStatusDetail | null
  rmm: ModuleStatusDetail | null
  vci: ModuleStatusDetail | null
}

/**
 * Fetch module activation status (simple boolean for backward compatibility)
 */
async function fetchModuleStatus(moduleName: ModuleName): Promise<boolean> {
  try {
    const result = await rpcQuery<boolean>('shared_check_module_active', {
      module_name: moduleName,
    })
    return result ?? false
  } catch (error) {
    console.error(`Error checking module status for ${moduleName}:`, error)
    return false
  }
}

/**
 * Fetch detailed module status with regulatory validation
 */
async function fetchAllModuleStatus(): Promise<AllModuleStatus> {
  // TODO: Replace with actual database query when module activation tracking table is available
  // This would query system_config or a modules table for activation status, regulatory authorization, etc.
  
  // For now, return placeholder data based on current implementation
  // This will be replaced with actual Supabase queries when the module activation tracking is implemented
  
  return {
    ecs: {
      status: 'on',
      regulatory: 'authorized',
      auth: 'DMP Art.10',
      prerequisitesMet: true,
      stakeholderNotified: true,
    },
    cmc: {
      status: 'off',
      regulatory: 'pending_verification',
      auth: null,
      prerequisitesMet: false,
      stakeholderNotified: false,
    },
    rmm: {
      status: 'on',
      regulatory: 'authorized',
      auth: 'DMP Art.8',
      prerequisitesMet: true,
      stakeholderNotified: true,
    },
    vci: {
      status: 'on',
      regulatory: 'authorized',
      auth: 'DMP Art.9',
      prerequisitesMet: true,
      stakeholderNotified: true,
    },
  }
}

/**
 * Hook to check if a module is active (simple boolean)
 */
export function useModuleStatus(moduleName: ModuleName) {
  return useQuery({
    queryKey: ['moduleStatus', moduleName],
    queryFn: () => fetchModuleStatus(moduleName),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })
}

/**
 * Hook to check multiple module statuses (simple boolean)
 */
export function useModulesStatus(moduleNames: ModuleName[]) {
  return useQuery({
    queryKey: ['modulesStatus', moduleNames.sort().join(',')],
    queryFn: async () => {
      const statuses: Record<ModuleName, boolean> = {} as Record<ModuleName, boolean>
      await Promise.all(
        moduleNames.map(async (moduleName) => {
          statuses[moduleName] = await fetchModuleStatus(moduleName)
        })
      )
      return statuses
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })
}

/**
 * Hook to get all module statuses with regulatory validation details (for MOH Tier 1 Dashboard)
 */
export function useAllModuleStatus() {
  return useQuery({
    queryKey: ['allModuleStatus'],
    queryFn: fetchAllModuleStatus,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })
}
