# RLS Policy Framework Design - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines the Row Level Security (RLS) policy framework for all database tables, ensuring data isolation and access control.

**Last Updated:** 2025-12-31  
**Status:** ✅ Complete (Phase 0, Week 2)  
**Owner:** Rafi

## Overview

The PM platform uses PostgreSQL Row Level Security (RLS) to enforce data access control at the database level. This provides defense in depth and ensures that company users can only access their own company's data, while MOH users have system-wide access based on their roles.

## RLS Policy Strategy

### Core Principles

1. **RLS Enabled on All Sensitive Tables:** All tables containing sensitive data have RLS enabled
2. **Additive Policies:** Policies are additive (if any policy allows access, user can access)
3. **Company Data Isolation:** Company users can only see their own company's data
4. **MOH System-Wide Access:** MOH users have system-wide access based on role
5. **Module Activation Checks:** Policies check module activation status
6. **Performance Optimized:** Policies use efficient queries and indexes

### Policy Patterns

#### Pattern 1: Company Users (Isolated Access)

**Use Case:** Company users can only see their own company's data

**Policy Pattern:**
```sql
CREATE POLICY "company_users_see_own_data"
ON {table_name} FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  )
);
```

**Example: Products Table**
```sql
CREATE POLICY "company_users_see_own_products"
ON products FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  )
);
```

**Notes:**
- Assumes table has `company_id` column
- Works for direct company-owned entities (products, submissions, etc.)
- For entities linked via relationships, use JOIN in policy

---

#### Pattern 2: MOH Users (System-Wide Access)

**Use Case:** MOH users can see all companies' data

**Policy Pattern:**
```sql
CREATE POLICY "moh_users_see_all_data"
ON {table_name} FOR SELECT
USING (
  (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
);
```

**Example: Products Table**
```sql
CREATE POLICY "moh_users_see_all_products"
ON products FOR SELECT
USING (
  (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
);
```

**Notes:**
- MOH users have `company_id = NULL`
- Policy checks for NULL to identify MOH users
- Access level depends on role (handled by application logic)

---

#### Pattern 3: Module Activation Check

**Use Case:** Policies check if module is active before allowing access

**Policy Pattern:**
```sql
CREATE POLICY "users_see_data_if_module_active"
ON {table_name} FOR SELECT
USING (
  (SELECT is_active FROM system_config WHERE module_name = '{module_name}') = true
  AND (
    -- Company user sees own company's data
    company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
    OR
    -- MOH user sees all data
    (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
  )
);
```

**Example: Export Requests Table (ECS Module)**
```sql
CREATE POLICY "users_see_exports_if_ecs_active"
ON export_requests FOR SELECT
USING (
  (SELECT is_active FROM system_config WHERE module_name = 'ecs') = true
  AND (
    company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
    OR
    (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
  )
);
```

**Notes:**
- Checks `system_config` table for module activation
- Only applies to optional modules (ECS, CMC)
- RMM and VCI are always active (core modules)

---

#### Pattern 4: Relationship-Based Access (JOIN)

**Use Case:** Access control based on relationships (e.g., SKUs via Products)

**Policy Pattern:**
```sql
CREATE POLICY "company_users_see_own_skus"
ON skus FOR SELECT
USING (
  product_id IN (
    SELECT id FROM products
    WHERE company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  )
);
```

**Example: SKUs Table**
```sql
CREATE POLICY "company_users_see_own_skus"
ON skus FOR SELECT
USING (
  product_id IN (
    SELECT id FROM products
    WHERE company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  )
);
```

**Notes:**
- Uses JOIN to traverse relationships
- More complex but necessary for nested entities
- Performance: Ensure indexes on foreign keys

---

#### Pattern 5: User-Owned Data

**Use Case:** Users can see their own records (e.g., notifications)

**Policy Pattern:**
```sql
CREATE POLICY "users_see_own_notifications"
ON notifications FOR SELECT
USING (user_id = auth.uid());
```

**Example: Notifications Table**
```sql
CREATE POLICY "users_see_own_notifications"
ON notifications FOR SELECT
USING (user_id = auth.uid());
```

**Notes:**
- Direct user ownership
- Simple policy (no company relationship)

---

## Table-Specific RLS Policies

### Core Tables

#### users
```sql
-- Users can see their own record
CREATE POLICY "users_see_own_record"
ON users FOR SELECT
USING (id = auth.uid());

-- MOH users can see all users
CREATE POLICY "moh_users_see_all_users"
ON users FOR SELECT
USING (
  (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
);
```

#### system_config
```sql
-- All authenticated users can see system config
CREATE POLICY "users_see_system_config"
ON system_config FOR SELECT
USING (auth.role() = 'authenticated');
```

#### notifications
```sql
-- Users can see their own notifications
CREATE POLICY "users_see_own_notifications"
ON notifications FOR SELECT
USING (user_id = auth.uid());
```

#### audit_logs
```sql
-- MOH users can see all audit logs
CREATE POLICY "moh_users_see_all_audit_logs"
ON audit_logs FOR SELECT
USING (
  (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
);

-- Company users can see their own company's audit logs
CREATE POLICY "company_users_see_own_audit_logs"
ON audit_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND company_id IN (
      SELECT company_id FROM {related_table}
      WHERE id = audit_logs.record_id
    )
  )
);
```

---

### RMM Module Tables

#### companies
```sql
-- Company users can see their own company
CREATE POLICY "company_users_see_own_company"
ON companies FOR SELECT
USING (
  id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  )
);

-- MOH users can see all companies
CREATE POLICY "moh_users_see_all_companies"
ON companies FOR SELECT
USING (
  (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
);
```

#### products
```sql
-- Company users can see their own company's products
CREATE POLICY "company_users_see_own_products"
ON products FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  )
);

-- MOH users can see all products
CREATE POLICY "moh_users_see_all_products"
ON products FOR SELECT
USING (
  (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
);
```

#### skus
```sql
-- Company users can see their own company's SKUs
CREATE POLICY "company_users_see_own_skus"
ON skus FOR SELECT
USING (
  product_id IN (
    SELECT id FROM products
    WHERE company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  )
);

-- MOH users can see all SKUs
CREATE POLICY "moh_users_see_all_skus"
ON skus FOR SELECT
USING (
  (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
);
```

#### atc_codes
```sql
-- All authenticated users can see ATC codes (read-only)
CREATE POLICY "users_see_atc_codes"
ON atc_codes FOR SELECT
USING (auth.role() = 'authenticated');
```

#### critical_medicines
```sql
-- All authenticated users can see critical medicines (read-only)
CREATE POLICY "users_see_critical_medicines"
ON critical_medicines FOR SELECT
USING (auth.role() = 'authenticated');
```

---

### VCI Module Tables

#### aams_submissions
```sql
-- Company users can see their own company's AAMS submissions
CREATE POLICY "company_users_see_own_aams"
ON aams_submissions FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  )
);

-- MOH users can see all AAMS submissions
CREATE POLICY "moh_users_see_all_aams"
ON aams_submissions FOR SELECT
USING (
  (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
);
```

#### msq_submissions
```sql
-- Company users can see their own company's MSQ submissions
CREATE POLICY "company_users_see_own_msq"
ON msq_submissions FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  )
);

-- MOH users can see all MSQ submissions
CREATE POLICY "moh_users_see_all_msq"
ON msq_submissions FOR SELECT
USING (
  (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
);
```

#### wsl_submissions
```sql
-- Company users can see their own company's WSL submissions
CREATE POLICY "company_users_see_own_wsl"
ON wsl_submissions FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  )
);

-- MOH users can see all WSL submissions
CREATE POLICY "moh_users_see_all_wsl"
ON wsl_submissions FOR SELECT
USING (
  (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
);
```

#### thresholds
```sql
-- Company users can see thresholds for their own company's SKUs
CREATE POLICY "company_users_see_own_thresholds"
ON thresholds FOR SELECT
USING (
  sku_id IN (
    SELECT id FROM skus
    WHERE product_id IN (
      SELECT id FROM products
      WHERE company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
      )
    )
  )
  OR sku_id IS NULL  -- Global thresholds
);

-- MOH users can see all thresholds
CREATE POLICY "moh_users_see_all_thresholds"
ON thresholds FOR SELECT
USING (
  (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
);
```

#### breaches
```sql
-- Company users can see their own company's breaches
CREATE POLICY "company_users_see_own_breaches"
ON breaches FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  )
);

-- MOH users can see all breaches
CREATE POLICY "moh_users_see_all_breaches"
ON breaches FOR SELECT
USING (
  (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
);
```

---

### ECS Module Tables

#### export_requests
```sql
-- Check ECS module is active
CREATE POLICY "users_see_exports_if_ecs_active"
ON export_requests FOR SELECT
USING (
  (SELECT is_active FROM system_config WHERE module_name = 'ecs') = true
  AND (
    company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
    OR
    (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
  )
);
```

#### export_authorizations
```sql
-- Check ECS module is active
CREATE POLICY "users_see_authorizations_if_ecs_active"
ON export_authorizations FOR SELECT
USING (
  (SELECT is_active FROM system_config WHERE module_name = 'ecs') = true
  AND (
    export_request_id IN (
      SELECT id FROM export_requests
      WHERE company_id IN (
        SELECT company_id FROM users WHERE id = auth.uid()
      )
    )
    OR
    (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
  )
);
```

---

### CMC Module Tables

#### compliance_scores
```sql
-- Check CMC module is active
CREATE POLICY "users_see_scores_if_cmc_active"
ON compliance_scores FOR SELECT
USING (
  (SELECT is_active FROM system_config WHERE module_name = 'cmc') = true
  AND (
    company_id IN (SELECT company_id FROM users WHERE id = auth.uid())
    OR
    (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL
  )
);
```

---

## Write Policies (INSERT, UPDATE, DELETE)

### General Write Policy Pattern

**Company Users:**
- Can INSERT/UPDATE their own company's data
- Cannot DELETE (soft deletes only, handled by application)

**MOH Users:**
- Tier 1: Full write access
- Tier 2 Officers: Read/write (no delete without Tier 1)
- Tier 2 Registrars: Read/write (implementation only)

**Example: Products Table (INSERT)**
```sql
CREATE POLICY "company_users_insert_own_products"
ON products FOR INSERT
WITH CHECK (
  company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  )
);
```

**Example: Products Table (UPDATE)**
```sql
CREATE POLICY "company_users_update_own_products"
ON products FOR UPDATE
USING (
  company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  )
  AND status = 'draft'  -- Only draft submissions can be updated
);
```

**Notes:**
- Write policies are more restrictive than read policies
- Business rules (e.g., status checks) enforced in policies
- Deletions handled via soft deletes (application logic)

---

## Helper Functions

### Function: get_user_company_id()
**Purpose:** Get current user's company_id (NULL for MOH users)

```sql
CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT company_id FROM users WHERE id = auth.uid();
$$;
```

**Usage in Policies:**
```sql
CREATE POLICY "company_users_see_own_data"
ON {table_name} FOR SELECT
USING (company_id = get_user_company_id());
```

---

### Function: is_moh_user()
**Purpose:** Check if current user is MOH user

```sql
CREATE OR REPLACE FUNCTION is_moh_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT (SELECT company_id FROM users WHERE id = auth.uid()) IS NULL;
$$;
```

**Usage in Policies:**
```sql
CREATE POLICY "moh_users_see_all_data"
ON {table_name} FOR SELECT
USING (is_moh_user());
```

---

### Function: is_module_active(module_name text)
**Purpose:** Check if module is active

```sql
CREATE OR REPLACE FUNCTION is_module_active(module_name text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT is_active FROM system_config WHERE module_name = is_module_active.module_name;
$$;
```

**Usage in Policies:**
```sql
CREATE POLICY "users_see_data_if_module_active"
ON {table_name} FOR SELECT
USING (is_module_active('ecs'));
```

---

## Performance Considerations

### Indexes for RLS Policies

**Required Indexes:**
- `users.company_id` - Used in all company isolation policies
- `users.id` - Used in all user lookups
- `{table}.company_id` - Used in company isolation policies
- `system_config.module_name` - Used in module activation checks

**Example:**
```sql
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_products_company_id ON products(company_id);
CREATE INDEX idx_system_config_module_name ON system_config(module_name);
```

---

### Policy Query Optimization

**Best Practices:**
1. Use helper functions to avoid repeated subqueries
2. Ensure indexes on columns used in policies
3. Use `SECURITY DEFINER` functions for complex checks
4. Cache module activation status (if needed)

---

## Testing RLS Policies

### Test Cases

1. **Company User Isolation:**
   - Company user can see only their own company's data
   - Company user cannot see other companies' data

2. **MOH User Access:**
   - MOH user can see all companies' data
   - MOH user access level depends on role (application logic)

3. **Module Activation:**
   - Optional modules (ECS, CMC) are hidden when inactive
   - Core modules (RMM, VCI) are always accessible

4. **Write Policies:**
   - Company users can only insert/update their own company's data
   - MOH users have appropriate write access based on role

---

## Related Documents

- [Database Schema Design](../database/schema-design.md)
- [Security Architecture](security-architecture.md) - Detailed security architecture (Week 4)
- [Audit Logging Specification](audit-logging-spec.md) - Audit logging details
- [Regulatory Framework](../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference including Law No. 09-08
- [Compliance Requirements](../../../03-governance/compliance-requirements.md) - Detailed compliance requirements including CNDP
- [Regulatory Policies](../../../03-governance/regulatory-policies.md) - Regulatory policies and guidelines
- [Technical Decision Log](../../../06-development/technical-decisions/decision-log.md)

---

**Next Review Date:** [To be scheduled]  
**Owner:** Rafi

