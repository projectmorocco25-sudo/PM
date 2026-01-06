# Task 0.5.2.12: Registry Submission Detail Page Wireframe

**Status:** 🟡 In Progress  
**Route:** `/rmm/submissions/[id]`  
**File:** `task-0.5.2.12-registry-submission-detail.png`  
**Priority:** 🔴 Core RMM Workflows

**Design Approach:** Modern detail page with workflow status, submission data, approval history timeline, and action buttons. Professional, accessible, and optimized for registry approval workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > RMM > Submissions > [Submission ID]                  │
│                                                             │
│ Registry Submission - Company ABC Update                   │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Workflow Status                                          ││
│ │                                                          ││
│ │ Draft → Submitted → Tier 2 Verified → Tier 1 Approved  ││
│ │   ✓        ✓              ✓              ✓             ││
│ │                                                          ││
│ │ Current Status: Tier 1 Approved                         ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Submission Data                                          ││
│ │                                                          ││
│ │ Entity Type: Company                                    ││
│ │ Entity: ABC Pharmaceuticals Inc.                       ││
│ │ Action: Update                                          ││
│ │                                                          ││
│ │ Changes:                                                ││
│ │ • Address: Updated from "Old Address" to "New Address"  ││
│ │ • Phone: Updated from "+212 XXX" to "+212 YYY"         ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Approval History                                         ││
│ │                                                          ││
│ │ • Tier 1 Approved by Dr. Samir Hassan - 2 days ago    ││
│ │ • Tier 2 Verified by Ahmed Benali - 3 days ago         ││
│ │ • Submitted by Company Admin - 4 days ago              ││
│ │ • Created (Draft) - 5 days ago                          ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [Approve] [Reject] [Request Info] (MOH actions)            │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Workflow Status Section
- **Visual:** Horizontal timeline showing workflow steps
- **Steps:** Draft → Submitted → Tier 2 Verified → Tier 1 Approved → Tier 2 Implemented → Completed
- **Current Status:** Highlighted with badge

### Submission Data Section
- **Entity Information:** Type, name, action type
- **Changes Display:** Before/after comparison or change list

### Approval History Section
- **Format:** Vertical timeline
- **Entries:** Each approval step with user, role, timestamp, notes

### Action Buttons (MOH Only)
- **Approve:** Primary button (Tier 1)
- **Reject:** Secondary/destructive button (requires reason)
- **Request Info:** Secondary button

---

## Related Wireframes

- [Registry Submission List](task-0.5.2.11-registry-submission-list.md)
- [Registry Submission Workflow States](task-0.5.2.13-registry-submission-workflow-states.md)

---

**Next:** [Registry Submission Workflow States](task-0.5.2.13-registry-submission-workflow-states.md)

