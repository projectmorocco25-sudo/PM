# Backend Validation Strategy - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines the comprehensive backend validation strategy, including database-level validation, RPC function validation, and reusable validation patterns.

**Last Updated:** 2025-12-31  
**Status:** ✅ Complete (Phase 0, Gap Resolution)  
**Owner:** Salim (Security & Audit Engineer), Nadia (Data Modeler)

## Overview

The PM platform implements a multi-layered validation strategy with validation at database level (constraints, triggers), RPC function level (business rules), and reusable validation functions. This ensures data integrity, security, and regulatory compliance.

## Validation Principles

1. **Defense in Depth:** Validation at multiple layers (database, RPC functions, application)
2. **Fail Secure:** Invalid data is rejected, never silently corrected
3. **Explicit Validation:** All inputs explicitly validated, no implicit assumptions
4. **Reusable Patterns:** Common validation logic centralized in reusable functions
5. **Performance Optimized:** Validation efficient, minimal performance impact
6. **Auditable:** All validation failures logged for security and compliance

## Validation Layers

### Layer 1: Database Constraints

**Purpose:** Enforce data integrity at database level (first line of defense)

**Types:**
- **NOT NULL:** Required fields cannot be null
- **UNIQUE:** Prevent duplicate values
- **CHECK:** Enforce value constraints (enums, ranges, formats)
- **FOREIGN KEY:** Enforce referential integrity
- **Data Types:** Type safety (uuid, numeric, timestamptz, etc.)

**Examples:**
```sql
-- NOT NULL constraint
ALTER TABLE companies ADD CONSTRAINT companies_name_not_null CHECK (name IS NOT NULL);

-- UNIQUE constraint
ALTER TABLE companies ADD CONSTRAINT companies_registration_number_unique UNIQUE (registration_number);

-- CHECK constraint (enum validation)
ALTER TABLE companies ADD CONSTRAINT companies_type_check CHECK (company_type IN ('ipc', 'wholesaler'));

-- CHECK constraint (range validation)
ALTER TABLE compliance_scores ADD CONSTRAINT compliance_scores_score_range CHECK (score >= 0 AND score <= 100);

-- CHECK constraint (format validation)
ALTER TABLE users ADD CONSTRAINT users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
```

**Best Practices:**
- Use CHECK constraints for business rules that must always be enforced
- Use UNIQUE constraints for business keys (registration_number, authorization_number)
- Use FOREIGN KEY constraints for referential integrity
- Document constraint purpose in comments

---

### Layer 2: Database Validation Functions

**Purpose:** Reusable validation functions for complex business rules

**Function Naming:** `validate_{entity}_{rule}`

**Examples:**
```sql
-- Validate company registration number format
CREATE OR REPLACE FUNCTION validate_company_registration_number(reg_number text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check format: Must be alphanumeric, 8-20 characters
  IF reg_number !~ '^[A-Za-z0-9]{8,20}$' THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$;

-- Validate email format
CREATE OR REPLACE FUNCTION validate_email(email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$;

-- Validate phone number format
CREATE OR REPLACE FUNCTION validate_phone(phone text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Allow international format: +[country][number]
  IF phone !~ '^\+?[1-9]\d{1,14}$' THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$;

-- Validate date range (start <= end)
CREATE OR REPLACE FUNCTION validate_date_range(start_date timestamptz, end_date timestamptz)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF start_date > end_date THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$;

-- Validate threshold calculation (B × AAMS)
CREATE OR REPLACE FUNCTION validate_threshold_calculation(b_multiplier numeric, aams_value numeric)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- B must be positive
  IF b_multiplier <= 0 THEN
    RETURN false;
  END IF;
  
  -- AAMS must be non-negative
  IF aams_value < 0 THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$;
```

**Usage in Constraints:**
```sql
-- Use validation function in CHECK constraint
ALTER TABLE companies ADD CONSTRAINT companies_registration_number_valid 
  CHECK (validate_company_registration_number(registration_number));

ALTER TABLE users ADD CONSTRAINT users_email_valid 
  CHECK (validate_email(email));
```

---

### Layer 3: RPC Function Validation

**Purpose:** Business rule validation in RPC functions (second line of defense)

**Validation Pattern:**
```sql
CREATE OR REPLACE FUNCTION rmm_create_company(
  name text,
  registration_number text,
  company_type text,
  -- ... other parameters
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  validation_errors jsonb := '[]'::jsonb;
  company_id uuid;
BEGIN
  -- 1. Input validation
  IF name IS NULL OR trim(name) = '' THEN
    validation_errors := validation_errors || jsonb_build_object(
      'field', 'name',
      'message', 'Company name is required'
    );
  END IF;
  
  IF NOT validate_company_registration_number(registration_number) THEN
    validation_errors := validation_errors || jsonb_build_object(
      'field', 'registration_number',
      'message', 'Invalid registration number format'
    );
  END IF;
  
  IF company_type NOT IN ('ipc', 'wholesaler') THEN
    validation_errors := validation_errors || jsonb_build_object(
      'field', 'company_type',
      'message', 'Company type must be ipc or wholesaler'
    );
  END IF;
  
  -- 2. Business rule validation
  IF EXISTS (SELECT 1 FROM companies WHERE registration_number = rmm_create_company.registration_number) THEN
    validation_errors := validation_errors || jsonb_build_object(
      'field', 'registration_number',
      'message', 'Registration number already exists'
    );
  END IF;
  
  -- 3. Return validation errors if any
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
  
  -- 4. Proceed with operation
  -- ... create company logic ...
  
  RETURN jsonb_build_object('success', true, 'data', jsonb_build_object('id', company_id));
END;
$$;
```

**Validation Categories:**

1. **Required Field Validation:**
   - Check for NULL or empty strings
   - Check for required relationships (foreign keys)

2. **Format Validation:**
   - Email format
   - Phone number format
   - Registration number format
   - Date format
   - URL format

3. **Range Validation:**
   - Numeric ranges (scores, quantities, prices)
   - Date ranges (start <= end)
   - String length limits

4. **Business Rule Validation:**
   - Uniqueness checks
   - Referential integrity
   - State transition validation
   - Deadline checks
   - Module activation checks

5. **Security Validation:**
   - SQL injection prevention (parameterized queries)
   - XSS prevention (sanitize user input)
   - Authorization checks (user permissions)

---

### Layer 4: Shared Validation Functions

**Purpose:** Centralized validation functions for common patterns

**Location:** `shared_validate_*` functions

**Examples:**
```sql
-- Shared validation: Check if user has permission
CREATE OR REPLACE FUNCTION shared_validate_user_permission(
  user_id uuid,
  required_permission text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role text;
  has_permission boolean;
BEGIN
  -- Get user role
  SELECT role INTO user_role FROM users WHERE id = user_id;
  
  -- Check permission based on role
  -- (Implementation depends on permission matrix)
  
  RETURN has_permission;
END;
$$;

-- Shared validation: Check if module is active
CREATE OR REPLACE FUNCTION shared_validate_module_active(module_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM system_config 
    WHERE module_name = shared_validate_module_active.module_name 
    AND is_active = true
  );
END;
$$;

-- Shared validation: Check if deadline has passed
CREATE OR REPLACE FUNCTION shared_validate_deadline_not_passed(deadline timestamptz)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN deadline > now();
END;
$$;
```

---

## Validation Error Handling

### Error Response Format

**Standard Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "registration_number",
        "message": "Invalid registration number format",
        "code": "INVALID_FORMAT"
      },
      {
        "field": "email",
        "message": "Email is required",
        "code": "MISSING_REQUIRED_FIELD"
      }
    ]
  }
}
```

### Validation Error Codes

- `MISSING_REQUIRED_FIELD` - Required field is missing
- `INVALID_FORMAT` - Field format is invalid
- `INVALID_VALUE` - Field value is invalid
- `OUT_OF_RANGE` - Field value is out of allowed range
- `DUPLICATE_ENTRY` - Entry already exists
- `INVALID_REFERENCE` - Foreign key reference is invalid
- `BUSINESS_RULE_VIOLATION` - Business rule violated
- `DEADLINE_PASSED` - Submission deadline has passed
- `MODULE_NOT_ACTIVE` - Required module is not active
- `UNAUTHORIZED` - User does not have permission

---

## Validation Best Practices

### 1. Validate Early, Validate Often

- Validate at database level (constraints)
- Validate in RPC functions (business rules)
- Never trust client-side validation alone

### 2. Use Parameterized Queries

- Always use parameterized queries (Supabase client does this)
- Never concatenate user input into SQL strings
- Use RPC function parameters (typed, safe)

### 3. Sanitize User Input

- Sanitize all user input before processing
- Remove or escape special characters
- Validate data types before use

### 4. Log Validation Failures

- Log all validation failures in audit_logs
- Include user_id, field, error message
- Helps identify attack patterns

### 5. Return Clear Error Messages

- Provide field-specific error messages
- Help users correct errors
- Don't expose system internals

### 6. Performance Considerations

- Use indexes for uniqueness checks
- Cache validation results when appropriate
- Batch validation when possible

---

## Validation Checklist

### For Each RPC Function:

- [ ] All required fields validated (NOT NULL, not empty)
- [ ] Format validation (email, phone, registration number)
- [ ] Range validation (numeric, date ranges)
- [ ] Business rule validation (uniqueness, referential integrity)
- [ ] Authorization validation (user permissions)
- [ ] Module activation validation (if module-specific)
- [ ] Deadline validation (if time-sensitive)
- [ ] State transition validation (if workflow-related)
- [ ] Error messages clear and helpful
- [ ] Validation failures logged

### For Each Database Table:

- [ ] NOT NULL constraints on required fields
- [ ] UNIQUE constraints on business keys
- [ ] CHECK constraints for enums and ranges
- [ ] FOREIGN KEY constraints for relationships
- [ ] Validation functions used in CHECK constraints (if complex)

---

## Related Documents

- [Database Schema Design](../database/schema-design.md) - Database constraints
- [RPC Function Specifications](../api/rpc-functions.md) - RPC function validation
- [Security Architecture](security-architecture.md) - Security validation
- [Backend Input Sanitization Strategy](backend-input-sanitization-strategy.md) - Input sanitization
- [Regulatory Framework](../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference
- [Compliance Requirements](../../../03-governance/compliance-requirements.md) - Detailed compliance requirements
- [Regulatory Policies](../../../03-governance/regulatory-policies.md) - Regulatory policies and guidelines

---

**Next Review Date:** [To be scheduled]  
**Owner:** Salim (Security & Audit Engineer), Nadia (Data Modeler)

