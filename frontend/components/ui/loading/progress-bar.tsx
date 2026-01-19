/**
 * Progress Bar Component
 * Task: 1.1.1.12c
 * Reference: State Management UI Patterns
 * 
 * Progress bar for file uploads and long-running operations
 */

'use client'

import { cn } from '@/lib/utils'

export function ProgressBar({
  value,
  max = 100,
  showLabel = true,
  className,
  ...props
}: {
  value: number
  max?: number
  showLabel?: boolean
} & React.HTMLAttributes<HTMLDivElement>) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={cn('w-full', className)} {...props}>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
        <div
          className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  )
}
