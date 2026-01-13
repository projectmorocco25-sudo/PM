'use client'

/**
 * Task 1.1.1.16l: CommunicationWorkflowIntegration component
 * 
 * Message button, conversation list, context display on workflow pages.
 * Enables communication integration within workflow entities.
 * 
 * @see docs/02-architecture/frontend/ui-component-specifications.md
 * @see docs/04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.29-communication-integration-workflow.md
 */

import { useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import {
  MessageSquare,
  Plus,
  ChevronRight,
  Users,
  FileText,
  ExternalLink,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Spinner } from '@/components/ui/loading'
import { cn } from '@/lib/utils'

// ============================================================================
// Types
// ============================================================================

export type WorkflowEntityType = 
  | 'aams_submission'
  | 'msq_submission'
  | 'wsl_submission'
  | 'export_request'
  | 'registry_submission'
  | 'company'
  | 'product'
  | 'sku'
  | 'breach'
  | 'dispute'

interface WorkflowConversation {
  id: string
  subject: string
  lastMessage: {
    content: string
    sender: string
    timestamp: string
  }
  participantCount: number
  unreadCount: number
}

interface WorkflowIntegrationProps {
  /** Entity type */
  entityType: WorkflowEntityType
  /** Entity ID */
  entityId: string
  /** Entity display name */
  entityName?: string
  /** Whether to show inline (vs sheet) */
  variant?: 'button' | 'inline' | 'card'
  /** Custom className */
  className?: string
}

// ============================================================================
// Mock Data
// ============================================================================

function useMockConversations(entityType: WorkflowEntityType, entityId: string) {
  // Mock implementation - in production, fetch from API
  const conversations: WorkflowConversation[] = [
    {
      id: '1',
      subject: 'Clarification needed on submission',
      lastMessage: {
        content: 'Could you please provide additional documentation for the quantity discrepancy?',
        sender: 'MOH Officer',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      participantCount: 3,
      unreadCount: 1,
    },
    {
      id: '2',
      subject: 'Submission status update',
      lastMessage: {
        content: 'Your submission has been forwarded to Tier 1 for final approval.',
        sender: 'System',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
      participantCount: 2,
      unreadCount: 0,
    },
  ]

  return {
    conversations,
    isLoading: false,
    totalUnread: conversations.reduce((sum, c) => sum + c.unreadCount, 0),
  }
}

// ============================================================================
// Main Component
// ============================================================================

export function WorkflowCommunication({
  entityType,
  entityId,
  entityName,
  variant = 'button',
  className,
}: WorkflowIntegrationProps) {
  const { conversations, isLoading, totalUnread } = useMockConversations(entityType, entityId)
  const [isOpen, setIsOpen] = useState(false)

  const composeUrl = `/dashboard/communications/compose?entity_type=${entityType}&entity_id=${entityId}`

  if (variant === 'card') {
    return (
      <WorkflowConversationCard
        entityType={entityType}
        entityId={entityId}
        entityName={entityName}
        conversations={conversations}
        isLoading={isLoading}
        totalUnread={totalUnread}
        className={className}
      />
    )
  }

  if (variant === 'inline') {
    return (
      <WorkflowConversationInline
        entityType={entityType}
        entityId={entityId}
        conversations={conversations}
        isLoading={isLoading}
        totalUnread={totalUnread}
        className={className}
      />
    )
  }

  // Default: button with sheet
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className={cn('gap-2', className)}>
          <MessageSquare className="h-4 w-4" />
          Messages
          {totalUnread > 0 && (
            <Badge variant="destructive" className="ml-1 h-5 px-1.5">
              {totalUnread}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Related Conversations
          </SheetTitle>
          <SheetDescription>
            Messages related to this {formatEntityType(entityType)}
            {entityName && `: ${entityName}`}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <Button asChild className="w-full">
            <Link href={composeUrl}>
              <Plus className="h-4 w-4 mr-2" />
              Start New Conversation
            </Link>
          </Button>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No conversations yet</p>
              <p className="text-sm mt-1">Start a conversation about this {formatEntityType(entityType)}</p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="space-y-2">
                {conversations.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conversation={conv}
                    onClick={() => {
                      setIsOpen(false)
                    }}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ============================================================================
// Sub-Components
// ============================================================================

interface ConversationItemProps {
  conversation: WorkflowConversation
  onClick?: () => void
}

function ConversationItem({ conversation, onClick }: ConversationItemProps) {
  return (
    <Link
      href={`/dashboard/communications/inbox/${conversation.id}`}
      onClick={onClick}
      className={cn(
        'block p-3 rounded-lg border hover:bg-muted/50 transition-colors',
        conversation.unreadCount > 0 && 'border-primary bg-primary/5'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm truncate">
              {conversation.subject}
            </span>
            {conversation.unreadCount > 0 && (
              <Badge variant="destructive" className="h-4 px-1 text-xs">
                {conversation.unreadCount}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate mt-1">
            {conversation.lastMessage.sender}: {conversation.lastMessage.content}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDistanceToNow(new Date(conversation.lastMessage.timestamp), { addSuffix: true })}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            {conversation.participantCount}
          </div>
        </div>
      </div>
    </Link>
  )
}

interface WorkflowConversationCardProps {
  entityType: WorkflowEntityType
  entityId: string
  entityName?: string
  conversations: WorkflowConversation[]
  isLoading: boolean
  totalUnread: number
  className?: string
}

function WorkflowConversationCard({
  entityType,
  entityId,
  entityName,
  conversations,
  isLoading,
  totalUnread,
  className,
}: WorkflowConversationCardProps) {
  const composeUrl = `/dashboard/communications/compose?entity_type=${entityType}&entity_id=${entityId}`

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Related Conversations
            {totalUnread > 0 && (
              <Badge variant="destructive">{totalUnread}</Badge>
            )}
          </CardTitle>
          <Button size="sm" variant="outline" asChild>
            <Link href={composeUrl}>
              <Plus className="h-4 w-4 mr-1" />
              New
            </Link>
          </Button>
        </div>
        <CardDescription>
          Messages about this {formatEntityType(entityType)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Spinner />
          </div>
        ) : conversations.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No conversations yet
          </p>
        ) : (
          <div className="space-y-2">
            {conversations.slice(0, 3).map((conv) => (
              <ConversationItem key={conv.id} conversation={conv} />
            ))}
            {conversations.length > 3 && (
              <Link
                href={`/dashboard/communications?entity_type=${entityType}&entity_id=${entityId}`}
                className="block text-sm text-center text-primary hover:underline pt-2"
              >
                View all {conversations.length} conversations
              </Link>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface WorkflowConversationInlineProps {
  entityType: WorkflowEntityType
  entityId: string
  conversations: WorkflowConversation[]
  isLoading: boolean
  totalUnread: number
  className?: string
}

function WorkflowConversationInline({
  entityType,
  entityId,
  conversations,
  isLoading,
  totalUnread,
  className,
}: WorkflowConversationInlineProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className={cn('gap-1', className)}>
          <MessageSquare className="h-4 w-4" />
          <span>{conversations.length}</span>
          {totalUnread > 0 && (
            <Badge variant="destructive" className="h-4 px-1 text-xs ml-1">
              {totalUnread}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b">
          <h4 className="font-medium text-sm">Related Conversations</h4>
        </div>
        {isLoading ? (
          <div className="p-4 flex justify-center">
            <Spinner />
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No conversations
          </div>
        ) : (
          <ScrollArea className="max-h-[300px]">
            <div className="p-2 space-y-1">
              {conversations.map((conv) => (
                <ConversationItem key={conv.id} conversation={conv} />
              ))}
            </div>
          </ScrollArea>
        )}
        <div className="p-2 border-t">
          <Button size="sm" className="w-full" asChild>
            <Link href={`/dashboard/communications/compose?entity_type=${entityType}&entity_id=${entityId}`}>
              <Plus className="h-4 w-4 mr-1" />
              New Conversation
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// ============================================================================
// Quick Message Button (for toolbar integration)
// ============================================================================

interface QuickMessageButtonProps {
  entityType: WorkflowEntityType
  entityId: string
  entityName?: string
  size?: 'sm' | 'default' | 'lg'
  className?: string
}

export function QuickMessageButton({
  entityType,
  entityId,
  entityName,
  size = 'default',
  className,
}: QuickMessageButtonProps) {
  const composeUrl = `/dashboard/communications/compose?entity_type=${entityType}&entity_id=${entityId}${entityName ? `&entity_name=${encodeURIComponent(entityName)}` : ''}`

  return (
    <Button variant="outline" size={size} asChild className={className}>
      <Link href={composeUrl}>
        <MessageSquare className="h-4 w-4 mr-2" />
        Send Message
      </Link>
    </Button>
  )
}

// ============================================================================
// Workflow Context Display (shows linked entity in conversation)
// ============================================================================

interface WorkflowContextProps {
  entityType: WorkflowEntityType
  entityId: string
  entityName?: string
  className?: string
}

export function WorkflowContext({
  entityType,
  entityId,
  entityName,
  className,
}: WorkflowContextProps) {
  const entityUrl = getEntityUrl(entityType, entityId)

  return (
    <div className={cn('flex items-center gap-2 p-2 bg-muted/50 rounded-md text-sm', className)}>
      <FileText className="h-4 w-4 text-muted-foreground" />
      <span className="text-muted-foreground">Linked to:</span>
      <Link href={entityUrl} className="text-primary hover:underline flex items-center gap-1">
        {formatEntityType(entityType)}
        {entityName && `: ${entityName}`}
        <ExternalLink className="h-3 w-3" />
      </Link>
    </div>
  )
}

// ============================================================================
// Utilities
// ============================================================================

function formatEntityType(type: WorkflowEntityType): string {
  const labels: Record<WorkflowEntityType, string> = {
    aams_submission: 'AAMS Submission',
    msq_submission: 'MSQ Submission',
    wsl_submission: 'WSL Submission',
    export_request: 'Export Request',
    registry_submission: 'Registry Submission',
    company: 'Company',
    product: 'Product',
    sku: 'SKU',
    breach: 'Breach',
    dispute: 'Dispute',
  }
  return labels[type] || type
}

function getEntityUrl(type: WorkflowEntityType, id: string): string {
  const basePaths: Record<WorkflowEntityType, string> = {
    aams_submission: '/dashboard/vci/aams',
    msq_submission: '/dashboard/vci/msq',
    wsl_submission: '/dashboard/vci/wsl',
    export_request: '/dashboard/ecs/requests',
    registry_submission: '/dashboard/rmm/submissions',
    company: '/dashboard/rmm/companies',
    product: '/dashboard/rmm/products',
    sku: '/dashboard/rmm/skus',
    breach: '/dashboard/vci/breaches',
    dispute: '/dashboard/cmc/disputes',
  }
  return `${basePaths[type]}/${id}`
}
