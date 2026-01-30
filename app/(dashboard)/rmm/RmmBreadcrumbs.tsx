"use client";

/**
 * Wireframe: task-0.5.1.14-dashboard-layout-structure.md
 * Breadcrumbs: Home > Module > Page. RMM layout only.
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.14-dashboard-layout-structure.md
 */

import Link from "next/link";
import { usePathname } from "next/navigation";

const RMM_SEGMENT_LABELS: Record<string, string> = {
  overview: "Overview",
  companies: "Companies",
  products: "Products",
  skus: "SKUs",
  submissions: "Submissions",
  "atc-codes": "ATC Codes",
  "critical-medicines": "Critical Medicines",
  new: "New",
  edit: "Edit",
};

export function RmmBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const rmmIndex = segments.indexOf("rmm");
  const afterRmm = segments.slice(rmmIndex + 1);

  const crumbs: { label: string; href: string }[] = [
    { label: "Home", href: "/dashboard" },
    { label: "RMM", href: "/rmm" },
  ];

  if (afterRmm.length === 0) {
    return (
      <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
        <Link href="/dashboard" className="text-[#2563eb] hover:underline">Home</Link>
        <span className="mx-1 text-[#9ca3af]">/</span>
        <span className="text-[#111827] font-medium">RMM</span>
      </nav>
    );
  }

  let href = "/rmm";
  for (let i = 0; i < afterRmm.length; i++) {
    const seg = afterRmm[i];
    const isId = /^[0-9a-f-]{36}$/i.test(seg) || (seg.length > 10 && !RMM_SEGMENT_LABELS[seg]);
    const label = RMM_SEGMENT_LABELS[seg] ?? (isId ? "Detail" : seg);
    href += `/${seg}`;
    const isLast = i === afterRmm.length - 1;
    if (isLast) {
      return (
        <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
          {crumbs.map((c) => (
            <span key={c.href} className="flex items-center gap-1">
              <Link href={c.href} className="text-[#2563eb] hover:underline">
                {c.label}
              </Link>
              <span className="text-[#9ca3af]">/</span>
            </span>
          ))}
          <span className="text-[#111827] font-medium">{label}</span>
        </nav>
      );
    }
    crumbs.push({ label, href });
  }

  return (
    <nav className="flex h-10 items-center text-sm text-[#6b7280]" aria-label="Breadcrumb">
      {crumbs.map((c, i) => (
        <span key={c.href} className="flex items-center gap-1">
          {i < crumbs.length - 1 ? (
            <>
              <Link href={c.href} className="text-[#2563eb] hover:underline">
                {c.label}
              </Link>
              <span className="text-[#9ca3af]">/</span>
            </>
          ) : (
            <span className="text-[#111827] font-medium">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
