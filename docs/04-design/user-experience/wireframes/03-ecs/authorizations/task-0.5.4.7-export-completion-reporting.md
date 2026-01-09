# Task 0.5.4.7: Export Completion Reporting Interface Wireframe

**Status:** ✅ Complete  
**Route:** `/ecs/authorizations/[id]` (completion tab or modal)  
**File:** `task-0.5.4.7-export-completion-reporting.png`  
**Priority:** 🟡 ECS Module

**Design Approach:** Form interface for reporting export completion with actual export details and shipping information. Professional, accessible, and optimized for export authorization completion workflows.

---

## Wireframe Layout

### Completion Reporting Form

```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Report Export Completion                                  ││
│ │                                                          ││
│ │ Authorization: AUTH-2025-001                             ││
│ │ Export Request: REQ-2025-001                             ││
│ │ Company: ABC Pharmaceuticals Inc.                      ││
│ │ SKU: SKU001 - Product A / 500mg / Tablet              ││
│ │                                                          ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │ Export Details                                     │ ││
│ │ │                                                      │ ││
│ │ │ Completion Date *                                  │ ││
│ │ │ [📅 Date Picker]                                     │ ││
│ │ │                                                      │ ││
│ │ │ Actual Export Quantity *                            │ ││
│ │ │ [_________________] units                            │ ││
│ │ │                                                      │ ││
│ │ │ ℹ️ Authorized Quantity: 1,000 units                  │ ││
│ │ │    Actual quantity may differ from authorized.       │ ││
│ │ │                                                      │ ││
│ │ │ Export Destination                                   │ ││
│ │ │ [____________________________________________]        │ ││
│ │ │ Placeholder: "Enter final destination..."            │ ││
│ │ │                                                      │ ││
│ │ │ ℹ️ This should match the authorized destination      │ ││
│ │ │    unless changed with MOH approval.                 │ ││
│ │ └────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │ Shipping Information                                │ ││
│ │ │                                                      │ ││
│ │ │ Shipping Date                                       │ ││
│ │ │ [📅 Date Picker]                                     │ ││
│ │ │                                                      │ ││
│ │ │ Shipping Method *                                   │ ││
│ │ │ ○ Air Freight                                       │ ││
│ │ │ ○ Sea Freight                                       │ ││
│ │ │ ○ Road Transport                                    │ ││
│ │ │ ○ Other                                             │ ││
│ │ │                                                      │ ││
│ │ │ [If Other Selected]                                 │ ││
│ │ │ Shipping Method Details                             │ ││
│ │ │ [____________________________________________]        │ ││
│ │ │                                                      │ ││
│ │ │ Tracking Number                                     │ ││
│ │ │ [____________________________________________]        │ ││
│ │ │ Placeholder: "Enter tracking number..."              │ ││
│ │ │                                                      │ ││
│ │ │ Carrier/Shipping Company                            │ ││
│ │ │ [____________________________________________]        │ ││
│ │ │ Placeholder: "Enter carrier name..."                 │ ││
│ │ │                                                      │ ││
│ │ │ Additional Notes                                    │ ││
│ │ │ ┌────────────────────────────────────────────────┐ │ ││
│ │ │ │ [Enter additional shipping notes...]            │ │ ││
│ │ │ │                                                 │ │ ││
│ │ │ │ (Optional: Add any relevant shipping           │ │ ││
│ │ │ │  information or special handling notes)        │ │ ││
│ │ │ └────────────────────────────────────────────────┘ │ ││
│ │ └────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ ┌────────────────────────────────────────────────────┐ ││
│ │ │ Supporting Documentation (Optional)                │ ││
│ │ │                                                      │ ││
│ │ │ ┌────────────────────────────────────────────────┐ │ ││
│ │ │ │ [Drag & Drop Files Here]                       │ │ ││
│ │ │ │                                                 │ │ ││
│ │ │ │ or                                              │ │ ││
│ │ │ │                                                 │ │ ││
│ │ │ │ [Browse Files]                                 │ │ ││
│ │ │ └────────────────────────────────────────────────┘ │ ││
│ │ │                                                      │ ││
│ │ │ Accepted Formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG││
│ │ │ Max File Size: 5MB per file                          ││
│ │ │ Max Files: 10 attachments                            ││
│ │ │                                                      │ ││
│ │ │ Uploaded Files:                                      │ ││
│ │ │ ┌────────────────────────────────────────────────┐ │ ││
│ │ │ │ 📄 shipping-manifest.pdf        (1.2 MB) [✕]  │ │ ││
│ │ │ │ 📄 customs-clearance.pdf        (0.8 MB) [✕]  │ │ ││
│ │ │ └────────────────────────────────────────────────┘ │ ││
│ │ └────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ [Cancel] [Save Draft] [Submit Completion Report]         ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Completion Report Summary (After Submission)

```
┌─────────────────────────────────────────────────────────────┐
│ Export Completion Report - AUTH-2025-001                     │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Completion Status: Completed                             ││
│ │                                                          ││
│ │ Report Submitted: February 10, 2025                     ││
│ │ Submitted By: Company Admin                             ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Export Details                                           ││
│ │                                                          ││
│ │ Completion Date: February 10, 2025                     ││
│ │ Actual Export Quantity: 950 units                       ││
│ │ Authorized Quantity: 1,000 units                        ││
│ │ Quantity Variance: -50 units (5% less than authorized)  ││
│ │                                                          ││
│ │ Export Destination: Country X                           ││
│ │ (Matches authorized destination)                         ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Shipping Information                                     ││
│ │                                                          ││
│ │ Shipping Date: February 10, 2025                       ││
│ │ Shipping Method: Air Freight                             ││
│ │ Tracking Number: TRACK-2025-001                          ││
│ │ Carrier/Shipping Company: ABC Logistics Inc.            ││
│ │                                                          ││
│ │ Additional Notes:                                        ││
│ │ Export shipped via express air freight. Delivery       ││
│ │ expected within 3 business days.                       ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Supporting Documentation                                 ││
│ │                                                          ││
│ │ 📄 shipping-manifest.pdf (1.2 MB) [View] [Download]    ││
│ │ 📄 customs-clearance.pdf (0.8 MB) [View] [Download]    ││
│ │                                                          ││
│ │ [View All Documents]                                    ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [Edit Completion Report] (if allowed) [View Authorization]  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Form Header
- **Title:** "Report Export Completion"
- **Context Information:**
  - Authorization ID (read-only)
  - Export Request ID (read-only, link to request)
  - Company name (read-only)
  - SKU information (read-only)

### Export Details Section
- **Layout:** Card with form fields
- **Fields:**
  1. **Completion Date:**
     - **Type:** Date picker
     - **Required:** Yes (marked with *)
     - **Validation:** Required, must be on or after authorization date, must be on or before expiration date
     - **Error Message:** "Completion date is required" or "Date must be within authorization validity period"
     - **Helper Text:** "Select the date when export was completed"
  
  2. **Actual Export Quantity:**
     - **Type:** Number input
     - **Required:** Yes (marked with *)
     - **Validation:** 
       - Required
       - Must be positive integer
       - Must not exceed authorized quantity by more than 10% (business rule)
       - Can be less than authorized quantity
     - **Error Message:** 
       - "Actual export quantity is required"
       - "Quantity must be a positive number"
       - "Quantity cannot exceed authorized quantity by more than 10% (max: 1,100 units)"
     - **Helper Text:** 
       - "Authorized Quantity: [X] units"
       - "Actual quantity may differ from authorized."
     - **Variance Calculation:** Shows variance percentage (if differs from authorized)
  
  3. **Export Destination:**
     - **Type:** Text input
     - **Required:** No (optional, defaults to authorized destination)
     - **Placeholder:** "Enter final destination..."
     - **Validation:** Must match authorized destination (unless changed with MOH approval)
     - **Helper Text:** 
       - "This should match the authorized destination unless changed with MOH approval."
       - "Authorized Destination: [Country/Region]"

### Shipping Information Section
- **Layout:** Card with form fields
- **Fields:**
  1. **Shipping Date:**
     - **Type:** Date picker
     - **Required:** No (optional)
     - **Validation:** Must be on or before completion date (if both provided)
     - **Helper Text:** "Select the date when export was shipped"
  
  2. **Shipping Method:**
     - **Type:** Radio buttons
     - **Required:** Yes (marked with *)
     - **Options:**
       - Air Freight
       - Sea Freight
       - Road Transport
       - Other
     - **If Other Selected:**
       - **Shipping Method Details:** Text input (required if "Other" selected)
       - Placeholder: "Enter shipping method details..."
  
  3. **Tracking Number:**
     - **Type:** Text input
     - **Required:** No (optional)
     - **Placeholder:** "Enter tracking number..."
     - **Validation:** None (free text)
  
  4. **Carrier/Shipping Company:**
     - **Type:** Text input
     - **Required:** No (optional)
     - **Placeholder:** "Enter carrier name..."
     - **Validation:** None (free text)
  
  5. **Additional Notes:**
     - **Type:** Textarea (multi-line)
     - **Required:** No (optional)
     - **Placeholder:** "Enter additional shipping notes..."
     - **Max Length:** 1000 characters
     - **Helper Text:** "Optional: Add any relevant shipping information or special handling notes"

### Supporting Documentation Section
- **Layout:** Card with file upload component
- **Component:** FileUpload component with drag-and-drop
- **Label:** "Supporting Documentation (Optional)"
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

### Form Actions
- **Cancel Button:** Secondary button (closes form/modal, returns to authorization detail)
- **Save Draft Button:** Secondary button (saves draft completion report)
- **Submit Completion Report Button:** Primary button (submits completion report, moves authorization to `completed` state)

---

## Role-Based Access

### Company Users (IPC only)
- **Create Access:** Can create completion reports for own export authorizations
- **Edit Access:** Can edit own completion reports (if not yet finalized)
- **View:** Can view own completion reports
- **Submit:** Can submit completion reports (moves authorization to `completed` state)
- **Cancel:** Can cancel draft completion reports

### MOH Tier 1
- **View Access:** Can view all completion reports
- **Actions:** 
  - View all completion reports
  - Request corrections (if discrepancies found)
- **No Actions:** Cannot create or edit completion reports (Company function)

### MOH Tier 2
- **View Access:** Can view all completion reports
- **Actions:** 
  - View all completion reports
  - Request corrections (if discrepancies found)
- **No Actions:** Cannot create or edit completion reports (Company function)

---

## State Variations

### Empty State (New Completion Report)
- **All Fields:** Empty (except auto-filled authorization information)
- **Form Actions:** Save Draft, Submit Completion Report

### Draft State (Saved Draft)
- **All Fields:** Pre-filled with saved draft data
- **Form Actions:** Save Draft (to update), Submit Completion Report

### Submitted State (Completion Report Submitted)
- **Status:** Completed
- **View:** Completion report summary (read-only)
- **Form Actions:** Edit Completion Report (if allowed), View Authorization

### Loading State (File Upload)
- **Upload Zone:** Shows progress indicator
- **File List:** Shows uploading status with progress bar
- **Buttons:** Disabled during upload

### Validation Errors
- **Field-Level Errors:** Red border, error message below field
- **Submit Button:** Disabled until all required fields valid
- **Error Summary:** Optional error summary at top of form

### Submit Success
- **Confirmation:** Success message
- **Navigation:** Redirect to completion report summary
- **State:** Authorization moves to `completed` state

### Submit Error
- **Error Message:** Display error details
- **Retry:** Allow user to retry submission
- **Draft:** Draft remains saved for retry

---

## Business Rules

1. **Completion Date:** Must be within authorization validity period (authorization date to expiration date)
2. **Actual Quantity:** Can be less than authorized quantity, but cannot exceed by more than 10%
3. **Destination:** Should match authorized destination (unless changed with MOH approval)
4. **Shipping Date:** Optional, but if provided must be on or before completion date
5. **File Upload:** Max 10 files, 5MB each, specific formats only
6. **Draft Auto-Save:** Auto-saves every 30 seconds or on blur (optional)
7. **Submission:** Moves authorization to `completed` state
8. **Edit Restriction:** Can only edit draft completion reports (before submission)
9. **Variance Reporting:** Shows quantity variance percentage if differs from authorized
10. **Documentation:** Optional but recommended (shipping manifest, customs clearance, etc.)

---

## Design System References

- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Forms, FileUpload, DatePicker
- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md) - Form validation, draft auto-save
- [File Upload Security](../../../../02-architecture/security/file-upload-storage-security.md) - File upload requirements
- [Workflow Architecture](../../../../02-architecture/workflow-architecture.md) - Export Request Workflow

---

## Related Wireframes

- [Export Authorization Detail](task-0.5.4.6-export-authorization-detail.md)
- [Export Authorizations List](task-0.5.4.5-export-authorizations-list.md)
- [Replenishment Schedule Tracking](../replenishment/task-0.5.4.8-replenishment-schedule-tracking.md)

---

**Next:** [Replenishment Schedule Tracking](../replenishment/task-0.5.4.8-replenishment-schedule-tracking.md)

**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Guided by:** Fatima (MOH Regulatory Requirements) & Dr. Samir (Business Process Validation)

