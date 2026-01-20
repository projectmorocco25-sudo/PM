# Task 0.5.2.13: Registry Submission Workflow States Wireframe

**Status:** ✅ Complete  
**Route:** Various (workflow state visualization)  
**File:** `task-0.5.2.13-registry-submission-workflow-states.png`  
**Priority:** 🔴 Core RMM Workflows

**Design Approach:** Visual documentation of all workflow states and transitions for registry submissions. Shows state machine, status indicators, and transition rules.

---

## Workflow States (Enhanced per Fatima's Requirement)

### Company Submission Workflow
1. **Draft** - Initial state, editable
   - **Regulatory Deadline:** N/A (internal state)
2. **Submitted** - Submitted for review
   - **Regulatory Deadline:** Verification deadline per DMP Art. 10
   - **Regulatory Basis:** DMP Regulation Article 10
3. **Tier 2 Verified** - Tier 2 Officer verified
   - **Regulatory Deadline:** Approval deadline per DMP Art. 10
   - **Regulatory Basis:** DMP Regulation Article 10
4. **Tier 1 Approved** - Tier 1 approved
   - **Regulatory Deadline:** Implementation deadline per DMP Art. 10
   - **Regulatory Basis:** DMP Regulation Article 10
   - **Regulatory Requirement Checklist:** Must be complete before approval
5. **Tier 2 Implemented** - Tier 2 Registrar implemented
   - **Regulatory Deadline:** N/A (final implementation state)
6. **Completed** - Final state
   - **Regulatory Basis:** DMP Regulation Article 10 - Registry Completion
7. **Rejected** - Rejected at any stage (with feedback)
   - **Regulatory Basis:** DMP Regulation Article 10 - Rejection Authority

### MOH Submission Workflow
1. **Draft** - Initial state
2. **Submitted** - Tier 2 submitted
3. **Tier 2 Peer Reviewed** - Another Tier 2 reviewed
4. **Tier 1 Approved** - Tier 1 approved
5. **Tier 2 Implemented** - Tier 2 Registrar implemented
6. **Completed** - Final state
7. **Rejected** - Rejected at any stage

---

## Visual Representation (Enhanced per Fatima's Requirement)

```
Company Submission:
Draft → Submitted → Tier 2 Verified → Tier 1 Approved → Tier 2 Implemented → Completed
  ↓         ↓              ↓                ↓                    ↓
[Edit]   [Cancel]      [Reject]        [Reject]            [View]
           ↓              ↓                ↓
      (Deadline)    (Deadline)      (Deadline + Checklist)
      DMP Art.10    DMP Art.10      DMP Art.10
```

**Regulatory Deadline Indicators:**
- Each state shows: ⚠️ [X]d deadline or ✓ On-time
- Regulatory basis shown per state transition
- Urgency indicators: 🔴 <3 days, 🟡 3-7 days, 🟢 >7 days

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

