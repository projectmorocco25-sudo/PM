/**
 * Select Component
 * Basic select component for dropdowns
 */

'use client'

import { SelectHTMLAttributes, forwardRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  value?: string
  onValueChange?: (value: string) => void
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, value, onValueChange, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          value={value}
          onChange={(e) => onValueChange?.(e.target.value)}
          className={cn(
            'flex h-10 w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>
    )
  }
)

Select.displayName = 'Select'

// Sub-components for compatibility with shadcn/ui API
export const SelectTrigger = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Select ref={ref} className={className} {...props}>
        {children}
      </Select>
    )
  }
)

SelectTrigger.displayName = 'SelectTrigger'

export const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  return <>{placeholder}</>
}

SelectValue.displayName = 'SelectValue'

export const SelectContent = ({ children }: { children: ReactNode }) => {
  return <>{children}</>
}

SelectContent.displayName = 'SelectContent'

export const SelectItem = forwardRef<
  HTMLOptionElement,
  { value: string; children: ReactNode }
>(({ value, children }, ref) => {
  return (
    <option ref={ref} value={value}>
      {children}
    </option>
  )
})

SelectItem.displayName = 'SelectItem'
