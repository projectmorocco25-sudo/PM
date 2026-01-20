# Task 0.5.4.2: Export Request Form Wireframe

**Status:** ✅ Complete  
**Route:** `/ecs/export-requests/new` (create) or `/ecs/export-requests/[id]/edit` (edit, draft only)  
**File:** `task-0.5.4.2-export-request-form.png`  
**Priority:** 🟡 ECS Module

**Design Approach:** Modern form pattern for creating export requests with SKU selection, destination, timeline, and documentation upload. Professional, accessible, and optimized for export control workflows with draft auto-save and validation.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > ECS > Export Requests > [New Request | Edit Request]  │
│                                                             │
│ Create Export Request               [Save Draft] [Cancel]  │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Request Information                                      ││
│ │                                                          ││
│ │ SKU Selection *                                         ││
│ │ [Search SKUs...]                    [View SKU Details]  ││
│ │                                                          ││
│ │ Selected SKU:                                           ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │ SKU001 - Product A / 500mg / Tablet                │ ││
│ │ │ Current Stock: 5,000 units                         │ ││
│ │ │ VCI Threshold: 3,000 units                         │ ││
│ │ │ ECS Threshold: N/A (not calculated yet)            │ ││
│ │ │ Company: ABC Pharmaceuticals Inc.                  │ ││
│ │ │ [Remove]                                            │ ││
│ │ └────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ ℹ️ Only SKUs from your company's products can be      ││
│ │    selected for export requests.                       ││
│ │                                                          ││
│ │ Regulatory Authorization (Fatima's Requirement):       ││
│ │ • Regulatory Basis: DMP Regulation Article [X] -       ││
│ │   Export Control                                        ││
│ │ • Legal Authority: [Legal citation]                    ││
│ │ • Regulatory Requirement Checklist:                    ││
│ │   ☑ Export control requirements reviewed              ││
│ │   ☑ Threshold compliance verified                      ││
│ │   ☐ [Other requirements as applicable]                 ││
│ │ [View Regulatory Framework]                            ││
│ │                                                          ││
│ │ Export Destination *                                   ││
│ │ [____________________________________________]         ││
│ │ Placeholder: "Enter destination country/region..."    ││
│ │                                                          ││
│ │ Expected Export Quantity *                             ││
│ │ [_________________] units                               ││
│ │                                                          ││
│ │ ℹ️ Quantity must not exceed current stock level.      ││
│ │    Current stock: 5,000 units                         ││
│ │                                                          ││
│ │ Expected Export Date *                                 ││
│ │ [📅 Date Picker]                                       ││
│ │                                                          ││
│ │ Timeline / Purpose                                     ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │ [Enter export timeline and purpose...]             │ ││
│ │ │                                                     │ ││
│ │ │ (Optional: Describe export timeline, destination,  │ ││
│ │ │  and regulatory purpose)                           │ ││
│ │ └────────────────────────────────────────────────────┘ ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Threshold Comparison (Read-Only)                        ││
│ │                                                          ││
│ │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       ││
│ │ │ Current     │ │ VCI         │ │ ECS         │       ││
│ │ │ Stock       │ │ Threshold   │ │ Threshold   │       ││
│ │ │             │ │             │ │             │       ││
│ │ │ 5,000 units │ │ 3,000 units │ │ N/A         │       ││
│ │ │             │ │             │ │ (will calc.)│       ││
│ │ │ [Bar Chart] │ │ [Bar Chart] │ │ [Bar Chart] │       ││
│ │ └─────────────┘ └─────────────┘ └─────────────┘       ││
│ │                                                          ││
│ │ ℹ️ ECS Threshold will be calculated after submission   ││
│ │    based on XAMS (X-month average of MSQ data).        ││
│ │    Threshold switching (VCI → ECS) occurs on           ││
│ │    authorization for 3 months.                         ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Documentation Upload                                     ││
│ │                                                          ││
│ │ Supporting Documents (Optional)                         ││
│ │                                                          ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │ [Drag & Drop Files Here]                           │ ││
│ │ │                                                     │ ││
│ │ │ or                                                  │ ││
│ │ │                                                     │ ││
│ │ │ [Browse Files]                                     │ ││
│ │ └────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ Accepted Formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG  ││
│ │ Max File Size: 5MB per file                            ││
│ │ Max Files: 10 attachments                              ││
│ │                                                          ││
│ │ Uploaded Files:                                         ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │ 📄 export-certificate.pdf           (2.3 MB) [✕]  │ ││
│ │ │ 📄 regulatory-approval.pdf          (1.8 MB) [✕]  │ ││
│ │ └────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ ℹ️ Files are scanned for viruses and validated        ││
│ │    before upload completion.                           ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Conditional Validation Status (Read-Only)               ││
│ │                                                          ││
│ │ CMC Module Status: Active                               ││
│ │ Your Compliance Score: 78/100                           ││
│ │                                                          ││
│ │ Conditional Validation:                                 ││
│ │ • Score ≥ 75: Auto-approval queue (✓ Eligible)        ││
│ │ • Score 60-74: Tier 2 verification required            ││
│ │ • Score < 60: Manual review required                   ││
│ │                                                          ││
│ │ ℹ️ Your request will be evaluated based on your       ││
│ │    current compliance score after submission.          ││
│ │    Score is recalculated monthly or after major        ││
│ │    events (breaches, enforcement actions, exports).    ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Draft Auto-Save Indicator                               ││
│ │                                                          ││
│ │ 💾 Draft saved automatically - Last saved: 2 minutes ago││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│                                                             │
│ [Cancel]                          [Save Draft] [Submit Request]│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > ECS > Export Requests > New Request" or "Home > ECS > Export Requests > Edit Request"
- **Title:** "Create Export Request" (new) or "Edit Export Request" (edit)
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **Save Draft Button:** Secondary button (always available)
  - **Cancel Button:** Secondary button (navigate back)
  - **Submit Request Button:** Primary button (disabled until all required fields valid)

### Request Information Section
- **Layout:** Card with form fields
- **Fields:**
  1. **SKU Selection:**
     - **Type:** Search/select dropdown with SKU picker
     - **Required:** Yes (marked with *)
     - **Placeholder:** "Search SKUs..."
     - **Functionality:**
       - Search by SKU ID, product name, dosage form, strength
       - Auto-complete dropdown with SKU details
       - Filter: Only shows SKUs from user's company
       - Selected SKU display card with:
         - SKU ID and full description (product/dosage form/strength)
         - Current stock level (read-only)
         - VCI Threshold (read-only)
         - ECS Threshold (N/A until calculated after submission)
         - Company name (read-only)
         - Remove button
     - **Validation:** Required, must be valid SKU from user's company
     - **Error Message:** "SKU selection is required" or "Invalid SKU selected"
     - **Helper Text:** "Only SKUs from your company's products can be selected for export requests."
     - **View Details:** Button to open SKU detail modal/page
  
  2. **Export Destination:**
     - **Type:** Text input
     - **Required:** Yes (marked with *)
     - **Placeholder:** "Enter destination country/region..."
     - **Validation:** Required, min 2 characters, max 200 characters
     - **Error Message:** "Export destination is required"
  
  3. **Expected Export Quantity:**
     - **Type:** Number input
     - **Required:** Yes (marked with *)
     - **Placeholder:** "Enter quantity..."
     - **Validation:** 
       - Required
       - Must be positive integer
       - Must not exceed current stock level
     - **Error Message:** 
       - "Quantity is required"
       - "Quantity must be a positive number"
       - "Quantity cannot exceed current stock level (5,000 units)"
     - **Helper Text:** "Quantity must not exceed current stock level. Current stock: [X] units"
     - **Stock Level Display:** Shows current stock level (read-only)
  
  4. **Expected Export Date:**
     - **Type:** Date picker
     - **Required:** Yes (marked with *)
     - **Validation:** Required, must be future date (not today or past)
     - **Error Message:** "Expected export date is required" or "Date must be in the future"
     - **Helper Text:** "Select the expected date for export"
  
  5. **Timeline / Purpose:**
     - **Type:** Textarea (multi-line)
     - **Required:** No (optional)
     - **Placeholder:** "Enter export timeline and purpose..."
     - **Max Length:** 1000 characters
     - **Helper Text:** "Optional: Describe export timeline, destination, and regulatory purpose"

### Threshold Comparison Section (Read-Only)
- **Layout:** Card with three-column comparison display
- **Content:**
  - **Current Stock:** 
    - Value display
    - Bar chart visualization
    - Source: Real-time stock level from VCI
  - **VCI Threshold:**
    - Value display
    - Bar chart visualization
    - Source: Current threshold from thresholds table
  - **ECS Threshold:**
    - Value display (N/A until calculated)
    - Bar chart visualization (grayed out if N/A)
    - Source: Calculated after submission using XAMS
    - **Note:** "Will be calculated after submission based on XAMS"
- **Visual Comparison:** 
  - Bar charts side-by-side for easy comparison
  - Color coding: Stock (blue), VCI Threshold (green), ECS Threshold (orange)
- **Helper Text:** 
  - "ECS Threshold will be calculated after submission based on XAMS (X-month average of MSQ data)."
  - "Threshold switching (VCI → ECS) occurs on authorization for 3 months."

### Documentation Upload Section
- **Layout:** Card with file upload component
- **Component:** FileUpload component with drag-and-drop
- **Label:** "Supporting Documents (Optional)"
- **Accepted Formats:** PDF, DOC, DOCX, XLS, XLSX, JPG, PNG
- **Max File Size:** 5MB per file
- **Max Files:** 10 attachments
- **Features:**
  - Drag-and-drop zone
  - Browse button
  - File list with:
    - File name
    - File size
    - Remove button (✕)
    - Upload progress indicator
    - Upload status (uploading, uploaded, error)
- **Validation:**
  - File type validation
  - File size validation
  - Virus scanning (backend)
  - Security validation per `file-upload-storage-security.md`
- **Helper Text:** "Files are scanned for viruses and validated before upload completion."
- **Upload Flow:**
  1. User selects/uploads file
  2. Client-side validation (type, size)
  3. Upload to Supabase Storage (progress indicator)
  4. Backend virus scanning and security validation
  5. File record created in `file_uploads` table
  6. File linked to export request

### Conditional Validation Status Section (Read-Only)
- **Layout:** Card with status information
- **Content:**
  - **CMC Module Status:** Active/Inactive indicator
  - **Current Compliance Score:** Display with score out of 100
  - **Conditional Validation Rules:**
    - Score ≥ 75: Auto-approval queue (checkmark if eligible)
    - Score 60-74: Tier 2 verification required
    - Score < 60: Manual review required
  - **Current Status:** Highlighted based on user's score
- **Helper Text:**
  - "Your request will be evaluated based on your current compliance score after submission."
  - "Score is recalculated monthly or after major events (breaches, enforcement actions, exports)."
- **Visibility:** Only shown when CMC module is active
- **If CMC Inactive:** Show message: "CMC module is inactive. Requests will be evaluated by standard review process."

### Draft Auto-Save Indicator
- **Layout:** Banner at bottom of form
- **Content:** "💾 Draft saved automatically - Last saved: [time] ago"
- **Functionality:**
  - Auto-saves draft every 30 seconds or on field blur
  - Shows last save timestamp
  - Visual indicator (icon + text)
- **Styling:** Subtle background color (#f0f9ff), padding 8px

---

## Role-Based Access

### Company Users (IPC only)
- **Create Access:** Can create export requests for own company SKUs
- **Edit Access:** Can edit own draft requests only (before submission)
- **View:** Can see threshold comparison, conditional validation status
- **Submit:** Can submit requests (moves to `submitted` state)
- **Cancel:** Can cancel draft/submitted requests (before authorization)

### MOH Tier 1
- **No Create Access:** Cannot create export requests (read-only for requests)
- **Actions:** Approve, reject, intervene (on list/detail pages)

### MOH Tier 2
- **No Create Access:** Cannot create export requests (read-only for requests)
- **Actions:** Verify, approve, reject (on list/detail pages)

---

## State Variations

### Empty State (New Request)
- **All Fields:** Empty (except auto-filled company information)
- **Threshold Comparison:** Shows current stock and VCI threshold, ECS threshold as N/A
- **Documentation:** Empty upload zone

### Edit State (Draft Request)
- **All Fields:** Pre-filled with saved draft data
- **Threshold Comparison:** Shows saved values
- **Documentation:** Shows uploaded files (with remove option)
- **Save Draft:** Available to update draft

### Loading State (File Upload)
- **Upload Zone:** Shows progress indicator
- **File List:** Shows uploading status with progress bar
- **Buttons:** Disabled during upload

### Validation Errors
- **Field-Level Errors:** Red border, error message below field
- **Submit Button:** Disabled until all required fields valid
- **Error Summary:** Optional error summary at top of form

### Submit Success
- **Confirmation:** Success message with request ID
- **Navigation:** Redirect to export request detail page
- **State:** Request moves to `submitted` state

### Submit Error
- **Error Message:** Display error details
- **Retry:** Allow user to retry submission
- **Draft:** Draft remains saved for retry

---

## Validation Rules

### Required Fields
- SKU Selection (required)
- Export Destination (required)
- Expected Export Quantity (required)
- Expected Export Date (required)

### Business Rules
1. **SKU Selection:** Must be from user's company products
2. **Quantity Validation:** Must not exceed current stock level
3. **Date Validation:** Must be future date
4. **File Upload:** Max 10 files, 5MB each, specific formats only
5. **Draft Auto-Save:** Auto-saves every 30 seconds or on blur
6. **Submission:** Moves request to `submitted` state, triggers conditional validation
7. **Edit Restriction:** Can only edit draft requests (before submission)

---

## Design System References

- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Forms, FileUpload, DatePicker
- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md) - Form validation, draft auto-save
- [File Upload Security](../../../../02-architecture/security/file-upload-storage-security.md) - File upload requirements
- [Workflow Architecture](../../../../02-architecture/workflow-architecture.md) - Export Request Workflow

---

## Related Wireframes

- [Export Requests List](task-0.5.4.1-export-requests-list.md)
- [Export Request Detail](task-0.5.4.3-export-request-detail.md)
- [Export Workflow Actions](task-0.5.4.4-export-workflow-actions.md)

---

**Next:** [Export Request Detail](task-0.5.4.3-export-request-detail.md)

**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Guided by:** Fatima (MOH Regulatory Requirements) & Dr. Samir (Business Process Validation)

