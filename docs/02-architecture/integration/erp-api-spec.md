# ERP Integration API Specification - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines the REST API specification for ERP system integration.

**Last Updated:** 2025-12-31  
**Status:** ✅ Complete (Phase 0, Week 3)  
**Owner:** Maya

## Overview

ERP systems (from IPCs and Wholesalers) submit data to the PM platform via REST API. This API supports MSQ, WSL, and AAMS submissions.

## Base URL

**Development:** `https://{dev-ref}.supabase.co/api/v1`  
**Staging:** `https://{staging-ref}.supabase.co/api/v1`  
**Production:** `https://{prod-ref}.supabase.co/api/v1`

## Authentication

### Step 1: Get JWT Token

**Endpoint:** `POST /auth/api-key`

**Headers:**
```
X-API-Key: {company_api_key}
Content-Type: application/json
```

**Request Body:**
```json
{
  "company_id": "uuid"
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

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_API_KEY",
    "message": "Invalid API key"
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

**Token Refresh:** Call `/auth/api-key` again to get new token

---

## API Endpoints

### Submit MSQ (Monthly Sales Quantities)

**Endpoint:** `POST /api/v1/submissions/msq`

**Headers:**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "year": 2025,
  "month": 1,
  "submission_data": {
    "sku_id_1": 1000,
    "sku_id_2": 2000,
    "sku_id_3": 1500
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "submission_id": "uuid",
    "status": "submitted",
    "validation_flags": null,
    "created_at": "2025-01-15T10:00:00Z"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "MSQ submission validation failed",
    "details": [
      {
        "field": "month",
        "message": "Month must be between 1 and 12"
      }
    ]
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Validation error
- `401` - Authentication error
- `403` - Authorization error
- `500` - System error

---

### Submit WSL (Weekly Stock Levels)

**Endpoint:** `POST /api/v1/submissions/wsl`

**Headers:**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "week_ending_date": "2025-01-15",
  "submission_data": {
    "sku_id_1": {
      "stock_level": 5000,
      "location": "Warehouse A"
    },
    "sku_id_2": {
      "stock_level": 3000,
      "location": "Warehouse B"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "submission_id": "uuid",
    "status": "submitted",
    "is_late": false,
    "is_non_compliant": false,
    "breaches_detected": [
      {
        "sku_id": "uuid",
        "stock_level": 500,
        "threshold_value": 1000
      }
    ],
    "created_at": "2025-01-15T10:00:00Z"
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Validation error
- `401` - Authentication error
- `403` - Authorization error
- `500` - System error

---

### Submit AAMS (Annual Average Monthly Sales)

**Endpoint:** `POST /api/v1/submissions/aams`

**Headers:**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "year": 2024,
  "aams_value": 12000.50,
  "submission_data": {
    "january": 1000,
    "february": 1100,
    "march": 1200,
    "april": 1300,
    "may": 1400,
    "june": 1500,
    "july": 1600,
    "august": 1700,
    "september": 1800,
    "october": 1900,
    "november": 2000,
    "december": 2100
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "submission_id": "uuid",
    "status": "submitted",
    "is_late": false,
    "created_at": "2025-01-15T10:00:00Z"
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Validation error
- `401` - Authentication error
- `403` - Authorization error
- `500` - System error

---

### Check Submission Status

**Endpoint:** `GET /api/v1/submissions/status/{submission_id}`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "submission_id": "uuid",
    "submission_type": "msq",
    "status": "accepted",
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-01-15T10:05:00Z"
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Authentication error
- `403` - Authorization error
- `404` - Submission not found
- `500` - System error

---

### Batch Submission (MSQ)

**Endpoint:** `POST /api/v1/submissions/msq/batch`

**Headers:**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "submissions": [
    {
      "year": 2025,
      "month": 1,
      "submission_data": {
        "sku_id_1": 1000,
        "sku_id_2": 2000
      }
    },
    {
      "year": 2025,
      "month": 2,
      "submission_data": {
        "sku_id_1": 1100,
        "sku_id_2": 2100
      }
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "batch_id": "uuid",
    "submissions": [
      {
        "submission_id": "uuid",
        "status": "submitted",
        "index": 0
      },
      {
        "submission_id": "uuid",
        "status": "submitted",
        "index": 1
      }
    ],
    "total": 2,
    "successful": 2,
    "failed": 0
  }
}
```

**Status Codes:**
- `200` - Success (all or partial)
- `400` - Validation error
- `401` - Authentication error
- `500` - System error

---

## Error Handling

### Standard Error Response

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

### Error Codes

- `AUTHENTICATION_ERROR` - Invalid or missing authentication
- `AUTHORIZATION_ERROR` - User not authorized
- `VALIDATION_ERROR` - Data validation failed
- `BUSINESS_RULE_VIOLATION` - Business rule violated
- `NOT_FOUND` - Resource not found
- `SYSTEM_ERROR` - Internal system error

---

## Rate Limiting

**Limits:**
- Per-company: 100 requests per minute
- Per-endpoint: Configurable per endpoint

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

## Data Validation

### MSQ Validation

- Year: Must be current or previous year
- Month: Must be between 1 and 12
- Submission data: Must include at least one SKU
- SKU IDs: Must exist and belong to company
- Quantities: Must be non-negative numbers

### WSL Validation

- Week ending date: Must be a Friday
- Submission data: Must include ALL SKUs (complete submission)
- Stock levels: Must be non-negative numbers
- Timeliness: Must be submitted by Friday EOD

### AAMS Validation

- Year: Must be previous calendar year
- AAMS value: Must be positive number
- Submission data: Must include all 12 months
- Timeliness: Must be submitted by January 31st (15-day grace period)

---

## Related Documents

- [API Specification](../api/api-specification.md) - API design overview
- [Integration Architecture](integration-architecture.md) - Integration patterns
- [Customs API Specification](customs-api-spec.md) - Customs API specs
- [Technical Decision Log](../../../06-development/technical-decisions/decision-log.md)

---

**Next Review Date:** [To be scheduled]  
**Owner:** Maya

