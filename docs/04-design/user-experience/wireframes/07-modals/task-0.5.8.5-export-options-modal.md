# Task 0.5.8.5: Export Options Modal Wireframe

**Status:** ✅ Complete  
**Route:** Modal overlay (reusable pattern, no specific route)  
**File:** `task-0.5.8.5-export-options-modal.png`  
**Priority:** 🟢 Analytics & Historical Data (Reusable UI Patterns)

**Design Approach:** Reusable export options modal with format selection, date range, progress indicator, and download link. Professional, accessible, and optimized for report and data exports.

**Guidance:** Fatima (MOH Regulatory Requirements) - Export options critical for regulatory report generation and compliance documentation. Dr. Samir (Business Process Validation) - Efficient export improves regulatory reporting workflow.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [Modal Overlay - Dark background overlay 80% opacity]     │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Export Options                                   [✕]  │ │
│  │                                                       │ │
│  │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ Format Selection                                 │ │ │
│  │ │                                                   │ │ │
│  │ │ Select export format:                            │ │ │
│  │ │                                                   │ │ │
│  │ │ (●) PDF  - Portable Document Format               │ │ │
│  │ │ ( ) CSV  - Comma-Separated Values                 │ │ │
│  │ │ ( ) XLSX - Excel Spreadsheet                      │ │ │
│  │ │ ( ) JSON - JavaScript Object Notation             │ │ │
│  │ │                                                   │ │ │
│  │ │ ℹ️ PDF recommended for regulatory reports          │ │ │
│  │ │                                                      │ │ │
│  │ │ Regulatory Compliance Notice (Fatima's Requirement):│ │ │
│  │ │ • Exported reports contain data subject to Law      │ │ │
│  │ │   No. 09-08 (CNDP) data protection requirements    │ │ │
│  │ │ • Reports are retained for minimum 7 years          │ │ │
│  │ │ • Handle exported data per regulatory guidelines    │ │ │
│  │ │ [View Regulatory Framework]                         │ │ │
│  │ └───────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ Date Range (Optional)                            │ │ │
│  │ │                                                   │ │ │
│  │ │ [Include date range]                             │ │ │
│  │ │                                                   │ │ │
│  │ │ From: [2024-01-01]    To: [2024-12-31]            │ │ │
│  │ │                                                   │ │ │
│  │ │ Timezone: Africa/Casablanca (UTC+1)              │ │ │
│  │ └───────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ Export Options                                    │ │ │
│  │ │                                                   │ │ │
│  │ │ [✓] Include metadata (export date, user, filters) │ │ │
│  │ │ [✓] Include charts and visualizations             │ │ │
│  │ │ [ ] Include raw data                              │ │ │
│  │ │ [ ] Compress file (ZIP)                           │ │ │
│  │ └───────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │ [Cancel]                                 [Export]    │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Export Progress State

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Exporting Report                                 [✕]  │ │
│  │                                                       │ │
│  │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ [Progress Bar: 75%]                              │ │ │
│  │ │                                                   │ │ │
│  │ │ Generating export...                              │ │ │
│  │ │                                                   │ │ │
│  │ │ Status: Processing data... (75%)                  │ │ │
│  │ └───────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │ ⏳ Please wait while we generate your export.        │ │
│  │                                                       │ │
│  │ [Cancel Export]                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Export Complete State

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Export Complete                                   [✕]  │ │
│  │                                                       │ │
│  │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ ✓ Export generated successfully                   │ │ │
│  │ │                                                   │ │ │
│  │ │ File: report_2024-12-31.pdf                      │ │ │
│  │ │ Size: 2.3 MB                                      │ │ │
│  │ │ Generated: 2024-12-31 14:30 (UTC+1)              │ │ │
│  │ └───────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │ [Download File]                                       │ │
│  │                                                       │ │
│  │ ℹ️ File will be available for download for 24 hours  │ │
│  │                                                       │ │
│  │ [Close]                                               │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Features

### Format Selection
- **Radio Buttons:** PDF, CSV, XLSX, JSON options
- **Default:** PDF (recommended for regulatory reports)
- **Format Info:** Brief description of each format
- **Recommendation:** Info note recommending PDF for regulatory use

### Date Range (Optional)
- **Checkbox:** Include date range in export
- **Date Inputs:** From and To date fields
- **Timezone Display:** Show Morocco timezone
- **Optional:** Can be skipped if not needed

### Export Options
- **Checkboxes:** Include metadata, charts, raw data, compression
- **Default Selections:** Metadata and charts included by default
- **Compression:** ZIP option for large files
- **Metadata:** Export date, user, filters included

### Progress Indicator
- **Progress Bar:** Visual progress indicator (0-100%)
- **Status Text:** Current processing step
- **Cancel Option:** Cancel export if taking too long

### Download Link
- **File Info:** File name, size, generation date
- **Download Button:** Direct download link
- **Availability:** 24-hour download window
- **Auto-Close:** Modal closes after download starts

---

## State Variations

### Loading State
```
│  │ │ [Progress Bar: 45%]                              │ │ │
│  │ │                                                   │ │ │
│  │ │ Generating export...                              │ │ │
│  │ │                                                   │ │ │
│  │ │ Status: Processing data... (45%)                  │ │ │
```

### Error State
```
│  │ │ ❌ Export failed                                  │ │ │
│  │ │                                                   │ │ │
│  │ │ Unable to generate export. Please try again.      │ │ │
│  │ │                                                   │ │ │
│  │ │ Error: File size exceeds limit                    │ │ │
│  │ │                                                   │ │ │
│  │ │ [Retry] [Close]                                   │ │ │
```

### Format-Specific Options
```
│  │ │ PDF Options:                                      │ │ │
│  │ │ [ ] Include page numbers                           │ │ │
│  │ │ [ ] Include header/footer                          │ │ │
│  │ │                                                   │ │ │
│  │ │ CSV Options:                                       │ │ │
│  │ │ Delimiter: [Comma ▼]                             │ │ │
│  │ │ [ ] Include headers                                │ │ │
```

---

## Responsive Behavior

### Desktop (> 1024px)
- Full modal width (max 500px)
- All options visible
- Side-by-side date inputs

### Tablet (768px - 1024px)
- Modal width (90% viewport)
- Stacked date inputs
- Scrollable options

### Mobile (< 768px)
- Modal width (95% viewport)
- Full-width stacked layout
- Touch-optimized controls

---

## Interactions

1. **Select Format:** Choose export format (radio buttons)
2. **Toggle Options:** Check/uncheck export options
3. **Set Date Range:** Enter date range if needed
4. **Click Export:** Start export process, show progress
5. **Click Download:** Download generated file
6. **Click Cancel/Close:** Close modal

---

## Accessibility

- **Keyboard Navigation:** Tab through options, Enter to select, ESC to close
- **Screen Reader:** Announce format, options, progress, file info
- **Focus Management:** Focus on format selection on open
- **ARIA Labels:** Radio groups, checkboxes, progress indicator, download link

---

## Related Wireframes

- **Usage:** Used in reports, audit logs, compliance scores, historical data exports
- **Examples:** Export submission history, export compliance report, export audit log
- **Integration:** All pages with export functionality

---

**Created:** 2025-01-15  
**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Reviewers:** Fatima (MOH Regulatory Requirements), Dr. Samir (Business Process Validation)

