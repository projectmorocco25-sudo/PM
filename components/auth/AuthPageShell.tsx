"use client";

/**
 * Shared auth layout: Back link, MOH logo, centered form container.
 * Wireframes: 0.5.1.11, 0.5.1.12, 0.5.1.13.
 */

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type AuthPageShellProps = {
  maxWidth?: "400" | "480";
  title?: string;
  children: React.ReactNode;
};

export function AuthPageShell({
  maxWidth = "400",
  title,
  children,
}: AuthPageShellProps) {
  return (
    <div className="relative min-h-screen w-full">
      <Link
        href="/"
        className="absolute left-6 top-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#6b7280] transition-colors hover:text-[#2563eb] hover:underline focus:text-[#2563eb] md:left-8 md:top-8"
        aria-label="Back to homepage"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back
      </Link>

      <div className="flex min-h-screen flex-col items-center pt-20 pb-12">
        <div className="mb-6 flex justify-center">
          <Link href="/" className="block transition-opacity hover:opacity-80 focus:opacity-80">
            <span className="text-2xl font-bold text-[#111827]">MOH</span>
          </Link>
        </div>

        <div
          className={`w-full ${maxWidth === "400" ? "max-w-[400px]" : "max-w-[480px]"} mx-4 rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm md:mx-0 md:p-8`}
        >
          {title ? (
            <h1 className="text-center text-2xl font-semibold text-[#111827]">
              {title}
            </h1>
          ) : null}
          {children}
        </div>
      </div>
    </div>
  );
}
