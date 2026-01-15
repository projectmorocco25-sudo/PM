# shared-send-email

**Module:** shared  
**Category:** Notifications  
**Purpose:** Send email notifications via external email service

## Overview

This Edge Function sends email notifications either:
1. **Batch mode:** Reads notifications from database and sends emails
2. **Direct mode:** Sends a single email directly

## Request Format

### Batch Mode (Task 1.1.1.4e)

```json
{
  "notification_ids": ["uuid1", "uuid2"]
}
```

### Direct Mode

```json
{
  "to": "recipient@example.com",
  "subject": "Email subject",
  "body": "Email body",
  "template": "notification_template",
  "data": {
    "key": "value"
  }
}
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    "sent_count": 10,
    "failed_count": 0
  }
}
```

### Error Response

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

## Environment Variables

- `SUPABASE_URL` - Supabase project URL (automatically set)
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (automatically set)
- `EMAIL_SERVICE_URL` - External email service URL
- `EMAIL_SERVICE_API_KEY` - External email service API key

## Deployment

```bash
supabase functions deploy shared-send-email --project-ref {project-ref}
```

## Testing

```bash
# Test locally
supabase functions serve shared-send-email

# Test with curl
curl -X POST http://localhost:54321/functions/v1/shared-send-email \
  -H "Authorization: Bearer {anon-key}" \
  -H "Content-Type: application/json" \
  -d '{"notification_ids": ["uuid1"]}'
```

## Related Functions

- `shared_create_notification` - Creates notifications that this function sends
- `communications_send_message` - Creates message notifications

## Related Documents

- [Edge Function Specifications](../../../docs/02-architecture/api/edge-functions.md)
- [Backend Error Handling Framework](../../../docs/02-architecture/security/backend-error-handling-framework.md)
