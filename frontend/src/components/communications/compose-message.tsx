'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Send, X, Paperclip, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCommunications } from '@/hooks/use-communications'
import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'
import { createBrowserClient } from '@supabase/ssr'

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-key'
  return createBrowserClient(url, key)
}

interface UserRecord {
  id: string
  email: string
  full_name: string | null
  role: string | null
}

// Task 1.1.1.16i: ComposeMessage component

interface ComposeMessageProps {
  onClose?: () => void
  defaultRecipients?: string[]
  defaultSubject?: string
  relatedEntityType?: string
  relatedEntityId?: string
}

export function ComposeMessage({
  onClose,
  defaultRecipients = [],
  defaultSubject = '',
  relatedEntityType,
  relatedEntityId,
}: ComposeMessageProps) {
  const router = useRouter()
  const { createConversation, isCreating } = useCommunications()
  
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users-for-compose'],
    queryFn: async (): Promise<UserRecord[]> => {
      const supabase = getClient()
      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name, role')
        .eq('is_active', true)
        .order('full_name')
      if (error) throw error
      return (data as UserRecord[]) ?? []
    },
  })

  const [subject, setSubject] = useState(defaultSubject)
  const [content, setContent] = useState('')
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>(defaultRecipients)
  const [conversationType, setConversationType] = useState<string>('direct')
  const [priority, setPriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!subject.trim()) {
      toast.error('Please enter a subject')
      return
    }

    if (selectedRecipients.length === 0) {
      toast.error('Please select at least one recipient')
      return
    }

    if (!content.trim()) {
      toast.error('Please enter a message')
      return
    }

    createConversation(
      {
        subject: subject.trim(),
        type: conversationType,
        participants: selectedRecipients,
        initialMessage: content.trim(),
      },
      {
        onSuccess: (conversationId) => {
          toast.success('Message sent successfully')
          if (onClose) {
            onClose()
          } else {
            router.push(`/dashboard/communications/${conversationId}`)
          }
        },
        onError: (error) => {
          toast.error('Failed to send message: ' + error.message)
        },
      }
    )
  }

  const availableUsers = users?.filter((u) => !selectedRecipients.includes(u.id)) || []

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">New Message</h2>
        {onClose && (
          <Button type="button" variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Recipients */}
        <div className="space-y-2">
          <Label htmlFor="recipients">To</Label>
          <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[42px]">
            {selectedRecipients.map((id) => {
              const user = users?.find((u) => u.id === id)
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {user?.full_name || user?.email || id}
                  <button
                    type="button"
                    onClick={() => setSelectedRecipients((prev) => prev.filter((r) => r !== id))}
                    className="hover:bg-primary/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )
            })}
            <Select
              value=""
              onValueChange={(value) => {
                if (value && !selectedRecipients.includes(value)) {
                  setSelectedRecipients((prev) => [...prev, value])
                }
              }}
            >
              <SelectTrigger className="w-auto border-0 shadow-none h-auto p-0">
                <span className="text-sm text-muted-foreground">
                  {selectedRecipients.length === 0 ? 'Select recipients...' : 'Add more...'}
                </span>
              </SelectTrigger>
              <SelectContent>
                {usersLoading ? (
                  <SelectItem value="" disabled>Loading...</SelectItem>
                ) : availableUsers.length === 0 ? (
                  <SelectItem value="" disabled>No more users available</SelectItem>
                ) : (
                  availableUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{user.full_name || user.email}</span>
                        {user.role && (
                          <span className="text-xs text-muted-foreground">({user.role})</span>
                        )}
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Conversation Type & Priority */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={conversationType} onValueChange={setConversationType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="direct">Direct Message</SelectItem>
                <SelectItem value="workflow">Workflow Related</SelectItem>
                <SelectItem value="support">Support Request</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as typeof priority)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-slate-400" />
                    Low
                  </span>
                </SelectItem>
                <SelectItem value="normal">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-400" />
                    Normal
                  </span>
                </SelectItem>
                <SelectItem value="high">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    High
                  </span>
                </SelectItem>
                <SelectItem value="urgent">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    Urgent
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Subject */}
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter subject..."
          />
        </div>

        {/* Related Entity Info (if provided) */}
        {relatedEntityType && relatedEntityId && (
          <div className="p-3 bg-muted rounded-md text-sm">
            <p className="text-muted-foreground">
              Related to: <span className="font-medium">{relatedEntityType}</span>
            </p>
          </div>
        )}

        {/* Message Content */}
        <div className="space-y-2">
          <Label htmlFor="content">Message</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your message..."
            rows={8}
            className="resize-none"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-4 border-t">
        <Button type="button" variant="ghost" disabled>
          <Paperclip className="h-4 w-4 mr-2" />
          Attach
        </Button>
        <div className="flex gap-2">
          {onClose && (
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isCreating}>
            <Send className="h-4 w-4 mr-2" />
            {isCreating ? 'Sending...' : 'Send Message'}
          </Button>
        </div>
      </div>
    </form>
  )
}
