# Regulatory Framework - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document provides a comprehensive reference to all applicable laws, regulations, and standards governing the PM platform.

**Last Updated:** 2025-12-31  
**Status:** 🟡 In Progress  
**Owner:** Project Management Team

## Overview

The PM platform operates under multiple layers of regulatory requirements including Moroccan national laws, DMP (Directorate of Medicines and Pharmacy) regulations, MOH (Ministry of Health) administrative decisions, and international standards. This document serves as the master reference for all regulatory requirements.

## Moroccan National Laws

### Law No. 09-08: Protection of Personal Data

**Enactment Date:** February 18, 2009  
**Governing Body:** National Control Commission for the Protection of Personal Data (CNDP)

**Key Requirements:**
- Lawful and ethical data processing
- Respect for privacy and fundamental rights
- Data subject rights (access, rectification, erasure, objection)
- Data security and confidentiality
- Notification requirements for data breaches

**Application to PM Platform:**
- All personal data processing must comply with Law No. 09-08
- Company information, user data, and submission data are subject to protection
- Audit logs containing personal data must comply with retention and access requirements
- Data processing activities must have lawful basis

**Reference:** [CNDP Official Website](https://www.cndp.ma/) - _Note: Specific URL to be confirmed_

### Cloud Services Regulation (2024)

**Enactment Date:** October 22, 2024  
**Compliance Deadline:** 24 months from enactment (October 2026)

**Key Requirements:**
- **Mandatory Qualification:** Cloud providers must be certified to handle sensitive data
- **Qualification Levels:**
  - **Level 1:** For managing sensitive information systems
  - **Level 2:** For processing and storing sensitive data
- **Provider Requirements:**
  - Must operate under Moroccan law
  - Must maintain local infrastructure
  - Must ensure staff integrity
  - Must secure data and prevent unauthorized access
  - Must comply with audits

**Application to PM Platform:**
- Supabase (cloud provider) must be qualified at appropriate level
- Data residency requirements must be met
- Risk assessment must be conducted
- Compliance tracking required for 24-month deadline

**Reference:** [Cloud Services Regulation - October 2024] - _Note: Specific reference to be obtained from MOH_

## DMP (Directorate of Medicines and Pharmacy) Regulations

### DMP Circulars and Directives

**Status:** To be populated with specific DMP circulars and directives

**Expected Areas:**
- Company registration requirements
- Product and SKU registration procedures
- Submission deadlines and requirements (AAMS, MSQ, WSL)
- Threshold calculation methodologies
- Enforcement action procedures
- Export authorization requirements
- Critical medicines designation criteria
- Compliance reporting requirements

**Action Required:** Engage with MOH DMP to obtain specific circulars and directives

### DMP Administrative Decisions

**Status:** To be populated with specific DMP administrative decisions

**Expected Areas:**
- Threshold multipliers (3 for standard, 3.5 for critical medicines)
- Submission grace periods
- Enforcement action procedures
- Appeal processes
- Data retention requirements

**Action Required:** Validate all system parameters against DMP administrative decisions

## MOH (Ministry of Health) Regulations

### MOH Administrative Decisions

**Status:** To be populated with specific MOH administrative decisions

**Expected Areas:**
- Platform governance requirements
- User role definitions and permissions
- Approval workflows
- Reporting requirements
- System configuration authority

**Action Required:** Obtain and document MOH administrative decisions governing the platform

### MOH Directives

**Status:** To be populated with specific MOH directives

**Expected Areas:**
- Data submission requirements
- Compliance monitoring requirements
- Regulatory reporting schedules
- System integration requirements

**Action Required:** Document MOH directives relevant to platform operations

## Customs Regulations

### Export Authorization Requirements

**Status:** To be validated with customs authorities

**Expected Areas:**
- Export authorization validity periods
- Export completion reporting requirements
- Customs integration requirements
- Export documentation requirements

**Action Required:** Validate export control requirements against customs regulations

**Reference:** [Moroccan Customs Regulations] - _Note: Specific reference to be obtained_

## International Standards

### WHO ATC Classification System

**Purpose:** Anatomical Therapeutic Chemical (ATC) classification for medicines

**Application to PM Platform:**
- ATC codes are used for product classification
- ATC code management is MOH-controlled
- System must align with WHO ATC classification standards

**Reference:** [WHO ATC Classification](https://www.who.int/tools/atc-ddd-toolkit/atc-classification)

### Data Protection Standards

**Standards:**
- ISO/IEC 27001: Information Security Management
- GDPR principles (for reference, though not directly applicable)
- Industry best practices for pharmaceutical data management

**Application to PM Platform:**
- Security architecture should align with ISO/IEC 27001 principles
- Data protection measures should follow industry best practices

## Regulatory Update Process

### Review Schedule

- **Monthly:** Review for new DMP circulars and directives
- **Quarterly:** Review for MOH administrative decisions
- **Annually:** Comprehensive regulatory framework review
- **As Needed:** Immediate review when new regulations are published

### Update Procedure

1. **Identification:** Monitor regulatory sources for new/updated regulations
2. **Assessment:** Assess impact on PM platform operations
3. **Documentation:** Update regulatory framework document
4. **Impact Analysis:** Analyze impact on system requirements
5. **Implementation:** Update system documentation and requirements
6. **Communication:** Notify stakeholders of regulatory changes

### Regulatory Sources

- **CNDP:** Official website and publications
- **MOH/DMP:** Official circulars, directives, and administrative decisions
- **Customs:** Official regulations and updates
- **WHO:** ATC classification updates
- **Industry Associations:** Regulatory updates and guidance

## Regulatory Compliance Validation

### Validation Requirements

All system requirements must be validated against:
1. **DMP Regulations:** Specific circulars and directives
2. **MOH Decisions:** Administrative decisions governing platform
3. **National Laws:** Law No. 09-08 and cloud services regulation
4. **International Standards:** WHO ATC classification

### Validation Status

**Current Status:** 🟡 In Progress

**Completed:**
- ✅ Law No. 09-08 (CNDP) requirements identified
- ✅ Cloud services regulation (2024) requirements identified
- ✅ WHO ATC classification alignment documented

**Pending:**
- ⚪ DMP circulars and directives (to be obtained from MOH)
- ⚪ MOH administrative decisions (to be obtained from MOH)
- ⚪ Customs regulations validation (to be validated with customs)
- ⚪ Specific regulatory basis for all system parameters

### Next Steps

1. **Engage with MOH DMP:** Obtain specific circulars, directives, and administrative decisions
2. **Validate Requirements:** Validate all system parameters against DMP regulations
3. **Customs Validation:** Validate export control requirements with customs authorities
4. **Documentation:** Complete regulatory framework documentation
5. **Compliance Tracking:** Establish compliance tracking for cloud services regulation deadline

## Related Documents

- [Compliance Requirements](compliance-requirements.md) - Detailed compliance requirements
- [Regulatory Policies](regulatory-policies.md) - Regulatory policies and guidelines
- [Governance Workflows](governance-workflows.md) - Workflow specifications
- [Approvals Authority Matrix](approvals-authority-matrix.md) - Authority definitions

---

**Next Review Date:** [To be scheduled - Monthly]  
**Owner:** Project Management Team  
**Regulatory Contact:** MOH DMP - _Contact information to be obtained_

