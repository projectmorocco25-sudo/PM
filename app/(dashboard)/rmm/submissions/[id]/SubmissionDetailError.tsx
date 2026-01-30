"use client";

/**
 * Wireframe: task-0.5.2.12-registry-submission-detail.md — Error state
 * Route: /rmm/submissions/[id]
 * Task: 1.1.2.27
 */

import Link from "next/link";
import { useRouter } from "next/navigation";

type SubmissionDetailErrorProps = {
  message: string;
  subMessage: string;
};

export function SubmissionDetailError({ message, subMessage }: SubmissionDetailErrorProps) {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
        <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <Link href="/rmm" className="text-[#2563eb] hover:underline">RMM</Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <Link href="/rmm/submissions" className="text-[#2563eb] hover:underline">Submissions</Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <span className="text-[#111827] font-medium">Submission</span>
      </nav>
      <div className="rounded-lg border border-[#dc2626] bg-[#fef2f2] p-6 text-center">
        <p className="font-medium text-[#dc2626]">{message}</p>
        <p className="mt-1 text-sm text-[#991b1b]">{subMessage}</p>
        <p className="mt-4 text-sm text-[#6b7280]">Data is loaded from hosted Supabase only. RLS applies.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Link
            href="/rmm/submissions"
            className="rounded-md border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
          >
            Back to Submissions
          </Link>
          <button
            type="button"
            onClick={() => router.refresh()}
            className="rounded-md border border-[#dc2626] bg-white px-4 py-2 text-sm font-medium text-[#dc2626] hover:bg-[#fef2f2]"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}
