# Task 0.5.1.18: Company Dashboard Wireframe

**Status:** ✅ Complete  
**Route:** `/dashboard` (Company role)  
**File:** `task-0.5.1.18-company-dashboard.png`  
**Priority:** 🔴 Critical Foundation

**Design Approach:** Modern enterprise dashboard with modal-based quick actions and optional tabbed navigation. Inspired by Stripe, GitHub, Linear, and shadcn/ui best practices. Professional, accessible, and optimized for company users managing regulatory compliance workflows.

---

## Overview

This dashboard uses **modals** for quick actions to maintain context and optionally **tabs** to organize content by workflow area (Overview, Submissions, Enforcement, Activity). The design prioritizes clarity and ease of use for company users.

### Key Improvements
- **Modals:** Quick actions (Appeal Enforcement, Quick Actions Menu) without navigation
- **Optional Tabs:** Organize content into Overview, Submissions, Enforcement, Activity
- **Simplified Layout:** Clearer hierarchy with prominent action items
- **Quick Actions Menu:** Dropdown for common actions

---

## Wireframe Layout - Overview (Default)

```
┌─────────────────────────────────────────────────────────────┐
│ Home > Dashboard                                             │
│                                                             │
│ Welcome, [Company Name]                    [Quick Actions ▼]│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ [Overview] [Submissions] [Enforcement] [Activity]        ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Regulatory Compliance Status                             ││
│ │                                                          ││
│ │ Status: ⚠️ Non-Compliant (2 violations)                  ││
│ │ Active Enforcement Actions: 2                            ││
│ │ Required Actions: 1 (Appeal deadline approaching)        ││
│ │                                                          ││
│ │ [View Detailed Compliance Status]                        ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        ││
│ │ My Submissions│ │ Pending      │ │ Recent Activity│      ││
│ │              │ │ Approvals    │ │              │        ││
│ │ 12           │ │ 3            │ │ • Submission │        ││
│ │              │ │              │ │   #12345     │        ││
│ │ Recent:      │ │ • Product ABC│ │   Approved   │        ││
│ │ • Product XYZ│ │   High       │ │   2h ago     │        ││
│ │   Submitted  │ │   1h ago     │ │              │        ││
│ │   1 day ago  │ │   ⚠️ 2d deadline│ │ • Submission │        ││
│ │              │ │              │ │   #12346     │        ││
│ │ • Product ABC│ │ • Product DEF│ │   Pending    │        ││
│ │   Approved   │ │   Medium     │ │   5h ago     │        ││
│ │   2 days ago │ │   2h ago     │ │              │        ││
│ │              │ │   ⚠️ 3d deadline│ │ • New Message│        ││
│ │ [View All →]│ │              │ │   from MOH   │        ││
│ │              │ │ • Product GHI│ │   1 day ago  │        ││
│ │              │ │   Low        │ │              │        ││
│ │              │ │   3h ago     │ │ [View All →]│        ││
│ │              │ │              │ │              │        ││
│ │              │ │ [View All →]│ │              │        ││
│ └──────────────┘ └──────────────┘ └──────────────┘        ││
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Active Enforcement Actions (My Company)      [Collapse]  ││
│ │                                                          ││
│ │ ⚠️ Warning - Submission Non-Compliance                  ││
│ │   Status: Executed  Date: 2 days ago                    ││
│ │   Violation: WSL submission overdue                      ││
│ │   Legal Basis: DMP Regulation Article 12 - Non-Compliance││
│ │   Appeal Deadline: 🔴 28 days remaining (Due: [date])   ││
│ │   Regulatory: Law No. 09-08 - 30-day appeal window      ││
│ │   Action Required: Submit appeal before deadline        ││
│ │   [View Details] [Appeal]                                ││
│ │                                                          ││
│ │ ⚠️ Warning - Critical Medicine Non-Compliance          ││
│ │   Status: Executed  Date: 1 week ago                   ││
│ │   Violation: Critical medicine stock below threshold    ││
│ │   Legal Basis: DMP Regulation Article 15                ││
│ │   Appeal Window: Closed                                  ││
│ │   [View Details]                                         ││
│ │                                                          ││
│ │ [View All Enforcement Actions →]                        ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Key Metrics                                              ││
│ │                                                          ││
│ │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   ││
│ │ │Compliance│ │ Active   │ │ Pending  │ │ Completed│   ││
│ │ │ Score    │ │ Submissions│ │ Actions │ │ This Month│   ││
│ │ │          │ │          │ │          │ │          │   ││
│ │ │   85%    │ │    12    │ │    3     │ │    24    │   ││
│ │ │          │ │          │ │          │ │          │   ││
│ │ │ ↗ +5%    │ │ → View   │ │ → View   │ │ → View   │   ││
│ │ └──────────┘ └──────────┘ └──────────┘ └──────────┘   ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Submissions Tab

```
┌─────────────────────────────────────────────────────────────┐
│ Home > Dashboard                                             │
│                                                             │
│ Welcome, [Company Name]                    [Quick Actions ▼]│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ [Overview] [Submissions (12)] [Enforcement] [Activity]   ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ My Submissions (12)                         [Collapse]  ││
│ │                                                          ││
│ │ [Filter: All | Pending | Approved | Rejected]           ││
│ │ [Sort: Date ▼ | Status | Product]                       ││
│ │                                                          ││
│ │ Submission #12345  Product XYZ  [Pending]               ││
│ │   Type: WSL  Submitted: 1 day ago                       ││
│ │   Status: Awaiting Verification                          ││
│ │   Submission Deadline: Due 2025-01-15 (3 days remaining)││
│ │   Regulatory: DMP Art. 12 - Weekly Submission          ││
│ │   [View Details] [Edit] [Withdraw]                      ││
│ │                                                          ││
│ │ Submission #12344  Product ABC  [Approved] ✓            ││
│ │   Type: MSQ  Submitted: 2 days ago                      ││
│ │   Status: Approved by MOH Tier 2                        ││
│ │   [View Details] [Download Receipt]                     ││
│ │                                                          ││
│ │ Submission #12343  Product DEF  [Rejected] ✗            ││
│ │   Type: AAMS  Submitted: 5 days ago                     ││
│ │   Status: Rejected - Data Quality Issue                 ││
│ │   [View Details] [Resubmit] [View Feedback]             ││
│ │                                                          ││
│ │ [Load More] [Export List]                               ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        ││
│ │ This Week    │ │ This Month   │ │ Upcoming     │        ││
│ │              │ │              │ │ Deadlines    │        ││
│ │ Submitted: 3 │ │ Submitted: 12│ │              │        ││
│ │ Approved: 2  │ │ Approved: 10 │ │ • WSL Week 4 │        ││
│ │ Pending: 1   │ │ Pending: 2   │ │   Due: 2 days│        ││
│ │              │ │              │ │              │        ││
│ │              │ │              │ │ • MSQ Jan    │        ││
│ │              │ │              │ │   Due: 5 days│        ││
│ │              │ │              │ │              │        ││
│ │              │ │              │ │ [View All →]│        ││
│ └──────────────┘ └──────────────┘ └──────────────┘        ││
└─────────────────────────────────────────────────────────────┘
```

---

## Enforcement Tab

```
┌─────────────────────────────────────────────────────────────┐
│ Home > Dashboard                                             │
│                                                             │
│ Welcome, [Company Name]                    [Quick Actions ▼]│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ [Overview] [Submissions] [Enforcement (2)] [Activity]    ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Enforcement Actions (2)                     [Collapse]  ││
│ │                                                          ││
│ │ [Filter: All | Warnings | Fines | Suspensions]         ││
│ │ [Status: All | Executed | Appealed | Resolved]          ││
│ │                                                          ││
│ │ ⚠️ Warning - Submission Non-Compliance                  ││
│ │   Action ID: ENF-2025-001                               ││
│ │   Status: Executed  Date: 2 days ago                    ││
│ │   Violation: WSL submission overdue (2 weeks)           ││
│ │   Legal Basis: Article 12, Section 3                    ││
│ │   Appeal Deadline: 28 days remaining                    ││
│ │   (30-day window per DMP regulations)                  ││
│ │   [View Full Details] [Appeal]                          ││
│ │                                                          ││
│ │ ⚠️ Warning - Critical Medicine Non-Compliance          ││
│ │   Action ID: ENF-2024-045                               ││
│ │   Status: Executed  Date: 1 week ago                   ││
│ │   Violation: Critical medicine stock below threshold    ││
│ │   (From WSL Submission - Replen. 25/01/25)             ││
│ │   [View Violation Reason]                               ││
│ │   Legal Basis: Article 15, Section 2                    ││
│ │   Appeal Deadline: Expired                              ││
│ │   [View Full Details]                                   ││
│ │                                                          ││
│ │ [View All Actions →] [View Appeal History →]           ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        ││
│ │ Total Actions│ │ Active Appeals│ │ Compliance   │        ││
│ │              │ │              │ │ Status       │        ││
│ │ Warnings: 2  │ │ Pending: 0   │ │              │        ││
│ │ Fines: 0     │ │ Resolved: 0  │ │ Current: Good│        ││
│ │ Suspensions:0│ │              │ │              │        ││
│ │              │ │              │ │ Last Action: │        ││
│ │ Total: 2     │ │              │ │ 2 days ago   │        ││
│ │              │ │              │ │              │        ││
│ │              │ │              │ │ [View Report]│        ││
│ └──────────────┘ └──────────────┘ └──────────────┘        ││
└─────────────────────────────────────────────────────────────┘
```

---

## Activity Tab

```
┌─────────────────────────────────────────────────────────────┐
│ Home > Dashboard                                             │
│                                                             │
│ Welcome, [Company Name]                    [Quick Actions ▼]│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ [Overview] [Submissions] [Enforcement] [Activity]        ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Recent Activity                             [Collapse]  ││
│ │                                                          ││
│ │ [Filter: All | Submissions | Messages | Enforcement]    ││
│ │ [Date Range: Last 7 days ▼]                             ││
│ │                                                          ││
│ │ • Submission #12345 Approved                            ││
│ │   Product XYZ - WSL Week 3                              ││
│ │   2 hours ago                                           ││
│ │   [View Details]                                        ││
│ │                                                          ││
│ │ • Enforcement Action Issued                             ││
│ │   Warning - Submission Non-Compliance                   ││
│ │   2 days ago                                            ││
│ │   [View Details] [Appeal]                               ││
│ │                                                          ││
│ │ • New Message from MOH                                  ││
│ │   Regarding: Submission #12344                          ││
│ │   3 days ago                                            ││
│ │   [View Message]                                        ││
│ │                                                          ││
│ │ • Submission #12344 Submitted                           ││
│ │   Product ABC - MSQ January                             ││
│ │   5 days ago                                            ││
│ │   [View Details]                                        ││
│ │                                                          ││
│ │ [Load More] [Export Activity Log]                       ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        ││
│ │ This Week    │ │ This Month   │ │ Notifications│        ││
│ │              │ │              │ │              │        ││
│ │ Activities:  │ │ Activities:  │ │ Unread: 3    │        ││
│ │ 15           │ │ 48           │ │              │        ││
│ │              │ │              │ │ • New message│        ││
│ │ Submissions: │ │ Submissions: │ │   from MOH   │        ││
│ │ 3            │ │ 12           │ │              │        ││
│ │              │ │              │ │ • Submission │        ││
│ │ Messages: 5  │ │ Messages: 18 │ │   approved   │        ││
│ │              │ │              │ │              │        ││
│ │              │ │              │ │ [View All →]│        ││
│ └──────────────┘ └──────────────┘ └──────────────┘        ││
└─────────────────────────────────────────────────────────────┘
```

---

## Modal Designs

### 1. Appeal Enforcement Action Modal

```
┌─────────────────────────────────────────────────────────────┐
│ [Backdrop: rgba(0,0,0,0.5)]                                 │
│                                                             │
│     ┌───────────────────────────────────────────────────┐  │
│     │ Appeal Enforcement Action                      [×]│  │
│     ├───────────────────────────────────────────────────┤  │
│     │                                                   │  │
│     │ Enforcement Action: ENF-2025-001                  │  │
│     │ Type: Warning                                     │  │
│     │ Violation: WSL submission overdue (2 weeks)      │  │
│     │ Executed: 2 days ago                              │  │
│     │ Legal Basis: DMP Regulation Article 12            │  │
│     │ Appeal Deadline: 🔴 28 days remaining              │  │
│     │ (Deadline: [Date + 30 days from execution])       │  │
│     │ Regulatory: Law No. 09-08 - 30-day appeal window  │  │
│     │                                                   │  │
│     │ Grounds for Appeal:                               │  │
│     │ ┌───────────────────────────────────────────────┐│  │
│     │ │ [Technical Error ▼]                           ││  │
│     │ └───────────────────────────────────────────────┘│  │
│     │                                                   │  │
│     │ Options:                                          │  │
│     │ • Technical Error                                 │  │
│     │ • Procedural Issue                                │  │
│     │ • Factual Inaccuracy                              │  │
│     │ • Mitigating Circumstances                        │  │
│     │ • Other                                           │  │
│     │                                                   │  │
│     │ Detailed Explanation:                             │  │
│     │ ┌───────────────────────────────────────────────┐│  │
│     │ │ We experienced a system outage during the     ││  │
│     │ │ submission period which prevented timely      ││  │
│     │ │ submission. We have attached evidence of the  ││  │
│     │ │ outage and subsequent submission attempt.     ││  │
│     │ │                                                ││  │
│     │ │ We request that this warning be reconsidered  ││  │
│     │ │ given the technical circumstances.            ││  │
│     │ └───────────────────────────────────────────────┘│  │
│     │                                                   │  │
│     │ Supporting Documents:                             │  │
│     │ ┌───────────────────────────────────────────────┐│  │
│     │ │ [Upload Files] or [Drag & Drop]               ││  │
│     │ │                                                ││  │
│     │ │ • system-outage-report.pdf (2.3 MB)           ││  │
│     │ │ • submission-attempt-log.pdf (1.1 MB)         ││  │
│     │ └───────────────────────────────────────────────┘│  │
│     │                                                   │  │
│     │ ⚠️ Note: Appeals are reviewed by MOH Tier 1.     │  │
│     │    You will be notified of the decision within   │  │
│     │    14 business days.                              │  │
│     │                                                   │  │
│     │                      [Cancel]  [Submit Appeal]   │  │
│     └───────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2. Quick Actions Menu (Dropdown)

```
┌─────────────────────────────────────────────────────────────┐
│ Welcome, [Company Name]                    [Quick Actions ▼]│
│                                            ┌───────────────┐ │
│                                            │ New Submission│ │
│                                            │ View Reports  │ │
│                                            │ Messages      │ │
│                                            │ Help & Support│ │
│                                            │ Settings      │ │
│                                            └───────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 3. New Submission Quick Start Modal

```
┌─────────────────────────────────────────────────────────────┐
│ [Backdrop: rgba(0,0,0,0.5)]                                 │
│                                                             │
│     ┌───────────────────────────────────────────────────┐  │
│     │ New Submission                                 [×]│  │
│     ├───────────────────────────────────────────────────┤  │
│     │                                                   │  │
│     │ Select Submission Type:                           │  │
│     │                                                   │  │
│     │ ┌───────────────────────────────────────────────┐│  │
│     │ │ 📊 Weekly Stock Level (WSL)                   ││  │
│     │ │ Submit weekly stock levels for all products   ││  │
│     │ │ [Start WSL Submission →]                      ││  │
│     │ ├───────────────────────────────────────────────┤│  │
│     │ │ 📈 Monthly Stock Quantity (MSQ)               ││  │
│     │ │ Submit monthly stock quantity report          ││  │
│     │ │ [Start MSQ Submission →]                      ││  │
│     │ ├───────────────────────────────────────────────┤│  │
│     │ │ 🔄 Anticipated Arrival of Medicines (AAMS)    ││  │
│     │ │ Submit anticipated medicine arrivals          ││  │
│     │ │ [Start AAMS Submission →]                     ││  │
│     │ ├───────────────────────────────────────────────┤│  │
│     │ │ 📦 Export Request (ECS)                       ││  │
│     │ │ Request authorization for medicine export     ││  │
│     │ │ [Start Export Request →]                      ││  │
│     │ └───────────────────────────────────────────────┘│  │
│     │                                                   │  │
│     │ [View Submission Templates] [View Help Guide]    │  │
│     │                                                   │  │
│     └───────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4. View Enforcement Details Modal

```
┌─────────────────────────────────────────────────────────────┐
│ [Backdrop: rgba(0,0,0,0.5)]                                 │
│                                                             │
│     ┌───────────────────────────────────────────────────┐  │
│     │ Enforcement Action Details                     [×]│  │
│     ├───────────────────────────────────────────────────┤  │
│     │                                                   │  │
│     │ Action ID: ENF-2025-001                           │  │
│     │ Type: ⚠️ Warning                                  │  │
│     │ Status: Executed                                  │  │
│     │                                                   │  │
│     │ Violation Details:                                │  │
│     │ • Type: Submission Non-Compliance                 │  │
│     │ • Description: WSL submission overdue (2 weeks)   │  │
│     │ • Reference: Submission Period Week 1-2, 2025     │  │
│     │                                                   │  │
│     │ Legal Basis:                                      │  │
│     │ DMP Regulation Article 12 - Non-Compliance        │  │
│     │ Regulatory Framework: [Link to DMP Regulation]    │  │
│     │                                                   │  │
│     │ Justification:                                    │  │
│     │ Company failed to submit required WSL report      │  │
│     │ within the regulatory deadline. This is the       │  │
│     │ second occurrence within 6 months.                │  │
│     │                                                   │  │
│     │ Timeline:                                         │  │
│     │ • Created: 2025-01-04 10:00 AM                    │  │
│     │ • Reviewed: 2025-01-04 02:00 PM                   │  │
│     │ • Approved: 2025-01-04 04:00 PM                   │  │
│     │ • Executed: 2025-01-04 05:00 PM                   │  │
│     │                                                   │  │
│     │ Appeal Information:                               │  │
│     │ • Appeal Deadline: 2025-02-03 (28 days remaining)│  │
│     │ • Appeal Window: 🔴 Open (Law No. 09-08)         │  │
│     │ • Appeal Status: Not Appealed                     │  │
│     │ • Regulatory: 30-day appeal window per Law No. 09-08│ │
│     │                                                   │  │
│     │ [Download PDF] [Print] [Appeal] [Close]          │  │
│     └───────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Tab Component (Optional)
- **Active Tab:** Underline (3px, primary-500), bold text
- **Inactive Tab:** Normal text, hover: bg-secondary
- **Badge:** Count in parentheses, e.g., "Submissions (12)"
- **Spacing:** 24px between tabs
- **Height:** 48px
- **Keyboard:** Arrow keys to navigate, Enter to select

### Quick Actions Dropdown
- **Trigger:** Button with chevron icon
- **Width:** 200px
- **Position:** Right-aligned below trigger
- **Background:** White with shadow
- **Items:** Icon + text, hover: bg-secondary
- **Item Height:** 40px
- **Spacing:** 4px between items

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

### Regulatory Compliance Status Widget (Fatima's Requirement)
- **Layout:** Full-width card section at top of Overview tab
- **Content:**
  - **Status Badge:** "✓ Compliant" (green), "⚠️ Non-Compliant ([X] violations)" (red), or "🟡 Under Review" (yellow)
  - **Active Enforcement Actions Count:** Number of active enforcement actions
  - **Required Actions:** Count of actions requiring immediate attention (e.g., appeal deadlines approaching)
  - **Link:** "[View Detailed Compliance Status]" to full compliance page
- **Styling:** Prominent card with color-coded status badge
- **Display:** Always visible for Company users (regulatory transparency requirement)

### Active Enforcement Actions Widget (Fatima's Requirement)
- **Layout:** Full-width card section (prominent placement)
- **Content:** List of active enforcement actions against the company
- **Each Enforcement Action Shows:**
  - **Action Type:** Warning, Fine, or Suspension (with icon)
  - **Legal Basis (REQUIRED):** "Legal Basis: DMP Regulation Article X"
  - **Appeal Deadline Tracking (REQUIRED):**
    - "🔴 Appeal Deadline: [X] days remaining (Due: [date])" (if appeal window open)
    - "Appeal Window: Closed" (if closed)
    - Urgency indicator (🔴 if <7 days, 🟡 if 7-14 days, 🟢 if >14 days)
  - **Regulatory Framework Reference:** "Regulatory: Law No. 09-08 - 30-day appeal window"
  - **Action Required:** What the company must do
  - **Status:** Current status (Executed, Appealed, etc.)
  - **Links:** "[View Details]", "[Appeal]"
- **Display:** Prominent section (regulatory transparency requirement)

### Submission Deadline Tracking (Fatima's Requirement)
- **Location:** Submission list items and Upcoming Deadlines widget
- **Content:** Each submission deadline must show:
  - **Deadline Date:** "Due: [date] ([X] days remaining)"
  - **Regulatory Reference (REQUIRED):** "Regulatory: DMP Art. X - [Description]"
  - **Urgency Indicators:** 🔴 if <3 days, 🟡 if 3-7 days
  - **Grace Period Information:** If applicable, show grace period
  - **Penalties:** Late submission penalties (if applicable)

### Card Component
- **Background:** White
- **Border:** 1px solid #e5e7eb
- **Border Radius:** 8px
- **Shadow:** Subtle elevation
- **Padding:** 24px
- **Hover:** Slight shadow increase

---

## Interactions

### Tab Navigation (Optional)
- **Click tab** → Switch to tab content, update URL (?tab=submissions)
- **Arrow keys** → Navigate between tabs
- **Enter key** → Activate selected tab
- **Badge count** → Real-time update

### Quick Actions Dropdown
- **Click button** → Open dropdown
- **Click item** → Execute action or open modal
- **Click outside** → Close dropdown
- **Escape key** → Close dropdown

### Modal Actions
- **Appeal Enforcement:**
  - Select grounds → Show explanation field
  - Upload documents → Show file list
  - Submit Appeal → Close modal, show success toast, update action status
  - Cancel → Close modal, no changes

- **New Submission:**
  - Select type → Navigate to submission form or open wizard
  - View Templates → Open templates modal
  - View Help → Open help documentation

- **View Enforcement Details:**
  - Download PDF → Download action details
  - Print → Open print dialog
  - Appeal → Open appeal modal
  - Close → Close modal

### Widget Actions
- **View All** → Navigate to full list page
- **View Details** → Navigate to detail page or open modal
- **Quick Action Buttons** → Execute action or open modal

---

## Responsive Behavior

### Desktop (1024px+)
- **Tabs:** Horizontal, full width (if used)
- **Widget Grid:** 3-column grid
- **Modals:** 600px width, centered

### Tablet (768px - 1023px)
- **Tabs:** Horizontal scroll if needed
- **Widget Grid:** 2-column grid
- **Modals:** 90vw width, centered

### Mobile (<768px)
- **Tabs:** Horizontal scroll
- **Widget Grid:** 1-column stack
- **Modals:** Full screen
- **Quick Actions:** Full-width dropdown

---

## Design System References

### Components Used
- **Tab Component:** shadcn/ui tabs (optional)
- **Modal Component:** shadcn/ui dialog
- **Dropdown Component:** shadcn/ui dropdown-menu
- **Button Component:** shadcn/ui button
- **Card Component:** shadcn/ui card
- **Badge Component:** shadcn/ui badge
- **Form Components:** shadcn/ui form, input, select, textarea
- **File Upload:** shadcn/ui file-upload

### Design Inspiration
- **Stripe Dashboard:** Clean layout, modal patterns
- **GitHub:** Quick actions menu, activity feeds
- **Linear:** Modern dashboard, smooth interactions
- **shadcn/ui Dashboard:** Component patterns, accessibility

### Colors (From Design System)
- **Tab Active:** #3b82f6 (primary-500)
- **Tab Inactive:** #6b7280 (text-secondary)
- **Modal Overlay:** rgba(0, 0, 0, 0.5)
- **Modal Background:** #ffffff (white)
- **Card Background:** #ffffff (white)
- **Shadow:** rgba(0, 0, 0, 0.1)

### Typography
- **Page Title:** 30px, font-weight: 700 (h1)
- **Section Title:** 20px, font-weight: 600 (h2)
- **Card Title:** 16px, font-weight: 600 (h3)
- **Body Text:** 14px, font-weight: 400
- **Small Text:** 12px, font-weight: 400

### Spacing (8px Grid)
- **Page Padding:** 24px (3 × 8px) desktop, 16px (2 × 8px) mobile
- **Widget Gap:** 24px (3 × 8px) desktop, 16px (2 × 8px) mobile
- **Card Padding:** 24px (3 × 8px)
- **Modal Padding:** 24px

### Transitions & Animations
- **Tab Switch:** 200ms ease-in-out
- **Modal Open:** 200ms ease-out (fade + slide up)
- **Modal Close:** 150ms ease-in (fade + slide down)
- **Dropdown Open:** 150ms ease-out
- **Card Hover:** 150ms ease-in-out

### Accessibility (WCAG 2.1 AA)
- **Tab Navigation:** Keyboard accessible (Arrow keys, Enter)
- **Modal Focus:** Trap focus within modal, focus first input
- **Modal Close:** Escape key, click outside
- **Dropdown:** Keyboard accessible (Arrow keys, Enter, Escape)
- **Screen Readers:** ARIA labels, roles, descriptions
- **Color Contrast:** Minimum 4.5:1 for text
- **Touch Targets:** Minimum 40px × 40px

---

## Performance Optimizations

### Lazy Loading
- **Tab Content:** Load on first visit (if tabs used)
- **Modal Content:** Load on open
- **Widget Data:** Parallel API calls

### Data Fetching
- **Dashboard Data:** Fetch on page load
- **Real-time Updates:** WebSocket or polling (30s interval)

### Caching
- **Tab State:** localStorage (if tabs used)
- **Dashboard Data:** Memory cache with TTL (5 minutes)

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/dashboard`
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - Company role
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Card, Modal, Dropdown components
- [Design System](../../../../02-architecture/frontend/design-system.md) - Colors, typography, spacing
- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md) - Modal forms
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference including DMP regulations
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - Detailed compliance requirements
- [Regulatory Policies](../../../../03-governance/regulatory-policies.md) - Regulatory policies including appeal policies

---

**Last Updated:** 2025-01-06  
**Status:** 🟢 Updated with Modal Designs & Optional Tabs  
**Design Approach:** Modern enterprise dashboard with modals and optional tabs (Stripe/GitHub/Linear/shadcn/ui inspired)
