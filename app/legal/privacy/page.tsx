/**
 * Wireframe: task-0.5.1.8-privacy-policy.md
 * Route: /legal/privacy
 * Implements: Privacy Policy — ToC, content, GDPR/CNDP highlight, Contact section.
 * No DB, no API.
 * Wireframe Link: docs/04-design/user-experience/wireframes/00-core-foundation/public-pages/task-0.5.1.8-privacy-policy.md
 */

import Link from "next/link";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";

const LAST_UPDATED = "January 1, 2025";

const TOC = [
  { id: "s1", label: "Introduction" },
  { id: "s2", label: "Data Controller" },
  { id: "s3", label: "Information We Collect" },
  { id: "s4", label: "How We Use Your Information" },
  { id: "s5", label: "Data Sharing and Disclosure" },
  { id: "s6", label: "Data Security" },
  { id: "s7", label: "Your Rights (GDPR & CNDP)" },
  { id: "s8", label: "Data Retention" },
  { id: "s9", label: "Cookies and Tracking" },
  { id: "s10", label: "Changes to Privacy Policy" },
  { id: "s11", label: "Contact Information" },
] as const;

export default function PrivacyPage() {
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
            <span className="text-[#111827]">Privacy Policy</span>
          </nav>

          <h1 className="text-[28px] font-bold text-[#111827] md:text-[36px]">
            Privacy Policy
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
              <h2 className="text-[24px] font-semibold text-[#111827]">1. Introduction</h2>
              <div className="mt-4 space-y-4 text-base leading-[1.7] text-[#4b5563]">
                <p>
                  The Ministry of Health (&quot;MOH&quot;, &quot;we&quot;, &quot;us&quot;) is committed to protecting your
                  privacy and personal data. This Privacy Policy explains how we collect, use,
                  disclose, and protect your personal information when you use the Pharmaceutical
                  Governance Value Chain Platform (PM).
                </p>
                <p>
                  This policy complies with applicable data protection laws, including the General
                  Data Protection Regulation (GDPR) and the Commission Nationale de contrôle de la
                  protection des Données à caractère personnel (CNDP) requirements.
                </p>
              </div>
            </section>

            <section id="s2" className="scroll-mt-8">
              <h2 className="text-[24px] font-semibold text-[#111827]">2. Data Controller</h2>
              <div className="mt-4 space-y-4 text-base leading-[1.7] text-[#4b5563]">
                <p>
                  The Ministry of Health is the data controller for personal data processed
                  through the PM platform. For contact details, please use the Contact section
                  below or the{" "}
                  <Link href="/support/contact" className="text-[#2563eb] hover:underline">
                    Contact Support
                  </Link>{" "}
                  form.
                </p>
              </div>
            </section>

            <section id="s3" className="scroll-mt-8">
              <h2 className="text-[24px] font-semibold text-[#111827]">3. Information We Collect</h2>
              <div className="mt-4 space-y-4 text-base leading-[1.7] text-[#4b5563]">
                <p>We collect the following types of information:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Account information (name, email, company)</li>
                  <li>Submission data (products, compliance reports)</li>
                  <li>Usage data (platform activity, logs)</li>
                  <li>Communication data (messages, support requests)</li>
                </ul>
              </div>
            </section>

            <section id="s4" className="scroll-mt-8">
              <h2 className="text-[24px] font-semibold text-[#111827]">4. How We Use Your Information</h2>
              <div className="mt-4 space-y-4 text-base leading-[1.7] text-[#4b5563]">
                <p>
                  We use your information to operate the platform, process submissions, ensure
                  regulatory compliance, communicate with you, and improve our services. We
                  process data only where we have a legal basis to do so.
                </p>
              </div>
            </section>

            <section id="s5" className="scroll-mt-8">
              <h2 className="text-[24px] font-semibold text-[#111827]">5. Data Sharing and Disclosure</h2>
              <div className="mt-4 space-y-4 text-base leading-[1.7] text-[#4b5563]">
                <p>
                  We may share data with authorised regulatory bodies, service providers acting
                  on our behalf, or when required by law. We do not sell your personal data.
                </p>
              </div>
            </section>

            <section id="s6" className="scroll-mt-8">
              <h2 className="text-[24px] font-semibold text-[#111827]">6. Data Security</h2>
              <div className="mt-4 space-y-4 text-base leading-[1.7] text-[#4b5563]">
                <p>
                  We implement appropriate technical and organisational measures to protect your
                  personal data against unauthorised access, loss, or alteration.
                </p>
              </div>
            </section>

            {/* GDPR & CNDP - highlighted */}
            <section
              id="s7"
              className="scroll-mt-8 rounded-lg border-2 border-[#3b82f6] bg-[#eff6ff] p-6"
            >
              <h2 className="text-[24px] font-semibold text-[#111827]">
                7. Your Rights (GDPR & CNDP)
              </h2>
              <div className="mt-4 space-y-4 text-base leading-[1.7] text-[#4b5563]">
                <p>
                  Under applicable data protection laws, you have the following rights:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Right to access your personal data</li>
                  <li>Right to rectify inaccurate data</li>
                  <li>Right to erasure (&quot;right to be forgotten&quot;)</li>
                  <li>Right to restrict processing</li>
                  <li>Right to data portability</li>
                  <li>Right to object to processing</li>
                  <li>Right to withdraw consent</li>
                </ul>
                <p>
                  To exercise your rights, please contact us via the{" "}
                  <Link href="/support/contact" className="text-[#2563eb] hover:underline">
                    Contact Support
                  </Link>{" "}
                  form.
                </p>
              </div>
            </section>

            <section id="s8" className="scroll-mt-8">
              <h2 className="text-[24px] font-semibold text-[#111827]">8. Data Retention</h2>
              <div className="mt-4 space-y-4 text-base leading-[1.7] text-[#4b5563]">
                <p>
                  We retain personal data only for as long as necessary to fulfil the purposes
                  described in this policy and to comply with legal and regulatory obligations.
                </p>
              </div>
            </section>

            <section id="s9" className="scroll-mt-8">
              <h2 className="text-[24px] font-semibold text-[#111827]">9. Cookies and Tracking</h2>
              <div className="mt-4 space-y-4 text-base leading-[1.7] text-[#4b5563]">
                <p>
                  We use cookies and similar technologies as described in our{" "}
                  <Link href="/legal/cookies" className="text-[#2563eb] hover:underline">
                    Cookie Policy
                  </Link>
                  .
                </p>
              </div>
            </section>

            <section id="s10" className="scroll-mt-8">
              <h2 className="text-[24px] font-semibold text-[#111827]">10. Changes to Privacy Policy</h2>
              <div className="mt-4 space-y-4 text-base leading-[1.7] text-[#4b5563]">
                <p>
                  We may update this policy from time to time. Material changes will be
                  communicated via the platform or by other appropriate means.
                </p>
              </div>
            </section>

            <section id="s11" className="scroll-mt-8">
              <h2 className="text-[24px] font-semibold text-[#111827]">11. Contact Information</h2>
              <div className="mt-4 space-y-4 text-base leading-[1.7] text-[#4b5563]">
                <p>
                  For privacy-related inquiries, please use the Contact Support form or the
                  contact channels provided on the Support pages.
                </p>
              </div>
            </section>
          </div>

          {/* Contact section */}
          <section
            className="mt-8 rounded-lg border-2 border-[#3b82f6] bg-[#eff6ff] p-8"
            aria-labelledby="privacy-contact-heading"
          >
            <h2 id="privacy-contact-heading" className="text-[24px] font-semibold text-[#111827]">
              Contact Us
            </h2>
            <p className="mt-4 text-base leading-[1.6] text-[#4b5563]">
              For privacy-related inquiries, please contact:
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
