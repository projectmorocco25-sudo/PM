# Task 0.5.1.19: MOH Tier 1 Dashboard Wireframe

**Status:** ✅ Complete  
**Route:** `/dashboard` (MOH Tier 1 role)  
**File:** `task-0.5.1.19-moh-tier1-dashboard.png`  
**Priority:** 🔴 Critical Foundation

**Design Approach:** Modern enterprise dashboard with tabbed navigation, modal-based quick actions, and priority-based card organization. Inspired by Stripe, GitHub, Linear, and shadcn/ui best practices.

---

## Overview

This dashboard uses a **tabbed interface** to organize content by workflow, **modals** for quick actions to maintain context, and **priority-based card layouts** to reduce cognitive load and improve task completion speed.

### Key Improvements
- **Tabs:** Organize content into Overview, Compliance, Enforcement, Modules, Reports
- **Modals:** Quick actions (Alert, Assign Follow-up, Schedule Meeting) without navigation
- **Card Reorganization:** Priority-based grouping with full-width critical sections
- **Sticky Header:** Quick actions always accessible
- **Collapsible Sections:** User-controlled content density

---

## Wireframe Layout - Overview Tab (Default)

### Scenario 1: %SC Unaddressed (Emergency State)

```
┌─────────────────────────────────────────────────────────────┐
│ Home > Dashboard                                             │
│                                                             │
│ Governance Overview              [Date Range ▼] [Refresh]   │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ [Overview] [Compliance] [Enforcement] [Modules] [Reports]││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Quick Actions                                            ││
│ │ [Alert All] [Bulk Follow-up] [Export] [Filters ▼]      ││
│ └─────────────────────────────────────────────────────────┘│
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
│ │ Submission Compliance (%SC) - PRIORITY        [Collapse]││
│ │                                                          ││
│ │         ┌─────────────┐                                  ││
│ │         │             │                                  ││
│ │         │    68%      │                                  ││
│ │         │   %SC       │                                  ││
│ │         │             │                                  ││
│ │         │ 🔴 Below    │                                  ││
│ │         │ Threshold   │                                  ││
│ │         └─────────────┘                                  ││
│ │                                                          ││
│ │    ┌─────────────────────────────────────┐              ││
│ │    │ 🟢 On-Time: 45% (112 companies)      │              ││
│ │    │ 🟡 Late: 23% (58 companies)         │              ││
│ │    │ 🔴 Unsubmitted: 32% (80 companies)  │              ││
│ │    └─────────────────────────────────────┘              ││
│ │                                                          ││
│ │    [View Unsubmitted Companies →]                        ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        ││
│ │ System Health│ │ Pending      │ │ Critical     │        ││
│ │              │ │ Approvals    │ │ Compliance Violations     │        ││
│ │ 🟢 Excellent │ │ 15           │ │ 5            │        ││
│ │              │ │              │ │              │        ││
│ │ Companies:   │ │ • AAMS #12345│ │ • ABC Pharma │        ││
│ │ 245          │ │   High       │ │   Critical   │        ││
│ │              │ │   1h ago     │ │   2 SKUs     │        ││
│ │ Active Subm: │ │   ⚠️ 2d deadline│ │   Legal: DMP Art.15│        ││
│ │ 1,234        │ │              │ │              │        ││
│ │              │ │ ⚠️ Company  │ │ • XYZ Corp   │        ││
│ │ [Details →] │ │   Deletion   │ │   5 SKUs     │        ││
│ │              │ │   Request   │ │   Legal: DMP Art.12│        ││
│ │              │ │   Company ABC│ │              │        ││
│ │              │ │   Awaiting   │ │              │        ││
│ │              │ │   Approval   │ │              │        ││
│ │              │ │   [Approve]  │ │              │        ││
│ │              │ │              │ │              │        ││
│ │              │ │ • Threshold  │ │              │        ││
│ │              │ │   Medium     │ │              │        ││
│ │              │ │   2h ago     │ │              │        ││
│ │              │ │   ⚠️ 3d deadline│ │              │        ││
│ │              │ │              │ │              │        ││
│ │              │ │ [View All →]│ │ [View All →]│        ││
│ └──────────────┘ └──────────────┘ └──────────────┘        ││
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Regulatory Compliance Metrics                            ││
│ │                                                          ││
│ │ Legal Basis Compliance: 95% (57/60 actions)             ││
│ │ Deadline Compliance: 92% (55/60 actions)                ││
│ │ Regulatory Requirements: 98% (59/60 actions)            ││
│ │                                                          ││
│ │ [View Compliance Details]                               ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        ││
│ │ Module       │ │              │ │              │        ││
│ │ Activation   │ │              │ │              │        ││
│ │ Status       │ │              │ │              │        ││
│ │              │ │              │ │              │        ││
│ │ ECS: 🟢 ON  │ │              │ │              │        ││
│ │ Regulatory: ✓│ │              │ │              │        ││
│ │ Auth: DMP Art.10│ │              │ │              │        ││
│ │              │ │              │ │              │        ││
│ │ CMC: ⚪ OFF │ │              │ │              │        ││
│ │ Regulatory: ⚠️│ │              │ │              │        ││
│ │ Verify       │ │              │ │              │        ││
│ │              │ │              │ │              │        ││
│ │ [View Config]│ │              │ │              │        ││
│ └──────────────┘ └──────────────┘ └──────────────┘        ││
│                                                             │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        ││
│ │ Pending       │ │ Enforcement  │ │ Follow-up    │        ││
│ │ Threshold     │ │ Actions      │ │ Tracking     │        ││
│ │ Reversions    │ │              │ │              │        ││
│ │              │ │              │ │              │        ││
│ │ 8 Pending     │ │ This Month:  │ │ Active: 65   │        ││
│ │              │ │ • 3 Warnings │ │              │        ││
│ │ • 5 Auto      │ │ • 1 Fine     │ │ • Company ABC│        ││
│ │   Revert      │ │ • 0 Suspensions│ │   Officer A  │        ││
│ │   (7 days)    │ │              │ │   Due: Today │        ││
│ │              │ │ Recent:      │ │   [View]     │        ││
│ │ • 3 Manual    │ │ • Warning    │ │              │        ││
│ │   Review      │ │   Company XYZ│ │ [View All →]│        ││
│ │   (2 days)    │ │   Executed   │ │              │        ││
│ │              │ │   [View]     │ │              │        ││
│ │ [Review All →]│ │              │ │              │        ││
│ │              │ │ [View All →]│ │              │        ││
│ └──────────────┘ └──────────────┘ └──────────────┘        ││
│                                                             │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        ││
│ │ Audit Trail  │ │              │ │              │        ││
│ │ Actions      │ │ Tracking     │ │ Verification │        ││
│ │              │ │              │ │              │        ││
│ │ This Month:  │ │ Active: 65   │ │ ✅ All Actions│        ││
│ │ • 3 Warnings │ │              │ │    Logged     │        ││
│ │ • 1 Fine     │ │ • Company ABC│ │              │        ││
│ │ • 0 Suspensions│ │   Officer A  │ │ Last Verified:│        ││
│ │              │ │   Due: Today │ │ 2 min ago    │        ││
│ │ Recent:      │ │   [View]     │ │              │        ││
│ │ • Warning    │ │              │ │ Dashboard    │        ││
│ │   Company XYZ│ │ • Company DEF│ │ Actions:     │        ││
│ │   Executed   │ │   Officer B  │ │ • Alerts: 80 │        ││
│ │   [View]     │ │   Tomorrow   │ │ • Follow-ups:│        ││
│ │              │ │   [View]     │ │   65         │        ││
│ │ [View All →]│ │              │ │              │        ││
│ │              │ │ [View All →]│ │ [View Logs →]│        ││
│ └──────────────┘ └──────────────┘ └──────────────┘        ││
└─────────────────────────────────────────────────────────────┘
```

### Scenario 2: %SC Addressed (Normal State)

```
┌─────────────────────────────────────────────────────────────┐
│ Home > Dashboard                                             │
│                                                             │
│ Governance Overview              [Date Range ▼] [Refresh]   │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ [Overview] [Compliance] [Enforcement] [Modules] [Reports]││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Quick Actions                                            ││
│ │ [Alert All] [Bulk Follow-up] [Export] [Filters ▼]      ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Submission Compliance (%SC) - Collapsed       [Expand]  ││
│ │ %SC: 82%  🟢 Above Threshold (75%)                       ││
│ │ ✅ All Actions Taken: 80 alerted, 65 in follow-up       ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        ││
│ │ System Health│ │ Pending      │ │ Critical     │        ││
│ │              │ │ Approvals    │ │ Compliance Violations     │        ││
│ │ 🟢 Excellent │ │ 15           │ │ 5            │        ││
│ │              │ │              │ │              │        ││
│ │ [Full layout same as Scenario 1]                        ││
│ └──────────────┘ └──────────────┘ └──────────────┘        ││
│                                                             │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        ││
│ │ Enforcement  │ │ Follow-up    │ │ Audit Trail  │        ││
│ │ [Same as Scenario 1]                                    ││
│ └──────────────┘ └──────────────┘ └──────────────┘        ││
└─────────────────────────────────────────────────────────────┘
```

---

## Compliance Tab

```
┌─────────────────────────────────────────────────────────────┐
│ Home > Dashboard                                             │
│                                                             │
│ Governance Overview              [Date Range ▼] [Refresh]   │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ [Overview] [Compliance (12)] [Enforcement] [Modules]     ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Quick Actions                                            ││
│ │ [Alert Selected] [Assign Follow-up] [Create Enforcement]││
│ │ [Export] [Filters ▼]                                    ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Critical Medicine Compliance (12 companies) [Collapse]  ││
│ │                                                          ││
│ │ ☑ Company ABC Pharma          [Extreme] 🔴              ││
│ │   • 5 critical SKUs below threshold                     ││
│ │   • 2 weeks non-compliance                              ││
│ │   • WSL: Overdue  • MSQ: Overdue                        ││
│ │   Status: Not Alerted                                   ││
│ │   Enforcement: 2 warnings (critical med violations)     ││
│ │   [Alert] [Assign Follow-up] [Create Enforcement]       ││
│ │   [View Details]                                        ││
│ │                                                          ││
│ │ ☐ Company XYZ Corp            [Extreme] 🔴              ││
│ │   • 3 critical SKUs below threshold                     ││
│ │   • 1 week non-compliance                               ││
│ │   • WSL: Overdue                                        ││
│ │   Status: Alerted  Follow-up: Tier 1 Required          ││
│ │   Enforcement: 1 warning pending approval               ││
│ │   [Escalate] [Create Enforcement] [View Details]        ││
│ │                                                          ││
│ │ [Load More] [Select All] [Bulk Actions ▼]              ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Unsubmitted Companies (80 companies)        [Collapse]  ││
│ │                                                          ││
│ │ [Filter: All | Extreme | Normal] [Sort: Priority ▼]    ││
│ │                                                          ││
│ │ ☑ Company ABC Pharma          [Extreme] 🔴              ││
│ │   • WSL: 2 weeks overdue  • Critical medicines: 5       ││
│ │   • MSQ: 1 month overdue  • Repeated offender           ││
│ │   Status: Not Alerted                                   ││
│ │   Enforcement: 2 warnings, 0 fines                      ││
│ │   [Alert] [Assign Follow-up] [Create Enforcement]       ││
│ │   [View Details]                                        ││
│ │                                                          ││
│ │ ☐ Company DEF Ltd            [Normal] 🟡                ││
│ │   • WSL: 3 days overdue                                 ││
│ │   Status: Not Alerted                                   ││
│ │   Enforcement: 0 warnings, 0 fines                      ││
│ │   [Alert] [Assign Follow-up] [View Details]             ││
│ │                                                          ││
│ │ [Load More] [Select All] [Bulk Actions ▼]              ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ CMC Low Scores (8 companies)                [Collapse]  ││
│ │                                                          ││
│ │ ┌─────────────────────────────────────────────────────┐ ││
│ │ │ Company ABC (Lowest)                                │ ││
│ │ │                                                      │ ││
│ │ │ Score: 45%  Threshold: 60%                          │ ││
│ │ │                                                      │ ││
│ │ │      A                                               │ ││
│ │ │      │                                               │ ││
│ │ │   E─┼─B    Spider Graph                            │ ││
│ │ │    ╱│╲     (5 Factors)                             │ ││
│ │ │   D─┼─C                                             │ ││
│ │ │                                                      │ ││
│ │ │ A: Regulatory Compliance (60%)                      │ ││
│ │ │ B: Threshold Violations (30%)                       │ ││
│ │ │ C: Critical Medicine (45%)                          │ ││
│ │ │ D: Non-Compliance Exposure (40%)                    │ ││
│ │ │ E: Data Quality (55%)                               │ ││
│ │ │                                                      │ ││
│ │ │ Breached: Submission, Timeliness                    │ ││
│ │ │                                                      │ ││
│ │ │ [View Details] [Action]                             │ ││
│ │ └─────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ Other Critical:                                          ││
│ │ • Company XYZ - Score: 48%  [View] [Switch Graph]      ││
│ │ • Company DEF - Score: 52%  [View] [Switch Graph]      ││
│ │                                                          ││
│ │ [View All Companies →]                                  ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ **Note:** Deletion requests may be visible in compliance context for companies/products/SKUs with compliance issues. Deletion requests are tracked separately from compliance violations.
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Enforcement Tab

```
┌─────────────────────────────────────────────────────────────┐
│ Home > Dashboard                                             │
│                                                             │
│ Governance Overview              [Date Range ▼] [Refresh]   │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ [Overview] [Compliance] [Enforcement (4)] [Modules]      ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Quick Actions                                            ││
│ │ [Create Enforcement] [Approve Pending] [Export]         ││
│ │ [Filters ▼]                                             ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        ││
│ │ This Month   │ │ Pending      │ │ Recent       │        ││
│ │              │ │ Approvals    │ │ Executions   │        ││
│ │ Warnings: 3  │ │ 2 Actions    │ │ 5 Actions    │        ││
│ │ Fines: 1     │ │              │ │              │        ││
│ │ Suspensions:0│ │ • Fine -     │ │ • Warning -  │        ││
│ │              │ │   Company ABC│ │   Company XYZ│        ││
│ │ Total: 4     │ │   50,000 MAD │ │   Executed   │        ││
│ │              │ │   [Review]   │ │   2 days ago │        ││
│ │              │ │              │ │              │        ││
│ │              │ │ • Warning -  │ │ [View All →]│        ││
│ │              │ │   Company DEF│ │              │        ││
│ │              │ │   [Review]   │ │              │        ││
│ └──────────────┘ └──────────────┘ └──────────────┘        ││
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Enforcement Actions List                    [Collapse]  ││
│ │                                                          ││
│ │ [Filter: All | Warnings | Fines | Suspensions]         ││
│ │ [Status: All | Pending | Approved | Executed]           ││
│ │                                                          ││
│ │ ⚠️ Warning - Company XYZ                                ││
│ │   Violation: Submission Non-Compliance                  ││
│ │   Status: Executed  Date: 2 days ago                    ││
│ │   Created by: Officer A  Approved by: Tier 1 Admin     ││
│ │   [View Details] [View Company]                         ││
│ │                                                          ││
│ │ 💰 Fine - Company ABC                                   ││
│ │   Violation: Critical Medicine Non-Compliance           ││
│ │   Amount: 50,000 MAD                                    ││
│ │   Status: Pending Approval  Date: 5 days ago           ││
│ │   Created by: Officer B                                 ││
│ │   [Review & Approve] [View Details]                     ││
│ │                                                          ││
│ │ [Load More] [Export List]                               ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ **Note:** Deletion requests may appear in enforcement context if deletion is related to enforcement actions. Deletion workflow follows registry submission workflow, not enforcement workflow.
│                                                             │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        ││
│ │ Follow-up    │ │ Appeals      │ │ Audit Trail  │        ││
│ │ Tracking     │ │              │ │ Verification │        ││
│ │              │ │ Active: 2    │ │              │        ││
│ │ Active: 65   │ │              │ │ ✅ All Actions│        ││
│ │              │ │ • Appeal -   │ │    Logged     │        ││
│ │ • Company ABC│ │   Company XYZ│ │              │        ││
│ │   Officer A  │ │   Fine       │ │ Enforcement  │        ││
│ │   Due: Today │ │   Submitted  │ │ Actions: 4   │        ││
│ │   [View]     │ │   [Review]   │ │              │        ││
│ │              │ │              │ │ [View Logs →]│        ││
│ │ [View All →]│ │ [View All →]│ │              │        ││
│ └──────────────┘ └──────────────┘ └──────────────┘        ││
└─────────────────────────────────────────────────────────────┘
```

---

## Modules Tab

```
┌─────────────────────────────────────────────────────────────┐
│ Home > Dashboard                                             │
│                                                             │
│ Governance Overview              [Date Range ▼] [Refresh]   │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ [Overview] [Compliance] [Enforcement] [Modules] [Reports]││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌──────────────────────┐ ┌──────────────────────┐          ││
│ │ RMM Issues           │ │ VCI - SKUs           │          ││
│ │                      │ │                      │          ││
│ │ 12 Issues            │ │ Action Required: 8   │          ││
│ │                      │ │ Under Monitor: 15    │          ││
│ │ • Company Reg.       │ │                      │          ││
│ │   Incomplete: 5      │ │ • SKU ABC-123        │          ││
│ │                      │ │   Company XYZ        │          ││
│ │ • Product Data       │ │   Breach: 5 days     │          ││
│ │   Quality: 4         │ │   [View] [Action]    │          ││
│ │                      │ │                      │          ││
│ │ • User Account       │ │ • SKU DEF-456        │          ││
│ │   Issues: 3          │ │   Company ABC        │          ││
│ │                      │ │   Near threshold     │          ││
│ │ [View All →]        │ │   [View] [Monitor]   │          ││
│ │                      │ │                      │          ││
│ │                      │ │ [View All →]        │          ││
│ └──────────────────────┘ └──────────────────────┘          ││
│                                                             │
│ ┌──────────────────────┐ ┌──────────────────────┐          ││
│ │ ECS - Export Requests│ │ CMC - Low Scores     │          ││
│ │ (If Active)          │ │ (If Active)          │          ││
│ │                      │ │                      │          ││
│ │ Pending: 4           │ │ Critical: 8          │          ││
│ │                      │ │ Monitoring: 12       │          ││
│ │ • Request #001       │ │                      │          ││
│ │   Company ABC        │ │ • Company ABC        │          ││
│ │   High Priority      │ │   Score: 45%         │          ││
│ │                      │ │   [View] [Action]    │          ││
│ │ • Request #002       │ │                      │          ││
│ │   Company XYZ        │ │ • Company XYZ        │          ││
│ │   Medium             │ │   Score: 48%         │          ││
│ │                      │ │   [View] [Monitor]   │          ││
│ │ Recently Approved: 3 │ │                      │          ││
│ │                      │ │ [View All →]        │          ││
│ │ [View All →]        │ │                      │          ││
│ └──────────────────────┘ └──────────────────────┘          ││
└─────────────────────────────────────────────────────────────┘
```

---

## Reports Tab

```
┌─────────────────────────────────────────────────────────────┐
│ Home > Dashboard                                             │
│                                                             │
│ Governance Overview              [Date Range ▼] [Refresh]   │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ [Overview] [Compliance] [Enforcement] [Modules] [Reports]││
│ └─────────────────────────────────────────────────────────┘│
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
│ │ │ Active Compliance Violations: 23                                  │ ││
│ │ │ Critical: 5 (🔴)  High: 8 (🟠)  Medium: 10 (🟡)    │ ││
│ │ │ [Breach Trend Chart]                                │ ││
│ │ └─────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ Action Recommendations                                   ││
│ │ ┌─────────────────────────────────────────────────────┐ ││
│ │ │ • Review critical compliance violations (5 items)                │ ││
│ │ │ • Update threshold for Product D                     │ ││
│ │ │ • Contact Company XYZ regarding submission           │ ││
│ │ └─────────────────────────────────────────────────────┘ ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌──────────────────────┐ ┌──────────────────────┐          ││
│ │ Quick Links          │ │ Recent Reports       │          ││
│ │                      │ │                      │          ││
│ │ • Treemap            │ │ • Compliance Report  │          ││
│ │ • Analytics          │ │   2025-01-01         │          ││
│ │ • Reports            │ │   [Download]         │          ││
│ │ • Threshold Mgmt     │ │                      │          ││
│ │                      │ │ • Activity Report    │          ││
│ │                      │ │   2024-12-31         │          ││
│ │                      │ │   [Download]         │          ││
│ │                      │ │                      │          ││
│ │                      │ │ [View All →]        │          ││
│ └──────────────────────┘ └──────────────────────┘          ││
└─────────────────────────────────────────────────────────────┘
```

---

## Modal Designs

### 1. Alert Company Modal

```
┌─────────────────────────────────────────────────────────────┐
│ [Backdrop: rgba(0,0,0,0.5)]                                 │
│                                                             │
│     ┌───────────────────────────────────────────────────┐  │
│     │ Alert Company                                  [×]│  │
│     ├───────────────────────────────────────────────────┤  │
│     │                                                   │  │
│     │ Company: ABC Pharma (Read-only)                  │  │
│     │                                                   │  │
│     │ Message Template:                                │  │
│     │ ┌───────────────────────────────────────────────┐│  │
│     │ │ [Submission Overdue ▼]                        ││  │
│     │ └───────────────────────────────────────────────┘│  │
│     │                                                   │  │
│     │ Message:                                          │  │
│     │ ┌───────────────────────────────────────────────┐│  │
│     │ │ Dear ABC Pharma,                              ││  │
│     │ │                                                ││  │
│     │ │ Your WSL submission for Week 3 is overdue.    ││  │
│     │ │ Please submit immediately to avoid penalties. ││  │
│     │ │                                                ││  │
│     │ │ Regards,                                       ││  │
│     │ │ MOH Governance Team                            ││  │
│     │ └───────────────────────────────────────────────┘│  │
│     │                                                   │  │
│     │ ☑ Send email notification                        │  │
│     │ ☑ Send SMS notification                          │  │
│     │ ☑ Create audit log entry                         │  │
│     │                                                   │  │
│     │ Preview:                                          │  │
│     │ ┌───────────────────────────────────────────────┐│  │
│     │ │ [Email preview with formatting]               ││  │
│     │ └───────────────────────────────────────────────┘│  │
│     │                                                   │  │
│     │                      [Cancel]  [Send Alert]      │  │
│     └───────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2. Assign Follow-up Modal

```
┌─────────────────────────────────────────────────────────────┐
│ [Backdrop: rgba(0,0,0,0.5)]                                 │
│                                                             │
│     ┌───────────────────────────────────────────────────┐  │
│     │ Assign Follow-up                               [×]│  │
│     ├───────────────────────────────────────────────────┤  │
│     │                                                   │  │
│     │ Company: ABC Pharma (Read-only)                  │  │
│     │ Issue: WSL submission overdue (2 weeks)          │  │
│     │                                                   │  │
│     │ Assign to:                                        │  │
│     │ ┌───────────────────────────────────────────────┐│  │
│     │ │ [Officer A (Tier 1) ▼]                        ││  │
│     │ └───────────────────────────────────────────────┘│  │
│     │                                                   │  │
│     │ Priority:                                         │  │
│     │ ┌───────────────────────────────────────────────┐│  │
│     │ │ [Extreme ▼]                                    ││  │
│     │ └───────────────────────────────────────────────┘│  │
│     │                                                   │  │
│     │ Due Date:                                         │  │
│     │ ┌───────────────────────────────────────────────┐│  │
│     │ │ [2025-01-08 📅]  (1 business day)             ││  │
│     │ └───────────────────────────────────────────────┘│  │
│     │                                                   │  │
│     │ Notes (Optional):                                 │  │
│     │ ┌───────────────────────────────────────────────┐│  │
│     │ │ Repeated offender. 5 critical medicines       ││  │
│     │ │ affected. Requires immediate attention.       ││  │
│     │ └───────────────────────────────────────────────┘│  │
│     │                                                   │  │
│     │ ☑ Notify assigned officer                        │  │
│     │ ☑ Create audit log entry                         │  │
│     │                                                   │  │
│     │                      [Cancel]  [Assign Follow-up]│  │
│     └───────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3. Schedule Emergency Meeting Modal

```
┌─────────────────────────────────────────────────────────────┐
│ [Backdrop: rgba(0,0,0,0.5)]                                 │
│                                                             │
│     ┌───────────────────────────────────────────────────┐  │
│     │ Schedule Emergency Meeting                     [×]│  │
│     ├───────────────────────────────────────────────────┤  │
│     │                                                   │  │
│     │ Reason: Submission Compliance Below Threshold    │  │
│     │ %SC: 68%  Threshold: 75%                         │  │
│     │                                                   │  │
│     │ Meeting Date & Time:                              │  │
│     │ ┌───────────────────────────────────────────────┐│  │
│     │ │ [2025-01-07 📅]  [10:00 AM 🕐]               ││  │
│     │ └───────────────────────────────────────────────┘│  │
│     │                                                   │  │
│     │ Attendees:                                        │  │
│     │ ☑ MOH Tier 1 Team (5 members)                    │  │
│     │ ☑ MOH Tier 2 Team (12 members)                   │  │
│     │ ☐ External Stakeholders                          │  │
│     │                                                   │  │
│     │ Location:                                         │  │
│     │ ┌───────────────────────────────────────────────┐│  │
│     │ │ [MOH Conference Room A ▼]                     ││  │
│     │ └───────────────────────────────────────────────┘│  │
│     │                                                   │  │
│     │ Agenda:                                           │  │
│     │ ┌───────────────────────────────────────────────┐│  │
│     │ │ 1. Review %SC status and unsubmitted companies││  │
│     │ │ 2. Discuss immediate actions                  ││  │
│     │ │ 3. Assign follow-up responsibilities          ││  │
│     │ │ 4. Set timeline for resolution                ││  │
│     │ └───────────────────────────────────────────────┘│  │
│     │                                                   │  │
│     │ ☑ Send calendar invites                          │  │
│     │ ☑ Create audit log entry                         │  │
│     │                                                   │  │
│     │                [Cancel]  [Schedule Meeting]      │  │
│     └───────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4. Quick Preview Slide-over Panel

```
┌─────────────────────────────────────────────────────────────┐
│ [Main Dashboard Content]                 [Slide-over Panel]│
│                                          ┌─────────────────┐│
│                                          │ Company ABC     │││
│                                          │ Pharma      [×]│││
│                                          ├─────────────────┤││
│                                          │                 │││
│                                          │ Status: 🔴      │││
│                                          │ Critical        │││
│                                          │                 │││
│                                          │ Recent Activity:│││
│                                          │ • WSL: 2 weeks  │││
│                                          │   overdue       │││
│                                          │ • MSQ: 1 month  │││
│                                          │   overdue       │││
│                                          │                 │││
│                                          │ Enforcement:    │││
│                                          │ • 2 Warnings    │││
│                                          │ • 0 Fines       │││
│                                          │                 │││
│                                          │ CMC Score: 45%  │││
│                                          │ Threshold: 60%  │││
│                                          │                 │││
│                                          │ Critical Meds:  │││
│                                          │ • 5 SKUs below  │││
│                                          │   threshold     │││
│                                          │                 │││
│                                          │ Quick Actions:  │││
│                                          │ [Alert]         │││
│                                          │ [Follow-up]     │││
│                                          │ [Enforcement]   │││
│                                          │                 │││
│                                          │ [Full View →]  │││
│                                          └─────────────────┘││
└─────────────────────────────────────────────────────────────┘
```

### 5. Bulk Actions Modal

```
┌─────────────────────────────────────────────────────────────┐
│ [Backdrop: rgba(0,0,0,0.5)]                                 │
│                                                             │
│     ┌───────────────────────────────────────────────────┐  │
│     │ Bulk Actions                                   [×]│  │
│     ├───────────────────────────────────────────────────┤  │
│     │                                                   │  │
│     │ Selected: 5 companies                             │  │
│     │ • Company ABC Pharma                              │  │
│     │ • Company XYZ Corp                                │  │
│     │ • Company DEF Ltd                                 │  │
│     │ • Company GHI Inc                                 │  │
│     │ • Company JKL Co                                  │  │
│     │                                                   │  │
│     │ Action:                                           │  │
│     │ ┌───────────────────────────────────────────────┐│  │
│     │ │ [Alert All ▼]                                  ││  │
│     │ └───────────────────────────────────────────────┘│  │
│     │                                                   │  │
│     │ Options:                                          │  │
│     │ • Alert All: Send notification to all selected   │  │
│     │ • Assign Follow-up: Assign to officer            │  │
│     │ • Export: Download list as CSV/PDF               │  │
│     │                                                   │  │
│     │ ⚠️ This action will affect 5 companies.          │  │
│     │    Are you sure you want to proceed?             │  │
│     │                                                   │  │
│     │                      [Cancel]  [Execute Action]  │  │
│     └───────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 6. Approve Deletion Request Modal

```
┌─────────────────────────────────────────────────────────────┐
│ [Backdrop: rgba(0,0,0,0.5)]                                 │
│                                                             │
│     ┌───────────────────────────────────────────────────┐  │
│     │ Approve Deletion Request                      [×]│  │
│     ├───────────────────────────────────────────────────┤  │
│     │                                                   │  │
│     │ ⚠️ WARNING: This action will delete an entity    │  │
│     │                                                   │  │
│     │ Entity Type: Company                             │  │
│     │ Entity Name: ABC Pharma                          │  │
│     │ Entity ID: [Link to company detail]              │  │
│     │                                                   │  │
│     │ Deletion Request Details:                         │  │
│     │ • Requested by: Officer A (Tier 2 Officer)      │  │
│     │ • Requested at: 2025-01-15 10:30 AM             │  │
│     │ • Verified by: Officer B (Tier 2 Officer)       │  │
│     │ • Verified at: 2025-01-15 11:00 AM              │  │
│     │ • Reason: [Deletion reason from submission]      │  │
│     │                                                   │  │
│     │ Cascade Effects:                                  │  │
│     │ ⚠️ This deletion will cascade to:                │  │
│     │   • 5 Products                                    │  │
│     │   • 12 SKUs                                       │  │
│     │   All will be deactivated (soft delete)          │  │
│     │                                                   │  │
│     │ Audit Information:                                │  │
│     │ • All deletion steps will be logged              │  │
│     │ • Old values will be preserved in audit_logs    │  │
│     │ • Retention period: 7 years (Law No. 09-08)      │  │
│     │                                                   │  │
│     │ Approval Comments (Optional):                    │  │
│     │ ┌───────────────────────────────────────────────┐│  │
│     │ │ Approved per regulatory requirements.         ││  │
│     │ │ Command issued to Tier 2 Registrar.          ││  │
│     │ └───────────────────────────────────────────────┘│  │
│     │                                                   │  │
│     │ ☑ I understand this action cannot be undone     │  │
│     │ ☑ I confirm the deletion is authorized          │  │
│     │                                                   │  │
│     │                      [Cancel]  [Approve & Issue Command]│  │
│     └───────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Component Specifications:**
- **Warning Section:** Red border, warning icon, prominent display
- **Cascade Effects:** Show all entities that will be affected
- **Audit Information:** Emphasize audit trail and retention
- **Confirmation Checkboxes:** Required before approval
- **Action Button:** "Approve & Issue Command" (green, primary)

---

## Component Specifications

### Tab Component
- **Active Tab:** Underline (3px, primary-500), bold text
- **Inactive Tab:** Normal text, hover: bg-secondary
- **Badge:** Count in parentheses, e.g., "Compliance (12)"
- **Spacing:** 24px between tabs
- **Height:** 48px
- **Keyboard:** Arrow keys to navigate, Enter to select

### Quick Actions Bar
- **Position:** Sticky below tabs
- **Background:** White with subtle shadow
- **Buttons:** Primary, secondary, and ghost variants
- **Spacing:** 12px between buttons
- **Height:** 56px
- **Mobile:** Horizontal scroll

### Modal Overlay
- **Background:** rgba(0, 0, 0, 0.5)
- **Blur:** backdrop-filter: blur(4px)
- **Animation:** Fade in 200ms
- **Click Outside:** Close modal
- **Escape Key:** Close modal

### Modal Container
- **Width:** 600px (max-width: 90vw)
- **Max Height:** 80vh
- **Background:** White
- **Border Radius:** 12px
- **Shadow:** Large elevation shadow
- **Animation:** Slide up + fade in 200ms
- **Padding:** 24px

### Slide-over Panel
- **Width:** 400px (max-width: 90vw)
- **Position:** Fixed right, full height
- **Background:** White
- **Shadow:** Large elevation shadow
- **Animation:** Slide in from right 300ms
- **Overlay:** Semi-transparent backdrop

### Collapsible Sections
- **Collapsed Height:** 64px (summary only)
- **Expanded Height:** Auto
- **Animation:** Smooth expand/collapse 200ms
- **Icon:** Chevron (rotate 180° when expanded)
- **Header:** Sticky when scrolling

### Regulatory Compliance Metrics Widget (Fatima's Requirement)
- **Layout:** Full-width card section
- **Title:** "Regulatory Compliance Metrics"
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

### Pending Approvals Widget (Enhanced for Deletion Workflow)
- **Layout:** Card widget
- **Content:** List of pending approvals (including deletion requests)
- **Each Approval Item Shows:**
  - **Legal Basis Verification Status (Fatima's Requirement):** "✓ Verified" or "⚠️ Needs Verification"
  - **Regulatory Deadline Countdown (Fatima's Requirement):** "⚠️ [X]d deadline" indicator
  - **Regulatory Requirement Checklist Status (Fatima's Requirement):** "✓ Complete" or "⚠️ Incomplete"
- **Deletion-Specific Approval Items (NEW):**
  - **Format:** "Company Deletion Request - [Company Name]" or "Product Deletion Request - [Product Name]" or "SKU Deletion Request - [SKU Code]"
  - **Status Badge:** "Awaiting Tier 1 Approval"
  - **Entity Information:**
    - Entity Type: Company/Product/SKU (badge)
    - Entity Name/Code: Display name or code
    - Entity ID: Link to entity detail page
  - **Workflow Information:**
    - Requested by: Tier 2 Officer name
    - Requested at: Timestamp
    - Verified by: Tier 2 Officer name (if verified)
    - Verified at: Timestamp (if verified)
  - **Regulatory Deadline:** Show if applicable (⚠️ [X]d deadline)
  - **Action Buttons:**
    - "[Approve & Issue Command]" - Primary button (green)
    - "[Reject]" - Secondary button (red)
    - "[View Details]" - Tertiary button (opens submission detail modal/page)
  - **Visual Distinction:** 
    - Deletion requests shown with ⚠️ warning icon
    - Red border or background tint to indicate critical action
    - "Deletion Request" badge in addition to entity type badge
- **Filtering:**
  - Filter by submission type: All, Create, Update, **Delete** (NEW)
  - Filter by entity type: All, Company, Product, SKU
  - Sort by: Priority (deletion requests first), Date, Entity Type
- **Priority Indicators:**
  - Deletion requests shown first (highest priority)
  - Regulatory deadline urgency indicators (🔴 <3 days, 🟡 3-7 days)
- **Priority:** Sort by regulatory deadline urgency (deadline-critical first)

### Module Activation Status Widget (Fatima's Requirement)
- **Layout:** Card widget in Modules tab or Overview
- **Content:** Status of each module (ECS, CMC)
- **Each Module Shows:**
  - **Status:** Active/Inactive
  - **Regulatory Authorization (Fatima's Requirement):** "✓ Authorized per [Regulation Article]" or "⚠️ Verify Authorization"
  - **Regulatory Basis:** "DMP Art. X" or relevant regulation
- **Link:** "[View Config]" to system configuration page

### Pending Threshold Reversions Widget
- **Layout:** Card widget (same size as other dashboard widgets)
- **Title:** "Pending Threshold Reversions"
- **Content:**
  - **Count:** Total number of thresholds pending reversion (e.g., "8 Pending")
  - **Breakdown:**
    - Auto-Revert count with days until reversion (e.g., "5 Auto Revert (7 days)")
    - Manual Review count with days until reversion (e.g., "3 Manual Review (2 days)")
  - **List Items:** Top 3-5 pending reversions with:
    - SKU code or product name
    - Revert date (DD/MM/YY format)
    - Days until reversion
    - Duration type (Auto-Revert or Manual Review)
    - **Regulatory Basis (Fatima's Requirement):** "DMP Art. X - Threshold Reversion"
    - Quick action link (Review, Confirm)
- **Action Button:** "Review All →" (links to pending reversions list page)
- **Color Coding:**
  - Green: >30 days until reversion
  - Yellow: 7-30 days until reversion
  - Red: <7 days until reversion
- **Priority Indicators:**
  - Manual Review items shown first (higher priority)
  - Items sorted by revert_date (earliest first)
- **Purpose:** Provide quick overview of thresholds requiring attention

---

## Interactions

### Tab Navigation
- **Click tab** → Switch to tab content, update URL (?tab=compliance)
- **Arrow keys** → Navigate between tabs
- **Enter key** → Activate selected tab
- **Badge count** → Real-time update

### Quick Actions
- **Alert All** → Open bulk actions modal
- **Bulk Follow-up** → Open assign follow-up modal with multiple companies
- **Export** → Download filtered data as CSV/PDF
- **Filters** → Open filter dropdown

### Modal Actions
- **Alert Company:**
  - Select template → Auto-fill message
  - Edit message → Enable send button
  - Send Alert → Close modal, show success toast, update company status
  - Cancel → Close modal, no changes

- **Assign Follow-up:**
  - Select officer → Show officer details
  - Select priority → Adjust due date
  - Assign → Close modal, show success toast, create follow-up record
  - Cancel → Close modal, no changes

- **Schedule Meeting:**
  - Select date/time → Validate availability
  - Schedule → Close modal, send invites, show success toast
  - Cancel → Close modal, no changes

### Slide-over Panel
- **Hover company name** → Show preview icon
- **Click preview icon** → Open slide-over panel
- **Click Full View** → Navigate to company detail page
- **Click X or outside** → Close panel

### Collapsible Sections
- **Click header** → Toggle expand/collapse
- **Click Collapse button** → Collapse section
- **Click Expand button** → Expand section
- **Preference** → Save to localStorage

---

## Responsive Behavior

### Desktop (1024px+)
- **Tabs:** Horizontal, full width
- **Quick Actions:** Horizontal, all visible
- **Cards:** 3-column grid
- **Modals:** 600px width, centered
- **Slide-over:** 400px width, right-aligned

### Tablet (768px - 1023px)
- **Tabs:** Horizontal scroll if needed
- **Quick Actions:** Horizontal scroll
- **Cards:** 2-column grid
- **Modals:** 90vw width, centered
- **Slide-over:** 90vw width, full overlay

### Mobile (<768px)
- **Tabs:** Horizontal scroll
- **Quick Actions:** Horizontal scroll
- **Cards:** 1-column stack
- **Modals:** Full screen
- **Slide-over:** Full screen

---

## Design System References

### Components Used
- **Tab Component:** shadcn/ui tabs
- **Modal Component:** shadcn/ui dialog
- **Slide-over Component:** shadcn/ui sheet
- **Button Component:** shadcn/ui button
- **Card Component:** shadcn/ui card
- **Badge Component:** shadcn/ui badge
- **Form Components:** shadcn/ui form, input, select, textarea
- **Checkbox Component:** shadcn/ui checkbox

### Design Inspiration
- **Stripe Dashboard:** Tab navigation, modal patterns
- **GitHub:** Quick actions bar, slide-over panels
- **Linear:** Clean tabs, smooth animations
- **shadcn/ui:** Component patterns, accessibility

### Colors (From Design System)
- **Tab Active:** #3b82f6 (primary-500)
- **Tab Inactive:** #6b7280 (text-secondary)
- **Modal Overlay:** rgba(0, 0, 0, 0.5)
- **Modal Background:** #ffffff (white)
- **Quick Actions Bar:** #ffffff (white)
- **Shadow:** rgba(0, 0, 0, 0.1)

### Typography
- **Tab Text:** 14px, font-weight: 600 (active), 500 (inactive)
- **Modal Title:** 20px, font-weight: 600
- **Modal Body:** 14px, font-weight: 400
- **Button Text:** 14px, font-weight: 500

### Spacing (8px Grid)
- **Tab Padding:** 16px horizontal, 12px vertical
- **Tab Gap:** 24px
- **Modal Padding:** 24px
- **Quick Actions Padding:** 16px
- **Card Gap:** 24px (desktop), 16px (mobile)

### Transitions & Animations
- **Tab Switch:** 200ms ease-in-out
- **Modal Open:** 200ms ease-out (fade + slide up)
- **Modal Close:** 150ms ease-in (fade + slide down)
- **Slide-over Open:** 300ms ease-out (slide from right)
- **Slide-over Close:** 250ms ease-in (slide to right)
- **Collapse/Expand:** 200ms ease-in-out

### Accessibility (WCAG 2.1 AA)
- **Tab Navigation:** Keyboard accessible (Arrow keys, Enter)
- **Modal Focus:** Trap focus within modal, focus first input
- **Modal Close:** Escape key, click outside
- **Screen Readers:** ARIA labels, roles, descriptions
- **Color Contrast:** Minimum 4.5:1 for text
- **Touch Targets:** Minimum 40px × 40px

---

## Performance Optimizations

### Lazy Loading
- **Tab Content:** Load on first visit, cache in memory
- **Modal Content:** Load on open
- **Slide-over Content:** Load on demand

### Data Fetching
- **Overview Tab:** Fetch on page load
- **Other Tabs:** Fetch on first visit
- **Real-time Updates:** WebSocket or polling (30s interval)

### Caching
- **Tab State:** localStorage (active tab, collapsed sections)
- **Filter State:** localStorage (applied filters)
- **Dashboard Data:** Memory cache with TTL (5 minutes)

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/dashboard?tab=overview`
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - MOH Tier 1 role
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Tab, Modal, Card components
- [Design System](../../../../02-architecture/frontend/design-system.md) - Colors, typography, spacing
- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md) - Modal forms
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference including DMP regulations
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - Detailed compliance requirements
- [Regulatory Policies](../../../../03-governance/regulatory-policies.md) - Regulatory policies and guidelines

---

**Last Updated:** 2025-01-06  
**Status:** 🟢 Updated with Tabbed Layout & Modal Designs  
**Design Approach:** Modern enterprise dashboard with tabs, modals, and priority-based organization (Stripe/GitHub/Linear/shadcn/ui inspired)
