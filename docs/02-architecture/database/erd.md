# Entity Relationship Diagram - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document provides a text-based Entity Relationship Diagram (ERD) showing all entities and their relationships.

**Last Updated:** 2025-12-31  
**Status:** ✅ Complete (Phase 0, Week 2)  
**Owner:** Nadia

## ERD Overview

This ERD shows all entities, their attributes, and relationships. The diagram is organized by module for clarity.

## Legend

- `PK` = Primary Key
- `FK` = Foreign Key
- `1` = One
- `M` = Many
- `*` = Many
- `? = Optional (nullable)
- ! = required (not null)

## Core Entities

```
users
├── PK: id (uuid)
├── company_id (uuid, FK → companies.id, nullable)
├── role (text, required)
└── ...

system_config
├── PK: id (uuid)
├── module_name (text, unique)
└── ...

notifications
├── PK: id (uuid)
├── FK: user_id → users.id
└── ...

audit_logs
├── PK: id (uuid)
├── FK: user_id → users.id (nullable)
└── ...
```

## RMM Module Entities

```
companies (1) ──< (M) products
├── PK: id
├── registration_number (unique)
└── company_type

products (1) ──< (M) skus
├── PK: id
├── FK: company_id → companies.id
└── is_critical_medicine

skus
├── PK: id
├── FK: product_id → products.id
├── FK: atc_code_id → atc_codes.id (nullable)
└── ...

atc_codes (1) ──< (M) skus
├── PK: id
└── code (unique)

critical_medicines
├── PK: id
├── FK: sku_id → skus.id
└── ...

registry_submissions
├── PK: id
├── FK: submitted_by → users.id
├── FK: verified_by → users.id (nullable)
├── FK: approved_by → users.id (nullable)
├── FK: implemented_by → users.id (nullable)
└── entity_id (nullable, references various entities)

approvals
├── PK: id
├── FK: submission_id → registry_submissions.id (nullable)
├── FK: approver_id → users.id
└── ...
```

## VCI Module Entities

```
companies (1) ──< (M) aams_submissions
├── PK: id
└── ...

aams_submissions
├── PK: id
├── FK: company_id → companies.id
├── FK: submitted_by → users.id
├── FK: verified_by → users.id (nullable)
├── FK: approved_by → users.id (nullable)
├── FK: correction_of → aams_submissions.id (nullable)
└── year

companies (1) ──< (M) msq_submissions
├── PK: id
└── ...

msq_submissions
├── PK: id
├── FK: company_id → companies.id
├── FK: submitted_by → users.id
├── FK: correction_of → msq_submissions.id (nullable)
└── year, month

companies (1) ──< (M) wsl_submissions
├── PK: id
└── ...

wsl_submissions
├── PK: id
├── FK: company_id → companies.id
├── FK: submitted_by → users.id
└── week_ending_date

skus (1) ──< (M) thresholds
├── PK: id
└── ...

thresholds
├── PK: id
├── FK: sku_id → skus.id (nullable, NULL = global)
├── threshold_type (vci, ecs)
└── effective_from, effective_to

skus (1) ──< (M) breaches
├── PK: id
└── ...

companies (1) ──< (M) breaches
├── PK: id
└── ...

breaches
├── PK: id
├── FK: sku_id → skus.id
├── FK: company_id → companies.id
├── FK: wsl_submission_id → wsl_submissions.id
├── FK: threshold_id → thresholds.id
└── status

breaches (1) ──< (M) breach_analyses
├── PK: id
└── ...

breach_analyses
├── PK: id
├── FK: breach_id → breaches.id
├── FK: analyzed_by → users.id
└── ...
```

## ECS Module Entities

```
companies (1) ──< (M) export_requests
├── PK: id
└── ...

skus (1) ──< (M) export_requests
├── PK: id
└── ...

export_requests
├── PK: id
├── FK: company_id → companies.id
├── FK: sku_id → skus.id
├── FK: submitted_by → users.id
├── FK: verified_by → users.id (nullable)
├── FK: approved_by → users.id (nullable)
└── status

export_requests (1) ──< (1) export_authorizations
├── PK: id
└── ...

export_authorizations
├── PK: id
├── FK: export_request_id → export_requests.id
├── authorization_number (unique)
└── status

export_authorizations (1) ──< (M) export_completions
├── PK: id
└── ...

export_completions
├── PK: id
├── FK: export_authorization_id → export_authorizations.id
├── FK: reported_by → users.id
├── FK: verified_by → users.id (nullable)
└── ...

export_authorizations (1) ──< (M) replenishment_schedules
├── PK: id
└── ...

replenishment_schedules
├── PK: id
├── FK: export_authorization_id → export_authorizations.id
├── FK: verified_by → users.id (nullable)
└── ...
```

## CMC Module Entities

```
companies (1) ──< (M) compliance_scores
├── PK: id
└── ...

compliance_scores
├── PK: id
├── FK: company_id → companies.id
├── score_period (YYYY-MM)
└── UNIQUE (company_id, score_period)

compliance_scores (1) ──< (M) compliance_score_components
├── PK: id
└── ...

compliance_score_components
├── PK: id
├── FK: compliance_score_id → compliance_scores.id
└── component_name

compliance_scores (1) ──< (M) compliance_score_adjustments
├── PK: id
└── ...

compliance_score_adjustments
├── PK: id
├── FK: compliance_score_id → compliance_scores.id
├── FK: adjusted_by → users.id (Tier 1 only)
└── ...

compliance_scores (1) ──< (M) disputes
├── PK: id
└── ...

disputes
├── PK: id
├── FK: compliance_score_id → compliance_scores.id
├── FK: submitted_by → users.id
├── FK: reviewed_by → users.id (nullable)
├── FK: resolved_by → users.id (nullable)
└── status

regulatory_reports
├── PK: id
├── FK: generated_by → users.id (nullable)
├── FK: reviewed_by → users.id (nullable)
├── FK: approved_by → users.id (nullable)
└── status
```

## Key Relationships Summary

### User-Company Relationship
```
users
├── company_id (nullable)
│   ├── If set: Company user (belongs to one company)
│   └── If NULL: MOH user (system-wide access)
└── role
```

### Company Hierarchy
```
companies (1) ──< (M) products (1) ──< (M) skus
```

### Submission Relationships
```
companies (1) ──< (M) aams_submissions
companies (1) ──< (M) msq_submissions
companies (1) ──< (M) wsl_submissions
```

### Threshold Relationships
```
skus (1) ──< (M) thresholds (nullable sku_id = global threshold)
thresholds ──< (M) breaches
```

### Export Relationships
```
companies (1) ──< (M) export_requests
skus (1) ──< (M) export_requests
export_requests (1) ──< (1) export_authorizations
export_authorizations (1) ──< (M) export_completions
export_authorizations (1) ──< (M) replenishment_schedules
```

### Compliance Relationships
```
companies (1) ──< (M) compliance_scores
compliance_scores (1) ──< (M) compliance_score_components
compliance_scores (1) ──< (M) compliance_score_adjustments
compliance_scores (1) ──< (M) disputes
```

## Cross-Module Data Flows

### VCI → ECS
```
msq_submissions (VCI) ──> XAMS calculation ──> ECS Threshold ──> export_requests (ECS)
```

### VCI → CMC
```
wsl_submissions (VCI) ──> Regulatory Reporting Compliance Rate ──> compliance_scores (CMC)
msq_submissions (VCI) ──> Data Quality Signals ──> compliance_scores (CMC)
aams_submissions (VCI) ──> Compliance scoring ──> compliance_scores (CMC)
breaches (VCI) ──> Stock Threshold Violation Frequency ──> compliance_scores (CMC)
```

### ECS → CMC
```
export_authorizations (ECS) ──> Export Compliance component ──> compliance_scores (CMC)
replenishment_schedules (ECS) ──> Replenishment Plan Adherence ──> compliance_scores (CMC)
```

### CMC → ECS
```
compliance_scores (CMC) ──> Conditional validation ──> export_requests (ECS)
```

### ECS → VCI
```
export_authorizations (ECS) ──> Threshold switch trigger ──> thresholds (VCI)
```

## Cardinality Summary

| Relationship | Cardinality | Notes |
|--------------|-------------|-------|
| companies → products | 1:M | One company has many products |
| products → skus | 1:M | One product has many SKUs |
| companies → aams_submissions | 1:M | One company has many AAMS submissions |
| companies → msq_submissions | 1:M | One company has many MSQ submissions |
| companies → wsl_submissions | 1:M | One company has many WSL submissions |
| skus → thresholds | 1:M | One SKU has many threshold versions |
| skus → breaches | 1:M | One SKU can have many breaches |
| companies → export_requests | 1:M | One company has many export requests |
| skus → export_requests | 1:M | One SKU can have many export requests |
| export_requests → export_authorizations | 1:1 | One request becomes one authorization |
| export_authorizations → export_completions | 1:M | One authorization can have multiple completions |
| export_authorizations → replenishment_schedules | 1:M | One authorization can have multiple replenishment schedules |
| companies → compliance_scores | 1:M | One company has many monthly scores |
| compliance_scores → compliance_score_components | 1:M | One score has many components |
| compliance_scores → compliance_score_adjustments | 1:M | One score can have multiple adjustments |
| compliance_scores → disputes | 1:M | One score can have multiple disputes |
| users → companies | M:1 (nullable) | Many users belong to one company (or NULL for MOH) |

## Related Documents

- [Database Schema Design](schema-design.md)
- [Data Dictionary](data-dictionary.md)
- [RLS Policy Framework Design](../../security/rls-policy-framework.md)
- [Regulatory Framework](../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference
- [Compliance Requirements](../../../03-governance/compliance-requirements.md) - Detailed compliance requirements
- [Regulatory Policies](../../../03-governance/regulatory-policies.md) - Regulatory policies and guidelines
- [Technical Decision Log](../../../06-development/technical-decisions/decision-log.md)

---

**Next Review Date:** [To be scheduled]  
**Owner:** Nadia

