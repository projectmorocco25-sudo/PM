# Compliance Requirements - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines all compliance requirements, regulatory obligations, and mandatory reporting requirements for the PM platform.

**Last Updated:** 2025-12-31  
**Status:** 🟡 In Progress  
**Owner:** Project Management Team

## Overview

The PM platform must comply with Moroccan pharmaceutical regulations and MOH requirements. This document outlines all compliance requirements that the system must meet and enforce.

## Regulatory Compliance Requirements

### CNDP Compliance Requirements (Law No. 09-08)

**Legal Basis:** Law No. 09-08 on Protection of Personal Data (February 18, 2009)  
**Governing Body:** National Control Commission for the Protection of Personal Data (CNDP)

#### Lawful Basis for Data Processing

All personal data processing activities must have a lawful basis under Law No. 09-08:
- **Company Registration Data:** Processing necessary for regulatory compliance and public health oversight
- **User Account Data:** Processing necessary for system access and role-based permissions
- **Submission Data (AAMS, MSQ, WSL):** Processing necessary for regulatory reporting and stock sufficiency monitoring
- **Enforcement Data:** Processing necessary for regulatory enforcement and compliance monitoring
- **Audit Logs:** Processing necessary for regulatory audit and compliance verification

#### Data Subject Rights

Under Law No. 09-08, data subjects (companies and users) have the following rights:
- **Right of Access:** Companies and users can access their personal data
- **Right of Rectification:** Companies and users can request correction of inaccurate data
- **Right of Erasure:** Companies and users can request deletion of data (subject to regulatory retention requirements)
- **Right of Objection:** Companies and users can object to certain data processing activities

**Implementation:**
- System provides data export functionality for access requests
- System supports data correction workflows through registry update processes
- Data deletion subject to regulatory retention requirements (minimum 7 years)
- Objection requests reviewed by MOH DMP Tier 1

#### Data Security and Confidentiality

- **Encryption:** All personal data encrypted in transit (TLS/HTTPS) and at rest
- **Access Controls:** Role-based access control ensures only authorized personnel access personal data
- **Audit Logging:** All access to personal data logged for compliance verification
- **Data Breach Notification:** Procedures in place for notifying CNDP and affected data subjects in case of data breach

#### Data Processing Principles

- **Lawfulness:** All data processing has lawful basis
- **Purpose Limitation:** Data processed only for specified regulatory purposes
- **Data Minimization:** Only necessary data collected and processed
- **Accuracy:** Data kept accurate and up-to-date
- **Storage Limitation:** Data retained only as long as necessary (minimum 7 years per regulatory requirements)
- **Integrity and Confidentiality:** Appropriate security measures in place

**Reference:** [Regulatory Framework](regulatory-framework.md) - Law No. 09-08

### Cloud Services Regulation Compliance (2024)

**Enactment Date:** October 22, 2024  
**Compliance Deadline:** 24 months from enactment (October 2026)  
**Status:** 🟡 Compliance in progress

#### Qualification Requirements

- **Provider:** Supabase (cloud service provider)
- **Qualification Level Required:** Level 2 (for processing and storing sensitive data)
- **Qualification Status:** To be confirmed with Supabase and validated against Moroccan regulations

#### Provider Requirements

Supabase must meet the following requirements:
- **Moroccan Law:** Provider must operate under Moroccan law or have appropriate legal framework
- **Local Infrastructure:** Data residency and infrastructure requirements to be validated
- **Staff Integrity:** Provider must ensure staff integrity and security clearances
- **Data Security:** Provider must secure data and prevent unauthorized access
- **Audit Compliance:** Provider must comply with audits and regulatory inspections

#### Compliance Actions

- **Risk Assessment:** Conduct risk assessment for cloud services usage
- **Qualification Validation:** Validate Supabase qualification status
- **Data Residency:** Confirm data residency meets regulatory requirements
- **Compliance Tracking:** Track progress toward 24-month compliance deadline
- **Documentation:** Document all compliance measures and validations

#### Compliance Deadline Tracking

- **Enactment Date:** October 22, 2024
- **Compliance Deadline:** October 22, 2026 (24 months)
- **Current Status:** Compliance measures in progress
- **Next Review:** [To be scheduled - Quarterly reviews until deadline]

**Reference:** [Regulatory Framework](regulatory-framework.md) - Cloud Services Regulation

### Data Retention Requirements

- **Audit Logs:** Minimum 7 years retention for all system activities
- **Operational Data:** Minimum 7 years retention for AAMS, MSQ, WSL, export authorizations, compliance scores
- **Historical Data:** Data older than 7 years may be archived but must remain accessible for regulatory review

### Reporting Deadlines

#### AAMS (Annual Average Monthly Sales)
- **Submission Deadline:** January 31st of following year (covering previous calendar year Jan-Dec)
- **Grace Period:** February 1-15 (marked as late, no penalty)
- **Non-Compliance:** After February 15th (triggers alerts and compliance score impact)
- **Escalation:** Submissions more than 30 days late (after March 1st) subject to Tier 1 review

#### MSQ (Monthly Sales Quantities)
- **Submission Deadline:** End of month following reporting month
- **Correction Window:** 7 calendar days after initial submission
- **Validation:** Automated validation against AAMS (20% threshold for anomaly detection)

#### WSL (Weekly Stock Levels)
- **Submission Deadline:** Friday EOD (end of business day) for week ending that Friday
- **Submission Window:** Monday-Friday 17:00 (5:00 PM) Morocco time
- **Late Acceptance:** Saturday-Monday EOD (marked as late, accepted)
- **Non-Compliance:** After Monday EOD (flagged as non-compliant, triggers alerts)

### Threshold Compliance Requirements

- **VCI Threshold:** Minimum stock quantity required (multiplier × AAMS)
  - Standard products: Default multiplier 3
  - Critical medicines: Default multiplier 3.5
- **ECS Threshold:** Minimum stock quantity for exports (multiplier × XAMS)
  - Standard products: Default multiplier 3
  - Critical medicines: Default multiplier 3.5
- **Threshold Violations:** Must be reported with breach reason and replenishment date

### Export Authorization Compliance

- **Authorization Validity:** 90 calendar days from approval date
- **Completion Reporting:** Must be reported within 7 days of actual export
- **Extension Requests:** Up to 30 additional days, subject to Tier 1 approval
- **Replenishment Schedules:** Must be adhered to, delays trigger escalation

### Enforcement Action Compliance

- **Appeal Period:** 30 calendar days from execution date
- **Justification Required:** All Tier 1 enforcement actions require mandatory justification (minimum 50 characters)
- **Two-Person Rule:** Critical actions (suspension, deletion, critical medicine deactivation) require Tier 1 + Tier 2 Officer confirmation

## System Compliance Requirements

### Uptime Requirements

- **Target Uptime:** ≥99.5% monthly uptime
- **Business Hours Availability:** ≥99.9% during business hours (Morocco time)
- **Response Time:** Average response time <2 seconds for standard operations

### Security Compliance

- **Encryption:** TLS/HTTPS for all communications
- **Storage Encryption:** Encrypted storage for sensitive data
- **Authentication:** OAuth2 authentication required
- **Server-Side Enforcement:** All business logic and validation enforced server-side
- **Audit Logging:** Complete audit trail for all system activities

### Data Quality Requirements

- **Completeness:** 100% audit trail completeness for all system activities
- **Error Rate:** <1% data quality error rate in submissions
- **Accuracy:** 100% accuracy in threshold calculations
- **On-Time Submission:** 95% on-time submission rate for AAMS, MSQ, WSL

### Access Control Compliance

- **Role-Based Access:** All access controlled by role-based permissions
- **MOH-Only Features:** ATC codes and critical medicine designations are MOH-controlled (read-only for companies)
- **Auditor Access:** Read-only access for audit logs and compliance reports

## Company Compliance Requirements

### Registration Compliance

- **Complete Information:** Companies must provide complete registration information
- **Verification:** All company information subject to Tier 2 verification
- **Updates:** Registry updates require approval workflow

### Submission Compliance

- **Timeliness:** All submissions must meet deadlines (with grace periods as defined)
- **Completeness:** All required fields must be completed
- **Accuracy:** Data must be accurate and verifiable
- **Corrections:** Corrections must be made within defined windows

### Stock Sufficiency Compliance

- **Threshold Maintenance:** Companies must maintain stock above applicable thresholds
- **Breach Reporting:** Companies must provide breach reasons and replenishment dates
- **Replenishment:** Replenishment schedules must be adhered to

## MOH Compliance Requirements

### Review and Approval Compliance

- **Verification Timeframes:** Tier 2 Officers must verify within defined timeframes
- **Approval Timeframes:** Tier 1 must approve/reject within defined timeframes
- **Analysis Timeframes:** Breach analysis must be completed within defined timeframes (3 days standard, 1 day critical)

### Enforcement Compliance

- **Justification:** All Tier 1 enforcement actions require mandatory justification
- **Two-Person Rule:** Critical actions require dual approval
- **Appeal Review:** Appeals must be reviewed within defined timeframes

### Reporting Compliance

- **Regulatory Reports:** Monthly, quarterly, and annual reports must be generated and approved
- **Report Deadlines:** Reports must meet regulatory deadlines
- **Report Accuracy:** Reports must be accurate and complete

## Compliance Monitoring

### Compliance Score Requirements

- **Calculation Frequency:** Monthly compliance score calculation
- **Component Weights:** Configurable by Tier 1
- **Score Range:** 0-100 scale
- **Dispute Process:** 30-day dispute window from score publication

### Compliance Reporting

- **Automated Reports:** System generates regulatory reports on schedule
- **Review Process:** Tier 2 Officers review reports for completeness
- **Approval Process:** Tier 1 approves report release
- **Deadline Tracking:** System tracks regulatory deadlines and sends reminders

## Non-Compliance Consequences

### Submission Non-Compliance

- **Late Submissions:** Marked as late, impact compliance scores
- **Overdue Submissions:** Trigger automated alerts to MOH DMP Tier 2
- **Severe Overdue:** Subject to Tier 1 review and potential enforcement actions

### Threshold Violations

- **Breach Detection:** System automatically flags breaches
- **Analysis Required:** Tier 2 must analyze within defined timeframes
- **Enforcement:** May result in warnings, fines, or suspensions

### Enforcement Actions

- **Appeal Rights:** Companies have 30 days to appeal
- **Compliance Impact:** Actions impact compliance scores
- **Escalation:** Repeated violations may result in escalated actions

## Related Documents

- [Regulatory Framework](regulatory-framework.md) - Comprehensive regulatory reference
- [Governance Workflows](governance-workflows.md)
- [Regulatory Policies](regulatory-policies.md)
- [Approvals Authority Matrix](approvals-authority-matrix.md)
- [Audit Logging Specification](../../02-architecture/security/audit-logging-spec.md)

---

**Next Review Date:** [To be scheduled]  
**Owner:** Project Management Team

