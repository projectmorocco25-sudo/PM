'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  status?: 'success' | 'warning' | 'danger' | 'info'
  href?: string
  items?: {
    label: string
    value: string | number
    status?: 'success' | 'warning' | 'danger'
    href?: string
  }[]
  isLoading?: boolean
  action?: {
    label: string
    href: string
  }
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  status,
  href,
  items,
  isLoading,
  action,
}: MetricCardProps) {
  const statusColors = {
    success: 'text-green-500',
    warning: 'text-yellow-500',
    danger: 'text-red-500',
    info: 'text-blue-500',
  }

  const statusBg = {
    success: 'bg-green-500/10',
    warning: 'bg-yellow-500/10',
    danger: 'bg-red-500/10',
    info: 'bg-blue-500/10',
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    )
  }

  const Content = (
    <>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && (
          <div className={`p-2 rounded-md ${status ? statusBg[status] : 'bg-muted'}`}>
            <Icon className={`h-4 w-4 ${status ? statusColors[status] : 'text-muted-foreground'}`} />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className={`text-2xl font-bold ${status ? statusColors[status] : ''}`}>
            {value}
          </div>
          {trendValue && (
            <span className={`text-xs ${
              trend === 'up' ? 'text-green-500' : 
              trend === 'down' ? 'text-red-500' : 
              'text-muted-foreground'
            }`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''} {trendValue}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
        
        {items && items.length > 0 && (
          <div className="mt-3 space-y-2">
            {items.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                {item.href ? (
                  <Link href={item.href} className="text-muted-foreground hover:text-foreground truncate">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-muted-foreground truncate">{item.label}</span>
                )}
                <span className={item.status ? statusColors[item.status] : ''}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {action && (
          <Link 
            href={action.href}
            className="text-xs text-primary hover:underline mt-3 inline-block"
          >
            {action.label} →
          </Link>
        )}
      </CardContent>
    </>
  )

  if (href) {
    return (
      <Link href={href}>
        <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
          {Content}
        </Card>
      </Link>
    )
  }

  return <Card className="h-full">{Content}</Card>
}
