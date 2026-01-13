/**
 * Task 1.1.7.0c: Jest Setup
 * 
 * Setup file run before each test file.
 */

import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.test' })
config({ path: '.env.local' })
config({ path: '.env' })

// Extend Jest matchers
expect.extend({
  /**
   * Custom matcher: Check if value is a valid UUID
   */
  toBeValidUUID(received: string) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    const pass = uuidRegex.test(received)
    return {
      pass,
      message: () => `expected ${received} ${pass ? 'not ' : ''}to be a valid UUID`,
    }
  },

  /**
   * Custom matcher: Check if date is within range
   */
  toBeWithinDateRange(received: Date, start: Date, end: Date) {
    const pass = received >= start && received <= end
    return {
      pass,
      message: () =>
        `expected ${received.toISOString()} ${pass ? 'not ' : ''}to be between ${start.toISOString()} and ${end.toISOString()}`,
    }
  },

  /**
   * Custom matcher: Check if object has required RPC response structure
   */
  toBeValidRPCResponse(received: unknown) {
    const isObject = typeof received === 'object' && received !== null
    const hasData = isObject && 'data' in (received as Record<string, unknown>)
    const pass = isObject && (hasData || !('error' in (received as Record<string, unknown>)))
    return {
      pass,
      message: () => `expected ${JSON.stringify(received)} ${pass ? 'not ' : ''}to be a valid RPC response`,
    }
  },
})

// Global test utilities
global.testUtils = {
  /**
   * Wait for a specified time
   */
  async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  },

  /**
   * Retry a function until it succeeds or times out
   */
  async retry<T>(
    fn: () => Promise<T>,
    options: { maxAttempts?: number; delay?: number } = {}
  ): Promise<T> {
    const { maxAttempts = 3, delay = 1000 } = options
    let lastError: Error | null = null

    for (let i = 0; i < maxAttempts; i++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error as Error
        await this.wait(delay)
      }
    }

    throw lastError
  },
}

// Declare global types
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidUUID(): R
      toBeWithinDateRange(start: Date, end: Date): R
      toBeValidRPCResponse(): R
    }
  }

  var testUtils: {
    wait(ms: number): Promise<void>
    retry<T>(fn: () => Promise<T>, options?: { maxAttempts?: number; delay?: number }): Promise<T>
  }
}
