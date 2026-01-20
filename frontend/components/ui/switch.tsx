/**
 * Switch Component
 * Toggle switch component for settings
 */

'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          className="sr-only"
          {...props}
        />
        <div
          className={cn(
            'relative h-6 w-11 rounded-full transition-colors',
            checked ? 'bg-blue-600' : 'bg-gray-300',
            className
          )}
        >
          <div
            className={cn(
              'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform',
              checked ? 'translate-x-5' : 'translate-x-0'
            )}
          />
        </div>
      </label>
    )
  }
)

Switch.displayName = 'Switch'
