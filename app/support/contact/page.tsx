/**
 * Wireframe: task-0.5.1.39-contact-support.md
 * Route: /support/contact
 * Implements: Contact Support — form, support channels, escalation procedures.
 * No DB, no API. Form UI only; submission backend out of scope for 1.1.1.15.
 * Wireframe Link: docs/04-design/user-experience/wireframes/00-core-foundation/public-pages/task-0.5.1.39-contact-support.md
 */

import Link from "next/link";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { ContactForm } from "./ContactForm";

export default function ContactSupportPage() {
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
            <Link href="/support" className="text-[#3b82f6] hover:underline">
              Support
            </Link>
            <span className="mx-2 text-[#9ca3af]">/</span>
            <span className="text-[#111827]">Contact Support</span>
          </nav>

          <h1 className="text-[28px] font-bold text-[#111827] md:text-[36px]">
            Contact Support
          </h1>

          <div className="mt-12 space-y-12">
            <ContactForm />

            <section
              className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-8"
              aria-labelledby="support-channels-heading"
            >
              <h2
                id="support-channels-heading"
                className="mb-4 text-[24px] font-semibold text-[#111827]"
              >
                Support Channels
              </h2>
              <div className="space-y-6 text-base leading-[1.6] text-[#4b5563]">
                <div>
                  <h3 className="font-semibold text-[#111827]">Email Support</h3>
                  <p>Use the contact form above for official support.</p>
                  <p className="mt-1 text-sm">Response time: 24–48 hours.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-[#111827]">Phone Support</h3>
                  <p>Hours: Monday – Friday, 9:00 AM – 5:00 PM.</p>
                  <p className="mt-1 text-sm">
                    For official contact details, use the form or refer to MOH communications.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-[#111827]">Office Address</h3>
                  <p>Ministry of Health. For official address, use the contact form or MOH official channels.</p>
                </div>
              </div>
            </section>

            <section
              className="rounded-lg border border-[#3b82f6] bg-[#eff6ff] p-8"
              aria-labelledby="escalation-heading"
            >
              <h2
                id="escalation-heading"
                className="mb-4 text-[24px] font-semibold text-[#111827]"
              >
                Escalation Procedures
              </h2>
              <div className="space-y-4 text-base leading-[1.6] text-[#4b5563]">
                <p>
                  For urgent regulatory issues, please contact support immediately via phone
                  during support hours. After-hours emergencies should be reported through the
                  designated emergency contact channel.
                </p>
                <p>
                  Regulatory compliance issues requiring immediate attention will be
                  prioritized and escalated according to MOH protocols.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
