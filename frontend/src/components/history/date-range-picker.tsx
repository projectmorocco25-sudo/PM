'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/date-picker'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  format,
  subDays,
  subMonths,
  subYears,
  startOfDay,
  endOfDay,
  isAfter,
  isBefore,
} from 'date-fns'
import { toZonedTime, fromZonedTime } from 'date-fns-tz'
import { CalendarIcon, Clock, X } from 'lucide-react'

// Task 1.1.5.22: DateRangePicker component

// Morocco timezone
const MOROCCO_TZ = 'Africa/Casablanca'

export interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

interface QuickFilter {
  label: string
  getValue: () => DateRange
}

const QUICK_FILTERS: QuickFilter[] = [
  {
    label: 'Last 7 days',
    getValue: () => ({
      from: subDays(new Date(), 7),
      to: new Date(),
    }),
  },
  {
    label: 'Last 30 days',
    getValue: () => ({
      from: subDays(new Date(), 30),
      to: new Date(),
    }),
  },
  {
    label: 'Last 3 months',
    getValue: () => ({
      from: subMonths(new Date(), 3),
      to: new Date(),
    }),
  },
  {
    label: 'Last year',
    getValue: () => ({
      from: subYears(new Date(), 1),
      to: new Date(),
    }),
  },
  {
    label: 'Last 7 years',
    getValue: () => ({
      from: subYears(new Date(), 7),
      to: new Date(),
    }),
  },
]

interface DateRangePickerProps {
  value?: DateRange
  onChange: (range: DateRange) => void
  placeholder?: string
  className?: string
  showTimezone?: boolean
  disabled?: boolean
  maxDate?: Date
  minDate?: Date
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = 'Select date range',
  className,
  showTimezone = true,
  disabled,
  maxDate = new Date(),
  minDate,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [tab, setTab] = React.useState<'quick' | 'custom'>('quick')
  const [tempRange, setTempRange] = React.useState<DateRange>({
    from: undefined,
    to: undefined,
  })

  // Convert to Morocco timezone for display
  const toMoroccoTime = (date: Date) => toZonedTime(date, MOROCCO_TZ)
  const fromMoroccoTime = (date: Date) => fromZonedTime(date, MOROCCO_TZ)

  const handleQuickFilter = (filter: QuickFilter) => {
    const range = filter.getValue()
    onChange({
      from: startOfDay(range.from!),
      to: endOfDay(range.to!),
    })
    setIsOpen(false)
  }

  const handleApply = () => {
    if (tempRange.from && tempRange.to) {
      onChange({
        from: startOfDay(tempRange.from),
        to: endOfDay(tempRange.to),
      })
    }
    setIsOpen(false)
  }

  const handleClear = () => {
    onChange({ from: undefined, to: undefined })
    setTempRange({ from: undefined, to: undefined })
    setIsOpen(false)
  }

  const handleFromChange = (date: Date | undefined) => {
    if (date && tempRange.to && isAfter(date, tempRange.to)) {
      setTempRange({ from: date, to: date })
    } else {
      setTempRange((prev) => ({ ...prev, from: date }))
    }
  }

  const handleToChange = (date: Date | undefined) => {
    if (date && tempRange.from && isBefore(date, tempRange.from)) {
      setTempRange({ from: date, to: date })
    } else {
      setTempRange((prev) => ({ ...prev, to: date }))
    }
  }

  const formatDisplayValue = () => {
    if (!value?.from) return placeholder
    if (!value?.to) return format(value.from, 'MMM d, yyyy')
    return `${format(value.from, 'MMM d, yyyy')} - ${format(value.to, 'MMM d, yyyy')}`
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'justify-start text-left font-normal',
            !value?.from && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDisplayValue()}
          {value?.from && (
            <X
              className="ml-auto h-4 w-4 opacity-50 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation()
                handleClear()
              }}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Tabs value={tab} onValueChange={(v) => setTab(v as 'quick' | 'custom')}>
          <div className="border-b p-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="quick">Quick Select</TabsTrigger>
              <TabsTrigger value="custom">Custom Range</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="quick" className="p-3 space-y-1">
            {QUICK_FILTERS.map((filter) => (
              <Button
                key={filter.label}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleQuickFilter(filter)}
              >
                {filter.label}
              </Button>
            ))}
          </TabsContent>

          <TabsContent value="custom" className="p-3 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">From</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !tempRange.from && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {tempRange.from
                        ? format(tempRange.from, 'MMM d, yyyy')
                        : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={tempRange.from}
                      onSelect={handleFromChange}
                      disabled={(date) =>
                        (maxDate && isAfter(date, maxDate)) ||
                        (minDate && isBefore(date, minDate))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">To</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !tempRange.to && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {tempRange.to
                        ? format(tempRange.to, 'MMM d, yyyy')
                        : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={tempRange.to}
                      onSelect={handleToChange}
                      disabled={(date) =>
                        (maxDate && isAfter(date, maxDate)) ||
                        (minDate && isBefore(date, minDate))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {showTimezone && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                Timezone: Morocco (Africa/Casablanca)
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleApply}
                disabled={!tempRange.from || !tempRange.to}
              >
                Apply
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}

// Simple preset selector
interface DatePresetSelectorProps {
  value?: string
  onChange: (preset: string, range: DateRange) => void
  className?: string
}

export function DatePresetSelector({ value, onChange, className }: DatePresetSelectorProps) {
  const handleChange = (preset: string) => {
    const filter = QUICK_FILTERS.find((f) => f.label === preset)
    if (filter) {
      const range = filter.getValue()
      onChange(preset, {
        from: startOfDay(range.from!),
        to: endOfDay(range.to!),
      })
    }
  }

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger className={cn('w-[180px]', className)}>
        <SelectValue placeholder="Select period" />
      </SelectTrigger>
      <SelectContent>
        {QUICK_FILTERS.map((filter) => (
          <SelectItem key={filter.label} value={filter.label}>
            {filter.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
