/**
 * MainContent Component
 * Task: 1.1.1.15d
 * Reference: Navigation & Layout Patterns
 * 
 * Main content area with breadcrumbs, page title, and action buttons
 */

'use client'

import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface MainContentProps {
  children: ReactNode
  breadcrumbs?: BreadcrumbItem[]
  title?: string
  actions?: ReactNode
  className?: string
}

export function MainContent({ children, breadcrumbs, title, actions, className }: MainContentProps) {
  return (
    <div className={cn('flex flex-col p-6', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          {breadcrumbs.map((item, index) => (
            <span key={index}>
              {item.href ? (
                <a href={item.href} className="hover:text-gray-900 dark:hover:text-gray-100">
                  {item.label}
                </a>
              ) : (
                <span>{item.label}</span>
              )}
              {index < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
            </span>
          ))}
        </nav>
      )}

      {(title || actions) && (
        <div className="mb-6 flex items-center justify-between">
          {title && <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      <div className="flex-1">{children}</div>
    </div>
  )
}
