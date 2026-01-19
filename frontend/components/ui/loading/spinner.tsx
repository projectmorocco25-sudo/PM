/**
 * Spinner Loading Component
 * Task: 1.1.1.12c
 * Reference: State Management UI Patterns
 * 
 * Spinner component for button actions and inline loading
 */

'use client'

import { cn } from '@/lib/utils'

export function Spinner({
  size = 'md',
  className,
  ...props
}: {
  size?: 'sm' | 'md' | 'lg'
} & React.HTMLAttributes<HTMLDivElement>) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-gray-900 dark:border-gray-600 dark:border-t-gray-100',
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
}

export function InlineLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <Spinner size="md" />
      <span className="ml-2 text-gray-600 dark:text-gray-400">{message}</span>
    </div>
  )
}
