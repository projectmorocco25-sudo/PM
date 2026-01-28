/**
 * Shared placeholder UI for Task 1.1.1.12. No wireframe; placeholder pages only.
 * Displays route title, "Coming Soon", and optional back link.
 */

import Link from "next/link";

export type PlaceholderPageProps = {
  /** Page title (e.g. "Companies", "Audit Logs") */
  title: string;
  /** Route path for display (e.g. "/rmm/companies") */
  route: string;
  /** Optional back link href (e.g. "/dashboard") */
  backHref?: string;
  /** Optional back label */
  backLabel?: string;
};

export function PlaceholderPage({
  title,
  route,
  backHref = "/dashboard",
  backLabel = "Back to Dashboard",
}: PlaceholderPageProps) {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-[#111827] md:text-3xl">{title}</h1>
      <p className="mt-2 text-sm text-[#6b7280]">Route: {route}</p>
      <div className="mt-6 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-4 py-6 text-center">
        <p className="text-[#6b7280]">Coming Soon</p>
        <p className="mt-1 text-sm text-[#9ca3af]">
          Full implementation in a dedicated task.
        </p>
      </div>
      {backHref && (
        <Link
          href={backHref}
          className="mt-6 inline-block text-sm font-medium text-[#2563eb] hover:underline"
        >
          ← {backLabel}
        </Link>
      )}
    </div>
  );
}
