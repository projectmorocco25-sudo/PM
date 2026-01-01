# Module Dependency Diagram - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document provides a visual representation of module dependencies, data flows, and cross-module interactions.

**Last Updated:** 2025-12-31  
**Owner:** Oliver (Chief Architect)

## Module Dependency Overview

### Activation Order

```
RMM (Core - Always On)
  │
  │ Provides: Companies, Products, SKUs, ATC codes, Critical medicines
  │
  └─→ VCI (Core - Always On)
        │
        │ Requires: Companies, Products, SKUs from RMM
        │ Provides: AAMS, MSQ, WSL submissions, Thresholds, Breaches
        │
        ├─→ ECS (Optional - License Controlled)
        │     │
        │     │ Requires: Companies, Products, SKUs from RMM
        │     │ Requires: MSQ data from VCI (for XAMS calculations)
        │     │ Provides: Export requests, Export authorizations
        │     │
        │     └─→ Impacts VCI: Threshold switching (VCI Threshold → ECS Threshold)
        │
        └─→ CMC (Optional - License Controlled)
              │
              │ Requires: Companies, Products, SKUs from RMM
              │ Requires: WSL, MSQ, AAMS data from VCI
              │ Provides: Compliance scores, Disputes, Regulatory reports
              │
              ├─→ Enhanced if ECS active: Includes export compliance in scoring
              │
              └─→ Impacts ECS: Conditional validation (scores determine auto-approval eligibility)
```

## Detailed Module Dependencies

### RMM (Registry Management Module)
**Status:** Core Module - Always On  
**Activation:** Must be activated first (foundation)

**Provides to other modules:**
- `companies` - Company registry
- `products` - Product registry
- `skus` - SKU registry
- `atc_codes` - ATC code registry (MOH-controlled)
- `critical_medicines` - Critical medicine designations (MOH-controlled)

**Dependencies:**
- None (foundation module)

**Data Ownership:**
- Owns all registry entities
- Other modules reference but do not modify

---

### VCI (Value Chain Intelligence)
**Status:** Core Module - Always On  
**Activation:** Must be activated second (after RMM)

**Requires from RMM:**
- `companies` - To associate submissions with companies
- `products` - To associate submissions with products
- `skus` - To associate submissions with SKUs

**Provides to other modules:**
- `msq_submissions` - To ECS (for XAMS calculations)
- `wsl_submissions` - To CMC (for compliance scoring)
- `msq_submissions` - To CMC (for compliance scoring)
- `aams_submissions` - To CMC (for compliance scoring)
- `thresholds` - To ECS (for threshold switching)

**Dependencies:**
- RMM (required)

**Data Ownership:**
- Owns all submission data and thresholds
- Other modules read but do not modify

**Cross-Module Impacts:**
- **From ECS:** When export authorized, VCI threshold switches from VCI Threshold to ECS Threshold
- **To CMC:** Provides data for compliance score calculations

---

### ECS (Export Control System)
**Status:** Optional Module - License Controlled  
**Activation:** Can be activated after RMM and VCI are active

**Requires from RMM:**
- `companies` - To associate export requests with companies
- `products` - To associate export requests with products
- `skus` - To associate export requests with SKUs

**Requires from VCI:**
- `msq_submissions` - For XAMS calculations (default X=6 months)

**Requires from CMC (when active):**
- `compliance_scores` - For conditional validation
  - Score < 60: Auto-approval disabled
  - Score 60-74: Tier 2 verification required
  - Score 75+: Standard auto-approval

**Provides to other modules:**
- `export_authorizations` - To CMC (triggers score recalculation)
- `export_compliance_data` - To CMC (for compliance scoring)

**Dependencies:**
- RMM (required)
- VCI (required)
- CMC (optional - enhances functionality)

**Data Ownership:**
- Owns export requests, authorizations, replenishment schedules
- Other modules read but do not modify

**Cross-Module Impacts:**
- **To VCI:** Authorization triggers threshold switch (VCI Threshold → ECS Threshold)
- **To CMC:** Authorization triggers score recalculation (event-triggered)

---

### CMC (Compliance Monitoring Center)
**Status:** Optional Module - License Controlled  
**Activation:** Can be activated after RMM and VCI are active

**Requires from RMM:**
- `companies` - To associate compliance scores with companies
- `products` - For product-related compliance factors
- `skus` - For SKU-related compliance factors

**Requires from VCI:**
- `wsl_submissions` - For Regulatory Reporting Compliance Rate
- `msq_submissions` - For compliance scoring
- `aams_submissions` - For compliance scoring
- `breaches` - For Stock Threshold Violation Frequency

**Requires from ECS (when active):**
- `export_authorizations` - For Export Compliance component
- `replenishment_schedules` - For Replenishment Plan Adherence component

**Provides to other modules:**
- `compliance_scores` - To ECS (for conditional validation)

**Dependencies:**
- RMM (required)
- VCI (required)
- ECS (optional - enhances functionality)

**Data Ownership:**
- Owns compliance scores, disputes, regulatory reports
- Other modules read but do not modify

**Cross-Module Impacts:**
- **To ECS:** Compliance scores determine auto-approval eligibility (conditional validation)

---

## Data Flow Diagram

### VCI → ECS Data Flow
```
VCI (MSQ Submissions)
  │
  │ Provides: MSQ data for last X months (default X=6)
  │
  └─→ ECS (XAMS Calculation)
        │
        │ Calculates: XAMS = Average of MSQ over X months
        │ Uses: ECS Threshold = XAMS × factor (3 or 3.5)
```

### VCI → CMC Data Flow
```
VCI (Submissions & Breaches)
  │
  ├─→ WSL Submissions → CMC (Regulatory Reporting Compliance Rate)
  ├─→ MSQ Submissions → CMC (Data Quality Signals)
  ├─→ AAMS Submissions → CMC (Compliance scoring)
  └─→ Breaches → CMC (Stock Threshold Violation Frequency)
```

### ECS → CMC Data Flow
```
ECS (Export Data)
  │
  ├─→ Export Authorizations → CMC (Export Compliance component)
  └─→ Replenishment Schedules → CMC (Replenishment Plan Adherence component)
```

### CMC → ECS Data Flow
```
CMC (Compliance Scores)
  │
  │ Provides: Current compliance score (0-100)
  │
  └─→ ECS (Conditional Validation)
        │
        │ Uses score to determine:
        │ - Auto-approval eligibility
        │ - Tier 2 verification requirement
        │ - Manual review requirement
```

### ECS → VCI Impact Flow
```
ECS (Export Authorization)
  │
  │ State: approved → authorized
  │
  └─→ VCI (Threshold Switch)
        │
        │ Action: Switch SKU threshold
        │ - From: VCI Threshold
        │ - To: ECS Threshold
        │ - Duration: 3 calendar months
        │
        │ VCI Impact:
        │ - Dashboard uses ECS Threshold for this SKU
        │ - Breach detection uses ECS Threshold
        │ - Threshold status indicator updated
```

### ECS → CMC Impact Flow
```
ECS (Export Authorization)
  │
  │ State: approved → authorized
  │
  └─→ CMC (Score Recalculation)
        │
        │ Trigger: Event-triggered recalculation
        │ Updates: Export Compliance component
        │ Method: Edge Function or RPC function
```

## Module Activation Matrix

| Module | Requires | Can Activate After | Enhanced By |
|--------|----------|---------------------|-------------|
| RMM | None | System start | None |
| VCI | RMM | RMM active | None |
| ECS | RMM + VCI | RMM + VCI active | CMC (when active) |
| CMC | RMM + VCI | RMM + VCI active | ECS (when active) |

## Cross-Module Event Triggers

### Event: ECS Export Authorization
**Trigger:** Export request transitions to `authorized` state

**Impacts:**
1. **VCI:** SKU threshold switches from VCI Threshold to ECS Threshold
2. **CMC:** Compliance score recalculation triggered (event-triggered)

### Event: CMC Score Calculation
**Trigger:** Monthly scheduled calculation or event-triggered

**Impacts:**
1. **ECS:** Compliance scores used for conditional validation on new export requests

### Event: VCI Breach Detection
**Trigger:** Stock level falls below threshold

**Impacts:**
1. **CMC:** High-priority breaches trigger enhanced monitoring workflows

## Module Communication Patterns

### Pattern 1: Direct Database Access
- **Method:** Modules access shared tables directly via Supabase client
- **Security:** RLS policies enforce data boundaries
- **Performance:** No network overhead, fast queries
- **Use case:** Standard module-to-module data access

### Pattern 2: RPC Functions (Cross-Module Calculations)
- **Method:** RPC functions marked as SECURITY DEFINER
- **Security:** Runs with creator's permissions, audit logged
- **Performance:** Efficient for complex calculations
- **Use case:** CMC score calculation (reads from VCI and ECS)

### Pattern 3: Service Role (Scheduled Jobs)
- **Method:** Scheduled jobs use Supabase service role key
- **Security:** Bypasses RLS, comprehensive audit logging
- **Performance:** Efficient for bulk operations
- **Use case:** Monthly compliance score calculation (reads all VCI data)

## Related Documents

- [System Architecture](../system-architecture.md)
- [Technical Decision Log](../../06-development/technical-decisions/decision-log.md)
- [Project Brief](../../00-overview/Project%20Brief%20–%20PM.md)

---

**Next Review Date:** [To be scheduled]  
**Owner:** Oliver (Chief Architect)

