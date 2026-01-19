/**
 * Wireframe: task-0.5.1.11-login-page.md
 * Route: /auth/login
 * Implements: Login page for all users
 * Wireframe Link: ../../../../docs/04-design/user-experience/wireframes/00-core-foundation/authentication/task-0.5.1.11-login-page.md
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createBrowserClient } from '@/lib/supabase'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createBrowserClient()
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        return
      }

      if (data.user) {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login')
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

      <div className="w-full max-w-md space-y-8">
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

        {/* Login Form Container - Max-width 400px, centered, white background, border, shadow, 32px padding */}
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-md">
          {/* Form Title - "Login to PM", 24px, font-weight: 600, 24px below logo, 32px above fields */}
          <h2 className="text-center text-2xl font-semibold text-gray-900" style={{ fontSize: '24px' }}>
            Login to PM
          </h2>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit} style={{ marginTop: '32px' }}>
            {/* Error Message */}
            {error && (
              <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-6">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  placeholder="your.email@example.com"
                  style={{ height: '40px' }}
                />
              </div>

              {/* Password Input Field with Show/Hide Toggle */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
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
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember Me Checkbox - 16px below password field */}
            <div className="flex items-center" style={{ marginTop: '16px' }}>
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            {/* Login Button - Full width, 40px height, 24px below checkbox */}
            <div style={{ marginTop: '24px' }}>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400 sm:text-sm"
                style={{ height: '40px' }}
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </div>

            {/* Footer Links - Centered, "Forgot password?" 16px below button, "Register account" 8px below that */}
            <div className="text-center" style={{ marginTop: '16px' }}>
              <div className="text-sm">
                <Link
                  href="/auth/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="mt-2 text-sm" style={{ marginTop: '8px' }}>
                <Link
                  href="/auth/register"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Register account
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
