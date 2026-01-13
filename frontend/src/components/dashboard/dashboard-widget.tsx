'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react'

// Task 1.1.5.20b: DashboardWidget component

interface DashboardWidgetProps {
  title: string
  description?: string
  children: React.ReactNode
  icon?: LucideIcon
  loading?: boolean
  className?: string
  fullWidth?: boolean
}

export function DashboardWidget({
  title,
  description,
  children,
  icon: Icon,
  loading,
  className,
  fullWidth = false,
}: DashboardWidgetProps) {
  return (
    <Card className={cn(fullWidth && 'col-span-full', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  )
}

// Metric Widget with trend indicator
interface MetricWidgetProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: number
    label: string
  }
  icon?: LucideIcon
  loading?: boolean
  className?: string
}

export function MetricWidget({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  loading,
  className,
}: MetricWidgetProps) {
  const TrendIcon = trend 
    ? trend.value > 0 
      ? TrendingUp 
      : trend.value < 0 
        ? TrendingDown 
        : Minus
    : null

  const trendColor = trend
    ? trend.value > 0
      ? 'text-green-600'
      : trend.value < 0
        ? 'text-red-600'
        : 'text-muted-foreground'
    : ''

  return (
    <Card className={className}>
      <CardContent className="pt-6">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {Icon && <Icon className="h-4 w-4" />}
              {title}
            </div>
            <div className="text-3xl font-bold mt-2">{value}</div>
            <div className="flex items-center gap-2 mt-1">
              {subtitle && (
                <span className="text-sm text-muted-foreground">{subtitle}</span>
              )}
              {trend && TrendIcon && (
                <span className={cn('flex items-center gap-1 text-sm', trendColor)}>
                  <TrendIcon className="h-4 w-4" />
                  {Math.abs(trend.value)}% {trend.label}
                </span>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

// Chart Widget wrapper
interface ChartWidgetProps {
  title: string
  description?: string
  children: React.ReactNode
  loading?: boolean
  className?: string
  aspectRatio?: 'video' | 'square' | 'auto'
}

export function ChartWidget({
  title,
  description,
  children,
  loading,
  className,
  aspectRatio = 'video',
}: ChartWidgetProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className={cn(
            'flex items-center justify-center bg-muted/30 rounded-md',
            aspectRatio === 'video' && 'aspect-video',
            aspectRatio === 'square' && 'aspect-square',
            aspectRatio === 'auto' && 'min-h-[200px]'
          )}>
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          <div className={cn(
            aspectRatio === 'video' && 'aspect-video',
            aspectRatio === 'square' && 'aspect-square'
          )}>
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
