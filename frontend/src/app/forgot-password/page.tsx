"use client";

import Link from "next/link";
import { useState } from "react";

import { AuthShell } from "@/components/auth/AuthShell";
import { AuthCard } from "@/components/auth/AuthCard";
import { Input } from "@/components/forms/Input";
import { Spinner } from "@/components/feedback/Spinner";
import { ErrorState } from "@/components/feedback/ErrorState";
import { notify } from "@/lib/toast";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email) return setError("Email is required");

    setIsSubmitting(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const redirectTo = `${window.location.origin}/reset-password`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (resetError) throw resetError;
      setSent(true);
      notify.success("Email sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reset link");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell backHref="/login">
      <AuthCard title={sent ? "✓ Email Sent" : "Forgot Password?"}>
        {sent ? (
          <div className="space-y-4 text-sm text-zinc-700">
            <p>
              We&apos;ve sent a password reset link to your email address. Please check your inbox and follow the
              instructions.
            </p>
            <p>If you don&apos;t receive the email within a few minutes, check your spam folder or try again.</p>
            <Link href="/login" className="inline-flex rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Back to Login
            </Link>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={onSubmit}>
            <p className="text-sm text-zinc-600">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>
            {error ? <ErrorState title="Could not send email" message={error} /> : null}
            <Input
              label="Email"
              required
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="your.email@example.com"
              autoComplete="email"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-10 w-full items-center justify-center rounded-md bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
            >
              {isSubmitting ? <Spinner label="Sending..." /> : "Send Reset Link"}
            </button>
            <div className="text-center text-sm text-zinc-700">
              Remember your password?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Log In
              </Link>
            </div>
          </form>
        )}
      </AuthCard>
    </AuthShell>
  );
}

