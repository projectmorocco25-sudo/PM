"use client";

/**
 * Wireframe: task-0.5.2.7-sku-detail.md — Error state
 * Route: /rmm/skus/[id]
 * Task: 1.1.2.24
 */

import Link from "next/link";
import { useRouter } from "next/navigation";

type SkuDetailErrorProps = {
  message: string;
  subMessage: string;
};

export function SkuDetailError({ message, subMessage }: SkuDetailErrorProps) {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
        <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <Link href="/rmm" className="text-[#2563eb] hover:underline">RMM</Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <Link href="/rmm/skus" className="text-[#2563eb] hover:underline">SKUs</Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <span className="text-[#111827] font-medium">SKU</span>
      </nav>
      <div className="rounded-lg border border-[#dc2626] bg-[#fef2f2] p-6 text-center">
        <p className="font-medium text-[#dc2626]">{message}</p>
        <p className="mt-1 text-sm text-[#991b1b]">{subMessage}</p>
        <p className="mt-4 text-sm text-[#6b7280]">Data is loaded from hosted Supabase only. RLS applies.</p>
        <button
          type="button"
          onClick={() => router.refresh()}
          className="mt-4 rounded-md border border-[#dc2626] bg-white px-4 py-2 text-sm font-medium text-[#dc2626] hover:bg-[#fef2f2]"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
