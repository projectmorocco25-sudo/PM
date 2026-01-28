/**
 * Wireframe: task-0.5.1.2-about-page.md
 * Route: /about
 * Implements: About the Platform — MOH mission, regulatory framework, partnership, contact.
 * No DB, no API. Wireframe Link: docs/04-design/user-experience/wireframes/00-core-foundation/public-pages/task-0.5.1.2-about-page.md
 */

import Link from "next/link";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main id="main" className="flex-1">
        <div className="mx-auto max-w-[900px] px-6 py-10 md:px-6 md:py-12">
          <nav className="mb-6 text-sm text-[#4b5563]" aria-label="Breadcrumb">
            <Link href="/" className="text-[#3b82f6] hover:underline">
              Home
            </Link>
            <span className="mx-2 text-[#9ca3af]">/</span>
            <span className="text-[#111827]">About</span>
          </nav>

          <h1 className="text-[28px] font-bold text-[#111827] md:text-[36px]">
            About the Platform
          </h1>

          <div className="mt-12 space-y-12">
            {/* MOH Regulatory Mission */}
            <section
              className="rounded-lg border border-[#e5e7eb] bg-white p-8"
              aria-labelledby="mission-heading"
            >
              <h2
                id="mission-heading"
                className="mb-4 text-[28px] font-semibold text-[#111827]"
              >
                MOH Regulatory Mission
              </h2>
              <div className="space-y-4 text-base leading-[1.7] text-[#4b5563]">
                <p>
                  The Pharmaceutical Governance Value Chain Platform (PM) supports
                  the Ministry of Health&apos;s mission to ensure medicine availability
                  and regulatory compliance across the pharmaceutical value chain.
                </p>
                <p>
                  The platform enables companies to manage their pharmaceutical
                  registrations, monitor compliance with stock thresholds, and
                  coordinate export controls while providing MOH with comprehensive
                  oversight and governance tools.
                </p>
              </div>
            </section>

            {/* Regulatory Framework Overview */}
            <section
              className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-8"
              aria-labelledby="framework-heading"
            >
              <h2
                id="framework-heading"
                className="mb-4 text-[28px] font-semibold text-[#111827]"
              >
                Regulatory Framework Overview
              </h2>
              <p className="mb-6 text-base leading-[1.7] text-[#4b5563]">
                The platform implements the regulatory framework established under
                Law No. 09-08 and related regulations governing pharmaceutical
                governance.
              </p>
              <p className="mb-4 text-base font-medium text-[#111827]">
                Key regulatory requirements:
              </p>
              <ul className="space-y-4 text-base leading-[1.7] text-[#4b5563]">
                <li>
                  <span className="font-medium text-[#111827]">
                    Registry Management (RMM)
                  </span>
                  <span className="block pl-4 text-sm md:pl-6">
                    Product registration, company management, and submission
                    workflows
                  </span>
                </li>
                <li>
                  <span className="font-medium text-[#111827]">
                    Compliance Monitoring (VCI)
                  </span>
                  <span className="block pl-4 text-sm md:pl-6">
                    Annual (AAMS), monthly (MSQ), and weekly (WSL) stock level
                    reporting
                  </span>
                </li>
                <li>
                  <span className="font-medium text-[#111827]">
                    Export Control (ECS)
                  </span>
                  <span className="block pl-4 text-sm md:pl-6">
                    Export authorization and replenishment tracking
                  </span>
                </li>
                <li>
                  <span className="font-medium text-[#111827]">
                    Compliance Management (CMC)
                  </span>
                  <span className="block pl-4 text-sm md:pl-6">
                    Compliance scoring, dispute resolution, and reporting
                  </span>
                </li>
                <li>
                  <span className="font-medium text-[#111827]">Enforcement</span>
                  <span className="block pl-4 text-sm md:pl-6">
                    Governance actions, warnings, fines, and suspensions
                  </span>
                </li>
              </ul>
            </section>

            {/* Partnership Information */}
            <section
              className="rounded-lg border border-[#e5e7eb] bg-white p-6 md:p-8"
              aria-labelledby="partnership-heading"
            >
              <h2
                id="partnership-heading"
                className="mb-4 text-[28px] font-semibold text-[#111827]"
              >
                Partnership Information
              </h2>
              <div className="space-y-4 text-base leading-[1.7] text-[#4b5563]">
                <p>
                  The PM platform is developed and maintained in partnership with
                  the Ministry of Health to support regulatory governance and
                  compliance management across the pharmaceutical industry.
                </p>
                <p>
                  The platform is designed to facilitate collaboration between
                  pharmaceutical companies and regulatory authorities, ensuring
                  transparent communication and efficient compliance workflows.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section
              className="rounded-lg border-2 border-[#3b82f6] bg-[#eff6ff] p-8"
              aria-labelledby="contact-heading"
            >
              <h2
                id="contact-heading"
                className="mb-4 text-[28px] font-semibold text-[#111827]"
              >
                Contact Information
              </h2>
              <div className="space-y-2 text-base leading-[1.7] text-[#4b5563]">
                <p className="font-medium text-[#111827]">Ministry of Health</p>
                <p>For official address and contact details, please use the support channels below.</p>
                <p>
                  Support Hours: Monday – Friday, 9:00 AM – 5:00 PM
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href="/support/contact"
                  className="inline-flex h-10 min-w-[140px] items-center justify-center rounded-lg bg-[#3b82f6] px-5 text-sm font-medium text-white hover:bg-[#2563eb] focus:outline focus:outline-2 focus:outline-[#3b82f6] focus:outline-offset-2"
                >
                  Contact Support
                </Link>
                <Link
                  href="/status"
                  className="inline-flex h-10 min-w-[120px] items-center justify-center rounded-lg border-2 border-[#3b82f6] bg-transparent px-5 text-sm font-medium text-[#3b82f6] hover:bg-[#eff6ff] focus:outline focus:outline-2 focus:outline-[#3b82f6] focus:outline-offset-2"
                >
                  View Status
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
