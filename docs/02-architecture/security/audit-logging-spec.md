# Audit Logging Specification - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines the comprehensive audit logging specification, including hash chaining, immutability, and regulatory compliance requirements.

**Last Updated:** 2025-12-31  
**Status:** ✅ Complete (Phase 0, Week 4)  
**Owner:** Salim

## Overview

The PM platform implements a comprehensive audit logging system with hash chaining to ensure immutability and regulatory compliance. All system activities are logged with complete details for audit and regulatory review.

## Audit Logging Principles

1. **Comprehensive Coverage:** All data changes, approvals, state transitions, and system operations logged
2. **Immutability:** Hash chaining ensures audit logs cannot be tampered with
3. **Regulatory Compliance:** Meets MOH regulatory requirements (7-year retention per [Regulatory Framework](../../03-governance/regulatory-framework.md) and [Compliance Requirements](../../03-governance/compliance-requirements.md))
4. **Complete Details:** Full context for each operation (who, what, when, why, how)
5. **Queryable:** Easy to query and analyze audit logs
6. **Performance:** Efficient logging without impacting system performance

## Audit Log Table Schema

### audit_logs Table

**Schema:**
```sql
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  previous_hash text,  -- Hash of previous audit log entry
  current_hash text NOT NULL,  -- Hash of this entry
  user_id uuid REFERENCES users(id),  -- NULL for system operations
  operation_type text NOT NULL,  -- create, update, delete, approve, reject, etc.
  table_name text NOT NULL,  -- Table where operation occurred
  record_id uuid,  -- ID of affected record
  old_values jsonb,  -- Old values (for updates/deletes)
  new_values jsonb,  -- New values (for creates/updates)
  reason text,  -- Reason/justification (mandatory for certain operations)
  ip_address inet,  -- Client IP address
  user_agent text,  -- Client user agent string
  created_at timestamptz DEFAULT now() NOT NULL  -- Immutable timestamp
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_operation_type ON audit_logs(operation_type);
```

---

## Hash Chaining

### Hash Chain Implementation

**Purpose:** Ensure immutability of audit logs

**Method:**
1. Each audit log entry includes hash of previous entry
2. Hash calculated from: previous_hash + current_entry_data
3. First entry has `previous_hash = NULL`
4. Subsequent entries include hash of previous entry

**Hash Algorithm:** SHA-256

**Hash Calculation:**
```sql
-- Hash calculation function
CREATE OR REPLACE FUNCTION calculate_audit_hash(
  previous_hash text,
  entry_data jsonb
) RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT encode(
    digest(
      COALESCE(previous_hash, '') || entry_data::text,
      'sha256'
    ),
    'hex'
  );
$$;
```

**Example:**
```
Entry 1: previous_hash = NULL, current_hash = hash1
Entry 2: previous_hash = hash1, current_hash = hash2 (hash of hash1 + entry2_data)
Entry 3: previous_hash = hash2, current_hash = hash3 (hash of hash2 + entry3_data)
```

**Tampering Detection:**
- If any entry is modified, its hash changes
- Subsequent entries' hashes become invalid
- Chain breaks, tampering detected

---

## What to Audit

### Data Changes

**All CRUD Operations:**
- CREATE: New records created
- UPDATE: Records updated (old and new values)
- DELETE: Records deleted (old values preserved)
- Soft deletes: Status changes logged

**Tables Audited:**
- All RMM tables (companies, products, skus, etc.)
- All VCI tables (aams_submissions, msq_submissions, wsl_submissions, etc.)
- All ECS tables (export_requests, export_authorizations, etc.)
- All CMC tables (compliance_scores, disputes, etc.)
- System tables (users, system_config, etc.)

---

### Approvals

**All Approval Operations:**
- Registry submission approvals
- AAMS threshold approvals
- Export request approvals
- Compliance score approvals
- Dispute resolutions

**Details Logged:**
- Approver ID
- Approval type (verify, approve, implement, reject)
- From status
- To status
- Comments
- Timestamp

---

### Threshold Operations

**All Threshold Modification and Reversion Operations:**
- `threshold_temporary_created` - Temporary threshold created
- `threshold_permanent_created` - Permanent threshold modification created
- `threshold_reversion_scheduled` - Reversion scheduled (temporary threshold created)
- `threshold_reversion_auto_executed` - Automatic reversion executed on revert_date
- `threshold_reversion_manual_confirmed` - Manual reversion confirmed by Tier 1
- `threshold_reversion_cancelled` - Reversion cancelled (manual review type)
- `threshold_reversion_early` - Early manual reversion (before revert_date)
- `threshold_reversion_notification_sent` - Reversion notification sent (7-day, 1-day, or on reversion)

**Details Logged:**
- User ID (Tier 1 for modifications, system for auto-reversions)
- Operation type (see above)
- Threshold ID (old and new)
- Modification type (permanent, temporary_auto_revert, temporary_manual_review)
- Scope (local/global)
- Old threshold values (multiplier, threshold_value)
- New threshold values (multiplier, threshold_value)
- Revert date (if temporary)
- Revert to values (multiplier, threshold_value) (if temporary)
- Justification text (mandatory for modifications)
- Confirmation justification (for manual confirmations)
- Notification type (7-day warning, 1-day warning, reversion, review required)
- Notification recipient user ID
- Timestamp

---

### State Transitions

**All Workflow State Changes:**
- Status transitions in all workflows
- Workflow progression
- Rejections and cancellations

**Details Logged:**
- Entity ID
- Previous status
- New status
- Transition reason
- User who triggered transition

---

### System Operations

**All System Operations:**
- Scheduled job executions
- Background processing
- Cross-module queries
- Service role operations

**Details Logged:**
- Operation type
- Data accessed
- Reason for operation
- Timestamp
- User ID (NULL for system operations)

---

### Security Events

**All Security-Relevant Events:**
- Login attempts (successful and failed)
- Password changes
- Session creation/termination
- Authorization failures
- Rate limit violations
- Suspicious activity

**Details Logged:**
- Event type
- User ID
- IP address
- User agent
- Success/failure
- Reason (if failure)

---

## Audit Log Creation

### RPC Function: create_audit_log()

**Function Signature:**
```sql
CREATE OR REPLACE FUNCTION create_audit_log(
  p_user_id uuid,
  p_operation_type text,
  p_table_name text,
  p_record_id uuid,
  p_old_values jsonb DEFAULT NULL,
  p_new_values jsonb DEFAULT NULL,
  p_reason text DEFAULT NULL,
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_previous_hash text;
  v_entry_data jsonb;
  v_current_hash text;
  v_audit_log_id uuid;
BEGIN
  -- Get previous hash (from last audit log entry)
  SELECT current_hash INTO v_previous_hash
  FROM audit_logs
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Build entry data
  v_entry_data := jsonb_build_object(
    'user_id', p_user_id,
    'operation_type', p_operation_type,
    'table_name', p_table_name,
    'record_id', p_record_id,
    'old_values', p_old_values,
    'new_values', p_new_values,
    'reason', p_reason,
    'ip_address', p_ip_address,
    'user_agent', p_user_agent,
    'timestamp', now()
  );
  
  -- Calculate hash
  v_current_hash := calculate_audit_hash(v_previous_hash, v_entry_data);
  
  -- Insert audit log entry
  INSERT INTO audit_logs (
    previous_hash,
    current_hash,
    user_id,
    operation_type,
    table_name,
    record_id,
    old_values,
    new_values,
    reason,
    ip_address,
    user_agent
  ) VALUES (
    v_previous_hash,
    v_current_hash,
    p_user_id,
    p_operation_type,
    p_table_name,
    p_record_id,
    p_old_values,
    p_new_values,
    p_reason,
    p_ip_address,
    p_user_agent
  ) RETURNING id INTO v_audit_log_id;
  
  RETURN v_audit_log_id;
END;
$$;
```

---

### Automatic Audit Logging

**Database Triggers:**
- Triggers on all audited tables
- Automatically log CREATE, UPDATE, DELETE operations
- Capture old and new values

**Example Trigger:**
```sql
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM create_audit_log(
      auth.uid(),
      'create',
      TG_TABLE_NAME,
      NEW.id,
      NULL,
      row_to_json(NEW)::jsonb,
      NULL,
      NULL,
      NULL
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM create_audit_log(
      auth.uid(),
      'update',
      TG_TABLE_NAME,
      NEW.id,
      row_to_json(OLD)::jsonb,
      row_to_json(NEW)::jsonb,
      NULL,
      NULL,
      NULL
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM create_audit_log(
      auth.uid(),
      'delete',
      TG_TABLE_NAME,
      OLD.id,
      row_to_json(OLD)::jsonb,
      NULL,
      NULL,
      NULL,
      NULL
    );
    RETURN OLD;
  END IF;
END;
$$;

-- Apply trigger to table
CREATE TRIGGER audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON {table_name}
FOR EACH ROW
EXECUTE FUNCTION audit_trigger_function();
```

---

## Audit Log Queries

### Query Audit Logs by User

```sql
SELECT *
FROM audit_logs
WHERE user_id = 'uuid'
ORDER BY created_at DESC;
```

### Query Audit Logs by Table

```sql
SELECT *
FROM audit_logs
WHERE table_name = 'companies'
ORDER BY created_at DESC;
```

### Query Audit Logs by Operation Type

```sql
SELECT *
FROM audit_logs
WHERE operation_type = 'approve'
ORDER BY created_at DESC;
```

### Query Audit Logs by Date Range

```sql
SELECT *
FROM audit_logs
WHERE created_at >= '2025-01-01'
  AND created_at < '2025-02-01'
ORDER BY created_at DESC;
```

### Query Audit Logs for Record

```sql
SELECT *
FROM audit_logs
WHERE table_name = 'companies'
  AND record_id = 'uuid'
ORDER BY created_at DESC;
```

---

## Hash Chain Verification

### Verify Hash Chain Integrity

**Function:**
```sql
CREATE OR REPLACE FUNCTION verify_audit_chain()
RETURNS TABLE (
  entry_id uuid,
  is_valid boolean,
  error_message text
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_prev_hash text;
  v_calc_hash text;
  v_entry audit_logs%ROWTYPE;
BEGIN
  FOR v_entry IN
    SELECT * FROM audit_logs ORDER BY created_at
  LOOP
    -- Calculate expected hash
    v_calc_hash := calculate_audit_hash(
      v_prev_hash,
      jsonb_build_object(
        'user_id', v_entry.user_id,
        'operation_type', v_entry.operation_type,
        'table_name', v_entry.table_name,
        'record_id', v_entry.record_id,
        'old_values', v_entry.old_values,
        'new_values', v_entry.new_values,
        'reason', v_entry.reason,
        'ip_address', v_entry.ip_address,
        'user_agent', v_entry.user_agent,
        'timestamp', v_entry.created_at
      )
    );
    
    -- Check if hash matches
    IF v_entry.current_hash != v_calc_hash THEN
      RETURN QUERY SELECT
        v_entry.id,
        false,
        'Hash mismatch detected';
    ELSE
      RETURN QUERY SELECT
        v_entry.id,
        true,
        NULL;
    END IF;
    
    v_prev_hash := v_entry.current_hash;
  END LOOP;
END;
$$;
```

**Usage:**
```sql
SELECT * FROM verify_audit_chain() WHERE is_valid = false;
```

---

## Data Retention

### Retention Policy

**Regulatory Requirement:** 7 years minimum

**Retention Period:**
- Active audit logs: 7 years from creation
- Archived audit logs: Indefinite (accessible for regulatory review)

**Archival Process:**
- Audit logs older than 7 years archived
- Archived logs moved to separate storage
- Archived logs remain queryable
- Original audit logs retained for chain integrity

---

## Performance Considerations

### Indexing Strategy

**Indexes:**
- `idx_audit_logs_user_id` - Fast user-based queries
- `idx_audit_logs_table_name` - Fast table-based queries
- `idx_audit_logs_created_at` - Fast date range queries
- `idx_audit_logs_operation_type` - Fast operation type queries
- Composite index: `(table_name, record_id, created_at)` - Fast record history queries

### Partitioning (Future)

**Consideration:** Partition by date for large audit log tables

**Benefits:**
- Faster queries on recent data
- Easier archival of old data
- Better performance for large datasets

---

## Regulatory Reporting

### Audit Log Reports

**Report Types:**
- User activity report
- Data change report
- Approval history report
- Security event report
- Compliance audit report

**Report Format:**
- CSV export
- PDF export
- JSON export
- Custom format (if required)

**Report Access:**
- MOH Tier 1: Full access
- MOH Tier 2: Limited access
- Auditors: Read-only access

---

## Related Documents

- [Security Architecture](security-architecture.md) - Security overview
- [RLS Policy Framework Design](rls-policy-framework.md) - RLS details
- [Database Schema Design](../database/schema-design.md) - Database schema
- [Regulatory Framework](../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference including Law No. 09-08 and data retention requirements
- [Compliance Requirements](../../03-governance/compliance-requirements.md) - Detailed compliance requirements including CNDP and data retention
- [Regulatory Policies](../../03-governance/regulatory-policies.md) - Regulatory policies and guidelines
- [Technical Decision Log](../../../06-development/technical-decisions/decision-log.md)

---

**Next Review Date:** [To be scheduled]  
**Owner:** Salim

