/**
 * Wireframe: task-0.5.1.37-support-center.md
 * Route: /support
 * Implements: Support Center — help cards, support options, hours, quick links.
 * No DB, no API.
 * Wireframe Link: docs/04-design/user-experience/wireframes/00-core-foundation/public-pages/task-0.5.1.37-support-center.md
 */

import Link from "next/link";
import { BookOpen, MessageCircle, FileText } from "lucide-react";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";

const HELP_CARDS = [
  {
    icon: BookOpen,
    title: "FAQ",
    description: "Browse frequently asked questions and find quick answers.",
    cta: "View FAQ",
    href: "/support/faq",
  },
  {
    icon: MessageCircle,
    title: "Contact Support",
    description: "Get help from our support team.",
    cta: "Contact",
    href: "/support/contact",
  },
  {
    icon: FileText,
    title: "Documentation",
    description: "Access user guides, tutorials, and API documentation.",
    cta: "View Docs",
    href: "/support/documentation",
  },
] as const;

const QUICK_LINKS = [
  { label: "Getting Started Guide", href: "/support/documentation#getting-started" },
  { label: "Platform Features", href: "/about" },
  { label: "Account Management", href: "/support/faq#account" },
  { label: "Submission Workflows", href: "/support/documentation#workflow" },
  { label: "Compliance Reporting", href: "/support/documentation#compliance" },
  { label: "System Status", href: "/status" },
] as const;

export default function SupportCenterPage() {
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
            <span className="text-[#111827]">Support Center</span>
          </nav>

          <h1 className="text-[28px] font-bold text-[#111827] md:text-[36px]">
            Support Center
          </h1>

          <div className="mt-12 space-y-12">
            {/* Help Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {HELP_CARDS.map(({ icon: Icon, title, description, cta, href }) => (
                <div
                  key={href}
                  className="flex flex-col rounded-lg border border-[#e5e7eb] bg-white p-8 transition-shadow hover:border-[#d1d5db] hover:shadow-md"
                >
                  <div className="mb-4 flex justify-center">
                    <Icon className="h-12 w-12 text-[#6b7280]" aria-hidden />
                  </div>
                  <h2 className="text-[20px] font-semibold text-[#111827]">{title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[#6b7280]">
                    {description}
                  </p>
                  <Link
                    href={href}
                    className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-[#2563eb] hover:underline focus:outline focus:outline-2 focus:outline-[#3b82f6] focus:outline-offset-2"
                  >
                    {cta} →
                  </Link>
                </div>
              ))}
            </div>

            {/* Support Options */}
            <section aria-labelledby="support-options-heading">
              <h2
                id="support-options-heading"
                className="mb-6 text-[28px] font-semibold text-[#111827]"
              >
                Support Options
              </h2>
              <div className="rounded-lg border border-[#e5e7eb] bg-white p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-6">
                    <h3 className="text-lg font-semibold text-[#111827]">Email Support</h3>
                    <p className="mt-2 text-sm text-[#4b5563]">
                      Use the contact form for official support. Response: 24–48 hours.
                    </p>
                    <Link
                      href="/support/contact"
                      className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-[#3b82f6] px-4 text-sm font-medium text-white hover:bg-[#2563eb] focus:outline focus:outline-2 focus:outline-[#3b82f6] focus:outline-offset-2"
                    >
                      Contact Support
                    </Link>
                  </div>
                  <div className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-6">
                    <h3 className="text-lg font-semibold text-[#111827]">Phone Support</h3>
                    <p className="mt-2 text-sm text-[#4b5563]">
                      Hours: Monday – Friday, 9:00 AM – 5:00 PM. Use contact form for details.
                    </p>
                    <Link
                      href="/support/contact"
                      className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-[#3b82f6] px-4 text-sm font-medium text-white hover:bg-[#2563eb] focus:outline focus:outline-2 focus:outline-[#3b82f6] focus:outline-offset-2"
                    >
                      Contact Support
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Support Hours */}
            <section
              className="rounded-lg border border-[#e5e7eb] bg-white p-8"
              aria-labelledby="support-hours-heading"
            >
              <h2
                id="support-hours-heading"
                className="mb-4 text-[24px] font-semibold text-[#111827]"
              >
                Support Hours
              </h2>
              <div className="space-y-2 text-base leading-[1.6] text-[#4b5563]">
                <p>Monday – Friday: 9:00 AM – 5:00 PM</p>
                <p>Saturday – Sunday: Closed</p>
                <p>Public Holidays: Closed</p>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-[#111827]">Response Times</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-base leading-[1.6] text-[#4b5563]">
                <li>Email: 24–48 hours</li>
                <li>Phone: Immediate during support hours</li>
                <li>Urgent issues: Contact support for escalation</li>
              </ul>
            </section>

            {/* Quick Links */}
            <section
              className="rounded-lg border border-[#3b82f6] bg-[#eff6ff] p-8"
              aria-labelledby="quick-links-heading"
            >
              <h2
                id="quick-links-heading"
                className="mb-4 text-[24px] font-semibold text-[#111827]"
              >
                Quick Links
              </h2>
              <ul className="space-y-2">
                {QUICK_LINKS.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-base text-[#2563eb] hover:underline focus:outline focus:outline-2 focus:outline-[#3b82f6] focus:outline-offset-2"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
