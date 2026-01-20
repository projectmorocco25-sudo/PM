# Fatima's Wireframe Review - Hard Pushback (MOH Governance & Regulation SME)

**Reviewer:** Fatima (MOH Governance & Regulation SME)  
**Date:** 2026-01-12  
**Status:** 🔴 **CRITICAL ISSUES - MUST FIX BEFORE IMPLEMENTATION**  
**Review Scope:** All wireframes in Task 1.1.1.FIX.11

---

## 🚨 EXECUTIVE SUMMARY

**This is UNACCEPTABLE.** These wireframes are missing **critical regulatory compliance requirements** that will result in **regulatory violations** if implemented as-is. The governance workflows are incomplete, and MOH requirements are not properly represented.

**I cannot and will not approve these wireframes until the following critical issues are addressed.**

---

## 📋 WIREFRAME-BY-WIREFRAME PUSHBACK

### 1. History Overview Page (task-0.5.1.30) - 🔴 CRITICAL

**Missing Regulatory Requirements:**

1. **❌ NO DATA RETENTION INDICATOR:**
   - Wireframe shows "Last 30 days" as default filter
   - **PROBLEM:** Law No. 09-08 requires 7-year minimum retention
   - **REQUIRED:** Must show retention status badge: "Data retained until [date + 7 years]" or "Retention period: 7 years (regulatory minimum)"
   - **LOCATION:** Prominent display in page header or info banner

2. **❌ NO REGULATORY FRAMEWORK REFERENCE:**
   - Wireframe doesn't show which regulatory basis applies to each history item
   - **REQUIRED:** Each history item must show regulatory reference (Law No. 09-08, DMP Regulation Article X, etc.)
   - **EXAMPLE:** "Submission #12345 Created (DMP Regulation Article 12 - Annual Registry Submission)"

3. **❌ ENFORCEMENT ACTION HISTORY INCOMPLETE:**
   - Wireframe shows enforcement actions but doesn't show:
     - Legal basis for action (which regulation/article was violated)
     - Appeal status (if applicable)
     - Regulatory deadline tracking (30-day appeal window, execution deadlines)
   - **REQUIRED:** Enforcement history items must include:
     - Legal basis citation
     - Appeal deadline countdown (if appeal window open)
     - Regulatory compliance status indicator

4. **❌ NO IMMUTABILITY WARNING:**
   - Historical data must be read-only with clear warning
   - **REQUIRED:** Info banner: "⚠️ Historical data is immutable per regulatory requirements. No modifications allowed."

**FIXES REQUIRED:**
- [ ] Add data retention status indicator (7-year requirement)
- [ ] Add regulatory framework reference to each history item type
- [ ] Enhance enforcement action history items with legal basis and appeal tracking
- [ ] Add immutability warning banner
- [ ] Add regulatory compliance info section

---

### 2. Notifications Page (task-0.5.1.31) - 🔴 CRITICAL

**Missing Regulatory Requirements:**

1. **❌ ENFORCEMENT NOTIFICATIONS MISSING CRITICAL DEADLINES:**
   - Wireframe shows enforcement notifications but doesn't display:
     - **30-day appeal window deadline** (countdown timer)
     - **Legal basis citation** (which regulation was violated)
     - **Regulatory action required** (what the company must do)
   - **REQUIRED:** Enforcement notifications must show:
     - Appeal deadline: "You have 23 days remaining to appeal (deadline: [date])"
     - Legal basis: "Violation: [Regulation Article X] - [violation type]"
     - Required action: "Action required: [specific action]"

2. **❌ THRESHOLD REVERSION NOTIFICATIONS INCOMPLETE:**
   - Shows 7-day and 1-day warnings but missing:
     - Regulatory impact explanation (what happens after reversion)
     - Legal basis for threshold (regulation reference)
     - Impact on compliance status
   - **REQUIRED:** Threshold reversion notifications must include:
     - Regulatory impact: "Reverting to default threshold per DMP Regulation Article Y"
     - Compliance impact: "Your compliance status may change after reversion"

3. **❌ NO REGULATORY DEADLINE PRIORITIZATION:**
   - All notifications appear equal priority
   - **PROBLEM:** Regulatory deadlines (appeal windows, submission deadlines) must be prioritized
   - **REQUIRED:** 
     - Visual priority indicators for deadline-critical notifications (red border, urgency badge)
     - Sort by deadline urgency (regulatory deadlines first)
     - Deadline countdown timer (days/hours remaining)

4. **❌ APPEAL NOTIFICATIONS MISSING REGULATORY CONTEXT:**
   - Appeal notifications don't show:
     - Regulatory basis for appeal (which regulation allows appeal)
     - Appeal process timeline (regulatory deadlines)
     - Legal requirements for appeal submission
   - **REQUIRED:** Appeal notifications must include regulatory context

**FIXES REQUIRED:**
- [ ] Add appeal deadline countdown timers to enforcement notifications
- [ ] Add legal basis citation to all enforcement-related notifications
- [ ] Add regulatory impact explanations to threshold reversion notifications
- [ ] Add deadline prioritization and urgency indicators
- [ ] Add regulatory context to appeal notifications

---

### 3. Audit Logs List Page (task-0.5.1.32) - 🟡 HIGH PRIORITY

**Missing Regulatory Requirements:**

1. **❌ ENFORCEMENT ACTION AUDIT TRAIL INCOMPLETE:**
   - Wireframe shows enforcement actions in audit log but missing:
     - **Legal basis citation** in audit log entry
     - **Regulatory approval chain** (who approved what, when, based on which regulation)
     - **Compliance verification** (was action compliant with regulations)
   - **REQUIRED:** Enforcement action audit entries must show:
     - Legal basis: "Action created based on [Regulation Article X]"
     - Approval chain: "Approved by [User] per [Regulation Article Y] on [date]"
     - Compliance status: "Compliant with DMP Regulation Article Z"

2. **❌ NO REGULATORY CHANGE TRACKING:**
   - Audit log doesn't show when regulatory frameworks are updated
   - **REQUIRED:** Regulatory framework changes must be logged with:
     - Regulation version/reference
     - Effective date
     - Impact on existing records

3. **❌ DATA RETENTION COMPLIANCE NOT EXPLICIT:**
   - Shows 7-year retention info but doesn't verify compliance
   - **REQUIRED:** Show retention compliance status:
     - "All logs retained per Law No. 09-08 (7-year minimum)"
     - Warning if any logs approaching retention expiration

4. **❌ MISSING ENFORCEMENT ACTION AUDIT DETAILS:**
   - Enforcement action audit entries are too generic
   - **REQUIRED:** Show full audit trail:
     - Legal basis selection
     - Justification review
     - Approval workflow compliance
     - Execution tracking

**FIXES REQUIRED:**
- [ ] Enhance enforcement action audit entries with legal basis and approval chain
- [ ] Add regulatory framework change tracking
- [ ] Add data retention compliance verification
- [ ] Expand enforcement action audit detail requirements

---

### 4. System Configuration Page (task-0.5.1.35) - 🔴 CRITICAL

**Missing Regulatory Requirements:**

1. **❌ MODULE ACTIVATION MISSING REGULATORY VALIDATION:**
   - Wireframe shows module activation toggles but doesn't verify:
     - **Regulatory authorization** (is MOH authorized to activate module per regulations?)
     - **Compliance prerequisites** (are all regulatory requirements met before activation?)
     - **Regulatory notification requirements** (must notify stakeholders per regulations)
   - **REQUIRED:** Before module activation, must show:
     - Regulatory authorization check: "✓ Authorized per [Regulation Article X]"
     - Prerequisites checklist: "All regulatory requirements met: [checklist]"
     - Notification status: "Stakeholders notified: [status]"

2. **❌ CLOUD SERVICES COMPLIANCE SECTION INCOMPLETE:**
   - Shows compliance status but missing:
     - **Regulatory deadline tracking** (October 22, 2026 deadline is critical)
     - **Non-compliance consequences** (what happens if deadline missed)
     - **Risk assessment regulatory basis** (which regulation requires assessment)
     - **Data residency regulatory requirements** (Law No. 09-08 requirements)
   - **REQUIRED:** Add:
     - Countdown to deadline with urgency indicator
     - Non-compliance warning: "⚠️ If deadline missed: [regulatory consequences]"
     - Regulatory basis for each compliance action
     - Data residency compliance verification per Law No. 09-08

3. **❌ REGULATORY COMPLIANCE SECTION TOO GENERIC:**
   - Shows "CNDP Compliance" and "DMP Regulations" status but doesn't show:
     - **Specific regulatory requirements** (which articles apply)
     - **Compliance verification method** (how was compliance verified)
     - **Regulatory review schedule** (when was last compliance review)
     - **Non-compliance actions** (what is being done if non-compliant)
   - **REQUIRED:** Expand to show:
     - Regulatory article references
     - Compliance verification details
     - Review schedule and last review date
     - Remediation plan if non-compliant

4. **❌ NO REGULATORY CHANGE LOG:**
   - Doesn't track when regulatory requirements change
   - **REQUIRED:** Regulatory change log showing:
     - Regulation updates
     - Effective dates
     - System configuration changes made in response

**FIXES REQUIRED:**
- [ ] Add regulatory authorization validation before module activation
- [ ] Add regulatory deadline tracking and urgency indicators for cloud services compliance
- [ ] Expand regulatory compliance section with article references and verification details
- [ ] Add regulatory change log
- [ ] Add non-compliance consequence warnings

---

### 5. RMM Overview Page (task-0.5.2.1) - 🟡 HIGH PRIORITY

**Missing Regulatory Requirements:**

1. **❌ COMPANIES CANNOT SEE ENFORCEMENT ACTIONS ON THEIR OVERVIEW:**
   - Wireframe shows "Recent Activity" but for Company users, it doesn't show enforcement actions against them
   - **PROBLEM:** Companies must see their enforcement actions prominently (regulatory transparency requirement)
   - **REQUIRED:** For Company users, add:
     - "Active Enforcement Actions" section showing:
       - Active warnings, fines, suspensions
       - Appeal deadlines (if applicable)
       - Required actions
     - Link to enforcement action detail

2. **❌ NO REGULATORY COMPLIANCE STATUS INDICATOR:**
   - Wireframe shows statistics but doesn't show overall compliance status
   - **REQUIRED:** Add compliance status badge:
     - "Compliant" (green)
     - "Non-Compliant" (red) with violation count
     - "Under Review" (yellow)
   - Link to detailed compliance status page

3. **❌ SUBMISSION STATUS MISSING REGULATORY DEADLINES:**
   - Shows pending/approved/rejected but doesn't show:
     - Submission deadlines per regulations
     - Grace period remaining (if applicable)
     - Late submission penalties (if applicable)
   - **REQUIRED:** Add deadline tracking to submission status

**FIXES REQUIRED:**
- [ ] Add enforcement actions section for Company users
- [ ] Add regulatory compliance status indicator
- [ ] Add submission deadline tracking with regulatory references

---

### 6. Enforcement Dashboard (task-0.5.2.0) - 🔴 CRITICAL

**Missing Regulatory Requirements:**

1. **❌ ENFORCEMENT METRICS MISSING REGULATORY CONTEXT:**
   - Shows counts (45 warnings, 12 fines, 3 suspensions) but doesn't show:
     - **Regulatory basis breakdown** (which regulations were violated)
     - **Legal authority verification** (were actions within legal authority?)
     - **Regulatory compliance rate** (% of actions compliant with regulations)
   - **REQUIRED:** Add regulatory metrics:
     - Violation type by regulation article
     - Legal authority compliance indicator
     - Regulatory compliance rate widget

2. **❌ PENDING APPROVALS MISSING REGULATORY DEADLINE TRACKING:**
   - Shows 8 pending approvals but doesn't show:
     - **Regulatory approval deadlines** (some actions must be approved within X days per regulations)
     - **Legal basis verification status** (has legal basis been verified?)
     - **Regulatory requirement checklist** (are all regulatory requirements met?)
   - **REQUIRED:** Add:
     - Approval deadline countdown for each pending action
     - Legal basis verification indicator
     - Regulatory requirement checklist status

3. **❌ VIOLATION TYPES CHART MISSING REGULATORY REFERENCES:**
   - Shows violation types but doesn't link to regulatory basis
   - **REQUIRED:** Each violation type should show:
     - Regulatory article reference (tooltip or detail view)
     - Legal authority basis
     - Compliance requirement

4. **❌ NO REGULATORY COMPLIANCE WIDGET:**
   - Missing overall enforcement compliance status
   - **REQUIRED:** Add compliance widget showing:
     - % of actions with proper legal basis
     - % of actions within regulatory deadlines
     - % of approvals compliant with regulatory requirements

**FIXES REQUIRED:**
- [ ] Add regulatory metrics and legal authority verification
- [ ] Add approval deadline tracking with regulatory basis
- [ ] Add regulatory references to violation types
- [ ] Add enforcement compliance widget

---

### 7. Enforcement Actions List (task-0.5.2.1) - 🔴 CRITICAL

**Missing Regulatory Requirements:**

1. **❌ LEGAL BASIS NOT VISIBLE IN LIST VIEW:**
   - Wireframe shows Type, Company, Violation, Amount, Status but **NOT Legal Basis**
   - **CRITICAL:** Legal basis must be visible in list view (regulatory requirement)
   - **REQUIRED:** Add "Legal Basis" column showing:
     - Regulation article (e.g., "DMP Art. 12")
     - Violation reference
   - **OR** Add tooltip/badge on hover showing legal basis

2. **❌ STATUS BADGES MISSING REGULATORY CONTEXT:**
   - Shows "Pending Approval", "Executed" but doesn't show:
     - **Regulatory deadline status** (within deadline? overdue?)
     - **Appeal window status** (open? closed? deadline approaching?)
   - **REQUIRED:** Status badges must include:
     - Deadline indicator (if applicable)
     - Appeal window status (if applicable)
     - Regulatory compliance indicator

3. **❌ FILTERS MISSING REGULATORY FILTERS:**
   - Wireframe shows Type, Status, Company, Date filters but missing:
     - **Legal Basis filter** (filter by regulation article)
     - **Regulatory Deadline filter** (filter by deadline status)
     - **Appeal Status filter** (filter by appeal window status)
   - **REQUIRED:** Add regulatory filters

4. **❌ AMOUNT COLUMN MISSING REGULATORY VALIDATION INDICATOR:**
   - Shows fine amounts but doesn't verify if amount is within regulatory limits
   - **REQUIRED:** Add validation indicator:
     - "✓ Within regulatory limits" (green)
     - "⚠️ Verify regulatory limit" (yellow) if amount is high
   - Show regulatory limit in tooltip

**FIXES REQUIRED:**
- [ ] Add Legal Basis column or prominent display
- [ ] Enhance status badges with regulatory deadline and appeal window status
- [ ] Add regulatory filters (Legal Basis, Deadline Status, Appeal Status)
- [ ] Add regulatory limit validation indicator for fine amounts

---

### 8. Pending Approvals Page (task-0.5.2.1c) - 🔴 CRITICAL

**Missing Regulatory Requirements:**

1. **❌ LEGAL BASIS NOT DISPLAYED IN APPROVAL CARDS:**
   - Wireframe shows violation, justification preview but **NOT Legal Basis**
   - **CRITICAL:** Tier 1 cannot approve without verifying legal basis (regulatory requirement)
   - **REQUIRED:** Each approval card must prominently display:
     - **Legal Basis:** "Legal Basis: [Regulation Article X] - [Article Description]"
     - **Legal Authority Verification:** "✓ Verified" or "⚠️ Needs Verification"
     - **Regulatory Limit Check:** For fines, show regulatory maximum and verify amount is within limit

2. **❌ MISSING REGULATORY REQUIREMENT CHECKLIST:**
   - Wireframe doesn't show if all regulatory requirements are met
   - **REQUIRED:** Add regulatory requirement checklist:
     - ☐ Legal basis verified
     - ☐ Legal authority confirmed
     - ☐ Regulatory deadline met (if applicable)
     - ☐ Amount within regulatory limits (if fine)
     - ☐ Justification meets regulatory requirements
   - **BLOCKER:** Cannot approve unless all checks pass

3. **❌ APPROVAL DEADLINE NOT DISPLAYED:**
   - Wireframe shows "Created: 2 days ago" but doesn't show:
     - **Regulatory approval deadline** (some actions must be approved within X days)
     - **Deadline countdown** (days remaining)
   - **REQUIRED:** Add deadline tracking:
     - "Approval Deadline: [date] ([X] days remaining)"
     - Urgency indicator (red if <3 days, yellow if <7 days)

4. **❌ BULK APPROVAL MISSING REGULATORY VALIDATION:**
   - Shows bulk approve/reject but doesn't verify:
     - Can all selected actions be bulk approved? (some may require individual review per regulations)
     - Are all legal bases verified?
     - Are all regulatory requirements met?
   - **REQUIRED:** Before bulk approval:
     - Validate all actions can be bulk approved (regulatory check)
     - Verify all legal bases are confirmed
     - Show regulatory requirement status for bulk selection

5. **❌ JUSTIFICATION PREVIEW TOO LIMITED:**
   - Shows truncated justification but doesn't verify:
     - Does justification meet regulatory requirements?
     - Are all required elements present?
   - **REQUIRED:** Add justification validation indicator:
     - "✓ Meets regulatory requirements" or
     - "⚠️ Missing required elements: [list]"

**FIXES REQUIRED:**
- [ ] Add prominent Legal Basis display in approval cards
- [ ] Add regulatory requirement checklist (cannot approve if incomplete)
- [ ] Add approval deadline tracking with countdown
- [ ] Add bulk approval regulatory validation
- [ ] Add justification validation indicator

---

### 9. Enforcement Reports Page (task-0.5.2.1d) - 🟡 HIGH PRIORITY

**Missing Regulatory Requirements:**

1. **❌ REPORTS MISSING REGULATORY COMPLIANCE METRICS:**
   - Wireframe shows action counts, trends, amounts but doesn't show:
     - **Regulatory compliance rate** (% of actions with proper legal basis)
     - **Deadline compliance rate** (% of actions within regulatory deadlines)
     - **Legal authority compliance** (% within legal authority)
   - **REQUIRED:** Add regulatory compliance metrics section

2. **❌ VIOLATION TYPE BREAKDOWN MISSING REGULATORY REFERENCES:**
   - Shows violation types but doesn't link to regulations
   - **REQUIRED:** Each violation type should show:
     - Regulatory article reference
     - Link to regulatory framework document
     - Legal authority basis

3. **❌ EXPORT MISSING REGULATORY DOCUMENTATION REQUIREMENTS:**
   - Shows export options (PDF, Excel, CSV) but doesn't verify:
     - Does export include required regulatory information?
     - Are exports compliant with reporting requirements?
   - **REQUIRED:** Export must include:
     - Regulatory framework references
     - Legal basis for each action
     - Compliance verification status
   - Add warning: "Exports must include regulatory documentation per [Regulation Article X]"

4. **❌ NO REGULATORY REPORTING DEADLINE TRACKING:**
   - Doesn't track when regulatory reports are due
   - **REQUIRED:** Add regulatory reporting schedule:
     - "Quarterly enforcement report due: [date]"
     - "Annual compliance report due: [date]"
     - Countdown to reporting deadlines

**FIXES REQUIRED:**
- [ ] Add regulatory compliance metrics section
- [ ] Add regulatory references to violation types
- [ ] Ensure exports include required regulatory documentation
- [ ] Add regulatory reporting deadline tracking

---

## 🚨 CROSS-CUTTING CRITICAL ISSUES

### Issue 1: Legal Basis Visibility
**PROBLEM:** Legal basis is not prominently displayed anywhere. This is a **regulatory requirement** - all enforcement actions must cite legal basis.

**IMPACT:** Actions without visible legal basis cannot be approved or executed (regulatory violation).

**REQUIRED FIX:** Legal basis must be:
- Visible in list views (column or badge)
- Prominently displayed in detail views
- Required field in approval workflows
- Included in all exports and reports

### Issue 2: Regulatory Deadline Tracking
**PROBLEM:** No consistent deadline tracking across wireframes. Regulatory deadlines are critical (appeal windows, approval deadlines, reporting deadlines).

**IMPACT:** Missing deadlines = regulatory violations.

**REQUIRED FIX:** All deadlines must show:
- Countdown timer (days/hours remaining)
- Urgency indicators (red/yellow/green)
- Deadline date prominently displayed
- Overdue warnings

### Issue 3: Regulatory Framework References
**PROBLEM:** Wireframes don't consistently reference regulatory framework. Users cannot verify which regulation applies.

**IMPACT:** Actions may be taken without proper regulatory authority.

**REQUIRED FIX:** Every enforcement-related element must:
- Cite regulatory article/reference
- Link to regulatory framework document
- Show regulatory basis for action

### Issue 4: Appeal Window Tracking
**PROBLEM:** Appeal windows (30 days) are not consistently tracked. Companies may miss appeal deadlines.

**IMPACT:** Companies lose right to appeal = legal liability for MOH.

**REQUIRED FIX:** All enforcement actions must show:
- Appeal window status (open/closed)
- Days remaining to appeal
- Appeal deadline prominently displayed
- Link to appeal submission

### Issue 5: Data Retention Compliance
**PROBLEM:** 7-year retention requirement (Law No. 09-08) is mentioned but not enforced in UI.

**IMPACT:** Data may be deleted before 7 years = regulatory violation.

**REQUIRED FIX:** Must show:
- Retention status for all historical data
- Retention expiration dates
- Immutability warnings
- Retention compliance verification

---

## ✅ REQUIRED ACTIONS BEFORE APPROVAL

1. **Emma (UI/UX):** Update all wireframes with regulatory requirements above
2. **Yasmine (Frontend Lead):** Verify wireframes can be implemented with regulatory requirements
3. **Oliver (Architecture):** Confirm database schema supports regulatory tracking (legal basis, deadlines, etc.)
4. **Sami (Compliance):** Review updated wireframes for compliance verification

**I WILL NOT APPROVE THESE WIREFRAMES UNTIL ALL CRITICAL ISSUES ARE ADDRESSED.**

---

## 📋 PRIORITY FIXES

### P0 - CRITICAL (Block Implementation):
1. Legal Basis visibility in all enforcement wireframes
2. Regulatory deadline tracking (approval, appeal, reporting)
3. Regulatory requirement checklists in approval workflows
4. Data retention compliance indicators
5. Appeal window tracking

### P1 - HIGH (Fix Before Sign-Off):
1. Regulatory framework references
2. Compliance status indicators
3. Regulatory metrics in reports
4. Export regulatory documentation requirements

---

**Review Status:** 🔴 **REJECTED - CRITICAL ISSUES MUST BE FIXED**

**Next Steps:**
1. Emma updates wireframes with regulatory requirements
2. Resubmit for review
3. I will review again after fixes

---

**Signed:** Fatima (MOH Governance & Regulation SME)  
**Date:** 2026-01-12
