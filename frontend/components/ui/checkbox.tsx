/**
 * Checkbox Component (Temporary - Full implementation in Task 1.1.1.17f)
 * Basic checkbox component for use in CommunicationsInbox
 */

'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked'> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        ref={ref}
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        className={cn(
          'h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500',
          className
        )}
        {...props}
      />
    )
  }
)

Checkbox.displayName = 'Checkbox'
