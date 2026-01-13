'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Task 1.1.2.18a: DetailPage layout component

export interface DetailPageHeaderAction {
  label: string
  onClick: () => void
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost'
  icon?: React.ReactNode
  disabled?: boolean
}

export interface DetailPageSection {
  id: string
  title: string
  description?: string
  content: React.ReactNode
}

export interface DetailPageTab {
  id: string
  label: string
  content: React.ReactNode
  badge?: number
}

export interface DetailPageProps {
  title: string
  subtitle?: string
  description?: string
  status?: React.ReactNode
  onBack?: () => void
  backLabel?: string
  actions?: DetailPageHeaderAction[]
  moreActions?: DetailPageHeaderAction[]
  sections?: DetailPageSection[]
  tabs?: DetailPageTab[]
  defaultTab?: string
  loading?: boolean
  children?: React.ReactNode
  className?: string
}

export function DetailPage({
  title,
  subtitle,
  description,
  status,
  onBack,
  backLabel = 'Back',
  actions = [],
  moreActions = [],
  sections = [],
  tabs = [],
  defaultTab,
  loading = false,
  children,
  className,
}: DetailPageProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="mb-2 -ml-2 h-8"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              {backLabel}
            </Button>
          )}
          <div className="flex items-center gap-3">
            {loading ? (
              <Skeleton className="h-8 w-48" />
            ) : (
              <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            )}
            {status}
          </div>
          {subtitle && (
            loading ? (
              <Skeleton className="h-5 w-32" />
            ) : (
              <p className="text-lg text-muted-foreground">{subtitle}</p>
            )
          )}
          {description && (
            loading ? (
              <Skeleton className="h-4 w-64" />
            ) : (
              <p className="text-sm text-muted-foreground">{description}</p>
            )
          )}
        </div>

        {/* Actions */}
        {(actions.length > 0 || moreActions.length > 0) && (
          <div className="flex items-center gap-2 flex-wrap">
            {actions.map((action, i) => (
              <Button
                key={i}
                variant={action.variant || 'default'}
                onClick={action.onClick}
                disabled={action.disabled || loading}
              >
                {action.icon}
                {action.label}
              </Button>
            ))}
            {moreActions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">More actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {moreActions.map((action, i) => (
                    <DropdownMenuItem
                      key={i}
                      onClick={action.onClick}
                      disabled={action.disabled}
                      className={cn(
                        action.variant === 'destructive' && 'text-destructive focus:text-destructive'
                      )}
                    >
                      {action.icon}
                      <span className="ml-2">{action.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </div>

      {/* Tabs layout */}
      {tabs.length > 0 ? (
        <Tabs defaultValue={defaultTab || tabs[0]?.id} className="space-y-4">
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="relative">
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                    {tab.badge}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              {loading ? (
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ) : (
                tab.content
              )}
            </TabsContent>
          ))}
        </Tabs>
      ) : sections.length > 0 ? (
        /* Sections layout */
        <div className="space-y-6">
          {sections.map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
                {section.description && (
                  <CardDescription>{section.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ) : (
                  section.content
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Custom children */
        loading ? (
          <Card>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ) : (
          children
        )
      )}
    </div>
  )
}

// Section helper components
export interface DetailSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export function DetailSection({
  title,
  description,
  children,
  actions,
  className,
}: DetailSectionProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {actions}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

// Detail field display
export interface DetailFieldProps {
  label: string
  value: React.ReactNode
  className?: string
}

export function DetailField({ label, value, className }: DetailFieldProps) {
  return (
    <div className={cn('space-y-1', className)}>
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm">{value || '—'}</dd>
    </div>
  )
}

// Grid layout for detail fields
export interface DetailGridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  className?: string
}

export function DetailGrid({ children, columns = 2, className }: DetailGridProps) {
  const colsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <dl className={cn('grid gap-4', colsClass[columns], className)}>
      {children}
    </dl>
  )
}
