"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { AuthShell } from "@/components/auth/AuthShell";
import { AuthCard } from "@/components/auth/AuthCard";
import { PasswordRequirements } from "@/components/auth/PasswordRequirements";
import { Input } from "@/components/forms/Input";
import { Checkbox } from "@/components/forms/Checkbox";
import { Spinner } from "@/components/feedback/Spinner";
import { ErrorState } from "@/components/feedback/ErrorState";
import { notify } from "@/lib/toast";
import { checkPassword, isPasswordValid } from "@/lib/passwordPolicy";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function RegisterPage() {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pwCheck = useMemo(() => checkPassword(password, 12), [password]);
  const pwOk = isPasswordValid(pwCheck);
  const canSubmit =
    companyName &&
    email &&
    contactPerson &&
    pwOk &&
    password === confirmPassword &&
    acceptedTerms &&
    !isSubmitting;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!canSubmit) return setError("Please complete all required fields.");

    setIsSubmitting(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            company_name: companyName,
            contact_person: contactPerson,
          },
        },
      });
      if (signUpError) throw signUpError;

      notify.success("Account created. Check your email to confirm.");
      window.location.href = "/login";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell backHref="/">
      <AuthCard title="Create Account">
        <form className="space-y-4" onSubmit={onSubmit}>
          {error ? <ErrorState title="Registration failed" message={error} /> : null}

          <Input
            label="Company Name"
            required
            value={companyName}
            onChange={setCompanyName}
            placeholder="Enter your company name"
            autoComplete="organization"
          />
          <Input
            label="Company Email"
            required
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="your.company@example.com"
            autoComplete="email"
          />
          <Input
            label="Contact Person"
            required
            value={contactPerson}
            onChange={setContactPerson}
            placeholder="Full name"
            autoComplete="name"
          />

          <Input
            label="Password"
            required
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={setPassword}
            placeholder="Enter your password"
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
            placeholder="Confirm your password"
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
          />

          <PasswordRequirements password={password} />

          <Checkbox
            checked={acceptedTerms}
            onChange={setAcceptedTerms}
            label={
              <>
                I agree to the{" "}
                <a className="text-blue-600 hover:underline" href="#" onClick={(e) => e.preventDefault()}>
                  Terms of Service
                </a>{" "}
                and{" "}
                <a className="text-blue-600 hover:underline" href="#" onClick={(e) => e.preventDefault()}>
                  Privacy Policy
                </a>
              </>
            }
          />

          <button
            type="submit"
            disabled={!canSubmit}
            className="flex h-10 w-full items-center justify-center rounded-md bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
          >
            {isSubmitting ? <Spinner label="Registering..." /> : "Register"}
          </button>

          <div className="text-center text-sm text-zinc-700">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Log In
            </Link>
          </div>
        </form>
      </AuthCard>
    </AuthShell>
  );
}

