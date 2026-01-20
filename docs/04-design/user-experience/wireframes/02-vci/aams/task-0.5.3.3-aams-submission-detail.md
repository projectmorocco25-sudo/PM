# Task 0.5.3.3: AAMS Submission Detail Page Wireframe

**Status:** ✅ Complete  
**Route:** `/vci/aams/[id]`  
**File:** `task-0.5.3.3-aams-submission-detail.png`  
**Priority:** 🔴 Critical VCI Workflows

**Design Approach:** Modern detail page with workflow status, submission data table, calculated threshold display, and approval history timeline. Professional, accessible, and optimized for annual regulatory compliance review workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > VCI > AAMS > [Submission ID]                         │
│                                                             │
│ AAMS Submission - 2025                                      │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Workflow Status                                          ││
│ │                                                          ││
│ │ Draft → Submitted → Tier 2 Verified → Tier 1 Approved  ││
│ │   ✓        ✓              ✓              ⏳             ││
│ │                                                          ││
│ │ Current Status: Tier 2 Verified                        ││
│ │                                                          ││
│ │ Threshold Visibility: ✓ Visible (after Tier 2 verify)  ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Submission Information                                   ││
│ │                                                          ││
│ │ Year: 2025                                               ││
│ │ Company: ABC Pharmaceuticals Inc.                        ││
│ │ Submitted: January 15, 2025                             ││
│ │ Verified: February 5, 2025 (Tier 2 - Ahmed Benali)     ││
│ │                                                          ││
│ │ Calculated Threshold: 1,234 units                       ││
│ │ (Based on 12 months sales data)                         ││
│ │                                                          ││
│ │ Regulatory Basis (Fatima's Requirement):                ││
│ │ DMP Regulation Article [X] - Threshold Calculation      ││
│ │ Legal Authority: [Citation]                             ││
│ │ Threshold Modification: Not applicable                  ││
│ │ [View Threshold Details] [View Regulatory Framework]    ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Sales Data Table                                         ││
│ │                                                          ││
│ │ [Export CSV] [View Full Table]                          ││
│ │                                                          ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │ SKU    │ Product Description    │ Jan │ ... │ Dec │ AAMS ││
│ │ ├────────┼────────────────────────┼─────┼─────┼─────┼──────┤│
│ │ │ SKU001 │ Product A / 500mg /   │ 100 │ ... │ 100 │ 1,200││
│ │ │        │ Tablet                │     │     │     │      ││
│ │ ├────────┼────────────────────────┼─────┼─────┼─────┼──────┤│
│ │ │ SKU002 │ Product B / 250mg /   │ 50  │ ... │ 50  │ 600  ││
│ │ │        │ Capsule               │     │     │     │      ││
│ │ └────────┴────────────────────────┴─────┴─────┴─────┴──────┘│
│ │                                                          ││
│ │ Showing 2 of 15 SKUs [View All]                        ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Approval History                                         ││
│ │                                                          ││
│ │ • Tier 2 Verified by Ahmed Benali - 2 days ago          ││
│ │   Notes: "Sales data verified. Threshold calculated."  ││
│ │                                                          ││
│ │ • Submitted by Company Admin - 5 days ago              ││
│ │                                                          ││
│ │ • Created (Draft) - 7 days ago                          ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Enforcement Actions (if any)                             ││
│ │                                                          ││
│ │ Enforcement actions related to threshold violations:    ││
│ │                                                          ││
│ │ ⚠️ Warning - ENF-2024-045                               ││
│ │   Related to: Threshold Breach                          ││
│ │   Status: Executed  Date: 1 week ago                    ││
│ │   [View Enforcement Action Detail →]                    ││
│ │                                                          ││
│ │ [View All Enforcement Actions →]                        ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ Tabs: [Details] [History] [Threshold]                      │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Threshold Tab Content                                    ││
│ │                                                          ││
│ │ Calculated Threshold: 1,234 units                       ││
│ │                                                          ││
│ │ Regulatory Basis (Fatima's Requirement):                ││
│ │ DMP Regulation Article [X] - Threshold Calculation      ││
│ │ Legal Authority: [Legal citation for threshold calculation]││
│ │ [View Regulatory Framework]                             ││
│ │                                                          ││
│ │ Calculation Method:                                      ││
│ │ Sum of 12 months sales (Jan + Feb + ... + Dec)         ││
│ │                                                          ││
│ │ Threshold Multiplier: 1.0x (default)                    ││
│ │ Duration Type: Permanent                                ││
│ │                                                          ││
│ │ Threshold Modification Status:                          ││
│ │ • Regulatory Approval: Not applicable (default threshold)││
│ │ • If Modified: Show regulatory approval reference       ││
│ │                                                          ││
│ │ [View Threshold Management] (MOH Tier 1 only)          ││
│ │                                                          ││
│ │ [If Temporary Threshold]                                ││
│ │ Regulatory Impact (Fatima's Requirement):               ││
│ │ • Regulatory Basis for Reversion: DMP Art. [X]          ││
│ │ • Compliance Impact After Reversion: [Description]      ││
│ │ • Legal Notification Requirements: [Requirements]       ││
│ │ • Revert Date: [Date] (if temporary)                    ││
│ │ Duration Type: Temporary (Auto-Revert)                  ││
│ │ Revert Date: 25/06/2025 (12 days remaining)            ││
│ │ Revert To: 1.0x (default multiplier)                    ││
│ │ ⚠️ Warning: Threshold will revert on 25/06/2025         ││
│ │                                                          ││
│ │ Regulatory Basis:                                        ││
│ │ Article 15, Section 3 - Annual Sales Reporting          ││
│ │ [View Regulatory Framework]                             ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [Approve] [Reject] [Request Info] (MOH actions)            │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > VCI > AAMS > [Submission ID]"
- **Title:** "AAMS Submission - [Year]"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **Edit Button:** Secondary button (Company only, if draft status)
  - **Export Button:** Secondary button (export CSV)
  - **Actions Dropdown:** More actions menu
    - Options: View Audit Log, Print, Download PDF

### Workflow Status Section
- **Layout:** Horizontal timeline showing workflow steps
- **Steps:** Draft → Submitted → Tier 2 Verified → Tier 1 Approved → Completed
- **Visual Indicators:**
  - Completed steps: Green checkmark (✓)
  - Current step: Highlighted with status badge
  - Pending steps: Gray, disabled (⏳)
- **Current Status Display:**
  - **Status Badge:** Color-coded badge
  - **Timestamp:** "Tier 2 Verified: 2 days ago"
- **Threshold Visibility Indicator:**
  - Shows when threshold becomes visible (after Tier 2 verification)
  - Checkmark (✓) if visible, lock icon (🔒) if not yet visible

### Submission Information Section
- **Layout:** Card with key-value pairs
- **Fields:**
  - **Year:** Submission year
  - **Company:** Company name (link to company detail)
  - **Submitted:** Submission date and time
  - **Verified:** Tier 2 verification date and user (if applicable)
  - **Calculated Threshold:** Display threshold value with unit
  - **Threshold Details Link:** Link to threshold detail page
- **Styling:**
  - **Labels:** 14px, color: #6b7280, font-weight: 500
  - **Values:** 16px, color: #111827

### Sales Data Table Section
- **Layout:** Scrollable table (shows first few rows, expandable)
- **Columns:** Same as submission form (SKU, Product Description, Jan-Dec, AAMS)
- **Features:**
  - **Export CSV:** Export full table data
  - **View Full Table:** Expand to show all rows
  - **Row Count:** "Showing X of Y SKUs"
  - **Read-only:** All fields read-only (viewing submitted data)
- **Styling:** Same as submission form table

### Approval History Section
- **Layout:** Vertical timeline
- **Approval Steps:**
  - **Created:** Draft creation timestamp
  - **Submitted:** Submission timestamp and user
  - **Tier 2 Verified:** Verification timestamp, user, notes
  - **Tier 1 Approved:** Approval timestamp, user, notes (if applicable)
- **Visual:** Timeline with connecting lines
- **Notes:** Expandable review/approval notes

### Tabs
- **Tabs:** Details (default), History, Threshold
- **Tab Content:**
  - **Details:** All submission information (default view)
  - **History:** Timeline of all changes and status updates
  - **Threshold:** Threshold calculation details and management (if applicable)

### Threshold Tab Content
- **Calculated Threshold:** Large display of threshold value
- **Calculation Method:** Explanation of how threshold is calculated
- **Threshold Multiplier:** Display current multiplier (if modified)
- **Duration Type:** Display duration type badge:
  - **Permanent:** Gray badge - "Permanent"
  - **Temporary Auto-Revert:** Orange badge - "Temporary (Auto-Revert)"
  - **Temporary Manual Review:** Yellow badge - "Temporary (Manual Review)"
- **Revert Date (if temporary):** Display revert date with countdown:
  - Format: DD/MM/YYYY (e.g., "25/06/2025")
  - Shows days remaining (e.g., "12 days remaining")
  - Color-coded: Green (>30 days), Yellow (7-30 days), Red (<7 days)
- **Revert To (if temporary):** Display revert-to multiplier and threshold value
- **Pending Reversion Warning (if applicable):**
  - Orange/yellow warning banner if reversion date approaching
  - Shows "⚠️ Warning: Threshold will revert on [Date]"
  - Link to view pending reversions (MOH Tier 1 only)
- **Threshold Management Link:** Link to threshold management page (MOH Tier 1 only)
- **Regulatory Basis:** Reference to regulatory framework
- **Regulatory Framework Link:** Link to comprehensive regulatory framework

### Action Buttons (MOH Only)
- **Approve:** Primary button (Tier 1 only, if pending approval)
- **Reject:** Secondary/destructive button (requires reason)
- **Request Info:** Secondary button (Tier 2 or Tier 1)
- **Layout:** Right-aligned, below tabs

---

## Role-Based Access

### Company Users
- **View:** Own company submissions only
- **Edit:** Can edit draft submissions (navigate to edit form)
- **View Threshold:** Can view threshold after Tier 2 verification
- **Actions:** Edit (if draft), Export CSV, View History

### MOH Tier 1
- **Full Access:** Can view all submissions
- **View Threshold:** Can view and modify thresholds
- **Actions:** Approve, Reject, Request Info, Modify Threshold

### MOH Tier 2
- **View Access:** Can view all submissions
- **View Threshold:** Can view thresholds after verification
- **Actions:** Verify, Request Info (cannot approve or modify thresholds)

---

## State Variations

### Draft State
- **Status Badge:** Gray "Draft"
- **Actions:** Edit button (Company), Delete (Company)
- **Threshold:** Not visible (not yet calculated)

### Submitted State (Pending Verification)
- **Status Badge:** Blue "Submitted" / "Pending Verification"
- **Actions:** Request Info (MOH), View (Company)
- **Threshold:** Not visible (waiting for Tier 2 verification)

### Tier 2 Verified State
- **Status Badge:** Yellow "Tier 2 Verified" / "Pending Approval"
- **Actions:** Approve/Reject (Tier 1), Request Info (Tier 1)
- **Threshold:** ✓ Visible to company and MOH
- **Threshold Display:** Shows calculated threshold value

### Tier 1 Approved State
- **Status Badge:** Green "Approved"
- **Actions:** Limited (view, export)
- **Threshold:** ✓ Visible, final value

### Completed State
- **Status Badge:** Green "Completed"
- **Actions:** View, export only
- **Threshold:** ✓ Visible, final value

### Rejected State
- **Status Badge:** Red "Rejected"
- **Rejection Reason:** Displayed in approval history
- **Actions:** View, export, resubmit (Company, if allowed)

---

## Responsive Design

### Desktop (≥1024px)
- **Layout:** Full-width with tabs
- **Table:** Scrollable, shows all columns
- **Timeline:** Horizontal workflow status

### Tablet (768px - 1023px)
- **Layout:** Stacked sections
- **Table:** Horizontal scroll for months
- **Timeline:** Horizontal workflow status

### Mobile (<768px)
- **Layout:** Single column
- **Table:** Card-based layout per SKU
- **Timeline:** Vertical workflow status
- **Tabs:** Full-width tab navigation

---

## Interactions

### Click Actions
- **Company Name:** Navigate to company detail
- **View Threshold Details:** Navigate to threshold detail page
- **Edit Button:** Navigate to edit form (if draft)
- **Export CSV:** Trigger CSV download
- **Approve/Reject:** Open approval/rejection modal
- **Request Info:** Open request information form

### Hover States
- **Links:** Underline on hover
- **Buttons:** Slight elevation/shadow
- **Table Rows:** Background color change (#f9fafb)

---

## Design System References

### Components Used
- **Card Component:** Information sections (shadcn/ui card)
- **Badge Component:** Status badges (shadcn/ui badge)
- **Timeline Component:** Workflow status, approval history (shadcn/ui timeline pattern)
- **Table Component:** Sales data table (shadcn/ui table)
- **Tabs Component:** Detail tabs (shadcn/ui tabs)
- **Button Component:** Action buttons (shadcn/ui button)
- **Icon Component:** Status icons, action icons (Lucide React via shadcn/ui)

### Design Inspiration References
- **Stripe Dashboard:** https://dashboard.stripe.com - Professional detail pages, status indicators
- **GitHub:** https://github.com - Clean detail views, timeline patterns
- **Linear App:** https://linear.app - Modern detail pages, smooth interactions
- **shadcn/ui Components:** https://ui.shadcn.com - Component patterns

### Colors (From Design System)
- **Background:** #ffffff (white) - Clean, professional
- **Card Border:** #e5e7eb (border-default) - Subtle separation
- **Text Primary:** #111827 (text-primary) - High contrast
- **Text Secondary:** #6b7280 (text-secondary)
- **Status Badge Colors:**
  - Draft: #6b7280 (gray-500)
  - Submitted: #3b82f6 (primary-500)
  - Tier 2 Verified: #fbbf24 (warning-500)
  - Tier 1 Approved: #10b981 (success-500)
  - Completed: #10b981 (success-500)
  - Rejected: #ef4444 (error-500)

### Typography (From Design System)
- **Page Title:** 24px, font-weight: 600, color: #111827
- **Section Title:** 18px, font-weight: 600
- **Body Text:** 16px, font-weight: 400
- **Label:** 14px, font-weight: 500, color: #6b7280
- **Table Header:** 12px, font-weight: 600, uppercase
- **Table Cell:** 14px, font-weight: 400

### Spacing (8px Grid System)
- **Page Padding:** 24px (3 × 8px)
- **Section Spacing:** 16px (2 × 8px) between sections
- **Card Padding:** 16px or 24px
- **Table Cell Padding:** 12px horizontal, 8px vertical
- **Button Padding:** 12px horizontal, 8px vertical
- **Button Spacing:** 16px between buttons

### Transitions & Animations
- **Tab Switch:** 200ms ease-in-out
- **Timeline Animation:** 200ms ease-in-out
- **Button Hover:** 150ms ease-in-out

### Accessibility (WCAG 2.1 AA Compliance)
- **Color Contrast:** Minimum 4.5:1 for text, 3:1 for UI components
- **Focus Indicators:** 2px solid outline, #3b82f6 (primary-500), 2px offset
- **Keyboard Navigation:** Full keyboard support (Tab, Enter, Arrow keys, Escape)
- **Screen Reader Support:** ARIA labels, roles, and descriptions
- **Touch Targets:** Minimum 40px × 40px for all interactive elements
- **ARIA Labels:** Descriptive labels for all actions and sections
- **Skip Links:** "Skip to main content" link for keyboard users

---

## Industry Best Practices Implementation

### Performance Optimizations
- **Lazy Loading:** Load full table data on demand
- **Virtual Scrolling:** For large tables (100+ SKUs)
- **Data Fetching:** Efficient API calls for submission data
- **Caching:** Cache submission data with appropriate TTL

### State Management
- **Submission State:** Track current submission data, workflow status
- **Tab State:** Track active tab
- **Real-time Updates:** WebSocket or polling for status changes (optional)

### Error Handling
- **Loading States:** Skeleton loaders while loading
- **Error Boundaries:** Graceful degradation if data fails to load
- **Retry Logic:** Automatic retry with exponential backoff

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/vci/aams/[id]`
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference including DMP regulations
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - Detailed compliance requirements including AAMS submission requirements
- [Regulatory Policies](../../../../03-governance/regulatory-policies.md) - Regulatory policies including submission policies
- [Workflow Architecture](../../../../02-architecture/workflow-architecture.md) - Workflow states
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Card, Badge, Timeline, Table components
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - Role-based access

---

## Related Wireframes

- [AAMS Submissions List](task-0.5.3.1-aams-submissions-list.md) - Submissions list page
- [AAMS Submission Form](task-0.5.3.2-aams-submission-form.md) - Create/edit submission
- [Threshold Detail](../overview/task-0.5.3.5-threshold-detail.md) - Threshold detail page
- [Threshold Management](task-0.5.3.4-threshold-management.md) - Threshold management page

---

**Next:** [Threshold Management](task-0.5.3.4-threshold-management.md)

