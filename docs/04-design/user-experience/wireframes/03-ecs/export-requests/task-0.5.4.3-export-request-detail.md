# Task 0.5.4.3: Export Request Detail Page Wireframe

**Status:** ✅ Complete  
**Route:** `/ecs/export-requests/[id]`  
**File:** `task-0.5.4.3-export-request-detail.png`  
**Priority:** 🟡 ECS Module

**Design Approach:** Modern detail page with workflow status, request data, threshold comparison card (current stock vs VCI threshold vs ECS threshold), and approval history timeline. Professional, accessible, and optimized for export control review workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > ECS > Export Requests > [Request ID]                  │
│                                                             │
│ Export Request - REQ-2025-001                               │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Workflow Status                                          ││
│ │                                                          ││
│ │ Draft → Submitted → Auto-Approval Queue → Approved   ││
│ │   ✓        ✓            ✓                ⏳          ││
│ │                                                          ││
│ │ Current Status: Auto-Approval Queue                     ││
│ │ Intervention Window: 1 day remaining                    ││
│ │                                                          ││
│ │ [If Tier 1] [Intervene] [If Tier 2] [Verify]           ││
│ │ [If Manual Review] [Approve] [Reject]                  ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Request Information                                      ││
│ │                                                          ││
│ │ Request ID: REQ-2025-001                                 ││
│ │ Company: ABC Pharmaceuticals Inc.                      ││
│ │ SKU: SKU001 - Product A / 500mg / Tablet              ││
│ │ Export Destination: Country X                           ││
│ │ Expected Quantity: 1,000 units                          ││
│ │ Expected Export Date: February 15, 2025               ││
│ │ Created: January 15, 2025                              ││
│ │ Submitted: January 16, 2025                            ││
│ │                                                          ││
│ │ Timeline / Purpose:                                      ││
│ │ Export for regulatory compliance in Country X.         ││
│ │ Expected completion within 30 days.                    ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Threshold Comparison Card                                ││
│ │                                                          ││
│ │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       ││
│ │ │ Current     │ │ VCI         │ │ ECS         │       ││
│ │ │ Stock       │ │ Threshold   │ │ Threshold   │       ││
│ │ │             │ │             │ │             │       ││
│ │ │ 5,000 units │ │ 3,000 units │ │ 4,200 units │       ││
│ │ │             │ │             │ │ (calculated)│       ││
│ │ │ ████████    │ │ ██████      │ │ ███████     │       ││
│ │ │ (100%)      │ │ (60%)       │ │ (84%)       │       ││
│ │ └─────────────┘ └─────────────┘ └─────────────┘       ││
│ │                                                          ││
│ │ Stock vs Thresholds:                                     ││
│ │ • Current Stock: 5,000 units (167% of VCI, 119% of ECS)││
│ │ • Export Quantity: 1,000 units                           ││
│ │ • Remaining After Export: 4,000 units                   ││
│ │ • Compliance: ✓ Above both thresholds                   ││
│ │                                                          ││
│ │ [If Authorized]                                          ││
│ │ ⚠️ Threshold Switched: VCI → ECS (active for 3 months)││
│ │ Threshold Switch Date: February 1, 2025                 ││
│ │ Revert Date: May 1, 2025 (90 days remaining)           ││
│ │                                                          ││
│ │ ℹ️ ECS Threshold calculated from XAMS (X-month average  ││
│ │    of MSQ data). Threshold switches from VCI to ECS    ││
│ │    on authorization for 3 calendar months.             ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Conditional Validation Status                            ││
│ │                                                          ││
│ │ CMC Module Status: Active                               ││
│ │ Company Compliance Score: 78/100                        ││
│ │                                                          ││
│ │ Validation Result: Auto-Approval Queue                  ││
│ │ • Score ≥ 75: Auto-approval eligible (✓)              ││
│ │ • Intervention window: 2 working days                   ││
│ │ • Current status: 1 day remaining                       ││
│ │                                                          ││
│ │ [If Tier 2 Verification]                                ││
│ │ Validation Result: Tier 2 Verification Required         ││
│ │ • Score 60-74: Requires Tier 2 verification            ││
│ │ • Status: Awaiting Tier 2 verification                  ││
│ │                                                          ││
│ │ [If Manual Review]                                      ││
│ │ Validation Result: Manual Review Required               ││
│ │ • Score < 60: Requires manual review                   ││
│ │ • Status: Awaiting MOH review                          ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Supporting Documentation                                 ││
│ │                                                          ││
│ │ 📄 export-certificate.pdf (2.3 MB) [View] [Download]  ││
│ │ 📄 regulatory-approval.pdf (1.8 MB) [View] [Download]  ││
│ │                                                          ││
│ │ [Upload Additional Documents] (if draft or company edit)││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ Tabs: [Details] [History] [Comments]                        │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ History Tab Content                                      ││
│ │                                                          ││
│ │ • Auto-approved by System - 2 days ago                 ││
│ │   (Intervention window expired, no Tier 1 intervention) ││
│ │                                                          ││
│ │ • Submitted by Company Admin - 5 days ago              ││
│ │                                                          ││
│ │ • Created (Draft) by Company Admin - 7 days ago        ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Comments Tab Content                                     ││
│ │                                                          ││
│ │ • MOH Tier 2 Officer - 1 day ago                       ││
│ │   "Request verified. All documentation in order."       ││
│ │                                                          ││
│ │ • Company Admin - 3 days ago                           ││
│ │   "Additional regulatory documents attached."           ││
│ │                                                          ││
│ │ [Add Comment]                                           ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [Role-Based Actions: See Workflow Actions Wireframe]        │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > ECS > Export Requests > [Request ID]"
- **Title:** "Export Request - [Request ID]" (e.g., "REQ-2025-001")
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Status Badge:** Color-coded status badge (top-right or next to title)

### Workflow Status Section
- **Layout:** Card with workflow timeline and status indicator
- **Workflow States Display:**
  - Draft → Submitted → Auto-Approval Queue / Tier2 Verification / Manual Review → Approved → Authorized
  - Visual timeline with checkmarks (✓) for completed states, clock (⏳) for current state
  - Current status highlighted
- **Intervention Window Indicator:**
  - Shows countdown timer for auto-approval queue requests
  - Format: "Intervention Window: X day(s) remaining"
  - Color-coded by urgency (green → yellow → red as window expires)
- **Status-Specific Actions:** See Workflow Actions wireframe for detailed action buttons

### Request Information Section
- **Layout:** Card with request details
- **Fields Display (Read-Only):**
  - Request ID: REQ-YYYY-NNNNN format
  - Company: Company name (link to company detail)
  - SKU: SKU ID and full description (link to SKU detail)
  - Export Destination: Country/region
  - Expected Quantity: Number with units
  - Expected Export Date: Formatted date
  - Created: Creation timestamp
  - Submitted: Submission timestamp (if submitted)
  - Timeline/Purpose: Full text from form

### Threshold Comparison Card (Critical Feature)
- **Layout:** Prominent card with three-column comparison
- **Visualization:**
  - **Current Stock:** Bar chart showing stock level (blue)
  - **VCI Threshold:** Bar chart showing VCI threshold (green)
  - **ECS Threshold:** Bar chart showing ECS threshold (orange, calculated after submission)
- **Values Display:**
  - Current Stock: Actual stock level (from VCI)
  - VCI Threshold: Current threshold value (from thresholds table, threshold_type='vci')
  - ECS Threshold: Calculated threshold (from thresholds table, threshold_type='ecs', or calculated from XAMS)
- **Calculations:**
  - Stock as percentage of each threshold
  - Remaining stock after export quantity
  - Compliance status (above/below thresholds)
- **If Authorized:**
  - **Threshold Switch Indicator:** Warning banner showing threshold switched from VCI to ECS
  - **Switch Date:** Date when threshold switched
  - **Revert Date:** Date when threshold will revert (3 months from authorization)
  - **Countdown:** Days remaining until revert
- **Helper Text:**
  - "ECS Threshold calculated from XAMS (X-month average of MSQ data)."
  - "Threshold switches from VCI to ECS on authorization for 3 calendar months."

### Conditional Validation Status Section
- **Layout:** Card with validation information
- **Content:**
  - **CMC Module Status:** Active/Inactive indicator
  - **Company Compliance Score:** Display with score out of 100
  - **Validation Result:** 
    - Auto-Approval Queue (if score ≥ 75 or CMC inactive)
    - Tier 2 Verification Required (if score 60-74)
    - Manual Review Required (if score < 60)
  - **Status Details:**
    - Intervention window countdown (for auto-approval queue)
    - Current queue position (optional)
    - Awaiting verification/review status
- **Visibility:** Only shown when CMC module is active
- **If CMC Inactive:** Show "Standard review process (CMC module inactive)"

### Supporting Documentation Section
- **Layout:** Card with file list
- **Files Display:**
  - File icon
  - File name
  - File size
  - Actions: View, Download, Remove (if draft/company edit)
- **Actions:**
  - "Upload Additional Documents" button (if draft or company edit mode)
  - File viewer modal (for PDFs, images)
  - Download link (for all files)

### Tabs Section
- **Tabs:** Details (default), History, Comments
- **Details Tab:** Shows all request information (default view)
- **History Tab:** Shows workflow timeline with timestamps
- **Comments Tab:** Shows comments/notes from users

### History Tab Content
- **Layout:** Timeline component (vertical)
- **Entries:**
  - Auto-approved by System (timestamp, reason)
  - Submitted by User (timestamp)
  - Created (Draft) by User (timestamp)
  - Approved/Rejected by MOH (timestamp, user, notes)
  - Verified by Tier 2 (timestamp, user, notes)
  - Intervened by Tier 1 (timestamp, user, notes)
- **Each Entry Shows:**
  - Action/event description
  - User who performed action (if applicable)
  - Timestamp (relative time + absolute time)
  - Notes/reason (if applicable)

### Comments Tab Content
- **Layout:** Comment thread/list
- **Each Comment Shows:**
  - User name and role
  - Timestamp (relative time)
  - Comment text
- **Actions:**
  - "Add Comment" button (opens comment form)
  - Comment form: Textarea + Submit button
- **Visibility:** All users can view, role-based comment permissions

---

## Role-Based Access

### Company Users (IPC only)
- **View:** Own export requests only
- **Actions:**
  - View details, history, comments
  - Cancel draft/submitted requests (before authorization)
  - Add comments
  - Upload additional documents (if draft/submitted)
- **No Actions:** Cannot approve, reject, intervene, or verify

### MOH Tier 1
- **View:** All export requests
- **Actions:**
  - View all details, history, comments
  - Intervene in auto-approval queue (within intervention window)
  - Post-approval intervention (within 24 hours after auto-approval)
  - Approve/Reject manual review requests
  - Revoke authorizations
  - Add comments
- **No Actions:** Cannot verify (Tier 2 function)

### MOH Tier 2
- **View:** All export requests
- **Actions:**
  - View all details, history, comments
  - Verify tier2_verification_required requests
  - Approve/Reject manual review requests (when authorized)
  - Add comments
- **No Actions:** Cannot intervene (Tier 1 function)

---

## State Variations

### Draft State
- **Workflow Status:** Shows "Draft" state
- **Actions:** Company can edit, submit, or cancel
- **Threshold Comparison:** Shows current stock and VCI threshold, ECS threshold as "N/A (will calculate after submission)"

### Submitted State (Auto-Approval Queue)
- **Workflow Status:** Shows "Auto-Approval Queue" with intervention window countdown
- **Actions:** Tier 1 can intervene, Tier 2 can verify (if applicable)
- **Threshold Comparison:** ECS threshold calculated and displayed

### Submitted State (Tier 2 Verification Required)
- **Workflow Status:** Shows "Tier 2 Verification Required" with days since submission
- **Actions:** Tier 2 can verify
- **Threshold Comparison:** ECS threshold calculated and displayed

### Submitted State (Manual Review)
- **Workflow Status:** Shows "Manual Review Required"
- **Actions:** Tier 1/Tier 2 can approve/reject
- **Threshold Comparison:** ECS threshold calculated and displayed

### Approved State
- **Workflow Status:** Shows "Approved" (waiting for authorization)
- **Actions:** System will auto-authorize (or manual authorization by MOH)
- **Threshold Comparison:** ECS threshold displayed, threshold switch pending

### Authorized State
- **Workflow Status:** Shows "Authorized" with validity period countdown
- **Threshold Comparison:** Shows threshold switch indicator (VCI → ECS), switch date, revert date, countdown
- **Actions:** Company can report completion, MOH can revoke

### Completed State
- **Workflow Status:** Shows "Completed"
- **Threshold Comparison:** Threshold switch still active until revert date
- **Actions:** View-only (historical)

### Rejected State
- **Workflow Status:** Shows "Rejected" with rejection reason
- **Threshold Comparison:** No threshold switch (request rejected)
- **Actions:** View-only (historical)

### Cancelled State
- **Workflow Status:** Shows "Cancelled"
- **Threshold Comparison:** No threshold switch (request cancelled)
- **Actions:** View-only (historical)

---

## Design System References

- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Timelines, charts, tabs
- [Workflow Architecture](../../../../02-architecture/workflow-architecture.md) - Export Request Workflow
- [Export Workflow Actions](task-0.5.4.4-export-workflow-actions.md) - Role-based action buttons

---

## Related Wireframes

- [Export Requests List](task-0.5.4.1-export-requests-list.md)
- [Export Request Form](task-0.5.4.2-export-request-form.md)
- [Export Workflow Actions](task-0.5.4.4-export-workflow-actions.md)
- [Export Authorization Detail](../authorizations/task-0.5.4.6-export-authorization-detail.md)

---

**Next:** [Export Workflow Actions](task-0.5.4.4-export-workflow-actions.md)

**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Guided by:** Fatima (MOH Regulatory Requirements) & Dr. Samir (Business Process Validation)

