# Edge Functions - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This directory contains all Supabase Edge Functions (Deno/TypeScript serverless functions).

**Last Updated:** 2026-01-17  
**Status:** ✅ Project Structure Initialized (Task 1.1.1.1d)

---

## Directory Structure

```
supabase/functions/
├── README.md                    # This file
├── shared/                      # Shared utility functions (future)
│   └── send-email/              # Shared email sending function
├── rmm/                         # RMM module functions (future)
├── vci/                         # VCI module functions (future)
├── ecs/                         # ECS module functions (future)
├── cmc/                         # CMC module functions (future)
└── _shared/                     # Shared utilities and types (future)
    ├── types.ts                 # Shared TypeScript types
    ├── supabase-client.ts       # Supabase client utilities
    └── error-handling.ts         # Error handling utilities
```

---

## Function Structure

Each Edge Function follows this structure:

```
{function-name}/
├── index.ts                     # Function entry point (REQUIRED)
├── deno.json                    # Deno configuration (optional)
└── README.md                    # Function-specific documentation (optional)
```

### Example Function Structure

```
shared-send-email/
├── index.ts                     # Main function code
├── deno.json                    # Deno dependencies and config
└── README.md                    # Function documentation
```

---

## Function Naming Convention

**Pattern:** `{module}-{purpose}`

**Examples:**
- `shared-send-email` - Shared module, send email
- `vci-send-email-notifications` - VCI module, send email notifications
- `cmc-calculate-scores` - CMC module, calculate compliance scores
- `ecs-verify-export` - ECS module, verify export with customs

**Module Prefixes:**
- `shared-` - Shared utilities (email, notifications, etc.)
- `rmm-` - Registry Management Module functions
- `vci-` - Value Chain Intelligence functions
- `ecs-` - Export Control System functions
- `cmc-` - Compliance Monitoring Center functions

---

## Function Template

All Edge Functions should follow this template structure:

```typescript
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req: Request) => {
  try {
    // 1. Parse request
    const { event, data } = await req.json();

    // 2. Initialize Supabase client (service role)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 3. Validate request
    if (!event || !data) {
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Missing required fields"
          }
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 4. Process request
    // ... business logic ...

    // 5. Return success response
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          // Response data
        }
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Connection": "keep-alive"
        }
      }
    );
  } catch (error) {
    // 6. Handle errors
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: "SYSTEM_ERROR",
          message: "Internal server error"
        }
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
```

---

## Development Workflow

### 1. Create New Function

```bash
# Create new function directory
mkdir -p supabase/functions/{function-name}

# Create index.ts file
touch supabase/functions/{function-name}/index.ts

# Create deno.json (optional)
touch supabase/functions/{function-name}/deno.json
```

### 2. Test Function Locally

```bash
# Serve function locally
supabase functions serve {function-name}

# Test with curl
curl -i --location --request POST 'http://localhost:54321/functions/v1/{function-name}' \
  --header 'Authorization: Bearer {anon-key}' \
  --header 'Content-Type: application/json' \
  --data '{"event": "test", "data": {}}'
```

### 3. Deploy Function

```bash
# Deploy to remote project
supabase functions deploy {function-name} --project-ref {project-ref}

# Set environment variables
supabase secrets set ENV_VAR_NAME=value --project-ref {project-ref}
```

---

## Function Categories

### 1. Notification Functions
- `shared-send-email` - Send email via external service
- `vci-send-email-notifications` - Send VCI-related email notifications
- `ecs-send-export-notifications` - Send export-related email notifications

### 2. Background Processing Functions
- `cmc-calculate-scores` - Calculate compliance scores (scheduled monthly)
- `vci-check-threshold-reverts` - Check and revert thresholds (scheduled daily)
- `ecs-expire-authorizations` - Expire export authorizations (scheduled daily)

### 3. External API Integration Functions
- `ecs-verify-export` - Verify export with customs API
- `shared-send-email` - Send email via external email service

### 4. Event Handler Functions
- `vci-handle-breach-event` - Handle breach detection events
- `ecs-handle-authorization-event` - Handle export authorization events
- `cmc-recalculate-score-event` - Event-triggered score recalculation

---

## Environment Variables

Edge Functions use environment variables for configuration:

**Supabase Variables (Auto-provided):**
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (for admin operations)
- `SUPABASE_ANON_KEY` - Anonymous key (for public operations)

**Custom Variables (Set via CLI):**
```bash
supabase secrets set EMAIL_SERVICE_API_KEY=xxx --project-ref {project-ref}
supabase secrets set EMAIL_SERVICE_URL=xxx --project-ref {project-ref}
```

---

## Error Handling

All functions should follow standard error response format:

```typescript
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      // Additional error details
    }
  }
}
```

**Standard Error Codes:**
- `VALIDATION_ERROR` - Invalid request data (400)
- `AUTHENTICATION_ERROR` - Authentication failed (401)
- `AUTHORIZATION_ERROR` - Authorization failed (403)
- `NOT_FOUND` - Resource not found (404)
- `EXTERNAL_API_ERROR` - External API call failed (502)
- `SYSTEM_ERROR` - Internal system error (500)

---

## Scheduled Triggers

Edge Functions can be triggered by pg_cron scheduled jobs:

```sql
SELECT cron.schedule(
  'function-name-schedule',
  '0 0 * * *',  -- Cron expression
  $$
  SELECT net.http_post(
    url := 'https://{project-ref}.supabase.co/functions/v1/{function-name}',
    headers := '{"Authorization": "Bearer {service_role_key}", "Content-Type": "application/json"}'::jsonb,
    body := '{"event": "scheduled", "data": {}}'::jsonb
  );
  $$
);
```

---

## Related Documentation

- **Edge Functions Specification:** [docs/02-architecture/api/edge-functions.md](../../docs/02-architecture/api/edge-functions.md)
- **API Contract Documentation:** [docs/02-architecture/api/api-contract-documentation-format.md](../../docs/02-architecture/api/api-contract-documentation-format.md)
- **Supabase Edge Functions Docs:** https://supabase.com/docs/guides/functions

---

## Task Status

**Task 1.1.1.1d:** ✅ **COMPLETE** - Edge Functions project structure initialized

**Next Steps:**
- Functions will be created as needed during Phase 1.1 implementation
- Shared utilities will be created when first function is implemented

---

**Owner:** Leila (Edge Functions)  
**Last Updated:** 2026-01-17
