# Module Integration Contracts - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines the explicit integration contracts between modules, including data flow specifications, dependencies, and interaction patterns.

**Created:** 2026-01-17  
**Task:** 1.1.1.1a  
**Author:** Sami (Implementation Compliance Specialist)  
**Owner:** Oliver (Chief Architect)

---

## Overview

This document specifies the integration contracts between PM platform modules: RMM (Registry Management Module), VCI (Value Chain Intelligence), ECS (Export Control System), and CMC (Compliance Monitoring Center). These contracts define how modules communicate, what data they exchange, and how they depend on each other.

**Integration Pattern:** Direct database access via Supabase client with RLS policies enforcing security boundaries (Decision 1 - Module Communication).

---

## Integration Contract: RMM → VCI

### Contract Summary

**Direction:** RMM provides data to VCI  
**Pattern:** Direct database access (VCI reads from RMM tables)  
**Authentication:** RLS policies enforce company isolation

### Data Provided by RMM

**Tables:**
- `companies` - Company registry (id, name, type, status)
- `products` - Product registry (id, company_id, name, atc_code)
- `skus` - SKU registry (id, product_id, dosage_strength, dosage_form, pack_size, unit_of_measure)
- `atc_codes` - ATC code reference (id, code, description)
- `critical_medicines` - Critical medicine designations (sku_id, designated_at)

### Data Usage by VCI

**AAMS Submissions:**
- Associates AAMS submission with `company_id` (from companies table)
- Associates submission_data with `sku_id` (from skus table)
- References `atc_codes` for product classification

**MSQ Submissions:**
- Associates MSQ submission with `company_id` (from companies table)
- Associates submission_data with `sku_id` (from skus table)

**WSL Submissions:**
- Associates WSL submission with `company_id` (from companies table)
- Associates submission_data with `sku_id` (from skus table)
- All company SKUs must be included in WSL submission

**Thresholds:**
- Associates threshold with `sku_id` (from skus table)
- Uses `critical_medicines` designation to determine default multiplier (B=3 vs B=3.5)

### Integration Contract Rules

1. **Read-Only Access:** VCI only reads from RMM tables; never modifies
2. **Company Isolation:** RLS policies ensure VCI can only access RMM data for companies the user has access to
3. **Referential Integrity:** Foreign key constraints ensure SKU references are valid
4. **No Direct API Calls:** No REST API between RMM and VCI; direct database queries only

### Data Flow Example

```sql
-- VCI reads SKU data from RMM for submission
SELECT id, dosage_strength, dosage_form, pack_size, unit_of_measure
FROM skus
WHERE product_id IN (SELECT id FROM products WHERE company_id = $1);
```

---

## Integration Contract: VCI → ECS

### Contract Summary

**Direction:** VCI provides data to ECS  
**Pattern:** Direct database access (ECS reads from VCI tables)  
**Authentication:** RLS policies enforce company isolation

### Data Provided by VCI

**Tables:**
- `msq_submissions` - Monthly Sales Quantities (for XAMS calculations)
- `thresholds` - SKU thresholds (for threshold switching logic)

### Data Usage by ECS

**XAMS Calculation:**
- ECS reads MSQ submissions for last X months (default X=6) for specific SKU
- Calculates XAMS = Average(MSQ quantities over X months)
- Uses XAMS for ECS Threshold calculation: `ECS Threshold = XAMS × C` (default C=3 or 3.5 for critical medicines)

**Threshold Switching:**
- When export authorization is approved, ECS updates threshold reference in VCI
- VCI Threshold → ECS Threshold switch (3-month duration)
- Threshold reverts to VCI Threshold after 3 months or on authorization cancellation

### Integration Contract Rules

1. **Read Access:** ECS reads MSQ data from VCI for XAMS calculations
2. **Write Access:** ECS can update threshold status in VCI (threshold switching)
3. **Company Isolation:** RLS policies ensure ECS can only access VCI data for companies the user has access to
4. **No Direct API Calls:** No REST API between VCI and ECS; direct database queries/RPC functions only

### Data Flow Example

```sql
-- ECS calculates XAMS from MSQ submissions
SELECT AVG((submission_data->>'quantity')::numeric) as xams
FROM msq_submissions
WHERE company_id = $1
  AND sku_id = $2
  AND (year, month) >= (CURRENT_YEAR, CURRENT_MONTH - X)
ORDER BY year, month;
```

---

## Integration Contract: VCI → CMC

### Contract Summary

**Direction:** VCI provides data to CMC  
**Pattern:** Direct database access (CMC reads from VCI tables)  
**Authentication:** RLS policies for user queries, service role for scheduled jobs

### Data Provided by VCI

**Tables:**
- `wsl_submissions` - Weekly Stock Levels (for Regulatory Reporting Compliance Rate)
- `msq_submissions` - Monthly Sales Quantities (for Data Quality Signals)
- `aams_submissions` - Annual Average Monthly Sales (for compliance scoring)
- `breaches` - Threshold breaches (for Stock Threshold Violation Frequency)

### Data Usage by CMC

**Compliance Score Calculation (Monthly Scheduled Job):**

1. **Regulatory Reporting Compliance Rate:**
   - Reads `wsl_submissions` for last 12 months
   - Calculates: Percentage of mandatory weekly reports submitted within deadline

2. **Stock Threshold Violation Frequency:**
   - Reads `breaches` for last 6 months
   - Calculates: Average count of SKUs per reporting cycle failing minimum stock requirements

3. **Aggregate Non-Compliance Exposure:**
   - Reads `breaches` for last 12 months
   - Calculates: Total SKU-days of threshold non-compliance

4. **Data Quality Signals:**
   - Reads `msq_submissions` for completeness and accuracy metrics
   - Compares MSQ vs AAMS for anomaly detection

### Integration Contract Rules

1. **Read-Only Access:** CMC only reads from VCI tables; never modifies
2. **Scheduled Jobs:** Monthly score calculation uses service role (bypasses RLS for system-wide access)
3. **User Queries:** User-initiated queries use RLS policies for company isolation
4. **No Direct API Calls:** No REST API between VCI and CMC; direct database queries/RPC functions only

### Data Flow Example

```sql
-- CMC calculates Regulatory Reporting Compliance Rate (monthly scheduled job)
-- Uses service role for system-wide access
WITH last_12_months AS (
  SELECT company_id, week_ending, submitted_at
  FROM wsl_submissions
  WHERE week_ending >= CURRENT_DATE - INTERVAL '12 months'
)
SELECT 
  company_id,
  COUNT(*) FILTER (WHERE submitted_at <= week_ending + INTERVAL '1 day') as on_time,
  COUNT(*) as total,
  (COUNT(*) FILTER (WHERE submitted_at <= week_ending + INTERVAL '1 day')::numeric / COUNT(*)) * 100 as compliance_rate
FROM last_12_months
GROUP BY company_id;
```

---

## Integration Contract: ECS → CMC

### Contract Summary

**Direction:** Bidirectional - ECS provides export data to CMC; CMC provides compliance scores to ECS  
**Pattern:** Direct database access with conditional logic  
**Authentication:** RLS policies for user queries, service role for scheduled jobs

### Data Provided by ECS to CMC

**Tables:**
- `export_authorizations` - Export authorizations (for Export Compliance component)
- `replenishment_schedules` - Replenishment schedules (for Replenishment Plan Adherence component)

### Data Usage by CMC

**Compliance Score Calculation (Monthly Scheduled Job):**

1. **Export Compliance:**
   - Reads `export_authorizations` for last 12 months
   - Calculates: Export authorization compliance rate
   - Only included in score if ECS module is active

2. **Replenishment Plan Adherence:**
   - Reads `replenishment_schedules` for fulfillment tracking
   - Calculates: Historical fulfillment percentage + future commitment horizon
   - Only included in score if ECS module is active

### Data Provided by CMC to ECS

**Tables:**
- `compliance_scores` - Current compliance scores (0-100 scale)

### Data Usage by ECS

**Conditional Validation on Export Requests:**

- ECS reads current compliance score from CMC when evaluating export request
- Uses score to determine auto-approval eligibility:
  - Score < 60: Auto-approval disabled (manual review required)
  - Score 60-74: Tier 2 verification required before auto-approval
  - Score 75+: Standard auto-approval process
- Only applies if CMC module is active

### Integration Contract Rules

1. **Read Access:** Both modules read from each other's tables
2. **No Write Access:** Neither module modifies the other's data directly
3. **Conditional Logic:** CMC score components only included if ECS is active; ECS conditional validation only applies if CMC is active
4. **Scheduled Jobs:** CMC monthly calculation uses service role for system-wide access
5. **Real-time Checks:** ECS checks CMC scores in real-time during export request evaluation

### Data Flow Example (ECS → CMC)

```sql
-- CMC calculates Export Compliance (monthly scheduled job)
-- Uses service role for system-wide access
-- Only included if ECS module is active
SELECT 
  company_id,
  COUNT(*) FILTER (WHERE status = 'authorized' AND completed_at IS NOT NULL) as completed_exports,
  COUNT(*) as total_authorizations,
  (COUNT(*) FILTER (WHERE status = 'authorized' AND completed_at IS NOT NULL)::numeric / COUNT(*)) * 100 as export_compliance_rate
FROM export_authorizations
WHERE created_at >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY company_id;
```

### Data Flow Example (CMC → ECS)

```sql
-- ECS checks CMC score for conditional validation (real-time)
SELECT total_score
FROM compliance_scores
WHERE company_id = $1
  AND score_period = (SELECT MAX(score_period) FROM compliance_scores WHERE company_id = $1);

-- ECS uses score to determine auto-approval eligibility
-- Score < 60: Manual review required
-- Score 60-74: Tier 2 verification required
-- Score 75+: Standard auto-approval
```

---

## Integration Contract: ECS → VCI (Threshold Switching)

### Contract Summary

**Direction:** ECS updates threshold status in VCI  
**Pattern:** ECS RPC function updates VCI threshold table  
**Trigger:** Export authorization approved

### Data Flow

**When Export Authorization is Approved:**

1. ECS RPC function (`ecs_authorize_export`) detects authorization approval
2. ECS updates threshold status in VCI:
   - Sets threshold status to `ecs_active` for the SKU
   - Sets `ecs_threshold_value` = calculated ECS Threshold
   - Sets `ecs_active_until` = authorization_date + 3 months
3. VCI dashboard automatically uses ECS Threshold for that SKU
4. Breach detection uses ECS Threshold instead of VCI Threshold
5. After 3 months (or on authorization cancellation), threshold reverts to VCI Threshold

### Integration Contract Rules

1. **Write Access:** ECS can update threshold status in VCI (limited to threshold switching fields only)
2. **Audit Trail:** All threshold switches are logged in audit_logs table
3. **Automatic Reversion:** Threshold automatically reverts after 3 months via scheduled job (pg_cron)
4. **Manual Reversion:** Threshold reverts immediately on export authorization cancellation

### Data Flow Example

```sql
-- ECS updates VCI threshold when export authorized
UPDATE thresholds
SET 
  ecs_status = 'active',
  ecs_threshold_value = $1, -- Calculated ECS Threshold
  ecs_active_until = $2, -- authorization_date + 3 months
  updated_at = now()
WHERE sku_id = $3
  AND company_id = $4;

-- Scheduled job reverts threshold after 3 months
UPDATE thresholds
SET 
  ecs_status = 'reverted',
  ecs_threshold_value = NULL,
  ecs_active_until = NULL,
  updated_at = now()
WHERE ecs_status = 'active'
  AND ecs_active_until < now();
```

---

## Event-Triggered Integration: ECS → CMC (Score Recalculation)

### Contract Summary

**Direction:** ECS authorization triggers CMC score recalculation  
**Pattern:** Event-triggered recalculation via Edge Function or RPC function  
**Trigger:** Export authorization approved

### Data Flow

**When Export Authorization is Approved:**

1. ECS RPC function (`ecs_authorize_export`) completes authorization
2. ECS triggers event (Edge Function or database trigger)
3. CMC recalculation function (`cmc_recalculate_score`) is called
4. CMC recalculates Export Compliance component for the company
5. CMC updates compliance_score record with new total score

### Integration Contract Rules

1. **Event-Triggered:** Not scheduled; triggered immediately on authorization
2. **Asynchronous:** Recalculation happens in background (Edge Function or async RPC)
3. **Incremental:** Only Export Compliance component recalculated (not full monthly calculation)
4. **Audit Trail:** Recalculation is logged in audit_logs table

### Data Flow Example

```sql
-- CMC recalculates Export Compliance component (event-triggered)
-- Called from ECS Edge Function after authorization
SELECT cmc_recalculate_export_compliance(
  company_id => $1,
  authorization_id => $2,
  triggered_by => 'ecs_authorization'
);
```

---

## Module Activation Dependencies

### Activation Order

1. **RMM** - Must be activated first (foundation module)
2. **VCI** - Can be activated after RMM (requires RMM data)
3. **ECS** - Can be activated after RMM + VCI (requires both)
4. **CMC** - Can be activated after RMM + VCI (enhanced if ECS is also active)

### Dependency Matrix

| Module | Requires | Can Activate After | Enhanced By |
|--------|----------|---------------------|-------------|
| RMM | None | System start | None |
| VCI | RMM | RMM active | None |
| ECS | RMM + VCI | RMM + VCI active | CMC (when active) |
| CMC | RMM + VCI | RMM + VCI active | ECS (when active) |

---

## Error Handling in Cross-Module Operations

### Error Types

1. **Missing Dependency Data:** If required module data is missing (e.g., VCI trying to access non-existent SKU)
2. **RLS Policy Violations:** If user doesn't have access to required data
3. **Data Consistency Issues:** If referenced data is deleted or inactive

### Error Handling Patterns

1. **Validation First:** Check data existence before using
2. **Graceful Degradation:** If optional module data is missing, continue with available data
3. **Clear Error Messages:** Return clear error messages indicating which module/data is missing
4. **Audit Logging:** Log all errors in audit_logs table

---

## Cross-Module Table References and Foreign Keys

All cross-module references use foreign keys to RMM base entities (`companies`, `products`, `skus`). Downstream modules never modify RMM data.

| Source Table | Module | Foreign Key(s) | References |
|--------------|--------|----------------|------------|
| `users` | core | `company_id` | `companies.id` |
| `aams_submissions` | VCI | `company_id` | `companies.id`; `submission_data[].sku_id` → `skus.id` |
| `msq_submissions` | VCI | `company_id` | `companies.id`; `submission_data[].sku_id` → `skus.id` |
| `wsl_submissions` | VCI | `company_id` | `companies.id`; `submission_data[].sku_id` → `skus.id` |
| `thresholds` | VCI | `company_id`, `sku_id` | `companies.id`, `skus.id` |
| `breaches` | VCI | `company_id`, `sku_id` | `companies.id`, `skus.id` |
| `export_requests` | ECS | `company_id` | `companies.id`; product/SKU via payload |
| `export_authorizations` | ECS | `company_id` | `companies.id` |
| `compliance_scores` | CMC | `company_id` | `companies.id` |
| `conversations` | comms | `company_id` | `companies.id` |

**Rules:** (1) RMM tables have no FKs to other modules. (2) VCI/ECS/CMC tables reference only RMM (and each other where documented). (3) RLS enforces company isolation on all cross-module reads.

---

## API Contracts for Module Integration

Module integration uses **direct database access** and **RPC functions**; there is no REST API between modules.

**RPC functions at boundaries:**

| Function | Direction | Purpose |
|----------|-----------|---------|
| `ecs_authorize_export` | ECS | Updates VCI `thresholds` (threshold switching) |
| `cmc_recalculate_export_compliance` | ECS → CMC | Event-triggered score update |
| `cmc_recalculate_score` | CMC | Reads VCI/ECS data; writes `compliance_scores` |
| `vci_*` / `rmm_*` | Frontend → DB | Module-specific CRUD; no cross-module RPC |

**Data exchange:** All exchange is via shared tables. JSON payloads (e.g. `submission_data`) use documented shapes in [data-dictionary](../database/data-dictionary.md) and [rpc-functions](../api/rpc-functions.md).

---

## Approval

**Task 1.1.1.1a** requires sign-off from **Nadia (Data Architect)** and **Maya (API Architect)** before any module-specific table creation.

- [x] **Nadia:** Cross-module table references and FK design reviewed and approved  
- [x] **Maya:** API contracts for module integration (RPCs, data exchange) reviewed and approved  

**Sign-off:** Nadia and Maya approval obtained. Gate satisfied; module-specific table creation (e.g. 1.1.1.3 RMM tables, VCI tables) may proceed.

---

## Related Documents

- [Module Dependency Diagram](../modules/module-dependency-diagram.md)
- [Integration Architecture](./integration-architecture.md)
- [System Architecture](../system-architecture.md)
- [Workflow Architecture](../workflow-architecture.md)
- [Data Dictionary](../database/data-dictionary.md)
- [RPC Functions](../api/rpc-functions.md)

---

**Last Updated:** 2026-01-27  
**Next Review Date:** After Phase 1.2 (ECS Implementation Complete)
