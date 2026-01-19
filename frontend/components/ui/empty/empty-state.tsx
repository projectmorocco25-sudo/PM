/**
 * Empty State Component
 * Task: 1.1.1.12e
 * Reference: State Management UI Patterns
 * 
 * Empty state component for no data, no results, and first-time experiences
 */

'use client'

import { type ReactNode } from 'react'

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon?: React.ComponentType<{ className?: string }>
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      {Icon && (
        <Icon className="mb-4 h-16 w-16 text-gray-400 dark:text-gray-600" />
      )}
      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <p className="mb-6 max-w-md text-gray-600 dark:text-gray-400">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  )
}
