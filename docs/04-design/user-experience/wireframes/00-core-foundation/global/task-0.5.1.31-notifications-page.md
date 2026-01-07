# Task 0.5.1.31: Notifications Page Wireframe

**Status:** 🟡 In Progress  
**Route:** `/notifications`  
**File:** `task-0.5.1.31-notifications-page.png`  
**Priority:** 🔴 Critical Foundation

**Design Approach:** Modern enterprise notifications page pattern inspired by Stripe, GitHub, Linear, and shadcn/ui best practices. Professional, accessible, and optimized for regulatory compliance notification management.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > Notifications                                         │
│                                                             │
│ Notifications        [Mark all read] [Settings] [Filters ▼] │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ ● Submission Approved                                     ││
│ │   Your product submission #12345 was approved            ││
│ │   2 hours ago                              [Mark read]    ││
│ ├─────────────────────────────────────────────────────────┤│
│ │ ○ Breach Alert                                           ││
│ │   Stock level below threshold for Product ABC            ││
│ │   5 hours ago                              [Mark read]    ││
│ ├─────────────────────────────────────────────────────────┤│
│ │ ● New Message                                            ││
│ │   You have a new message from MOH                        ││
│ │   1 day ago                               [Mark read]     ││
│ ├─────────────────────────────────────────────────────────┤│
│ │ ● Enforcement Action                                    ││
│ │   Warning issued: Submission Non-Compliance              ││
│ │   2 days ago                               [Mark read]    ││
│ ├─────────────────────────────────────────────────────────┤│
│ │ ○ Enforcement Action Executed                           ││
│ │   Fine executed: 50,000 MAD                              ││
│ │   3 days ago                               [Mark read]    ││
│ ├─────────────────────────────────────────────────────────┤│
│ │ ● Appeal Status Update                                  ││
│ │   Your appeal for enforcement action #12345 was reviewed││
│ │   4 days ago                               [Mark read]    ││
│ ├─────────────────────────────────────────────────────────┤│
│ │ ● Threshold Reversion - 7 Day Warning                  ││
│ │   Threshold for SKU002 will revert on 25/06/2025        ││
│ │   1 day ago                               [Mark read]    ││
│ ├─────────────────────────────────────────────────────────┤│
│ │ ○ Threshold Reversion - 1 Day Warning                  ││
│ │   Threshold for SKU003 will revert tomorrow (30/06/2025)││
│ │   6 hours ago                              [Mark read]   ││
│ ├─────────────────────────────────────────────────────────┤│
│ │ ● Threshold Reversion Completed                        ││
│ │   Threshold for SKU002 has been reverted to 1.0x        ││
│ │   2 hours ago                              [Mark read]   ││
│ ├─────────────────────────────────────────────────────────┤│
│ │ ● Threshold Reversion Review Required                  ││
│ │   Threshold for SKU003 requires review before reversion││
│ │   1 hour ago                               [Mark read]   ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [Load More]                                                │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Title:** "Notifications"
- **Actions:** Mark all read, Settings, Filters

### Notification List
- **Items:** Type icon, Title, Message, Timestamp, Mark read button
- **Unread Indicator:** Blue dot (●)
- **Read Indicator:** Gray circle (○) or none

### Filters
- **Type:** Submission, Breach, Message, Workflow, Enforcement Action, Appeal, Threshold Reversion, System
- **Status:** All, Unread, Read
- **Date Range:** Last 7 days, Last 30 days, Custom
- **Enforcement Filter (if Type = Enforcement):** Warning, Fine, Suspension, Appeal
- **Threshold Reversion Filter (if Type = Threshold Reversion):**
  - 7-Day Warning
  - 1-Day Warning
  - Reversion Completed
  - Review Required

### Settings Panel
- **Notification Preferences:** Toggle switches for each type
- **Email Preferences:** Email notification settings

---

## Annotations

### Blue (Interactions)
- **Click notification** → Navigate to related page
  - **Enforcement Action notification** → Navigate to `/enforcement/actions/[id]`
  - **Appeal Status notification** → Navigate to `/enforcement/actions/[id]` (appeal section)
- **Click "Mark read"** → Mark notification as read
- **Click "Mark all read"** → Mark all as read
- **Click "Settings"** → Open settings panel

### Green (States)
- **Unread:** Blue dot, bold title
- **Read:** No indicator, normal text
- **Empty state:** Icon + message

---

## Design System References

### Components Used
- **List Component:** Notifications list (shadcn/ui table/list)
- **Filter Component:** Type, status, date filters (shadcn/ui select/checkbox)
- **Search Component:** Search input (shadcn/ui input)
- **Badge Component:** Unread count, type badges (shadcn/ui badge)
- **Button Component:** Mark as read, clear all buttons (shadcn/ui button)
- **Icon Component:** Notification type icons (Lucide React via shadcn/ui)
- **Skeleton Component:** Loading states (shadcn/ui skeleton)
- **Empty State Component:** No notifications message (shadcn/ui empty state pattern)
- **Tooltip Component:** Hover tooltips (shadcn/ui tooltip)

### Design Inspiration References
- **Stripe Dashboard:** https://dashboard.stripe.com - Professional notification patterns
- **GitHub:** https://github.com - Clean notifications page, notification management
- **Linear App:** https://linear.app - Modern notifications, smooth interactions
- **shadcn/ui Components:** https://ui.shadcn.com - Component patterns
- **Gmail/Outlook:** Notification management patterns for reference

### Colors (From Design System)
- **Background:** #ffffff (white) - Clean, professional
- **Unread Background:** #eff6ff (primary-50) - Subtle blue tint for unread
- **Hover Background:** #f9fafb (bg-secondary) - Light gray on hover
- **Active Background:** #f3f4f6 (bg-tertiary) - Slightly darker on click
- **Border:** #e5e7eb (border-default) - Subtle separation
- **Unread Indicator:** #3b82f6 (primary-500) - Blue dot for unread
- **Text Primary:** #111827 (text-primary) - High contrast
- **Text Secondary:** #6b7280 (text-secondary)
- **Text Tertiary:** #9ca3af (text-tertiary)
- **Focus Ring:** #3b82f6 (primary-500), 2px outline
- **Notification Type Colors:**
  - Submission: #3b82f6 (primary-500)
  - Breach: #f59e0b (warning-500)
  - Enforcement: #ef4444 (error-500)
  - Message: #22c55e (success-500)
  - Appeal: #8b5cf6 (purple-500)

### Typography (From Design System)
- **Page Title:** 30px, font-weight: 700 (h1)
- **Notification Title:** 14px, font-weight: 600 (unread), 400 (read)
- **Notification Message:** 14px, font-weight: 400
- **Timestamp:** 12px, font-weight: 400
- **Type Badge:** 11px, font-weight: 600
- **Filter Label:** 12px, font-weight: 500

### Spacing (8px Grid System)
- **Page Padding:** 24px (3 × 8px) - Comfortable page edge spacing
- **Notification Item Padding:** 16px horizontal (2 × 8px), 12px vertical (1.5 × 8px)
- **Notification Item Height:** Auto (min 64px / 8 × 8px) - Touch target minimum
- **Gap:** 8px (1 × 8px) between items
- **Filter Section Padding:** 16px (2 × 8px)
- **Search Input Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)
- **Button Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)

### Transitions & Animations
- **Notification Item Hover:** 150ms ease-in-out
- **Notification Item Click:** 150ms ease-in-out
- **Filter Toggle:** 200ms ease-in-out
- **Search Focus:** 200ms ease-in-out
- **Mark as Read:** 200ms fade-out
- **New Notification Arrival:** 200ms slide-in from top

### Accessibility (WCAG 2.1 AA Compliance)
- **Color Contrast:** Minimum 4.5:1 for text, 3:1 for UI components
- **Focus Indicators:** 2px solid outline, #3b82f6 (primary-500), 2px offset
- **Keyboard Navigation:** Full keyboard support (Tab, Enter, Arrow keys, Escape)
- **Screen Reader Support:** ARIA labels, roles, and descriptions
- **Touch Targets:** Minimum 40px × 40px for all interactive elements
- **ARIA Labels:** Descriptive labels for all notifications and actions
- **Live Regions:** For new notification announcements
- **Skip Links:** "Skip to main content" link for keyboard users

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/notifications`
- [Notification Center Component](../layout-navigation/task-0.5.1.17-notification-center-component.md) - Dropdown notification center reference
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - List, Filter, Search components
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - Detailed compliance requirements

---

## Industry Best Practices Implementation

### Performance Optimizations
- **Lazy Loading:** Notification items load on demand (pagination or infinite scroll)
- **Virtual Scrolling:** For extremely long notification lists (if needed)
- **Debounced Search:** Debounce search input (300ms)
- **CSS Containment:** Use `contain: layout style paint` for notification items
- **Will-Change:** Hint browser about notification animations (`will-change: transform, opacity`)
- **Data Fetching:** Parallel API calls for filters and notifications
- **Caching:** Cache notifications list with appropriate TTL (2-5 minutes)

### Modern CSS Features
- **CSS Grid/Flexbox:** Use flexbox for list layout (flexible, responsive)
- **CSS Custom Properties:** Use design system tokens for colors/spacing
- **Backdrop Filter:** Subtle blur effects for modals/overlays (if supported, graceful degradation)
- **CSS Transitions:** Smooth animations for all state changes
- **Container Queries:** Consider for component-level responsive design (future enhancement)

### State Management
- **Notifications State:** Track read/unread status, selected notifications, filters, search query
- **Real-time Updates:** WebSocket or polling for new notifications (30s interval)
- **Local Storage:** Cache filter preferences, read status
- **Optimistic Updates:** Mark as read optimistically, sync with server
- **Error Recovery:** Retry failed API calls with exponential backoff

### Error Handling
- **Loading States:** Skeleton loaders for notification items while loading
- **Error Boundaries:** Graceful degradation if notifications fail to load
- **Retry Logic:** Automatic retry with exponential backoff
- **Offline Support:** Cache notifications for offline access
- **Fallback:** Default empty state if all else fails

### Browser Support
- **Modern Browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Progressive Enhancement:** Core functionality works without JS (basic notification display)
- **Polyfills:** For older browsers if needed (Intersection Observer, ResizeObserver, etc.)

### Testing Considerations
- **Visual Regression:** Test notifications at different screen sizes
- **Responsive Testing:** Test at key breakpoints (768px, 1024px, 1920px)
- **Accessibility Testing:** Screen reader, keyboard navigation, color contrast
- **Performance Testing:** Lighthouse scores, Core Web Vitals, Time to Interactive
- **Cross-browser Testing:** Test filters, search, list interactions
- **Data Loading Testing:** Test with slow network, empty states, error states
- **Real-time Testing:** Test WebSocket/polling behavior, new notification arrival

### Security Considerations
- **XSS Prevention:** Sanitize all notification content (title, message)
- **CSRF Protection:** For all state-changing actions (mark as read, clear all)
- **Data Isolation:** Ensure notification data isolation (RLS)
- **Permission Checks:** Verify user permissions before displaying notifications

### Real-time Features
- **WebSocket Connection:** For instant notification delivery
- **Polling Fallback:** If WebSocket unavailable (30s interval)
- **Badge Count Updates:** Real-time badge count in header
- **New Notification Indicator:** Visual indicator for new notifications
- **Sound Notifications:** Optional sound on new notification (user preference)
- **Browser Notifications:** Optional browser notification (requires permission)

### Notifications-Specific Optimizations
- **List Rendering:** Use virtual scrolling for long lists (100+ notifications)
- **Search Optimization:** Debounce search, server-side filtering
- **Filter Optimization:** Cache filter options, lazy load filter data
- **Image Optimization:** Lazy load avatars, use WebP format
- **Code Splitting:** Split notifications code by feature (list, filters, search)

### User Experience Enhancements
- **Keyboard Shortcuts:** 
  - `j/k` - Navigate up/down notifications
  - `Enter` - View selected notification
  - `m` - Mark selected as read
  - `a` - Mark all as read
  - `/` - Focus search
- **Bulk Actions:** Select multiple notifications for bulk operations (mark as read, delete)
- **Quick Actions:** Hover actions (mark as read, delete, view)
- **Infinite Scroll:** Load more notifications as user scrolls
- **Pull to Refresh:** Refresh notifications list (mobile)
- **Type Filtering:** Filter by notification type (submission, breach, enforcement, message, appeal, threshold_reversion, system)
- **Read Status:** Clear visual indicators for read/unread notifications
- **Threshold Reversion Notifications:**
  - **7-Day Warning:** Sent 7 days before revert_date
  - **1-Day Warning:** Sent 1 day before revert_date
  - **Reversion Completed:** Sent when threshold is reverted (auto or manual)
  - **Review Required:** Sent to Tier 1 when manual review threshold reaches revert_date

---

**Last Updated:** 2025-01-01  
**Status:** 🟡 Ready for Review  
**Design Approach:** Modern enterprise notifications page pattern (Stripe/GitHub/Linear/shadcn/ui inspired)
