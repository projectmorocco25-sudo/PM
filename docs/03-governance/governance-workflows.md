# Governance Workflows - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document describes all governance workflows, approval processes, and decision-making authority in the PM platform.

**Last Updated:** 2025-12-31  
**Status:** 🟡 In Progress  
**Owner:** Project Management Team

## Overview

The PM platform implements structured governance workflows to ensure regulatory compliance, data integrity, and proper oversight. All workflows follow defined approval chains with clear authority levels and audit trails.

**Regulatory Basis:** DMP regulations, MOH administrative decisions, and regulatory requirements documented in [Regulatory Framework](regulatory-framework.md)

## Workflow Principles

1. **Clear Authority:** Each action has defined approval authority
2. **Audit Trail:** All workflow steps are logged immutably
3. **Two-Person Rule:** Critical actions require dual approval
4. **Escalation Paths:** Clear escalation for exceptions and disputes
5. **Time-Bound:** Workflows have defined timeframes and deadlines

## Registry Management Workflows

### Company Registration Workflow

**Workflow:** Company Admin submits → Tier 2 Officer verifies → Tier 1 approves → Tier 2 Registrar implements

1. **Submission:** Company Admin creates company registration request
2. **Verification:** Tier 2 Officer reviews and verifies information
3. **Approval:** Tier 1 reviews and approves/rejects
4. **Implementation:** Tier 2 Registrar implements approved changes
5. **Confirmation:** System confirms completion to Tier 1

**Timeframes:**
- Verification: 3 working days
- Approval: 2 working days
- Implementation: 1 working day

### Product/SKU Registration Workflow

**Workflow:** Company Manager submits → Tier 2 Officer verifies → Tier 1 approves → Tier 2 Registrar implements

1. **Submission:** Company Manager creates product/SKU registration request
2. **Verification:** Tier 2 Officer reviews and verifies information
3. **Approval:** Tier 1 reviews and approves/rejects
4. **Implementation:** Tier 2 Registrar implements approved changes
5. **Confirmation:** System confirms completion to Tier 1

**Timeframes:**
- Verification: 2 working days
- Approval: 2 working days
- Implementation: 1 working day

### Critical Actions (Two-Person Rule)

The following actions require Tier 1 approval plus Tier 2 Officer confirmation:
- Company suspension
- Company deletion
- Product deactivation (critical medicines)
- Product deletion

**Workflow:**
1. Tier 1 initiates action with mandatory justification
2. Tier 2 Officer confirms action (separate from Tier 1)
3. System executes action only after both approvals
4. Action logged with both approver identities

## Submission Workflows

### AAMS Submission Workflow

**Workflow:** Company submits → Tier 2 verifies → Tier 1 approves threshold

1. **Submission:** Company submits AAMS data by January 31st
2. **Verification:** Tier 2 Officer verifies data and calculates threshold
3. **Approval:** Tier 1 approves threshold determination
4. **Notification:** Company notified of approved threshold

**Deadlines:**
- Submission deadline: January 31st
- Grace period: February 1-15 (marked as late, no penalty)
- Non-compliance: After February 15th (triggers alerts and compliance impact)

### MSQ Submission Workflow

**Workflow:** Company submits → Automated validation → Auto-accept or Tier 2 review

1. **Submission:** Company submits MSQ data monthly
2. **Validation:** System performs completeness and format checks
3. **Anomaly Detection:** System compares against AAMS (20% threshold)
4. **Acceptance:** Auto-accept if valid, or flag for Tier 2 review if anomalies detected
5. **Correction Window:** 7-day grace period for corrections

### WSL Submission Workflow

**Workflow:** Company submits → Automated validation → Breach detection → Tier 2 analysis

1. **Submission:** Company submits WSL data weekly (by Friday EOD)
2. **Validation:** System validates completeness (all SKUs required)
3. **Threshold Check:** System compares stock levels against thresholds
4. **Breach Detection:** System flags breaches for Tier 2 analysis
5. **Analysis:** Tier 2 Officer analyzes breaches (3 days standard, 1 day critical)

**Deadlines:**
- Submission deadline: Friday EOD
- Late acceptance: Saturday-Monday EOD (marked as late)
- Non-compliance: After Monday EOD (triggers alerts)

## Enforcement Workflows

### Enforcement Action Creation Workflow

**Workflow:** Tier 2 creates → Tier 1 approves → Execution → Appeal period

1. **Creation:** Tier 2 Officer creates enforcement action (Warning/Fine/Suspension)
2. **Review:** Tier 2 Officer reviews and submits for approval
3. **Approval:** Tier 1 approves/rejects with feedback
4. **Execution:** Action executed upon approval
5. **Appeal:** Company has 30 days to appeal (appeals reviewed by Tier 1)

**Authority:**
- Warnings: Tier 2 can approve independently
- Fines: Require Tier 1 approval
- Suspensions: Require Tier 1 approval

### Breach Analysis Workflow

**Workflow:** System detects breach → Tier 2 analyzes → Tier 1 reviews → Action taken

1. **Detection:** System automatically detects threshold breaches
2. **Analysis:** Tier 2 Officer analyzes breach (3 days standard, 1 day critical)
3. **Recommendation:** Tier 2 suggests action from standardized list
4. **Review:** Tier 1 reviews recommendation and approves/rejects/takes independent action
5. **Execution:** Approved action executed
6. **Tracking:** Action tracked with compliance score impact

**Timeframes:**
- Standard breach analysis: 3 working days
- Critical breach analysis: 1 working day
- Tier 1 review: 2 working days

## Export Control Workflows

### Export Authorization Workflow

**Workflow:** Company submits → Conditional validation → Auto-approval or manual review → Authorization

1. **Submission:** Company submits export request with supporting documentation
2. **Validation:** System performs conditional validation (CMC score, risk factors)
3. **Routing:**
   - Score < 60: Full manual review (auto-approval disabled)
   - Score 60-74: Tier 2 verification before auto-approval
   - Score ≥ 75: Standard auto-approval queue
4. **Intervention Window:** Tier 1 can intervene within 2 working days (configurable)
5. **Approval:** Auto-approval if no intervention, or manual approval
6. **Authorization:** Export authorized for 90 calendar days

### Export Completion Workflow

**Workflow:** Company reports completion → Tier 2 verifies → System updates

1. **Reporting:** Company reports export completion within 7 days
2. **Verification:** Tier 2 Officer verifies against customs data (when available)
3. **Confirmation:** System confirms completion and updates records
4. **Threshold Reversion:** Threshold reverts to VCI Threshold after 3 months

## Compliance Monitoring Workflows

### Compliance Score Calculation Workflow

**Workflow:** Scheduled calculation → Component scores → Total score → Tier 2 review → Tier 1 override (if needed)

1. **Calculation:** System calculates monthly compliance scores (scheduled)
2. **Components:** System calculates weighted component scores
3. **Total Score:** System calculates total score (0-100 scale)
4. **Review:** Tier 2 Officers review and flag anomalies
5. **Override:** Tier 1 can override scores with justification
6. **Publication:** Scores published to companies (with category tips, not formulas)

**Triggers:**
- Monthly scheduled calculation
- Event-triggered (high/critical breaches, enforcement actions, ECS approvals)

### Dispute Resolution Workflow

**Workflow:** Company disputes → Tier 2 reviews → Tier 1 decides → Adjustment note (if upheld)

1. **Dispute:** Company files dispute within 30 days of score publication
2. **Review:** Tier 2 Officer reviews dispute and forwards to Tier 1
3. **Decision:** Tier 1 makes final decision (uphold or reject)
4. **Adjustment:** If upheld, Tier 1 creates adjustment note (preserves original snapshot)
5. **Notification:** Company notified of decision

## Approval Authority Matrix

See [Approvals Authority Matrix](approvals-authority-matrix.md) for detailed authority by role and action type.

## Related Documents

- [Regulatory Framework](regulatory-framework.md) - Comprehensive regulatory reference
- [Compliance Requirements](compliance-requirements.md)
- [Regulatory Policies](regulatory-policies.md)
- [Workflow Architecture](../../02-architecture/workflow-architecture.md)
- [Audit Logging Specification](../../02-architecture/security/audit-logging-spec.md)

---

**Next Review Date:** [To be scheduled]  
**Owner:** Project Management Team

