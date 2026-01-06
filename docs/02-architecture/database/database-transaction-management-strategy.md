# Database Transaction Management Strategy - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines the database transaction management strategy, including isolation levels, deadlock prevention, and rollback strategies.

**Last Updated:** 2025-12-31  
**Status:** ✅ Complete (Phase 0, Gap Resolution)  
**Owner:** Nadia (Data Modeler), Maya (Workflow/RPC Engineer)

## Overview

The PM platform implements a comprehensive transaction management strategy to ensure data consistency, handle concurrency, and prevent data corruption across all database operations.

## Transaction Principles

1. **ACID Compliance:** All transactions follow ACID principles
2. **Consistency:** Data always in consistent state
3. **Isolation:** Transactions isolated from each other
4. **Durability:** Committed transactions persist
5. **Atomicity:** All or nothing (rollback on error)

## Transaction Isolation Levels

### Default Isolation Level

**PostgreSQL Default:** `READ COMMITTED`

**Why:**
- Balance between consistency and performance
- Prevents dirty reads
- Allows non-repeatable reads (acceptable for most operations)
- Good performance

**Usage:**
- Default for all RPC functions
- Suitable for most operations

---

### Isolation Level: READ COMMITTED

**Characteristics:**
- Prevents dirty reads
- Allows non-repeatable reads
- Allows phantom reads
- Good performance

**Use Cases:**
- Standard CRUD operations
- Most RPC functions
- Read operations

**Example:**
```sql
-- Default isolation (READ COMMITTED)
CREATE OR REPLACE FUNCTION rmm_create_company(name text)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
  -- Transaction automatically uses READ COMMITTED
  INSERT INTO companies (name) VALUES (rmm_create_company.name);
  RETURN jsonb_build_object('success', true);
END;
$$;
```

---

### Isolation Level: REPEATABLE READ

**Characteristics:**
- Prevents dirty reads
- Prevents non-repeatable reads
- Allows phantom reads
- Better consistency, slightly lower performance

**Use Cases:**
- Financial calculations
- Compliance score calculations
- Reports that require consistent snapshot

**Example:**
```sql
-- Use REPEATABLE READ for calculations
CREATE OR REPLACE FUNCTION cmc_calculate_compliance_score(company_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
  -- Set isolation level
  SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
  
  -- Calculate score (consistent snapshot)
  -- ... calculation logic ...
  
  RETURN jsonb_build_object('success', true);
END;
$$;
```

---

### Isolation Level: SERIALIZABLE

**Characteristics:**
- Prevents dirty reads
- Prevents non-repeatable reads
- Prevents phantom reads
- Highest consistency, lowest performance

**Use Cases:**
- Critical financial operations
- Two-person rule enforcement
- Operations requiring absolute consistency

**Example:**
```sql
-- Use SERIALIZABLE for critical operations
CREATE OR REPLACE FUNCTION enforce_two_person_rule(action_id uuid, approver_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
  -- Set isolation level
  SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
  
  -- Check if already approved
  IF EXISTS (SELECT 1 FROM approvals WHERE action_id = enforce_two_person_rule.action_id) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', jsonb_build_object('code', 'ALREADY_APPROVED', 'message', 'Action already approved')
    );
  END IF;
  
  -- Create approval
  INSERT INTO approvals (action_id, approver_id) VALUES (enforce_two_person_rule.action_id, approver_id);
  
  RETURN jsonb_build_object('success', true);
END;
$$;
```

---

## Transaction Patterns

### Pattern 1: Simple Transaction

**Use Case:** Single table operation

**Example:**
```sql
CREATE OR REPLACE FUNCTION rmm_create_company(name text)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  company_id uuid;
BEGIN
  -- Single INSERT (automatic transaction)
  INSERT INTO companies (name)
  VALUES (rmm_create_company.name)
  RETURNING id INTO company_id;
  
  RETURN jsonb_build_object('success', true, 'data', jsonb_build_object('id', company_id));
END;
$$;
```

---

### Pattern 2: Multi-Table Transaction

**Use Case:** Multiple related operations

**Example:**
```sql
CREATE OR REPLACE FUNCTION rmm_create_company_with_product(
  company_name text,
  product_name text
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  company_id uuid;
  product_id uuid;
BEGIN
  -- Start transaction (implicit)
  
  -- 1. Create company
  INSERT INTO companies (name)
  VALUES (company_name)
  RETURNING id INTO company_id;
  
  -- 2. Create product
  INSERT INTO products (company_id, name)
  VALUES (company_id, product_name)
  RETURNING id INTO product_id;
  
  -- 3. Create audit log
  PERFORM create_audit_log(
    user_id := auth.uid(),
    operation_type := 'CREATE',
    table_name := 'companies',
    record_id := company_id,
    new_values := jsonb_build_object('name', company_name)
  );
  
  -- Commit (automatic on success)
  RETURN jsonb_build_object('success', true, 'data', jsonb_build_object('company_id', company_id, 'product_id', product_id));
  
  -- Rollback on error (automatic)
EXCEPTION
  WHEN OTHERS THEN
    -- Rollback automatic, return error
    RETURN jsonb_build_object(
      'success', false,
      'error', jsonb_build_object('code', 'SYSTEM_ERROR', 'message', 'An error occurred')
    );
END;
$$;
```

---

### Pattern 3: Explicit Transaction Control

**Use Case:** Complex operations requiring explicit control

**Example:**
```sql
CREATE OR REPLACE FUNCTION complex_operation()
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  savepoint_name text := 'sp_' || gen_random_uuid()::text;
BEGIN
  -- Start transaction (implicit)
  
  -- Create savepoint
  SAVEPOINT savepoint_name;
  
  BEGIN
    -- Operation 1
    -- ...
    
    -- Operation 2
    -- ...
    
    -- If all successful, release savepoint
    RELEASE SAVEPOINT savepoint_name;
    
  EXCEPTION
    WHEN OTHERS THEN
      -- Rollback to savepoint
      ROLLBACK TO SAVEPOINT savepoint_name;
      
      -- Try alternative operation
      -- ...
      
      -- If alternative fails, rollback entire transaction
      RAISE;
  END;
  
  RETURN jsonb_build_object('success', true);
END;
$$;
```

---

## Deadlock Prevention

### Deadlock Causes

1. **Circular Dependencies:** Transaction A locks resource 1, Transaction B locks resource 2, then both try to lock the other's resource
2. **Lock Ordering:** Transactions acquire locks in different orders
3. **Long Transactions:** Transactions holding locks for extended periods

### Prevention Strategies

**1. Consistent Lock Ordering:**
```sql
-- Always acquire locks in same order
-- Example: Always lock companies before products
CREATE OR REPLACE FUNCTION update_company_and_product(
  company_id uuid,
  product_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
  -- Lock company first (consistent order)
  SELECT * FROM companies WHERE id = company_id FOR UPDATE;
  
  -- Then lock product
  SELECT * FROM products WHERE id = product_id FOR UPDATE;
  
  -- Perform updates
  -- ...
  
  RETURN jsonb_build_object('success', true);
END;
$$;
```

**2. Short Transactions:**
- Keep transactions as short as possible
- Perform validation before transaction
- Minimize lock duration

**3. Lock Timeout:**
```sql
-- Set lock timeout
SET lock_timeout = '5s';

-- If lock not acquired within 5 seconds, raise error
```

**4. Deadlock Detection:**
- PostgreSQL automatically detects deadlocks
- One transaction rolled back automatically
- Application should retry

**Retry Pattern:**
```sql
CREATE OR REPLACE FUNCTION retry_on_deadlock(func_name text, max_retries integer DEFAULT 3)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  result jsonb;
  retry_count integer := 0;
BEGIN
  LOOP
    BEGIN
      -- Execute function
      EXECUTE 'SELECT ' || func_name || '()' INTO result;
      RETURN result;
    EXCEPTION
      WHEN deadlock_detected THEN
        retry_count := retry_count + 1;
        IF retry_count >= max_retries THEN
          RAISE;
        END IF;
        -- Wait random time before retry
        PERFORM pg_sleep(random() * 0.1);
    END;
  END LOOP;
END;
$$;
```

---

## Rollback Strategies

### Automatic Rollback

**PostgreSQL automatically rolls back on error:**
```sql
CREATE OR REPLACE FUNCTION example_function()
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
  -- If any error occurs, transaction automatically rolls back
  INSERT INTO table1 VALUES (...);
  INSERT INTO table2 VALUES (...);
  
  -- If error here, both inserts rolled back
  RETURN jsonb_build_object('success', true);
EXCEPTION
  WHEN OTHERS THEN
    -- Transaction already rolled back
    RETURN jsonb_build_object('success', false, 'error', ...);
END;
$$;
```

### Explicit Rollback

**Use ROLLBACK for explicit control:**
```sql
CREATE OR REPLACE FUNCTION conditional_operation()
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check condition
  IF some_condition THEN
    -- Explicit rollback
    ROLLBACK;
    RETURN jsonb_build_object('success', false, 'error', ...);
  END IF;
  
  -- Continue with operation
  -- ...
END;
$$;
```

---

## Transaction Timeout

### Setting Timeout

```sql
-- Set statement timeout (per transaction)
SET statement_timeout = '30s';

-- Set lock timeout
SET lock_timeout = '5s';

-- Set idle in transaction timeout
SET idle_in_transaction_session_timeout = '10min';
```

### Best Practices

- Set reasonable timeouts
- Monitor for timeout errors
- Optimize slow queries
- Keep transactions short

---

## Transaction Monitoring

### Monitoring Queries

```sql
-- View active transactions
SELECT 
  pid,
  usename,
  application_name,
  state,
  query_start,
  state_change,
  wait_event_type,
  wait_event,
  query
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY query_start;
```

### Monitoring Locks

```sql
-- View locks
SELECT 
  locktype,
  relation::regclass,
  mode,
  granted,
  pid
FROM pg_locks
WHERE NOT granted;
```

---

## Transaction Best Practices

### 1. Keep Transactions Short

- Minimize lock duration
- Reduce deadlock risk
- Better performance

### 2. Use Appropriate Isolation Level

- READ COMMITTED for most operations
- REPEATABLE READ for calculations
- SERIALIZABLE for critical operations

### 3. Consistent Lock Ordering

- Always acquire locks in same order
- Prevents deadlocks

### 4. Handle Errors Gracefully

- Use EXCEPTION blocks
- Return proper error responses
- Log errors

### 5. Monitor Transactions

- Monitor for long transactions
- Monitor for deadlocks
- Monitor for lock contention

---

## Transaction Checklist

### For Each RPC Function:

- [ ] Appropriate isolation level set (if needed)
- [ ] Transaction kept short
- [ ] Error handling implemented
- [ ] Locks acquired in consistent order
- [ ] Timeout set (if needed)
- [ ] Rollback strategy defined

---

## Related Documents

- [Concurrency Control and Locking Strategy](database-concurrency-control-strategy.md) - Locking details
- [RPC Function Specifications](../api/rpc-functions.md) - RPC function patterns
- [Database Schema Design](schema-design.md) - Schema details
- [Regulatory Framework](../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference
- [Compliance Requirements](../../../03-governance/compliance-requirements.md) - Detailed compliance requirements
- [Regulatory Policies](../../../03-governance/regulatory-policies.md) - Regulatory policies and guidelines

---

**Next Review Date:** [To be scheduled]  
**Owner:** Nadia (Data Modeler), Maya (Workflow/RPC Engineer)

