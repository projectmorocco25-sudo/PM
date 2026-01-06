# Task 0.5.1.20: MOH Tier 2 Dashboard Wireframe

**Status:** 🟡 In Progress  
**Route:** `/dashboard` (MOH Tier 2 role)  
**File:** `task-0.5.1.20-moh-tier2-dashboard.png`  
**Priority:** 🔴 Critical Foundation

**Design Approach:** Modern enterprise dashboard with tabbed navigation, modal-based verification actions, and workflow-optimized card organization. Inspired by Stripe, GitHub, Linear, and shadcn/ui best practices.

---

## Overview

This dashboard uses a **tabbed interface** to organize content by workflow (Overview, Verification, Follow-ups, Analysis), **modals** for verification actions to maintain context, and **priority-based card layouts** optimized for Tier 2 verification and oversight workflows.

### Key Improvements
- **Tabs:** Organize content into Overview, Verification, Follow-ups, Analysis
- **Modals:** Verification actions (Verify, Flag, Request Info) without navigation
- **Card Consolidation:** Combined verification queues with smart filters
- **Sticky Header:** Quick actions always accessible
- **Workflow Focus:** Optimized for verification and follow-up tasks

---

## Wireframe Layout - Overview Tab (Default)

### Scenario 1: %SC Unaddressed (Emergency State)

```
┌─────────────────────────────────────────────────────────────┐
│ Home > Dashboard                                             │
│                                                             │
│ Verification Overview            [Filters ▼] [Sort ▼]        │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ [Overview] [Verification] [Follow-ups] [Analysis]        ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Quick Actions                                            ││
│ │ [Verify Selected] [Flag Selected] [Request Info]        ││
│ │ [Export] [Filters ▼]                                    ││
│ └─────────────────────────────────────────────────────────┘│
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
│ │    [View Follow-up Queue →]                              ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        ││
│ │ Pending      │ │ Oversight    │ │ Review Queue │        ││
│ │ Verifications│ │ Metrics      │ │              │        ││
│ │              │ │              │ │              │        ││
│ │ 8            │ │ Verification │ │ • Submission │        ││
│ │              │ │ Rate: 95%    │ │   #12345     │        ││
│ │ Recent:      │ │              │ │   Company ABC│        ││
│ │ • Submission │ │ Avg. Time:   │ │   High       │        ││
│ │   #12345     │ │   2.5 hours  │ │   [Verify]   │        ││
│ │   Company ABC│ │              │ │              │        ││
│ │   High       │ │ Trend: ↗ +2% │ │ • Submission │        ││
│ │   1h ago     │ │              │ │   #12346     │        ││
│ │              │ │ [Details →] │ │   Company XYZ│        ││
│ │ • Submission │ │              │ │   Medium     │        ││
│ │   #12346     │ │              │ │   [Verify]   │        ││
│ │   Company XYZ│ │              │ │              │        ││
│ │   Medium     │ │              │ │ [View All →]│        ││
│ │   2h ago     │ │              │ │              │        ││
│ │              │ │              │ │              │        ││
│ │ [View All →]│ │              │ │              │        ││
│ └──────────────┘ └──────────────┘ └──────────────┘        ││
└─────────────────────────────────────────────────────────────┘
```

### Scenario 2: %SC Addressed (Normal State)

```
┌─────────────────────────────────────────────────────────────┐
│ Home > Dashboard                                             │
│                                                             │
│ Verification Overview            [Filters ▼] [Sort ▼]        │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ [Overview] [Verification (8)] [Follow-ups] [Analysis]    ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Quick Actions                                            ││
│ │ [Verify Selected] [Flag Selected] [Request Info]        ││
│ │ [Export] [Filters ▼]                                    ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Submission Compliance (%SC) - Collapsed       [Expand]  ││
│ │ %SC: 82%  🟢 Above Threshold (75%)                       ││
│ │ ✅ All Actions Taken: 80 alerted, 65 in follow-up       ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        ││
│ │ Pending      │ │ Oversight    │ │ Review Queue │        ││
│ │ Verifications│ │ Metrics      │ │              │        ││
│ │              │ │              │ │              │        ││
│ │ [Same as Scenario 1]                                    ││
│ └──────────────┘ └──────────────┘ └──────────────┘        ││
└─────────────────────────────────────────────────────────────┘
```

---

## Verification Tab

```
┌─────────────────────────────────────────────────────────────┐
│ Home > Dashboard                                             │
│                                                             │
│ Verification Overview            [Filters ▼] [Sort ▼]        │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ [Overview] [Verification (8)] [Follow-ups] [Analysis]    ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Quick Actions                                            ││
│ │ [Verify Selected] [Flag Selected] [Request Info]        ││
│ │ [Approve All] [Export] [Filters ▼]                      ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Verification Queue (8 items)                [Collapse]  ││
│ │                                                          ││
│ │ [Filter: All | High | Medium | Low]                     ││
│ │ [Sort: Priority ▼ | Date | Company]                     ││
│ │                                                          ││
│ │ ☑ Submission #12345  Company ABC  [High Priority] 🔴   ││
│ │   Product: XYZ  Submitted: 2 hours ago                  ││
│ │   Type: WSL  Status: Pending Verification               ││
│ │   [Verify] [Flag] [Request Info] [View Details]         ││
│ │                                                          ││
│ │ ☐ Submission #12346  Company XYZ  [Medium Priority] 🟡 ││
│ │   Product: DEF  Submitted: 3 hours ago                  ││
│ │   Type: MSQ  Status: Pending Verification               ││
│ │   [Verify] [Flag] [Request Info] [View Details]         ││
│ │                                                          ││
│ │ ☐ Submission #12347  Company DEF  [Low Priority] 🟢    ││
│ │   Product: GHI  Submitted: 5 hours ago                  ││
│ │   Type: AAMS  Status: Pending Verification              ││
│ │   [Verify] [Flag] [Request Info] [View Details]         ││
│ │                                                          ││
│ │ [Load More] [Select All] [Bulk Actions ▼]              ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        ││
│ │ Today's      │ │ This Week    │ │ Performance  │        ││
│ │ Progress     │ │ Progress     │ │ Metrics      │        ││
│ │              │ │              │ │              │        ││
│ │ Verified: 12 │ │ Verified: 45 │ │ Avg. Time:   │        ││
│ │ Pending: 8   │ │ Pending: 23  │ │   2.5 hours  │        ││
│ │ Flagged: 2   │ │ Flagged: 8   │ │              │        ││
│ │              │ │              │ │ Accuracy:    │        ││
│ │ Target: 20   │ │ Target: 100  │ │   98.5%      │        ││
│ │              │ │              │ │              │        ││
│ │ Progress:    │ │ Progress:    │ │ [Details →] │        ││
│ │ ████████░░   │ │ ████████░░   │ │              │        ││
│ │ 60%          │ │ 68%          │ │              │        ││
│ └──────────────┘ └──────────────┘ └──────────────┘        ││
└─────────────────────────────────────────────────────────────┘
```

---

## Follow-ups Tab

```
┌─────────────────────────────────────────────────────────────┐
│ Home > Dashboard                                             │
│                                                             │
│ Verification Overview            [Filters ▼] [Sort ▼]        │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ [Overview] [Verification] [Follow-ups (80)] [Analysis]   ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Quick Actions                                            ││
│ │ [Alert Selected] [Start Follow-up] [Escalate to Tier 1] ││
│ │ [Export] [Filters ▼]                                    ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Follow-up Queue - Unsubmitted Companies (80) [Collapse] ││
│ │                                                          ││
│ │ [Filter: All | Extreme | Normal]                        ││
│ │ [Sort: Priority ▼ | Days Overdue | Company]             ││
│ │                                                          ││
│ │ ☑ Company ABC Pharma          [Extreme] 🔴              ││
│ │   • WSL: 2 weeks overdue  • Critical medicines: 5       ││
│ │   • MSQ: 1 month overdue  • Repeated offender           ││
│ │   Status: Alerted  Follow-up: Tier 1 Required          ││
│ │   Enforcement: 2 warnings, 0 fines                      ││
│ │   [Alert] [Escalate to Tier 1] [Create Enforcement]     ││
│ │   [View Details]                                        ││
│ │                                                          ││
│ │ ☐ Company DEF Ltd            [Normal] 🟡                ││
│ │   • WSL: 3 days overdue                                 ││
│ │   Status: Not Alerted  Follow-up: Tier 2               ││
│ │   Enforcement: 0 warnings, 0 fines                      ││
│ │   [Alert] [Start Follow-up] [View Details]              ││
│ │                                                          ││
│ │ [Load More] [Select All] [Bulk Actions ▼]              ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        ││
│ │ My Active    │ │ Escalated    │ │ Resolved     │        ││
│ │ Follow-ups   │ │ to Tier 1    │ │ This Week    │        ││
│ │              │ │              │ │              │        ││
│ │ Active: 12   │ │ Pending: 5   │ │ Resolved: 18 │        ││
│ │              │ │              │ │              │        ││
│ │ • Company ABC│ │ • Company XYZ│ │ • Company GHI│        ││
│ │   Due: Today │ │   Escalated  │ │   Resolved   │        ││
│ │   [View]     │ │   2 days ago │ │   Yesterday  │        ││
│ │              │ │   [View]     │ │              │        ││
│ │ • Company DEF│ │              │ │ • Company JKL│        ││
│ │   Due: Tomorrow│ │ [View All →]│ │   Resolved   │        ││
│ │   [View]     │ │              │ │   2 days ago │        ││
│ │              │ │              │ │              │        ││
│ │ [View All →]│ │              │ │ [View All →]│        ││
│ └──────────────┘ └──────────────┘ └──────────────┘        ││
└─────────────────────────────────────────────────────────────┘
```

---

## Analysis Tab

```
┌─────────────────────────────────────────────────────────────┐
│ Home > Dashboard                                             │
│                                                             │
│ Verification Overview            [Filters ▼] [Sort ▼]        │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ [Overview] [Verification] [Follow-ups] [Analysis (13)]   ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Quick Actions                                            ││
│ │ [Analyze Selected] [Create Report] [Export]             ││
│ │ [Filters ▼]                                             ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌──────────────────────┐ ┌──────────────────────┐          ││
│ │ VCI - SKUs           │ │ Breach Analysis      │          ││
│ │                      │ │ Queue                │          ││
│ │ Action Required: 8   │ │                      │          ││
│ │ Under Monitor: 15    │ │ 5 Breaches           │          ││
│ │                      │ │                      │          ││
│ │ • SKU ABC-123        │ │ • Breach #001        │          ││
│ │   Company XYZ        │ │   Company ABC        │          ││
│ │   Breach: 5 days     │ │   Critical           │          ││
│ │   [View] [Action]    │ │   3 days old         │          ││
│ │                      │ │   [Analyze]          │          ││
│ │ • SKU DEF-456        │ │                      │          ││
│ │   Company ABC        │ │ • Breach #002        │          ││
│ │   Near threshold     │ │   Company XYZ        │          ││
│ │   [View] [Monitor]   │ │   High               │          ││
│ │                      │ │   2 days old         │          ││
│ │ [View All →]        │ │   [Analyze]          │          ││
│ │                      │ │                      │          ││
│ │                      │ │ [View All →]        │          ││
│ └──────────────────────┘ └──────────────────────┘          ││
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Analysis Reports                            [Collapse]  ││
│ │                                                          ││
│ │ Recent Reports:                                          ││
│ │ • Breach Analysis Report - 2025-01-06  [Download]       ││
│ │ • Verification Performance - 2025-01-05  [Download]     ││
│ │ • Follow-up Effectiveness - 2025-01-04  [Download]      ││
│ │                                                          ││
│ │ [Create New Report] [View All Reports →]                ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Modal Designs

### 1. Verify Submission Modal

```
┌─────────────────────────────────────────────────────────────┐
│ [Backdrop: rgba(0,0,0,0.5)]                                 │
│                                                             │
│     ┌───────────────────────────────────────────────────┐  │
│     │ Verify Submission #12345                       [×]│  │
│     ├───────────────────────────────────────────────────┤  │
│     │                                                   │  │
│     │ Company: ABC Pharma                               │  │
│     │ Product: XYZ                                      │  │
│     │ Type: WSL  Period: Week 3 (Jan 15-21)           │  │
│     │ Submitted: 2 hours ago                            │  │
│     │                                                   │  │
│     │ Submission Preview:                               │  │
│     │ ┌───────────────────────────────────────────────┐│  │
│     │ │ SKU: ABC-123                                  ││  │
│     │ │ Quantity: 1,500 units                         ││  │
│     │ │ Stock Level: 12,000 units                     ││  │
│     │ │ Threshold: 10,000 units                       ││  │
│     │ │ Status: Above Threshold ✓                     ││  │
│     │ │                                                ││  │
│     │ │ [View Full Submission →]                      ││  │
│     │ └───────────────────────────────────────────────┘│  │
│     │                                                   │  │
│     │ Verification Checklist:                           │  │
│     │ ☑ Data completeness verified                     │  │
│     │ ☑ Calculations accurate                          │  │
│     │ ☑ No anomalies detected                          │  │
│     │ ☐ Supporting documents attached                  │  │
│     │                                                   │  │
│     │ Decision:                                         │  │
│     │ ○ Approve                                         │  │
│     │ ○ Reject                                          │  │
│     │ ○ Request More Information                        │  │
│     │                                                   │  │
│     │ Notes (Optional):                                 │  │
│     │ ┌───────────────────────────────────────────────┐│  │
│     │ │                                                ││  │
│     │ └───────────────────────────────────────────────┘│  │
│     │                                                   │  │
│     │                      [Cancel]  [Submit Decision] │  │
│     └───────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2. Flag Submission Modal

```
┌─────────────────────────────────────────────────────────────┐
│ [Backdrop: rgba(0,0,0,0.5)]                                 │
│                                                             │
│     ┌───────────────────────────────────────────────────┐  │
│     │ Flag Submission                                [×]│  │
│     ├───────────────────────────────────────────────────┤  │
│     │                                                   │  │
│     │ Submission: #12345 - Company ABC Pharma          │  │
│     │                                                   │  │
│     │ Reason for Flagging:                              │  │
│     │ ┌───────────────────────────────────────────────┐│  │
│     │ │ [Data Quality Issue ▼]                        ││  │
│     │ └───────────────────────────────────────────────┘│  │
│     │                                                   │  │
│     │ Options:                                          │  │
│     │ • Data Quality Issue                              │  │
│     │ • Missing Information                             │  │
│     │ • Calculation Error                               │  │
│     │ • Suspicious Activity                             │  │
│     │ • Other                                           │  │
│     │                                                   │  │
│     │ Description:                                      │  │
│     │ ┌───────────────────────────────────────────────┐│  │
│     │ │ Stock level calculation appears incorrect.    ││  │
│     │ │ Requires review by senior officer.            ││  │
│     │ └───────────────────────────────────────────────┘│  │
│     │                                                   │  │
│     │ Severity:                                         │  │
│     │ ○ Low  ● Medium  ○ High  ○ Critical              │  │
│     │                                                   │  │
│     │ ☑ Notify company                                  │  │
│     │ ☑ Escalate to senior officer                     │  │
│     │ ☑ Create audit log entry                         │  │
│     │                                                   │  │
│     │                      [Cancel]  [Flag Submission] │  │
│     └───────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3. Request Information Modal

```
┌─────────────────────────────────────────────────────────────┐
│ [Backdrop: rgba(0,0,0,0.5)]                                 │
│                                                             │
│     ┌───────────────────────────────────────────────────┐  │
│     │ Request Additional Information                 [×]│  │
│     ├───────────────────────────────────────────────────┤  │
│     │                                                   │  │
│     │ To: ABC Pharma                                    │  │
│     │ Regarding: Submission #12345 (WSL - Week 3)      │  │
│     │                                                   │  │
│     │ Information Needed:                               │  │
│     │ ☑ Supporting documents                            │  │
│     │ ☑ Clarification on calculations                   │  │
│     │ ☐ Additional data points                          │  │
│     │ ☐ Other                                           │  │
│     │                                                   │  │
│     │ Message:                                          │  │
│     │ ┌───────────────────────────────────────────────┐│  │
│     │ │ Dear ABC Pharma,                              ││  │
│     │ │                                                ││  │
│     │ │ We require additional information to complete ││  │
│     │ │ verification of your WSL submission for Week 3:││  │
│     │ │                                                ││  │
│     │ │ 1. Please provide supporting documents for    ││  │
│     │ │    stock level calculations                   ││  │
│     │ │ 2. Clarify the calculation method used for    ││  │
│     │ │    SKU ABC-123                                ││  │
│     │ │                                                ││  │
│     │ │ Please respond within 48 hours.               ││  │
│     │ │                                                ││  │
│     │ │ Regards,                                       ││  │
│     │ │ MOH Verification Team                          ││  │
│     │ └───────────────────────────────────────────────┘│  │
│     │                                                   │  │
│     │ Due Date:                                         │  │
│     │ ┌───────────────────────────────────────────────┐│  │
│     │ │ [2025-01-08 📅]  (48 hours)                   ││  │
│     │ └───────────────────────────────────────────────┘│  │
│     │                                                   │  │
│     │ ☑ Send email notification                        │  │
│     │ ☑ Send SMS notification                          │  │
│     │ ☑ Pause verification until response received     │  │
│     │                                                   │  │
│     │                      [Cancel]  [Send Request]    │  │
│     └───────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4. Start Follow-up Modal

```
┌─────────────────────────────────────────────────────────────┐
│ [Backdrop: rgba(0,0,0,0.5)]                                 │
│                                                             │
│     ┌───────────────────────────────────────────────────┐  │
│     │ Start Follow-up                                [×]│  │
│     ├───────────────────────────────────────────────────┤  │
│     │                                                   │  │
│     │ Company: DEF Ltd                                  │  │
│     │ Issue: WSL submission overdue (3 days)           │  │
│     │                                                   │  │
│     │ Assign to:                                        │  │
│     │ ┌───────────────────────────────────────────────┐│  │
│     │ │ [Me (Tier 2 Officer) ▼]                       ││  │
│     │ └───────────────────────────────────────────────┘│  │
│     │                                                   │  │
│     │ Priority:                                         │  │
│     │ ┌───────────────────────────────────────────────┐│  │
│     │ │ [Normal ▼]                                     ││  │
│     │ └───────────────────────────────────────────────┘│  │
│     │                                                   │  │
│     │ Due Date:                                         │  │
│     │ ┌───────────────────────────────────────────────┐│  │
│     │ │ [2025-01-09 📅]  (3 business days)            ││  │
│     │ └───────────────────────────────────────────────┘│  │
│     │                                                   │  │
│     │ Follow-up Actions:                                │  │
│     │ ☑ Contact company via phone                      │  │
│     │ ☑ Send reminder email                            │  │
│     │ ☐ Schedule meeting                               │  │
│     │                                                   │  │
│     │ Notes:                                            │  │
│     │ ┌───────────────────────────────────────────────┐│  │
│     │ │ First-time overdue. Company has good history. ││  │
│     │ │ Will contact via phone first.                 ││  │
│     │ └───────────────────────────────────────────────┘│  │
│     │                                                   │  │
│     │ ☑ Create audit log entry                         │  │
│     │                                                   │  │
│     │                      [Cancel]  [Start Follow-up] │  │
│     └───────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5. Escalate to Tier 1 Modal

```
┌─────────────────────────────────────────────────────────────┐
│ [Backdrop: rgba(0,0,0,0.5)]                                 │
│                                                             │
│     ┌───────────────────────────────────────────────────┐  │
│     │ Escalate to Tier 1                             [×]│  │
│     ├───────────────────────────────────────────────────┤  │
│     │                                                   │  │
│     │ Company: ABC Pharma                               │  │
│     │ Issue: Multiple overdue submissions + Critical   │  │
│     │        medicines affected                         │  │
│     │                                                   │  │
│     │ Escalation Reason:                                │  │
│     │ ┌───────────────────────────────────────────────┐│  │
│     │ │ [Extreme Case - Critical Medicines ▼]         ││  │
│     │ └───────────────────────────────────────────────┘│  │
│     │                                                   │  │
│     │ Options:                                          │  │
│     │ • Extreme Case - Critical Medicines               │  │
│     │ • Repeated Non-Compliance                         │  │
│     │ • Requires Enforcement Action                     │  │
│     │ • Complex Issue - Tier 1 Expertise Needed        │  │
│     │ • Other                                           │  │
│     │                                                   │  │
│     │ Details:                                          │  │
│     │ ┌───────────────────────────────────────────────┐│  │
│     │ │ Company ABC Pharma has:                       ││  │
│     │ │ • WSL: 2 weeks overdue                        ││  │
│     │ │ • MSQ: 1 month overdue                        ││  │
│     │ │ • 5 critical medicines below threshold        ││  │
│     │ │ • Repeated offender (3rd occurrence)          ││  │
│     │ │                                                ││  │
│     │ │ Tier 2 follow-up unsuccessful. Requires Tier 1││  │
│     │ │ intervention and potential enforcement action.││  │
│     │ └───────────────────────────────────────────────┘│  │
│     │                                                   │  │
│     │ Assign to:                                        │  │
│     │ ┌───────────────────────────────────────────────┐│  │
│     │ │ [Tier 1 Team ▼]                               ││  │
│     │ └───────────────────────────────────────────────┘│  │
│     │                                                   │  │
│     │ ☑ Notify Tier 1 team                             │  │
│     │ ☑ Transfer all follow-up records                 │  │
│     │ ☑ Create audit log entry                         │  │
│     │                                                   │  │
│     │                      [Cancel]  [Escalate]        │  │
│     └───────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Tab Component
- **Active Tab:** Underline (3px, primary-500), bold text
- **Inactive Tab:** Normal text, hover: bg-secondary
- **Badge:** Count in parentheses, e.g., "Verification (8)"
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

### Collapsible Sections
- **Collapsed Height:** 64px (summary only)
- **Expanded Height:** Auto
- **Animation:** Smooth expand/collapse 200ms
- **Icon:** Chevron (rotate 180° when expanded)
- **Header:** Sticky when scrolling

---

## Interactions

### Tab Navigation
- **Click tab** → Switch to tab content, update URL (?tab=verification)
- **Arrow keys** → Navigate between tabs
- **Enter key** → Activate selected tab
- **Badge count** → Real-time update

### Quick Actions
- **Verify Selected** → Open verify modal for selected submissions
- **Flag Selected** → Open flag modal for selected submissions
- **Request Info** → Open request info modal for selected submissions
- **Export** → Download filtered data as CSV/PDF
- **Filters** → Open filter dropdown

### Modal Actions
- **Verify Submission:**
  - Review submission → Check verification checklist
  - Select decision → Enable submit button
  - Submit Decision → Close modal, update submission status, show success toast
  - Cancel → Close modal, no changes

- **Flag Submission:**
  - Select reason → Show description field
  - Select severity → Adjust escalation options
  - Flag → Close modal, update submission status, notify relevant parties
  - Cancel → Close modal, no changes

- **Request Information:**
  - Select info needed → Auto-populate message template
  - Edit message → Enable send button
  - Send Request → Close modal, notify company, pause verification
  - Cancel → Close modal, no changes

- **Start Follow-up:**
  - Select officer → Show officer details
  - Select priority → Adjust due date
  - Start Follow-up → Close modal, create follow-up record, show success toast
  - Cancel → Close modal, no changes

- **Escalate to Tier 1:**
  - Select reason → Show details field
  - Escalate → Close modal, transfer to Tier 1, notify team, show success toast
  - Cancel → Close modal, no changes

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

### Tablet (768px - 1023px)
- **Tabs:** Horizontal scroll if needed
- **Quick Actions:** Horizontal scroll
- **Cards:** 2-column grid
- **Modals:** 90vw width, centered

### Mobile (<768px)
- **Tabs:** Horizontal scroll
- **Quick Actions:** Horizontal scroll
- **Cards:** 1-column stack
- **Modals:** Full screen

---

## Design System References

### Components Used
- **Tab Component:** shadcn/ui tabs
- **Modal Component:** shadcn/ui dialog
- **Button Component:** shadcn/ui button
- **Card Component:** shadcn/ui card
- **Badge Component:** shadcn/ui badge
- **Form Components:** shadcn/ui form, input, select, textarea
- **Checkbox Component:** shadcn/ui checkbox
- **Radio Component:** shadcn/ui radio

### Design Inspiration
- **Stripe Dashboard:** Tab navigation, modal patterns
- **GitHub:** Quick actions bar, verification workflows
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
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - MOH Tier 2 role
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Tab, Modal, Card components
- [Design System](../../../../02-architecture/frontend/design-system.md) - Colors, typography, spacing
- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md) - Modal forms

---

**Last Updated:** 2025-01-06  
**Status:** 🟢 Updated with Tabbed Layout & Modal Designs  
**Design Approach:** Modern enterprise dashboard with tabs, modals, and workflow-optimized organization (Stripe/GitHub/Linear/shadcn/ui inspired)
