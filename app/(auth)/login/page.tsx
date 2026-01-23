/**
 * Wireframe: task-0.5.1.11-login-page.md
 * Route: /login
 * Implements: Login page with email, password, remember me, and navigation links.
 * Wireframe Link: ../../../../04-design/user-experience/wireframes/00-core-foundation/authentication/task-0.5.1.11-login-page.md
 */
'use client';

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils/cn';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message || 'Invalid email or password');
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Redirect to dashboard
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Back Button */}
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
        aria-label="Back to homepage"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </Link>

      {/* MOH Logo */}
      <div className="mb-8 flex justify-center">
        <Image
          src="/moh-logo.svg"
          alt="MOH Logo"
          width={120}
          height={120}
          className="h-auto w-auto object-contain"
          priority
        />
      </div>

      {/* Login Form Container */}
      <div className="rounded-lg border border-default bg-white p-8 shadow-sm">
        {/* Form Title */}
        <h2 className="mb-8 text-2xl font-semibold text-text-primary">Login to PM</h2>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-md border border-error-500 bg-error-50 p-3 text-sm text-error-700" role="alert">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-text-primary">
              Email <span className="text-error-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
              disabled={isLoading}
              className={cn(
                'h-10 w-full rounded-md border border-default bg-white px-3 py-2 text-base text-text-primary placeholder:text-text-tertiary',
                'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
                'disabled:cursor-not-allowed disabled:bg-bg-secondary disabled:opacity-50',
                error && 'border-error-500'
              )}
              aria-required="true"
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? 'email-error' : undefined}
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-text-primary">
              Password <span className="text-error-500">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isLoading}
                className={cn(
                  'h-10 w-full rounded-md border border-default bg-white px-3 py-2 pr-10 text-base text-text-primary placeholder:text-text-tertiary',
                  'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
                  'disabled:cursor-not-allowed disabled:bg-bg-secondary disabled:opacity-50',
                  error && 'border-error-500'
                )}
                aria-required="true"
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? 'password-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
              className="h-4 w-4 rounded border-default text-primary-600 focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <label htmlFor="remember-me" className="ml-2 text-sm text-text-primary">
              Remember me
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className={cn(
              'h-10 w-full rounded-md bg-primary-500 font-medium text-white transition-colors',
              'hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
              'disabled:cursor-not-allowed disabled:bg-gray-400',
              isLoading && 'cursor-wait'
            )}
            aria-label="Log in"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Logging in...
              </span>
            ) : (
              'Log In'
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 space-y-2 text-center">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-primary-600 hover:underline"
          >
            Forgot password?
          </Link>
          <div>
            <Link
              href="/register"
              className="text-sm font-medium text-primary-600 hover:underline"
            >
              Register account
            </Link>
          </div>
        </div>

        {/* Data Protection Notice */}
        <div className="mt-6 rounded-md bg-bg-secondary p-3 text-xs text-text-secondary">
          <p>
            <strong>Data Protection:</strong> Your login data is protected per Law No. 09-08 (CNDP).
          </p>
        </div>
      </div>
    </div>
  );
}
