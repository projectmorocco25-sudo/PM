# Security Architecture - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines the comprehensive security architecture for the PM platform, including authentication, authorization, data protection, and security controls.

**Last Updated:** 2025-12-31  
**Status:** ✅ Complete (Phase 0, Week 4)  
**Owner:** Salim

## Overview

The PM platform implements a multi-layered security architecture using Supabase Auth, Row Level Security (RLS), Role-Based Access Control (RBAC), and comprehensive audit logging to ensure data protection, regulatory compliance, and secure access control.

## Security Principles

1. **Defense in Depth:** Multiple layers of security controls
2. **Least Privilege:** Users have minimum necessary permissions
3. **Data Isolation:** Company data isolated at database level (RLS)
4. **Audit Trail:** All security-relevant events logged
5. **Regulatory Compliance:** Meets MOH regulatory requirements (see [Regulatory Framework](../../03-governance/regulatory-framework.md) and [Compliance Requirements](../../03-governance/compliance-requirements.md))
6. **Immutability:** Audit logs are immutable (hash-chained)

## Authentication Architecture

### Supabase Auth Integration

**Primary Method:** Email/password authentication

**Features:**
- Email/password authentication
- Password reset via email
- Session management (configurable duration)
- JWT token-based sessions
- Secure password storage (bcrypt hashing)

**Password Policies:**
- Minimum length: 8 characters (configurable)
- Complexity requirements: At least one uppercase, one lowercase, one number, one special character (configurable)
- Password history: Prevent reuse of last 5 passwords (configurable)
- Password expiration: Optional (configurable)

**Session Management:**
- Session duration: 24 hours (configurable)
- Refresh tokens: Automatic token refresh
- Session invalidation: On logout, password change, or security event

**Multi-Factor Authentication (MFA):**
- Optional feature (can be enabled per user or globally)
- TOTP (Time-based One-Time Password) support
- Backup codes provided
- Can be added later if required

---

### Authentication Flow

**1. User Registration:**
```
User → Enter email/password → Supabase Auth → Create account → Email verification → Account active
```

**2. User Login:**
```
User → Enter email/password → Supabase Auth → Validate credentials → Generate JWT token → Return token → User authenticated
```

**3. Password Reset:**
```
User → Request password reset → Supabase Auth → Send reset email → User clicks link → Enter new password → Password updated
```

**4. Session Management:**
```
User → Authenticated → JWT token stored → Token validated on each request → Token expires → Refresh token → New JWT token
```

---

## Authorization Architecture

### Role-Based Access Control (RBAC)

**Role Storage:** Roles stored in `users.role` column

**User Roles:**

| Role | Description | Permissions |
|------|-------------|-------------|
| `tier1` | MOH DMP Tier 1 (Approver/Admin) | Full administrative access, approve all submissions, enforce compliance actions, configure system |
| `tier2_officer` | MOH DMP Tier 2 Officer | Verify submissions, flag non-compliance, investigate anomalies, escalate to Tier 1 |
| `tier2_registrar` | MOH DMP Tier 2 Registrar | Implement approved registry updates under Tier 1 supervision |
| `company_admin` | Company Admin | Submit registry updates for company and products, manage company users |
| `company_manager` | Company Manager | Manage products and SKUs, submit data (AAMS, MSQ, WSL, export requests) |
| `company_user` | Company User | View company data, submit data (AAMS, MSQ, WSL, export requests) |
| `auditor` | Auditor | Read-only access to audit logs and compliance reports |
| `system_admin` | System Administrator | Technical configuration and maintenance |
| `vendor` | Vendor | Limited read-only access for troubleshooting and monitoring |

---

### Permission Matrix

**Registry Management (RMM):**

| Action | Tier 1 | Tier 2 Officer | Tier 2 Registrar | Company Admin | Company Manager | Company User |
|--------|--------|----------------|------------------|---------------|-----------------|--------------|
| Create Company | ✅ | ✅ (with peer review) | ❌ | ✅ (submit) | ❌ | ❌ |
| Update Company | ✅ | ✅ (with peer review) | ❌ | ✅ (submit) | ❌ | ❌ |
| Delete Company | ✅ (with Tier 2 confirmation) | ❌ | ❌ | ❌ | ❌ | ❌ |
| Verify Submission | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Approve Submission | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Implement Update | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |

**Value Chain Intelligence (VCI):**

| Action | Tier 1 | Tier 2 Officer | Company Admin | Company Manager | Company User |
|--------|--------|----------------|---------------|-----------------|--------------|
| Submit AAMS | ❌ | ❌ | ✅ | ✅ | ✅ |
| Submit MSQ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Submit WSL | ❌ | ❌ | ✅ | ✅ | ✅ |
| Verify AAMS | ✅ | ✅ | ❌ | ❌ | ❌ |
| Approve Threshold | ✅ | ❌ | ❌ | ❌ | ❌ |
| Analyze Breach | ✅ | ✅ | ❌ | ❌ | ❌ |
| Suggest Action | ✅ | ✅ | ❌ | ❌ | ❌ |

**Export Control System (ECS):**

| Action | Tier 1 | Tier 2 Officer | Company Admin | Company Manager | Company User |
|--------|--------|----------------|---------------|-----------------|--------------|
| Submit Export Request | ❌ | ❌ | ✅ | ✅ | ✅ |
| Verify Export | ✅ | ✅ | ❌ | ❌ | ❌ |
| Approve Export | ✅ | ✅ (if required) | ❌ | ❌ | ❌ |
| Authorize Export | ✅ | ❌ | ❌ | ❌ | ❌ |
| Revoke Authorization | ✅ | ❌ | ❌ | ❌ | ❌ |

**Compliance Monitoring Center (CMC):**

| Action | Tier 1 | Tier 2 Officer | Company Admin | Company Manager | Company User |
|--------|--------|----------------|---------------|-----------------|--------------|
| View Own Score | ❌ | ❌ | ✅ | ✅ | ✅ |
| View All Scores | ✅ | ✅ | ❌ | ❌ | ❌ |
| Dispute Score | ❌ | ❌ | ✅ | ✅ | ✅ |
| Review Dispute | ✅ | ✅ | ❌ | ❌ | ❌ |
| Override Score | ✅ | ❌ | ❌ | ❌ | ❌ |

---

### Integration with RLS

**RLS Policies Check Roles:**
- RLS policies use `users.role` to determine access
- Company users: `company_id` is set, RLS restricts to own company
- MOH users: `company_id` is NULL, RLS allows system-wide access
- Role-based permissions enforced at database level

**Application Logic:**
- Complex business rules (two-person rule, approval workflows) enforced in application
- RLS handles data visibility, application handles actions

---

## Data Protection

### Encryption

**Data at Rest:**
- Database encryption: Supabase provides encryption at rest
- Backup encryption: All backups encrypted
- File storage: Supabase Storage encrypted

**Data in Transit:**
- TLS/HTTPS: All API communications encrypted
- Database connections: Encrypted connections to Supabase
- Frontend-backend: All communications over HTTPS

**Sensitive Data:**
- Passwords: Hashed using bcrypt (Supabase Auth)
- API keys: Encrypted in database
- Audit logs: Hash-chained for immutability

---

### Data Isolation

**Company Data Isolation:**
- RLS policies enforce company data boundaries
- Company users can only access their own company's data
- MOH users have system-wide access (based on role)

**Module Isolation:**
- Module activation checks in RLS policies
- Optional modules (ECS, CMC) hidden when inactive
- Cross-module queries logged and audited

---

## Security Controls

### Input Validation

**Client-Side Validation:**
- Form validation using React Hook Form + Zod
- Prevents invalid data submission
- User-friendly error messages

**Server-Side Validation:**
- RPC functions validate all inputs
- Database constraints enforce data integrity
- Business rule validation in application logic

**SQL Injection Prevention:**
- Parameterized queries (Supabase client)
- RPC functions use typed parameters
- No raw SQL string concatenation

---

### API Security

**Authentication:**
- All API endpoints require authentication
- JWT tokens validated on each request
- Token expiration enforced

**Authorization:**
- API endpoints check user permissions
- RLS policies enforce data access
- Role-based access control

**Rate Limiting:**
- Per-company rate limits
- Per-endpoint rate limits
- Per-user rate limits
- Prevents abuse and DoS attacks

**API Key Management:**
- API keys for external systems (ERP, customs)
- Keys stored encrypted in database
- Key rotation supported
- Key revocation supported

---

### Session Security

**Session Management:**
- Secure session storage (HTTP-only cookies or secure storage)
- Session timeout enforced
- Concurrent session limits (configurable)
- Session invalidation on security events

**Token Security:**
- JWT tokens signed with secret key
- Token expiration enforced
- Refresh token rotation
- Token revocation on logout

---

## Two-Person Rule

**Critical Actions Requiring Two-Person Rule:**
- Company suspension
- Company deletion
- Product deactivation (critical medicines)
- Product deletion

**Enforcement:**
- Application logic (not RLS)
- Tier 1 approval required
- Tier 2 Officer confirmation required
- Both approvals logged in audit trail
- Cannot be bypassed

---

## Security Monitoring

### Audit Logging

**Comprehensive Audit Trail:**
- All data changes logged
- All approvals logged
- All state transitions logged
- All system operations logged
- All cross-module queries logged

**Audit Log Details:**
- User ID
- Operation type
- Table name
- Record ID
- Old values (for updates/deletes)
- New values (for creates/updates)
- Reason/justification
- IP address
- User agent
- Timestamp

**Hash Chaining:**
- Each audit log entry includes hash of previous entry
- Ensures immutability
- Detects tampering

**Retention:**
- 7 years minimum (regulatory requirement)
- Archived after retention period
- Accessible for regulatory review

---

### Security Event Monitoring

**Monitored Events:**
- Failed login attempts
- Unauthorized access attempts
- Rate limit violations
- Suspicious activity patterns
- System errors

**Alerting:**
- Real-time alerts for critical security events
- Email notifications to security team
- In-app notifications for administrators
- Log aggregation and analysis

---

## Compliance & Regulatory Requirements

### MOH Regulatory Compliance

**Data Retention:**
- All operational data retained for 7 years minimum
- Audit logs retained for 7 years minimum
- Archived data accessible for regulatory review

**Audit Trail:**
- Complete audit trail of all system activities
- Immutable audit logs (hash-chained)
- Regulatory reporting capabilities

**Data Privacy:**
- Company data isolated (RLS)
- MOH oversight capabilities
- User access controls

---

## Security Best Practices

### Development

- Secure coding practices
- Input validation at all layers
- Parameterized queries
- No hardcoded secrets
- Environment variables for configuration
- Regular security reviews

### Deployment

- Secure deployment process
- Environment isolation (dev/staging/prod)
- Secrets management
- Secure configuration
- Regular security updates

### Operations

- Regular security audits
- Vulnerability scanning
- Penetration testing
- Incident response plan
- Security training for team

---

## Related Documents

- [RLS Policy Framework Design](rls-policy-framework.md) - RLS policy details
- [Audit Logging Specification](audit-logging-spec.md) - Audit logging details
- [Database Schema Design](../database/schema-design.md) - Database security
- [Regulatory Framework](../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference including Law No. 09-08 and Cloud Services Regulation
- [Compliance Requirements](../../03-governance/compliance-requirements.md) - Detailed compliance requirements including CNDP and cloud services compliance
- [Regulatory Policies](../../03-governance/regulatory-policies.md) - Regulatory policies and guidelines
- [Technical Decision Log](../../../06-development/technical-decisions/decision-log.md)

---

**Next Review Date:** [To be scheduled]  
**Owner:** Salim

