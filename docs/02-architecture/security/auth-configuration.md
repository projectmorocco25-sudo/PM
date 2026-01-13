# Authentication Configuration - PM Platform

**Purpose:** This document defines the authentication configuration for the PM platform, including password policies, session management, and security controls.

**Task Reference:** 1.1.1.6a, 1.1.1.6b  
**Last Updated:** 2026-01-13  
**Status:** ✅ Complete  
**Owner:** Security Team

---

## Overview

The PM platform uses Supabase Auth for authentication with custom extensions for:
- Password complexity requirements
- Password history tracking
- Concurrent session limiting
- Account lockout protection
- Session timeout management

---

## Password Policies (Task 1.1.1.6a)

### Requirements

| Policy | Default Value | Configurable |
|--------|---------------|--------------|
| Minimum Length | 8 characters | ✅ `password_min_length` |
| Require Uppercase | Yes | ✅ `password_require_uppercase` |
| Require Lowercase | Yes | ✅ `password_require_lowercase` |
| Require Number | Yes | ✅ `password_require_number` |
| Require Special Character | Yes | ✅ `password_require_special` |
| Password History | Last 5 passwords | ✅ `password_history_count` |
| Password Expiry | Disabled (0 days) | ✅ `password_expiry_days` |

### Configuration Table

Password policies are stored in `public.auth_config` and can be modified by Tier 1 or System Admin:

```sql
-- View current password policies
SELECT config_key, config_value, description 
FROM public.auth_config 
WHERE config_key LIKE 'password_%';

-- Update a policy
UPDATE public.auth_config 
SET config_value = '10', updated_at = now()
WHERE config_key = 'password_min_length';
```

### Password Validation Function

```sql
-- Validate password complexity
SELECT public.validate_password_complexity('MyP@ssw0rd!');

-- Returns:
-- {
--   "is_valid": true,
--   "errors": []
-- }

-- For invalid password:
SELECT public.validate_password_complexity('weak');

-- Returns:
-- {
--   "is_valid": false,
--   "errors": [
--     "Password must be at least 8 characters",
--     "Password must contain at least one uppercase letter",
--     "Password must contain at least one number",
--     "Password must contain at least one special character"
--   ]
-- }
```

### Password History

Prevents users from reusing recent passwords:

```sql
-- Check if password was recently used (service role only)
SELECT public.check_password_history(
    'user-uuid'::UUID,
    'hashed-password-value'
);

-- Record password in history (service role only)
SELECT public.record_password_history(
    'user-uuid'::UUID,
    'hashed-password-value'
);
```

### Frontend Integration (Zod Schema)

```typescript
import { z } from 'zod';

export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/`~]/, 
    'Password must contain at least one special character');

export const registrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
```

---

## Session Management (Task 1.1.1.6b)

### Requirements

| Policy | Default Value | Configurable |
|--------|---------------|--------------|
| Session Timeout | 60 minutes | ✅ `session_timeout_minutes` |
| Idle Timeout | 30 minutes | ✅ `session_timeout_idle_minutes` |
| Max Concurrent Sessions | 3 | ✅ `session_max_concurrent` |
| JWT Token Expiry | 1 hour (3600s) | `config.toml` |
| Refresh Token Rotation | Enabled | `config.toml` |

### Concurrent Session Limiting

When a user exceeds the maximum concurrent sessions, the oldest session is automatically invalidated:

```sql
-- Create a new session (enforces concurrent limit)
SELECT public.create_user_session(
    'user-uuid'::UUID,
    'session-token-hash',
    '{"device": "Chrome on Windows"}'::JSONB,
    '192.168.1.1'::INET,
    'Mozilla/5.0...'
);
```

### Session Activity Tracking

```sql
-- Update session activity (extends expiry, checks idle timeout)
SELECT public.update_session_activity('session-token-hash');

-- Returns false if session expired or idle timeout exceeded
```

### Session Invalidation

```sql
-- Logout (invalidate single session)
SELECT public.invalidate_session('session-token-hash', 'user_logout');

-- Security event (invalidate all user sessions)
SELECT public.invalidate_all_user_sessions('user-uuid'::UUID, 'password_changed');

-- Reasons for invalidation:
-- - 'user_logout': User initiated logout
-- - 'password_changed': Password was changed
-- - 'security_event': Security event detected
-- - 'admin_action': Admin invalidated session
-- - 'max_concurrent_sessions_exceeded': New session replaced old
-- - 'session_expired': Session timeout
-- - 'session_expired_or_idle': Expired or idle timeout
```

### View Active Sessions

Users can view their active sessions:

```sql
-- Get current user's active sessions
SELECT * FROM public.get_user_active_sessions();

-- Returns:
-- session_id | device_info | ip_address | user_agent | created_at | last_activity_at | expires_at
```

### Session Cleanup

Expired sessions are cleaned up automatically:

```sql
-- Run by scheduled job (pg_cron)
SELECT public.cleanup_expired_sessions();

-- Example pg_cron schedule (every 15 minutes)
SELECT cron.schedule(
    'cleanup-expired-sessions',
    '*/15 * * * *',
    $$SELECT public.cleanup_expired_sessions()$$
);
```

---

## Account Lockout Protection

### Configuration

| Policy | Default Value | Configurable |
|--------|---------------|--------------|
| Failed Attempts Before Lockout | 5 | ✅ `failed_login_lockout_attempts` |
| Lockout Duration | 15 minutes | ✅ `failed_login_lockout_minutes` |

### Check Lockout Status

```sql
-- Check if account is locked
SELECT public.check_login_lockout('user@example.com');

-- Returns:
-- {
--   "is_locked": false,
--   "failed_attempts": 2,
--   "max_attempts": 5,
--   "lockout_until": null
-- }

-- When locked:
-- {
--   "is_locked": true,
--   "failed_attempts": 5,
--   "max_attempts": 5,
--   "lockout_until": "2026-01-13T12:15:00Z"
-- }
```

### Record Failed Login

```sql
-- Record failed login attempt (called by auth hook)
SELECT public.record_failed_login(
    'user@example.com',
    '192.168.1.1'::INET,
    'Mozilla/5.0...'
);
```

### Clear on Successful Login

```sql
-- Clear failed login attempts (called on successful login)
SELECT public.clear_failed_logins('user@example.com');
```

---

## JWT Configuration

### config.toml Settings

```toml
[auth]
# JWT token expires after 1 hour
jwt_expiry = 3600

# Refresh token rotation - new refresh token issued on each use
enable_refresh_token_rotation = true

# Grace period for concurrent requests
refresh_token_reuse_interval = 10
```

### Token Flow

1. User logs in → Receives JWT (1 hour) + Refresh Token
2. JWT expires → Client uses Refresh Token to get new JWT
3. Refresh Token rotated → Old refresh token invalidated
4. Session timeout → User must re-authenticate

---

## Security Events Triggering Session Invalidation

| Event | Action |
|-------|--------|
| Password change | Invalidate all sessions |
| Password reset | Invalidate all sessions |
| Account suspension | Invalidate all sessions |
| Security breach detected | Invalidate all sessions |
| Admin action | Invalidate specific or all sessions |

---

## Database Tables

### password_history

Stores password hashes for history tracking (prevents reuse).

### user_sessions

Tracks active user sessions for concurrent limiting and management.

### auth_config

Stores configurable authentication settings.

### failed_login_attempts

Tracks failed login attempts for lockout protection.

---

## Edge Function Integration

### Auth Hook: Password Validation

```typescript
// supabase/functions/auth-validate-password/index.ts
import { createClient } from '@supabase/supabase-js';

Deno.serve(async (req) => {
  const { password } = await req.json();
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
  
  const { data, error } = await supabase.rpc('validate_password_complexity', {
    p_password: password
  });
  
  if (error) {
    return new Response(JSON.stringify({ valid: false, error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

### Auth Hook: Login Lockout Check

```typescript
// Called before authentication
const lockoutStatus = await supabase.rpc('check_login_lockout', {
  p_email: email
});

if (lockoutStatus.is_locked) {
  throw new Error(`Account locked until ${lockoutStatus.lockout_until}`);
}
```

---

## Production Configuration

### Supabase Dashboard Settings

For production, additional settings should be configured in the Supabase Dashboard:

1. **Auth > URL Configuration**
   - Site URL: `https://pm-platform.gov.dz`
   - Redirect URLs: Production domains only

2. **Auth > Providers**
   - Email: Enabled with confirmation
   - Other providers: Disabled (email only)

3. **Auth > Email Templates**
   - Customize password reset email
   - Customize confirmation email

4. **Auth > Rate Limits**
   - Signup: 5 per hour per IP
   - Token refresh: 100 per hour per user
   - Password recovery: 3 per hour per email

---

## Related Documents

- [Security Architecture](security-architecture.md)
- [RLS Policy Framework](rls-policy-framework.md)
- [Supabase Configuration](../../../supabase/config.toml)
- [Migration File](../../../supabase/migrations/20260113_120000_auth_password_policies.sql)

---

**Verified By:** Implementation Team  
**Date:** 2026-01-13
