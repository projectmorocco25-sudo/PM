# RMM Module - RPC Function Contracts

**Last Updated:** 2026-01-25  
**Purpose:** Document exact contracts for RMM RPC functions to ensure frontend-backend alignment

---

## Contract Definition Format

Each RPC function contract includes:
- **Function Signature:** Exact parameter names and types
- **Return Type:** Exact JSONB structure returned
- **Database Dependencies:** Tables/columns used
- **Role-based Behavior:** How filtering changes by role
- **Error Conditions:** When exceptions are raised
- **Frontend Type:** Corresponding TypeScript interface

---

## RMM Overview Page RPC Functions

### 1. `rmm_get_statistics(user_id uuid)`

**Purpose:** Get statistics (counts) for companies, products, and SKUs

**Parameters:**
- `user_id` (uuid, required): Current user's UUID

**Return Type:** `jsonb`
```json
{
  "companies": {
    "total": 0,
    "active": 0,
    "inactive": 0
  },
  "products": {
    "total": 0,
    "active": 0,
    "inactive": 0
  },
  "skus": {
    "total": 0,
    "active": 0,
    "inactive": 0
  }
}
```

**Database Tables:**
- `companies` (columns: id, is_active)
- `products` (columns: id, company_id, is_active)
- `skus` (columns: id, product_id, is_active) - joined through products

**Role-based Behavior:**
- Company users: Filtered to `users.company_id`
- MOH users: No filter (see all)

**Error Conditions:**
- `User not found` if user_id doesn't exist
- `User is not active` if user.is_active = false

**Frontend Type:** `RMMStatistics` (from `lib/types/rmm.ts`)

**Migration:** `20260125000000_create_rmm_overview_rpc_functions.sql`

---

### 2. `rmm_get_recent_activity(user_id uuid, p_limit integer DEFAULT 10)`

**Purpose:** Get recent activity timeline (company/product/SKU creation, submission updates)

**Parameters:**
- `user_id` (uuid, required): Current user's UUID
- `p_limit` (integer, optional): Number of activities to return (default: 10, min: 1, max: 50)

**Return Type:** `jsonb` (array)
```json
[
  {
    "type": "company_created",
    "description": "Company \"Acme Pharma\" registered",
    "entity_type": "company",
    "entity_id": "uuid-as-string",
    "timestamp": "2026-01-25T10:00:00Z",
    "user_name": "John Doe"
  }
]
```

**Database Tables:**
- `companies` (columns: id, name, created_at)
- `products` (columns: id, name, company_id, created_at)
- `skus` (columns: id, name, product_id, created_at) - joined through products
- `registry_submissions` (columns: id, entity_type, entity_id, submission_type, status, submitted_by, approved_by, approved_at, updated_at, created_at)
- `users` (columns: id, full_name, email) - for user_name

**Schema Assumptions:**
- ❌ `companies.created_by` does NOT exist - use `registry_submissions.submitted_by` instead
- ❌ `products.created_by` does NOT exist - use `registry_submissions.submitted_by` instead
- ❌ `skus.created_by` does NOT exist - use `registry_submissions.submitted_by` instead
- ❌ `registry_submissions.company_id` does NOT exist - filter through entity relationships

**Role-based Behavior:**
- Company users: Filtered to `users.company_id` through entity relationships
- MOH users: No filter (see all)

**Error Conditions:**
- `User not found` if user_id doesn't exist
- `User is not active` if user.is_active = false

**Frontend Type:** `RMMActivity[]` (from `lib/types/rmm.sql`)

**Migration:** 
- Original: `20260125000000_create_rmm_overview_rpc_functions.sql`
- Fixes: 
  - `20260125000001_fix_rmm_get_recent_activity_created_by.sql`
  - `20260125000002_fix_rmm_get_recent_activity_uuid_type_mismatch.sql`
  - `20260125000003_fix_rmm_get_recent_activity_company_id.sql`
  - `20260125000004_fix_rmm_get_recent_activity_group_by.sql`

---

### 3. `rmm_get_enforcement_actions(user_id uuid, company_id uuid DEFAULT NULL, p_limit integer DEFAULT 10)`

**Purpose:** Get active enforcement actions with legal basis and appeal deadlines

**Parameters:**
- `user_id` (uuid, required): Current user's UUID
- `company_id` (uuid, optional): Only used for MOH users to filter by company
- `p_limit` (integer, optional): Number of actions to return (default: 10, min: 1, max: 50)

**Return Type:** `jsonb` (array)
```json
[
  {
    "id": "uuid-as-string",
    "action_type": "fine",
    "violation_type": "quality_violation",
    "legal_basis": "DMP Art. 12",
    "amount": 50000,
    "currency": "MAD",
    "status": "executed",
    "required_action": "Payment required: 50000 MAD",
    "executed_at": "2026-01-20T10:00:00Z",
    "appeal_deadline": "2026-02-19",
    "appeal_window_open": true,
    "days_remaining": 15,
    "company_id": "uuid-as-string",
    "company_name": "Acme Pharma"
  }
]
```

**Database Tables:**
- `enforcement_actions` (columns: id, action_type, violation_type, legal_basis, amount, currency, status, executed_at, company_id, created_at)
- `companies` (columns: id, name) - for company_name

**Role-based Behavior:**
- Company users: Automatically filtered to `users.company_id` (company_id parameter ignored)
- MOH users: Use provided `company_id` parameter or show all if NULL

**Error Conditions:**
- `User not found` if user_id doesn't exist
- `User is not active` if user.is_active = false

**Frontend Type:** `RMMEnforcementAction[]` (from `lib/types/rmm.ts`)

**Migration:** `20260125000000_create_rmm_overview_rpc_functions.sql`

---

### 4. `rmm_get_submission_deadlines(user_id uuid)`

**Purpose:** Get upcoming submission deadlines with regulatory references

**Parameters:**
- `user_id` (uuid, required): Current user's UUID

**Return Type:** `jsonb` (array)
```json
[
  {
    "submission_type": "Annual Registry",
    "due_date": "2026-03-31",
    "days_remaining": 65,
    "regulatory_reference": "DMP Art. 12",
    "regulatory_description": "Annual Submission"
  }
]
```

**Database Tables:**
- (Calculated, not from direct table queries - based on business rules)

**Role-based Behavior:**
- Company users: See own deadlines only
- MOH users: See all deadlines

**Error Conditions:**
- `User not found` if user_id doesn't exist
- `User is not active` if user.is_active = false

**Frontend Type:** `RMMSubmissionDeadline[]` (from `lib/types/rmm.ts`)

**Migration:** `20260125000000_create_rmm_overview_rpc_functions.sql`

---

### 5. `rmm_list_submissions(...)`

**Purpose:** List registry submissions with filtering, pagination, and sorting

**Parameters:**
- `p_limit` (integer, optional): Default 100, Min 1, Max 1000
- `p_offset` (integer, optional): Default 0, Min 0
- `p_status` (text, optional): Filter by status
- `p_submission_type` (text, optional): Filter by submission_type
- `p_entity_type` (text, optional): Filter by entity_type
- `p_company_id` (uuid, optional): Filter by company (auto-set for company users)
- `p_search` (text, optional): Search term
- `p_sort_by` (text, optional): Default 'created_at', Options: 'created_at' | 'updated_at' | 'status' | 'submission_type' | 'entity_type'
- `p_sort_order` (text, optional): Default 'DESC', Options: 'ASC' | 'DESC'

**IMPORTANT:** This function uses `auth.uid()` internally - does NOT accept `user_id` parameter!

**Return Type:** `jsonb`
```json
{
  "data": [...],
  "pagination": {
    "total": 100,
    "limit": 20,
    "offset": 0,
    "has_more": true
  }
}
```

**Database Tables:**
- `registry_submissions` (all columns)
- `companies` (for company_name lookup)
- `users` (for submitted_by_name)

**Role-based Behavior:**
- Company users: Automatically filtered to `users.company_id` (p_company_id parameter overridden)
- MOH users: Use provided `p_company_id` or show all if NULL

**Error Conditions:**
- `User not found` if auth.uid() doesn't exist
- `User is not active` if user.is_active = false
- `Company user must be associated with a company` if company user has NULL company_id
- `Limit must be between 1 and 1000`
- `Offset must be >= 0`
- `Invalid sort_by: ...` if p_sort_by not in allowed list
- `Invalid sort_order: ...` if p_sort_order not 'ASC' or 'DESC'

**Frontend Type:** `RMMListSubmissionsResponse` (from `lib/types/rmm.ts`)

**Migration:** `20260123234000_create_rmm_registry_submission_helper_functions.sql`

---

## Common Patterns and Gotchas

### Parameter Naming Convention
- Most RPC functions use `p_` prefix for parameters (e.g., `p_limit`, `p_offset`)
- Some functions use direct names (e.g., `user_id`, `company_id`)
- **Always check function signature before calling**

### User Authentication
- Some functions accept `user_id` parameter explicitly
- Some functions use `auth.uid()` internally (e.g., `rmm_list_submissions`)
- **Check function documentation for which pattern is used**

### Company Filtering
- Company users: Always filtered to `users.company_id` automatically
- MOH users: Can optionally filter by `company_id` parameter
- **Never pass company_id for company users - it's ignored**

### Schema Assumptions
- ❌ `companies.created_by` does NOT exist
- ❌ `products.created_by` does NOT exist
- ❌ `skus.created_by` does NOT exist
- ❌ `registry_submissions.company_id` does NOT exist (filter through entity relationships)

---

## Type Safety Checklist

When creating/updating RPC functions:

- [ ] Document exact return structure in this file
- [ ] Update corresponding TypeScript interface in `lib/types/rmm.ts`
- [ ] Verify frontend code uses shared types (not local interfaces)
- [ ] Test with actual data to ensure types match
- [ ] Document all schema assumptions
- [ ] Document role-based behavior
- [ ] Document error conditions

---

**Maintained By:** Backend Team (Maya) + Frontend Team (Emma) + Compliance (Sami)
