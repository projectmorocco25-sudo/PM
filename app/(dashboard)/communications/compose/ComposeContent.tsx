"use client";

/**
 * Wireframe: task-0.5.1.26-compose-message.md
 * Compose: Subject*, Message*, Type, To (company/MOH), lifecycle info, Cancel / Send / Draft.
 * API: communications_create_conversation. Tables: conversations, messages.
 */

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import { usePermissions } from "@/hooks/use-permissions";
import { useCreateConversation } from "@/hooks/use-communications";
import { createClient } from "@/lib/supabase/client";

const COMPOSE_DRAFT_KEY = "communications-compose-draft";
const TYPE_OPTIONS = [
  { value: "workflow_related", label: "Workflow related" },
  { value: "message", label: "Message" },
  { value: "announcement", label: "Announcement" },
];

type CompanyOption = { id: string; name: string };

export function ComposeContent() {
  const router = useRouter();
  const { user } = useSession();
  const { data: perms } = usePermissions(user);
  const { create, status, error, createdId } = useCreateConversation();

  const companyId = perms && !("error" in perms) ? (perms as { company_id?: string | null }).company_id : null;
  const isMoh = perms && !("error" in perms) && (perms as { role?: string }).role
    ? ["tier1", "tier2_officer", "tier2_registrar", "system_admin"].includes((perms as { role: string }).role)
    : false;

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("workflow_related");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [draftSaved, setDraftSaved] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(COMPOSE_DRAFT_KEY);
    if (raw) {
      try {
        const d = JSON.parse(raw) as { subject?: string; message?: string; type?: string };
        if (d.subject != null) setSubject(String(d.subject));
        if (d.message != null) setMessage(String(d.message));
        if (d.type != null) setType(String(d.type));
      } catch {
        /* ignore */
      }
    }
  }, []);

  useEffect(() => {
    if (!isMoh) return;
    let cancelled = false;
    const supabase = createClient();
    supabase
      .rpc("rmm_list_companies", { p_limit: 500, p_offset: 0 })
      .then(({ data }) => {
        if (cancelled) return;
        const pl = data as { data?: { id: string; name: string }[] } | null;
        const list = Array.isArray(pl?.data) ? pl.data : [];
        setCompanies(list.map((c) => ({ id: c.id, name: c.name || "" })));
      });
    return () => {
      cancelled = true;
    };
  }, [isMoh]);

  const saveDraft = useCallback(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      COMPOSE_DRAFT_KEY,
      JSON.stringify({ subject, message, type })
    );
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
  }, [subject, message, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    let cid: string | null = null;
    if (isMoh) {
      cid =
        selectedCompanyId && selectedCompanyId !== "__none__"
          ? selectedCompanyId
          : null;
    } else {
      cid = companyId ?? null;
    }
    await create({
      subject: subject.trim(),
      type,
      company_id: cid,
      recipient_id: null,
      initial_content: message.trim(),
    });
  };

  useEffect(() => {
    if (status !== "success" || !createdId) return;
    if (typeof window !== "undefined") localStorage.removeItem(COMPOSE_DRAFT_KEY);
    router.replace("/communications/sent");
  }, [status, createdId, router]);

  const hasTo = isMoh
    ? !!selectedCompanyId
    : !!companyId;
  const canSend = hasTo && subject.trim().length > 0 && message.trim().length > 0;
  const isSending = status === "loading";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <nav
        className="flex h-10 items-center text-sm text-[#6b7280]"
        aria-label="Breadcrumb"
      >
        <Link href="/dashboard" className="text-[#2563eb] hover:underline">
          Home
        </Link>
        <span className="mx-2 text-[#9ca3af]">/</span>
        <Link href="/communications/inbox" className="text-[#2563eb] hover:underline">
          Communications
        </Link>
        <span className="mx-2 text-[#9ca3af]">/</span>
        <span className="text-[#111827]">Compose</span>
      </nav>

      <h1 className="text-2xl font-bold text-[#111827] md:text-[30px]">
        Compose New Message
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="compose-to" className="block text-sm font-medium text-[#111827]">
            To <span className="text-[#ef4444]">*</span>
          </label>
          {isMoh ? (
            <select
              id="compose-to"
              value={selectedCompanyId ?? ""}
              onChange={(e) => setSelectedCompanyId(e.target.value || null)}
              className="mt-1 w-full rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm text-[#111827] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
            >
              <option value="">Select company...</option>
              <option value="__none__">None</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          ) : (
            <p className="mt-1 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2 text-sm text-[#6b7280]">
              MOH
            </p>
          )}
        </div>

        <div>
          <label htmlFor="compose-subject" className="block text-sm font-medium text-[#111827]">
            Subject <span className="text-[#ef4444]">*</span>
          </label>
          <input
            id="compose-subject"
            type="text"
            placeholder="Enter subject..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            maxLength={200}
            className="mt-1 w-full rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm text-[#111827] placeholder-[#9ca3af] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
            required
          />
          <p className="mt-0.5 text-xs text-[#9ca3af]">{subject.length}/200</p>
        </div>

        <div>
          <label htmlFor="compose-type" className="block text-sm font-medium text-[#111827]">
            Type
          </label>
          <select
            id="compose-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm text-[#111827] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
          >
            {TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="compose-message" className="block text-sm font-medium text-[#111827]">
            Message <span className="text-[#ef4444]">*</span>
          </label>
          <textarea
            id="compose-message"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className="mt-1 min-h-[200px] w-full max-h-[500px] resize-y rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm text-[#111827] placeholder-[#9ca3af] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
            required
          />
        </div>

        <div className="rounded-lg border border-[#3b82f6] bg-[#eff6ff] px-4 py-3 text-sm text-[#1e40af]">
          <p>
            After sending, this conversation will enter the lifecycle: Created → Sent → Delivered → Read.
          </p>
          <p className="mt-1">
            All conversations are retained for 7 years for regulatory compliance (no hard deletes allowed).
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-[#ef4444] bg-[#fef2f2] px-4 py-3 text-sm text-[#991b1b]">
            {error}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-end gap-3">
          <Link
            href="/communications/inbox"
            className="rounded-lg border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[#111827] hover:bg-[#f9fafb]"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={saveDraft}
            className="rounded-lg border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[#111827] hover:bg-[#f9fafb]"
          >
            {draftSaved ? "Draft saved" : "Save Draft"}
          </button>
          <button
            type="submit"
            disabled={!canSend || isSending}
            className="rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-medium text-white hover:bg-[#1d4ed8] disabled:opacity-50"
          >
            {isSending ? "Sending…" : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
