# Database Concurrency Control and Locking Strategy - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines the concurrency control and locking strategy to prevent race conditions, ensure data consistency, and handle concurrent operations.

**Last Updated:** 2025-12-31  
**Status:** ✅ Complete (Phase 0, Gap Resolution)  
**Owner:** Nadia (Data Modeler), Maya (Workflow/RPC Engineer)

## Overview

The PM platform implements a comprehensive concurrency control strategy using PostgreSQL's locking mechanisms to prevent race conditions, ensure data consistency, and handle concurrent operations safely.

## Concurrency Control Principles

1. **Minimize Locking:** Use locks only when necessary
2. **Short Lock Duration:** Hold locks for minimal time
3. **Consistent Lock Order:** Always acquire locks in same order
4. **Deadlock Prevention:** Prevent circular dependencies
5. **Performance:** Balance consistency with performance

## Lock Types

### 1. Row-Level Locks

**Purpose:** Lock specific rows during updates

**Types:**
- `FOR UPDATE` - Exclusive lock (prevents other updates)
- `FOR SHARE` - Shared lock (allows reads, prevents updates)
- `FOR NO KEY UPDATE` - Locks row but not foreign key references
- `FOR KEY SHARE` - Locks foreign key references

**Example:**
```sql
-- Lock row for update
SELECT * FROM companies WHERE id = company_id FOR UPDATE;

-- Update row (lock released after commit)
UPDATE companies SET name = 'New Name' WHERE id = company_id;
```

---

### 2. Table-Level Locks

**Purpose:** Lock entire table (rare, use with caution)

**Types:**
- `ACCESS SHARE` - Allows reads, prevents DDL
- `ROW SHARE` - Allows reads and SELECT FOR UPDATE
- `ROW EXCLUSIVE` - Allows INSERT, UPDATE, DELETE
- `SHARE UPDATE EXCLUSIVE` - Allows SELECT, INSERT, UPDATE, DELETE, prevents VACUUM
- `SHARE` - Prevents writes
- `SHARE ROW EXCLUSIVE` - Prevents most writes
- `EXCLUSIVE` - Prevents all writes
- `ACCESS EXCLUSIVE` - Prevents all access

**Example:**
```sql
-- Lock table (rare, usually not needed)
LOCK TABLE companies IN EXCLUSIVE MODE;
```

**Note:** Table locks are rarely needed. Use row-level locks instead.

---

### 3. Advisory Locks

**Purpose:** Application-level locking for business logic

**Types:**
- `pg_advisory_lock(key)` - Exclusive lock
- `pg_advisory_lock_shared(key)` - Shared lock
- `pg_try_advisory_lock(key)` - Try to acquire lock (non-blocking)

**Example:**
```sql
-- Use advisory lock for business logic
CREATE OR REPLACE FUNCTION process_submission(submission_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
  -- Acquire advisory lock
  PERFORM pg_advisory_lock(hashtext('submission_' || submission_id::text));
  
  BEGIN
    -- Process submission (only one process at a time)
    -- ...
    
    -- Release lock
    PERFORM pg_advisory_unlock(hashtext('submission_' || submission_id::text));
  EXCEPTION
    WHEN OTHERS THEN
      -- Release lock on error
      PERFORM pg_advisory_unlock(hashtext('submission_' || submission_id::text));
      RAISE;
  END;
  
  RETURN jsonb_build_object('success', true);
END;
$$;
```

---

## Locking Patterns

### Pattern 1: Optimistic Locking

**Purpose:** Detect concurrent modifications without locking

**Implementation:**
- Use version column (`version` or `updated_at`)
- Check version before update
- Fail if version changed

**Example:**
```sql
CREATE TABLE companies (
  id uuid PRIMARY KEY,
  name text,
  version integer DEFAULT 1,
  updated_at timestamptz DEFAULT now()
);

-- Update with version check
CREATE OR REPLACE FUNCTION update_company_optimistic(
  company_id uuid,
  new_name text,
  expected_version integer
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  current_version integer;
BEGIN
  -- Get current version
  SELECT version INTO current_version
  FROM companies
  WHERE id = company_id;
  
  -- Check version
  IF current_version != expected_version THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', jsonb_build_object(
        'code', 'CONCURRENT_MODIFICATION',
        'message', 'Record was modified by another user'
      )
    );
  END IF;
  
  -- Update with version increment
  UPDATE companies
  SET name = new_name,
      version = version + 1,
      updated_at = now()
  WHERE id = company_id
    AND version = expected_version;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', jsonb_build_object('code', 'CONCURRENT_MODIFICATION', 'message', 'Update failed')
    );
  END IF;
  
  RETURN jsonb_build_object('success', true);
END;
$$;
```

**Use Cases:**
- Low contention scenarios
- Read-heavy operations
- When conflicts are rare

---

### Pattern 2: Pessimistic Locking

**Purpose:** Prevent concurrent modifications by locking

**Implementation:**
- Use `SELECT FOR UPDATE` to lock row
- Hold lock during entire operation
- Release lock on commit

**Example:**
```sql
CREATE OR REPLACE FUNCTION update_company_pessimistic(
  company_id uuid,
  new_name text
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
  -- Lock row
  SELECT * FROM companies
  WHERE id = company_id
  FOR UPDATE;
  
  -- Update (lock held until commit)
  UPDATE companies
  SET name = new_name,
      updated_at = now()
  WHERE id = company_id;
  
  RETURN jsonb_build_object('success', true);
END;
$$;
```

**Use Cases:**
- High contention scenarios
- Critical operations
- When conflicts are common

---

### Pattern 3: Two-Phase Locking

**Purpose:** Ensure serializability

**Implementation:**
- Acquire all locks before processing
- Release locks after commit
- Consistent lock ordering

**Example:**
```sql
CREATE OR REPLACE FUNCTION transfer_product(
  from_company_id uuid,
  to_company_id uuid,
  product_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
  -- Phase 1: Acquire all locks (consistent order)
  SELECT * FROM companies WHERE id = from_company_id FOR UPDATE;
  SELECT * FROM companies WHERE id = to_company_id FOR UPDATE;
  SELECT * FROM products WHERE id = product_id FOR UPDATE;
  
  -- Phase 2: Perform operations
  UPDATE products
  SET company_id = to_company_id,
      updated_at = now()
  WHERE id = product_id
    AND company_id = from_company_id;
  
  -- Locks released on commit
  RETURN jsonb_build_object('success', true);
END;
$$;
```

---

## Race Condition Prevention

### Common Race Conditions

**1. Duplicate Entry:**
```sql
-- Problem: Two concurrent requests create duplicate
-- Solution: Use UNIQUE constraint + handle error

CREATE OR REPLACE FUNCTION create_company_safe(name text, reg_number text)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO companies (name, registration_number)
  VALUES (name, reg_number);
  
  RETURN jsonb_build_object('success', true);
EXCEPTION
  WHEN unique_violation THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', jsonb_build_object('code', 'DUPLICATE_ENTRY', 'message', 'Company already exists')
    );
END;
$$;
```

**2. Lost Update:**
```sql
-- Problem: Two concurrent updates overwrite each other
-- Solution: Use optimistic or pessimistic locking

-- Optimistic locking (see Pattern 1)
-- Pessimistic locking (see Pattern 2)
```

**3. Non-Repeatable Read:**
```sql
-- Problem: Value changes between reads
-- Solution: Use appropriate isolation level

SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
-- Read value (consistent snapshot)
```

---

## Lock Timeout

### Setting Lock Timeout

```sql
-- Set lock timeout (wait max 5 seconds for lock)
SET lock_timeout = '5s';

-- If lock not acquired, raise error
```

### Handling Lock Timeout

```sql
CREATE OR REPLACE FUNCTION operation_with_timeout()
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
  -- Set lock timeout
  SET LOCAL lock_timeout = '5s';
  
  BEGIN
    -- Try to acquire lock
    SELECT * FROM companies WHERE id = company_id FOR UPDATE;
    
    -- Perform operation
    -- ...
    
  EXCEPTION
    WHEN lock_not_available THEN
      RETURN jsonb_build_object(
        'success', false,
        'error', jsonb_build_object(
          'code', 'LOCK_TIMEOUT',
          'message', 'Could not acquire lock. Please try again.'
        )
      );
  END;
  
  RETURN jsonb_build_object('success', true);
END;
$$;
```

---

## Deadlock Prevention

### Consistent Lock Ordering

**Rule:** Always acquire locks in same order

**Example:**
```sql
-- Always lock companies before products
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

### Lock Hierarchy

**Define lock order:**
1. System tables (system_config, users)
2. Companies
3. Products
4. SKUs
5. Submissions (AAMS, MSQ, WSL)
6. Other tables

**Always acquire locks in this order.**

---

## Concurrent Update Handling

### Strategy 1: Last Write Wins

**Implementation:**
- No locking
- Last update wins
- Use `updated_at` timestamp

**Use Cases:**
- Low contention
- Non-critical data
- When conflicts are acceptable

---

### Strategy 2: First Write Wins

**Implementation:**
- Optimistic locking
- Check version before update
- Fail if modified

**Use Cases:**
- Medium contention
- Important data
- When conflicts should be detected

---

### Strategy 3: Pessimistic Locking

**Implementation:**
- Lock before update
- Prevent concurrent updates
- Hold lock during operation

**Use Cases:**
- High contention
- Critical operations
- When conflicts must be prevented

---

## Lock Monitoring

### View Active Locks

```sql
-- View all locks
SELECT 
  locktype,
  relation::regclass AS table_name,
  mode,
  granted,
  pid,
  usename
FROM pg_locks
WHERE relation IS NOT NULL
ORDER BY relation, mode;
```

### View Blocking Locks

```sql
-- View blocking locks
SELECT 
  blocked_locks.pid AS blocked_pid,
  blocking_locks.pid AS blocking_pid,
  blocked_activity.query AS blocked_query,
  blocking_activity.query AS blocking_query
FROM pg_locks blocked_locks
JOIN pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_locks blocking_locks ON 
  blocking_locks.locktype = blocked_locks.locktype
  AND blocking_locks.relation = blocked_locks.relation
  AND blocking_locks.mode = blocked_locks.mode
JOIN pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;
```

---

## Best Practices

### 1. Minimize Lock Duration

- Acquire locks as late as possible
- Release locks as early as possible
- Keep transactions short

### 2. Use Appropriate Lock Type

- Row-level locks (most cases)
- Table-level locks (rare)
- Advisory locks (application logic)

### 3. Consistent Lock Ordering

- Always acquire locks in same order
- Prevents deadlocks

### 4. Handle Lock Timeouts

- Set reasonable timeouts
- Handle timeout errors gracefully
- Retry with backoff

### 5. Monitor Locks

- Monitor for long-held locks
- Monitor for deadlocks
- Monitor for lock contention

---

## Concurrency Control Checklist

### For Each RPC Function:

- [ ] Locking strategy defined (optimistic/pessimistic)
- [ ] Lock order consistent
- [ ] Lock timeout set (if needed)
- [ ] Deadlock prevention implemented
- [ ] Race condition prevention implemented
- [ ] Error handling for lock failures
- [ ] Performance impact assessed

---

## Related Documents

- [Database Transaction Management Strategy](database-transaction-management-strategy.md) - Transaction details
- [RPC Function Specifications](../api/rpc-functions.md) - RPC function patterns
- [Database Schema Design](schema-design.md) - Schema details

---

**Next Review Date:** [To be scheduled]  
**Owner:** Nadia (Data Modeler), Maya (Workflow/RPC Engineer)

