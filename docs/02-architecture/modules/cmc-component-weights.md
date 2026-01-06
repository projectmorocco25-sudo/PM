# CMC Component Weights - Default Configuration

**Purpose:** This document defines the default component weights for CMC (Compliance Monitoring Center) score calculation, including rationale and weight normalization logic.

**Last Updated:** 2025-01-01  
**Status:** 📋 Proposal - Pending Stakeholder Review  
**Owner:** Fatima (Business Analyst)  
**Reviewers:** MOH Tier 1, Oliver (Chief Architect)

## Overview

The CMC compliance score is calculated as a weighted average of multiple component factors. Component weights are configurable by MOH Tier 1, but default weights are provided for initial system deployment. Weights must sum to 100% for all active components.

## Component List

The CMC score includes up to 7 components:

1. **Regulatory Reporting Compliance Rate** (`regulatory_reporting`)
2. **Stock Threshold Violation Frequency** (`stock_threshold_violation`)
3. **Replenishment Plan Adherence & Viability Score** (`replenishment_adherence`) - *Conditional: ECS module only*
4. **Aggregate Non-Compliance Exposure** (`non_compliance_exposure`)
5. **Data Quality Signals** (`data_quality`)
6. **Critical Medicine Coverage** (`critical_medicine_coverage`)
7. **Export Compliance** (`export_compliance`) - *Conditional: ECS module only*

## Default Component Weights

### Scenario 1: ECS Module Active (7 Components)

| Component | Weight | Rationale |
|-----------|--------|-----------|
| **1. Regulatory Reporting Compliance Rate** | **25%** | **Highest Priority** - Core regulatory requirement. Weekly submissions (AAMS, MSQ, WSL) are mandatory and form the foundation of all compliance monitoring. |
| **2. Stock Threshold Violation Frequency** | **20%** | **High Priority** - Directly impacts supply chain stability and public health. Measures how frequently companies fail to maintain minimum stock levels. |
| **3. Critical Medicine Coverage** | **20%** | **High Priority** - Critical medicines are designated by MOH as essential for public health. This component tracks coverage and availability of these high-priority products. |
| **4. Aggregate Non-Compliance Exposure** | **15%** | **Medium-High Priority** - Measures sustained regulatory risk over time (12-month SKU-days of non-compliance). Provides cumulative risk assessment. |
| **5. Data Quality Signals** | **10%** | **Medium Priority** - Foundation for accurate reporting. Measures completeness, accuracy, and timeliness of submitted data. Lower weight as it's a supporting metric. |
| **6. Replenishment Plan Adherence** | **5%** | **Lower Priority** - Conditional on ECS activation. Measures fulfillment of committed replenishment dates and planning horizon viability. Lower weight as it's part of export workflow. |
| **7. Export Compliance** | **5%** | **Lower Priority** - Conditional on ECS activation. Measures export authorization compliance and replenishment adherence. Lower weight as it's part of export workflow. |
| **Total** | **100%** | |

### Scenario 2: ECS Module Inactive (5 Components)

| Component | Weight | Rationale |
|-----------|--------|-----------|
| **1. Regulatory Reporting Compliance Rate** | **30%** | **Highest Priority** - Increased weight when ECS factors removed. Core regulatory requirement remains the top priority. |
| **2. Stock Threshold Violation Frequency** | **25%** | **High Priority** - Increased weight when ECS factors removed. Directly impacts supply chain stability. |
| **3. Critical Medicine Coverage** | **25%** | **High Priority** - Increased weight when ECS factors removed. Critical medicines remain a regulatory priority. |
| **4. Aggregate Non-Compliance Exposure** | **15%** | **Medium-High Priority** - Maintains same weight. Measures sustained regulatory risk over time. |
| **5. Data Quality Signals** | **5%** | **Lower Priority** - Reduced weight when ECS factors removed. Foundation metric but not primary driver. |
| **Total** | **100%** | |

## Weight Normalization Logic

### Active Component Detection

1. **Always Active Components:**
   - Regulatory Reporting Compliance Rate
   - Stock Threshold Violation Frequency
   - Aggregate Non-Compliance Exposure
   - Data Quality Signals
   - Critical Medicine Coverage

2. **Conditionally Active Components:**
   - **Replenishment Plan Adherence:** Only if ECS module is active
   - **Export Compliance:** Only if ECS module is active

### Weight Calculation Rules

1. **Default Weight Application:**
   - System applies default weights based on active modules
   - If ECS is active: Use Scenario 1 weights (7 components)
   - If ECS is inactive: Use Scenario 2 weights (5 components)

2. **Tier 1 Customization:**
   - MOH Tier 1 can override default weights via System Configuration UI
   - Custom weights must sum to 100% for all active components
   - Weight validation: Minimum 5%, Maximum 40% per component
   - Changes are logged in audit trail

3. **Weight Normalization:**
   - If custom weights don't sum to 100%, system normalizes proportionally
   - Example: If weights sum to 120%, each weight is divided by 1.2
   - Normalization is logged in audit trail

4. **Module Activation Changes:**
   - When ECS is activated: System adds Replenishment Plan Adherence (5%) and Export Compliance (5%)
   - When ECS is deactivated: System removes ECS components and redistributes weights
   - Redistribution options:
     - **Option A:** Use Scenario 2 fixed weights (recommended)
     - **Option B:** Redistribute proportionally among remaining components

## Component Definitions

### 1. Regulatory Reporting Compliance Rate (25-30%)

**Definition:** Percentage of mandatory weekly stock reports submitted within regulatory deadline over the past 12 months.

**Calculation:** `((On-time + Late) / Total Expected) × 100`

**Data Sources:**
- AAMS submissions (annual)
- MSQ submissions (monthly)
- WSL submissions (weekly)

**Time Window:** 12-month rolling window

**Rationale for Weight:** This is the foundation of regulatory compliance. All other metrics depend on timely and complete data submission.

---

### 2. Stock Threshold Violation Frequency (20-25%)

**Definition:** Average count of SKUs per reporting cycle that fail to meet minimum stock requirements, calculated over the last 6 months.

**Calculation:** Average of (SKUs below threshold per cycle) over 6 months

**Data Sources:**
- WSL submissions
- Threshold calculations (B × AAMS or C × XAMS)
- Breach detection

**Time Window:** 6-month rolling average

**Rationale for Weight:** Directly measures supply chain stability and public health risk. Frequent violations indicate systemic issues.

---

### 3. Critical Medicine Coverage (20-25%)

**Definition:** Coverage percentage and critical SKU tracking for medicines designated as critical by MOH.

**Calculation:** *Formulas to be defined in Phase 1.3.1.9a*

**Data Sources:**
- Critical medicines designation (RMM)
- Stock levels for critical SKUs
- Coverage metrics

**Time Window:** *To be defined*

**Rationale for Weight:** Critical medicines are designated as essential for public health. Ensuring adequate coverage is a regulatory priority.

---

### 4. Aggregate Non-Compliance Exposure (15%)

**Definition:** Total SKU-days of threshold non-compliance accumulated across all products over the past 12 months, providing a measure of sustained regulatory risk.

**Calculation:** Sum of (SKU-days below threshold) over 12 months

**Data Sources:**
- WSL submissions
- Threshold calculations
- Breach duration tracking

**Time Window:** 12-month rolling sum

**Rationale for Weight:** Measures cumulative risk over time. A company with many short violations may score differently than one with fewer but longer violations.

---

### 5. Data Quality Signals (5-10%)

**Definition:** Composite metric evaluating completeness, accuracy, and timeliness of submitted data.

**Calculation:** *Formulas to be defined in Phase 1.3.1.8a*
- Completeness metrics
- Accuracy metrics
- Timeliness metrics

**Data Sources:**
- Submission validation results
- Data completeness checks
- Format validation
- Historical pattern comparisons

**Time Window:** *To be defined*

**Rationale for Weight:** Foundation for accurate reporting, but lower weight as it's a supporting metric rather than a primary compliance indicator.

---

### 6. Replenishment Plan Adherence (5%) - *ECS Only*

**Definition:** Composite metric evaluating (1) historical fulfillment of committed replenishment dates, and (2) proportion of future commitments within acceptable planning horizons (≤ 3 months standard, > 4.5 months flagged).

**Calculation:** *Formulas to be defined in Phase 1.3.1.6a*
- Historical fulfillment percentage
- Future commitment horizon calculation
- Composite score

**Data Sources:**
- Export authorizations (ECS)
- Replenishment schedules (ECS)
- Replenishment completion records

**Time Window:** *To be defined*

**Rationale for Weight:** Lower weight as it's conditional on ECS activation and part of the export workflow. Important for export compliance but not core to general compliance monitoring.

---

### 7. Export Compliance (5%) - *ECS Only*

**Definition:** Composite metric evaluating export authorization compliance and replenishment adherence.

**Calculation:** *Formulas to be defined in Phase 1.3.1.10a*
- Export authorization compliance
- Replenishment adherence

**Data Sources:**
- Export requests (ECS)
- Export authorizations (ECS)
- Replenishment schedules (ECS)

**Time Window:** *To be defined*

**Rationale for Weight:** Lower weight as it's conditional on ECS activation and part of the export workflow. Important for export compliance but not core to general compliance monitoring.

## Implementation Notes

### Database Schema

Component weights are stored in the `compliance_score_components` table:

```sql
component_weight numeric(5,2) NOT NULL
```

- Weights stored as decimal values (e.g., 25.00, 20.00, 15.00)
- Sum of active component weights must equal 100.00

### Configuration Storage

Default weights are stored in system configuration:

- **Location:** `system_config` table, `module_name = 'cmc'`
- **Format:** JSONB in `config_data` field
- **Structure:**
  ```json
  {
    "component_weights": {
      "regulatory_reporting": 25.00,
      "stock_threshold_violation": 20.00,
      "replenishment_adherence": 5.00,
      "non_compliance_exposure": 15.00,
      "data_quality": 10.00,
      "critical_medicine_coverage": 20.00,
      "export_compliance": 5.00
    },
    "default_scenario": "ecs_active" // or "ecs_inactive"
  }
  ```

### Weight Calculation Function

The total CMC score is calculated as:

```
Total Score = Σ (Component Score × Component Weight) / Σ Component Weights
```

Where:
- Component Score: 0-100 scale for each component
- Component Weight: Weight percentage for each active component
- Sum of weights: Must equal 100% (normalized if needed)

### UI Visibility

- **MOH Tier 1:** See all component weights, can modify via System Configuration
- **MOH Tier 2:** See component weights (read-only, may be anonymized)
- **Companies:** Component weights hidden (formulas/weights hidden to prevent gaming)

## Stakeholder Review Questions

1. **Critical Medicine Coverage Weight:**
   - Should Critical Medicine Coverage have equal weight (20-25%) or higher weight than Stock Threshold Violations?
   - Rationale: Critical medicines are designated as essential, but threshold violations affect all medicines.

2. **Data Quality Signals Weight:**
   - Should Data Quality Signals be higher (e.g., 15%) given its foundational role?
   - Rationale: Poor data quality affects all other metrics, but it's currently weighted lower.

3. **Weight Redistribution Strategy:**
   - When ECS is inactive, should weights be redistributed proportionally or use fixed Scenario 2 values?
   - Recommendation: Fixed Scenario 2 values for consistency and predictability.

4. **Weight Constraints:**
   - Should there be minimum/maximum weight constraints per component?
   - Recommendation: Minimum 5%, Maximum 40% to prevent over-weighting single factors.

5. **Replenishment Plan Adherence Weight:**
   - Should Replenishment Plan Adherence have higher weight (e.g., 10%) when ECS is active?
   - Rationale: Replenishment is critical for export compliance, but it's currently weighted at 5%.

## Related Documents

- [Schema Design](../../database/schema-design.md) - `compliance_score_components` table
- [Phase 1 Implementation Plan](../../../05-project-management/phases/Phase-1-Implementation-Plan.md) - Task 1.3.1.12a (Component weight configuration)
- [CMC Wireframes](../../../04-design/user-experience/wireframes/04-cmc/README.md) - Score component visibility rules
- [RPC Functions](../../api/rpc-functions.md) - `cmc_calculate_total_score` function

## Approval Status

- [ ] **Fatima (Business Analyst):** Proposal created
- [ ] **MOH Tier 1:** Review and approval required
- [ ] **Oliver (Chief Architect):** Technical review required
- [ ] **Nadia (Database Specialist):** Schema validation required

---

**Next Steps:**
1. Stakeholder review of proposed weights
2. Finalize formulas for Data Quality, Critical Medicine Coverage, Export Compliance
3. Implement weight configuration UI (Task 1.3.1.12a)
4. Update default weights in system configuration
5. Document weight normalization logic in RPC function

