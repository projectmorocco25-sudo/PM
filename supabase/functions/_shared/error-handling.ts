// Error handling utilities for Edge Functions
// Shared utility for all Edge Functions

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
}

export type FunctionResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;

/**
 * Create error response
 */
export function createErrorResponse(
  code: string,
  message: string,
  details?: Record<string, unknown>,
  status: number = 400
): Response {
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
    },
  };

  return new Response(JSON.stringify(errorResponse), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Connection': 'keep-alive',
    },
  });
}

/**
 * Create success response
 */
export function createSuccessResponse<T>(
  data: T,
  status: number = 200
): Response {
  const successResponse: SuccessResponse<T> = {
    success: true,
    data,
  };

  return new Response(JSON.stringify(successResponse), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Connection': 'keep-alive',
    },
  });
}

/**
 * Handle errors and return appropriate response
 */
export function handleError(error: unknown): Response {
  console.error('Edge Function Error:', error);

  if (error instanceof Error) {
    // Known error types
    if (error.message.includes('validation')) {
      return createErrorResponse(
        'VALIDATION_ERROR',
        error.message,
        undefined,
        400
      );
    }
    if (error.message.includes('unauthorized') || error.message.includes('permission')) {
      return createErrorResponse(
        'AUTHORIZATION_ERROR',
        error.message,
        undefined,
        403
      );
    }
    if (error.message.includes('not found')) {
      return createErrorResponse(
        'NOT_FOUND',
        error.message,
        undefined,
        404
      );
    }
  }

  // Unknown error - return generic system error
  return createErrorResponse(
    'SYSTEM_ERROR',
    'Internal server error',
    undefined,
    500
  );
}
