/**
 * Wireframe: task-0.5.1.2-about-page.md
 * Route: /about
 * Implements: About page with MOH regulatory mission, framework overview, partnership information, and contact details.
 * Wireframe Link: ../../../../04-design/user-experience/wireframes/00-core-foundation/public-pages/task-0.5.1.2-about-page.md
 */
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-text-secondary">
        <Link href="/" className="hover:text-text-primary transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-text-primary">About</span>
      </nav>

      {/* Page Title */}
      <h1 className="mb-12 text-4xl font-bold text-text-primary">About the Platform</h1>

      {/* MOH Regulatory Mission Section */}
      <section className="mb-12 rounded-lg border border-default bg-white p-8 shadow-sm">
        <h2 className="mb-4 text-2xl font-semibold text-text-primary">MOH Regulatory Mission</h2>
        <p className="mb-4 text-base leading-relaxed text-text-secondary">
          The Pharmaceutical Governance Value Chain Platform (PM) supports the Ministry of Health&apos;s mission to
          ensure medicine availability and regulatory compliance across the pharmaceutical value chain.
        </p>
        <p className="text-base leading-relaxed text-text-secondary">
          The platform enables companies to manage their pharmaceutical registrations, monitor compliance with stock
          thresholds, and coordinate export controls while providing MOH with comprehensive oversight and governance
          tools.
        </p>
      </section>

      {/* Regulatory Framework Overview Section */}
      <section className="mb-12 rounded-lg border border-default bg-white p-8 shadow-sm">
        <h2 className="mb-4 text-2xl font-semibold text-text-primary">Regulatory Framework Overview</h2>
        <p className="mb-6 text-base leading-relaxed text-text-secondary">
          The platform implements the regulatory framework established under Law No. 09-08 and related regulations
          governing pharmaceutical governance.
        </p>
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold text-text-primary">Registry Management (RMM)</h3>
            <p className="text-base text-text-secondary">
              Product registration, company management, and submission workflows
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold text-text-primary">Compliance Monitoring (VCI)</h3>
            <p className="text-base text-text-secondary">
              Annual (AAMS), monthly (MSQ), and weekly (WSL) stock level reporting
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold text-text-primary">Export Control (ECS)</h3>
            <p className="text-base text-text-secondary">
              Export authorization and replenishment tracking
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold text-text-primary">Compliance Management (CMC)</h3>
            <p className="text-base text-text-secondary">
              Compliance scoring, dispute resolution, and reporting
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold text-text-primary">Enforcement</h3>
            <p className="text-base text-text-secondary">
              Governance actions, warnings, fines, and suspensions
            </p>
          </div>
        </div>
      </section>

      {/* Partnership Information Section */}
      <section className="mb-12 rounded-lg border border-default bg-white p-8 shadow-sm">
        <h2 className="mb-4 text-2xl font-semibold text-text-primary">Partnership Information</h2>
        <p className="mb-4 text-base leading-relaxed text-text-secondary">
          The PM platform is developed and maintained in partnership with the Ministry of Health to support regulatory
          governance and compliance management across the pharmaceutical industry.
        </p>
        <p className="text-base leading-relaxed text-text-secondary">
          The platform is designed to facilitate collaboration between pharmaceutical companies and regulatory
          authorities, ensuring transparent communication and efficient compliance workflows.
        </p>
      </section>

      {/* Contact Information Section */}
      <section className="rounded-lg border border-default bg-white p-8 shadow-sm">
        <h2 className="mb-4 text-2xl font-semibold text-text-primary">Contact Information</h2>
        <div className="space-y-2 text-base text-text-secondary">
          <p className="font-semibold text-text-primary">Ministry of Health</p>
          <p>Regulatory Affairs Department</p>
          <p>Algiers, Algeria</p>
          <p className="mt-4">
            Email:{' '}
            <Link href="/support/contact" className="text-primary-600 hover:text-primary-700 transition-colors">
              Contact Support
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
