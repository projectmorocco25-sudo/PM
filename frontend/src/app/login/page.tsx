"use client";

import Link from "next/link";
import { useState } from "react";

import { AuthShell } from "@/components/auth/AuthShell";
import { AuthCard } from "@/components/auth/AuthCard";
import { Input } from "@/components/forms/Input";
import { Checkbox } from "@/components/forms/Checkbox";
import { Spinner } from "@/components/feedback/Spinner";
import { ErrorState } from "@/components/feedback/ErrorState";
import { notify } from "@/lib/toast";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email) return setError("Email is required");
    if (!password) return setError("Password is required");

    setIsSubmitting(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: remember ? undefined : undefined,
      });
      if (signInError) throw signInError;

      notify.success("Logged in");
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell backHref="/">
      <AuthCard title="Login to PM">
        <form className="space-y-4" onSubmit={onSubmit}>
          {error ? <ErrorState title="Login failed" message={error} /> : null}

          <Input
            label="Email"
            required
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="your.email@example.com"
            autoComplete="email"
          />

          <Input
            label="Password"
            required
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={setPassword}
            placeholder="Enter your password"
            autoComplete="current-password"
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-xs font-medium text-zinc-600 hover:text-zinc-900"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            }
          />

          <Checkbox checked={remember} onChange={setRemember} label="Remember me" />

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-10 w-full items-center justify-center rounded-md bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
          >
            {isSubmitting ? <Spinner label="Logging in..." /> : "Log In"}
          </button>

          <div className="space-y-2 text-center text-sm">
            <Link href="/forgot-password" className="text-blue-600 hover:underline">
              Forgot password?
            </Link>
            <div>
              <Link href="/register" className="text-blue-600 hover:underline">
                Register account
              </Link>
            </div>
          </div>
        </form>
      </AuthCard>
    </AuthShell>
  );
}

