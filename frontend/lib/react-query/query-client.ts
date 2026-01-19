/**
 * TanStack Query Client Configuration
 * Task: 1.1.1.12a
 * Reference: State Management UI Patterns
 * 
 * Query client configuration with default options
 */

import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: data is fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache time: data is kept in cache for 10 minutes after last use
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 3 times
      retry: 3,
      // Retry delay: exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus in development
      refetchOnWindowFocus: process.env.NODE_ENV === 'development',
      // Refetch on reconnect
      refetchOnReconnect: true,
      // Don't refetch on mount if data is fresh
      refetchOnMount: true,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
      // Retry delay for mutations
      retryDelay: 1000,
    },
  },
})
