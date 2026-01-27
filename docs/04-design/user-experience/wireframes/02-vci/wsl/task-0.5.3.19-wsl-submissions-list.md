# Task 0.5.3.19: WSL Submissions List Page Wireframe

**Status:** ✅ Complete  
**Route:** `/vci/submissions/wsl`  
**File:** `task-0.5.3.19-wsl-submissions-list.png`  
**Priority:** 🔴 Critical VCI Workflows

**Design Approach:** Modern submission queue interface with week filters, deadline indicators, and role-based views. Professional, accessible, and optimized for weekly compliance monitoring workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > VCI > WSL                                             │
│                                                             │
│ My WSL Submissions (Company) / All WSL Submissions (MOH)   │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Filters: [All Weeks ▼] [All Status ▼] [New Submission] ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────────────────────────┐│
│ │ Week Ending  Status      Submitted    Verified   Violations  Replen. Date  Actions         ││
│ │ ───────────  ──────────  ─────────   ─────────  ──────────  ───────────  ──────           ││
│ │ 2025-W03     Submitted   Jan 17      -          ⚠️ 2        Jan 25      [View]           ││
│ │ (Jan 19)     (On Time)   (Friday)    Pending    violations  (2025)      [Edit]           ││
│ │                                                          [Expand Details]                  ││
│ │                                                          • SKU002: Replen. Jan 25         ││
│ │                                                          • SKU003: Replen. Jan 28         ││
│ │                                                          ││
│ │ 2025-W02     Tier 2      Jan 10      Jan 12     ✓ 0        -            [View]           ││
│ │ (Jan 12)     Verified    (Friday)    (2025)     (None)     -            [Details]        ││
│ │                                                          ││
│ │ 2025-W01     Completed   Jan 3       Jan 5      ✓ 0        -            [View]           ││
│ │ (Jan 5)      (Approved)  (Friday)    (2025)     (None)     -            [Details]        ││
│ │                                                          ││
│ │ 2024-W52     ⚠️ Late     Dec 27      Dec 30     ⚠️ 1        Jan 5       [View]           ││
│ │ (Dec 29)     Submitted   (Monday)    (2024)     violation  (2025)      [Details]        ││
│ │              (2 days late)                                [Expand Details]                ││
│ │                                                          • SKU005: Replen. Jan 5          ││
│ │                                                          ││
│ │ [Load More]                                             ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ℹ️ Weekly Submission Deadline                              ││
│    Deadline: Friday 5:00 PM (submission window: Mon-Fri)  ││
│    Next Deadline: [Date] ([X] days remaining)             ││
│    Late submissions trigger compliance violations.         ││
│                                                             │
│    Regulatory Basis (Fatima's Requirement):               ││
│    DMP Regulation Article [X] - Weekly Stock Level Submission││
│    Late Submission Penalties: [Link to penalties]         ││
│    [View Regulatory Framework]                             ││
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > VCI > WSL"
- **Title:** "My WSL Submissions" (Company) or "All WSL Submissions" (MOH)
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **New Submission Button:** Primary button (Company only, if deadline not passed)
  - **Spacing:** 16px between actions

### Filters Bar
- **Week Filter:** Dropdown (All Weeks, Current Week, Last 4 Weeks, Custom Range)
- **Status Filter:** Dropdown (All, Draft, Submitted, Tier 2 Verified, Completed, Late, Missing)
- **Date Range:** Optional date range picker for custom filtering
- **Layout:** Horizontal bar above table, responsive (stacks on mobile)

### Compliance Information Banner (Enhanced per Fatima's Requirement)
- **Display:** Info banner below filters (collapsible but visible by default)
- **Content:**
  - **Deadline:** "Friday 5:00 PM (submission window: Mon-Fri)"
  - **Next Deadline:** "[Date] ([X] days remaining)"
  - **Regulatory Basis (Fatima's Requirement - REQUIRED):** "DMP Regulation Article [X] - Weekly Stock Level Submission"
  - **Late Submission Consequences:** Description of penalties
  - **Late Submission Penalties:** Link to penalties or penalty information
  - **Regulatory Reference:** Link to regulatory framework document
- **Styling:** Light blue background (#eff6ff), info icon, dismissible (but reappears on page load for compliance visibility)
- **Urgency Indicator:** 🔴 if <2 days remaining, 🟡 if 2-5 days, 🟢 if >5 days

### Submissions Table
- **Layout:** Full-width table with horizontal scroll on mobile
- **Columns:**
  1. **Week Ending:** Week identifier (e.g., "2025-W03") and date (e.g., "Jan 19")
  2. **Status:** Workflow status with badge and deadline indicator
  3. **Submitted:** Submission date and time (relative time for recent, absolute for older)
  4. **Verified:** Tier 2 verification date (if applicable)
  5. **Violations:** Compliance violations count with badge:
     - ✓ 0 (None) - Green checkmark if no violations
     - ⚠️ X violations - Orange warning badge with count
     - Expandable details showing SKU and Replenishment Date for each violation
  6. **Replenishment Date:** Earliest replenishment date from violations (if any):
     - Shows earliest date if multiple violations
     - "-" if no violations
     - Format: DD/MM/YYYY or relative (e.g., "Jan 25 (2025)")
  7. **Actions:** View, Edit (if draft), Details buttons
- **Expandable Violation Details:**
  - Click "Expand Details" to show list of violations with:
    - SKU code
    - Replenishment Date for that SKU
    - Link to compliance violation detail
- **Status Badges:**
  - Draft: Gray (#6b7280)
  - Submitted (On Time): Blue (#3b82f6) - "On Time" indicator
  - Submitted (Late): Orange (#f97316) - "Late" indicator with days late
  - Tier 2 Verified: Yellow (#fbbf24) - "Pending Approval"
  - Completed: Green (#10b981) - "Completed"
  - Missing: Red (#ef4444) - "Missing" (no submission)
- **Violation Badges:**
  - No Violations: Green checkmark (✓) with "0 (None)"
  - Has Violations: Orange warning (⚠️) with count (e.g., "⚠️ 2 violations")
  - Expandable: Click to show detailed list of violations with SKU and Replenishment Date
- **Deadline Indicators:**
  - **On Time:** Green checkmark (✓) or "On Time" badge
  - **Late:** Orange warning badge with days late (e.g., "2 days late")
  - **Upcoming:** Countdown to deadline (e.g., "3 days until deadline")
  - **Missing:** Red "Missing" badge for weeks without submission

### Week Display Format
- **Week Identifier:** ISO week format (e.g., "2025-W03")
- **Week Ending Date:** Parenthetical date (e.g., "(Jan 19)")
- **Sortable:** By week ending date (newest first by default)

---

## Role-Based Access

### Company Users
- **View:** Only own company submissions
- **Title:** "My WSL Submissions"
- **Actions:**
  - Create new submission (if deadline not passed)
  - Edit draft submissions
  - View submitted submissions (read-only after submission)
- **Deadline Visibility:** See countdown and deadline information
- **Missing Submissions:** See list of weeks without submissions

### MOH Tier 1
- **View:** All company submissions
- **Title:** "All WSL Submissions"
- **Actions:**
  - View all submissions
  - Approve/reject submissions
  - View compliance violations triggered by late/missing submissions

### MOH Tier 2
- **View:** All company submissions
- **Title:** "All WSL Submissions"
- **Actions:**
  - View all submissions
  - Verify submissions
  - Request additional information
  - View compliance violations

---

## State Variations

### Empty State (No Submissions)
- **Message:** "No WSL submissions found"
- **Subtext:** "Create your first WSL submission to get started"
- **Action Button:** "New Submission" (Company only, if deadline not passed)
- **Visual:** Empty state illustration

### Loading State
- **Skeleton Loaders:** Table rows with skeleton placeholders
- **Filter Loading:** Skeleton for filter dropdowns

### Missing Submissions State
- **Visual Indicator:** Red "Missing" badge for weeks without submissions
- **Warning Message:** "You have missing submissions for [X] weeks"
- **Action:** "Submit Missing Weeks" button (if within grace period)

### Late Submissions State
- **Visual Indicator:** Orange "Late" badge with days late
- **Warning Message:** "You have [X] late submissions"
- **Compliance Violation Link:** Link to compliance violations list

---

## Responsive Design

### Desktop (≥1024px)
- **Layout:** Full-width table with filters bar
- **Table:** All columns visible
- **Filters:** Horizontal bar

### Tablet (768px - 1023px)
- **Layout:** Stacked filters
- **Table:** Horizontal scroll for table
- **Columns:** Priority columns visible, others scrollable

### Mobile (<768px)
- **Layout:** Single column
- **Table:** Card-based layout instead of table
- **Filters:** Collapsible filter drawer
- **Actions:** Full-width buttons

---

## Interactions

### Click Actions
- **Submission Row:** Navigate to submission detail page
- **View Button:** Navigate to submission detail
- **Edit Button:** Navigate to submission form (if draft)
- **Details Button:** Expand inline details or navigate to detail page
- **New Submission:** Navigate to submission form

### Hover States
- **Table Row:** Background color change (#f9fafb)
- **Buttons:** Slight elevation/shadow
- **Links:** Underline on hover

### Keyboard Navigation
- **Tab:** Navigate through filters and table rows
- **Enter:** Activate selected row or button
- **Arrow Keys:** Navigate table rows (if implemented)

---

## Design System References

### Components Used
- **Table Component:** Submissions table (shadcn/ui table)
- **Filter Component:** Week, status filters (shadcn/ui select)
- **Button Component:** New submission, view, edit buttons (shadcn/ui button)
- **Badge Component:** Status badges, deadline indicators (shadcn/ui badge)
- **Icon Component:** Status icons, deadline icons (Lucide React via shadcn/ui)
- **Skeleton Component:** Loading states (shadcn/ui skeleton)
- **Empty State Component:** No submissions message (shadcn/ui empty state pattern)
- **Alert Component:** Deadline information banner (shadcn/ui alert)

### Design Inspiration References
- **Stripe Dashboard:** https://dashboard.stripe.com - Professional submission patterns
- **GitHub:** https://github.com - Clean submission lists, status indicators
- **Linear App:** https://linear.app - Modern submission queues, smooth interactions
- **shadcn/ui Components:** https://ui.shadcn.com - Component patterns

### Colors (From Design System)
- **Background:** #ffffff (white) - Clean, professional
- **Table Border:** #e5e7eb (border-default) - Subtle separation
- **Table Row Hover:** #f9fafb (bg-secondary) - Light gray on hover
- **Text Primary:** #111827 (text-primary) - High contrast
- **Text Secondary:** #6b7280 (text-secondary)
- **Status Badge Colors:**
  - Draft: #6b7280 (gray-500)
  - Submitted (On Time): #3b82f6 (primary-500)
  - Submitted (Late): #f97316 (orange-500)
  - Tier 2 Verified: #fbbf24 (warning-500)
  - Completed: #10b981 (success-500)
  - Missing: #ef4444 (error-500)

### Typography (From Design System)
- **Page Title:** 24px, font-weight: 600, color: #111827
- **Table Header:** 12px, font-weight: 600, uppercase
- **Table Cell Text:** 14px, font-weight: 400
- **Status Badge:** 11px, font-weight: 600
- **Deadline Text:** 14px, font-weight: 500

### Spacing (8px Grid System)
- **Page Padding:** 24px (3 × 8px)
- **Table Cell Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)
- **Table Row Height:** 48px (6 × 8px) minimum
- **Filter Bar Padding:** 16px (2 × 8px)
- **Button Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)
- **Section Spacing:** 16px (2 × 8px) between sections

### Transitions & Animations
- **Table Row Hover:** 150ms ease-in-out
- **Table Row Click:** 150ms ease-in-out
- **Filter Toggle:** 200ms ease-in-out
- **Button Hover:** 150ms ease-in-out

### Accessibility (WCAG 2.1 AA Compliance)
- **Color Contrast:** Minimum 4.5:1 for text, 3:1 for UI components
- **Focus Indicators:** 2px solid outline, #3b82f6 (primary-500), 2px offset
- **Keyboard Navigation:** Full keyboard support (Tab, Enter, Arrow keys, Escape)
- **Screen Reader Support:** ARIA labels, roles, and descriptions
- **Touch Targets:** Minimum 40px × 40px for all interactive elements
- **ARIA Labels:** Descriptive labels for all table cells and actions
- **Table Headers:** Proper table header associations
- **Skip Links:** "Skip to main content" link for keyboard users

---

## Industry Best Practices Implementation

### Performance Optimizations
- **Lazy Loading:** Submission rows load on demand (pagination or infinite scroll)
- **Debounced Search:** If search is added, debounce input (300ms)
- **CSS Containment:** Use `contain: layout style paint` for table rows
- **Data Fetching:** Parallel API calls for filters and submissions
- **Caching:** Cache submissions with appropriate TTL (5-10 minutes)

### State Management
- **Submissions State:** Track selected submission, filters, sort order, pagination
- **Real-time Updates:** WebSocket or polling for status changes (30s interval, optional)
- **Local Storage:** Cache filter preferences, sort order, pagination state

### Error Handling
- **Loading States:** Skeleton loaders for table rows while loading
- **Error Boundaries:** Graceful degradation if submissions fail to load
- **Retry Logic:** Automatic retry with exponential backoff
- **Offline Support:** Cache submissions for offline access (read-only)
- **Fallback:** Default empty state if all else fails

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/vci/submissions/wsl`
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference including DMP regulations
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - Detailed compliance requirements including WSL submission requirements
- [Regulatory Policies](../../../../03-governance/regulatory-policies.md) - Regulatory policies including submission policies
- [Workflow Architecture](../../../../02-architecture/workflow-architecture.md) - Workflow states
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Table, Filter, Button components
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - Role-based access

---

## Related Wireframes

- [WSL Submission Form](task-0.5.3.20-wsl-submission-form.md) - Create/edit submission
- [WSL Submission Detail](task-0.5.3.13-wsl-submission-detail.md) - Submission detail page
- [Compliance Violations List](../breaches/task-0.5.3.14-compliance-violations-list.md) - Compliance violations triggered by WSL
- [VCI Overview](../overview/task-0.5.3.0-vci-overview.md) - VCI module overview

---

**Next:** [WSL Submission Form](task-0.5.3.20-wsl-submission-form.md)
