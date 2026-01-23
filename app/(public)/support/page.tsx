/**
 * Wireframe: task-0.5.1.37-support-center.md
 * Route: /support
 * Implements: Support center page with help cards, support options, support hours, and quick links.
 * Wireframe Link: ../../../../04-design/user-experience/wireframes/00-core-foundation/public-pages/task-0.5.1.37-support-center.md
 */
import Link from 'next/link';
import { HelpCircle, MessageSquare, Book } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-text-secondary">
        <Link href="/" className="hover:text-text-primary transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-text-primary">Support Center</span>
      </nav>

      {/* Page Title */}
      <h1 className="mb-12 text-4xl font-bold text-text-primary">Support Center</h1>

      {/* Help Cards */}
      <div className="mb-12 grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-default bg-white p-6 shadow-sm">
          <HelpCircle className="mb-4 h-12 w-12 text-primary-500" />
          <h3 className="mb-2 text-xl font-semibold text-text-primary">FAQ</h3>
          <p className="mb-4 text-base text-text-secondary">
            Browse frequently asked questions and find answers to common issues.
          </p>
          <Link
            href="/support/faq"
            className="inline-block text-base font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            View FAQ →
          </Link>
        </div>

        <div className="rounded-lg border border-default bg-white p-6 shadow-sm">
          <MessageSquare className="mb-4 h-12 w-12 text-primary-500" />
          <h3 className="mb-2 text-xl font-semibold text-text-primary">Contact Support</h3>
          <p className="mb-4 text-base text-text-secondary">
            Get help from our support team via email or phone.
          </p>
          <Link
            href="/support/contact"
            className="inline-block text-base font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            Contact →
          </Link>
        </div>

        <div className="rounded-lg border border-default bg-white p-6 shadow-sm">
          <Book className="mb-4 h-12 w-12 text-primary-500" />
          <h3 className="mb-2 text-xl font-semibold text-text-primary">Documentation</h3>
          <p className="mb-4 text-base text-text-secondary">
            Access user guides, tutorials, and API documentation.
          </p>
          <Link
            href="/support/documentation"
            className="inline-block text-base font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            View Docs →
          </Link>
        </div>
      </div>

      {/* Support Options */}
      <div className="mb-12 rounded-lg border border-default bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-2xl font-semibold text-text-primary">Support Options</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-2 text-lg font-semibold text-text-primary">Email Support</h3>
            <Link
              href="/support/contact"
              className="mb-2 inline-block text-base font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              Contact via Email
            </Link>
            <p className="text-sm text-text-secondary">Response: 24-48 hours</p>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold text-text-primary">Phone Support</h3>
            <p className="mb-2 text-base text-text-secondary">Available during support hours</p>
            <p className="text-sm text-text-secondary">Hours: Mon-Fri 9 AM-5 PM</p>
          </div>
        </div>
      </div>

      {/* Support Hours */}
      <div className="mb-12 rounded-lg border border-default bg-white p-8 shadow-sm">
        <h2 className="mb-4 text-2xl font-semibold text-text-primary">Support Hours</h2>
        <div className="space-y-2 text-base text-text-secondary">
          <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
          <p>Saturday - Sunday: Closed</p>
          <p>Public Holidays: Closed</p>
        </div>
        <div className="mt-6">
          <h3 className="mb-2 text-lg font-semibold text-text-primary">Response Times</h3>
          <ul className="list-disc space-y-1 pl-6 text-base text-text-secondary">
            <li>Email: 24-48 hours</li>
            <li>Phone: Immediate during support hours</li>
            <li>Urgent Issues: Contact support for escalation</li>
          </ul>
        </div>
      </div>

      {/* Quick Links */}
      <div className="rounded-lg border border-default bg-white p-8 shadow-sm">
        <h2 className="mb-4 text-2xl font-semibold text-text-primary">Quick Links</h2>
        <ul className="space-y-2">
          <li>
            <Link href="/support/documentation" className="text-base text-primary-600 hover:text-primary-700 transition-colors">
              Getting Started Guide
            </Link>
          </li>
          <li>
            <Link href="/about" className="text-base text-primary-600 hover:text-primary-700 transition-colors">
              Platform Features
            </Link>
          </li>
          <li>
            <Link href="/support/faq" className="text-base text-primary-600 hover:text-primary-700 transition-colors">
              Account Management
            </Link>
          </li>
          <li>
            <Link href="/support/documentation" className="text-base text-primary-600 hover:text-primary-700 transition-colors">
              Submission Workflows
            </Link>
          </li>
          <li>
            <Link href="/support/documentation" className="text-base text-primary-600 hover:text-primary-700 transition-colors">
              Compliance Reporting
            </Link>
          </li>
          <li>
            <Link href="/status" className="text-base text-primary-600 hover:text-primary-700 transition-colors">
              System Status
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
