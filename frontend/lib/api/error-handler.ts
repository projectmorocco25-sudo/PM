/**
 * API Error Handler
 * Task: 1.1.1.12i, 1.1.1.12j
 * Reference: State Management UI Patterns
 * 
 * Centralized error handling and retry logic for API calls
 */

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public originalError?: unknown
  ) {
    super(message)
    this.name = 'APIError'
  }
}

/**
 * Parse error from Supabase/API response
 */
export function parseError(error: unknown): APIError {
  if (error instanceof APIError) {
    return error
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const err = error as { message: string; status?: number; code?: string }
    return new APIError(
      err.message || 'An error occurred',
      err.status,
      err.code,
      error
    )
  }

  return new APIError(
    error instanceof Error ? error.message : 'An unknown error occurred',
    undefined,
    undefined,
    error
  )
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  const apiError = parseError(error)

  // Network errors (no status) are retryable
  if (!apiError.status) {
    return true
  }

  // 5xx errors are retryable
  if (apiError.status >= 500) {
    return true
  }

  // 429 (rate limit) is retryable
  if (apiError.status === 429) {
    return true
  }

  // 4xx errors (except 429) are not retryable
  // 3xx errors are not retryable
  return false
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number
    initialDelay?: number
    maxDelay?: number
    onRetry?: (error: unknown, attempt: number) => void
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 30000,
    onRetry,
  } = options

  let lastError: unknown
  let delay = initialDelay

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      // Don't retry if error is not retryable or we've exhausted retries
      if (!isRetryableError(error) || attempt >= maxRetries) {
        throw error
      }

      // Call onRetry callback
      if (onRetry) {
        onRetry(error, attempt + 1)
      }

      // Wait before retrying (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, delay))

      // Increase delay for next retry, capped at maxDelay
      delay = Math.min(delay * 2, maxDelay)
    }
  }

  throw lastError
}
