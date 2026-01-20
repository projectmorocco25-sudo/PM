# API Contract Documentation Format - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines the standard format for documenting RPC functions, including request/response schemas, error handling, and examples.

**Created:** 2026-01-17  
**Task:** 1.1.1.1c  
**Author:** Sami (Implementation Compliance Specialist)  
**Owner:** Maya (Workflow/RPC Engineer)

---

## Overview

This document defines the standard format for documenting all RPC functions in the PM platform. The format is inspired by OpenAPI/Swagger specifications and ensures consistency across all API documentation.

**Documentation Location:** Each RPC function must be documented in both:
1. **Code Comments:** Function header comments in SQL migration file
2. **API Documentation:** Centralized documentation in `docs/02-architecture/api/rpc-functions.md`

---

## RPC Function Documentation Template

### Function Header Template

```sql
/**
 * RPC Function: {function_name}
 * 
 * Purpose: {brief_description_of_what_function_does}
 * 
 * Module: {module_name} (rmm, vci, ecs, cmc, shared)
 * Security: {SECURITY DEFINER | SECURITY INVOKER}
 * 
 * Parameters:
 *   - {param_name} ({param_type}): {param_description} [{required|optional}]
 *   - ...
 * 
 * Returns: {return_type} - {return_description}
 * 
 * Side Effects:
 *   - {side_effect_description} (if any)
 * 
 * Business Rules:
 *   - {business_rule_1}
 *   - {business_rule_2}
 * 
 * Error Cases:
 *   - {error_case_1}: {error_code} - {error_message}
 *   - {error_case_2}: {error_code} - {error_message}
 * 
 * Example:
 *   SELECT {function_name}({param1}, {param2});
 * 
 * Related Functions:
 *   - {related_function_1}
 *   - {related_function_2}
 */
CREATE OR REPLACE FUNCTION {function_name}(...)
RETURNS {return_type}
LANGUAGE plpgsql
SECURITY {DEFINER | INVOKER}
AS $$
-- Function body
$$;
```

---

## API Contract Documentation Format

### Standard Format for API Documentation

Each RPC function must be documented using the following format:

```markdown
### {function_name}({parameter_list})

**Purpose:** {brief_description}

**Module:** {module_name}

**Security:** {SECURITY DEFINER | SECURITY INVOKER}

**Parameters:**

| Parameter | Type | Required | Description | Constraints |
|-----------|------|----------|-------------|-------------|
| {param_name} | {param_type} | {Yes/No} | {description} | {constraints, e.g., CHECK constraint, format, range} |

**Returns:**

| Type | Description |
|------|-------------|
| {return_type} | {return_description} |

**Business Rules:**

1. {business_rule_1}
2. {business_rule_2}

**State Transitions:** (if applicable)

- `{from_state}` → `{to_state}` (when {condition})

**Error Cases:**

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| {error_code} | {http_status} | {error_description} |

**Example Request:**

```json
{
  "{param_name}": "{param_value}",
  ...
}
```

**Example Response:**

```json
{
  "{field_name}": "{field_value}",
  ...
}
```

**Example SQL:**

```sql
SELECT {function_name}({param1}, {param2});
```

**Related Functions:**

- {related_function_1}: {relationship_description}
- {related_function_2}: {relationship_description}
```

---

## Parameter Documentation Standards

### Parameter Types

**Standard Types:**
- `uuid` - UUID identifier
- `text` - String text
- `integer` - Integer number
- `numeric` - Decimal number
- `boolean` - Boolean value
- `jsonb` - JSON object
- `timestamptz` - Timestamp with timezone
- `date` - Date (no time)

### Parameter Constraints

**Required Fields:**
- Mark as "Required: Yes" in documentation
- Use `NOT NULL` in function signature
- Validate in function body

**Optional Fields:**
- Mark as "Required: No" in documentation
- Use `NULLABLE` in function signature
- Handle NULL values in function body

**Format Constraints:**
- Email: Must match email format regex
- Phone: Must match phone format
- Date: Must be valid date (YYYY-MM-DD)
- Timestamp: Must be valid timestamp with timezone

**Range Constraints:**
- Numeric ranges: `CHECK (value >= min AND value <= max)`
- Date ranges: `CHECK (date >= start_date AND date <= end_date)`
- Enum values: `CHECK (value IN ('value1', 'value2', ...))`

---

## Return Value Documentation Standards

### Return Types

**Simple Types:**
- `boolean` - True/false
- `integer` - Integer number
- `text` - String text
- `uuid` - UUID identifier

**Complex Types:**
- `json` - JSON object with defined structure
- `jsonb` - JSONB object with defined structure
- `table` - Table return type (SETOF)

### JSON/JSONB Return Structure

**Documentation Format:**
```markdown
**Returns:** jsonb - Object with following structure:

```json
{
  "field_name": {type},
  "nested_object": {
    "nested_field": {type}
  },
  "array_field": [{type}]
}
```
```

---

## Error Handling Documentation

### Error Response Format

**Standard Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "field_name",
      "reason": "Specific error reason"
    }
  }
}
```

### Error Codes

**Standard Error Codes:**

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `AUTHENTICATION_ERROR` | 401 | Authentication failed (invalid JWT, missing auth) |
| `AUTHORIZATION_ERROR` | 403 | Authorization failed (user doesn't have permission) |
| `VALIDATION_ERROR` | 400 | Input validation failed (invalid format, missing required field) |
| `BUSINESS_RULE_VIOLATION` | 400 | Business rule violated (e.g., invalid state transition) |
| `NOT_FOUND` | 404 | Resource not found (e.g., company_id doesn't exist) |
| `CONFLICT` | 409 | Resource conflict (e.g., duplicate email) |
| `SYSTEM_ERROR` | 500 | Internal system error (database error, unexpected exception) |

### Error Documentation Template

```markdown
**Error Cases:**

1. **Invalid Input** (`VALIDATION_ERROR`, 400)
   - Condition: Required parameter missing or invalid format
   - Response: `{"success": false, "error": {"code": "VALIDATION_ERROR", "message": "Parameter validation failed", "details": {"field": "email", "reason": "Invalid email format"}}}`

2. **Unauthorized** (`AUTHORIZATION_ERROR`, 403)
   - Condition: User doesn't have required permissions
   - Response: `{"success": false, "error": {"code": "AUTHORIZATION_ERROR", "message": "User does not have permission to perform this action"}}`

3. **Not Found** (`NOT_FOUND`, 404)
   - Condition: Referenced resource doesn't exist
   - Response: `{"success": false, "error": {"code": "NOT_FOUND", "message": "Company not found", "details": {"resource": "company", "id": "uuid"}}}`
```

---

## Example Documentation

### Example 1: Simple RPC Function

```markdown
### shared_check_module_active(module_name text)

**Purpose:** Check if a module is currently active

**Module:** shared

**Security:** SECURITY INVOKER

**Parameters:**

| Parameter | Type | Required | Description | Constraints |
|-----------|------|----------|-------------|-------------|
| module_name | text | Yes | Module name to check | Must be one of: 'rmm', 'vci', 'ecs', 'cmc' |

**Returns:**

| Type | Description |
|------|-------------|
| boolean | True if module is active, false otherwise |

**Business Rules:**

1. Module must exist in system_config table
2. Module must have is_active = true

**Error Cases:**

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NOT_FOUND` | 404 | Module name not found in system_config |

**Example SQL:**

```sql
SELECT shared_check_module_active('ecs');
```

**Example Response:**

```json
{
  "success": true,
  "data": true
}
```
```

### Example 2: Complex RPC Function with State Transitions

```markdown
### communications_send_message(conversation_id uuid, content text, recipient_id uuid)

**Purpose:** Send a message in a conversation

**Module:** shared (communications)

**Security:** SECURITY DEFINER

**Parameters:**

| Parameter | Type | Required | Description | Constraints |
|-----------|------|----------|-------------|-------------|
| conversation_id | uuid | Yes | Conversation ID | Must exist in conversations table |
| content | text | Yes | Message content | Minimum 1 character, maximum 10000 characters |
| recipient_id | uuid | No | Recipient user ID | NULL for announcements |

**Returns:**

| Type | Description |
|------|-------------|
| uuid | Message ID of created message |

**Business Rules:**

1. User must be a participant in the conversation
2. Conversation must not be archived
3. Message content must not be empty
4. If recipient_id provided, user must exist

**State Transitions:**

- `conversations.lifecycle_state`: 
  - `'CREATED'` → `'SENT'` (first message in conversation)
  - `'SENT'` → `'DELIVERED'` (when message delivered to recipient inbox)
- `messages.delivered_at`: Set to current timestamp when message delivered

**Side Effects:**

1. Creates message record in messages table
2. Updates conversations.lifecycle_state
3. Sets messages.delivered_at timestamp
4. Creates notification for recipient (if recipient_id provided)
5. Creates audit log entry

**Error Cases:**

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `AUTHORIZATION_ERROR` | 403 | User is not a participant in conversation |
| `VALIDATION_ERROR` | 400 | Message content is empty or exceeds length limit |
| `NOT_FOUND` | 404 | Conversation or recipient not found |
| `BUSINESS_RULE_VIOLATION` | 400 | Conversation is archived |

**Example Request:**

```json
{
  "conversation_id": "123e4567-e89b-12d3-a456-426614174000",
  "content": "Hello, this is a test message",
  "recipient_id": "223e4567-e89b-12d3-a456-426614174001"
}
```

**Example Response:**

```json
{
  "success": true,
  "data": "323e4567-e89b-12d3-a456-426614174002"
}
```

**Example SQL:**

```sql
SELECT communications_send_message(
  '123e4567-e89b-12d3-a456-426614174000',
  'Hello, this is a test message',
  '223e4567-e89b-12d3-a456-426614174001'
);
```

**Related Functions:**

- `communications_create_conversation`: Creates the conversation this message belongs to
- `communications_mark_read`: Marks message as read by recipient
```

---

## OpenAPI/Swagger Equivalent Mapping

### Supabase RPC Functions vs REST API

While PM platform uses Supabase RPC functions (not REST API), we document them in a format similar to OpenAPI/Swagger for consistency:

| OpenAPI/Swagger Concept | RPC Function Equivalent | Documentation Format |
|-------------------------|-------------------------|----------------------|
| Endpoint | Function name | `{module}_{action}` (e.g., `rmm_create_company`) |
| Method | N/A (RPC call) | POST (via Supabase client `.rpc()`) |
| Request Body | Function parameters | Parameters table |
| Response Body | Return value | Returns table |
| Status Codes | Error codes | Error cases table |
| Security | SECURITY DEFINER/INVOKER | Security field |
| Schemas | Type definitions | Parameter/Return type documentation |

---

## Documentation Maintenance

### Documentation Updates

**When to Update:**
- When function signature changes (parameters, return type)
- When business rules change
- When error handling changes
- When new related functions are added

**Update Process:**
1. Update function SQL header comments
2. Update centralized API documentation (`rpc-functions.md`)
3. Update examples if they're outdated
4. Document breaking changes in migration notes

### Documentation Review

**Review Checklist:**
- [ ] All parameters documented
- [ ] All return values documented
- [ ] All error cases documented
- [ ] Examples are accurate and up-to-date
- [ ] Related functions listed
- [ ] Business rules clearly stated
- [ ] Security considerations documented

---

## Related Documents

- [RPC Functions](./rpc-functions.md) - Complete RPC function specifications
- [API Specifications](./api-specification.md) - External API specifications
- [Backend Error Handling Framework](../security/backend-error-handling-framework.md) - Error handling standards
- [Backend Validation Strategy](../security/backend-validation-strategy.md) - Input validation standards

---

**Last Updated:** 2026-01-17  
**Next Review Date:** After Phase 1.1 Complete
