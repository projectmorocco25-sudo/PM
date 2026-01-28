/**
 * Wireframe: task-0.5.1.9-cookie-policy.md
 * Route: /legal/cookies
 * Implements: Cookie Policy — ToC, content, Managing section, Cookie Preferences, Contact.
 * No DB, no API. Preferences UI-only; persistence via localStorage.
 * Wireframe Link: docs/04-design/user-experience/wireframes/00-core-foundation/public-pages/task-0.5.1.9-cookie-policy.md
 */

import Link from "next/link";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { CookiePreferences } from "./CookiePreferences";

const LAST_UPDATED = "January 1, 2025";

const TOC = [
  { id: "s1", label: "What Are Cookies" },
  { id: "s2", label: "How We Use Cookies" },
  { id: "s3", label: "Types of Cookies" },
  { id: "s4", label: "Third-Party Cookies" },
  { id: "s5", label: "Managing Cookies" },
  { id: "s6", label: "Your Cookie Choices" },
  { id: "s7", label: "Changes to Cookie Policy" },
  { id: "s8", label: "Contact Information" },
] as const;

export default function CookiesPage() {
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
            <span className="text-[#111827]">Cookie Policy</span>
          </nav>

          <h1 className="text-[28px] font-bold text-[#111827] md:text-[36px]">
            Cookie Policy
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

          {/* Content */}
          <div className="mt-8 space-y-8 rounded-lg border border-[#e5e7eb] bg-white p-8 md:p-12">
            <section id="s1" className="scroll-mt-8">
              <h2 className="text-[24px] font-semibold text-[#111827]">1. What Are Cookies</h2>
              <div className="mt-4 space-y-4 text-base leading-[1.7] text-[#4b5563]">
                <p>
                  Cookies are small text files that are stored on your device when you visit a
                  website. They help websites remember your preferences and improve your browsing
                  experience.
                </p>
              </div>
            </section>

            <section id="s2" className="scroll-mt-8">
              <h2 className="text-[24px] font-semibold text-[#111827]">2. How We Use Cookies</h2>
              <div className="mt-4 space-y-4 text-base leading-[1.7] text-[#4b5563]">
                <p>The PM platform uses cookies to:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Remember your login session</li>
                  <li>Maintain your preferences</li>
                  <li>Analyze platform usage</li>
                  <li>Ensure platform security</li>
                </ul>
              </div>
            </section>

            <section id="s3" className="scroll-mt-8">
              <h2 className="text-[24px] font-semibold text-[#111827]">3. Types of Cookies</h2>
              <div className="mt-4 space-y-6">
                <div>
                  <h3 className="text-[20px] font-semibold text-[#111827]">
                    Essential Cookies (Required)
                  </h3>
                  <p className="mt-2 text-base leading-[1.7] text-[#4b5563]">
                    These cookies are necessary for the platform to function properly. They cannot
                    be disabled.
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-6 text-base text-[#4b5563]">
                    <li>Session management</li>
                    <li>Authentication</li>
                    <li>Security</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-[20px] font-semibold text-[#111827]">
                    Functional Cookies (Optional)
                  </h3>
                  <p className="mt-2 text-base leading-[1.7] text-[#4b5563]">
                    These cookies enhance functionality but are not essential for platform
                    operation.
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-6 text-base text-[#4b5563]">
                    <li>Preferences</li>
                    <li>Language settings</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-[20px] font-semibold text-[#111827]">
                    Analytics Cookies (Optional)
                  </h3>
                  <p className="mt-2 text-base leading-[1.7] text-[#4b5563]">
                    These cookies help us understand how users interact with the platform.
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-6 text-base text-[#4b5563]">
                    <li>Usage statistics</li>
                    <li>Performance monitoring</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="s4" className="scroll-mt-8">
              <h2 className="text-[24px] font-semibold text-[#111827]">4. Third-Party Cookies</h2>
              <div className="mt-4 space-y-4 text-base leading-[1.7] text-[#4b5563]">
                <p>
                  We may use limited third-party services that set cookies. These are disclosed
                  in our platform documentation. You can manage optional cookies via the
                  preferences below.
                </p>
              </div>
            </section>
          </div>

          {/* Managing Cookies - highlighted */}
          <section
            id="s5"
            className="mt-8 scroll-mt-8 rounded-lg border-2 border-[#3b82f6] bg-[#eff6ff] p-8"
            aria-labelledby="managing-cookies-heading"
          >
            <h2 id="managing-cookies-heading" className="text-[24px] font-semibold text-[#111827]">
              5. Managing Cookies
            </h2>
            <div className="mt-4 space-y-4 text-base leading-[1.7] text-[#4b5563]">
              <p>You can manage your cookie preferences at any time through:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Cookie settings in your account</li>
                <li>Browser settings</li>
                <li>Cookie consent banner</li>
              </ul>
            </div>
            <a
              href="#cookie-preferences"
              className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-[#3b82f6] px-5 text-sm font-medium text-white hover:bg-[#2563eb] focus:outline focus:outline-2 focus:outline-[#3b82f6] focus:outline-offset-2"
            >
              Manage Cookie Preferences
            </a>
          </section>

          <CookiePreferences />

          {/* Content continued: s7, s8 */}
          <div className="mt-8 space-y-8 rounded-lg border border-[#e5e7eb] bg-white p-8 md:p-12">
            <section id="s7" className="scroll-mt-8">
              <h2 className="text-[24px] font-semibold text-[#111827]">7. Changes to Cookie Policy</h2>
              <div className="mt-4 space-y-4 text-base leading-[1.7] text-[#4b5563]">
                <p>
                  We may update this policy from time to time. Material changes will be
                  communicated via the platform.
                </p>
              </div>
            </section>

            <section id="s8" className="scroll-mt-8">
              <h2 className="text-[24px] font-semibold text-[#111827]">8. Contact Information</h2>
              <div className="mt-4 space-y-4 text-base leading-[1.7] text-[#4b5563]">
                <p>
                  For cookie-related inquiries, please use the Contact Support form or the
                  channels provided on the Support pages.
                </p>
              </div>
            </section>
          </div>

          {/* Contact section */}
          <section
            className="mt-8 rounded-lg border-2 border-[#3b82f6] bg-[#eff6ff] p-8"
            aria-labelledby="cookies-contact-heading"
          >
            <h2 id="cookies-contact-heading" className="text-[24px] font-semibold text-[#111827]">
              Contact Us
            </h2>
            <p className="mt-4 text-base leading-[1.6] text-[#4b5563]">
              For cookie-related inquiries, please contact:
            </p>
            <p className="mt-2 text-base text-[#4b5563]">
              Use the Contact Support form for official channels.
            </p>
            <Link
              href="/support/contact"
              className="mt-4 inline-flex items-center gap-1 text-base font-medium text-[#2563eb] hover:underline focus:outline focus:outline-2 focus:outline-[#3b82f6] focus:outline-offset-2"
            >
              Contact Support →
            </Link>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
