# Task 0.5.5.8: Dispute Creation Interface Wireframe

**Status:** ✅ Complete  
**Route:** `/cmc/disputes/create` or modal from score detail  
**File:** `task-0.5.5.8-dispute-creation-interface.png`  
**Priority:** 🟡 CMC Module

**Design Approach:** Dispute creation form with 30-day window indicator, dispute type selection, component selection, and evidence upload. Professional, accessible, and optimized for company dispute submission workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > CMC > Compliance Disputes > Create Dispute            │
│                                                             │
│ Create Compliance Dispute                                    │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ ⏱ Dispute Window: 30 days from score publication        ││
│ │                                                          ││
│ │ [Score Selection Dropdown ▼]                             ││
│ │                                                          ││
│ │ • December 2024: 78/100 (23 days remaining) ⏱          ││
│ │ • November 2024: 76/100 (Expired) ⚠                    ││
│ │ • October 2024: 74/100 (Expired) ⚠                     ││
│ │                                                          ││
│ │ Selected: December 2024 - 78/100                        ││
│ │ Days Remaining: 23 days ⏱                                ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Dispute Type *                                           ││
│ │                                                          ││
│ │ ○ Total Score Dispute                                    ││
│ │ ● Component Dispute                                      ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Disputed Component (if Component Dispute)                ││
│ │                                                          ││
│ │ [Select Component ▼]                                     ││
│ │                                                          ││
│ │ • Regulatory Reporting                                   ││
│ │ • Stock Threshold Violations                             ││
│ │ • Critical Medicine Coverage                             ││
│ │ • Non-Compliance Exposure                                ││
│ │ • Data Quality                                           ││
│ │ • Export Compliance                                      ││
│ │ • Replenishment Adherence                                ││
│ │                                                          ││
│ │ Selected: Stock Threshold Violations                    ││
│ │ Current Component Score: 75/100                         ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Dispute Reason *                                         ││
│ │                                                          ││
│ │ [Text Area - Explain why you are disputing this score...]││
│ │                                                          ││
│ │ Character count: 0/1000                                    ││
│ │                                                          ││
│ │ Required: Provide detailed explanation with specific    ││
│ │ reasons and context.                                    ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Supporting Evidence                                      ││
│ │                                                          ││
│ │ [Upload File] [Drag & Drop Area]                        ││
│ │                                                          ││
│ │ Supported formats: PDF, DOC, DOCX, XLS, XLSX, CSV,     ││
│ │ PNG, JPG (Max 10MB per file)                            ││
│ │                                                          ││
│ │ [No files selected]                                      ││
│ │                                                          ││
│ │ • evidence-001.pdf (2.5 MB) [Remove]                   ││
│ │ • evidence-002.xlsx (1.2 MB) [Remove]                   ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Dispute Summary                                          ││
│ │                                                          ││
│ │ Score Period: December 2024                              ││
│ │ Total Score: 78/100                                      ││
│ │ Dispute Type: Component Dispute                          ││
│ │ Disputed Component: Stock Threshold Violations          ││
│ │ Component Score: 75/100                                  ││
│ │                                                          ││
│ │ [Review Dispute Details]                                ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [Cancel]                                    [Submit Dispute] │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > CMC > Compliance Disputes > Create Dispute"
- **Title:** "Create Compliance Dispute"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **Cancel Button:** Secondary button
  - **Save Draft Button:** Secondary button (auto-save draft)

### Dispute Window Indicator
- **Layout:** Prominent alert card
- **Content:**
  - **Window Info:** "⏱ Dispute Window: 30 days from score publication"
  - **Score Selection Dropdown:** Select eligible score
  - **Score List:**
    - Each score shows: Period, Score, Days remaining or "Expired"
    - Eligible scores: Days remaining displayed with ⏱ icon
    - Expired scores: "Expired" label with ⚠ icon (disabled)
  - **Selected Score Display:**
    - Selected score period and score
    - Days remaining countdown
- **Styling:** Alert card with countdown indicator
- **Validation:** Must select eligible score (within 30-day window)

### Dispute Type Selection (Required)
- **Label:** "Dispute Type *"
- **Type:** Radio button group
- **Options:**
  1. **Total Score Dispute:** Disputes the total score
  2. **Component Dispute:** Disputes a specific component score (default)
- **Default:** Component Dispute
- **Styling:** Radio buttons with labels
- **Validation:** Required field

### Disputed Component Selection (Conditional)
- **Label:** "Disputed Component"
- **Type:** Dropdown/Select
- **Visibility:** Only shown if "Component Dispute" selected
- **Options:**
  - Regulatory Reporting
  - Stock Threshold Violations
  - Critical Medicine Coverage
  - Non-Compliance Exposure
  - Data Quality
  - Export Compliance (if ECS active)
  - Replenishment Adherence (if ECS active)
- **Selected Component Display:**
  - Selected component name
  - Current component score (e.g., "75/100")
- **Styling:** Standard dropdown with search (optional)
- **Validation:** Required if component dispute selected

### Dispute Reason (Required)
- **Label:** "Dispute Reason *"
- **Type:** Text area
- **Placeholder:** "Explain why you are disputing this score..."
- **Character Limit:** 1000 characters
- **Character Count:** Display "X/1000" characters remaining
- **Help Text:** "Required: Provide detailed explanation with specific reasons and context."
- **Validation:**
  - Required field
  - Minimum 50 characters
  - Maximum 1000 characters
- **Styling:** Multi-line text area with character counter

### Supporting Evidence Upload (Optional)
- **Label:** "Supporting Evidence"
- **Type:** File upload component
- **Features:**
  - **Upload Button:** Primary button to trigger file picker
  - **Drag & Drop Area:** Drop zone for dragging files
  - **File List:** Display uploaded files with remove option
  - **Progress Indicator:** Show upload progress
- **Supported Formats:**
  - PDF, DOC, DOCX, XLS, XLSX, CSV, PNG, JPG
- **File Size Limit:** Max 10MB per file
- **Multiple Files:** Allow multiple file uploads (max 5 files)
- **Validation:**
  - File size validation
  - File type validation
- **Styling:** Drag & drop area with dashed border

### Dispute Summary
- **Layout:** Summary card with key dispute information
- **Content:**
  - Score Period
  - Total Score
  - Dispute Type
  - Disputed Component (if component dispute)
  - Component Score (if component dispute)
- **Actions:**
  - **Review Dispute Details:** Link to score detail page
- **Styling:** Summary card with light background

### Form Footer
- **Actions:**
  - **Cancel Button:** Secondary button (left-aligned)
    - **Action:** Navigates back to disputes list (with confirmation if form has data)
  - **Submit Dispute Button:** Primary button (right-aligned)
    - **Action:** Submits dispute form
    - **Disabled State:** Disabled if form is invalid
- **Styling:** Button group with spacing

---

## Role-Based Access

### Company Users
- **Access:** Can create disputes for own company scores only
- **Score Selection:** Only eligible scores (within 30-day window) available
- **Actions:**
  - Select score to dispute
  - Select dispute type
  - Select disputed component (if component dispute)
  - Provide dispute reason
  - Upload supporting evidence
  - Submit dispute
- **Validation:**
  - Must select eligible score (within 30-day window)
  - Cannot dispute same score twice
  - Cannot dispute expired scores
- **Notifications:** Receive confirmation when dispute is submitted

### MOH Users
- **Access:** Cannot create disputes (review/resolve only)
- **View:** Can view submitted disputes

---

## State Variations

### Empty State (Initial)
- **Form:** All fields empty
- **Score Selection:** No score selected
- **Submit Button:** Disabled
- **Character Count:** "0/1000"
- **File List:** "No files selected"

### Valid State
- **Form:** All required fields filled
- **Score Selection:** Eligible score selected
- **Submit Button:** Enabled
- **Character Count:** "X/1000" (within limit)
- **File List:** Shows uploaded files with remove option

### Invalid State
- **Form:** Required fields missing or invalid
- **Submit Button:** Disabled
- **Error Messages:** Display validation errors
- **Field Highlighting:** Invalid fields highlighted in red

### Loading State (Submitting)
- **Form:** Disabled (cannot edit)
- **Submit Button:** Loading spinner, "Submitting Dispute..."
- **Cancel Button:** Disabled

### Success State
- **Message:** "Dispute submitted successfully"
- **Action:** Navigates to dispute detail page
- **Notification:** Success notification shown
- **Follow-up:** Dispute visible in disputes list with "Submitted" status

### Error State
- **Message:** "Unable to submit dispute"
- **Subtext:** Error message details
- **Action Button:** "Retry"
- **Form:** Re-enabled for editing

### Expired Score State
- **Score Selection:** Expired scores shown but disabled
- **Visual:** "Expired" label with ⚠ icon
- **Note:** Cannot select expired scores

### No Eligible Scores State
- **Message:** "No eligible scores available"
- **Subtext:** "You can dispute scores within 30 days of publication. Check back after the next score publication."
- **Action Button:** "View All Scores"

### File Upload States
- **Uploading:** Progress bar showing upload progress
- **Upload Complete:** File listed with remove option
- **Upload Error:** Error message displayed, file not added
- **File Size Error:** Error message: "File size exceeds 10MB limit"
- **File Type Error:** Error message: "Unsupported file format"
- **Maximum Files:** Error message: "Maximum 5 files allowed"

---

## Business Rules

1. **Role Access:** Only Company users can create disputes
2. **Dispute Window:** Companies have 30 days from score publication to submit disputes
3. **Score Eligibility:** Only published scores within 30-day window can be disputed
4. **Required Fields:**
   - Score Selection (must be eligible)
   - Dispute Type
   - Disputed Component (required if component dispute selected)
   - Dispute Reason (minimum 50 characters)
5. **Optional Fields:**
   - Supporting Evidence
6. **Dispute Types:**
   - **Total Score Dispute:** Disputes the total score
   - **Component Dispute:** Disputes a specific component score
7. **Character Limit:** 1000 characters for dispute reason
8. **File Upload:**
   - Max 5 files per dispute
   - Max 10MB per file
   - Supported formats: PDF, DOC, DOCX, XLS, XLSX, CSV, PNG, JPG
9. **Single Dispute:** Cannot dispute same score twice (one active dispute per score)
10. **Expired Scores:** Expired scores shown but disabled (cannot be selected)
11. **Dispute Status:** Disputes start with "Submitted" status
12. **Notification:** Companies receive confirmation when dispute is submitted
13. **Tier 2 Review:** Disputes go to Tier 2 for initial review
14. **Tier 1 Resolution:** Tier 1 resolves disputes after Tier 2 review
15. **Draft Saving:** Form auto-saves draft periodically
16. **Form Validation:** All required fields must be valid before submission
17. **Score Context:** Selected score information displayed in summary

---

## Related Documents

- [CMC Overview Wireframe](../overview/task-0.5.5.0-cmc-overview.md)
- [Compliance Disputes List Wireframe](./task-0.5.5.6-compliance-disputes-list.md)
- [Dispute Detail Wireframe](./task-0.5.5.7-dispute-detail.md)
- [Dispute Review Interface](./task-0.5.5.9-dispute-review-interface.md)
- [Compliance Score Detail Wireframe](../scores/task-0.5.5.2-compliance-score-detail.md)
- [Routing Structure](../../../02-architecture/frontend/routing-structure.md) - CMC routes
- [Form Design Patterns](../../../02-architecture/frontend/form-design-patterns.md) - Form design patterns
- [Workflow Architecture](../../../02-architecture/workflow-architecture.md) - Compliance Dispute Workflow

---

**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Guided by:** Fatima (MOH Regulatory Requirements) & Dr. Samir (Business Process Validation)

