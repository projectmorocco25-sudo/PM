'use client'

/**
 * Task 1.1.1.12f: Success state patterns - Toast notifications
 * Task 1.1.1.16e: Toast notification system (success, error, warning, info)
 * 
 * Provides consistent toast notification patterns across the application.
 * Uses Sonner for toast rendering with custom hooks for common patterns.
 * 
 * @see docs/02-architecture/frontend/state-management-ui-patterns.md
 * @see docs/02-architecture/frontend/ui-component-specifications.md
 */

import { toast } from 'sonner'
import { CheckCircle2, AlertCircle, AlertTriangle, Info, XCircle, Loader2 } from 'lucide-react'

// ============================================================================
// Toast Types and Interfaces
// ============================================================================

export interface ToastOptions {
  title?: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  cancel?: {
    label: string
    onClick?: () => void
  }
  onDismiss?: () => void
  onAutoClose?: () => void
}

export interface PromiseToastOptions<T> {
  loading: string
  success: string | ((data: T) => string)
  error: string | ((error: Error) => string)
}

// ============================================================================
// Toast Helper Functions
// ============================================================================

/**
 * Show a success toast notification
 * 
 * @example
 * showSuccessToast('Submission created successfully')
 * showSuccessToast({ title: 'Success', description: 'Your changes have been saved' })
 */
export function showSuccessToast(options: string | ToastOptions) {
  const opts = typeof options === 'string' ? { description: options } : options
  
  return toast.success(opts.title || 'Success', {
    description: opts.description,
    duration: opts.duration ?? 4000,
    action: opts.action ? {
      label: opts.action.label,
      onClick: opts.action.onClick,
    } : undefined,
    cancel: opts.cancel ? {
      label: opts.cancel.label,
      onClick: opts.cancel.onClick,
    } : undefined,
    onDismiss: opts.onDismiss,
    onAutoClose: opts.onAutoClose,
  })
}

/**
 * Show an error toast notification
 * 
 * @example
 * showErrorToast('Failed to save changes')
 * showErrorToast({ title: 'Error', description: 'Network connection failed', action: { label: 'Retry', onClick: retry }})
 */
export function showErrorToast(options: string | ToastOptions) {
  const opts = typeof options === 'string' ? { description: options } : options
  
  return toast.error(opts.title || 'Error', {
    description: opts.description,
    duration: opts.duration ?? 5000,
    action: opts.action ? {
      label: opts.action.label,
      onClick: opts.action.onClick,
    } : undefined,
    cancel: opts.cancel ? {
      label: opts.cancel.label,
      onClick: opts.cancel.onClick,
    } : undefined,
    onDismiss: opts.onDismiss,
    onAutoClose: opts.onAutoClose,
  })
}

/**
 * Show a warning toast notification
 * 
 * @example
 * showWarningToast('Your session will expire in 5 minutes')
 */
export function showWarningToast(options: string | ToastOptions) {
  const opts = typeof options === 'string' ? { description: options } : options
  
  return toast.warning(opts.title || 'Warning', {
    description: opts.description,
    duration: opts.duration ?? 5000,
    action: opts.action ? {
      label: opts.action.label,
      onClick: opts.action.onClick,
    } : undefined,
    onDismiss: opts.onDismiss,
    onAutoClose: opts.onAutoClose,
  })
}

/**
 * Show an info toast notification
 * 
 * @example
 * showInfoToast('New features are available')
 */
export function showInfoToast(options: string | ToastOptions) {
  const opts = typeof options === 'string' ? { description: options } : options
  
  return toast.info(opts.title || 'Info', {
    description: opts.description,
    duration: opts.duration ?? 4000,
    action: opts.action ? {
      label: opts.action.label,
      onClick: opts.action.onClick,
    } : undefined,
    onDismiss: opts.onDismiss,
    onAutoClose: opts.onAutoClose,
  })
}

/**
 * Show a loading toast notification
 * 
 * @example
 * const toastId = showLoadingToast('Saving changes...')
 * // Later: toast.dismiss(toastId)
 */
export function showLoadingToast(message: string) {
  return toast.loading(message)
}

/**
 * Show a promise toast that updates based on promise state
 * 
 * @example
 * showPromiseToast(
 *   submitForm(),
 *   {
 *     loading: 'Submitting...',
 *     success: 'Form submitted successfully',
 *     error: (err) => `Failed: ${err.message}`
 *   }
 * )
 */
export function showPromiseToast<T>(
  promise: Promise<T>,
  options: PromiseToastOptions<T>
) {
  return toast.promise(promise, {
    loading: options.loading,
    success: options.success,
    error: options.error,
  })
}

/**
 * Dismiss a specific toast or all toasts
 * 
 * @example
 * dismissToast(toastId) // Dismiss specific toast
 * dismissToast() // Dismiss all toasts
 */
export function dismissToast(toastId?: string | number) {
  if (toastId) {
    toast.dismiss(toastId)
  } else {
    toast.dismiss()
  }
}

// ============================================================================
// Specialized Toast Functions for PM Platform
// ============================================================================

/**
 * Show success toast for form submissions
 */
export function showSubmissionSuccess(entityType: string, action: 'created' | 'updated' | 'submitted' | 'saved') {
  return showSuccessToast({
    title: 'Success',
    description: `${entityType} ${action} successfully`,
    duration: 4000,
  })
}

/**
 * Show success toast for approval actions
 */
export function showApprovalSuccess(entityType: string, approved: boolean = true) {
  return showSuccessToast({
    title: approved ? 'Approved' : 'Rejected',
    description: `${entityType} has been ${approved ? 'approved' : 'rejected'}`,
    duration: 4000,
  })
}

/**
 * Show success toast for delete actions with undo option
 */
export function showDeleteSuccess(entityType: string, onUndo?: () => void) {
  return showSuccessToast({
    title: 'Deleted',
    description: `${entityType} has been deleted`,
    duration: 5000,
    action: onUndo ? {
      label: 'Undo',
      onClick: onUndo,
    } : undefined,
  })
}

/**
 * Show error toast for API errors
 */
export function showApiError(error: Error | string, onRetry?: () => void) {
  const message = typeof error === 'string' ? error : error.message
  
  return showErrorToast({
    title: 'Error',
    description: message || 'An unexpected error occurred',
    duration: 6000,
    action: onRetry ? {
      label: 'Retry',
      onClick: onRetry,
    } : undefined,
  })
}

/**
 * Show error toast for validation errors
 */
export function showValidationError(errors: string[]) {
  const description = errors.length === 1 
    ? errors[0] 
    : `${errors.length} validation errors occurred`
  
  return showErrorToast({
    title: 'Validation Error',
    description,
    duration: 5000,
  })
}

/**
 * Show error toast for permission errors
 */
export function showPermissionError(action?: string) {
  return showErrorToast({
    title: 'Permission Denied',
    description: action 
      ? `You don't have permission to ${action}`
      : "You don't have permission to perform this action",
    duration: 5000,
  })
}

/**
 * Show error toast for network errors
 */
export function showNetworkError(onRetry?: () => void) {
  return showErrorToast({
    title: 'Network Error',
    description: 'Please check your internet connection',
    duration: 6000,
    action: onRetry ? {
      label: 'Retry',
      onClick: onRetry,
    } : undefined,
  })
}

/**
 * Show warning toast for session expiry
 */
export function showSessionExpiryWarning(minutesRemaining: number) {
  return showWarningToast({
    title: 'Session Expiring',
    description: `Your session will expire in ${minutesRemaining} minute${minutesRemaining !== 1 ? 's' : ''}`,
    duration: 10000,
  })
}

/**
 * Show info toast for background operations
 */
export function showBackgroundOperationInfo(operation: string) {
  return showInfoToast({
    title: 'Processing',
    description: `${operation} is running in the background`,
    duration: 4000,
  })
}

// ============================================================================
// Re-export for convenience
// ============================================================================

export { toast }
