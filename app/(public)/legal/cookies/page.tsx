/**
 * Wireframe: N/A (Legal Page)
 * Route: /legal/cookies
 * Implements: Cookie Policy page.
 * Wireframe Link: N/A
 */
import Link from 'next/link';

export default function CookiesPage() {
  return (
    <div className="container mx-auto max-w-4xl px-6 py-12">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-text-secondary">
        <Link href="/" className="hover:text-text-primary transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-text-primary">Cookie Policy</span>
      </nav>

      {/* Page Title */}
      <h1 className="mb-8 text-4xl font-bold text-text-primary">Cookie Policy</h1>

      {/* Cookie Content */}
      <div className="space-y-6 rounded-lg border border-default bg-white p-8 shadow-sm">
        <section>
          <h2 className="mb-4 text-2xl font-semibold text-text-primary">1. What Are Cookies</h2>
          <p className="text-base leading-relaxed text-text-secondary">
            Cookies are small text files that are placed on your device when you visit our platform. They help us
            provide you with a better experience by remembering your preferences and enabling certain features.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-text-primary">2. How We Use Cookies</h2>
          <p className="mb-4 text-base leading-relaxed text-text-secondary">
            We use cookies for the following purposes:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-base text-text-secondary">
            <li>Authentication: To keep you logged in to your account</li>
            <li>Preferences: To remember your settings and preferences</li>
            <li>Security: To protect against unauthorized access</li>
            <li>Analytics: To understand how you use our platform (anonymized)</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-text-primary">3. Managing Cookies</h2>
          <p className="text-base leading-relaxed text-text-secondary">
            You can control and manage cookies through your browser settings. However, disabling certain cookies may
            affect the functionality of the platform.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-text-primary">4. Contact Information</h2>
          <p className="text-base leading-relaxed text-text-secondary">
            For questions about our use of cookies, please contact us through the{' '}
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
