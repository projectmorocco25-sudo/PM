/**
 * Wireframe: N/A (Placeholder Component)
 * Route: N/A (Reusable component)
 * Implements: Reusable placeholder page component for routes not yet fully implemented.
 * Wireframe Link: N/A
 */
import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description?: string;
  wireframeLink?: string;
  route?: string;
  backHref?: string;
}

export function PlaceholderPage({ title, description, wireframeLink, route, backHref = '/dashboard' }: PlaceholderPageProps) {
  return (
    <div className="container mx-auto py-8">
      <Link
        href={backHref}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </Link>

      <div className="rounded-lg border border-default bg-white p-8 shadow-sm">
        <h1 className="mb-4 text-3xl font-bold text-text-primary">{title}</h1>
        {description && <p className="mb-6 text-text-secondary">{description}</p>}
        {route && (
          <p className="mb-4 text-sm text-text-tertiary">
            <strong>Route:</strong> {route}
          </p>
        )}
        {wireframeLink && (
          <p className="mb-4 text-sm text-text-tertiary">
            <strong>Wireframe:</strong>{' '}
            <a href={wireframeLink} className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">
              View wireframe
            </a>
          </p>
        )}
        <div className="rounded-md border border-default bg-bg-secondary p-4">
          <p className="text-sm text-text-secondary">
            This page is a placeholder and will be fully implemented in a future task. The full implementation will
            include all required components, data fetching, and functionality as specified in the wireframe.
          </p>
        </div>
      </div>
    </div>
  );
}
