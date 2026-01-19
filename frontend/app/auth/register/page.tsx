/**
 * Wireframe: task-0.5.1.12-registration-page.md
 * Route: /auth/register
 * Implements: User registration page
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/00-core-foundation/authentication/task-0.5.1.12-registration-page.md
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createBrowserClient } from '@/lib/supabase'
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

export default function RegisterPage() {
  const router = useRouter()
  const [companyName, setCompanyName] = useState('')
  const [companyEmail, setCompanyEmail] = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const passwordRequirements = checkPasswordRequirements(password)
  const allRequirementsMet = Object.values(passwordRequirements).every(Boolean)
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  const isFormValid = companyName && companyEmail && contactPerson && allRequirementsMet && passwordsMatch && termsAccepted

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!isFormValid) {
      setError('Please fill in all required fields and meet password requirements')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const supabase = createBrowserClient()
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: companyEmail,
        password,
        options: {
          data: {
            company_name: companyName,
            contact_person: contactPerson,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      if (data.user) {
        router.push('/auth/login?registered=true')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      {/* Back Button - Top-left, 24px from top and left */}
      <Link
        href="/"
        className="absolute left-6 top-6 flex items-center text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
        style={{ top: '24px', left: '24px' }}
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back
      </Link>

      <div className="w-full max-w-lg space-y-8">
        {/* MOH Logo - Centered, ~80px from top, ~120px width */}
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

        {/* Registration Form Container - Max-width 480px, centered, white background, border, shadow, 32px padding */}
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-md" style={{ maxWidth: '480px', margin: '0 auto' }}>
          {/* Form Title - "Create Account", 24px, font-weight: 600, 24px below logo, 32px above fields */}
          <h2 className="text-center text-2xl font-semibold text-gray-900" style={{ fontSize: '24px' }}>
            Create Account
          </h2>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit} style={{ marginTop: '32px' }}>
            {/* Error Message */}
            {error && (
              <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Company Name Input */}
              <div>
                <label htmlFor="company-name" className="block text-sm font-medium text-gray-900">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="company-name"
                  name="company-name"
                  type="text"
                  autoComplete="organization"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="mt-1 block h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter your company name"
                  style={{ height: '40px' }}
                />
              </div>

              {/* Company Email Input */}
              <div>
                <label htmlFor="company-email" className="block text-sm font-medium text-gray-900">
                  Company Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="company-email"
                  name="company-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  className="mt-1 block h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  placeholder="your.company@example.com"
                  style={{ height: '40px' }}
                />
              </div>

              {/* Contact Person Input */}
              <div>
                <label htmlFor="contact-person" className="block text-sm font-medium text-gray-900">
                  Contact Person <span className="text-red-500">*</span>
                </label>
                <input
                  id="contact-person"
                  name="contact-person"
                  type="text"
                  autoComplete="name"
                  required
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="mt-1 block h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  placeholder="Full name"
                  style={{ height: '40px' }}
                />
              </div>

              {/* Password Input with Show/Hide Toggle */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block h-10 w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter your password"
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
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-900">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1">
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block h-10 w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    placeholder="Confirm your password"
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

              {/* Password Requirements Display - Background #f9fafb, border, padding 12px, 14px typography */}
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

            {/* Terms Acceptance Checkbox - 24px below password fields */}
            <div style={{ marginTop: '24px' }}>
              <label className="flex items-start gap-2">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  required
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-900" style={{ fontSize: '14px' }}>
                  I agree to the{' '}
                  <Link href="/terms" className="font-medium text-blue-600 hover:text-blue-500">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="font-medium text-blue-600 hover:text-blue-500">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            {/* Register Button - Full width, 40px height, 24px below checkbox, disabled until valid */}
            <div style={{ marginTop: '24px' }}>
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400 sm:text-sm"
                style={{ height: '40px' }}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>

            {/* Footer Link - Centered, 16px below register button */}
            <div className="text-center text-sm" style={{ marginTop: '16px' }}>
              <span className="text-gray-600">Already have an account? </span>
              <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
                Log In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
