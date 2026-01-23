/**
 * Wireframe: task-0.5.1.22-profile-page.md
 * Route: /profile
 * Implements: User profile page with user information, password change, preferences, and account actions.
 * Wireframe Link: ../../../../04-design/user-experience/wireframes/00-core-foundation/dashboard/task-0.5.1.22-profile-page.md
 */
'use client';

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUserPermissions } from '@/lib/hooks/use-user-permissions';
import { createClient } from '@/lib/supabase/client';
import { Eye, EyeOff, Loader2, Upload, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  { label: 'At least 8 characters', test: (pwd) => pwd.length >= 8 },
  { label: 'One uppercase letter', test: (pwd) => /[A-Z]/.test(pwd) },
  { label: 'One lowercase letter', test: (pwd) => /[a-z]/.test(pwd) },
  { label: 'One number', test: (pwd) => /[0-9]/.test(pwd) },
  { label: 'One special character', test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
];

export default function ProfilePage() {
  const { user, isLoading: isLoadingPermissions } = useUserPermissions();
  const supabase = createClient();

  // User Information State
  const [fullName, setFullName] = useState(user?.email?.split('@')[0] || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Preferences State
  const [language, setLanguage] = useState(user?.language || 'en');
  const [timezone, setTimezone] = useState(user?.timezone || 'UTC+01:00');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [submissionStatusUpdates, setSubmissionStatusUpdates] = useState(true);
  const [complianceAlerts, setComplianceAlerts] = useState(true);
  const [enforcementActions, setEnforcementActions] = useState(false);
  const [systemAnnouncements, setSystemAnnouncements] = useState(true);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);

  const validatePassword = (pwd: string): boolean => {
    return passwordRequirements.every((req) => req.test(pwd));
  };

  const passwordsMatch = newPassword === confirmPassword && newPassword.length > 0;
  const isPasswordFormValid = validatePassword(newPassword) && passwordsMatch && currentPassword.length > 0;

  const handleSaveProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSavingProfile(true);

    try {
      // Call shared_update_user_profile() RPC function
      const { error } = await supabase.rpc('shared_update_user_profile', {
        p_full_name: fullName,
      });

      if (error) throw error;

      // Show success message (TODO: Add toast notification)
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdatingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      alert('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password. Please try again.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSavePreferences = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSavingPreferences(true);

    try {
      const notificationPreferences = {
        email: emailNotifications,
        submission_status_updates: submissionStatusUpdates,
        compliance_alerts: complianceAlerts,
        enforcement_actions: enforcementActions,
        system_announcements: systemAnnouncements,
      };

      // Call shared_update_user_preferences() RPC function
      const { error } = await supabase.rpc('shared_update_user_preferences', {
        p_timezone: timezone,
        p_language: language,
        p_notification_preferences: notificationPreferences,
      });

      if (error) throw error;

      alert('Preferences updated successfully');
    } catch (error) {
      console.error('Error updating preferences:', error);
      alert('Failed to update preferences. Please try again.');
    } finally {
      setIsSavingPreferences(false);
    }
  };

  if (isLoadingPermissions) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="text-text-secondary">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-6 py-12">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-text-secondary">
        <Link href="/dashboard" className="hover:text-text-primary transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-text-primary">Profile</span>
      </nav>

      {/* Page Title */}
      <h1 className="mb-12 text-4xl font-bold text-text-primary">Profile</h1>

      {/* User Information Section */}
      <div className="mb-8 rounded-lg border border-default bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-6">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-500 text-2xl font-semibold text-white">
              {user?.avatar_url ? (
                <Image src={user.avatar_url} alt="Avatar" width={96} height={96} className="rounded-full object-cover" />
              ) : (
                user?.email?.[0]?.toUpperCase() || 'U'
              )}
            </div>
            <button className="absolute bottom-0 right-0 rounded-full bg-primary-500 p-2 text-white hover:bg-primary-600">
              <Upload className="h-4 w-4" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          <h2 className="text-2xl font-semibold text-text-primary">User Information</h2>

          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-text-primary">
              Name <span className="text-error-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={isSavingProfile}
              className={cn(
                'h-10 w-full rounded-md border border-default bg-white px-3 py-2 text-base text-text-primary',
                'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
                'disabled:cursor-not-allowed disabled:bg-bg-secondary disabled:opacity-50'
              )}
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-text-primary">
              Email <span className="text-error-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={user?.email || ''}
              disabled
              className="h-10 w-full rounded-md border border-default bg-bg-secondary px-3 py-2 text-base text-text-secondary"
            />
          </div>

          <div>
            <label htmlFor="company" className="mb-2 block text-sm font-medium text-text-primary">
              Company
            </label>
            <input
              id="company"
              type="text"
              value="Company XYZ (Read-only)"
              disabled
              className="h-10 w-full rounded-md border border-default bg-bg-secondary px-3 py-2 text-base text-text-secondary"
            />
          </div>

          <div>
            <label htmlFor="role" className="mb-2 block text-sm font-medium text-text-primary">
              Role
            </label>
            <input
              id="role"
              type="text"
              value={`${user?.role || 'User'} (Read-only)`}
              disabled
              className="h-10 w-full rounded-md border border-default bg-bg-secondary px-3 py-2 text-base text-text-secondary"
            />
          </div>

          <button
            type="submit"
            disabled={isSavingProfile}
            className={cn(
              'h-10 rounded-md bg-primary-500 px-6 font-medium text-white transition-colors',
              'hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
              'disabled:cursor-not-allowed disabled:bg-gray-400',
              isSavingProfile && 'cursor-wait'
            )}
          >
            {isSavingProfile ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </span>
            ) : (
              'Save Changes'
            )}
          </button>
        </form>
      </div>

      {/* Change Password Section */}
      <div className="mb-8 rounded-lg border border-default bg-white p-8 shadow-sm">
        <form onSubmit={handleUpdatePassword} className="space-y-6">
          <h2 className="text-2xl font-semibold text-text-primary">Change Password</h2>

          <div>
            <label htmlFor="current-password" className="mb-2 block text-sm font-medium text-text-primary">
              Current Password <span className="text-error-500">*</span>
            </label>
            <div className="relative">
              <input
                id="current-password"
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                disabled={isUpdatingPassword}
                className={cn(
                  'h-10 w-full rounded-md border border-default bg-white px-3 py-2 pr-10 text-base text-text-primary',
                  'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
                  'disabled:cursor-not-allowed disabled:bg-bg-secondary disabled:opacity-50'
                )}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
              >
                {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="new-password" className="mb-2 block text-sm font-medium text-text-primary">
              New Password <span className="text-error-500">*</span>
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isUpdatingPassword}
                className={cn(
                  'h-10 w-full rounded-md border border-default bg-white px-3 py-2 pr-10 text-base text-text-primary',
                  'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
                  'disabled:cursor-not-allowed disabled:bg-bg-secondary disabled:opacity-50'
                )}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
              >
                {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium text-text-primary">
              Confirm New Password <span className="text-error-500">*</span>
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isUpdatingPassword}
                className={cn(
                  'h-10 w-full rounded-md border border-default bg-white px-3 py-2 pr-10 text-base text-text-primary',
                  'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
                  'disabled:cursor-not-allowed disabled:bg-bg-secondary disabled:opacity-50',
                  !passwordsMatch && confirmPassword.length > 0 && 'border-error-500'
                )}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {!passwordsMatch && confirmPassword.length > 0 && (
              <p className="mt-1 text-sm text-error-500">Passwords do not match</p>
            )}
          </div>

          {/* Password Requirements */}
          <div className="rounded-md border border-default bg-bg-secondary p-3">
            <p className="mb-2 text-sm font-medium text-text-primary">Password Requirements:</p>
            <ul className="space-y-1 text-sm text-text-secondary">
              {passwordRequirements.map((req, index) => {
                const isValid = req.test(newPassword);
                return (
                  <li key={index} className="flex items-center gap-2">
                    {isValid ? <Check className="h-4 w-4 text-success-500" /> : <X className="h-4 w-4 text-error-500" />}
                    <span className={isValid ? 'text-success-700' : 'text-text-secondary'}>{req.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <button
            type="submit"
            disabled={isUpdatingPassword || !isPasswordFormValid}
            className={cn(
              'h-10 rounded-md bg-primary-500 px-6 font-medium text-white transition-colors',
              'hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
              'disabled:cursor-not-allowed disabled:bg-gray-400',
              isUpdatingPassword && 'cursor-wait'
            )}
          >
            {isUpdatingPassword ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating...
              </span>
            ) : (
              'Update Password'
            )}
          </button>
        </form>
      </div>

      {/* Preferences Section */}
      <div className="mb-8 rounded-lg border border-default bg-white p-8 shadow-sm">
        <form onSubmit={handleSavePreferences} className="space-y-6">
          <h2 className="text-2xl font-semibold text-text-primary">Preferences</h2>

          <div>
            <label htmlFor="language" className="mb-2 block text-sm font-medium text-text-primary">
              Language
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={isSavingPreferences}
              className={cn(
                'h-10 w-full rounded-md border border-default bg-white px-3 py-2 text-base text-text-primary',
                'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
                'disabled:cursor-not-allowed disabled:bg-bg-secondary disabled:opacity-50'
              )}
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
            </select>
          </div>

          <div>
            <label htmlFor="timezone" className="mb-2 block text-sm font-medium text-text-primary">
              Timezone
            </label>
            <select
              id="timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              disabled={isSavingPreferences}
              className={cn(
                'h-10 w-full rounded-md border border-default bg-white px-3 py-2 text-base text-text-primary',
                'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
                'disabled:cursor-not-allowed disabled:bg-bg-secondary disabled:opacity-50'
              )}
            >
              <option value="UTC+01:00">UTC+01:00 (Algiers)</option>
              <option value="UTC+00:00">UTC+00:00 (GMT)</option>
              <option value="UTC+02:00">UTC+02:00</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">Email Notifications</label>
            <div className="flex items-center">
              <input
                id="email-notifications"
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                disabled={isSavingPreferences}
                className="h-4 w-4 rounded border-default text-primary-600 focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <label htmlFor="email-notifications" className="ml-2 text-sm text-text-primary">
                Receive email notifications
              </label>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">Notification Preferences</label>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  id="submission-status"
                  type="checkbox"
                  checked={submissionStatusUpdates}
                  onChange={(e) => setSubmissionStatusUpdates(e.target.checked)}
                  disabled={isSavingPreferences}
                  className="h-4 w-4 rounded border-default text-primary-600 focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <label htmlFor="submission-status" className="ml-2 text-sm text-text-primary">
                  Submission status updates
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="compliance-alerts"
                  type="checkbox"
                  checked={complianceAlerts}
                  onChange={(e) => setComplianceAlerts(e.target.checked)}
                  disabled={isSavingPreferences}
                  className="h-4 w-4 rounded border-default text-primary-600 focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <label htmlFor="compliance-alerts" className="ml-2 text-sm text-text-primary">
                  Compliance alerts
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="enforcement-actions"
                  type="checkbox"
                  checked={enforcementActions}
                  onChange={(e) => setEnforcementActions(e.target.checked)}
                  disabled={isSavingPreferences}
                  className="h-4 w-4 rounded border-default text-primary-600 focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <label htmlFor="enforcement-actions" className="ml-2 text-sm text-text-primary">
                  Enforcement actions
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="system-announcements"
                  type="checkbox"
                  checked={systemAnnouncements}
                  onChange={(e) => setSystemAnnouncements(e.target.checked)}
                  disabled={isSavingPreferences}
                  className="h-4 w-4 rounded border-default text-primary-600 focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <label htmlFor="system-announcements" className="ml-2 text-sm text-text-primary">
                  System announcements
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSavingPreferences}
            className={cn(
              'h-10 rounded-md bg-primary-500 px-6 font-medium text-white transition-colors',
              'hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
              'disabled:cursor-not-allowed disabled:bg-gray-400',
              isSavingPreferences && 'cursor-wait'
            )}
          >
            {isSavingPreferences ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </span>
            ) : (
              'Save Preferences'
            )}
          </button>
        </form>
      </div>

      {/* Account Actions Section */}
      <div className="rounded-lg border border-default bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-2xl font-semibold text-text-primary">Account Actions</h2>
        <div className="space-y-4">
          <button
            type="button"
            className="h-10 rounded-md border border-default bg-white px-6 font-medium text-text-primary transition-colors hover:bg-bg-secondary"
          >
            Export My Data
          </button>
          <button
            type="button"
            className="h-10 rounded-md border border-error-500 bg-white px-6 font-medium text-error-500 transition-colors hover:bg-error-50"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
