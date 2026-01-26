/**
 * Wireframe: task-0.5.1.13-forgot-reset-password.md
 * Route: /reset-password?token=...
 * Implements: Reset password page with new password and confirm password inputs, password requirements, and token validation.
 * Wireframe Link: ../../../../04-design/user-experience/wireframes/00-core-foundation/authentication/task-0.5.1.13-forgot-reset-password.md
 */
'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, EyeOff, Loader2, Check, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
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

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Check if we have a valid session (token is validated by Supabase Auth)
    const checkToken = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsTokenValid(true);
      } else {
        // If no session, check if we have hash parameters (Supabase Auth redirect)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const type = hashParams.get('type');
        
        if (accessToken && type === 'recovery') {
          // Token is in URL hash, session will be created automatically
          setIsTokenValid(true);
        } else {
          setIsTokenValid(false);
          setError('Invalid or expired reset token. Please request a new password reset link.');
        }
      }
    };

    checkToken();
  }, [supabase]);

  const validatePassword = (pwd: string): boolean => {
    return passwordRequirements.every((req) => req.test(pwd));
  };

  const passwordsMatch = newPassword === confirmPassword && newPassword.length > 0;
  const isFormValid = validatePassword(newPassword) && passwordsMatch;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!validatePassword(newPassword)) {
      setError('Password does not meet all requirements');
      setIsLoading(false);
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setError(updateError.message || 'Failed to reset password. Please try again.');
        setIsLoading(false);
        return;
      }

      // Redirect to login with success message
      router.push('/login?passwordReset=true');
      router.refresh();
    } catch (err) {
      console.error('Reset password error:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  if (isTokenValid === null) {
    // Loading state while checking token
    return (
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-default bg-white p-8 shadow-sm">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
          </div>
        </div>
      </div>
    );
  }

  if (isTokenValid === false) {
    // Invalid token state
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

        {/* Error Container */}
        <div className="rounded-lg border border-error-500 bg-error-50 p-8 shadow-sm">
          <h2 className="mb-4 text-2xl font-semibold text-text-primary">Invalid Token</h2>
          <p className="mb-6 text-base text-text-secondary">
            {error || 'The password reset link is invalid or has expired. Please request a new password reset link.'}
          </p>
          <Link
            href="/forgot-password"
            className={cn(
              'block h-10 w-full rounded-md bg-primary-500 text-center font-medium text-white transition-colors',
              'hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0'
            )}
          >
            Request New Reset Link
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

      {/* Reset Password Form Container */}
      <div className="rounded-lg border border-default bg-white p-8 shadow-sm">
        {/* Form Title */}
        <h2 className="mb-4 text-2xl font-semibold text-text-primary">Reset Password</h2>

        {/* Instructions Text */}
        <p className="mb-6 text-base text-text-secondary">Enter your new password below.</p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-md border border-error-500 bg-error-50 p-3 text-sm text-error-700" role="alert">
            {error}
          </div>
        )}

        {/* Reset Password Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password Input */}
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
                placeholder="Enter your new password"
                required
                disabled={isLoading}
                className={cn(
                  'h-10 w-full rounded-md border border-default bg-white px-3 py-2 pr-10 text-base text-text-primary placeholder:text-text-tertiary',
                  'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
                  'disabled:cursor-not-allowed disabled:bg-bg-secondary disabled:opacity-50'
                )}
                aria-required="true"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium text-text-primary">
              Confirm Password <span className="text-error-500">*</span>
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                required
                disabled={isLoading}
                className={cn(
                  'h-10 w-full rounded-md border border-default bg-white px-3 py-2 pr-10 text-base text-text-primary placeholder:text-text-tertiary',
                  'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
                  'disabled:cursor-not-allowed disabled:bg-bg-secondary disabled:opacity-50',
                  !passwordsMatch && confirmPassword.length > 0 && 'border-error-500'
                )}
                aria-required="true"
                aria-invalid={!passwordsMatch && confirmPassword.length > 0 ? 'true' : 'false'}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {!passwordsMatch && confirmPassword.length > 0 && (
              <p className="mt-1 text-sm text-error-500" role="alert">
                Passwords do not match
              </p>
            )}
          </div>

          {/* Password Requirements Display */}
          <div className="rounded-md border border-default bg-bg-secondary p-3">
            <p className="mb-2 text-sm font-medium text-text-primary">Password Requirements:</p>
            <ul className="space-y-1 text-sm text-text-secondary">
              {passwordRequirements.map((req, index) => {
                const isValid = req.test(newPassword);
                return (
                  <li key={index} className="flex items-center gap-2">
                    {isValid ? (
                      <Check className="h-4 w-4 text-success-500" />
                    ) : (
                      <X className="h-4 w-4 text-error-500" />
                    )}
                    <span className={isValid ? 'text-success-700' : 'text-text-secondary'}>
                      {req.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Reset Password Button */}
          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className={cn(
              'h-10 w-full rounded-md bg-primary-500 font-medium text-white transition-colors',
              'hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
              'disabled:cursor-not-allowed disabled:bg-gray-400',
              isLoading && 'cursor-wait'
            )}
            aria-label="Reset password"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Resetting...
              </span>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
