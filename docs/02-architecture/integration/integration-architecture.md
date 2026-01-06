# Integration Architecture - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document describes the integration architecture for external systems (ERP, customs) and internal module integrations.

**Last Updated:** 2025-12-31  
**Status:** ✅ Complete (Phase 0, Week 1)  
**Owner:** Maya

## Overview

The PM platform integrates with external systems (ERP systems, customs) and maintains internal module integrations. This document describes the high-level integration patterns, authentication approaches, and data flows.

## Integration Patterns

### Pattern 1: REST API Integration (External Systems)

**Use Case:** ERP systems and customs systems integrate with PM platform

**Approach:**
- RESTful API endpoints
- JSON payloads
- API Key + JWT token authentication
- URL-based versioning (`/api/v1/...`)

**When to Use:**
- External systems need to submit data (ERP → PM)
- External systems need to verify data (Customs → PM)
- System-to-system integration

---

### Pattern 2: Direct Database Access (Internal Modules)

**Use Case:** Modules access each other's data

**Approach:**
- Direct database queries via Supabase client
- RLS policies enforce security boundaries
- No API layer needed

**When to Use:**
- Module-to-module data access within PM platform
- Cross-module calculations
- Standard internal operations

---

### Pattern 3: RPC Functions (Cross-Module Operations)

**Use Case:** Complex cross-module operations that need elevated permissions

**Approach:**
- Supabase RPC functions marked as SECURITY DEFINER
- Audit logging for all function calls
- Runs with creator's permissions

**When to Use:**
- Cross-module calculations (e.g., CMC score calculation)
- Operations that need to read across modules
- System-wide operations

---

### Pattern 4: Edge Functions (External API Calls)

**Use Case:** PM platform needs to call external APIs

**Approach:**
- Supabase Edge Functions
- Handles external API calls (e.g., email service, customs API)
- Event-triggered or API-triggered

**When to Use:**
- Sending emails via external email service
- Calling customs APIs (future)
- Any external API integration

---

## ERP Integration

### Overview

ERP systems (from IPCs and Wholesalers) submit data to the PM platform via REST API.

### Integration Pattern

```
ERP System
  │
  │ REST API Call
  │ POST /api/v1/submissions/{type}
  │
  └─→ PM Platform (Edge Function or API endpoint)
        │
        │ Validates & Stores
        │
        └─→ VCI Module Database
              - MSQ submissions
              - WSL submissions
              - AAMS submissions
```

### Authentication Flow

1. **Initial Authentication:**
   - ERP system sends API key: `X-API-Key: {company_api_key}`
   - PM platform validates API key
   - Returns short-lived JWT token

2. **Subsequent Requests:**
   - ERP system uses JWT token: `Authorization: Bearer {token}`
   - JWT token validated on each request
   - Token expires after configured duration

3. **API Key Management:**
   - Each company has unique API key
   - API keys can be rotated/revoked
   - Different keys per environment (dev/staging/prod)

### Data Submission Endpoints

**MSQ Submission:**
- `POST /api/v1/submissions/msq`
- Payload: MSQ data for the month
- Response: Submission status and ID

**WSL Submission:**
- `POST /api/v1/submissions/wsl`
- Payload: WSL data for all SKUs (complete submission)
- Response: Submission status and ID

**AAMS Submission:**
- `POST /api/v1/submissions/aams`
- Payload: AAMS data for the year
- Response: Submission status and ID

**Submission Status Check:**
- `GET /api/v1/submissions/status/{id}`
- Returns: Current submission status

### Data Flow

1. ERP system collects data (MSQ, WSL, AAMS)
2. ERP system authenticates with API key
3. ERP system submits data via REST API
4. PM platform validates data format and business rules
5. PM platform stores data in VCI module tables
6. PM platform returns submission status
7. ERP system can check submission status via API

### Error Handling

- **Validation errors:** Return detailed validation messages
- **Authentication errors:** Return authentication error codes
- **Business rule violations:** Return clear business error messages
- **System errors:** Log internally, return generic error to ERP

### Batch Upload Support

- Support for batch submissions (multiple months/weeks in one request)
- Transaction-based: All succeed or all fail
- Returns detailed status for each item in batch

---

## Customs Integration (Future)

### Overview

Customs systems verify export completions with the PM platform via REST API.

### Integration Pattern

```
Customs System
  │
  │ REST API Call
  │ POST /api/v1/exports/verify
  │
  └─→ PM Platform (Edge Function or API endpoint)
        │
        │ Validates & Updates
        │
        └─→ ECS Module Database
              - Export authorization status
              - Export completion records
```

### Authentication Flow

- Similar to ERP integration (API Key + JWT)
- Customs system gets dedicated API key
- JWT token for subsequent requests

### Verification Endpoint

**Export Verification:**
- `POST /api/v1/exports/verify`
- Payload: Export details (date, quantities, destination, authorization ID)
- Response: Verification status

### Data Flow

1. Customs system receives export documentation
2. Customs system authenticates with API key
3. Customs system verifies export via REST API
4. PM platform validates export authorization exists
5. PM platform updates export authorization status
6. PM platform logs verification in audit trail
7. PM platform returns verification status

---

## Internal Module Integration

### VCI → ECS Integration

**Data Flow:**
- ECS reads MSQ data from VCI for XAMS calculations
- Direct database query (RLS enforced)
- No API call needed

**Implementation:**
- ECS RPC function queries `msq_submissions` table
- Calculates XAMS (rolling average over X months)
- Uses XAMS for ECS Threshold calculation

### VCI → CMC Integration

**Data Flow:**
- CMC reads WSL, MSQ, AAMS data from VCI for compliance scoring
- Direct database query (RLS enforced for user queries)
- Service role for scheduled jobs (bypasses RLS)

**Implementation:**
- CMC scheduled job (monthly) reads all VCI data
- Uses service role for system-wide access
- Calculates compliance scores
- Stores results in CMC tables

### ECS → CMC Integration

**Data Flow:**
- CMC reads export compliance data from ECS for scoring
- ECS provides compliance scores to CMC for conditional validation

**Implementation:**
- **CMC → ECS (read):** CMC reads `export_authorizations` and `replenishment_schedules` from ECS
- **CMC → ECS (write):** CMC provides `compliance_scores` to ECS for conditional validation
- Conditional validation happens in ECS workflow (checks CMC score when processing export request)

### ECS → VCI Integration

**Data Flow:**
- ECS authorization triggers VCI threshold switch
- This is a workflow side effect, not a data query

**Implementation:**
- When export request transitions to `authorized` state:
  - ECS RPC function updates SKU threshold reference
  - VCI dashboard automatically uses ECS Threshold for that SKU
  - Threshold reverts after 3 months or on cancellation

---

## API Versioning Strategy

### Versioning Approach

- **URL-based versioning:** `/api/v1/...`, `/api/v2/...`
- **Explicit and clear:** Version in URL makes it obvious
- **Multiple versions supported:** Old and new versions can coexist during migration

### Version Lifecycle

1. **New version created:** New endpoints added with new version number
2. **Deprecation period:** Old version marked as deprecated, migration period provided
3. **Removal:** Old version removed after migration period

---

## Error Handling Patterns

### Standard Error Response Format

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

### Error Codes

- `AUTHENTICATION_ERROR` - API key or JWT token invalid
- `AUTHORIZATION_ERROR` - User/company not authorized for this operation
- `VALIDATION_ERROR` - Data validation failed
- `BUSINESS_RULE_VIOLATION` - Business rule violated
- `NOT_FOUND` - Resource not found
- `SYSTEM_ERROR` - Internal system error

---

## Security Considerations

### API Key Security

- API keys stored securely (encrypted in database)
- API keys can be rotated/revoked
- Different keys per environment
- Keys never exposed in frontend code

### JWT Token Security

- Short-lived tokens (configurable expiration)
- Tokens include company_id for authorization
- Tokens validated on every request
- Refresh token mechanism (if needed)

### Rate Limiting

- API rate limiting to prevent abuse
- Per-company rate limits
- Configurable limits per endpoint

---

## Future Integration Considerations

### Webhook Support (Optional, Future)

- PM platform can send webhooks to external systems
- Event-driven notifications (e.g., export approved, breach detected)
- Configurable webhook endpoints per company
- Retry mechanism for failed webhooks

### Batch Processing

- Support for large batch uploads
- Asynchronous processing for large batches
- Status polling for batch job completion

---

## Related Documents

- [System Architecture](../system-architecture.md)
- [API Specifications](api/) - Detailed API specs (Week 3)
- [Integration API Specifications](api/) - Detailed integration API specs (Week 3)
- [Regulatory Framework](../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference
- [Compliance Requirements](../../../03-governance/compliance-requirements.md) - Detailed compliance requirements
- [Regulatory Policies](../../../03-governance/regulatory-policies.md) - Regulatory policies and guidelines
- [Technical Decision Log](../../06-development/technical-decisions/decision-log.md)
- [Project Brief](../../00-overview/Project%20Brief%20–%20PM.md)

---

**Next Review Date:** [To be scheduled]  
**Owner:** Maya

