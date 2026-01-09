# Task 0.5.5.5: Score Review - Tier 1 Override Modal Wireframe

**Status:** ✅ Complete  
**Route:** Modal (triggered from score detail page)  
**File:** `task-0.5.5.5-score-review-tier1-override.png`  
**Priority:** 🟡 CMC Module

**Design Approach:** Quick action modal for Tier 1 to override compliance scores with justification. Contextual to score detail page, professional, accessible, and optimized for score override workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                   [Modal Overlay - Dimmed Background]       │
│                                                             │
│         ┌─────────────────────────────────────────────┐     │
│         │ Override Compliance Score                    │     │
│         │                                              │     │
│         │ Compliance Score: ABC Pharma Inc. - Dec 2024│     │
│         │ Current Score: 78/100                         │     │
│         │                                              │     │
│         │ ┌─────────────────────────────────────────┐ │     │
│         │ │ Override Type *                          │ │     │
│         │ │                                          │ │     │
│         │ │ ○ Total Score Override                   │ │     │
│         │ │ ● Component Score Override               │ │     │
│         │ └─────────────────────────────────────────┘ │     │
│         │                                              │     │
│         │ ┌─────────────────────────────────────────┐ │     │
│         │ │ Affected Component (if component override)│ │     │
│         │ │                                          │ │     │
│         │ │ [Select Component ▼]                     │ │     │
│         │ │                                          │ │     │
│         │ │ • Regulatory Reporting                   │ │     │
│         │ │ • Stock Threshold Violations             │ │     │
│         │ │ • Critical Medicine Coverage             │ │     │
│         │ │ • Non-Compliance Exposure                │ │     │
│         │ │ • Data Quality                           │ │     │
│         │ │ • Export Compliance                      │ │     │
│         │ │ • Replenishment Adherence                │ │     │
│         │ └─────────────────────────────────────────┘ │     │
│         │                                              │     │
│         │ ┌─────────────────────────────────────────┐ │     │
│         │ │ Current Value                            │ │     │
│         │ │                                          │ │     │
│         │ │ Total Score: 78/100                      │ │     │
│         │ │ [If Component Override]                  │ │     │
│         │ │ Component: Stock Threshold Violations    │ │     │
│         │ │ Current: 75/100                          │ │     │
│         │ └─────────────────────────────────────────┘ │     │
│         │                                              │     │
│         │ ┌─────────────────────────────────────────┐ │     │
│         │ │ New Value *                              │ │     │
│         │ │                                          │ │     │
│         │ │ [Number Input: 0-100]                    │ │     │
│         │ │                                          │ │     │
│         │ │ Preview:                                │ │     │
│         │ │ New Total Score: 82/100                  │ │     │
│         │ │ (Automatically calculated)               │ │     │
│         │ └─────────────────────────────────────────┘ │     │
│         │                                              │     │
│         │ ┌─────────────────────────────────────────┐ │     │
│         │ │ Override Justification *                 │ │     │
│         │ │                                          │ │     │
│         │ │ [Text Area - Provide justification...] │ │     │
│         │ │                                          │ │     │
│         │ │ Character count: 0/1000                    │ │     │
│         │ │                                          │ │     │
│         │ │ Required: Explain why this override is   │ │     │
│         │ │ necessary and provide regulatory basis.  │ │     │
│         │ └─────────────────────────────────────────┘ │     │
│         │                                              │     │
│         │ ┌─────────────────────────────────────────┐ │     │
│         │ │ Impact Assessment                        │ │     │
│         │ │                                          │ │     │
│         │ │ ⚠️ This override will:                    │ │     │
│         │ │                                          │ │     │
│         │ │ • Change total score from 78 to 82       │ │     │
│         │ │ • Be logged in audit trail              │ │     │
│         │ │ • Require Tier 1 approval signature     │ │     │
│         │ │ • Be visible in score adjustments       │ │     │
│         │ │ • May affect ECS auto-approval (if active)│ │     │
│         │ │                                          │ │     │
│         │ │ [I understand the impact] ✓              │ │     │
│         │ └─────────────────────────────────────────┘ │     │
│         │                                              │     │
│         │ [Cancel]              [Override Score]       │     │
│         │                                              │     │
│         └─────────────────────────────────────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Modal Overlay
- **Layout:** Full-screen overlay with dimmed background
- **Background:** Semi-transparent dark overlay (rgba(0, 0, 0, 0.5))
- **Centered Modal:** Modal dialog centered on screen
- **Backdrop Click:** Clicking outside modal closes it (with confirmation if form has data)

### Modal Header
- **Title:** "Override Compliance Score"
  - **Typography:** 20px, font-weight: 600, color: #111827
- **Score Context:**
  - **Company Name:** "ABC Pharma Inc. - Dec 2024"
  - **Current Score:** "Current Score: 78/100"
  - **Typography:** 14px, color: #6b7280
- **Close Button:** X button (top-right corner)

### Modal Body

#### Override Type Selection (Required)
- **Label:** "Override Type *"
- **Type:** Radio button group
- **Options:**
  1. **Total Score Override:** Override the total score directly
  2. **Component Score Override:** Override a specific component score (recalculates total)
- **Default:** Component Score Override
- **Styling:** Radio buttons with labels
- **Validation:** Required field

#### Affected Component Selection (Conditional)
- **Label:** "Affected Component"
- **Type:** Dropdown/Select
- **Visibility:** Only shown if "Component Score Override" selected
- **Options:**
  - Regulatory Reporting
  - Stock Threshold Violations
  - Critical Medicine Coverage
  - Non-Compliance Exposure
  - Data Quality
  - Export Compliance (if ECS active)
  - Replenishment Adherence (if ECS active)
- **Styling:** Standard dropdown with search (optional)
- **Validation:** Required if component override selected

#### Current Value Display
- **Layout:** Read-only display of current values
- **Content:**
  - **Total Score:** Current total score (e.g., "78/100")
  - **Component Value:** Current component score (if component override selected, e.g., "75/100")
- **Styling:** Read-only text with light background

#### New Value Input (Required)
- **Label:** "New Value *"
- **Type:** Number input
- **Range:** 0-100
- **Step:** 0.01 (decimal precision)
- **Placeholder:** "Enter new score (0-100)"
- **Validation:**
  - Required field
  - Must be between 0 and 100
  - Decimal precision: 2 decimal places
- **Preview:**
  - **New Total Score:** Calculated automatically based on override type
  - **Format:** "New Total Score: XX/100"
  - **Note:** "(Automatically calculated)"
- **Styling:** Number input with validation feedback

#### Override Justification (Required)
- **Label:** "Override Justification *"
- **Type:** Text area
- **Placeholder:** "Provide detailed justification for this override..."
- **Character Limit:** 1000 characters
- **Character Count:** Display "X/1000" characters remaining
- **Help Text:** "Required: Explain why this override is necessary and provide regulatory basis."
- **Validation:**
  - Required field
  - Minimum 50 characters
  - Maximum 1000 characters
- **Styling:** Multi-line text area with character counter

#### Impact Assessment Section
- **Layout:** Warning box with impact checklist
- **Content:**
  - **Warning Icon:** ⚠️
  - **Title:** "This override will:"
  - **Impact Checklist:**
    1. Change total score from X to Y
    2. Be logged in audit trail
    3. Require Tier 1 approval signature
    4. Be visible in score adjustments
    5. May affect ECS auto-approval (if CMC and ECS active)
  - **Confirmation Checkbox:** "I understand the impact" ✓
- **Validation:** Confirmation checkbox required
- **Styling:** Yellow/orange warning box with checkbox

### Modal Footer
- **Actions:**
  - **Cancel Button:** Secondary button (left-aligned)
    - **Action:** Closes modal (with confirmation if form has data)
  - **Override Score Button:** Primary button (right-aligned)
    - **Action:** Submits form and overrides score
    - **Disabled State:** Disabled if form is invalid or confirmation not checked
- **Styling:** Button group with spacing

---

## Role-Based Access

### MOH Tier 1
- **Access:** Can override any compliance score
- **Actions:**
  - Select override type
  - Select affected component (if component override)
  - Enter new value
  - Provide justification
  - Confirm impact understanding
  - Submit override
- **Notifications:** Companies notified when score is overridden (if published)
- **Audit Log:** All override actions logged in audit trail

### MOH Tier 2
- **Access:** Cannot override scores (flag anomalies instead)
- **View:** Can see override history in score adjustments

### Company Users
- **Access:** Cannot override scores (dispute functionality instead)
- **View:** Can see override history in score adjustments (if published)

---

## State Variations

### Empty State (Initial)
- **Form:** All fields empty
- **Submit Button:** Disabled
- **Character Count:** "0/1000"
- **Confirmation Checkbox:** Unchecked
- **New Total Score Preview:** Not shown

### Valid State
- **Form:** All required fields filled
- **Submit Button:** Enabled (if confirmation checked)
- **Character Count:** "X/1000" (within limit)
- **New Total Score Preview:** Calculated and displayed
- **Confirmation Checkbox:** Checked

### Invalid State
- **Form:** Required fields missing or invalid
- **Submit Button:** Disabled
- **Error Messages:** Display validation errors
- **Field Highlighting:** Invalid fields highlighted in red

### Loading State (Submitting)
- **Form:** Disabled (cannot edit)
- **Submit Button:** Loading spinner, "Overriding Score..."
- **Cancel Button:** Disabled

### Success State
- **Message:** "Score overridden successfully"
- **Action:** Modal closes after 2 seconds
- **Notification:** Success notification shown
- **Follow-up:** Redirect to score detail page with override indicator

### Error State
- **Message:** "Unable to override score"
- **Subtext:** Error message details
- **Action Button:** "Retry"
- **Form:** Re-enabled for editing

### Total Score Override State
- **Override Type:** Total Score Override selected
- **Affected Component:** Hidden
- **Current Value:** Shows total score only
- **New Value:** Direct input for total score
- **Preview:** New total score matches input value

### Component Score Override State
- **Override Type:** Component Score Override selected
- **Affected Component:** Shown and required
- **Current Value:** Shows total score and selected component score
- **New Value:** Input for component score
- **Preview:** New total score calculated automatically

---

## Business Rules

1. **Role Access:** Only MOH Tier 1 can override scores
2. **Context:** Modal accessible from score detail page
3. **Quick Action:** Intended as quick action, not full workflow
4. **Required Fields:**
   - Override Type
   - New Value (0-100)
   - Override Justification (minimum 50 characters)
   - Impact Assessment Confirmation
5. **Optional Fields:**
   - Affected Component (required if component override selected)
6. **Override Types:**
   - **Total Score Override:** Overrides total score directly
   - **Component Score Override:** Overrides component score, recalculates total
7. **Value Range:** New value must be between 0 and 100
8. **Decimal Precision:** 2 decimal places allowed
9. **Total Score Calculation:**
   - If total override: New total = input value
   - If component override: New total = Σ (Component Scores × Weights) with overridden component
10. **Character Limit:** 1000 characters for justification
11. **Impact Assessment:** User must confirm understanding before submission
12. **Audit Log:** All override actions logged in audit trail with:
    - Original value
    - Overridden value
    - Justification
    - User who performed override
    - Timestamp
13. **Score Adjustments:** Override visible in score adjustments history
14. **ECS Impact:** If CMC and ECS active, override may affect ECS auto-approval eligibility
15. **Notification:** Companies notified when published score is overridden
16. **Workflow:** Override creates adjustment record but doesn't change frozen score snapshot
17. **Multiple Overrides:** Can override multiple components, each creates separate adjustment record
18. **Modal Behavior:** Modal closes on successful submission or cancel (with confirmation if form has data)

---

## Related Documents

- [Compliance Score Detail Wireframe](./task-0.5.5.2-compliance-score-detail.md)
- [Score Review Tier 2 Flag Anomalies Modal](./task-0.5.5.4-score-review-tier2-flag-anomalies.md)
- [Routing Structure](../../../02-architecture/frontend/routing-structure.md) - CMC routes
- [Form Design Patterns](../../../02-architecture/frontend/form-design-patterns.md) - Form design patterns
- [Workflow Architecture](../../../02-architecture/workflow-architecture.md) - Compliance Score Calculation Workflow
- [CMC Component Weights](../../../02-architecture/modules/cmc-component-weights.md) - Score component definitions

---

**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Guided by:** Fatima (MOH Regulatory Requirements) & Dr. Samir (Business Process Validation)

