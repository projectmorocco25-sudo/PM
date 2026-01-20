# Task 0.5.8.2: File Upload Modal Wireframe

**Status:** ✅ Complete  
**Route:** Modal overlay (reusable pattern, no specific route)  
**File:** `task-0.5.8.2-file-upload-modal.png`  
**Priority:** 🟢 Analytics & Historical Data (Reusable UI Patterns)

**Design Approach:** Reusable file upload modal with drag-drop interface, file list, progress indicators, and validation errors. Professional, accessible, and optimized for document and attachment uploads.

**Guidance:** Fatima (MOH Regulatory Requirements) - File upload modals critical for regulatory document submission and compliance. Dr. Samir (Business Process Validation) - Efficient file upload improves workflow efficiency and user experience.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [Modal Overlay - Dark background overlay 80% opacity]     │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Upload Files                                     [✕]  │ │
│  │                                                       │ │
│  │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ Drag & Drop Area                                  │ │ │
│  │ │                                                   │ │ │
│  │ │   [Upload Icon]                                    │ │ │
│  │ │   Drag files here or click to browse              │ │ │
│  │ │                                                   │ │ │
│  │ │   Supported formats: PDF, DOC, DOCX, XLS, XLSX   │ │ │
│  │ │   Max file size: 10 MB                            │ │ │
│  │ │                                                   │ │ │
│  │ │   [Browse Files]                                  │ │ │
│  │ └───────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ File List                                          │ │ │
│  │ │                                                   │ │ │
│  │ │ File Name                    │ Size │ Status │ Actions││ │
│  │ │ ──────────────────────────── │ ──── │ ────── │ ────── ││ │
│  │ │ document.pdf                 │ 2.3MB│ ✓ Ready │ [✕]  ││ │
│  │ │ submission.xlsx              │ 1.5MB│ [⏳ 75%]│ [✕]  ││ │
│  │ │ report.docx                  │ 0.8MB│ ❌ Error│ [✕]  ││ │
│  │ │                               │      │         │       ││ │
│  │ │ ⚠️ report.docx: File size exceeds 10 MB limit      ││ │
│  │ │   [Remove] [Retry]                                  ││ │
│  │ │                                                     ││ │
│  │ │ Regulatory Notice (Fatima's Requirement):           ││ │
│  │ │ • Uploaded documents are retained for 7 years      ││ │
│  │ │   per regulatory requirements (Law No. 09-08)      ││ │
│  │ │ • Documents become part of regulatory audit trail  ││ │
│  │ │ • [View Regulatory Framework]                      ││ │
│  │ └───────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │ [Cancel]                                   [Upload]   │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Features

### Drag & Drop Area
- **Drop Zone:** Visual drop zone for drag-and-drop file uploads
- **Upload Icon:** Visual indicator for upload area
- **Instructions:** Clear instructions for drag-drop or click to browse
- **Supported Formats:** List of supported file formats
- **Size Limit:** Maximum file size indicator
- **Browse Button:** Click to open file picker

### File List
- **Columns:** File name, Size, Status, Actions
- **Status Indicators:** Ready (✓), Uploading (⏳ with %), Error (❌)
- **Progress Bar:** Visual progress indicator for uploading files
- **Error Messages:** Clear error messages for validation failures
- **Remove Button:** Remove file from list (✕ icon)
- **Retry Button:** Retry failed uploads

### Actions
- **Cancel:** Close modal without uploading (with confirmation if files are uploading)
- **Upload:** Start upload process for all ready files
- **Disabled States:** Disable upload if no files or errors present

---

## State Variations

### Empty State (No Files)
```
│  │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ Drag & Drop Area                                  │ │ │
│  │ │                                                   │ │ │
│  │ │   [Upload Icon]                                    │ │ │
│  │ │   Drag files here or click to browse              │ │ │
│  │ │                                                   │ │ │
│  │ │   [Browse Files]                                  │ │ │
│  │ └───────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │ [Cancel]                                   [Upload]   │ │
│  │                              (disabled - no files)    │ │
```

### Uploading State
```
│  │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ File List                                          │ │ │
│  │ │                                                   │ │ │
│  │ │ File Name                    │ Size │ Status │ Actions││ │
│  │ │ ──────────────────────────── │ ──── │ ────── │ ────── ││ │
│  │ │ document.pdf                 │ 2.3MB│ [⏳ 45%]│ [✕]  ││ │
│  │ │ submission.xlsx              │ 1.5MB│ [⏳ 75%]│ [✕]  ││ │
│  │ └───────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │ [Cancel]                                 [⏳ Uploading]│ │
│  │                              (disabled during upload)  │ │
```

### Success State (All Uploaded)
```
│  │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ File List                                          │ │ │
│  │ │                                                   │ │ │
│  │ │ File Name                    │ Size │ Status │ Actions││ │
│  │ │ ──────────────────────────── │ ──── │ ────── │ ────── ││ │
│  │ │ document.pdf                 │ 2.3MB│ ✓ Done │ [✕]  ││ │
│  │ │ submission.xlsx              │ 1.5MB│ ✓ Done │ [✕]  ││ │
│  │ └───────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │                                        [✓ Uploaded]   │ │
│  │                              (modal closes after 2s)  │ │
```

---

## Validation Errors

### File Size Error
```
│  │ │ report.docx                  │ 12MB │ ❌ Error│ [✕]  ││ │
│  │ │                               │      │         │       ││ │
│  │ │ ⚠️ File size (12 MB) exceeds maximum limit (10 MB)   ││ │
│  │ │   [Remove]                                              ││ │
```

### File Type Error
```
│  │ │ image.jpg                   │ 2.1MB│ ❌ Error│ [✕]  ││ │
│  │ │                               │      │         │       ││ │
│  │ │ ⚠️ File type (.jpg) not supported. Allowed: PDF, DOC, XLS││ │
│  │ │   [Remove]                                              ││ │
```

### Duplicate File Error
```
│  │ │ document.pdf                 │ 2.3MB│ ❌ Error│ [✕]  ││ │
│  │ │                               │      │         │       ││ │
│  │ │ ⚠️ File already exists in the upload list              ││ │
│  │ │   [Remove]                                              ││ │
```

---

## Responsive Behavior

### Desktop (> 1024px)
- Full modal width (max 600px)
- Drag-drop area with full instructions
- File list with all columns visible

### Tablet (768px - 1024px)
- Modal width (90% viewport, max 600px)
- Condensed drag-drop area
- Scrollable file list

### Mobile (< 768px)
- Modal width (95% viewport, full screen feel)
- Simplified drag-drop area
- Stacked file list items (card-based)

---

## Interactions

1. **Drag & Drop:** Drop files into drop zone to add to list
2. **Click Browse:** Open file picker to select files
3. **Click Remove:** Remove file from list
4. **Click Retry:** Retry failed upload
5. **Click Upload:** Start upload process
6. **Click Cancel:** Close modal (with confirmation if uploading)
7. **ESC Key:** Close modal (if not uploading)

---

## Accessibility

- **Keyboard Navigation:** Tab through elements, Enter to activate, ESC to close
- **Screen Reader:** Announce file name, size, status, progress, errors
- **Focus Management:** Focus on drop zone or file list on open
- **ARIA Labels:** Drop zone role, file list, progress indicators, error messages

---

## Related Wireframes

- **Usage:** Used in submission forms, export requests, communication attachments
- **Examples:** AAMS submission upload, export documentation, message attachments
- **Integration:** All forms and pages that require file uploads

---

**Created:** 2025-01-15  
**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Reviewers:** Fatima (MOH Regulatory Requirements), Dr. Samir (Business Process Validation)

