/**
 * Wireframe: task-0.5.1.12-registration-page.md
 * Route: /register
 * Implements: Registration page. Supabase Auth signUp + rmm_create_user(); users, auth.users.
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/00-core-foundation/authentication/task-0.5.1.12-registration-page.md
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { PasswordRequirements } from "@/components/auth/PasswordRequirements";
import { isPasswordValid } from "@/lib/password-validation";

export default function RegisterPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const emailFormatValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyEmail.trim());
  const passwordValid = isPasswordValid(password);
  const passwordsMatch = !!password && password === confirmPassword;
  const formValid =
    companyName.trim() &&
    companyEmail.trim() &&
    emailFormatValid &&
    contactPerson.trim() &&
    passwordValid &&
    passwordsMatch &&
    termsAccepted;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!formValid) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: authData, error: signUpErr } = await supabase.auth.signUp({
        email: companyEmail.trim(),
        password,
        options: {
          data: {
            full_name: contactPerson.trim(),
            company_name: companyName.trim(),
          },
        },
      });
      if (signUpErr) {
        setError(signUpErr.message);
        return;
      }
      const user = authData.user;
      if (!user) {
        setError("Registration succeeded but no user returned.");
        return;
      }
      const { data: rpcData, error: rpcErr } = await supabase.rpc("rmm_create_user", {
        p_id: user.id,
        p_email: user.email ?? companyEmail.trim(),
        p_full_name: contactPerson.trim(),
        p_company_id: null,
        p_role: "company_user",
      });
      const payload = rpcData as { success?: boolean; error?: string } | null;
      if (rpcErr || !payload?.success) {
        const msg = (payload as { error?: string })?.error ?? rpcErr?.message ?? "Could not create profile.";
        setError(msg);
        return;
      }
      router.push("/login?registered=1");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthPageShell maxWidth="480" title="Create Account">
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="reg-company" className="block text-sm font-medium text-[#111827]">
              Company Name <span className="text-[#ef4444]" aria-hidden>*</span>
            </label>
            <input
              id="reg-company"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter your company name"
              required
              disabled={loading}
              className="mt-1 h-10 w-full rounded-md border border-[#e5e7eb] px-3 text-base text-[#111827] placeholder:text-[#9ca3af] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6] disabled:bg-[#f3f4f6]"
            />
          </div>
          <div>
            <label htmlFor="reg-email" className="block text-sm font-medium text-[#111827]">
              Company Email <span className="text-[#ef4444]" aria-hidden>*</span>
            </label>
            <input
              id="reg-email"
              type="email"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
              placeholder="your.company@example.com"
              required
              autoComplete="email"
              disabled={loading}
              aria-invalid={!!(companyEmail && !emailFormatValid)}
              className={`mt-1 h-10 w-full rounded-md border px-3 text-base text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-1 disabled:bg-[#f3f4f6] ${
                companyEmail && !emailFormatValid
                  ? "border-[#ef4444] focus:border-[#ef4444] focus:ring-[#ef4444]"
                  : "border-[#e5e7eb] focus:border-[#3b82f6] focus:ring-[#3b82f6]"
              }`}
            />
            {companyEmail && !emailFormatValid && (
              <p className="mt-1 text-sm text-[#ef4444]" role="alert">
                Please enter a valid email address.
              </p>
            )}
          </div>
          <div>
            <label htmlFor="reg-contact" className="block text-sm font-medium text-[#111827]">
              Contact Person <span className="text-[#ef4444]" aria-hidden>*</span>
            </label>
            <input
              id="reg-contact"
              type="text"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              placeholder="Full name"
              required
              autoComplete="name"
              disabled={loading}
              className="mt-1 h-10 w-full rounded-md border border-[#e5e7eb] px-3 text-base text-[#111827] placeholder:text-[#9ca3af] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6] disabled:bg-[#f3f4f6]"
            />
          </div>
          <PasswordInput
            id="reg-password"
            label="Password"
            value={password}
            onChange={setPassword}
            placeholder="Enter your password"
            required
            disabled={loading}
            aria-describedby="reg-password-requirements"
          />
          <div id="reg-password-requirements">
            <PasswordRequirements password={password} />
          </div>
          <PasswordInput
            id="reg-confirm"
            label="Confirm Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Confirm your password"
            required
            disabled={loading}
            error={confirmPassword && !passwordsMatch ? "Passwords do not match." : undefined}
          />
        </div>

        <div className="flex items-start gap-2">
          <input
            id="reg-terms"
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            disabled={loading}
            className="mt-1 h-4 w-4 rounded border-[#e5e7eb] text-[#3b82f6] focus:ring-[#3b82f6]"
          />
          <label htmlFor="reg-terms" className="text-sm text-[#111827]">
            I agree to the{" "}
            <Link href="/legal/terms" className="font-medium text-[#2563eb] hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/legal/privacy" className="font-medium text-[#2563eb] hover:underline">
              Privacy Policy
            </Link>
          </label>
        </div>

        <p className="text-sm text-[#6b7280]">
          Data Protection Notice: Your registration data is processed per Law No. 09-08 (CNDP) data
          protection requirements. By registering, you acknowledge the regulatory retention period of
          7 years.
        </p>

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
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-center text-sm text-[#111827]">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-[#2563eb] hover:underline">
            Log In
          </Link>
        </p>
      </form>
    </AuthPageShell>
  );
}
