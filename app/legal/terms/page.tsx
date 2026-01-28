/**
 * Wireframe: task-0.5.1.7-terms-of-service.md
 * Route: /legal/terms
 * Implements: Terms of Service — ToC, legal content, acceptance checkbox + button.
 * No DB, no API.
 * Wireframe Link: docs/04-design/user-experience/wireframes/00-core-foundation/public-pages/task-0.5.1.7-terms-of-service.md
 */

import Link from "next/link";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { TermsAcceptance } from "./TermsAcceptance";

const LAST_UPDATED = "January 1, 2025";

const TOC = [
  { id: "s1", label: "Acceptance of Terms" },
  { id: "s2", label: "Use of the Platform" },
  { id: "s3", label: "User Accounts" },
  { id: "s4", label: "Regulatory Compliance" },
  { id: "s5", label: "Intellectual Property" },
  { id: "s6", label: "Privacy and Data Protection" },
  { id: "s7", label: "Limitation of Liability" },
  { id: "s8", label: "Termination" },
  { id: "s9", label: "Governing Law" },
  { id: "s10", label: "Changes to Terms" },
] as const;

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main id="main" className="flex-1">
        <div className="mx-auto max-w-[900px] px-6 py-10 md:py-12">
          <nav className="mb-6 text-sm text-[#4b5563]" aria-label="Breadcrumb">
            <Link href="/" className="text-[#3b82f6] hover:underline">
              Home
            </Link>
            <span className="mx-2 text-[#9ca3af]">/</span>
            <span className="text-[#111827]">Legal</span>
            <span className="mx-2 text-[#9ca3af]">/</span>
            <span className="text-[#111827]">Terms of Service</span>
          </nav>

          <h1 className="text-[28px] font-bold text-[#111827] md:text-[36px]">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm italic text-[#6b7280]">
            Last updated: {LAST_UPDATED}
          </p>

          {/* Table of Contents */}
          <nav
            className="mt-8 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-6"
            aria-label="Table of contents"
          >
            <h2 className="mb-4 text-lg font-semibold text-[#111827]">Table of Contents</h2>
            <ol className="list-decimal space-y-2 pl-5 text-base text-[#4b5563]">
              {TOC.map(({ id, label }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="text-[#2563eb] hover:underline focus:outline focus:outline-2 focus:outline-[#3b82f6] focus:outline-offset-2"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Terms Content */}
          <div className="mt-8 space-y-8 rounded-lg border border-[#e5e7eb] bg-white p-8 md:p-12">
            <section id="s1" className="scroll-mt-8">
              <h2 className="text-[24px] font-semibold text-[#111827]">1. Acceptance of Terms</h2>
              <div className="mt-4 space-y-4 text-base leading-[1.7] text-[#4b5563]">
                <p>
                  By accessing and using the Pharmaceutical Governance Value Chain Platform (PM),
                  you agree to be bound by these Terms of Service and all applicable laws and
                  regulations. If you do not agree with any part of these terms, you must not use
                  the platform.
                </p>
              </div>
            </section>

            <section id="s2" className="scroll-mt-8">
              <h2 className="text-[24px] font-semibold text-[#111827]">2. Use of the Platform</h2>
              <div className="mt-4 space-y-4 text-base leading-[1.7] text-[#4b5563]">
                <p>
                  The PM platform is a regulatory governance system operated by the Ministry of
                  Health. Users must comply with all applicable laws and regulations, including
                  Law No. 09-08 and related pharmaceutical governance requirements.
                </p>
                <p>Users are prohibited from:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Attempting to gain unauthorized access to the platform or other accounts</li>
                  <li>Interfering with platform operations or security</li>
                  <li>Submitting false or misleading information</li>
                  <li>Violating regulatory requirements</li>
                </ul>
              </div>
            </section>

            <section id="s3" className="scroll-mt-8">
              <h2 className="text-[24px] font-semibold text-[#111827]">3. User Accounts</h2>
              <div className="mt-4 space-y-4 text-base leading-[1.7] text-[#4b5563]">
                <p>
                  You must register for an account to use certain platform features. You are
                  responsible for maintaining the confidentiality of your credentials and for all
                  activity under your account. You must notify MOH promptly of any unauthorized
                  use.
                </p>
              </div>
            </section>

            <section id="s4" className="scroll-mt-8">
              <h2 className="text-[24px] font-semibold text-[#111827]">4. Regulatory Compliance</h2>
              <div className="mt-4 space-y-4 text-base leading-[1.7] text-[#4b5563]">
                <p>
                  Use of the platform is subject to regulatory requirements under Law No. 09-08
                  and related regulations. You must comply with all applicable compliance
                  obligations, including reporting, submissions, and data accuracy.
                </p>
              </div>
            </section>

            <section id="s5" className="scroll-mt-8">
              <h2 className="text-[24px] font-semibold text-[#111827]">5. Intellectual Property</h2>
              <div className="mt-4 space-y-4 text-base leading-[1.7] text-[#4b5563]">
                <p>
                  The platform, including its design, content, and software, is owned by the
                  Ministry of Health or its licensors. You may not copy, modify, or distribute
                  platform materials without authorization.
                </p>
              </div>
            </section>

            <section id="s6" className="scroll-mt-8">
              <h2 className="text-[24px] font-semibold text-[#111827]">6. Privacy and Data Protection</h2>
              <div className="mt-4 space-y-4 text-base leading-[1.7] text-[#4b5563]">
                <p>
                  Your use of the platform is also governed by our{" "}
                  <Link href="/legal/privacy" className="text-[#2563eb] hover:underline">
                    Privacy Policy
                  </Link>
                  , which describes how we collect, use, and protect personal data in accordance
                  with applicable law and CNDP requirements.
                </p>
              </div>
            </section>

            <section id="s7" className="scroll-mt-8">
              <h2 className="text-[24px] font-semibold text-[#111827]">7. Limitation of Liability</h2>
              <div className="mt-4 space-y-4 text-base leading-[1.7] text-[#4b5563]">
                <p>
                  To the extent permitted by law, MOH and its affiliates are not liable for
                  indirect, incidental, or consequential damages arising from your use of the
                  platform. Liability is limited to the extent required by applicable law.
                </p>
              </div>
            </section>

            <section id="s8" className="scroll-mt-8">
              <h2 className="text-[24px] font-semibold text-[#111827]">8. Termination</h2>
              <div className="mt-4 space-y-4 text-base leading-[1.7] text-[#4b5563]">
                <p>
                  MOH may suspend or terminate your access to the platform for violation of these
                  terms or applicable law. You may cease use at any time. Provisions that by
                  nature survive termination will remain in effect.
                </p>
              </div>
            </section>

            <section id="s9" className="scroll-mt-8">
              <h2 className="text-[24px] font-semibold text-[#111827]">9. Governing Law</h2>
              <div className="mt-4 space-y-4 text-base leading-[1.7] text-[#4b5563]">
                <p>
                  These terms are governed by the laws of the applicable jurisdiction. Any
                  disputes shall be resolved in accordance with applicable legal procedures.
                </p>
              </div>
            </section>

            <section id="s10" className="scroll-mt-8">
              <h2 className="text-[24px] font-semibold text-[#111827]">10. Changes to Terms</h2>
              <div className="mt-4 space-y-4 text-base leading-[1.7] text-[#4b5563]">
                <p>
                  MOH may update these terms from time to time. We will notify users of material
                  changes. Continued use of the platform after changes constitutes acceptance of
                  the updated terms.
                </p>
              </div>
            </section>
          </div>

          <TermsAcceptance />
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
