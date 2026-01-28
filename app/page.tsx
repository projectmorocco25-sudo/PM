/**
 * Wireframe: task-0.5.1.1-public-homepage.md
 * Route: /
 * Implements: Public homepage — MOH mission, platform features, partnership.
 * No DB, no API. Wireframe Link: docs/04-design/user-experience/wireframes/00-core-foundation/public-pages/task-0.5.1.1-public-homepage.md
 */

import Link from "next/link";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";

const FEATURES = [
  {
    title: "Registry Management",
    description:
      "Manage products, companies, and submissions across the pharmaceutical value chain.",
    href: "/about",
  },
  {
    title: "Compliance Monitoring",
    description:
      "Monitor stock levels and ensure compliance with regulatory thresholds.",
    href: "/about",
  },
  {
    title: "Export Control",
    description:
      "Control exports to ensure domestic medicine availability.",
    href: "/about",
  },
  {
    title: "Enforcement Actions",
    description:
      "Manage governance actions, warnings, fines, and suspensions.",
    href: "/about",
  },
  {
    title: "Analytics & Reporting",
    description:
      "Track compliance trends and generate regulatory reports.",
    href: "/about",
  },
] as const;

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:outline focus:outline-2 focus:outline-[#3b82f6]"
      >
        Skip to main content
      </a>
      <PublicHeader />

      <main id="main">
        {/* Hero */}
        <section
          className="bg-[#1e40af] px-6 py-16 md:py-20"
          style={{
            background:
              "linear-gradient(135deg, #1e40af 0%, #1e3a8a 50%, #1d4ed8 100%)",
          }}
          aria-labelledby="hero-title"
        >
          <div className="mx-auto max-w-[1920px] text-center">
            <h1
              id="hero-title"
              className="text-3xl font-bold tracking-tight text-white md:text-[48px] md:leading-tight"
            >
              Pharmaceutical Governance Value Chain Platform
            </h1>
            <p className="mt-4 text-lg text-white/90 md:text-2xl">
              Ensuring Medicine Availability & Compliance
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex h-12 min-w-[160px] items-center justify-center rounded-lg bg-white px-6 text-base font-semibold text-[#1e40af] hover:bg-[#f1f5f9] md:h-12"
              >
                Get Started
              </Link>
              <Link
                href="/about"
                className="inline-flex h-12 min-w-[160px] items-center justify-center rounded-lg border-2 border-white px-6 text-base font-semibold text-white hover:bg-white/10 md:h-12"
              >
                Learn More →
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          className="bg-white px-6 py-16 md:py-20"
          aria-labelledby="features-heading"
        >
          <div className="mx-auto max-w-[1920px]">
            <h2
              id="features-heading"
              className="sr-only"
            >
              Platform Features
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f) => (
                <Link
                  key={f.title}
                  href={f.href}
                  className="rounded-lg border border-[#e5e7eb] bg-white p-6 text-left transition-shadow hover:shadow-lg focus:outline focus:outline-2 focus:outline-[#3b82f6] focus:outline-offset-2"
                >
                  <h3 className="text-lg font-semibold text-[#111827]">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-[#4b5563] leading-relaxed">
                    {f.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section
          className="bg-[#f9fafb] px-6 py-14 md:py-16"
          aria-labelledby="mission-heading"
        >
          <div className="mx-auto max-w-[1920px]">
            <h2
              id="mission-heading"
              className="text-2xl font-semibold text-[#111827] md:text-[32px]"
            >
              About MOH&apos;s Regulatory Mission
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-[#4b5563]">
              The Pharmaceutical Governance Value Chain Platform supports the
              Ministry of Health&apos;s mission to ensure medicine availability
              and regulatory compliance across the pharmaceutical value chain.
            </p>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#4b5563]">
              MOH oversees governance and regulation in partnership with
              pharmaceutical companies (IPCs and Wholesalers) to fulfill the
              pharmaceutical needs of the Moroccan people, in line with Law No.
              09-08 and the regulatory framework.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-block font-medium text-[#3b82f6] hover:underline focus:outline focus:outline-2 focus:outline-[#3b82f6] focus:outline-offset-2"
            >
              Learn More About MOH&apos;s Mission →
            </Link>
          </div>
        </section>

        {/* Partnership */}
        <section
          className="bg-white px-6 py-12 md:py-14"
          aria-labelledby="partnership-heading"
        >
          <div className="mx-auto max-w-[1920px]">
            <h2
              id="partnership-heading"
              className="text-xl font-semibold text-[#111827] md:text-[28px]"
            >
              Partnership Information
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#4b5563]">
              Developed in partnership with the Ministry of Health to support
              regulatory governance and compliance management.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/support/contact"
                className="font-medium text-[#3b82f6] hover:underline focus:outline focus:outline-2 focus:outline-[#3b82f6] focus:outline-offset-2"
              >
                Contact Us
              </Link>
              <Link
                href="/about"
                className="font-medium text-[#3b82f6] hover:underline focus:outline focus:outline-2 focus:outline-[#3b82f6] focus:outline-offset-2"
              >
                About
              </Link>
              <Link
                href="/support"
                className="font-medium text-[#3b82f6] hover:underline focus:outline focus:outline-2 focus:outline-[#3b82f6] focus:outline-offset-2"
              >
                Support
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
