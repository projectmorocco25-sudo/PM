# Task 0.5.3.26: VCI Submissions Overview Page Wireframe

**Status:** ✅ Complete  
**Route:** `/vci/submissions`  
**File:** `task-0.5.3.26-vci-submissions.png`  
**Priority:** 🟡 Supporting VCI & RMM

**Design Approach:** Unified submissions overview showing all current/active VCI submissions (AAMS, MSQ, WSL) in one place with type filters/tabs, status indicators, and role-based views. Professional, accessible, and optimized for quick submission status monitoring across all VCI submission types.

**Guidance:** Fatima (MOH Regulatory Requirements) - Unified view of all submission types enables efficient regulatory oversight and compliance monitoring. Supports quick identification of pending actions across AAMS, MSQ, and WSL workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > VCI > Submissions                                     │
│                                                             │
│ All Submissions (Current)                                   │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Type Filters: [All] [AAMS] [MSQ] [WSL]                  ││
│ │                                                          ││
│ │ Status Filters: [All] [Pending] [Approved] [Rejected]  ││
│ │                                                          ││
│ │ Date Range: [This Month ▼]                              ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ℹ️ VCI Submissions                                          ││
│    Regulatory Framework (Fatima's Requirement):             ││
│    • AAMS: DMP Art. [X] - Annual Submission                ││
│    • MSQ: DMP Art. [X] - Monthly Submission                ││
│    • WSL: DMP Art. [X] - Weekly Submission                 ││
│    [View Regulatory Framework]                             ││
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Submission Type │ Period      │ Status          │ Actions││
│ │ ─────────────── │ ──────────  │ ──────────────  │ ──────││
│ │ AAMS            │ 2025        │ Submitted       │ [View]││
│ │                 │             │ (16 days        │        ││
│ │                 │             │  remaining)               ││
│ │                                                          ││
│ │ MSQ             │ Jan 2025    │ Pending Review  │ [View]││
│ │                 │             │ (Flagged)       │ [Edit]││
│ │                                                          ││
│ │ WSL             │ Week 3      │ Completed       │ [View]││
│ │                 │ (Jan 19)    │ (Jan 17)        │        ││
│ │                                                          ││
│ │ AAMS            │ 2024        │ Tier 2 Verified │ [View]││
│ │                 │             │ (Pending Tier 1)│        ││
│ │                                                          ││
│ │ MSQ             │ Dec 2024    │ Accepted        │ [View]││
│ │                                                          ││
│ │ WSL             │ Week 2      │ Completed       │ [View]││
│ │                 │ (Jan 12)    │ (Jan 10)        │        ││
│ │                                                          ││
│ │ [Load More]                                              ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ℹ️ Quick Actions: [New AAMS] [New MSQ] [New WSL]          │
│    (Company users only, based on submission windows)       │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > VCI > Submissions"
- **Title:** "All Submissions" (Company/MOH - shows all current/active submissions)
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **New Submission Buttons:** Quick action buttons for each submission type (Company only, shown based on submission windows)
  - **Spacing:** 16px between actions

### Type Filter Tabs
- **Layout:** Horizontal tabs below header
- **Options:** "All", "AAMS", "MSQ", "WSL"
- **Default:** "All" (shows all submission types)
- **Active State:** Underline indicator, bold text
- **Spacing:** 32px between tabs

### Status Filters
- **Layout:** Dropdown or chip filters
- **Options:** "All Status", "Pending", "Approved/Completed/Accepted", "Rejected/Flagged", "Draft"
- **Multi-select:** Allow multiple status selections
- **Visual:** Status badges in filter display

### Date Range Filter
- **Options:** "This Month", "Last Month", "This Quarter", "Custom Range"
- **Default:** "This Month" (shows current period submissions)
- **Custom Range:** Date picker for start/end dates

### Submissions Table
- **Layout:** Full-width table with horizontal scroll on mobile
- **Columns:**
  1. **Submission Type:** Badge/icon indicating AAMS, MSQ, or WSL
  2. **Period:** 
     - AAMS: Year (e.g., "2025")
     - MSQ: Month (e.g., "Jan 2025")
     - WSL: Week ending date (e.g., "Week 3 (Jan 19)")
  3. **Status:** Workflow status badge with appropriate color
  4. **Actions:** View button, Edit button (if applicable)
- **Row Styling:** Alternating row colors, hover highlight
- **Empty State:** Message when no submissions match filters

### Status Badges
- **AAMS Statuses:**
  - Draft: Gray
  - Submitted: Blue (with days remaining indicator)
  - Tier 2 Verified: Yellow (pending Tier 1 approval)
  - Tier 1 Approved: Green
  - Completed: Green
  - Rejected: Red
- **MSQ Statuses:**
  - Draft: Gray
  - Submitted: Blue
  - Pending Review: Orange (flagged for review)
  - Accepted: Green
  - Rejected: Red
- **WSL Statuses:**
  - Draft: Gray
  - Submitted: Blue
  - Completed: Green
  - Late: Red (if past deadline)

### Quick Actions Section
- **Display:** Below table or in action area
- **Buttons:**
  - "New AAMS" (visible Jan 1 - Jan 31, or during grace period)
  - "New MSQ" (visible anytime, shows current month)
  - "New WSL" (visible Mon-Fri before 17:00 deadline)
- **Visibility:** Company users only, conditional based on submission windows
- **Styling:** Secondary button style

### Role-Based Views
- **Company Users:**
  - Title: "My Submissions"
  - Shows only company's submissions
  - Quick action buttons shown based on submission windows
- **MOH Tier 1/2:**
  - Title: "All Submissions" or "All Company Submissions"
  - Shows all submissions across all companies
  - Additional company filter dropdown
  - No quick action buttons

### Responsive Behavior
- **Desktop:** Full table layout with all columns visible
- **Tablet:** Table with horizontal scroll, type filter tabs remain visible
- **Mobile:** Card layout (one submission per card), tabs stack vertically

---

## Interaction Specifications

### Filter Interactions
- **Type Tab Click:** Filters table to show only selected submission type, updates URL query parameter `?type=aams|msq|wsl`
- **Status Filter Change:** Updates table immediately, updates URL query parameter `?status=pending`
- **Date Range Change:** Updates table immediately, updates URL query parameter `?dateRange=thisMonth`

### Table Interactions
- **Row Click:** Navigates to submission detail page (route varies by type: `/vci/aams/[id]`, `/vci/msq/[id]`, `/vci/wsl/[id]`)
- **View Button:** Same as row click
- **Edit Button:** Opens submission form for editing (if draft or within correction window)

### Quick Action Interactions
- **New AAMS:** Navigates to `/vci/aams/new` (AAMS submission form)
- **New MSQ:** Navigates to `/vci/msq/new` (MSQ submission form)
- **New WSL:** Navigates to `/vci/wsl/new` (WSL submission form)

---

## State Specifications

### Loading State
- **Skeleton:** Table skeleton with 5-10 placeholder rows
- **Spinner:** Overlay spinner if data fetch takes > 500ms

### Empty State
- **No Submissions:** Message: "No submissions found. [New Submission] button to get started."
- **No Filter Results:** Message: "No submissions match your filters. [Clear Filters] button."

### Error State
- **Error Message:** "Unable to load submissions. Please try again."
- **Retry Button:** Reloads submissions data

### Success State
- **Table Display:** All matching submissions shown
- **Count Display:** "Showing X of Y submissions" (if pagination)

---

## Accessibility Specifications

- **Keyboard Navigation:** Tab through filters, arrow keys to navigate table rows
- **Screen Reader:** Table headers announced, submission type and status read clearly
- **Focus Management:** Focus moves to first submission row after filtering
- **ARIA Labels:**
  - Type filter tabs: `aria-label="Filter by submission type"`
  - Status filter: `aria-label="Filter by status"`
  - Table: `aria-label="Submissions list"`
  - View button: `aria-label="View {submission type} submission for {period}"`

---

## Design Notes

- **Unified View:** This page provides a single entry point for viewing all VCI submissions, complementing the individual submission type list pages
- **Navigation Pattern:** Users can click through to individual submission detail pages or use the dedicated type-specific list pages (`/vci/aams`, `/vci/msq`, `/vci/wsl`)
- **Historical Data:** This page shows current/active submissions only. For historical submissions, see `/vci/submissions/history`
- **Filtering:** Type and status filters work together (e.g., "AAMS + Pending" shows only pending AAMS submissions)
- **Quick Actions:** Submission buttons only appear when submission windows are open to prevent invalid submissions

---

## Related Wireframes

- **VCI Overview:** [Task 0.5.3.0 - VCI Overview](../overview/task-0.5.3.0-vci-overview.md)
- **AAMS Submissions List:** [Task 0.5.3.1 - AAMS Submissions List](../aams/task-0.5.3.1-aams-submissions-list.md)
- **MSQ Submissions List:** [Task 0.5.3.9 - MSQ Submissions List](../msq/task-0.5.3.9-msq-submissions-list.md)
- **WSL Submissions List:** [Task 0.5.3.19 - WSL Submissions List](../wsl/task-0.5.3.19-wsl-submissions-list.md)
- **Submission History:** [Task 0.5.3.28 - Submission History](../../../05-audit-historical/historical-data/task-0.5.3.28-submission-history.md)

---

**Last Updated:** 2026-01-12  
**Created By:** Emma (UI/UX + Next.js Frontend Specialist)  
**Reviewed By:** Fatima (MOH Regulatory Requirements)
