## Supabase Auth password + session policies (Phase 1 baseline)

This repo configures the **local Supabase** Auth policy via `supabase/config.toml` and documents the **hosted Supabase** dashboard settings that must match.

### Password policy (Task 1.1.1.6a)

- **Minimum length**: 12
- **Complexity**: lowercase + uppercase + digits + symbols
- **Email confirmations**: enabled (users must verify email before sign-in)

**Local config source of truth:** `supabase/config.toml`

**Hosted Supabase (Dashboard) checklist (must match local):**
- Authentication → Providers → Email
  - Password strength: set to match complexity requirement
  - Minimum length: 12
  - Confirm email: enabled

### Password reset policy (Task 1.1.1.6a)

- **Reset via email link**: enabled (default Supabase behavior)
- **Reset link validity**: aligned to project JWT expiry policy where applicable
- **Rate limiting**: enable platform defaults (and tighten in production)

**Hosted Supabase checklist:**
- Authentication → Rate limits
  - Set conservative limits for `recover` / password reset endpoints in prod

### Session management (Task 1.1.1.6b)

Supabase sessions are JWT-based. The baseline policy is:

- **Session timeout (JWT expiry)**: 1 hour (`jwt_expiry = 3600`)
- **Concurrent sessions**: allow (device-based sessions); revoke via refresh token rotation + sign-out
- **Session invalidation**:
  - Use refresh token rotation in hosted config
  - Revoke all sessions for a user on security events (password change, role change)

**Local config source of truth:** `supabase/config.toml`
  - `enable_refresh_token_rotation = true`
  - `refresh_token_reuse_interval = 10` (seconds; production hardening baseline)

**Hosted Supabase checklist:**
- Authentication → Settings
  - JWT expiry: 3600s
  - Refresh token rotation: enabled
  - Reuse interval: minimal (production hardening)

