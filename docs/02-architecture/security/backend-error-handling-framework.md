# Backend Error Handling Framework - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines the comprehensive error handling framework for RPC functions, Edge Functions, and API endpoints.

**Last Updated:** 2025-12-31  
**Status:** ✅ Complete (Phase 0, Gap Resolution)  
**Owner:** Maya (Workflow/RPC Engineer), Salim (Security & Audit Engineer)

## Overview

The PM platform implements a standardized error handling framework across all backend components (RPC functions, Edge Functions, REST APIs) to ensure consistent error responses, proper error logging, and secure error handling.

## Error Handling Principles

1. **Consistent Format:** All errors use standard error response format
2. **Secure:** Error messages don't expose system internals
3. **Auditable:** All errors logged in audit_logs
4. **User-Friendly:** Error messages clear and actionable
5. **Categorized:** Errors categorized by type (validation, business, system)
6. **Recoverable:** Distinguish recoverable vs non-recoverable errors

## Standard Error Response Format

### RPC Functions

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": [
      {
        "field": "field_name",
        "message": "Field-specific error message",
        "code": "FIELD_ERROR_CODE"
      }
    ],
    "timestamp": "2025-12-31T12:00:00Z",
    "request_id": "uuid"
  }
}
```

### Edge Functions

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "timestamp": "2025-12-31T12:00:00Z",
    "request_id": "uuid"
  }
}
```

### REST API

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": [...],
    "timestamp": "2025-12-31T12:00:00Z",
    "request_id": "uuid"
  }
}
```

**HTTP Status Codes:**
- `400` - Bad Request (validation errors, invalid input)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (authorization failed)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate entry, business rule violation)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error (system errors)
- `503` - Service Unavailable (temporary unavailability)

---

## Error Categories

### 1. Authentication Errors

**Code Prefix:** `AUTH_`

**Codes:**
- `AUTHENTICATION_ERROR` - Invalid or missing authentication
- `TOKEN_EXPIRED` - Authentication token expired
- `TOKEN_INVALID` - Invalid authentication token
- `SESSION_EXPIRED` - User session expired
- `INVALID_CREDENTIALS` - Invalid email/password

**Example:**
```sql
-- In RPC function
IF NOT auth.uid() IS NOT NULL THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', jsonb_build_object(
      'code', 'AUTHENTICATION_ERROR',
      'message', 'Authentication required'
    )
  );
END IF;
```

---

### 2. Authorization Errors

**Code Prefix:** `AUTHZ_`

**Codes:**
- `AUTHORIZATION_ERROR` - User not authorized for this operation
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `ROLE_NOT_ALLOWED` - User role not allowed for this operation
- `MODULE_ACCESS_DENIED` - User cannot access this module

**Example:**
```sql
-- In RPC function
IF NOT shared_check_user_permission(auth.uid(), 'create_company') THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', jsonb_build_object(
      'code', 'AUTHORIZATION_ERROR',
      'message', 'You do not have permission to create companies'
    )
  );
END IF;
```

---

### 3. Validation Errors

**Code Prefix:** `VALIDATION_`

**Codes:**
- `VALIDATION_ERROR` - General validation error
- `MISSING_REQUIRED_FIELD` - Required field missing
- `INVALID_FORMAT` - Invalid field format
- `INVALID_VALUE` - Invalid field value
- `OUT_OF_RANGE` - Field value out of allowed range
- `INVALID_REFERENCE` - Foreign key reference invalid

**Example:**
```sql
-- In RPC function
DECLARE
  validation_errors jsonb := '[]'::jsonb;
BEGIN
  IF name IS NULL OR trim(name) = '' THEN
    validation_errors := validation_errors || jsonb_build_object(
      'field', 'name',
      'message', 'Company name is required',
      'code', 'MISSING_REQUIRED_FIELD'
    );
  END IF;
  
  IF jsonb_array_length(validation_errors) > 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', jsonb_build_object(
        'code', 'VALIDATION_ERROR',
        'message', 'Validation failed',
        'details', validation_errors
      )
    );
  END IF;
END;
```

---

### 4. Business Rule Errors

**Code Prefix:** `BUSINESS_`

**Codes:**
- `BUSINESS_RULE_VIOLATION` - Business rule violated
- `INVALID_STATUS_TRANSITION` - Invalid workflow state transition
- `DEADLINE_PASSED` - Submission deadline has passed
- `DUPLICATE_ENTRY` - Entry already exists
- `MODULE_NOT_ACTIVE` - Required module not active
- `DEPENDENCY_NOT_MET` - Required dependency not met

**Example:**
```sql
-- In RPC function
IF EXISTS (SELECT 1 FROM companies WHERE registration_number = new_reg_number) THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', jsonb_build_object(
      'code', 'DUPLICATE_ENTRY',
      'message', 'Company with this registration number already exists'
    )
  );
END IF;
```

---

### 5. System Errors

**Code Prefix:** `SYSTEM_`

**Codes:**
- `SYSTEM_ERROR` - Internal system error
- `DATABASE_ERROR` - Database operation failed
- `SERVICE_UNAVAILABLE` - Service temporarily unavailable
- `TIMEOUT_ERROR` - Operation timed out
- `RATE_LIMIT_EXCEEDED` - Rate limit exceeded

**Example:**
```sql
-- In RPC function
BEGIN
  -- Operation that might fail
  INSERT INTO companies (name, registration_number) VALUES (name, reg_number);
  
  RETURN jsonb_build_object('success', true);
EXCEPTION
  WHEN OTHERS THEN
    -- Log error
    PERFORM create_audit_log(
      user_id := auth.uid(),
      operation_type := 'ERROR',
      table_name := 'companies',
      record_id := NULL,
      old_values := NULL,
      new_values := jsonb_build_object('error', SQLERRM),
      reason := 'System error during company creation'
    );
    
    -- Return generic error (don't expose system internals)
    RETURN jsonb_build_object(
      'success', false,
      'error', jsonb_build_object(
        'code', 'SYSTEM_ERROR',
        'message', 'An error occurred. Please try again later.'
      )
    );
END;
```

---

## Error Handling Patterns

### Pattern 1: RPC Function Error Handling

```sql
CREATE OR REPLACE FUNCTION example_function(param text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  request_id uuid := gen_random_uuid();
  error_details jsonb;
BEGIN
  -- 1. Authentication check
  IF auth.uid() IS NULL THEN
    RETURN create_error_response('AUTHENTICATION_ERROR', 'Authentication required', request_id);
  END IF;
  
  -- 2. Authorization check
  IF NOT shared_check_user_permission(auth.uid(), 'required_permission') THEN
    RETURN create_error_response('AUTHORIZATION_ERROR', 'Permission denied', request_id);
  END IF;
  
  -- 3. Validation
  IF param IS NULL THEN
    RETURN create_error_response('VALIDATION_ERROR', 'Parameter required', request_id, 
      jsonb_build_array(jsonb_build_object('field', 'param', 'message', 'Parameter is required')));
  END IF;
  
  -- 4. Business logic (with error handling)
  BEGIN
    -- Operation that might fail
    -- ...
    
    RETURN jsonb_build_object('success', true, 'data', result);
  EXCEPTION
    WHEN unique_violation THEN
      RETURN create_error_response('DUPLICATE_ENTRY', 'Entry already exists', request_id);
    WHEN foreign_key_violation THEN
      RETURN create_error_response('INVALID_REFERENCE', 'Invalid reference', request_id);
    WHEN OTHERS THEN
      -- Log system error
      PERFORM log_system_error(SQLERRM, SQLSTATE, request_id);
      RETURN create_error_response('SYSTEM_ERROR', 'An error occurred', request_id);
  END;
END;
$$;
```

### Pattern 2: Helper Function for Error Responses

```sql
-- Create standardized error response
CREATE OR REPLACE FUNCTION create_error_response(
  error_code text,
  error_message text,
  request_id uuid DEFAULT gen_random_uuid(),
  details jsonb DEFAULT '[]'::jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Log error
  PERFORM create_audit_log(
    user_id := auth.uid(),
    operation_type := 'ERROR',
    table_name := NULL,
    record_id := NULL,
    old_values := NULL,
    new_values := jsonb_build_object(
      'error_code', error_code,
      'error_message', error_message,
      'request_id', request_id
    ),
    reason := 'Error occurred'
  );
  
  -- Return error response
  RETURN jsonb_build_object(
    'success', false,
    'error', jsonb_build_object(
      'code', error_code,
      'message', error_message,
      'details', details,
      'timestamp', now(),
      'request_id', request_id
    )
  );
END;
$$;

-- Log system errors
CREATE OR REPLACE FUNCTION log_system_error(
  error_message text,
  error_state text,
  request_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Log to audit_logs
  PERFORM create_audit_log(
    user_id := auth.uid(),
    operation_type := 'SYSTEM_ERROR',
    table_name := NULL,
    record_id := NULL,
    old_values := NULL,
    new_values := jsonb_build_object(
      'error_message', error_message,
      'error_state', error_state,
      'request_id', request_id
    ),
    reason := 'System error occurred'
  );
  
  -- TODO: Send alert to monitoring system
END;
$$;
```

---

## Error Logging

### What to Log

1. **All Errors:** Log all errors in audit_logs
2. **Error Details:** Error code, message, request_id, user_id, timestamp
3. **Context:** Table name, record_id, operation type
4. **System Errors:** Full error message and stack trace (internal only)

### Logging Pattern

```sql
-- Log error in audit_logs
PERFORM create_audit_log(
  user_id := auth.uid(),
  operation_type := 'ERROR',
  table_name := 'companies',
  record_id := company_id,
  old_values := NULL,
  new_values := jsonb_build_object(
    'error_code', 'VALIDATION_ERROR',
    'error_message', 'Validation failed',
    'request_id', request_id
  ),
  reason := 'Error during company creation'
);
```

---

## Error Recovery

### Recoverable Errors

- Validation errors (user can correct and retry)
- Business rule violations (user can adjust and retry)
- Rate limit exceeded (user can retry after delay)

### Non-Recoverable Errors

- System errors (requires system intervention)
- Database errors (requires database intervention)
- Authentication errors (requires re-authentication)

### Retry Strategy

- **Automatic Retry:** Only for transient errors (timeouts, temporary unavailability)
- **Manual Retry:** User-initiated retry for validation/business errors
- **No Retry:** System errors, authentication errors

---

## Security Considerations

### 1. Don't Expose System Internals

**Bad:**
```json
{
  "error": {
    "message": "Error in function rmm_create_company at line 45: relation 'companies' does not exist"
  }
}
```

**Good:**
```json
{
  "error": {
    "code": "SYSTEM_ERROR",
    "message": "An error occurred. Please try again later."
  }
}
```

### 2. Log Full Details Internally

- Log full error details in audit_logs (for debugging)
- Return generic messages to users (for security)

### 3. Rate Limit Error Responses

- Don't leak information through error timing
- Consistent error response times

---

## Error Handling Checklist

### For Each RPC Function:

- [ ] Authentication check with error handling
- [ ] Authorization check with error handling
- [ ] Input validation with error handling
- [ ] Business rule validation with error handling
- [ ] Try-catch for database operations
- [ ] Standardized error response format
- [ ] Error logging in audit_logs
- [ ] User-friendly error messages
- [ ] No system internals exposed

---

## Related Documents

- [API Specification](../api/api-specification.md) - Error response format
- [Backend Validation Strategy](backend-validation-strategy.md) - Validation errors
- [Audit Logging Specification](audit-logging-spec.md) - Error logging

---

**Next Review Date:** [To be scheduled]  
**Owner:** Maya (Workflow/RPC Engineer), Salim (Security & Audit Engineer)

