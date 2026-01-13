'use client'

import { cn } from '@/lib/utils'
import { 
  Inbox, 
  Search, 
  FileText, 
  Users, 
  Package, 
  Building2,
  MessageSquare,
  Bell,
  Calendar,
  Plus,
  type LucideIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// Task 1.1.1.12e: Empty state patterns

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
  className?: string
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      <div className="rounded-full bg-muted p-4 mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">{description}</p>
      {action && (
        action.href ? (
          <Button asChild className="mt-4">
            <Link href={action.href}>
              <Plus className="h-4 w-4 mr-2" />
              {action.label}
            </Link>
          </Button>
        ) : (
          <Button onClick={action.onClick} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            {action.label}
          </Button>
        )
      )}
    </div>
  )
}

// Pre-built empty states for common scenarios

export function NoSearchResults({ query, onClear }: { query?: string; onClear?: () => void }) {
  return (
    <EmptyState
      icon={Search}
      title="No results found"
      description={query ? `No results found for "${query}". Try adjusting your search terms.` : 'No results match your search criteria.'}
      action={onClear ? { label: 'Clear Search', onClick: onClear } : undefined}
    />
  )
}

export function NoDataYet({
  resourceName,
  createHref,
  onCreate,
}: {
  resourceName: string
  createHref?: string
  onCreate?: () => void
}) {
  return (
    <EmptyState
      icon={FileText}
      title={`No ${resourceName} yet`}
      description={`Get started by creating your first ${resourceName.toLowerCase()}.`}
      action={createHref || onCreate ? {
        label: `Create ${resourceName}`,
        href: createHref,
        onClick: onCreate,
      } : undefined}
    />
  )
}

export function NoCompanies() {
  return (
    <EmptyState
      icon={Building2}
      title="No companies"
      description="No companies have been registered in the system yet."
    />
  )
}

export function NoProducts() {
  return (
    <EmptyState
      icon={Package}
      title="No products"
      description="No products have been registered yet. Products will appear here once added."
    />
  )
}

export function NoSubmissions({ type }: { type?: string }) {
  return (
    <EmptyState
      icon={FileText}
      title={`No ${type || ''} submissions`}
      description="You haven't submitted any data yet. Start by creating a new submission."
    />
  )
}

export function NoMessages() {
  return (
    <EmptyState
      icon={MessageSquare}
      title="No messages"
      description="Your inbox is empty. Start a conversation or wait for incoming messages."
      action={{ label: 'Compose Message', href: '/dashboard/communications/compose' }}
    />
  )
}

export function NoNotifications() {
  return (
    <EmptyState
      icon={Bell}
      title="No notifications"
      description="You're all caught up! New notifications will appear here."
    />
  )
}

export function NoMeetings() {
  return (
    <EmptyState
      icon={Calendar}
      title="No meetings scheduled"
      description="You don't have any upcoming meetings. Schedule one to get started."
      action={{ label: 'Schedule Meeting', href: '/dashboard/governance/meetings/new' }}
    />
  )
}

export function NoUsers() {
  return (
    <EmptyState
      icon={Users}
      title="No users"
      description="No users match your filter criteria."
    />
  )
}

// First-time experience components
interface WelcomeCardProps {
  title: string
  description: string
  steps?: { title: string; description: string; completed?: boolean }[]
  className?: string
}

export function WelcomeCard({ title, description, steps, className }: WelcomeCardProps) {
  return (
    <div className={cn('rounded-lg border bg-card p-6', className)}>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-muted-foreground mt-1">{description}</p>
      {steps && steps.length > 0 && (
        <div className="mt-4 space-y-3">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium',
                step.completed ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              )}>
                {step.completed ? '✓' : index + 1}
              </div>
              <div>
                <p className={cn('font-medium', step.completed && 'line-through text-muted-foreground')}>
                  {step.title}
                </p>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
