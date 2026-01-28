# Task 0.5.1.30: History Overview Page Wireframe

**Status:** ✅ Complete  
**Route:** `/history`  
**File:** `task-0.5.1.30-history-overview.png`  
**Priority:** 🔴 Critical Foundation

**Design Approach:** Modern enterprise history overview pattern inspired by Stripe, GitHub, Linear, and shadcn/ui best practices. Professional, accessible, and optimized for regulatory compliance historical data access.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > History                                               │
│                                                             │
│ History                    [Date Range: Last 30 days ▼]   │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ ℹ️ Regulatory Compliance Information                     ││
│ │                                                          ││
│ │ ⚠️ Historical data is immutable per regulatory          ││
│ │    requirements (Law No. 09-08). No modifications allowed.││
│ │                                                          ││
│ │ 📅 Data Retention: 7 years minimum (Law No. 09-08)      ││
│ │    Retention Period: [Created Date] to [Date + 7 years] ││
│ │    Status: ✓ All historical data compliant              ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌──────────┐ ┌───────────────────────────────────────────┐│
│ │ Filters  │ │ History Timeline                           ││
│ │          │ │                                             ││
│ │ Type     │ │ ┌─────────────────────────────────────────┐ ││
│ │ ☐ All    │ │ │ Submission #12345  Created              │ ││
│ │ ☑ Subm...│ │ │ DMP Regulation Article 12 - Annual      │ ││
│ │ ☐ Breach │ │ │ Registry Submission                     │ ││
│ │ ☐ Export │ │ │ Company XYZ  User: John Doe             │ ││
│ │ ☐ Enforcement│ │ │ 2 hours ago                              │ ││
│ │          │ │ │ [View Submission]                       │ ││
│ │          │ │ └─────────────────────────────────────────┘ ││
│ │ Entity   │ │                                             ││
│ │ ☐ All    │ │ ┌─────────────────────────────────────────┐ ││
│ │ ☐ Product│ │ │ Product ABC  Updated                   │ ││
│ │ ☐ SKU    │ │ │ DMP Regulation Article 8 - Product      │ ││
│ │          │ │ │ Registry                                │ ││
│ │ Company  │ │ │ Company XYZ  User: Jane Smith          │ ││
│ │ ☐ All    │ │ │ 5 hours ago                             │ ││
│ │ ☐ ABC    │ │ │ [View Product]                           │ ││
│ │ ☐ XYZ    │ │ └─────────────────────────────────────────┘ ││
│ │          │ │                                             ││
│ │ [Clear]  │ │ ┌─────────────────────────────────────────┐ ││
│ │          │ │ │ Breach Alert  Created                   │ ││
│ │          │ │ │ DMP Regulation Article 15 - Stock       │ ││
│ │          │ │ │ Level Compliance                        │ ││
│ │          │ │ │ System  Auto-generated                  │ ││
│ │          │ │ │ 1 day ago                               │ ││
│ │          │ │ │ [View Breach]                           │ ││
│ │          │ │ └─────────────────────────────────────────┘ ││
│ │          │ │                                             ││
│ │          │ │ ┌─────────────────────────────────────────┐ ││
│ │          │ │ │ ⚠️ Enforcement Action Created           │ ││
│ │          │ │ │ Warning - Submission Non-Compliance    │ ││
│ │          │ │ │ Legal Basis: DMP Art. 12 - Non-        │ ││
│ │          │ │ │ Compliance Penalty                      │ ││
│ │          │ │ │ MOH Tier 1  User: Jane Smith           │ ││
│ │          │ │ │ Status: ✓ Compliant                    │ ││
│ │          │ │ │ Appeal Window: 🔴 23 days remaining     │ ││
│ │          │ │ │ Deadline: [Date + 30 days from creation]│ ││
│ │          │ │ │ 2 days ago                              │ ││
│ │          │ │ │ [View Enforcement Action]               │ ││
│ │          │ │ └─────────────────────────────────────────┘ ││
│ │          │ │                                             ││
│ │          │ │ ┌─────────────────────────────────────────┐ ││
│ │          │ │ │ ⚠️ Company Deletion Requested            │ ││
│ │          │ │ │ DMP Regulation Article [X] - Registry   │ ││
│ │          │ │ │ Deletion                                 │ ││
│ │          │ │ │ Company ABC Pharma                      │ ││
│ │          │ │ │ Requested by: Tier 2 Officer A          │ ││
│ │          │ │ │ Reason: Company closure                 │ ││
│ │          │ │ │ 1 day ago                               │ ││
│ │          │ │ │ [View Submission]                       │ ││
│ │          │ │ └─────────────────────────────────────────┘ ││
│ │          │ │                                             ││
│ │          │ │ ┌─────────────────────────────────────────┐ ││
│ │          │ │ │ ✅ Company Deletion Approved             │ ││
│ │          │ │ │ DMP Regulation Article [X] - Registry    │ ││
│ │          │ │ │ Deletion Approval                        │ ││
│ │          │ │ │ Company ABC Pharma                      │ ││
│ │          │ │ │ Approved by: Tier 1 Admin               │ ││
│ │          │ │ │ Command issued to Tier 2 Registrar     │ ││
│ │          │ │ │ 1 day ago                               │ ││
│ │          │ │ │ [View Submission]                       │ ││
│ │          │ │ └─────────────────────────────────────────┘ ││
│ │          │ │                                             ││
│ │          │ │ ┌─────────────────────────────────────────┐ ││
│ │          │ │ │ 🗑️ Company Deletion Implemented          │ ││
│ │          │ │ │ DMP Regulation Article [X] - Registry    │ ││
│ │          │ │ │ Deletion Implementation                 │ ││
│ │          │ │ │ Company ABC Pharma                      │ ││
│ │          │ │ │ Implemented by: Tier 2 Registrar C      │ ││
│ │          │ │ │ Deactivation: Soft delete applied        │ ││
│ │          │ │ │ Old Values: [View Old Values]           │ ││
│ │          │ │ │ Cascade: 5 products, 12 SKUs deactivated│ ││
│ │          │ │ │ 1 day ago                               │ ││
│ │          │ │ │ [View Audit Log] [View Old Values]      │ ││
│ │          │ │ └─────────────────────────────────────────┘ ││
│ └──────────┘ └───────────────────────────────────────────┘│
│                                                             │
│ [Load More]                                                │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > History"
- **Title:** "History"
- **Date Range Picker:** Dropdown (Last 7 days, Last 30 days, Last 90 days, Last 7 years, Custom)
  - **Default:** Last 30 days (user preference)
  - **7-Year Option:** For regulatory compliance verification (Law No. 09-08 minimum retention)

### Regulatory Compliance Information Banner (Fatima's Requirement)
- **Location:** Prominent banner below page header
- **Background:** Light blue (#eff6ff) with info icon
- **Content:**
  - **Immutability Warning:** "⚠️ Historical data is immutable per regulatory requirements (Law No. 09-08). No modifications allowed."
  - **Data Retention Status:**
    - "📅 Data Retention: 7 years minimum (Law No. 09-08)"
    - "Retention Period: [Created Date] to [Date + 7 years]"
    - "Status: ✓ All historical data compliant" or "⚠️ [X] records approaching expiration"
  - **Collapsible:** Can be collapsed but visible by default
  - **Dismissible:** Can be dismissed but reappears on page reload (regulatory requirement visibility)

### Filters Sidebar
- **Type Filter:** Submission, Breach, Export Request, Enforcement Action, **Deletion** (NEW), Appeal, etc.
- **Entity Filter:** Product, SKU, Company, Enforcement Action, etc.
  - **Deletion Entity Filter (NEW):** When Type = Deletion, filter by:
    - All Deletions
    - Company Deletions
    - Product Deletions
    - SKU Deletions
- **Company Filter:** All companies (MOH) or own company (Company users)
- **Deletion Workflow Status Filter (NEW):**
  - All Deletion Steps
  - Deletion Requested
  - Deletion Approved
  - Deletion Implemented
- **Enforcement Filter (if Type = Enforcement):** Warning, Fine, Suspension
- **Clear Filters Button**

### History Timeline/List
- **Format:** Timeline or list view
- **Item Components:**
  - **Action:** Entity type + action (e.g., "Submission #12345 Created", "Enforcement Action Created")
  - **Regulatory Reference (Fatima's Requirement):** 
    - **Submission:** "DMP Regulation Article 12 - Annual Registry Submission"
    - **Product Update:** "DMP Regulation Article 8 - Product Registry"
    - **Breach:** "DMP Regulation Article 15 - Stock Level Compliance"
    - **Enforcement:** Legal basis citation (see Enforcement Action Items below)
  - **Entity Details:** Company, User, Action Type (for enforcement)
  - **Timestamp:** Relative time
  - **View Link:** Navigate to entity detail
- **Deletion History Items (NEW):**
  - **Format:** Timeline items for deletion workflow steps
  - **Item 1: Deletion Requested**
    - **Title:** "Company Deletion Requested" or "Product Deletion Requested" or "SKU Deletion Requested"
    - **Icon:** ⚠️ Warning icon (red/orange)
    - **Regulatory Reference:** "DMP Regulation Article [X] - Registry Deletion"
    - **Details:**
      - Entity Type: Company/Product/SKU
      - Entity Name/Code: Display name or code
      - Requested by: Tier 2 Officer [Name]
      - Reason: [Deletion reason]
    - **Timestamp:** When deletion was requested
    - **Link:** "View Submission" → Navigate to `/rmm/submissions/[id]`
  - **Item 2: Deletion Approved**
    - **Title:** "Company Deletion Approved" or "Product Deletion Approved" or "SKU Deletion Approved"
    - **Icon:** ✅ Approval icon (green)
    - **Regulatory Reference:** "DMP Regulation Article [X] - Registry Deletion Approval"
    - **Details:**
      - Entity Type: Company/Product/SKU
      - Entity Name/Code: Display name or code
      - Approved by: Tier 1 [Name]
      - Note: "Command issued to Tier 2 Registrar"
    - **Timestamp:** When deletion was approved
    - **Link:** "View Submission" → Navigate to `/rmm/submissions/[id]`
  - **Item 3: Deletion Implemented**
    - **Title:** "Company Deletion Implemented" or "Product Deletion Implemented" or "SKU Deletion Implemented"
    - **Icon:** 🗑️ Delete icon (red)
    - **Regulatory Reference:** "DMP Regulation Article [X] - Registry Deletion Implementation"
    - **Details:**
      - Entity Type: Company/Product/SKU
      - Entity Name/Code: Display name or code
      - Implemented by: Tier 2 Registrar [Name]
      - Deactivation: Soft delete applied
      - Old Values: "[View Old Values]" → Link to audit log detail showing preserved old_values
      - Cascade Effects: "5 products, 12 SKUs deactivated" (if company deletion)
    - **Timestamp:** When deletion was implemented
    - **Links:**
      - "View Audit Log" → Navigate to `/audit/logs/[id]`
      - "View Old Values" → Navigate to audit log detail with old_values expanded
- **Enforcement Action Items (Enhanced per Fatima's Requirements):**
  - **Format:** "⚠️ Enforcement Action Created" or "✅ Enforcement Action Executed"
  - **Legal Basis (REQUIRED):** 
    - "Legal Basis: DMP Art. 12 - Non-Compliance Penalty"
    - Must be prominently displayed (not hidden in tooltip)
  - **Compliance Status Indicator:**
    - "✓ Compliant" (green) - Action meets all regulatory requirements
    - "⚠️ Review Required" (yellow) - Regulatory review needed
  - **Appeal Window Tracking (if applicable):**
    - "Appeal Window: 🔴 [X] days remaining" (red if <7 days, yellow if 7-14 days, green if >14 days)
    - "Deadline: [Date + 30 days from creation]"
    - Only shown if appeal window is open
  - **Appeal Status (if applicable):**
    - "Appealed" - Appeal submitted
    - "Appeal Under Review" - Appeal being reviewed
    - "Appeal Resolved" - Appeal decision made
  - **Details:** Action type (Warning/Fine/Suspension), violation type, company
  - **Link:** Navigate to `/enforcement/actions/[id]` (read-only for companies)

### Empty State
- **Message:** "No history found"
- **Action:** Adjust filters

---

## Annotations

### Blue (Interactions)
- **Click filter** → Apply filter, update list
- **Click history item** → Navigate to entity detail
- **Click date range** → Select date range

### Green (States)
- **Loading state:** Skeleton loaders
- **Empty state:** Icon + message
- **Filtered results:** Show count

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/history`
- [Historical Data Routing Proposal](../../../../02-architecture/frontend/historical-data-routing-proposal.md) - Historical data access patterns
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Timeline, Filter, Search components
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference including data retention requirements
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - Detailed compliance requirements including data retention

---

## Design System References

### Components Used
- **Timeline Component:** History timeline (custom, shadcn/ui inspired)
- **Filter Component:** Type, date, module filters (shadcn/ui select/checkbox)
- **Search Component:** Search input (shadcn/ui input)
- **Badge Component:** Type, status badges (shadcn/ui badge)
- **Button Component:** Filter, export buttons (shadcn/ui button)
- **Icon Component:** Type, action icons (Lucide React via shadcn/ui)
- **Skeleton Component:** Loading states (shadcn/ui skeleton)
- **Empty State Component:** No history message (shadcn/ui empty state pattern)
- **Tooltip Component:** Hover tooltips (shadcn/ui tooltip)

### Design Inspiration References
- **Stripe Dashboard:** https://dashboard.stripe.com - Professional history/activity patterns
- **GitHub:** https://github.com - Clean activity timeline, history views
- **Linear App:** https://linear.app - Modern history, smooth interactions
- **shadcn/ui Components:** https://ui.shadcn.com - Component patterns
- **GitLab/Jira:** Activity timeline patterns for reference

### Colors (From Design System)
- **Background:** #ffffff (white) - Clean, professional
- **Timeline Line:** #e5e7eb (border-default) - Subtle timeline separator
- **Timeline Dot:** #3b82f6 (primary-500) - Blue for timeline markers
- **Card Background:** #ffffff (white) - Clean card background
- **Card Border:** #e5e7eb (border-default) - Subtle separation
- **Card Shadow:** rgba(0, 0, 0, 0.05) - Subtle elevation
- **Hover Background:** #f9fafb (bg-secondary) - Light gray on hover
- **Active Background:** #f3f4f6 (bg-tertiary) - Slightly darker on click
- **Text Primary:** #111827 (text-primary) - High contrast
- **Text Secondary:** #6b7280 (text-secondary)
- **Text Tertiary:** #9ca3af (text-tertiary)
- **Focus Ring:** #3b82f6 (primary-500), 2px outline
- **Type Badge Colors:**
  - Submission: #3b82f6 (primary-500)
  - Breach: #f59e0b (warning-500)
  - Enforcement: #ef4444 (error-500)
  - Message: #22c55e (success-500)

### Typography (From Design System)
- **Page Title:** 30px, font-weight: 700 (h1)
- **History Item Title:** 14px, font-weight: 600
- **History Item Description:** 14px, font-weight: 400
- **Timestamp:** 12px, font-weight: 400
- **Type Badge:** 11px, font-weight: 600
- **Filter Label:** 12px, font-weight: 500

### Spacing (8px Grid System)
- **Page Padding:** 24px (3 × 8px) - Comfortable page edge spacing
- **Timeline Item Padding:** 16px horizontal (2 × 8px), 12px vertical (1.5 × 8px)
- **Timeline Item Gap:** 16px (2 × 8px) between items
- **Timeline Line Width:** 2px - Subtle timeline separator
- **Timeline Dot Size:** 12px (1.5 × 8px) - Timeline marker
- **Card Border Radius:** 8px (1 × 8px) - Modern, subtle rounding
- **Filter Section Padding:** 16px (2 × 8px)
- **Button Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)

### Transitions & Animations
- **Timeline Item Hover:** 150ms ease-in-out
- **Timeline Item Click:** 150ms ease-in-out
- **Filter Toggle:** 200ms ease-in-out
- **Search Focus:** 200ms ease-in-out
- **Timeline Scroll:** Smooth scrolling for long timelines

### Accessibility (WCAG 2.1 AA Compliance)
- **Color Contrast:** Minimum 4.5:1 for text, 3:1 for UI components
- **Focus Indicators:** 2px solid outline, #3b82f6 (primary-500), 2px offset
- **Keyboard Navigation:** Full keyboard support (Tab, Enter, Arrow keys, Escape)
- **Screen Reader Support:** ARIA labels, roles, and descriptions
- **Touch Targets:** Minimum 40px × 40px for all interactive elements
- **ARIA Labels:** Descriptive labels for all history items and actions
- **Skip Links:** "Skip to main content" link for keyboard users
- **Timeline Navigation:** Logical DOM order matches visual order

---

## Industry Best Practices Implementation

### Performance Optimizations
- **Lazy Loading:** History items load on demand (pagination or infinite scroll)
- **Virtual Scrolling:** For extremely long history timelines (if needed)
- **Debounced Search:** Debounce search input (300ms)
- **CSS Containment:** Use `contain: layout style paint` for timeline items
- **Will-Change:** Hint browser about timeline animations (`will-change: transform, opacity`)
- **Data Fetching:** Parallel API calls for filters and history data
- **Caching:** Cache history data with appropriate TTL (5-10 minutes)

### Modern CSS Features
- **CSS Grid/Flexbox:** Use flexbox for timeline layout (flexible, responsive)
- **CSS Custom Properties:** Use design system tokens for colors/spacing
- **Backdrop Filter:** Subtle blur effects for modals/overlays (if supported, graceful degradation)
- **CSS Transitions:** Smooth animations for all state changes
- **Container Queries:** Consider for component-level responsive design (future enhancement)

### State Management
- **History State:** Track selected item, filters, search query, date range
- **Real-time Updates:** WebSocket or polling for new history items (30s interval, optional)
- **Local Storage:** Cache filter preferences, date range, sort order
- **Optimistic Updates:** Update UI optimistically, sync with server
- **Error Recovery:** Retry failed API calls with exponential backoff

### Error Handling
- **Loading States:** Skeleton loaders for history items while loading
- **Error Boundaries:** Graceful degradation if history fails to load
- **Retry Logic:** Automatic retry with exponential backoff
- **Offline Support:** Cache history data for offline access
- **Fallback:** Default empty state if all else fails

### Browser Support
- **Modern Browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Progressive Enhancement:** Core functionality works without JS (basic history display)
- **Polyfills:** For older browsers if needed (Intersection Observer, ResizeObserver, etc.)

### Testing Considerations
- **Visual Regression:** Test history at different screen sizes
- **Responsive Testing:** Test at key breakpoints (768px, 1024px, 1920px)
- **Accessibility Testing:** Screen reader, keyboard navigation, color contrast
- **Performance Testing:** Lighthouse scores, Core Web Vitals, Time to Interactive
- **Cross-browser Testing:** Test filters, search, timeline interactions
- **Data Loading Testing:** Test with slow network, empty states, error states
- **Date Range Testing:** Test various date ranges, edge cases (7 years, large datasets)

### Security Considerations
- **XSS Prevention:** Sanitize all history content (descriptions, metadata)
- **CSRF Protection:** For all state-changing actions (export, filter)
- **Data Isolation:** Ensure history data isolation (RLS)
- **Permission Checks:** Verify user permissions before displaying history items
- **Read-only Enforcement:** Ensure historical data is read-only

### Real-time Features
- **WebSocket Connection:** For instant new history item delivery (optional)
- **Polling Fallback:** If WebSocket unavailable (30s interval, optional)
- **Badge Count Updates:** Real-time count updates (if applicable)

### History-Specific Optimizations
- **Timeline Rendering:** Efficient rendering for long timelines (1000+ items)
- **Search Optimization:** Debounce search, server-side filtering
- **Filter Optimization:** Cache filter options, lazy load filter data
- **Date Range Optimization:** Efficient date range queries, indexing
- **Code Splitting:** Split history code by feature (timeline, filters, search, export)

### User Experience Enhancements
- **Keyboard Shortcuts:** 
  - `j/k` - Navigate up/down timeline items
  - `Enter` - View selected item
  - `/` - Focus search
  - `f` - Focus filters
- **Bulk Actions:** Select multiple items for bulk operations (export, filter)
- **Quick Actions:** Hover actions (view, export, filter)
- **Infinite Scroll:** Load more items as user scrolls
- **Pull to Refresh:** Refresh history list (mobile)
- **Date Navigation:** Quick date navigation (today, yesterday, last week, last month)
- **Timeline Zoom:** Zoom in/out timeline view (optional enhancement)

---

**Last Updated:** 2025-01-01  
**Status:** 🟡 Ready for Review  
**Design Approach:** Modern enterprise history overview pattern (Stripe/GitHub/Linear/shadcn/ui inspired)
