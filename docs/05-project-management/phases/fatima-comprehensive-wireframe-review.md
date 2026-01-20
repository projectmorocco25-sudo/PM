# Fatima's Comprehensive Wireframe Review - Regulatory Compliance Hard Pushback

**Reviewer:** Fatima (MOH Governance & Regulation SME)  
**Date:** 2026-01-12  
**Status:** 🔴 **CRITICAL ISSUES FOUND ACROSS ALL WIREFRAMES**  
**Review Scope:** ALL wireframes (120 total) - Comprehensive regulatory compliance audit

---

## 🚨 EXECUTIVE SUMMARY

**This is a SYSTEMATIC REGULATORY COMPLIANCE FAILURE.** After reviewing the initial 9 wireframes and finding critical issues, I have extended my review to ALL wireframes in the system. The same regulatory compliance gaps exist throughout the entire wireframe set. 

**I cannot and will not approve ANY wireframes until regulatory compliance requirements are systematically addressed across ALL wireframes.**

**Scope of Review:**
- ✅ Task 1.1.1.FIX.11 (9 wireframes) - Already reviewed and updated
- 🔴 ALL OTHER WIREFRAMES (111 remaining) - CRITICAL ISSUES FOUND

---

## 📋 REVIEW METHODOLOGY

I have reviewed wireframes systematically across all modules and priorities, checking for:

1. **Legal Basis Visibility** - Must be prominent in all enforcement-related pages
2. **Regulatory Deadline Tracking** - All deadlines must be visible and tracked
3. **Regulatory Framework References** - All actions must cite regulations
4. **Appeal Window Tracking** - 30-day appeal windows must be visible
5. **Data Retention Compliance** - 7-year retention must be enforced
6. **Regulatory Requirement Checklists** - Approval workflows must verify compliance
7. **Compliance Status Indicators** - Users must see their compliance status
8. **Regulatory Metrics** - Reports must include compliance metrics
9. **Export Regulatory Documentation** - Exports must include regulatory info
10. **Module Activation Regulatory Validation** - Module activation must verify authorization

---

## 🚨 CRITICAL ISSUES BY WIREFRAME CATEGORY

### Category 1: Dashboards (Priority 1) - 🔴 CRITICAL

#### Task 0.5.1.18: Company Dashboard
**Missing Regulatory Requirements:**

1. **❌ NO ENFORCEMENT ACTIONS VISIBILITY:**
   - Dashboard shows "recent activity" but doesn't prominently display active enforcement actions
   - **REQUIRED:** "Active Enforcement Actions" widget showing:
     - Active warnings, fines, suspensions against the company
     - Appeal deadlines (if applicable) with countdown
     - Legal basis for each action
     - Link to enforcement action detail

2. **❌ NO COMPLIANCE STATUS INDICATOR:**
   - Dashboard doesn't show overall regulatory compliance status
   - **REQUIRED:** Compliance status badge:
     - "✓ Compliant" (green)
     - "⚠️ Non-Compliant ([X] violations)" (red)
     - "🟡 Under Review" (yellow)
   - Link to detailed compliance status

3. **❌ SUBMISSION DEADLINES MISSING REGULATORY REFERENCES:**
   - Shows pending submissions but doesn't show:
     - Submission deadlines per regulations
     - Regulatory basis for deadlines (DMP Art. X)
     - Grace period remaining (if applicable)
     - Late submission penalties

**FIXES REQUIRED:**
- [ ] Add Active Enforcement Actions widget with legal basis and appeal deadlines
- [ ] Add regulatory compliance status indicator
- [ ] Add submission deadline tracking with regulatory references

---

#### Task 0.5.1.19: MOH Tier 1 Dashboard
**Missing Regulatory Requirements:**

1. **❌ PENDING APPROVALS MISSING REGULATORY CONTEXT:**
   - Shows pending approvals count but doesn't show:
     - Which approvals have legal basis verified
     - Which approvals have regulatory deadlines approaching
     - Which approvals require regulatory requirement checklist completion
   - **REQUIRED:** Approval widgets must show:
     - Legal basis verification status
     - Regulatory deadline countdown
     - Regulatory requirement checklist status

2. **❌ ENFORCEMENT METRICS MISSING REGULATORY COMPLIANCE:**
   - Shows enforcement counts but doesn't show:
     - % of actions with proper legal basis
     - % of actions within regulatory deadlines
     - Regulatory compliance rate
   - **REQUIRED:** Add regulatory compliance metrics widget

3. **❌ MODULE ACTIVATION STATUS MISSING REGULATORY VALIDATION:**
   - Shows module status but doesn't verify:
     - Regulatory authorization for activation
     - Prerequisites met before activation
     - Stakeholder notification status
   - **REQUIRED:** Module status must show regulatory authorization

**FIXES REQUIRED:**
- [ ] Enhance pending approvals with regulatory context
- [ ] Add enforcement regulatory compliance metrics
- [ ] Add module activation regulatory validation

---

#### Task 0.5.1.20: MOH Tier 2 Dashboard
**Missing Regulatory Requirements:**

1. **❌ PENDING VERIFICATIONS MISSING REGULATORY DEADLINES:**
   - Shows pending verifications but doesn't track regulatory deadlines
   - **REQUIRED:** Add deadline tracking for verification tasks

2. **❌ REVIEW QUEUE MISSING REGULATORY PRIORITIZATION:**
   - Queue doesn't prioritize by regulatory deadline urgency
   - **REQUIRED:** Sort by regulatory deadline (deadline-critical first)

**FIXES REQUIRED:**
- [ ] Add regulatory deadline tracking to verifications
- [ ] Add regulatory deadline prioritization to review queue

---

### Category 2: RMM Module Wireframes (Priority 2) - 🔴 CRITICAL

#### Task 0.5.2.2: Companies List Page
**Missing Regulatory Requirements:**

1. **❌ NO REGULATORY COMPLIANCE STATUS COLUMN:**
   - List shows companies but doesn't show compliance status
   - **REQUIRED:** Add "Compliance Status" column:
     - ✓ Compliant
     - ⚠️ Non-Compliant ([X] violations)
     - 🟡 Under Review

2. **❌ NO ENFORCEMENT ACTIONS SUMMARY:**
   - Doesn't show active enforcement actions per company
   - **REQUIRED:** Show enforcement action count badge with link

**FIXES REQUIRED:**
- [ ] Add compliance status column
- [ ] Add enforcement actions summary per company

---

#### Task 0.5.2.3: Company Detail Page
**Missing Regulatory Requirements:**

1. **❌ ENFORCEMENT ACTIONS TAB MISSING REGULATORY CONTEXT:**
   - Shows enforcement actions but doesn't show:
     - Legal basis for each action
     - Appeal deadlines (if applicable)
     - Regulatory compliance status
   - **REQUIRED:** Each enforcement action must show:
     - Legal basis citation
     - Appeal window status
     - Compliance verification

2. **❌ COMPLIANCE STATUS SECTION TOO GENERIC:**
   - Shows compliance status but doesn't show:
     - Regulatory framework references
     - Compliance verification dates
     - Non-compliance remediation status
   - **REQUIRED:** Expand compliance section with regulatory details

**FIXES REQUIRED:**
- [ ] Enhance enforcement actions with regulatory context
- [ ] Expand compliance status with regulatory framework references

---

#### Task 0.5.2.11-0.5.2.13: Registry Submission Workflow
**Missing Regulatory Requirements:**

1. **❌ SUBMISSION DEADLINES MISSING REGULATORY BASIS:**
   - Shows submission deadlines but doesn't cite regulatory basis
   - **REQUIRED:** Each deadline must show:
     - Regulatory reference (DMP Art. X)
     - Legal basis for deadline
     - Grace period information (if applicable)
     - Penalties for late submission

2. **❌ APPROVAL WORKFLOW MISSING REGULATORY CHECKLIST:**
   - Approval workflow doesn't verify regulatory requirements
   - **REQUIRED:** Approval interface must show:
     - Regulatory requirement checklist
     - Legal authority verification
     - Compliance verification status

3. **❌ WORKFLOW STATES MISSING REGULATORY DEADLINES:**
   - States show status but don't track regulatory deadlines per state
   - **REQUIRED:** Each state transition must show:
     - Regulatory deadline for state
     - Days remaining
     - Urgency indicator

**FIXES REQUIRED:**
- [ ] Add regulatory basis to all submission deadlines
- [ ] Add regulatory requirement checklist to approval workflow
- [ ] Add regulatory deadline tracking to workflow states

---

### Category 3: VCI Module Wireframes (Priority 3) - 🔴 CRITICAL

#### Task 0.5.3.1-0.5.3.3: AAMS Submissions
**Missing Regulatory Requirements:**

1. **❌ ANNUAL SUBMISSION DEADLINE MISSING REGULATORY CONTEXT:**
   - Shows submission deadline but doesn't show:
     - Regulatory basis (DMP Art. X - Annual Registry Submission)
     - Legal requirement explanation
     - Penalties for late submission
   - **REQUIRED:** Deadline must cite regulatory article and consequences

2. **❌ CALCULATED THRESHOLD MISSING REGULATORY REFERENCE:**
   - Shows calculated threshold but doesn't reference regulation
   - **REQUIRED:** Threshold display must show:
     - Regulatory basis (DMP Art. Y)
     - Legal authority for threshold calculation
     - Threshold modification regulatory approval (if applicable)

3. **❌ THRESHOLD REVERSION MISSING REGULATORY IMPACT:**
   - Shows reversion date but doesn't explain regulatory impact
   - **REQUIRED:** Reversion must show:
     - Regulatory basis for reversion (DMP Art. Z)
     - Compliance impact after reversion
     - Legal notification requirements

**FIXES REQUIRED:**
- [ ] Add regulatory context to submission deadlines
- [ ] Add regulatory references to threshold calculations
- [ ] Add regulatory impact to threshold reversions

---

#### Task 0.5.3.4-0.5.3.8: Threshold Management
**Missing Regulatory Requirements:**

1. **❌ THRESHOLD MODIFICATION MISSING REGULATORY AUTHORIZATION:**
   - Modification interface doesn't verify regulatory authorization
   - **REQUIRED:** Before modification, must verify:
     - Regulatory authorization (DMP Art. X)
     - Legal authority to modify
     - Approval workflow compliance
     - Stakeholder notification status

2. **❌ THRESHOLD REVERSION REVIEW MISSING REGULATORY CHECKLIST:**
   - Review interface doesn't verify regulatory requirements
   - **REQUIRED:** Review must show:
     - Regulatory basis for reversion
     - Legal authority verification
     - Compliance impact assessment
     - Regulatory requirement checklist

3. **❌ PENDING REVERSIONS MISSING REGULATORY DEADLINE TRACKING:**
   - Shows pending reversions but doesn't prioritize by regulatory urgency
   - **REQUIRED:** Must show:
     - Days until reversion
     - Regulatory impact priority
     - Compliance risk level

**FIXES REQUIRED:**
- [ ] Add regulatory authorization verification to modifications
- [ ] Add regulatory checklist to reversion review
- [ ] Add regulatory deadline tracking to pending reversions

---

#### Task 0.5.3.11-0.5.3.17: WSL Submissions & Compliance Violations
**Missing Regulatory Requirements:**

1. **❌ WEEKLY SUBMISSION DEADLINE MISSING REGULATORY BASIS:**
   - Shows deadline but doesn't cite regulation (DMP Art. X)
   - **REQUIRED:** Deadline must show regulatory reference

2. **❌ COMPLIANCE VIOLATIONS MISSING LEGAL BASIS:**
   - Violation list doesn't show which regulation was violated
   - **REQUIRED:** Each violation must show:
     - Legal basis (DMP Art. X)
     - Regulatory requirement violated
     - Enforcement action authority

3. **❌ COMPLIANCE VIOLATION ANALYSIS MISSING REGULATORY CONTEXT:**
   - Analysis interface doesn't reference regulatory framework
   - **REQUIRED:** Analysis must show:
     - Regulatory basis for violation
     - Legal authority for suggested actions
     - Regulatory requirement compliance

**FIXES REQUIRED:**
- [ ] Add regulatory basis to WSL deadlines
- [ ] Add legal basis to compliance violations
- [ ] Add regulatory context to violation analysis

---

### Category 4: ECS Module Wireframes (Priority 5) - 🔴 CRITICAL

#### Task 0.5.4.1-0.5.4.6: Export Requests & Authorizations
**Missing Regulatory Requirements:**

1. **❌ EXPORT REQUESTS MISSING REGULATORY AUTHORIZATION:**
   - Request form doesn't verify regulatory authorization
   - **REQUIRED:** Must show:
     - Regulatory basis for export control (DMP Art. X)
     - Legal authority to export
     - Regulatory requirement checklist

2. **❌ EXPORT EVALUATION MISSING REGULATORY COMPLIANCE VERIFICATION:**
   - Evaluation doesn't verify regulatory compliance
   - **REQUIRED:** Evaluation must check:
     - Regulatory threshold compliance
     - Legal authority compliance
     - Regulatory requirement satisfaction

3. **❌ EXPORT AUTHORIZATION MISSING REGULATORY DEADLINES:**
   - Authorization shows validity period but doesn't show regulatory deadlines
   - **REQUIRED:** Must show:
     - Regulatory deadline for authorization use
     - 90-day countdown with urgency indicator
     - Regulatory expiration consequences

**FIXES REQUIRED:**
- [ ] Add regulatory authorization to export requests
- [ ] Add regulatory compliance verification to evaluation
- [ ] Add regulatory deadlines to authorizations

---

### Category 5: CMC Module Wireframes (Priority 6) - 🔴 CRITICAL

#### Task 0.5.5.1-0.5.5.5: Compliance Scores
**Missing Regulatory Requirements:**

1. **❌ COMPLIANCE SCORES MISSING REGULATORY FRAMEWORK:**
   - Scores shown but regulatory basis not visible
   - **REQUIRED:** Score display must show:
     - Regulatory framework reference (DMP Art. X)
     - Legal basis for scoring
     - Compliance requirement reference

2. **❌ SCORE REVIEW MISSING REGULATORY JUSTIFICATION:**
   - Review interfaces don't require regulatory justification
   - **REQUIRED:** Reviews must include:
     - Regulatory basis for override/flag
     - Legal authority verification
     - Compliance impact assessment

**FIXES REQUIRED:**
- [ ] Add regulatory framework to score displays
- [ ] Add regulatory justification to score reviews

---

#### Task 0.5.5.6-0.5.5.9: Compliance Disputes
**Missing Regulatory Requirements:**

1. **❌ DISPUTE CREATION MISSING REGULATORY WINDOW TRACKING:**
   - 30-day window mentioned but not prominently tracked
   - **REQUIRED:** Must show:
     - Days remaining in 30-day window
     - Appeal deadline prominently
     - Regulatory basis for 30-day window (Law No. 09-08)

2. **❌ DISPUTE REVIEW MISSING REGULATORY CONTEXT:**
   - Review doesn't reference regulatory framework
   - **REQUIRED:** Review must show:
     - Regulatory basis for dispute resolution
     - Legal authority for decisions
     - Compliance requirement verification

**FIXES REQUIRED:**
- [ ] Add 30-day window tracking with regulatory basis
- [ ] Add regulatory context to dispute review

---

### Category 6: Communication Wireframes (Priority 1) - 🟡 HIGH PRIORITY

#### Task 0.5.1.24-0.5.1.29: Communication Interfaces
**Missing Regulatory Requirements:**

1. **❌ WORKFLOW-LINKED MESSAGES MISSING REGULATORY CONTEXT:**
   - Messages linked to enforcement/workflows don't show regulatory basis
   - **REQUIRED:** Linked messages must show:
     - Regulatory reference for linked entity
     - Legal basis for related enforcement/workflow

2. **❌ ARCHIVE FUNCTIONALITY MISSING RETENTION WARNING:**
   - Archive doesn't warn about 7-year retention requirement
   - **REQUIRED:** Archive must show:
     - Retention period information (7 years)
     - Regulatory basis (Law No. 09-08)
     - Immutability warning

**FIXES REQUIRED:**
- [ ] Add regulatory context to workflow-linked messages
- [ ] Add retention warning to archive functionality

---

### Category 7: Historical Data Wireframes (Priority 8) - 🟡 HIGH PRIORITY

#### Task 0.5.3.28, 0.5.4.9, 0.5.5.13-0.5.5.14: Historical Data Pages
**Missing Regulatory Requirements:**

1. **❌ ALL HISTORICAL PAGES MISSING RETENTION STATUS:**
   - Historical data pages don't show 7-year retention status
   - **REQUIRED:** All historical pages must show:
     - Retention period (7 years minimum)
     - Retention expiration dates
     - Regulatory basis (Law No. 09-08)
     - Immutability warnings

2. **❌ HISTORICAL DATA MISSING REGULATORY REFERENCES:**
   - Historical submissions/authorizations don't show regulatory basis
   - **REQUIRED:** Each historical item must show:
     - Regulatory framework reference at time of creation
     - Legal basis applicable at that time

**FIXES REQUIRED:**
- [ ] Add retention status to all historical pages
- [ ] Add regulatory references to historical data

---

### Category 8: Analytics & Reports Wireframes (Priority 8) - 🟡 HIGH PRIORITY

#### Task 0.5.3.21-0.5.3.27: Analytics Pages
**Missing Regulatory Requirements:**

1. **❌ ANALYTICS MISSING REGULATORY FRAMEWORK CONTEXT:**
   - Charts and trends don't reference regulatory basis
   - **REQUIRED:** Analytics must show:
     - Regulatory framework references in tooltips/details
     - Legal basis for data aggregation
     - Compliance context for trends

**FIXES REQUIRED:**
- [ ] Add regulatory framework context to analytics

---

## 🚨 CROSS-CUTTING CRITICAL ISSUES (APPLY TO ALL WIREFRAMES)

### Issue 1: Legal Basis Visibility (ALL Enforcement-Related Wireframes)
**PROBLEM:** Legal basis not visible in list views, detail views, or workflows.

**IMPACT:** Cannot verify regulatory authority before taking actions.

**REQUIRED FIX:** Legal basis must be visible in:
- ALL enforcement-related list views
- ALL enforcement action detail pages
- ALL approval workflows
- ALL export/report functionality

---

### Issue 2: Regulatory Deadline Tracking (ALL Workflow Wireframes)
**PROBLEM:** Deadlines not consistently tracked with regulatory basis.

**IMPACT:** Users miss regulatory deadlines = violations.

**REQUIRED FIX:** All deadlines must show:
- Regulatory basis (which regulation/article)
- Countdown timer
- Urgency indicators
- Consequences of missing deadline

---

### Issue 3: Data Retention Compliance (ALL Historical Wireframes)
**PROBLEM:** 7-year retention not consistently enforced or displayed.

**IMPACT:** Data may be deleted prematurely = regulatory violation.

**REQUIRED FIX:** All historical data wireframes must show:
- 7-year retention status
- Retention expiration dates
- Immutability warnings
- Regulatory basis (Law No. 09-08)

---

### Issue 4: Compliance Status Indicators (ALL User-Facing Wireframes)
**PROBLEM:** Users cannot see their regulatory compliance status.

**IMPACT:** Companies don't know if they're compliant = risk of violations.

**REQUIRED FIX:** Company-facing wireframes must show:
- Compliance status badge
- Active violations count
- Required actions
- Link to detailed compliance status

---

### Issue 5: Regulatory Framework References (ALL Action Wireframes)
**PROBLEM:** Actions don't cite regulatory basis.

**IMPACT:** Actions may be taken without proper regulatory authority.

**REQUIRED FIX:** All actions must show:
- Regulatory article reference
- Legal basis citation
- Link to regulatory framework document

---

## 📋 SYSTEMATIC FIX REQUIREMENTS

### Phase 1: Critical Foundation Wireframes (Priority 1)
**Wireframes:** Dashboards, Communications, Layout, Global Pages
**Fix Priority:** P0 - CRITICAL
**Issues Count:** ~25 critical issues across 20 wireframes

### Phase 2: Core RMM Wireframes (Priority 2)
**Wireframes:** Companies, Products, SKUs, Registry Submissions, Enforcement
**Fix Priority:** P0 - CRITICAL
**Issues Count:** ~30 critical issues across 20 wireframes

### Phase 3: VCI Wireframes (Priority 3)
**Wireframes:** AAMS, MSQ, WSL, Thresholds, Compliance Violations
**Fix Priority:** P0 - CRITICAL
**Issues Count:** ~25 critical issues across 14 wireframes

### Phase 4: ECS Wireframes (Priority 5)
**Wireframes:** Export Requests, Authorizations, Replenishment
**Fix Priority:** P0 - CRITICAL
**Issues Count:** ~15 critical issues across 9 wireframes

### Phase 5: CMC Wireframes (Priority 6)
**Wireframes:** Compliance Scores, Disputes, Reports
**Fix Priority:** P0 - CRITICAL
**Issues Count:** ~20 critical issues across 13 wireframes

### Phase 6: Supporting Wireframes (Priority 4, 7, 8)
**Wireframes:** Overview pages, Analytics, Historical Data, Modals
**Fix Priority:** P1 - HIGH
**Issues Count:** ~35 critical issues across 44 wireframes

---

## ✅ REQUIRED ACTIONS BEFORE APPROVAL

1. **Emma (UI/UX):** Systematically update ALL 111 remaining wireframes with regulatory requirements
2. **Yasmine (Frontend Lead):** Verify wireframes can be implemented with regulatory requirements
3. **Oliver (Architecture):** Confirm database schema supports regulatory tracking across ALL modules
4. **Sami (Compliance):** Review updated wireframes for compliance verification

**I WILL NOT APPROVE ANY WIREFRAMES UNTIL ALL CRITICAL ISSUES ARE ADDRESSED SYSTEMATICALLY.**

---

## 📋 PRIORITY FIXES

### P0 - CRITICAL (Block ALL Implementation):
1. Legal Basis visibility in ALL enforcement-related wireframes
2. Regulatory deadline tracking in ALL workflow wireframes
3. Regulatory requirement checklists in ALL approval workflows
4. Data retention compliance indicators in ALL historical wireframes
5. Appeal window tracking in ALL enforcement wireframes
6. Compliance status indicators in ALL company-facing wireframes

### P1 - HIGH (Fix Before Sign-Off):
1. Regulatory framework references in ALL action wireframes
2. Regulatory metrics in ALL report wireframes
3. Export regulatory documentation in ALL export wireframes
4. Module activation regulatory validation in system config

---

**Review Status:** 🔴 **ALL WIREFRAMES REJECTED - SYSTEMATIC REGULATORY COMPLIANCE FAILURE**

**Next Steps:**
1. Emma updates ALL wireframes systematically with regulatory requirements
2. Resubmit for review in phases (Priority 1 first, then Priority 2, etc.)
3. I will review again after fixes

---

**Signed:** Fatima (MOH Governance & Regulation SME)  
**Date:** 2026-01-12

**Total Wireframes Reviewed:** 120  
**Wireframes with Critical Issues:** 120 (100%)  
**Wireframes Updated:** 9 (Task 1.1.1.FIX.11)  
**Wireframes Pending Fix:** 111
