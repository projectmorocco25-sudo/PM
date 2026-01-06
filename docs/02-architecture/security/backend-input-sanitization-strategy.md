# Backend Input Sanitization Strategy - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines the comprehensive input sanitization strategy to prevent SQL injection, XSS attacks, and other security vulnerabilities.

**Last Updated:** 2025-12-31  
**Status:** ✅ Complete (Phase 0, Gap Resolution)  
**Owner:** Salim (Security & Audit Engineer)

## Overview

The PM platform implements comprehensive input sanitization at multiple layers to prevent SQL injection, XSS attacks, command injection, and other security vulnerabilities. All user input is sanitized before processing.

## Sanitization Principles

1. **Never Trust Input:** All input is untrusted until validated and sanitized
2. **Sanitize Early:** Sanitize as close to input source as possible
3. **Whitelist Approach:** Allow only known good values, reject everything else
4. **Defense in Depth:** Sanitization at multiple layers
5. **Parameterized Queries:** Always use parameterized queries (primary defense)
6. **Escape Output:** Escape output when displaying user input

## Sanitization Layers

### Layer 1: Parameterized Queries (Primary Defense)

**Purpose:** Prevent SQL injection through parameterized queries

**Implementation:**
- Supabase client automatically uses parameterized queries
- RPC functions use typed parameters (PostgreSQL types)
- Never concatenate user input into SQL strings

**Example (Correct):**
```sql
-- ✅ CORRECT: Parameterized query
CREATE OR REPLACE FUNCTION rmm_create_company(
  name text,  -- Typed parameter
  registration_number text
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
  -- Supabase client automatically parameterizes
  INSERT INTO companies (name, registration_number)
  VALUES (rmm_create_company.name, rmm_create_company.registration_number);
  
  RETURN jsonb_build_object('success', true);
END;
$$;
```

**Example (Incorrect - Never Do This):**
```sql
-- ❌ WRONG: String concatenation (SQL injection risk)
EXECUTE format('INSERT INTO companies (name) VALUES (%L)', user_input);
```

**Best Practices:**
- Always use typed function parameters
- Never use `EXECUTE` with user input
- Never use string concatenation for SQL
- Use Supabase client (automatically parameterized)

---

### Layer 2: Input Type Validation

**Purpose:** Ensure input matches expected data type

**Implementation:**
```sql
-- Validate UUID format
CREATE OR REPLACE FUNCTION sanitize_uuid(input text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- PostgreSQL will raise error if invalid UUID
  RETURN input::uuid;
EXCEPTION
  WHEN invalid_text_representation THEN
    RAISE EXCEPTION 'Invalid UUID format: %', input;
END;
$$;

-- Validate numeric input
CREATE OR REPLACE FUNCTION sanitize_numeric(input text)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN input::numeric;
EXCEPTION
  WHEN invalid_text_representation THEN
    RAISE EXCEPTION 'Invalid numeric format: %', input;
END;
$$;

-- Validate timestamptz
CREATE OR REPLACE FUNCTION sanitize_timestamptz(input text)
RETURNS timestamptz
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN input::timestamptz;
EXCEPTION
  WHEN invalid_text_representation THEN
    RAISE EXCEPTION 'Invalid timestamp format: %', input;
END;
$$;
```

---

### Layer 3: String Sanitization

**Purpose:** Sanitize string input to prevent XSS and injection attacks

**Implementation:**
```sql
-- Sanitize text input (remove dangerous characters)
CREATE OR REPLACE FUNCTION sanitize_text(input text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Remove null bytes
  input := replace(input, E'\x00', '');
  
  -- Trim whitespace
  input := trim(input);
  
  -- Limit length (prevent DoS)
  IF length(input) > 10000 THEN
    RAISE EXCEPTION 'Input too long (max 10000 characters)';
  END IF;
  
  RETURN input;
END;
$$;

-- Sanitize email (format validation + sanitization)
CREATE OR REPLACE FUNCTION sanitize_email(input text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Trim and lowercase
  input := lower(trim(input));
  
  -- Validate format
  IF input !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format: %', input;
  END IF;
  
  -- Remove dangerous characters
  input := regexp_replace(input, '[<>"\x00]', '', 'g');
  
  RETURN input;
END;
$$;

-- Sanitize phone number
CREATE OR REPLACE FUNCTION sanitize_phone(input text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Remove all non-digit characters except +
  input := regexp_replace(input, '[^0-9+]', '', 'g');
  
  -- Validate format
  IF input !~ '^\+?[1-9]\d{1,14}$' THEN
    RAISE EXCEPTION 'Invalid phone number format: %', input;
  END IF;
  
  RETURN input;
END;
$$;

-- Sanitize URL
CREATE OR REPLACE FUNCTION sanitize_url(input text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Validate URL format
  IF input !~* '^https?://[^\s/$.?#].[^\s]*$' THEN
    RAISE EXCEPTION 'Invalid URL format: %', input;
  END IF;
  
  -- Ensure HTTPS (if not localhost)
  IF input !~* '^https://' AND input !~* '^http://localhost' THEN
    RAISE EXCEPTION 'URL must use HTTPS: %', input;
  END IF;
  
  RETURN input;
END;
$$;
```

---

### Layer 4: HTML/XML Sanitization

**Purpose:** Sanitize HTML/XML content to prevent XSS attacks

**Implementation:**
```sql
-- Sanitize HTML content (remove dangerous tags and attributes)
CREATE OR REPLACE FUNCTION sanitize_html(input text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Remove script tags and content
  input := regexp_replace(input, '<script[^>]*>.*?</script>', '', 'gi');
  
  -- Remove event handlers (onclick, onerror, etc.)
  input := regexp_replace(input, '\s*on\w+\s*=', '', 'gi');
  
  -- Remove javascript: protocol
  input := regexp_replace(input, 'javascript:', '', 'gi');
  
  -- Remove data: protocol (except safe image types)
  input := regexp_replace(input, 'data:(?!image/(png|jpg|jpeg|gif|webp))', '', 'gi');
  
  -- Remove null bytes
  input := replace(input, E'\x00', '');
  
  RETURN input;
END;
$$;
```

**Note:** For rich text content, consider using a dedicated HTML sanitization library (e.g., DOMPurify) in Edge Functions.

---

### Layer 5: File Upload Sanitization

**Purpose:** Sanitize file uploads to prevent malicious file uploads

**Implementation:**
```sql
-- Validate file extension
CREATE OR REPLACE FUNCTION sanitize_file_extension(filename text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  extension text;
  allowed_extensions text[] := ARRAY['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'gif'];
BEGIN
  -- Extract extension
  extension := lower(split_part(filename, '.', -1));
  
  -- Check if extension is allowed
  IF NOT extension = ANY(allowed_extensions) THEN
    RAISE EXCEPTION 'File extension not allowed: %', extension;
  END IF;
  
  RETURN extension;
END;
$$;

-- Validate file name
CREATE OR REPLACE FUNCTION sanitize_filename(filename text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Remove path components (prevent directory traversal)
  filename := split_part(filename, '/', -1);
  filename := split_part(filename, '\', -1);
  
  -- Remove dangerous characters
  filename := regexp_replace(filename, '[<>:"|?*\x00]', '', 'g');
  
  -- Limit length
  IF length(filename) > 255 THEN
    RAISE EXCEPTION 'Filename too long (max 255 characters)';
  END IF;
  
  RETURN filename;
END;
$$;
```

**Note:** File content validation (virus scanning, magic number checking) should be done in Edge Functions before storing in Supabase Storage.

---

## Sanitization in RPC Functions

**Pattern:**
```sql
CREATE OR REPLACE FUNCTION rmm_create_company(
  name text,
  email text,
  phone text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  sanitized_name text;
  sanitized_email text;
  sanitized_phone text;
BEGIN
  -- 1. Sanitize inputs
  sanitized_name := sanitize_text(name);
  sanitized_email := sanitize_email(email);
  sanitized_phone := sanitize_phone(phone);
  
  -- 2. Validate business rules
  -- ... validation logic ...
  
  -- 3. Use sanitized values
  INSERT INTO companies (name, email, phone)
  VALUES (sanitized_name, sanitized_email, sanitized_phone);
  
  RETURN jsonb_build_object('success', true);
END;
$$;
```

---

## Sanitization Checklist

### For Each RPC Function:

- [ ] All string inputs sanitized (sanitize_text)
- [ ] Email inputs sanitized (sanitize_email)
- [ ] Phone inputs sanitized (sanitize_phone)
- [ ] URL inputs sanitized (sanitize_url)
- [ ] HTML inputs sanitized (sanitize_html, if applicable)
- [ ] File inputs sanitized (sanitize_filename, sanitize_file_extension)
- [ ] Type validation (UUID, numeric, timestamptz)
- [ ] Length limits enforced
- [ ] Parameterized queries used (never string concatenation)
- [ ] Dangerous characters removed

---

## Security Best Practices

### 1. Never Trust Input

- Always sanitize user input
- Never use input directly in SQL
- Always validate input format

### 2. Use Parameterized Queries

- Supabase client automatically parameterizes
- RPC functions use typed parameters
- Never concatenate strings for SQL

### 3. Whitelist Approach

- Allow only known good values
- Reject everything else
- Use CHECK constraints for enums

### 4. Escape Output

- Escape HTML when displaying user input
- Use proper encoding (UTF-8)
- Sanitize before storing, escape before displaying

### 5. Log Sanitization Failures

- Log all sanitization failures
- Monitor for attack patterns
- Alert on suspicious input

---

## Related Documents

- [Backend Validation Strategy](backend-validation-strategy.md) - Input validation
- [Security Architecture](security-architecture.md) - Security overview
- [RPC Function Specifications](../api/rpc-functions.md) - RPC function patterns
- [Regulatory Framework](../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference
- [Compliance Requirements](../../../03-governance/compliance-requirements.md) - Detailed compliance requirements
- [Regulatory Policies](../../../03-governance/regulatory-policies.md) - Regulatory policies and guidelines

---

**Next Review Date:** [To be scheduled]  
**Owner:** Salim (Security & Audit Engineer)

