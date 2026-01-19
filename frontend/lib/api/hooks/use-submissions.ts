/**
 * useSubmissions Hook
 * Task: 1.1.1.12b
 * Reference: State Management UI Patterns, RPC Functions
 * 
 * React Query hook for VCI submissions data
 */

'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tableQuery, tableMutation, rpcQuery } from '../client'

export type Submission = {
  id: string
  company_id: string
  product_id?: string
  submission_type: 'aams' | 'msq' | 'wsl'
  period_start: string
  period_end: string
  status: string
  submitted_at?: string
  created_at: string
  updated_at: string
}

/**
 * Fetch all submissions
 */
async function fetchSubmissions(type?: 'aams' | 'msq' | 'wsl'): Promise<Submission[]> {
  return tableQuery<Submission>(
    type === 'aams' ? 'aams_submissions' 
    : type === 'msq' ? 'msq_submissions'
    : type === 'wsl' ? 'wsl_submissions'
    : 'aams_submissions', // Default to AAMS, but this should be handled differently
    type ? (query) => query : undefined
  )
}

/**
 * Create a new submission
 */
async function createSubmission(
  type: 'aams' | 'msq' | 'wsl',
  data: {
    company_id: string
    product_id?: string
    period_start: string
    period_end: string
  }
): Promise<Submission> {
  const tableName = 
    type === 'aams' ? 'aams_submissions' 
    : type === 'msq' ? 'msq_submissions'
    : 'wsl_submissions'
  
  try {
    const rpcName = `vci_create_${type}_submission`
    const result = await rpcQuery<Submission[]>(rpcName, data)
    return Array.isArray(result) ? result[0] : result
  } catch {
    const result = await tableMutation<Submission[]>('insert', tableName, {
      ...data,
      submission_type: type,
    })
    return Array.isArray(result) ? result[0] : result
  }
}

/**
 * Update submission
 */
async function updateSubmission(
  type: 'aams' | 'msq' | 'wsl',
  id: string,
  data: Partial<Omit<Submission, 'id' | 'submission_type' | 'created_at' | 'updated_at'>>
): Promise<Submission> {
  const tableName = 
    type === 'aams' ? 'aams_submissions' 
    : type === 'msq' ? 'msq_submissions'
    : 'wsl_submissions'
  
  const result = await tableMutation<Submission[]>('update', tableName, data, (query) =>
    query.eq('id', id)
  )
  return Array.isArray(result) ? result[0] : result
}

/**
 * Hook to fetch submissions
 */
export function useSubmissions(type?: 'aams' | 'msq' | 'wsl') {
  return useQuery({
    queryKey: ['submissions', type],
    queryFn: () => fetchSubmissions(type),
  })
}

/**
 * Hook to fetch a single submission
 */
export function useSubmission(type: 'aams' | 'msq' | 'wsl', id: string | null) {
  return useQuery({
    queryKey: ['submissions', type, id],
    queryFn: async () => {
      if (!id) return null
      const submissions = await fetchSubmissions(type)
      return submissions.find((s) => s.id === id) || null
    },
    enabled: !!id,
  })
}

/**
 * Hook to create a submission
 */
export function useCreateSubmission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ type, data }: { type: 'aams' | 'msq' | 'wsl'; data: any }) =>
      createSubmission(type, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['submissions', variables.type] })
      queryClient.invalidateQueries({ queryKey: ['submissions'] })
    },
  })
}

/**
 * Hook to update a submission
 */
export function useUpdateSubmission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ type, id, data }: { type: 'aams' | 'msq' | 'wsl'; id: string; data: any }) =>
      updateSubmission(type, id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['submissions', variables.type] })
      queryClient.invalidateQueries({ queryKey: ['submissions', variables.type, variables.id] })
    },
  })
}
