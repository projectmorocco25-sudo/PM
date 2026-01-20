/**
 * Wireframe: task-0.5.1.13-forgot-reset-password.md
 * Route: /auth/reset-password
 * Implements: Reset password page
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/00-core-foundation/authentication/task-0.5.1.13-forgot-reset-password.md
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Eye, EyeOff, Check, X } from 'lucide-react'

interface PasswordRequirements {
  minLength: boolean
  uppercase: boolean
  lowercase: boolean
  number: boolean
  special: boolean
}

function checkPasswordRequirements(password: string): PasswordRequirements {
  return {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  }
}

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
      const supabase = createClient()

  useEffect(() => {
    // Check for access_token in URL on component mount
    const accessToken = searchParams.get('access_token')
    if (!accessToken) {
      setError('Invalid or missing reset token.')
    }
  }, [searchParams])

  const passwordRequirements = checkPasswordRequirements(password)
  const allRequirementsMet = Object.values(passwordRequirements).every(Boolean)
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  const isFormValid = allRequirementsMet && passwordsMatch

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage('Your password has been reset successfully. You can now log in.')
      setTimeout(() => router.push('/auth/login'), 3000) // Redirect to login after 3 seconds
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      {/* Back Button - Top-left, navigate to /login */}
      <Link
        href="/auth/login"
        className="absolute left-6 top-6 flex items-center text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
        style={{ top: '24px', left: '24px' }}
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Login
      </Link>

      <div className="w-full max-w-lg space-y-8">
        {/* MOH Logo - Centered, top of page */}
        <div className="flex justify-center" style={{ paddingTop: '80px' }}>
          <Image
            src="/moh-logo.svg"
            alt="MOH Logo"
            width={120}
            height={40}
            className="h-auto w-auto"
            priority
          />
        </div>

        {/* Form Container - Max-width 480px (wider for password requirements), centered */}
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-md" style={{ maxWidth: '480px', margin: '0 auto' }}>
          {/* Form Title - "Reset Password", 24px, font-weight: 600 */}
          <h2 className="text-center text-2xl font-semibold text-gray-900" style={{ fontSize: '24px' }}>
            Reset Password
          </h2>

          {/* Instructions Text - "Enter your new password below.", 16px, #4b5563, 16px below title, 24px above form */}
          <p className="mt-4 text-center" style={{ fontSize: '16px', color: '#4b5563', marginTop: '16px' }}>
            Enter your new password below.
          </p>

          <form className="mt-6 space-y-6" onSubmit={handleResetPassword} style={{ marginTop: '24px' }}>
            {error && (
              <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-md bg-green-50 p-4 text-sm text-green-600">
                {message}
              </div>
            )}

            <div className="space-y-6">
              {/* New Password Input with Show/Hide Toggle */}
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-900">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1">
                  <input
                    id="new-password"
                    name="new-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block h-10 w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter your new password"
                    style={{ height: '40px', paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input with Show/Hide Toggle */}
              <div>
                <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-900">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1">
                  <input
                    id="confirm-new-password"
                    name="confirm-new-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block h-10 w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    placeholder="Confirm your new password"
                    style={{ height: '40px', paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
                )}
              </div>

              {/* Password Requirements Display - Same as registration page */}
              <div className="rounded-md border border-gray-200 bg-gray-50 p-3" style={{ backgroundColor: '#f9fafb', padding: '12px' }}>
                <p className="mb-2 text-sm font-medium text-gray-700">Password Requirements:</p>
                <ul className="space-y-1 text-sm" style={{ color: '#4b5563', fontSize: '14px' }}>
                  <li className="flex items-center gap-2">
                    {passwordRequirements.minLength ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-gray-400" />
                    )}
                    <span>At least 8 characters</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {passwordRequirements.uppercase ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-gray-400" />
                    )}
                    <span>One uppercase letter</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {passwordRequirements.lowercase ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-gray-400" />
                    )}
                    <span>One lowercase letter</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {passwordRequirements.number ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-gray-400" />
                    )}
                    <span>One number</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {passwordRequirements.special ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-gray-400" />
                    )}
                    <span>One special character</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Reset Password Button - Full width, 40px height, disabled until requirements met */}
            <div>
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400 sm:text-sm"
                style={{ height: '40px' }}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
