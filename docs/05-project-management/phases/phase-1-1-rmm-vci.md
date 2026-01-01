# Phase 1.1: RMM + VCI Development

**Phase:** Phase 1.1 - RMM + VCI Development  
**Duration:** 2 months (Months 2-3)  
**Status:** Not Started  
**Prerequisites:** Phase 0 (Technical Foundation) complete

## Objective

Build the core modules: Registry Management Module (RMM) and Value Chain Intelligence (VCI) module, with comprehensive mock data population for testing and demonstration.

## Scope

### RMM Module
- Company, Product, SKU registry management
- CRUD workflows with approval chains
- Two-person rule for critical actions
- Deletion safeguards
- Audit logging

### VCI Module
- AAMS submission and approval workflow
- MSQ submission with validation
- WSL submission with breach detection
- Threshold calculation (VCI Threshold = B × AAMS)
- Governance dashboard
- Tier 2 analysis and Tier 1 approval workflows

### Mock Data
- 75 mock companies (15 IPCs + 60 Wholesalers)
- 2-3 years of historical data (AAMS, MSQ, WSL)
- Diverse company profiles and scenarios

## Deliverables

1. RMM module functional
2. VCI module functional
3. Mock data populated (75 companies)
4. Internal testing completed
5. Documentation for RMM + VCI

## Success Criteria

- All RMM workflows functional (CRUD, approval chains, two-person rule)
- All VCI workflows functional (submissions, threshold calculation, breach detection)
- Mock data successfully populated
- Internal testing passed
- Documentation complete

## Related Documents

- [Project Plan](../project-plan.md)
- [RMM Architecture](../../02-architecture/modules/rmm-architecture.md) (to be created)
- [VCI Architecture](../../02-architecture/modules/vci-architecture.md) (to be created)
- [Mock Data Strategy](../../07-testing/mock-data/mock-data-strategy.md) (to be created)

---

**Next Phase:** [Phase 1.2: ECS Development](phase-1-2-ecs.md)  
**Status:** Not Started

