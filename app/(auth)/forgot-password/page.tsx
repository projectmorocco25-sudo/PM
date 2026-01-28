/**
 * Wireframe: task-0.5.1.13-forgot-reset-password.md (Forgot Password)
 * Route: /forgot-password
 * Implements: Forgot password page. Supabase Auth resetPasswordForEmail; auth.users.
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/00-core-foundation/authentication/task-0.5.1.13-forgot-reset-password.md
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { Check } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/reset-password`,
      });
      if (err) {
        setError(err.message);
        return;
      }
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <AuthPageShell maxWidth="400" title="">
        <div className="rounded-lg border border-[#10b981] bg-white p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#10b981] text-white">
            <Check className="h-6 w-6" aria-hidden />
          </div>
          <h2 className="text-2xl font-semibold text-[#111827]">Email Sent</h2>
          <p className="mt-4 text-base leading-relaxed text-[#4b5563]">
            We&apos;ve sent a password reset link to your email address. Please check your inbox and
            follow the instructions.
          </p>
          <p className="mt-4 text-sm italic text-[#6b7280]">
            If you don&apos;t receive the email within a few minutes, please check your spam folder or
            try again.
          </p>
          <p className="mt-6 text-sm text-[#6b7280]">
            Data Protection: Password reset requests are processed per Law No. 09-08 (CNDP) data
            protection requirements.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-md bg-[#3b82f6] text-base font-medium text-white transition-colors hover:bg-[#2563eb]"
          >
            Back to Login
          </Link>
        </div>
      </AuthPageShell>
    );
  }

  return (
    <AuthPageShell maxWidth="400" title="Forgot Password?">
      <p className="mt-4 text-center text-base text-[#4b5563]">
        Enter your email address and we&apos;ll send you a link to reset your password.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div>
          <label htmlFor="forgot-email" className="block text-sm font-medium text-[#111827]">
            Email <span className="text-[#ef4444]" aria-hidden>*</span>
          </label>
          <input
            id="forgot-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            required
            autoComplete="email"
            disabled={loading}
            className="mt-1 h-10 w-full rounded-md border border-[#e5e7eb] px-3 text-base text-[#111827] placeholder:text-[#9ca3af] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6] disabled:bg-[#f3f4f6]"
          />
        </div>
        {error && (
          <p className="text-sm text-[#ef4444]" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="h-10 w-full rounded-md bg-[#3b82f6] text-base font-medium text-white transition-colors hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:bg-[#9ca3af]"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
        <p className="text-center text-sm text-[#6b7280]">
          Remember your password?{" "}
          <Link href="/login" className="font-medium text-[#2563eb] hover:underline">
            Log In
          </Link>
        </p>
      </form>
    </AuthPageShell>
  );
}
