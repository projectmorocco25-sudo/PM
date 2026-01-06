# Task 0.5.1.18: Company Dashboard Wireframe

**Status:** 🟡 In Progress  
**Route:** `/dashboard` (Company role)  
**File:** `task-0.5.1.18-company-dashboard.png`  
**Priority:** 🔴 Critical Foundation

**Design Approach:** Modern enterprise dashboard pattern inspired by Stripe, GitHub, Linear, and shadcn/ui best practices. Professional, accessible, and optimized for company users managing regulatory compliance workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > Dashboard                                             │
│                                                             │
│ Welcome, [Company Name]                    [Quick Actions] │
│                                                             │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│ │ My Submissions │ │ Pending         │ │ Recent Activity ││
│ │                 │ │ Approvals       │ │                 ││
│ │ 12              │ │ 3               │ │ • Submission #1 ││
│ │                 │ │                 │ │   Approved      ││
│ │ Recent:         │ │ • Product ABC   │ │   2 hours ago   ││
│ │ • Product XYZ   │ │ • Product DEF   │ │                 ││
│ │   Submitted     │ │ • Product GHI   │ │ • Submission #2 ││
│ │   1 day ago     │ │                 │ │   Pending       ││
│ │                 │ │                 │ │   5 hours ago   ││
│ │ [View all →]   │ │ [View all →]   │ │                 ││
│ └─────────────────┘ └─────────────────┘ └─────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Enforcement Actions (My Company)                         ││
│ │                                                          ││
│ │ ┌─────────────────────────────────────────────────────┐ ││
│ │ │ ⚠️ Warning - Submission Non-Compliance              │ ││
│ │ │ Status: Executed  Date: 2 days ago                  │ ││
│ │ │ Violation: WSL submission overdue                    │ ││
│ │ │ [View Details] [Appeal] (if within 30 days)         │ ││
│ │ ├─────────────────────────────────────────────────────┤ ││
│ │ │ ⚠️ Warning - Critical Medicine Non-Compliance      │ ││
│ │ │ Status: Executed  Date: 1 week ago                 │ ││
│ │ │ Violation: Critical medicine stock below threshold  │ ││
│ │ │ [View Details] [Appeal] (if within 30 days)         │ ││
│ │ └─────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ [View All Enforcement Actions]                          ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Key Metrics                                              ││
│ │                                                          ││
│ │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   ││
│ │ │Compliance│ │ Active   │ │ Pending  │ │ Completed│   ││
│ │ │ Score    │ │ Submissions│ │ Actions │ │ This Month│   ││
│ │ │          │ │          │ │          │ │          │   ││
│ │ │   85%    │ │    12    │ │    3     │ │    24    │   ││
│ │ │          │ │          │ │          │ │          │   ││
│ │ │ ↗ +5%    │ │ → View   │ │ → View   │ │ → View   │   ││
│ │ └──────────┘ └──────────┘ └──────────┘ └──────────┘   ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > Dashboard"
- **Typography:** 14px, color: #6b7280
- **Welcome Message:** "Welcome, [Company Name]"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Quick Actions (Optional):**
  - **Buttons:** "New Submission", "View Reports", etc.
  - **Position:** Right-aligned
  - **Spacing:** 24px below breadcrumbs

### Widget Grid (Top Row)
- **Layout:** 3-column grid (desktop), 1-column (mobile)
- **Gap:** 24px between widgets
- **Widget Height:** Auto (min 200px)

**My Submissions Widget:**
- **Title:** "My Submissions"
- **Count:** Large number (e.g., "12")
  - **Typography:** 32px, font-weight: 700, color: #111827
- **Recent Submissions List:**
  - **Format:** List items with title, status, timestamp
  - **Max Items:** 3-5 recent items
  - **Item Height:** 48px
  - **Spacing:** 8px between items
- **Action Link:** "View all →" (bottom of widget)
  - **Typography:** 14px, color: #2563eb (text-link)
  - **Click Action:** Navigate to submissions list

**Pending Approvals Widget:**
- **Title:** "Pending Approvals"
- **Count:** Large number (e.g., "3")
  - **Typography:** 32px, font-weight: 700, color: #f59e0b (warning-500)
- **Pending Items List:**
  - **Format:** List items with title, priority indicator
  - **Max Items:** 3-5 pending items
  - **Priority Badge:** High/Medium/Low (color-coded)
- **Action Link:** "View all →" (bottom of widget)

**Recent Activity Widget:**
- **Title:** "Recent Activity"
- **Activity Timeline:**
  - **Format:** Timeline/list with icon, description, timestamp
  - **Max Items:** 5-7 recent activities
  - **Filter:** Optional filter by type (dropdown)
- **Activity Types:**
  - Submission approved/rejected
  - New message
  - Breach alert
  - Workflow action
  - Enforcement action (warning, fine, suspension)
  - Enforcement action appeal status

### Key Metrics Section
- **Title:** "Key Metrics"
- **Typography:** 20px, font-weight: 600, color: #111827
- **Layout:** 4-column grid (desktop), 2-column (tablet), 1-column (mobile)
- **Gap:** 16px between cards

**Metric Cards:**
- **Compliance Score Card:**
  - **Title:** "Compliance Score"
  - **Value:** Percentage (e.g., "85%")
  - **Typography:** 36px, font-weight: 700, color: #22c55e (success-500)
  - **Trend:** "↗ +5%" (green if positive, red if negative)
  - **Background:** White (#ffffff)
  - **Border:** 1px solid #e5e7eb
  - **Border Radius:** 8px
  - **Padding:** 24px

- **Active Submissions Card:**
  - **Title:** "Active Submissions"
  - **Value:** Count (e.g., "12")
  - **Typography:** 36px, font-weight: 700, color: #3b82f6 (primary-500)
  - **Action:** "→ View" link
  - **Click Action:** Navigate to active submissions

- **Pending Actions Card:**
  - **Title:** "Pending Actions"
  - **Value:** Count (e.g., "3")
  - **Typography:** 36px, font-weight: 700, color: #f59e0b (warning-500)
  - **Action:** "→ View" link

- **Completed This Month Card:**
  - **Title:** "Completed This Month"
  - **Value:** Count (e.g., "24")
  - **Typography:** 36px, font-weight: 700, color: #6b7280 (text-secondary)
  - **Action:** "→ View" link

### Enforcement Actions Section (Company View)

**Visibility:** Always visible for company users
- **Title:** "Enforcement Actions (My Company)"
- **Position:** Below widget grid, full width
- **Purpose:** Display enforcement actions taken against the company (read-only view)
- **Layout:** Full width, scrollable list
- **Item Format:**
  - **Action Type Badge:** ⚠️ Warning / 💰 Fine / 🚫 Suspension
  - **Violation Type:** Brief description (e.g., "Submission Non-Compliance", "Critical Medicine Non-Compliance")
  - **Status:** Executed / Pending Approval / Appealed / Resolved
  - **Date:** Execution date or creation date
  - **Status Badge:** Color-coded (Executed: gray, Pending: yellow, Appealed: orange, Resolved: green)
  - **Action Buttons:**
    - **View Details:** Navigate to enforcement action detail page (read-only for companies)
    - **Appeal:** Create appeal (only if within 30-day window and status is Executed)
- **Footer Actions:**
  - **View All Enforcement Actions:** Navigate to `/enforcement/actions?company_id=[my_company_id]` (filtered view)
- **Empty State:**
  - **Message:** "No enforcement actions"
  - **Icon:** Checkmark icon

**Note:** Companies can view their enforcement actions but cannot create or manage them. They can appeal executed actions within 30 days.

---

## Annotations

### Blue (Interactions)
- **Click widget "View all"** → Navigate to related list page
- **Click submission/item in widget** → Navigate to item detail page
- **Click metric card "View"** → Navigate to related page
- **Click quick action button** → Perform action (e.g., "New Submission")
- **Click "View Details" in Enforcement Actions** → Navigate to enforcement action detail page (read-only)
- **Click "Appeal" in Enforcement Actions** → Open appeal creation form (if within 30-day window)
- **Click "View All Enforcement Actions"** → Navigate to filtered enforcement actions list

### Green (States)
- **Loading state:** Skeleton loaders for widgets and metrics
- **Empty state:** "No submissions yet" message in widget
- **Error state:** Error message if data fetch fails
- **Real-time updates:** Widget counts update when new data arrives

---

## Responsive Behavior

### Desktop (1024px+)
- **Widget Grid:** 3 columns
- **Metrics Grid:** 4 columns
- **Full layout:** All widgets and metrics visible

### Tablet (768px - 1023px)
- **Widget Grid:** 2 columns (or 1 column stacked)
- **Metrics Grid:** 2 columns
- **Spacing:** Reduced gaps (16px)

### Mobile (<768px)
- **Widget Grid:** 1 column (stacked)
- **Metrics Grid:** 1 column (stacked)
- **Spacing:** 16px gaps
- **Widget Height:** Auto, full width

---

## Design System References

### Components Used
- **Card Component:** Widget containers, metric cards (shadcn/ui card)
- **List Component:** Recent submissions, pending approvals, activity timeline (shadcn/ui list)
- **Badge Component:** Priority indicators, status badges (shadcn/ui badge)
- **Metric Card Component:** Key metrics display (custom, shadcn/ui inspired)
- **Button Component:** Quick actions (shadcn/ui button)
- **Skeleton Component:** Loading states (shadcn/ui skeleton)
- **Empty State Component:** No data states (shadcn/ui empty state pattern)
- **Tooltip Component:** Hover tooltips (shadcn/ui tooltip)

### Design Inspiration References
- **Stripe Dashboard:** https://dashboard.stripe.com - Professional dashboard layout
- **GitHub:** https://github.com - Clean dashboard, activity feeds
- **Linear App:** https://linear.app - Modern dashboard, smooth interactions
- **shadcn/ui Dashboard:** https://ui.shadcn.com/examples/dashboard - Component patterns
- **Taxonomy (shadcn/ui):** https://tx.shadcn.com/ - Full implementation example

### Colors (From Design System)
- **Widget Background:** #ffffff (white) - Clean, professional
- **Widget Border:** #e5e7eb (border-default) - Subtle separation
- **Widget Shadow:** rgba(0, 0, 0, 0.05) - Subtle elevation
- **Compliance Score:** #22c55e (success-500) - Green for positive states
- **Active Submissions:** #3b82f6 (primary-500) - Blue for primary actions
- **Pending Actions:** #f59e0b (warning-500) - Orange for warnings
- **Completed:** #6b7280 (text-secondary) - Gray for neutral states
- **Text Primary:** #111827 (text-primary) - High contrast
- **Text Secondary:** #6b7280 (text-secondary)
- **Text Tertiary:** #9ca3af (text-tertiary)
- **Hover Background:** #f9fafb (bg-secondary)
- **Focus Ring:** #3b82f6 (primary-500), 2px outline

### Typography (From Design System)
- **Page Title:** 30px, font-weight: 700 (h1)
- **Section Title:** 20px, font-weight: 600 (h2)
- **Card Title:** 16px, font-weight: 600 (h3)
- **Body Text:** 14px, font-weight: 400
- **Small Text:** 12px, font-weight: 400
- **Label Text:** 12px, font-weight: 500

### Spacing (8px Grid System)
- **Page Padding:** 24px (3 × 8px) desktop, 16px (2 × 8px) mobile
- **Widget Gap:** 24px (3 × 8px) desktop, 16px (2 × 8px) mobile
- **Metric Card Gap:** 16px (2 × 8px)
- **Widget Padding:** 24px (3 × 8px) - Comfortable content spacing
- **Card Border Radius:** 8px (1 × 8px) - Modern, subtle rounding
- **Button Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)

### Transitions & Animations
- **Card Hover:** 150ms ease-in-out (subtle elevation change)
- **Button Hover:** 150ms ease-in-out
- **Widget Loading:** 200ms fade-in
- **State Changes:** 200ms ease-in-out

### Accessibility (WCAG 2.1 AA Compliance)
- **Color Contrast:** Minimum 4.5:1 for text, 3:1 for UI components
- **Focus Indicators:** 2px solid outline, #3b82f6 (primary-500), 2px offset
- **Keyboard Navigation:** Full keyboard support (Tab, Enter, Arrow keys)
- **Screen Reader Support:** ARIA labels, roles, and descriptions
- **Touch Targets:** Minimum 40px × 40px for all interactive elements
- **ARIA Labels:** Descriptive labels for all widgets and actions
- **Live Regions:** For real-time updates (compliance status, activity feed)

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/dashboard`
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - Company role dashboard
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Card, List, Metric components

---

## Industry Best Practices Implementation

### Performance Optimizations
- **Lazy Loading:** Dashboard cards and widgets load on demand
- **Virtual Scrolling:** For long activity lists (if needed)
- **Debounced Resize:** Debounce window resize handlers (150ms)
- **CSS Containment:** Use `contain: layout style paint` for dashboard sections
- **Will-Change:** Hint browser about chart animations (`will-change: transform, opacity`)
- **Data Fetching:** Parallel API calls for independent widgets, sequential for dependent data
- **Caching:** Cache dashboard data with appropriate TTL (5-10 minutes)

### Modern CSS Features
- **CSS Grid/Flexbox:** Use CSS Grid for dashboard layout (responsive, flexible)
- **CSS Custom Properties:** Use design system tokens for colors/spacing
- **Backdrop Filter:** Subtle blur effects for modals/overlays (if supported, graceful degradation)
- **CSS Transitions:** Smooth animations for all state changes
- **Container Queries:** Consider for component-level responsive design (future enhancement)

### State Management
- **Dashboard State:** Track widget visibility, collapsed/expanded states
- **Real-time Updates:** WebSocket or polling for live data (30s interval)
- **Local Storage:** Cache user preferences (widget order, collapsed states)
- **Optimistic Updates:** Update UI optimistically, sync with server
- **Error Recovery:** Retry failed API calls with exponential backoff

### Error Handling
- **Loading States:** Skeleton loaders for all dashboard widgets
- **Error Boundaries:** Graceful degradation if widget fails
- **Retry Logic:** Automatic retry with exponential backoff for failed widgets
- **Offline Support:** Cache dashboard data for offline access
- **Fallback:** Default empty states if data unavailable

### Browser Support
- **Modern Browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Progressive Enhancement:** Core functionality works without JS (basic dashboard display)
- **Polyfills:** For older browsers if needed (Intersection Observer, ResizeObserver, etc.)

### Testing Considerations
- **Visual Regression:** Test dashboard at different screen sizes
- **Responsive Testing:** Test at key breakpoints (768px, 1024px, 1920px)
- **Accessibility Testing:** Screen reader, keyboard navigation, color contrast
- **Performance Testing:** Lighthouse scores, Core Web Vitals, Time to Interactive
- **Cross-browser Testing:** Test charts, widgets, responsive behavior
- **Data Loading Testing:** Test with slow network, empty states, error states

### Security Considerations
- **XSS Prevention:** Sanitize all user-generated content
- **CSRF Protection:** For all state-changing actions
- **Data Isolation:** Ensure company data isolation (RLS)
- **Permission Checks:** Verify user permissions before displaying actions

### Real-time Features
- **WebSocket Connection:** For instant updates (submissions, messages, enforcement)
- **Polling Fallback:** If WebSocket unavailable (30s interval)
- **Badge Count Updates:** Real-time badge counts in widgets
- **Activity Feed:** Real-time activity feed updates

### Dashboard-Specific Optimizations
- **Widget Loading:** Load critical widgets first (compliance status, pending actions)
- **Chart Rendering:** Use canvas or SVG for charts (performance)
- **Image Optimization:** Lazy load images, use WebP format
- **Code Splitting:** Split dashboard code by widget/module
- **Prefetching:** Prefetch likely next pages (submissions, products)

---

**Last Updated:** 2025-01-01  
**Status:** 🟡 Ready for Review  
**Design Approach:** Modern enterprise dashboard pattern (Stripe/GitHub/Linear/shadcn/ui inspired)
