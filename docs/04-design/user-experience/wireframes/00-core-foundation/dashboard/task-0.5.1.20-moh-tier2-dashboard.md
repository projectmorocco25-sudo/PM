# Task 0.5.1.20: MOH Tier 2 Dashboard Wireframe

**Status:** 🟡 In Progress  
**Route:** `/dashboard` (MOH Tier 2 role)  
**File:** `task-0.5.1.20-moh-tier2-dashboard.png`  
**Priority:** 🔴 Critical Foundation

---

## Wireframe Layout - Scenario 1: %SC Unaddressed (High Priority)

```
┌─────────────────────────────────────────────────────────────┐
│ Home > Dashboard                                             │
│                                                             │
│ Verification Overview            [Filters ▼] [Sort ▼]        │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Submission Compliance (%SC) - PRIORITY                  ││
│ │                                                          ││
│ │ ┌─────────────────────────────────────────────────────┐ ││
│ │ │ Current Period: Week 3 (Jan 15-21)                 │ ││
│ │ │                                                      │ ││
│ │ │         ┌─────────────┐                              │ ││
│ │ │         │             │                              │ ││
│ │ │         │    68%      │                              │ ││
│ │ │         │   %SC       │                              │ ││
│ │ │         │             │                              │ ││
│ │ │         │ 🔴 Below    │                              │ ││
│ │ │         │ Threshold   │                              │ ││
│ │ │         │             │                              │ ││
│ │ │         │ Threshold:  │                              │ ││
│ │ │         │    75%      │                              │ ││
│ │ │         └─────────────┘                              │ ││
│ │ │                                                      │ ││
│ │ │    ┌─────────────────────────────────────┐          │ ││
│ │ │    │ 🟢 On-Time: 45% (112 companies)      │          │ ││
│ │ │    │ 🟡 Late: 23% (58 companies)         │          │ ││
│ │ │    │ 🔴 Unsubmitted: 32% (80 companies)  │          │ ││
│ │ │    └─────────────────────────────────────┘          │ ││
│ │ │                                                      │ ││
│ │ │    Total Expected: 250 companies                     │ ││
│ │ │    Compliant: 68% (On-Time + Late)                   │ ││
│ │ └─────────────────────────────────────────────────────┘ ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Follow-up Queue - Unsubmitted Companies (80)             ││
│ │                                                          ││
│ │ ┌─────────────────────────────────────────────────────┐ ││
│ │ │ Company ABC Pharma          [Extreme] 🔴            │ ││
│ │ │ • WSL: 2 weeks overdue  • Critical medicines: 5     │ ││
│ │ │ • MSQ: 1 month overdue  • Repeated offender         │ ││
│ │ │ Status: Alerted  Follow-up: Tier 1 Required        │ ││
│ │ │ Enforcement: 2 warnings, 0 fines                   │ ││
│ │ │ [Alert] [Escalate to Tier 1] [Create Enforcement]   │ ││
│ │ │ [View Details]                                      │ ││
│ │ ├─────────────────────────────────────────────────────┤ ││
│ │ │ Company DEF Ltd            [Normal] 🟡              │ ││
│ │ │ • WSL: 3 days overdue                               │ ││
│ │ │ Status: Not Alerted  Follow-up: Tier 2            │ ││
│ │ │ Enforcement: 0 warnings, 0 fines                    │ ││
│ │ │ [Alert] [Start Follow-up] [View Details]           │ ││
│ │ └─────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ [View All] [Filter: Extreme Cases] [Export]            ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Wireframe Layout - Scenario 2: %SC Addressed (Normal Priority)

```
┌─────────────────────────────────────────────────────────────┐
│ Home > Dashboard                                             │
│                                                             │
│ Verification Overview            [Filters ▼] [Sort ▼]        │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Submission Compliance (%SC) - Collapsed                  ││
│ │ ┌─────────────────────────────────────────────────────┐ ││
│ │ │ %SC: 82%  🟢 Above Threshold (75%)                   │ ││
│ │ │ ✅ All Actions Taken: 80 alerted, 65 in follow-up    │ ││
│ │ │ [Expand] [View Details]                              │ ││
│ │ └─────────────────────────────────────────────────────┘ ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│ │ Pending         │ │ Oversight       │ │ Review Queue    ││
│ │ Verifications   │ │ Metrics         │ │                 ││
│ │                 │ │                 │ │                 ││
│ │ 8               │ │ Verification    │ │ • Submission #1 ││
│ │                 │ │ Rate: 95%       │ │   Company ABC   ││
│ │ Recent:         │ │                 │ │   High Priority ││
│ │ • Submission #1 │ │ Avg. Time:      │ │   [Verify]      ││
│ │   Company ABC   │ │   2.5 hours     │ │                 ││
│ │   High Priority │ │                 │ │ • Submission #2 ││
│ │   1 hour ago    │ │ Trend: ↗ +2%    │ │   Company XYZ   ││
│ │                 │ │                 │ │   Medium        ││
│ │ • Submission #2 │ │ [View Details →]│ │   [Verify]      ││
│ │   Company XYZ   │ │                 │ │                 ││
│ │   Medium        │ │                 │ │ [View all →]   ││
│ │   2 hours ago   │ │                 │ │                 ││
│ │                 │ │                 │ │                 ││
│ │ [View all →]   │ │                 │ │                 ││
│ └─────────────────┘ └─────────────────┘ └─────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Verification Queue                                        ││
│ │                                                          ││
│ │ ┌─────────────────────────────────────────────────────┐ ││
│ │ │ Submission #12345  Company ABC  [High Priority]    │ ││
│ │ │ Product: XYZ  Submitted: 2 hours ago               │ ││
│ │ │ [Verify] [Flag] [Request Info]                     │ ││
│ │ ├─────────────────────────────────────────────────────┤ ││
│ │ │ Submission #12346  Company XYZ  [Medium Priority]  │ ││
│ │ │ Product: DEF  Submitted: 3 hours ago               │ ││
│ │ │ [Verify] [Flag] [Request Info]                     │ ││
│ │ ├─────────────────────────────────────────────────────┤ ││
│ │ │ Submission #12347  Company DEF  [Low Priority]     │ ││
│ │ │ Product: GHI  Submitted: 5 hours ago               │ ││
│ │ │ [Verify] [Flag] [Request Info]                     │ ││
│ │ └─────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ [Load More]  [Export Queue]                             ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│ │ VCI - SKUs      │ │ Breach Analysis │ │ Quick Links     ││
│ │                 │ │ Queue           │ │                 ││
│ │ Action Required │ │                 │ │ • Analytics     ││
│ │ 8 SKUs          │ │ 5 Breaches      │ │ • Reports       ││
│ │                 │ │                 │ │                 ││
│ │ • SKU ABC-123   │ │ • Breach #001   │ │                 ││
│ │   Company XYZ   │ │   Company ABC   │ │                 ││
│ │   Breach: 5 days│ │   Critical      │ │                 ││
│ │   [View] [Action]│ │   3 days old    │ │                 ││
│ │                 │ │   [Analyze]     │ │                 ││
│ │ • SKU DEF-456   │ │                 │ │                 ││
│ │   Company ABC   │ │ • Breach #002   │ │                 ││
│ │   Near threshold│ │   Company XYZ   │ │                 ││
│ │   [View] [Monitor]│ │   High          │ │                 ││
│ │                 │ │   2 days old    │ │                 ││
│ │ Under Monitor   │ │   [Analyze]     │ │                 ││
│ │ 15 SKUs         │ │                 │ │                 ││
│ │                 │ │ [View All →]    │ │                 ││
│ │ [View All →]    │ │                 │ │                 ││
│ └─────────────────┘ └─────────────────┘ └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > Dashboard"
- **Title:** "Verification Overview"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **Filters Dropdown:** Filter by priority, company, date range
  - **Sort Dropdown:** Sort by priority, date, company
  - **Spacing:** 16px between actions

### %SC (Submission Compliance) Section

**Priority State: Unaddressed (High Priority)**
- **Position:** Top of dashboard, full width
- **Donut Chart:**
  - **Size:** Large (400px × 400px recommended)
  - **Center Display:**
    - **%SC Value:** Large (48px), bold
    - **Label:** "%SC"
    - **Status:** 🔴 Below / 🟢 Above Threshold
    - **Threshold:** Smaller text showing threshold value
  - **Segments:**
    - **🟢 Green:** On-Time submissions (45% in example)
    - **🟡 Yellow/Orange:** Late submissions (23% in example)
    - **🔴 Red:** Unsubmitted (32% in example)
  - **Legend:** Below chart with percentages and company counts
  - **Interactive:** Hover shows tooltip, click segment filters list

**Addressed State (Low Priority)**
- **Position:** Secondary section, collapsible
- **Display:** Collapsed by default
- **Summary View:**
  - **%SC Value:** Medium size (24px)
  - **Status Indicator:** 🟢 Above / 🔴 Below Threshold
  - **Actions Taken Badge:** "✅ All Actions Taken: X alerted, Y in follow-up"
  - **Actions:** "Expand" button, "View Details" link
- **Expanded View:** Shows full donut chart (same as unaddressed state)

### Follow-up Queue - Unsubmitted Companies

**Visibility:** Only shown when %SC unaddressed
- **Title:** "Follow-up Queue - Unsubmitted Companies (X)"
- **Layout:** Full width, scrollable list
- **Item Format:**
  - **Company Name:** Bold, 16px
  - **Priority Badge:** [Extreme] 🔴 or [Normal] 🟡
  - **Details:** Bullet list of missing submissions, critical medicines count, repeated offender indicator
  - **Status:** "Not Alerted" / "Alerted" / "In Follow-up" / "Tier 1 Required"
  - **Follow-up Assignment:** Shows if assigned to Tier 1 or Tier 2
  - **Action Buttons:**
    - **Alert:** Send notification to company
    - **Start Follow-up:** Begin Tier 2 follow-up process
    - **Escalate to Tier 1:** Escalate extreme cases to Tier 1
    - **Create Enforcement:** Open enforcement action creation wizard (warnings only for Tier 2, fines/suspensions require Tier 1)
    - **View Details:** Navigate to company detail page
  - **Enforcement History Display:**
    - **Format:** "Enforcement: X warnings, Y fines, Z suspensions"
    - **Link:** Click to view all enforcement actions for company
    - **Color Indicator:** Red if recent enforcement actions exist
    - **Note:** Tier 2 can create warnings (pending review), but fines/suspensions must be escalated to Tier 1
- **Footer Actions:**
  - **View All:** Navigate to full follow-up queue
  - **Filter: Extreme Cases:** Filter to show only extreme cases
  - **Export:** Download queue as CSV/PDF

### Pending Verifications Widget

**Priority:** High (after %SC addressed)
- **Title:** "Pending Verifications"
- **Count:** Large number (e.g., "8")
  - **Typography:** 32px, font-weight: 700, color: #f59e0b (warning-500)
- **Recent Items List:**
  - **Format:** List items with submission ID, company name, priority badge, timestamp
  - **Priority Badge:** High (red), Medium (orange), Low (yellow)
  - **Max Items:** 3-5 recent items
- **Action Link:** "View all →"

### Oversight Metrics Widget

- **Title:** "Oversight Metrics"
- **Metrics:**
  - **Verification Rate:** Percentage (e.g., "95%")
  - **Average Time:** Duration (e.g., "2.5 hours")
  - **Trend:** Indicator (e.g., "↗ +2%")
- **Charts (Optional):** Mini charts showing trends
- **Action Link:** "View Details →"

### Review Queue Widget

- **Title:** "Review Queue"
- **Queue Items List:**
  - **Format:** List items with submission ID, company name, priority badge, action buttons
  - **Action Buttons:** "Verify", "Flag", "Request Info"
  - **Max Items:** 3-5 items
- **Action Link:** "View all →"

### Verification Queue Section

- **Title:** "Verification Queue"
- **Typography:** 20px, font-weight: 600, color: #111827
- **Layout:** Full width, table or card list

**Queue Items:**
- **Format:** Each item shows:
  - **Submission ID:** Link to submission detail
  - **Company Name:** Link to company profile
  - **Product Name:** Product being verified
  - **Submitted Time:** Timestamp (e.g., "2 hours ago")
  - **Priority Badge:** High/Medium/Low (color-coded)
  - **Action Buttons:** "Verify", "Flag", "Request Info"
- **Item Height:** Auto (min 80px)
- **Border:** 1px solid #e5e7eb between items
- **Hover:** Light background (#f9fafb)

**Action Buttons:**
- **Verify Button:** Primary button, click → Navigate to verification page
- **Flag Button:** Secondary button, click → Flag item for review
- **Request Info Button:** Secondary button, click → Open request info modal

**Footer Actions:**
- **Load More Button:** Load additional queue items
- **Export Queue Button:** Export queue to CSV/PDF

### VCI Card - SKUs Under Monitor

- **Title:** "VCI - SKUs"
- **Two Sections:**

**1. Action Required:**
  - **Count:** Number of SKUs requiring action (e.g., "8")
  - **Items:**
    - **SKU Name/ID:** Full SKU description
    - **Company:** Company name
    - **Status:** Breach status, days in breach, near threshold
    - **Priority Badge:** High/Medium/Low
    - **Action Buttons:** "View" (navigate to SKU detail), "Action" (take action)
  - **Max Items:** 5 SKUs

**2. Under Monitoring:**
  - **Count:** Number of SKUs being monitored (e.g., "15")
  - **Items:**
    - **SKU Name/ID:** Full SKU description
    - **Company:** Company name
    - **Status:** Monitoring reason (near threshold, stable breach, etc.)
    - **Action Buttons:** "View" (navigate to SKU detail), "Monitor" (continue monitoring)
  - **Max Items:** 5 SKUs

- **Action Links:** "View All →" for each section

### Breach Analysis Queue

- **Title:** "Breach Analysis Queue"
- **Count:** Number of breaches requiring analysis (e.g., "5")
- **Items:**
  - **Breach ID:** Link to breach detail
  - **Company:** Company name
  - **Severity:** Critical/High/Medium (color-coded)
  - **Age:** Days since breach detected (e.g., "3 days old")
  - **Action Button:** "Analyze" (navigate to breach analysis page)
- **Max Items:** 5 breaches
- **Action Link:** "View All →"

### Quick Links Section

- **Title:** "Quick Links"
- **Layout:** Button group or link list
- **Links:**
  - **Analytics:** Navigate to analytics dashboard
  - **Reports:** Navigate to report generation page
- **Format:** Icon buttons or text links with icons
- **Spacing:** 16px between links

---

## Dynamic Priority System

### Priority Logic

**When %SC Unaddressed:**
1. %SC Section: **Top Priority** (full width, large donut chart)
2. Follow-up Queue: **High Priority** (full width, prominent)
3. Other widgets: **Secondary** (smaller, below priority sections)

**When %SC Addressed:**
1. %SC Section: **Collapsed** (summary view, secondary position)
2. Pending Verifications: **Top Priority** (prominent widget)
3. Oversight Metrics: **High Priority** (prominent widget)
4. Verification Queue: **High Priority** (full width section)
5. VCI Card: **Medium Priority** (widget)
6. Breach Analysis Queue: **Medium Priority** (widget)
7. Quick Links: **Always Visible** (secondary position)

### Status Indicators

**%SC Status:**
- **🔴 Below Threshold:** Red indicator
- **🟢 Above Threshold:** Green indicator

**Actions Taken Status:**
- **"All Actions Taken" Badge:** Shown when all unsubmitted companies have been alerted and follow-ups initiated
- **Progress Count:** "X alerted, Y in follow-up, Z resolved"

**Follow-up Status:**
- **Not Alerted:** Company not yet notified
- **Alerted:** Notification sent, awaiting follow-up
- **In Follow-up:** Tier 2 actively following up
- **Tier 1 Required:** Escalated to Tier 1

---

## Annotations

### Blue (Interactions)
- **Click donut chart segment** → Filter follow-up queue by category
- **Click "Alert" button** → Send notification to company, update status
- **Click "Start Follow-up"** → Begin Tier 2 follow-up, update status
- **Click "Escalate to Tier 1"** → Escalate extreme case, notify Tier 1
- **Click "Create Enforcement"** → Open enforcement action creation wizard (warnings only for Tier 2, fines/suspensions require escalation to Tier 1)
- **Click enforcement history link** → Navigate to `/enforcement/actions?company_id=[id]` (filtered by company)
- **Click "Expand" on %SC** → Expand collapsed %SC section
- **Click submission/item** → Navigate to submission detail page
- **Click company name** → Navigate to company profile
- **Click "Verify" button** → Navigate to verification page
- **Click "Flag" button** → Flag item, show confirmation
- **Click "Request Info" button** → Open request info modal
- **Click "Analyze" button** → Navigate to breach analysis page
- **Click filter/sort dropdown** → Apply filter/sort
- **Click "View all"** → Navigate to full queue/list
- **Click "Load More"** → Load additional items
- **Click "Export"** → Download as CSV/PDF
- **Click quick link** → Navigate to respective page

### Orange (Validation)
- **Threshold validation:** %SC compared against Tier 1-set threshold
- **Action validation:** Ensure all required fields before alerting/follow-up
- **Escalation validation:** Confirm escalation to Tier 1 for extreme cases

### Green (States)
- **%SC Status:** Color-coded (🔴 Below / 🟢 Above Threshold)
- **Actions Taken:** "All Actions Taken" badge when addressed
- **Priority indicators:** Color-coded badges (high=red, medium=orange, low=yellow)
- **Status indicators:** Verified, Pending, Flagged, In Follow-up (color-coded)
- **Loading state:** Skeleton loaders when fetching queues
- **Empty state:** "No pending verifications" / "No breaches" messages
- **Hover state:** Light background on queue items

---

## Responsive Behavior

### Desktop (1024px+)
- **%SC Section (unaddressed):** Full width, large donut chart
- **Widget Grid:** 3 columns for widgets
- **Verification Queue:** Full width table/list
- **Action Buttons:** Inline with items

### Tablet (768px - 1023px)
- **%SC Section:** Full width, medium donut chart
- **Widget Grid:** 2 columns (or 1 column stacked)
- **Verification Queue:** Full width, may stack action buttons
- **Action Buttons:** May stack vertically

### Mobile (<768px)
- **%SC Section:** Full width, smaller donut chart
- **Widget Grid:** 1 column (stacked)
- **Verification Queue:** Full width, cards instead of table
- **Action Buttons:** Full width, stacked vertically

---

## Design System References

### Components Used
- **Card Component:** Widget containers, queue items
- **Donut Chart Component:** %SC visualization
- **List Component:** Recent verifications, review queue, follow-up queue
- **Badge Component:** Priority indicators, status badges
- **Button Component:** Action buttons (Verify, Flag, Request Info, Alert, Follow-up)
- **Table Component (Optional):** Queue table layout

### Colors
- **Widget Background:** #ffffff (white)
- **High Priority:** #ef4444 (error-500)
- **Medium Priority:** #f59e0b (warning-500)
- **Low Priority:** #eab308 (warning-400)
- **Verified Status:** #22c55e (success-500)
- **Pending Status:** #6b7280 (text-secondary)
- **Flagged Status:** #ef4444 (error-500)
- **On-Time (Green):** #22c55e (success-500)
- **Late (Yellow):** #f59e0b (warning-500)
- **Unsubmitted (Red):** #ef4444 (error-500)

### Spacing
- **Page Padding:** 24px (desktop), 16px (mobile)
- **Widget Gap:** 24px (desktop), 16px (mobile)
- **Section Spacing:** 32px between major sections
- **Item Spacing:** 8px between list items

---

## Best Practices Implementation

### Information Architecture
- **Progressive Disclosure:** %SC collapses when addressed, verification content becomes primary
- **Visual Hierarchy:** Priority-based sizing and positioning
- **Contextual Actions:** Action buttons appear where needed
- **Status Clarity:** Clear indicators for all states

### Performance
- **Lazy Loading:** Module-specific content only loads if modules active
- **Pagination:** Lists show limited items with "View All" links
- **Data Caching:** Dashboard data cached with refresh option
- **Progressive Enhancement:** Core metrics load first, detailed data loads after

### Accessibility
- **Keyboard Navigation:** All interactive elements keyboard accessible
- **Screen Reader Support:** ARIA labels for charts and status indicators
- **Color Contrast:** All text meets WCAG 2.1 AA standards
- **Focus Indicators:** Clear focus states for all interactive elements

### User Experience
- **Immediate Feedback:** Status updates show immediately
- **Error Prevention:** Confirmation dialogs for critical actions (escalation)
- **Contextual Help:** Tooltips and help text where needed
- **Consistent Patterns:** Same interaction patterns across widgets

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/dashboard`
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - MOH Tier 2 role dashboard
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Button, List, Badge components

---

**Last Updated:** 2025-01-01  
**Status:** 🟡 Ready for Review
