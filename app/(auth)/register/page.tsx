/**
 * Wireframe: task-0.5.1.12-registration-page.md
 * Route: /register
 * Implements: Registration page with company information, password requirements, and terms acceptance.
 * Wireframe Link: ../../../../04-design/user-experience/wireframes/00-core-foundation/authentication/task-0.5.1.12-registration-page.md
 */
'use client';

import React, { useState, FormEvent } from 'react';
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

export default function RegisterPage() {
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const validatePassword = (pwd: string): boolean => {
    return passwordRequirements.every((req) => req.test(pwd));
  };

  const passwordsMatch = password === confirmPassword && password.length > 0;
  const isFormValid = companyName && companyEmail && contactPerson && validatePassword(password) && passwordsMatch && termsAccepted;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!validatePassword(password)) {
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
      // First, create auth user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: companyEmail,
        password,
        options: {
          data: {
            full_name: contactPerson,
            company_name: companyName,
          },
        },
      });

      if (authError) {
        setError(authError.message || 'Registration failed. Please try again.');
        setIsLoading(false);
        return;
      }

      if (!authData.user) {
        setError('Registration failed. Please try again.');
        setIsLoading(false);
        return;
      }

      // Note: rmm_create_user() RPC function requires tier1 or system_admin role
      // For public registration, we'll create the user record directly
      // In a production system, this would be handled via an Edge Function or admin approval workflow
      
      // For now, redirect to login with success message
      router.push('/login?registered=true');
      router.refresh();
    } catch (err) {
      console.error('Registration error:', err);
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

      {/* Registration Form Container */}
      <div className="rounded-lg border border-default bg-white p-8 shadow-sm">
        {/* Form Title */}
        <h2 className="mb-8 text-2xl font-semibold text-text-primary">Create Account</h2>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-md border border-error-500 bg-error-50 p-3 text-sm text-error-700" role="alert">
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Name Input */}
          <div>
            <label htmlFor="company-name" className="mb-2 block text-sm font-medium text-text-primary">
              Company Name <span className="text-error-500">*</span>
            </label>
            <input
              id="company-name"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter your company name"
              required
              disabled={isLoading}
              className={cn(
                'h-10 w-full rounded-md border border-default bg-white px-3 py-2 text-base text-text-primary placeholder:text-text-tertiary',
                'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
                'disabled:cursor-not-allowed disabled:bg-bg-secondary disabled:opacity-50'
              )}
              aria-required="true"
            />
          </div>

          {/* Company Email Input */}
          <div>
            <label htmlFor="company-email" className="mb-2 block text-sm font-medium text-text-primary">
              Company Email <span className="text-error-500">*</span>
            </label>
            <input
              id="company-email"
              type="email"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
              placeholder="your.company@example.com"
              required
              disabled={isLoading}
              className={cn(
                'h-10 w-full rounded-md border border-default bg-white px-3 py-2 text-base text-text-primary placeholder:text-text-tertiary',
                'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
                'disabled:cursor-not-allowed disabled:bg-bg-secondary disabled:opacity-50'
              )}
              aria-required="true"
            />
          </div>

          {/* Contact Person Input */}
          <div>
            <label htmlFor="contact-person" className="mb-2 block text-sm font-medium text-text-primary">
              Contact Person <span className="text-error-500">*</span>
            </label>
            <input
              id="contact-person"
              type="text"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              placeholder="Full name"
              required
              disabled={isLoading}
              className={cn(
                'h-10 w-full rounded-md border border-default bg-white px-3 py-2 text-base text-text-primary placeholder:text-text-tertiary',
                'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
                'disabled:cursor-not-allowed disabled:bg-bg-secondary disabled:opacity-50'
              )}
              aria-required="true"
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
                  'disabled:cursor-not-allowed disabled:bg-bg-secondary disabled:opacity-50'
                )}
                aria-required="true"
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
                placeholder="Confirm your password"
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
                const isValid = req.test(password);
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

          {/* Terms Acceptance Checkbox */}
          <div className="flex items-start">
            <input
              id="terms"
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              required
              disabled={isLoading}
              className="mt-1 h-4 w-4 rounded border-default text-primary-600 focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
              aria-required="true"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-text-primary">
              I agree to the{' '}
              <Link href="/legal/terms" className="text-primary-600 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/legal/privacy" className="text-primary-600 hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className={cn(
              'h-10 w-full rounded-md bg-primary-500 font-medium text-white transition-colors',
              'hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
              'disabled:cursor-not-allowed disabled:bg-gray-400',
              isLoading && 'cursor-wait'
            )}
            aria-label="Register"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Registering...
              </span>
            ) : (
              'Register'
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-text-secondary">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary-600 hover:underline">
              Log In
            </Link>
          </p>
        </div>

        {/* Data Protection Notice */}
        <div className="mt-6 rounded-md bg-bg-secondary p-3 text-xs text-text-secondary">
          <p>
            <strong>Data Protection Notice:</strong> Your registration data is processed per Law No. 09-08 (CNDP) data
            protection requirements. By registering, you acknowledge the regulatory retention period of 7 years.
          </p>
        </div>
      </div>
    </div>
  );
}
