 # Task 0.5.3.15: Compliance Violation Detail Page Wireframe

**Status:** 🟡 In Progress  
**Route:** `/vci/compliance-violations/[id]`  
**File:** `task-0.5.3.15-compliance-violation-detail.png`  
**Priority:** 🔴 Critical VCI Workflows

**Design Approach:** Modern detail page with compliance violation information, stock level vs threshold comparison, priority indicators, and analysis workflow. Professional, accessible, and optimized for compliance violation review and governance response.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > VCI > Compliance Violations > [Violation ID]        │
│                                                             │
│ Compliance Violation - SKU002                               │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Violation Status                                         ││
│ │                                                          ││
│ │ Status: Active                                          ││
│ │ Priority: 🔴 High (Critical Medicine)                    ││
│ │ Detected: January 17, 2025                              ││
│ │ Duration: 3 days                                         ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Compliance Violation Information                         ││
│ │                                                          ││
│ │ SKU: SKU002                                             ││
│ │ Product: Product B / 250mg / Capsule                    ││
│ │ Company: ABC Pharmaceuticals Inc.                       ││
│ │                                                          ││
│ │ Stock Level: 400 units                                  ││
│ │ Threshold: 600 units                                    ││
│ │ Difference: -200 units (33% below threshold)            ││
│ │                                                          ││
│ │ [Visual: Stock Level vs Threshold Chart]                ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Compliance Violation Details                             ││
│ │                                                          ││
│ │ Reason: Stock level below minimum threshold             ││
│ │ Detected From: WSL Submission #12345                    ││
│ │ Week Ending: January 19, 2025                          ││
│ │                                                          ││
│ │ Replenishment Date: 25/01/2025                          ││
│ │ (From WSL Submission - Company provided)                ││
│ │                                                          ││
│ │ Compliance Violation Reason:                            ││
│ │ "Stock replenishment delayed due to supplier delay.     ││
│ │ Expected delivery date: 25/01/2025. Alternative         ││
│ │ supplier contacted for emergency supply."               ││
│ │ (300 characters maximum)                                 ││
│ │                                                          ││
│ │ Related Violations: 2 other violations for this SKU    ││
│ │ [View Related Violations]                               ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Analysis & Action Status                                 ││
│ │                                                          ││
│ │ Analysis Status: Pending (Tier 2)                       ││
│ │                                                          ││
│ │ Suggested Action: Warning                               ││
│ │ Suggested by: [Tier 2 Officer] (if analyzed)           ││
│ │                                                          ││
│ │ Approval Status: Pending (Tier 1)                      ││
│ │                                                          ││
│ │ [Analyze] (Tier 2) | [Approve Action] (Tier 1)         ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ Tabs: [Details] [History] [Analysis]                        │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ History Tab Content                                      ││
│ │                                                          ││
│ │ Timeline of all status changes and updates              ││
│ │                                                          ││
│ │ • Status changed to "Under Review" - 1 day ago          ││
│ │ • Detected from WSL Submission #12345 - 3 days ago     ││
│ │ • Compliance violation created automatically - 3 days ago ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Related Information                                      ││
│ │                                                          ││
│ │ • WSL Submission: [Link to WSL Submission #12345]      ││
│ │ • Company: [Link to ABC Pharmaceuticals Inc.]           ││
│ │ • SKU: [Link to SKU002 Detail]                          ││
│ │ • Related Violations: 2 other violations                ││
│ │ • Audit Log: [View audit trail]                         ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ℹ️ Compliance violations trigger enforcement actions     ││
│    per regulatory requirements.                            ││
│    [View Regulatory Framework]                             ││
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > VCI > Compliance Violations > [Violation ID]"
- **Title:** "Compliance Violation - [SKU Code]"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **Analyze Button:** Primary button (Tier 2 only, if not analyzed)
  - **Approve Action Button:** Primary button (Tier 1 only, if analyzed)
  - **Actions Dropdown:** More actions menu
    - Options: View Audit Log, Export PDF, Link to Enforcement Action

### Violation Status Section
- **Layout:** Card with status information
- **Fields:**
  - **Status:** Badge showing current status (Active, Under Review, Resolved)
  - **Priority:** Priority badge with indicator (🔴 High, 🟡 Medium, 🟢 Low)
  - **Priority Reason:** Explanation (e.g., "Critical Medicine", "Multiple SKUs")
  - **Detected:** Detection date
  - **Duration:** Days since detection
- **Styling:**
  - **Status Badge:** Color-coded
  - **Priority Badge:** Color-coded with icon

### Compliance Violation Information Section
- **Layout:** Card with key-value pairs
- **Fields:**
  - **SKU:** SKU code (link to SKU detail)
  - **Product:** Product description (Name/Dosage/Form)
  - **Company:** Company name (link to company detail)
  - **Stock Level:** Current stock level value
  - **Threshold:** Threshold value
  - **Difference:** Calculated difference and percentage
- **Visual Comparison:**
  - **Chart/Bar:** Visual representation of stock vs threshold
  - **Color Coding:** Red for below threshold, green for above
- **Styling:**
  - **Labels:** 14px, color: #6b7280, font-weight: 500
  - **Values:** 16px, color: #111827

### Compliance Violation Details Section
- **Layout:** Card with detailed information
- **Fields:**
  - **Reason:** Explanation of compliance violation (e.g., "Stock level below minimum threshold")
  - **Detected From:** Link to WSL submission that triggered compliance violation
  - **Week Ending:** Week ending date from submission
  - **Replenishment Date:** Actual replenishment date from WSL submission (not "estimated"):
    - Format: DD/MM/YYYY (e.g., "25/01/2025")
    - Source: From WSL submission form (company-provided)
    - Display: "(From WSL Submission - Company provided)" label
    - Read-only: Cannot be edited on this page (editable only in WSL submission form)
  - **Compliance Violation Reason:** Company-provided reason from WSL submission:
    - Format: Full text (up to 300 characters)
    - Source: From WSL submission form
    - Display: Full text in expandable section or card
    - Read-only: Cannot be edited on this page (editable only in WSL submission form)
    - Label: "Compliance Violation Reason:"
  - **Related Violations:** Count and link to related violations
- **Links:** All links navigate to related detail pages

### Analysis & Action Status Section
- **Layout:** Card showing analysis and enforcement workflow with progress indicators
- **Workflow Progress Indicator:**
  - **Stages:** Detection → Analysis → Approval → Enforcement → Appeal
  - **Visual Indicators:**
    - **Completed stages:** Green checkmark (✓)
    - **Current stage:** Highlighted with progress indicator (⏳)
    - **Pending stages:** Gray, disabled (-)
  - **Current Stage Display:** Badge showing current stage name
- **Analysis Status:**
  - **Status:** Pending, In Progress, Completed
  - **Analyzed By:** Tier 2 officer name (if analyzed)
  - **Suggested Action:** Action type (Warning, Fine, Suspension, None)
  - **Analysis Notes:** Link to view analysis details
- **Approval Status:**
  - **Status:** Pending, Approved, Rejected
  - **Approved By:** Tier 1 officer name (if approved)
  - **Approval Notes:** Link to view approval details
- **Enforcement Action Status:**
  - **Status:** Not Created, Created, Executed, Appealed
  - **Action ID:** Enforcement action identifier (if created)
  - **Link:** Navigate to enforcement action detail (if created)
- **Actions:**
  - **Analyze Button:** Navigate to analysis interface (Tier 2)
  - **Approve Action Button:** Navigate to approval interface (Tier 1)

### Enforcement Action Section (if created)
- **Layout:** Card displaying related enforcement action
- **Display Condition:** Only shown if enforcement action was created from this violation
- **Fields:**
  - **Action Type:** Icon + text (⚠️ Warning, 💰 Fine, 🚫 Suspension)
  - **Action ID:** Enforcement action identifier (e.g., "ENF-2025-001")
  - **Status:** Status badge (Executed, Pending Approval, etc.)
  - **Date:** Execution or creation date
  - **Context:** "Created from this compliance violation"
- **Appeal Information:**
  - **Appeal Status:** "No Appeal" or current appeal status
  - **Appeal Deadline:** Days remaining or "Expired"
  - **Appeal Window Note:** "30-day window per DMP regulations"
- **Actions:**
  - **View Enforcement Action Detail:** Navigate to `/enforcement/actions/[id]`
- **Styling:**
  - **Card Background:** Light background to distinguish from other sections
  - **Status Badge:** Color-coded based on action status
  - **Appeal Deadline:** Highlighted if within 7 days remaining

### Tabs
- **Tabs:** Details (default), History, Analysis
- **Tab Content:**
  - **Details:** All compliance violation information (default view)
  - **History:** Timeline of all changes and status updates
  - **Analysis:** Analysis details and suggested actions (if analyzed)

### Related Information Section
- **Layout:** List of related links
- **Links:**
  - WSL Submission (if applicable)
  - Company profile
  - SKU detail
  - Related violations
  - Enforcement action (if created)
  - Audit log entry
- **Styling:** Link list with icons

### Compliance Information Banner
- **Display:** Info banner at bottom (collapsible)
- **Content:**
  - Explanation of enforcement action triggers
  - Regulatory framework link
- **Styling:** Light blue background (#eff6ff), info icon, dismissible

---

## Role-Based Access

### Company Users
- **View:** Own company violations only
- **View Details:** Can view all compliance violation information
- **Actions:** View only (cannot analyze or approve)
- **Hidden Information:** Analysis notes, approval notes (unless relevant)

### MOH Tier 1
- **Full Access:** Can view all violations
- **View Analysis:** Can view Tier 2 analysis and suggestions
- **Actions:** Approve/Reject suggested actions, Create independent action

### MOH Tier 2
- **View Access:** Can view all violations
- **Actions:** Analyze violation, Suggest actions
- **Cannot Approve:** Cannot approve actions (Tier 1 only)

---

## State Variations

### Active State (Not Analyzed)
- **Status Badge:** Orange "Active"
- **Analysis Status:** "Pending (Tier 2)"
- **Actions:** Analyze button (Tier 2), View only (others)

### Under Review State (Analyzed, Pending Approval)
- **Status Badge:** Yellow "Under Review"
- **Analysis Status:** "Completed" with suggested action
- **Approval Status:** "Pending (Tier 1)"
- **Actions:** Approve/Reject buttons (Tier 1), View (others)

### Resolved State
- **Status Badge:** Green "Resolved"
- **Resolution Date:** Display resolution date
- **Actions:** View, export only

### High Priority State
- **Visual Indicator:** Red priority badge
- **Urgency Message:** "High priority - requires immediate attention"
- **Highlighting:** Row or section highlighted

---

## Responsive Design

### Desktop (≥1024px)
- **Layout:** Full-width with tabs
- **Sections:** Side-by-side where appropriate
- **Chart:** Full-width visual comparison

### Tablet (768px - 1023px)
- **Layout:** Stacked sections
- **Chart:** Responsive chart

### Mobile (<768px)
- **Layout:** Single column
- **Chart:** Simplified or hidden
- **Tabs:** Full-width tab navigation

---

## Interactions

### Click Actions
- **SKU/Product/Company:** Navigate to detail pages
- **WSL Submission:** Navigate to submission detail
- **Related Violations:** Navigate to violations list (filtered)
- **Analyze Button:** Navigate to analysis interface
- **Approve Action Button:** Navigate to approval interface
- **View Enforcement Action Detail:** Navigate to `/enforcement/actions/[id]` (if enforcement action created)

### Hover States
- **Links:** Underline on hover
- **Buttons:** Slight elevation/shadow
- **Chart Elements:** Tooltip on hover (if interactive)

---

## Design System References

### Components Used
- **Card Component:** Information sections (shadcn/ui card)
- **Badge Component:** Status badges, priority badges (shadcn/ui badge)
- **Timeline Component:** History timeline (shadcn/ui timeline pattern)
- **Chart Component:** Stock vs threshold comparison (chart library, e.g., Recharts)
- **Tabs Component:** Detail tabs (shadcn/ui tabs)
- **Button Component:** Action buttons (shadcn/ui button)
- **Icon Component:** Status icons, priority icons (Lucide React via shadcn/ui)

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
- **Priority Badge Colors:**
  - High: #ef4444 (error-500) - Red
  - Medium: #fbbf24 (warning-500) - Yellow
  - Low: #10b981 (success-500) - Green
- **Status Badge Colors:**
  - Active: #f97316 (orange-500)
  - Under Review: #fbbf24 (warning-500)
  - Resolved: #10b981 (success-500)
- **Chart Colors:**
  - Stock Level: #3b82f6 (primary-500) - Blue
  - Threshold: #ef4444 (error-500) - Red line
  - Below Threshold: #fee2e2 (error-100) - Light red fill

### Typography (From Design System)
- **Page Title:** 24px, font-weight: 600, color: #111827
- **Section Title:** 18px, font-weight: 600
- **Body Text:** 16px, font-weight: 400
- **Label:** 14px, font-weight: 500, color: #6b7280
- **Badge Text:** 11px, font-weight: 600

### Spacing (8px Grid System)
- **Page Padding:** 24px (3 × 8px)
- **Section Spacing:** 16px (2 × 8px) between sections
- **Card Padding:** 16px or 24px
- **Button Padding:** 12px horizontal, 8px vertical
- **Button Spacing:** 16px between buttons

### Transitions & Animations
- **Tab Switch:** 200ms ease-in-out
- **Timeline Animation:** 200ms ease-in-out
- **Button Hover:** 150ms ease-in-out
- **Chart Animation:** 300ms ease-in-out (if animated)

### Accessibility (WCAG 2.1 AA Compliance)
- **Color Contrast:** Minimum 4.5:1 for text, 3:1 for UI components
- **Focus Indicators:** 2px solid outline, #3b82f6 (primary-500), 2px offset
- **Keyboard Navigation:** Full keyboard support (Tab, Enter, Arrow keys, Escape)
- **Screen Reader Support:** ARIA labels, roles, and descriptions
- **Touch Targets:** Minimum 40px × 40px for all interactive elements
- **ARIA Labels:** Descriptive labels for all actions and sections
- **Chart Accessibility:** Proper ARIA labels for chart elements, alternative text
- **Skip Links:** "Skip to main content" link for keyboard users

---

## Industry Best Practices Implementation

### Performance Optimizations
- **Lazy Loading:** Load related data on demand
- **Chart Rendering:** Efficient chart rendering for stock comparison
- **Data Fetching:** Efficient API calls for compliance violation data
- **Caching:** Cache compliance violation data with appropriate TTL

### State Management
- **Compliance Violation State:** Track current compliance violation data, analysis status, approval status
- **Tab State:** Track active tab
- **Real-time Updates:** WebSocket or polling for status changes (optional)

### Error Handling
- **Loading States:** Skeleton loaders while loading
- **Error Boundaries:** Graceful degradation if data fails to load
- **Retry Logic:** Automatic retry with exponential backoff

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/vci/compliance-violations/[id]`
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference including DMP regulations
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - Detailed compliance requirements including compliance violation detection requirements
- [Regulatory Policies](../../../../03-governance/regulatory-policies.md) - Regulatory policies including compliance violation policies
- [Workflow Architecture](../../../../02-architecture/workflow-architecture.md) - Workflow states
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Card, Badge, Timeline, Chart components
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - Role-based access

---

## Related Wireframes

- [Compliance Violations List](task-0.5.3.14-compliance-violations-list.md) - Violations list page
- [Compliance Violation Analysis Interface](task-0.5.3.16-compliance-violation-analysis-interface.md) - Tier 2 analysis form
- [Compliance Violation Action Approval Interface](task-0.5.3.17-compliance-violation-action-approval-interface.md) - Tier 1 approval interface
- [WSL Submission Detail](../wsl/task-0.5.3.13-wsl-submission-detail.md) - WSL submission with compliance violations

---

**Next:** [Compliance Violation Analysis Interface](task-0.5.3.16-compliance-violation-analysis-interface.md)

