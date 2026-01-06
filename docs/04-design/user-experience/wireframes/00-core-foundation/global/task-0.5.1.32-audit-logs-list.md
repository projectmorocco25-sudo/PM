# Task 0.5.1.32: Audit Logs List Page Wireframe

**Status:** 🟡 In Progress  
**Route:** `/audit/logs` (MOH/Auditors only)  
**File:** `task-0.5.1.32-audit-logs-list.png`  
**Priority:** 🔴 Critical Foundation

**Design Approach:** Modern enterprise audit logs pattern inspired by Stripe, GitHub, Linear, and shadcn/ui best practices. Professional, accessible, and optimized for regulatory compliance audit trail access.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > Audit > Logs                                          │
│                                                             │
│ Audit Logs                    [Export] [Filters ▼] [Search] │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ ℹ️ Compliance Information                                 ││
│ │                                                          ││
│ │ • Data Retention: 7 years minimum (per regulatory      ││
│ │   requirements - Law No. 09-08, DMP regulations)        ││
│ │ • CNDP Compliance: All audit log access complies with   ││
│ │   Law No. 09-08 (Protection of Personal Data)           ││
│ │ • [View Regulatory Framework]                           ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Timestamp      User      Action    Table    Record  Details││
│ ├─────────────────────────────────────────────────────────┤│
│ │ 2025-01-01     John Doe  CREATE    products 12345   [View]││
│ │ 10:30:45       Company   UPDATE    skus     67890   [View]││
│ │               XYZ                                      ││
│ ├─────────────────────────────────────────────────────────┤│
│ │ 2025-01-01     Jane      CREATE    enforcement 33333 [View]││
│ │ 09:15:22       Smith     APPROVE   enforcement 33333 [View]││
│ │               MOH Tier 1                               ││
│ ├─────────────────────────────────────────────────────────┤│
│ │ 2025-01-01     Admin     EXECUTE   enforcement 33333 [View]││
│ │ 08:00:00       MOH Tier 1                               ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [< Previous]  [1] [2] [3] ... [Next >]                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > Audit > Logs"
- **Title:** "Audit Logs"
- **Actions:** Export button (MOH Tier 1 only), Filters, Search

### Compliance Information Section
- **Data Retention:** "7 years minimum (per regulatory requirements - Law No. 09-08, DMP regulations)"
- **CNDP Compliance:** "All audit log access complies with Law No. 09-08 (Protection of Personal Data)"
- **Regulatory Reference:** Link to regulatory framework document
- **Display:** Info banner at top of page (collapsible)
- **Styling:** Light blue background (#eff6ff), info icon, dismissible

### Audit Log Table
- **Columns:** Timestamp, User, Action, Table, Record ID, Details
- **Sortable:** All columns
- **Pagination:** Page numbers or virtual scrolling
- **Enforcement Actions Display:**
  - When table is "enforcement_actions", show action type (Warning/Fine/Suspension) in Details column
  - Link to enforcement action detail page from Record ID
  - Show workflow status (Draft, Pending Approval, Approved, Executed) in Details

### Filters
- **Date Range:** Date picker
- **Table:** Dropdown (products, skus, companies, enforcement_actions, enforcement_action_appeals, etc.)
- **User:** User selector
- **Action:** CREATE, UPDATE, DELETE, APPROVE, EXECUTE, APPEAL, etc.
- **Enforcement Filter (Optional):** Filter by enforcement action type (warning, fine, suspension) when table is enforcement_actions

### Export
- **Format:** CSV, PDF
- **Scope:** Filtered results or all logs

---

## Annotations

### Blue (Interactions)
- **Click log entry** → Navigate to audit log detail
- **Click filter** → Apply filter
- **Click export** → Download audit log

### Green (States)
- **Loading state:** Skeleton loaders
- **Empty state:** No logs found

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/audit/logs`
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - Detailed compliance requirements including CNDP and data retention
- [Regulatory Policies](../../../../03-governance/regulatory-policies.md) - Regulatory policies and guidelines

---

## Design System References

### Components Used
- **Table Component:** Audit logs table (shadcn/ui table)
- **Filter Component:** Table, action, user, date filters (shadcn/ui select/checkbox)
- **Search Component:** Search input (shadcn/ui input)
- **Badge Component:** Action type, status badges (shadcn/ui badge)
- **Button Component:** Export, filter buttons (shadcn/ui button)
- **Icon Component:** Action type icons (Lucide React via shadcn/ui)
- **Skeleton Component:** Loading states (shadcn/ui skeleton)
- **Empty State Component:** No audit logs message (shadcn/ui empty state pattern)
- **Tooltip Component:** Hover tooltips (shadcn/ui tooltip)

### Design Inspiration References
- **Stripe Dashboard:** https://dashboard.stripe.com - Professional audit log patterns
- **GitHub:** https://github.com - Clean audit logs, activity tracking
- **Linear App:** https://linear.app - Modern audit logs, smooth interactions
- **shadcn/ui Components:** https://ui.shadcn.com - Component patterns
- **AWS CloudTrail/Azure Activity Log:** Enterprise audit log patterns for reference

### Colors (From Design System)
- **Background:** #ffffff (white) - Clean, professional
- **Table Border:** #e5e7eb (border-default) - Subtle separation
- **Table Row Hover:** #f9fafb (bg-secondary) - Light gray on hover
- **Table Row Active:** #f3f4f6 (bg-tertiary) - Slightly darker on click
- **Text Primary:** #111827 (text-primary) - High contrast
- **Text Secondary:** #6b7280 (text-secondary)
- **Text Tertiary:** #9ca3af (text-tertiary)
- **Focus Ring:** #3b82f6 (primary-500), 2px outline
- **Action Type Colors:**
  - CREATE: #22c55e (success-500) - Green for creation
  - UPDATE: #3b82f6 (primary-500) - Blue for updates
  - DELETE: #ef4444 (error-500) - Red for deletions
  - APPROVE: #22c55e (success-500) - Green for approvals
  - REJECT: #ef4444 (error-500) - Red for rejections
  - EXECUTE: #f59e0b (warning-500) - Orange for executions
  - APPEAL: #8b5cf6 (purple-500) - Purple for appeals

### Typography (From Design System)
- **Page Title:** 30px, font-weight: 700 (h1)
- **Table Header:** 12px, font-weight: 600, uppercase
- **Table Cell Text:** 14px, font-weight: 400
- **Timestamp:** 12px, font-weight: 400
- **Action Badge:** 11px, font-weight: 600
- **Filter Label:** 12px, font-weight: 500

### Spacing (8px Grid System)
- **Page Padding:** 24px (3 × 8px) - Comfortable page edge spacing
- **Table Cell Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)
- **Table Row Height:** 48px (6 × 8px) - Touch target minimum
- **Table Border Width:** 1px - Subtle separation
- **Filter Section Padding:** 16px (2 × 8px)
- **Search Input Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)
- **Button Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)

### Transitions & Animations
- **Table Row Hover:** 150ms ease-in-out
- **Table Row Click:** 150ms ease-in-out
- **Filter Toggle:** 200ms ease-in-out
- **Search Focus:** 200ms ease-in-out
- **Table Sort:** 200ms ease-in-out

### Accessibility (WCAG 2.1 AA Compliance)
- **Color Contrast:** Minimum 4.5:1 for text, 3:1 for UI components
- **Focus Indicators:** 2px solid outline, #3b82f6 (primary-500), 2px offset
- **Keyboard Navigation:** Full keyboard support (Tab, Enter, Arrow keys, Escape)
- **Screen Reader Support:** ARIA labels, roles, and descriptions
- **Touch Targets:** Minimum 40px × 40px for all interactive elements
- **ARIA Labels:** Descriptive labels for all table cells and actions
- **Table Headers:** Proper table header associations
- **Skip Links:** "Skip to main content" link for keyboard users

---

## Industry Best Practices Implementation

### Performance Optimizations
- **Lazy Loading:** Audit log rows load on demand (pagination or infinite scroll)
- **Virtual Scrolling:** For extremely long audit log lists (if needed)
- **Debounced Search:** Debounce search input (300ms)
- **CSS Containment:** Use `contain: layout style paint` for table rows
- **Will-Change:** Hint browser about table animations (`will-change: transform, opacity`)
- **Data Fetching:** Parallel API calls for filters and audit logs
- **Caching:** Cache audit logs with appropriate TTL (5-10 minutes, read-only data)

### Modern CSS Features
- **CSS Grid/Flexbox:** Use CSS Grid for table layout (responsive, flexible)
- **CSS Custom Properties:** Use design system tokens for colors/spacing
- **Backdrop Filter:** Subtle blur effects for modals/overlays (if supported, graceful degradation)
- **CSS Transitions:** Smooth animations for all state changes
- **Container Queries:** Consider for component-level responsive design (future enhancement)

### State Management
- **Audit Logs State:** Track selected log, filters, search query, sort order, pagination
- **Real-time Updates:** WebSocket or polling for new audit logs (30s interval, optional)
- **Local Storage:** Cache filter preferences, sort order, pagination state
- **Optimistic Updates:** Not applicable (read-only data)
- **Error Recovery:** Retry failed API calls with exponential backoff

### Error Handling
- **Loading States:** Skeleton loaders for table rows while loading
- **Error Boundaries:** Graceful degradation if audit logs fail to load
- **Retry Logic:** Automatic retry with exponential backoff
- **Offline Support:** Cache audit logs for offline access (read-only)
- **Fallback:** Default empty state if all else fails

### Browser Support
- **Modern Browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Progressive Enhancement:** Core functionality works without JS (basic table display)
- **Polyfills:** For older browsers if needed (Intersection Observer, ResizeObserver, etc.)

### Testing Considerations
- **Visual Regression:** Test audit logs at different screen sizes
- **Responsive Testing:** Test at key breakpoints (768px, 1024px, 1920px)
- **Accessibility Testing:** Screen reader, keyboard navigation, color contrast
- **Performance Testing:** Lighthouse scores, Core Web Vitals, Time to Interactive
- **Cross-browser Testing:** Test filters, search, table interactions, sorting
- **Data Loading Testing:** Test with slow network, empty states, error states
- **Large Dataset Testing:** Test with large audit log datasets (1000+ rows)

### Security Considerations
- **XSS Prevention:** Sanitize all audit log content (descriptions, metadata)
- **CSRF Protection:** For all state-changing actions (export, filter)
- **Data Isolation:** Ensure audit log data isolation (RLS)
- **Permission Checks:** Verify user permissions before displaying audit logs (MOH Tier 1 & 2 only)
- **Read-only Enforcement:** Ensure audit logs are read-only (immutable)
- **Audit Log Integrity:** Ensure audit logs cannot be modified or deleted

### Real-time Features
- **WebSocket Connection:** For instant new audit log delivery (optional)
- **Polling Fallback:** If WebSocket unavailable (30s interval, optional)
- **Badge Count Updates:** Real-time count updates (if applicable)

### Audit Logs-Specific Optimizations
- **Table Rendering:** Use virtual scrolling for long lists (1000+ rows)
- **Search Optimization:** Debounce search, server-side filtering
- **Filter Optimization:** Cache filter options, lazy load filter data
- **Sorting Optimization:** Server-side sorting for large datasets
- **Pagination Optimization:** Efficient pagination, cursor-based pagination for large datasets
- **Export Optimization:** Server-side export generation for large datasets
- **Code Splitting:** Split audit logs code by feature (table, filters, search, export)

### User Experience Enhancements
- **Keyboard Shortcuts:** 
  - `j/k` - Navigate up/down table rows
  - `Enter` - View selected audit log
  - `/` - Focus search
  - `f` - Focus filters
  - `s` - Focus sort dropdown
- **Bulk Actions:** Select multiple logs for bulk operations (export, filter)
- **Quick Actions:** Hover actions (view, export, filter)
- **Column Sorting:** Click column headers to sort
- **Column Resizing:** Resize columns (optional enhancement)
- **Column Visibility:** Show/hide columns (optional enhancement)
- **Export Options:** Export to CSV, PDF, Excel formats

---

**Last Updated:** 2025-01-01  
**Status:** 🟡 Ready for Review  
**Design Approach:** Modern enterprise audit logs pattern (Stripe/GitHub/Linear/shadcn/ui inspired)
