/**
 * Wireframe: task-0.5.1.31-notifications-page.md
 * Implements: Notification settings panel for notification preferences
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/00-core-foundation/global/task-0.5.1.31-notifications-page.md
 */

'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface NotificationsSettingsProps {
  onClose: () => void
}

interface NotificationPreferences {
  email_enabled: boolean
  submission_updates: boolean
  compliance_alerts: boolean
  enforcement_actions: boolean
  system_announcements: boolean
}

export function NotificationsSettings({ onClose }: NotificationsSettingsProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_enabled: true,
    submission_updates: true,
    compliance_alerts: true,
    enforcement_actions: true,
    system_announcements: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Load user preferences
  useEffect(() => {
    async function loadPreferences() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('users')
        .select('notification_preferences')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Failed to load notification preferences:', error)
        setLoading(false)
        return
      }

      if (data?.notification_preferences) {
        setPreferences({
          email_enabled: data.notification_preferences.email_enabled ?? true,
          submission_updates: data.notification_preferences.submission_updates ?? true,
          compliance_alerts: data.notification_preferences.compliance_alerts ?? true,
          enforcement_actions: data.notification_preferences.enforcement_actions ?? true,
          system_announcements: data.notification_preferences.system_announcements ?? true,
        })
      }

      setLoading(false)
    }

    loadPreferences()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast.error('User not authenticated')
      setSaving(false)
      return
    }

    const { error } = await supabase
      .from('users')
      .update({ notification_preferences: preferences })
      .eq('id', user.id)

    if (error) {
      toast.error('Failed to save notification preferences')
      console.error('Failed to save notification preferences:', error)
    } else {
      toast.success('Notification preferences saved')
      onClose()
    }

    setSaving(false)
  }

  const updatePreference = (key: keyof NotificationPreferences, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-600">Loading preferences...</p>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-x-4 top-20 z-50 mx-auto max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-lg"
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        padding: '24px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }}
      role="dialog"
      aria-label="Notification settings"
      aria-modal="true"
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2
          className="text-xl font-semibold text-gray-900"
          style={{ fontSize: '20px', fontWeight: 600, color: '#111827' }}
        >
          Notification Settings
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
          style={{ width: '32px', height: '32px' }}
          aria-label="Close settings"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Settings Content */}
      <div className="space-y-6">
        {/* Email Preferences */}
        <div>
          <h3
            className="mb-4 text-base font-semibold text-gray-900"
            style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}
          >
            Email Preferences
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-enabled" className="text-sm text-gray-700">
                Enable email notifications
              </Label>
              <Switch
                id="email-enabled"
                checked={preferences.email_enabled}
                onCheckedChange={(checked) => updatePreference('email_enabled', checked)}
              />
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div>
          <h3
            className="mb-4 text-base font-semibold text-gray-900"
            style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}
          >
            Notification Preferences
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="submission-updates" className="text-sm text-gray-700">
                Submission updates
              </Label>
              <Switch
                id="submission-updates"
                checked={preferences.submission_updates}
                onCheckedChange={(checked) => updatePreference('submission_updates', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="compliance-alerts" className="text-sm text-gray-700">
                Compliance alerts
              </Label>
              <Switch
                id="compliance-alerts"
                checked={preferences.compliance_alerts}
                onCheckedChange={(checked) => updatePreference('compliance_alerts', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="enforcement-actions" className="text-sm text-gray-700">
                Enforcement actions
              </Label>
              <Switch
                id="enforcement-actions"
                checked={preferences.enforcement_actions}
                onCheckedChange={(checked) => updatePreference('enforcement_actions', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="system-announcements" className="text-sm text-gray-700">
                System announcements
              </Label>
              <Switch
                id="system-announcements"
                checked={preferences.system_announcements}
                onCheckedChange={(checked) => updatePreference('system_announcements', checked)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  )
}
