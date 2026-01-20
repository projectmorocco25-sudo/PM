# Task 0.5.2.0: Enforcement Dashboard Wireframe

**Status:** ✅ Complete  
**Route:** `/enforcement` (MOH Tier 1 and Tier 2 only)  
**File:** `task-0.5.2.0-enforcement-dashboard.png`  
**Priority:** 🔴 Core RMM Workflows

**Design Approach:** Modern enterprise dashboard pattern inspired by Stripe, GitHub, Linear, and shadcn/ui best practices. Professional, accessible, and optimized for MOH governance enforcement workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > Enforcement                                          │
│                                                             │
│ Enforcement Dashboard                    [New Action]       │
│                                                             │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│ │ Recent Actions  │ │ Pending         │ │ Enforcement     ││
│ │                 │ │ Approvals       │ │ Metrics         ││
│ │ 15              │ │ 8               │ │                 ││
│ │                 │ │ [Gauge: 80%]   │ │ • Warnings: 45  ││
│ │ Recent:         │ │ 🔴 Urgency: High│ │ • Fines: 12     ││
│ │ • Warning - XYZ │ │                 │ │ • Suspensions: 3││
│ │   DMP Art.12    │ │ • Fine - ABC    │ │                 ││
│ │   Executed      │ │   $5,000        │ │ • Total: 60     ││
│ │   2 hours ago   │ │   ⚠️ 3d deadline│ │                 ││
│ │                 │ │ • Suspension    │ │ [View Reports] ││
│ │ • Fine - ABC    │ │   - DEF         │ │                 ││
│ │   $5,000        │ │   ⚠️ 1d deadline│ │                 ││
│ │   Executed      │ │ • Warning - GHI │ │                 ││
│ │   1 day ago     │ │   ✓ 7d remaining│ │                 ││
│ │                 │ │                 │ │                 ││
│ │ [View all →]   │ │ [View all →]   │ │                 ││
│ └─────────────────┘ └─────────────────┘ └─────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Regulatory Compliance Widget                             ││
│ │                                                          ││
│ │ Legal Basis Compliance: 95% (57/60 actions)             ││
│ │ Deadline Compliance: 92% (55/60 actions)                ││
│ │ Regulatory Requirements: 98% (59/60 actions)            ││
│ │                                                          ││
│ │ [View Compliance Details]                               ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Enforcement Trends (Last 30 Days)                        ││
│ │                                                          ││
│ │ [Line Chart: Actions over time by type]                 ││
│ │                                                          ││
│ │ X-Axis: Days (1-30)                                      ││
│ │ Y-Axis: Number of Actions                                ││
│ │ Lines: Warning (yellow) | Fine (orange) | Suspension (red)││
│ │                                                          ││
│ │ Legend: ⚠️ Warning | 💰 Fine | 🚫 Suspension            ││
│ │                                                          ││
│ │ [View Full Trends Report]                               ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Action Type Breakdown                                    ││
│ │                                                          ││
│ │ ┌──────────────────────┐  ┌──────────────────────────┐  ││
│ │ │ [Pie/Donut Chart]   │  │ Summary Cards            │  ││
│ │ │                      │  │                          │  ││
│ │ │ Warning: 45 (75%)   │  │ ⚠️ Warning: 45 (75%)    │  ││
│ │ │ Fine: 12 (20%)      │  │ 💰 Fine: 12 (20%)       │  ││
│ │ │ Suspension: 3 (5%)  │  │ 🚫 Suspension: 3 (5%)    │  ││
│ │ │                      │  │                          │  ││
│ │ │ [Interactive: Hover] │  │                          │  ││
│ │ │ [Click to filter]    │  │                          │  ││
│ │ └──────────────────────┘  └──────────────────────────┘  ││
│ │                                                          ││
│ │ [View Detailed Breakdown]                               ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Violation Types (Last 30 Days)                          ││
│ │                                                          ││
│ │ [Horizontal Bar Chart - Sorted by frequency]            ││
│ │                                                          ││
│ │ Submission Non-Compliance      ████████████ 25         ││
│ │ (DMP Art.12) [View Regulation]                          ││
│ │                                                          ││
│ │ Threshold Breach               ██████████ 18           ││
│ │ (DMP Art.15) [View Regulation]                          ││
│ │                                                          ││
│ │ Critical Medicine Non-Compl.   █████ 8                 ││
│ │ (DMP Art.8) [View Regulation]                           ││
│ │                                                          ││
│ │ Export Violation              ███ 5                     ││
│ │ (DMP Art.20) [View Regulation]                          ││
│ │                                                          ││
│ │ Data Quality Issue            ██ 3                     ││
│ │ (DMP Art.10) [View Regulation]                          ││
│ │                                                          ││
│ │ Repeated Offender             █ 1                      ││
│ │ (DMP Art.15) [View Regulation]                          ││
│ │                                                          ││
│ │ [Click bar to filter by violation type]                ││
│ │ [View All Violations]                                   ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > Enforcement"
- **Typography:** 14px, color: #6b7280
- **Title:** "Enforcement Dashboard"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **New Action Button:** Primary button, click → Navigate to `/enforcement/actions/new`
  - **Spacing:** 24px below breadcrumbs

### Widget Grid (Top Row)
- **Layout:** 3-column grid (desktop), 1-column (mobile)
- **Gap:** 24px between widgets
- **Widget Height:** Auto (min 200px)

**Recent Actions Widget:**
- **Title:** "Recent Actions"
- **Count:** Large number (e.g., "15")
  - **Typography:** 32px, font-weight: 700, color: #111827
- **Recent Actions List:**
  - **Format:** List items with action type, company, status, timestamp
  - **Max Items:** 3-5 recent items
  - **Item Height:** 64px
  - **Spacing:** 8px between items
  - **Action Type Badge:** Color-coded (warning: yellow, fine: orange, suspension: red)
- **Action Link:** "View all →" (bottom of widget)
  - **Typography:** 14px, color: #2563eb (text-link)
  - **Click Action:** Navigate to `/enforcement/actions`

**Pending Approvals Widget:**
- **Title:** "Pending Approvals"
- **Count:** Large number (e.g., "8")
  - **Typography:** 32px, font-weight: 700, color: #dc2626 (red for urgency)
- **Urgency Gauge/Progress Indicator:**
  - **Visual:** Circular gauge or linear progress bar
  - **Display:** Shows 8 pending out of threshold (e.g., 10 = 80%)
  - **Color Coding:**
    - Green (0-50%): Low urgency
    - Yellow (51-75%): Medium urgency
    - Red (76-100%): High urgency
  - **Threshold Indicator:** Visual line showing threshold (e.g., 10 pending)
  - **Typography:** "Urgency: High" label below gauge
- **Pending Actions List (Enhanced per Fatima's Requirement):**
  - **Format:** List items with action type, company, amount (if fine), priority
  - **Legal Basis Display (Fatima's Requirement):** Shows regulation article (e.g., "DMP Art.12") in each item
  - **Approval Deadline Tracking (Fatima's Requirement):**
    - "⚠️ [X]d deadline" indicator for actions with approaching deadlines
    - Urgency indicator: 🔴 if <3 days, 🟡 if 3-7 days, 🟢 if >7 days
  - **Legal Basis Verification Status (Fatima's Requirement):** "✓ Verified" or "⚠️ Needs Verification" indicator
  - **Max Items:** 3-5 pending items
  - **Item Height:** 64px (may expand for regulatory info)
  - **Spacing:** 8px between items
  - **Priority Indicator:** Visual indicator for high-priority items
- **Action Link:** "View all →" (bottom of widget)
  - **Typography:** 14px, color: #2563eb (text-link)
  - **Click Action:** Navigate to `/enforcement/pending-approvals`

**Enforcement Metrics Widget:**
- **Title:** "Enforcement Metrics"
- **Metrics List:**
  - **Format:** Key-value pairs with metric name and count
  - **Metrics:**
    - Warnings: 45
    - Fines: 12
    - Suspensions: 3
    - Total: 60
  - **Typography:** 16px, font-weight: 500
- **Action Button:** "View Reports" (bottom of widget)
  - **Button Style:** Secondary button
  - **Click Action:** Navigate to `/enforcement/reports`

### Regulatory Compliance Widget (Fatima's Requirement)
- **Layout:** Full-width card section below top widget row
- **Title:** "Regulatory Compliance Widget"
- **Metrics:**
  - **Legal Basis Compliance:** "% (X/Y actions)" - % of actions with proper legal basis
  - **Deadline Compliance:** "% (X/Y actions)" - % of actions within regulatory deadlines
  - **Regulatory Requirements:** "% (X/Y actions)" - % of actions meeting all regulatory requirements
- **Display:** Large numbers with percentage and count
- **Color Coding:**
  - Green (90-100%): Excellent compliance
  - Yellow (70-89%): Good compliance, needs attention
  - Red (<70%): Poor compliance, requires immediate action
- **Action Link:** "[View Compliance Details]" to detailed compliance report
- **Styling:** Prominent card with compliance metrics

### Enforcement Trends Section (NEW)
- **Title:** "Enforcement Trends (Last 30 Days)"
- **Layout:** Full-width chart section
- **Chart Type:** Multi-line chart
- **Chart Specifications:**
  - **X-Axis:** Days (1-30, labeled at intervals)
  - **Y-Axis:** Number of Actions (0-max, auto-scaled)
  - **Lines:**
    - Warning line: Yellow (#fbbf24)
    - Fine line: Orange (#f97316)
    - Suspension line: Red (#dc2626)
  - **Data Points:** Daily counts for each action type
  - **Grid Lines:** Subtle horizontal and vertical grid
  - **Legend:** Interactive legend (click to toggle line visibility)
- **Module Independence:** 
  - **No Module Dependencies:** Trends chart shows all enforcement actions regardless of ECS/CMC activation
  - **Data Source:** All enforcement actions (warnings, fines, suspensions) are independent of module activation
  - **No Conditional Display:** Chart always shows all three action types (Warning, Fine, Suspension)
- **Interactivity:**
  - **Hover:** Tooltip showing exact values for each line at hover point
  - **Click:** Navigate to detailed trends report
- **Action Link:** "View Full Trends Report" (bottom of section)
  - **Click Action:** Navigate to `/enforcement/reports` with trends filter

### Action Type Breakdown Section
- **Title:** "Action Type Breakdown"
- **Layout:** Side-by-side: Chart (left) + Summary Cards (right)
- **Chart (Left Side):**
  - **Chart Type:** Pie chart or Donut chart (recommended: Donut for modern look)
  - **Segments:**
    - Warning: 45 (75%) - Yellow (#fbbf24)
    - Fine: 12 (20%) - Orange (#f97316)
    - Suspension: 3 (5%) - Red (#dc2626)
  - **Center Label (if donut):** "Total: 60" or percentage breakdown
  - **Interactivity:**
    - **Hover:** Highlight segment, show tooltip with exact count and percentage
    - **Click:** Filter actions list by selected action type
- **Summary Cards (Right Side):**
  - **Layout:** Vertical stack of 3 cards
  - **Warning Card:**
    - **Icon:** ⚠️
    - **Title:** "Warning"
    - **Count:** Large number (e.g., "45")
    - **Percentage:** "75%"
    - **Background:** Light yellow (#fef3c7)
  - **Fine Card:**
    - **Icon:** 💰
    - **Title:** "Fine"
    - **Count:** Large number (e.g., "12")
    - **Percentage:** "20%"
    - **Background:** Light orange (#fed7aa)
  - **Suspension Card:**
    - **Icon:** 🚫
    - **Title:** "Suspension"
    - **Count:** Large number (e.g., "3")
    - **Percentage:** "5%"
    - **Background:** Light red (#fee2e2)
- **Action Link:** "View Detailed Breakdown" (bottom of section)
  - **Click Action:** Navigate to `/enforcement/reports` with breakdown filter

### Violation Types Section
- **Title:** "Violation Types (Last 30 Days)"
- **Layout:** Horizontal bar chart
- **Chart Type:** Horizontal bar chart (sorted by frequency, descending)
- **Chart Specifications:**
  - **Orientation:** Horizontal bars (violation type labels on left, bars extend right)
  - **Sorting:** Descending by count (highest first)
  - **Bar Colors:** Gradient or single color with varying opacity
    - **Option 1:** Single color (#3b82f6) with varying opacity based on count
    - **Option 2:** Color-coded by severity (red for critical, orange for medium, blue for low)
  - **Data Display:**
    - **Labels:** Violation type name (left-aligned)
    - **Regulatory Reference (Fatima's Requirement):** Each violation type shows "(DMP Art.[X])" below the label
    - **Link to Regulation (Fatima's Requirement):** "[View Regulation]" link next to each violation type
    - **Bars:** Proportional to count (scaled to max value)
    - **Values:** Count displayed at end of bar (right-aligned)
  - **Chart Data (Always Available):**
    - Submission Non-Compliance: 25 (longest bar) - VCI module
    - Threshold Breach: 18 - VCI module
    - Critical Medicine Non-Compliance: 8 - VCI module
    - Repeated Offender: 1 (shortest bar) - Cross-module
  - **Chart Data (Conditional - ECS Module):**
    - Export Violation: 5 - **Only shown if ECS module is active**
  - **Chart Data (Conditional - CMC Module):**
    - Data Quality Issue: 3 - **Only shown if CMC module is active**
- **Module Activation Handling:**
  - **Check Module Status:** Query `system_config` table for `ecs.is_active` and `cmc.is_active`
  - **Conditional Display:**
    - If ECS inactive: Hide "Export Violation" bar (or show as 0 with disabled state)
    - If CMC inactive: Hide "Data Quality Issue" bar (or show as 0 with disabled state)
  - **Visual Indicators:**
    - **Inactive Module Badge:** If violation type requires inactive module, show badge "Requires [Module]"
    - **Empty State:** If all conditional violations are hidden and no data exists, show message "No violations for inactive modules"
- **Interactivity:**
  - **Hover:** Highlight bar, show tooltip with exact count
  - **Click:** Filter enforcement actions list by selected violation type
  - **Disabled Bars:** If module inactive, bar is grayed out and non-clickable (if shown)
- **Action Link:** "View All Violations" (bottom of section)
  - **Click Action:** Navigate to `/enforcement/actions` with violation type filter

---

## Role-Based Access

### MOH Tier 1
- **Full Access:** Can view all sections, create actions, approve actions
- **Actions:** "New Action" button visible

### MOH Tier 2
- **View Access:** Can view all sections
- **Limited Actions:** Can create warnings (subject to Tier 1 approval for fines/suspensions)
- **Actions:** "New Action" button visible (limited action types)

### Companies
- **No Access:** This page is not accessible to company users
- **Alternative:** Companies view their own enforcement actions on Company Dashboard

---

## Module Activation States

### ECS Module Inactive
- **Violation Types Chart:**
  - "Export Violation" bar is hidden (not shown in chart)
  - Chart automatically adjusts to show only available violation types
  - No empty space or placeholder for hidden violation type
- **Enforcement Actions:**
  - Cannot create enforcement actions with "Export Violation" type
  - Existing export violation actions (if any from historical data) remain visible
- **Visual Indicator:** No special indicator needed (violation type simply not shown)

### CMC Module Inactive
- **Violation Types Chart:**
  - "Data Quality Issue" bar is hidden (not shown in chart)
  - Chart automatically adjusts to show only available violation types
  - No empty space or placeholder for hidden violation type
- **Enforcement Actions:**
  - Cannot create enforcement actions with "Data Quality Issue" type
  - Existing data quality issue actions (if any from historical data) remain visible
- **Visual Indicator:** No special indicator needed (violation type simply not shown)

### Both ECS and CMC Inactive
- **Violation Types Chart:**
  - Shows only core violation types (always available):
    - Submission Non-Compliance
    - Threshold Breach
    - Critical Medicine Non-Compliance
    - Repeated Offender
  - Chart is fully functional with available data
- **No Degradation:** Dashboard remains fully functional, just with fewer violation types

### Module Activation Check
- **Implementation:** Check `system_config` table on page load
  ```typescript
  const isECSActive = await checkModuleActive('ecs');
  const isCMCActive = await checkModuleActive('cmc');
  ```
- **Performance:** Cache module status to avoid repeated queries
- **Real-time Updates:** Module activation changes require page refresh (or implement real-time subscription)

## State Variations

### Empty State (No Actions)
- **Message:** "No enforcement actions yet"
- **Subtext:** "Enforcement actions will appear here when created"
- **Visual:** Empty state illustration or icon

### Loading State
- **Skeleton:** Placeholder cards with shimmer effect
- **Count:** Match expected widget count
- **Module Check:** Show skeleton while checking module activation status

### Error State
- **Message:** "Unable to load enforcement dashboard"
- **Action:** "Retry" button
- **Module Check Error:** If module activation check fails, show error but still display dashboard with safe defaults (assume modules inactive)

---

## Responsive Design

### Desktop (≥1024px)
- **Layout:** 3-column grid for widgets
- **Charts:** Full-width charts with optimal sizing
- **Action Type Breakdown:** Side-by-side layout (chart + cards)
- **Spacing:** 24px gaps

### Tablet (768px - 1023px)
- **Layout:** 2-column grid for widgets
- **Charts:** Full-width charts, may need to stack chart + cards vertically
- **Action Type Breakdown:** Stacked layout (chart above cards)
- **Spacing:** 16px gaps

### Mobile (<768px)
- **Layout:** 1-column stack for widgets
- **Charts:** Full-width, simplified charts (fewer data points, larger labels)
- **Action Type Breakdown:** Stacked layout (chart above cards)
- **Trend Chart:** May show condensed version or switch to simplified bar chart
- **Spacing:** 16px gaps
- **Touch Targets:** Ensure chart interactive elements are at least 40px × 40px

---

## Interactions

### Click Actions
- **Recent Action Item:** Navigate to `/enforcement/actions/[id]`
- **Pending Approval Item:** Navigate to `/enforcement/actions/[id]` (highlighted for approval)
- **"View all →" Links:** Navigate to respective list pages
- **"New Action" Button:** Navigate to `/enforcement/actions/new`
- **Chart Interactions:**
  - **Trend Line Chart:** Click line or legend to filter by action type
  - **Pie/Donut Chart Segment:** Click segment to filter actions list by action type
  - **Bar Chart Bar:** Click bar to filter actions list by violation type

### Hover States
- **Action Items:** Background color change (#f9fafb)
- **Links:** Underline on hover
- **Buttons:** Slight elevation/shadow
- **Chart Elements:**
  - **Trend Lines:** Highlight line, show data point tooltip
  - **Pie/Donut Segments:** Highlight segment, show tooltip with count and percentage
  - **Bar Chart Bars:** Highlight bar, show tooltip with exact count
  - **Chart Legend:** Highlight on hover, show preview of toggling

---

## Chart Library Recommendations

### Recommended Chart Libraries
- **Recharts** (React): Popular, well-maintained, good TypeScript support
- **Chart.js with react-chartjs-2**: Flexible, extensive customization
- **Victory** (React): Good for complex visualizations
- **shadcn/ui compatible:** Ensure charts work with existing design system

### Chart Accessibility
- **ARIA Labels:** All charts must have descriptive ARIA labels
- **Color Contrast:** Ensure WCAG 2.1 AA compliance (4.5:1 for text, 3:1 for UI)
- **Keyboard Navigation:** Support keyboard navigation for interactive charts
- **Screen Reader Support:** Provide text alternatives and data tables
- **Color Blindness:** Use patterns/textures in addition to colors for differentiation

### Chart Performance
- **Data Loading:** Lazy load chart data, show skeleton during loading
- **Responsive:** Charts should adapt to container size
- **Mobile Optimization:** Simplify charts on mobile (fewer data points, larger touch targets)

## Module Activation Implementation Notes

### Violation Type Dependencies
- **Always Available (VCI Module - Core):**
  - Submission Non-Compliance
  - Threshold Breach
  - Critical Medicine Non-Compliance
  - Repeated Offender (cross-module)
- **ECS Module Required:**
  - Export Violation (only if `ecs.is_active = true`)
- **CMC Module Required:**
  - Data Quality Issue (only if `cmc.is_active = true`)

### Implementation Pattern
```typescript
// Check module activation
const { data: ecsConfig } = await supabase
  .from('system_config')
  .select('is_active')
  .eq('module_name', 'ecs')
  .single();

const { data: cmcConfig } = await supabase
  .from('system_config')
  .select('is_active')
  .eq('module_name', 'cmc')
  .single();

const isECSActive = ecsConfig?.is_active ?? false;
const isCMCActive = cmcConfig?.is_active ?? false;

// Filter violation types for chart
const violationTypes = [
  { type: 'submission_non_compliance', count: 25 },
  { type: 'threshold_breach', count: 18 },
  { type: 'critical_medicine_non_compliance', count: 8 },
  { type: 'repeated_offender', count: 1 },
  // Conditional violation types
  ...(isECSActive ? [{ type: 'export_violation', count: 5 }] : []),
  ...(isCMCActive ? [{ type: 'data_quality_issue', count: 3 }] : []),
];
```

### User Experience Considerations
- **No Confusion:** Hidden violation types don't create empty spaces or confusing gaps
- **Seamless Experience:** Users don't see options they can't use
- **Historical Data:** If historical enforcement actions exist for inactive modules, they remain visible (read-only)
- **Activation Changes:** When modules are activated, violation types automatically appear in charts and filters

## Design System References

- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Cards, badges, buttons, charts
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - Role-based access
- [Navigation & Layout Patterns](../../../../02-architecture/frontend/navigation-layout-patterns.md) - Dashboard layout
- [System Architecture](../../../../02-architecture/system-architecture.md) - Module activation and dependencies
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference including DMP regulations
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - Detailed compliance requirements including enforcement action requirements
- [Regulatory Policies](../../../../03-governance/regulatory-policies.md) - Regulatory policies including enforcement policies

---

## Related Wireframes

- [Enforcement Actions List](task-0.5.2.1-enforcement-actions-list.md)
- [Enforcement Action Detail](task-0.5.2.1a-enforcement-action-detail.md)
- [Create Enforcement Action](task-0.5.2.1b-create-enforcement-action-wizard.md)
- [Pending Approvals](task-0.5.2.1c-pending-approvals.md)
- [Enforcement Reports](task-0.5.2.1d-enforcement-reports.md)

---

**Next:** [Enforcement Actions List](task-0.5.2.1-enforcement-actions-list.md)

