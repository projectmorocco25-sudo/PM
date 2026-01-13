'use client'

import * as React from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// Task 1.1.5.33-37: Year filter components for list pages

interface YearFilterProps {
  paramName?: string
  defaultYear?: number
  startYear?: number
  endYear?: number
  showQuickFilters?: boolean
  className?: string
}

export function YearFilter({
  paramName = 'year',
  defaultYear = new Date().getFullYear(),
  startYear = 2020,
  endYear = new Date().getFullYear(),
  showQuickFilters = true,
  className,
}: YearFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const currentYear = searchParams.get(paramName) || String(defaultYear)
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => endYear - i
  )

  const updateYear = (year: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (year && year !== String(defaultYear)) {
      params.set(paramName, year)
    } else {
      params.delete(paramName)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const quickYears = [
    new Date().getFullYear(),
    new Date().getFullYear() - 1,
    new Date().getFullYear() - 2,
  ]

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {showQuickFilters && (
        <div className="flex gap-1">
          {quickYears.map((year) => (
            <Badge
              key={year}
              variant={currentYear === String(year) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => updateYear(String(year))}
            >
              {year}
            </Badge>
          ))}
        </div>
      )}
      
      <Select value={currentYear} onValueChange={updateYear}>
        <SelectTrigger className="w-[120px]">
          <Calendar className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={String(year)}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {currentYear !== String(defaultYear) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => updateYear(null)}
          className="h-8 px-2"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

// Month filter
interface MonthFilterProps {
  paramName?: string
  className?: string
}

const MONTHS = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
]

export function MonthFilter({ paramName = 'month', className }: MonthFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const currentMonth = searchParams.get(paramName) || ''

  const updateMonth = (month: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (month && month !== 'all') {
      params.set(paramName, month)
    } else {
      params.delete(paramName)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <Select value={currentMonth || 'all'} onValueChange={updateMonth}>
      <SelectTrigger className={cn('w-[150px]', className)}>
        <SelectValue placeholder="All Months" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Months</SelectItem>
        {MONTHS.map((month) => (
          <SelectItem key={month.value} value={month.value}>
            {month.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// Week filter (ISO week format)
interface WeekFilterProps {
  paramName?: string
  className?: string
}

export function WeekFilter({ paramName = 'week', className }: WeekFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const currentWeek = searchParams.get(paramName) || ''

  const updateWeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const week = e.target.value
    const params = new URLSearchParams(searchParams.toString())
    if (week) {
      params.set(paramName, week)
    } else {
      params.delete(paramName)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const clearWeek = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete(paramName)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <input
        type="week"
        value={currentWeek}
        onChange={updateWeek}
        className="flex h-9 w-[180px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      />
      {currentWeek && (
        <Button variant="ghost" size="sm" onClick={clearWeek} className="h-8 px-2">
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

// Combined year/month filter
interface YearMonthFilterProps {
  yearParam?: string
  monthParam?: string
  className?: string
}

export function YearMonthFilter({
  yearParam = 'year',
  monthParam = 'month',
  className,
}: YearMonthFilterProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <YearFilter paramName={yearParam} showQuickFilters={false} />
      <MonthFilter paramName={monthParam} />
    </div>
  )
}

// Status filter with tabs
interface StatusFilterProps {
  paramName?: string
  options: { value: string; label: string }[]
  className?: string
}

export function StatusFilter({ paramName = 'status', options, className }: StatusFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const currentStatus = searchParams.get(paramName) || 'all'

  const updateStatus = (status: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (status && status !== 'all') {
      params.set(paramName, status)
    } else {
      params.delete(paramName)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className={cn('flex gap-1', className)}>
      <Badge
        variant={currentStatus === 'all' ? 'default' : 'outline'}
        className="cursor-pointer"
        onClick={() => updateStatus('all')}
      >
        All
      </Badge>
      {options.map((option) => (
        <Badge
          key={option.value}
          variant={currentStatus === option.value ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => updateStatus(option.value)}
        >
          {option.label}
        </Badge>
      ))}
    </div>
  )
}
