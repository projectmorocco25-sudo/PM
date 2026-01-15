# Module Integration Contracts - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines the explicit integration contracts between modules, specifying data flows, APIs, and interaction patterns.

**Last Updated:** 2025-01-12  
**Status:** ✅ Complete (Phase 1.1.1, Task 1.1.1.1a)  
**Owner:** Oliver (Chief Architect)

## Overview

This document specifies the integration contracts between the four modules of the PM platform:
- **RMM** (Registry Management Module) - Foundation
- **VCI** (Value Chain Intelligence) - Core
- **ECS** (Export Control System) - Optional
- **CMC** (Compliance Monitoring Center) - Optional

## Contract Principles

1. **Explicit Contracts:** All module interactions are explicitly defined
2. **Data Ownership:** Each module owns its data; other modules read-only
3. **RLS Enforcement:** Security boundaries enforced via Row Level Security
4. **Event-Driven:** Cross-module impacts triggered by events
5. **Idempotent Operations:** All operations are safe to retry

---

## Contract 1: RMM → VCI

### Data Flow

**RMM Provides:**
- `companies` table - Company registry
- `products` table - Product registry
- `skus` table - SKU registry
- `atc_codes` table - ATC code registry (MOH-controlled)
- `critical_medicines` table - Critical medicine designations (MOH-controlled)

**VCI Consumes:**
- Read-only access to RMM tables via Supabase client
- Foreign key relationships: `vci_submissions.company_id`, `vci_submissions.sku_id`
- RLS policies ensure VCI can only read companies/products/SKUs it has access to

### API Contract

**RPC Functions (RMM provides, VCI calls):**
- `rmm_get_company(company_id)` - Get company details
- `rmm_get_sku(sku_id)` - Get SKU details
- `rmm_list_critical_medicines()` - List critical medicines (MOH only)
- `rmm_get_atc_code(atc_code)` - Get ATC code details

**Data Access Pattern:**
```sql
-- VCI reads RMM data directly via Supabase client
-- RLS policies enforce access control
SELECT * FROM companies WHERE id = $1;
SELECT * FROM skus WHERE id = $1;
```

**Validation Rules:**
- VCI submissions must reference valid `company_id` from RMM
- VCI submissions must reference valid `sku_id` from RMM
- VCI cannot modify RMM data (read-only)

**Event Triggers:**
- Company deactivation in RMM → VCI submissions remain but company marked inactive
- SKU deactivation in RMM → VCI submissions remain but SKU marked inactive

---

## Contract 2: VCI → ECS

### Data Flow

**VCI Provides:**
- `msq_submissions` table - Monthly Stock Quantity submissions
- `thresholds` table - Stock thresholds (VCI Threshold)
- `breaches` table - Threshold breach records

**ECS Consumes:**
- MSQ data for XAMS calculations (default X=6 months)
- Threshold data for threshold switching
- Breach data for risk assessment

### API Contract

**RPC Functions (VCI provides, ECS calls):**
- `vci_get_msq_submissions(sku_id, start_date, end_date)` - Get MSQ submissions for XAMS calculation
- `vci_get_current_threshold(sku_id)` - Get current VCI threshold for SKU
- `vci_switch_threshold_to_ecs(sku_id, ecs_threshold, revert_date)` - Switch threshold from VCI to ECS
- `vci_revert_threshold_to_vci(sku_id)` - Revert threshold from ECS to VCI
- `vci_get_breach_history(sku_id, months)` - Get breach history for risk assessment

**XAMS Calculation Contract:**
```sql
-- ECS calculates XAMS from VCI MSQ data
-- Default X = 6 months, configurable 3-12 months
-- Minimum 3 months required
XAMS = AVG(msq_submissions.quantity) 
WHERE sku_id = $1 
  AND submission_date >= (CURRENT_DATE - INTERVAL 'X months')
  AND submission_date <= CURRENT_DATE
```

**Threshold Switching Contract:**
```sql
-- When export authorized, ECS triggers threshold switch
-- VCI threshold → ECS threshold
-- Duration: 3 calendar months
-- Revert date: authorization_date + 3 months
CALL vci_switch_threshold_to_ecs(
  sku_id := $1,
  ecs_threshold := $2,
  revert_date := $3
);
```

**Data Access Pattern:**
- ECS reads VCI data via RPC functions (not direct table access)
- RLS policies enforced within RPC functions
- ECS cannot modify VCI data (read-only, except threshold switching)

**Event Triggers:**
- Export authorization in ECS → Triggers `vci_switch_threshold_to_ecs()`
- Export authorization expiration in ECS → Triggers `vci_revert_threshold_to_vci()`
- Export authorization extension in ECS → Updates revert_date in VCI

**Validation Rules:**
- ECS export requests must reference valid SKUs from RMM (via VCI)
- XAMS calculation requires minimum 3 months of MSQ data
- Threshold switching requires valid authorization state

---

## Contract 3: VCI → CMC

### Data Flow

**VCI Provides:**
- `wsl_submissions` table - Weekly Stock Level submissions
- `msq_submissions` table - Monthly Stock Quantity submissions
- `aams_submissions` table - Annual Average Monthly Stock submissions
- `breaches` table - Threshold breach records

**CMC Consumes:**
- WSL data for Regulatory Reporting Compliance Rate
- MSQ data for compliance scoring
- AAMS data for compliance scoring
- Breach data for Stock Threshold Violation Frequency

### API Contract

**RPC Functions (VCI provides, CMC calls):**
- `vci_get_wsl_submissions(company_id, start_date, end_date)` - Get WSL submissions for compliance rate
- `vci_get_msq_submissions(company_id, start_date, end_date)` - Get MSQ submissions for scoring
- `vci_get_aams_submissions(company_id, year)` - Get AAMS submissions for scoring
- `vci_get_breaches(company_id, start_date, end_date)` - Get breach records for violation frequency

**Regulatory Reporting Compliance Rate Contract:**
```sql
-- CMC calculates compliance rate from VCI WSL data
-- Percentage of mandatory weekly stock reports submitted within deadline
-- Rolling 12-month window
compliance_rate = (
  COUNT(wsl_submissions WHERE submitted_within_deadline = true) 
  / COUNT(wsl_submissions WHERE mandatory = true)
) * 100
WHERE submission_date >= (CURRENT_DATE - INTERVAL '12 months')
```

**Stock Threshold Violation Frequency Contract:**
```sql
-- CMC calculates violation frequency from VCI breach data
-- Average count of SKUs per reporting cycle failing minimum stock requirements
-- Rolling 6-month average
violation_frequency = AVG(
  COUNT(DISTINCT sku_id) 
  WHERE breach_status = 'active'
  GROUP BY reporting_cycle
)
WHERE detected_at >= (CURRENT_DATE - INTERVAL '6 months')
```

**Data Access Pattern:**
- CMC reads VCI data via RPC functions (not direct table access)
- RLS policies enforced within RPC functions
- CMC cannot modify VCI data (read-only)

**Event Triggers:**
- Monthly score calculation in CMC → Reads VCI data via RPC functions
- Event-triggered recalculation in CMC → Reads VCI data via RPC functions

**Validation Rules:**
- CMC score calculations require valid company_id from RMM
- Compliance rate requires minimum 12 months of WSL data
- Violation frequency requires minimum 6 months of breach data

---

## Contract 4: ECS → CMC

### Data Flow

**ECS Provides:**
- `export_authorizations` table - Export authorization records
- `replenishment_schedules` table - Replenishment schedule tracking

**CMC Consumes:**
- Export authorization data for Export Compliance component
- Replenishment schedule data for Replenishment Plan Adherence component

### API Contract

**RPC Functions (ECS provides, CMC calls):**
- `ecs_get_export_authorizations(company_id, start_date, end_date)` - Get export authorizations for compliance scoring
- `ecs_get_replenishment_schedules(company_id, start_date, end_date)` - Get replenishment schedules for adherence scoring
- `ecs_get_export_compliance_metrics(company_id, period)` - Get aggregated export compliance metrics

**Export Compliance Component Contract:**
```sql
-- CMC calculates export compliance from ECS authorization data
-- Factors: authorization compliance, expiration handling, replenishment adherence
export_compliance_score = (
  (authorization_compliance_rate * 0.4) +
  (expiration_handling_rate * 0.3) +
  (replenishment_adherence_rate * 0.3)
) * 100
WHERE period = $1
```

**Replenishment Plan Adherence Contract:**
```sql
-- CMC calculates adherence from ECS replenishment schedule data
-- Composite of historical fulfillment and future commitment horizons
adherence_score = (
  (historical_fulfillment_percentage * 0.6) +
  (future_commitment_horizon_score * 0.4)
) * 100
WHERE company_id = $1
```

**Data Access Pattern:**
- CMC reads ECS data via RPC functions (not direct table access)
- RLS policies enforced within RPC functions
- CMC cannot modify ECS data (read-only)

**Event Triggers:**
- Export authorization in ECS → Triggers CMC score recalculation (event-triggered)
- Replenishment delay escalation in ECS → Updates CMC adherence metrics

**Validation Rules:**
- CMC export compliance calculations require ECS module to be active
- Replenishment adherence calculations require ECS module to be active
- All calculations require valid company_id from RMM

---

## Contract 5: CMC → ECS

### Data Flow

**CMC Provides:**
- `compliance_scores` table - Company compliance scores (0-100)

**ECS Consumes:**
- Compliance scores for conditional validation on export requests

### API Contract

**RPC Functions (CMC provides, ECS calls):**
- `cmc_get_current_score(company_id)` - Get current compliance score for company
- `cmc_get_score_history(company_id, months)` - Get score history for trend analysis

**Conditional Validation Contract:**
```sql
-- ECS uses CMC score for conditional validation
-- Score < 60: Auto-approval disabled, manual review required
-- Score 60-74: Tier 2 verification required before auto-approval
-- Score 75+: Standard auto-approval eligible
IF score < 60 THEN
  auto_approval_eligible := false;
  requires_manual_review := true;
ELSIF score >= 60 AND score < 75 THEN
  auto_approval_eligible := true;
  requires_tier2_verification := true;
ELSE
  auto_approval_eligible := true;
  requires_tier2_verification := false;
END IF;
```

**Data Access Pattern:**
- ECS reads CMC data via RPC functions (not direct table access)
- RLS policies enforced within RPC functions
- ECS cannot modify CMC data (read-only)

**Event Triggers:**
- Export request submission in ECS → Checks CMC score via `cmc_get_current_score()`
- Export request evaluation in ECS → Uses CMC score for conditional validation

**Validation Rules:**
- Conditional validation requires CMC module to be active
- Score must be current (within last 30 days)
- If score unavailable, default to manual review (fail-safe)

---

## Contract 6: ECS → VCI (Threshold Switching)

### Data Flow

**ECS Triggers:**
- Export authorization → Threshold switch (VCI Threshold → ECS Threshold)
- Export authorization expiration → Threshold revert (ECS Threshold → VCI Threshold)

**VCI Responds:**
- Updates `thresholds` table with ECS threshold
- Sets revert_date (authorization_date + 3 months)
- Updates threshold status indicators

### API Contract

**RPC Functions (VCI provides, ECS calls):**
- `vci_switch_threshold_to_ecs(sku_id, ecs_threshold, revert_date)` - Switch threshold to ECS
- `vci_revert_threshold_to_vci(sku_id)` - Revert threshold to VCI

**Threshold Switching Contract:**
```sql
-- ECS calls VCI to switch threshold
CALL vci_switch_threshold_to_ecs(
  sku_id := $1,
  ecs_threshold := $2,
  revert_date := authorization_date + INTERVAL '3 months'
);

-- VCI updates threshold record
UPDATE thresholds
SET 
  threshold_value = ecs_threshold,
  threshold_type = 'ecs',
  revert_date = $3,
  is_current = true
WHERE sku_id = $1;
```

**Threshold Reversion Contract:**
```sql
-- ECS calls VCI to revert threshold
CALL vci_revert_threshold_to_vci(sku_id := $1);

-- VCI reverts threshold to original VCI threshold
UPDATE thresholds
SET 
  threshold_value = original_vci_threshold,
  threshold_type = 'vci',
  revert_date = NULL,
  is_current = true
WHERE sku_id = $1;
```

**Event Triggers:**
- Export authorization approved → ECS calls `vci_switch_threshold_to_ecs()`
- Export authorization expired → ECS calls `vci_revert_threshold_to_vci()`
- Scheduled job (daily) → VCI checks revert_date and auto-reverts if needed

**Validation Rules:**
- Threshold switching requires valid SKU from RMM
- Threshold switching requires valid export authorization
- Revert date must be exactly 3 calendar months from authorization date

---

## Contract 7: ECS → CMC (Score Recalculation)

### Data Flow

**ECS Triggers:**
- Export authorization → Triggers CMC score recalculation

**CMC Responds:**
- Recalculates compliance score (event-triggered)
- Updates Export Compliance component
- Updates overall compliance score

### API Contract

**RPC Functions (CMC provides, ECS calls):**
- `cmc_recalculate_score_event_triggered(company_id, trigger_event, event_data)` - Trigger score recalculation

**Score Recalculation Contract:**
```sql
-- ECS triggers CMC score recalculation
CALL cmc_recalculate_score_event_triggered(
  company_id := $1,
  trigger_event := 'export_authorized',
  event_data := jsonb_build_object(
    'export_authorization_id', $2,
    'authorization_date', $3
  )
);

-- CMC recalculates score
-- Updates Export Compliance component
-- Updates overall compliance score
```

**Event Triggers:**
- Export authorization approved → ECS calls `cmc_recalculate_score_event_triggered()`
- Replenishment delay escalation → ECS calls `cmc_recalculate_score_event_triggered()`

**Validation Rules:**
- Score recalculation requires CMC module to be active
- Event data must include valid export_authorization_id
- Recalculation is idempotent (safe to retry)

---

## Integration Patterns

### Pattern 1: Direct Database Access (Read-Only)

**Use Case:** Module reads data from another module's tables

**Example:** VCI reads companies from RMM
```typescript
const { data, error } = await supabase
  .from('companies')
  .select('*')
  .eq('id', companyId);
```

**Security:** RLS policies enforce access control

---

### Pattern 2: RPC Functions (Cross-Module Calculations)

**Use Case:** Module needs calculated data from another module

**Example:** ECS gets XAMS from VCI
```typescript
const { data, error } = await supabase.rpc('vci_get_msq_submissions', {
  sku_id: skuId,
  start_date: startDate,
  end_date: endDate
});
```

**Security:** RPC functions use SECURITY DEFINER, audit logged

---

### Pattern 3: Event-Driven Updates

**Use Case:** Module action triggers update in another module

**Example:** ECS authorization triggers VCI threshold switch
```typescript
// In ECS authorization handler
await supabase.rpc('vci_switch_threshold_to_ecs', {
  sku_id: skuId,
  ecs_threshold: calculatedThreshold,
  revert_date: revertDate
});
```

**Security:** Event triggers validated, audit logged

---

## Error Handling

### Contract Violations

**Invalid Data:**
- Return error code: `CONTRACT_VIOLATION`
- Log to audit system
- Do not proceed with operation

**Missing Dependencies:**
- Return error code: `MODULE_NOT_ACTIVE`
- Check `system_config` for module activation
- Provide clear error message

**RLS Policy Violations:**
- Return error code: `ACCESS_DENIED`
- Do not expose internal details
- Log security event

---

## Testing Contracts

### Contract Testing Requirements

1. **Unit Tests:** Test each RPC function independently
2. **Integration Tests:** Test cross-module interactions
3. **Contract Tests:** Verify API contracts are met
4. **Error Tests:** Test error handling and edge cases

### Test Data Requirements

- Use seeded Supabase data (not mocks)
- Test with different user roles
- Test with module activation states
- Test error scenarios

---

## Related Documents

- [Module Dependency Diagram](module-dependency-diagram.md)
- [System Architecture](../system-architecture.md)
- [RPC Function Specifications](../api/rpc-functions.md)
- [RLS Policy Framework](../security/rls-policy-framework.md)

---

**Next Review Date:** [To be scheduled]  
**Owner:** Oliver (Chief Architect)
