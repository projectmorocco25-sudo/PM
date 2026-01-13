'use client'

/**
 * Task 1.1.1.16k: SystemAnnouncements component
 * 
 * MOH Tier 1 only - announcement list, creation interface, broadcast controls.
 * Features:
 * - Announcement list with read status indicators (✓ Sent, ✓✓ Delivered, ✓✓ Read)
 * - Create announcement form with audience targeting
 * - 7-year retention policy compliance info
 * - Delete functionality with confirmation
 * - View announcement detail modal
 * 
 * @see docs/02-architecture/frontend/ui-component-specifications.md
 * @see docs/04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.28-system-announcements.md
 */

import { useState } from 'react'
import { formatDistanceToNow, format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Megaphone,
  Plus,
  Send,
  Users,
  Building2,
  Globe,
  AlertTriangle,
  Info,
  Check,
  CheckCheck,
  Trash2,
  Edit,
  Eye,
  Calendar,
  Clock,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RoleGuard } from '@/components/guards/role-guard'
import { Spinner } from '@/components/ui/loading'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

// ============================================================================
// Types
// ============================================================================

type DeliveryStatus = 'CREATED' | 'SENT' | 'DELIVERED' | 'READ'

interface Announcement {
  id: string
  title: string
  content: string
  priority: 'low' | 'normal' | 'high' | 'critical'
  audience: 'all' | 'companies' | 'moh' | 'specific'
  status: 'draft' | 'scheduled' | 'published' | 'expired'
  delivery_status: DeliveryStatus
  created_at: string
  published_at?: string
  scheduled_for?: string
  expires_at?: string
  created_by: {
    id: string
    full_name: string
  }
  read_count: number
  delivered_count: number
  total_recipients: number
}

// ============================================================================
// Schema
// ============================================================================

const announcementSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  priority: z.enum(['low', 'normal', 'high', 'critical']),
  audience: z.enum(['all', 'companies', 'moh', 'specific']),
  schedule: z.boolean().optional(),
  scheduledFor: z.string().optional(),
})

type AnnouncementFormData = z.infer<typeof announcementSchema>

// ============================================================================
// Mock Data
// ============================================================================

const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'System Maintenance Scheduled',
    content: 'The PM Platform will undergo scheduled maintenance on January 15, 2026 from 02:00 to 06:00 UTC. During this time, the system will be unavailable. Please plan your submissions accordingly.',
    priority: 'high',
    audience: 'all',
    status: 'published',
    delivery_status: 'READ',
    created_at: '2026-01-10T10:00:00Z',
    published_at: '2026-01-10T10:00:00Z',
    expires_at: '2026-01-20T10:00:00Z',
    created_by: { id: '1', full_name: 'System Admin' },
    read_count: 145,
    delivered_count: 200,
    total_recipients: 200,
  },
  {
    id: '2',
    title: 'New WSL Submission Guidelines',
    content: 'Updated guidelines for Weekly Stock Level submissions are now available. Please review before your next submission. Key changes include updated threshold calculations and new reporting fields.',
    priority: 'normal',
    audience: 'companies',
    status: 'published',
    delivery_status: 'DELIVERED',
    created_at: '2026-01-08T14:30:00Z',
    published_at: '2026-01-08T15:00:00Z',
    created_by: { id: '1', full_name: 'MOH Tier 1' },
    read_count: 89,
    delivered_count: 120,
    total_recipients: 120,
  },
  {
    id: '3',
    title: 'Q1 2026 Compliance Reporting',
    content: 'Reminder: Q1 compliance reports are due by March 31, 2026. All companies must submit their quarterly compliance documentation through the platform.',
    priority: 'normal',
    audience: 'all',
    status: 'scheduled',
    delivery_status: 'CREATED',
    created_at: '2026-01-12T09:00:00Z',
    scheduled_for: '2026-01-15T09:00:00Z',
    created_by: { id: '1', full_name: 'MOH Tier 1' },
    read_count: 0,
    delivered_count: 0,
    total_recipients: 200,
  },
  {
    id: '4',
    title: 'Platform Update v2.1 Released',
    content: 'We have released version 2.1 of the PM Platform with new features including enhanced reporting, improved search functionality, and better mobile support.',
    priority: 'low',
    audience: 'all',
    status: 'published',
    delivery_status: 'SENT',
    created_at: '2026-01-11T08:00:00Z',
    published_at: '2026-01-11T08:00:00Z',
    created_by: { id: '1', full_name: 'System Admin' },
    read_count: 50,
    delivered_count: 150,
    total_recipients: 200,
  },
]

// ============================================================================
// Component
// ============================================================================

export function SystemAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'published' | 'scheduled' | 'draft' | 'expired'>('all')
  const [viewingAnnouncement, setViewingAnnouncement] = useState<Announcement | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { success, error } = useToast()

  const form = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: '',
      content: '',
      priority: 'normal',
      audience: 'all',
      schedule: false,
    },
  })

  const filteredAnnouncements = announcements.filter((a) => {
    if (filter === 'all') return true
    return a.status === filter
  })

  const handleCreate = async (data: AnnouncementFormData) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      const newAnnouncement: Announcement = {
        id: Date.now().toString(),
        title: data.title,
        content: data.content,
        priority: data.priority,
        audience: data.audience,
        status: data.schedule && data.scheduledFor ? 'scheduled' : 'published',
        delivery_status: data.schedule && data.scheduledFor ? 'CREATED' : 'SENT',
        created_at: new Date().toISOString(),
        published_at: data.schedule ? undefined : new Date().toISOString(),
        scheduled_for: data.scheduledFor,
        created_by: { id: '1', full_name: 'Current User' },
        read_count: 0,
        delivered_count: 0,
        total_recipients: data.audience === 'all' ? 200 : data.audience === 'companies' ? 120 : 80,
      }
      
      setAnnouncements([newAnnouncement, ...announcements])
      setIsCreateOpen(false)
      form.reset()
      success({
        title: data.schedule ? 'Announcement Scheduled' : 'Announcement Published',
        description: data.schedule 
          ? `Scheduled for ${format(new Date(data.scheduledFor!), 'PPp')}`
          : 'Your announcement has been broadcast to all recipients',
      })
    } catch (e) {
      error('Failed to create announcement')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      setAnnouncements(announcements.filter((a) => a.id !== id))
      setDeletingId(null)
      success('Announcement deleted successfully')
    } catch (e) {
      error('Failed to delete announcement')
    }
  }

  const getPriorityBadge = (priority: Announcement['priority']) => {
    const config = {
      low: { variant: 'secondary' as const, icon: Info, className: '' },
      normal: { variant: 'outline' as const, icon: Info, className: '' },
      high: { variant: 'default' as const, icon: AlertTriangle, className: 'bg-orange-500 hover:bg-orange-600' },
      critical: { variant: 'destructive' as const, icon: AlertTriangle, className: '' },
    }
    const { variant, icon: Icon, className } = config[priority]
    return (
      <Badge variant={variant} className={cn('gap-1', className)}>
        <Icon className="h-3 w-3" />
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    )
  }

  const getDeliveryStatusIndicator = (status: DeliveryStatus, readCount: number, deliveredCount: number, total: number) => {
    switch (status) {
      case 'CREATED':
        return (
          <span className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span className="text-xs">Pending</span>
          </span>
        )
      case 'SENT':
        return (
          <span className="flex items-center gap-1 text-muted-foreground">
            <Check className="h-3 w-3" />
            <span className="text-xs">Sent</span>
          </span>
        )
      case 'DELIVERED':
        return (
          <span className="flex items-center gap-1 text-blue-500">
            <CheckCheck className="h-3 w-3" />
            <span className="text-xs">Delivered ({deliveredCount}/{total})</span>
          </span>
        )
      case 'READ':
        return (
          <span className="flex items-center gap-1 text-green-500">
            <CheckCheck className="h-3 w-3" />
            <span className="text-xs">Read ({readCount}/{total})</span>
          </span>
        )
    }
  }

  const getAudienceIcon = (audience: Announcement['audience']) => {
    switch (audience) {
      case 'all':
        return <Globe className="h-4 w-4" />
      case 'companies':
        return <Building2 className="h-4 w-4" />
      case 'moh':
        return <Users className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: Announcement['status']) => {
    const config = {
      draft: { variant: 'secondary' as const, label: 'Draft' },
      scheduled: { variant: 'outline' as const, label: 'Scheduled' },
      published: { variant: 'default' as const, label: 'Active' },
      expired: { variant: 'secondary' as const, label: 'Expired' },
    }
    const { variant, label } = config[status]
    return <Badge variant={variant}>{label}</Badge>
  }

  return (
    <RoleGuard allowedRoles={['tier1']} fallback={<UnauthorizedView />}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              System Announcements
            </h2>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Announcement
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Announcement</DialogTitle>
                  <DialogDescription>
                    Create a system-wide announcement for platform users.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="Announcement title"
                      {...form.register('title')}
                    />
                    {form.formState.errors.title && (
                      <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                      id="content"
                      placeholder="Announcement content..."
                      rows={5}
                      {...form.register('content')}
                    />
                    {form.formState.errors.content && (
                      <p className="text-sm text-destructive">{form.formState.errors.content.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={form.watch('priority')}
                        onValueChange={(v) => form.setValue('priority', v as AnnouncementFormData['priority'])}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="audience">Recipients *</Label>
                      <Select
                        value={form.watch('audience')}
                        onValueChange={(v) => form.setValue('audience', v as AnnouncementFormData['audience'])}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Users</SelectItem>
                          <SelectItem value="companies">Companies Only</SelectItem>
                          <SelectItem value="moh">MOH Staff Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="schedule"
                      checked={form.watch('schedule')}
                      onCheckedChange={(checked) => form.setValue('schedule', !!checked)}
                    />
                    <Label htmlFor="schedule">Schedule for later</Label>
                  </div>

                  {form.watch('schedule') && (
                    <div className="space-y-2">
                      <Label htmlFor="scheduledFor">Broadcast Date/Time</Label>
                      <Input
                        id="scheduledFor"
                        type="datetime-local"
                        {...form.register('scheduledFor')}
                      />
                    </div>
                  )}

                  {/* Lifecycle Info Box */}
                  <Alert className="bg-blue-50 border-blue-500">
                    <Info className="h-4 w-4 text-blue-500" />
                    <AlertTitle className="text-blue-900">Announcement Lifecycle</AlertTitle>
                    <AlertDescription className="text-blue-800 text-sm space-y-1">
                      <p>• Announcements follow the lifecycle: Created → Sent → Delivered → Read</p>
                      <p>• Read status is tracked per company/user</p>
                      <p>• All announcements are retained for 7 years for regulatory compliance</p>
                      <p>• Expired announcements remain accessible but marked as expired</p>
                    </AlertDescription>
                  </Alert>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <Spinner size="sm" className="mr-2" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      {form.watch('schedule') ? 'Schedule' : 'Broadcast'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filter */}
          <div className="flex gap-2">
            {(['all', 'published', 'scheduled', 'expired'] as const).map((status) => (
              <Button
                key={status}
                variant={filter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(status)}
              >
                {status === 'published' ? 'Active' : status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Announcements List */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {filteredAnnouncements.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Megaphone className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg">No announcements</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    Create your first announcement to notify platform users.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredAnnouncements.map((announcement) => (
                <Card key={announcement.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-base">{announcement.title}</CardTitle>
                        <CardDescription className="flex items-center gap-3 flex-wrap">
                          <span className="flex items-center gap-1">
                            {getAudienceIcon(announcement.audience)}
                            {announcement.audience === 'all' ? 'All Users' : 
                              announcement.audience === 'companies' ? 'Companies' : 'MOH Staff'}
                          </span>
                          <span>•</span>
                          <span>
                            {announcement.status === 'scheduled' && announcement.scheduled_for
                              ? `Scheduled for ${format(new Date(announcement.scheduled_for), 'PPp')}`
                              : announcement.published_at
                                ? `Broadcast ${formatDistanceToNow(new Date(announcement.published_at), { addSuffix: true })}`
                                : 'Draft'}
                          </span>
                          <span>•</span>
                          {getDeliveryStatusIndicator(
                            announcement.delivery_status,
                            announcement.read_count,
                            announcement.delivered_count,
                            announcement.total_recipients
                          )}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {getPriorityBadge(announcement.priority)}
                        {getStatusBadge(announcement.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {announcement.content}
                    </p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {announcement.read_count} / {announcement.total_recipients} read
                        </span>
                        <span>By {announcement.created_by.full_name}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setViewingAnnouncement(announcement)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Dialog open={deletingId === announcement.id} onOpenChange={(open) => setDeletingId(open ? announcement.id : null)}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Announcement</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete this announcement? This action will soft-delete the announcement. 
                                It will be retained in audit logs for 7 years per regulatory requirements.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setDeletingId(null)}>
                                Cancel
                              </Button>
                              <Button 
                                variant="destructive"
                                onClick={() => handleDelete(announcement.id)}
                              >
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>

        {/* View Announcement Modal */}
        <Dialog open={!!viewingAnnouncement} onOpenChange={() => setViewingAnnouncement(null)}>
          <DialogContent className="max-w-2xl">
            {viewingAnnouncement && (
              <>
                <DialogHeader>
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-xl">{viewingAnnouncement.title}</DialogTitle>
                    <div className="flex gap-2">
                      {getPriorityBadge(viewingAnnouncement.priority)}
                      {getStatusBadge(viewingAnnouncement.status)}
                    </div>
                  </div>
                  <DialogDescription className="flex items-center gap-3 pt-2">
                    <span className="flex items-center gap-1">
                      {getAudienceIcon(viewingAnnouncement.audience)}
                      {viewingAnnouncement.audience === 'all' ? 'All Users' : 
                        viewingAnnouncement.audience === 'companies' ? 'Companies' : 'MOH Staff'}
                    </span>
                    <span>•</span>
                    <span>
                      {viewingAnnouncement.published_at
                        ? format(new Date(viewingAnnouncement.published_at), 'PPpp')
                        : 'Not published yet'}
                    </span>
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm whitespace-pre-wrap">{viewingAnnouncement.content}</p>
                </div>
                <div className="border-t pt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    {getDeliveryStatusIndicator(
                      viewingAnnouncement.delivery_status,
                      viewingAnnouncement.read_count,
                      viewingAnnouncement.delivered_count,
                      viewingAnnouncement.total_recipients
                    )}
                    <span>•</span>
                    <span>Created by {viewingAnnouncement.created_by.full_name}</span>
                  </div>
                  <span>{format(new Date(viewingAnnouncement.created_at), 'PP')}</span>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setViewingAnnouncement(null)}>
                    Close
                  </Button>
                  <Button>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </RoleGuard>
  )
}

function UnauthorizedView() {
  return (
    <div className="flex items-center justify-center h-64">
      <Card className="max-w-md">
        <CardHeader className="text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <CardTitle>Access Restricted</CardTitle>
          <CardDescription>
            System announcements can only be managed by MOH Tier 1 administrators.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
