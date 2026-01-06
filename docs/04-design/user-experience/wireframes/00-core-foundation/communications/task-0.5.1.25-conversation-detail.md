# Task 0.5.1.25: Conversation Detail Page Wireframe

**Status:** 🟡 In Progress  
**Route:** `/communications/inbox/[conversation_id]`  
**File:** `task-0.5.1.25-conversation-detail.png`  
**Priority:** 🔴 Critical Foundation

**Design Approach:** Modern enterprise conversation detail pattern inspired by Stripe, GitHub, Linear, and shadcn/ui best practices. Professional, accessible, and optimized for regulatory compliance communication workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > Communications > Inbox > Conversation                 │
│                                                             │
│ Subject: Product Submission #12345                         │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Workflow Context                                         ││
│ │                                                          ││
│ │ Linked to: Submission #12345                             ││
│ │ Product: ABC  Company: XYZ                              ││
│ │ Status: Pending Approval                                ││
│ │                                                          ││
│ │ [View Submission] [View Product]                        ││
│ │                                                          ││
│ │ OR (if linked to enforcement action):                   ││
│ │                                                          ││
│ │ Linked to: Enforcement Action #33333                  ││
│ │ Action Type: Warning  Company: XYZ                      ││
│ │ Status: Executed                                        ││
│ │                                                          ││
│ │ [View Enforcement Action]                              ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Message Thread                                           ││
│ │                                                          ││
│ │ ┌─────────────────────────────────────────────────────┐ ││
│ │ │ MOH Tier 1                   2 hours ago  ✓ Read   │ ││
│ │ │                                                      │ ││
│ │ │ Your submission has been reviewed and approved.    │ ││
│ │ │ Please proceed with the next steps.                 │ ││
│ │ │                                                      │ ││
│ │ │ [attachment.pdf] [document.docx]                    │ ││
│ │ └─────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ ┌─────────────────────────────────────────────────────┐ ││
│ │ │ Company XYZ                 1 hour ago  ✓ Read       │ ││
│ │ │                                                      │ ││
│ │ │ Thank you for the approval. We will proceed...     │ ││
│ │ └─────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ ┌─────────────────────────────────────────────────────┐ ││
│ │ │ MOH Tier 1                   30 min ago  ✓ Read    │ ││
│ │ │                                                      │ ││
│ │ │ Please note the following requirements...           │ ││
│ │ └─────────────────────────────────────────────────────┘ ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Reply                                                    ││
│ │                                                          ││
│ │ ┌─────────────────────────────────────────────────────┐ ││
│ │ │ Type your message...                                 │ ││
│ │ │                                                      │ ││
│ │ │                                                      │ ││
│ │ └─────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ [📎 Attach]                    [Send] [Save Draft]      ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > Communications > Inbox > Conversation"
- **Subject:** Conversation subject/title
  - **Typography:** 20px, font-weight: 600, color: #111827
- **Actions (Optional):**
  - **Archive Button:** Archive conversation
  - **Delete Button:** Delete conversation
  - **More Actions:** Dropdown menu

### Workflow Context Panel (If Linked)
- **Visibility:** Only if conversation linked to workflow entity
- **Background:** Light gray (#f9fafb)
- **Border:** 1px solid #e5e7eb
- **Border Radius:** 8px
- **Padding:** 16px
- **Content:**
  - **Linked Entity Type:** "Linked to: Submission #12345" or "Linked to: Enforcement Action #33333"
  - **Entity Details:** 
    - For submissions: Product name, Company name, Status
    - For enforcement actions: Action Type (Warning/Fine/Suspension), Company name, Status, Violation Type
  - **Action Buttons:** 
    - "View Submission", "View Product" (for submissions)
    - "View Enforcement Action" (for enforcement actions)
  - **Click Action:** Navigate to entity detail page
  - **Enforcement Action Context:**
    - Shows action type badge (⚠️ Warning, 💰 Fine, 🚫 Suspension)
    - Shows workflow status (Executed, Pending Approval, etc.)
    - Link navigates to `/enforcement/actions/[id]` (read-only for companies)

### Message Thread
- **Layout:** Chronological order (oldest to newest)
- **Scrollable:** Yes (if many messages)
- **Spacing:** 16px between messages

**Message Item:**
- **Header:**
  - **Sender Name:** Bold, 14px, color: #111827
  - **Timestamp:** 12px, color: #9ca3af, right-aligned
  - **Read Receipt:** "✓ Read" or "✓ Delivered" indicator
- **Content:**
  - **Text:** 14px, color: #111827, line-height: 1.5
  - **Formatting:** Support basic formatting (bold, italic, links)
- **Attachments:**
  - **Format:** File icons with names
  - **Display:** Below message content
  - **Click Action:** Download/view attachment
- **Background:** White (#ffffff)
- **Border:** 1px solid #e5e7eb
- **Border Radius:** 8px
- **Padding:** 16px
- **Margin:** 8px bottom

**Own Messages (Optional Styling):**
- **Background:** Light blue (#eff6ff) or right-aligned
- **Distinction:** Visual distinction from received messages

### Reply Interface
- **Position:** Fixed or sticky at bottom
- **Background:** White (#ffffff)
- **Border Top:** 1px solid #e5e7eb
- **Padding:** 16px

**Text Area:**
- **Placeholder:** "Type your message..."
- **Height:** Auto (min 100px, max 300px)
- **Width:** Full width
- **Border:** 1px solid #e5e7eb
- **Border Radius:** 8px
- **Padding:** 12px
- **Resizable:** Yes (vertical)

**Action Buttons:**
- **Attach Button:** Icon button, click → Open file picker
- **Send Button:** Primary button, click → Send message
- **Save Draft Button:** Secondary button, click → Save as draft
- **Position:** Right-aligned, below text area

**Attachment List (When Files Attached):**
- **Display:** File names with remove button
- **Position:** Above text area or below attach button

---

## Annotations

### Blue (Interactions)
- **Click "View Submission" / "View Product"** → Navigate to entity detail page
- **Click attachment** → Download/view attachment
- **Click "Send"** → Send message, add to thread, clear text area
- **Click "Save Draft"** → Save message as draft
- **Click "Attach"** → Open file picker, select files
- **Type in text area** → Auto-save draft (optional)

### Orange (Validation)
- **Empty message:** Disable Send button if text area empty
- **File size limit:** Show error if file exceeds size limit
- **File type validation:** Show error if file type not allowed

### Green (States)
- **Read receipt:** "✓ Read" (green) or "✓ Delivered" (gray)
- **Message sent:** Show success indicator, message appears in thread
- **Sending state:** Disable Send button, show spinner
- **Draft saved:** Show "Draft saved" notification
- **Attachment uploaded:** Show file in attachment list
- **Loading state:** Skeleton loaders when loading messages

---

## Responsive Behavior

### Desktop (1024px+)
- **Workflow Context:** Full width panel above messages
- **Message Thread:** Full width, scrollable
- **Reply Interface:** Full width, fixed at bottom

### Tablet (768px - 1023px)
- **Workflow Context:** Full width, may be collapsible
- **Message Thread:** Full width
- **Reply Interface:** Full width

### Mobile (<768px)
- **Workflow Context:** Collapsible panel or hidden
- **Message Thread:** Full width, scrollable
- **Reply Interface:** Full width, may overlay content
- **Action Buttons:** May stack vertically

---

## Design System References

### Components Used
- **Message Component:** Individual message display (custom, shadcn/ui inspired)
- **Input Component:** Reply input area (shadcn/ui textarea)
- **Button Component:** Send, attachment buttons (shadcn/ui button)
- **Badge Component:** Entity type, status badges (shadcn/ui badge)
- **Avatar Component:** User avatars (shadcn/ui avatar)
- **Icon Component:** Attachment, action icons (Lucide React via shadcn/ui)
- **Skeleton Component:** Loading states (shadcn/ui skeleton)
- **Tooltip Component:** Hover tooltips (shadcn/ui tooltip)
- **Scrollbar Component:** Custom styled scrollbar

### Design Inspiration References
- **Stripe Dashboard:** https://dashboard.stripe.com - Professional conversation patterns
- **GitHub:** https://github.com - Clean conversation detail, message threading
- **Linear App:** https://linear.app - Modern conversation UI, smooth interactions
- **shadcn/ui Components:** https://ui.shadcn.com - Component patterns
- **Slack/Discord:** Chat interface patterns for reference

### Colors (From Design System)
- **Background:** #ffffff (white) - Clean, professional
- **Message Background (Sent):** #eff6ff (primary-50) - Subtle blue tint for sent messages
- **Message Background (Received):** #f9fafb (bg-secondary) - Light gray for received messages
- **Message Border:** #e5e7eb (border-default) - Subtle separation
- **Workflow Context Background:** #f9fafb (bg-secondary) - Light gray for context panel
- **Border:** #e5e7eb (border-default) - Subtle separation
- **Text Primary:** #111827 (text-primary) - High contrast
- **Text Secondary:** #6b7280 (text-secondary)
- **Text Tertiary:** #9ca3af (text-tertiary)
- **Hover Background:** #f9fafb (bg-secondary)
- **Read Receipt:** #22c55e (success-500) - Green for read
- **Delivered Receipt:** #6b7280 (text-secondary) - Gray for delivered
- **Focus Ring:** #3b82f6 (primary-500), 2px outline
- **Entity Badge Colors:**
  - Submission: #3b82f6 (primary-500)
  - Breach: #f59e0b (warning-500)
  - Enforcement: #ef4444 (error-500)
  - Message: #22c55e (success-500)

### Typography (From Design System)
- **Page Title:** 30px, font-weight: 700 (h1)
- **Message Subject:** 18px, font-weight: 600 (h2)
- **Message Text:** 14px, font-weight: 400
- **Message Timestamp:** 12px, font-weight: 400
- **Sender Name:** 14px, font-weight: 600
- **Input Text:** 14px, font-weight: 400
- **Button Text:** 14px, font-weight: 500

### Spacing (8px Grid System)
- **Page Padding:** 24px (3 × 8px) - Comfortable page edge spacing
- **Message Padding:** 12px horizontal (1.5 × 8px), 16px vertical (2 × 8px)
- **Message Gap:** 16px (2 × 8px) between messages
- **Input Area Height:** Auto (min 120px / 15 × 8px)
- **Input Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)
- **Button Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)
- **Avatar Size:** 40px (5 × 8px) - Touch target minimum
- **Message Border Radius:** 8px (1 × 8px) - Modern, subtle rounding

### Transitions & Animations
- **Message Hover:** 150ms ease-in-out
- **Message Send:** 200ms slide-in from bottom
- **Message Receive:** 200ms slide-in from top
- **Input Focus:** 200ms ease-in-out
- **Button Hover:** 150ms ease-in-out
- **Attachment Upload:** 200ms fade-in

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

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/communications/inbox/[conversation_id]`
- [Communication Channels Requirements](../../../../02-architecture/communication-channels-requirements.md) - Complete communication specs
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Message, Form components

---

## Industry Best Practices Implementation

### Performance Optimizations
- **Lazy Loading:** Messages load on demand (pagination or infinite scroll)
- **Virtual Scrolling:** For extremely long conversations (if needed)
- **Debounced Input:** Debounce reply input (300ms) for auto-save drafts
- **CSS Containment:** Use `contain: layout style paint` for message items
- **Will-Change:** Hint browser about message animations (`will-change: transform, opacity`)
- **Data Fetching:** Parallel API calls for conversation data and related entities
- **Caching:** Cache conversation data with appropriate TTL (2-5 minutes)
- **Image Optimization:** Lazy load avatars and attachments, use WebP format

### Modern CSS Features
- **CSS Grid/Flexbox:** Use flexbox for message layout (flexible, responsive)
- **CSS Custom Properties:** Use design system tokens for colors/spacing
- **Backdrop Filter:** Subtle blur effects for modals/overlays (if supported, graceful degradation)
- **CSS Transitions:** Smooth animations for all state changes
- **Container Queries:** Consider for component-level responsive design (future enhancement)
- **Scroll Snap:** Optional scroll snap for message list (if needed)

### State Management
- **Conversation State:** Track read/unread status, message order, draft content
- **Real-time Updates:** WebSocket or polling for new messages (30s interval)
- **Local Storage:** Cache draft replies, scroll position
- **Optimistic Updates:** Send message optimistically, sync with server
- **Error Recovery:** Retry failed message sends with exponential backoff

### Error Handling
- **Loading States:** Skeleton loaders for messages while loading
- **Error Boundaries:** Graceful degradation if conversation fails to load
- **Retry Logic:** Automatic retry with exponential backoff
- **Offline Support:** Cache conversation data for offline access
- **Message Send Failure:** Clear error message, retry button, save as draft
- **Fallback:** Default empty state if all else fails

### Browser Support
- **Modern Browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Progressive Enhancement:** Core functionality works without JS (basic message display)
- **Polyfills:** For older browsers if needed (Intersection Observer, ResizeObserver, etc.)

### Testing Considerations
- **Visual Regression:** Test conversation at different screen sizes
- **Responsive Testing:** Test at key breakpoints (768px, 1024px, 1920px)
- **Accessibility Testing:** Screen reader, keyboard navigation, color contrast
- **Performance Testing:** Lighthouse scores, Core Web Vitals, Time to Interactive
- **Cross-browser Testing:** Test message rendering, input, attachments
- **Data Loading Testing:** Test with slow network, empty states, error states
- **Real-time Testing:** Test WebSocket/polling behavior, new message arrival

### Security Considerations
- **XSS Prevention:** Sanitize all message content (text, attachments)
- **CSRF Protection:** For all state-changing actions (send message, mark as read)
- **Data Isolation:** Ensure conversation data isolation (RLS)
- **Permission Checks:** Verify user permissions before displaying actions
- **File Upload Security:** Validate file types, sizes, scan for malware

### Real-time Features
- **WebSocket Connection:** For instant message delivery
- **Polling Fallback:** If WebSocket unavailable (30s interval)
- **Typing Indicators:** Show when other users are typing (optional)
- **Read Receipts:** Show when messages are read (optional)
- **Message Status:** Show sent, delivered, read status (optional)
- **Sound Notifications:** Optional sound on new message (user preference)

### Conversation-Specific Optimizations
- **Message Rendering:** Efficient rendering for long conversations (100+ messages)
- **Scroll Position:** Maintain scroll position on new message arrival
- **Auto-scroll:** Auto-scroll to bottom on new message (user preference)
- **Draft Management:** Auto-save drafts, restore on page reload
- **Attachment Handling:** Preview images, download files, progress indicators
- **Code Splitting:** Split conversation code by feature (messages, input, attachments)

### User Experience Enhancements
- **Keyboard Shortcuts:** 
  - `Enter` - Send message (if input focused)
  - `Shift+Enter` - New line in input
  - `Ctrl+K` (Cmd+K) - Focus search/command palette
  - `Esc` - Close conversation or clear input
- **Message Actions:** 
  - Hover actions (reply, forward, delete)
  - Right-click context menu
  - Bulk selection for multiple messages
- **Rich Text Support:** 
  - Markdown formatting (optional)
  - Emoji picker (optional)
  - @mentions (optional)
- **Search Within Conversation:** 
  - Search messages within current conversation
  - Highlight search results
  - Navigate between results
- **Message Reactions:** 
  - Emoji reactions to messages (optional)
  - Reaction counts and users

---

**Last Updated:** 2025-01-01  
**Status:** 🟡 Ready for Review  
**Design Approach:** Modern enterprise conversation detail pattern (Stripe/GitHub/Linear/shadcn/ui inspired)
