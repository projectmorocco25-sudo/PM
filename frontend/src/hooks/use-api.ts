'use client'

import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type UseMutationOptions } from '@tanstack/react-query'
import { getSupabaseClient } from '@/lib/supabase/client'
import { parseApiError, type ApiError } from '@/components/ui/error-states'

// Task 1.1.1.12b: API client hooks
// Task 1.1.1.12i: API error handling
// Task 1.1.1.12j: Retry logic

const MAX_RETRIES = 3
const RETRY_DELAY = 1000

// Generic fetch hook with retry logic
export function useApiQuery<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T, ApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T, ApiError>({
    queryKey,
    queryFn: async () => {
      try {
        return await queryFn()
      } catch (error) {
        throw parseApiError(error)
      }
    },
    retry: (failureCount, error) => {
      // Don't retry on permission or not found errors
      if (error.type === 'permission' || error.type === 'not_found' || error.type === 'validation') {
        return false
      }
      return failureCount < MAX_RETRIES
    },
    retryDelay: (attemptIndex) => Math.min(RETRY_DELAY * 2 ** attemptIndex, 30000),
    ...options,
  })
}

// Generic mutation hook
export function useApiMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, ApiError, TVariables>, 'mutationFn'>
) {
  return useMutation<TData, ApiError, TVariables>({
    mutationFn: async (variables) => {
      try {
        return await mutationFn(variables)
      } catch (error) {
        throw parseApiError(error)
      }
    },
    ...options,
  })
}

// Companies hooks
export function useCompanies(options?: { type?: string; status?: string }) {
  const supabase = getSupabaseClient()
  
  return useApiQuery(
    ['companies', options?.type || 'all', options?.status || 'all'],
    async () => {
      let query = supabase.from('companies').select('*')
      if (options?.type) query = query.eq('type', options.type)
      if (options?.status) query = query.eq('status', options.status)
      const { data, error } = await query.order('name')
      if (error) throw error
      return data
    }
  )
}

export function useCompany(id: string) {
  const supabase = getSupabaseClient()
  
  return useApiQuery(
    ['companies', id],
    async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
    { enabled: !!id }
  )
}

// Products hooks
export function useProducts(companyId?: string) {
  const supabase = getSupabaseClient()
  
  return useApiQuery(
    ['products', companyId || 'all'],
    async () => {
      let query = supabase.from('products').select('*, companies(name)')
      if (companyId) query = query.eq('company_id', companyId)
      const { data, error } = await query.order('name')
      if (error) throw error
      return data
    }
  )
}

export function useProduct(id: string) {
  const supabase = getSupabaseClient()
  
  return useApiQuery(
    ['products', id],
    async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, companies(name), skus(*)')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
    { enabled: !!id }
  )
}

// SKUs hooks
export function useSKUs(productId?: string) {
  const supabase = getSupabaseClient()
  
  return useApiQuery(
    ['skus', productId || 'all'],
    async () => {
      let query = supabase.from('skus').select('*, products(name, company_id)')
      if (productId) query = query.eq('product_id', productId)
      const { data, error } = await query.order('sku_code')
      if (error) throw error
      return data
    }
  )
}

// Submissions hooks
export function useAAMSSubmissions(companyId?: string, year?: number) {
  const supabase = getSupabaseClient()
  
  return useApiQuery(
    ['aams_submissions', companyId || 'all', year?.toString() || 'all'],
    async () => {
      let query = supabase.from('aams_submissions').select('*')
      if (companyId) query = query.eq('company_id', companyId)
      if (year) query = query.eq('year', year)
      const { data, error } = await query.order('created_at', { ascending: false })
      if (error) throw error
      return data
    }
  )
}

export function useMSQSubmissions(companyId?: string) {
  const supabase = getSupabaseClient()
  
  return useApiQuery(
    ['msq_submissions', companyId || 'all'],
    async () => {
      let query = supabase.from('msq_submissions').select('*')
      if (companyId) query = query.eq('company_id', companyId)
      const { data, error } = await query.order('created_at', { ascending: false })
      if (error) throw error
      return data
    }
  )
}

export function useWSLSubmissions(companyId?: string) {
  const supabase = getSupabaseClient()
  
  return useApiQuery(
    ['wsl_submissions', companyId || 'all'],
    async () => {
      let query = supabase.from('wsl_submissions').select('*')
      if (companyId) query = query.eq('company_id', companyId)
      const { data, error } = await query.order('created_at', { ascending: false })
      if (error) throw error
      return data
    }
  )
}

// Breaches hooks
export function useBreaches(options?: { status?: string; companyId?: string }) {
  const supabase = getSupabaseClient()
  
  return useApiQuery(
    ['breaches', options?.status || 'all', options?.companyId || 'all'],
    async () => {
      let query = supabase.from('breaches').select('*, companies(name)')
      if (options?.status) query = query.eq('status', options.status)
      if (options?.companyId) query = query.eq('company_id', options.companyId)
      const { data, error } = await query.order('created_at', { ascending: false })
      if (error) throw error
      return data
    }
  )
}

// Follow-ups hooks
export function useFollowUps(options?: { status?: string; assignedTo?: string }) {
  const supabase = getSupabaseClient()
  
  return useApiQuery(
    ['follow_ups', options?.status || 'all', options?.assignedTo || 'all'],
    async () => {
      let query = supabase.from('follow_ups').select('*')
      if (options?.status) query = query.eq('status', options.status)
      if (options?.assignedTo) query = query.eq('assigned_to', options.assignedTo)
      const { data, error } = await query.order('due_date', { ascending: true })
      if (error) throw error
      return data
    }
  )
}

// Meetings hooks
export function useMeetings(options?: { status?: string; fromDate?: string }) {
  const supabase = getSupabaseClient()
  
  return useApiQuery(
    ['meetings', options?.status || 'all', options?.fromDate || 'all'],
    async () => {
      let query = supabase.from('meetings').select('*')
      if (options?.status) query = query.eq('status', options.status)
      if (options?.fromDate) query = query.gte('scheduled_at', options.fromDate)
      const { data, error } = await query.order('scheduled_at', { ascending: true })
      if (error) throw error
      return data
    }
  )
}

// Users hooks (for admin)
export function useUsers(options?: { role?: string; companyId?: string }) {
  const supabase = getSupabaseClient()
  
  return useApiQuery(
    ['users', options?.role || 'all', options?.companyId || 'all'],
    async () => {
      let query = supabase.from('users').select('*, companies(name)')
      if (options?.role) query = query.eq('role', options.role)
      if (options?.companyId) query = query.eq('company_id', options.companyId)
      const { data, error } = await query.order('full_name')
      if (error) throw error
      return data
    }
  )
}

// Invalidation helpers
export function useInvalidateQueries() {
  const queryClient = useQueryClient()
  
  return {
    invalidateCompanies: () => queryClient.invalidateQueries({ queryKey: ['companies'] }),
    invalidateProducts: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
    invalidateSKUs: () => queryClient.invalidateQueries({ queryKey: ['skus'] }),
    invalidateSubmissions: () => {
      queryClient.invalidateQueries({ queryKey: ['aams_submissions'] })
      queryClient.invalidateQueries({ queryKey: ['msq_submissions'] })
      queryClient.invalidateQueries({ queryKey: ['wsl_submissions'] })
    },
    invalidateBreaches: () => queryClient.invalidateQueries({ queryKey: ['breaches'] }),
    invalidateFollowUps: () => queryClient.invalidateQueries({ queryKey: ['follow_ups'] }),
    invalidateMeetings: () => queryClient.invalidateQueries({ queryKey: ['meetings'] }),
    invalidateUsers: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    invalidateAll: () => queryClient.invalidateQueries(),
  }
}
