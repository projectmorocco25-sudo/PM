# Supabase Auth Configuration - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document specifies the Supabase Auth configuration requirements for password policies, session management, and security settings.

**Created:** 2026-01-17  
**Task:** 1.1.1.6a, 1.1.1.6b  
**Author:** Sami (Implementation Compliance Specialist)  
**Owner:** Rafi (Security & Access Control Engineer)

---

## Overview

This document specifies the Supabase Auth configuration requirements for the PM platform, including password policies, session management, and security settings. These configurations must be set in the Supabase Dashboard under Authentication settings.

---

## Password Policies

### Minimum Password Length

**Requirement:** Minimum 8 characters

**Configuration Location:**
- Supabase Dashboard → Authentication → Password → Minimum Length
- Set to: **8**

### Password Complexity Requirements

**Requirements:**
- Must contain at least one uppercase letter (A-Z)
- Must contain at least one lowercase letter (a-z)
- Must contain at least one number (0-9)
- Must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)

**Configuration Location:**
- Supabase Dashboard → Authentication → Password → Password Requirements
- Enable: **Require uppercase letter**
- Enable: **Require lowercase letter**
- Enable: **Require number**
- Enable: **Require special character**

**Note:** These requirements may need to be enforced via application-level validation if Supabase Dashboard doesn't provide all these options. RPC functions should validate password complexity before creating users.

### Password Reset Policies

**Requirements:**
- Password reset tokens expire after 1 hour (3600 seconds)
- Password reset emails include secure token link
- Password reset requires email verification
- Old password cannot be reused (password history)

**Configuration Location:**
- Supabase Dashboard → Authentication → Email Templates → Reset Password
- Configure email template with secure token link
- Set token expiration: **3600 seconds** (1 hour)

**Implementation Notes:**
- Password history enforcement must be implemented in application logic (RPC functions)
- Check password history before allowing password reset
- Store hashed password history in user profile or separate table (if required)

### Password Strength Indicator

**Requirement:** Provide password strength feedback during password creation/reset

**Implementation:**
- Frontend should display password strength indicator
- Use client-side validation to check password requirements
- Show strength meter (weak, medium, strong)

---

## Session Management

### Session Timeout

**Requirement:** Sessions expire after 24 hours of inactivity

**Configuration Location:**
- Supabase Dashboard → Authentication → Sessions → Session Duration
- Set to: **86400 seconds** (24 hours)

**Implementation Notes:**
- Session timeout is enforced by Supabase automatically
- Frontend should refresh session token before expiration
- Implement session refresh logic in frontend (refresh token)

### Concurrent Session Limits

**Requirement:** Users can have multiple concurrent sessions (no limit specified)

**Configuration Location:**
- Supabase Dashboard → Authentication → Sessions → Multiple Sessions
- Set to: **Allow multiple sessions** (default)

**Implementation Notes:**
- Users can be logged in from multiple devices simultaneously
- Session management in application logic may be needed for specific use cases
- Consider implementing session management UI for users to view/revoke sessions

### Session Invalidation

**Requirement:** Ability to invalidate all sessions for a user (logout from all devices)

**Configuration Location:**
- Supabase Dashboard → Authentication → Sessions → Session Management
- Enable: **Allow session revocation**

**Implementation:**
- Use Supabase Admin API or RPC function to revoke all sessions for a user
- Implement "Logout from all devices" feature in user profile page
- Log session revocation in audit_logs

---

## Email Verification

### Email Verification Requirement

**Requirement:** Email verification required before account activation

**Configuration Location:**
- Supabase Dashboard → Authentication → Email Templates → Confirm Signup
- Enable: **Require email confirmation**
- Set confirmation link expiration: **86400 seconds** (24 hours)

### Email Verification Templates

**Requirement:** Custom email templates for signup confirmation and password reset

**Configuration Location:**
- Supabase Dashboard → Authentication → Email Templates
- Customize templates with PM platform branding and messaging

**Template Variables:**
- `{{ .ConfirmationURL }}` - Email confirmation link
- `{{ .Email }}` - User email address
- `{{ .Token }}` - Verification token (if needed)

---

## Account Security Settings

### Account Lockout

**Requirement:** Lock account after 5 failed login attempts (15 minute lockout)

**Configuration Location:**
- Supabase Dashboard → Authentication → Security → Rate Limiting
- Set failed login attempts: **5**
- Set lockout duration: **900 seconds** (15 minutes)

**Implementation Notes:**
- Account lockout is handled automatically by Supabase
- Frontend should display appropriate error messages for locked accounts
- Implement "Unlock Account" feature for admins (if needed)

### Two-Factor Authentication (2FA)

**Requirement:** Optional 2FA for MOH Tier 1 users (future enhancement)

**Configuration Location:**
- Supabase Dashboard → Authentication → MFA
- Enable: **Multi-Factor Authentication** (optional)

**Implementation Notes:**
- 2FA is optional for Phase 1.1
- Future enhancement for high-privilege users (MOH Tier 1)
- Use Supabase MFA features when implemented

### IP Allowlist (Optional)

**Requirement:** IP allowlist for MOH users (optional, future enhancement)

**Configuration Location:**
- Supabase Dashboard → Authentication → Security → IP Restrictions
- Configure IP allowlist for specific user roles (if required)

**Implementation Notes:**
- IP allowlist is optional for Phase 1.1
- Future enhancement for enhanced security
- Implement in RLS policies or application logic if needed

---

## Configuration Checklist

### Password Policies
- [ ] Minimum password length set to 8 characters
- [ ] Password complexity requirements configured (uppercase, lowercase, number, special character)
- [ ] Password reset token expiration set to 1 hour
- [ ] Password reset email template configured
- [ ] Password history enforcement (application-level, if required)

### Session Management
- [ ] Session timeout set to 24 hours
- [ ] Multiple concurrent sessions allowed
- [ ] Session revocation enabled
- [ ] Session refresh logic implemented in frontend

### Email Verification
- [ ] Email verification required before account activation
- [ ] Email confirmation link expiration set to 24 hours
- [ ] Custom email templates configured with PM branding

### Account Security
- [ ] Account lockout after 5 failed attempts (15 minute lockout)
- [ ] Rate limiting configured
- [ ] 2FA configured (optional, future enhancement)
- [ ] IP allowlist configured (optional, future enhancement)

---

## Related Documents

- [Authentication Specification](../../../docs/02-architecture/security/authentication-spec.md) - Authentication requirements (if exists)
- [RLS Policy Framework](../security/rls-policy-framework.md) - Row Level Security policies
- [Backend Error Handling Framework](../security/backend-error-handling-framework.md) - Error handling standards

---

**Last Updated:** 2026-01-17  
**Next Review Date:** After Phase 1.1 Complete
