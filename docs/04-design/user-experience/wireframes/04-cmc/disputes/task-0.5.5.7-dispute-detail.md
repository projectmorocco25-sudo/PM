# Task 0.5.5.7: Dispute Detail Page Wireframe

**Status:** ✅ Complete  
**Route:** `/cmc/disputes/[id]`  
**File:** `task-0.5.5.7-dispute-detail.png`  
**Priority:** 🟡 CMC Module

**Design Approach:** Modern detail page with dispute information, evidence display, review status, and workflow timeline. Professional, accessible, and optimized for dispute review workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > CMC > Compliance Disputes > [Dispute ID]             │
│                                                             │
│ Dispute DISP-2025-001 - ABC Pharma Inc. - December 2024   │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Workflow Status                                          ││
│ │                                                          ││
│ │ Submitted → Tier 2 Reviewed → Tier 1 Reviewed → Resolved││
│ │    ✓             ✓              ⏳              ⏳       ││
│ │                                                          ││
│ │ Current Status: Tier 2 Reviewed                        ││
│ │ Reviewed: January 10, 2025 (Tier 2 - Ahmed Benali)     ││
│ │                                                          ││
│ │ ⏱ Submitted: January 5, 2025 (5 days ago)              ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Dispute Information                                      ││
│ │                                                          ││
│ │ Dispute Type: Component Dispute                          ││
│ │ Disputed Component: Stock Threshold Violations          ││
│ │                                                          ││
│ │ Score Context:                                           ││
│ │ • Company: ABC Pharma Inc.                               ││
│ │ • Score Period: December 2024                           ││
│ │ • Total Score: 78/100                                    ││
│ │ • Disputed Component Score: 75/100                      ││
│ │                                                          ││
│ │ [View Full Score Details]                                ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Dispute Reason                                           ││
│ │                                                          ││
│ │ [Dispute reason text displayed here...]                  ││
│ │                                                          ││
│ │ We believe the Stock Threshold Violations component     ││
│ │ score is incorrect because...                            ││
│ │                                                          ││
│ │ [Full dispute reason text]                               ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ Tabs: [Overview] [Evidence] [Review] [History]              │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Evidence Tab                                             ││
│ │                                                          ││
│ │ ┌─────────────────────────────────────────────────────┐ ││
│ │ │ Supporting Evidence                                  │ ││
│ │ │                                                      │ ││
│ │ │ • evidence-001.pdf (2.5 MB) [View] [Download]      │ ││
│ │ │   Uploaded: January 5, 2025                         │ ││
│ │ │                                                      │ ││
│ │ │ • evidence-002.xlsx (1.2 MB) [View] [Download]      │ ││
│ │ │   Uploaded: January 5, 2025                         │ ││
│ │ │                                                      │ ││
│ │ │ • evidence-003.png (500 KB) [View] [Download]       │ ││
│ │ │   Uploaded: January 5, 2025                         │ ││
│ │ └─────────────────────────────────────────────────────┘ ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Review Tab (MOH Only)                                    ││
│ │                                                          ││
│ │ ┌─────────────────────────────────────────────────────┐ ││
│ │ │ Tier 2 Review Notes                                  │ ││
│ │ │                                                      │ ││
│ │ │ Reviewed by: Ahmed Benali (Tier 2)                  │ ││
│ │ │ Reviewed: January 10, 2025                          │ ││
│ │ │                                                      │ ││
│ │ │ [Review notes displayed here...]                    │ ││
│ │ │                                                      │ ││
│ │ │ Evidence reviewed. Dispute has merit. Recommending │ ││
│ │ │ Tier 1 review for final resolution.                │ ││
│ │ └─────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ ┌─────────────────────────────────────────────────────┐ ││
│ │ │ Tier 1 Resolution                                    │ ││
│ │ │                                                      │ ││
│ │ │ Resolution: [Pending]                               │ ││
│ │ │                                                      │ ││
│ │ │ [If Resolved]                                       │ ││
│ │ │ Resolution: Upheld                                   │ ││
│ │ │ Resolved by: Fatima Al-Mansouri (Tier 1)           │ ││
│ │ │ Resolved: January 12, 2025                          │ ││
│ │ │                                                      │ ││
│ │ │ Adjustment Notes:                                   │ ││
│ │ │ [Adjustment notes displayed here...]                │ ││
│ │ │                                                      │ ││
│ │ │ Component score adjusted from 75 to 82 based on    │ ││
│ │ │ evidence provided. Total score recalculated to 82. │ ││
│ │ └─────────────────────────────────────────────────────┘ ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ History Tab                                              ││
│ │                                                          ││
│ │ ┌─────────────────────────────────────────────────────┐ ││
│ │ │ Dispute Timeline                                     │ ││
│ │ │                                                      │ ││
│ │ │ • Tier 2 Reviewed - January 10, 2025                │ ││
│ │ │   Reviewed by: Ahmed Benali                          │ ││
│ │ │   Notes: "Evidence reviewed. Dispute has merit."    │ ││
│ │ │                                                      │ ││
│ │ │ • Submitted - January 5, 2025                       │ ││
│ │ │   Submitted by: Company Admin                        │ ││
│ │ │   Reason: Component score dispute                    │ ││
│ │ └─────────────────────────────────────────────────────┘ ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [MOH Actions: Review Dispute] [Resolve Dispute]             │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > CMC > Compliance Disputes > [Dispute ID]"
- **Title:** "Dispute [ID] - [Company Name] - [Period]"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **Export Button:** Secondary button (export PDF/CSV)
  - **Actions Dropdown:** More actions menu
    - Options: View Audit Log, Print, Download PDF

### Workflow Status Section
- **Layout:** Horizontal timeline showing workflow steps
- **Steps:** Submitted → Tier 2 Reviewed → Tier 1 Reviewed → Resolved
- **Visual Indicators:**
  - Completed steps: Green checkmark (✓)
  - Current step: Highlighted with status badge
  - Pending steps: Gray, disabled (⏳)
- **Current Status Display:**
  - **Status Badge:** Color-coded badge (Submitted, Tier 2 Reviewed, Tier 1 Reviewed, Upheld, Rejected)
  - **Reviewer:** User who reviewed (if applicable)
  - **Timestamp:** Review or submission timestamp
- **Dispute Window Indicator:**
  - **Submitted Date:** "⏱ Submitted: [Date] ([X] days ago)"
  - **Visual:** Clock icon (⏱) with relative time

### Dispute Information Section
- **Layout:** Card with key-value pairs
- **Fields:**
  - **Dispute Type:** Total Score Dispute or Component Dispute
  - **Disputed Component:** Component name (if component dispute)
  - **Score Context:**
    - Company name (link to company detail)
    - Score period (e.g., Dec 2024)
    - Total score (e.g., 78/100)
    - Disputed component score (if component dispute)
  - **View Full Score Details Link:** Link to score detail page
- **Styling:**
  - **Labels:** 14px, color: #6b7280, font-weight: 500
  - **Values:** 16px, color: #111827

### Dispute Reason Section
- **Layout:** Card with dispute reason text
- **Content:**
  - **Dispute Reason:** Full text of dispute reason
  - **Format:** Plain text or formatted text
  - **Length:** Can be multi-paragraph
- **Styling:** Read-only text with light background

### Tabs Navigation
- **Tabs:**
  1. **Overview:** Dispute information and reason
  2. **Evidence:** Supporting evidence files
  3. **Review:** Review notes and resolution (MOH only)
  4. **History:** Dispute timeline
- **Styling:** Standard tab navigation with active state indicator

### Evidence Tab Content
- **Supporting Evidence Section:**
  - **Layout:** List of uploaded files
  - **Each File Shows:**
    - File name (e.g., evidence-001.pdf)
    - File size (e.g., 2.5 MB)
    - Upload date
    - Action buttons: [View] [Download]
  - **File Types:** PDF, DOC, DOCX, XLS, XLSX, CSV, PNG, JPG
  - **View Action:** Opens file viewer (PDF viewer, image viewer, etc.)
  - **Download Action:** Downloads file
- **Styling:** File list with icons and action buttons

### Review Tab Content (MOH Only)

#### Tier 2 Review Notes
- **Layout:** Card with review information
- **Content:**
  - **Reviewed By:** User name and role (e.g., "Ahmed Benali (Tier 2)")
  - **Reviewed Date:** Review timestamp
  - **Review Notes:** Review notes text (read-only)
- **Styling:** Card with review information

#### Tier 1 Resolution
- **Layout:** Card with resolution information
- **Content:**
  - **Resolution Status:** Pending, Upheld, Rejected
  - **Resolved By:** User name and role (if resolved, e.g., "Fatima Al-Mansouri (Tier 1)")
  - **Resolved Date:** Resolution timestamp (if resolved)
  - **Adjustment Notes:** Adjustment notes text (if upheld, read-only)
- **Styling:** Card with resolution information
- **Pending State:** Shows "[Pending]" if not yet resolved

### History Tab Content
- **Dispute Timeline:**
  - **Layout:** Timeline-style list of dispute events
  - **Events:**
    - Submitted (with submitter and reason)
    - Tier 2 Reviewed (with reviewer and notes)
    - Tier 1 Reviewed (with reviewer and notes)
    - Resolved (with resolver, resolution, and adjustment notes)
  - **Each Event Shows:**
    - Event name
    - Date and time
    - User who performed action
    - Notes or reason (if applicable)
  - **Styling:** Timeline with date indicators

### Action Buttons (MOH Only)
- **Review Dispute Button:**
  - **Role:** Tier 2 only (if not yet reviewed)
  - **Action:** Opens dispute review interface
  - **Styling:** Primary button
- **Resolve Dispute Button:**
  - **Role:** Tier 1 only (if Tier 2 reviewed)
  - **Action:** Opens dispute resolution interface
  - **Styling:** Primary button

---

## Role-Based Access

### Company Users
- **View:** Own company disputes only
- **Overview Tab:** Full access to dispute information and reason
- **Evidence Tab:** Full access to own evidence
- **Review Tab:** Limited access (can see review status, cannot see review notes until resolved)
- **History Tab:** Full access to dispute timeline
- **Actions:**
  - View Dispute Details
  - View Evidence
  - Export Dispute (own data only)
- **Data:**
  - Cannot see Tier 2 review notes until Tier 1 resolved
  - Cannot see Tier 1 adjustment notes until resolved
  - Can see final resolution and adjustment notes

### MOH Tier 1
- **View:** All companies' disputes
- **All Tabs:** Full access to all dispute information
- **Review Tab:** Full access to review notes and resolution interface
- **Actions:**
  - View Dispute Details
  - Resolve Disputes (approve/reject with adjustment notes)
  - Export Dispute
  - View Audit Log
- **Data:**
  - Can see all dispute information, evidence, and review notes
  - Can resolve disputes with adjustment notes

### MOH Tier 2
- **View:** All companies' disputes
- **All Tabs:** Full access to all dispute information
- **Review Tab:** Full access to review interface (can review, cannot resolve)
- **Actions:**
  - View Dispute Details
  - Review Disputes (flag for Tier 1)
  - Export Dispute
  - View Audit Log
- **Data:**
  - Can see all dispute information, evidence, and review notes
  - Can review disputes but cannot resolve (Tier 1 only)

---

## State Variations

### Empty State (No Evidence)
- **Message:** "No evidence provided"
- **Subtext:** "Supporting evidence helps with dispute review"

### Loading State
- **Skeleton Loaders:** Sections with skeleton placeholders
- **Tabs:** Skeleton tab content

### Error State
- **Message:** "Unable to load dispute"
- **Subtext:** Error message details
- **Action Button:** "Retry"

### Submitted State
- **Status:** "Submitted"
- **Actions:** Tier 2 can review, Tier 1 cannot resolve yet
- **Timeline:** Shows only submission event

### Tier 2 Reviewed State
- **Status:** "Tier 2 Reviewed"
- **Actions:** Tier 1 can resolve, Tier 2 cannot review again
- **Timeline:** Shows submission and Tier 2 review events

### Resolved State
- **Status:** "Upheld" or "Rejected"
- **Actions:** No further actions available (dispute closed)
- **Timeline:** Shows all events including resolution
- **Resolution:** Shows resolution status, resolver, and adjustment notes (if upheld)

### Module Inactive State
- **Message:** "CMC module is not active"
- **Subtext:** "Contact MOH Tier 1 to activate the CMC module"
- **Visual:** Inactive module indicator
- **Note:** Historical data may still be accessible if `has_historical_cmc_data()` returns true

---

## Business Rules

1. **Module Status:** CMC is optional (license-controlled)
2. **Module Activation Check:** Routes check `is_module_active('cmc')` for active module, or `has_historical_cmc_data()` for historical data access
3. **Dispute Window:** Companies have 30 days from score publication to submit disputes
4. **Dispute Types:**
   - **Total Score Dispute:** Disputes the total score
   - **Component Dispute:** Disputes a specific component score
5. **Status Workflow:** Submitted → Tier 2 Reviewed → Tier 1 Reviewed → Upheld/Rejected
6. **Role-Based Access:** Companies see own disputes only, MOH sees all disputes
7. **Review Visibility:**
   - Companies cannot see Tier 2 review notes until Tier 1 resolved
   - Companies cannot see Tier 1 adjustment notes until resolved
   - MOH can see all review notes and resolution
8. **Evidence Display:** All evidence visible to all authorized users
9. **Resolution Actions:**
   - Only Tier 1 can resolve disputes (upheld/rejected)
   - Tier 2 can review but cannot resolve
   - Companies cannot resolve disputes
10. **Adjustment Notes:** Only shown if dispute is upheld and resolved by Tier 1
11. **Timeline:** Shows complete dispute history with all events
12. **Export:** Export dispute as PDF or CSV (includes all data based on role)
13. **Audit Log:** All dispute actions logged in audit trail
14. **Status Badges:** Color-coded based on status (gray, yellow, blue, green, red)

---

## Related Documents

- [CMC Overview Wireframe](../overview/task-0.5.5.0-cmc-overview.md)
- [Compliance Disputes List Wireframe](./task-0.5.5.6-compliance-disputes-list.md)
- [Dispute Creation Interface](./task-0.5.5.8-dispute-creation-interface.md)
- [Dispute Review Interface](./task-0.5.5.9-dispute-review-interface.md)
- [Routing Structure](../../../02-architecture/frontend/routing-structure.md) - CMC routes
- [Workflow Architecture](../../../02-architecture/workflow-architecture.md) - Compliance Dispute Workflow

---

**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Guided by:** Fatima (MOH Regulatory Requirements) & Dr. Samir (Business Process Validation)

