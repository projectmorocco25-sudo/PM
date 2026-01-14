'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { User, Mail, Phone, Globe, Bell, Save, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/providers/auth-provider'
import { createBrowserClient } from '@supabase/ssr'
import { userProfileSchema, type UserProfileFormData } from '@/lib/validations'
import { toast } from 'sonner'

// Create an untyped client for flexible queries
function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-key'
  return createBrowserClient(url, key)
}

// Task 1.1.1.20d: User profile page

const timezones = [
  { value: 'Africa/Casablanca', label: 'Morocco (UTC+1)' },
  { value: 'Europe/London', label: 'London (UTC+0/+1)' },
  { value: 'Europe/Paris', label: 'Paris (UTC+1/+2)' },
  { value: 'America/New_York', label: 'New York (UTC-5/-4)' },
  { value: 'Asia/Dubai', label: 'Dubai (UTC+4)' },
]

const languages = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'ar', label: 'العربية' },
]

export default function ProfilePage() {
  const { user, profile } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      fullName: profile?.full_name || '',
      email: user?.email || '',
      phone: '',
      timezone: profile?.timezone || 'Africa/Casablanca',
      language: profile?.language || 'en',
      notificationPreferences: {
        email: true,
        inApp: true,
        digest: false,
      },
    },
  })

  const notificationPrefs = watch('notificationPreferences')

  const onSubmit = async (data: UserProfileFormData) => {
    setIsLoading(true)

    try {
      const supabase = getClient()
      
      // Update user profile in database
      const { error } = await supabase
        .from('users')
        .update({
          full_name: data.fullName,
          timezone: data.timezone,
          language: data.language,
          notification_preferences: data.notificationPreferences,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id ?? '')

      if (error) {
        toast.error('Failed to update profile: ' + error.message)
        return
      }

      toast.success('Profile updated successfully')
    } catch {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async () => {
    setIsPasswordLoading(true)

    try {
      const supabase = getClient()
      const { error } = await supabase.auth.resetPasswordForEmail(user?.email || '', {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success('Password reset email sent. Check your inbox.')
    } catch {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsPasswordLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="text-2xl">
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/jpeg,image/png,image/gif"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      
                      if (file.size > 2 * 1024 * 1024) {
                        toast.error('File size must be less than 2MB')
                        return
                      }
                      
                      try {
                        const supabase = getClient()
                        const fileExt = file.name.split('.').pop()
                        const fileName = `${user?.id}-${Date.now()}.${fileExt}`
                        
                        // Upload to storage
                        const { error: uploadError } = await supabase.storage
                          .from('avatars')
                          .upload(fileName, file, { upsert: true })
                        
                        if (uploadError) {
                          toast.error('Failed to upload avatar')
                          return
                        }
                        
                        // Get public URL
                        const { data: { publicUrl } } = supabase.storage
                          .from('avatars')
                          .getPublicUrl(fileName)
                        
                        // Update user profile
                        const { error: updateError } = await supabase
                          .from('users')
                          .update({ avatar_url: publicUrl })
                          .eq('id', user?.id ?? '')
                        
                        if (updateError) {
                          toast.error('Failed to update profile')
                          return
                        }
                        
                        toast.success('Avatar updated successfully')
                        window.location.reload()
                      } catch {
                        toast.error('An error occurred')
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Change Avatar
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG or GIF. Max 2MB.
                  </p>
                </div>
              </div>

              <Separator />

              {/* Personal Info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      {...register('fullName')}
                      className="pl-9"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-sm text-destructive">{errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      {...register('email')}
                      className="pl-9"
                      disabled
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      {...register('phone')}
                      placeholder="+212 XXX XXX XXX"
                      className="pl-9"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={watch('timezone')}
                    onValueChange={(value) => setValue('timezone', value, { shouldDirty: true })}
                  >
                    <SelectTrigger>
                      <Globe className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={watch('language')}
                    onValueChange={(value) => setValue('language', value, { shouldDirty: true })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading || !isDirty}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Role</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {profile?.role?.replace(/_/g, ' ') || 'User'}
                </p>
              </div>
              {profile?.company_id && (
                <div>
                  <p className="text-sm font-medium">Company</p>
                  <p className="text-sm text-muted-foreground">
                    {profile?.company_id}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium">Member Since</p>
                <p className="text-sm text-muted-foreground">
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString()
                    : 'Unknown'}
                </p>
              </div>
              <Separator />
              <Button
                variant="outline"
                className="w-full"
                onClick={handlePasswordReset}
                disabled={isPasswordLoading}
              >
                {isPasswordLoading ? 'Sending...' : 'Change Password'}
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Email Notifications</p>
                  <p className="text-xs text-muted-foreground">
                    Receive email alerts
                  </p>
                </div>
                <Switch
                  checked={notificationPrefs?.email}
                  onCheckedChange={(checked) =>
                    setValue('notificationPreferences.email', checked, { shouldDirty: true })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">In-App Notifications</p>
                  <p className="text-xs text-muted-foreground">
                    Show in notification center
                  </p>
                </div>
                <Switch
                  checked={notificationPrefs?.inApp}
                  onCheckedChange={(checked) =>
                    setValue('notificationPreferences.inApp', checked, { shouldDirty: true })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Daily Digest</p>
                  <p className="text-xs text-muted-foreground">
                    Daily summary email
                  </p>
                </div>
                <Switch
                  checked={notificationPrefs?.digest}
                  onCheckedChange={(checked) =>
                    setValue('notificationPreferences.digest', checked, { shouldDirty: true })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
