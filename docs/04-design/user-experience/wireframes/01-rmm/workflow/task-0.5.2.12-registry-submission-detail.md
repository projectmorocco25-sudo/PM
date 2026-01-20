# Task 0.5.2.12: Registry Submission Detail Page Wireframe

**Status:** ✅ Complete  
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
│ │                                                          ││
│ │ Regulatory Deadline Tracking:                            ││
│ │ • Tier 2 Verification: ✓ On-time (Regulatory: DMP Art.10)││
│ │ • Tier 1 Approval: ✓ On-time (Regulatory: DMP Art.10)  ││
│ │ • Implementation Deadline: ⚠️ 5d remaining (Regulatory: DMP Art.10)││
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
│ │   Regulatory Basis: DMP Art. 10 - Registry Approval    ││
│ │   Regulatory Requirements: ✓ Verified                   ││
│ │                                                          ││
│ │ • Tier 2 Verified by Ahmed Benali - 3 days ago         ││
│ │   Regulatory Basis: DMP Art. 10 - Registry Verification││
│ │   Regulatory Requirements: ✓ Verified                   ││
│ │                                                          ││
│ │ • Submitted by Company Admin - 4 days ago              ││
│ │   Regulatory Basis: DMP Art. 10 - Registry Submission  ││
│ │                                                          ││
│ │ • Created (Draft) - 5 days ago                          ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Regulatory Requirement Checklist (Fatima's Requirement) ││
│ │                                                          ││
│ │ ☑ Legal Basis Verified: DMP Art. 10                    ││
│ │ ☑ Legal Authority Verified: Tier 1 Approval Authority  ││
│ │ ☑ Regulatory Requirements Met                           ││
│ │ ☑ Compliance Verification Complete                     ││
│ │                                                          ││
│ │ [View Regulatory Framework]                             ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [Approve] [Reject] [Request Info] (MOH actions)            │
│ ⚠️ Approval blocked if regulatory checklist incomplete    │
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

