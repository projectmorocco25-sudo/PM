'use client'

/**
 * Task 1.1.1.17f: Base UI Components - DatePicker
 * Task 1.1.1.18f: DatePicker component (per ui-component-specifications.md)
 * 
 * Date picker component using popover and calendar.
 * 
 * @see docs/02-architecture/frontend/ui-component-specifications.md
 * @see docs/02-architecture/frontend/form-design-patterns.md
 */

import * as React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

// ============================================================================
// Simple Calendar Component (inline implementation)
// ============================================================================

interface CalendarProps {
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
  minDate?: Date
  maxDate?: Date
  className?: string
}

function Calendar({
  selected,
  onSelect,
  disabled,
  minDate,
  maxDate,
  className,
}: CalendarProps) {
  const [viewDate, setViewDate] = React.useState(selected || new Date())
  
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  
  const prevMonth = () => {
    setViewDate(new Date(year, month - 1, 1))
  }
  
  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1))
  }
  
  const isDateDisabled = (date: Date) => {
    if (disabled && disabled(date)) return true
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    return false
  }
  
  const isSelected = (day: number) => {
    if (!selected) return false
    return (
      selected.getFullYear() === year &&
      selected.getMonth() === month &&
      selected.getDate() === day
    )
  }
  
  const isToday = (day: number) => {
    const today = new Date()
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    )
  }
  
  const handleDayClick = (day: number) => {
    const date = new Date(year, month, day)
    if (!isDateDisabled(date)) {
      onSelect?.(date)
    }
  }
  
  // Generate calendar grid
  const days: (number | null)[] = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }
  
  return (
    <div className={cn('p-3', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={prevMonth}
          className="h-7 w-7 p-0"
          aria-label="Previous month"
        >
          <span aria-hidden>←</span>
        </Button>
        <span className="text-sm font-medium">
          {monthNames[month]} {year}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={nextMonth}
          className="h-7 w-7 p-0"
          aria-label="Next month"
        >
          <span aria-hidden>→</span>
        </Button>
      </div>
      
      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div key={index} className="aspect-square">
            {day !== null && (
              <button
                type="button"
                onClick={() => handleDayClick(day)}
                disabled={isDateDisabled(new Date(year, month, day))}
                className={cn(
                  'w-full h-full text-sm rounded-md transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
                  'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent',
                  isSelected(day) && 'bg-primary text-primary-foreground hover:bg-primary',
                  isToday(day) && !isSelected(day) && 'border border-primary',
                )}
                aria-label={format(new Date(year, month, day), 'PPPP')}
                aria-selected={isSelected(day)}
              >
                {day}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// DatePicker Component
// ============================================================================

interface DatePickerProps {
  /** Selected date */
  value?: Date
  /** Callback when date changes */
  onChange?: (date: Date | undefined) => void
  /** Placeholder text */
  placeholder?: string
  /** Date format string */
  dateFormat?: string
  /** Disabled dates */
  disabled?: (date: Date) => boolean
  /** Minimum selectable date */
  minDate?: Date
  /** Maximum selectable date */
  maxDate?: Date
  /** Whether the picker is disabled */
  isDisabled?: boolean
  /** Error state */
  error?: boolean
  /** Additional className */
  className?: string
  /** ID for form integration */
  id?: string
  /** Name for form integration */
  name?: string
}

/**
 * Date picker component
 * 
 * @example
 * <DatePicker
 *   value={date}
 *   onChange={setDate}
 *   placeholder="Select a date"
 * />
 */
export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  dateFormat = 'PPP',
  disabled,
  minDate,
  maxDate,
  isDisabled,
  error,
  className,
  id,
  name,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  
  const handleSelect = (date: Date | undefined) => {
    onChange?.(date)
    setOpen(false)
  }
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          disabled={isDisabled}
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground',
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          aria-label={value ? `Selected date: ${format(value, dateFormat)}` : placeholder}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
          {value ? format(value, dateFormat) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          selected={value}
          onSelect={handleSelect}
          disabled={disabled}
          minDate={minDate}
          maxDate={maxDate}
        />
      </PopoverContent>
      {/* Hidden input for form submission */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={value ? value.toISOString() : ''}
        />
      )}
    </Popover>
  )
}

// ============================================================================
// DateRangePicker Component
// ============================================================================

interface DateRange {
  from?: Date
  to?: Date
}

interface DateRangePickerProps {
  /** Selected date range */
  value?: DateRange
  /** Callback when range changes */
  onChange?: (range: DateRange | undefined) => void
  /** Placeholder text */
  placeholder?: string
  /** Whether the picker is disabled */
  isDisabled?: boolean
  /** Additional className */
  className?: string
}

/**
 * Date range picker component
 * 
 * @example
 * <DateRangePicker
 *   value={dateRange}
 *   onChange={setDateRange}
 * />
 */
export function DateRangePicker({
  value,
  onChange,
  placeholder = 'Pick a date range',
  isDisabled,
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [selecting, setSelecting] = React.useState<'from' | 'to'>('from')
  
  const handleSelect = (date: Date | undefined) => {
    if (!date) return
    
    if (selecting === 'from') {
      onChange?.({ from: date, to: value?.to })
      setSelecting('to')
    } else {
      // Ensure 'to' is after 'from'
      if (value?.from && date < value.from) {
        onChange?.({ from: date, to: value.from })
      } else {
        onChange?.({ from: value?.from, to: date })
      }
      setOpen(false)
      setSelecting('from')
    }
  }
  
  const formatRange = () => {
    if (!value?.from) return placeholder
    if (!value?.to) return format(value.from, 'PPP') + ' - ...'
    return `${format(value.from, 'PP')} - ${format(value.to, 'PP')}`
  }
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={isDisabled}
          className={cn(
            'w-full justify-start text-left font-normal',
            !value?.from && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
          {formatRange()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-2 text-center text-sm text-muted-foreground border-b">
          Select {selecting === 'from' ? 'start' : 'end'} date
        </div>
        <Calendar
          selected={selecting === 'from' ? value?.from : value?.to}
          onSelect={handleSelect}
          minDate={selecting === 'to' ? value?.from : undefined}
        />
      </PopoverContent>
    </Popover>
  )
}

export { Calendar }
