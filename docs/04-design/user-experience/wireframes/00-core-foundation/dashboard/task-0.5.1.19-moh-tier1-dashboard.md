# Task 0.5.1.19: MOH Tier 1 Dashboard Wireframe

**Status:** 🟡 In Progress  
**Route:** `/dashboard` (MOH Tier 1 role)  
**File:** `task-0.5.1.19-moh-tier1-dashboard.png`  
**Priority:** 🔴 Critical Foundation

---

## Wireframe Layout - Scenario 1: %SC Unaddressed (High Priority)

```
┌─────────────────────────────────────────────────────────────┐
│ Home > Dashboard                                             │
│                                                             │
│ Governance Overview              [Date Range ▼] [Refresh]   │
│                                                             │
│ ╔═════════════════════════════════════════════════════════╗│
│ ║ 🚨 EMERGENCY: Submission Compliance Below Threshold     ║│
│ ║                                                          ║│
│ ║ %SC: 68%  Threshold: 75%  Status: 🔴 CRITICAL         ║│
│ ║                                                          ║│
│ ║ ⚠️ Data cannot be used for governance analysis          ║│
│ ║ [Schedule Emergency Meeting]                           ║│
│ ╚═════════════════════════════════════════════════════════╝│
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
│ │ Unsubmitted Companies (80) - ACTION REQUIRED             ││
│ │                                                          ││
│ │ ┌─────────────────────────────────────────────────────┐ ││
│ │ │ Company ABC Pharma          [Extreme] 🔴            │ ││
│ │ │ • WSL: 2 weeks overdue  • Critical medicines: 5     │ ││
│ │ │ • MSQ: 1 month overdue  • Repeated offender         │ ││
│ │ │ Status: Not Alerted                                 │ ││
│ │ │ Enforcement: 2 warnings, 0 fines                   │ ││
│ │ │ [Alert] [Tier 1 Follow-up] [Create Enforcement]     │ ││
│ │ │ [View Details]                                      │ ││
│ │ ├─────────────────────────────────────────────────────┤ ││
│ │ │ Company XYZ Corp            [Extreme] 🔴            │ ││
│ │ │ • WSL: 1 week overdue   • Critical medicines: 3    │ ││
│ │ │ • AAMS: Overdue         • Large company            │ ││
│ │ │ Status: Not Alerted                                 │ ││
│ │ │ Enforcement: 1 warning, 0 fines                    │ ││
│ │ │ [Alert] [Tier 1 Follow-up] [Create Enforcement]     │ ││
│ │ │ [View Details]                                      │ ││
│ │ ├─────────────────────────────────────────────────────┤ ││
│ │ │ Company DEF Ltd            [Normal] 🟡              │ ││
│ │ │ • WSL: 3 days overdue                               │ ││
│ │ │ Status: Not Alerted                                 │ ││
│ │ │ Enforcement: 0 warnings, 0 fines                    │ ││
│ │ │ [Alert] [Tier 2 Follow-up] [View Details]          │ ││
│ │ └─────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ [View All Unsubmitted] [Bulk Alert] [Export List]      ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Governance Dashboard                                      ││
│ │ ═══════════════════════════════════════════════════════ ││
│ │ ⚠️ DATA NOT USABLE FOR GOVERNANCE ANALYSIS              ││
│ │ ═══════════════════════════════════════════════════════ ││
│ │                                                          ││
│ │ [Charts disabled with overlay]                         ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Wireframe Layout - Scenario 2: %SC Addressed (Normal Priority)

```
┌─────────────────────────────────────────────────────────────┐
│ Home > Dashboard                                             │
│                                                             │
│ Governance Overview              [Date Range ▼] [Refresh]   │
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
│ │ Pending         │ │ System Health   │ │ Critical        ││
│ │ Approvals       │ │                 │ │ Breaches        ││
│ │                 │ │                 │ │                 ││
│ │ 15              │ │ 🟢 Excellent    │ │ 5               ││
│ │                 │ │                 │ │                 ││
│ │ • AAMS #12345   │ │ Total Companies │ │ • ABC Pharma    ││
│ │   Company XYZ   │ │ 245             │ │   Critical Med  ││
│ │   High Priority │ │                 │ │   2 SKUs        ││
│ │   1 hour ago    │ │ Active Subm...  │ │                 ││
│ │                 │ │ 1,234           │ │ • XYZ Corp      ││
│ │ • Threshold     │ │                 │ │   Multiple SKUs ││
│ │   Modification  │ │ [View Details →]│ │   5 SKUs        ││
│ │   Company ABC   │ │                 │ │                 ││
│ │   Medium        │ │                 │ │ [View All →]   ││
│ │   2 hours ago   │ │                 │ │                 ││
│ │                 │ │                 │ │                 ││
│ │ [View all →]   │ │                 │ │                 ││
│ └─────────────────┘ └─────────────────┘ └─────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Critical Medicine Compliance - PRIORITY                    ││
│ │                                                          ││
│ │ ┌─────────────────────────────────────────────────────┐ ││
│ │ │ Critical Medicine Non-Compliance: 12 companies       │ ││
│ │ │                                                      │ ││
│ │ │ • Company ABC Pharma          [Extreme] 🔴          │ ││
│ │ │   • 5 critical SKUs below threshold                │ ││
│ │ │   • 2 weeks non-compliance                          │ ││
│ │ │   • WSL: Overdue  • MSQ: Overdue                    │ ││
│ │ │   Status: Not Alerted                              │ ││
│ │ │   Enforcement: 2 warnings (critical med violations)│ ││
│ │ │   [Alert] [Tier 1 Follow-up] [Create Enforcement]   │ ││
│ │ │   [View Details]                                    │ ││
│ │ │                                                      │ ││
│ │ │ • Company XYZ Corp            [Extreme] 🔴          │ ││
│ │ │   • 3 critical SKUs below threshold                │ ││
│ │ │   • 1 week non-compliance                          │ ││
│ │ │   • WSL: Overdue                                   │ ││
│ │ │   Status: Alerted  Follow-up: Tier 1 Required     │ ││
│ │ │   Enforcement: 1 warning pending approval         │ ││
│ │ │   [Escalate] [Create Enforcement] [View Details]    │ ││
│ │ │                                                      │ ││
│ │ │ • Company DEF Ltd            [High] 🟠            │ ││
│ │ │   • 2 critical SKUs near threshold                │ ││
│ │ │   • 3 days non-compliance                          │ ││
│ │ │   Status: Alerted  Follow-up: Tier 2              │ ││
│ │ │   [Monitor] [View Details]                         │ ││
│ │ └─────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ [View All Critical Medicine Issues] [Export List]        ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│ │ Enforcement     │ │ Follow-up       │ │ Audit Trail     ││
│ │ Actions         │ │ Tracking        │ │ Verification     ││
│ │                 │ │                 │ │                 ││
│ │ This Month:     │ │ Active: 65      │ │ ✅ All Actions   ││
│ │ • 3 Warnings    │ │                 │ │    Logged        ││
│ │ • 1 Fine        │ │ • Company ABC   │ │                 ││
│ │ • 0 Suspensions │ │   Assigned:     │ │ Last Verified:   ││
│ │                 │ │   Officer A     │ │ 2 min ago        ││
│ │ Recent:         │ │   Due: Today   │ │                 ││
│ │ • Warning -     │ │   Status:       │ │ Dashboard        ││
│ │   Company XYZ   │ │   In Progress   │ │ Actions:         ││
│ │   Status: Executed│ │   [View]        │ │ • Alerts: 80     ││
│ │   2 days ago    │ │                 │ │ • Follow-ups: 65 ││
│ │   [View]        │ │ • Company DEF   │ │ • Escalations: 12││
│ │                 │ │   Assigned:     │ │ • Enforcement: 4  ││
│ │ • Fine -        │ │   Officer B     │ │                 ││
│ │   Company ABC   │ │   Due: Tomorrow │ │                 ││
│ │   Status: Approved│ │   Status:       │ │                 ││
│ │   Amount: 50,000│ │   Pending      │ │                 ││
│ │   MAD           │ │   [View]        │ │                 ││
│ │   5 days ago    │ │                 │ │                 ││
│ │   [View]        │ │ • Company GHI   │ │                 ││
│ │                 │ │   Assigned:     │ │                 ││
│ │ • Warning -     │ │   Officer C     │ │                 ││
│ │   Company DEF   │ │   Due: 2 days   │ │                 ││
│ │   Status: Pending│ │   Status:       │ │                 ││
│ │   Approval      │ │   Overdue 🔴   │ │                 ││
│ │   [Review]      │ │   [View]        │ │                 ││
│ │                 │ │                 │ │                 ││
│ │ [View All →]    │ │ [View All →]   │ │                 ││
│ └─────────────────┘ └─────────────────┘ └─────────────────┘│
│                                                             │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│ │ RMM Issues      │ │ VCI - SKUs      │ │ ECS - Export    ││
│ │                 │ │                 │ │ Requests        ││
│ │ 12 Issues       │ │ Action Required │ │ (If Active)     ││
│ │                 │ │ 8 SKUs         │ │                 ││
│ │ • Company Reg. │ │                 │ │ Pending: 4      ││
│ │   Incomplete: 5 │ │ • SKU ABC-123   │ │                 ││
│ │                 │ │   Company XYZ   │ │ • Request #001  ││
│ │ • Product Data │ │   Breach: 5 days │ │   Company ABC   ││
│ │   Quality: 4    │ │   [View] [Action]│ │   High Priority ││
│ │                 │ │                 │ │                 ││
│ │ • User Account │ │ • SKU DEF-456   │ │ • Request #002  ││
│ │   Issues: 3     │ │   Company ABC   │ │   Company XYZ   ││
│ │                 │ │   Near threshold│ │   Medium        ││
│ │ [View all →]   │ │   [View] [Monitor]│ │                 ││
│ │                 │ │                 │ │ Recently Approved││
│ │                 │ │ Under Monitor   │ │ • Request #003  ││
│ │                 │ │ 15 SKUs         │ │   Company DEF   ││
│ │                 │ │                 │ │   Approved 2d ago││
│ │                 │ │ [View All →]    │ │                 ││
│ │                 │ │                 │ │ [View All →]   ││
│ └─────────────────┘ └─────────────────┘ └─────────────────┘│
│                                                             │
│ ┌─────────────────┐ ┌─────────────────┐                     │
│ │ CMC - Low Scores│ │ Quick Links     │                     │
│ │ (If Active)      │ │                 │                     │
│ │                 │ │ • Treemap       │                     │
│ │ Critical: 8     │ │ • Analytics     │                     │
│ │                 │ │ • Reports       │                     │
│ │ ┌─────────────┐ │ │ • Threshold Mgmt│                     │
│ │ │ Company ABC │ │ │                 │                     │
│ │ │ (Lowest)    │ │ │                 │                     │
│ │ │             │ │ │                 │                     │
│ │ │ Score: 45%  │ │ │                 │                     │
│ │ │ Threshold:  │ │ │                 │                     │
│ │ │ 60%         │ │ │                 │                     │
│ │ │             │ │ │                 │                     │
│ │ │      A      │ │ │                 │                     │
│ │ │      │      │ │ │                 │                     │
│ │ │   E─┼─B     │ │ │                 │                     │
│ │ │    ╱│╲      │ │ │                 │                     │
│ │ │   D─┼─C     │ │ │                 │                     │
│ │ │  (Spider)   │ │ │                 │                     │
│ │ │             │ │ │                 │                     │
│ │ │ A: 60% (Reg)│ │ │                 │                     │
│ │ │ B: 30% (Viol)│ │ │                 │                     │
│ │ │ C: 45% (Crit)│ │ │                 │                     │
│ │ │ D: 40% (Exp)│ │ │                 │                     │
│ │ │ E: 55% (Qual)│ │ │                 │                     │
│ │ │             │ │ │                 │                     │
│ │ │ Breached:   │ │ │                 │                     │
│ │ │ • Submission│ │ │                 │                     │
│ │ │ • Timeliness│ │ │                 │                     │
│ │ │             │ │ │                 │                     │
│ │ │ [View Details] [Action]          │ │                 │                     │
│ │ └─────────────┘ │ │                 │                     │
│ │                 │ │                 │                     │
│ │ Other Critical: │ │                 │                     │
│ │ • Company XYZ   │ │                 │                     │
│ │   Score: 48%  [View]                │ │                 │                     │
│ │ • Company DEF   │ │                 │                     │
│ │   Score: 52%  [View]                │ │                 │                     │
│ │                 │ │                 │                     │
│ │ Monitoring: 12  │ │                 │                     │
│ │ • Company GHI   │ │                 │                     │
│ │   Score: 58%  [View]                │ │                 │                     │
│ │                 │ │                 │                     │
│ │ [View All →]   │ │                 │                     │
│ └─────────────────┘ └─────────────────┘                     │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Governance Dashboard                                      ││
│ │ ✅ Data Usable for Governance Analysis                    ││
│ │                                                          ││
│ │ Stock Sufficiency Overview                               ││
│ │ ┌─────────────────────────────────────────────────────┐ ││
│ │ │ [Chart: Stock Levels by Product Category]           │ ││
│ │ │ Product A: 🟢 Sufficient  Product B: 🟡 Low        │ ││
│ │ └─────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ Breach Status Overview                                   ││
│ │ ┌─────────────────────────────────────────────────────┐ ││
│ │ │ Active Breaches: 23                                  │ ││
│ │ │ Critical: 5 (🔴)  High: 8 (🟠)  Medium: 10 (🟡)    │ ││
│ │ │ [Breach Trend Chart]                                │ ││
│ │ └─────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ Action Recommendations                                   ││
│ │ ┌─────────────────────────────────────────────────────┐ ││
│ │ │ • Review critical breaches (5 items)                │ ││
│ │ │ • Update threshold for Product D                     │ ││
│ │ │ • Contact Company XYZ regarding submission           │ ││
│ │ └─────────────────────────────────────────────────────┘ ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > Dashboard"
- **Title:** "Governance Overview"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **Date Range Filter:** Dropdown (e.g., "Last 30 days", "Last 7 days", "Custom")
  - **Refresh Button:** Icon button, click → Refresh all data
  - **Spacing:** 16px between actions

### %SC (Submission Compliance) Section

**Priority State: Unaddressed (High Priority)**
- **Position:** Top of dashboard, full width
- **Emergency Banner (if %SC < threshold):**
  - **Background:** Red (#ef4444) or orange (#f59e0b)
  - **Text:** "🚨 EMERGENCY: Submission Compliance Below Threshold"
  - **Details:** %SC value, Threshold value, Status indicator
  - **Warning:** "⚠️ Data cannot be used for governance analysis"
  - **Action Button:** "Schedule Emergency Meeting" (primary, prominent)
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

### Unsubmitted Companies List

**Visibility:** Only shown when %SC unaddressed
- **Title:** "Unsubmitted Companies (X) - ACTION REQUIRED"
- **Layout:** Full width, scrollable list
- **Item Format:**
  - **Company Name:** Bold, 16px
  - **Priority Badge:** [Extreme] 🔴 or [Normal] 🟡
  - **Details:** Bullet list of missing submissions, critical medicines count, repeated offender indicator
  - **Status:** "Not Alerted" / "Alerted" / "In Follow-up"
  - **Action Buttons:**
    - **Alert:** Send notification to company
    - **Tier 1 Follow-up:** Assign to Tier 1 (extreme cases)
    - **Tier 2 Follow-up:** Assign to Tier 2 (normal cases)
    - **Create Enforcement:** Open enforcement action creation wizard (for repeated offenders or extreme cases)
    - **View Details:** Navigate to company detail page
  - **Enforcement History Display:**
    - **Format:** "Enforcement: X warnings, Y fines, Z suspensions"
    - **Link:** Click to view all enforcement actions for company
    - **Color Indicator:** Red if recent enforcement actions exist
- **Footer Actions:**
  - **View All Unsubmitted:** Navigate to full list
  - **Bulk Alert:** Alert all unsubmitted companies
  - **Export List:** Download as CSV/PDF

### Pending Approvals Widget

**Priority:** High (after %SC addressed)
- **Title:** "Pending Approvals"
- **Count:** Large number (e.g., "15")
  - **Typography:** 32px, font-weight: 700, color: #f59e0b (warning-500)
- **Items List:**
  - **Format:** List items with submission/request type, company name, priority badge, timestamp
  - **Types:** AAMS Threshold Approvals, Company Registrations, Export Requests, Threshold Modifications
  - **Priority Badge:** High (red), Medium (orange), Low (yellow)
  - **Max Items:** 5 recent items
- **Action Link:** "View all →"

### System Health Widget

- **Title:** "System Health"
- **Status Indicator:** 🟢 Excellent / 🟡 Good / 🔴 Critical
  - **Color-coded:** Green (#22c55e), Yellow (#eab308), Red (#ef4444)
- **Metrics:**
  - **Total Companies:** Large number (e.g., "245")
  - **Active Submissions:** Large number (e.g., "1,234")
- **Action Link:** "View Details →"

### Critical Medicine Compliance Section

**Visibility:** Always visible when %SC addressed, high priority when %SC unaddressed
- **Title:** "Critical Medicine Compliance - PRIORITY"
- **Position:** High priority section, full width
- **Purpose:** Dedicated section for tracking non-compliance with critical medicines (MOH-designated essential medicines)
- **Layout:** Full width, scrollable list
- **Item Format:**
  - **Company Name:** Bold, 16px
  - **Priority Badge:** [Extreme] 🔴, [High] 🟠, [Medium] 🟡
  - **Critical SKUs Count:** Number of critical medicines below threshold
  - **Non-Compliance Duration:** How long the company has been non-compliant
  - **Missing Submissions:** WSL, MSQ, AAMS overdue indicators
  - **Status:** "Not Alerted" / "Alerted" / "In Follow-up"
  - **Assigned Officer:** Name of Tier 1 or Tier 2 officer (if assigned)
  - **Due Date:** Follow-up due date (if assigned)
  - **Action Buttons:**
    - **Alert:** Send notification to company
    - **Tier 1 Follow-up:** Assign to Tier 1 officer (extreme/high priority)
    - **Create Enforcement:** Open enforcement action creation wizard (for critical medicine violations)
    - **Escalate:** Escalate from Tier 2 to Tier 1
    - **Monitor:** Continue monitoring (medium priority)
    - **View Details:** Navigate to company detail page with critical medicine filter
  - **Enforcement History Display:**
    - **Format:** "Enforcement: X warnings (critical med violations)" or "Enforcement: X warnings, Y fines"
    - **Status Indicator:** Show if enforcement action is pending approval
    - **Link:** Click to view all enforcement actions for company
- **Footer Actions:**
  - **View All Critical Medicine Issues:** Navigate to filtered view
  - **Export List:** Download as CSV/PDF
- **Sorting:** By priority (Extreme → High → Medium), then by non-compliance duration
- **Filtering:** By company type, region, critical medicine count

**Note:** This section is separate from general unsubmitted companies list because critical medicines are public health priorities and require immediate attention.

### Enforcement Actions Card

- **Title:** "Enforcement Actions"
- **Position:** Medium priority widget (grid layout)
- **Purpose:** Track MOH enforcement actions (warnings, fines, suspensions) taken against companies
- **Layout:** Card widget, compact view
- **Summary Section:**
  - **This Month:** Count of enforcement actions by type
    - **Warnings:** Count (e.g., "3")
    - **Fines:** Count (e.g., "1")
    - **Suspensions:** Count (e.g., "0")
- **Recent Actions List:**
  - **Format:** Compact list showing most recent 3-4 actions
  - **Item Format:**
    - **Action Type:** Warning / Fine / Suspension
    - **Company Name:** Link to company detail
    - **Status:** Draft / Pending Review / Pending Approval / Approved / Executed / Appealed / Resolved
    - **Status Badge:** Color-coded (Draft: gray, Pending: yellow, Approved: blue, Executed: green, Overdue: red)
    - **Amount:** For fines, show amount and currency (e.g., "50,000 MAD")
    - **Date:** "X days ago" or specific date
    - **Action Buttons:**
      - **"Review"** - If status is Pending Approval (navigates to approval interface)
      - **"View"** - Navigates to enforcement action detail page
- **Action Link:** "View All →" navigates to `/enforcement/actions` (enforcement actions list page)
- **Route:** `/enforcement` (enforcement module - MOH Tier 1 and Tier 2 only)
  - **Dashboard:** `/enforcement` - Enforcement dashboard with summary and metrics
  - **Actions List:** `/enforcement/actions` - All enforcement actions (filterable, searchable)
  - **Action Detail:** `/enforcement/actions/[id]` - Individual enforcement action detail
  - **Pending Approvals:** `/enforcement/pending-approvals` - Actions requiring Tier 1 approval
  - **Reports:** `/enforcement/reports` - Enforcement analytics and reporting
- **Rationale:** Dedicated enforcement module provides proper workflow management, approval processes, and regulatory compliance tracking separate from audit logs

### Follow-up Tracking Card

- **Title:** "Follow-up Tracking"
- **Position:** Medium priority widget (grid layout)
- **Purpose:** Track assigned follow-ups with accountability (officer assignment, due dates, status)
- **Layout:** Card widget, scrollable list
- **Summary:**
  - **Active Follow-ups:** Total count (e.g., "65")
- **Follow-up List:**
  - **Format:** List of active follow-ups (max 3-5 visible)
  - **Item Format:**
    - **Company Name:** Link to company detail
    - **Assigned Officer:** Officer name (Tier 1 or Tier 2)
    - **Due Date:** "Today", "Tomorrow", or specific date
    - **Status:** Pending / In Progress / Overdue / Resolved
    - **Priority:** Extreme / High / Medium / Low
    - **View Link:** Navigate to follow-up detail or company page
- **Status Indicators:**
  - **Pending:** Gray badge
  - **In Progress:** Blue badge
  - **Overdue:** Red badge (highlighted)
  - **Resolved:** Green badge (can be hidden after resolution)
- **Action Link:** "View All →" navigates to follow-up management page
- **Route:** `/dashboard/follow-ups` (to be created) or filter in unsubmitted companies list

**Follow-up Assignment Workflow:**
1. Officer clicks "Tier 1/Tier 2 Follow-up" button
2. System prompts for officer assignment (dropdown or auto-assign)
3. System sets due date (default: 3 business days for Tier 2, 1 business day for Tier 1)
4. System creates follow-up record with:
   - Company ID
   - Assigned officer ID
   - Due date
   - Priority
   - Status: Pending
5. System sends notification to assigned officer
6. System logs action in audit trail

**Enforcement Action Creation Workflow (from Dashboard):**
1. Officer clicks "Create Enforcement" button on company item
2. System opens enforcement action creation wizard (modal or new page)
3. **Step 1 - Action Type Selection:**
   - Warning (Tier 2 can approve)
   - Fine (requires Tier 1 approval)
   - Suspension (requires Tier 1 approval)
4. **Step 2 - Violation Selection:**
   - Auto-populated with violation type based on context:
     - Submission non-compliance (from unsubmitted companies)
     - Critical medicine non-compliance (from critical medicine section)
     - Threshold breach (from breach context)
     - Repeated offender (from company history)
   - Violation reference auto-linked to source (breach_id, compliance_score_id, etc.)
5. **Step 3 - Details:**
   - Legal basis (dropdown or text input)
   - Justification (required text area)
   - Amount (for fines only, with currency selector)
   - Notes (optional, internal MOH notes)
6. **Step 4 - Review & Submit:**
   - Preview of enforcement action
   - Submit creates action with status:
     - Warning: "pending_review" (Tier 2 reviews)
     - Fine/Suspension: "pending_approval" (Tier 1 approves)
7. System creates audit log entry
8. System sends notification:
   - To Tier 2 (if warning) or Tier 1 (if fine/suspension) for review/approval
   - To company (after approval/execution)
9. System updates dashboard enforcement card

### Audit Trail Verification Card

- **Title:** "Audit Trail Verification"
- **Position:** Medium priority widget (grid layout)
- **Purpose:** Verify that all dashboard actions are properly logged in audit trail
- **Layout:** Card widget, status display
- **Status Display:**
  - **Verification Status:** ✅ "All Actions Logged" or ⚠️ "Verification Required"
  - **Last Verified:** Timestamp (e.g., "2 min ago")
  - **Auto-refresh:** Every 30 seconds or on action
- **Dashboard Actions Summary:**
  - **Alerts Sent:** Count (e.g., "80")
  - **Follow-ups Assigned:** Count (e.g., "65")
  - **Escalations:** Count (e.g., "12")
  - **Enforcement Actions Created:** Count (e.g., "4")
  - **Total Actions:** Sum of all actions
- **Verification Details:**
  - **Logged Actions:** Count matching total
  - **Unlogged Actions:** Count (should be 0)
  - **Last Audit Log Entry:** Timestamp and action type
- **Action Link:** "View Audit Log" navigates to `/audit/logs` filtered for dashboard actions
- **Real-time Verification:**
  - System verifies each dashboard action is logged within 1 second
  - If action not logged within 5 seconds, show warning
  - If action not logged within 30 seconds, show error and disable action buttons

**Audit Trail Requirements for Dashboard Actions:**
- **Alert Action:** Log with operation_type="alert", table_name="notifications", reason="Company non-compliance"
- **Follow-up Assignment:** Log with operation_type="assign_followup", table_name="follow_ups", reason="Follow-up required"
- **Escalation:** Log with operation_type="escalate", table_name="follow_ups", reason="Escalation to Tier 1"
- **Emergency Meeting:** Log with operation_type="schedule_meeting", table_name="meetings", reason="%SC below threshold"
- **Enforcement Action Creation:** Log with operation_type="create", table_name="enforcement_actions", reason="Enforcement action created", includes action_type, violation_type, company_id in new_values
- **Enforcement Action Approval:** Log with operation_type="approve", table_name="enforcement_actions", reason="Enforcement action approved", includes action_id, approved_by in new_values
- **Enforcement Action Execution:** Log with operation_type="execute", table_name="enforcement_actions", reason="Enforcement action executed", includes action_id, executed_by in new_values
- **Bulk Actions:** Log each individual action, not just bulk operation

### Critical Breaches Widget

- **Title:** "Critical Breaches"
- **Count:** Large number (e.g., "5")
  - **Typography:** 32px, font-weight: 700, color: #ef4444 (error-500)
- **Items List:**
  - **Format:** Company name, product/SKU details, breach severity
  - **Max Items:** 3-5 critical breaches
- **Action Link:** "View All →"

### RMM Issues Card

- **Title:** "RMM Issues"
- **Total Count:** Large number (e.g., "12")
- **Issue Categories:**
  - **Company Registration Incomplete:** Count, list of companies
  - **Product Data Quality Issues:** Count, list of products
  - **User Account Issues:** Count, list of users
  - **Critical Medicines Designation:** Count (if applicable)
  - **ATC Code Assignment:** Count (if applicable)
- **Item Format:**
  - **Issue Type:** Bold
  - **Count:** Number of issues
  - **Details:** Brief description or list
- **Action Link:** "View all →"
- **Click Action:** Navigate to RMM issues page or specific issue type

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

### ECS Card - Export Requests (If ECS Active)

- **Title:** "ECS - Export Requests"
- **Visibility:** Only shown if ECS module is active
- **Two Sections:**

**1. Pending Approval:**
  - **Count:** Number pending (e.g., "4")
  - **Items:**
    - **Request ID:** Link to request detail
    - **Company:** Company name
    - **Product/SKU:** Product details
    - **Request Date:** Timestamp
    - **Priority Badge:** High/Medium/Low
  - **Max Items:** 3-5 requests

**2. Recently Approved:**
  - **Timeframe:** Last 7 days (configurable)
  - **Items:**
    - **Request ID:** Link to request detail
    - **Company:** Company name
    - **Approved Date:** Timestamp
  - **Max Items:** 3-5 requests

- **Action Links:** "View All →" for each section

### CMC Card - Low Scores (If CMC Active)

- **Title:** "CMC - Low Scores"
- **Visibility:** Only shown if CMC module is active
- **Two Sections:**

**1. Critical Scores (Action Required):**
  - **Count:** Number of companies with critical scores (e.g., "8")
  - **Featured Company (Lowest Score):**
    - **Company Name:** First/lowest-scoring company (e.g., "Company ABC")
    - **Label:** "(Lowest)" indicator
    - **Current Score:** Large percentage (e.g., "45%")
    - **Threshold:** Required threshold (e.g., "60%")
    - **Spider Graph (Radar Chart):**
      - **Type:** Radar/Spider chart with 5 axes (one per factor)
      - **Size:** Compact (200px × 200px recommended for card view)
      - **Layout:** Five axes arranged in a pentagon pattern (A top, B top-right, C bottom-right, D bottom-left, E top-left)
      - **Axes (5 Factors):**
        1. **Factor A - Regulatory Reporting Compliance Rate:** Percentage (0-100%)
           - **Label:** "A" or "Regulatory Compliance" (abbreviated)
           - **Weight:** 25-30% of total CMC score
           - **Definition:** Percentage of mandatory weekly stock reports submitted within regulatory deadline over past 12 months
           - **Calculation:** (On-time + Late submissions) / Total expected submissions × 100
        2. **Factor B - Stock Threshold Violation Frequency:** Percentage (0-100%, inverted scale - lower violations = higher score)
           - **Label:** "B" or "Threshold Violations" (abbreviated)
           - **Weight:** 20-25% of total CMC score
           - **Definition:** Average count of SKUs per reporting cycle that fail to meet minimum stock requirements, calculated over last 6 months
           - **Note:** Lower violation frequency = higher score (inverted: 0 violations = 100%, high violations = low %)
           - **Calculation:** Inverted scale based on violation frequency
        3. **Factor C - Critical Medicine Coverage:** Percentage (0-100%)
           - **Label:** "C" or "Critical Medicine" (abbreviated)
           - **Weight:** 20-25% of total CMC score
           - **Definition:** Coverage percentage and critical SKU tracking for medicines designated as critical by MOH
           - **Calculation:** *Formulas to be defined in Phase 1.3.1.9a*
           - **Note:** Tracks coverage and availability of critical medicines designated as essential for public health
        4. **Factor D - Aggregate Non-Compliance Exposure:** Percentage (0-100%, inverted scale - lower exposure = higher score)
           - **Label:** "D" or "Non-Compliance" (abbreviated)
           - **Weight:** 15% of total CMC score
           - **Definition:** Total SKU-days of threshold non-compliance accumulated across all products over past 12 months
           - **Note:** Lower exposure = higher score (inverted: 0 SKU-days = 100%, high SKU-days = low %)
           - **Calculation:** Inverted scale based on total SKU-days of non-compliance
        5. **Factor E - Data Quality Signals:** Percentage (0-100%)
           - **Label:** "E" or "Data Quality" (abbreviated)
           - **Weight:** 5-10% of total CMC score (10% when ECS active, 5% when ECS inactive)
           - **Definition:** Composite metric evaluating completeness, accuracy, and timeliness of submitted data
           - **Calculation:** *Formulas to be defined in Phase 1.3.1.8a*
           - **Components:** Completeness metrics, accuracy metrics, timeliness metrics
           - **Note:** Foundation for accurate reporting - measures data reliability across all submissions
      - **Visual Elements:**
        - **Current Score Line:** Colored polygon/line showing company's performance on each factor
          - **Color:** Red if below threshold, Yellow if near threshold, Green if above threshold
          - **Fill:** Semi-transparent fill for better visibility
        - **Threshold Line (Optional):** Dashed line showing target/threshold for each factor (e.g., 60% threshold)
        - **Average Line (Optional):** Light gray line showing system average for comparison
        - **Grid Lines:** Concentric circles at 25%, 50%, 75%, 100% for reference
        - **Color Coding:** 
          - **Green zone:** Above threshold (good performance)
          - **Yellow zone:** Near threshold (warning - within 10% of threshold)
          - **Red zone:** Below threshold (critical performance)
      - **Interactive Features:**
        - **Hover:** Show tooltip with exact percentage, factor name, and definition
        - **Click:** Navigate to company's CMC score detail page (shows full-size spider graph)
      - **Legend:** Factor labels below chart:
        - A: Regulatory Compliance (60%)
        - B: Threshold Violations (30%)
        - C: Critical Medicine (45%)
        - D: Non-Compliance Exposure (40%)
        - E: Data Quality (55%)
      - **Accessibility:**
        - ARIA labels for each axis
        - Screen reader description of the chart
        - Keyboard navigation support
    - **Breached Categories:** List of compliance categories breached
    - **Action Buttons:** "View Details" (navigate to score detail with full spider graph), "Action" (take action)
  - **Other Critical Companies:**
    - **Format:** Compact list showing company name, score, "View" link
    - **Max Items:** 3-5 additional companies
    - **Click Action:** Clicking a company updates the featured section to show that company's spider graph

**2. Monitoring (Below Threshold, Stable):**
  - **Count:** Number of companies being monitored (e.g., "12")
  - **Items:**
    - **Company Name:** Link to company detail
    - **Current Score:** Percentage
    - **Threshold:** Required threshold
    - **Trend Indicator:** Stable/Improving
    - **Action Buttons:** "View" (navigate to score detail), "Monitor" (continue monitoring)
  - **Max Items:** 5 companies

- **Action Links:** "View All →" for each section

**Spider Graph Specifications:**
- **Chart Library:** Use a radar chart library (e.g., Chart.js, Recharts, D3.js)
- **Responsive:** Scales appropriately on different screen sizes
- **Accessibility:** ARIA labels for screen readers, keyboard navigation
- **Detail View:** Full-size spider graph (400px × 400px) shown on company's CMC score detail page (`/cmc/scores/[company_id]`) with:
  - **Larger Visualization:** 400px × 400px (or responsive to container)
  - **Enhanced Details:**
    - All five factors clearly labeled with full names
    - Exact percentages displayed on each axis
    - Component weights displayed (MOH Tier 1 only)
    - Threshold lines for each factor
    - System average comparison line
    - Previous period comparison (optional, toggle)
    - Additional factors shown if ECS is active (Replenishment Plan Adherence, Export Compliance) - up to 7 factors total
  - **Historical Context:**
    - Trend indicator (improving/declining/stable)
    - Previous period overlay (optional)
    - Historical trend chart (optional, separate view)
  - **Export Capability:** 
    - Export as PNG
    - Export as PDF (with company details)
    - Share functionality (optional)
  - **Interactive Features:**
    - Hover for detailed tooltips
    - Click to filter related data
    - Toggle between current period and historical comparison

### Quick Links Section

- **Title:** "Quick Links"
- **Layout:** Button group or link list
- **Links:**
  - **Treemap:** Navigate to `/vci/governance/treemap`
  - **Analytics:** Navigate to `/vci/analytics` or analytics dashboard
  - **Reports:** Navigate to report generation page
  - **Threshold Management:** Navigate to `/vci/thresholds` (Tier 1 only)
- **Format:** Icon buttons or text links with icons
- **Spacing:** 16px between links

### Governance Dashboard Section

**Visibility:** Only fully functional when %SC ≥ threshold
- **Title:** "Governance Dashboard"
- **Status Banner:**
  - **When %SC < threshold:** "⚠️ DATA NOT USABLE FOR GOVERNANCE ANALYSIS" (red banner)
  - **When %SC ≥ threshold:** "✅ Data Usable for Governance Analysis" (green banner)
- **Overlay (when %SC < threshold):**
  - **Semi-transparent overlay** over all charts
  - **Message:** "DATA NOT USABLE - %SC Below Threshold"
  - **Charts disabled:** No interactions, no exports

**Stock Sufficiency Overview:**
- **Title:** "Stock Sufficiency Overview"
- **Chart:** Bar chart or visualization showing stock levels by product category
- **Status Indicators:**
  - **🟢 Sufficient:** Green (stock above threshold)
  - **🟡 Low:** Yellow (stock near threshold)
  - **🔴 Critical:** Red (stock below threshold)
- **Product List:** List of products with status indicators

**Breach Status Overview:**
- **Title:** "Breach Status Overview"
- **Active Breaches Count:** Large number (e.g., "23")
- **Breakdown by Priority:**
  - **Critical:** Count with red indicator (🔴)
  - **High:** Count with orange indicator (🟠)
  - **Medium:** Count with yellow indicator (🟡)
- **Breach Trend Chart:** Line chart showing breach trends over time
- **Action:** "View All Breaches" link

**Action Recommendations:**
- **Title:** "Action Recommendations"
- **Recommendations List:**
  - **Format:** Bullet list with action description, priority indicator
  - **Priority:** High/Medium/Low (color-coded)
  - **Max Items:** 5-7 recommendations
- **Action:** "View All Recommendations" link

---

## Dynamic Priority System

### Priority Logic

**When %SC Unaddressed:**
1. %SC Section: **Top Priority** (full width, large donut chart)
2. Unsubmitted Companies List: **High Priority** (full width, prominent)
3. Emergency Banner: **Shown if %SC < threshold**
4. Governance Dashboard: **Disabled** (overlay, no interactions)
5. Other widgets: **Secondary** (smaller, below priority sections)

**When %SC Addressed:**
1. %SC Section: **Collapsed** (summary view, secondary position)
2. Critical Medicine Compliance: **Top Priority** (full width, prominent) - Always visible, high priority
3. Pending Approvals: **High Priority** (prominent widget)
4. System Health: **High Priority** (prominent widget)
5. Critical Breaches: **High Priority** (prominent widget)
6. Enforcement Actions, Follow-up Tracking, Audit Trail Verification: **Medium Priority** (grid layout)
7. Module Cards (RMM, VCI, ECS, CMC): **Medium Priority** (grid layout)
8. Governance Dashboard: **Enabled** (full functionality, no overlay)
9. Quick Links: **Always Visible** (secondary position)

**Note on Compliance Trends and History:**
- **Compliance Trend Analysis:** Available in CMC module at `/cmc/scores/[id]` (Trends tab) and `/cmc/scores/history`
- **Company Compliance History:** Available in CMC module at `/cmc/scores/[id]` (History tab) and company detail pages
- **Rationale:** These features are part of CMC's comprehensive compliance monitoring functionality and should be accessed through the CMC module for full context and detailed analysis

### Status Indicators

**%SC Status:**
- **🔴 Below Threshold:** Red indicator, emergency banner shown
- **🟢 Above Threshold:** Green indicator, normal operations

**Actions Taken Status:**
- **"All Actions Taken" Badge:** Shown when all unsubmitted companies have been alerted and follow-ups initiated
- **Progress Count:** "X alerted, Y in follow-up, Z resolved"

---

## Annotations

### Blue (Interactions)
- **Click donut chart segment** → Filter unsubmitted companies list by category
- **Click "Schedule Emergency Meeting"** → Open meeting scheduling modal
- **Click "Alert" button** → Send notification to company, update status
- **Click "Tier 1/Tier 2 Follow-up"** → Assign follow-up, update status
- **Click "Expand" on %SC** → Expand collapsed %SC section
- **Click widget "View all"** → Navigate to related list page
- **Click approval/item** → Navigate to item detail page
- **Click chart** → Drill down to detailed view (if %SC ≥ threshold)
- **Click company name in CMC card** → Update featured section to show that company's spider graph
- **Click "View Details" in CMC card** → Navigate to company's CMC score detail page (shows full-size spider graph)
- **Hover over spider graph** → Show tooltip with exact percentage for each factor
- **Click quick link** → Navigate to respective page
- **Click date range filter** → Open dropdown, select range
- **Click refresh button** → Refresh all dashboard data
- **Click "Alert" in Critical Medicine section** → Send notification, log in audit trail, update status
- **Click "Tier 1 Follow-up" in Critical Medicine section** → Open follow-up assignment modal, assign officer, set due date, log in audit trail
- **Click "Create Enforcement" in Critical Medicine section** → Open enforcement action creation wizard, create enforcement action, log in audit trail
- **Click "Escalate" in Critical Medicine section** → Escalate from Tier 2 to Tier 1, log in audit trail
- **Click "View All Critical Medicine Issues"** → Navigate to filtered critical medicine compliance page
- **Click "Create Enforcement" in Unsubmitted Companies** → Open enforcement action creation wizard, auto-populate violation type, create action
- **Click "View All →" in Enforcement Actions** → Navigate to `/enforcement/actions` (enforcement actions list page)
- **Click "Review" in Enforcement Actions card** → Navigate to `/enforcement/pending-approvals` or action detail for approval
- **Click enforcement action item in Enforcement Actions card** → Navigate to `/enforcement/actions/[id]` (enforcement action detail)
- **Click "View All →" in Follow-up Tracking** → Navigate to follow-up management page
- **Click "View Audit Log" in Audit Trail Verification** → Navigate to `/audit/logs` filtered for dashboard actions
- **Click follow-up item in Follow-up Tracking** → Navigate to follow-up detail or company page
- **Click company name in Critical Medicine section** → Navigate to company detail page with critical medicine filter applied
- **Click enforcement history link** → Navigate to `/enforcement/actions?company_id=[id]` (filtered by company)

### Orange (Validation)
- **Threshold validation:** %SC compared against Tier 1-set threshold
- **Action validation:** Ensure all required fields before alerting/follow-up
- **Data usability:** Governance charts disabled when %SC < threshold

### Green (States)
- **%SC Status:** Color-coded (🔴 Below / 🟢 Above Threshold)
- **Actions Taken:** "All Actions Taken" badge when addressed
- **Real-time updates:** Data updates automatically (indicator shown)
- **Loading state:** Skeleton loaders for widgets and charts
- **Empty state:** "No pending approvals" / "No issues" messages
- **System health indicator:** Color-coded status (green/yellow/red)
- **Priority badges:** Color-coded (high=red, medium=orange, low=yellow)
- **Module status:** ECS/CMC cards only shown if modules active

---

## Responsive Behavior

### Desktop (1024px+)
- **%SC Section (unaddressed):** Full width, large donut chart
- **Widget Grid:** 3 columns for module cards
- **Governance Dashboard:** Full width sections
- **Charts:** Full width, readable size

### Tablet (768px - 1023px)
- **%SC Section:** Full width, medium donut chart
- **Widget Grid:** 2 columns (or 1 column stacked)
- **Governance Dashboard:** Full width sections
- **Charts:** Full width, may be smaller

### Mobile (<768px)
- **%SC Section:** Full width, smaller donut chart
- **Widget Grid:** 1 column (stacked)
- **Governance Dashboard:** Full width sections
- **Charts:** Full width, may require horizontal scroll
- **Action Buttons:** Full width, stacked vertically

---

## Design System References

### Components Used
- **Card Component:** Widget containers
- **Donut Chart Component:** %SC visualization
- **Radar Chart Component (Spider Graph):** CMC score breakdown visualization
- **Chart Component:** Stock sufficiency chart, breach trend chart
- **List Component:** Pending approvals, unsubmitted companies, issues, SKUs
- **Badge Component:** Priority indicators, status indicators
- **Metric Card Component:** System-wide metrics
- **Button Component:** Action buttons, quick links
- **Overlay Component:** Data usability overlay

### Colors
- **Widget Background:** #ffffff (white)
- **Emergency Banner:** #ef4444 (error-500) or #f59e0b (warning-500)
- **Critical Priority:** #ef4444 (error-500)
- **High Priority:** #f59e0b (warning-500)
- **Medium Priority:** #eab308 (warning-400)
- **Low Priority:** #84cc16 (success-400)
- **System Health Excellent:** #22c55e (success-500)
- **System Health Good:** #eab308 (warning-400)
- **System Health Critical:** #ef4444 (error-500)
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
- **Progressive Disclosure:** %SC collapses when addressed, other content becomes primary
- **Visual Hierarchy:** Priority-based sizing and positioning
- **Contextual Actions:** Action buttons appear where needed
- **Status Clarity:** Clear indicators for all states

### Performance
- **Lazy Loading:** Module cards (ECS, CMC) only load if modules active
- **Pagination:** Lists show limited items with "View All" links
- **Data Caching:** Dashboard data cached with refresh option
- **Progressive Enhancement:** Core metrics load first, charts load after

### Accessibility
- **Keyboard Navigation:** All interactive elements keyboard accessible
- **Screen Reader Support:** ARIA labels for charts and status indicators
- **Color Contrast:** All text meets WCAG 2.1 AA standards
- **Focus Indicators:** Clear focus states for all interactive elements

### User Experience
- **Immediate Feedback:** Status updates show immediately
- **Error Prevention:** Confirmation dialogs for critical actions
- **Contextual Help:** Tooltips and help text where needed
- **Consistent Patterns:** Same interaction patterns across widgets

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/dashboard`
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - MOH Tier 1 role dashboard
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Chart, Card, List components
- [Design System](../../../../02-architecture/frontend/design-system.md) - Colors, typography, spacing

---

**Last Updated:** 2025-01-01  
**Status:** 🟡 Ready for Review
