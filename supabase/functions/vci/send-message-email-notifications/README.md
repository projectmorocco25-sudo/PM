# vci-send-message-email-notifications

**Module:** vci (communication)  
**Category:** Notifications  
**Purpose:** Send email notifications for new messages

## Overview

This Edge Function reads message notifications from the database and sends emails via the shared-send-email function.

## Request Format

```json
{
  "notification_ids": ["uuid1", "uuid2"],
  "check_date": "2025-01-12"
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
    "code": "SYSTEM_ERROR",
    "message": "Internal server error"
  }
}
```

## Environment Variables

- `SUPABASE_URL` - Supabase project URL (automatically set)
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (automatically set)

## Deployment

```bash
supabase functions deploy vci-send-message-email-notifications --project-ref {project-ref}
```

## Testing

```bash
# Test locally
supabase functions serve vci-send-message-email-notifications

# Test with curl
curl -X POST http://localhost:54321/functions/v1/vci-send-message-email-notifications \
  -H "Authorization: Bearer {anon-key}" \
  -H "Content-Type: application/json" \
  -d '{"notification_ids": ["uuid1"]}'
```

## Related Functions

- `shared-send-email` - Shared email sending function
- `communications_send_message` - Creates message notifications

## Related Documents

- [Edge Function Specifications](../../../docs/02-architecture/api/edge-functions.md)
