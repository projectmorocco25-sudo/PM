# Database Triggers Specification - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines all database triggers, their purposes, and implementation specifications.

**Last Updated:** 2025-12-31  
**Status:** ✅ Complete (Phase 0, Gap Resolution)  
**Owner:** Nadia (Data Modeler), Salim (Security & Audit Engineer)

## Overview

Database triggers are used for automatic data integrity enforcement, audit logging, and business logic that must execute at database level. This document specifies all triggers, their purposes, and implementation details.

## Trigger Principles

1. **Minimal Business Logic:** Triggers for data integrity and audit, not complex business rules
2. **Performance:** Triggers must be efficient, no blocking operations
3. **Idempotent:** Triggers should be safe to re-execute
4. **Auditable:** All trigger actions logged in audit_logs
5. **Documented:** All triggers documented with purpose and behavior

## Trigger Categories

### 1. Audit Logging Triggers

**Purpose:** Automatically log all data changes to audit_logs table

**Implementation:** See [Audit Logging Specification](../security/audit-logging-spec.md)

**Pattern:**
```sql
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create audit log entry
  PERFORM create_audit_log(
    user_id := auth.uid(),
    operation_type := TG_OP,
    table_name := TG_TABLE_NAME,
    record_id := COALESCE(NEW.id, OLD.id),
    old_values := to_jsonb(OLD),
    new_values := to_jsonb(NEW),
    reason := NULL
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Apply to table
CREATE TRIGGER audit_trigger
AFTER INSERT OR UPDATE OR DELETE
ON companies
FOR EACH ROW
EXECUTE FUNCTION audit_trigger_function();
```

**Tables with Audit Triggers:**
- All tables with data changes (companies, products, skus, submissions, etc.)
- Excludes: audit_logs (to prevent recursion), system_config (separate logging)

---

### 2. Timestamp Triggers

**Purpose:** Automatically update `updated_at` timestamp on row updates

**Implementation:**
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- Apply to tables with updated_at column
CREATE TRIGGER update_companies_updated_at
BEFORE UPDATE
ON companies
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

**Tables with Timestamp Triggers:**
- All tables with `updated_at` column

---

### 3. Data Integrity Triggers

**Purpose:** Enforce data integrity rules that cannot be expressed as constraints

#### 3.1. Cascade Soft Delete

**Purpose:** When company is soft-deleted, soft-delete related records

**Implementation:**
```sql
CREATE OR REPLACE FUNCTION cascade_soft_delete_company()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Soft-delete products when company is soft-deleted
  IF NEW.is_active = false AND OLD.is_active = true THEN
    UPDATE products 
    SET is_active = false, updated_at = now()
    WHERE company_id = NEW.id AND is_active = true;
    
    -- Log cascade operation
    PERFORM create_audit_log(
      user_id := auth.uid(),
      operation_type := 'CASCADE_DELETE',
      table_name := 'products',
      record_id := NULL,
      old_values := NULL,
      new_values := jsonb_build_object('company_id', NEW.id, 'action', 'cascade_soft_delete'),
      reason := 'Company soft-deleted, cascading to products'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER cascade_soft_delete_company_trigger
AFTER UPDATE
ON companies
FOR EACH ROW
WHEN (NEW.is_active = false AND OLD.is_active = true)
EXECUTE FUNCTION cascade_soft_delete_company();
```

#### 3.2. Prevent Hard Delete of Critical Records

**Purpose:** Prevent hard deletion of records that must be preserved for regulatory compliance

**Implementation:**
```sql
CREATE OR REPLACE FUNCTION prevent_hard_delete_companies()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Prevent hard delete, require soft delete
  RAISE EXCEPTION 'Hard delete not allowed. Use soft delete (set is_active = false) instead.';
  
  RETURN NULL;
END;
$$;

CREATE TRIGGER prevent_hard_delete_companies_trigger
BEFORE DELETE
ON companies
FOR EACH ROW
EXECUTE FUNCTION prevent_hard_delete_companies();
```

**Tables with Hard Delete Prevention:**
- companies
- products
- skus
- aams_submissions
- msq_submissions
- wsl_submissions
- export_requests
- export_authorizations
- compliance_scores
- audit_logs (immutable)

---

### 4. Automatic Calculation Triggers

**Purpose:** Automatically calculate derived values

#### 4.1. Threshold Calculation

**Purpose:** Automatically calculate threshold when AAMS or B multiplier changes

**Implementation:**
```sql
CREATE OR REPLACE FUNCTION calculate_threshold_on_aams_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  calculated_threshold numeric;
BEGIN
  -- Calculate threshold: B × AAMS
  calculated_threshold := NEW.b_multiplier * NEW.aams_value;
  
  -- Update threshold
  UPDATE thresholds
  SET threshold_value = calculated_threshold,
      updated_at = now()
  WHERE sku_id = NEW.sku_id
    AND threshold_type = 'vci'
    AND is_current = true;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER calculate_threshold_on_aams_change_trigger
AFTER INSERT OR UPDATE OF aams_value, b_multiplier
ON aams_submissions
FOR EACH ROW
WHEN (NEW.status = 'approved')
EXECUTE FUNCTION calculate_threshold_on_aams_change();
```

---

### 5. State Transition Validation Triggers

**Purpose:** Validate state transitions at database level (additional safety)

**Implementation:**
```sql
CREATE OR REPLACE FUNCTION validate_status_transition()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Validate state transition (example: AAMS submission)
  -- Only allow valid transitions
  IF OLD.status = 'submitted' AND NEW.status NOT IN ('verified', 'rejected', 'draft') THEN
    RAISE EXCEPTION 'Invalid status transition from submitted to %', NEW.status;
  END IF;
  
  -- Note: Primary validation in RPC functions, this is additional safety
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_aams_status_transition
BEFORE UPDATE OF status
ON aams_submissions
FOR EACH ROW
EXECUTE FUNCTION validate_status_transition();
```

**Note:** Primary validation in RPC functions, triggers provide additional safety layer.

---

### 6. Notification Triggers

**Purpose:** Automatically create notifications for important events

**Implementation:**
```sql
CREATE OR REPLACE FUNCTION create_notification_on_breach()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  company_id_val uuid;
  tier2_officer_ids uuid[];
BEGIN
  -- Get company ID from SKU
  SELECT p.company_id INTO company_id_val
  FROM skus s
  JOIN products p ON s.product_id = p.id
  WHERE s.id = NEW.sku_id;
  
  -- Get Tier 2 Officer user IDs
  SELECT ARRAY_AGG(id) INTO tier2_officer_ids
  FROM users
  WHERE role = 'tier2_officer'
    AND company_id IS NULL; -- MOH users
  
  -- Create notifications for Tier 2 Officers
  FOREACH company_id_val IN ARRAY tier2_officer_ids
  LOOP
    PERFORM create_notification(
      user_id := company_id_val,
      type := 'breach_alert',
      title := 'Threshold Breach Detected',
      message := format('SKU %s has breached threshold', NEW.sku_id),
      link := format('/vci/breaches/%s', NEW.id)
    );
  END LOOP;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER create_notification_on_breach_trigger
AFTER INSERT
ON breaches
FOR EACH ROW
EXECUTE FUNCTION create_notification_on_breach();
```

---

## Trigger Execution Order

**Order of Execution:**
1. **BEFORE triggers** (validation, data transformation)
2. **Constraint checks** (NOT NULL, CHECK, FOREIGN KEY)
3. **Row operation** (INSERT, UPDATE, DELETE)
4. **AFTER triggers** (audit logging, notifications, calculations)

**Best Practice:** Use BEFORE triggers for validation, AFTER triggers for side effects (logging, notifications).

---

## Trigger Performance Considerations

### 1. Minimize Trigger Logic

- Keep trigger functions simple and fast
- Avoid complex queries in triggers
- Use indexes for trigger queries

### 2. Avoid Recursive Triggers

- Triggers should not trigger other triggers (except audit)
- Audit triggers are exception (must not trigger audit)

### 3. Batch Operations

- Triggers execute per row
- For bulk operations, consider RPC functions instead

### 4. Index Usage

- Ensure triggers use indexed columns
- Add indexes if trigger queries are slow

---

## Trigger Maintenance

### Adding New Triggers

1. **Document Purpose:** Clearly document what trigger does
2. **Test Thoroughly:** Test with various scenarios
3. **Performance Test:** Ensure trigger doesn't impact performance
4. **Migration:** Add trigger via migration file
5. **Monitor:** Monitor trigger execution in production

### Removing Triggers

1. **Assess Impact:** Understand what trigger does
2. **Migration:** Remove via migration file
3. **Verify:** Ensure system still works correctly

---

## Trigger Checklist

### For Each Trigger:

- [ ] Purpose clearly documented
- [ ] Trigger function tested
- [ ] Performance impact assessed
- [ ] Error handling implemented
- [ ] Audit logging (if applicable)
- [ ] Migration file created
- [ ] Rollback procedure defined

---

## Related Documents

- [Database Schema Design](schema-design.md) - Table definitions
- [Audit Logging Specification](../security/audit-logging-spec.md) - Audit triggers
- [RPC Function Specifications](../api/rpc-functions.md) - Business logic (preferred over triggers)
- [Regulatory Framework](../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference
- [Compliance Requirements](../../../03-governance/compliance-requirements.md) - Detailed compliance requirements
- [Regulatory Policies](../../../03-governance/regulatory-policies.md) - Regulatory policies and guidelines

---

**Next Review Date:** [To be scheduled]  
**Owner:** Nadia (Data Modeler), Salim (Security & Audit Engineer)

