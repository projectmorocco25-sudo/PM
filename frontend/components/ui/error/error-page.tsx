/**
 * Error Page Component
 * Task: 1.1.1.12d
 * Reference: State Management UI Patterns
 * 
 * Full-page error display for 404, 500, and other errors
 */

'use client'

import { useRouter } from 'next/navigation'

export function ErrorPage({
  error,
  onRetry,
}: {
  error: Error & { status?: number }
  onRetry?: () => void
}) {
  const router = useRouter()
  const is404 = error.status === 404

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <svg
        className="mb-4 h-16 w-16 text-red-600 dark:text-red-400"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
      <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
        {is404 ? 'Page Not Found' : 'Something Went Wrong'}
      </h1>
      <p className="mb-6 max-w-md text-center text-gray-600 dark:text-gray-400">
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          Go Back
        </button>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Retry
          </button>
        )}
        <button
          type="button"
          onClick={() => router.push('/')}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Go Home
        </button>
      </div>
    </div>
  )
}
