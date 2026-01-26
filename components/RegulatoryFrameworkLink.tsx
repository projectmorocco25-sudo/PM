/**
 * Regulatory Framework link — Phase 2 Task 2.3 (Fatima's Requirement).
 * Use wherever wireframes specify "[View Regulatory Framework]".
 * Points to /about (framework overview) until a dedicated regulatory doc route exists.
 */

import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface RegulatoryFrameworkLinkProps {
  className?: string;
  label?: string;
}

export function RegulatoryFrameworkLink({ className, label = "View Regulatory Framework" }: RegulatoryFrameworkLinkProps) {
  return (
    <Link
      href="/about"
      className={className ?? "text-primary-600 hover:text-primary-700 hover:underline inline-flex items-center gap-1 text-sm"}
      aria-label={label}
    >
      {label}
      <ExternalLink className="w-3.5 h-3.5" aria-hidden />
    </Link>
  );
}
