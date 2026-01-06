# Task 0.5.1.16: Sidebar Navigation Wireframe

**Status:** 🟡 In Progress  
**Route:** Sidebar component (all dashboard pages)  
**File:** `task-0.5.1.16-sidebar-navigation.png`  
**Priority:** 🔴 Critical Foundation

**Design Approach:** Modern enterprise sidebar navigation pattern inspired by Stripe, GitHub, Linear, and shadcn/ui best practices. Professional, accessible, and optimized for regulatory compliance workflows.

---

## Wireframe Layout (Expanded State)

```
┌──────────────────┐
│                  │
│ Global           │
│ ├ 🏠 Dashboard   │
│ ├ 💬 Communications│
│ ├ 📜 History     │
│ ├ 🔔 Notifications│
│ └ 🔍 Audit       │
│                  │
│ RMM              │
│ ├ 📊 Overview    │
│ ├ 🏢 Companies   │
│ ├ 📦 Products    │
│ └ 🏷️ SKUs        │
│                  │
│ VCI              │
│ ├ 📊 Dashboard   │
│ ├ 📝 Submissions │
│ ├ ⚙️ Thresholds  │
│ ├ ⚠️ Breaches    │
│ └ 📈 Governance  │
│                  │
│ ECS              │
│ ├ 📊 Overview    │
│ ├ 📤 Export Req. │
│ └ ✅ Authorizations│
│                  │
│ CMC              │
│ ├ 📊 Overview    │
│ ├ 📊 Scores      │
│ ├ ⚖️ Disputes    │
│ └ 📄 Reports     │
│                  │
│ Enforcement      │
│ ├ 📊 Dashboard   │
│ ├ ⚖️ Actions     │
│ ├ ✅ Pending     │
│ └ 📄 Reports     │
│                  │
│ Help & Info      │
│ ├ ❓ Support     │
│ ├ 📚 FAQ         │
│ ├ 📖 Docs        │
│ └ 📞 Contact     │
│                  │
│ ┌──────────────┐ │
│ │  ◀ Collapse  │ │
│ └──────────────┘ │
└──────────────────┘
```

**Collapsed State:**

```
┌────┐
│ 🏠 │
│ 💬 │
│ 📜 │
│ 🔔 │
│ 🔍 │
│    │
│ 📊 │
│ 🏢 │
│ 📦 │
│ 🏷️ │
│    │
│ 📊 │
│ 📝 │
│ ⚙️ │
│ ⚠️ │
│ 📈 │
│    │
│ ◀  │
└────┘
```

---

## Component Specifications

### Sidebar Container
- **Width:** 256px (expanded), 64px (collapsed) - Industry standard (Stripe, GitHub pattern)
- **Background:** White (#ffffff) - Clean, professional appearance
- **Border Right:** 1px solid #e5e7eb (subtle separation)
- **Height:** Calc(100vh - 64px) (full height minus header)
- **Position:** Fixed left, below header
- **Overflow:** Scrollable if content exceeds height
  - **Scrollbar:** Custom styled, thin (8px), appears on hover
  - **Scrollbar Color:** #d1d5db (subtle, non-intrusive)
  - **Scrollbar Track:** Transparent
- **Transition:** Smooth width transition (300ms cubic-bezier(0.4, 0, 0.2, 1))
- **Z-index:** 100 (below header, above content)
- **Backdrop:** Optional subtle shadow on right edge for depth
- **Box Shadow:** Subtle shadow (1px 0 3px 0 rgba(0, 0, 0, 0.1)) on right edge

### Navigation Sections

**Section Header (Expanded Only):**
- **Text:** Section name (e.g., "Global", "RMM", "VCI", "Enforcement")
- **Typography:** 12px, font-weight: 600, uppercase, letter-spacing: 0.5px
- **Color:** #6b7280 (text-secondary)
- **Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)
- **Margin:** 16px top (2 × 8px) - First section: 8px top (1 × 8px)
- **Spacing:** 8px above section items (1 × 8px)
- **Visibility:** Hidden when sidebar collapsed
- **Transition:** Smooth fade-out when collapsing (200ms ease-in-out)

**Navigation Items:**
- **Height:** 40px (5 × 8px) - Touch target minimum
- **Padding:** 12px horizontal (1.5 × 8px) expanded, centered (collapsed)
- **Display:** Flex, align-items: center
- **Gap:** 12px (1.5 × 8px) between icon and label (expanded only)
- **Border Radius:** 6px (subtle rounding for modern feel)
- **Margin:** 4px vertical (0.5 × 8px) between items

**Icon:**
- **Size:** 20px × 20px (standard icon size)
- **Color:** #6b7280 (text-secondary) default, #3b82f6 (primary-500) active, #111827 (text-primary) hover
- **Position:** Left side (expanded), centered (collapsed)
- **Library:** Lucide React (via shadcn/ui)
- **Transition:** Smooth color change (150ms ease-in-out)

**Label (Expanded Only):**
- **Typography:** 14px, font-weight: 500 (default), 600 (active)
- **Color:** #111827 (text-primary) default and active (high contrast), #6b7280 (text-secondary) on hover
- **Truncate:** Yes (with ellipsis if too long)
- **Line Height:** 1.4 (comfortable reading)
- **Transition:** Smooth color change (150ms ease-in-out)

**Badge (Optional):**
- **Position:** Right side of label, 8px from edge
- **Size:** 18px × 18px (minimum) for count, 8px × 8px for dot
- **Background:** 
  - #ef4444 (error-500) for alerts/urgent items
  - #3b82f6 (primary-500) for informational counts
  - #f59e0b (warning-500) for warnings
- **Text Color:** White (#ffffff)
- **Typography:** 11px, font-weight: 600, centered
- **Border:** 2px solid white (ensures visibility on any background)
- **Border Radius:** 9px (pill shape for count), 50% (circle for dot)
- **Max Count:** Display "99+" if count exceeds 99
- **Animation:** Subtle pulse (2s infinite) for new items
- **Example:** Pending approvals count, unread notifications

### Active State
- **Background:** #eff6ff (primary-50) - Subtle blue tint
- **Left Border:** 3px solid #3b82f6 (primary-500) - Visual indicator (not 4px for modern look)
- **Text Color:** #111827 (text-primary) - High contrast (not blue, for better readability)
- **Font Weight:** 600 (bold)
- **Icon Color:** #3b82f6 (primary-500) - Matches border
- **Border Radius:** 6px (subtle rounding)
- **Transition:** Smooth background change (150ms ease-in-out)

### Hover State
- **Background:** #f9fafb (bg-secondary)
- **Transition:** Smooth background change (150ms)

### Collapse Toggle
- **Position:** Bottom of sidebar, fixed
- **Height:** 48px
- **Width:** Full width (expanded), 64px (collapsed)
- **Background:** Transparent
- **Border Top:** 1px solid #e5e7eb
- **Icon:** Chevron left (expanded), Chevron right (collapsed)
- **Hover:** Light background (#f9fafb)

---

## Navigation Structure

### Global Section (All Roles)
- **Dashboard** → `/dashboard`
- **Communications** → `/communications/inbox`
- **History** → `/history`
- **Notifications** → `/notifications`
- **Audit** → `/audit/logs` (MOH Tier 1 & 2 only)

### RMM Section (All Roles)
- **Overview** → `/rmm/overview`
- **Companies** → `/rmm/companies`
- **Products** → `/rmm/products`
- **SKUs** → `/rmm/skus`

### VCI Section (All Roles)
- **Dashboard** → `/vci/dashboard`
- **Submissions** → `/vci/submissions`
- **Thresholds** → `/vci/thresholds`
- **Breaches** → `/vci/breaches`
- **Governance** → `/vci/governance` (MOH Tier 1 & 2 only)

### ECS Section (Conditional)
- **Visibility:** Only if ECS module active OR historical data exists
- **Overview** → `/ecs/overview`
- **Export Requests** → `/ecs/export-requests`
- **Authorizations** → `/ecs/authorizations`

### CMC Section (Conditional)
- **Visibility:** Only if CMC module active OR historical data exists
- **Overview** → `/cmc/overview`
- **Scores** → `/cmc/scores`
- **Disputes** → `/cmc/disputes`
- **Reports** → `/cmc/reports`

### Enforcement Section (MOH Tier 1 & Tier 2 Only)
- **Visibility:** Always visible for MOH Tier 1 and Tier 2 (not a conditional module)
- **Dashboard** → `/enforcement` (enforcement dashboard with summary and metrics)
- **Actions** → `/enforcement/actions` (all enforcement actions, filterable, searchable)
- **Pending Approvals** → `/enforcement/pending-approvals` (actions requiring Tier 1 approval)
- **Reports** → `/enforcement/reports` (enforcement analytics and reporting)
- **Note:** Companies can view their own enforcement actions but cannot access this navigation section

### Help & Info Section (All Roles)
- **Support** → `/help/support`
- **FAQ** → `/help/faq`
- **Documentation** → `/help/docs`
- **Contact** → `/help/contact`
- **Status** → `/help/status` (optional)

---

## Annotations

### Blue (Interactions)
- **Click navigation item** → Navigate to route
- **Click collapse toggle** → Toggle sidebar expanded/collapsed
- **Hover navigation item** → Show hover state (light background)
- **Click badge** → Navigate to related page (if applicable)

### Green (States)
- **Expanded state:** Full width (256px), icons + labels visible
- **Collapsed state:** Narrow width (64px), icons only, labels hidden
- **Active item:** Highlighted background, colored left border, bold text
- **Hover item:** Light background change
- **Badge count:** Dynamic number (e.g., "3" pending approvals)

---

## Responsive Behavior

### Desktop (1024px+)
- **Default:** Expanded (256px)
- **User can collapse:** Via toggle button
- **All sections visible:** Based on role and module activation

### Tablet (768px - 1023px)
- **Default:** Collapsed (64px)
- **User can expand:** Via toggle button (may overlay content)
- **Touch targets:** Minimum 40px × 40px

### Mobile (<768px)
- **Default:** Hidden (drawer/modal)
- **Trigger:** Hamburger menu in header
- **Behavior:** Overlay drawer from left
  - **Width:** 280px (slightly wider than desktop for touch)
  - **Animation:** Slide-in from left (300ms ease-out)
  - **Backdrop:** Dark overlay (rgba(0, 0, 0, 0.5)) with backdrop blur
  - **Z-index:** 1050 (above header, below modals)
- **Close:** 
  - Click outside (backdrop)
  - Close button (X) in top-right
  - Swipe right gesture (optional enhancement)
  - Escape key
- **Touch Targets:** Minimum 40px × 40px for all items
- **Focus Management:** Trap focus within drawer when open

---

## Design System References

### Components Used
- **Sidebar Component:** Collapsible sidebar container
- **Navigation Item Component:** Icon + label, active/hover states
- **Badge Component:** Count indicators
- **Icon Component:** Navigation icons

### Colors
- **Sidebar Background:** #ffffff (white) or #f9fafb (bg-secondary)
- **Sidebar Border:** #e5e7eb (border-default)
- **Active Background:** #eff6ff (primary-50)
- **Active Border:** #3b82f6 (primary-500)
- **Active Text:** #3b82f6 (primary-500)
- **Hover Background:** #f9fafb (bg-secondary)
- **Default Text:** #111827 (text-primary)
- **Default Icon:** #6b7280 (text-tertiary)
- **Section Header:** #6b7280 (text-tertiary)

### Spacing
- **Sidebar Width Expanded:** 256px
- **Sidebar Width Collapsed:** 64px
- **Item Height:** 40px
- **Item Padding:** 12px horizontal
- **Section Spacing:** 16px between sections
- **Icon Size:** 20px × 20px
- **Icon-Label Gap:** 12px

---

## Related Documents

- [Navigation & Layout Patterns](../../../../02-architecture/frontend/navigation-layout-patterns.md) - Complete sidebar specifications
- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - All route paths
- [Role-Based UI Patterns](../../../../02-architecture/frontend/role-based-ui-patterns.md) - Role-specific navigation visibility

---

## Industry Best Practices Implementation

### Performance Optimizations
- **Lazy Loading:** Navigation items load on demand (if needed)
- **Virtual Scrolling:** For extremely long navigation lists (if needed, rare)
- **CSS Containment:** Use `contain: layout style paint` for sidebar
- **Will-Change:** Hint browser about sidebar transitions (`will-change: width`)
- **Debounced Resize:** Debounce window resize handlers (150ms)
- **State Persistence:** Save expanded/collapsed state to localStorage

### Modern CSS Features
- **CSS Grid/Flexbox:** Use flexbox for navigation layout (flexible, responsive)
- **CSS Custom Properties:** Use design system tokens for colors/spacing
- **Backdrop Filter:** Subtle blur effects for mobile overlay (if supported, graceful degradation)
- **CSS Transitions:** Smooth animations for all state changes
- **Container Queries:** Consider for component-level responsive design (future enhancement)

### State Management
- **Sidebar State:** Persist expanded/collapsed state in localStorage
- **Active Route:** Highlight based on current route (Next.js router)
- **Module Indicator:** Show based on route path matching
- **Badge Counts:** Real-time updates via WebSocket or polling (for pending approvals, etc.)

### Error Handling
- **Loading States:** Skeleton loaders for navigation items while loading
- **Error Boundaries:** Graceful degradation if navigation fails
- **Fallback:** Default navigation structure if data fails to load
- **Offline Support:** Cache navigation structure for offline access

### Browser Support
- **Modern Browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Progressive Enhancement:** Core functionality works without JS (basic navigation)
- **Polyfills:** For older browsers if needed (Intersection Observer, etc.)

### Testing Considerations
- **Visual Regression:** Test sidebar expand/collapse states
- **Responsive Testing:** Test at key breakpoints (768px, 1024px, 1920px)
- **Accessibility Testing:** Screen reader, keyboard navigation, color contrast
- **Performance Testing:** Lighthouse scores, Core Web Vitals
- **Cross-browser Testing:** Test transitions, scrollbar styling, tooltips

### Mobile Considerations
- **Touch Targets:** Minimum 40px × 40px for all items
- **Gesture Support:** Swipe right to close (optional enhancement)
- **Drawer Animation:** Smooth slide-in/out (300ms)
- **Backdrop:** Dark overlay with backdrop blur for focus
- **Focus Management:** Trap focus within sidebar when open on mobile

---

**Last Updated:** 2025-01-01  
**Status:** 🟡 Ready for Review  
**Design Approach:** Modern enterprise sidebar navigation pattern (Stripe/GitHub/Linear/shadcn/ui inspired)
