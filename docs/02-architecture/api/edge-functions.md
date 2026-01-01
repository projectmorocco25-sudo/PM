# Edge Function Specifications - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document provides detailed specifications for all Edge Functions in the PM platform.

**Last Updated:** 2025-12-31  
**Status:** ✅ Complete (Phase 0, Week 3)  
**Owner:** Maya

## Overview

Edge Functions are serverless Deno functions deployed to Supabase Edge Runtime. They handle external integrations, background processing, and event-driven operations.

## Edge Function Architecture

**Runtime:** Deno (Supabase Edge Runtime)  
**Language:** TypeScript  
**Deployment:** Via Supabase CLI (`supabase functions deploy`)  
**Authentication:** Service role key or JWT tokens

## Edge Function Naming Convention

**Pattern:** `{module}-{purpose}`

**Examples:**
- `vci-send-email-notifications` - VCI module, send email notifications
- `cmc-calculate-scores` - CMC module, calculate compliance scores
- `ecs-verify-export` - ECS module, verify export with customs
- `shared-send-email` - Shared, send email via external service

## Edge Function Categories

### 1. Notification Functions

**Purpose:** Send emails, SMS, webhooks**

**Examples:**
- `shared-send-email` - Send email via external service
- `vci-send-email-notifications` - Send VCI-related email notifications
- `ecs-send-export-notifications` - Send export-related email notifications

---

### 2. Background Processing Functions

**Purpose:** Scheduled calculations, data processing**

**Examples:**
- `cmc-calculate-scores` - Calculate compliance scores (scheduled monthly)
- `vci-check-threshold-reverts` - Check and revert ECS thresholds after 3 months
- `ecs-expire-authorizations` - Expire export authorizations after 90 days

---

### 3. External API Integration Functions

**Purpose:** Call external APIs (customs, email service)**

**Examples:**
- `ecs-verify-export` - Verify export with customs API
- `shared-send-email` - Send email via external email service

---

### 4. Event Handler Functions

**Purpose:** Handle events from other systems**

**Examples:**
- `vci-handle-breach-event` - Handle breach detection events
- `ecs-handle-authorization-event` - Handle export authorization events

---

## Edge Function Template

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

## Edge Function Specifications

### shared-send-email

**Purpose:** Send email via external email service

**Trigger:** API call or scheduled

**Request:**
```json
{
  "to": "recipient@example.com",
  "subject": "Email subject",
  "body": "Email body",
  "template": "notification_template",
  "data": {
    // Template data
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message_id": "email_message_id"
  }
}
```

**Environment Variables:**
- `EMAIL_SERVICE_API_KEY` - Email service API key
- `EMAIL_SERVICE_URL` - Email service URL

---

### vci-send-email-notifications

**Purpose:** Send VCI-related email notifications

**Trigger:** Scheduled (reads from notifications table)

**Request:**
```json
{
  "notification_ids": ["uuid1", "uuid2"]
}
```

**Process:**
1. Read notifications from database (unread, type = email)
2. For each notification, call `shared-send-email`
3. Mark notifications as sent

**Response:**
```json
{
  "success": true,
  "data": {
    "sent_count": 10,
    "failed_count": 0
  }
}
```

**Schedule:** Every 5 minutes (or configurable)

---

### cmc-calculate-scores

**Purpose:** Calculate compliance scores (scheduled monthly)

**Trigger:** Scheduled (pg_cron, first day of month)

**Request:**
```json
{
  "score_period": "2025-01",
  "trigger": "scheduled"
}
```

**Process:**
1. Get all active companies
2. For each company, call RPC function `cmc_calculate_compliance_score()`
3. Handle errors and log results

**Response:**
```json
{
  "success": true,
  "data": {
    "companies_processed": 50,
    "scores_calculated": 50,
    "errors": []
  }
}
```

**Schedule:** First day of month, 00:00 UTC

---

### cmc-recalculate-score-event

**Purpose:** Event-triggered score recalculation

**Trigger:** Event (export authorized, breach detected, etc.)

**Request:**
```json
{
  "company_id": "uuid",
  "trigger_event": "export_authorized",
  "event_data": {
    "export_authorization_id": "uuid"
  }
}
```

**Process:**
1. Call RPC function `cmc_recalculate_score_event_triggered()`
2. Handle errors and log results

**Response:**
```json
{
  "success": true,
  "data": {
    "score_id": "uuid",
    "new_score": 85.5
  }
}
```

---

### vci-check-threshold-reverts

**Purpose:** Check and revert ECS thresholds after 3 months

**Trigger:** Scheduled (daily)

**Request:**
```json
{
  "check_date": "2025-01-15"
}
```

**Process:**
1. Find export authorizations where `threshold_revert_date <= check_date`
2. For each, revert threshold from ECS to VCI
3. Update threshold records
4. Create notifications

**Response:**
```json
{
  "success": true,
  "data": {
    "thresholds_reverted": 5
  }
}
```

**Schedule:** Daily, 00:00 UTC

---

### ecs-expire-authorizations

**Purpose:** Expire export authorizations after 90 days

**Trigger:** Scheduled (daily)

**Request:**
```json
{
  "check_date": "2025-01-15"
}
```

**Process:**
1. Find export authorizations where `valid_until < check_date` and status = `authorized`
2. Update status to `expired`
3. Revert threshold from ECS to VCI (if applicable)
4. Create notifications

**Response:**
```json
{
  "success": true,
  "data": {
    "authorizations_expired": 3
  }
}
```

**Schedule:** Daily, 00:00 UTC

---

### ecs-send-export-notifications

**Purpose:** Send export-related email notifications

**Trigger:** Scheduled or event-triggered

**Request:**
```json
{
  "notification_ids": ["uuid1", "uuid2"]
}
```

**Process:**
1. Read export-related notifications from database
2. For each notification, call `shared-send-email`
3. Mark notifications as sent

**Response:**
```json
{
  "success": true,
  "data": {
    "sent_count": 5
  }
}
```

---

### ecs-verify-export

**Purpose:** Verify export with customs API (future)

**Trigger:** API call from customs system

**Request:**
```json
{
  "authorization_id": "uuid",
  "export_date": "2025-01-15",
  "quantity": 1000,
  "destination": "Country Code"
}
```

**Process:**
1. Validate export authorization exists
2. Call customs API to verify export
3. Update export authorization status
4. Create audit log

**Response:**
```json
{
  "success": true,
  "data": {
    "verified": true,
    "verification_date": "2025-01-15"
  }
}
```

**Note:** This is a placeholder for future customs integration

---

## Edge Function Deployment

### Deploy Function

```bash
supabase functions deploy {function-name} --project-ref {project-ref}
```

### Set Environment Variables

```bash
supabase secrets set EMAIL_SERVICE_API_KEY=xxx --project-ref {project-ref}
```

### Test Function Locally

```bash
supabase functions serve {function-name}
```

---

## Scheduled Triggers (pg_cron)

Edge Functions can be triggered by pg_cron scheduled jobs:

**Example:**
```sql
SELECT cron.schedule(
  'cmc-calculate-scores-monthly',
  '0 0 1 * *',  -- First day of month, 00:00 UTC
  $$
  SELECT net.http_post(
    url := 'https://{project-ref}.supabase.co/functions/v1/cmc-calculate-scores',
    headers := '{"Authorization": "Bearer {service_role_key}", "Content-Type": "application/json"}'::jsonb,
    body := '{"score_period": "2025-01", "trigger": "scheduled"}'::jsonb
  );
  $$
);
```

---

## Error Handling

**Standard Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": {}
  }
}
```

**Error Codes:**
- `VALIDATION_ERROR` - Invalid request data
- `AUTHENTICATION_ERROR` - Authentication failed
- `EXTERNAL_API_ERROR` - External API call failed
- `SYSTEM_ERROR` - Internal system error

---

## Related Documents

- [API Specification](api-specification.md) - API design overview
- [RPC Function Specifications](rpc-functions.md) - RPC function specs
- [Integration API Specifications](../integration/erp-api-spec.md) - ERP API specs
- [Technical Decision Log](../../../06-development/technical-decisions/decision-log.md)

---

**Next Review Date:** [To be scheduled]  
**Owner:** Maya

