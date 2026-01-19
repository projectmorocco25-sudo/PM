/**
 * Toast Notification System
 * Task: 1.1.1.16e
 * Reference: UI Component Specifications
 * 
 * Toast notification component using sonner library
 * Provides success, error, warning, and info toast notifications
 */

'use client'

import { Toaster as SonnerToaster } from 'sonner'

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        duration: 5000, // 5 seconds default
        classNames: {
          toast: 'group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-950 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-gray-600',
          actionButton: 'group-[.toast]:bg-blue-600 group-[.toast]:text-white',
          cancelButton: 'group-[.toast]:bg-gray-100 group-[.toast]:text-gray-500',
        },
      }}
      closeButton
      richColors
    />
  )
}
