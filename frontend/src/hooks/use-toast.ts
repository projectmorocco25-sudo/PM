'use client'

/**
 * Task 1.1.1.12f: Success state patterns - Toast hooks
 * 
 * Custom hooks for toast notifications integrated with TanStack Query.
 * Provides consistent toast patterns for mutations and queries.
 * 
 * @see docs/02-architecture/frontend/state-management-ui-patterns.md
 */

import { useCallback } from 'react'
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
  showInfoToast,
  showLoadingToast,
  showPromiseToast,
  dismissToast,
  showSubmissionSuccess,
  showApprovalSuccess,
  showDeleteSuccess,
  showApiError,
  showValidationError,
  showPermissionError,
  showNetworkError,
  showSessionExpiryWarning,
  showBackgroundOperationInfo,
  type ToastOptions,
  type PromiseToastOptions,
} from '@/components/ui/toast-notifications'

// ============================================================================
// Main Toast Hook
// ============================================================================

/**
 * Hook for displaying toast notifications
 * 
 * @example
 * const { success, error, warning, info, promise } = useToast()
 * 
 * success('Changes saved')
 * error('Failed to save changes')
 * promise(saveData(), { loading: 'Saving...', success: 'Saved!', error: 'Failed' })
 */
export function useToast() {
  const success = useCallback((options: string | ToastOptions) => {
    return showSuccessToast(options)
  }, [])

  const error = useCallback((options: string | ToastOptions) => {
    return showErrorToast(options)
  }, [])

  const warning = useCallback((options: string | ToastOptions) => {
    return showWarningToast(options)
  }, [])

  const info = useCallback((options: string | ToastOptions) => {
    return showInfoToast(options)
  }, [])

  const loading = useCallback((message: string) => {
    return showLoadingToast(message)
  }, [])

  const promise = useCallback(<T>(
    promiseToResolve: Promise<T>,
    options: PromiseToastOptions<T>
  ) => {
    return showPromiseToast(promiseToResolve, options)
  }, [])

  const dismiss = useCallback((toastId?: string | number) => {
    return dismissToast(toastId)
  }, [])

  return {
    success,
    error,
    warning,
    info,
    loading,
    promise,
    dismiss,
  }
}

// ============================================================================
// Specialized Toast Hooks
// ============================================================================

/**
 * Hook for mutation success/error toasts
 * 
 * @example
 * const { onSuccess, onError } = useMutationToast('Company')
 * 
 * useMutation({
 *   mutationFn: createCompany,
 *   onSuccess: () => onSuccess('created'),
 *   onError: (error) => onError(error),
 * })
 */
export function useMutationToast(entityType: string) {
  const onSuccess = useCallback((
    action: 'created' | 'updated' | 'deleted' | 'submitted' | 'saved' | 'approved' | 'rejected',
    options?: { onUndo?: () => void }
  ) => {
    if (action === 'deleted' && options?.onUndo) {
      return showDeleteSuccess(entityType, options.onUndo)
    }
    if (action === 'approved' || action === 'rejected') {
      return showApprovalSuccess(entityType, action === 'approved')
    }
    return showSubmissionSuccess(entityType, action as 'created' | 'updated' | 'submitted' | 'saved')
  }, [entityType])

  const onError = useCallback((error: Error | string, onRetry?: () => void) => {
    return showApiError(error, onRetry)
  }, [])

  return { onSuccess, onError }
}

/**
 * Hook for form validation toast errors
 * 
 * @example
 * const showValidationErrors = useValidationToast()
 * 
 * if (!form.isValid) {
 *   showValidationErrors(form.errors)
 * }
 */
export function useValidationToast() {
  return useCallback((errors: string[] | Record<string, string>) => {
    const errorMessages = Array.isArray(errors) 
      ? errors 
      : Object.values(errors)
    
    return showValidationError(errorMessages)
  }, [])
}

/**
 * Hook for permission error toasts
 * 
 * @example
 * const showPermissionDenied = usePermissionToast()
 * 
 * if (!canEdit) {
 *   showPermissionDenied('edit this submission')
 * }
 */
export function usePermissionToast() {
  return useCallback((action?: string) => {
    return showPermissionError(action)
  }, [])
}

/**
 * Hook for network error toasts with retry
 * 
 * @example
 * const { showNetworkError } = useNetworkToast()
 * 
 * try {
 *   await fetchData()
 * } catch (e) {
 *   if (e instanceof NetworkError) {
 *     showNetworkError(() => fetchData())
 *   }
 * }
 */
export function useNetworkToast() {
  const show = useCallback((onRetry?: () => void) => {
    return showNetworkError(onRetry)
  }, [])

  return { showNetworkError: show }
}

/**
 * Hook for session management toasts
 * 
 * @example
 * const { warnSessionExpiry, showBackgroundOperation } = useSessionToast()
 * 
 * // When session is about to expire
 * warnSessionExpiry(5) // 5 minutes remaining
 */
export function useSessionToast() {
  const warnSessionExpiry = useCallback((minutesRemaining: number) => {
    return showSessionExpiryWarning(minutesRemaining)
  }, [])

  const showBackgroundOperation = useCallback((operation: string) => {
    return showBackgroundOperationInfo(operation)
  }, [])

  return { warnSessionExpiry, showBackgroundOperation }
}

// ============================================================================
// Export types
// ============================================================================

export type { ToastOptions, PromiseToastOptions }
