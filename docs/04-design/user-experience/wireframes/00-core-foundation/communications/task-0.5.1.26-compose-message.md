# Task 0.5.1.26: Compose Message Interface Wireframe

**Status:** 🟡 In Progress  
**Route:** `/communications/compose`  
**File:** `task-0.5.1.26-compose-message.png`  
**Priority:** 🔴 Critical Foundation

**Design Approach:** Modern enterprise compose message pattern inspired by Stripe, GitHub, Linear, and shadcn/ui best practices. Professional, accessible, and optimized for regulatory compliance communication workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > Communications > Compose                             │
│                                                             │
│ Compose New Message                                          │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ To *                                                      ││
│ │ ┌─────────────────────────────────────────────────────┐ ││
│ │ │ Search recipients...                    [🔍]         │ ││
│ │ └─────────────────────────────────────────────────────┘ ││
│ │                                                          ││
│ │ Selected: Company ABC, MOH Tier 1 [×] [×]               ││
│ │                                                          ││
│ │ Filters: [Role ▼] [Company ▼]                           ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Subject *                                                ││
│ │ ┌─────────────────────────────────────────────────────┐ ││
│ │ │ Enter subject...                                     │ ││
│ │ └─────────────────────────────────────────────────────┘ ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Message *                                                ││
│ │ ┌─────────────────────────────────────────────────────┐ ││
│ │ │ Type your message...                                 │ ││
│ │ │                                                      │ ││
│ │ │                                                      │ ││
│ │ │                                                      │ ││
│ │ └─────────────────────────────────────────────────────┘ ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Attachments                                              ││
│ │                                                          ││
│ │ [📎 Attach Files]                                        ││
│ │                                                          ││
│ │ [document.pdf] [×]  [image.png] [×]                     ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Link to Workflow Entity (Optional)                      ││
│ │                                                          ││
│ │ Entity Type: [Submission ▼]                             ││
│ │   Options: Submission, Breach, Export Request,          ││
│ │            Enforcement Action, Compliance Score,        ││
│ │            Dispute                                       ││
│ │ Entity: [Search or select...]                          ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [Cancel]                                    [Send] [Draft] │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > Communications > Compose"
- **Title:** "Compose New Message"
  - **Typography:** 24px, font-weight: 600, color: #111827

### Recipient Selection
- **Label:** "To" with required indicator (*)
- **Search Input:**
  - **Placeholder:** "Search recipients..."
  - **Functionality:** Real-time search as user types
  - **Results:** Dropdown with matching users/companies/roles
- **Selected Recipients:**
  - **Display:** Chips/tags showing selected recipients
  - **Remove:** X button on each chip
  - **Format:** "Company ABC", "MOH Tier 1", etc.
- **Filters:**
  - **Role Filter:** Dropdown to filter by role (Company, MOH Tier 1, MOH Tier 2)
  - **Company Filter:** Dropdown to filter by company (MOH users only)
  - **Position:** Below search input

### Subject Input
- **Label:** "Subject" with required indicator (*)
- **Input:** Single-line text input
- **Placeholder:** "Enter subject..."
- **Width:** Full width
- **Height:** 40px
- **Validation:** Required, max length (e.g., 200 characters)

### Message Content
- **Label:** "Message" with required indicator (*)
- **Text Area:**
  - **Placeholder:** "Type your message..."
  - **Height:** Auto (min 200px, max 500px)
  - **Width:** Full width
  - **Resizable:** Yes (vertical)
  - **Rich Text (Optional):** Basic formatting toolbar (bold, italic, links)
- **Character Count (Optional):** Display character count below text area

### Attachments
- **Label:** "Attachments" (optional)
- **Attach Button:** "Attach Files" button
  - **Click Action:** Open file picker
  - **Support:** Drag and drop files
- **File List:**
  - **Display:** File names with file size
  - **Remove:** X button on each file
  - **Progress:** Show upload progress for each file
- **File Limits:**
  - **Max Size:** 10MB per file (or as specified)
  - **Max Files:** 5 files (or as specified)
  - **Allowed Types:** PDF, DOC, DOCX, XLS, XLSX, PNG, JPG (or as specified)

### Workflow Entity Linking (Optional)
- **Label:** "Link to Workflow Entity (Optional)"
- **Entity Type Selector:**
  - **Dropdown:** Submission, Breach, Export Request, Enforcement Action, Compliance Score, Dispute, etc.
  - **Default:** None selected
- **Entity Search/Select:**
  - **Input:** Search for entity by ID or name
  - **Results:** Dropdown with matching entities
  - **Selected:** Display selected entity name/ID
  - **Enforcement Action Selection:**
    - **Search:** Search by enforcement action ID, company name, or action type
    - **Results:** Show action type (Warning/Fine/Suspension), company, violation type
    - **Selected:** Display "Enforcement Action #12345 - Warning - Company XYZ"

### Action Buttons
- **Cancel Button:** Secondary button, click → Navigate back or clear form
- **Save Draft Button:** Secondary button, click → Save as draft
- **Send Button:** Primary button, click → Send message
  - **Disabled:** If required fields empty
  - **Loading State:** Show spinner when sending

---

## Annotations

### Blue (Interactions)
- **Type in recipient search** → Show matching recipients dropdown
- **Click recipient** → Add to selected recipients
- **Click X on recipient chip** → Remove recipient
- **Select entity type** → Show entity search for that type
- **Click "Attach Files"** → Open file picker
- **Drag and drop files** → Add files to attachment list
- **Click X on file** → Remove file
- **Click "Send"** → Validate form, send message, show success, navigate to sent messages
- **Click "Save Draft"** → Save message as draft
- **Click "Cancel"** → Navigate back or clear form

### Orange (Validation)
- **Required fields:** Show error if To, Subject, or Message empty
- **Recipient validation:** Show error if no recipients selected
- **File size limit:** Show error if file exceeds size limit
- **File type validation:** Show error if file type not allowed
- **Max files:** Show error if too many files attached
- **Subject length:** Show error if subject exceeds max length

### Green (States)
- **Sending state:** Disable Send button, show spinner, disable form
- **Success state:** Show success notification, navigate to sent messages
- **Draft saved:** Show "Draft saved" notification
- **File uploading:** Show progress indicator for each file
- **File uploaded:** Show checkmark or success indicator
- **Loading state:** Skeleton loaders when loading draft (if editing)

---

## Responsive Behavior

### Desktop (1024px+)
- **Form Width:** Max-width 800px, centered
- **Full Layout:** All sections visible
- **Action Buttons:** Right-aligned

### Tablet (768px - 1023px)
- **Form Width:** Full width minus 32px margin
- **Full Layout:** All sections visible
- **Action Buttons:** Right-aligned or stacked

### Mobile (<768px)
- **Form Width:** Full width minus 16px margin
- **Full Layout:** All sections visible, may stack
- **Action Buttons:** Full width, stacked vertically
- **Recipient Chips:** May wrap to multiple lines

---

## Design System References

### Components Used
- **Form Component:** Compose message form (shadcn/ui form)
- **Input Component:** To, Subject fields (shadcn/ui input)
- **Textarea Component:** Message field (shadcn/ui textarea)
- **Button Component:** Send, Save Draft, Cancel buttons (shadcn/ui button)
- **Select Component:** Entity type, recipient selection (shadcn/ui select)
- **File Upload Component:** Attachment upload (shadcn/ui upload)
- **Badge Component:** Selected recipients, entity badges (shadcn/ui badge)
- **Icon Component:** Attachment, action icons (Lucide React via shadcn/ui)
- **Tooltip Component:** Hover tooltips (shadcn/ui tooltip)
- **Alert Component:** Error messages (shadcn/ui alert)

### Design Inspiration References
- **Stripe Dashboard:** https://dashboard.stripe.com - Professional form patterns
- **GitHub:** https://github.com - Clean compose interface
- **Linear App:** https://linear.app - Modern compose UI, smooth interactions
- **shadcn/ui Components:** https://ui.shadcn.com - Component patterns
- **Gmail/Outlook:** Email compose patterns for reference

### Colors (From Design System)
- **Background:** #ffffff (white) - Clean, professional
- **Border:** #e5e7eb (border-default) - Subtle separation
- **Input Border:** #e5e7eb (border-default)
- **Input Focus Border:** #3b82f6 (primary-500) - Blue on focus
- **Input Error Border:** #ef4444 (error-500) - Red for errors
- **Required Indicator:** #ef4444 (error-500) - Red asterisk
- **Primary Button:** #3b82f6 (primary-500) - Blue for primary actions
- **Secondary Button:** #6b7280 (text-secondary) - Gray for secondary actions
- **Error Text:** #ef4444 (error-500) - Red for error messages
- **Success Text:** #22c55e (success-500) - Green for success messages
- **Text Primary:** #111827 (text-primary) - High contrast
- **Text Secondary:** #6b7280 (text-secondary)
- **Text Tertiary:** #9ca3af (text-tertiary)
- **Hover Background:** #f9fafb (bg-secondary)
- **Focus Ring:** #3b82f6 (primary-500), 2px outline
- **Entity Badge Colors:**
  - Submission: #3b82f6 (primary-500)
  - Breach: #f59e0b (warning-500)
  - Enforcement: #ef4444 (error-500)
  - Message: #22c55e (success-500)

### Typography (From Design System)
- **Page Title:** 30px, font-weight: 700 (h1)
- **Form Label:** 14px, font-weight: 500
- **Input Text:** 14px, font-weight: 400
- **Button Text:** 14px, font-weight: 500
- **Error Text:** 12px, font-weight: 400
- **Helper Text:** 12px, font-weight: 400

### Spacing (8px Grid System)
- **Form Max Width:** 800px (100 × 8px) - Optimal reading width
- **Page Padding:** 24px (3 × 8px) - Comfortable page edge spacing
- **Form Padding:** 24px (3 × 8px) - Comfortable form spacing
- **Field Gap:** 16px (2 × 8px) between fields
- **Section Gap:** 32px (4 × 8px) between sections
- **Button Gap:** 12px (1.5 × 8px) between buttons
- **Input Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)
- **Textarea Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)
- **Button Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)
- **Input Border Radius:** 6px (0.75 × 8px) - Modern, subtle rounding
- **Button Border Radius:** 6px (0.75 × 8px)

### Transitions & Animations
- **Input Focus:** 200ms ease-in-out
- **Button Hover:** 150ms ease-in-out
- **Form Validation:** 200ms ease-in-out
- **Attachment Upload:** 200ms fade-in
- **Error Message:** 200ms slide-in from top

### Accessibility (WCAG 2.1 AA Compliance)
- **Color Contrast:** Minimum 4.5:1 for text, 3:1 for UI components
- **Focus Indicators:** 2px solid outline, #3b82f6 (primary-500), 2px offset
- **Keyboard Navigation:** Full keyboard support (Tab, Enter, Escape)
- **Screen Reader Support:** ARIA labels, roles, and descriptions
- **Touch Targets:** Minimum 40px × 40px for all interactive elements
- **ARIA Labels:** Descriptive labels for all form fields and actions
- **Error Announcements:** ARIA live regions for validation errors
- **Required Fields:** Clear indication (asterisk, label, or both)

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/communications/compose`
- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md) - Form validation patterns
- [Communication Channels Requirements](../../../../02-architecture/communication-channels-requirements.md) - Complete communication specs
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Form, Input, File Upload components
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - Detailed compliance requirements

---

## Industry Best Practices Implementation

### Performance Optimizations
- **Debounced Input:** Debounce recipient search (300ms)
- **Lazy Loading:** Entity list loads on demand (pagination or infinite scroll)
- **CSS Containment:** Use `contain: layout style paint` for form sections
- **Will-Change:** Hint browser about form animations (`will-change: transform, opacity`)
- **Data Fetching:** Parallel API calls for recipients and entities
- **Caching:** Cache recipient list and entity list with appropriate TTL (5-10 minutes)
- **Image Optimization:** Lazy load avatars, use WebP format for attachments

### Modern CSS Features
- **CSS Grid/Flexbox:** Use flexbox for form layout (flexible, responsive)
- **CSS Custom Properties:** Use design system tokens for colors/spacing
- **Backdrop Filter:** Subtle blur effects for modals/overlays (if supported, graceful degradation)
- **CSS Transitions:** Smooth animations for all state changes
- **Container Queries:** Consider for component-level responsive design (future enhancement)

### State Management
- **Form State:** Track form values, validation state, draft content
- **Real-time Validation:** Validate fields as user types (debounced)
- **Local Storage:** Auto-save draft to localStorage (every 30 seconds)
- **Optimistic Updates:** Send message optimistically, sync with server
- **Error Recovery:** Retry failed message sends with exponential backoff
- **Draft Restoration:** Restore draft from localStorage on page load

### Error Handling
- **Loading States:** Skeleton loaders for recipient/entity lists while loading
- **Error Boundaries:** Graceful degradation if form fails to load
- **Retry Logic:** Automatic retry with exponential backoff
- **Offline Support:** Cache draft for offline access
- **Validation Errors:** Clear, inline error messages
- **File Upload Errors:** Clear error messages for file size/type issues
- **Fallback:** Default empty state if all else fails

### Browser Support
- **Modern Browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Progressive Enhancement:** Core functionality works without JS (basic form display)
- **Polyfills:** For older browsers if needed (Intersection Observer, ResizeObserver, etc.)

### Testing Considerations
- **Visual Regression:** Test compose form at different screen sizes
- **Responsive Testing:** Test at key breakpoints (768px, 1024px, 1920px)
- **Accessibility Testing:** Screen reader, keyboard navigation, color contrast
- **Performance Testing:** Lighthouse scores, Core Web Vitals, Time to Interactive
- **Cross-browser Testing:** Test form validation, file upload, recipient selection
- **Data Loading Testing:** Test with slow network, empty states, error states
- **Form Validation Testing:** Test all validation rules, error messages

### Security Considerations
- **XSS Prevention:** Sanitize all message content (text, attachments)
- **CSRF Protection:** For all state-changing actions (send message)
- **File Upload Security:** Validate file types, sizes, scan for malware
- **Rate Limiting:** Prevent message spam
- **Permission Checks:** Verify user permissions before sending messages

### Real-time Features
- **Recipient Search:** Real-time search as user types (debounced)
- **Entity Search:** Real-time search for linked entities (debounced)
- **Draft Auto-save:** Auto-save draft to server (every 30 seconds)
- **Typing Indicators:** Show when user is typing (optional, for replies)
- **Message Status:** Show sent, delivered status (optional)

### Compose-Specific Optimizations
- **Form Validation:** Client-side validation before submission
- **File Upload:** Progress indicators, chunked upload for large files
- **Recipient Selection:** Efficient search, pagination for large lists
- **Entity Selection:** Efficient search, filtering for large lists
- **Draft Management:** Efficient draft storage and retrieval
- **Code Splitting:** Split compose code by feature (form, upload, selection)

### User Experience Enhancements
- **Keyboard Shortcuts:** 
  - `Ctrl+Enter` (Cmd+Enter) - Send message
  - `Ctrl+S` (Cmd+S) - Save draft
  - `Esc` - Cancel/close compose
  - `Tab` - Navigate between fields
- **Auto-complete:** 
  - Recipient name auto-complete
  - Entity name auto-complete
  - Subject line suggestions (optional)
- **Rich Text Support:** 
  - Markdown formatting (optional)
  - Emoji picker (optional)
  - @mentions (optional)
- **Attachment Preview:** 
  - Image previews
  - File type icons
  - File size display
  - Remove button
- **Draft Indicators:** 
  - Show "Draft saved" notification
  - Show "Unsaved changes" warning on navigation
- **Form Validation Feedback:** 
  - Inline error messages
  - Success indicators
  - Field-level validation
  - Form-level validation summary

---

**Last Updated:** 2025-01-01  
**Status:** 🟡 Ready for Review  
**Design Approach:** Modern enterprise compose message pattern (Stripe/GitHub/Linear/shadcn/ui inspired)
