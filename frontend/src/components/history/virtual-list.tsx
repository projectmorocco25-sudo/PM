'use client'

import * as React from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

// Task 1.1.5.24: Virtual scrolling component for large lists

interface VirtualListProps<T> {
  items: T[]
  height: number | string
  estimateSize: number
  renderItem: (item: T, index: number) => React.ReactNode
  overscan?: number
  className?: string
  loading?: boolean
  loadingSkeletonCount?: number
  emptyMessage?: string
  getItemKey?: (item: T, index: number) => string | number
  onEndReached?: () => void
  endReachedThreshold?: number
}

export function VirtualList<T>({
  items,
  height,
  estimateSize,
  renderItem,
  overscan = 5,
  className,
  loading,
  loadingSkeletonCount = 10,
  emptyMessage = 'No items to display',
  getItemKey,
  onEndReached,
  endReachedThreshold = 200,
}: VirtualListProps<T>) {
  const parentRef = React.useRef<HTMLDivElement>(null)
  const hasCalledEndReached = React.useRef(false)

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
    getItemKey: getItemKey 
      ? (index) => getItemKey(items[index], index) 
      : undefined,
  })

  const virtualItems = virtualizer.getVirtualItems()
  const totalSize = virtualizer.getTotalSize()

  // Handle infinite scroll
  React.useEffect(() => {
    if (!onEndReached || !parentRef.current) return

    const scrollElement = parentRef.current
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight

      if (distanceFromBottom < endReachedThreshold && !hasCalledEndReached.current) {
        hasCalledEndReached.current = true
        onEndReached()
      } else if (distanceFromBottom >= endReachedThreshold) {
        hasCalledEndReached.current = false
      }
    }

    scrollElement.addEventListener('scroll', handleScroll)
    return () => scrollElement.removeEventListener('scroll', handleScroll)
  }, [onEndReached, endReachedThreshold])

  // Loading state
  if (loading && items.length === 0) {
    return (
      <div
        className={cn('overflow-auto', className)}
        style={{ height }}
      >
        <div className="space-y-2 p-2">
          {Array.from({ length: loadingSkeletonCount }).map((_, i) => (
            <Skeleton key={i} className="w-full" style={{ height: estimateSize }} />
          ))}
        </div>
      </div>
    )
  }

  // Empty state
  if (items.length === 0) {
    return (
      <div
        className={cn('flex items-center justify-center text-muted-foreground', className)}
        style={{ height }}
      >
        {emptyMessage}
      </div>
    )
  }

  return (
    <div
      ref={parentRef}
      className={cn('overflow-auto', className)}
      style={{ height }}
    >
      <div
        style={{
          height: totalSize,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualItem) => (
          <div
            key={virtualItem.key}
            data-index={virtualItem.index}
            ref={virtualizer.measureElement}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {renderItem(items[virtualItem.index], virtualItem.index)}
          </div>
        ))}
      </div>
    </div>
  )
}

// Virtual table for tabular data
interface VirtualTableColumn<T> {
  key: keyof T | string
  header: string
  width?: number | string
  render?: (value: unknown, item: T, index: number) => React.ReactNode
}

interface VirtualTableProps<T> {
  items: T[]
  columns: VirtualTableColumn<T>[]
  height: number | string
  rowHeight?: number
  overscan?: number
  className?: string
  loading?: boolean
  emptyMessage?: string
  getRowKey?: (item: T, index: number) => string | number
  onRowClick?: (item: T, index: number) => void
}

export function VirtualTable<T>({
  items,
  columns,
  height,
  rowHeight = 48,
  overscan = 5,
  className,
  loading,
  emptyMessage = 'No data available',
  getRowKey,
  onRowClick,
}: VirtualTableProps<T>) {
  const parentRef = React.useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan,
    getItemKey: getRowKey 
      ? (index) => getRowKey(items[index], index) 
      : undefined,
  })

  const virtualItems = virtualizer.getVirtualItems()
  const totalSize = virtualizer.getTotalSize()

  // Loading state
  if (loading && items.length === 0) {
    return (
      <div className={cn('border rounded-md', className)}>
        {/* Header */}
        <div className="flex border-b bg-muted/50">
          {columns.map((col) => (
            <div
              key={String(col.key)}
              className="px-4 py-3 text-sm font-medium"
              style={{ width: col.width || 'auto', flex: col.width ? 'none' : 1 }}
            >
              {col.header}
            </div>
          ))}
        </div>
        {/* Loading skeletons */}
        <div className="space-y-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex border-b">
              {columns.map((col) => (
                <div
                  key={String(col.key)}
                  className="px-4 py-3"
                  style={{ width: col.width || 'auto', flex: col.width ? 'none' : 1 }}
                >
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Empty state
  if (items.length === 0) {
    return (
      <div className={cn('border rounded-md', className)}>
        {/* Header */}
        <div className="flex border-b bg-muted/50">
          {columns.map((col) => (
            <div
              key={String(col.key)}
              className="px-4 py-3 text-sm font-medium"
              style={{ width: col.width || 'auto', flex: col.width ? 'none' : 1 }}
            >
              {col.header}
            </div>
          ))}
        </div>
        <div
          className="flex items-center justify-center text-muted-foreground"
          style={{ height: 200 }}
        >
          {emptyMessage}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('border rounded-md', className)}>
      {/* Header */}
      <div className="flex border-b bg-muted/50 sticky top-0 z-10">
        {columns.map((col) => (
          <div
            key={String(col.key)}
            className="px-4 py-3 text-sm font-medium"
            style={{ width: col.width || 'auto', flex: col.width ? 'none' : 1 }}
          >
            {col.header}
          </div>
        ))}
      </div>

      {/* Virtual rows */}
      <div
        ref={parentRef}
        className="overflow-auto"
        style={{ height }}
      >
        <div
          style={{
            height: totalSize,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualItems.map((virtualItem) => {
            const item = items[virtualItem.index]
            return (
              <div
                key={virtualItem.key}
                data-index={virtualItem.index}
                ref={virtualizer.measureElement}
                className={cn(
                  'flex border-b',
                  onRowClick && 'cursor-pointer hover:bg-muted/50 transition-colors'
                )}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualItem.start}px)`,
                }}
                onClick={() => onRowClick?.(item, virtualItem.index)}
              >
                {columns.map((col) => {
                  const value = (item as Record<string, unknown>)[col.key as string]
                  return (
                    <div
                      key={String(col.key)}
                      className="px-4 py-3 text-sm truncate"
                      style={{ width: col.width || 'auto', flex: col.width ? 'none' : 1 }}
                    >
                      {col.render 
                        ? col.render(value, item, virtualItem.index)
                        : String(value ?? '')}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Simple virtual scroller for basic content
interface VirtualScrollerProps {
  children: React.ReactNode[]
  height: number | string
  estimateSize: number
  overscan?: number
  className?: string
}

export function VirtualScroller({
  children,
  height,
  estimateSize,
  overscan = 5,
  className,
}: VirtualScrollerProps) {
  const parentRef = React.useRef<HTMLDivElement>(null)
  const childArray = React.Children.toArray(children)

  const virtualizer = useVirtualizer({
    count: childArray.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
  })

  const virtualItems = virtualizer.getVirtualItems()
  const totalSize = virtualizer.getTotalSize()

  return (
    <div
      ref={parentRef}
      className={cn('overflow-auto', className)}
      style={{ height }}
    >
      <div
        style={{
          height: totalSize,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualItem) => (
          <div
            key={virtualItem.key}
            data-index={virtualItem.index}
            ref={virtualizer.measureElement}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {childArray[virtualItem.index]}
          </div>
        ))}
      </div>
    </div>
  )
}
