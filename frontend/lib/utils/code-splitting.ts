/**
 * Code Splitting Utilities
 * Task: 1.1.1.12k
 * Reference: State Management UI Patterns
 * 
 * Utilities for dynamic imports and lazy loading
 */

import { lazy, ComponentType } from 'react'
import { ErrorBoundary } from '@/components/ui/error-boundary'

/**
 * Lazy load a component with ErrorBoundary
 */
export function lazyWithBoundary<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) {
  const LazyComponent = lazy(importFunc)

  return function LazyComponentWithBoundary(
    props: React.ComponentProps<T>
  ) {
    return (
      <ErrorBoundary>
        <LazyComponent {...props} />
      </ErrorBoundary>
    )
  }
}

/**
 * Dynamic import helper for routes
 */
export function dynamicImport<T = any>(
  importFunc: () => Promise<T>
): Promise<T> {
  return importFunc()
}
