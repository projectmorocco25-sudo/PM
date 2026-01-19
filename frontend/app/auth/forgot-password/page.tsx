/**
 * Wireframe: task-0.5.1.13-forgot-reset-password.md
 * Route: /auth/forgot-password
 * Implements: Forgot password page
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/00-core-foundation/authentication/task-0.5.1.13-forgot-reset-password.md
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createBrowserClient } from '@/lib/supabase'
import { ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createBrowserClient()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/reset-password`,
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage('Password reset email sent. Please check your inbox.')
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

      <div className="w-full max-w-md space-y-8">
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

        {/* Form Container - Max-width 400px, centered */}
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-md">
          {/* Form Title - "Forgot Password?", 24px, font-weight: 600 */}
          <h2 className="text-center text-2xl font-semibold text-gray-900" style={{ fontSize: '24px' }}>
            Forgot Password?
          </h2>

          {/* Instructions Text - 16px, #4b5563, 16px below title, 24px above form */}
          <p className="mt-4 text-center" style={{ fontSize: '16px', color: '#4b5563', marginTop: '16px' }}>
            Enter your email address and we'll send you a link to reset your password.
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

            {/* Email Input Field */}
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-900">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ height: '40px' }}
              />
            </div>

            {/* Send Reset Link Button - Full width, 40px height */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400 sm:text-sm"
                style={{ height: '40px' }}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>

            {/* Footer Link - "Remember your password? [Log In]" */}
            <div className="text-center text-sm" style={{ color: '#6b7280', fontSize: '14px' }}>
              <span>Remember your password? </span>
              <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500" style={{ color: '#2563eb' }}>
                Log In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
