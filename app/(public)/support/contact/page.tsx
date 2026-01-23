/**
 * Wireframe: task-0.5.1.39-contact-support.md
 * Route: /support/contact
 * Implements: Contact support page with contact form and support information.
 * Wireframe Link: ../../../../../04-design/user-experience/wireframes/00-core-foundation/public-pages/task-0.5.1.39-contact-support.md
 */
'use client';

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import { Loader2, Mail, Phone } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement actual contact form submission (e.g., via Edge Function or email service)
    // For now, simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-6 py-12">
        <nav className="mb-6 text-sm text-text-secondary">
          <Link href="/" className="hover:text-text-primary transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/support" className="hover:text-text-primary transition-colors">
            Support
          </Link>
          <span className="mx-2">/</span>
          <span className="text-text-primary">Contact</span>
        </nav>

        <div className="rounded-lg border border-success-500 bg-success-50 p-8 text-center">
          <h1 className="mb-4 text-3xl font-bold text-text-primary">Thank You!</h1>
          <p className="mb-6 text-base text-text-secondary">
            Your message has been received. Our support team will respond within 24-48 hours.
          </p>
          <Link
            href="/support"
            className="inline-block rounded-md bg-primary-500 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-primary-600"
          >
            Back to Support
          </Link>
        </div>
      </div>
    );
  }

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
        <span className="text-text-primary">Contact</span>
      </nav>

      {/* Page Title */}
      <h1 className="mb-12 text-4xl font-bold text-text-primary">Contact Support</h1>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Contact Form */}
        <div className="rounded-lg border border-default bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-semibold text-text-primary">Send us a message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-text-primary">
                Name <span className="text-error-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
                className={cn(
                  'h-10 w-full rounded-md border border-default bg-white px-3 py-2 text-base text-text-primary',
                  'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
                  'disabled:cursor-not-allowed disabled:bg-bg-secondary disabled:opacity-50'
                )}
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-text-primary">
                Email <span className="text-error-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className={cn(
                  'h-10 w-full rounded-md border border-default bg-white px-3 py-2 text-base text-text-primary',
                  'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
                  'disabled:cursor-not-allowed disabled:bg-bg-secondary disabled:opacity-50'
                )}
              />
            </div>

            <div>
              <label htmlFor="subject" className="mb-2 block text-sm font-medium text-text-primary">
                Subject <span className="text-error-500">*</span>
              </label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                disabled={isLoading}
                className={cn(
                  'h-10 w-full rounded-md border border-default bg-white px-3 py-2 text-base text-text-primary',
                  'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
                  'disabled:cursor-not-allowed disabled:bg-bg-secondary disabled:opacity-50'
                )}
              />
            </div>

            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-medium text-text-primary">
                Message <span className="text-error-500">*</span>
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={6}
                disabled={isLoading}
                className={cn(
                  'w-full rounded-md border border-default bg-white px-3 py-2 text-base text-text-primary',
                  'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
                  'disabled:cursor-not-allowed disabled:bg-bg-secondary disabled:opacity-50'
                )}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                'h-10 w-full rounded-md bg-primary-500 font-medium text-white transition-colors',
                'hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
                'disabled:cursor-not-allowed disabled:bg-gray-400',
                isLoading && 'cursor-wait'
              )}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </span>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <div className="rounded-lg border border-default bg-white p-8 shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold text-text-primary">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Mail className="h-5 w-5 text-primary-500 mt-1" />
                <div>
                  <p className="font-semibold text-text-primary">Email Support</p>
                  <p className="text-sm text-text-secondary">support@moh.gov</p>
                  <p className="mt-1 text-sm text-text-secondary">Response: 24-48 hours</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="h-5 w-5 text-primary-500 mt-1" />
                <div>
                  <p className="font-semibold text-text-primary">Phone Support</p>
                  <p className="text-sm text-text-secondary">Available during support hours</p>
                  <p className="mt-1 text-sm text-text-secondary">Mon-Fri: 9 AM - 5 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-default bg-white p-8 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-text-primary">Support Hours</h2>
            <div className="space-y-2 text-base text-text-secondary">
              <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
              <p>Saturday - Sunday: Closed</p>
              <p>Public Holidays: Closed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
