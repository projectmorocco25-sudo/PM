# Task 0.5.5.4: Score Review - Tier 2 Flag Anomalies Modal Wireframe

**Status:** ✅ Complete  
**Route:** Modal (triggered from score detail page)  
**File:** `task-0.5.5.4-score-review-tier2-flag-anomalies.png`  
**Priority:** 🟡 CMC Module

**Design Approach:** Quick action modal for Tier 2 to flag anomalies in compliance scores. Contextual to score detail page, professional, accessible, and optimized for anomaly detection workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                   [Modal Overlay - Dimmed Background]       │
│                                                             │
│         ┌─────────────────────────────────────────────┐     │
│         │ Flag Anomalies                               │     │
│         │                                              │     │
│         │ Compliance Score: ABC Pharma Inc. - Dec 2024│     │
│         │ Score: 78/100                                │     │
│         │                                              │     │
│         │ ┌─────────────────────────────────────────┐ │     │
│         │ │ Anomaly Type *                           │ │     │
│         │ │                                          │ │     │
│         │ │ ○ Unexpected Score Change                │ │     │
│         │ │ ○ Component Score Discrepancy            │ │     │
│         │ │ ○ Data Quality Issue                     │ │     │
│         │ │ ○ Calculation Error                      │ │     │
│         │ │ ○ Other                                  │ │     │
│         │ └─────────────────────────────────────────┘ │     │
│         │                                              │     │
│         │ ┌─────────────────────────────────────────┐ │     │
│         │ │ Affected Component                      │ │     │
│         │ │                                          │ │     │
│         │ │ [Select Component ▼]                    │ │     │
│         │ │                                          │ │     │
│         │ │ • Regulatory Reporting                  │ │     │
│         │ │ • Stock Threshold Violations            │ │     │
│         │ │ • Critical Medicine Coverage            │ │     │
│         │ │ • Non-Compliance Exposure               │ │     │
│         │ │ • Data Quality                          │ │     │
│         │ │ • Export Compliance                     │ │     │
│         │ │ • Replenishment Adherence               │ │     │
│         │ │ • Total Score                           │ │     │
│         │ └─────────────────────────────────────────┘ │     │
│         │                                              │     │
│         │ ┌─────────────────────────────────────────┐ │     │
│         │ │ Anomaly Description *                   │ │     │
│         │ │                                          │ │     │
│         │ │ [Text Area - Describe the anomaly...]   │ │     │
│         │ │                                          │ │     │
│         │ │ Character count: 0/500                   │ │     │
│         │ └─────────────────────────────────────────┘ │     │
│         │                                              │     │
│         │ ┌─────────────────────────────────────────┐ │     │
│         │ │ Supporting Evidence                      │ │     │
│         │ │                                          │ │     │
│         │ │ [Upload File] [Drag & Drop Area]        │ │     │
│         │ │                                          │ │     │
│         │ │ Supported formats: PDF, DOC, DOCX, XLS, │ │     │
│         │ │ XLSX, CSV, PNG, JPG (Max 10MB)          │ │     │
│         │ │                                          │ │     │
│         │ │ [No files selected]                      │ │     │
│         │ └─────────────────────────────────────────┘ │     │
│         │                                              │     │
│         │ ┌─────────────────────────────────────────┐ │     │
│         │ │ Priority Level                           │ │     │
│         │ │                                          │ │     │
│         │ │ ○ Low                                    │ │     │
│         │ │ ○ Medium                                 │ │     │
│         │ │ ● High                                   │ │     │
│         │ │ ○ Critical                               │ │     │
│         │ └─────────────────────────────────────────┘ │     │
│         │                                              │     │
│         │ [Cancel]                    [Flag Anomaly] │     │
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
- **Title:** "Flag Anomalies"
  - **Typography:** 20px, font-weight: 600, color: #111827
- **Score Context:**
  - **Company Name:** "ABC Pharma Inc. - Dec 2024"
  - **Score:** "Score: 78/100"
  - **Typography:** 14px, color: #6b7280
- **Close Button:** X button (top-right corner)

### Modal Body

#### Anomaly Type Selection (Required)
- **Label:** "Anomaly Type *"
- **Type:** Radio button group
- **Options:**
  1. **Unexpected Score Change:** Score changed dramatically vs previous periods
  2. **Component Score Discrepancy:** Component score doesn't match expected value
  3. **Data Quality Issue:** Suspected data quality problem affecting calculation
  4. **Calculation Error:** Suspected error in calculation logic
  5. **Other:** Other anomaly type (requires description)
- **Styling:** Radio buttons with labels
- **Validation:** Required field

#### Affected Component Selection (Optional)
- **Label:** "Affected Component"
- **Type:** Dropdown/Select
- **Options:**
  - Regulatory Reporting
  - Stock Threshold Violations
  - Critical Medicine Coverage
  - Non-Compliance Exposure
  - Data Quality
  - Export Compliance (if ECS active)
  - Replenishment Adherence (if ECS active)
  - Total Score (for overall anomalies)
- **Styling:** Standard dropdown with search (optional)
- **Validation:** Optional field

#### Anomaly Description (Required)
- **Label:** "Anomaly Description *"
- **Type:** Text area
- **Placeholder:** "Describe the anomaly in detail..."
- **Character Limit:** 500 characters
- **Character Count:** Display "X/500" characters remaining
- **Validation:**
  - Required field
  - Minimum 20 characters
  - Maximum 500 characters
- **Styling:** Multi-line text area with character counter

#### Supporting Evidence Upload (Optional)
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

#### Priority Level Selection (Required)
- **Label:** "Priority Level"
- **Type:** Radio button group
- **Options:**
  1. **Low:** Minor anomaly, low impact
  2. **Medium:** Moderate anomaly, moderate impact
  3. **High:** Significant anomaly, high impact (default)
  4. **Critical:** Critical anomaly, urgent review required
- **Default:** High
- **Styling:** Radio buttons with labels
- **Validation:** Required field

### Modal Footer
- **Actions:**
  - **Cancel Button:** Secondary button (left-aligned)
    - **Action:** Closes modal (with confirmation if form has data)
  - **Flag Anomaly Button:** Primary button (right-aligned)
    - **Action:** Submits form and flags anomaly
    - **Disabled State:** Disabled if form is invalid
- **Styling:** Button group with spacing

---

## Role-Based Access

### MOH Tier 2
- **Access:** Can flag anomalies on any compliance score
- **Actions:**
  - Select anomaly type
  - Select affected component
  - Describe anomaly
  - Upload supporting evidence
  - Set priority level
  - Submit flag
- **Notifications:** Tier 1 receives notification when anomaly is flagged
- **Follow-up:** Can view status of flagged anomalies

### MOH Tier 1
- **Access:** Cannot flag anomalies (override functionality instead)
- **View:** Can see flagged anomalies in score detail page

### Company Users
- **Access:** Cannot flag anomalies (dispute functionality instead)
- **View:** Cannot see flagged anomalies

---

## State Variations

### Empty State (Initial)
- **Form:** All fields empty
- **Submit Button:** Disabled
- **Character Count:** "0/500"
- **File List:** "No files selected"

### Valid State
- **Form:** All required fields filled
- **Submit Button:** Enabled
- **Character Count:** "X/500" (within limit)
- **File List:** Shows uploaded files with remove option

### Invalid State
- **Form:** Required fields missing or invalid
- **Submit Button:** Disabled
- **Error Messages:** Display validation errors
- **Field Highlighting:** Invalid fields highlighted in red

### Loading State (Submitting)
- **Form:** Disabled (cannot edit)
- **Submit Button:** Loading spinner, "Flagging..."
- **Cancel Button:** Disabled

### Success State
- **Message:** "Anomaly flagged successfully"
- **Action:** Modal closes after 2 seconds
- **Notification:** Success notification shown
- **Follow-up:** Redirect to score detail page with anomaly indicator

### Error State
- **Message:** "Unable to flag anomaly"
- **Subtext:** Error message details
- **Action Button:** "Retry"
- **Form:** Re-enabled for editing

### File Upload States
- **Uploading:** Progress bar showing upload progress
- **Upload Complete:** File listed with remove option
- **Upload Error:** Error message displayed, file not added
- **File Size Error:** Error message: "File size exceeds 10MB limit"
- **File Type Error:** Error message: "Unsupported file format"

---

## Business Rules

1. **Role Access:** Only MOH Tier 2 can flag anomalies
2. **Context:** Modal accessible from score detail page
3. **Quick Action:** Intended as quick action, not full workflow
4. **Required Fields:**
   - Anomaly Type
   - Anomaly Description (minimum 20 characters)
   - Priority Level
5. **Optional Fields:**
   - Affected Component
   - Supporting Evidence
6. **File Upload:**
   - Max 5 files per flag
   - Max 10MB per file
   - Supported formats: PDF, DOC, DOCX, XLS, XLSX, CSV, PNG, JPG
7. **Character Limit:** 500 characters for description
8. **Priority Levels:** Low, Medium, High (default), Critical
9. **Notification:** Tier 1 receives notification when anomaly is flagged
10. **Audit Log:** All flag actions logged in audit trail
11. **Follow-up:** Flagged anomalies visible in score detail page
12. **Status Tracking:** Flagged anomalies have status (pending, reviewed, resolved)
13. **Workflow:** Tier 1 reviews flagged anomalies and can override score if needed
14. **Multiple Flags:** Can flag multiple anomalies on same score
15. **Modal Behavior:** Modal closes on successful submission or cancel (with confirmation if form has data)

---

## Related Documents

- [Compliance Score Detail Wireframe](./task-0.5.5.2-compliance-score-detail.md)
- [Score Review Tier 1 Override Modal](./task-0.5.5.5-score-review-tier1-override.md)
- [Routing Structure](../../../02-architecture/frontend/routing-structure.md) - CMC routes
- [Form Design Patterns](../../../02-architecture/frontend/form-design-patterns.md) - Form design patterns
- [Workflow Architecture](../../../02-architecture/workflow-architecture.md) - Compliance Score Calculation Workflow

---

**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Guided by:** Fatima (MOH Regulatory Requirements) & Dr. Samir (Business Process Validation)

