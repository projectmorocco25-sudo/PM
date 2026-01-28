/**
 * Wireframe: task-0.5.1.1-public-homepage.md
 * Footer: MOH logo, © 2025 Ministry of Health, Terms, Privacy, Cookies.
 * Dark bg #111827, text #9ca3af.
 */

import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="bg-[#111827] py-8 px-6 text-[#9ca3af]" role="contentinfo">
      <div className="mx-auto flex max-w-[1920px] flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="text-lg font-bold text-white" aria-label="MOH – Home">
          MOH
        </Link>
        <p className="text-sm">
          © 2025 Ministry of Health. All rights reserved.
        </p>
        <nav className="flex flex-wrap gap-4" aria-label="Legal">
          <Link href="/legal/terms" className="text-sm hover:text-white hover:underline">
            Terms
          </Link>
          <Link href="/legal/privacy" className="text-sm hover:text-white hover:underline">
            Privacy
          </Link>
          <Link href="/legal/cookies" className="text-sm hover:text-white hover:underline">
            Cookies
          </Link>
        </nav>
      </div>
    </footer>
  );
}
