/**
 * useModuleStatus Hook
 * Task: 1.1.1.14d
 * Reference: Role-Based UI Patterns, Navigation & Layout Patterns
 * 
 * Hook to check module activation status
 */

'use client'

import { useQuery } from '@tanstack/react-query'
import { rpcQuery } from '@/lib/api/client'

export type ModuleName = 'rmm' | 'vci' | 'ecs' | 'cmc'

/**
 * Fetch module activation status
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
 * Hook to check if a module is active
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
 * Hook to check multiple module statuses
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
