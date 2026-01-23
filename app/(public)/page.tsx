/**
 * Wireframe: task-0.5.1.1-public-homepage.md
 * Route: /
 * Implements: Public homepage with hero section, features, mission, and partnership information.
 * Wireframe Link: ../../../../04-design/user-experience/wireframes/00-core-foundation/public-pages/task-0.5.1.1-public-homepage.md
 */
import Link from 'next/link';
import { Building2, ShieldCheck, Upload, Scale, BarChart } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 px-6 py-20 text-center text-white">
        <div className="container mx-auto">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">
            Pharmaceutical Governance Value Chain Platform
          </h1>
          <p className="mb-8 text-xl md:text-2xl text-primary-100">
            Ensuring Medicine Availability & Compliance
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="rounded-md bg-white px-8 py-3 text-base font-semibold text-primary-600 transition-colors hover:bg-primary-50"
            >
              Get Started
            </Link>
            <Link
              href="/about"
              className="rounded-md border-2 border-white px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              Learn More →
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white px-6 py-16">
        <div className="container mx-auto">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Registry Management */}
            <div className="rounded-lg border border-default bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <Building2 className="mb-4 h-12 w-12 text-primary-500" />
              <h3 className="mb-2 text-xl font-semibold text-text-primary">Registry Management</h3>
              <p className="text-text-secondary">
                Manage products, companies, and submissions efficiently and ensure regulatory compliance.
              </p>
            </div>

            {/* Compliance Monitoring */}
            <div className="rounded-lg border border-default bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <ShieldCheck className="mb-4 h-12 w-12 text-success-500" />
              <h3 className="mb-2 text-xl font-semibold text-text-primary">Compliance Monitoring</h3>
              <p className="text-text-secondary">
                Monitor stock levels and ensure compliance with thresholds and regulatory requirements.
              </p>
            </div>

            {/* Export Control */}
            <div className="rounded-lg border border-default bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <Upload className="mb-4 h-12 w-12 text-warning-500" />
              <h3 className="mb-2 text-xl font-semibold text-text-primary">Export Control</h3>
              <p className="text-text-secondary">
                Control exports to ensure domestic availability and regulatory compliance.
              </p>
            </div>

            {/* Enforcement Actions */}
            <div className="rounded-lg border border-default bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <Scale className="mb-4 h-12 w-12 text-error-500" />
              <h3 className="mb-2 text-xl font-semibold text-text-primary">Enforcement Actions</h3>
              <p className="text-text-secondary">
                Manage governance actions, warnings, fines, and suspensions effectively.
              </p>
            </div>

            {/* Analytics & Reporting */}
            <div className="rounded-lg border border-default bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <BarChart className="mb-4 h-12 w-12 text-info-500" />
              <h3 className="mb-2 text-xl font-semibold text-text-primary">Analytics & Reporting</h3>
              <p className="text-text-secondary">
                Track compliance trends and generate regulatory reports for informed decision-making.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-bg-secondary px-6 py-16">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-semibold text-text-primary">About MOH&apos;s Regulatory Mission</h2>
          <p className="mb-4 text-base leading-relaxed text-text-secondary">
            The Pharmaceutical Governance Value Chain Platform supports the Ministry of Health&apos;s mission to ensure
            medicine availability and regulatory compliance across the pharmaceutical value chain.
          </p>
          <p className="mb-8 text-base leading-relaxed text-text-secondary">
            Our platform provides comprehensive tools for registry management, compliance monitoring, export control,
            enforcement actions, and analytics to support effective regulatory governance.
          </p>
          <Link
            href="/about"
            className="inline-block text-base font-semibold text-primary-600 hover:text-primary-700 transition-colors"
          >
            Learn More About MOH&apos;s Mission →
          </Link>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="bg-white px-6 py-12">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-2xl font-semibold text-text-primary">Partnership Information</h2>
          <p className="mb-6 text-base text-text-secondary">
            Developed in partnership with the Ministry of Health to support regulatory governance and compliance
            management.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/support/contact"
              className="text-base font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/about"
              className="text-base font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              About
            </Link>
            <Link
              href="/support"
              className="text-base font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
