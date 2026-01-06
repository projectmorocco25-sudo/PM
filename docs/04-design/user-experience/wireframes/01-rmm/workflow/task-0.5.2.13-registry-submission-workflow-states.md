# Task 0.5.2.13: Registry Submission Workflow States Wireframe

**Status:** 🟡 In Progress  
**Route:** Various (workflow state visualization)  
**File:** `task-0.5.2.13-registry-submission-workflow-states.png`  
**Priority:** 🔴 Core RMM Workflows

**Design Approach:** Visual documentation of all workflow states and transitions for registry submissions. Shows state machine, status indicators, and transition rules.

---

## Workflow States

### Company Submission Workflow
1. **Draft** - Initial state, editable
2. **Submitted** - Submitted for review
3. **Tier 2 Verified** - Tier 2 Officer verified
4. **Tier 1 Approved** - Tier 1 approved
5. **Tier 2 Implemented** - Tier 2 Registrar implemented
6. **Completed** - Final state
7. **Rejected** - Rejected at any stage (with feedback)

### MOH Submission Workflow
1. **Draft** - Initial state
2. **Submitted** - Tier 2 submitted
3. **Tier 2 Peer Reviewed** - Another Tier 2 reviewed
4. **Tier 1 Approved** - Tier 1 approved
5. **Tier 2 Implemented** - Tier 2 Registrar implemented
6. **Completed** - Final state
7. **Rejected** - Rejected at any stage

---

## Visual Representation

```
Company Submission:
Draft → Submitted → Tier 2 Verified → Tier 1 Approved → Tier 2 Implemented → Completed
  ↓         ↓              ↓                ↓                    ↓
[Edit]   [Cancel]      [Reject]        [Reject]            [View]

MOH Submission:
Draft → Submitted → Tier 2 Peer Reviewed → Tier 1 Approved → Tier 2 Implemented → Completed
  ↓         ↓              ↓                    ↓                    ↓
[Edit]   [Cancel]      [Reject]            [Reject]            [View]
```

---

## Status Indicators

- **Draft:** Gray badge
- **Submitted:** Blue badge
- **Tier 2 Verified/Peer Reviewed:** Yellow badge
- **Tier 1 Approved:** Green badge
- **Tier 2 Implemented:** Green badge
- **Completed:** Green badge (checkmark)
- **Rejected:** Red badge

---

## Related Wireframes

- [Registry Submission List](task-0.5.2.11-registry-submission-list.md)
- [Registry Submission Detail](task-0.5.2.12-registry-submission-detail.md)

---

**Next:** RMM Supporting Pages

