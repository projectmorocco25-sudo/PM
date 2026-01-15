# API Contract Documentation Format - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines the standard format for documenting RPC function API contracts using OpenAPI/Swagger specifications.

**Last Updated:** 2025-01-12  
**Status:** ✅ Complete (Phase 1.1.1, Task 1.1.1.1c)  
**Owner:** Maya

## Overview

This document establishes the standard format for documenting all RPC function API contracts in the PM platform. All RPC functions must be documented using this format, which is compatible with OpenAPI 3.0 and Swagger specifications.

## Documentation Structure

### Standard RPC Function Documentation Template

```markdown
# {function_name}

**Module:** {module_name}  
**Category:** {category}  
**Purpose:** {brief_description}

## Function Signature

```sql
CREATE OR REPLACE FUNCTION {function_name}(
  {param_name} {param_type} {param_constraints},
  ...
) RETURNS {return_type}
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
{function_body}
$$;
```

## OpenAPI Specification

```yaml
openapi: 3.0.0
info:
  title: PM Platform RPC Functions
  version: 1.0.0
  description: RPC Function API for Pharmaceutical Governance Platform

paths:
  /rpc/{function_name}:
    post:
      summary: {function_summary}
      description: {function_description}
      operationId: {function_name}
      tags:
        - {module_name}
        - {category}
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - {required_param}
              properties:
                {param_name}:
                  type: {openapi_type}
                  format: {format}
                  description: {param_description}
                  example: {example_value}
      responses:
        '200':
          description: Success response
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  data:
                    {return_schema}
        '400':
          description: Bad request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '403':
          description: Forbidden
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '500':
          description: Internal server error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

components:
  schemas:
    ErrorResponse:
      type: object
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          properties:
            code:
              type: string
              example: "VALIDATION_ERROR"
            message:
              type: string
              example: "Invalid input parameters"
            details:
              type: object
```

## Parameters

| Parameter | Type | Required | Description | Constraints | Example |
|-----------|------|----------|-------------|-------------|---------|
| {param_name} | {type} | {yes/no} | {description} | {constraints} | {example} |

## Return Value

### Success Response

```json
{
  "success": true,
  "data": {
    {return_data_structure}
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

## Business Rules

1. {Business rule 1}
2. {Business rule 2}
3. {Business rule 3}

## Validation Rules

- {Validation rule 1}
- {Validation rule 2}
- {Validation rule 3}

## RLS Policy

**Policy:** {policy_name}  
**Access:** {who can call this function}  
**Enforcement:** {how RLS is enforced}

## Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| VALIDATION_ERROR | Invalid input parameters | 400 |
| UNAUTHORIZED | Authentication required | 401 |
| FORBIDDEN | Insufficient permissions | 403 |
| NOT_FOUND | Resource not found | 404 |
| SYSTEM_ERROR | Internal server error | 500 |

## Examples

### Example Request

```json
{
  "param1": "value1",
  "param2": 123
}
```

### Example Success Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Example"
  }
}
```

### Example Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid company_id format"
  }
}
```

## Related Functions

- {related_function_1} - {relationship}
- {related_function_2} - {relationship}

## Testing

### Test Cases

1. **Happy Path:** {description}
2. **Invalid Input:** {description}
3. **Unauthorized Access:** {description}
4. **Not Found:** {description}

### Test Data

```sql
-- Test data setup
INSERT INTO {table} VALUES (...);
```

## Changelog

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-01-12 | 1.0.0 | Initial implementation | {Author} |
```

---

## Complete Example

### rmm_create_company

**Module:** RMM  
**Category:** CRUD Operations  
**Purpose:** Create a new company in the registry

## Function Signature

```sql
CREATE OR REPLACE FUNCTION rmm_create_company(
  company_name text,
  registration_number text,
  address text,
  contact_email text,
  contact_phone text
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_company_id uuid;
  result jsonb;
BEGIN
  -- Validation
  IF company_name IS NULL OR company_name = '' THEN
    RAISE EXCEPTION 'Company name is required';
  END IF;

  -- Create company
  INSERT INTO companies (
    name,
    registration_number,
    address,
    contact_email,
    contact_phone,
    status,
    created_by
  ) VALUES (
    company_name,
    registration_number,
    address,
    contact_email,
    contact_phone,
    'active',
    auth.uid()
  ) RETURNING id INTO new_company_id;

  -- Return result
  SELECT jsonb_build_object(
    'success', true,
    'data', jsonb_build_object(
      'id', new_company_id,
      'name', company_name
    )
  ) INTO result;

  RETURN result;
END;
$$;
```

## OpenAPI Specification

```yaml
openapi: 3.0.0
info:
  title: PM Platform RPC Functions
  version: 1.0.0

paths:
  /rpc/rmm_create_company:
    post:
      summary: Create a new company
      description: Creates a new company in the registry with the provided information
      operationId: rmm_create_company
      tags:
        - RMM
        - CRUD
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - company_name
                - registration_number
              properties:
                company_name:
                  type: string
                  minLength: 1
                  maxLength: 255
                  description: Company name
                  example: "PharmaCorp Morocco"
                registration_number:
                  type: string
                  minLength: 1
                  maxLength: 50
                  description: Company registration number
                  example: "RC123456"
                address:
                  type: string
                  maxLength: 500
                  description: Company address
                  example: "123 Business Street, Casablanca"
                contact_email:
                  type: string
                  format: email
                  description: Contact email address
                  example: "contact@pharmacorp.ma"
                contact_phone:
                  type: string
                  maxLength: 20
                  description: Contact phone number
                  example: "+212 6 12 34 56 78"
      responses:
        '200':
          description: Company created successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  data:
                    type: object
                    properties:
                      id:
                        type: string
                        format: uuid
                        example: "550e8400-e29b-41d4-a716-446655440000"
                      name:
                        type: string
                        example: "PharmaCorp Morocco"
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '500':
          $ref: '#/components/responses/InternalServerError'
```

## Parameters

| Parameter | Type | Required | Description | Constraints | Example |
|-----------|------|----------|-------------|-------------|---------|
| company_name | text | Yes | Company name | 1-255 characters | "PharmaCorp Morocco" |
| registration_number | text | Yes | Registration number | 1-50 characters, unique | "RC123456" |
| address | text | No | Company address | Max 500 characters | "123 Business Street" |
| contact_email | text | No | Contact email | Valid email format | "contact@pharmacorp.ma" |
| contact_phone | text | No | Contact phone | Max 20 characters | "+212 6 12 34 56 78" |

## Return Value

### Success Response

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "PharmaCorp Morocco"
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Company name is required"
  }
}
```

## Business Rules

1. Company name must be unique (enforced by database constraint)
2. Registration number must be unique (enforced by database constraint)
3. Only authenticated users can create companies
4. Company status defaults to 'active'
5. Created_by is automatically set to current user ID

## Validation Rules

- `company_name`: Required, 1-255 characters, not empty
- `registration_number`: Required, 1-50 characters, unique
- `address`: Optional, max 500 characters
- `contact_email`: Optional, valid email format if provided
- `contact_phone`: Optional, max 20 characters

## RLS Policy

**Policy:** N/A (SECURITY DEFINER function)  
**Access:** Authenticated users with appropriate role  
**Enforcement:** Function checks auth.uid() and validates permissions

## Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| VALIDATION_ERROR | Invalid input parameters | 400 |
| UNAUTHORIZED | Authentication required | 401 |
| FORBIDDEN | Insufficient permissions | 403 |
| DUPLICATE_ERROR | Company or registration number already exists | 409 |
| SYSTEM_ERROR | Internal server error | 500 |

## Examples

### Example Request

```json
{
  "company_name": "PharmaCorp Morocco",
  "registration_number": "RC123456",
  "address": "123 Business Street, Casablanca",
  "contact_email": "contact@pharmacorp.ma",
  "contact_phone": "+212 6 12 34 56 78"
}
```

### Example Success Response

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "PharmaCorp Morocco"
  }
}
```

### Example Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Company name is required"
  }
}
```

## Related Functions

- `rmm_update_company` - Update company information
- `rmm_get_company` - Get company details
- `rmm_list_companies` - List all companies

## Testing

### Test Cases

1. **Happy Path:** Create company with all required fields
2. **Invalid Input:** Missing company_name
3. **Duplicate Registration:** Registration number already exists
4. **Unauthorized Access:** Unauthenticated user

### Test Data

```sql
-- Test data setup
-- No setup required (creates new company)
```

## Changelog

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-01-12 | 1.0.0 | Initial implementation | Nadia |

---

## Documentation Standards

### Required Sections

Every RPC function documentation must include:

1. **Function Signature** - SQL function definition
2. **OpenAPI Specification** - OpenAPI 3.0 YAML
3. **Parameters** - Parameter table
4. **Return Value** - Success and error response formats
5. **Business Rules** - Business logic rules
6. **Validation Rules** - Input validation rules
7. **RLS Policy** - Security policy information
8. **Error Codes** - Error code reference
9. **Examples** - Request/response examples
10. **Testing** - Test cases and test data

### Optional Sections

- **Related Functions** - Related function references
- **Changelog** - Version history
- **Performance Notes** - Performance considerations
- **Deprecation Notes** - Deprecation information

---

## OpenAPI Type Mappings

### PostgreSQL to OpenAPI Type Mapping

| PostgreSQL Type | OpenAPI Type | Format | Notes |
|----------------|--------------|--------|-------|
| text | string | - | Default string type |
| varchar(n) | string | - | String with max length |
| uuid | string | uuid | UUID format |
| integer | integer | int32 | 32-bit integer |
| bigint | integer | int64 | 64-bit integer |
| numeric | number | - | Decimal number |
| boolean | boolean | - | Boolean value |
| timestamptz | string | date-time | ISO 8601 datetime |
| date | string | date | ISO 8601 date |
| jsonb | object | - | JSON object |
| jsonb[] | array | - | Array of JSON objects |

---

## Documentation Location

### File Structure

```
docs/
├── 02-architecture/
│   ├── api/
│   │   ├── api-contract-documentation-format.md (this file)
│   │   ├── rpc-functions/
│   │   │   ├── rmm/
│   │   │   │   ├── rmm_create_company.md
│   │   │   │   ├── rmm_update_company.md
│   │   │   │   └── ...
│   │   │   ├── vci/
│   │   │   │   └── ...
│   │   │   ├── ecs/
│   │   │   │   └── ...
│   │   │   └── cmc/
│   │   │       └── ...
```

### Naming Convention

**Format:** `{function_name}.md`

**Example:** `rmm_create_company.md`

---

## Related Documents

- [RPC Function Specifications](rpc-functions.md) - General RPC function specifications
- [Edge Functions](edge-functions.md) - Edge function specifications
- [API Specification](api-specification.md) - General API design
- [Backend Error Handling Framework](../security/backend-error-handling-framework.md) - Error handling standards

---

**Next Review Date:** [To be scheduled]  
**Owner:** Maya
