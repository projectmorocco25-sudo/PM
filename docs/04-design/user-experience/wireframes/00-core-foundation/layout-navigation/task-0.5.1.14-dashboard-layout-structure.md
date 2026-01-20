# Task 0.5.1.14: Dashboard Layout Structure Wireframe

**Status:** ✅ Complete  
**Route:** Layout component (all dashboard pages)  
**File:** `task-0.5.1.14-dashboard-layout-structure.png`  
**Priority:** 🔴 Critical Foundation

**Design Approach:** Modern enterprise/government dashboard pattern inspired by Stripe, GitHub, Linear, and shadcn/ui best practices. Professional, accessible, and optimized for regulatory compliance workflows.

**Regulatory Compliance Context:**
- Layout structure supports regulatory workflows across all modules (RMM, VCI, ECS, CMC)
- Navigation provides direct access to regulatory compliance features (Regulatory Activity History, Pending Regulatory Approvals)
- All content displayed within this layout is subject to regulatory data retention requirements (7 years minimum per Law No. 09-08)
- Design adheres to accessibility standards (WCAG 2.1 AA) to ensure regulatory compliance tool access for all users

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Header (Fixed, 64px height)                                    │
│ ┌──────┐ ┌────────┐              ┌──┐ ┌──┐ ┌──────┐         │
│ │ Logo │ │ Module │              │🔍│ │🔔│ │User ▼│         │
│ └──────┘ └────────┘              └──┘ └──┘ └──────┘         │
├──────────┬─────────────────────────────────────────────────────┤
│          │                                                     │
│ Sidebar  │ Main Content Area (Scrollable)                     │
│ (256px)  │                                                     │
│          │ ┌─────────────────────────────────────────────┐  │
│ [Global] │ │ Breadcrumbs: Home > Module > Page           │  │
│ ├ Dashboard│ │ Page Title                    [Action]     │  │
│ ├ Comm... │ ├─────────────────────────────────────────────┤  │
│ ├ History │ │                                             │  │
│ ├ Notif...│ │                                             │  │
│ └ Audit   │ │         Page Content                        │  │
│           │ │                                             │  │
│ [RMM]     │ │                                             │  │
│ ├ Overview│ │                                             │  │
│ ├ Comp... │ │                                             │  │
│ ├ Prod... │ │                                             │  │
│ └ SKUs    │ │                                             │  │
│           │ │                                             │  │
│ [VCI]     │ │                                             │  │
│ ├ Dashboard│ │                                             │  │
│ ├ Subm... │ │                                             │  │
│ └ ...     │ │                                             │  │
│           │ └─────────────────────────────────────────────┘  │
│ [Collapse]│                                                     │
│           │                                                     │
└──────────┴─────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Header (Fixed Top)
- **Height:** 64px (fixed) - Industry standard for enterprise dashboards
- **Background:** White (#ffffff) with subtle elevation
- **Border Bottom:** 1px solid #e5e7eb (border-default)
- **Box Shadow:** Subtle shadow (0 1px 3px 0 rgba(0, 0, 0, 0.1)) for depth separation
- **Position:** Fixed at top, full width
- **Z-index:** 1000 (above all content, below modals)
- **Backdrop Blur:** Optional subtle blur (backdrop-blur-sm) for modern glass effect
- **Transition:** Smooth transitions for state changes (150ms ease-in-out)

**Left Section:**
- **Logo:** MOH logo, ~40px height (maintains aspect ratio), clickable → `/dashboard`
  - **Hover State:** Subtle opacity change (0.8) or scale (1.02)
  - **Focus State:** Clear focus ring (2px outline, primary-500)
  - **Accessibility:** Alt text "MOH Logo - Return to Dashboard"
- **Module Indicator:** Badge/pill showing current module (RMM, VCI, ECS, CMC, Enforcement)
  - Only visible when inside a module
  - Color-coded by module (see Design System)
  - **Size:** Height 24px, padding 8px horizontal, 4px vertical
  - **Typography:** 12px, font-weight: 600, uppercase, letter-spacing: 0.5px
  - **Border Radius:** 6px (pill shape)
  - **Position:** 16px right of logo
  - **Transition:** Smooth appearance (fade-in, 200ms)

**Right Section:**
- **Layout:** Flex container, align-items: center, gap: 8px (tight spacing for compact header)
- **Search Icon:**
  - **Size:** 40px × 40px (touch target minimum)
  - **Style:** Icon button with subtle hover background (#f9fafb)
  - **Click Action:** Opens search modal/dropdown (full-screen on mobile)
  - **Keyboard:** Accessible via Tab, Enter to activate
  - **Tooltip:** "Search (Ctrl+K)" on hover
- **Notifications Icon:**
  - **Size:** 40px × 40px
  - **Badge:** Red dot (8px) or count badge (18px × 18px) for unread
  - **Position:** Top-right corner of icon
  - **Animation:** Subtle pulse for new notifications
  - **Click Action:** Opens notification center dropdown
  - **Keyboard:** Accessible via Tab, Enter to activate
- **User Menu:**
  - **Avatar:** 32px × 32px circle, initials or image
  - **Dropdown Arrow:** Chevron down, 16px, rotates 180° when open
  - **Hover State:** Light background (#f9fafb)
  - **Click Action:** Opens user menu dropdown (Profile, Settings, Logout)
  - **Keyboard:** Accessible via Tab, Enter/Arrow keys to navigate
- **Spacing:** 8px between items (compact, professional spacing)

### Sidebar (Left Navigation)
- **Width:** 256px (expanded), 64px (collapsed) - Industry standard (Stripe, GitHub pattern)
- **Background:** White (#ffffff) - Clean, professional appearance
- **Border Right:** 1px solid #e5e7eb (subtle separation)
- **Position:** Fixed left, below header
- **Height:** Calc(100vh - 64px) (full height minus header)
- **Scrollable:** Yes (if content exceeds height)
  - **Scrollbar:** Custom styled, thin (8px), appears on hover
  - **Scrollbar Color:** #d1d5db (subtle, non-intrusive)
- **Transition:** Smooth width transition (300ms cubic-bezier) for expand/collapse
- **Z-index:** 100 (below header, above content)
- **Backdrop:** Optional subtle shadow on right edge for depth

**Module Sections:**
- **Global Section:** Dashboard, Communications, History, Notifications, Audit (MOH only), System Config (Tier 1 only)
- **RMM Section:** Overview, Companies, Products, SKUs
- **VCI Section:** Dashboard, Submissions, Thresholds, Compliance Violations, Governance (MOH), Treemap (Supply Chain Visualization) (MOH)
- **ECS Section:** (if active OR historical data exists) Overview, Export Requests, Authorizations, History
- **CMC Section:** (if active OR historical data exists) Overview, Regulatory Compliance Ratings, Compliance Disputes, Reports, History
- **Enforcement Section:** (MOH Tier 1 & Tier 2 only) Dashboard, Actions, Pending Regulatory Approvals, Reports
- **Help & Info Section:** Support, FAQ, Documentation, Contact, Status

**Navigation Items:**
- **Format:** Icon + Label (expanded), Icon only (collapsed)
- **Height:** 40px (touch target minimum, industry standard)
- **Padding:** 12px horizontal (expanded), centered (collapsed)
- **Border Radius:** 6px (subtle rounding for modern feel)
- **Typography:**
  - **Label:** 14px, font-weight: 500 (expanded)
  - **Icon:** 20px × 20px, color: #6b7280 (text-secondary)
  - **Active Text:** font-weight: 600, color: #111827 (text-primary)
- **Active State:**
  - **Background:** #eff6ff (primary-50) - Subtle blue tint
  - **Left Border:** 3px solid #3b82f6 (primary-500) - Visual indicator
  - **Text Color:** #111827 (text-primary)
  - **Icon Color:** #3b82f6 (primary-500)
  - **Transition:** Smooth background change (150ms)
- **Hover State:**
  - **Background:** #f9fafb (bg-secondary)
  - **Text Color:** #111827 (text-primary)
  - **Transition:** Smooth background change (150ms)
- **Focus State:**
  - **Outline:** 2px solid #3b82f6 (primary-500), offset 2px
  - **Accessibility:** Keyboard navigation support
- **Badge Support:**
  - **Position:** Right side of item, 8px from edge
  - **Size:** 18px × 18px (count), 8px × 8px (dot)
  - **Background:** #ef4444 (error-500) for alerts, #3b82f6 (primary-500) for info
  - **Typography:** 11px, font-weight: 600, white text
  - **Border Radius:** 9px (pill shape)
- **Spacing:** 4px between items (compact), 16px between sections (clear grouping)
- **Accessibility:**
  - **ARIA Labels:** Descriptive labels for screen readers
  - **Keyboard Navigation:** Tab to navigate, Enter to activate
  - **Focus Indicators:** Clear, visible focus rings

**Collapse Toggle:**
- **Position:** Bottom of sidebar, fixed (stays visible when scrolling)
- **Height:** 48px
- **Width:** Full width (expanded), 64px (collapsed)
- **Background:** Transparent, hover: #f9fafb
- **Border Top:** 1px solid #e5e7eb (subtle separator)
- **Icon:** Chevron left (expanded), Chevron right (collapsed)
  - **Size:** 20px × 20px
  - **Color:** #6b7280 (text-secondary)
  - **Animation:** Smooth rotation (200ms)
- **Action:** Toggles sidebar expanded/collapsed state
- **Keyboard:** Accessible via Tab, Enter to toggle
- **Tooltip:** "Collapse sidebar" / "Expand sidebar" on hover
- **Accessibility:** ARIA label "Toggle sidebar navigation"

### Main Content Area
- **Width:** Flexible (fills remaining space: calc(100vw - 256px) expanded, calc(100vw - 64px) collapsed)
- **Background:** #f9fafb (bg-secondary) - Light gray for subtle contrast with white cards
- **Min Height:** Calc(100vh - 64px) (full viewport minus header)
- **Padding:** 24px (desktop ≥1024px), 16px (tablet 768-1023px), 16px (mobile <768px)
- **Position:** Right of sidebar, below header
- **Scrollable:** Yes (vertical scroll, smooth scrolling enabled)
- **Transition:** Smooth width adjustment when sidebar toggles (300ms)
- **Max Width:** Optional 1920px container for ultra-wide screens (centered with margins)

**Content Structure:**
- **Breadcrumbs:**
  - **Position:** Top of content area, 24px from top, 0px horizontal (full width)
  - **Height:** 40px (compact)
  - **Typography:** 14px, color: #6b7280 (text-secondary)
  - **Separator:** "/" or chevron, color: #9ca3af (text-tertiary)
  - **Link Color:** #2563eb (text-link), hover: underline
  - **Last Item:** #111827 (text-primary), no link (current page)
- **Page Header:**
  - **Position:** 16px below breadcrumbs
  - **Layout:** Flex, space-between, align-items: center
  - **Title:**
    - **Typography:** 30px (h1), font-weight: 700, color: #111827 (text-primary)
    - **Line Height:** 1.2 (tight, professional)
  - **Action Buttons:**
    - **Position:** Right-aligned
    - **Spacing:** 12px between buttons
    - **Primary Button:** Prominent, primary color
    - **Secondary Button:** Outlined or ghost style
- **Content:**
  - **Position:** 24px below page header
  - **Layout:** Grid or flex based on content type
  - **Card Background:** White (#ffffff) for content cards
  - **Card Shadow:** Subtle (0 1px 3px 0 rgba(0, 0, 0, 0.1))
  - **Card Border Radius:** 8px (modern, subtle rounding)
  - **Card Padding:** 24px (desktop), 16px (mobile)
  - **Gap:** 24px between cards/sections (desktop), 16px (mobile)

---

## Annotations

### Blue (Interactions)
- **Click logo** → Navigate to `/dashboard`
- **Click module indicator** → Navigate to module overview
- **Click search icon** → Open search modal/dropdown
- **Click notifications icon** → Open notification center
- **Click user menu** → Open dropdown (Profile, Settings, Logout)
- **Click navigation item** → Navigate to route
- **Click collapse toggle** → Collapse/expand sidebar

### Green (States)
- **Sidebar expanded:** Full width (256px), icons + labels visible
- **Sidebar collapsed:** Narrow width (64px), icons only, labels hidden
- **Active navigation item:** Highlighted background, colored left border, bold text
- **Hover navigation item:** Light background change
- **Module active:** Module indicator visible, color-coded
- **Module inactive:** Module indicator hidden

---

## Responsive Behavior

### Desktop (1024px+)
- **Sidebar:** Expanded (256px), full navigation visible
- **Content:** Full width minus sidebar
- **Header:** Full width

### Tablet (768px - 1023px)
- **Sidebar:** Collapsed by default (64px), icons only
- **Content:** Full width minus collapsed sidebar
- **Header:** Full width
- **Sidebar expand:** Tap/click to expand temporarily (overlay or push content)

### Mobile (<768px)
- **Sidebar:** Hidden by default, hamburger menu in header
- **Content:** Full width
- **Header:** Full width, hamburger menu on left (replaces or alongside logo)
- **Sidebar:** Drawer/modal overlay when opened
  - **Width:** 280px (slightly wider than desktop for touch)
  - **Animation:** Slide-in from left (300ms)
  - **Backdrop:** Dark overlay (rgba(0, 0, 0, 0.5)) with backdrop blur
  - **Close:** Tap outside or X button to close
- **Content Padding:** 16px (reduced for mobile screens)
- **Page Title:** 24px (smaller for mobile)
- **Cards:** Full width, no horizontal gap

---

## Design System References

### Components Used
- **Header Component:** Fixed header with logo, search, notifications, user menu (shadcn/ui pattern)
- **Sidebar Component:** Collapsible sidebar with navigation groups (Stripe/GitHub pattern)
- **Navigation Item Component:** Icon + label, active/hover states (shadcn/ui navigation pattern)
- **Breadcrumbs Component:** Hierarchical navigation trail (shadcn/ui breadcrumbs)
- **Card Component:** Content cards with subtle shadows (shadcn/ui card)

### Design Inspiration References
- **Stripe Dashboard:** https://dashboard.stripe.com - Professional sidebar navigation pattern
- **GitHub:** https://github.com - Clean layout, clear hierarchy
- **Linear App:** https://linear.app - Modern sidebar, smooth transitions
- **shadcn/ui Dashboard:** https://ui.shadcn.com/examples/dashboard - Component patterns
- **Taxonomy (shadcn/ui):** https://tx.shadcn.com/ - Full implementation example

### Colors (From Design System)
- **Header Background:** #ffffff (white)
- **Header Border:** #e5e7eb (border-default)
- **Header Shadow:** rgba(0, 0, 0, 0.1) - Subtle elevation
- **Sidebar Background:** #ffffff (white) - Clean, professional
- **Sidebar Border:** #e5e7eb (border-default)
- **Active Item Background:** #eff6ff (primary-50)
- **Active Item Border:** #3b82f6 (primary-500), 3px solid
- **Active Item Text:** #111827 (text-primary)
- **Hover Background:** #f9fafb (bg-secondary)
- **Content Background:** #f9fafb (bg-secondary) - Subtle contrast
- **Card Background:** #ffffff (white)
- **Card Shadow:** rgba(0, 0, 0, 0.1) - Subtle elevation

### Typography (From Design System)
- **Page Title:** 30px (2rem), font-weight: 700, line-height: 1.2
- **Section Headers:** 20px (1.25rem), font-weight: 600
- **Navigation Labels:** 14px (0.875rem), font-weight: 500 (normal), 600 (active)
- **Breadcrumbs:** 14px (0.875rem), font-weight: 400
- **Body Text:** 16px (1rem), font-weight: 400, line-height: 1.5

### Spacing (8px Grid System)
- **Header Height:** 64px (8 × 8px)
- **Sidebar Width Expanded:** 256px (32 × 8px)
- **Sidebar Width Collapsed:** 64px (8 × 8px)
- **Content Padding:** 24px (3 × 8px) desktop, 16px (2 × 8px) mobile
- **Navigation Item Height:** 40px (5 × 8px)
- **Navigation Item Padding:** 12px horizontal (1.5 × 8px)
- **Section Spacing:** 16px (2 × 8px) between sections
- **Item Spacing:** 4px (0.5 × 8px) between items
- **Card Gap:** 24px (3 × 8px) between cards
- **Card Padding:** 24px (3 × 8px) desktop, 16px (2 × 8px) mobile

### Transitions & Animations
- **Sidebar Expand/Collapse:** 300ms cubic-bezier(0.4, 0, 0.2, 1)
- **Navigation Hover:** 150ms ease-in-out
- **Active State Change:** 150ms ease-in-out
- **Modal/Dropdown Open:** 200ms ease-in-out
- **Badge Pulse:** 2s infinite (for new notifications)

### Accessibility (WCAG 2.1 AA Compliance)
- **Color Contrast:** Minimum 4.5:1 for text, 3:1 for UI components
- **Focus Indicators:** 2px solid outline, #3b82f6 (primary-500), 2px offset
- **Keyboard Navigation:** Full keyboard support (Tab, Enter, Arrow keys, Escape)
- **Screen Reader Support:** ARIA labels, roles, and descriptions
- **Touch Targets:** Minimum 40px × 40px for all interactive elements
- **Skip Links:** "Skip to main content" link for keyboard users

---

## Related Documents

- [Navigation & Layout Patterns](../../../../02-architecture/frontend/navigation-layout-patterns.md) - Complete layout specifications
- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - All route paths
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - Role-specific navigation
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - Detailed compliance requirements

---

## Industry Best Practices Implementation

### Performance Optimizations
- **Lazy Loading:** Sidebar navigation items load on demand
- **Virtual Scrolling:** For long navigation lists (if needed)
- **CSS Containment:** Use `contain: layout style paint` for sidebar
- **Will-Change:** Hint browser about sidebar transitions (`will-change: width`)
- **Debounced Resize:** Debounce window resize handlers (150ms)

### Modern CSS Features
- **CSS Grid/Flexbox:** Use for layout (flexible, responsive)
- **CSS Custom Properties:** Use design system tokens for colors/spacing
- **Container Queries:** Consider for component-level responsive design
- **Backdrop Filter:** Subtle blur effects (if supported, graceful degradation)

### State Management
- **Sidebar State:** Persist expanded/collapsed state in localStorage
- **Active Route:** Highlight based on current route (Next.js router)
- **Module Indicator:** Show based on route path matching
- **Notification Count:** Real-time updates via WebSocket or polling

### Error Handling
- **Loading States:** Skeleton loaders for navigation items
- **Error Boundaries:** Graceful degradation if navigation fails
- **Offline Support:** Cache navigation structure for offline access

### Browser Support
- **Modern Browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Progressive Enhancement:** Core functionality works without JS
- **Polyfills:** For older browsers if needed (Intersection Observer, etc.)

### Testing Considerations
- **Visual Regression:** Test sidebar expand/collapse states
- **Responsive Testing:** Test at key breakpoints (768px, 1024px, 1920px)
- **Accessibility Testing:** Screen reader, keyboard navigation, color contrast
- **Performance Testing:** Lighthouse scores, Core Web Vitals

---

**Last Updated:** 2025-01-01  
**Status:** 🟡 Ready for Review  
**Design Approach:** Modern enterprise/government dashboard pattern (Stripe/GitHub/Linear/shadcn/ui inspired)
