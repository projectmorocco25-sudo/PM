/**
 * Wireframe: N/A (Legal Page)
 * Route: /legal/privacy
 * Implements: Privacy Policy page.
 * Wireframe Link: N/A
 */
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-6 py-12">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-text-secondary">
        <Link href="/" className="hover:text-text-primary transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-text-primary">Privacy Policy</span>
      </nav>

      {/* Page Title */}
      <h1 className="mb-8 text-4xl font-bold text-text-primary">Privacy Policy</h1>

      {/* Privacy Content */}
      <div className="space-y-6 rounded-lg border border-default bg-white p-8 shadow-sm">
        <section>
          <h2 className="mb-4 text-2xl font-semibold text-text-primary">1. Data Protection Framework</h2>
          <p className="text-base leading-relaxed text-text-secondary">
            The Pharmaceutical Governance Value Chain Platform (PM) is committed to protecting your privacy in
            accordance with Law No. 09-08 (CNDP) data protection requirements and related regulations.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-text-primary">2. Information We Collect</h2>
          <p className="mb-4 text-base leading-relaxed text-text-secondary">
            We collect information that you provide directly to us, including:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-base text-text-secondary">
            <li>Company registration information</li>
            <li>User account information (name, email, role)</li>
            <li>Compliance submission data</li>
            <li>Communication records</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-text-primary">3. How We Use Your Information</h2>
          <p className="text-base leading-relaxed text-text-secondary">
            We use the information we collect to provide, maintain, and improve our services, process compliance
            submissions, communicate with you, and ensure regulatory compliance.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-text-primary">4. Data Retention</h2>
          <p className="text-base leading-relaxed text-text-secondary">
            We retain your data in accordance with regulatory requirements, including the 7-year retention period
            specified under Law No. 09-08.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-text-primary">5. Your Rights</h2>
          <p className="mb-4 text-base leading-relaxed text-text-secondary">
            Under Law No. 09-08, you have the right to:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-base text-text-secondary">
            <li>Access your personal data</li>
            <li>Rectify inaccurate data</li>
            <li>Request deletion of your data (subject to regulatory requirements)</li>
            <li>Object to processing of your data</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-text-primary">6. Contact Information</h2>
          <p className="text-base leading-relaxed text-text-secondary">
            For questions about this Privacy Policy or to exercise your rights, please contact us through the{' '}
            <Link href="/support/contact" className="text-primary-600 hover:text-primary-700 transition-colors">
              Support Center
            </Link>
            .
          </p>
        </section>

        <div className="mt-8 border-t border-default pt-6 text-sm text-text-tertiary">
          <p>Last updated: January 2025</p>
        </div>
      </div>
    </div>
  );
}
