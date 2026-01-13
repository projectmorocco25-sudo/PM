# Module Integration Contracts - PM Platform

**Purpose:** Defines explicit integration contracts between modules with data flow specifications, validation rules, and interface definitions.

**Last Updated:** 2026-01-12  
**Status:** ✅ Implementation Ready (Phase 1.1.1)  
**Owner:** Oliver (Chief Architect)  
**Task Reference:** Task 1.1.1.1a

---

## Overview

This document defines the formal integration contracts between PM platform modules. Each contract specifies:
- Data provided and consumed
- Interface specifications (RPC functions, tables)
- Validation rules and constraints
- Error handling expectations
- Performance SLAs

---

## Module Dependency Chain

```
RMM (Foundation)
  ↓
VCI (Core Intelligence)
  ↓         ↓
ECS       CMC
(Export)  (Compliance)
  ↔
(Bidirectional)
```

---

## Contract 1: RMM → VCI

### Contract ID: `RMM-VCI-001`

**Provider:** RMM (Registry Management Module)  
**Consumer:** VCI (Value Chain Intelligence)  
**Type:** Read-Only Data Access

### Data Provided

| Table | Fields | Access Pattern | Update Frequency |
|-------|--------|----------------|------------------|
| `companies` | id, name, registration_number, license_number, company_type, status, contact_*, address | Direct query | On registration/update |
| `products` | id, company_id, name, generic_name, brand_name, atc_code, dosage_form, status | Direct query | On registration/update |
| `skus` | id, product_id, company_id, sku_code, dosage_strength, pack_size, unit_of_measure, status | Direct query | On registration/update |
| `atc_codes` | code, level, description, parent_code | Direct query | MOH-controlled, infrequent |
| `critical_medicines` | id, atc_code, designation_date, reason, status | Direct query | MOH Tier 1 only |

### Interface Specification

```typescript
// VCI accesses RMM data via direct table queries
// RLS policies enforce company isolation automatically

// Example: Get company's active SKUs for submission
interface RMM_VCI_GetCompanySKUs {
  input: {
    company_id: UUID;
    status?: 'active' | 'inactive' | 'all';
  };
  output: {
    skus: Array<{
      id: UUID;
      sku_code: string;
      product_id: UUID;
      product_name: string;
      dosage_strength: string;
      dosage_form: string;
      pack_size: number;
      unit_of_measure: string;
      is_critical: boolean;
    }>;
  };
}
```

### Validation Rules

| Rule ID | Description | Enforcement |
|---------|-------------|-------------|
| RMM-VCI-V001 | SKU must be active for new submissions | VCI validates `skus.status = 'active'` |
| RMM-VCI-V002 | Company must be active | VCI validates `companies.status = 'active'` |
| RMM-VCI-V003 | Product must belong to company | FK constraint `products.company_id` |
| RMM-VCI-V004 | SKU must belong to product | FK constraint `skus.product_id` |

### Error Handling

| Error Code | Description | VCI Response |
|------------|-------------|--------------|
| `RMM_COMPANY_NOT_FOUND` | Company ID doesn't exist | Reject submission |
| `RMM_SKU_INACTIVE` | SKU is not active | Reject submission |
| `RMM_PRODUCT_MISMATCH` | Product doesn't belong to company | Reject submission |

### Performance SLA

- Query latency: < 100ms for single company's SKUs
- Availability: 99.9% (database-level)

---

## Contract 2: VCI → ECS

### Contract ID: `VCI-ECS-001`

**Provider:** VCI (Value Chain Intelligence)  
**Consumer:** ECS (Export Control System)  
**Type:** Read-Only Data Access + Threshold Modification

### Data Provided (VCI → ECS)

| Table | Fields | Access Pattern | Purpose |
|-------|--------|----------------|---------|
| `msq_submissions` | id, sku_id, company_id, year, month, opening_stock, closing_stock, received, sold, submission_data | Direct query, last X months | XAMS calculation |
| `thresholds` | id, sku_id, threshold_type, threshold_value, effective_date, is_current | Direct query | Current threshold lookup |

### Interface Specification

```typescript
// ECS reads MSQ data for XAMS calculation
interface VCI_ECS_GetMSQHistory {
  input: {
    sku_id: UUID;
    months: number; // Default: 6 (configurable via system_config)
  };
  output: {
    msq_data: Array<{
      year: number;
      month: number;
      closing_stock: number;
      sold: number;
    }>;
    xams: number; // Calculated average
    data_completeness: 'complete' | 'partial' | 'insufficient';
  };
}

// RPC function for XAMS calculation
// Function: ecs_calculate_xams(p_sku_id UUID, p_months INT DEFAULT 6)
// Returns: { xams: NUMERIC, data_months: INT, is_sufficient: BOOLEAN }
```

### Data Modified (ECS → VCI)

| Table | Operation | Purpose |
|-------|-----------|---------|
| `thresholds` | INSERT | Create ECS threshold after export authorization |

### Threshold Switching Contract

```typescript
// When export is authorized, ECS creates new threshold in VCI
interface ECS_VCI_ThresholdSwitch {
  trigger: 'export_authorization_approved';
  action: {
    // Creates new threshold record
    table: 'thresholds';
    operation: 'INSERT';
    data: {
      sku_id: UUID;
      threshold_type: 'ecs_threshold';
      threshold_value: number; // XAMS × 3 or XAMS × 3.5
      source_export_authorization_id: UUID;
      effective_date: Date;
      expiry_date: Date; // effective_date + 3 months
      is_current: true;
    };
    side_effects: [
      'Set previous VCI threshold is_current = false',
      'Create audit log entry',
      'Create notification for company'
    ];
  };
  reversion: {
    trigger: 'expiry_date reached OR export_cancelled';
    action: 'Revert to VCI threshold (is_current swap)';
  };
}
```

### Validation Rules

| Rule ID | Description | Enforcement |
|---------|-------------|-------------|
| VCI-ECS-V001 | Minimum 3 months MSQ data for XAMS | ECS validates data completeness |
| VCI-ECS-V002 | MSQ data must not be rejected | Filter `status != 'rejected'` |
| VCI-ECS-V003 | Only one ECS threshold active per SKU | Unique constraint on `sku_id + is_current + threshold_type` |

### Error Handling

| Error Code | Description | ECS Response |
|------------|-------------|--------------|
| `VCI_INSUFFICIENT_MSQ` | Less than minimum months of MSQ data | Reject export request |
| `VCI_THRESHOLD_CONFLICT` | ECS threshold already active | Use existing or error |
| `VCI_MSQ_GAPS` | Missing months in MSQ history | Warning + proceed with available data |

### Performance SLA

- XAMS calculation: < 200ms
- Threshold switch: < 500ms (transaction)

---

## Contract 3: VCI → CMC

### Contract ID: `VCI-CMC-001`

**Provider:** VCI (Value Chain Intelligence)  
**Consumer:** CMC (Compliance Monitoring Center)  
**Type:** Read-Only Data Access (Scheduled + Event-Triggered)

### Data Provided

| Table | Fields | Purpose in CMC |
|-------|--------|----------------|
| `wsl_submissions` | id, company_id, sku_id, week_ending_date, stock_level, status, submitted_at | Regulatory Reporting Compliance Rate |
| `msq_submissions` | id, company_id, sku_id, year, month, opening_stock, closing_stock, status | Data Quality Signals |
| `aams_submissions` | id, company_id, year, projected_needs, submission_data, status | Annual compliance factor |
| `breaches` | id, company_id, sku_id, breach_type, severity, detected_at, resolved_at | Stock Threshold Violation Frequency |
| `thresholds` | id, sku_id, threshold_type, threshold_value, is_current | Threshold context for breach analysis |

### Interface Specification

```typescript
// CMC monthly score calculation
interface VCI_CMC_GetComplianceData {
  input: {
    company_id: UUID;
    score_period: { year: number; month: number };
    lookback_months: number; // Default: 12
  };
  output: {
    wsl_compliance: {
      expected_submissions: number;
      actual_submissions: number;
      on_time_submissions: number;
      rate: number; // 0-100
    };
    msq_compliance: {
      expected_submissions: number;
      actual_submissions: number;
      data_quality_score: number; // 0-100
    };
    aams_compliance: {
      submitted: boolean;
      on_time: boolean;
      accuracy_score: number; // 0-100 (compared to actuals)
    };
    breach_metrics: {
      total_breaches: number;
      high_severity_breaches: number;
      resolved_breaches: number;
      avg_resolution_days: number;
    };
  };
}

// RPC function: cmc_get_vci_compliance_data(p_company_id UUID, p_year INT, p_month INT)
// Returns: JSON with compliance metrics from VCI data
```

### Validation Rules

| Rule ID | Description | Enforcement |
|---------|-------------|-------------|
| VCI-CMC-V001 | Only approved/submitted data used for scoring | Filter `status IN ('approved', 'submitted')` |
| VCI-CMC-V002 | Breaches older than scoring period excluded | Filter by `detected_at >= scoring_period_start` |
| VCI-CMC-V003 | Data must be from company's active SKUs | Join with active SKUs only |

### Performance SLA

- Monthly batch calculation: < 30 seconds for all companies
- Single company calculation: < 2 seconds

---

## Contract 4: ECS → CMC

### Contract ID: `ECS-CMC-001`

**Provider:** ECS (Export Control System)  
**Consumer:** CMC (Compliance Monitoring Center)  
**Type:** Read-Only Data Access

### Data Provided

| Table | Fields | Purpose in CMC |
|-------|--------|----------------|
| `export_authorizations` | id, company_id, sku_id, status, authorized_at, quantity, valid_until | Export Compliance component |
| `replenishment_schedules` | id, export_authorization_id, scheduled_date, actual_date, quantity, status | Replenishment Plan Adherence |

### Interface Specification

```typescript
interface ECS_CMC_GetExportCompliance {
  input: {
    company_id: UUID;
    score_period: { year: number; month: number };
  };
  output: {
    export_metrics: {
      authorized_exports: number;
      completed_exports: number;
      cancelled_exports: number;
      expired_exports: number;
    };
    replenishment_adherence: {
      scheduled_replenishments: number;
      on_time_replenishments: number;
      late_replenishments: number;
      missed_replenishments: number;
      adherence_rate: number; // 0-100
    };
    export_compliance_score: number; // 0-100
  };
}
```

### Module Activation Handling

```typescript
// CMC must handle ECS module being inactive
if (!isModuleActive('ECS')) {
  // Skip Export Compliance component
  // Redistribute component weights to other factors
  return {
    export_compliance_score: null,
    export_metrics: null,
    component_excluded: true,
    reason: 'ECS_MODULE_INACTIVE'
  };
}
```

---

## Contract 5: CMC → ECS (Bidirectional)

### Contract ID: `CMC-ECS-001`

**Provider:** CMC (Compliance Monitoring Center)  
**Consumer:** ECS (Export Control System)  
**Type:** Read-Only Data Access for Conditional Validation

### Data Provided

| Table | Fields | Purpose in ECS |
|-------|--------|----------------|
| `compliance_scores` | id, company_id, score_month, overall_score, component_scores | Conditional validation for auto-approval |

### Interface Specification

```typescript
// ECS reads CMC scores for conditional validation
interface CMC_ECS_GetComplianceScore {
  input: {
    company_id: UUID;
    as_of_date?: Date; // Default: current date
  };
  output: {
    current_score: number; // 0-100
    score_date: Date;
    score_tier: 'high' | 'medium' | 'low';
    auto_approval_eligible: boolean;
    tier2_verification_required: boolean;
  };
}

// Conditional validation rules in ECS
interface ECS_ConditionalValidation {
  rules: [
    { score_range: [0, 59], auto_approval: false, tier2_required: true, label: 'low' },
    { score_range: [60, 74], auto_approval: true, tier2_required: true, label: 'medium' },
    { score_range: [75, 100], auto_approval: true, tier2_required: false, label: 'high' }
  ];
}
```

### Module Activation Handling

```typescript
// ECS must handle CMC module being inactive
if (!isModuleActive('CMC')) {
  // Default to standard auto-approval rules (no conditional validation)
  return {
    current_score: null,
    auto_approval_eligible: true, // Standard approval
    tier2_verification_required: false, // Based on other rules
    conditional_validation_skipped: true,
    reason: 'CMC_MODULE_INACTIVE'
  };
}
```

---

## Contract 6: RMM → ECS

### Contract ID: `RMM-ECS-001`

**Provider:** RMM (Registry Management Module)  
**Consumer:** ECS (Export Control System)  
**Type:** Read-Only Data Access

### Data Provided

| Table | Fields | Purpose in ECS |
|-------|--------|----------------|
| `companies` | id, name, registration_number, license_number, company_type, status | Export request validation |
| `products` | id, company_id, name, atc_code, status | Export request validation |
| `skus` | id, product_id, company_id, sku_code, dosage_strength, pack_size, status | Export request validation |
| `critical_medicines` | atc_code, designation_date | Critical medicine export rules |

### Validation Rules

| Rule ID | Description | Enforcement |
|---------|-------------|-------------|
| RMM-ECS-V001 | SKU must be active | ECS validates `skus.status = 'active'` |
| RMM-ECS-V002 | Company must have valid license | ECS validates `companies.license_number IS NOT NULL` |
| RMM-ECS-V003 | Critical medicines have stricter export rules | ECS checks `critical_medicines` table |

---

## Contract 7: RMM → CMC

### Contract ID: `RMM-CMC-001`

**Provider:** RMM (Registry Management Module)  
**Consumer:** CMC (Compliance Monitoring Center)  
**Type:** Read-Only Data Access

### Data Provided

| Table | Fields | Purpose in CMC |
|-------|--------|----------------|
| `companies` | id, name, registration_number, company_type, status | Company context for scoring |
| `products` | id, company_id, atc_code | Product context for compliance |
| `skus` | id, product_id, company_id, status | SKU count for compliance denominator |
| `critical_medicines` | atc_code | Critical medicine weighting in scores |

### Validation Rules

| Rule ID | Description | Enforcement |
|---------|-------------|-------------|
| RMM-CMC-V001 | Only active companies scored | Filter `companies.status = 'active'` |
| RMM-CMC-V002 | Only active SKUs count toward compliance | Filter `skus.status = 'active'` |

---

## Cross-Cutting Concerns

### Audit Logging

All cross-module operations must create audit log entries:

```sql
-- Audit log entry for cross-module operations
INSERT INTO audit_logs (
  table_name,
  record_id,
  action,
  old_data,
  new_data,
  user_id,
  metadata
) VALUES (
  '{affected_table}',
  '{record_id}',
  '{INSERT|UPDATE|DELETE}',
  '{old_data_json}',
  '{new_data_json}',
  auth.uid(),
  jsonb_build_object(
    'source_module', '{source_module}',
    'target_module', '{target_module}',
    'contract_id', '{contract_id}',
    'operation_type', '{operation_type}'
  )
);
```

### RLS Enforcement

All direct database access enforces RLS policies:
- Company users: See only their company's data
- MOH Tier 1/2: See all data (system-wide)
- Service role (scheduled jobs): Bypasses RLS, must be audit-logged

### Transaction Boundaries

Cross-module operations that modify data must be transactional:

```sql
BEGIN;
  -- All modifications in single transaction
  -- Rollback on any failure
COMMIT;
```

### Error Propagation

Errors from provider modules must be properly propagated:

```typescript
interface ModuleError {
  source_module: 'RMM' | 'VCI' | 'ECS' | 'CMC';
  contract_id: string;
  error_code: string;
  message: string;
  recoverable: boolean;
  retry_after?: number; // seconds
}
```

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-12 | Oliver | Initial contract definitions |

---

## Related Documents

- [Module Dependency Diagram](../modules/module-dependency-diagram.md)
- [Integration Architecture](integration-architecture.md)
- [RPC Functions](../api/rpc-functions.md)
- [System Architecture](../system-architecture.md)

---

**Next Review Date:** [To be scheduled]  
**Owner:** Oliver (Chief Architect)
