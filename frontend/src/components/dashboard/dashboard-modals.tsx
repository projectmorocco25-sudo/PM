'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { getSupabaseClient } from '@/lib/supabase/client'
import { useQueryClient } from '@tanstack/react-query'

// Alert Company Modal
interface AlertCompanyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  company?: { id: string; name: string }
}

const MESSAGE_TEMPLATES = {
  submission_overdue: 'Your WSL submission is overdue. Please submit immediately to avoid penalties.',
  threshold_breach: 'Your stock levels are below the required threshold. Please replenish and update.',
  compliance_warning: 'Your compliance score requires attention. Please review your submissions.',
}

export function AlertCompanyModal({ open, onOpenChange, company }: AlertCompanyModalProps) {
  const [template, setTemplate] = useState<keyof typeof MESSAGE_TEMPLATES>('submission_overdue')
  const [message, setMessage] = useState(MESSAGE_TEMPLATES.submission_overdue)
  const [sendEmail, setSendEmail] = useState(true)
  const [sendSms, setSendSms] = useState(false)
  const [createAuditLog, setCreateAuditLog] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleTemplateChange = (value: keyof typeof MESSAGE_TEMPLATES) => {
    setTemplate(value)
    setMessage(MESSAGE_TEMPLATES[value])
  }

  const handleSubmit = async () => {
    if (!company) return
    setIsSubmitting(true)
    
    try {
      const supabase = getSupabaseClient()
      // Create notification/alert record
      await supabase.from('notifications').insert({
        user_id: company.id, // Would be company contact in real impl
        type: 'alert',
        title: 'Compliance Alert',
        message,
        data: { company_id: company.id, template, send_email: sendEmail, send_sms: sendSms }
      })
      
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to send alert:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Alert Company</DialogTitle>
          <DialogDescription>
            Send a compliance alert to {company?.name || 'the company'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Company</Label>
            <Input value={company?.name || ''} disabled />
          </div>

          <div>
            <Label>Message Template</Label>
            <Select value={template} onValueChange={handleTemplateChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="submission_overdue">Submission Overdue</SelectItem>
                <SelectItem value="threshold_breach">Threshold Breach</SelectItem>
                <SelectItem value="compliance_warning">Compliance Warning</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Message</Label>
            <Textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox 
                id="send-email" 
                checked={sendEmail} 
                onCheckedChange={(checked) => setSendEmail(!!checked)} 
              />
              <Label htmlFor="send-email">Send email notification</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox 
                id="send-sms" 
                checked={sendSms} 
                onCheckedChange={(checked) => setSendSms(!!checked)} 
              />
              <Label htmlFor="send-sms">Send SMS notification</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox 
                id="create-audit" 
                checked={createAuditLog} 
                onCheckedChange={(checked) => setCreateAuditLog(!!checked)} 
              />
              <Label htmlFor="create-audit">Create audit log entry</Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Alert'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Assign Follow-up Modal
interface AssignFollowUpModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  company?: { id: string; name: string }
  issue?: string
}

export function AssignFollowUpModal({ open, onOpenChange, company, issue }: AssignFollowUpModalProps) {
  const [assignedTo, setAssignedTo] = useState('')
  const [priority, setPriority] = useState<'extreme' | 'high' | 'normal'>('high')
  const [dueDate, setDueDate] = useState('')
  const [notes, setNotes] = useState('')
  const [notifyOfficer, setNotifyOfficer] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()

  const handleSubmit = async () => {
    if (!company || !assignedTo || !dueDate) return
    setIsSubmitting(true)

    try {
      const supabase = getSupabaseClient()
      await supabase.from('follow_ups').insert({
        company_id: company.id,
        assigned_to: assignedTo,
        priority,
        due_date: dueDate,
        notes,
        status: 'active',
        issue_description: issue,
      })

      queryClient.invalidateQueries({ queryKey: ['dashboard', 'follow-ups'] })
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to create follow-up:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign Follow-up</DialogTitle>
          <DialogDescription>
            Assign a follow-up task for {company?.name || 'the company'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Company</Label>
            <Input value={company?.name || ''} disabled />
          </div>

          {issue && (
            <div>
              <Label>Issue</Label>
              <Input value={issue} disabled />
            </div>
          )}

          <div>
            <Label>Assign to</Label>
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger>
                <SelectValue placeholder="Select officer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="officer-1">Officer A (Tier 1)</SelectItem>
                <SelectItem value="officer-2">Officer B (Tier 2)</SelectItem>
                <SelectItem value="officer-3">Officer C (Tier 2)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Priority</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="extreme">Extreme</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Due Date</Label>
            <Input 
              type="date" 
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div>
            <Label>Notes (Optional)</Label>
            <Textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional context or instructions..."
              rows={3}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox 
              id="notify-officer" 
              checked={notifyOfficer} 
              onCheckedChange={(checked) => setNotifyOfficer(!!checked)} 
            />
            <Label htmlFor="notify-officer">Notify assigned officer</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !assignedTo || !dueDate}>
            {isSubmitting ? 'Assigning...' : 'Assign Follow-up'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Schedule Meeting Modal
interface ScheduleMeetingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isEmergency?: boolean
  reason?: string
}

export function ScheduleMeetingModal({ open, onOpenChange, isEmergency, reason }: ScheduleMeetingModalProps) {
  const [meetingDate, setMeetingDate] = useState('')
  const [meetingTime, setMeetingTime] = useState('10:00')
  const [includeTier1, setIncludeTier1] = useState(true)
  const [includeTier2, setIncludeTier2] = useState(true)
  const [includeExternal, setIncludeExternal] = useState(false)
  const [location, setLocation] = useState('conference-room-a')
  const [agenda, setAgenda] = useState(
    isEmergency 
      ? '1. Review %SC status and unsubmitted companies\n2. Discuss immediate actions\n3. Assign follow-up responsibilities\n4. Set timeline for resolution'
      : ''
  )
  const [sendInvites, setSendInvites] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()

  const handleSubmit = async () => {
    if (!meetingDate || !meetingTime) return
    setIsSubmitting(true)

    try {
      const supabase = getSupabaseClient()
      
      // Create meeting
      const { data: meeting } = await supabase.from('meetings').insert({
        title: isEmergency ? 'Emergency Compliance Meeting' : 'Compliance Review Meeting',
        scheduled_at: `${meetingDate}T${meetingTime}:00`,
        location,
        agenda,
        meeting_type: isEmergency ? 'emergency' : 'regular',
        reason,
      }).select().single()

      // Add attendees (in real impl, would query actual users)
      if (meeting) {
        const attendees = []
        if (includeTier1) attendees.push({ meeting_id: meeting.id, role: 'tier1' })
        if (includeTier2) attendees.push({ meeting_id: meeting.id, role: 'tier2' })
        
        if (attendees.length > 0) {
          await supabase.from('meeting_attendees').insert(attendees)
        }
      }

      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to schedule meeting:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEmergency ? 'Schedule Emergency Meeting' : 'Schedule Meeting'}
          </DialogTitle>
          <DialogDescription>
            {reason || 'Schedule a compliance review meeting'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isEmergency && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-800">
              <strong>Reason:</strong> Submission Compliance Below Threshold
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Meeting Date</Label>
              <Input 
                type="date" 
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
              />
            </div>
            <div>
              <Label>Time</Label>
              <Input 
                type="time" 
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Attendees</Label>
            <div className="space-y-2 mt-2">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="tier1-team" 
                  checked={includeTier1} 
                  onCheckedChange={(checked) => setIncludeTier1(!!checked)} 
                />
                <Label htmlFor="tier1-team">MOH Tier 1 Team (5 members)</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="tier2-team" 
                  checked={includeTier2} 
                  onCheckedChange={(checked) => setIncludeTier2(!!checked)} 
                />
                <Label htmlFor="tier2-team">MOH Tier 2 Team (12 members)</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="external" 
                  checked={includeExternal} 
                  onCheckedChange={(checked) => setIncludeExternal(!!checked)} 
                />
                <Label htmlFor="external">External Stakeholders</Label>
              </div>
            </div>
          </div>

          <div>
            <Label>Location</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conference-room-a">MOH Conference Room A</SelectItem>
                <SelectItem value="conference-room-b">MOH Conference Room B</SelectItem>
                <SelectItem value="virtual">Virtual (Teams/Zoom)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Agenda</Label>
            <Textarea 
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox 
              id="send-invites" 
              checked={sendInvites} 
              onCheckedChange={(checked) => setSendInvites(!!checked)} 
            />
            <Label htmlFor="send-invites">Send calendar invites</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !meetingDate}>
            {isSubmitting ? 'Scheduling...' : 'Schedule Meeting'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
