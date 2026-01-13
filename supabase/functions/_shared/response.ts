/**
 * Standardized Response Utilities for Edge Functions
 * 
 * This module provides consistent response formatting for all Edge Functions.
 * 
 * Usage:
 *   import { successResponse, errorResponse, validationErrorResponse } from '../_shared/response.ts';
 */

import { corsHeaders } from './cors.ts';

/**
 * Standard response headers including CORS
 */
const responseHeaders = {
  ...corsHeaders,
  'Content-Type': 'application/json',
  'Connection': 'keep-alive',
};

/**
 * Error codes for standardized error handling
 */
export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  EXTERNAL_API_ERROR: 'EXTERNAL_API_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  SYSTEM_ERROR: 'SYSTEM_ERROR',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

/**
 * Success response payload structure
 */
interface SuccessPayload<T = unknown> {
  success: true;
  data: T;
  meta?: {
    correlation_id?: string;
    processing_time_ms?: number;
    [key: string]: unknown;
  };
}

/**
 * Error response payload structure
 */
interface ErrorPayload {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: Array<{ field?: string; message: string }>;
    correlation_id?: string;
  };
}

/**
 * Creates a successful response with standardized format.
 * 
 * @param data - The response data
 * @param meta - Optional metadata (correlation_id, processing_time, etc.)
 * @param status - HTTP status code (default: 200)
 */
export function successResponse<T>(
  data: T,
  meta?: SuccessPayload['meta'],
  status: number = 200
): Response {
  const payload: SuccessPayload<T> = {
    success: true,
    data,
  };

  if (meta) {
    payload.meta = meta;
  }

  return new Response(JSON.stringify(payload), {
    status,
    headers: responseHeaders,
  });
}

/**
 * Creates an error response with standardized format.
 * 
 * @param code - Error code from ErrorCodes
 * @param message - Human-readable error message
 * @param status - HTTP status code
 * @param details - Optional array of field-level errors
 * @param correlationId - Optional correlation ID for tracking
 */
export function errorResponse(
  code: ErrorCode,
  message: string,
  status: number,
  details?: Array<{ field?: string; message: string }>,
  correlationId?: string
): Response {
  const payload: ErrorPayload = {
    success: false,
    error: {
      code,
      message,
    },
  };

  if (details && details.length > 0) {
    payload.error.details = details;
  }

  if (correlationId) {
    payload.error.correlation_id = correlationId;
  }

  return new Response(JSON.stringify(payload), {
    status,
    headers: responseHeaders,
  });
}

/**
 * Creates a validation error response (400).
 */
export function validationErrorResponse(
  message: string,
  details?: Array<{ field: string; message: string }>,
  correlationId?: string
): Response {
  return errorResponse(
    ErrorCodes.VALIDATION_ERROR,
    message,
    400,
    details,
    correlationId
  );
}

/**
 * Creates an authentication error response (401).
 */
export function authenticationErrorResponse(
  message: string = 'Authentication required',
  correlationId?: string
): Response {
  return errorResponse(
    ErrorCodes.AUTHENTICATION_ERROR,
    message,
    401,
    undefined,
    correlationId
  );
}

/**
 * Creates an authorization error response (403).
 */
export function authorizationErrorResponse(
  message: string = 'You do not have permission to perform this action',
  correlationId?: string
): Response {
  return errorResponse(
    ErrorCodes.AUTHORIZATION_ERROR,
    message,
    403,
    undefined,
    correlationId
  );
}

/**
 * Creates a not found error response (404).
 */
export function notFoundResponse(
  message: string = 'Resource not found',
  correlationId?: string
): Response {
  return errorResponse(
    ErrorCodes.NOT_FOUND,
    message,
    404,
    undefined,
    correlationId
  );
}

/**
 * Creates a rate limit error response (429).
 */
export function rateLimitResponse(
  message: string = 'Rate limit exceeded',
  retryAfter: number = 60,
  correlationId?: string
): Response {
  const response = errorResponse(
    ErrorCodes.RATE_LIMIT_ERROR,
    message,
    429,
    undefined,
    correlationId
  );

  // Add Retry-After header
  response.headers.set('Retry-After', retryAfter.toString());
  
  return response;
}

/**
 * Creates a system error response (500).
 * Note: Do not expose internal error details in production.
 */
export function systemErrorResponse(
  message: string = 'An unexpected error occurred',
  correlationId?: string
): Response {
  return errorResponse(
    ErrorCodes.SYSTEM_ERROR,
    message,
    500,
    undefined,
    correlationId
  );
}
