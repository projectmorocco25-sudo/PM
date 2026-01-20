# Task 0.5.1.34: Audit Reports Page Wireframe

**Status:** ✅ Complete  
**Route:** `/audit/reports` (MOH/Auditors only)  
**File:** `task-0.5.1.34-audit-reports.png`  
**Priority:** 🔴 Critical Foundation

**Design Approach:** Modern enterprise audit reports pattern inspired by Stripe, GitHub, Linear, and shadcn/ui best practices. Professional, accessible, and optimized for regulatory compliance report generation and management.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > Audit > Reports                                      │
│                                                             │
│ Audit Reports                    [Generate Report] [Filters]│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ User Activity Report                                     ││
│ │ Date Range: 2024-12-01 to 2024-12-31                    ││
│ │ Generated: 2025-01-01 10:00:00                          ││
│ │ Status: ✓ Completed                    [Download PDF]   ││
│ ├─────────────────────────────────────────────────────────┤│
│ │ System Changes Report                                    ││
│ │ Date Range: 2024-11-01 to 2024-11-30                    ││
│ │ Generated: 2024-12-01 15:30:00                          ││
│ │ Status: ✓ Completed                    [Download PDF]   ││
│ ├─────────────────────────────────────────────────────────┤│
│ │ Compliance Audit Report                                  ││
│ │ Date Range: 2024-10-01 to 2024-10-31                    ││
│ │ Generated: 2024-11-01 09:00:00                          ││
│ │ Status: ✓ Completed                    [Download PDF]   ││
│ ├─────────────────────────────────────────────────────────┤│
│ │ Enforcement Actions Report                               ││
│ │ Date Range: 2024-12-01 to 2024-12-31                    ││
│ │ Generated: 2025-01-01 08:00:00                          ││
│ │ Status: ✓ Completed                    [Download PDF]   ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Generate Report (Modal)                                  ││
│ │                                                          ││
│ │ Report Type: [User Activity ▼]                        ││
│ │ Date Range: [Start Date] to [End Date]                 ││
│ │ Format: ☑ PDF  ☐ CSV                                   ││
│ │                                                          ││
│ │ ℹ️ Compliance Notice (Enhanced per Fatima's Requirement):││
│ │ Reports generated in compliance with:                  ││
│ │ • Law No. 09-08 (CNDP) - Data Protection              ││
│ │ • DMP Regulations - Audit Trail Requirements           ││
│ │ • Retention Period: Minimum 7 years (regulatory requirement)││
│ │ • Immutability: Historical reports cannot be modified  ││
│ │ • Regulatory Framework: DMP Art. [X] - Audit Reports  ││
│ │ [View Regulatory Framework]                            ││
│ │                                                          ││
│ │ [Cancel]                                    [Generate]  ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > Audit > Reports"
- **Title:** "Audit Reports"
- **Actions:** Generate Report button (MOH Tier 1 only), Filters

### Report List
- **Items:** Report type, Date range, Generated date, Status, Download button
- **Status:** Completed, Pending, Failed

### Generate Report Form
- **Report Type:** User Activity, System Changes, Compliance Audit, Enforcement Actions, Custom
- **Date Range:** Start and end date pickers
- **Format:** PDF, CSV
- **Compliance Notice:**
  - **Text:** "Reports generated in compliance with Law No. 09-08 (CNDP) and DMP regulations. Reports are retained for minimum 7 years per regulatory requirements."
  - **Regulatory Reference:** Link to regulatory framework document
  - **Display:** Info banner within modal, above action buttons
  - **Styling:** Light blue background (#eff6ff), info icon
- **Enforcement Actions Report:**
  - **Filters:** Action type (Warning/Fine/Suspension), Status, Company, Date range
  - **Includes:** Action details, workflow status, appeals, execution tracking
- **Actions:** Cancel, Generate

---

## Annotations

### Blue (Interactions)
- **Click "Generate Report"** → Open form
- **Click "Download"** → Download report
- **Click "Generate"** → Generate report, show status

### Green (States)
- **Status:** Completed (green), Pending (yellow), Failed (red)
- **Generating:** Show progress indicator

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/audit/reports`

---

## Design System References

### Components Used
- **Card Component:** Report card (shadcn/ui card)
- **List Component:** Reports list (shadcn/ui table/list)
- **Filter Component:** Date range, report type filters (shadcn/ui select/checkbox)
- **Search Component:** Search input (shadcn/ui input)
- **Badge Component:** Report status, type badges (shadcn/ui badge)
- **Button Component:** Generate, download, delete buttons (shadcn/ui button)
- **Icon Component:** Report type icons, status icons (Lucide React via shadcn/ui)
- **Skeleton Component:** Loading states (shadcn/ui skeleton)
- **Empty State Component:** No reports message (shadcn/ui empty state pattern)
- **Tooltip Component:** Hover tooltips (shadcn/ui tooltip)
- **Modal/Dialog Component:** Generate report modal (shadcn/ui dialog)

### Design Inspiration References
- **Stripe Dashboard:** https://dashboard.stripe.com - Professional report generation patterns
- **GitHub:** https://github.com - Clean reports, report management
- **Linear App:** https://linear.app - Modern reports, smooth interactions
- **shadcn/ui Components:** https://ui.shadcn.com - Component patterns
- **AWS CloudTrail/Azure Activity Log:** Enterprise report generation patterns for reference

### Colors (From Design System)
- **Background:** #ffffff (white) - Clean, professional
- **Card Background:** #ffffff (white) - Card background
- **Card Border:** #e5e7eb (border-default) - Subtle separation
- **Card Hover:** #f9fafb (bg-secondary) - Light gray on hover
- **Text Primary:** #111827 (text-primary) - High contrast
- **Text Secondary:** #6b7280 (text-secondary)
- **Text Tertiary:** #9ca3af (text-tertiary)
- **Focus Ring:** #3b82f6 (primary-500), 2px outline
- **Report Status Colors:**
  - Pending: #f59e0b (warning-500) - Orange for pending
  - Generating: #3b82f6 (primary-500) - Blue for generating
  - Completed: #22c55e (success-500) - Green for completed
  - Failed: #ef4444 (error-500) - Red for failed
- **Report Type Colors:**
  - Compliance: #3b82f6 (primary-500)
  - Activity: #22c55e (success-500)
  - Security: #ef4444 (error-500)
  - Custom: #8b5cf6 (purple-500)

### Typography (From Design System)
- **Page Title:** 30px, font-weight: 700 (h1)
- **Card Title:** 16px, font-weight: 600
- **Card Description:** 14px, font-weight: 400
- **Timestamp:** 12px, font-weight: 400
- **Status Badge:** 11px, font-weight: 600
- **Filter Label:** 12px, font-weight: 500
- **Button Text:** 14px, font-weight: 500

### Spacing (8px Grid System)
- **Page Padding:** 24px (3 × 8px) - Comfortable page edge spacing
- **Card Padding:** 24px (3 × 8px) - Card internal spacing
- **Card Gap:** 16px (2 × 8px) - Gap between cards
- **Filter Section Padding:** 16px (2 × 8px)
- **Search Input Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)
- **Button Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)

### Transitions & Animations
- **Card Hover:** 150ms ease-in-out
- **Card Click:** 150ms ease-in-out
- **Filter Toggle:** 200ms ease-in-out
- **Search Focus:** 200ms ease-in-out
- **Modal Open/Close:** 200ms ease-in-out
- **Report Generation Progress:** Smooth progress bar animation

### Accessibility (WCAG 2.1 AA Compliance)
- **Color Contrast:** Minimum 4.5:1 for text, 3:1 for UI components
- **Focus Indicators:** 2px solid outline, #3b82f6 (primary-500), 2px offset
- **Keyboard Navigation:** Full keyboard support (Tab, Enter, Arrow keys, Escape)
- **Screen Reader Support:** ARIA labels, roles, and descriptions
- **Touch Targets:** Minimum 40px × 40px for all interactive elements
- **ARIA Labels:** Descriptive labels for all cards and actions
- **Live Regions:** For report generation status updates
- **Skip Links:** "Skip to main content" link for keyboard users

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/audit/reports`
- [Audit Logs List Wireframe](./task-0.5.1.32-audit-logs-list.md) - Audit logs reference
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Card, List, Modal components
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference including Law No. 09-08
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - Detailed compliance requirements including CNDP and data retention
- [Regulatory Policies](../../../../03-governance/regulatory-policies.md) - Regulatory policies and guidelines

---

## Industry Best Practices Implementation

### Performance Optimizations
- **Lazy Loading:** Report cards load on demand (pagination or infinite scroll)
- **Virtual Scrolling:** For extremely long report lists (if needed)
- **Debounced Search:** Debounce search input (300ms)
- **CSS Containment:** Use `contain: layout style paint` for report cards
- **Will-Change:** Hint browser about card animations (`will-change: transform, opacity`)
- **Data Fetching:** Parallel API calls for filters and reports
- **Caching:** Cache reports list with appropriate TTL (5-10 minutes)

### Modern CSS Features
- **CSS Grid/Flexbox:** Use CSS Grid for card layout (responsive, flexible)
- **CSS Custom Properties:** Use design system tokens for colors/spacing
- **Backdrop Filter:** Subtle blur effects for modals/overlays (if supported, graceful degradation)
- **CSS Transitions:** Smooth animations for all state changes
- **Container Queries:** Consider for component-level responsive design (future enhancement)

### State Management
- **Reports State:** Track selected report, filters, search query, pagination, generation status
- **Real-time Updates:** WebSocket or polling for report generation status (10s interval)
- **Local Storage:** Cache filter preferences, pagination state
- **Optimistic Updates:** Show pending state immediately when generating report
- **Error Recovery:** Retry failed API calls with exponential backoff

### Error Handling
- **Loading States:** Skeleton loaders for report cards while loading
- **Error Boundaries:** Graceful degradation if reports fail to load
- **Retry Logic:** Automatic retry with exponential backoff
- **Offline Support:** Cache reports list for offline access
- **Fallback:** Default empty state if all else fails
- **Report Generation Errors:** Clear error messages, retry options

### Browser Support
- **Modern Browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Progressive Enhancement:** Core functionality works without JS (basic report display)
- **Polyfills:** For older browsers if needed (Intersection Observer, ResizeObserver, etc.)

### Testing Considerations
- **Visual Regression:** Test reports at different screen sizes
- **Responsive Testing:** Test at key breakpoints (768px, 1024px, 1920px)
- **Accessibility Testing:** Screen reader, keyboard navigation, color contrast
- **Performance Testing:** Lighthouse scores, Core Web Vitals, Time to Interactive
- **Cross-browser Testing:** Test filters, search, report generation, download
- **Data Loading Testing:** Test with slow network, empty states, error states
- **Report Generation Testing:** Test report generation workflow, progress tracking, error handling

### Security Considerations
- **XSS Prevention:** Sanitize all report content (titles, descriptions)
- **CSRF Protection:** For all state-changing actions (generate, delete)
- **Data Isolation:** Ensure report data isolation (RLS)
- **Permission Checks:** Verify user permissions before displaying reports (MOH Tier 1 only)
- **Report Access Control:** Ensure reports are only accessible to authorized users
- **Report Generation Limits:** Rate limiting for report generation requests

### Real-time Features
- **WebSocket Connection:** For instant report generation status updates
- **Polling Fallback:** If WebSocket unavailable (10s interval)
- **Progress Updates:** Real-time progress bar for report generation
- **Status Badge Updates:** Real-time status badge updates

### Audit Reports-Specific Optimizations
- **Report Card Rendering:** Efficient card rendering, lazy load report previews
- **Search Optimization:** Debounce search, server-side filtering
- **Filter Optimization:** Cache filter options, lazy load filter data
- **Report Generation:** Background job processing, progress tracking
- **Download Optimization:** Efficient file download, resume support for large files
- **Code Splitting:** Split reports code by feature (list, generation, download)

### User Experience Enhancements
- **Keyboard Shortcuts:** 
  - `n` - Generate new report
  - `Enter` - View selected report
  - `/` - Focus search
  - `f` - Focus filters
  - `d` - Download selected report
  - `Esc` - Close modals
- **Bulk Actions:** Select multiple reports for bulk operations (download, delete)
- **Quick Actions:** Hover actions (download, delete, view)
- **Report Preview:** Preview report before download (optional enhancement)
- **Report Scheduling:** Schedule recurring reports (optional enhancement)
- **Export Options:** Export to PDF, CSV, Excel formats
- **Report Templates:** Pre-configured report templates (optional enhancement)

---

**Last Updated:** 2025-01-01  
**Status:** 🟡 Ready for Review  
**Design Approach:** Modern enterprise audit reports pattern (Stripe/GitHub/Linear/shadcn/ui inspired)
