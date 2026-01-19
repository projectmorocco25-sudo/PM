/**
 * Toast Notification Utility
 * Task: 1.1.1.16e
 * Reference: UI Component Specifications
 * 
 * Toast notification utility functions matching UI Component Specifications API
 * Usage: toast.success('Message'), toast.error('Message'), toast.info('Message'), toast.warning('Message')
 */

import { toast as sonnerToast } from 'sonner'

export interface ToastOptions {
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  cancel?: {
    label: string
    onClick?: () => void
  }
  description?: string
}

/**
 * Toast notification utility with success, error, warning, and info methods
 * Matches UI Component Specifications API: toast.success(), toast.error(), toast.info()
 */
export const toast = {
  /**
   * Show success toast
   */
  success: (message: string, options?: ToastOptions) => {
    return sonnerToast.success(message, {
      duration: options?.duration ?? 5000,
      description: options?.description,
      action: options?.action,
      cancel: options?.cancel,
    })
  },

  /**
   * Show error toast
   */
  error: (message: string, options?: ToastOptions) => {
    return sonnerToast.error(message, {
      duration: options?.duration ?? 5000,
      description: options?.description,
      action: options?.action,
      cancel: options?.cancel,
    })
  },

  /**
   * Show warning toast
   */
  warning: (message: string, options?: ToastOptions) => {
    return sonnerToast.warning(message, {
      duration: options?.duration ?? 5000,
      description: options?.description,
      action: options?.action,
      cancel: options?.cancel,
    })
  },

  /**
   * Show info toast
   */
  info: (message: string, options?: ToastOptions) => {
    return sonnerToast.info(message, {
      duration: options?.duration ?? 5000,
      description: options?.description,
      action: options?.action,
      cancel: options?.cancel,
    })
  },

  /**
   * Show default toast
   */
  default: (message: string, options?: ToastOptions) => {
    return sonnerToast(message, {
      duration: options?.duration ?? 5000,
      description: options?.description,
      action: options?.action,
      cancel: options?.cancel,
    })
  },

  /**
   * Dismiss toast by ID
   */
  dismiss: (toastId?: string | number) => {
    sonnerToast.dismiss(toastId)
  },

  /**
   * Dismiss all toasts
   */
  dismissAll: () => {
    sonnerToast.dismiss()
  },
}
