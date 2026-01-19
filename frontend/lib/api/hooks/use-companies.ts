/**
 * useCompanies Hook
 * Task: 1.1.1.12b
 * Reference: State Management UI Patterns, RPC Functions
 * 
 * React Query hook for companies data
 */

'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tableQuery, tableMutation, rpcQuery } from '../client'

export type Company = {
  id: string
  name: string
  registration_number: string
  company_type: 'ipc' | 'wholesaler'
  address?: string
  contact_email?: string
  contact_phone?: string
  status: string
  created_at: string
  updated_at: string
}

/**
 * Fetch all companies
 */
async function fetchCompanies(): Promise<Company[]> {
  return tableQuery<Company>('companies')
}

/**
 * Create a new company
 */
async function createCompany(data: {
  name: string
  registration_number: string
  company_type: 'ipc' | 'wholesaler'
  address?: string
  contact_email?: string
  contact_phone?: string
}): Promise<Company> {
  // Use RPC if available, otherwise direct table insert
  try {
    const result = await rpcQuery<Company[]>('rmm_create_company', data)
    return Array.isArray(result) ? result[0] : result
  } catch {
    const result = await tableMutation<Company[]>('insert', 'companies', data)
    return Array.isArray(result) ? result[0] : result
  }
}

/**
 * Update company
 */
async function updateCompany(
  id: string,
  data: Partial<Omit<Company, 'id' | 'created_at' | 'updated_at'>>
): Promise<Company> {
  const result = await tableMutation<Company[]>('update', 'companies', data, (query) =>
    query.eq('id', id)
  )
  return Array.isArray(result) ? result[0] : result
}

/**
 * Hook to fetch companies
 */
export function useCompanies() {
  return useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies,
  })
}

/**
 * Hook to fetch a single company
 */
export function useCompany(id: string | null) {
  return useQuery({
    queryKey: ['companies', id],
    queryFn: async () => {
      if (!id) return null
      const companies = await fetchCompanies()
      return companies.find((c) => c.id === id) || null
    },
    enabled: !!id,
  })
}

/**
 * Hook to create a company
 */
export function useCreateCompany() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
    },
  })
}

/**
 * Hook to update a company
 */
export function useUpdateCompany() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Company, 'id' | 'created_at' | 'updated_at'>> }) =>
      updateCompany(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      queryClient.invalidateQueries({ queryKey: ['companies', variables.id] })
    },
  })
}
