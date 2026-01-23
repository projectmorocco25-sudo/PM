/**
 * Wireframe: N/A (Legal Page)
 * Route: /legal/terms
 * Implements: Terms of Service page.
 * Wireframe Link: N/A
 */
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-6 py-12">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-text-secondary">
        <Link href="/" className="hover:text-text-primary transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-text-primary">Terms of Service</span>
      </nav>

      {/* Page Title */}
      <h1 className="mb-8 text-4xl font-bold text-text-primary">Terms of Service</h1>

      {/* Terms Content */}
      <div className="space-y-6 rounded-lg border border-default bg-white p-8 shadow-sm">
        <section>
          <h2 className="mb-4 text-2xl font-semibold text-text-primary">1. Acceptance of Terms</h2>
          <p className="text-base leading-relaxed text-text-secondary">
            By accessing and using the Pharmaceutical Governance Value Chain Platform (PM), you accept and agree to be
            bound by the terms and provision of this agreement.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-text-primary">2. Use License</h2>
          <p className="mb-4 text-base leading-relaxed text-text-secondary">
            Permission is granted to temporarily access the materials on the PM platform for personal, non-commercial
            transitory viewing only. This is the grant of a license, not a transfer of title, and under this license
            you may not:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-base text-text-secondary">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to reverse engineer any software contained on the platform</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-text-primary">3. Regulatory Compliance</h2>
          <p className="text-base leading-relaxed text-text-secondary">
            Users are required to comply with all applicable laws and regulations, including Law No. 09-08 and related
            pharmaceutical governance regulations. Failure to comply may result in enforcement actions.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-text-primary">4. Data Protection</h2>
          <p className="text-base leading-relaxed text-text-secondary">
            Your use of the platform is subject to our Privacy Policy. By using the platform, you consent to the
            collection and use of information in accordance with Law No. 09-08 (CNDP) data protection requirements.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-text-primary">5. Contact Information</h2>
          <p className="text-base leading-relaxed text-text-secondary">
            For questions about these Terms of Service, please contact us through the{' '}
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
