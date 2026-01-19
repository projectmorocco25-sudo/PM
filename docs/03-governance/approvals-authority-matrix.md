# Approvals Authority Matrix - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines approval authority by role and action type for all workflows in the PM platform.

**Last Updated:** 2025-12-31  
**Status:** 🟡 In Progress  
**Owner:** Project Management Team

## Overview

The PM platform implements role-based approval authority to ensure proper governance and regulatory compliance. This matrix defines who can perform, approve, or review each action type.

**Regulatory Basis:** DMP regulations, MOH administrative decisions, and role definitions documented in [Regulatory Framework](regulatory-framework.md)

## Authority Levels

- **Full Authority:** Can perform action independently
- **Approval Required:** Can initiate but requires approval
- **Review Only:** Can review but cannot approve
- **Read Only:** Can view but cannot modify
- **No Access:** Cannot access

## Role Definitions

- **Company Admin:** Full company management capabilities
- **Company Manager:** Product/SKU management
- **Company User:** View and limited submission capabilities
- **MOH DMP Tier 1:** Approver/Admin with full administrative capabilities
- **MOH DMP Tier 2 Officer:** Verification, analysis, and escalation
- **MOH DMP Tier 2 Registrar:** Implementation of approved registry changes
- **Auditor:** Read-only access for monitoring and compliance review
- **System Administrator:** Technical configuration and maintenance
- **Vendor:** Module licensing and control (activation/deactivation of license-controlled modules)

## Registry Management Authority

| Action | Company Admin | Company Manager | Company User | Tier 2 Officer | Tier 2 Registrar | Tier 1 | Auditor |
|--------|--------------|-----------------|--------------|---------------|------------------|--------|---------|
| Create Company | Submit | No Access | No Access | Verify | No Access | Approve | Read Only |
| Update Company | Submit | No Access | No Access | Verify | Implement | Approve | Read Only |
| Delete Company | No Access | No Access | No Access | No Access | No Access | Approve* | Read Only |
| Create Product | Submit | Submit | No Access | Verify | No Access | Approve | Read Only |
| Update Product | Submit | Submit | No Access | Verify | Implement | Approve | Read Only |
| Delete Product | No Access | No Access | No Access | No Access | No Access | Approve* | Read Only |
| Create SKU | Submit | Submit | Submit | Verify | No Access | Approve | Read Only |
| Update SKU | Submit | Submit | Submit | Verify | Implement | Approve | Read Only |
| Delete SKU | Submit | Submit | Submit | Verify | Implement | Approve | Read Only |
| Manage ATC Codes | Read Only | Read Only | Read Only | Full Authority | No Access | Full Authority | Read Only |
| Designate Critical Medicines | No Access | No Access | No Access | No Access | No Access | Full Authority | Read Only |

\* Requires two-person rule (Tier 1 approval + Tier 2 Officer confirmation)

## Submission Authority

| Action | Company Admin | Company Manager | Company User | Tier 2 Officer | Tier 2 Registrar | Tier 1 | Auditor |
|--------|--------------|-----------------|--------------|---------------|------------------|--------|---------|
| Submit AAMS | Submit | Submit | Submit | Verify | No Access | Approve Threshold | Read Only |
| Submit MSQ | Submit | Submit | Submit | Review Anomalies | No Access | No Access | Read Only |
| Submit WSL | Submit | Submit | Submit | Analyze Compliance Violations | No Access | Review Actions | Read Only |
| Correct MSQ | Submit | Submit | Submit | No Access | No Access | No Access | Read Only |
| View Thresholds | View | View | View | View | View | Configure | Read Only |

## Enforcement Authority

| Action | Company Admin | Company Manager | Company User | Tier 2 Officer | Tier 2 Registrar | Tier 1 | Auditor |
|--------|--------------|-----------------|--------------|---------------|------------------|--------|---------|
| Create Warning | No Access | No Access | No Access | Full Authority | No Access | Full Authority | Read Only |
| Create Fine | No Access | No Access | No Access | Submit | No Access | Approve | Read Only |
| Create Suspension | No Access | No Access | No Access | Submit | No Access | Approve | Read Only |
| Approve Enforcement | No Access | No Access | No Access | Approve Warnings | No Access | Approve All | Read Only |
| Execute Enforcement | No Access | No Access | No Access | Execute Warnings | No Access | Execute All | Read Only |
| Appeal Enforcement | Submit | Submit | Submit | Review | No Access | Final Decision | Read Only |
| View Own Enforcement | View | View | View | View All | View All | View All | Read Only |

## Export Control Authority

| Action | Company Admin | Company Manager | Company User | Tier 2 Officer | Tier 2 Registrar | Tier 1 | Auditor |
|--------|--------------|-----------------|--------------|---------------|------------------|--------|---------|
| Submit Export Request | Submit (IPC only) | Submit (IPC only) | Submit (IPC only) | Verify | No Access | Approve | Read Only |
| Approve Export | No Access | No Access | No Access | Verify (conditional) | No Access | Full Authority | Read Only |
| Auto-Approve Export | No Access | No Access | No Access | No Access | No Access | System (conditional) | Read Only |
| Intervene in Export | No Access | No Access | No Access | Flag for Intervention | No Access | Full Authority | Read Only |
| Report Export Completion | Submit | Submit | Submit | Verify | No Access | No Access | Read Only |
| Cancel Export | Submit | Submit | Submit | No Access | No Access | Approve | Read Only |

## Compliance Monitoring Authority

| Action | Company Admin | Company Manager | Company User | Tier 2 Officer | Tier 2 Registrar | Tier 1 | Auditor |
|--------|--------------|-----------------|--------------|---------------|------------------|--------|---------|
| View Own Score | View | View | View | View All | View All | View All | Read Only |
| View Leaderboard | No Access | No Access | No Access | View | View | View | Read Only |
| Dispute Score | Submit | Submit | Submit | Review | No Access | Final Decision | Read Only |
| Override Score | No Access | No Access | No Access | No Access | No Access | Full Authority | Read Only |
| Generate Reports | No Access | No Access | No Access | Review | No Access | Approve | Read Only |
| View Reports | View Own | View Own | View Own | View All | View All | View All | Read Only |

## System Configuration Authority

| Action | Company Admin | Company Manager | Company User | Tier 2 Officer | Tier 2 Registrar | Tier 1 | System Admin | Vendor |
|--------|--------------|-----------------|--------------|---------------|------------------|--------|--------------|--------|
| Configure Thresholds | No Access | No Access | No Access | Suggest | No Access | Full Authority | No Access | No Access |
| Modify Threshold (Permanent) | No Access | No Access | No Access | No Access | No Access | Full Authority | No Access | No Access |
| Modify Threshold (Temporary) | No Access | No Access | No Access | No Access | No Access | Full Authority | No Access | No Access |
| Confirm Threshold Reversion | No Access | No Access | No Access | No Access | No Access | Full Authority | No Access | No Access |
| Manually Revert Threshold | No Access | No Access | No Access | No Access | No Access | Full Authority | No Access | No Access |
| View Pending Reversions | No Access | No Access | No Access | Read Only | No Access | Full Authority | No Access | Read Only |
| Schedule Reversion Notifications | No Access | No Access | No Access | No Access | No Access | Full Authority | No Access | No Access |
| Configure Multipliers | No Access | No Access | No Access | Suggest | No Access | Full Authority | No Access | No Access |
| Configure Component Weights | No Access | No Access | No Access | No Access | No Access | Full Authority | No Access | No Access |
| Activate Modules | No Access | No Access | No Access | No Access | No Access | Full Authority | Technical Support | **Full Authority** (License-Controlled Modules) |
| Configure Intervention Windows | No Access | No Access | No Access | No Access | No Access | Full Authority | No Access | No Access |

## Audit and Reporting Authority

| Action | Company Admin | Company Manager | Company User | Tier 2 Officer | Tier 2 Registrar | Tier 1 | Auditor |
|--------|--------------|-----------------|--------------|---------------|------------------|--------|---------|
| View Audit Logs | View Own | View Own | View Own | View All | View All | View All | View All |
| Generate Audit Reports | No Access | No Access | No Access | Generate | Generate | Generate | Generate |
| View Audit Reports | View Own | View Own | View Own | View All | View All | View All | View All |

## Two-Person Rule Actions

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

## Delegation and Escalation

### Delegation
- Tier 1 can delegate approval authority to Tier 2 Officers (with audit trail)
- Delegation must be explicit and time-bound
- Delegated actions are logged with both delegator and delegatee

### Escalation
- Tier 2 Officers can escalate issues to Tier 1
- Escalation triggers priority review
- Escalated items are tracked in audit trail

## Related Documents

- [Regulatory Framework](regulatory-framework.md) - Comprehensive regulatory reference
- [Governance Workflows](governance-workflows.md)
- [Compliance Requirements](compliance-requirements.md)
- [Regulatory Policies](regulatory-policies.md)
- [Role-Based UI Patterns](../../02-architecture/frontend/role-based-ui-patterns.md)

---

**Next Review Date:** [To be scheduled]  
**Owner:** Project Management Team

