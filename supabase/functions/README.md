# Edge Functions - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This directory contains all Supabase Edge Functions for the PM platform.

**Runtime:** Deno (Supabase Edge Runtime)  
**Language:** TypeScript  
**Deployment:** Via Supabase CLI (`supabase functions deploy`)

---

## Directory Structure

```
supabase/functions/
├── _shared/                    # Shared utilities (not deployed as functions)
│   ├── cors.ts                 # CORS headers utility
│   ├── supabase-client.ts      # Supabase client initialization
│   └── error-handling.ts       # Error handling utilities
├── email-notifications/        # Email notification Edge Function
│   └── index.ts
├── message-email-notifications/# Message email notification Edge Function
│   └── index.ts
└── README.md                   # This file
```

---

## Function Naming Convention

**Pattern:** `{module}-{purpose}` or `{purpose}` for shared functions

**Examples:**
- `email-notifications` - Send general email notifications
- `message-email-notifications` - Send message email notifications
- `vci-send-email-notifications` - VCI-specific email notifications (future)
- `ecs-send-export-notifications` - ECS-specific email notifications (future)
- `cmc-calculate-scores` - CMC score calculation (future)

---

## Creating a New Edge Function

### Step 1: Create Function Directory

```bash
# Create function directory
mkdir supabase/functions/{function-name}

# Create index.ts file
touch supabase/functions/{function-name}/index.ts
```

### Step 2: Use Function Template

```typescript
// supabase/functions/{function-name}/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { createServiceRoleClient } from "../_shared/supabase-client.ts";
import { createSuccessResponse, createErrorResponse, handleError } from "../_shared/error-handling.ts";

Deno.serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Parse request
    const body = await req.json();

    // Validate request
    if (!body) {
      return createErrorResponse('VALIDATION_ERROR', 'Missing request body');
    }

    // Initialize Supabase client
    const supabase = createServiceRoleClient();

    // Business logic here
    // ...

    // Return success response
    return createSuccessResponse({ result: 'success' });
  } catch (error) {
    return handleError(error);
  }
});
```

### Step 3: Deploy Function

```bash
# Deploy single function
supabase functions deploy {function-name}

# Deploy all functions
supabase functions deploy
```

---

## Function Configuration

### Environment Variables

**Required Variables:**
- `SUPABASE_URL` - Supabase project URL (automatically set)
- `SUPABASE_ANON_KEY` - Supabase anon key (automatically set)
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (automatically set)

**Optional Variables:**
- `EMAIL_SERVICE_API_KEY` - Email service API key (for email functions)
- `CUSTOMS_API_KEY` - Customs API key (for customs integration functions)

### Function Settings

**Configure in Supabase Dashboard:**
- Go to Edge Functions → {function-name} → Settings
- Configure environment variables
- Configure verify_jwt (true for authenticated functions, false for public/system functions)
- Configure function timeout (default 60 seconds, max 300 seconds)

---

## Testing Edge Functions

### Local Testing

```bash
# Start local Supabase (includes Edge Functions runtime)
supabase start

# Invoke function locally
curl -i --location --request POST 'http://localhost:54321/functions/v1/{function-name}' \
  --header 'Authorization: Bearer {anon-key}' \
  --header 'Content-Type: application/json' \
  --data '{"key": "value"}'
```

### Testing in Staging/Production

```bash
# Deploy to staging/production
supabase functions deploy {function-name} --project-ref {project-ref}

# Invoke function
curl -i --location --request POST 'https://{project-ref}.supabase.co/functions/v1/{function-name}' \
  --header 'Authorization: Bearer {anon-key}' \
  --header 'Content-Type: application/json' \
  --data '{"key": "value"}'
```

---

## Function Deployment Checklist

Before deploying an Edge Function to production:

- [ ] Function tested locally
- [ ] Error handling implemented
- [ ] Environment variables configured
- [ ] Function documented in edge-functions.md
- [ ] Security settings configured (verify_jwt)
- [ ] Logging implemented
- [ ] Deployed to staging and tested
- [ ] Performance tested
- [ ] Monitoring configured

---

## Related Documents

- [Edge Functions Specification](../../docs/02-architecture/api/edge-functions.md) - Complete Edge Function specifications
- [Backend Error Handling Framework](../../docs/02-architecture/security/backend-error-handling-framework.md) - Error handling standards

---

**Last Updated:** 2026-01-17
