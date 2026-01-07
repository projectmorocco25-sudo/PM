# Task 0.5.1.16: Sidebar Navigation Wireframe

**Status:** 🟡 In Progress  
**Route:** Sidebar component (all dashboard pages)  
**File:** `task-0.5.1.16-sidebar-navigation.png`  
**Priority:** 🔴 Critical Foundation

**Design Approach:** Modern enterprise sidebar navigation pattern inspired by Stripe, GitHub, Linear, and shadcn/ui best practices. Professional, accessible, and optimized for regulatory compliance workflows.

---

## Wireframe Layout (Expanded State)

```
┌──────────────────────────────────┐
│                                  │
│ Global                           │
│ ├ 🏠 Dashboard                   │
│ ├ 💬 Communications              │
│ ├ 📜 Regulatory Activity History                     │
│ ├ 🔔 Notifications               │
│ └ 🔍 Audit                       │
│                                  │
│ Registry Management              │
│ (RMM)                            │
│ ├ 📊 Overview                    │
│ ├ 🏢 Companies                   │
│ ├ 📦 Products                    │
│ └ 🏷️ SKUs                        │
│                                  │
│ Value Chain Intelligence         │
│ (VCI)                            │
│ ├ 📊 Dashboard                   │
│ ├ 📝 Submissions                 │
│ ├ ⚙️ Thresholds                  │
│ ├ ⚠️ Compliance Violations       │
│ └ 📈 Governance                  │
│                                  │
│ Export Control System            │
│ (ECS)                            │
│ ├ 📊 Overview                    │
│ ├ 📤 Export Authorization Requests             │
│ └ ✅ Export Authorizations              │
│                                  │
│ Compliance Monitoring Center     │
│ (CMC)                            │
│ ├ 📊 Overview                    │
│ ├ 📊 Regulatory Compliance Ratings                      │
│ ├ ⚖️ Compliance Disputes          │
│ └ 📄 Compliance Monitoring Reports                     │
│                                  │
│ Enforcement                      │
│ ├ 📊 Dashboard                   │
│ ├ ⚖️ Actions                     │
│ ├ ✅ Pending Regulatory Approvals           │
│ └ 📄 Enforcement Activity Reports                     │
│                                  │
│ Help & Info                      │
│ ├ ❓ Support Center              │
│ ├ 📚 FAQ                         │
│ ├ 📖 Documentation               │
│ └ 📞 Contact Support             │
│                                  │
│ ┌──────────────────────────────┐ │
│ │  ◀ Collapse                  │ │
│ └──────────────────────────────┘ │
└──────────────────────────────────┘
```

**Collapsed State (with Tooltips):**

```
┌────┐
│ 🏠 │ ← Tooltip: "Dashboard"
│ 💬 │ ← Tooltip: "Communications"
│ 📜 │ ← Tooltip: "Regulatory Activity History"
│ 🔔 │ ← Tooltip: "Notifications"
│ 🔍 │ ← Tooltip: "Audit"
│    │
│ 📊 │ ← Tooltip: "Registry Management (RMM)"
│ 🏢 │
│ 📦 │
│ 🏷️ │
│    │
│ 📊 │ ← Tooltip: "Value Chain Intelligence (VCI)"
│ 📝 │
│ ⚙️ │
│ ⚠️ │
│ 📈 │
│    │
│ 📊 │ ← Tooltip: "Export Control System (ECS)"
│ 📤 │
│ ✅ │
│    │
│ 📊 │ ← Tooltip: "Compliance Monitoring Center (CMC)"
│ 📊 │
│ ⚖️ │
│ 📄 │
│    │
│ 📊 │ ← Tooltip: "Enforcement"
│ ⚖️ │
│ ✅ │
│ 📄 │
│    │
│ ❓ │ ← Tooltip: "Help & Info"
│ 📚 │
│ 📖 │
│ 📞 │
│    │
│ ◀  │ ← Tooltip: "Expand Sidebar"
└────┘
```

---

## Component Specifications

### Sidebar Container
- **Width:** 280px (expanded), 64px (collapsed) - Increased to accommodate full names (Stripe, GitHub pattern)
- **Note:** Width increased from 256px to 280px to comfortably fit full module names with abbreviations
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
- **Line 1 (Full Name):** Full module/section name (e.g., "Registry Management", "Value Chain Intelligence")
  - **Typography:** 14px, font-weight: 600, normal case (not uppercase)
  - **Color:** #111827 (text-primary)
  - **Line Height:** 1.5
- **Line 2 (Abbreviation):** Abbreviation in parentheses (e.g., "(RMM)", "(VCI)")
  - **Typography:** 12px, font-weight: 400, normal case
  - **Color:** #6b7280 (text-secondary)
  - **Line Height:** 1.5
  - **Note:** Only shown for modules with abbreviations (RMM, VCI, ECS, CMC)
  - **Not shown for:** "Global", "Enforcement", "Help & Info" (no abbreviations)
- **Container Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)
- **Margin:** 16px top (2 × 8px) - First section: 8px top (1 × 8px)
- **Spacing:** 8px above section items (1 × 8px)
- **Visibility:** Hidden when sidebar collapsed
- **Transition:** Smooth fade-out when collapsing (200ms ease-in-out)

**Section Header (Collapsed State - Tooltip):**
- **Abbreviation Only:** Show abbreviation (e.g., "RMM", "VCI") or icon
- **Tooltip on Hover:** Display full name + abbreviation
  - **Format:** "Full Name (Abbreviation)" (e.g., "Value Chain Intelligence (VCI)")
  - **Delay:** 500ms (to avoid accidental triggers)
  - **Position:** Right side of sidebar
  - **Background:** Dark (#1f2937) with white text (#ffffff)
  - **Padding:** 8px 12px
  - **Border Radius:** 6px
  - **Shadow:** Subtle elevation
  - **Typography:** 12px, font-weight: 400

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
- **Example:** Pending regulatory approvals count, unread notifications

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
- **Regulatory Activity History** → `/history`
- **Notifications** → `/notifications`
- **Audit** → `/audit/logs` (MOH Tier 1 & 2 only)

### Registry Management (RMM) Section (All Roles)
- **Section Header:** "Registry Management" (Line 1) + "(RMM)" (Line 2)
- **Tooltip (Collapsed):** "Registry Management (RMM)"
- **Overview** → `/rmm/overview`
- **Companies** → `/rmm/companies`
- **Products** → `/rmm/products`
- **SKUs** → `/rmm/skus`

### Value Chain Intelligence (VCI) Section (All Roles)
- **Section Header:** "Value Chain Intelligence" (Line 1) + "(VCI)" (Line 2)
- **Tooltip (Collapsed):** "Value Chain Intelligence (VCI)"
- **Dashboard** → `/vci/dashboard`
- **Submissions** → `/vci/submissions`
- **Thresholds** → `/vci/thresholds`
- **Compliance Violations** → `/vci/breaches`
- **Governance** → `/vci/governance` (MOH Tier 1 & 2 only)

### Export Control System (ECS) Section (Conditional)
- **Section Header:** "Export Control System" (Line 1) + "(ECS)" (Line 2)
- **Tooltip (Collapsed):** "Export Control System (ECS)"
- **Visibility:** Only if ECS module active OR historical data exists
- **Overview** → `/ecs/overview`
- **Export Authorization Requests** → `/ecs/export-requests`
- **Export Authorizations** → `/ecs/authorizations`

### Compliance Monitoring Center (CMC) Section (Conditional)
- **Section Header:** "Compliance Monitoring Center" (Line 1) + "(CMC)" (Line 2)
- **Tooltip (Collapsed):** "Compliance Monitoring Center (CMC)"
- **Visibility:** Only if CMC module active OR historical data exists
- **Overview** → `/cmc/overview`
- **Regulatory Compliance Ratings** → `/cmc/scores`
- **Compliance Disputes** → `/cmc/disputes`
- **Compliance Monitoring Reports** → `/cmc/reports`

### Enforcement Section (MOH Tier 1 & Tier 2 Only)
- **Section Header:** "Enforcement" (no abbreviation needed)
- **Tooltip (Collapsed):** "Enforcement"
- **Visibility:** Always visible for MOH Tier 1 and Tier 2 (not a conditional module)
- **Dashboard** → `/enforcement` (enforcement dashboard with summary and metrics)
- **Actions** → `/enforcement/actions` (all enforcement actions, filterable, searchable)
- **Pending Regulatory Approvals** → `/enforcement/pending-approvals` (actions requiring Tier 1 approval)
- **Enforcement Activity Reports** → `/enforcement/reports` (enforcement analytics and reporting)
- **Note:** Companies can view their own enforcement actions but cannot access this navigation section

### Help & Info Section (All Roles)
- **Section Header:** "Help & Info" (no abbreviation needed)
- **Tooltip (Collapsed):** "Help & Info"
- **Support Center** → `/help/support`
- **FAQ** → `/help/faq`
- **Documentation** → `/help/docs`
- **Contact Support** → `/help/contact`
- **System Status** → `/help/status` (optional)

---

## Annotations

### Blue (Interactions)
- **Click navigation item** → Navigate to route
- **Click collapse toggle** → Toggle sidebar expanded/collapsed
- **Hover navigation item** → Show hover state (light background)
- **Hover section header (collapsed)** → Show tooltip with full name + abbreviation (500ms delay)
- **Click badge** → Navigate to related page (if applicable)

### Green (States)
- **Expanded state:** Full width (280px), icons + labels visible, full names with abbreviations for module sections
- **Collapsed state:** Narrow width (64px), icons only, labels hidden, tooltips show full names on hover
- **Active item:** Highlighted background, colored left border, bold text
- **Hover item:** Light background change
- **Badge count:** Dynamic number (e.g., "3" pending regulatory approvals)

---

## Responsive Behavior

### Desktop (1024px+)
- **Default:** Expanded (280px) - Accommodates full names with abbreviations
- **User can collapse:** Via toggle button
- **All sections visible:** Based on role and module activation
- **Tooltips:** Show on hover when collapsed (500ms delay)

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
- **Sidebar Width Expanded:** 280px (increased to accommodate full names)
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
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - Detailed compliance requirements

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
- **Badge Counts:** Real-time updates via WebSocket or polling (for pending regulatory approvals, etc.)

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

## Accessibility Enhancements

### Screen Reader Support
- **Full Names Always Announced:** Screen readers announce full module names (e.g., "Value Chain Intelligence section" not just "VCI section")
- **ARIA Labels:** Each section header has descriptive ARIA label: `aria-label="Registry Management section (RMM)"`
- **Tooltip Accessibility:** Tooltips are keyboard accessible and announced by screen readers
- **Abbreviation Expansion:** Full names in expanded state help users understand module purposes

### Keyboard Navigation
- **Section Headers:** Focusable (though not clickable) for screen reader users to understand structure
- **Tooltip on Focus:** When collapsed, focus on section icon shows tooltip with full name

---

## Implementation Notes

### Component Props
```tsx
<SidebarGroup 
  label="Value Chain Intelligence"  // Full name (required)
  labelAbbr="(VCI)"                  // Abbreviation in parentheses (optional)
  icon={BarChart}
  tooltip="Value Chain Intelligence (VCI)"  // Tooltip for collapsed state
>
  {/* Navigation items */}
</SidebarGroup>
```

### Conditional Display
- **Full Names:** Always shown in expanded state (two-line layout)
- **Abbreviations:** Only shown for modules with abbreviations (RMM, VCI, ECS, CMC)
- **No Abbreviation:** "Global", "Enforcement", "Help & Info" show single-line headers
- **Tooltips:** Shown on hover (500ms delay) when collapsed

### Responsive Considerations
- **280px Width:** Accommodates longest full name ("Compliance Monitoring Center") comfortably
- **Text Wrapping:** Full names may wrap to two lines if needed (maximum 2 lines)
- **Collapsed State:** Abbreviations visible as icon labels or tooltip-only

---

**Last Updated:** 2025-01-06  
**Status:** 🟢 Updated with Full Names + Abbreviations  
**Design Approach:** Modern enterprise sidebar navigation pattern with full names for accessibility and clarity (Stripe/GitHub/Linear/shadcn/ui inspired)
