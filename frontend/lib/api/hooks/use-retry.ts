/**
 * useRetry Hook
 * Task: 1.1.1.12j
 * Reference: State Management UI Patterns
 * 
 * React Query hook with retry logic
 */

'use client'

import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import { retryWithBackoff, isRetryableError } from '../error-handler'

/**
 * Hook to retry a query on failure
 */
export function useQueryWithRetry<TData, TError = Error>(
  options: Omit<UseQueryOptions<TData, TError>, 'queryFn'> & {
    queryFn: () => Promise<TData>
    maxRetries?: number
  }
) {
  const { queryFn, maxRetries = 3, ...queryOptions } = options

  return useQuery<TData, TError>({
    ...queryOptions,
    queryFn: () => retryWithBackoff(queryFn, { maxRetries }),
    retry: false, // We handle retries manually
  })
}

/**
 * Hook to retry a mutation on failure
 */
export function useMutationWithRetry<TData, TError = Error, TVariables = void>(
  options: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'> & {
    mutationFn: (variables: TVariables) => Promise<TData>
    maxRetries?: number
  }
) {
  const { mutationFn, maxRetries = 1, ...mutationOptions } = options

  return useMutation<TData, TError, TVariables>({
    ...mutationOptions,
    mutationFn: (variables) =>
      retryWithBackoff(() => mutationFn(variables), { maxRetries }),
    retry: false, // We handle retries manually
  })
}
