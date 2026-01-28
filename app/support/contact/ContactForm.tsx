"use client";

/**
 * Wireframe: task-0.5.1.39-contact-support.md
 * Contact form: validation, terms checkbox, submit → loading then success + reset.
 * No API; UI-only for 1.1.1.15.
 */

import { useState, useCallback } from "react";
import Link from "next/link";

const CATEGORIES = [
  "General Inquiry",
  "Technical Issue",
  "Account Question",
  "Submission Help",
  "Compliance Question",
  "Other",
] as const;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ".pdf,.doc,.docx,.xls,.xlsx,image/*";

type FormState = {
  name: string;
  email: string;
  company: string;
  subject: string;
  category: string;
  message: string;
  agreed: boolean;
  file: File | null;
};

const initial: FormState = {
  name: "",
  email: "",
  company: "",
  subject: "",
  category: "",
  message: "",
  agreed: false,
  file: null,
};

type Errors = Partial<Record<keyof FormState, string>>;

function validateEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [fileInputKey, setFileInputKey] = useState(0);

  const update = useCallback((k: keyof FormState, v: string | boolean | File | null) => {
    setForm((prev) => ({ ...prev, [k]: v }));
    setErrors((e) => {
      const next = { ...e };
      delete next[k];
      return next;
    });
  }, []);

  const validate = useCallback((): boolean => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!validateEmail(form.email)) e.email = "Enter a valid email address.";
    if (!form.subject.trim()) e.subject = "Subject is required.";
    if (!form.category) e.category = "Please select a category.";
    if (!form.message.trim()) e.message = "Message is required.";
    if (!form.agreed) e.agreed = "You must agree to the Terms of Service.";
    if (form.file && form.file.size > MAX_FILE_SIZE) {
      e.file = "File must be 5MB or smaller.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form]);

  const handleSubmit = useCallback(
    async (ev: React.FormEvent) => {
      ev.preventDefault();
      if (status === "loading") return;
      if (!validate()) return;
      setStatus("loading");
      await new Promise((r) => setTimeout(r, 800));
      setStatus("success");
      setForm(initial);
      setFileInputKey((k) => k + 1);
    },
    [validate, status]
  );

  const handleFile = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    const f = ev.target.files?.[0] ?? null;
    update("file", f);
  }, [update]);

  return (
    <section
      className="rounded-lg border border-[#e5e7eb] bg-white p-8"
      aria-labelledby="contact-form-heading"
    >
      <h2 id="contact-form-heading" className="mb-6 text-[24px] font-semibold text-[#111827]">
        Contact Form
      </h2>

      {status === "success" && (
        <div
          className="mb-6 rounded-lg border border-[#22c55e] bg-[#f0fdf4] p-4 text-[#166534]"
          role="alert"
        >
          <p className="font-medium">Request received.</p>
          <p className="mt-1 text-sm">
            We will respond within 24–48 hours. For urgent issues, see Escalation Procedures below.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mx-auto max-w-[700px] space-y-6">
        <div>
          <label htmlFor="contact-name" className="mb-1 block text-sm font-medium text-[#111827]">
            Name <span className="text-[#ef4444]">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            required
            disabled={status === "loading"}
            className={`h-10 w-full rounded-lg border px-4 text-base text-[#111827] placeholder-[#9ca3af] focus:outline focus:outline-2 focus:outline-[#3b82f6] focus:outline-offset-0 ${
              errors.name ? "border-[#ef4444]" : "border-[#e5e7eb]"
            }`}
            placeholder="Your name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
          />
          {errors.name && (
            <p id="contact-name-error" className="mt-1 text-sm text-[#ef4444]" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-email" className="mb-1 block text-sm font-medium text-[#111827]">
            Email <span className="text-[#ef4444]">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
            disabled={status === "loading"}
            className={`h-10 w-full rounded-lg border px-4 text-base text-[#111827] placeholder-[#9ca3af] focus:outline focus:outline-2 focus:outline-[#3b82f6] focus:outline-offset-0 ${
              errors.email ? "border-[#ef4444]" : "border-[#e5e7eb]"
            }`}
            placeholder="your@email.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
          />
          {errors.email && (
            <p id="contact-email-error" className="mt-1 text-sm text-[#ef4444]" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-company" className="mb-1 block text-sm font-medium text-[#111827]">
            Company <span className="text-[#6b7280]">(Optional)</span>
          </label>
          <input
            id="contact-company"
            type="text"
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
            disabled={status === "loading"}
            className="h-10 w-full rounded-lg border border-[#e5e7eb] px-4 text-base text-[#111827] placeholder-[#9ca3af] focus:outline focus:outline-2 focus:outline-[#3b82f6] focus:outline-offset-0"
            placeholder="Company name"
          />
        </div>

        <div>
          <label htmlFor="contact-subject" className="mb-1 block text-sm font-medium text-[#111827]">
            Subject <span className="text-[#ef4444]">*</span>
          </label>
          <input
            id="contact-subject"
            type="text"
            value={form.subject}
            onChange={(e) => update("subject", e.target.value)}
            required
            disabled={status === "loading"}
            className={`h-10 w-full rounded-lg border px-4 text-base text-[#111827] placeholder-[#9ca3af] focus:outline focus:outline-2 focus:outline-[#3b82f6] focus:outline-offset-0 ${
              errors.subject ? "border-[#ef4444]" : "border-[#e5e7eb]"
            }`}
            placeholder="Brief subject"
            aria-invalid={!!errors.subject}
            aria-describedby={errors.subject ? "contact-subject-error" : undefined}
          />
          {errors.subject && (
            <p id="contact-subject-error" className="mt-1 text-sm text-[#ef4444]" role="alert">
              {errors.subject}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-category" className="mb-1 block text-sm font-medium text-[#111827]">
            Category <span className="text-[#ef4444]">*</span>
          </label>
          <select
            id="contact-category"
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            required
            disabled={status === "loading"}
            className={`h-10 w-full rounded-lg border px-4 text-base text-[#111827] focus:outline focus:outline-2 focus:outline-[#3b82f6] focus:outline-offset-0 ${
              errors.category ? "border-[#ef4444]" : "border-[#e5e7eb]"
            }`}
            aria-invalid={!!errors.category}
            aria-describedby={errors.category ? "contact-category-error" : undefined}
          >
            <option value="">Select category...</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && (
            <p id="contact-category-error" className="mt-1 text-sm text-[#ef4444]" role="alert">
              {errors.category}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-message" className="mb-1 block text-sm font-medium text-[#111827]">
            Message <span className="text-[#ef4444]">*</span>
          </label>
          <textarea
            id="contact-message"
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            required
            disabled={status === "loading"}
            rows={5}
            className={`min-h-[120px] w-full rounded-lg border px-4 py-3 text-base text-[#111827] placeholder-[#9ca3af] focus:outline focus:outline-2 focus:outline-[#3b82f6] focus:outline-offset-0 ${
              errors.message ? "border-[#ef4444]" : "border-[#e5e7eb]"
            }`}
            placeholder="Your message..."
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "contact-message-error" : undefined}
          />
          {errors.message && (
            <p id="contact-message-error" className="mt-1 text-sm text-[#ef4444]" role="alert">
              {errors.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-file" className="mb-1 block text-sm font-medium text-[#111827]">
            Attachments <span className="text-[#6b7280]">(Optional, max 5MB)</span>
          </label>
          <input
            key={fileInputKey}
            id="contact-file"
            type="file"
            accept={ACCEPTED_TYPES}
            onChange={handleFile}
            disabled={status === "loading"}
            className="block w-full text-sm text-[#4b5563] file:mr-4 file:rounded-lg file:border-0 file:bg-[#3b82f6] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white file:hover:bg-[#2563eb]"
            aria-describedby={errors.file ? "contact-file-error" : undefined}
          />
          {form.file && (
            <p className="mt-1 text-sm text-[#4b5563]">
              {form.file.name} ({(form.file.size / 1024).toFixed(1)} KB)
            </p>
          )}
          {errors.file && (
            <p id="contact-file-error" className="mt-1 text-sm text-[#ef4444]" role="alert">
              {errors.file}
            </p>
          )}
        </div>

        <div>
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={form.agreed}
              onChange={(e) => update("agreed", e.target.checked)}
              disabled={status === "loading"}
              className="mt-1 h-4 w-4 rounded border-[#e5e7eb] text-[#3b82f6] focus:ring-[#3b82f6]"
              aria-invalid={!!errors.agreed}
              aria-describedby={errors.agreed ? "contact-agreed-error" : undefined}
            />
            <span className="text-sm text-[#4b5563]">
              I agree to the{" "}
              <Link href="/legal/terms" className="text-[#2563eb] hover:underline">
                Terms of Service
              </Link>
              .
            </span>
          </label>
          {errors.agreed && (
            <p id="contact-agreed-error" className="mt-1 text-sm text-[#ef4444]" role="alert">
              {errors.agreed}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={status === "loading" || !form.agreed}
          className="flex h-10 w-full items-center justify-center rounded-lg bg-[#3b82f6] px-4 text-sm font-medium text-white hover:bg-[#2563eb] disabled:opacity-70 focus:outline focus:outline-2 focus:outline-[#3b82f6] focus:outline-offset-2"
        >
          {status === "loading" ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </section>
  );
}
