/**
 * Error Alert Component
 * Task: 1.1.1.12d
 * Reference: State Management UI Patterns
 * 
 * Error alert for form-level and API errors
 */

'use client'

import { cn } from '@/lib/utils'

export function ErrorAlert({
  error,
  onRetry,
  onDismiss,
  className,
  ...props
}: {
  error: Error | string
  onRetry?: () => void
  onDismiss?: () => void
} & React.HTMLAttributes<HTMLDivElement>) {
  const message = typeof error === 'string' ? error : error.message

  return (
    <div
      className={cn(
        'rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950',
        className
      )}
      {...props}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-600 dark:text-red-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
            Error
          </h3>
          <p className="mt-1 text-sm text-red-700 dark:text-red-300">
            {message || 'An error occurred. Please try again.'}
          </p>
          {onRetry && (
            <div className="mt-3">
              <button
                type="button"
                onClick={onRetry}
                className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          )}
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="ml-auto flex-shrink-0 text-red-600 hover:text-red-700 dark:text-red-400"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
