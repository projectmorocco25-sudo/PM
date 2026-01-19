/**
 * Wireframe: task-0.5.1.22-profile-page.md
 * Route: /profile
 * Implements: User profile page (user information, account settings, preferences)
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/00-core-foundation/dashboard/task-0.5.1.22-profile-page.md
 */

'use client'

import { useState } from 'react'
import { MainContent } from '@/components/layout/main-content'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { User, Eye, EyeOff, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ProfilePage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe', // TODO: Fetch from Supabase
    email: 'john.doe@company.com', // TODO: Fetch from Supabase
    company: 'Company XYZ', // TODO: Fetch from Supabase
    role: 'Company User', // TODO: Fetch from useUserRole
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'UTC+01:00',
    emailNotifications: true,
    submissionUpdates: true,
    complianceAlerts: true,
    enforcementActions: false,
    systemAnnouncements: true,
  })
  
  const handleSaveUserInfo = () => {
    // TODO: Implement save user info to Supabase
    alert('User information saved')
  }
  
  const handleUpdatePassword = () => {
    // TODO: Implement password update via Supabase Auth
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    alert('Password updated')
  }
  
  const handleSavePreferences = () => {
    // TODO: Implement save preferences to Supabase
    alert('Preferences saved')
  }
  
  const handleExportData = () => {
    // TODO: Implement data export (GDPR/CNDP right to data portability)
    alert('Data export initiated')
  }
  
  const handleDeleteAccount = () => {
    // TODO: Implement account deletion with confirmation
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion requested')
    }
  }
  
  return (
    <MainContent
      breadcrumbs={[
        { label: 'Home', href: '/dashboard' },
        { label: 'Profile' },
      ]}
      title="Profile"
    >
      <div className="mx-auto max-w-4xl space-y-6">
        {/* User Information Section */}
        <div
          className="rounded-lg border border-gray-200 bg-white p-8"
          style={{
            maxWidth: '600px',
            padding: '32px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            backgroundColor: '#ffffff',
          }}
        >
          <h2
            className="mb-6 text-2xl font-semibold text-gray-900"
            style={{ fontSize: '24px', fontWeight: 600, color: '#111827', marginBottom: '24px' }}
          >
            User Information
          </h2>
          
          {/* Avatar Section */}
          <div className="mb-6 flex justify-center" style={{ marginBottom: '24px' }}>
            <div className="flex flex-col items-center gap-4">
              <div
                className="flex h-32 w-32 items-center justify-center rounded-full bg-gray-200"
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '9999px',
                  backgroundColor: '#e5e7eb',
                }}
              >
                <User className="h-16 w-16 text-gray-400" />
              </div>
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </div>
          </div>
          
          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900" style={{ fontSize: '14px', fontWeight: 500 }}>
                Name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={userInfo.name}
                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
              />
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900" style={{ fontSize: '14px', fontWeight: 500 }}>
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={userInfo.email}
                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
              />
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900" style={{ fontSize: '14px', fontWeight: 500 }}>
                Company
              </label>
              <Input type="text" value={userInfo.company} disabled />
              <p className="mt-1 text-xs text-gray-500">Read-only</p>
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900" style={{ fontSize: '14px', fontWeight: 500 }}>
                Role
              </label>
              <Input type="text" value={userInfo.role} disabled />
              <p className="mt-1 text-xs text-gray-500">Read-only</p>
            </div>
            
            <Button
              onClick={handleSaveUserInfo}
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
            >
              Save Changes
            </Button>
          </div>
        </div>
        
        {/* Change Password Section */}
        <div
          className="rounded-lg border border-gray-200 bg-white p-8"
          style={{
            maxWidth: '600px',
            padding: '32px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            backgroundColor: '#ffffff',
          }}
        >
          <h2
            className="mb-6 text-2xl font-semibold text-gray-900"
            style={{ fontSize: '24px', fontWeight: 600, color: '#111827', marginBottom: '24px' }}
          >
            Change Password
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900" style={{ fontSize: '14px', fontWeight: 500 }}>
                Current Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900" style={{ fontSize: '14px', fontWeight: 500 }}>
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900" style={{ fontSize: '14px', fontWeight: 500 }}>
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            {/* Password Requirements - Placeholder */}
            <div className="rounded-md bg-gray-50 p-3 text-sm text-gray-600">
              <p className="font-medium mb-2">Password Requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>At least 8 characters</li>
                <li>One uppercase letter</li>
                <li>One lowercase letter</li>
                <li>One number</li>
                <li>One special character</li>
              </ul>
            </div>
            
            <Button
              onClick={handleUpdatePassword}
              disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
            >
              Update Password
            </Button>
          </div>
        </div>
        
        {/* Preferences Section */}
        <div
          className="rounded-lg border border-gray-200 bg-white p-8"
          style={{
            maxWidth: '600px',
            padding: '32px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            backgroundColor: '#ffffff',
          }}
        >
          <h2
            className="mb-6 text-2xl font-semibold text-gray-900"
            style={{ fontSize: '24px', fontWeight: 600, color: '#111827', marginBottom: '24px' }}
          >
            Preferences
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900" style={{ fontSize: '14px', fontWeight: 500 }}>
                Language
              </label>
              <select
                value={preferences.language}
                onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                className="h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                {/* TODO: Add more language options */}
              </select>
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900" style={{ fontSize: '14px', fontWeight: 500 }}>
                Timezone
              </label>
              <select
                value={preferences.timezone}
                onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                className="h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="UTC+01:00">UTC+01:00 (Morocco Standard Time)</option>
                {/* TODO: Add more timezone options */}
              </select>
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900" style={{ fontSize: '14px', fontWeight: 500 }}>
                Email Notifications
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <Checkbox
                  checked={preferences.emailNotifications}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, emailNotifications: checked as boolean })}
                />
                <span>Receive email notifications</span>
              </label>
            </div>
            
            <div>
              <h3
                className="mb-3 text-lg font-semibold text-gray-900"
                style={{ fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '12px' }}
              >
                Notification Preferences
              </h3>
              <div className="space-y-2">
                {[
                  { key: 'submissionUpdates', label: 'Submission status updates' },
                  { key: 'complianceAlerts', label: 'Compliance alerts' },
                  { key: 'enforcementActions', label: 'Enforcement actions' },
                  { key: 'systemAnnouncements', label: 'System announcements' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 text-sm text-gray-700">
                    <Checkbox
                      checked={preferences[key as keyof typeof preferences] as boolean}
                      onCheckedChange={(checked) =>
                        setPreferences({ ...preferences, [key]: checked })
                      }
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <Button
              onClick={handleSavePreferences}
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
            >
              Save Preferences
            </Button>
          </div>
        </div>
        
        {/* Account Actions Section */}
        <div
          className="rounded-lg border border-gray-200 bg-white p-8"
          style={{
            maxWidth: '600px',
            padding: '32px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            backgroundColor: '#ffffff',
          }}
        >
          <h2
            className="mb-6 text-2xl font-semibold text-gray-900"
            style={{ fontSize: '24px', fontWeight: 600, color: '#111827', marginBottom: '24px' }}
          >
            Account Actions
          </h2>
          
          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={handleExportData}
              className="w-full"
            >
              Export My Data
            </Button>
            
            <Button
              variant="outline"
              onClick={handleDeleteAccount}
              className="w-full border-red-300 text-red-600 hover:bg-red-50"
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </MainContent>
  )
}
