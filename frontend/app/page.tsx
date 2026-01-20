/**
 * Wireframe: task-0.5.1.1-public-homepage.md
 * Route: /
 * Implements: Public Homepage (MOH mission focus)
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/00-core-foundation/public-pages/task-0.5.1.1-public-homepage.md
 */

'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Package, BarChart, Plane, Shield, TrendingUp } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header/Navigation */}
      <header
        className="sticky top-0 z-50 border-b border-gray-200 bg-white"
        style={{
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#ffffff',
          padding: '16px 24px',
        }}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-8">
            {/* MOH Logo - Placeholder */}
            <div
              className="text-xl font-bold text-gray-900"
              style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}
            >
              MOH Logo
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/about"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
              style={{ fontSize: '14px', fontWeight: 500 }}
            >
              About
            </Link>
            <Link
              href="/support"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
              style={{ fontSize: '14px', fontWeight: 500 }}
            >
              Support
            </Link>
            <Link
              href="/status"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
              style={{ fontSize: '14px', fontWeight: 500 }}
            >
              Status
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                Register
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section
          className="bg-gradient-to-br from-blue-600 to-blue-800 px-6 py-20 text-center text-white"
          style={{
            padding: '80px 24px',
            background: 'linear-gradient(to bottom right, #2563eb, #1e40af)',
          }}
        >
          <div className="mx-auto max-w-4xl">
            <h1
              className="mb-4 text-5xl font-bold leading-tight md:text-3xl"
              style={{
                fontSize: '48px',
                fontWeight: 700,
                marginBottom: '16px',
                color: '#ffffff',
              }}
            >
              Pharmaceutical Governance Value Chain Platform
            </h1>
            <p
              className="mb-8 text-2xl font-normal md:text-lg"
              style={{
                fontSize: '24px',
                fontWeight: 400,
                marginBottom: '32px',
                color: '#ffffff',
              }}
            >
              Ensuring Medicine Availability & Compliance
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  style={{ height: '48px', padding: '12px 24px' }}
                >
                  Get Started
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="!bg-transparent border-white !text-white hover:!bg-white/10 hover:!text-white"
                  style={{ height: '48px', padding: '12px 24px', backgroundColor: 'transparent', color: '#ffffff' }}
                >
                  Learn More →
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white px-6 py-16" style={{ padding: '64px 24px', backgroundColor: '#ffffff' }}>
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Registry Management */}
              <div
                className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg"
                style={{
                  padding: '24px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#ffffff',
                }}
              >
                <Package className="mb-4 h-12 w-12 text-blue-600" style={{ marginBottom: '16px' }} />
                <h3
                  className="mb-2 text-xl font-semibold text-gray-900"
                  style={{ fontSize: '20px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}
                >
                  Registry Management
                </h3>
                <p className="text-gray-600" style={{ fontSize: '16px', color: '#4b5563', lineHeight: '1.6' }}>
                  Manage products, companies, and submissions
                </p>
              </div>

              {/* Compliance Monitoring */}
              <div
                className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg"
                style={{
                  padding: '24px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#ffffff',
                }}
              >
                <BarChart className="mb-4 h-12 w-12 text-blue-600" style={{ marginBottom: '16px' }} />
                <h3
                  className="mb-2 text-xl font-semibold text-gray-900"
                  style={{ fontSize: '20px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}
                >
                  Compliance Monitoring
                </h3>
                <p className="text-gray-600" style={{ fontSize: '16px', color: '#4b5563', lineHeight: '1.6' }}>
                  Monitor stock levels and ensure compliance with thresholds
                </p>
              </div>

              {/* Export Control */}
              <div
                className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg"
                style={{
                  padding: '24px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#ffffff',
                }}
              >
                <Plane className="mb-4 h-12 w-12 text-blue-600" style={{ marginBottom: '16px' }} />
                <h3
                  className="mb-2 text-xl font-semibold text-gray-900"
                  style={{ fontSize: '20px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}
                >
                  Export Control
                </h3>
                <p className="text-gray-600" style={{ fontSize: '16px', color: '#4b5563', lineHeight: '1.6' }}>
                  Control exports to ensure domestic availability
                </p>
              </div>

              {/* Enforcement Actions */}
              <div
                className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg"
                style={{
                  padding: '24px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#ffffff',
                }}
              >
                <Shield className="mb-4 h-12 w-12 text-blue-600" style={{ marginBottom: '16px' }} />
                <h3
                  className="mb-2 text-xl font-semibold text-gray-900"
                  style={{ fontSize: '20px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}
                >
                  Enforcement Actions
                </h3>
                <p className="text-gray-600" style={{ fontSize: '16px', color: '#4b5563', lineHeight: '1.6' }}>
                  Manage governance actions, warnings, fines, and suspensions
                </p>
              </div>

              {/* Analytics & Reporting */}
              <div
                className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg"
                style={{
                  padding: '24px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#ffffff',
                }}
              >
                <TrendingUp className="mb-4 h-12 w-12 text-blue-600" style={{ marginBottom: '16px' }} />
                <h3
                  className="mb-2 text-xl font-semibold text-gray-900"
                  style={{ fontSize: '20px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}
                >
                  Analytics & Reporting
                </h3>
                <p className="text-gray-600" style={{ fontSize: '16px', color: '#4b5563', lineHeight: '1.6' }}>
                  Track compliance trends and generate regulatory reports
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section
          className="bg-gray-50 px-6 py-16"
          style={{
            padding: '60px 24px',
            backgroundColor: '#f9fafb',
          }}
        >
          <div className="mx-auto max-w-4xl text-center">
            <h2
              className="mb-6 text-4xl font-semibold text-gray-900"
              style={{
                fontSize: '32px',
                fontWeight: 600,
                color: '#111827',
                marginBottom: '24px',
              }}
            >
              About MOH's Regulatory Mission
            </h2>
            <p
              className="mb-6 text-lg text-gray-600"
              style={{
                fontSize: '16px',
                color: '#4b5563',
                lineHeight: '1.6',
                marginBottom: '24px',
              }}
            >
              The Pharmaceutical Governance Value Chain Platform supports the Ministry of Health's mission to ensure
              medicine availability and regulatory compliance across the pharmaceutical value chain.
            </p>
            <Link href="/about">
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                Learn More About MOH's Mission →
              </Button>
            </Link>
          </div>
        </section>

        {/* Partnership Section */}
        <section className="bg-white px-6 py-12" style={{ padding: '40px 24px', backgroundColor: '#ffffff' }}>
          <div className="mx-auto max-w-4xl text-center">
            <h2
              className="mb-4 text-3xl font-semibold text-gray-900"
              style={{
                fontSize: '28px',
                fontWeight: 600,
                color: '#111827',
                marginBottom: '16px',
              }}
            >
              Partnership Information
            </h2>
            <p
              className="mb-6 text-lg text-gray-600"
              style={{
                fontSize: '16px',
                color: '#4b5563',
                lineHeight: '1.6',
                marginBottom: '24px',
              }}
            >
              Developed in partnership with the Ministry of Health to support regulatory governance and compliance
              management.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/support/contact"
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
                style={{ fontSize: '14px', fontWeight: 500 }}
              >
                Contact Us
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
                style={{ fontSize: '14px', fontWeight: 500 }}
              >
                About
              </Link>
              <Link
                href="/support"
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
                style={{ fontSize: '14px', fontWeight: 500 }}
              >
                Support
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className="border-t border-gray-800 bg-gray-900 px-6 py-8 text-gray-400"
        style={{
          padding: '32px 24px',
          backgroundColor: '#111827',
          color: '#9ca3af',
          borderTop: '1px solid #1f2937',
        }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-4">
              {/* MOH Logo - Placeholder */}
              <div
                className="text-lg font-bold text-gray-300"
                style={{ fontSize: '18px', fontWeight: 700, color: '#d1d5db' }}
              >
                MOH Logo
              </div>
              <span className="text-sm" style={{ fontSize: '14px' }}>
                © 2025 Ministry of Health. All rights reserved.
              </span>
            </div>
            <div className="flex gap-4">
              <Link
                href="/terms"
                className="text-sm hover:text-gray-300"
                style={{ fontSize: '14px' }}
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-sm hover:text-gray-300"
                style={{ fontSize: '14px' }}
              >
                Privacy
              </Link>
              <Link
                href="/cookies"
                className="text-sm hover:text-gray-300"
                style={{ fontSize: '14px' }}
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
