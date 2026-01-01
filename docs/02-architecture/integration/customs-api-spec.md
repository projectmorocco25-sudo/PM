# Customs Integration API Specification - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines the REST API specification for customs system integration (future).

**Last Updated:** 2025-12-31  
**Status:** ✅ Complete (Phase 0, Week 3)  
**Owner:** Maya

## Overview

Customs systems verify export completions with the PM platform via REST API. This API allows customs to verify that exports match authorized quantities and destinations.

**Note:** This is a placeholder for future customs integration. The API specification is defined but not yet implemented.

## Base URL

**Development:** `https://{dev-ref}.supabase.co/api/v1`  
**Staging:** `https://{staging-ref}.supabase.co/api/v1`  
**Production:** `https://{prod-ref}.supabase.co/api/v1`

## Authentication

### Step 1: Get JWT Token

**Endpoint:** `POST /auth/api-key`

**Headers:**
```
X-API-Key: {customs_api_key}
Content-Type: application/json
```

**Request Body:**
```json
{
  "system": "customs"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token",
    "expires_in": 3600,
    "token_type": "Bearer"
  }
}
```

---

### Step 2: Use JWT Token

**Headers:**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Token Expiration:** 1 hour (configurable)

---

## API Endpoints

### Verify Export

**Endpoint:** `POST /api/v1/exports/verify`

**Headers:**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "authorization_number": "EXP-2025-001",
  "export_date": "2025-01-15",
  "actual_quantity": 1000,
  "destination_country": "US",
  "shipping_details": {
    "vessel_name": "Ship Name",
    "container_number": "CONTAINER123",
    "bill_of_lading": "BOL123456"
  },
  "customs_declaration_number": "CUSTOMS123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "verification_id": "uuid",
    "authorization_id": "uuid",
    "verified": true,
    "verification_date": "2025-01-15T10:00:00Z",
    "matches": {
      "quantity": true,
      "destination": true,
      "date": true
    },
    "warnings": []
  }
}
```

**Error Response (Authorization Not Found):**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Export authorization not found"
  }
}
```

**Error Response (Mismatch):**
```json
{
  "success": false,
  "error": {
    "code": "VERIFICATION_FAILED",
    "message": "Export verification failed",
    "details": {
      "quantity_mismatch": {
        "authorized": 1000,
        "actual": 1200,
        "difference": 200
      },
      "destination_mismatch": {
        "authorized": "US",
        "actual": "CA"
      }
    }
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Validation error
- `401` - Authentication error
- `403` - Authorization error
- `404` - Authorization not found
- `500` - System error

---

### Get Export Authorization

**Endpoint:** `GET /api/v1/exports/authorization/{authorization_number}`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "authorization_id": "uuid",
    "authorization_number": "EXP-2025-001",
    "company_id": "uuid",
    "company_name": "Company Name",
    "sku_id": "uuid",
    "sku_name": "SKU Name",
    "authorized_quantity": 1000,
    "destination_country": "US",
    "valid_from": "2025-01-01",
    "valid_until": "2025-03-31",
    "status": "authorized",
    "created_at": "2025-01-01T10:00:00Z"
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Authentication error
- `403` - Authorization error
- `404` - Authorization not found
- `500` - System error

---

### List Export Authorizations

**Endpoint:** `GET /api/v1/exports/authorizations`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
- `status` (string) - Filter by status (authorized, completed, expired)
- `company_id` (uuid) - Filter by company
- `date_from` (date) - Filter by date from
- `date_to` (date) - Filter by date to
- `page` (integer) - Page number (default: 1)
- `limit` (integer) - Items per page (default: 20, max: 100)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "authorization_id": "uuid",
      "authorization_number": "EXP-2025-001",
      "company_name": "Company Name",
      "sku_name": "SKU Name",
      "authorized_quantity": 1000,
      "destination_country": "US",
      "status": "authorized",
      "valid_until": "2025-03-31"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "total_pages": 3,
    "has_next": true,
    "has_previous": false
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Authentication error
- `403` - Authorization error
- `500` - System error

---

## Verification Process

### Step 1: Customs Receives Export Documentation

Customs system receives export documentation (bill of lading, shipping manifest, etc.)

### Step 2: Customs Calls Verification API

Customs system calls `POST /api/v1/exports/verify` with export details

### Step 3: PM Platform Validates

PM platform validates:
- Authorization exists and is valid
- Export date is within authorization period
- Quantity matches (within tolerance)
- Destination matches
- Authorization status is `authorized`

### Step 4: PM Platform Updates Status

If verification succeeds:
- Updates export authorization status
- Creates export completion record
- Logs verification in audit trail
- Returns verification result

If verification fails:
- Returns error with mismatch details
- Does not update authorization status
- Logs verification attempt in audit trail

---

## Error Handling

### Standard Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### Error Codes

- `AUTHENTICATION_ERROR` - Invalid or missing authentication
- `AUTHORIZATION_ERROR` - User not authorized
- `VALIDATION_ERROR` - Data validation failed
- `NOT_FOUND` - Export authorization not found
- `VERIFICATION_FAILED` - Verification failed (mismatch)
- `AUTHORIZATION_EXPIRED` - Authorization expired
- `AUTHORIZATION_REVOKED` - Authorization revoked
- `SYSTEM_ERROR` - Internal system error

---

## Rate Limiting

**Limits:**
- Per-system: 100 requests per minute
- Per-endpoint: Configurable per endpoint

**Response Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## Data Validation

### Verification Request Validation

- Authorization number: Required, must exist
- Export date: Required, must be valid date
- Actual quantity: Required, must be positive number
- Destination country: Required, must match authorization
- Shipping details: Optional, but recommended

### Quantity Tolerance

**Default:** ±5% tolerance allowed

**Example:**
- Authorized: 1000
- Actual: 950-1050 (within tolerance)
- Actual: 900 or 1100 (outside tolerance, verification fails)

**Configurable:** Tolerance can be configured per authorization or system-wide

---

## Future Enhancements

### Webhook Support

PM platform can send webhooks to customs when:
- Export authorization created
- Export authorization expired
- Export authorization revoked
- Export completed

### Batch Verification

Support for batch verification of multiple exports in one request

### Real-Time Integration

Real-time integration with customs systems for automatic verification

---

## Related Documents

- [API Specification](../api/api-specification.md) - API design overview
- [Integration Architecture](integration-architecture.md) - Integration patterns
- [ERP API Specification](erp-api-spec.md) - ERP API specs
- [Technical Decision Log](../../../06-development/technical-decisions/decision-log.md)

---

**Next Review Date:** [To be scheduled]  
**Owner:** Maya

