"use client";

import { useEffect, useMemo, useState } from "react";

import { AuthShell } from "@/components/auth/AuthShell";
import { AuthCard } from "@/components/auth/AuthCard";
import { PasswordRequirements } from "@/components/auth/PasswordRequirements";
import { Input } from "@/components/forms/Input";
import { Spinner } from "@/components/feedback/Spinner";
import { ErrorState } from "@/components/feedback/ErrorState";
import { notify } from "@/lib/toast";
import { checkPassword, isPasswordValid } from "@/lib/passwordPolicy";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

function parseHashParams(): Record<string, string> {
  const hash = typeof window !== "undefined" ? window.location.hash : "";
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  const params = new URLSearchParams(raw);
  const out: Record<string, string> = {};
  params.forEach((v, k) => {
    out[k] = v;
  });
  return out;
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pwCheck = useMemo(() => checkPassword(password, 12), [password]);
  const pwOk = isPasswordValid(pwCheck);
  const canSubmit = pwOk && password && password === confirmPassword && !isSubmitting;

  useEffect(() => {
    // Recovery links often arrive as hash tokens. If present, set the session.
    const supabase = createSupabaseBrowserClient();
    const h = parseHashParams();
    const access_token = h["access_token"];
    const refresh_token = h["refresh_token"];
    if (access_token && refresh_token) {
      supabase.auth
        .setSession({ access_token, refresh_token })
        .then(() => setReady(true))
        .catch(() => setReady(true));
    } else {
      setReady(true);
    }
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!canSubmit) return setError("Please enter a valid password and confirm it.");

    setIsSubmitting(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      notify.success("Password updated. Please log in.");
      window.location.href = "/login";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell backHref="/login">
      <AuthCard title="Reset Password">
        <p className="text-sm text-zinc-600">Enter your new password below.</p>

        {!ready ? (
          <div className="mt-6">
            <Spinner label="Preparing reset…" />
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            {error ? <ErrorState title="Reset failed" message={error} /> : null}

            <Input
              label="New Password"
              required
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={setPassword}
              placeholder="Enter your new password"
              autoComplete="new-password"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-xs font-medium text-zinc-600 hover:text-zinc-900"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              }
            />

            <Input
              label="Confirm Password"
              required
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Confirm your new password"
              autoComplete="new-password"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="text-xs font-medium text-zinc-600 hover:text-zinc-900"
                >
                  {showConfirm ? "🙈" : "👁"}
                </button>
              }
              error={
                confirmPassword && password !== confirmPassword ? "Passwords do not match" : undefined
              }
            />

            <PasswordRequirements password={password} />

            <button
              type="submit"
              disabled={!canSubmit}
              className="flex h-10 w-full items-center justify-center rounded-md bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
            >
              {isSubmitting ? <Spinner label="Resetting..." /> : "Reset Password"}
            </button>
          </form>
        )}
      </AuthCard>
    </AuthShell>
  );
}

