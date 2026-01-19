/**
 * Button Component (Temporary - Full implementation in Task 1.1.1.17f)
 * Basic button component for use in CommunicationsInbox
 */

'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50',
          variant === 'default' && 'bg-blue-600 text-white hover:bg-blue-700',
          variant === 'outline' && 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-100',
          size === 'sm' && 'h-8 px-3 text-sm',
          size === 'md' && 'h-10 px-4 py-2',
          size === 'lg' && 'h-12 px-6 text-lg',
          className
        )}
        {...props}
      >
        {loading && <span className="mr-2">Loading...</span>}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
