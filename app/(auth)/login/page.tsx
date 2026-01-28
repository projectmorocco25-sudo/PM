/**
 * Wireframe: task-0.5.1.11-login-page.md
 * Route: /login
 * Implements: Login page. Supabase Auth signInWithPassword; users, auth.users.
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/00-core-foundation/authentication/task-0.5.1.11-login-page.md
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { PasswordInput } from "@/components/auth/PasswordInput";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
        options: { persistSession: remember },
      });
      if (err) {
        setError(err.message === "Invalid login credentials" ? "Invalid email or password." : err.message);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthPageShell maxWidth="400" title="Login to PM">
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-[#111827]">
              Email <span className="text-[#ef4444]" aria-hidden>*</span>
            </label>
            <input
              id="login-email"
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
          <PasswordInput
            id="login-password"
            label="Password"
            value={password}
            onChange={setPassword}
            placeholder="Enter your password"
            required
            disabled={loading}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="login-remember"
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            disabled={loading}
            className="h-4 w-4 rounded border-[#e5e7eb] text-[#3b82f6] focus:ring-[#3b82f6]"
          />
          <label htmlFor="login-remember" className="text-sm font-medium text-[#111827]">
            Remember me
          </label>
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
          {loading ? "Logging in..." : "Log In"}
        </button>

        <div className="space-y-2 text-center">
          <div>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-[#2563eb] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div>
            <Link
              href="/register"
              className="text-sm font-medium text-[#2563eb] hover:underline"
            >
              Register account
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-[#6b7280]">
          Data Protection: Your login data is protected per Law No. 09-08 (CNDP).
        </p>
      </form>
    </AuthPageShell>
  );
}
