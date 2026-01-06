# Regulatory Policies - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines regulatory policies, guidelines, and standards that govern the PM platform operations.

**Last Updated:** 2025-12-31  
**Status:** 🟡 In Progress  
**Owner:** Project Management Team

## Overview

The PM platform operates under Moroccan pharmaceutical regulations and MOH policies. This document outlines the regulatory policies that govern system operations, data handling, and compliance enforcement.

## Regulatory Framework

### Applicable Laws and Regulations

The PM platform operates under multiple layers of regulatory requirements:

- **Law No. 09-08:** Protection of Personal Data (February 18, 2009) - CNDP
- **Cloud Services Regulation:** Cloud services regulation for critical infrastructures (October 2024)
- **DMP Regulations:** Directorate of Medicines and Pharmacy circulars, directives, and administrative decisions
- **MOH Regulations:** Ministry of Health administrative decisions and directives
- **Customs Regulations:** Moroccan customs regulations (for export control)
- **International Standards:** WHO ATC Classification System

**Comprehensive Reference:** See [Regulatory Framework](regulatory-framework.md) for detailed regulatory references.

### Regulatory Basis for Policies

Each policy section in this document is based on regulatory requirements:
- **Data Handling:** Law No. 09-08 (CNDP), DMP data management requirements
- **Submission Policies:** DMP circulars/directives (to be validated with MOH)
- **Threshold Policies:** DMP administrative decisions (to be validated with MOH)
- **Enforcement Policies:** DMP regulations and legal authority (to be validated with MOH)
- **Export Control:** Customs regulations and DMP export authorization requirements
- **Compliance Scoring:** MOH/DMP compliance monitoring requirements
- **Audit and Reporting:** DMP regulatory reporting requirements

**Note:** Specific regulatory references (DMP circulars, directives, administrative decisions) are to be obtained from MOH DMP and documented in the [Regulatory Framework](regulatory-framework.md).

## Data Handling Policies

**Regulatory Basis:** Law No. 09-08 (CNDP), DMP data management requirements

### Data Classification

- **Public Data:** Publicly accessible information (homepage, about pages)
- **Company Data:** Company-specific information (submissions, compliance scores)
- **MOH Data:** MOH-only information (enforcement actions, internal notes)
- **Sensitive Data:** Audit logs, security events, system configuration

### Data Access Policies

- **Role-Based Access:** Access controlled by user role and permissions
- **Read-Only Access:** Auditors have read-only access to audit logs and reports
- **MOH-Only Access:** ATC codes and critical medicine designations are MOH-controlled
- **Company Scoping:** Companies can only access their own data

### Data Retention Policies

- **Minimum Retention:** 7 years for audit logs and operational data
- **Archive Policy:** Data older than 7 years may be archived but must remain accessible
- **Deletion Policy:** Data deletion requires Tier 1 approval and mandatory justification

## Submission Policies

**Regulatory Basis:** DMP circulars/directives on submission requirements (to be validated with MOH)

### AAMS Submission Policy

- **Frequency:** Annual submission (once per year in January)
- **Coverage:** Previous calendar year (January-December)
- **Deadline:** January 31st of following year
- **Grace Period:** February 1-15 (marked as late, no penalty)
- **Late Policy:** Submissions after February 15th trigger compliance alerts
- **Escalation:** Submissions more than 30 days late subject to Tier 1 review

### MSQ Submission Policy

- **Frequency:** Monthly submission
- **Deadline:** End of month following reporting month
- **Correction Window:** 7 calendar days after initial submission
- **Validation:** Automated validation against AAMS (20% threshold)
- **Anomaly Detection:** Flagged for Tier 2 review if anomalies detected

### WSL Submission Policy

- **Frequency:** Weekly submission
- **Deadline:** Friday EOD for week ending that Friday
- **Submission Window:** Monday-Friday 17:00 (5:00 PM) Morocco time
- **Completeness:** All SKUs must be included in single submission
- **Late Policy:** Saturday-Monday EOD accepted but marked as late
- **Non-Compliance:** After Monday EOD flagged as non-compliant

## Threshold Policies

**Regulatory Basis:** DMP administrative decisions on threshold calculation methodologies (to be validated with MOH)

### VCI Threshold Policy

- **Calculation:** Multiplier × AAMS
- **Standard Products:** Default multiplier 3 (configurable by Tier 1)
- **Critical Medicines:** Default multiplier 3.5 (configurable by Tier 1)
- **Modification:** Tier 1 can modify locally (per-SKU) or globally (system-wide)
- **Non-Retroactive:** Threshold modifications apply only to future calculations

### ECS Threshold Policy

- **Calculation:** Multiplier × XAMS (X Months Average Monthly Sales)
- **X Value:** Default 6 months (configurable 3-12 months by Tier 1)
- **Standard Products:** Default multiplier 3
- **Critical Medicines:** Default multiplier 3.5
- **Threshold Switching:** Switches from VCI to ECS Threshold upon export authorization
- **Revertion:** Reverts to VCI Threshold after 3 calendar months or upon cancellation

## Enforcement Policies

**Regulatory Basis:** DMP regulations and legal authority for enforcement actions (to be validated with MOH)

### Enforcement Action Types

- **Warning:** Non-compliance notice (Tier 2 can approve)
- **Fine:** Monetary penalty (requires Tier 1 approval)
- **Suspension:** Temporary suspension of privileges (requires Tier 1 approval)

### Enforcement Justification Policy

- **Mandatory Justification:** All Tier 1 enforcement actions require justification
- **Minimum Length:** 50 characters required
- **Supporting Evidence:** References to supporting evidence required
- **Regulatory Basis:** Regulatory basis must be documented
- **Immutable Logging:** Justifications logged immutably in audit trail

### Two-Person Rule Policy

The following actions require Tier 1 approval plus Tier 2 Officer confirmation:
- Company suspension
- Company deletion
- Product deactivation (critical medicines)
- Product deletion

**Rationale:** Ensures critical actions have dual oversight and reduces risk of errors or abuse.

### Appeal Policy

- **Appeal Period:** 30 calendar days from execution date
- **Appeal Authority:** Tier 1 reviews all appeals
- **Appeal Process:** In-system case thread linked to enforcement action
- **Appeal Outcome:** Tier 1 makes final decision (uphold or reject)

## Export Control Policies

**Regulatory Basis:** Customs regulations and DMP export authorization requirements (to be validated with customs and MOH)

### Export Authorization Policy

- **Validity Period:** 90 calendar days from approval date
- **Extension Requests:** Up to 30 additional days, subject to Tier 1 approval
- **Completion Reporting:** Must be reported within 7 days of actual export
- **Expiration:** Authorizations expire automatically if not completed within validity period

### Conditional Validation Policy

Export requests are subject to conditional validation based on:
- **CMC Compliance Score:** 
  - Score < 60: Full manual review (auto-approval disabled)
  - Score 60-74: Tier 2 verification before auto-approval
  - Score ≥ 75: Standard auto-approval
- **Risk Factors:** Multiple risk factors may require manual review

### Replenishment Schedule Policy

- **Requirement:** Export requests that reduce stock below threshold require replenishment schedules
- **Verification:** Tier 2 Officers verify replenishment schedules before Tier 1 approval
- **Adherence:** Replenishment schedules must be adhered to
- **Escalation:** Delays trigger tiered escalation process (days 1, 2-7, 8-14, 15+)

## Compliance Scoring Policies

**Regulatory Basis:** MOH/DMP compliance monitoring requirements (to be validated with MOH)

### Score Calculation Policy

- **Frequency:** Monthly scheduled calculation
- **Event Triggers:** High/critical breaches, enforcement actions, ECS approvals
- **Component Weights:** Configurable by Tier 1
- **Score Range:** 0-100 scale
- **Frozen Snapshots:** Monthly scores stored as frozen snapshots

### Score Disclosure Policy

- **Company View:** Companies see exact score plus category-level improvement tips
- **Formula Protection:** Formulas and weights not exposed to prevent gaming
- **Standing Indicator:** Companies see anonymized standing (percentile or rank band)
- **Leaderboard Access:** Tier 1 sees full leaderboard, Tier 2 sees scores for oversight

### Dispute Policy

- **Dispute Window:** 30 days from score publication
- **Dispute Scope:** Can dispute total score or specific components
- **Review Process:** Tier 2 reviews, Tier 1 makes final decision
- **Adjustment Notes:** If upheld, Tier 1 creates adjustment note (preserves original snapshot)

## Audit and Reporting Policies

**Regulatory Basis:** DMP regulatory reporting requirements, Law No. 09-08 (CNDP) audit requirements

### Audit Logging Policy

- **Completeness:** 100% audit trail for all system activities
- **Retention:** Minimum 7 years retention
- **Immutability:** Audit logs are immutable once written
- **Access:** Auditors have read-only access to audit logs

### Regulatory Reporting Policy

- **Frequency:** Monthly, quarterly, and annual reports
- **Generation:** System generates report drafts automatically
- **Review Process:** Tier 2 Officers review for completeness
- **Approval Process:** Tier 1 approves report release
- **Deadline Tracking:** System tracks deadlines and sends reminders (7 days, 3 days, deadline day)

## System Configuration Policies

### Module Activation Policy

- **Activation Order:** RMM → VCI → (ECS) → (CMC)
- **Core Modules:** RMM and VCI are always on
- **Optional Modules:** ECS and CMC can be activated independently
- **Activation Authority:** Tier 1 controls module activation

### Configuration Authority Policy

- **Tier 1 Authority:** Tier 1 can configure all system parameters
- **Threshold Configuration:** Tier 1 can modify multipliers and X values
- **Component Weights:** Tier 1 can configure CMC component weights
- **Intervention Windows:** Tier 1 can configure ECS intervention windows

## Related Documents

- [Regulatory Framework](regulatory-framework.md) - Comprehensive regulatory reference
- [Compliance Requirements](compliance-requirements.md) - Detailed compliance requirements
- [Governance Workflows](governance-workflows.md)
- [Approvals Authority Matrix](approvals-authority-matrix.md)

---

**Next Review Date:** [To be scheduled]  
**Owner:** Project Management Team

