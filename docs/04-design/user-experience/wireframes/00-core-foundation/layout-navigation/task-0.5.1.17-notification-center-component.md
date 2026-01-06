# Task 0.5.1.17: Notification Center Component Wireframe

**Status:** 🟡 In Progress  
**Route:** Component in header (all dashboard pages)  
**File:** `task-0.5.1.17-notification-center-component.png`  
**Priority:** 🔴 Critical Foundation

**Design Approach:** Modern enterprise notification center pattern inspired by Stripe, GitHub, Linear, and shadcn/ui best practices. Professional, accessible, and optimized for real-time regulatory compliance notifications.

---

## Wireframe Layout (Dropdown/Popover)

```
┌─────────────────────────────────────┐
│ Notifications        [Mark all read]│
├─────────────────────────────────────┤
│ ● Submission Approved               │
│   Your product submission #12345   │
│   was approved                       │
│   2 hours ago                       │
├─────────────────────────────────────┤
│ ○ Breach Alert                      │
│   Stock level below threshold for   │
│   Product ABC                        │
│   5 hours ago                        │
├─────────────────────────────────────┤
│ ● New Message                       │
│   You have a new message from MOH   │
│   1 day ago                          │
├─────────────────────────────────────┤
│ ○ Workflow Action Required          │
│   Your approval is needed for...    │
│   2 days ago                         │
├─────────────────────────────────────┤
│ ● Enforcement Action                │
│   Warning issued: Submission         │
│   Non-Compliance                     │
│   3 days ago                         │
├─────────────────────────────────────┤
│         [View All Notifications]     │
└─────────────────────────────────────┘
```

**Empty State:**

```
┌─────────────────────────────────────┐
│ Notifications        [Mark all read]│
├─────────────────────────────────────┤
│                                     │
│     📭 No notifications             │
│                                     │
│     You're all caught up!           │
│                                     │
└─────────────────────────────────────┘
```

---

## Component Specifications

### Notification Center Container
- **Position:** Dropdown/popover below notifications icon in header, right-aligned, 8px gap
- **Width:** 400px (desktop), 320px (tablet) - Optimal for notification content
- **Max Height:** 500px (scrollable if exceeds) - Comfortable viewing without overwhelming
- **Background:** White (#ffffff) - Clean, professional
- **Border:** 1px solid #e5e7eb (border-default) - Subtle separation
- **Border Radius:** 8px (modern, subtle rounding)
- **Box Shadow:** Medium shadow (0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)) - Elevation
- **Z-index:** 1050 (above header, below modals)
- **Animation:** 
  - Fade-in: 200ms ease-in-out
  - Slide-down: 4px offset, 200ms ease-out
- **Backdrop:** Optional subtle backdrop blur (if supported)
- **Overflow:** Hidden (rounded corners maintained)

### Header Section
- **Title:** "Notifications"
- **Typography:** 16px, font-weight: 600, color: #111827
- **Action Button:** "Mark all read" (right-aligned)
  - **Typography:** 14px, color: #2563eb (text-link)
  - **Hover:** Underline
  - **Click Action:** Marks all notifications as read

### Notification Items
- **Height:** Auto (min 64px)
- **Padding:** 16px horizontal, 12px vertical
- **Border Bottom:** 1px solid #e5e7eb (last item: no border)
- **Display:** Flex, column
- **Hover:** Light background (#f9fafb)

**Unread Indicator:**
- **Position:** Left edge of item, 0px from left
- **Width:** 3px (subtle, modern indicator)
- **Height:** Full height of item (extends to padding)
- **Background:** #3b82f6 (primary-500) - Matches active state
- **Border Radius:** 0px (left edge only)
- **Visibility:** Only for unread notifications
- **Animation:** Subtle fade-in when notification arrives (200ms)

**Notification Content:**
- **Title:** Bold, 14px, color: #111827 (unread) or #6b7280 (read)
- **Message:** 14px, color: #6b7280 (text-secondary), 2-3 lines max (truncate)
- **Timestamp:** 12px, color: #9ca3af (text-tertiary), right-aligned or below message
- **Spacing:** 4px between title and message, 8px between message and timestamp

**Notification Types (Icon/Badge):**
- **Submission:** Document icon
- **Breach:** Warning icon (orange)
- **Message:** Message icon
- **Workflow:** Checkmark icon
- **Enforcement:** ⚠️ Warning icon (red/orange) for warnings, 💰 Dollar icon for fines, 🚫 Block icon for suspensions
- **Appeal:** Scale/balance icon (for appeal status updates)
- **System:** Info icon
- **Position:** Left of title (optional, or use color coding)

### Footer Section
- **Button:** "View All Notifications"
- **Width:** Full width
- **Height:** 48px
- **Background:** Transparent
- **Border Top:** 1px solid #e5e7eb
- **Typography:** 14px, font-weight: 500, color: #2563eb
- **Click Action:** Navigate to `/notifications` page

### Empty State
- **Icon:** Large icon (64px × 64px), color: #9ca3af
- **Message:** "No notifications"
- **Sub-message:** "You're all caught up!"
- **Typography:** 16px, color: #6b7280
- **Centered:** Vertically and horizontally
- **Padding:** 48px vertical

---

## Notification Types & Styling

### Submission Notifications
- **Icon:** Document icon (blue)
- **Examples:**
  - "Submission Approved"
  - "Submission Rejected"
  - "Submission Requires Action"

### Breach Notifications
- **Icon:** Warning icon (orange/red)
- **Examples:**
  - "Breach Alert"
  - "Threshold Exceeded"
  - "Critical Breach"

### Message Notifications
- **Icon:** Message icon (blue)
- **Examples:**
  - "New Message"
  - "Message Reply"
  - "Message Mention"

### Workflow Notifications
- **Icon:** Checkmark/Workflow icon (green)
- **Examples:**
  - "Workflow Action Required"
  - "Workflow Completed"
  - "Workflow Rejected"

### Enforcement Notifications
- **Icon:** Warning icon (red/orange) for warnings, Dollar icon for fines, Block icon for suspensions
- **Examples:**
  - "Enforcement Action - Warning Issued"
  - "Enforcement Action - Fine Executed"
  - "Enforcement Action - Suspension Executed"
  - "Appeal Status Update"
  - "Enforcement Action Requires Approval" (MOH Tier 1)

### System Notifications
- **Icon:** Info icon (gray)
- **Examples:**
  - "System Maintenance"
  - "Feature Update"
  - "Policy Change"

---

## Annotations

### Blue (Interactions)
- **Click notification item** → Navigate to related page/entity
  - Submission notification → Navigate to submission detail
  - Breach notification → Navigate to breach detail
  - Message notification → Navigate to conversation detail
  - Workflow notification → Navigate to workflow entity
  - Enforcement notification → Navigate to `/enforcement/actions/[id]`
  - Appeal notification → Navigate to `/enforcement/actions/[id]` (appeal section)
  - **Keyboard:** Tab to navigate, Enter to activate
  - **Mobile:** Tap to navigate, closes dropdown
  - **Action:** Marks notification as read (if unread)
- **Click "Mark all read"** → Marks all notifications as read, updates badge count
  - **Keyboard:** Tab to focus, Enter to activate
  - **Real-time:** Updates via WebSocket or polling
- **Click "View All Notifications"** → Navigate to `/notifications` page
  - **Keyboard:** Tab to focus, Enter to activate
  - **Closes:** Dropdown closes after navigation
- **Click outside** → Closes notification center
  - **Backdrop click:** Closes dropdown
  - **Escape key:** Closes dropdown
- **Keyboard Navigation:**
  - **Tab:** Move through notification items
  - **Enter/Space:** Activate focused item
  - **Arrow Keys:** Navigate up/down through items (optional enhancement)
  - **Escape:** Close dropdown
- **Scroll Behavior:**
  - **Smooth scrolling:** For long notification lists
  - **Virtual scrolling:** For extremely long lists (if needed, rare)

### Orange (Validation)
- **Notification limit:** Show max 10-15 recent notifications in dropdown
- **Truncation:** Long messages truncated with ellipsis

### Green (States)
- **Unread notification:** 
  - Blue left border indicator (3px, #3b82f6)
  - Bold title (font-weight: 600)
  - Subtle background tint (#f9fafb) on hover
  - Animation: Subtle fade-in when notification arrives (200ms)
- **Read notification:** 
  - No left border indicator
  - Regular text (font-weight: 400)
  - Slightly muted colors
- **Hover state:** 
  - Light background (#f9fafb)
  - Smooth transition (150ms ease-in-out)
  - Desktop only (touch devices don't have hover)
- **Loading state:** 
  - Skeleton loaders when fetching notifications
  - Pulse animation (2s infinite)
  - 3-5 skeleton items visible
- **Empty state:** 
  - Icon + message when no notifications
  - Centered layout, comfortable padding
  - Friendly, reassuring message
- **Error state:**
  - Error message if notifications fail to load
  - Retry button
  - Icon: Alert circle (red)
  - Message: "Failed to load notifications. Please try again."
- **Badge count:** 
  - Updates in real-time (header icon badge)
  - Real-time updates via WebSocket or polling
  - Animation: Subtle pulse for new items
- **New notification arrival:**
  - Animation: Slide-in from top (200ms)
  - Badge count updates in real-time
  - Sound notification (optional, user preference)
  - Browser notification (if permission granted)

---

## Responsive Behavior

### Desktop (1024px+)
- **Width:** 400px
- **Position:** Below notifications icon, right-aligned
- **Max Height:** 500px (scrollable)

### Tablet (768px - 1023px)
- **Width:** 320px
- **Position:** Below notifications icon, right-aligned
- **Max Height:** 400px (scrollable)

### Mobile (<768px)
- **Width:** Full width minus 32px margin
- **Position:** Full-screen modal or bottom sheet
- **Max Height:** 80vh (scrollable)
- **Close Button:** X button in top-right corner

---

## Design System References

### Components Used
- **Dropdown/Popover Component:** Notification center container (shadcn/ui dropdown)
- **List Component:** Notification items list (custom)
- **Badge Component:** Unread indicator dot (shadcn/ui badge)
- **Button Component:** "Mark all read", "View All" buttons (shadcn/ui button variant)
- **Icon Component:** Notification type icons (Lucide React via shadcn/ui)
- **Empty State Component:** No notifications message (shadcn/ui empty state pattern)
- **Tooltip Component:** Timestamp tooltips (shadcn/ui tooltip)

### Design Inspiration References
- **Stripe Dashboard:** https://dashboard.stripe.com - Professional notification pattern
- **GitHub:** https://github.com - Clean notification dropdown
- **Linear App:** https://linear.app - Modern notification center
- **shadcn/ui Components:** https://ui.shadcn.com - Component patterns

### Colors (From Design System)
- **Background:** #ffffff (white) - Clean, professional
- **Border:** #e5e7eb (border-default) - Subtle separation
- **Dropdown Shadow:** rgba(0, 0, 0, 0.1) - Elevation
- **Unread Indicator:** #3b82f6 (primary-500) - Matches active state
- **Unread Title:** #111827 (text-primary) - High contrast
- **Read Title:** #6b7280 (text-secondary)
- **Message Text:** #6b7280 (text-secondary)
- **Timestamp:** #9ca3af (text-tertiary)
- **Hover Background:** #f9fafb (bg-secondary)
- **Active Background:** #f3f4f6 (bg-tertiary)
- **Focus Ring:** #3b82f6 (primary-500), 2px outline
- **Link Color:** #3b82f6 (primary-500) - Consistent with design system

### Typography (From Design System)
- **Header Title:** 16px, font-weight: 600
- **Notification Title:** 14px, font-weight: 600 (unread), 400 (read)
- **Notification Message:** 14px, font-weight: 400
- **Timestamp:** 12px, font-weight: 400
- **Footer Link:** 14px, font-weight: 500
- **Empty State:** 14px, font-weight: 500

### Spacing (8px Grid System)
- **Container Width:** 400px (50 × 8px) desktop, 320px (40 × 8px) tablet
- **Max Height:** 500px (62.5 × 8px)
- **Item Padding:** 12px horizontal (1.5 × 8px), 12px vertical (1.5 × 8px)
- **Item Min Height:** 64px (8 × 8px)
- **Header Padding:** 16px horizontal (2 × 8px), 12px vertical (1.5 × 8px)
- **Footer Height:** 48px (6 × 8px)
- **Item Gap:** 12px (1.5 × 8px) between icon and content
- **Content Gap:** 4px (0.5 × 8px) between title, message, timestamp
- **Empty State Padding:** 40px vertical (5 × 8px)

### Transitions & Animations
- **Dropdown Open/Close:** 200ms ease-in-out (fade + slide)
- **Notification Hover:** 150ms ease-in-out
- **Unread Indicator:** 200ms fade-in
- **New Notification Arrival:** 200ms slide-in from top
- **Skeleton Pulse:** 2s infinite
- **Badge Count Update:** 200ms fade-in/out

### Accessibility (WCAG 2.1 AA Compliance)
- **Color Contrast:** Minimum 4.5:1 for text, 3:1 for UI components
- **Focus Indicators:** 2px solid outline, #3b82f6 (primary-500), 2px offset
- **Keyboard Navigation:** Full keyboard support (Tab, Enter, Arrow keys, Escape)
- **Screen Reader Support:** ARIA labels, roles, and descriptions
- **Touch Targets:** Minimum 40px × 40px for all interactive elements
- **ARIA Live Regions:** For new notification announcements
- **Focus Trap:** Active when dropdown is open
- **Notification Priority:** ARIA priority levels (polite, assertive)

---

## Related Documents

- [Navigation & Layout Patterns](../../../../02-architecture/frontend/navigation-layout-patterns.md) - Header component
- [Notifications Page Wireframe](./../global/task-0.5.1.31-notifications-page.md) - Full notifications page
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Dropdown, List components
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - Detailed compliance requirements

---

## Industry Best Practices Implementation

### Performance Optimizations
- **Lazy Loading:** Notification items load on demand (pagination or infinite scroll)
- **Virtual Scrolling:** For extremely long notification lists (if needed, rare)
- **Debounced Updates:** Debounce notification count updates (500ms)
- **CSS Containment:** Use `contain: layout style paint` for dropdown
- **Will-Change:** Hint browser about dropdown animations (`will-change: transform, opacity`)
- **Real-time Updates:** WebSocket or efficient polling (30s interval) for new notifications

### Modern CSS Features
- **CSS Grid/Flexbox:** Use flexbox for notification layout (flexible, responsive)
- **CSS Custom Properties:** Use design system tokens for colors/spacing
- **Backdrop Filter:** Subtle blur effects for dropdown backdrop (if supported, graceful degradation)
- **CSS Transitions:** Smooth animations for all state changes
- **Scroll Snap:** Optional scroll snap for notification items (if needed)

### State Management
- **Notification State:** Track read/unread status, timestamps, counts
- **Dropdown State:** Track open/closed state
- **Real-time Updates:** WebSocket connection or polling for new notifications
- **Local Storage:** Cache notification preferences (sound, browser notifications)
- **Optimistic Updates:** Mark as read optimistically, sync with server

### Error Handling
- **Loading States:** Skeleton loaders for notification items while loading
- **Error Boundaries:** Graceful degradation if notifications fail to load
- **Retry Logic:** Automatic retry with exponential backoff
- **Offline Support:** Cache notifications for offline access
- **Fallback:** Default empty state if all else fails

### Browser Support
- **Modern Browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Progressive Enhancement:** Core functionality works without JS (basic notification display)
- **Polyfills:** For older browsers if needed (Intersection Observer, etc.)

### Testing Considerations
- **Visual Regression:** Test dropdown at different screen sizes
- **Responsive Testing:** Test at key breakpoints (768px, 1024px)
- **Accessibility Testing:** Screen reader, keyboard navigation, color contrast
- **Performance Testing:** Lighthouse scores, Core Web Vitals
- **Cross-browser Testing:** Test dropdown positioning, animations, scroll behavior
- **Real-time Testing:** Test WebSocket/polling behavior, notification arrival

### Security Considerations
- **XSS Prevention:** Sanitize notification content (title, message)
- **CSRF Protection:** For "mark as read" actions
- **Rate Limiting:** Prevent notification spam
- **Permission Management:** Browser notification permissions (opt-in)

### Real-time Features
- **WebSocket Connection:** For instant notification delivery
- **Polling Fallback:** If WebSocket unavailable (30s interval)
- **Badge Count Updates:** Real-time badge count in header
- **Sound Notifications:** Optional sound on new notification (user preference)
- **Browser Notifications:** Optional browser notification (requires permission)

---

## Industry Best Practices Implementation

### Performance Optimizations
- **Lazy Loading:** Notification items load on demand (pagination or infinite scroll)
- **Virtual Scrolling:** For extremely long notification lists (if needed, rare)
- **Debounced Updates:** Debounce notification count updates (500ms)
- **CSS Containment:** Use `contain: layout style paint` for dropdown
- **Will-Change:** Hint browser about dropdown animations (`will-change: transform, opacity`)
- **Real-time Updates:** WebSocket or efficient polling (30s interval) for new notifications

### Modern CSS Features
- **CSS Grid/Flexbox:** Use flexbox for notification layout (flexible, responsive)
- **CSS Custom Properties:** Use design system tokens for colors/spacing
- **Backdrop Filter:** Subtle blur effects for dropdown backdrop (if supported, graceful degradation)
- **CSS Transitions:** Smooth animations for all state changes
- **Scroll Snap:** Optional scroll snap for notification items (if needed)

### State Management
- **Notification State:** Track read/unread status, timestamps, counts
- **Dropdown State:** Track open/closed state
- **Real-time Updates:** WebSocket connection or polling for new notifications
- **Local Storage:** Cache notification preferences (sound, browser notifications)
- **Optimistic Updates:** Mark as read optimistically, sync with server

### Error Handling
- **Loading States:** Skeleton loaders for notification items while loading
- **Error Boundaries:** Graceful degradation if notifications fail to load
- **Retry Logic:** Automatic retry with exponential backoff
- **Offline Support:** Cache notifications for offline access
- **Fallback:** Default empty state if all else fails

### Browser Support
- **Modern Browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Progressive Enhancement:** Core functionality works without JS (basic notification display)
- **Polyfills:** For older browsers if needed (Intersection Observer, etc.)

### Testing Considerations
- **Visual Regression:** Test dropdown at different screen sizes
- **Responsive Testing:** Test at key breakpoints (768px, 1024px)
- **Accessibility Testing:** Screen reader, keyboard navigation, color contrast
- **Performance Testing:** Lighthouse scores, Core Web Vitals
- **Cross-browser Testing:** Test dropdown positioning, animations, scroll behavior
- **Real-time Testing:** Test WebSocket/polling behavior, notification arrival

### Security Considerations
- **XSS Prevention:** Sanitize notification content (title, message)
- **CSRF Protection:** For "mark as read" actions
- **Rate Limiting:** Prevent notification spam
- **Permission Management:** Browser notification permissions (opt-in)

### Real-time Features
- **WebSocket Connection:** For instant notification delivery
- **Polling Fallback:** If WebSocket unavailable (30s interval)
- **Badge Count Updates:** Real-time badge count in header
- **Sound Notifications:** Optional sound on new notification (user preference)
- **Browser Notifications:** Optional browser notification (requires permission)

---

**Last Updated:** 2025-01-01  
**Status:** 🟡 Ready for Review  
**Design Approach:** Modern enterprise notification center pattern (Stripe/GitHub/Linear/shadcn/ui inspired)  
**Design Approach:** Modern enterprise notification center pattern (Stripe/GitHub/Linear/shadcn/ui inspired)
