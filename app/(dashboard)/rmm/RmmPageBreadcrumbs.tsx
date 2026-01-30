/**
 * Simple breadcrumbs for RMM pages that don't have their own (overview, placeholders).
 * Use "Home > RMM" or "Home > RMM > [tail]". Server-safe.
 */

import Link from "next/link";

type TailItem = string | { label: string; href?: string };

type RmmPageBreadcrumbsProps = {
  /** Final segment(s). String = label only. { label, href } = link when not last. Empty = current page is RMM. */
  tail?: TailItem[];
};

function normalize(t: TailItem): { label: string; href?: string } {
  return typeof t === "string" ? { label: t } : t;
}

export function RmmPageBreadcrumbs({ tail = [] }: RmmPageBreadcrumbsProps) {
  return (
    <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
      <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
      <span className="mx-1 text-[#9ca3af]">/</span>
      {tail.length === 0 ? (
        <span className="text-[#111827] font-medium">RMM</span>
      ) : (
        <>
          <Link href="/rmm" className="text-[#2563eb] hover:underline">RMM</Link>
          {tail.map((item, i) => {
            const { label, href } = normalize(item);
            const isLast = i === tail.length - 1;
            return (
              <span key={label} className="inline-flex items-center gap-1">
                <span className="mx-1 text-[#9ca3af]">/</span>
                {!isLast && href ? (
                  <Link href={href} className="text-[#2563eb] hover:underline">{label}</Link>
                ) : (
                  <span className={isLast ? "text-[#111827] font-medium" : ""}>{label}</span>
                )}
              </span>
            );
          })}
        </>
      )}
    </nav>
  );
}
