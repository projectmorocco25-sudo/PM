# Task 0.5.3.15: WSL Submission Detail Page Wireframe

**Status:** 🟡 In Progress  
**Route:** `/vci/wsl/[id]`  
**File:** `task-0.5.3.13-wsl-submission-detail.png`  
**Note:** File name uses 0.5.3.13 but task number is 0.5.3.15 per phase-0-5-ui-ux-wireframes.md  
**Priority:** 🔴 Critical VCI Workflows

**Design Approach:** Modern detail page with workflow status, stock levels table, compliance violation indicators, and approval history timeline. Professional, accessible, and optimized for weekly compliance monitoring review workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > VCI > WSL > [Submission ID]                          │
│                                                             │
│ WSL Submission - Week Ending January 19, 2025               │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Workflow Status                                          ││
│ │                                                          ││
│ │ Draft → Submitted → Tier 2 Verified → Completed         ││
│ │   ✓        ✓              ✓              ✓             ││
│ │                                                          ││
│ │ Current Status: Completed                                ││
│ │                                                          ││
│ │ Submission Status: On Time ✓                            ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Submission Information                                   ││
│ │                                                          ││
│ │ Week Ending: January 19, 2025 (Friday)                  ││
│ │ Company: ABC Pharmaceuticals Inc.                       ││
│ │ Submitted: January 17, 2025 at 4:30 PM (On Time)       ││
│ │ Verified: January 18, 2025 (Tier 2 - Ahmed Benali)     ││
│ │                                                          ││
│ │ Breaches Detected: 2 compliance violations              ││
│ │ [View Compliance Violations]                            ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Stock Levels Table                                       ││
│ │                                                          ││
│ │ [Export CSV] [View Full Table]                          ││
│ │                                                          ││
│ │ ┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐ ││
│ │ │ SKU    │ Product Description    │ Threshold │ Stock │ Compliance % │ Replen. Date │ Violation Reason │ Status ││
│ │ ├────────┼────────────────────────┼───────────┼───────┼──────────────┼──────────────┼──────────────────┼────────┤│
│ │ │ SKU001 │ Product A / 500mg /   │ 1,234     │ 1,234 │ 100% ✓      │ -            │ -                │ ✓ OK   ││
│ │ │        │ Tablet                │           │       │              │              │                  │         ││
│ │ ├────────┼────────────────────────┼───────────┼───────┼──────────────┼──────────────┼──────────────────┼────────┤│
│ │ │ SKU002 │ Product B / 250mg /   │ 600       │ 400   │ 67% ⚠️       │ 25/01/2025   │ Stock replen...  │ ⚠️ Viol││
│ │ │        │ Capsule               │           │       │              │              │ (truncated)      │         ││
│ │ ├────────┼────────────────────────┼───────────┼───────┼──────────────┼──────────────┼──────────────────┼────────┤│
│ │ │ SKU003 │ Product C / 100mg /   │ 800       │ 500   │ 63% ⚠️       │ 28/01/2025   │ Supplier delay...│ ⚠️ Viol││
│ │ │        │ Syrup                 │           │       │              │              │ (truncated)      │         ││
│ │ └────────┴────────────────────────┴───────────┴───────┴──────────────┴──────────────┴──────────────────┴────────┘│
│ │                                                          ││
│ │ Showing 3 of 15 SKUs [View All]                         ││
│ │                                                          ││
│ │ Compliance Violation Indicators:                         ││
│ │ • ⚠️ = Stock below threshold (Threshold Compliance < 100%) ││
│ │ • ✓ = Stock above threshold (Threshold Compliance ≥ 100%) ││
│ │ • Replenishment Date and Compliance Violation Reason shown for violations ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Approval History                                         ││
│ │                                                          ││
│ │ • Tier 2 Verified by Ahmed Benali - 1 day ago          ││
│ │   Notes: "Stock levels verified. 2 breaches detected."  ││
│ │                                                          ││
│ │ • Submitted by Company Admin - 2 days ago              ││
│ │                                                          ││
│ │ • Created (Draft) - 3 days ago                          ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ Tabs: [Details] [History] [Breaches]                       │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Breaches Tab Content                                     ││
│ │                                                          ││
│ │ Compliance Violations Detected: 2                        ││
│ │                                                          ││
│ │ 1. SKU002 - Product B / 250mg / Capsule                 ││
│ │    Stock: 400 units | Threshold: 600 units              ││
│ │    Status: Active | [View Compliance Violation Detail] ││
│ │                                                          ││
│ │ 2. SKU003 - Product C / 100mg / Syrup                   ││
│ │    Stock: 500 units | Threshold: 800 units              ││
│ │    Status: Active | [View Compliance Violation Detail] ││
│ │                                                          ││
│ │ [View All Compliance Violations]                        ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Enforcement Actions (if any)                             ││
│ │                                                          ││
│ │ Enforcement actions created from compliance violations: ││
│ │                                                          ││
│ │ ⚠️ Warning - ENF-2025-001                               ││
│ │   Created from: SKU002 Compliance Violation             ││
│ │   Status: Executed  Date: 1 day ago                     ││
│ │   [View Enforcement Action Detail →]                    ││
│ │                                                          ││
│ │ [View All Enforcement Actions →]                        ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [Approve] [Reject] [Request Info] (MOH actions)            │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > VCI > WSL > [Submission ID]"
- **Title:** "WSL Submission - Week Ending [Date]"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **Edit Button:** Secondary button (Company only, if draft status)
  - **Export Button:** Secondary button (export CSV)
  - **Actions Dropdown:** More actions menu
    - Options: View Audit Log, Print, Download PDF

### Workflow Status Section
- **Layout:** Horizontal timeline showing workflow steps
- **Steps:** Draft → Submitted → Tier 2 Verified → Completed
- **Visual Indicators:**
  - Completed steps: Green checkmark (✓)
  - Current step: Highlighted with status badge
  - Pending steps: Gray, disabled
- **Current Status Display:**
  - **Status Badge:** Color-coded badge
  - **Timestamp:** "Completed: 1 day ago"
- **Submission Status Indicator:**
  - **On Time:** Green checkmark (✓) with "On Time" badge
  - **Late:** Orange warning badge with days late

### Submission Information Section
- **Layout:** Card with key-value pairs
- **Fields:**
  - **Week Ending:** Week ending date (Friday)
  - **Company:** Company name (link to company detail)
  - **Submitted:** Submission date and time with on-time/late indicator
  - **Verified:** Tier 2 verification date and user (if applicable)
  - **Breaches Detected:** Count of compliance violations with link
- **Styling:**
  - **Labels:** 14px, color: #6b7280, font-weight: 500
  - **Values:** 16px, color: #111827

### Stock Levels Table Section
- **Layout:** Scrollable table (shows first few rows, expandable)
- **Columns:**
  1. **SKU:** SKU code/identifier
  2. **Product Description:** Product Name / Dosage / Form
  3. **Threshold:** Threshold value (read-only, from AAMS calculation or threshold management)
  4. **Stock Quantity:** Stock level value (from submission)
  5. **Threshold Compliance %:** Calculated percentage (Stock Quantity / Threshold × 100):
     - Display format: "100% ✓" (green checkmark if ≥ 100%)
     - Display format: "67% ⚠️" (orange warning if < 100%)
  6. **Replenishment Date:** Date from submission (conditional, shown when Threshold Compliance < 100%):
     - Format: DD/MM/YYYY
     - Shows "-" if Threshold Compliance ≥ 100%
     - Read-only (from submission data)
  7. **Compliance Violation Reason:** Text from submission (conditional, shown when Threshold Compliance < 100%):
     - Maximum 300 characters
     - Truncated with ellipsis in table view (full text on hover or detail view)
     - Shows "-" if Threshold Compliance ≥ 100%
     - Read-only (from submission data)
  8. **Status:** Compliance violation indicator (✓ OK or ⚠️ Violation)
- **Compliance Violation Indicators:**
  - **✓ OK:** Green checkmark - Stock above threshold (Threshold Compliance ≥ 100%)
  - **⚠️ Violation:** Orange warning - Stock below threshold (Threshold Compliance < 100%)
- **Features:**
  - **Export CSV:** Export full table data (includes all columns)
  - **View Full Table:** Expand to show all rows
  - **Row Count:** "Showing X of Y SKUs"
  - **Read-only:** All fields read-only (viewing submitted data)
  - **Tooltip/Hover:** Show full Compliance Violation Reason text on hover
- **Compliance Violation Summary:**
  - Count of compliance violations detected
  - Link to compliance violations list

### Approval History Section
- **Layout:** Vertical timeline
- **Approval Steps:**
  - **Created:** Draft creation timestamp
  - **Submitted:** Submission timestamp and user
  - **Tier 2 Verified:** Verification timestamp, user, notes
- **Visual:** Timeline with connecting lines
- **Notes:** Expandable review/verification notes

### Tabs
- **Tabs:** Details (default), History, Breaches
- **Tab Content:**
  - **Details:** All submission information (default view)
  - **History:** Timeline of all changes and status updates
  - **Compliance Violations:** List of compliance violations detected from this submission

### Compliance Violations Tab Content
- **Layout:** List of compliance violations
- **Violation Items:**
  - SKU and product description
  - Stock level vs threshold comparison
  - Status (Active, Resolved)
  - Link to compliance violation detail page
- **Actions:**
  - **View Compliance Violation Detail:** Navigate to individual compliance violation detail
  - **View All Compliance Violations:** Navigate to compliance violations list

### Enforcement Actions Section (if any)
- **Layout:** Card displaying enforcement actions created from compliance violations
- **Display Condition:** Only shown if enforcement actions were created from violations in this submission
- **Fields:**
  - **Action Type:** Icon + text (⚠️ Warning, 💰 Fine, 🚫 Suspension)
  - **Action ID:** Enforcement action identifier (e.g., "ENF-2025-001")
  - **Created From:** Link to related compliance violation
  - **Status:** Status badge (Executed, Pending Approval, etc.)
  - **Date:** Execution or creation date
- **Actions:**
  - **View Enforcement Action Detail:** Navigate to `/enforcement/actions/[id]`
  - **View All Enforcement Actions:** Navigate to `/enforcement/actions?submission=[id]`
- **Styling:**
  - **Card Background:** Light background to distinguish from other sections
  - **Status Badge:** Color-coded based on action status

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
- **View Compliance Violations:** Can view compliance violations from their submissions
- **Actions:** Edit (if draft), Export CSV, View History, View Compliance Violations

### MOH Tier 1
- **Full Access:** Can view all submissions
- **View Compliance Violations:** Can view all compliance violations
- **Actions:** Approve, Reject, Request Info, View Compliance Violations

### MOH Tier 2
- **View Access:** Can view all submissions
- **View Compliance Violations:** Can view compliance violations
- **Actions:** Verify, Request Info (cannot approve)

---

## State Variations

### Draft State
- **Status Badge:** Gray "Draft"
- **Actions:** Edit button (Company), Delete (Company)
- **Compliance Violations:** Not yet detected (submission not processed)

### Submitted State (Pending Verification)
- **Status Badge:** Blue "Submitted" / "Pending Verification"
- **Actions:** Request Info (MOH), View (Company)
- **Compliance Violations:** May be detected (if auto-detection runs on submission)

### Tier 2 Verified State
- **Status Badge:** Yellow "Tier 2 Verified" / "Pending Approval"
- **Actions:** Approve/Reject (Tier 1), Request Info (Tier 1)
- **Compliance Violations:** Detected and visible
- **Compliance Violation Status:** Active compliance violations displayed

### Completed State
- **Status Badge:** Green "Completed"
- **Actions:** View, export only
- **Breaches:** All breaches visible, may be resolved or active

### Late Submission State
- **Status Badge:** Orange "Late" with days late
- **Warning:** "This submission was [X] days late"
- **Compliance Violation:** Late submission may trigger additional violation

---

## Responsive Design

### Desktop (≥1024px)
- **Layout:** Full-width with tabs
- **Table:** Scrollable, shows all columns
- **Timeline:** Horizontal workflow status

### Tablet (768px - 1023px)
- **Layout:** Stacked sections
- **Table:** Horizontal scroll for columns
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
- **View Compliance Violations:** Navigate to compliance violations list
- **View Compliance Violation Detail:** Navigate to individual compliance violation detail
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
- **Badge Component:** Status badges, compliance violation indicators (shadcn/ui badge)
- **Timeline Component:** Workflow status, approval history (shadcn/ui timeline pattern)
- **Table Component:** Stock levels table (shadcn/ui table)
- **Tabs Component:** Detail tabs (shadcn/ui tabs)
- **Button Component:** Action buttons (shadcn/ui button)
- **Icon Component:** Status icons, compliance violation icons (Lucide React via shadcn/ui)

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
  - Completed: #10b981 (success-500)
  - Late: #f97316 (orange-500)
- **Compliance Violation Indicator Colors:**
  - OK: #10b981 (success-500) - Green checkmark
  - Violation: #f97316 (orange-500) - Orange warning

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

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/vci/wsl/[id]`
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference including DMP regulations
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - Detailed compliance requirements including WSL submission requirements
- [Regulatory Policies](../../../../03-governance/regulatory-policies.md) - Regulatory policies including submission policies
- [Workflow Architecture](../../../../02-architecture/workflow-architecture.md) - Workflow states
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Card, Badge, Timeline, Table components
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - Role-based access

---

## Related Wireframes

- [WSL Submissions List](task-0.5.3.11-wsl-submissions-list.md) - Submissions list page
- [WSL Submission Form](task-0.5.3.12-wsl-submission-form.md) - Create/edit submission
- [Compliance Violations List](../breaches/task-0.5.3.14-compliance-violations-list.md) - Compliance violations list
- [Compliance Violation Detail](../breaches/task-0.5.3.15-compliance-violation-detail.md) - Individual compliance violation detail

---

**Next:** [Compliance Violations List](../breaches/task-0.5.3.14-compliance-violations-list.md)

