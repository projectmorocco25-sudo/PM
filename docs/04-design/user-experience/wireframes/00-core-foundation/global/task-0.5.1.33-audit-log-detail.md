# Task 0.5.1.33: Audit Log Detail Page Wireframe

**Status:** 🟡 In Progress  
**Route:** `/audit/logs/[id]`  
**File:** `task-0.5.1.33-audit-log-detail.png`  
**Priority:** 🔴 Critical Foundation

**Design Approach:** Modern enterprise audit log detail pattern inspired by Stripe, GitHub, Linear, and shadcn/ui best practices. Professional, accessible, and optimized for regulatory compliance audit trail inspection.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > Audit > Logs > Log Detail                            │
│                                                             │
│ Audit Log Entry #12345                                      │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Action: CREATE                                           ││
│ │ Table: products                                          ││
│ │ Record ID: 12345                                         ││
│ │                                                          ││
│ │ User: John Doe (Company XYZ)                            ││
│ │ Timestamp: 2025-01-01 10:30:45 UTC                      ││
│ │                                                          ││
│ │ Old Values:                                             ││
│ │ - (New record)                                          ││
│ │                                                          ││
│ │ New Values:                                             ││
│ │ - Name: Product ABC                                      ││
│ │ - Category: Pharmaceuticals                             ││
│ │ - Status: Active                                        ││
│ │                                                          ││
│ │ Related Entity (if enforcement_actions table):          ││
│ │ - Action Type: Warning                                  ││
│ │ - Company: Company XYZ                                   ││
│ │ - Violation Type: Submission Non-Compliance             ││
│ │ - Status: Executed                                      ││
│ │ - [View Enforcement Action]                            ││
│ │                                                          ││
│ │ Hash Chain Verification:                                ││
│ │ Previous Hash: abc123...                                ││
│ │ Current Hash: def456...                                  ││
│ │ Status: ✓ Verified                                      ││
│ │                                                          ││
│ │ Compliance Information:                                 ││
│ │ • Retention Period: 7 years minimum (until 2032-01-01) ││
│ │ • CNDP Compliance: This entry contains personal data   ││
│ │   protected under Law No. 09-08                        ││
│ │ • Regulatory Reference: [View Framework]               ││
│ │                                                          ││
│ │ [View Previous] [View Next] [View Hash Chain]          ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Log Entry Details
- **Action:** CREATE, UPDATE, DELETE, APPROVE, EXECUTE, APPEAL
- **Table:** Table name (products, skus, companies, enforcement_actions, enforcement_action_appeals, etc.)
- **Record ID:** Record identifier
- **Old Values:** Previous state (JSON or formatted)
- **New Values:** New state (JSON or formatted)
- **Related Entity Section (if enforcement_actions table):**
  - **Action Type:** Warning, Fine, Suspension
  - **Company:** Company name (link to company detail)
  - **Violation Type:** Brief description
  - **Status:** Workflow status (Draft, Pending Approval, Approved, Executed, etc.)
  - **Link:** "View Enforcement Action" button → Navigate to `/enforcement/actions/[id]`

### User Information
- **User Name:** User who performed action
- **Role:** User role
- **Company:** Company (if applicable)

### Hash Chain Verification
- **Previous Hash:** Hash of previous log entry
- **Current Hash:** Hash of current log entry
- **Status:** Verified or Invalid

### Compliance Information Section
- **Retention Period:** Display retention period and expiration date (7 years from log entry date)
- **CNDP Compliance Notice:** "This audit log entry contains personal data protected under Law No. 09-08 (Protection of Personal Data)"
- **Data Subject Rights:** Information about data subject rights (if applicable to the log entry)
- **Regulatory Reference:** Link to regulatory framework document
- **Display:** Section within log detail card, below hash chain verification
- **Styling:** Info section with light background, clear labeling

### Navigation
- **Previous Log:** Link to previous log entry
- **Next Log:** Link to next log entry
- **Hash Chain:** View full hash chain

---

## Annotations

### Blue (Interactions)
- **Click "View Previous/Next"** → Navigate to related log
- **Click "View Hash Chain"** → Show hash chain verification
- **Click "View Enforcement Action"** → Navigate to enforcement action detail page (if table is enforcement_actions)

### Green (States)
- **Hash verified:** Green checkmark
- **Hash invalid:** Red X

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/audit/logs/[id]`

---

## Design System References

### Components Used
- **Card Component:** Audit log detail card (shadcn/ui card)
- **Badge Component:** Action type, status badges (shadcn/ui badge)
- **Button Component:** Back, export, view related entity buttons (shadcn/ui button)
- **Icon Component:** Action type icons, metadata icons (Lucide React via shadcn/ui)
- **Code Block Component:** JSON diff display (shadcn/ui code block or custom)
- **Skeleton Component:** Loading states (shadcn/ui skeleton)
- **Empty State Component:** No data message (shadcn/ui empty state pattern)
- **Tooltip Component:** Hover tooltips (shadcn/ui tooltip)
- **Tabs Component:** Metadata, changes, related entities tabs (shadcn/ui tabs)

### Design Inspiration References
- **Stripe Dashboard:** https://dashboard.stripe.com - Professional audit log detail patterns
- **GitHub:** https://github.com - Clean audit log detail, diff views
- **Linear App:** https://linear.app - Modern audit log detail, smooth interactions
- **shadcn/ui Components:** https://ui.shadcn.com - Component patterns
- **AWS CloudTrail/Azure Activity Log:** Enterprise audit log detail patterns for reference

### Colors (From Design System)
- **Background:** #ffffff (white) - Clean, professional
- **Card Background:** #ffffff (white) - Card background
- **Card Border:** #e5e7eb (border-default) - Subtle separation
- **Section Border:** #e5e7eb (border-default) - Section separation
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
- **JSON Diff Colors:**
  - Added: #d1fae5 (success-100) - Light green background
  - Removed: #fee2e2 (error-100) - Light red background
  - Changed: #dbeafe (primary-100) - Light blue background

### Typography (From Design System)
- **Page Title:** 30px, font-weight: 700 (h1)
- **Section Title:** 18px, font-weight: 600 (h2)
- **Field Label:** 12px, font-weight: 600, uppercase
- **Field Value:** 14px, font-weight: 400
- **Code Block:** 13px, font-family: monospace, font-weight: 400
- **Timestamp:** 12px, font-weight: 400
- **Action Badge:** 11px, font-weight: 600

### Spacing (8px Grid System)
- **Page Padding:** 24px (3 × 8px) - Comfortable page edge spacing
- **Card Padding:** 24px (3 × 8px) - Card internal spacing
- **Section Padding:** 16px (2 × 8px) - Section internal spacing
- **Field Padding:** 12px vertical (1.5 × 8px) - Field spacing
- **Gap:** 16px (2 × 8px) between sections
- **Button Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)

### Transitions & Animations
- **Card Hover:** 150ms ease-in-out
- **Button Hover:** 150ms ease-in-out
- **Tab Switch:** 200ms ease-in-out
- **Code Block Expand:** 200ms ease-in-out

### Accessibility (WCAG 2.1 AA Compliance)
- **Color Contrast:** Minimum 4.5:1 for text, 3:1 for UI components
- **Focus Indicators:** 2px solid outline, #3b82f6 (primary-500), 2px offset
- **Keyboard Navigation:** Full keyboard support (Tab, Enter, Arrow keys, Escape)
- **Screen Reader Support:** ARIA labels, roles, and descriptions
- **Touch Targets:** Minimum 40px × 40px for all interactive elements
- **ARIA Labels:** Descriptive labels for all sections and actions
- **Code Block Accessibility:** Proper code block labeling, copy button accessibility
- **Skip Links:** "Skip to main content" link for keyboard users

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/audit/logs/[id]`
- [Audit Logs List Wireframe](./task-0.5.1.32-audit-logs-list.md) - Audit logs list reference
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Card, Badge, Code Block components
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference including Law No. 09-08
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - Detailed compliance requirements including CNDP and data retention
- [Regulatory Policies](../../../../03-governance/regulatory-policies.md) - Regulatory policies and guidelines

---

## Industry Best Practices Implementation

### Performance Optimizations
- **Lazy Loading:** Related entities load on demand
- **Code Block Rendering:** Virtual scrolling for large JSON diffs (if needed)
- **Debounced Search:** Not applicable (read-only detail view)
- **CSS Containment:** Use `contain: layout style paint` for card sections
- **Will-Change:** Hint browser about animations (`will-change: transform, opacity`)
- **Data Fetching:** Single API call for audit log detail
- **Caching:** Cache audit log detail with appropriate TTL (5-10 minutes, read-only data)

### Modern CSS Features
- **CSS Grid/Flexbox:** Use flexbox for card layout (flexible, responsive)
- **CSS Custom Properties:** Use design system tokens for colors/spacing
- **Backdrop Filter:** Subtle blur effects for modals/overlays (if supported, graceful degradation)
- **CSS Transitions:** Smooth animations for all state changes
- **Container Queries:** Consider for component-level responsive design (future enhancement)

### State Management
- **Audit Log Detail State:** Track selected tab, expanded sections, related entity data
- **Real-time Updates:** Not applicable (immutable audit logs)
- **Local Storage:** Cache user preferences (tab selection, expanded sections)
- **Optimistic Updates:** Not applicable (read-only data)
- **Error Recovery:** Retry failed API calls with exponential backoff

### Error Handling
- **Loading States:** Skeleton loaders for audit log detail while loading
- **Error Boundaries:** Graceful degradation if audit log fails to load
- **Retry Logic:** Automatic retry with exponential backoff
- **Offline Support:** Cache audit log detail for offline access (read-only)
- **Fallback:** Default empty state if all else fails

### Browser Support
- **Modern Browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Progressive Enhancement:** Core functionality works without JS (basic detail display)
- **Polyfills:** For older browsers if needed (Intersection Observer, ResizeObserver, etc.)

### Testing Considerations
- **Visual Regression:** Test audit log detail at different screen sizes
- **Responsive Testing:** Test at key breakpoints (768px, 1024px, 1920px)
- **Accessibility Testing:** Screen reader, keyboard navigation, color contrast
- **Performance Testing:** Lighthouse scores, Core Web Vitals, Time to Interactive
- **Cross-browser Testing:** Test tabs, code blocks, JSON diff rendering
- **Data Loading Testing:** Test with slow network, empty states, error states
- **Large Data Testing:** Test with large JSON diffs, many related entities

### Security Considerations
- **XSS Prevention:** Sanitize all audit log content (descriptions, metadata, JSON)
- **CSRF Protection:** For all state-changing actions (export, view related entity)
- **Data Isolation:** Ensure audit log data isolation (RLS)
- **Permission Checks:** Verify user permissions before displaying audit log (MOH Tier 1 & 2 only)
- **Read-only Enforcement:** Ensure audit log detail is read-only (immutable)
- **Audit Log Integrity:** Ensure audit log cannot be modified or deleted

### Real-time Features
- **Not Applicable:** Audit logs are immutable and do not update in real-time

### Audit Log Detail-Specific Optimizations
- **Code Block Rendering:** Efficient JSON diff rendering, syntax highlighting
- **Related Entity Loading:** Lazy load related entities, cache related entity data
- **JSON Diff Optimization:** Efficient diff algorithm, virtual scrolling for large diffs
- **Export Optimization:** Server-side export generation for large audit logs
- **Code Splitting:** Split audit log detail code by feature (detail, metadata, changes, related entities)

### User Experience Enhancements
- **Keyboard Shortcuts:** 
  - `b` - Go back to audit logs list
  - `e` - Export audit log
  - `t` - Switch tabs (metadata, changes, related entities)
  - `c` - Copy JSON to clipboard
  - `Esc` - Close modals/overlays
- **Quick Actions:** Hover actions (copy, export, view related entity)
- **JSON Diff Navigation:** Navigate between changes in JSON diff
- **Related Entity Links:** Quick links to related entities (enforcement actions, submissions, etc.)
- **Export Options:** Export to JSON, PDF formats
- **Copy to Clipboard:** Copy JSON, metadata, or specific fields to clipboard
- **Print Support:** Print-friendly view for audit log detail

---

**Last Updated:** 2025-01-01  
**Status:** 🟡 Ready for Review  
**Design Approach:** Modern enterprise audit log detail pattern (Stripe/GitHub/Linear/shadcn/ui inspired)
