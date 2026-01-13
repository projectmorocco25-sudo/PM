# Shared Utilities for Edge Functions

This directory contains shared utilities used across all PM Platform Edge Functions.

## Directory Structure

```
_shared/
├── README.md               # This file
├── supabase-client.ts      # Supabase client creation utilities
├── cors.ts                 # CORS headers and preflight handling
├── response.ts             # Standardized response formatting
├── logger.ts               # Structured logging utilities
├── validation.ts           # Input validation helpers
└── audit.ts                # Audit logging utilities
```

## Usage

Import shared utilities in your Edge Function:

```typescript
import { createServiceClient, createUserClient } from '../_shared/supabase-client.ts';
import { handleCorsPreflightRequest, corsHeaders } from '../_shared/cors.ts';
import { successResponse, errorResponse, validationErrorResponse } from '../_shared/response.ts';
import { createRequestLogger, getCorrelationId } from '../_shared/logger.ts';
import { validateSchema, isValidUUID } from '../_shared/validation.ts';
import { createAuditLog, AuditAction } from '../_shared/audit.ts';
```

## Module Descriptions

### supabase-client.ts

Provides Supabase client creation with two modes:
- `createServiceClient()` - Service role client that bypasses RLS (for system operations)
- `createUserClient(authHeader)` - User-context client that respects RLS

### cors.ts

CORS handling for browser requests:
- `corsHeaders` - Standard CORS headers
- `handleCorsPreflightRequest(req)` - Handle OPTIONS requests

### response.ts

Standardized JSON response formatting:
- `successResponse(data, meta)` - Successful responses
- `errorResponse(code, message, status)` - Error responses
- `validationErrorResponse(message, details)` - Validation errors (400)
- `authenticationErrorResponse()` - Auth errors (401)
- `authorizationErrorResponse()` - Permission errors (403)
- `notFoundResponse()` - Not found (404)
- `systemErrorResponse()` - Server errors (500)

### logger.ts

Structured JSON logging:
- `logger.debug/info/warn/error()` - Standard logging
- `createRequestLogger(functionName, correlationId)` - Request-scoped logger with timing

### validation.ts

Input validation helpers:
- `isValidUUID()`, `isValidEmail()`, `isValidDateString()`
- `validateSchema(data, schema)` - Schema-based validation

### audit.ts

Audit logging for compliance:
- `createAuditLog(client, entry)` - Create audit log entry
- `createEdgeFunctionAuditContext()` - Track function execution

## Edge Function Template

Use this template for new Edge Functions:

```typescript
import 'edge-runtime';
import { createServiceClient } from '../_shared/supabase-client.ts';
import { handleCorsPreflightRequest } from '../_shared/cors.ts';
import { successResponse, systemErrorResponse, validationErrorResponse } from '../_shared/response.ts';
import { createRequestLogger, getCorrelationId } from '../_shared/logger.ts';
import { validateSchema } from '../_shared/validation.ts';

const FUNCTION_NAME = 'my-function-name';

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  const corsResponse = handleCorsPreflightRequest(req);
  if (corsResponse) return corsResponse;

  // Setup logging
  const correlationId = getCorrelationId(req);
  const log = createRequestLogger(FUNCTION_NAME, correlationId);

  try {
    log.info('Request received');

    // Parse and validate request
    const body = await req.json();
    const validation = validateSchema(body, {
      // Define schema
    });

    if (!validation.valid) {
      log.warn('Validation failed', { errors: validation.errors });
      return validationErrorResponse('Validation failed', validation.errors, correlationId);
    }

    // Create Supabase client
    const supabase = createServiceClient();

    // Business logic here...

    log.complete(200, { /* result summary */ });
    return successResponse({ /* response data */ }, { correlation_id: correlationId });

  } catch (error) {
    log.error('Unexpected error', error as Error);
    return systemErrorResponse('An unexpected error occurred', correlationId);
  }
});
```

## Environment Variables

Required environment variables for Edge Functions:

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `ENVIRONMENT` | Environment name (development, staging, production) |
| `LOG_LEVEL` | Logging level (debug, info, warn, error) |

## Testing

Run tests for shared utilities:

```bash
deno test _shared/ --allow-env --allow-net
```

## Related Documents

- [Edge Functions Specification](../../../docs/02-architecture/api/edge-functions.md)
- [API Specification](../../../docs/02-architecture/api/api-specification.md)
- [Backend Error Handling](../../../docs/02-architecture/security/backend-error-handling-framework.md)
