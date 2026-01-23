/**
 * Wireframe: task-0.5.1.13-forgot-reset-password.md
 * Route: /forgot-password
 * Implements: Forgot password page with email input and success state.
 * Wireframe Link: ../../../../04-design/user-experience/wireframes/00-core-foundation/authentication/task-0.5.1.13-forgot-reset-password.md
 */
'use client';

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils/cn';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        setError(resetError.message || 'Failed to send reset link. Please try again.');
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
      setIsLoading(false);
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link
          href="/login"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Back to login"
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

        {/* Success Container */}
        <div className="rounded-lg border-2 border-success-500 bg-white p-8 shadow-sm">
          {/* Success Icon */}
          <div className="mb-4 flex justify-center">
            <CheckCircle className="h-12 w-12 text-success-500" aria-hidden="true" />
          </div>

          {/* Success Title */}
          <h2 className="mb-4 text-center text-2xl font-semibold text-text-primary">Email Sent</h2>

          {/* Success Message */}
          <p className="mb-4 text-center text-base leading-relaxed text-text-secondary">
            We&apos;ve sent a password reset link to your email address. Please check your inbox and follow the
            instructions.
          </p>

          {/* Additional Instructions */}
          <p className="mb-6 text-center text-sm italic text-text-tertiary">
            If you don&apos;t receive the email within a few minutes, please check your spam folder or try again.
          </p>

          {/* Data Protection Notice */}
          <div className="mb-6 rounded-md bg-bg-secondary p-3 text-xs text-text-secondary">
            <p>
              <strong>Data Protection:</strong> Password reset requests are processed per Law No. 09-08 (CNDP) data
              protection requirements.
            </p>
          </div>

          {/* Back to Login Button */}
          <Link
            href="/login"
            className={cn(
              'block h-10 w-full rounded-md bg-primary-500 text-center font-medium text-white transition-colors',
              'hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0'
            )}
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      {/* Back Button */}
      <Link
        href="/login"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
        aria-label="Back to login"
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

      {/* Forgot Password Form Container */}
      <div className="rounded-lg border border-default bg-white p-8 shadow-sm">
        {/* Form Title */}
        <h2 className="mb-4 text-2xl font-semibold text-text-primary">Forgot Password?</h2>

        {/* Instructions Text */}
        <p className="mb-6 text-base text-text-secondary">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-md border border-error-500 bg-error-50 p-3 text-sm text-error-700" role="alert">
            {error}
          </div>
        )}

        {/* Forgot Password Form */}
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

          {/* Send Reset Link Button */}
          <button
            type="submit"
            disabled={isLoading || !email}
            className={cn(
              'h-10 w-full rounded-md bg-primary-500 font-medium text-white transition-colors',
              'hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
              'disabled:cursor-not-allowed disabled:bg-gray-400',
              isLoading && 'cursor-wait'
            )}
            aria-label="Send reset link"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </span>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-text-secondary">
            Remember your password?{' '}
            <Link href="/login" className="font-medium text-primary-600 hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
