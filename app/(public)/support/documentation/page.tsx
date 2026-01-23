/**
 * Wireframe: task-0.5.1.40-documentation-page.md
 * Route: /support/documentation
 * Implements: Documentation page with user guides, tutorials, and API documentation links.
 * Wireframe Link: ../../../../../04-design/user-experience/wireframes/00-core-foundation/public-pages/task-0.5.1.40-documentation-page.md
 */
import Link from 'next/link';
import { Book, FileText, Code, Video } from 'lucide-react';

export default function DocumentationPage() {
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
        <span className="text-text-primary">Documentation</span>
      </nav>

      {/* Page Title */}
      <h1 className="mb-12 text-4xl font-bold text-text-primary">Documentation</h1>

      {/* Documentation Sections */}
      <div className="space-y-8">
        {/* Getting Started */}
        <div className="rounded-lg border border-default bg-white p-8 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <Book className="h-8 w-8 text-primary-500" />
            <h2 className="text-2xl font-semibold text-text-primary">Getting Started</h2>
          </div>
          <p className="mb-4 text-base text-text-secondary">
            New to the platform? Start here to learn the basics and get up and running quickly.
          </p>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="text-base text-primary-600 hover:text-primary-700 transition-colors">
                Platform Overview
              </Link>
            </li>
            <li>
              <Link href="#" className="text-base text-primary-600 hover:text-primary-700 transition-colors">
                Account Setup Guide
              </Link>
            </li>
            <li>
              <Link href="#" className="text-base text-primary-600 hover:text-primary-700 transition-colors">
                First Steps Tutorial
              </Link>
            </li>
          </ul>
        </div>

        {/* User Guides */}
        <div className="rounded-lg border border-default bg-white p-8 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary-500" />
            <h2 className="text-2xl font-semibold text-text-primary">User Guides</h2>
          </div>
          <p className="mb-4 text-base text-text-secondary">
            Comprehensive guides for using each module and feature of the platform.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-text-primary">Registry Management</h3>
              <ul className="space-y-1 text-base text-text-secondary">
                <li>• Company Registration</li>
                <li>• Product Management</li>
                <li>• SKU Management</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-text-primary">Compliance Monitoring</h3>
              <ul className="space-y-1 text-base text-text-secondary">
                <li>• AAMS Submissions</li>
                <li>• MSQ Submissions</li>
                <li>• WSL Submissions</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-text-primary">Export Control</h3>
              <ul className="space-y-1 text-base text-text-secondary">
                <li>• Export Authorization</li>
                <li>• Replenishment Tracking</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-text-primary">Enforcement</h3>
              <ul className="space-y-1 text-base text-text-secondary">
                <li>• Enforcement Actions</li>
                <li>• Appeals Process</li>
              </ul>
            </div>
          </div>
        </div>

        {/* API Documentation */}
        <div className="rounded-lg border border-default bg-white p-8 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <Code className="h-8 w-8 text-primary-500" />
            <h2 className="text-2xl font-semibold text-text-primary">API Documentation</h2>
          </div>
          <p className="mb-4 text-base text-text-secondary">
            Technical documentation for developers integrating with the platform API.
          </p>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="text-base text-primary-600 hover:text-primary-700 transition-colors">
                API Reference
              </Link>
            </li>
            <li>
              <Link href="#" className="text-base text-primary-600 hover:text-primary-700 transition-colors">
                Authentication Guide
              </Link>
            </li>
            <li>
              <Link href="#" className="text-base text-primary-600 hover:text-primary-700 transition-colors">
                Rate Limits
              </Link>
            </li>
          </ul>
        </div>

        {/* Video Tutorials */}
        <div className="rounded-lg border border-default bg-white p-8 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <Video className="h-8 w-8 text-primary-500" />
            <h2 className="text-2xl font-semibold text-text-primary">Video Tutorials</h2>
          </div>
          <p className="mb-4 text-base text-text-secondary">
            Watch step-by-step video tutorials to learn how to use the platform.
          </p>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="text-base text-primary-600 hover:text-primary-700 transition-colors">
                Platform Overview Video
              </Link>
            </li>
            <li>
              <Link href="#" className="text-base text-primary-600 hover:text-primary-700 transition-colors">
                Submission Workflow Tutorial
              </Link>
            </li>
            <li>
              <Link href="#" className="text-base text-primary-600 hover:text-primary-700 transition-colors">
                Compliance Reporting Guide
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
