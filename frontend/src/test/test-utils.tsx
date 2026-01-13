/**
 * Task 1.1.1.21a: Test Utilities
 * 
 * Custom render functions and utilities for testing React components.
 * Wraps components with necessary providers (QueryClient, Auth, etc.)
 */

import React, { ReactElement } from 'react'
import { render, RenderOptions, RenderResult } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import userEvent from '@testing-library/user-event'

// ============================================================================
// Create Test Query Client
// ============================================================================

function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Disable retries in tests
        retry: false,
        // Disable garbage collection time
        gcTime: 0,
        // Disable stale time
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

// ============================================================================
// Mock Auth Context
// ============================================================================

interface MockUser {
  id: string
  email: string
  role: 'company_admin' | 'company_user' | 'tier1' | 'tier2' | 'auditor' | 'super_admin'
  company_id?: string
  full_name?: string
}

interface MockAuthContextValue {
  user: MockUser | null
  isLoading: boolean
  isAuthenticated: boolean
}

const defaultMockAuth: MockAuthContextValue = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
}

// ============================================================================
// Test Providers Wrapper
// ============================================================================

interface TestProviderOptions {
  queryClient?: QueryClient
  mockAuth?: MockAuthContextValue
}

function createWrapper(options: TestProviderOptions = {}) {
  const { queryClient = createTestQueryClient() } = options

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )
  }
}

// ============================================================================
// Custom Render Function
// ============================================================================

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient
  mockAuth?: MockAuthContextValue
}

function customRender(
  ui: ReactElement,
  options: CustomRenderOptions = {}
): RenderResult & { queryClient: QueryClient } {
  const { queryClient = createTestQueryClient(), mockAuth, ...renderOptions } = options

  const Wrapper = createWrapper({ queryClient, mockAuth })

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  }
}

// ============================================================================
// User Event Setup
// ============================================================================

function setupUser() {
  return userEvent.setup()
}

// ============================================================================
// Common Mock Data
// ============================================================================

export const mockUsers = {
  companyAdmin: {
    id: 'user-1',
    email: 'admin@company.com',
    role: 'company_admin' as const,
    company_id: 'company-1',
    full_name: 'Company Admin',
  },
  companyUser: {
    id: 'user-2',
    email: 'user@company.com',
    role: 'company_user' as const,
    company_id: 'company-1',
    full_name: 'Company User',
  },
  mohTier1: {
    id: 'user-3',
    email: 'tier1@moh.gov.ma',
    role: 'tier1' as const,
    full_name: 'MOH Tier 1',
  },
  mohTier2: {
    id: 'user-4',
    email: 'tier2@moh.gov.ma',
    role: 'tier2' as const,
    full_name: 'MOH Tier 2',
  },
  auditor: {
    id: 'user-5',
    email: 'auditor@audit.com',
    role: 'auditor' as const,
    full_name: 'External Auditor',
  },
}

export const mockCompanies = {
  company1: {
    id: 'company-1',
    name: 'ABC Pharmaceuticals',
    registration_number: 'REG-001',
    status: 'active',
  },
  company2: {
    id: 'company-2',
    name: 'XYZ Pharma',
    registration_number: 'REG-002',
    status: 'active',
  },
}

// ============================================================================
// Async Helpers
// ============================================================================

/**
 * Wait for a condition to be true
 */
export async function waitFor(
  condition: () => boolean | Promise<boolean>,
  timeout = 5000
): Promise<void> {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    if (await condition()) return
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
  throw new Error('Condition not met within timeout')
}

/**
 * Wait for next tick
 */
export function nextTick(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

// ============================================================================
// Exports
// ============================================================================

export { customRender as render, setupUser, createTestQueryClient }
export * from '@testing-library/react'
