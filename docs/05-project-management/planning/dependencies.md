# Module Dependencies

**Last Updated:** 2026-01-15

---

## Module Dependency Chain

```
Core Foundation
    ↓
RMM (Registry Management Module)
    ↓
VCI (Value Chain Intelligence Module)
    ↓
ECS (Export Control System)
    ↓
CMC (Compliance Monitoring Center)
```

---

## Core Foundation Dependencies

### No Dependencies
- Authentication & Access Control
- Dashboard & Navigation
- Communications
- Global Pages

**Used By:**
- All modules (RMM, VCI, ECS, CMC)

---

## RMM Module Dependencies

### Depends On
- ✅ Core Foundation (Authentication, Navigation, Dashboard)

### Used By
- **VCI Module:**
  - Companies, Products, SKUs data
  - ATC codes
  - Critical medicines
  
- **ECS Module:**
  - Companies, Products, SKUs data
  - Registry submission data
  
- **CMC Module:**
  - Companies, Products, SKUs data
  - Registry submission data
  - Enforcement actions data

---

## VCI Module Dependencies

### Depends On
- ✅ **RMM Module:**
  - Companies table
  - Products table
  - SKUs table
  - ATC codes table
  - Critical medicines table

### Used By
- **ECS Module:**
  - Thresholds (VCI Threshold → ECS Threshold switching)
  - AAMS submissions (for XAMS calculation)
  - MSQ submissions (for XAMS calculation)
  - WSL submissions (for stock level validation)
  - Breaches (for compliance validation)
  
- **CMC Module:**
  - Thresholds (for compliance scoring)
  - AAMS, MSQ, WSL submissions (for compliance scoring)
  - Breaches (for compliance scoring)

### Integration Points
- **Threshold Switching:** VCI thresholds used for ECS threshold calculation
- **Stock Level Validation:** WSL data used in ECS export evaluation
- **Compliance Scoring:** All VCI data feeds into CMC score calculation

---

## ECS Module Dependencies

### Depends On
- ✅ **RMM Module:**
  - Companies, Products, SKUs
  
- ✅ **VCI Module:**
  - Thresholds (for threshold switching)
  - AAMS submissions (for XAMS calculation)
  - MSQ submissions (for XAMS calculation)
  - WSL submissions (for stock level validation)

### Used By
- **CMC Module:**
  - Export authorizations (for export compliance scoring)
  - Replenishment schedules (for replenishment adherence scoring)
  - Export requests (for compliance scoring)

### Integration Points
- **Threshold Switching:** On export authorization, VCI Threshold → ECS Threshold
- **XAMS Calculation:** Uses AAMS and MSQ data for ECS threshold calculation
- **Compliance Scoring:** Export data feeds into CMC scoring

---

## CMC Module Dependencies

### Depends On
- ✅ **RMM Module:**
  - Companies
  - Enforcement actions
  
- ✅ **VCI Module:**
  - Thresholds
  - AAMS, MSQ, WSL submissions
  - Breaches
  
- ✅ **ECS Module:** (if active)
  - Export authorizations
  - Replenishment schedules
  - Export requests

### Used By
- **ECS Module:** (if CMC active)
  - Compliance scores (for conditional export validation)

### Integration Points
- **Export Validation:** If CMC active and score < 70%, export request validation affected
- **All Module Data:** CMC aggregates data from all modules for compliance scoring

---

## Data Flow Dependencies

### Registry Submission → Threshold Calculation
**RMM → VCI**
- Company/Product/SKU registration creates entities
- AAMS submission calculates thresholds based on sales data

### Threshold Switching
**VCI → ECS**
- Export authorization triggers threshold switch
- VCI Threshold → ECS Threshold (3 months)
- Auto-revert after 3 months

### Compliance Scoring
**All Modules → CMC**
- RMM: Submission timeliness
- VCI: Threshold compliance, breach frequency
- ECS: Export compliance, replenishment adherence

### Enforcement Actions
**RMM → CMC**
- Enforcement actions affect compliance scoring
- Aggregate non-compliance exposure calculation

---

## Integration Checkpoints

### After Phase 1.1 (RMM Complete)
**Validation Required:**
1. **Data Model Validation (Nadia):** Verify RMM schema supports VCI requirements
2. **RLS Policy Validation (Rafi):** Verify RLS policies allow VCI module access to RMM data
3. **API Contract Validation (Maya):** Verify RPC functions provide data VCI needs
4. **Seed Data Validation (Farah):** Verify seed data covers VCI test scenarios

**Gate:** Phase 1.2 (VCI) cannot start until all 4 validations pass.

---

### After Phase 1.2 (VCI Complete)
**Validation Required:**
1. **Data Model Validation (Nadia):** Verify VCI schema supports ECS requirements
2. **RLS Policy Validation (Rafi):** Verify RLS policies allow ECS module access to VCI data
3. **API Contract Validation (Maya):** Verify threshold switching contract works
4. **Seed Data Validation (Farah):** Verify seed data covers ECS test scenarios

**Gate:** Phase 1.3 (ECS) cannot start until all 4 validations pass.

---

### After Phase 1.3 (ECS Complete)
**Validation Required:**
1. **Data Model Validation (Nadia):** Verify ECS schema supports CMC requirements
2. **RLS Policy Validation (Rafi):** Verify RLS policies allow CMC module access to ECS data
3. **API Contract Validation (Maya):** Verify RPC functions provide data CMC needs
4. **Seed Data Validation (Farah):** Verify seed data covers CMC test scenarios

**Gate:** Phase 1.4 (CMC) cannot start until all 4 validations pass.

---

## Critical Dependencies

### Must Complete Before VCI
- ✅ RMM Companies, Products, SKUs tables and RPC functions
- ✅ ATC codes data
- ✅ Critical medicines data

### Must Complete Before ECS
- ✅ VCI Thresholds table and management
- ✅ AAMS and MSQ submissions (for XAMS calculation)
- ✅ WSL submissions (for stock validation)

### Must Complete Before CMC
- ✅ All module data sources
- ✅ VCI thresholds and breaches
- ✅ ECS export authorizations (if ECS active)

---

## Dependency Risks

### Risk 1: Integration Issues
**Mitigation:** Clear integration checkpoints, module integration contracts defined  
**Contingency:** Additional integration testing time

### Risk 2: Data Model Mismatches
**Mitigation:** Schema audit complete, integration contracts defined  
**Contingency:** Schema adjustments in Phase 1.5 if needed

### Risk 3: API Contract Changes
**Mitigation:** API contracts defined in Phase 0  
**Contingency:** Version API contracts, backward compatibility

---

**Reference:** [Feature Dependency Matrix](../../02-architecture/feature-index.md#feature-dependency-matrix), [Module Integration Contracts](../../02-architecture/integration/module-integration-contracts.md)
