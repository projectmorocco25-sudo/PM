'use client'

import { useQuery } from '@tanstack/react-query'
import { getSupabaseClient } from '@/lib/supabase/client'

export interface ModuleActivation {
  rmm: boolean
  vci: boolean
  ecs: boolean
  cmc: boolean
}

export interface SystemConfig {
  moduleActivation: ModuleActivation
}

export function useSystemConfig() {
  return useQuery({
    queryKey: ['system-config'],
    queryFn: async (): Promise<SystemConfig> => {
      const supabase = getSupabaseClient()
      
      const { data, error } = await supabase
        .from('system_config')
        .select('key, value')
        .in('key', ['module_rmm_active', 'module_vci_active', 'module_ecs_active', 'module_cmc_active'])

      if (error) {
        console.error('Failed to load system config:', error)
        // Default to all modules active
        return {
          moduleActivation: { rmm: true, vci: true, ecs: true, cmc: true }
        }
      }

      const config = data.reduce((acc, item) => {
        acc[item.key] = item.value
        return acc
      }, {} as Record<string, any>)

      return {
        moduleActivation: {
          rmm: config.module_rmm_active !== false,
          vci: config.module_vci_active !== false,
          ecs: config.module_ecs_active === true,
          cmc: config.module_cmc_active === true,
        }
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useModulePendingCounts() {
  return useQuery({
    queryKey: ['module-pending-counts'],
    queryFn: async () => {
      const supabase = getSupabaseClient()

      // Get pending counts for each module
      const [
        { count: pendingBreaches },
        { count: pendingSubmissions },
        { count: pendingRegistrations },
      ] = await Promise.all([
        supabase
          .from('breaches')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'active'),
        supabase
          .from('aams_submissions')
          .select('id', { count: 'exact', head: true })
          .in('status', ['submitted', 'pending_verification', 'pending_tier1_approval']),
        supabase
          .from('registry_submissions')
          .select('id', { count: 'exact', head: true })
          .in('status', ['submitted', 'pending_verification']),
      ])

      return {
        vci: {
          breaches: pendingBreaches || 0,
          submissions: pendingSubmissions || 0,
        },
        rmm: {
          registrations: pendingRegistrations || 0,
        },
      }
    },
    staleTime: 30000, // 30 seconds
  })
}
