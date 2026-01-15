# Edge Functions - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This directory contains all Deno Edge Functions for the PM platform.

**Last Updated:** 2025-01-12  
**Status:** ✅ Complete (Phase 1.1.1, Task 1.1.1.1d)  
**Owner:** Maya

## Overview

Edge Functions are serverless Deno functions deployed to Supabase Edge Runtime. They handle external integrations, background processing, and event-driven operations.

## Directory Structure

```
supabase/functions/
├── README.md (this file)
├── shared/
│   ├── send-email/
│   │   ├── index.ts
│   │   └── README.md
│   └── ...
├── rmm/
│   └── ...
├── vci/
│   ├── send-email-notifications/
│   │   ├── index.ts
│   │   └── README.md
│   └── check-threshold-reverts/
│       ├── index.ts
│       └── README.md
├── ecs/
│   ├── send-export-notifications/
│   ├── expire-authorizations/
│   └── verify-export/
└── cmc/
    ├── calculate-scores/
    └── recalculate-score-event/
```

## Function Naming Convention

**Pattern:** `{module}-{purpose}`

**Examples:**
- `shared-send-email` - Shared email sending function
- `vci-send-email-notifications` - VCI email notifications
- `cmc-calculate-scores` - CMC compliance score calculation
- `ecs-verify-export` - ECS export verification

## Function Template

See `_template/` directory for standard function template.

## Development

### Local Development

```bash
# Start Supabase locally
supabase start

# Serve function locally
supabase functions serve {function-name}

# Test function
curl -X POST http://localhost:54321/functions/v1/{function-name} \
  -H "Authorization: Bearer {anon-key}" \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
```

### Deployment

```bash
# Deploy function to staging
supabase functions deploy {function-name} --project-ref {staging-ref}

# Deploy function to production
supabase functions deploy {function-name} --project-ref {prod-ref}
```

## Environment Variables

Set environment variables via Supabase Dashboard or CLI:

```bash
supabase secrets set EMAIL_SERVICE_API_KEY=xxx --project-ref {project-ref}
```

## Related Documents

- [Edge Function Specifications](../../docs/02-architecture/api/edge-functions.md)
- [API Specification](../../docs/02-architecture/api/api-specification.md)
