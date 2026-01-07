# Task 0.5.1.15: Header Component Wireframe

**Status:** 🟡 In Progress  
**Route:** Header component (all dashboard pages)  
**File:** `task-0.5.1.15-header-component.png`  
**Priority:** 🔴 Critical Foundation

**Design Approach:** Modern enterprise header pattern inspired by Stripe, GitHub, Linear, and shadcn/ui best practices. Professional, accessible, and optimized for regulatory compliance workflows.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Header (64px height, fixed top)                                 │
│                                                                 │
│ ┌──────┐ ┌──────────┐                    ┌──┐ ┌──┐(3) ┌──────┐ │
│ │ Logo │ │ [RMM]   │                    │🔍│ │🔔│    │User ▼│ │
│ │      │ │ (tooltip│                    │  │ │  │    │      │ │
│ │      │ │ :RMM)   │                    │  │ │  │    │      │ │
│ └──────┘ └──────────┘                    └──┘ └──┘    └──────┘ │
│                                                                 │
│ Left Section                    Right Section                  │
└─────────────────────────────────────────────────────────────────┘
```

**Expanded View:**

```
┌─────────────────────────────────────────────────────────────────┐
│ [MOH Logo] [RMM] (tooltip: "Registry Management (RMM)") [🔍] [🔔(3)] [👤 User ▼] │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Header Container
- **Height:** 64px (fixed) - Industry standard for enterprise dashboards
- **Background:** White (#ffffff) with subtle elevation
- **Border Bottom:** 1px solid #e5e7eb (border-default)
- **Box Shadow:** Subtle shadow (0 1px 3px 0 rgba(0, 0, 0, 0.1)) for depth separation
- **Padding:** 16px horizontal, 12px vertical (consistent spacing)
- **Display:** Flex, space-between, align-items: center
- **Position:** Fixed at top, full width
- **Z-index:** 1000 (above all content, below modals)
- **Backdrop Blur:** Optional subtle blur (backdrop-blur-sm) for modern glass effect
- **Transition:** Smooth transitions for state changes (150ms ease-in-out)
- **Sticky Behavior:** Maintains position on scroll (always visible)

### Left Section
- **Display:** Flex, align-items: center
- **Gap:** 16px between items

**Logo:**
- **Image:** MOH logo
- **Height:** ~40px (maintains aspect ratio)
- **Width:** Auto (preserves aspect ratio)
- **Clickable:** Yes → Navigate to `/dashboard`
- **Hover State:** 
  - Subtle opacity change (0.8) or scale (1.02)
  - Transition: 150ms ease-in-out
- **Focus State:** 
  - Clear focus ring (2px outline, #3b82f6 primary-500)
  - Offset: 2px
- **Accessibility:** 
  - Alt text: "MOH Logo - Return to Dashboard"
  - ARIA label: "Return to dashboard"
  - Keyboard: Accessible via Tab, Enter to activate
- **Cursor:** Pointer on hover

**Module Indicator (Conditional):**
- **Visibility:** Only when inside a module (RMM, VCI, ECS, CMC, Enforcement)
- **Format:** Badge/pill with abbreviation (space-constrained header)
- **Display:** Abbreviation only (e.g., "RMM", "VCI") to save space
- **Tooltip:** Full name + abbreviation on hover (e.g., "Registry Management (RMM)")
- **Size:** Height 24px, padding 8px horizontal, 4px vertical
- **Colors:**
  - RMM: #3b82f6 (primary-500) background, white text, tooltip: "Registry Management (RMM)"
  - VCI: #22c55e (success-500) background, white text, tooltip: "Value Chain Intelligence (VCI)"
  - ECS: #f59e0b (warning-500) background, white text, tooltip: "Export Control System (ECS)"
  - CMC: #8b5cf6 (purple-500) background, white text, tooltip: "Compliance Monitoring Center (CMC)"
  - Enforcement: #ef4444 (error-500) background, white text, tooltip: "Enforcement" (no abbreviation) (no abbreviation needed)
- **Border Radius:** 6px (pill shape)
- **Typography:** 12px, font-weight: 600, uppercase, letter-spacing: 0.5px
- **Position:** 16px right of logo
- **Transition:** Smooth appearance (fade-in, 200ms)
- **Hover State:** 
  - Slight scale (1.05) or opacity change
  - Tooltip shows full name + abbreviation (500ms delay)
- **Clickable:** Yes → Navigate to module overview
- **Accessibility:** 
  - ARIA label: "Registry Management module (RMM)" (full name always in ARIA)
  - Tooltip: Keyboard accessible, announces full name on focus
- **Rationale:** Header space is limited; abbreviations save space while tooltips provide full context

### Right Section
- **Display:** Flex, align-items: center
- **Gap:** 8px between items (compact, professional spacing)

**Search Icon:**
- **Icon:** Search/magnifying glass icon (Lucide React)
- **Size:** 40px × 40px (touch target minimum - WCAG requirement)
- **Background:** Transparent
- **Hover State:** 
  - Light background (#f9fafb)
  - Border radius: 6px (subtle rounding)
  - Transition: 150ms ease-in-out
- **Active State:** 
  - Slightly darker background (#f3f4f6)
- **Click Action:** Opens search modal/dropdown
  - **Desktop:** Centered modal or dropdown
  - **Mobile:** Full-screen search overlay
- **Keyboard Shortcut:** Ctrl+K (Cmd+K on Mac) - Display in tooltip
- **Tooltip:** "Search (Ctrl+K)" on hover (desktop only)
- **Focus State:** 
  - Clear focus ring (2px outline, #3b82f6)
  - Visible on keyboard navigation
- **Accessibility:**
  - ARIA label: "Open search"
  - Keyboard: Tab to focus, Enter to activate
  - Screen reader: Announces search functionality
- **Cursor:** Pointer

**Notifications Icon:**
- **Icon:** Bell icon (Lucide React)
- **Size:** 40px × 40px (touch target minimum)
- **Background:** Transparent
- **Badge:** Red dot or count badge (e.g., "3")
  - **Position:** Top-right corner of icon, 2px offset from edge
  - **Size:** 18px × 18px (for count), 8px × 8px (for dot)
  - **Background:** #ef4444 (error-500) for dot, #dc2626 (error-600) for count
  - **Text Color:** White (#ffffff) for count
  - **Typography:** 11px, font-weight: 600, centered
  - **Border:** 2px solid white (ensures visibility on any background)
  - **Border Radius:** 9px (pill shape for count), 50% (circle for dot)
  - **Animation:** Subtle pulse (2s infinite) for new notifications
  - **Max Count:** Display "99+" if count exceeds 99
- **Hover State:** 
  - Light background (#f9fafb)
  - Border radius: 6px
  - Transition: 150ms ease-in-out
- **Active State:** 
  - Slightly darker background (#f3f4f6)
- **Click Action:** Opens notification center dropdown (Task 0.5.1.17)
  - **Position:** Below icon, right-aligned
  - **Width:** 400px (desktop), 320px (tablet)
  - **Max Height:** 500px (scrollable)
- **Keyboard Shortcut:** None (but accessible via Tab)
- **Tooltip:** "Notifications" on hover (desktop only)
- **Focus State:** 
  - Clear focus ring (2px outline, #3b82f6)
  - Visible on keyboard navigation
- **Accessibility:**
  - ARIA label: "Notifications" with count (e.g., "Notifications, 3 unread")
  - ARIA live region: Updates when notification count changes
  - Keyboard: Tab to focus, Enter to activate
- **Cursor:** Pointer

**User Menu:**
- **Display:** Flex, align-items: center, gap: 8px
- **Padding:** 4px (subtle padding for larger hover area)
- **Border Radius:** 6px (subtle rounding)
- **Avatar:** User avatar or initials circle
  - **Size:** 32px × 32px
  - **Background:** 
    - Primary blue (#3b82f6) if no image
    - User image if available (object-fit: cover)
  - **Border Radius:** 50% (circle)
  - **Border:** 2px solid white (subtle separation from background)
  - **Text Color:** White (#ffffff) if initials
  - **Typography:** 14px, font-weight: 600
  - **Fallback:** First letter of first name + first letter of last name
- **Dropdown Arrow:** Chevron down icon, 16px
  - **Color:** #6b7280 (text-secondary)
  - **Rotation:** 180° when menu is open
  - **Transition:** 200ms ease-in-out
- **Hover State:** 
  - Light background (#f9fafb)
  - Transition: 150ms ease-in-out
- **Active State:** 
  - Slightly darker background (#f3f4f6)
- **Click Action:** Opens user menu dropdown
  - **Position:** Below user menu, right-aligned
  - **Width:** 200px
  - **Animation:** Fade-in + slide-down (200ms)
- **Keyboard Shortcut:** None (but accessible via Tab)
- **Focus State:** 
  - Clear focus ring (2px outline, #3b82f6)
  - Visible on keyboard navigation
- **Accessibility:**
  - ARIA label: "User menu" with user name
  - ARIA expanded: true/false based on dropdown state
  - Keyboard: Tab to focus, Enter to open, Arrow keys to navigate, Escape to close
- **Cursor:** Pointer

**User Menu Dropdown (On Click):**
```
┌─────────────────────┐
│ 👤 Profile          │
│ ⚙️ Settings         │
│ ─────────────────── │
│ 🚪 Logout           │
└─────────────────────┘
```
- **Position:** Below user menu, right-aligned, 8px gap
- **Width:** 200px (optimal for menu items)
- **Background:** White (#ffffff)
- **Border:** 1px solid #e5e7eb (border-default)
- **Border Radius:** 8px (modern, subtle rounding)
- **Box Shadow:** Medium shadow (0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05))
- **Padding:** 4px vertical (compact, professional)
- **Z-index:** 1060 (above header, below modals)
- **Animation:** 
  - Fade-in: 200ms ease-in-out
  - Slide-down: 4px offset, 200ms ease-out
- **Items:** Profile, Settings, Divider, Logout
  - **Profile:** Icon + text, navigate to `/profile`
  - **Settings:** Icon + text, navigate to `/settings`
  - **Divider:** 1px solid #e5e7eb, 8px margin vertical
  - **Logout:** Icon + text, destructive action (red text on hover)
- **Item Height:** 40px (touch target minimum)
- **Item Padding:** 12px horizontal, 8px vertical
- **Item Typography:** 14px, font-weight: 500, color: #111827
- **Item Icons:** 16px × 16px, color: #6b7280, 8px right of icon
- **Hover State:** 
  - Light background (#f9fafb)
  - Transition: 150ms ease-in-out
- **Focus State:** 
  - Clear focus ring (2px outline, #3b82f6)
  - Visible on keyboard navigation
- **Active State:** 
  - Slightly darker background (#f3f4f6)
- **Accessibility:**
  - ARIA role: "menu"
  - ARIA labels for each item
  - Keyboard: Arrow keys to navigate, Enter to activate, Escape to close
  - Focus trap: Focus stays within dropdown when open

---

## Annotations

### Blue (Interactions)
- **Click logo** → Navigate to `/dashboard` (home)
  - **Keyboard:** Tab to focus, Enter to activate
  - **Mobile:** Same behavior
- **Click search icon** → Open search modal/dropdown
  - **Desktop:** Centered modal (600px width) or dropdown (400px width)
  - **Mobile:** Full-screen search overlay
  - **Search input:** Auto-focus on open
  - **Recent searches:** Display below input (max 5 items)
  - **Keyboard shortcut:** Ctrl+K (Cmd+K on Mac) to open
  - **Escape:** Closes search modal
- **Click notifications icon** → Open notification center (see Task 0.5.1.17)
  - **Notification center:** Dropdown/popover below icon
  - **Position:** Right-aligned, 8px gap
  - **Shows:** Recent notifications (max 10-15 items)
  - **Badge count:** Updates in real-time via WebSocket or polling
  - **Click outside:** Closes notification center
  - **Escape:** Closes notification center
- **Click user menu** → Open dropdown menu
  - **Dropdown:** Profile, Settings, Logout
  - **Click outside:** Closes dropdown
  - **Escape:** Closes dropdown
  - **Keyboard navigation:** Arrow keys to navigate items, Enter to activate
- **Click module indicator** → Navigate to module overview (if applicable)
  - **Keyboard:** Tab to focus, Enter to activate

### Green (States)
- **Notification badge count:** Dynamic number (e.g., "3" unread)
  - **Updates:** Real-time via WebSocket or polling (every 30 seconds)
  - **Animation:** Subtle pulse (2s infinite) for new notifications
  - **Max display:** "99+" if count exceeds 99
- **Unread indicator:** Red dot (8px) when unread notifications exist
  - **Animation:** Subtle pulse for attention
- **Module indicator:** 
  - **Visible:** Only when inside module, color-coded
  - **Transition:** Smooth fade-in (200ms) when entering module
  - **Hidden:** When on dashboard or global pages
- **User menu open:** 
  - **Dropdown visible:** Fade-in + slide-down animation
  - **Arrow rotates:** 180° (points up)
  - **Focus trap:** Active (keyboard navigation within dropdown)
- **User menu closed:** 
  - **Dropdown hidden:** Fade-out + slide-up animation
  - **Arrow points down**
- **Search modal open:**
  - **Backdrop:** Dark overlay (rgba(0, 0, 0, 0.5)) with backdrop blur
  - **Input focused:** Auto-focus on search input
  - **Recent searches:** Display if available
- **Hover states:** 
  - Light background (#f9fafb) on all interactive elements
  - Smooth transition (150ms ease-in-out)
- **Loading states:**
  - **Skeleton loader:** For notification count while loading
  - **Spinner:** For user menu if user data is loading

---

## Responsive Behavior

### Desktop (1024px+)
- **Full header:** All elements visible
- **Module indicator:** Visible when in module
- **Search:** Always visible
- **Notifications:** Always visible with badge
- **User menu:** Always visible

### Tablet (768px - 1023px)
- **Full header:** All elements visible
- **Module indicator:** May be hidden if space constrained
- **Search:** Visible
- **Notifications:** Visible with badge
- **User menu:** Visible

### Mobile (<768px)
- **Hamburger menu:** Added on left (replaces logo or alongside)
  - **Size:** 40px × 40px (touch target)
  - **Icon:** Three horizontal lines (hamburger icon)
  - **Click:** Opens sidebar drawer
  - **Position:** Left side, 16px from edge
- **Logo:** 
  - **Size:** Smaller (~32px height) or hidden if space constrained
  - **Position:** Center or left (if hamburger on separate row)
- **Module indicator:** Hidden (space constraint)
- **Search:** 
  - **Option 1:** Hidden, accessible via hamburger menu
  - **Option 2:** Visible but smaller icon (32px × 32px)
  - **Click:** Opens full-screen search overlay
- **Notifications:** 
  - **Visible:** With badge
  - **Size:** 40px × 40px (touch target)
  - **Click:** Opens full-screen notification drawer
- **User menu:** 
  - **Visible:** Avatar + dropdown arrow
  - **Size:** 40px × 40px (touch target)
  - **Dropdown:** Full-width drawer on mobile (better UX than dropdown)

---

## Design System References

### Components Used
- **Header Component:** Fixed header with flex layout (shadcn/ui pattern)
- **Badge Component:** Module indicator, notification count (shadcn/ui badge)
- **Avatar Component:** User avatar/initials (shadcn/ui avatar)
- **Dropdown Component:** User menu dropdown (shadcn/ui dropdown menu)
- **Icon Button Component:** Search, notifications icons (shadcn/ui button variant)
- **Tooltip Component:** Hover tooltips (shadcn/ui tooltip)

### Design Inspiration References
- **Stripe Dashboard:** https://dashboard.stripe.com - Professional header pattern
- **GitHub:** https://github.com - Clean header, notification badge
- **Linear App:** https://linear.app - Modern header, smooth interactions
- **shadcn/ui Components:** https://ui.shadcn.com - Component patterns

### Colors (From Design System)
- **Header Background:** #ffffff (white)
- **Header Border:** #e5e7eb (border-default)
- **Header Shadow:** rgba(0, 0, 0, 0.1) - Subtle elevation
- **Hover Background:** #f9fafb (bg-secondary)
- **Active Background:** #f3f4f6 (bg-tertiary)
- **Module Badge Colors:**
  - RMM: #3b82f6 (primary-500) background, white text, tooltip: "Registry Management (RMM)"
  - VCI: #22c55e (success-500) background, white text, tooltip: "Value Chain Intelligence (VCI)"
  - ECS: #f59e0b (warning-500) background, white text, tooltip: "Export Control System (ECS)"
  - CMC: #8b5cf6 (purple-500) background, white text, tooltip: "Compliance Monitoring Center (CMC)"
  - Enforcement: #ef4444 (error-500) background, white text, tooltip: "Enforcement" (no abbreviation)
- **Notification Badge:** 
  - Dot: #ef4444 (error-500)
  - Count: #dc2626 (error-600) background, white text
  - Border: 2px solid white (ensures visibility)
- **Avatar Background:** #3b82f6 (primary-500)
- **Focus Ring:** #3b82f6 (primary-500), 2px outline
- **Text Colors:**
  - Primary: #111827 (text-primary)
  - Secondary: #6b7280 (text-secondary)
  - Tertiary: #9ca3af (text-tertiary)

### Typography (From Design System)
- **Module Badge:** 12px, font-weight: 600, uppercase, letter-spacing: 0.5px
- **User Menu Items:** 14px, font-weight: 500
- **Notification Count:** 11px, font-weight: 600
- **Tooltip:** 12px, font-weight: 400

### Spacing (8px Grid System)
- **Header Height:** 64px (8 × 8px)
- **Horizontal Padding:** 16px (2 × 8px)
- **Vertical Padding:** 12px (1.5 × 8px)
- **Item Gap:** 8px (1 × 8px) - Compact, professional spacing
- **Logo to Module Indicator:** 16px (2 × 8px)
- **Dropdown Width:** 200px
- **Dropdown Item Height:** 40px (5 × 8px)
- **Dropdown Item Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)
- **Dropdown Padding:** 4px vertical (0.5 × 8px)

### Transitions & Animations
- **Hover States:** 150ms ease-in-out
- **Dropdown Open/Close:** 200ms ease-in-out (fade + slide)
- **Module Indicator:** 200ms fade-in
- **Notification Badge Pulse:** 2s infinite (for new notifications)
- **Chevron Rotation:** 200ms ease-in-out

### Accessibility (WCAG 2.1 AA Compliance)
- **Color Contrast:** Minimum 4.5:1 for text, 3:1 for UI components
- **Focus Indicators:** 2px solid outline, #3b82f6 (primary-500), 2px offset
- **Keyboard Navigation:** Full keyboard support (Tab, Enter, Arrow keys, Escape)
- **Screen Reader Support:** ARIA labels, roles, and descriptions
- **Touch Targets:** Minimum 40px × 40px for all interactive elements
- **ARIA Live Regions:** For notification count updates
- **Focus Trap:** Active when dropdowns/modals are open

---

## Related Documents

- [Navigation & Layout Patterns](../../../../02-architecture/frontend/navigation-layout-patterns.md) - Header specifications
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Badge, Avatar, Dropdown components
- [Design System](../../../../02-architecture/frontend/design-system.md) - Colors, spacing
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - Detailed compliance requirements

---

## Industry Best Practices Implementation

### Performance Optimizations
- **Lazy Loading:** User menu dropdown loads on demand
- **Debounced Resize:** Debounce window resize handlers (150ms)
- **CSS Containment:** Use `contain: layout style paint` for header
- **Will-Change:** Hint browser about dropdown animations (`will-change: transform, opacity`)
- **Notification Polling:** Efficient polling (30s interval) or WebSocket for real-time updates

### Modern CSS Features
- **CSS Grid/Flexbox:** Use flexbox for header layout (flexible, responsive)
- **CSS Custom Properties:** Use design system tokens for colors/spacing
- **Backdrop Filter:** Subtle blur effects for dropdowns (if supported, graceful degradation)
- **CSS Transitions:** Smooth animations for all state changes

### State Management
- **Notification Count:** Real-time updates via WebSocket or polling
- **User Menu State:** Track open/closed state in component state
- **Module Indicator:** Show based on route path matching
- **Search State:** Track search modal open/closed state

### Error Handling
- **Loading States:** Skeleton loaders for notification count
- **Error Boundaries:** Graceful degradation if header fails
- **Fallback:** Default avatar if user image fails to load
- **Offline Support:** Cache notification count for offline access

### Browser Support
- **Modern Browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Progressive Enhancement:** Core functionality works without JS
- **Polyfills:** For older browsers if needed (Intersection Observer, etc.)

### Testing Considerations
- **Visual Regression:** Test header at different screen sizes
- **Responsive Testing:** Test at key breakpoints (768px, 1024px)
- **Accessibility Testing:** Screen reader, keyboard navigation, color contrast
- **Performance Testing:** Lighthouse scores, Core Web Vitals
- **Cross-browser Testing:** Test dropdown positioning, animations

### Security Considerations
- **XSS Prevention:** Sanitize user data in avatar/name display
- **CSRF Protection:** For logout action
- **Session Management:** Secure session handling for user menu

---

**Last Updated:** 2025-01-01  
**Status:** 🟡 Ready for Review  
**Design Approach:** Modern enterprise header pattern (Stripe/GitHub/Linear/shadcn/ui inspired)
