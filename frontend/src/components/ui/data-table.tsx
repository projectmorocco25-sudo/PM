'use client'

import * as React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
} from 'lucide-react'

// Task 1.1.2.17a: DataTable component with sorting, filtering, pagination, row selection

export interface Column<T> {
  key: keyof T | string
  header: string
  sortable?: boolean
  render?: (value: unknown, row: T) => React.ReactNode
  className?: string
}

export interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[]
  data: T[]
  total?: number
  page?: number
  pageSize?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
  sortColumn?: string
  sortDirection?: 'asc' | 'desc'
  onSort?: (column: string, direction: 'asc' | 'desc') => void
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  selectable?: boolean
  selectedRows?: string[]
  onSelectionChange?: (ids: string[]) => void
  onRowClick?: (row: T) => void
  loading?: boolean
  emptyMessage?: string
  className?: string
  // Task 1.1.2.17c: Responsive - card view on mobile
  mobileCardRender?: (row: T) => React.ReactNode
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  total,
  page = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  sortColumn,
  sortDirection,
  onSort,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  onRowClick,
  loading = false,
  emptyMessage = 'No data available',
  className,
  mobileCardRender,
}: DataTableProps<T>) {
  const totalPages = Math.ceil((total || data.length) / pageSize)

  const handleSort = (column: string) => {
    if (!onSort) return
    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc'
    onSort(column, newDirection)
  }

  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return
    onSelectionChange(checked ? data.map((row) => row.id) : [])
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    if (!onSelectionChange) return
    if (checked) {
      onSelectionChange([...selectedRows, id])
    } else {
      onSelectionChange(selectedRows.filter((rowId) => rowId !== id))
    }
  }

  const getValue = (row: T, key: string): unknown => {
    const keys = key.split('.')
    let value: unknown = row
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = (value as Record<string, unknown>)[k]
      } else {
        return undefined
      }
    }
    return value
  }

  const allSelected = data.length > 0 && selectedRows.length === data.length

  // Task 1.1.2.17d: Virtual scrolling support (simplified - uses max-height with overflow)
  const needsVirtualScroll = data.length > 100

  return (
    <div className={cn('space-y-4', className)}>
      {/* Task 1.1.2.17b: SearchBar */}
      {onSearchChange && (
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      )}

      {/* Task 1.1.2.17c: Responsive - Mobile card view */}
      {mobileCardRender && (
        <div className="md:hidden space-y-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-2">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))
          ) : data.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">{emptyMessage}</div>
          ) : (
            data.map((row) => (
              <div
                key={row.id}
                className={cn(
                  'border rounded-lg p-4',
                  onRowClick && 'cursor-pointer hover:bg-muted/50'
                )}
                onClick={() => onRowClick?.(row)}
              >
                {mobileCardRender(row)}
              </div>
            ))
          )}
        </div>
      )}

      {/* Desktop table view */}
      <div className={cn('rounded-md border', mobileCardRender && 'hidden md:block')}>
        <div className={cn(needsVirtualScroll && 'max-h-[600px] overflow-auto')}>
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                {selectable && (
                  <TableHead className="w-12">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                )}
                {columns.map((column) => (
                  <TableHead
                    key={String(column.key)}
                    className={cn(column.className, column.sortable && 'cursor-pointer select-none')}
                    onClick={() => column.sortable && handleSort(String(column.key))}
                  >
                    <div className="flex items-center gap-1">
                      {column.header}
                      {column.sortable && (
                        <span className="ml-1">
                          {sortColumn === column.key ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp className="h-4 w-4" />
                            ) : (
                              <ArrowDown className="h-4 w-4" />
                            )
                          ) : (
                            <ArrowUpDown className="h-4 w-4 opacity-50" />
                          )}
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: pageSize }).map((_, i) => (
                  <TableRow key={i}>
                    {selectable && (
                      <TableCell>
                        <Skeleton className="h-4 w-4" />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell key={String(column.key)}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => (
                  <TableRow
                    key={row.id}
                    className={cn(onRowClick && 'cursor-pointer')}
                    onClick={() => onRowClick?.(row)}
                    data-state={selectedRows.includes(row.id) ? 'selected' : undefined}
                  >
                    {selectable && (
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedRows.includes(row.id)}
                          onCheckedChange={(checked) => handleSelectRow(row.id, !!checked)}
                          aria-label={`Select row ${row.id}`}
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => {
                      const value = getValue(row, String(column.key))
                      return (
                        <TableCell key={String(column.key)} className={column.className}>
                          {column.render ? column.render(value, row) : String(value ?? '')}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {(onPageChange || onPageSizeChange) && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            {total !== undefined ? (
              <>
                Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total} entries
              </>
            ) : (
              <>Showing {data.length} entries</>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onPageSizeChange && (
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                {[10, 25, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size} per page
                  </option>
                ))}
              </select>
            )}
            {onPageChange && (
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onPageChange(1)}
                  disabled={page === 1}
                  aria-label="First page"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onPageChange(page - 1)}
                  disabled={page === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="px-3 text-sm">
                  Page {page} of {totalPages || 1}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onPageChange(page + 1)}
                  disabled={page >= totalPages}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onPageChange(totalPages)}
                  disabled={page >= totalPages}
                  aria-label="Last page"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
