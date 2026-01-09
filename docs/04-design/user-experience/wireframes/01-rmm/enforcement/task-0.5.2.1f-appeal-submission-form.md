# Task 0.5.2.1f: Appeal Submission Form Wireframe

**Status:** 🟡 In Progress  
**Route:** `/enforcement/actions/[id]/appeal` (Company users only)  
**File:** `task-0.5.2.1f-appeal-submission-form.png`  
**Priority:** 🔴 Core RMM Workflows

**Design Approach:** Modern form for companies to submit appeals of enforcement actions. Professional, accessible, and optimized for company appeal submission workflows with document upload support.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > Enforcement > Actions > ENF-2025-001 > Appeal         │
│                                                             │
│ Submit Appeal - ENF-2025-001                               │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Enforcement Action Summary                              ││
│ │                                                          ││
│ │ Action ID: ENF-2025-001                                 ││
│ │ Type: ⚠️ Warning                                        ││
│ │ Violation: Submission Non-Compliance                    ││
│ │ Executed: 2 days ago                                    ││
│ │                                                          ││
│ │ Legal Basis: Article 12, Section 3                      ││
│ │ Justification: [View Full Justification]                ││
│ │                                                          ││
│ │ Appeal Deadline: 28 days remaining                      ││
│ │ (30-day window per DMP regulations)                     ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Appeal Form                                              ││
│ │                                                          ││
│ │ Grounds for Appeal *                                     ││
│ │                                                          ││
│ │ [Select Grounds for Appeal ▼]                           ││
│ │                                                          ││
│ │ • Technical Error                                        ││
│ │ • Procedural Issue                                       ││
│ │ • Factual Inaccuracy                                     ││
│ │ • Mitigating Circumstances                               ││
│ │ • Other                                                  ││
│ │                                                          ││
│ │ ℹ️ Select the primary reason for your appeal.           ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Detailed Explanation *                                   ││
│ │                                                          ││
│ │ [Minimum 50 characters required]                          ││
│ │                                                          ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │ Enter detailed explanation of your appeal.        │ ││
│ │ │ Include specific details about why you believe    │ ││
│ │ │ the enforcement action should be reconsidered.    │ ││
│ │ │ Provide context, timeline, and any relevant       │ ││
│ │ │ information that supports your appeal.            │ ││
│ │ │                                                     │ ││
│ │ │                                                     │ ││
│ │ └────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ Character count: 0 / 50 minimum                         ││
│ │                                                          ││
│ │ ℹ️ Your explanation will be reviewed by MOH Tier 1.   ││
│ │    Be as detailed and specific as possible.            ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Supporting Documents (Optional)                          ││
│ │                                                          ││
│ │ Upload documents that support your appeal:              ││
│ │                                                          ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │ [Upload Files] or [Drag & Drop]                   ││
│ │ │                                                    ││
│ │ │ Supported formats: PDF, DOC, DOCX, XLS, XLSX,    ││
│ │ │ JPG, PNG (Max 10 MB per file, 5 files maximum)   ││
│ │ │                                                    ││
│ │ │ • system-outage-report.pdf (2.3 MB)               ││
│ │ │   [Remove]                                        ││
│ │ │                                                    ││
│ │ │ • submission-attempt-log.pdf (1.1 MB)             ││
│ │ │   [Remove]                                        ││
│ │ └────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ ℹ️ Upload evidence, documentation, or other          ││
│ │    materials that support your appeal grounds.         ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Appeal Information                                       ││
│ │                                                          ││
│ │ ⚠️ Important Information:                               ││
│ │                                                          ││
│ │ • Appeals are reviewed by MOH Tier 1                    ││
│ │ • You will be notified of the decision within           ││
│ │   14 business days                                       ││
│ │ • The appeal decision is final                           ││
│ │ • All appeal information is preserved in audit trail    ││
│ │                                                          ││
│ │ [View Appeal Process Guide]                             ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [Cancel]                                    [Submit Appeal] │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > Enforcement > Actions > [Action ID] > Appeal"
- **Title:** "Submit Appeal - [Action ID]"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **Cancel Button:** Secondary button
  - **Submit Appeal Button:** Primary button (disabled until validations pass)

### Enforcement Action Summary Section
- **Layout:** Card with key enforcement action information
- **Fields:**
  - **Action ID:** Enforcement action identifier
  - **Type:** Action type with icon (⚠️ Warning, 💰 Fine, 🚫 Suspension)
  - **Violation:** Violation type description
  - **Executed:** Execution date
  - **Legal Basis:** Legal basis reference
  - **Justification:** Link to view full justification
  - **Appeal Deadline:** Days remaining in 30-day window
  - **Appeal Window Note:** "30-day window per DMP regulations"
- **Purpose:** Provide context for appeal submission
- **Styling:**
  - **Appeal Deadline:** Highlighted if within 7 days remaining
  - **Read-only:** All fields are read-only (for reference only)

### Appeal Form Section

#### Grounds for Appeal Field
- **Input Type:** Dropdown/Select
- **Label:** "Grounds for Appeal *"
- **Options:**
  - Technical Error
  - Procedural Issue
  - Factual Inaccuracy
  - Mitigating Circumstances
  - Other
- **Validation:** Required field
- **Help Text:** "Select the primary reason for your appeal"

#### Detailed Explanation Field
- **Input Type:** Multi-line textarea
- **Label:** "Detailed Explanation *"
- **Minimum Length:** 50 characters
- **Character Counter:** Shows current count / minimum
- **Placeholder:** Guidance text on what to include
- **Validation:** Required, minimum 50 characters
- **Help Text:** "Your explanation will be reviewed by MOH Tier 1. Be as detailed and specific as possible."

#### Supporting Documents Field
- **Input Type:** File upload component
- **Label:** "Supporting Documents (Optional)"
- **Upload Methods:**
  - File picker button
  - Drag and drop area
- **File Restrictions:**
  - **Supported Formats:** PDF, DOC, DOCX, XLS, XLSX, JPG, PNG
  - **Max File Size:** 10 MB per file
  - **Max Files:** 5 files maximum
- **File List Display:**
  - File name
  - File size
  - Remove button for each file
- **Help Text:** "Upload evidence, documentation, or other materials that support your appeal grounds"
- **Validation:** Optional field, but if files uploaded, validate format and size

### Appeal Information Section
- **Layout:** Info banner/card
- **Content:**
  - Important information about appeal process
  - Review timeline (14 business days)
  - Finality of decision
  - Audit trail note
  - Link to appeal process guide
- **Styling:** Light background (#eff6ff), info icon, dismissible

### Action Buttons
- **Cancel:** Secondary button (left-aligned)
  - **Action:** Cancel appeal submission, return to enforcement action detail
- **Submit Appeal:** Primary button (right-aligned)
  - **Action:** Submit appeal for MOH Tier 1 review
  - **Disabled State:** Disabled until all validations pass
- **Layout:** Right-aligned, 16px spacing between buttons

---

## Role-Based Access

### Company Users
- **Full Access:** Can submit appeals for their company's enforcement actions
- **Restrictions:**
  - Only within 30-day appeal window
  - Only for executed enforcement actions
  - Cannot appeal if appeal already submitted
- **Actions:** Submit Appeal, Cancel

### Company Admin
- **Full Access:** Can submit appeals for their company's enforcement actions
- **Same restrictions as Company Users**

### MOH Tier 1
- **No Access:** Cannot use appeal submission form (uses appeal review interface)
- **View Only:** Can view submitted appeals on enforcement action detail page

### MOH Tier 2
- **No Access:** Cannot use appeal submission form
- **View Only:** Can view submitted appeals on enforcement action detail page

---

## State Variations

### Initial State (Empty)
- **Grounds for Appeal:** Not selected (required)
- **Detailed Explanation:** Empty (required, minimum 50 characters)
- **Supporting Documents:** No files uploaded
- **Submit Button:** Disabled

### Valid State
- **All Fields Valid:** Grounds selected, explanation meets minimum, files valid (if uploaded)
- **Submit Button:** Enabled
- **Visual Indicators:** Green checkmarks on valid fields

### Invalid State
- **Validation Errors:** Red borders on invalid fields
- **Error Messages:** Inline error messages
- **Submit Button:** Disabled
- **Error Types:**
  - Grounds not selected
  - Explanation too short
  - File format invalid
  - File size exceeds limit
  - Too many files uploaded

### File Upload States
- **Uploading:** Show progress indicator for each file
- **Upload Success:** Show checkmark, file in list
- **Upload Error:** Show error message, allow retry
- **File List:** Show all uploaded files with remove option

### Loading State (After Submit)
- **Submit Button:** Shows loading spinner
- **Form:** Disabled during submission
- **Success:** Navigate to enforcement action detail, show success notification, update appeal status

### Appeal Window Expired State
- **Message:** "Appeal window has expired. Appeals must be submitted within 30 days of execution."
- **Submit Button:** Disabled
- **Visual Indicator:** Warning banner

### Appeal Already Submitted State
- **Message:** "An appeal has already been submitted for this enforcement action."
- **Link:** "View Appeal Status" button
- **Submit Button:** Hidden

---

## Responsive Design

### Desktop (≥1024px)
- **Layout:** Full-width form, max-width 800px centered
- **Sections:** Stacked vertically
- **Inputs:** Full-width inputs
- **File Upload:** Full-width with drag and drop area

### Tablet (768px - 1023px)
- **Layout:** Stacked sections
- **Inputs:** Full-width inputs
- **File Upload:** Full-width with drag and drop area

### Mobile (<768px)
- **Layout:** Single column
- **Inputs:** Full-width inputs
- **Buttons:** Full-width, stacked
- **File Upload:** Full-width, drag and drop may be limited

---

## Interactions

### Click Actions
- **Cancel:** Return to enforcement action detail page
- **Submit Appeal:** Submit appeal form
- **View Full Justification:** Expand or navigate to full justification
- **Upload Files:** Open file picker
- **Remove File:** Remove file from upload list
- **View Appeal Process Guide:** Navigate to appeal process documentation

### Input Interactions
- **Grounds Selection:**
  - Update form state
  - May show additional guidance based on selection
- **Explanation Input:**
  - Real-time character count
  - Validation on blur
  - Auto-save draft (optional)
- **File Upload:**
  - Drag and drop files
  - Validate on drop/select
  - Show upload progress
  - Remove files before submission

### Keyboard Navigation
- **Tab:** Navigate through form fields
- **Enter:** Submit form (if valid)
- **Escape:** Cancel (close form)
- **Arrow Keys:** Navigate dropdown options

---

## Design System References

### Components Used
- **Form Component:** Appeal submission form (shadcn/ui form)
- **Select Component:** Grounds for appeal dropdown (shadcn/ui select)
- **Textarea Component:** Explanation input (shadcn/ui textarea)
- **File Upload Component:** Document upload (shadcn/ui file-upload)
- **Button Component:** Action buttons (shadcn/ui button)
- **Card Component:** Summary, info sections (shadcn/ui card)
- **Alert Component:** Info banner (shadcn/ui alert)
- **Icon Component:** Action icons (Lucide React via shadcn/ui)

### Design Inspiration References
- **Stripe Dashboard:** https://dashboard.stripe.com - Professional form patterns
- **GitHub:** https://github.com - Clean forms, validation patterns
- **Linear App:** https://linear.app - Modern forms, smooth interactions
- **shadcn/ui Components:** https://ui.shadcn.com - Component patterns

### Colors (From Design System)
- **Background:** #ffffff (white) - Clean, professional
- **Input Border:** #d1d5db (border-default) - Default state
- **Input Border Focus:** #3b82f6 (primary-500) - Focus state
- **Input Border Error:** #ef4444 (error-500) - Error state
- **Input Border Valid:** #10b981 (success-500) - Valid state
- **Text Primary:** #111827 (text-primary)
- **Text Secondary:** #6b7280 (text-secondary)
- **Alert Background:** #eff6ff (info background)
- **Warning Background:** #fef3c7 (warning background)

### Typography (From Design System)
- **Page Title:** 24px, font-weight: 600, color: #111827
- **Section Title:** 18px, font-weight: 600
- **Label:** 14px, font-weight: 500, color: #6b7280
- **Input Text:** 14px, font-weight: 400
- **Help Text:** 12px, font-weight: 400, color: #6b7280
- **Button Text:** 14px, font-weight: 500

### Spacing (8px Grid System)
- **Page Padding:** 24px (3 × 8px)
- **Section Spacing:** 16px (2 × 8px) between sections
- **Input Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)
- **Button Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)
- **Button Spacing:** 16px (2 × 8px) between buttons

### Transitions & Animations
- **Input Focus:** 200ms ease-in-out
- **Validation State Change:** 200ms ease-in-out
- **Button Hover:** 150ms ease-in-out
- **File Upload:** 200ms ease-in-out (drag and drop feedback)

### Accessibility (WCAG 2.1 AA Compliance)
- **Color Contrast:** Minimum 4.5:1 for text, 3:1 for UI components
- **Focus Indicators:** 2px solid outline, #3b82f6 (primary-500), 2px offset
- **Keyboard Navigation:** Full keyboard support (Tab, Enter, Escape, Arrow keys)
- **Screen Reader Support:** ARIA labels, roles, and descriptions
- **ARIA Labels:** Descriptive labels for all inputs and buttons
- **Error Announcements:** ARIA live regions for validation errors
- **Required Fields:** Clear indication (asterisk, label, or both)
- **File Upload:** Accessible file input with proper labels

---

## Industry Best Practices Implementation

### Performance Optimizations
- **Draft Auto-save:** Auto-save draft appeal (optional, debounced)
- **Debounced Validation:** Debounce validation checks (300ms)
- **File Upload:** Chunked upload for large files
- **Image Preview:** Generate previews for image files

### State Management
- **Form State:** Track all input values, validation status
- **File Upload State:** Track file upload progress, errors
- **Validation State:** Track field-level and form-level validation
- **Draft State:** Save and restore draft appeals

### Error Handling
- **Input Validation:** Real-time validation with clear error messages
- **File Upload Errors:** Display error message if upload fails
- **Submission Errors:** Display error message if submission fails
- **Retry Logic:** Allow retry on submission failure
- **Network Errors:** Handle network failures gracefully

### Security Considerations
- **File Validation:** Validate file types and sizes on client and server
- **File Scanning:** Scan uploaded files for malware (server-side)
- **Rate Limiting:** Prevent appeal spam
- **CSRF Protection:** Include CSRF tokens in form submission

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/enforcement/actions/[id]/appeal`
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference including DMP regulations
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - Detailed compliance requirements including appeal requirements
- [Regulatory Policies](../../../../03-governance/regulatory-policies.md) - Regulatory policies including enforcement and appeal policies
- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md) - Form validation, file uploads
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Form, Select, Textarea, File Upload components
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - Role-based access

---

## Related Wireframes

- [Enforcement Action Detail](task-0.5.2.1a-enforcement-action-detail.md) - Enforcement action detail page with appeal section
- [Appeal Review Interface](task-0.5.2.1e-appeal-review-interface.md) - MOH Tier 1 appeal review interface
- [Company Dashboard](../../../00-core-foundation/dashboard/task-0.5.1.18-company-dashboard.md) - Company dashboard with appeal modal

---

**Next:** [Enforcement Reports](task-0.5.2.1d-enforcement-reports.md)

