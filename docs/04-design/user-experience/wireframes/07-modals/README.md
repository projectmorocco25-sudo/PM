# Modal & Dialog Wireframes

**Purpose:** This directory contains reusable modal and dialog wireframe patterns used across the application.

**Last Updated:** 2025-01-15  
**Status:** ✅ Complete  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)

## Overview

This directory contains reusable modal and dialog wireframe patterns. These modals are used throughout the application for various interactions, confirmations, data entry, and quick previews. Modals provide focused interactions without full page navigation.

## Wireframes

### Modal & Dialog Patterns

- [x] **Task 0.5.8.1:** [Confirmation modal](task-0.5.8.1-confirmation-modal.md) (delete, archive, approve, reject actions - confirmation message, cancel/confirm buttons)
- [x] **Task 0.5.8.2:** [File upload modal](task-0.5.8.2-file-upload-modal.md) (drag-drop interface, file list, progress indicators, validation errors)
- [x] **Task 0.5.8.3:** [Date range picker modal](task-0.5.8.3-date-range-picker-modal.md) (calendar interface, quick filters, timezone display)
- [x] **Task 0.5.8.4:** [User/Company picker modal](task-0.5.8.4-user-company-picker-modal.md) (search, filters, multi-select, role-based filtering)
- [x] **Task 0.5.8.5:** [Export options modal](task-0.5.8.5-export-options-modal.md) (format selection, date range, progress indicator, download link)
- [x] **Task 0.5.8.6:** [Quick history preview modal](task-0.5.8.6-quick-history-preview-modal.md) (recent changes timeline, "View Full History" button)
- [x] **Task 0.5.8.7:** [Comparison modal](task-0.5.8.7-comparison-modal.md) (current vs historical side-by-side, highlight differences)
- [x] **Task 0.5.8.8:** [Detail inspection modal](task-0.5.8.8-detail-inspection-modal.md) (quick detail view from list, "View Full Page" button)
- [x] **Task 0.5.8.9:** [Message attachment viewer modal](task-0.5.8.9-message-attachment-viewer-modal.md) (image preview, document viewer, download actions)
- [x] **Task 0.5.8.10:** [Workflow status modal](task-0.5.8.10-workflow-status-modal.md) (workflow progress, approval chain, status transitions)

## Modal Categories

### Action Modals
- **Confirmation Modal:** Confirm destructive or critical actions (delete, archive, approve, reject)
- **File Upload Modal:** Upload files with drag-drop, progress, and validation

### Selection Modals
- **Date Range Picker Modal:** Select date ranges with calendar and quick filters
- **User/Company Picker Modal:** Select users or companies with search and filters

### Export Modals
- **Export Options Modal:** Configure export format, options, and download

### Preview Modals
- **Quick History Preview Modal:** Preview recent changes without navigation
- **Comparison Modal:** Compare current vs historical versions side-by-side
- **Detail Inspection Modal:** Quick detail view from list without navigation
- **Message Attachment Viewer Modal:** View attachments (images, documents) inline
- **Workflow Status Modal:** View workflow progress and approval chain

## Usage Guidelines

### When to Use Modals
- ✅ Quick actions (confirm, select, preview) without losing context
- ✅ Small forms or data entry
- ✅ Preview or inspection of details
- ✅ Selection from large lists
- ❌ Full page forms or workflows
- ❌ Complex multi-step processes (use dedicated pages)
- ❌ Full browsing or trend analysis (use dedicated pages)

### Modal Patterns
- **Overlay:** Dark overlay (80% opacity) covering entire screen
- **Centered:** Centered modal, responsive width (max varies by type)
- **Dismissible:** ESC key, click outside (for non-destructive), or close button
- **Focus Trap:** Keyboard navigation trapped within modal
- **Responsive:** Adapts to screen size (desktop, tablet, mobile)

## Related Documents

- [Wireframes README](../README.md) - Wireframe overview
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Modal and dialog components
- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md) - Form patterns including modals
- [Historical Data Routing Proposal](../../../../02-architecture/frontend/historical-data-routing-proposal.md) - Modal patterns for historical data

## Note

Some modals are already included in their respective module sections (e.g., Threshold modification modal in VCI, Score review modals in CMC). These are additional reusable modal patterns that can be used across the application.

## Guidance

**Created with guidance from:**
- **Fatima (MOH Regulatory Requirements):** Confirmation modals critical for preventing accidental regulatory actions. File upload modals critical for regulatory document submission. Workflow status modals critical for regulatory approval chain visibility.
- **Dr. Samir (Business Process Validation):** Clear confirmations reduce user errors. Efficient file upload improves workflow efficiency. Workflow visibility improves decision-making and process efficiency.

---

**Status:** ✅ Complete  
**Created:** 2025-01-15  
**Last Updated:** 2025-01-15

