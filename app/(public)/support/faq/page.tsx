/**
 * Wireframe: task-0.5.1.38-faq-page.md
 * Route: /support/faq
 * Implements: FAQ page with frequently asked questions and answers.
 * Wireframe Link: ../../../../../04-design/user-experience/wireframes/00-core-foundation/public-pages/task-0.5.1.38-faq-page.md
 */
import Link from 'next/link';

export default function FAQPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-text-secondary">
        <Link href="/" className="hover:text-text-primary transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/support" className="hover:text-text-primary transition-colors">
          Support
        </Link>
        <span className="mx-2">/</span>
        <span className="text-text-primary">FAQ</span>
      </nav>

      {/* Page Title */}
      <h1 className="mb-12 text-4xl font-bold text-text-primary">Frequently Asked Questions</h1>

      {/* FAQ Content */}
      <div className="space-y-6">
        <div className="rounded-lg border border-default bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-xl font-semibold text-text-primary">How do I register my company?</h2>
          <p className="text-base text-text-secondary">
            You can register your company by clicking the &quot;Register&quot; button in the header and filling out the
            registration form with your company information.
          </p>
        </div>

        <div className="rounded-lg border border-default bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-xl font-semibold text-text-primary">How do I submit compliance reports?</h2>
          <p className="text-base text-text-secondary">
            After logging in, navigate to the Value Chain Intelligence (VCI) module and select the appropriate
            submission type (AAMS, MSQ, or WSL) to submit your compliance reports.
          </p>
        </div>

        <div className="rounded-lg border border-default bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-xl font-semibold text-text-primary">What are the submission deadlines?</h2>
          <p className="text-base text-text-secondary">
            Submission deadlines vary by report type. AAMS reports are due annually, MSQ reports monthly, and WSL
            reports weekly. Check the dashboard for specific deadlines for your company.
          </p>
        </div>

        <div className="rounded-lg border border-default bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-xl font-semibold text-text-primary">How do I appeal an enforcement action?</h2>
          <p className="text-base text-text-secondary">
            You can appeal an enforcement action by navigating to the Enforcement module, selecting the action, and
            clicking the &quot;Appeal&quot; button. Appeals must be submitted within the specified deadline.
          </p>
        </div>

        <div className="rounded-lg border border-default bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-xl font-semibold text-text-primary">Where can I find help documentation?</h2>
          <p className="text-base text-text-secondary">
            Comprehensive documentation is available in the{' '}
            <Link href="/support/documentation" className="text-primary-600 hover:text-primary-700 transition-colors">
              Documentation
            </Link>{' '}
            section of the Support Center.
          </p>
        </div>
      </div>

      {/* Contact Support CTA */}
      <div className="mt-12 rounded-lg border border-primary-500 bg-primary-50 p-8 text-center">
        <h2 className="mb-4 text-2xl font-semibold text-text-primary">Still have questions?</h2>
        <p className="mb-6 text-base text-text-secondary">
          If you can&apos;t find the answer you&apos;re looking for, our support team is here to help.
        </p>
        <Link
          href="/support/contact"
          className="inline-block rounded-md bg-primary-500 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-primary-600"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}
