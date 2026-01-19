/**
 * Wireframe: task-0.5.1.28-system-announcements.md
 * Implements: SystemAnnouncements component (MOH Tier 1 only - announcement list, creation interface, broadcast controls)
 * Wireframe Link: ../../../../../docs/04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.28-system-announcements.md
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MainContent } from '@/components/layout/main-content'
import { useConversations, useCreateConversation, useCommunicationRealtime } from '@/lib/hooks/use-communications'
import { useUserRole } from '@/lib/hooks/use-user-role'
import { Skeleton } from '@/components/ui/loading/skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageSquare, X, Edit, Trash2, Eye } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

interface AnnouncementItemProps {
  announcement: any
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}

function AnnouncementItem({ announcement, onView, onEdit, onDelete }: AnnouncementItemProps) {
  const status = announcement.lifecycle_state
  const isRead = status === 'READ'
  const isDelivered = status === 'DELIVERED' && !isRead
  const isSent = status === 'SENT'
  
  const timeAgo = formatDistanceToNow(new Date(announcement.created_at), { addSuffix: true })
  
  return (
    <div
      className="rounded-lg border border-gray-200 bg-white p-4"
      style={{
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        backgroundColor: '#ffffff',
        marginBottom: '16px',
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Title */}
          <div
            className="mb-2 text-lg font-semibold text-gray-900"
            style={{ fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}
          >
            {announcement.subject}
          </div>
          
          {/* Metadata */}
          <div className="mb-2 flex flex-wrap items-center gap-4 text-sm text-gray-600" style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
            <span>Broadcast: {timeAgo}</span>
            <span>To: {announcement.recipient_scope || 'All Users'}</span>
            {isRead && (
              <span className="font-medium text-green-600" style={{ color: '#22c55e' }}>
                ✓✓ Read
              </span>
            )}
            {isDelivered && (
              <span className="font-medium text-blue-600" style={{ color: '#3b82f6' }}>
                ✓✓ Delivered
              </span>
            )}
            {isSent && (
              <span className="font-medium text-gray-500" style={{ color: '#6b7280' }}>
                ✓ Sent
              </span>
            )}
          </div>
          
          {/* Preview */}
          <div
            className="line-clamp-2 text-sm text-gray-600"
            style={{ fontSize: '14px', color: '#6b7280' }}
          >
            {announcement.preview || 'Announcement preview...'}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onView()
            }}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100"
            aria-label="View announcement"
          >
            <Eye className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100"
            aria-label="Edit announcement"
          >
            <Edit className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-red-300 text-red-600 hover:bg-red-50"
            aria-label="Delete announcement"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function SystemAnnouncements() {
  const router = useRouter()
  const { data: roleData } = useUserRole()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    recipientScope: 'all_users', // 'all_users', 'all_companies', 'specific_roles'
    scheduledDate: '',
    scheduledTime: '',
    scheduleForLater: false,
  })
  
  // Check if user is MOH Tier 1
  const isMOHTier1 = roleData?.isTier1 || false
  
  // Set up real-time updates
  useCommunicationRealtime()
  
  // Fetch announcements (conversations with is_announcement = true)
  const { data, isLoading, error } = useConversations({
    type: ['announcement'],
    limit: 50,
  })
  
  const announcements = (data?.conversations || []).filter((conv) => conv.is_announcement)
  
  const createConversationMutation = useCreateConversation()
  
  // If not MOH Tier 1, show access denied
  if (!isMOHTier1) {
    return (
      <MainContent
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Communications', href: '/communications/inbox' },
          { label: 'System Announcements' },
        ]}
        title="System Announcements"
      >
        <div className="px-4 py-12 text-center">
          <p className="text-sm text-red-600">Access denied. This feature is available only to MOH Tier 1 users.</p>
        </div>
      </MainContent>
    )
  }
  
  const handleCreateAnnouncement = () => {
    if (!formData.title.trim() || !formData.content.trim()) return
    
    createConversationMutation.mutate(
      {
        type: 'announcement',
        subject: formData.title.trim(),
        content: formData.content.trim(),
        recipientIds: [], // For announcements, recipients are determined by recipientScope
        attachments: undefined,
      },
      {
        onSuccess: () => {
          setShowCreateForm(false)
          setFormData({
            title: '',
            content: '',
            recipientScope: 'all_users',
            scheduledDate: '',
            scheduledTime: '',
            scheduleForLater: false,
          })
        },
      }
    )
  }
  
  const handleView = (announcementId: string) => {
    router.push(`/communications/inbox/${announcementId}`)
  }
  
  const handleEdit = (announcementId: string) => {
    // TODO: Implement edit functionality
    router.push(`/communications/announcements/${announcementId}/edit`)
  }
  
  const handleDelete = (announcementId: string) => {
    // TODO: Implement delete functionality (soft delete, no hard deletes allowed)
    if (confirm('Delete this announcement? (Note: Announcements are retained for 7 years per regulatory compliance)')) {
      // Delete logic
    }
  }
  
  return (
    <MainContent
      breadcrumbs={[
        { label: 'Home', href: '/dashboard' },
        { label: 'Communications', href: '/communications/inbox' },
        { label: 'System Announcements' },
      ]}
      title="System Announcements"
      actions={
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          Create Announcement
        </Button>
      }
    >
      {/* Create Announcement Form (Modal/Inline) */}
      {showCreateForm && (
        <div
          className="mb-6 rounded-lg border border-gray-200 bg-white p-6"
          style={{
            padding: '24px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            marginBottom: '24px',
          }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3
              className="text-lg font-semibold text-gray-900"
              style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}
            >
              Create Announcement
            </h3>
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close form"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900" style={{ fontSize: '14px', fontWeight: 500 }}>
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="Enter announcement title..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            
            {/* Content */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900" style={{ fontSize: '14px', fontWeight: 500 }}>
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter announcement content..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ minHeight: '200px', padding: '8px 12px', fontSize: '14px' }}
                rows={8}
              />
            </div>
            
            {/* Recipients */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900" style={{ fontSize: '14px', fontWeight: 500 }}>
                Recipients <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {[
                  { value: 'all_users', label: 'All Users' },
                  { value: 'all_companies', label: 'All Companies' },
                  { value: 'specific_roles', label: 'Specific Roles' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="radio"
                      name="recipientScope"
                      checked={formData.recipientScope === option.value}
                      onChange={() => setFormData({ ...formData, recipientScope: option.value })}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Lifecycle State Information */}
            <div
              className="rounded-md border border-blue-500 bg-blue-50 p-3 text-sm text-blue-900"
              style={{
                padding: '12px',
                backgroundColor: '#eff6ff',
                borderColor: '#3b82f6',
                fontSize: '14px',
                color: '#1e40af',
                borderRadius: '6px',
              }}
            >
              <p>
                Announcements follow the communication lifecycle: Created → Sent → Delivered → Read
                <br />
                <br />
                Read status will be tracked per company/user
                <br />
                <br />
                All announcements are retained for 7 years for regulatory compliance (no hard deletes allowed)
                <br />
                <br />
                Expired announcements remain accessible but marked as expired
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateAnnouncement}
                disabled={!formData.title.trim() || !formData.content.trim() || createConversationMutation.isPending}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                {createConversationMutation.isPending ? 'Broadcasting...' : 'Broadcast'}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Announcement List */}
      <div>
        {isLoading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-lg border border-gray-200 bg-white p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-1" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        )}
        
        {error && (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-red-600">Failed to load announcements. Please try again.</p>
          </div>
        )}
        
        {!isLoading && !error && announcements.length === 0 && (
          <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
            <MessageSquare
              className="h-16 w-16 text-gray-400"
              style={{ width: '64px', height: '64px', color: '#9ca3af' }}
            />
            <p
              className="mt-4 text-base font-medium text-gray-600"
              style={{ fontSize: '16px', color: '#6b7280', marginTop: '16px' }}
            >
              No announcements
            </p>
            <p
              className="mt-1 text-sm text-gray-500"
              style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}
            >
              You haven't created any announcements yet.
            </p>
          </div>
        )}
        
        {!isLoading && !error && announcements.length > 0 && (
          <div>
            {announcements.map((announcement) => (
              <AnnouncementItem
                key={announcement.id}
                announcement={announcement}
                onView={() => handleView(announcement.id)}
                onEdit={() => handleEdit(announcement.id)}
                onDelete={() => handleDelete(announcement.id)}
              />
            ))}
          </div>
        )}
      </div>
    </MainContent>
  )
}
