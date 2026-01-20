# Task 0.5.4.6: Export Authorization Detail Page Wireframe

**Status:** ✅ Complete  
**Route:** `/ecs/authorizations/[id]`  
**File:** `task-0.5.4.6-export-authorization-detail.png`  
**Priority:** 🟡 ECS Module

**Design Approach:** Modern detail page with authorization details, validity period indicator, 90-day countdown, expiration warnings (30/15/7 days), threshold status, and extension request interface. Professional, accessible, and optimized for export authorization management.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > ECS > Export Authorizations > [Authorization ID]      │
│                                                             │
│ Export Authorization - AUTH-2025-001                         │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Authorization Status                                      ││
│ │                                                          ││
│ │ Status: Active                                           ││
│ │ Validity: 45 days remaining                              ││
│ │                                                          ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │ Validity Countdown                                  │ ││
│ │ │                                                     │ ││
│ │ │ Authorized: January 15, 2025                        │ ││
│ │ │ Expires: April 15, 2025                             │ ││
│ │ │                                                     │ ││
│ │ │ [████████████████████░░░░░░░░░░] 45 days remaining │ ││
│ │ │                                                     │ ││
│ │ │ Progress: 50% complete (45 of 90 days remaining)   │ ││
│ │ └────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ Regulatory Deadline Tracking (Fatima's Requirement):    ││
│ │ • Regulatory Deadline: [Date] (per DMP Art. [X])       ││
│ │ • 90-Day Authorization Period: Regulatory requirement  ││
│ │ • Expiration Consequences: [Link to consequences]      ││
│ │                                                          ││
│ │ [If Expiring Soon]                                      ││
│ │ ⚠️ Warning: Authorization expires in 🔴 7 days          ││
│ │ Regulatory Deadline: [Date]                             ││
│ │ [Request Extension] [View Extension Options]            ││
│ │                                                          ││
│ │ [If Expired]                                            ││
│ │ ⚠️ Status: Expired (Authorization expired on Apr 15)   ││
│ │ Regulatory: Authorization period exceeded               ││
│ │ [View History]                                          ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Authorization Information                                ││
│ │                                                          ││
│ │ Authorization ID: AUTH-2025-001                          ││
│ │ Export Request ID: REQ-2025-001                          ││
│ │ Company: ABC Pharmaceuticals Inc.                      ││
│ │ SKU: SKU001 - Product A / 500mg / Tablet              ││
│ │ Export Destination: Country X                           ││
│ │ Authorized Quantity: 1,000 units                        ││
│ │ Expected Export Date: February 15, 2025               ││
│ │                                                          ││
│ │ Authorized By: System (Auto-approved)                   ││
│ │ Authorization Date: January 15, 2025                     ││
│ │                                                          ││
│ │ [If Completed]                                          ││
│ │ Completion Status: Completed                             ││
│ │ Completion Date: February 10, 2025                     ││
│ │ Actual Export Quantity: 950 units                       ││
│ │                                                          ││
│ │ [If Not Completed]                                      ││
│ │ Completion Status: Pending                               ││
│ │ [Report Completion] (Company users only)                 ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Threshold Status                                         ││
│ │                                                          ││
│ │ Threshold Switch Status: Active                          ││
│ │                                                          ││
│ │ Threshold Switch Date: January 16, 2025                 ││
│ │ Revert Date: April 16, 2025 (3 months after auth)      ││
│ │ Revert Countdown: 45 days remaining                     ││
│ │                                                          ││
│ │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       ││
│ │ │ Previous    │ │ Current     │ │ Future      │       ││
│ │ │ VCI         │ │ ECS         │ │ VCI         │       ││
│ │ │ Threshold   │ │ Threshold   │ │ Threshold   │       ││
│ │ │             │ │             │ │ (after      │       ││
│ │ │ 3,000 units │ │ 4,200 units │ │ revert)     │       ││
│ │ │ (Before)    │ │ (Active)    │ │ 3,000 units │       ││
│ │ │             │ │             │ │             │       ││
│ │ │ ██████      │ │ ███████     │ │ ██████      │       ││
│ │ └─────────────┘ └─────────────┘ └─────────────┘       ││
│ │                                                          ││
│ │ Threshold Switch Timeline:                              ││
│ │ • Jan 15: Authorization → Threshold switched VCI → ECS ││
│ │ • Jan 16 - Apr 16: ECS Threshold active (3 months)    ││
│ │ • Apr 16: Automatic revert to VCI Threshold            ││
│ │                                                          ││
│ │ ℹ️ Threshold switch occurs on authorization and        ││
│ │    remains active for 3 calendar months. Threshold     ││
│ │    will automatically revert to VCI Threshold on       ││
│ │    revert date or if authorization is revoked/cancelled.││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Supporting Documentation                                 ││
│ │                                                          ││
│ │ 📄 export-certificate.pdf (2.3 MB) [View] [Download]  ││
│ │ 📄 regulatory-approval.pdf (1.8 MB) [View] [Download]  ││
│ │                                                          ││
│ │ [View All Documents]                                    ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ Tabs: [Details] [History] [Extension] [Completion]          │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ History Tab Content                                      ││
│ │                                                          ││
│ │ • Authorization created - January 15, 2025             ││
│ │   (System auto-approved request REQ-2025-001)          ││
│ │                                                          ││
│ │ • Threshold switched VCI → ECS - January 16, 2025     ││
│ │   (Threshold: 3,000 → 4,200 units)                     ││
│ │                                                          ││
│ │ • Export request approved - January 15, 2025           ││
│ │   (Auto-approved after intervention window)            ││
│ │                                                          ││
│ │ • Export request submitted - January 14, 2025          ││
│ │   (Company Admin submitted request)                     ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Extension Tab Content                                    ││
│ │                                                          ││
│ │ Current Validity Period:                                 ││
│ │ • Start Date: January 15, 2025                          ││
│ │ • End Date: April 15, 2025                              ││
│ │ • Duration: 90 calendar days                            ││
│ │                                                          ││
│ │ Extension Request:                                       ││
│ │ • Status: No extension requested                         ││
│ │ • Maximum Extension: Up to 30 additional days          ││
│ │                                                          ││
│ │ [If Extension Available]                                ││
│ │ [Request Extension] (opens extension request form)       ││
│ │                                                          ││
│ │ Extension History:                                       ││
│ │ • No previous extensions                                 ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Completion Tab Content                                   ││
│ │                                                          ││
│ │ [If Not Completed]                                      ││
│ │ Completion Status: Pending                               ││
│ │                                                          ││
│ │ [Report Completion] (opens completion reporting form)    ││
│ │                                                          ││
│ │ [If Completed]                                          ││
│ │ Completion Status: Completed                             ││
│ │                                                          ││
│ │ Completion Date: February 10, 2025                     ││
│ │ Actual Export Quantity: 950 units                       ││
│ │ Shipping Information:                                    ││
│ │ • Shipping Date: February 10, 2025                     ││
│ │ • Shipping Method: Air Freight                          ││
│ │ • Tracking Number: TRACK-2025-001                       ││
│ │                                                          ││
│ │ [View Completion Details] [Edit Completion]             ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [If MOH Tier 1 - Active] [Revoke Authorization]             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > ECS > Export Authorizations > [Authorization ID]"
- **Title:** "Export Authorization - [Authorization ID]" (e.g., "AUTH-2025-001")
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Status Badge:** Color-coded status badge (top-right or next to title)

### Authorization Status Section
- **Layout:** Card with status and validity countdown
- **Status Display:**
  - Active: Green badge
  - Expiring Soon: Yellow/orange badge
  - Expired: Gray badge
- **Validity Countdown:**
  - **Display:** Progress bar showing days remaining
  - **Format:** "[████████████████████░░░░░░░░░░] 45 days remaining"
  - **Progress:** Percentage complete (e.g., "50% complete (45 of 90 days remaining)")
  - **Dates:** Authorized date and expiration date
  - **Countdown:** Days remaining until expiration
- **Expiration Warnings:**
  - **30 days before:** Subtle warning banner
  - **15 days before:** Yellow warning banner
  - **7 days before:** Orange warning banner + "Request Extension" button
  - **Expired:** Red warning banner + "View History" link

### Authorization Information Section
- **Layout:** Card with authorization details
- **Fields Display (Read-Only):**
  - Authorization ID: AUTH-YYYY-NN format
  - Export Request ID: REQ-YYYY-NNNNN format (link to request)
  - Company: Company name (link to company detail)
  - SKU: SKU ID and full description (link to SKU detail)
  - Export Destination: Country/region
  - Authorized Quantity: Number with units
  - Expected Export Date: Formatted date
  - Authorized By: User/System who authorized (e.g., "System (Auto-approved)")
  - Authorization Date: Formatted date
  - Completion Status: Completed/Pending
  - Completion Date: Formatted date (if completed)
  - Actual Export Quantity: Number with units (if completed)

### Threshold Status Section (Critical Feature)
- **Layout:** Prominent card with threshold switch timeline
- **Threshold Switch Status:**
  - Active: Shows threshold switch is active
  - Inactive: Shows threshold not switched (if authorization not active)
- **Timeline Display:**
  - **Previous VCI Threshold:** Shows threshold before switch (3,000 units)
  - **Current ECS Threshold:** Shows active threshold (4,200 units)
  - **Future VCI Threshold:** Shows threshold after revert (3,000 units)
  - **Visual:** Three-column comparison with bar charts
- **Dates:**
  - Threshold Switch Date: Date when threshold switched (authorization date + 1 day)
  - Revert Date: Date when threshold will revert (authorization date + 3 months)
  - Revert Countdown: Days remaining until revert
- **Timeline Visualization:**
  - Timeline showing threshold switch events
  - Color coding: VCI Threshold (green), ECS Threshold (orange)
- **Helper Text:**
  - "Threshold switch occurs on authorization and remains active for 3 calendar months."
  - "Threshold will automatically revert to VCI Threshold on revert date or if authorization is revoked/cancelled."

### Supporting Documentation Section
- **Layout:** Card with file list
- **Files Display:**
  - File icon
  - File name
  - File size
  - Actions: View, Download
- **Actions:**
  - "View All Documents" link (if multiple files)
  - File viewer modal (for PDFs, images)
  - Download link (for all files)

### Tabs Section
- **Tabs:** Details (default), History, Extension, Completion
- **Details Tab:** Shows all authorization information (default view)
- **History Tab:** Shows authorization and threshold switch timeline
- **Extension Tab:** Shows extension request interface and history
- **Completion Tab:** Shows completion reporting interface or completion details

### History Tab Content
- **Layout:** Timeline component (vertical)
- **Entries:**
  - Authorization created (timestamp, system/user)
  - Threshold switched VCI → ECS (timestamp, threshold values)
  - Export request approved (timestamp, system/user)
  - Export request submitted (timestamp, user)
  - Extension requested (if applicable, timestamp, user)
  - Completion reported (if applicable, timestamp, user)
  - Authorization revoked (if applicable, timestamp, user, reason)
- **Each Entry Shows:**
  - Event description
  - User/system who performed action (if applicable)
  - Timestamp (relative time + absolute time)
  - Related details (threshold values, quantities, etc.)

### Extension Tab Content
- **Layout:** Card with extension information
- **Current Validity Period:**
  - Start Date: Authorization date
  - End Date: Expiration date (90 days from authorization)
  - Duration: 90 calendar days
- **Extension Request Interface:**
  - Status: No extension requested / Extension requested / Extension approved / Extension rejected
  - Maximum Extension: Up to 30 additional days
  - **Request Extension Button:** Opens extension request form (if available)
  - Extension Request Form:
    - Requested Extension Days (1-30 days)
    - Extension Reason (required, textarea)
    - Submit Extension Request button
- **Extension History:**
  - List of previous extension requests (if any)
  - Each entry shows: Request date, requested days, status, approval/rejection date, reason

### Completion Tab Content
- **Layout:** Card with completion information
- **If Not Completed:**
  - Completion Status: Pending
  - **Report Completion Button:** Opens completion reporting interface (Company users only)
- **If Completed:**
  - Completion Status: Completed
  - Completion Date: Formatted date
  - Actual Export Quantity: Number with units
  - Shipping Information:
    - Shipping Date: Formatted date
    - Shipping Method: Text
    - Tracking Number: Text
  - **Actions:**
    - "View Completion Details" link (shows full completion report)
    - "Edit Completion" button (if allowed, Company users only)

---

## Role-Based Access

### Company Users (IPC only)
- **View:** Own export authorizations only
- **Actions:**
  - View details, history, extension, completion
  - Request extension (if available)
  - Report completion (if not completed)
  - Edit completion (if allowed)
- **No Actions:** Cannot revoke (MOH function)

### MOH Tier 1
- **View:** All export authorizations
- **Actions:**
  - View all details, history, extension, completion
  - Revoke active authorizations
  - Approve/reject extension requests
  - View all completion reports
- **No Actions:** Cannot report completion (Company function)

### MOH Tier 2
- **View:** All export authorizations
- **Actions:**
  - View all details, history, extension, completion
  - View all completion reports
- **No Actions:** Cannot revoke or approve extensions (Tier 1 functions)

---

## State Variations

### Active State
- **Status:** Active
- **Validity Countdown:** Shows days remaining (e.g., "45 days remaining")
- **Progress Bar:** Shows percentage complete
- **Expiration Warning:** None (if > 30 days remaining)
- **Actions:** View, Request Extension, Report Completion, Revoke (Tier 1)

### Expiring Soon State (30-15 days)
- **Status:** Active (Expiring Soon)
- **Validity Countdown:** Shows days remaining (e.g., "15 days remaining")
- **Progress Bar:** Shows percentage complete (warning color)
- **Expiration Warning:** Yellow warning banner
- **Actions:** View, Request Extension, Report Completion, Revoke (Tier 1)

### Expiring Soon State (15-7 days)
- **Status:** Active (Expiring Soon)
- **Validity Countdown:** Shows days remaining (e.g., "7 days remaining")
- **Progress Bar:** Shows percentage complete (warning color)
- **Expiration Warning:** Orange warning banner + "Request Extension" button
- **Actions:** View, Request Extension, Report Completion, Revoke (Tier 1)

### Expiring Soon State (<7 days)
- **Status:** Active (Expiring Soon)
- **Validity Countdown:** Shows days remaining (e.g., "3 days remaining")
- **Progress Bar:** Shows percentage complete (urgent color)
- **Expiration Warning:** Red warning banner + urgent "Request Extension" button
- **Actions:** View, Request Extension, Report Completion, Revoke (Tier 1)

### Expired State
- **Status:** Expired
- **Validity Countdown:** Shows "0 days remaining" or "Expired"
- **Progress Bar:** Shows 100% complete (grayed out)
- **Expiration Warning:** Red warning banner + "View History" link
- **Actions:** View only (read-only, historical)

### Completed State
- **Status:** Completed
- **Completion Tab:** Shows completion details
- **Actions:** View, Edit Completion (if allowed)

### Revoked State
- **Status:** Revoked
- **Revocation Info:** Shows revocation date, reason, user
- **Threshold Status:** Shows threshold reverted (if applicable)
- **Actions:** View only (read-only, historical)

---

## Design System References

- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Timelines, charts, tabs, countdown timers
- [Workflow Architecture](../../../../02-architecture/workflow-architecture.md) - Export Request Workflow
- [Export Completion Reporting](task-0.5.4.7-export-completion-reporting.md) - Completion reporting interface

---

## Related Wireframes

- [Export Authorizations List](task-0.5.4.5-export-authorizations-list.md)
- [Export Completion Reporting](task-0.5.4.7-export-completion-reporting.md)
- [Export Request Detail](../export-requests/task-0.5.4.3-export-request-detail.md)
- [Replenishment Schedule Tracking](../replenishment/task-0.5.4.8-replenishment-schedule-tracking.md)

---

**Next:** [Export Completion Reporting](task-0.5.4.7-export-completion-reporting.md)

**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Guided by:** Fatima (MOH Regulatory Requirements) & Dr. Samir (Business Process Validation)

