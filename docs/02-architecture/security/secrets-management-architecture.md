# Secrets Management Architecture - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines the secrets management architecture, including storage, rotation, access control, and security procedures.

**Last Updated:** 2025-12-31  
**Status:** ✅ Complete (Phase 0, Gap Resolution)  
**Owner:** Salim (Security & Audit Engineer), Leila (Infrastructure Engineer)

## Overview

The PM platform implements a comprehensive secrets management architecture to securely store, access, and rotate sensitive credentials (API keys, database passwords, service tokens) across all environments.

## Secrets Management Principles

1. **Never in Code:** Secrets never stored in code or version control
2. **Encrypted at Rest:** All secrets encrypted in storage
3. **Encrypted in Transit:** All secrets transmitted over encrypted channels
4. **Least Privilege:** Minimal access to secrets
5. **Rotation:** Regular secret rotation
6. **Auditable:** All secret access logged

## Secrets Categories

### 1. Database Secrets

**Types:**
- Supabase database passwords
- Service role keys
- Connection strings

**Storage:**
- Supabase Dashboard (encrypted)
- Environment variables (for local development)
- Supabase Secrets API (for Edge Functions)

**Access:**
- Service role key: Edge Functions only
- Database password: Supabase managed (not directly accessible)

---

### 2. API Keys

**Types:**
- External API keys (email service, customs API)
- Internal API keys (for ERP systems)

**Storage:**
- Supabase Secrets API (for Edge Functions)
- Database table `api_keys` (encrypted) for company API keys

**API Keys Table:**
```sql
CREATE TABLE api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id),
  key_name text NOT NULL,
  key_hash text NOT NULL, -- Hashed API key (never store plaintext)
  key_prefix text NOT NULL, -- First 8 characters for identification
  is_active boolean DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id)
);

CREATE INDEX idx_api_keys_company ON api_keys(company_id);
CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);
```

**API Key Generation:**
```sql
-- Generate API key
CREATE OR REPLACE FUNCTION generate_api_key(company_id uuid, key_name text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  api_key text;
  key_hash text;
  key_prefix text;
BEGIN
  -- Generate random API key (32 characters)
  api_key := encode(gen_random_bytes(16), 'hex');
  key_prefix := substring(api_key, 1, 8);
  
  -- Hash API key (bcrypt)
  key_hash := crypt(api_key, gen_salt('bf'));
  
  -- Store hashed key
  INSERT INTO api_keys (company_id, key_name, key_hash, key_prefix)
  VALUES (generate_api_key.company_id, generate_api_key.key_name, key_hash, key_prefix);
  
  -- Return API key (only time it's visible)
  RETURN jsonb_build_object(
    'success', true,
    'data', jsonb_build_object(
      'api_key', api_key,
      'key_prefix', key_prefix,
      'expires_at', NULL
    )
  );
END;
$$;
```

**API Key Validation:**
```sql
-- Validate API key
CREATE OR REPLACE FUNCTION validate_api_key(api_key text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  key_record record;
BEGIN
  -- Find API key by hash
  SELECT * INTO key_record
  FROM api_keys
  WHERE key_hash = crypt(validate_api_key.api_key, key_hash)
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > now());
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', jsonb_build_object(
        'code', 'INVALID_API_KEY',
        'message', 'Invalid or expired API key'
      )
    );
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'data', jsonb_build_object(
      'company_id', key_record.company_id,
      'key_name', key_record.key_name
    )
  );
END;
$$;
```

---

### 3. JWT Secrets

**Types:**
- JWT signing keys
- JWT refresh tokens

**Storage:**
- Supabase Auth (managed)
- Environment variables (for custom JWT)

**Access:**
- Supabase Auth handles JWT generation/validation
- Custom JWT: Edge Functions only

---

### 4. External Service Secrets

**Types:**
- Email service API keys
- Customs API keys
- Third-party service tokens

**Storage:**
- Supabase Secrets API (for Edge Functions)
- Environment variables (for local development)

**Supabase Secrets API:**
```typescript
// Edge Function: Access secret
const emailApiKey = Deno.env.get('EMAIL_SERVICE_API_KEY');

if (!emailApiKey) {
  throw new Error('EMAIL_SERVICE_API_KEY not configured');
}
```

---

## Secrets Storage

### Supabase Secrets API

**Purpose:** Store secrets for Edge Functions

**Usage:**
```bash
# Set secret
supabase secrets set EMAIL_SERVICE_API_KEY=your-api-key

# List secrets
supabase secrets list

# Unset secret
supabase secrets unset EMAIL_SERVICE_API_KEY
```

**Access in Edge Functions:**
```typescript
// Edge Function
const apiKey = Deno.env.get('EMAIL_SERVICE_API_KEY');
```

---

### Environment Variables

**Purpose:** Local development and CI/CD

**Storage:**
- `.env.local` (local development, gitignored)
- GitHub Secrets (CI/CD)
- Vercel Environment Variables (frontend)

**Naming Convention:**
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key
- `EMAIL_SERVICE_API_KEY` - Email service API key
- `CUSTOMS_API_KEY` - Customs API key

**Example `.env.local`:**
```bash
# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx

# External Services
EMAIL_SERVICE_API_KEY=xxx
CUSTOMS_API_KEY=xxx
```

---

### Database Storage (Encrypted)

**Purpose:** Store company API keys

**Encryption:**
- API keys hashed (bcrypt) before storage
- Never store plaintext API keys
- Use `crypt()` function for hashing

**Access Control:**
- RLS policies restrict access
- Only service role can validate API keys
- Company users can manage their own API keys

---

## Secret Rotation

### Rotation Strategy

**Frequency:**
- Database passwords: Quarterly (Supabase managed)
- API keys: Annually or on security event
- JWT secrets: Quarterly (Supabase managed)
- External service keys: Per service policy

### Rotation Procedure

**1. Generate New Secret:**
```sql
-- Generate new API key
SELECT generate_api_key(company_id, 'New API Key');
```

**2. Update Systems:**
- Update Edge Functions (Supabase Secrets API)
- Update external systems (if applicable)
- Update CI/CD (GitHub Secrets)

**3. Grace Period:**
- Keep old secret active for 7 days
- Monitor for usage of old secret
- Alert on old secret usage

**4. Deactivate Old Secret:**
```sql
-- Deactivate old API key
UPDATE api_keys
SET is_active = false, updated_at = now()
WHERE id = old_key_id;
```

**5. Verify:**
- Test new secret works
- Verify old secret rejected
- Monitor for errors

---

## Secret Access Control

### Access Levels

**1. Service Role:**
- Full access to all secrets
- Used by Edge Functions
- Stored in Supabase Secrets API

**2. Authenticated Users:**
- Access to own company's API keys
- Can generate/revoke own API keys
- Cannot view key values (only prefixes)

**3. System Administrators:**
- Access to system secrets
- Can rotate secrets
- Full audit access

### Access Logging

**All secret access logged:**
```sql
-- Log API key usage
CREATE OR REPLACE FUNCTION log_api_key_usage(api_key_id uuid, endpoint text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO audit_logs (
    user_id,
    operation_type,
    table_name,
    record_id,
    new_values,
    reason
  ) VALUES (
    NULL, -- System operation
    'API_KEY_USED',
    'api_keys',
    api_key_id,
    jsonb_build_object('endpoint', endpoint),
    'API key used for API request'
  );
END;
$$;
```

---

## Secret Security Best Practices

### 1. Never Store in Code

- Never commit secrets to Git
- Use `.gitignore` for `.env` files
- Use environment variables or secrets API

### 2. Encrypt at Rest

- All secrets encrypted in storage
- Use Supabase encryption (database)
- Use Supabase Secrets API (Edge Functions)

### 3. Encrypt in Transit

- All secrets transmitted over HTTPS
- Use TLS for all connections
- Never send secrets in URLs

### 4. Least Privilege

- Minimal access to secrets
- Service role only for Edge Functions
- Company users only for own API keys

### 5. Regular Rotation

- Rotate secrets regularly
- Rotate on security events
- Monitor for secret exposure

### 6. Audit All Access

- Log all secret access
- Monitor for suspicious patterns
- Alert on unauthorized access

---

## Secret Management Checklist

### For Each Secret:

- [ ] Stored securely (encrypted at rest)
- [ ] Transmitted securely (encrypted in transit)
- [ ] Access controlled (least privilege)
- [ ] Rotation schedule defined
- [ ] Access logged
- [ ] Backup/recovery procedure defined
- [ ] Revocation procedure defined

### For Each Environment:

- [ ] Secrets stored in secure location
- [ ] Access restricted to authorized users
- [ ] Rotation procedures documented
- [ ] Emergency revocation procedure defined

---

## Related Documents

- [Security Architecture](security-architecture.md) - Security overview
- [Infrastructure Documentation](../../08-deployment/infrastructure.md) - Infrastructure secrets
- [Development Setup Guide](../../06-development/development-setup.md) - Local secrets
- [Regulatory Framework](../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference
- [Compliance Requirements](../../../03-governance/compliance-requirements.md) - Detailed compliance requirements
- [Regulatory Policies](../../../03-governance/regulatory-policies.md) - Regulatory policies and guidelines

---

**Next Review Date:** [To be scheduled]  
**Owner:** Salim (Security & Audit Engineer), Leila (Infrastructure Engineer)

