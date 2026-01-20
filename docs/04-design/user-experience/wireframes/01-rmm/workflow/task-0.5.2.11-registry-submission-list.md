# Task 0.5.2.11: Registry Submission List Page Wireframe

**Status:** ✅ Complete  
**Route:** `/rmm/submissions`  
**File:** `task-0.5.2.11-registry-submission-list.png`  
**Priority:** 🔴 Core RMM Workflows

**Design Approach:** Modern submission queue interface with workflow status indicators, filters, and role-based views. Professional, accessible, and optimized for registry approval workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > RMM > Submissions                                     │
│                                                             │
│ My Submissions (Company) / All Submissions (MOH)            │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Filters: [All Status ▼] [All Types ▼] [Date Range]     ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ℹ️ Submission Deadlines                                    ││
│   Regulatory: DMP Regulation Article 10 - Registry        ││
│   Submission Requirements                                  ││
│   [View Regulatory Framework]                              ││
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Entity    Type      Status          Date      Deadline  Actions││
│ │ ──────    ────      ──────────      ────      ────────  ──────││
│ │ Company   Create    Pending         2h ago    ⚠️ 3d [View]    ││
│ │ ABC       Approval                  Regulatory:[Details]││
│ │                                    DMP Art.10            ││
│ │                                                          ││
│ │ Product   Update    Tier 2          1d ago    ✓ On-time[View] ││
│ │ XYZ       Verified                  Regulatory:[Details]││
│ │                                    DMP Art.10            ││
│ │                                                          ││
│ │ SKU       Create    Tier 1          3d ago    [View]    ││
│ │ DEF       Approved                  [Details]           ││
│ │                                                          ││
│ │ Company   Delete    Completed       1w ago    [View]    ││
│ │ GHI       (Cancelled)              [Details]           ││
│ │                                                          ││
│ │ [Load More]                                            ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > RMM > Submissions"
- **Title:** "My Submissions" (Company) or "All Submissions" (MOH)
- **Actions:** Filter controls

### Filters Bar
- **Status Filter:** Dropdown (All, Draft, Submitted, Tier 2 Verified, Tier 1 Approved, Completed, Rejected)
- **Type Filter:** Dropdown (All, Company, Product, SKU)
- **Date Range:** Date range picker

### Submission Deadlines Banner (Fatima's Requirement)
- **Display:** Info banner below filters
- **Content:**
  - **Regulatory Basis (REQUIRED):** "DMP Regulation Article 10 - Registry Submission Requirements"
  - **Link:** "[View Regulatory Framework]" to regulatory framework document

### Submissions Table (Enhanced per Fatima's Requirement)
- **Columns:**
  - **Entity:** Entity name and type
  - **Type:** Create, Update, Delete
  - **Status:** Workflow status with badge
  - **Date:** Submission date
  - **Deadline (Fatima's Requirement - REQUIRED):**
    - **Regulatory Deadline Status:** "⚠️ [X]d" (days until deadline) or "✓ On-time"
    - **Regulatory Basis:** "Regulatory: DMP Art. X" (per submission type)
    - **Urgency Indicators:** 🔴 if <3 days, 🟡 if 3-7 days, ✓ if on-time
  - **Actions:** View, Details buttons
- **Status Badges:**
  - Draft: Gray
  - Submitted: Blue
  - Tier 2 Verified: Yellow
  - Tier 1 Approved: Green
  - Completed: Green
  - Rejected: Red

---

## Role-Based Access

### Company Users
- **View:** Only own company submissions
- **Title:** "My Submissions"

### MOH Users
- **View:** All submissions
- **Title:** "All Submissions"
- **Actions:** Can verify, approve, reject

---

## Related Wireframes

- [Registry Submission Detail](task-0.5.2.12-registry-submission-detail.md)
- [Registry Submission Workflow States](task-0.5.2.13-registry-submission-workflow-states.md)

---

**Next:** [Registry Submission Detail](task-0.5.2.12-registry-submission-detail.md)

