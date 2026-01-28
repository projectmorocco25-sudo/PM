"use client";

/**
 * Wireframe: task-0.5.1.7-terms-of-service.md
 * Acceptance section: checkbox + Accept Terms button. Disabled until checked.
 */

import { useState } from "react";
import Link from "next/link";

export function TermsAcceptance() {
  const [agreed, setAgreed] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    if (!agreed || loading) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setAccepted(true);
    setLoading(false);
  };

  return (
    <section
      className="mt-8 rounded-lg border-2 border-[#3b82f6] bg-[#eff6ff] p-6"
      aria-labelledby="terms-acceptance-heading"
    >
      <h2 id="terms-acceptance-heading" className="sr-only">
        Accept Terms
      </h2>
      {accepted ? (
        <div className="rounded-lg border border-[#22c55e] bg-[#f0fdf4] p-4 text-[#166534]" role="alert">
          <p className="font-medium">Terms accepted.</p>
          <p className="mt-1 text-sm">
            You may proceed to{" "}
            <Link href="/register" className="font-medium text-[#2563eb] hover:underline">
              Register
            </Link>
            .
          </p>
        </div>
      ) : (
        <>
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              disabled={loading}
              className="mt-1 h-4 w-4 rounded border-[#e5e7eb] text-[#3b82f6] focus:ring-[#3b82f6]"
              aria-describedby="terms-acceptance-desc"
            />
            <span id="terms-acceptance-desc" className="text-base text-[#111827]">
              I have read and agree to the Terms of Service
            </span>
          </label>
          <button
            type="button"
            onClick={handleAccept}
            disabled={!agreed || loading}
            className="mt-4 flex h-10 min-w-[140px] items-center justify-center rounded-lg bg-[#3b82f6] px-5 text-sm font-medium text-white hover:bg-[#2563eb] disabled:opacity-70 focus:outline focus:outline-2 focus:outline-[#3b82f6] focus:outline-offset-2"
          >
            {loading ? "Processing…" : "Accept Terms"}
          </button>
        </>
      )}
    </section>
  );
}
