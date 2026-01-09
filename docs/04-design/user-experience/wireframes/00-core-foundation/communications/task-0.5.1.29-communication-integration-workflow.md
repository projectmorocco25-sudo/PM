# Task 0.5.1.29: Communication Integration in Workflow Pages Wireframe

**Status:** 🟡 In Progress  
**Route:** Component integration (not a route)  
**File:** `task-0.5.1.29-communication-integration-workflow.png`  
**Priority:** 🔴 Critical Foundation

**Design Approach:** Modern enterprise workflow communication integration pattern inspired by Stripe, GitHub, Linear, and shadcn/ui best practices. Professional, accessible, and optimized for regulatory compliance communication workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Submission Detail Page                                      │
│                                                             │
│ [Submission Content...]                                    │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Related Conversations                    [💬 3] [New]   ││
│ │                                                          ││
│ │ ┌─────────────────────────────────────────────────────┐ ││
│ │ │ MOH Tier 1                   2 hours ago  ● Unread   │ ││
│ │ │ Request for additional information...                │ ││
│ │ └─────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ ┌─────────────────────────────────────────────────────┐ ││
│ │ │ Company XYZ                 1 day ago                │ ││
│ │ │ We've provided the requested information...          │ ││
│ │ └─────────────────────────────────────────────────────┘ ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [Floating Action Button: 💬] (Bottom right)               │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Integration Points
- **Message Button:** Floating action button or inline button
- **Conversation Panel:** Sidebar or inline panel showing related conversations
- **Unread Badge:** Count indicator on message button
- **Workflow Entity Types:** Submissions, Products, SKUs, Compliance Violations, Export Authorization Requests, **Enforcement Actions**, Regulatory Compliance Ratings, Compliance Disputes

### Conversation Panel
- **Header:** "Related Conversations" with unread count badge
- **Workflow-Linked Badge:** "🔗 Workflow-Linked" badge to indicate all conversations in this panel are linked to the workflow entity (WORKFLOW_LINKED state)
- **Immutable Indicator:** Lock icon (🔒) showing links cannot be changed (immutable per lifecycle requirements)
- **Count Badge:** Show number of linked conversations
- **New Button:** "New" button to compose message (message will be automatically linked to workflow entity)
- **Conversation List:** Related conversations for workflow entity
- **Conversation Item in Panel:**
  - **Status Indicators:** Same as inbox list (✓✓ Read, ✓✓ Delivered, etc.)
  - **Thread Indicator:** Show if conversation has multiple messages (THREADED state)
  - **Workflow-Linked Badge:** Always shown (all conversations in this panel are workflow-linked - WORKFLOW_LINKED state)
- **Unread Indicator:** Blue dot for unread messages

### Floating Action Button
- **Position:** Bottom-right corner
- **Icon:** Message icon
- **Badge:** Unread count
- **Click:** Open conversation panel or compose

---

## Annotations

### Blue (Interactions)
- **Click message button** → Open conversation panel
- **Click conversation** → Navigate to conversation detail
- **Click "New"** → Compose message linked to entity

### Green (States)
- **WORKFLOW_LINKED state:** All conversations in panel are workflow-linked (indicated by badge)
- **THREADED state:** Conversations with multiple messages show thread indicator
- **READ state:** "✓✓ Read" indicator shown for read messages
- **DELIVERED state:** "✓✓ Delivered" indicator shown for delivered messages
- **SENT state:** "✓ Sent" indicator shown for sent messages
- **Unread badge:** Dynamic count
- **Active conversation:** Highlighted

---

## Related Documents

- [Communication Channels Requirements](../../../../02-architecture/communication-channels-requirements.md) - Complete communication specs
- [Communication Channels Lifecycle](../../../../02-architecture/communication-channels-lifecycle.md) - Complete lifecycle definition with state transitions, governance requirements, and UI status indicators
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Panel, Message, Input components
- [Conversation Detail Wireframe](./task-0.5.1.25-conversation-detail.md) - Full conversation interface reference
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - Detailed compliance requirements

---

## Design System References

### Components Used
- **Panel Component:** Communication panel/sidebar (shadcn/ui panel)
- **Message Component:** Individual message display (custom, shadcn/ui inspired)
- **Input Component:** Reply input area (shadcn/ui textarea)
- **Button Component:** Send, view all buttons (shadcn/ui button)
- **Badge Component:** Unread count, entity type badges (shadcn/ui badge)
- **Icon Component:** Message, action icons (Lucide React via shadcn/ui)
- **Skeleton Component:** Loading states (shadcn/ui skeleton)
- **Empty State Component:** No messages message (shadcn/ui empty state pattern)
- **Tooltip Component:** Hover tooltips (shadcn/ui tooltip)

### Design Inspiration References
- **Stripe Dashboard:** https://dashboard.stripe.com - Professional workflow integration patterns
- **GitHub:** https://github.com - Clean issue comments, workflow integration
- **Linear App:** https://linear.app - Modern workflow communication, smooth interactions
- **shadcn/ui Components:** https://ui.shadcn.com - Component patterns
- **Jira/Asana:** Task comment patterns for reference

### Colors (From Design System)
- **Panel Background:** #ffffff (white) - Clean, professional
- **Panel Border:** #e5e7eb (border-default) - Subtle separation
- **Message Background (Sent):** #eff6ff (primary-50) - Subtle blue tint for sent messages
- **Message Background (Received):** #f9fafb (bg-secondary) - Light gray for received messages
- **Message Border:** #e5e7eb (border-default) - Subtle separation
- **Hover Background:** #f9fafb (bg-secondary) - Light gray on hover
- **Active Background:** #f3f4f6 (bg-tertiary) - Slightly darker on click
- **Text Primary:** #111827 (text-primary) - High contrast
- **Text Secondary:** #6b7280 (text-secondary)
- **Text Tertiary:** #9ca3af (text-tertiary)
- **Focus Ring:** #3b82f6 (primary-500), 2px outline
- **Entity Badge Colors:**
  - Submission: #3b82f6 (primary-500)
  - Breach: #f59e0b (warning-500)
  - Enforcement: #ef4444 (error-500)
  - Message: #22c55e (success-500)

### Typography (From Design System)
- **Panel Title:** 16px, font-weight: 600 (h3)
- **Message Text:** 14px, font-weight: 400
- **Message Timestamp:** 12px, font-weight: 400
- **Sender Name:** 14px, font-weight: 600
- **Input Text:** 14px, font-weight: 400
- **Button Text:** 14px, font-weight: 500

### Spacing (8px Grid System)
- **Panel Padding:** 16px (2 × 8px) - Comfortable panel spacing
- **Message Padding:** 12px horizontal (1.5 × 8px), 16px vertical (2 × 8px)
- **Message Gap:** 16px (2 × 8px) between messages
- **Input Area Height:** Auto (min 100px / 12.5 × 8px)
- **Input Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)
- **Button Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)
- **Message Border Radius:** 8px (1 × 8px) - Modern, subtle rounding

### Transitions & Animations
- **Panel Toggle:** 200ms ease-in-out
- **Message Hover:** 150ms ease-in-out
- **Message Send:** 200ms slide-in from bottom
- **Message Receive:** 200ms slide-in from top
- **Input Focus:** 200ms ease-in-out
- **Button Hover:** 150ms ease-in-out

### Accessibility (WCAG 2.1 AA Compliance)
- **Color Contrast:** Minimum 4.5:1 for text, 3:1 for UI components
- **Focus Indicators:** 2px solid outline, #3b82f6 (primary-500), 2px offset
- **Keyboard Navigation:** Full keyboard support (Tab, Enter, Arrow keys, Escape)
- **Screen Reader Support:** ARIA labels, roles, and descriptions
- **Touch Targets:** Minimum 40px × 40px for all interactive elements
- **ARIA Labels:** Descriptive labels for all messages and actions
- **Live Regions:** For new message announcements
- **Message Ordering:** Logical DOM order matches visual order

---

## Industry Best Practices Implementation

### Performance Optimizations
- **Lazy Loading:** Messages load on demand (pagination or infinite scroll)
- **Virtual Scrolling:** For extremely long message threads (if needed)
- **Debounced Input:** Debounce reply input (300ms) for auto-save drafts
- **CSS Containment:** Use `contain: layout style paint` for panel and messages
- **Will-Change:** Hint browser about panel animations (`will-change: transform, opacity`)
- **Data Fetching:** Parallel API calls for messages and workflow entity data
- **Caching:** Cache messages with appropriate TTL (2-5 minutes)

### Modern CSS Features
- **CSS Grid/Flexbox:** Use flexbox for panel layout (flexible, responsive)
- **CSS Custom Properties:** Use design system tokens for colors/spacing
- **Backdrop Filter:** Subtle blur effects for panel backdrop (if supported, graceful degradation)
- **CSS Transitions:** Smooth animations for all state changes
- **Container Queries:** Consider for component-level responsive design (future enhancement)

### State Management
- **Panel State:** Track open/closed state, scroll position
- **Messages State:** Track read/unread status, message order, draft content
- **Real-time Updates:** WebSocket or polling for new messages (30s interval)
- **Local Storage:** Cache panel state, draft replies, scroll position
- **Optimistic Updates:** Send message optimistically, sync with server
- **Error Recovery:** Retry failed message sends with exponential backoff

### Error Handling
- **Loading States:** Skeleton loaders for messages while loading
- **Error Boundaries:** Graceful degradation if panel fails to load
- **Retry Logic:** Automatic retry with exponential backoff
- **Offline Support:** Cache messages for offline access
- **Message Send Failure:** Clear error message, retry button, save as draft
- **Fallback:** Default empty state if all else fails

### Browser Support
- **Modern Browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Progressive Enhancement:** Core functionality works without JS (basic message display)
- **Polyfills:** For older browsers if needed (Intersection Observer, ResizeObserver, etc.)

### Testing Considerations
- **Visual Regression:** Test panel at different screen sizes
- **Responsive Testing:** Test at key breakpoints (768px, 1024px, 1920px)
- **Accessibility Testing:** Screen reader, keyboard navigation, color contrast
- **Performance Testing:** Lighthouse scores, Core Web Vitals, Time to Interactive
- **Cross-browser Testing:** Test panel toggle, message rendering, input, attachments
- **Data Loading Testing:** Test with slow network, empty states, error states
- **Real-time Testing:** Test WebSocket/polling behavior, new message arrival

### Security Considerations
- **XSS Prevention:** Sanitize all message content (text, attachments)
- **CSRF Protection:** For all state-changing actions (send message, mark as read)
- **Data Isolation:** Ensure message data isolation (RLS)
- **Permission Checks:** Verify user permissions before displaying/sending messages
- **File Upload Security:** Validate file types, sizes, scan for malware

### Real-time Features
- **WebSocket Connection:** For instant message delivery
- **Polling Fallback:** If WebSocket unavailable (30s interval)
- **Typing Indicators:** Show when other users are typing (optional)
- **Read Receipts:** Show when messages are read (optional)
- **Message Status:** Show sent, delivered, read status (optional)
- **Sound Notifications:** Optional sound on new message (user preference)

### Workflow Integration-Specific Optimizations
- **Panel Positioning:** Fixed or sticky positioning for easy access
- **Panel Collapsible:** Collapse/expand panel to save space
- **Message Rendering:** Efficient rendering for long threads (100+ messages)
- **Scroll Position:** Maintain scroll position on new message arrival
- **Auto-scroll:** Auto-scroll to bottom on new message (user preference)
- **Draft Management:** Auto-save drafts, restore on panel reopen
- **Code Splitting:** Split communication panel code by feature (messages, input, attachments)

### User Experience Enhancements
- **Keyboard Shortcuts:** 
  - `Enter` - Send message (if input focused)
  - `Shift+Enter` - New line in input
  - `Esc` - Close panel or clear input
  - `Ctrl+K` (Cmd+K) - Focus search/command palette
- **Message Actions:** 
  - Hover actions (reply, forward, delete)
  - Right-click context menu
  - Bulk selection for multiple messages
- **Rich Text Support:** 
  - Markdown formatting (optional)
  - Emoji picker (optional)
  - @mentions (optional)
- **Attachment Preview:** 
  - Image previews
  - File type icons
  - File size display
  - Remove button
- **Panel Customization:** 
  - Resizable panel width (desktop)
  - Panel position (left/right)
  - Panel visibility toggle

---

**Last Updated:** 2025-01-01  
**Status:** 🟡 Ready for Review  
**Design Approach:** Modern enterprise workflow communication integration pattern (Stripe/GitHub/Linear/shadcn/ui inspired)
