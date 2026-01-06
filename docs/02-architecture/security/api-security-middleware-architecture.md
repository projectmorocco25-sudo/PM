# API Security Middleware Architecture - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines the API security middleware architecture, including authentication, authorization, rate limiting, and request validation middleware.

**Last Updated:** 2025-12-31  
**Status:** ✅ Complete (Phase 0, Gap Resolution)  
**Owner:** Salim (Security & Audit Engineer), Maya (Workflow/RPC Engineer)

## Overview

The PM platform implements a comprehensive API security middleware stack to protect all API endpoints (RPC functions, Edge Functions, REST APIs) from unauthorized access, abuse, and security vulnerabilities.

## Middleware Principles

1. **Defense in Depth:** Multiple layers of security
2. **Fail Secure:** Deny by default, allow explicitly
3. **Performance:** Minimal performance impact
4. **Auditable:** All security events logged
5. **Consistent:** Same security across all API types

## Middleware Stack

### Layer 1: Request Validation Middleware

**Purpose:** Validate request format, headers, and basic structure

**Implementation:**
- **RPC Functions:** Supabase client validates request format
- **Edge Functions:** Request validation in function code
- **REST API:** Request validation middleware

**Checks:**
- Request format (JSON, content-type)
- Required headers
- Request size limits
- HTTP method validation

**Example (Edge Function):**
```typescript
// Edge Function request validation
export default async function handler(req: Request) {
  // 1. Validate HTTP method
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'INVALID_METHOD',
          message: 'Method not allowed'
        }
      }),
      { status: 405 }
    );
  }
  
  // 2. Validate content-type
  const contentType = req.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'INVALID_CONTENT_TYPE',
          message: 'Content-Type must be application/json'
        }
      }),
      { status: 400 }
    );
  }
  
  // 3. Validate request size
  const contentLength = req.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > 10485760) { // 10MB
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'REQUEST_TOO_LARGE',
          message: 'Request body too large (max 10MB)'
        }
      }),
      { status: 413 }
    );
  }
  
  // Continue with request processing
}
```

---

### Layer 2: Authentication Middleware

**Purpose:** Validate user authentication

**Implementation:**
- **RPC Functions:** Supabase Auth (automatic via `auth.uid()`)
- **Edge Functions:** JWT token validation
- **REST API:** API Key + JWT token validation

**RPC Functions:**
```sql
-- Authentication check in RPC function
CREATE OR REPLACE FUNCTION example_function()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check authentication
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', jsonb_build_object(
        'code', 'AUTHENTICATION_ERROR',
        'message', 'Authentication required'
      )
    );
  END IF;
  
  -- Continue with function logic
END;
$$;
```

**Edge Functions:**
```typescript
// Edge Function authentication
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: Request) {
  // 1. Extract JWT token
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: 'Authorization header required'
        }
      }),
      { status: 401 }
    );
  }
  
  const token = authHeader.substring(7);
  
  // 2. Validate token with Supabase
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: 'Invalid or expired token'
        }
      }),
      { status: 401 }
    );
  }
  
  // Continue with request processing
}
```

**REST API:**
```typescript
// REST API authentication (API Key + JWT)
export async function authenticateRequest(req: Request) {
  // 1. Validate API Key
  const apiKey = req.headers.get('X-API-Key');
  if (!apiKey) {
    return {
      success: false,
      error: {
        code: 'AUTHENTICATION_ERROR',
        message: 'API Key required'
      }
    };
  }
  
  // 2. Validate API Key in database
  const company = await validateApiKey(apiKey);
  if (!company) {
    return {
      success: false,
      error: {
        code: 'AUTHENTICATION_ERROR',
        message: 'Invalid API Key'
      }
    };
  }
  
  // 3. Validate JWT token
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return {
      success: false,
      error: {
        code: 'AUTHENTICATION_ERROR',
        message: 'JWT token required'
      }
    };
  }
  
  const token = authHeader.substring(7);
  const jwtPayload = await validateJWT(token, company.id);
  
  if (!jwtPayload) {
    return {
      success: false,
      error: {
        code: 'AUTHENTICATION_ERROR',
        message: 'Invalid or expired JWT token'
      }
    };
  }
  
  return { success: true, company, jwtPayload };
}
```

---

### Layer 3: Authorization Middleware

**Purpose:** Validate user permissions and role-based access

**Implementation:**
- **RPC Functions:** Permission checks in function code
- **Edge Functions:** Permission checks in function code
- **REST API:** Permission checks in middleware

**RPC Functions:**
```sql
-- Authorization check in RPC function
CREATE OR REPLACE FUNCTION rmm_create_company(name text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role text;
BEGIN
  -- Get user role
  SELECT role INTO user_role FROM users WHERE id = auth.uid();
  
  -- Check authorization
  IF user_role NOT IN ('tier1', 'tier2_officer', 'company_admin') THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', jsonb_build_object(
        'code', 'AUTHORIZATION_ERROR',
        'message', 'You do not have permission to create companies'
      )
    );
  END IF;
  
  -- Continue with operation
END;
$$;
```

**Edge Functions:**
```typescript
// Edge Function authorization
export async function checkPermission(userId: string, permission: string) {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
  
  // Get user role
  const { data: user } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();
  
  if (!user) {
    return false;
  }
  
  // Check permission based on role
  const permissions = getPermissionsForRole(user.role);
  return permissions.includes(permission);
}
```

---

### Layer 4: Rate Limiting Middleware

**Purpose:** Prevent abuse and DoS attacks

**Implementation:**
- **RPC Functions:** Rate limiting in function code (check rate limit table)
- **Edge Functions:** Rate limiting in function code
- **REST API:** Rate limiting middleware

**Rate Limit Table:**
```sql
CREATE TABLE rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  company_id uuid REFERENCES companies(id),
  endpoint text NOT NULL,
  request_count integer DEFAULT 0,
  window_start timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_rate_limits_user_endpoint ON rate_limits(user_id, endpoint, window_start);
CREATE INDEX idx_rate_limits_company_endpoint ON rate_limits(company_id, endpoint, window_start);
```

**Rate Limiting Function:**
```sql
-- Check and update rate limit
CREATE OR REPLACE FUNCTION check_rate_limit(
  user_id uuid,
  company_id uuid,
  endpoint text,
  limit_count integer,
  window_seconds integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_count integer;
  window_start timestamptz;
BEGIN
  -- Get or create rate limit record
  SELECT request_count, window_start INTO current_count, window_start
  FROM rate_limits
  WHERE check_rate_limit.user_id = rate_limits.user_id
    AND check_rate_limit.endpoint = rate_limits.endpoint
    AND window_start > now() - (window_seconds || ' seconds')::interval;
  
  -- If window expired, reset
  IF window_start IS NULL OR window_start < now() - (window_seconds || ' seconds')::interval THEN
    INSERT INTO rate_limits (user_id, company_id, endpoint, request_count, window_start)
    VALUES (check_rate_limit.user_id, check_rate_limit.company_id, check_rate_limit.endpoint, 1, now())
    ON CONFLICT (user_id, endpoint) DO UPDATE
    SET request_count = 1, window_start = now();
    
    RETURN true;
  END IF;
  
  -- Check if limit exceeded
  IF current_count >= limit_count THEN
    RETURN false;
  END IF;
  
  -- Increment count
  UPDATE rate_limits
  SET request_count = request_count + 1, updated_at = now()
  WHERE check_rate_limit.user_id = rate_limits.user_id
    AND check_rate_limit.endpoint = rate_limits.endpoint;
  
  RETURN true;
END;
$$;
```

**Usage in RPC Function:**
```sql
-- Check rate limit before processing
IF NOT check_rate_limit(auth.uid(), NULL, 'rmm_create_company', 10, 60) THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', jsonb_build_object(
      'code', 'RATE_LIMIT_EXCEEDED',
      'message', 'Rate limit exceeded. Please try again later.'
    )
  );
END IF;
```

---

### Layer 5: Input Sanitization Middleware

**Purpose:** Sanitize all user input

**Implementation:**
- **RPC Functions:** Input sanitization in function code (see Backend Input Sanitization Strategy)
- **Edge Functions:** Input sanitization in function code
- **REST API:** Input sanitization middleware

**See:** [Backend Input Sanitization Strategy](backend-input-sanitization-strategy.md)

---

### Layer 6: Security Headers Middleware

**Purpose:** Add security headers to responses

**Implementation:**
- **Edge Functions:** Security headers in response
- **REST API:** Security headers middleware

**Security Headers:**
```typescript
// Edge Function security headers
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'",
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

return new Response(
  JSON.stringify(response),
  {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      ...securityHeaders
    }
  }
);
```

---

### Layer 7: CORS Middleware

**Purpose:** Control cross-origin requests

**Implementation:**
- **Edge Functions:** CORS headers in response
- **REST API:** CORS middleware

**CORS Configuration:**
```typescript
// CORS configuration
const allowedOrigins = [
  'https://pm-prod.vercel.app',
  'https://pm-staging.vercel.app'
];

export function handleCORS(req: Request) {
  const origin = req.headers.get('origin');
  
  if (origin && allowedOrigins.includes(origin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
      'Access-Control-Max-Age': '86400'
    };
  }
  
  return {};
}
```

---

## Middleware Execution Order

**Order:**
1. Request Validation (format, headers, size)
2. Authentication (validate user identity)
3. Authorization (validate user permissions)
4. Rate Limiting (check rate limits)
5. Input Sanitization (sanitize user input)
6. Business Logic (process request)
7. Security Headers (add security headers)
8. CORS (add CORS headers)

---

## Middleware Best Practices

### 1. Fail Fast

- Validate and authenticate early
- Reject invalid requests quickly
- Don't process unauthorized requests

### 2. Log Security Events

- Log all authentication failures
- Log all authorization failures
- Log all rate limit violations
- Log suspicious patterns

### 3. Consistent Error Responses

- Use standard error format
- Don't leak information
- Return appropriate HTTP status codes

### 4. Performance

- Cache authentication results
- Cache permission checks
- Efficient rate limiting
- Minimal overhead

---

## Middleware Checklist

### For Each API Endpoint:

- [ ] Request validation (format, headers, size)
- [ ] Authentication check
- [ ] Authorization check
- [ ] Rate limiting
- [ ] Input sanitization
- [ ] Security headers (if applicable)
- [ ] CORS headers (if applicable)
- [ ] Error handling
- [ ] Security event logging

---

## Related Documents

- [Security Architecture](security-architecture.md) - Security overview
- [Backend Input Sanitization Strategy](backend-input-sanitization-strategy.md) - Input sanitization
- [Backend Error Handling Framework](backend-error-handling-framework.md) - Error handling
- [API Specification](../api/api-specification.md) - API specifications
- [Regulatory Framework](../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference
- [Compliance Requirements](../../../03-governance/compliance-requirements.md) - Detailed compliance requirements
- [Regulatory Policies](../../../03-governance/regulatory-policies.md) - Regulatory policies and guidelines

---

**Next Review Date:** [To be scheduled]  
**Owner:** Salim (Security & Audit Engineer), Maya (Workflow/RPC Engineer)

