# API Specification - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines the API specification for the PM platform, including RPC functions, Edge Functions, and REST API endpoints.

**Last Updated:** 2025-12-31  
**Status:** ✅ Complete (Phase 0, Week 3)  
**Owner:** Maya

## Overview

The PM platform uses three types of APIs:
1. **RPC Functions:** Database functions called via Supabase client (primary API)
2. **Edge Functions:** Serverless functions for external integrations and background processing
3. **REST API:** External system integrations (ERP, customs)

## API Design Principles

1. **Consistent Response Format:** All APIs return standard JSON response format
2. **Error Handling:** Standard error codes and messages
3. **Authentication:** All APIs require authentication (except public endpoints)
4. **Versioning:** URL-based versioning for REST APIs (`/api/v1/...`)
5. **Documentation:** All APIs documented with request/response schemas
6. **Transaction Management:** RPC functions use database transactions

## Standard Response Format

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
    "message": "Human-readable error message",
    "details": [
      {
        "field": "field_name",
        "message": "Field-specific error message"
      }
    ]
  }
}
```

## Error Codes

### Authentication & Authorization

- `AUTHENTICATION_ERROR` - Invalid or missing authentication
- `AUTHORIZATION_ERROR` - User not authorized for this operation
- `TOKEN_EXPIRED` - Authentication token expired
- `INVALID_API_KEY` - Invalid API key

### Validation

- `VALIDATION_ERROR` - Data validation failed
- `MISSING_REQUIRED_FIELD` - Required field missing
- `INVALID_FORMAT` - Invalid data format
- `INVALID_VALUE` - Invalid field value

### Business Rules

- `BUSINESS_RULE_VIOLATION` - Business rule violated
- `INVALID_STATUS_TRANSITION` - Invalid workflow state transition
- `DEADLINE_PASSED` - Submission deadline passed
- `MODULE_NOT_ACTIVE` - Required module not active

### System

- `NOT_FOUND` - Resource not found
- `DUPLICATE_ENTRY` - Duplicate entry exists
- `SYSTEM_ERROR` - Internal system error
- `SERVICE_UNAVAILABLE` - Service temporarily unavailable

## RPC Functions

RPC functions are the primary API for the PM platform. They are called via Supabase client and execute database operations.

### RPC Function Naming Convention

**Pattern:** `{module}_{action}_{entity}`

**Examples:**
- `rmm_create_company` - RMM module, create action, company entity
- `vci_submit_aams` - VCI module, submit action, AAMS entity
- `ecs_authorize_export` - ECS module, authorize action, export entity
- `cmc_calculate_compliance_score` - CMC module, calculate action, compliance_score entity

### RPC Function Categories

1. **CRUD Functions:** Create, read, update, delete operations
2. **State Transition Functions:** Workflow state changes
3. **Query Functions:** Complex queries with filtering, sorting, pagination
4. **Calculation Functions:** Business logic calculations
5. **Cross-Module Functions:** Operations that span multiple modules

### RPC Function Response Format

**Success:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    // Entity data
  }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message"
  }
}
```

### RPC Function Security

- **SECURITY DEFINER:** Functions that need elevated permissions (cross-module operations)
- **SECURITY INVOKER:** Standard functions (use caller's permissions)
- **RLS:** RLS policies apply to RPC functions (unless SECURITY DEFINER)
- **Audit Logging:** All RPC functions log operations in audit_logs

---

## Edge Functions

Edge Functions are serverless functions for external integrations and background processing.

### Edge Function Naming Convention

**Pattern:** `{module}-{purpose}`

**Examples:**
- `vci-send-email-notifications` - VCI module, send email notifications
- `cmc-calculate-scores` - CMC module, calculate compliance scores
- `ecs-verify-export` - ECS module, verify export with customs

### Edge Function Categories

1. **Notification Functions:** Send emails, SMS, webhooks
2. **Background Processing:** Scheduled calculations, data processing
3. **External API Integration:** Call external APIs (customs, email service)
4. **Event Handlers:** Handle events from other systems

### Edge Function Request Format

**HTTP Method:** POST (standard)

**Headers:**
```
Authorization: Bearer {service_role_key}
Content-Type: application/json
```

**Request Body:**
```json
{
  "event": "event_name",
  "data": {
    // Event data
  }
}
```

### Edge Function Response Format

**Success:**
```json
{
  "success": true,
  "data": {
    // Response data
  }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message"
  }
}
```

---

## REST API (External Systems)

REST API endpoints for external system integrations (ERP, customs).

### Base URL

**Development:** `https://{project-ref}.supabase.co/api/v1`  
**Staging:** `https://{staging-ref}.supabase.co/api/v1`  
**Production:** `https://{prod-ref}.supabase.co/api/v1`

### Authentication

**Method:** API Key + JWT Token

**Flow:**
1. Client sends API key: `X-API-Key: {company_api_key}`
2. Server validates API key and returns JWT token
3. Client uses JWT token: `Authorization: Bearer {token}`
4. Token expires after configured duration

### API Versioning

**URL-based versioning:** `/api/v1/...`, `/api/v2/...`

**Version Lifecycle:**
1. New version created with new endpoints
2. Old version marked as deprecated
3. Migration period provided
4. Old version removed after migration

---

## Request/Response Schemas

### Pagination

**Request Parameters:**
- `page` (integer, default: 1) - Page number
- `limit` (integer, default: 20, max: 100) - Items per page
- `offset` (integer) - Alternative to page (offset-based pagination)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "total_pages": 5,
    "has_next": true,
    "has_previous": false
  }
}
```

### Filtering

**Request Parameters:**
- `filter[{field}]` - Filter by field value
- `filter[{field}][operator]` - Filter operator (eq, ne, gt, gte, lt, lte, like, in)
- `filter[{field}][value]` - Filter value

**Examples:**
- `filter[status]=submitted` - Filter by status
- `filter[created_at][gte]=2025-01-01` - Filter by date range
- `filter[company_id][in]=uuid1,uuid2` - Filter by multiple values

### Sorting

**Request Parameters:**
- `sort` (string) - Sort field and direction (e.g., `created_at:desc`, `name:asc`)
- Multiple sorts: `sort=created_at:desc,name:asc`

### Field Selection

**Request Parameters:**
- `fields` (string) - Comma-separated list of fields to return
- Example: `fields=id,name,status`

---

## Rate Limiting

**Limits:**
- Per-company rate limits (configurable)
- Per-endpoint rate limits
- Per-user rate limits

**Response Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

**Rate Limit Exceeded:**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please try again later.",
    "retry_after": 60
  }
}
```

---

## Related Documents

- [RPC Function Specifications](rpc-functions.md) - Detailed RPC function specs
- [Edge Function Specifications](edge-functions.md) - Detailed Edge Function specs
- [Integration API Specifications](../integration/erp-api-spec.md) - ERP API specs
- [Integration API Specifications](../integration/customs-api-spec.md) - Customs API specs
- [Workflow Architecture](../workflow-architecture.md) - Workflow state machines
- [Technical Decision Log](../../../06-development/technical-decisions/decision-log.md)

---

**Next Review Date:** [To be scheduled]  
**Owner:** Maya

