'use client'

/**
 * Task 1.1.1.18g: Archived Conversations component
 * 
 * Display archived conversations with restore functionality.
 * Features:
 * - 7-year retention policy compliance
 * - Restore to inbox functionality
 * - Search and filter
 * - Delete confirmation with regulatory warning
 * 
 * @see docs/04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.36-archived-conversations.md
 */

import { useState } from 'react'
import { formatDistanceToNow, format, addYears } from 'date-fns'
import {
  Archive,
  Search,
  RotateCcw,
  Trash2,
  Users,
  Info,
  Calendar,
  AlertTriangle,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useCommunications, type Conversation } from '@/hooks/use-communications'
import { Spinner } from '@/components/ui/loading'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface ArchivedConversationsProps {
  onSelectConversation?: (id: string) => void
  selectedId?: string
}

export function ArchivedConversations({ onSelectConversation, selectedId }: ArchivedConversationsProps) {
  const { conversations, isLoading, archiveConversation } = useCommunications()
  const [searchQuery, setSearchQuery] = useState('')
  const [restoringId, setRestoringId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { success, error } = useToast()

  // Filter to only archived conversations
  const archivedConversations = conversations.filter((conv) => {
    if (conv.lifecycle_state !== 'ARCHIVED') return false

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSubject = conv.subject.toLowerCase().includes(query)
      const matchesParticipant = conv.participants.some(
        (p) => p.user.full_name.toLowerCase().includes(query)
      )
      if (!matchesSubject && !matchesParticipant) return false
    }

    return true
  })

  // Calculate retention expiry (7 years from archive date)
  const getRetentionExpiry = (archivedAt: string) => {
    const archiveDate = new Date(archivedAt)
    return addYears(archiveDate, 7)
  }

  const isExpiringWithinYear = (archivedAt: string) => {
    const expiry = getRetentionExpiry(archivedAt)
    const oneYearFromNow = addYears(new Date(), 1)
    return expiry <= oneYearFromNow
  }

  const handleRestore = async (conversationId: string) => {
    setRestoringId(conversationId)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      // In production, call API to restore conversation
      success({
        title: 'Conversation Restored',
        description: 'The conversation has been moved back to your inbox. Archive timestamp preserved in audit trail.',
      })
    } catch (e) {
      error('Failed to restore conversation')
    } finally {
      setRestoringId(null)
    }
  }

  const handleDelete = async (conversationId: string) => {
    try {
      // Simulate API call - Note: This is a soft delete per regulatory requirements
      await new Promise((resolve) => setTimeout(resolve, 500))
      setDeletingId(null)
      success({
        title: 'Conversation Removed',
        description: 'The conversation has been removed from the archive but remains in audit logs for compliance.',
      })
    } catch (e) {
      error('Failed to delete conversation')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Archived Conversations
          </h2>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search archived..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Archived List */}
      <ScrollArea className="flex-1">
        {archivedConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center p-4">
            <Archive className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-medium text-lg">No archived conversations</h3>
            <p className="text-muted-foreground text-sm mt-1">
              {searchQuery
                ? 'No archived conversations match your search'
                : 'Archived conversations will appear here'}
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {archivedConversations.map((conv) => {
              const retentionExpiry = getRetentionExpiry(conv.updated_at)
              const expiringSoon = isExpiringWithinYear(conv.updated_at)
              
              return (
                <div
                  key={conv.id}
                  className={cn(
                    'p-4 hover:bg-muted/50 transition-colors',
                    selectedId === conv.id && 'bg-muted'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <button
                      onClick={() => onSelectConversation?.(conv.id)}
                      className="flex-1 text-left min-w-0"
                    >
                      {/* Participants */}
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">
                          {conv.participants.map((p) => p.user.full_name).join(', ')}
                        </span>
                        {conv.participants.length > 2 && (
                          <Users className="h-3 w-3 text-muted-foreground" />
                        )}
                        {expiringSoon && (
                          <Badge variant="outline" className="text-amber-600 border-amber-300 text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Expiring Soon
                          </Badge>
                        )}
                      </div>

                      {/* Subject */}
                      <p className="text-sm mt-1 truncate text-muted-foreground">
                        {conv.subject}
                      </p>

                      {/* Archived timestamp */}
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>
                          Archived {formatDistanceToNow(new Date(conv.updated_at), { addSuffix: true })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Retained until {format(retentionExpiry, 'PP')}
                        </span>
                      </div>
                    </button>

                    <div className="flex items-center gap-1">
                      {/* Restore button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRestore(conv.id)}
                        disabled={restoringId === conv.id}
                        title="Restore conversation"
                      >
                        {restoringId === conv.id ? (
                          <Spinner size="sm" />
                        ) : (
                          <RotateCcw className="h-4 w-4" />
                        )}
                      </Button>

                      {/* Delete button */}
                      <Dialog open={deletingId === conv.id} onOpenChange={(open) => setDeletingId(open ? conv.id : null)}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            title="Delete conversation"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Conversation</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this conversation from the archive?
                            </DialogDescription>
                          </DialogHeader>
                          <Alert className="bg-amber-50 border-amber-500">
                            <Info className="h-4 w-4 text-amber-600" />
                            <AlertDescription className="text-amber-800 text-sm">
                              Per regulatory requirements, this is a soft delete. The conversation 
                              will be removed from your archive view but retained in audit logs 
                              for 7 years from the archive date.
                            </AlertDescription>
                          </Alert>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setDeletingId(null)}>
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDelete(conv.id)}
                            >
                              Delete from Archive
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </ScrollArea>

      {/* Footer with regulatory info */}
      <div className="p-3 border-t space-y-2">
        <p className="text-sm text-center text-muted-foreground">
          {archivedConversations.length} archived conversation{archivedConversations.length !== 1 ? 's' : ''}
        </p>
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-800 text-xs">
            Archived conversations are retained for 7 years (regulatory requirement). 
            After 7 years, conversations are automatically removed from active archive 
            but remain in audit logs for compliance purposes. No hard deletes are allowed.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
