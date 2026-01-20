# Task 0.5.3.1: AAMS Submissions List Page Wireframe

**Status:** ✅ Complete  
**Route:** `/vci/aams`  
**File:** `task-0.5.3.1-aams-submissions-list.png`  
**Priority:** 🔴 Critical VCI Workflows

**Design Approach:** Modern submission queue interface with workflow status indicators, year filters, and role-based views. Professional, accessible, and optimized for annual regulatory compliance submissions.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > VCI > AAMS                                            │
│                                                             │
│ My AAMS Submissions (Company) / All AAMS Submissions (MOH) │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Filters: [All Years ▼] [All Status ▼] [New Submission]  ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Year      Status          Submitted    Verified   Actions ││
│ │ ────      ──────────      ─────────   ─────────  ──────  ││
│ │ 2025      Submitted       Jan 15     -          [View]  ││
│ │                          (16 days    Pending    [Edit]  ││
│ │                          remaining)                      ││
│ │                                                          ││
│ │ 2024      Tier 2          Jan 20     Feb 5      [View]  ││
│ │           Verified        (2024)      (2024)    [Details]││
│ │                                                          ││
│ │ 2023      Tier 1          Jan 25     Feb 10     [View]  ││
│ │           Approved        (2023)      (2023)    [Details]││
│ │                                                          ││
│ │ 2022      Completed       Jan 30     Feb 15     [View]  ││
│ │                          (2022)      (2022)    [Details]││
│ │                                                          ││
│ │ [Load More]                                              ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ℹ️ Annual Submission Deadline                              ││
│   Deadline: January 31, 2025 (15 days remaining)           ││
│   Grace Period: Until February 15, 2025 (30 days total)   ││
│   Regulatory Basis: DMP Regulation Article 12 - Annual    ││
│   Registry Submission                                      ││
│   Late Submission Penalties: [Link to penalties]          ││
│   [View Regulatory Framework]                              ││
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > VCI > AAMS"
- **Title:** "My AAMS Submissions" (Company) or "All AAMS Submissions" (MOH)
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **New Submission Button:** Primary button (Company only, if deadline not passed)
  - **Spacing:** 16px between actions

### Filters Bar
- **Year Filter:** Dropdown (All Years, 2025, 2024, 2023, etc.)
- **Status Filter:** Dropdown (All, Draft, Submitted, Tier 2 Verified, Tier 1 Approved, Completed, Rejected)
- **Date Range:** Optional date range picker for custom filtering
- **Layout:** Horizontal bar above table, responsive (stacks on mobile)

### Compliance Information Banner (Enhanced per Fatima's Requirement)
- **Display:** Info banner below filters (collapsible but visible by default)
- **Content:**
  - **Deadline:** "January 31, 2025 ([X] days remaining)"
  - **Grace Period:** "Until February 15, 2025 (30 days total)"
  - **Regulatory Basis (Fatima's Requirement - REQUIRED):** "DMP Regulation Article 12 - Annual Registry Submission"
  - **Legal Requirement Explanation:** Brief explanation of regulatory requirement
  - **Late Submission Penalties (Fatima's Requirement):** Link to penalties or penalty information
  - **Regulatory Reference:** Link to regulatory framework document
- **Styling:** Light blue background (#eff6ff), info icon, dismissible (but reappears on page load for compliance visibility)
- **Urgency Indicator:** 🔴 if <7 days remaining, 🟡 if 7-15 days, 🟢 if >15 days

### Submissions Table
- **Layout:** Full-width table with horizontal scroll on mobile
- **Columns:**
  1. **Year:** Submission year (2025, 2024, etc.)
  2. **Status:** Workflow status with badge
  3. **Submitted:** Submission date (relative time for current year, absolute for past years)
  4. **Verified:** Tier 2 verification date (if applicable)
  5. **Actions:** View, Edit (if draft), Details buttons
- **Status Badges:**
  - Draft: Gray (#6b7280)
  - Submitted: Blue (#3b82f6) - "Pending Verification"
  - Tier 2 Verified: Yellow (#fbbf24) - "Pending Approval"
  - Tier 1 Approved: Green (#10b981) - "Approved"
  - Completed: Green (#10b981) - "Completed"
  - Rejected: Red (#ef4444) - "Rejected"
- **Row Features:**
  - **Hover:** Background color change (#f9fafb)
  - **Click:** Navigate to submission detail page
  - **Deadline Indicator:** Visual countdown for current year submissions (if before deadline)

### Deadline Indicators
- **Current Year Submissions:**
  - Days remaining countdown (e.g., "16 days remaining")
  - Warning badge if < 7 days remaining
  - Critical badge if < 3 days remaining
- **Past Year Submissions:**
  - Absolute dates displayed
  - No countdown

---

## Role-Based Access

### Company Users
- **View:** Only own company submissions
- **Title:** "My AAMS Submissions"
- **Actions:**
  - Create new submission (if deadline not passed)
  - Edit draft submissions
  - View submitted submissions (read-only after submission)
- **Deadline Visibility:** See countdown and grace period information

### MOH Tier 1
- **View:** All company submissions
- **Title:** "All AAMS Submissions"
- **Actions:**
  - View all submissions
  - Approve/reject submissions
  - View threshold information
  - Modify thresholds (separate page)

### MOH Tier 2
- **View:** All company submissions
- **Title:** "All AAMS Submissions"
- **Actions:**
  - View all submissions
  - Verify submissions
  - Request additional information

---

## State Variations

### Empty State (No Submissions)
- **Message:** "No AAMS submissions found"
- **Subtext:** "Create your first AAMS submission to get started"
- **Action Button:** "New Submission" (Company only, if deadline not passed)
- **Visual:** Empty state illustration

### Loading State
- **Skeleton Loaders:** Table rows with skeleton placeholders
- **Filter Loading:** Skeleton for filter dropdowns

### Deadline Passed State
- **Message:** "AAMS submission deadline has passed"
- **Subtext:** "The deadline for [Year] was January 31. Grace period ends February 15."
- **Action:** View past submissions only

### Past Deadline, Within Grace Period
- **Warning Banner:** "You are within the 15-day grace period"
- **Countdown:** Days remaining in grace period
- **Action:** "Submit Now" button (if not yet submitted)

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
- **Filter Component:** Year, status filters (shadcn/ui select)
- **Button Component:** New submission, view, edit buttons (shadcn/ui button)
- **Badge Component:** Status badges (shadcn/ui badge)
- **Icon Component:** Status icons (Lucide React via shadcn/ui)
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
- **Table Row Active:** #f3f4f6 (bg-tertiary) - Slightly darker on click
- **Text Primary:** #111827 (text-primary) - High contrast
- **Text Secondary:** #6b7280 (text-secondary)
- **Text Tertiary:** #9ca3af (text-tertiary)
- **Focus Ring:** #3b82f6 (primary-500), 2px outline
- **Status Badge Colors:**
  - Draft: #6b7280 (gray-500)
  - Submitted: #3b82f6 (primary-500)
  - Tier 2 Verified: #fbbf24 (warning-500)
  - Tier 1 Approved: #10b981 (success-500)
  - Completed: #10b981 (success-500)
  - Rejected: #ef4444 (error-500)

### Typography (From Design System)
- **Page Title:** 24px, font-weight: 600, color: #111827
- **Table Header:** 12px, font-weight: 600, uppercase
- **Table Cell Text:** 14px, font-weight: 400
- **Status Badge:** 11px, font-weight: 600
- **Filter Label:** 12px, font-weight: 500
- **Deadline Text:** 14px, font-weight: 500

### Spacing (8px Grid System)
- **Page Padding:** 24px (3 × 8px) - Comfortable page edge spacing
- **Table Cell Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)
- **Table Row Height:** 48px (6 × 8px) - Touch target minimum
- **Table Border Width:** 1px - Subtle separation
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

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/vci/aams`
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference including DMP regulations
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - Detailed compliance requirements including AAMS submission requirements
- [Regulatory Policies](../../../../03-governance/regulatory-policies.md) - Regulatory policies including submission policies
- [Workflow Architecture](../../../../02-architecture/workflow-architecture.md) - Workflow states
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Table, Filter, Button components
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - Role-based access

---

## Related Wireframes

- [AAMS Submission Form](task-0.5.3.2-aams-submission-form.md) - Create/edit submission
- [AAMS Submission Detail](task-0.5.3.3-aams-submission-detail.md) - Submission detail page
- [VCI Overview](../overview/task-0.5.3.0-vci-overview.md) - VCI module overview

---

**Next:** [AAMS Submission Form](task-0.5.3.2-aams-submission-form.md)

