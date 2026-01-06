# Task 0.5.1.27: Sent Messages Page Wireframe

**Status:** 🟡 In Progress  
**Route:** `/communications/sent`  
**File:** `task-0.5.1.27-sent-messages.png`  
**Priority:** 🔴 Critical Foundation

**Design Approach:** Modern enterprise sent messages pattern inspired by Stripe, GitHub, Linear, and shadcn/ui best practices. Professional, accessible, and optimized for regulatory compliance communication workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > Communications > Sent Messages                      │
│                                                             │
│ Sent Messages                    [Filters ▼] [Search...]   │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ To: Company ABC                    ✓✓ Read  2 hours ago││
│ │ Subject: Product Submission #12345                      ││
│ │ Preview: Your submission has been reviewed...           ││
│ ├─────────────────────────────────────────────────────────┤│
│ │ To: MOH Tier 1                    ✓ Delivered 1 day  ││
│ │ Subject: Request for Additional Info                  ││
│ │ Preview: Could you provide more details...             ││
│ ├─────────────────────────────────────────────────────────┤│
│ │ To: Company XYZ                    ✓ Sent  2 days ago ││
│ │ Subject: Workflow Approval Required                    ││
│ │ Preview: Your approval is needed for...                ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [Load More]                                                │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > Communications > Sent Messages"
- **Title:** "Sent Messages"
- **Actions:** Filters dropdown, Search input

### Sent Messages List
- **Format:** List view with status indicators
- **Item Components:**
  - **Recipient:** "To: [Name/Role]"
  - **Subject:** Bold, 16px
  - **Preview:** 2 lines max, truncated
  - **Status Indicator:** ✓ Sent, ✓✓ Delivered, ✓✓ Read
  - **Timestamp:** Right-aligned
- **Status Colors:**
  - **Sent:** Gray (#6b7280)
  - **Delivered:** Blue (#3b82f6)
  - **Read:** Green (#22c55e)

### Filters
- **Date Range:** Last 7 days, Last 30 days, Custom
- **Recipient:** Filter by recipient
- **Status:** Sent, Delivered, Read
- **Entity Type (Optional):** Filter by linked entity type (Submission, Breach, Export Request, Enforcement Action, etc.)

### Empty State
- **Message:** "No sent messages"
- **Action:** "Compose Message" button

---

## Annotations

### Blue (Interactions)
- **Click message** → Navigate to conversation detail
- **Click filter** → Apply filter
- **Search** → Filter messages

### Green (States)
- **Status indicators:** Color-coded (sent/delivered/read)
- **Empty state:** Icon + message

---

## Design System References

### Components Used
- **List Component:** Sent messages list (shadcn/ui table/list)
- **Filter Component:** Entity type, date filters (shadcn/ui select/checkbox)
- **Search Component:** Search input (shadcn/ui input)
- **Badge Component:** Entity type badges (shadcn/ui badge)
- **Button Component:** Compose, filter actions (shadcn/ui button)
- **Icon Component:** Entity type icons (Lucide React via shadcn/ui)
- **Skeleton Component:** Loading states (shadcn/ui skeleton)
- **Empty State Component:** No sent messages message (shadcn/ui empty state pattern)
- **Tooltip Component:** Hover tooltips (shadcn/ui tooltip)

### Design Inspiration References
- **Stripe Dashboard:** https://dashboard.stripe.com - Professional list patterns
- **GitHub:** https://github.com - Clean sent messages, conversation lists
- **Linear App:** https://linear.app - Modern sent messages, smooth interactions
- **shadcn/ui Components:** https://ui.shadcn.com - Component patterns
- **Gmail/Outlook:** Email sent folder patterns for reference

### Colors (From Design System)
- **Background:** #ffffff (white) - Clean, professional
- **Border:** #e5e7eb (border-default) - Subtle separation
- **Hover Background:** #f9fafb (bg-secondary) - Light gray on hover
- **Active Background:** #f3f4f6 (bg-tertiary) - Slightly darker on click
- **Text Primary:** #111827 (text-primary) - High contrast
- **Text Secondary:** #6b7280 (text-secondary)
- **Text Tertiary:** #9ca3af (text-tertiary)
- **Status Colors:**
  - Sent: #6b7280 (text-secondary) - Gray
  - Delivered: #3b82f6 (primary-500) - Blue
  - Read: #22c55e (success-500) - Green
- **Focus Ring:** #3b82f6 (primary-500), 2px outline
- **Entity Badge Colors:**
  - Submission: #3b82f6 (primary-500)
  - Breach: #f59e0b (warning-500)
  - Enforcement: #ef4444 (error-500)
  - Message: #22c55e (success-500)

### Typography (From Design System)
- **Page Title:** 30px, font-weight: 700 (h1)
- **Message Subject:** 14px, font-weight: 600
- **Message Preview:** 14px, font-weight: 400
- **Timestamp:** 12px, font-weight: 400
- **Entity Badge:** 11px, font-weight: 600
- **Filter Label:** 12px, font-weight: 500

### Spacing (8px Grid System)
- **Page Padding:** 24px (3 × 8px) - Comfortable page edge spacing
- **List Item Padding:** 16px horizontal (2 × 8px), 12px vertical (1.5 × 8px)
- **List Item Height:** Auto (min 64px / 8 × 8px) - Touch target minimum
- **Gap:** 8px (1 × 8px) between items
- **Filter Section Padding:** 16px (2 × 8px)
- **Search Input Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)
- **Button Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)

### Transitions & Animations
- **List Item Hover:** 150ms ease-in-out
- **List Item Click:** 150ms ease-in-out
- **Filter Toggle:** 200ms ease-in-out
- **Search Focus:** 200ms ease-in-out

### Accessibility (WCAG 2.1 AA Compliance)
- **Color Contrast:** Minimum 4.5:1 for text, 3:1 for UI components
- **Focus Indicators:** 2px solid outline, #3b82f6 (primary-500), 2px offset
- **Keyboard Navigation:** Full keyboard support (Tab, Enter, Arrow keys, Escape)
- **Screen Reader Support:** ARIA labels, roles, and descriptions
- **Touch Targets:** Minimum 40px × 40px for all interactive elements
- **ARIA Labels:** Descriptive labels for all list items and actions
- **Skip Links:** "Skip to main content" link for keyboard users

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/communications/sent`
- [Communication Channels Requirements](../../../../02-architecture/communication-channels-requirements.md) - Complete communication specs
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - List, Filter, Search components

---

## Industry Best Practices Implementation

### Performance Optimizations
- **Lazy Loading:** Sent message items load on demand (pagination or infinite scroll)
- **Virtual Scrolling:** For extremely long message lists (if needed)
- **Debounced Search:** Debounce search input (300ms)
- **CSS Containment:** Use `contain: layout style paint` for list items
- **Will-Change:** Hint browser about list animations (`will-change: transform, opacity`)
- **Data Fetching:** Parallel API calls for filters and messages
- **Caching:** Cache sent messages list with appropriate TTL (2-5 minutes)

### Modern CSS Features
- **CSS Grid/Flexbox:** Use flexbox for list layout (flexible, responsive)
- **CSS Custom Properties:** Use design system tokens for colors/spacing
- **Backdrop Filter:** Subtle blur effects for modals/overlays (if supported, graceful degradation)
- **CSS Transitions:** Smooth animations for all state changes
- **Container Queries:** Consider for component-level responsive design (future enhancement)

### State Management
- **Sent Messages State:** Track selected message, filters, search query
- **Real-time Updates:** WebSocket or polling for message status updates (30s interval)
- **Local Storage:** Cache filter preferences, sort order
- **Optimistic Updates:** Update message status optimistically, sync with server
- **Error Recovery:** Retry failed API calls with exponential backoff

### Error Handling
- **Loading States:** Skeleton loaders for message items while loading
- **Error Boundaries:** Graceful degradation if list fails to load
- **Retry Logic:** Automatic retry with exponential backoff
- **Offline Support:** Cache sent messages list for offline access
- **Fallback:** Default empty state if all else fails

### Browser Support
- **Modern Browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Progressive Enhancement:** Core functionality works without JS (basic list display)
- **Polyfills:** For older browsers if needed (Intersection Observer, ResizeObserver, etc.)

### Testing Considerations
- **Visual Regression:** Test sent messages at different screen sizes
- **Responsive Testing:** Test at key breakpoints (768px, 1024px, 1920px)
- **Accessibility Testing:** Screen reader, keyboard navigation, color contrast
- **Performance Testing:** Lighthouse scores, Core Web Vitals, Time to Interactive
- **Cross-browser Testing:** Test filters, search, list interactions
- **Data Loading Testing:** Test with slow network, empty states, error states

### Security Considerations
- **XSS Prevention:** Sanitize all message content (preview, subject)
- **CSRF Protection:** For all state-changing actions (delete, archive)
- **Data Isolation:** Ensure message data isolation (RLS)
- **Permission Checks:** Verify user permissions before displaying messages

### Real-time Features
- **WebSocket Connection:** For instant message status updates (delivered, read)
- **Polling Fallback:** If WebSocket unavailable (30s interval)
- **Status Updates:** Real-time delivery and read receipt updates
- **Message Status Indicators:** Show sent, delivered, read status

### Sent Messages-Specific Optimizations
- **List Rendering:** Use virtual scrolling for long lists (100+ messages)
- **Search Optimization:** Debounce search, server-side filtering
- **Filter Optimization:** Cache filter options, lazy load filter data
- **Image Optimization:** Lazy load avatars, use WebP format
- **Code Splitting:** Split sent messages code by feature (list, filters, search)

### User Experience Enhancements
- **Keyboard Shortcuts:** 
  - `j/k` - Navigate up/down messages
  - `Enter` - Open selected message
  - `n` - Compose new message
  - `/` - Focus search
- **Bulk Actions:** Select multiple messages for bulk operations (delete, archive)
- **Quick Actions:** Hover actions (view, delete, resend)
- **Infinite Scroll:** Load more messages as user scrolls
- **Pull to Refresh:** Refresh message list (mobile)
- **Message Status:** Clear visual indicators for sent, delivered, read status

---

**Last Updated:** 2025-01-01  
**Status:** 🟡 Ready for Review  
**Design Approach:** Modern enterprise sent messages pattern (Stripe/GitHub/Linear/shadcn/ui inspired)
