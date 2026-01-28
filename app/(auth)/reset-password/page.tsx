/**
 * Wireframe: task-0.5.1.13-forgot-reset-password.md (Reset Password)
 * Route: /reset-password
 * Implements: Reset password page. Supabase Auth recovery flow + updateUser; auth.users.
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/00-core-foundation/authentication/task-0.5.1.13-forgot-reset-password.md
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { PasswordRequirements } from "@/components/auth/PasswordRequirements";
import { isPasswordValid } from "@/lib/password-validation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState<boolean | null>(null);

  useEffect(() => {
    createClient()
      .auth.getSession()
      .then(({ data: { session } }) => {
        setSessionReady(!!session);
      });
  }, []);

  const passwordValid = isPasswordValid(password);
  const passwordsMatch = !!password && password === confirmPassword;
  const formValid = passwordValid && passwordsMatch;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!formValid) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Invalid or expired reset link. Please request a new one.");
        return;
      }
      const { error: err } = await supabase.auth.updateUser({ password });
      if (err) {
        setError(err.message);
        return;
      }
      router.push("/login?reset=1");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (sessionReady === null) {
    return (
      <AuthPageShell maxWidth="400" title="Reset Password">
        <p className="mt-4 text-center text-[#6b7280]">Loading...</p>
      </AuthPageShell>
    );
  }

  if (!sessionReady) {
    return (
      <AuthPageShell maxWidth="400" title="Reset Password">
        <p className="mt-4 text-center text-[#6b7280]">
          Invalid or expired reset link. Please request a new one.
        </p>
        <Link
          href="/forgot-password"
          className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-md bg-[#3b82f6] text-base font-medium text-white hover:bg-[#2563eb]"
        >
          Request a new link
        </Link>
        <p className="mt-4 text-center text-sm text-[#6b7280]">
          <Link href="/login" className="text-[#2563eb] hover:underline">
            Back to Login
          </Link>
        </p>
      </AuthPageShell>
    );
  }

  return (
    <AuthPageShell maxWidth="480" title="Reset Password">
      <p className="mt-4 text-center text-base text-[#4b5563]">
        Enter your new password below.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <PasswordInput
          id="reset-password"
          label="New Password"
          value={password}
          onChange={setPassword}
          placeholder="Enter your new password"
          required
          disabled={loading}
          aria-describedby="reset-password-requirements"
        />
        <div id="reset-password-requirements">
          <PasswordRequirements password={password} />
        </div>
        <PasswordInput
          id="reset-confirm"
          label="Confirm Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Confirm your new password"
          required
          disabled={loading}
          error={confirmPassword && !passwordsMatch ? "Passwords do not match." : undefined}
        />
        {error && (
          <p className="text-sm text-[#ef4444]" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading || !formValid}
          className="h-10 w-full rounded-md bg-[#3b82f6] text-base font-medium text-white transition-colors hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:bg-[#9ca3af]"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </AuthPageShell>
  );
}
