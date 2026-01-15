# {function-name}

**Module:** {module_name}  
**Category:** {category}  
**Purpose:** {brief_description}

## Overview

{Detailed description of what this function does}

## Request Format

```json
{
  "event": "event_type",
  "data": {
    // Request data
  }
}
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
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
- `{CUSTOM_VAR}` - Custom environment variable

## Deployment

```bash
supabase functions deploy {function-name} --project-ref {project-ref}
```

## Testing

```bash
# Test locally
supabase functions serve {function-name}

# Test with curl
curl -X POST http://localhost:54321/functions/v1/{function-name} \
  -H "Authorization: Bearer {anon-key}" \
  -H "Content-Type: application/json" \
  -d '{"event": "test", "data": {}}'
```

## Related Functions

- {related_function_1} - {relationship}
- {related_function_2} - {relationship}

## Related Documents

- [Edge Function Specifications](../../../docs/02-architecture/api/edge-functions.md)
