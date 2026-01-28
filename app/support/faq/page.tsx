/**
 * Wireframe: task-0.5.1.38-faq-page.md
 * Route: /support/faq
 * Implements: Frequently Asked Questions — search, categories, expandable Q&A.
 * No DB, no API.
 * Wireframe Link: docs/04-design/user-experience/wireframes/00-core-foundation/public-pages/task-0.5.1.38-faq-page.md
 */

import Link from "next/link";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { FAQContent } from "./FAQContent";

export default function FAQPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main id="main" className="flex-1">
        <div className="mx-auto max-w-[1200px] px-6 py-10 md:py-12">
          <nav className="mb-6 text-sm text-[#4b5563]" aria-label="Breadcrumb">
            <Link href="/" className="text-[#3b82f6] hover:underline">
              Home
            </Link>
            <span className="mx-2 text-[#9ca3af]">/</span>
            <Link href="/support" className="text-[#3b82f6] hover:underline">
              Support
            </Link>
            <span className="mx-2 text-[#9ca3af]">/</span>
            <span className="text-[#111827]">FAQ</span>
          </nav>

          <h1 className="text-[28px] font-bold text-[#111827] md:text-[36px]">
            Frequently Asked Questions
          </h1>

          <FAQContent />

          <p className="mt-12 text-base text-[#4b5563]">
            Still have questions?{" "}
            <Link
              href="/support/contact"
              className="font-medium text-[#2563eb] hover:underline focus:outline focus:outline-2 focus:outline-[#3b82f6] focus:outline-offset-2"
            >
              Contact Support →
            </Link>
          </p>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
