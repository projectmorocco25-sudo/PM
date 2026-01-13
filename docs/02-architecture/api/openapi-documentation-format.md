# API Contract Documentation Format - PM Platform

**Purpose:** Defines the OpenAPI/Swagger documentation format and standards for all PM platform RPC functions and API endpoints.

**Last Updated:** 2026-01-12  
**Status:** ✅ Implementation Ready (Phase 1.1.1)  
**Owner:** Maya (API Lead)  
**Task Reference:** Task 1.1.1.1c

---

## Overview

This document establishes the API documentation standards using OpenAPI 3.0 specification for all PM platform APIs, including:
- Supabase RPC functions
- Edge Functions
- External integration APIs (ERP, Customs)

---

## OpenAPI Specification Structure

### Base OpenAPI Template

```yaml
openapi: 3.0.3
info:
  title: PM Platform API
  description: |
    Pharmaceutical Governance Value Chain Platform API
    
    ## Authentication
    All endpoints require authentication via Supabase Auth JWT token.
    Include the token in the Authorization header:
    ```
    Authorization: Bearer {jwt_token}
    ```
    
    ## Rate Limiting
    - Standard endpoints: 100 requests/minute
    - Batch endpoints: 10 requests/minute
    - Export endpoints: 5 requests/minute
    
    ## Versioning
    API versioning uses URL path: `/api/v1/`, `/api/v2/`
    
  version: 1.0.0
  contact:
    name: PM Platform Team
    email: support@pm-platform.gov.ma
  license:
    name: Proprietary
    
servers:
  - url: https://{project-ref}.supabase.co
    description: Supabase API Server
    variables:
      project-ref:
        default: 'your-project-ref'
        description: Supabase project reference
        
  - url: https://{project-ref}.supabase.co/functions/v1
    description: Edge Functions Server
    
tags:
  - name: Authentication
    description: User authentication and session management
  - name: RMM
    description: Registry Management Module operations
  - name: VCI
    description: Value Chain Intelligence operations
  - name: ECS
    description: Export Control System operations
  - name: CMC
    description: Compliance Monitoring Center operations
  - name: Communications
    description: Internal messaging and notifications
  - name: Governance
    description: Follow-ups, meetings, and workflow operations

security:
  - bearerAuth: []

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: Supabase Auth JWT token
      
    apiKeyAuth:
      type: apiKey
      in: header
      name: X-API-Key
      description: API key for external system integration
```

---

## RPC Function Documentation Format

### Standard RPC Function Template

```yaml
paths:
  /rest/v1/rpc/{function_name}:
    post:
      tags:
        - {Module}
      summary: {Brief one-line description}
      description: |
        {Detailed multi-line description}
        
        ## Business Rules
        - {Rule 1}
        - {Rule 2}
        
        ## Permissions
        - **Company User:** {permission level}
        - **MOH Tier 1:** {permission level}
        - **MOH Tier 2:** {permission level}
        
        ## Side Effects
        - {Side effect 1, e.g., "Creates audit log entry"}
        - {Side effect 2, e.g., "Sends notification"}
        
      operationId: {function_name}
      
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/{FunctionName}Request'
            examples:
              standard:
                summary: Standard request
                value:
                  param1: "value1"
                  param2: 123
                  
      responses:
        '200':
          description: Successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/{FunctionName}Response'
              examples:
                success:
                  summary: Successful response
                  value:
                    id: "550e8400-e29b-41d4-a716-446655440000"
                    status: "success"
                    
        '400':
          $ref: '#/components/responses/ValidationError'
        '401':
          $ref: '#/components/responses/AuthenticationError'
        '403':
          $ref: '#/components/responses/AuthorizationError'
        '500':
          $ref: '#/components/responses/SystemError'
```

---

## Schema Component Standards

### Request Schema Template

```yaml
components:
  schemas:
    # Naming: {FunctionName}Request
    FollowUpsCreateRequest:
      type: object
      required:
        - title
      properties:
        title:
          type: string
          minLength: 1
          maxLength: 255
          description: Title of the follow-up
          example: "Review threshold breach for SKU-001"
        description:
          type: string
          maxLength: 2000
          nullable: true
          description: Detailed description
        priority:
          type: string
          enum: [normal, high, extreme]
          default: normal
          description: Priority level
        due_date:
          type: string
          format: date-time
          nullable: true
          description: Due date in ISO 8601 format
        assigned_to:
          type: string
          format: uuid
          nullable: true
          description: User ID to assign the follow-up to
        issue_reference_type:
          type: string
          enum: [breach, submission, export_authorization]
          nullable: true
          description: Type of entity this follow-up relates to
        issue_reference_id:
          type: string
          format: uuid
          nullable: true
          description: ID of the related entity
```

### Response Schema Template

```yaml
    # Naming: {FunctionName}Response
    FollowUpsCreateResponse:
      type: object
      properties:
        id:
          type: string
          format: uuid
          description: Created follow-up ID
        title:
          type: string
        status:
          type: string
          enum: [pending, in_progress, completed, cancelled]
        created_at:
          type: string
          format: date-time
        created_by:
          type: string
          format: uuid
```

### Reusable Response Templates

```yaml
  responses:
    ValidationError:
      description: Validation error
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            success: false
            error:
              code: "VALIDATION_ERROR"
              message: "Validation failed"
              details:
                - field: "title"
                  message: "Title is required"
                  
    AuthenticationError:
      description: Authentication required
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            success: false
            error:
              code: "AUTHENTICATION_ERROR"
              message: "Invalid or expired token"
              
    AuthorizationError:
      description: Insufficient permissions
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            success: false
            error:
              code: "AUTHORIZATION_ERROR"
              message: "You do not have permission to perform this action"
              
    SystemError:
      description: Internal server error
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            success: false
            error:
              code: "SYSTEM_ERROR"
              message: "An unexpected error occurred"

    ErrorResponse:
      type: object
      required:
        - success
        - error
      properties:
        success:
          type: boolean
          enum: [false]
        error:
          type: object
          required:
            - code
            - message
          properties:
            code:
              type: string
              description: Error code for programmatic handling
            message:
              type: string
              description: Human-readable error message
            details:
              type: array
              items:
                type: object
                properties:
                  field:
                    type: string
                  message:
                    type: string
            correlation_id:
              type: string
              format: uuid
              description: Correlation ID for error tracking
```

---

## Module-Specific API Documentation

### VCI Module APIs

```yaml
paths:
  /rest/v1/rpc/vci_submit_msq:
    post:
      tags:
        - VCI
      summary: Submit Monthly Stock Quantity (MSQ) data
      description: |
        Submits MSQ data for a specific SKU and month.
        
        ## Business Rules
        - One submission per SKU per month
        - Opening stock must match previous month's closing stock
        - All quantities must be non-negative
        - Submission deadline: 15th of following month
        
        ## Permissions
        - **Company User:** Can submit for own company's SKUs
        - **MOH Tier 1/2:** Read-only (for monitoring)
        
        ## Side Effects
        - Creates audit log entry
        - Triggers breach detection if stock below threshold
        - Updates dashboard metrics
        
      operationId: vci_submit_msq
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - sku_id
                - year
                - month
                - opening_stock
                - received
                - sold
                - closing_stock
              properties:
                sku_id:
                  type: string
                  format: uuid
                year:
                  type: integer
                  minimum: 2020
                  maximum: 2100
                month:
                  type: integer
                  minimum: 1
                  maximum: 12
                opening_stock:
                  type: integer
                  minimum: 0
                received:
                  type: integer
                  minimum: 0
                sold:
                  type: integer
                  minimum: 0
                closing_stock:
                  type: integer
                  minimum: 0
                notes:
                  type: string
                  maxLength: 1000
                  nullable: true
                  
      responses:
        '200':
          description: Submission created successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: string
                    format: uuid
                  status:
                    type: string
                    enum: [submitted, pending_review]
                  breach_detected:
                    type: boolean
                  breach_id:
                    type: string
                    format: uuid
                    nullable: true
```

### ECS Module APIs

```yaml
  /rest/v1/rpc/ecs_request_export:
    post:
      tags:
        - ECS
      summary: Submit export authorization request
      description: |
        Submits a request to export a specific quantity of a SKU.
        
        ## Business Rules
        - XAMS calculated from last 6 months MSQ data
        - ECS Threshold = XAMS × 3 (or 3.5 for critical medicines)
        - Auto-approval based on CMC compliance score (if CMC active)
        - Request valid for 90 days after authorization
        
        ## Permissions
        - **Company User:** Can request for own company's SKUs
        - **MOH Tier 1:** Can view all, approve/reject
        - **MOH Tier 2:** Can view all, recommend
        
        ## Conditional Validation (when CMC active)
        - Score < 60: Auto-approval disabled
        - Score 60-74: Tier 2 verification required
        - Score 75+: Standard auto-approval eligible
        
      operationId: ecs_request_export
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - sku_id
                - quantity
                - destination_country
                - justification
              properties:
                sku_id:
                  type: string
                  format: uuid
                quantity:
                  type: integer
                  minimum: 1
                destination_country:
                  type: string
                  minLength: 2
                  maxLength: 3
                  description: ISO 3166-1 alpha-2 or alpha-3 country code
                justification:
                  type: string
                  minLength: 50
                  maxLength: 2000
                requested_date:
                  type: string
                  format: date
                  description: Requested export date
```

### Communications APIs

```yaml
  /rest/v1/rpc/communications_create_conversation:
    post:
      tags:
        - Communications
      summary: Create a new conversation
      description: |
        Creates a new conversation (message thread) with specified participants.
        
        ## Conversation Types
        - `direct`: One-to-one or small group
        - `announcement`: System-wide (MOH Tier 1 only)
        - `workflow`: Linked to workflow entity
        
        ## Permissions
        - **Company User:** Can create with other company users or MOH
        - **MOH Tier 1/2:** Can create with any user
        - **Announcements:** MOH Tier 1 only
        
        ## Side Effects
        - Creates conversation_participants records
        - Sets lifecycle_state to 'CREATED'
        - Sends notification to participants
        
      operationId: communications_create_conversation
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - subject
                - participants
              properties:
                subject:
                  type: string
                  minLength: 1
                  maxLength: 255
                type:
                  type: string
                  enum: [direct, announcement, workflow]
                  default: direct
                participants:
                  type: array
                  items:
                    type: string
                    format: uuid
                  minItems: 1
                  description: User IDs to add as participants
                related_entity_type:
                  type: string
                  enum: [breach, submission, export_authorization, follow_up]
                  nullable: true
                related_entity_id:
                  type: string
                  format: uuid
                  nullable: true
                initial_message:
                  type: string
                  maxLength: 10000
                  nullable: true
                  description: Optional first message content
```

---

## Edge Function Documentation

### Edge Function Template

```yaml
  /functions/v1/shared-send-email:
    post:
      tags:
        - Notifications
      summary: Send email via external email service
      description: |
        Edge Function that sends emails through the configured email service.
        
        ## Authentication
        - Requires service role key or valid JWT
        - Internal use only (not exposed to frontend)
        
        ## Rate Limiting
        - 100 emails per minute per company
        - Batch limit: 50 emails per request
        
      operationId: shared_send_email
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - to
                - subject
                - body
              properties:
                to:
                  type: string
                  format: email
                subject:
                  type: string
                  maxLength: 200
                body:
                  type: string
                  maxLength: 50000
                template:
                  type: string
                  enum: [notification, alert, summary, welcome]
                  nullable: true
                template_data:
                  type: object
                  nullable: true
                  additionalProperties: true
                  
      responses:
        '200':
          description: Email sent successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  message_id:
                    type: string
        '429':
          description: Rate limit exceeded
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
```

---

## External Integration API Documentation

### ERP Integration APIs

```yaml
  /api/v1/submissions/msq:
    post:
      tags:
        - External Integration
      summary: Submit MSQ data from ERP system
      description: |
        External API endpoint for ERP systems to submit MSQ data.
        
        ## Authentication
        1. Send API key in `X-API-Key` header
        2. Receive JWT token in response
        3. Use JWT for subsequent requests
        
        ## Data Format
        - Date format: ISO 8601 (YYYY-MM-DD)
        - Quantities: Integers (no decimals)
        - All SKUs must belong to authenticated company
        
      operationId: erp_submit_msq
      security:
        - apiKeyAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - submissions
              properties:
                submissions:
                  type: array
                  items:
                    type: object
                    required:
                      - sku_code
                      - year
                      - month
                      - opening_stock
                      - received
                      - sold
                      - closing_stock
                    properties:
                      sku_code:
                        type: string
                        description: Company's internal SKU code
                      year:
                        type: integer
                      month:
                        type: integer
                      opening_stock:
                        type: integer
                      received:
                        type: integer
                      sold:
                        type: integer
                      closing_stock:
                        type: integer
                        
      responses:
        '200':
          description: Submissions processed
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  processed:
                    type: integer
                  failed:
                    type: integer
                  results:
                    type: array
                    items:
                      type: object
                      properties:
                        sku_code:
                          type: string
                        status:
                          type: string
                          enum: [accepted, rejected]
                        submission_id:
                          type: string
                          format: uuid
                          nullable: true
                        error:
                          type: string
                          nullable: true
```

---

## Documentation Generation

### File Structure

```
docs/
  02-architecture/
    api/
      openapi/
        pm-platform-api.yaml      # Main OpenAPI spec
        components/
          schemas/
            common.yaml           # Shared schemas
            rmm.yaml              # RMM-specific schemas
            vci.yaml              # VCI-specific schemas
            ecs.yaml              # ECS-specific schemas
            cmc.yaml              # CMC-specific schemas
          responses/
            errors.yaml           # Error response schemas
          parameters/
            pagination.yaml       # Pagination parameters
        paths/
          rmm.yaml                # RMM endpoints
          vci.yaml                # VCI endpoints
          ecs.yaml                # ECS endpoints
          cmc.yaml                # CMC endpoints
          communications.yaml     # Communications endpoints
          edge-functions.yaml     # Edge function endpoints
```

### Generation Commands

```bash
# Validate OpenAPI spec
npx @redocly/cli lint docs/02-architecture/api/openapi/pm-platform-api.yaml

# Generate HTML documentation
npx @redocly/cli build-docs docs/02-architecture/api/openapi/pm-platform-api.yaml -o docs/api-reference.html

# Generate TypeScript types
npx openapi-typescript docs/02-architecture/api/openapi/pm-platform-api.yaml -o frontend/src/types/api.ts
```

---

## Best Practices

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Operation ID | snake_case | `vci_submit_msq` |
| Schema Name | PascalCase | `MsqSubmissionRequest` |
| Path Parameter | camelCase | `{submissionId}` |
| Query Parameter | snake_case | `?page_size=20` |
| Enum Values | lowercase | `pending`, `approved` |

### Required Fields

Every endpoint must document:
1. **Summary** - One-line description
2. **Description** - Detailed explanation with business rules
3. **Permissions** - Role-based access requirements
4. **Request Schema** - All parameters with types and validation
5. **Response Schema** - Success and error responses
6. **Examples** - At least one request/response example

---

## Related Documents

- [API Specification](api-specification.md) - API design overview
- [RPC Functions](rpc-functions.md) - RPC function specifications
- [Edge Functions](edge-functions.md) - Edge function specifications
- [Module Integration Contracts](../integration/module-integration-contracts.md) - Cross-module contracts

---

**Next Review Date:** [To be scheduled]  
**Owner:** Maya (API Lead)
