/**
 * Wireframe: task-0.5.1.26-compose-message.md
 * Implements: ComposeMessage component (recipient selection, subject, content, attachments, workflow entity linking)
 * Wireframe Link: ../../../../../docs/04-design/user-experience/wireframes/00-core-foundation/communications/task-0.5.1.26-compose-message.md
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MainContent } from '@/components/layout/main-content'
import { useCreateConversation } from '@/lib/hooks/use-communications'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Paperclip, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ComposeMessage() {
  const router = useRouter()
  const [recipientSearch, setRecipientSearch] = useState('')
  const [selectedRecipients, setSelectedRecipients] = useState<Array<{ id: string; name: string }>>([])
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])
  const [workflowEntityType, setWorkflowEntityType] = useState<string | null>(null)
  const [workflowEntityId, setWorkflowEntityId] = useState<string | null>(null)
  
  const [errors, setErrors] = useState<{
    recipients?: string
    subject?: string
    content?: string
  }>({})
  
  const createConversationMutation = useCreateConversation()
  const isSending = createConversationMutation.isPending
  
  const handleRemoveRecipient = (recipientId: string) => {
    setSelectedRecipients((prev) => prev.filter((r) => r.id !== recipientId))
  }
  
  const handleAddRecipient = (recipient: { id: string; name: string }) => {
    if (!selectedRecipients.find((r) => r.id === recipient.id)) {
      setSelectedRecipients((prev) => [...prev, recipient])
      setRecipientSearch('')
    }
  }
  
  const handleAttachFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    // TODO: Validate file size (max 10MB) and type
    setAttachments((prev) => [...prev, ...files])
  }
  
  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }
  
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {}
    
    if (selectedRecipients.length === 0) {
      newErrors.recipients = 'At least one recipient is required'
    }
    
    if (!subject.trim()) {
      newErrors.subject = 'Subject is required'
    } else if (subject.length > 200) {
      newErrors.subject = 'Subject must be 200 characters or less'
    }
    
    if (!content.trim()) {
      newErrors.content = 'Message content is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSend = () => {
    if (!validateForm()) return
    
    createConversationMutation.mutate(
      {
        type: workflowEntityType ? 'workflow_related' : 'direct_message',
        subject: subject.trim(),
        content: content.trim(),
        recipientIds: selectedRecipients.map((r) => r.id),
        workflowEntityType: workflowEntityType || null,
        workflowEntityId: workflowEntityId || null,
        attachments: attachments.length > 0 ? attachments : undefined,
      },
      {
        onSuccess: () => {
          // Navigate to sent messages or inbox
          router.push('/communications/inbox')
        },
      }
    )
  }
  
  const handleCancel = () => {
    router.back()
  }
  
  const handleSaveDraft = () => {
    // TODO: Implement draft saving (localStorage or server)
    // For now, just show a message
    alert('Draft saved')
  }
  
  return (
    <MainContent
      breadcrumbs={[
        { label: 'Home', href: '/dashboard' },
        { label: 'Communications', href: '/communications/inbox' },
        { label: 'Compose' },
      ]}
      title="Compose New Message"
    >
      <div
        className="mx-auto max-w-[800px]"
        style={{ maxWidth: '800px', margin: '0 auto' }}
      >
        <form className="space-y-6" style={{ gap: '32px' }}>
          {/* Recipient Selection */}
          <div>
            <label
              className="mb-2 block text-sm font-medium text-gray-900"
              style={{ fontSize: '14px', fontWeight: 500, color: '#111827', marginBottom: '8px' }}
            >
              To <span className="text-red-500" style={{ color: '#ef4444' }}>*</span>
            </label>
            
            <div className="space-y-2">
              {/* Search Input */}
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search recipients..."
                  value={recipientSearch}
                  onChange={(e) => setRecipientSearch(e.target.value)}
                  className={cn(
                    'w-full',
                    errors.recipients && 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  )}
                />
                {/* TODO: Show recipient dropdown with search results */}
              </div>
              
              {/* Selected Recipients Chips */}
              {selectedRecipients.length > 0 && (
                <div className="flex flex-wrap gap-2" style={{ gap: '8px' }}>
                  {selectedRecipients.map((recipient) => (
                    <div
                      key={recipient.id}
                      className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                      style={{
                        padding: '4px 12px',
                        fontSize: '14px',
                        backgroundColor: '#dbeafe',
                        color: '#1e40af',
                        borderRadius: '9999px',
                      }}
                    >
                      <span>{recipient.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRecipient(recipient.id)}
                        className="ml-1 text-blue-700 hover:text-blue-900"
                        aria-label={`Remove ${recipient.name}`}
                        style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Filters Placeholder */}
              {/* TODO: Implement role and company filters */}
              
              {errors.recipients && (
                <p className="text-xs text-red-600" style={{ fontSize: '12px', color: '#ef4444' }}>
                  {errors.recipients}
                </p>
              )}
            </div>
          </div>
          
          {/* Subject Input */}
          <div>
            <label
              className="mb-2 block text-sm font-medium text-gray-900"
              style={{ fontSize: '14px', fontWeight: 500, color: '#111827', marginBottom: '8px' }}
            >
              Subject <span className="text-red-500" style={{ color: '#ef4444' }}>*</span>
            </label>
            <Input
              type="text"
              placeholder="Enter subject..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={cn(
                'h-10 w-full',
                errors.subject && 'border-red-500 focus:border-red-500 focus:ring-red-500'
              )}
              style={{ height: '40px' }}
            />
            {errors.subject && (
              <p className="mt-1 text-xs text-red-600" style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>
                {errors.subject}
              </p>
            )}
          </div>
          
          {/* Message Content */}
          <div>
            <label
              className="mb-2 block text-sm font-medium text-gray-900"
              style={{ fontSize: '14px', fontWeight: 500, color: '#111827', marginBottom: '8px' }}
            >
              Message <span className="text-red-500" style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your message..."
              className={cn(
                'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500',
                errors.content && 'border-red-500 focus:border-red-500 focus:ring-red-500'
              )}
              style={{
                minHeight: '200px',
                maxHeight: '500px',
                padding: '8px 12px',
                fontSize: '14px',
              }}
              rows={8}
            />
            {errors.content && (
              <p className="mt-1 text-xs text-red-600" style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>
                {errors.content}
              </p>
            )}
          </div>
          
          {/* Attachments */}
          <div>
            <label
              className="mb-2 block text-sm font-medium text-gray-900"
              style={{ fontSize: '14px', fontWeight: 500, color: '#111827', marginBottom: '8px' }}
            >
              Attachments
            </label>
            <div className="space-y-2">
              <input
                type="file"
                id="file-upload"
                multiple
                onChange={handleAttachFiles}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                style={{ padding: '8px 16px', fontSize: '14px', fontWeight: 500 }}
              >
                <Paperclip className="h-4 w-4" />
                Attach Files
              </label>
              
              {/* File List */}
              {attachments.length > 0 && (
                <div className="mt-2 space-y-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2"
                      style={{ padding: '8px 12px' }}
                    >
                      <span className="text-sm text-gray-700" style={{ fontSize: '14px' }}>
                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(index)}
                        className="text-gray-400 hover:text-gray-600"
                        aria-label={`Remove ${file.name}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Workflow Entity Linking (Optional) */}
          <div>
            <label
              className="mb-2 block text-sm font-medium text-gray-900"
              style={{ fontSize: '14px', fontWeight: 500, color: '#111827', marginBottom: '8px' }}
            >
              Link to Workflow Entity (Optional)
            </label>
            <div className="space-y-3">
              {/* Entity Type Selector */}
              <select
                value={workflowEntityType || ''}
                onChange={(e) => setWorkflowEntityType(e.target.value || null)}
                className="h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ height: '40px', padding: '8px 12px', fontSize: '14px' }}
              >
                <option value="">None</option>
                <option value="submission">Submission</option>
                <option value="breach">Breach</option>
                <option value="export_request">Export Request</option>
                <option value="enforcement_action">Enforcement Action</option>
                <option value="compliance_score">Compliance Score</option>
                <option value="dispute">Dispute</option>
              </select>
              
              {/* Entity Search/Select (placeholder) */}
              {workflowEntityType && (
                <Input
                  type="text"
                  placeholder="Search or select..."
                  value={workflowEntityId || ''}
                  onChange={(e) => setWorkflowEntityId(e.target.value || null)}
                />
              )}
              
              {/* Immutability Warning */}
              {workflowEntityType && workflowEntityId && (
                <div
                  className="rounded-md border border-yellow-400 bg-yellow-50 p-3 text-sm text-yellow-800"
                  style={{
                    padding: '12px',
                    backgroundColor: '#fef3c7',
                    borderColor: '#f59e0b',
                    fontSize: '14px',
                    color: '#92400e',
                    borderRadius: '6px',
                  }}
                >
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                    <span>
                      ⚠️ Once linked, this conversation will be permanently associated with this workflow entity. The link cannot be changed after creation (immutable per lifecycle requirements).
                    </span>
                  </div>
                </div>
              )}
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
              After sending, this conversation will enter the lifecycle: Created → Sent → Delivered → Read
              {workflowEntityType && workflowEntityId && (
                <>
                  <br />
                  <br />
                  If linked to a workflow entity, the link will be permanent (immutable). The conversation will enter WORKFLOW_LINKED state.
                </>
              )}
              <br />
              <br />
              All conversations are retained for 7 years for regulatory compliance (no hard deletes allowed).
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3" style={{ gap: '12px' }}>
            <Button variant="outline" onClick={handleCancel} disabled={isSending}>
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isSending}
            >
              Save Draft
            </Button>
            <Button
              onClick={handleSend}
              disabled={isSending || !subject.trim() || !content.trim() || selectedRecipients.length === 0}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isSending ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </form>
      </div>
    </MainContent>
  )
}
