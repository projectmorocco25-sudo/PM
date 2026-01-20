# Task 0.5.8.9: Message Attachment Viewer Modal Wireframe

**Status:** ✅ Complete  
**Route:** Modal overlay (reusable pattern, no specific route)  
**File:** `task-0.5.8.9-message-attachment-viewer-modal.png`  
**Priority:** 🟢 Analytics & Historical Data (Reusable UI Patterns)

**Design Approach:** Reusable message attachment viewer modal with image preview, document viewer, and download actions. Professional, accessible, and optimized for viewing attachments without leaving conversation.

**Guidance:** Fatima (MOH Regulatory Requirements) - Attachment viewer critical for regulatory document review and communication audit trail. Dr. Samir (Business Process Validation) - Efficient attachment viewing improves communication workflow.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [Modal Overlay - Dark background overlay 80% opacity]     │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Attachment Viewer                                [✕]  │ │
│  │                                                       │ │
│  │ From: Company Admin (ABC Pharmaceuticals)              │ │
│  │ Message: Submission #2024-001 documentation           │ │
│  │                                                       │ │
│  │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ Image Preview (if image)                          │ │ │
│  │ │                                                   │ │ │
│  │ │   [Image Display Area]                            │ │ │
│  │ │                                                   │ │ │
│  │ │   [← Previous]  [Image 1 of 3]  [Next →]          │ │ │
│  │ │                                                   │ │ │
│  │ │   Zoom: [─] [100%] [+] [Fit] [Actual Size]        │ │ │
│  │ └───────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ Document Viewer (if document)                      │ │ │
│  │ │                                                   │ │ │
│  │ │   [PDF Viewer / Document Viewer]                  │ │ │
│  │ │                                                   │ │ │
│  │ │   [← Previous]  [Document 1 of 3]  [Next →]       │ │ │
│  │ │                                                   │ │ │
│  │ │   [Zoom Out] [100%] [Zoom In] [Download]          │ │ │
│  │ └───────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ Attachment List                                   │ │ │
│  │ │                                                   │ │ │
│  │ │ (1) document.pdf       2.3 MB    [View] [Download]│ │ │
│  │ │ (2) image.png          1.2 MB    [View] [Download]│ │ │
│  │ │ (3) report.xlsx        0.8 MB    [View] [Download]│ │ │
│  │ │                                                   │ │ │
│  │ │ Regulatory Notice (Fatima's Requirement):          │ │ │
│  │ │ ⚠️ Attachments are retained for 7 years per        │ │ │
│  │ │    regulatory requirements (Law No. 09-08)        │ │ │
│  │ │    Handle downloaded documents per compliance      │ │ │
│  │ │    guidelines                                      │ │ │
│  │ └───────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │ [Download All]                    [Close]             │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Features

### Image Preview
- **Image Display:** Full-size image display area
- **Navigation:** Previous/Next buttons for multiple images
- **Image Counter:** "Image X of Y" indicator
- **Zoom Controls:** Zoom out, zoom in, fit, actual size
- **Fullscreen:** Fullscreen toggle (optional)

### Document Viewer
- **PDF Viewer:** Embedded PDF viewer for PDF files
- **Document Viewer:** Native viewer for DOC, XLS, etc. (if supported)
- **Navigation:** Previous/Next buttons for multiple documents
- **Document Counter:** "Document X of Y" indicator
- **Zoom Controls:** Zoom out, zoom in, download
- **Download:** Direct download button

### Attachment List
- **File List:** All attachments with name, size, actions
- **Numbered:** Numbered list (1), (2), (3)
- **Actions:** View (switch to file), Download (direct download)
- **Current Indicator:** Highlight current file being viewed
- **Download All:** Download all attachments as ZIP

### Context Information
- **From:** Message sender (name and company)
- **Message:** Message subject or preview
- **File Info:** File name, size, type

### Actions
- **Download:** Download current file
- **Download All:** Download all attachments as ZIP
- **Close:** Dismiss modal

---

## State Variations

### Image Preview Mode
```
│  │ │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ │ [Full-size image display]                        │ │ │
│  │ │ │                                                   │ │ │
│  │ │ │   [← Previous]  [Image 2 of 3]  [Next →]          │ │ │
│  │ │ │                                                   │ │ │
│  │ │ │   Zoom: [─] [100%] [+] [Fit] [Actual Size]        │ │ │
│  │ │ └───────────────────────────────────────────────────┘ │ │
```

### Document Viewer Mode
```
│  │ │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ │ [PDF/Document viewer embedded]                    │ │ │
│  │ │ │                                                   │ │ │
│  │ │ │   [← Previous]  [Document 1 of 3]  [Next →]       │ │ │
│  │ │ │                                                   │ │ │
│  │ │ │   [Zoom Out] [100%] [Zoom In] [Download]          │ │ │
│  │ │ └───────────────────────────────────────────────────┘ │ │
```

### Loading State
```
│  │ │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ │ [Loading spinner]                                 │ │ │
│  │ │ │ Loading attachment...                             │ │ │
│  │ │ └───────────────────────────────────────────────────┘ │ │
```

### Error State
```
│  │ │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ │ ⚠️ Error Loading Attachment                       │ │ │
│  │ │ │                                                   │ │ │
│  │ │ │ Unable to load attachment. File may be corrupted. │ │ │
│  │ │ │                                                   │ │ │
│  │ │ │ [Retry] [Download] [Close]                        │ │ │
│  │ │ └───────────────────────────────────────────────────┘ │ │
```

### Unsupported Format
```
│  │ │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ │ ⓘ Preview Not Available                          │ │ │
│  │ │ │                                                   │ │ │
│  │ │ │ This file type cannot be previewed in the browser.│ │ │
│  │ │ │                                                   │ │ │
│  │ │ │ [Download File] [Close]                           │ │ │
│  │ │ └───────────────────────────────────────────────────┘ │ │
```

---

## Responsive Behavior

### Desktop (> 1024px)
- Full modal width (max 900px)
- Side-by-side viewer and list
- Full-size image/document display

### Tablet (768px - 1024px)
- Modal width (95% viewport)
- Stacked viewer and list
- Responsive image/document size

### Mobile (< 768px)
- Modal width (98% viewport, full screen feel)
- Full-screen viewer
- Collapsible attachment list
- Touch-optimized controls

---

## Interactions

1. **Click Attachment:** Switch to that attachment in viewer
2. **Click Previous/Next:** Navigate between attachments
3. **Click Zoom Controls:** Adjust zoom level
4. **Click Download:** Download current file
5. **Click Download All:** Download all files as ZIP
6. **Click Close/X:** Dismiss modal
7. **ESC Key:** Dismiss modal

---

## Accessibility

- **Keyboard Navigation:** Tab through controls, Arrow keys for navigation, Enter to activate
- **Screen Reader:** Announce file name, size, type, current file, navigation controls
- **Focus Management:** Focus on viewer on open
- **ARIA Labels:** Viewer role, navigation controls, file info, download buttons

---

## Related Wireframes

- **Usage:** Used in conversation detail, message list, notification attachments
- **Examples:** Message attachments, submission documentation, report attachments
- **Integration:** [Conversation Detail](../../00-core-foundation/communications/task-0.5.1.25-conversation-detail.md) - Message attachments
- **Integration:** [Compose Message](../../00-core-foundation/communications/task-0.5.1.26-compose-message.md) - Attachments

---

**Created:** 2025-01-15  
**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Reviewers:** Fatima (MOH Regulatory Requirements), Dr. Samir (Business Process Validation)

