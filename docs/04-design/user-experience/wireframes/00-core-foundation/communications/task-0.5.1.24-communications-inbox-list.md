# Task 0.5.1.24: Communications Inbox List Page Wireframe

**Status:** 🟡 In Progress  
**Route:** `/communications/inbox`  
**File:** `task-0.5.1.24-communications-inbox-list.png`  
**Priority:** 🔴 Critical Foundation

**Design Approach:** Modern enterprise inbox pattern inspired by Stripe, GitHub, Linear, and shadcn/ui best practices. Professional, accessible, and optimized for regulatory compliance communication workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > Communications > Inbox                               │
│                                                             │
│ Inbox                              [New Message] [Filters ▼]│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Search conversations...                    [🔍]          ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌──────────┐ ┌───────────────────────────────────────────┐│
│ │ Filters  │ │ Conversation List                          ││
│ │          │ │                                             ││
│ │ Type     │ │ ● Subject: Product Submission #12345      ││
│ │ ☐ All    │ │   From: MOH Tier 1                        ││
│ │ ☑ Message│ │   Preview: Your submission has been...    ││
│ │ ☐ System │ │   2 hours ago                             ││
│ │          │ │                                             ││
│ │ Entity   │ │ ○ Subject: Breach Alert - Product ABC    ││
│ │ ☐ All    │ │   From: System                            ││
│ │ ☐ Subm...│ │   Preview: Stock level below threshold... ││
│ │ ☐ Breach │ │   5 hours ago                             ││
│ │          │ │                                             ││
│ │ Company  │ │ ● Subject: Request for Additional Info    ││
│ │ ☐ All    │ │   From: Company XYZ                       ││
│ │ ☐ ABC    │ │   Preview: Could you provide more...     ││
│ │ ☐ XYZ    │ │   1 day ago                                ││
│ │          │ │                                             ││
│ │ Date     │ │ ○ Subject: Workflow Approval Required    ││
│ │ Last 7d  │ │   From: MOH Tier 2                        ││
│ │ Last 30d │ │   Preview: Your approval is needed...    ││
│ │ Custom   │ │   2 days ago                               ││
│ │          │ │                                             ││
│ │          │ │ ● Subject: Enforcement Action - Warning  ││
│ │          │ │   From: MOH Tier 1                        ││
│ │          │ │   Preview: A warning has been issued...  ││
│ │          │ │   3 days ago                               ││
│ │          │ │                                             ││
│ │ [Clear]  │ │ [Load More]                                ││
│ └──────────┘ └───────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > Communications > Inbox"
- **Title:** "Inbox"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Actions (Right-aligned):**
  - **New Message Button:** Primary button, click → Navigate to `/communications/compose`
  - **Filters Toggle:** Icon button, click → Toggle filters sidebar
  - **Spacing:** 16px between actions

### Search Bar
- **Input:** Full-width search input with placeholder "Search conversations..."
- **Icon:** Search icon on right side
- **Functionality:** Real-time search as user types
- **Clear Button:** X button appears when text entered

### Filters Sidebar (Left)
- **Width:** 240px (desktop), hidden on mobile (drawer)
- **Background:** White (#ffffff)
- **Border Right:** 1px solid #e5e7eb
- **Padding:** 16px

**Filter Sections:**
- **Type Filter:**
  - Checkboxes: All, Message, System Announcement, Workflow
  - Default: All selected
- **Entity Filter:**
  - Checkboxes: All, Submission, Breach, Export Request, Enforcement Action, Compliance Score, Dispute, etc.
  - Only visible if conversations linked to entities
  - Enforcement Action: Filter conversations linked to enforcement actions
- **Company Filter:**
  - Checkboxes: All, Company ABC, Company XYZ, etc.
  - MOH users: See all companies
  - Company users: See only their company
- **Date Range Filter:**
  - Options: Last 7 days, Last 30 days, Last 90 days, Custom
  - Custom: Date picker for start and end dates
- **Clear Filters Button:**
  - Resets all filters to default

### Conversation List
- **Layout:** List view (table or cards)
- **Item Height:** Auto (min 80px)
- **Spacing:** 1px border between items

**Conversation Item:**
- **Unread Indicator:** Blue dot (●) on left (8px × 8px)
- **Read Indicator:** Gray circle (○) or no indicator
- **Subject:** Bold (unread) or normal (read), 16px, color: #111827
- **From/To:** 14px, color: #6b7280
  - Format: "From: [Name/Role]" or "To: [Name/Role]"
- **Preview:** 14px, color: #6b7280, 2 lines max (truncate with ellipsis)
- **Timestamp:** 12px, color: #9ca3af, right-aligned
  - Format: Relative time (e.g., "2 hours ago") or absolute date
- **Hover:** Light background (#f9fafb)
- **Click:** Navigate to conversation detail

**Empty State:**
- **Icon:** Large message icon (64px × 64px)
- **Message:** "No conversations"
- **Sub-message:** "You don't have any conversations yet."
- **Action:** "Compose Message" button

**Pagination/Load More:**
- **Load More Button:** At bottom of list
- **Pagination (Alternative):** Page numbers if using pagination

---

## Annotations

### Blue (Interactions)
- **Click conversation item** → Navigate to `/communications/inbox/[conversation_id]`
- **Click "New Message"** → Navigate to `/communications/compose`
- **Click filter checkbox** → Apply filter, update list
- **Click "Clear Filters"** → Reset all filters
- **Type in search** → Filter conversations in real-time
- **Click "Load More"** → Load additional conversations

### Orange (Validation)
- **No results:** Show "No conversations match your filters" message
- **Search empty:** Show all conversations

### Green (States)
- **Unread conversation:** Blue dot indicator, bold subject, darker text
- **Read conversation:** No indicator or gray circle, normal weight text
- **Hover state:** Light background on conversation item
- **Loading state:** Skeleton loaders when fetching conversations
- **Empty state:** Icon + message when no conversations
- **Filter active:** Highlighted filter checkbox, count badge (optional)

---

## Responsive Behavior

### Desktop (1024px+)
- **Filters Sidebar:** Visible (240px width)
- **Conversation List:** Full width minus sidebar
- **Layout:** Side-by-side

### Tablet (768px - 1023px)
- **Filters Sidebar:** Hidden by default, toggle button to show
- **Conversation List:** Full width
- **Filters:** Drawer/modal when opened

### Mobile (<768px)
- **Filters Sidebar:** Hidden, accessible via filters button
- **Conversation List:** Full width
- **Filters:** Full-screen drawer/modal
- **Search:** Full width, prominent

---

## Design System References

### Components Used
- **List Component:** Conversation list (shadcn/ui table/list)
- **Filter Component:** Entity type, status filters (shadcn/ui select/checkbox)
- **Search Component:** Search input (shadcn/ui input)
- **Badge Component:** Unread count, entity type badges (shadcn/ui badge)
- **Button Component:** Compose, filter actions (shadcn/ui button)
- **Icon Component:** Entity type icons (Lucide React via shadcn/ui)
- **Skeleton Component:** Loading states (shadcn/ui skeleton)
- **Empty State Component:** No conversations message (shadcn/ui empty state pattern)
- **Tooltip Component:** Hover tooltips (shadcn/ui tooltip)

### Design Inspiration References
- **Stripe Dashboard:** https://dashboard.stripe.com - Professional list patterns
- **GitHub:** https://github.com - Clean inbox, conversation lists
- **Linear App:** https://linear.app - Modern inbox, smooth interactions
- **shadcn/ui Components:** https://ui.shadcn.com - Component patterns
- **Gmail/Outlook:** Email inbox patterns for reference

### Colors (From Design System)
- **Background:** #ffffff (white) - Clean, professional
- **Border:** #e5e7eb (border-default) - Subtle separation
- **Unread Background:** #eff6ff (primary-50) - Subtle blue tint for unread
- **Hover Background:** #f9fafb (bg-secondary) - Light gray on hover
- **Active Background:** #f3f4f6 (bg-tertiary) - Slightly darker on click
- **Text Primary:** #111827 (text-primary) - High contrast
- **Text Secondary:** #6b7280 (text-secondary)
- **Text Tertiary:** #9ca3af (text-tertiary)
- **Unread Indicator:** #3b82f6 (primary-500) - Blue dot for unread
- **Read Indicator:** #9ca3af (text-tertiary) - Gray circle for read
- **Focus Ring:** #3b82f6 (primary-500), 2px outline
- **Entity Badge Colors:**
  - Submission: #3b82f6 (primary-500)
  - Breach: #f59e0b (warning-500)
  - Enforcement: #ef4444 (error-500)
  - Message: #22c55e (success-500)

### Typography (From Design System)
- **Page Title:** 30px, font-weight: 700 (h1)
- **Conversation Subject:** 14px, font-weight: 600 (unread), 400 (read)
- **Conversation Preview:** 14px, font-weight: 400
- **Timestamp:** 12px, font-weight: 400
- **Entity Badge:** 11px, font-weight: 600
- **Filter Label:** 12px, font-weight: 500

### Spacing (8px Grid System)
- **Page Padding:** 24px (3 × 8px) - Comfortable page edge spacing
- **Filter Sidebar Width:** 240px (30 × 8px)
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
- **New Message Arrival:** 200ms slide-in from top

### Accessibility (WCAG 2.1 AA Compliance)
- **Color Contrast:** Minimum 4.5:1 for text, 3:1 for UI components
- **Focus Indicators:** 2px solid outline, #3b82f6 (primary-500), 2px offset
- **Keyboard Navigation:** Full keyboard support (Tab, Enter, Arrow keys, Escape)
- **Screen Reader Support:** ARIA labels, roles, and descriptions
- **Touch Targets:** Minimum 40px × 40px for all interactive elements
- **ARIA Labels:** Descriptive labels for all list items and actions
- **Live Regions:** For new message announcements
- **Skip Links:** "Skip to main content" link for keyboard users

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/communications/inbox`
- [Communication Channels Requirements](../../../../02-architecture/communication-channels-requirements.md) - Complete communication specs
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - List, Filter, Search components

---

## Industry Best Practices Implementation

### Performance Optimizations
- **Lazy Loading:** Conversation items load on demand (pagination or infinite scroll)
- **Virtual Scrolling:** For extremely long conversation lists (if needed)
- **Debounced Search:** Debounce search input (300ms)
- **CSS Containment:** Use `contain: layout style paint` for list items
- **Will-Change:** Hint browser about list animations (`will-change: transform, opacity`)
- **Data Fetching:** Parallel API calls for filters and conversations
- **Caching:** Cache conversation list with appropriate TTL (2-5 minutes)

### Modern CSS Features
- **CSS Grid/Flexbox:** Use flexbox for list layout (flexible, responsive)
- **CSS Custom Properties:** Use design system tokens for colors/spacing
- **Backdrop Filter:** Subtle blur effects for modals/overlays (if supported, graceful degradation)
- **CSS Transitions:** Smooth animations for all state changes
- **Container Queries:** Consider for component-level responsive design (future enhancement)

### State Management
- **Inbox State:** Track selected conversation, filters, search query
- **Real-time Updates:** WebSocket or polling for new messages (30s interval)
- **Local Storage:** Cache filter preferences, sort order
- **Optimistic Updates:** Mark as read optimistically, sync with server
- **Error Recovery:** Retry failed API calls with exponential backoff

### Error Handling
- **Loading States:** Skeleton loaders for conversation items while loading
- **Error Boundaries:** Graceful degradation if list fails to load
- **Retry Logic:** Automatic retry with exponential backoff
- **Offline Support:** Cache conversation list for offline access
- **Fallback:** Default empty state if all else fails

### Browser Support
- **Modern Browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Progressive Enhancement:** Core functionality works without JS (basic list display)
- **Polyfills:** For older browsers if needed (Intersection Observer, ResizeObserver, etc.)

### Testing Considerations
- **Visual Regression:** Test inbox at different screen sizes
- **Responsive Testing:** Test at key breakpoints (768px, 1024px, 1920px)
- **Accessibility Testing:** Screen reader, keyboard navigation, color contrast
- **Performance Testing:** Lighthouse scores, Core Web Vitals, Time to Interactive
- **Cross-browser Testing:** Test filters, search, list interactions
- **Data Loading Testing:** Test with slow network, empty states, error states
- **Real-time Testing:** Test WebSocket/polling behavior, new message arrival

### Security Considerations
- **XSS Prevention:** Sanitize all message content (preview, subject)
- **CSRF Protection:** For all state-changing actions (mark as read, archive)
- **Data Isolation:** Ensure conversation data isolation (RLS)
- **Permission Checks:** Verify user permissions before displaying conversations

### Real-time Features
- **WebSocket Connection:** For instant message delivery
- **Polling Fallback:** If WebSocket unavailable (30s interval)
- **Unread Count Updates:** Real-time unread count in header badge
- **New Message Indicator:** Visual indicator for new messages
- **Sound Notifications:** Optional sound on new message (user preference)

### Inbox-Specific Optimizations
- **List Rendering:** Use virtual scrolling for long lists (100+ conversations)
- **Search Optimization:** Debounce search, server-side filtering
- **Filter Optimization:** Cache filter options, lazy load filter data
- **Image Optimization:** Lazy load avatars, use WebP format
- **Code Splitting:** Split inbox code by feature (list, filters, search)

### User Experience Enhancements
- **Keyboard Shortcuts:** 
  - `j/k` - Navigate up/down conversations
  - `Enter` - Open selected conversation
  - `n` - Compose new message
  - `a` - Archive selected conversation
  - `/` - Focus search
- **Bulk Actions:** Select multiple conversations for bulk operations (mark as read, archive)
- **Quick Actions:** Hover actions (mark as read, archive, delete)
- **Infinite Scroll:** Load more conversations as user scrolls
- **Pull to Refresh:** Refresh conversation list (mobile)

---

**Last Updated:** 2025-01-01  
**Status:** 🟡 Ready for Review  
**Design Approach:** Modern enterprise inbox pattern (Stripe/GitHub/Linear/shadcn/ui inspired)
