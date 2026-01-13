# PM Platform Edge Functions

This directory contains Supabase Edge Functions for the Pharmaceutical Governance Value Chain Platform (PM).

## Directory Structure

```
functions/
├── README.md                          # This file
├── deno.json                          # Deno configuration
├── _shared/                           # Shared utilities
│   ├── README.md                      # Shared utilities documentation
│   ├── supabase-client.ts             # Supabase client creation
│   ├── cors.ts                        # CORS handling
│   ├── response.ts                    # Standardized responses
│   ├── logger.ts                      # Structured logging
│   ├── validation.ts                  # Input validation
│   └── audit.ts                       # Audit logging
├── shared-send-email/                 # Email sending function
│   └── index.ts
├── vci-send-email-notifications/      # VCI notification batch processing
│   └── index.ts
├── vci-check-threshold-reverts/       # Threshold reversion checker
│   └── index.ts
├── cmc-calculate-scores/              # CMC monthly score calculation
│   └── index.ts
├── ecs-expire-authorizations/         # Export authorization expiration
│   └── index.ts
└── communications-send-message-emails/ # Message notification emails
    └── index.ts
```

## Available Functions

### Notification Functions

| Function | Trigger | Purpose |
|----------|---------|---------|
| `shared-send-email` | API call | Send email via external service |
| `vci-send-email-notifications` | Scheduled (5 min) | Batch process pending VCI notifications |
| `communications-send-message-emails` | Scheduled (2 min) | Send message notification emails (Task 1.1.1.4l) |

### Background Processing Functions

| Function | Trigger | Purpose |
|----------|---------|---------|
| `cmc-calculate-scores` | Scheduled (monthly) | Calculate compliance scores for all companies |
| `vci-check-threshold-reverts` | Scheduled (daily) | Check and process threshold reversions |
| `ecs-expire-authorizations` | Scheduled (daily) | Expire old export authorizations |

## Development

### Prerequisites

- [Deno](https://deno.land/) installed
- [Supabase CLI](https://supabase.com/docs/guides/cli) installed
- Access to Supabase project

### Local Development

```bash
# Start local Supabase
supabase start

# Serve functions locally
supabase functions serve

# Serve specific function
supabase functions serve shared-send-email

# Run tests
deno test functions/ --allow-env --allow-net
```

### Testing Functions

```bash
# Test shared-send-email
curl -X POST http://localhost:54321/functions/v1/shared-send-email \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"to": "test@example.com", "subject": "Test", "body": "Test email body"}'

# Test vci-check-threshold-reverts
curl -X POST http://localhost:54321/functions/v1/vci-check-threshold-reverts \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"check_date": "2026-01-15"}'
```

## Deployment

### Deploy All Functions

```bash
supabase functions deploy --project-ref your-project-ref
```

### Deploy Single Function

```bash
supabase functions deploy shared-send-email --project-ref your-project-ref
```

### Set Secrets

```bash
# Email service configuration
supabase secrets set EMAIL_SERVICE_API_KEY=your_api_key --project-ref your-project-ref
supabase secrets set EMAIL_SERVICE_URL=https://api.emailservice.com/v1/send --project-ref your-project-ref
supabase secrets set EMAIL_FROM_ADDRESS=noreply@pm-platform.gov.ma --project-ref your-project-ref
supabase secrets set EMAIL_FROM_NAME="PM Platform" --project-ref your-project-ref

# Environment
supabase secrets set ENVIRONMENT=production --project-ref your-project-ref
supabase secrets set LOG_LEVEL=info --project-ref your-project-ref
```

## Scheduled Functions (pg_cron)

Set up scheduled triggers using pg_cron:

```sql
-- VCI: Send email notifications every 5 minutes
SELECT cron.schedule(
  'vci-send-email-notifications',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://your-project-ref.supabase.co/functions/v1/vci-send-email-notifications',
    headers := '{"Authorization": "Bearer ' || current_setting('app.settings.service_role_key') || '", "Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);

-- Communications: Send message emails every 2 minutes (near real-time)
SELECT cron.schedule(
  'communications-send-message-emails',
  '*/2 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://your-project-ref.supabase.co/functions/v1/communications-send-message-emails',
    headers := '{"Authorization": "Bearer ' || current_setting('app.settings.service_role_key') || '", "Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);

-- VCI: Check threshold reversions daily at midnight
SELECT cron.schedule(
  'vci-check-threshold-reverts',
  '0 0 * * *',
  $$
  SELECT net.http_post(
    url := 'https://your-project-ref.supabase.co/functions/v1/vci-check-threshold-reverts',
    headers := '{"Authorization": "Bearer ' || current_setting('app.settings.service_role_key') || '", "Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);

-- ECS: Expire authorizations daily at midnight
SELECT cron.schedule(
  'ecs-expire-authorizations',
  '0 0 * * *',
  $$
  SELECT net.http_post(
    url := 'https://your-project-ref.supabase.co/functions/v1/ecs-expire-authorizations',
    headers := '{"Authorization": "Bearer ' || current_setting('app.settings.service_role_key') || '", "Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);

-- CMC: Calculate scores on first day of month
SELECT cron.schedule(
  'cmc-calculate-scores-monthly',
  '0 0 1 * *',
  $$
  SELECT net.http_post(
    url := 'https://your-project-ref.supabase.co/functions/v1/cmc-calculate-scores',
    headers := '{"Authorization": "Bearer ' || current_setting('app.settings.service_role_key') || '", "Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);
```

## Error Handling

All functions use standardized error response format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": [{"field": "...", "message": "..."}],
    "correlation_id": "uuid"
  }
}
```

Error codes:
- `VALIDATION_ERROR` - Invalid request data
- `AUTHENTICATION_ERROR` - Missing or invalid auth
- `AUTHORIZATION_ERROR` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `RATE_LIMIT_ERROR` - Rate limit exceeded
- `SYSTEM_ERROR` - Internal error

## Monitoring

All functions log structured JSON for monitoring:

```json
{
  "timestamp": "2026-01-12T10:00:00.000Z",
  "level": "info",
  "function_name": "cmc-calculate-scores",
  "message": "Request completed",
  "correlation_id": "uuid",
  "duration_ms": 1234,
  "data": { ... }
}
```

## Related Documentation

- [Edge Functions Specification](../docs/02-architecture/api/edge-functions.md)
- [API Specification](../docs/02-architecture/api/api-specification.md)
- [Backend Error Handling](../docs/02-architecture/security/backend-error-handling-framework.md)
- [Module Integration Contracts](../docs/02-architecture/integration/module-integration-contracts.md)
