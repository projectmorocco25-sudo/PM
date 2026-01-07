# Priority 3: Consistency Guide - VCI Wireframes

**Purpose:** This document ensures Priority 3 VCI wireframes follow the same design patterns, structure, and specifications established in Priority 1 and Priority 2 wireframes.

**Last Updated:** 2025-01-01  
**Status:** ✅ Complete  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)

---

## Design Patterns Identified from Priority 1 & 2

### 1. Wireframe Document Structure

All wireframes must include these sections in order:

1. **Header Metadata:**
   - Status (🟡 In Progress, ✅ Complete, ⚪ Not Started)
   - Route (e.g., `/vci/aams`)
   - File (e.g., `task-0.5.3.1-aams-submissions-list.png`)
   - Priority (🔴 Core RMM Workflows, 🔴 Critical Foundation, etc.)
   - Design Approach (one-line description)

2. **Wireframe Layout:**
   - ASCII art representation
   - Clear visual hierarchy
   - Shows all key components

3. **Component Specifications:**
   - Page Header (breadcrumbs, title, actions)
   - Main content sections
   - Filters, tables, forms
   - Action buttons

4. **Role-Based Access:**
   - Company Users
   - MOH Tier 1
   - MOH Tier 2
   - Clear access differences

5. **State Variations:**
   - Empty states
   - Loading states
   - Error states
   - Different workflow states

6. **Responsive Design:**
   - Desktop (≥1024px)
   - Tablet (768px - 1023px)
   - Mobile (<768px)

7. **Interactions:**
   - Click actions
   - Hover states
   - Keyboard navigation

8. **Design System References:**
   - Components Used (shadcn/ui)
   - Design Inspiration References
   - Colors (From Design System)
   - Typography (From Design System)
   - Spacing (8px Grid System)
   - Transitions & Animations
   - Accessibility (WCAG 2.1 AA Compliance)

9. **Industry Best Practices Implementation:**
   - Performance Optimizations
   - Modern CSS Features
   - State Management
   - Error Handling
   - Browser Support
   - Testing Considerations
   - Security Considerations

10. **Related Documents:**
    - Routing Structure
    - Regulatory Framework (MUST INCLUDE)
    - Compliance Requirements (MUST INCLUDE)
    - Regulatory Policies (MUST INCLUDE)
    - UI Component Specifications
    - Role-Based UI Patterns
    - Workflow Architecture (if applicable)

11. **Related Wireframes:**
    - Links to related wireframes in the same module

---

## Common Design Patterns

### Breadcrumbs
- Format: `Home > Module > Section > [Detail]`
- Examples:
  - `Home > VCI > AAMS`
  - `Home > VCI > AAMS > [Submission ID]`
  - `Home > VCI > Compliance Violations`

### Page Headers
- **Title:** 24px, font-weight: 600, color: #111827
- **Actions:** Right-aligned, 16px spacing between buttons
- **Breadcrumbs:** Above title, 14px, color: #6b7280

### Status Badges
- **Color Coding:**
  - Pending/Submitted: Blue (#3b82f6)
  - Verified/Approved: Green (#10b981)
  - Rejected/Cancelled: Red (#ef4444)
  - Warning: Yellow (#fbbf24)
  - Executed: Green (#10b981)
  - Appealed: Orange (#f97316)

### Tables
- **Row Height:** 48px (6 × 8px)
- **Cell Padding:** 12px horizontal, 8px vertical
- **Hover State:** #f9fafb background
- **Sortable Columns:** Click header to sort
- **Pagination:** "Load More" button or page numbers

### Filters
- **Sidebar Width:** 240px (desktop)
- **Background:** White (#ffffff)
- **Border:** 1px solid #e5e7eb
- **Padding:** 16px
- **Clear Button:** Bottom of sidebar

### Forms
- **Input Padding:** 12px horizontal, 8px vertical
- **Label:** 14px, font-weight: 500, color: #6b7280
- **Required Indicator:** Asterisk (*) or "Required" label
- **Validation:** Real-time, clear error messages

### Workflow Status Indicators
- **Horizontal Timeline:** For multi-step workflows
- **Visual Indicators:**
  - Completed: Green checkmark (✓)
  - Current: Highlighted with badge
  - Pending: Gray, disabled
- **Vertical Timeline:** For approval history

### Cards/Sections
- **Background:** White (#ffffff)
- **Border:** 1px solid #e5e7eb
- **Border Radius:** 8px
- **Padding:** 16px or 24px
- **Shadow:** Subtle (if needed for elevation)

---

## VCI-Specific Patterns

### Submission Forms

#### AAMS Submission Form
- **Structure:** Monthly sales breakdown (Jan-Dec) with calculated AAMS
- **Table Columns:** SKU, Product Description (Name/Dosage/Form), Jan, Feb, ..., Dec, AAMS (calculated)
- **Monthly Fields:** Quantity of sales (number input, default blank, required)
- **AAMS Field:** Read-only, calculated from sum of 12 months
- **Validation:** All fields must be filled before submission
- **Draft Support:** Can save drafts with partial data
- **Import/Export:** CSV import/export functionality
- **SKU Selector:** Searchable dropdown, auto-fills product description

#### MSQ/WSL Submission Forms
- **Simplified Structure:** `{sku_id, quantity}` array (NOT monthly breakdown)
- **SKU Selector:** Shows full description (name, dosage, form, pack size)
- **Quantity Input:** Shows unit_of_measure from selected SKU
- **Bulk Entry:** Table format for multiple SKUs

### Submission Lists
- **Company View:** "My Submissions"
- **MOH View:** "All Submissions"
- **Filters:** Year (AAMS), Month (MSQ), Week (WSL), Status
- **Deadline Indicators:** Visual countdown or warning badges

### Submission Detail Pages
- **Workflow Status:** Timeline showing current step
- **Submission Data:** Key-value pairs in card format
- **Approval History:** Vertical timeline
- **Action Buttons:** Role-based (Approve, Reject, Request Info)

### Compliance Violations (Breaches)
- **Terminology:** Use "Compliance Violations" (not just "Breaches")
- **Priority Indicators:** Critical medicines, multiple SKUs, extended breaches
- **Status Badges:** Active, Resolved, Under Review
- **Analysis Interface:** Tier 2 can batch analyze
- **Approval Interface:** Tier 1 reviews suggestions

### Threshold Management
- **MOH Tier 1 Only:** Full access to modify thresholds
- **Local vs Global:** Selector for threshold scope
- **B Multiplier:** Input with advisory suggestions
- **Modification History:** Track all changes

---

## Regulatory Compliance Integration

### Must Include in All VCI Wireframes:

1. **Regulatory Framework References:**
   - Link to `regulatory-framework.md`
   - Link to `compliance-requirements.md`
   - Link to `regulatory-policies.md`

2. **Compliance Information:**
   - Data retention notices (7 years)
   - CNDP compliance (Law No. 09-08) where applicable
   - DMP regulation references for deadlines and requirements

3. **Deadline Indicators:**
   - AAMS: January 31 deadline, 15-day grace period
   - WSL: Friday 5 PM deadline, submission window
   - MSQ: 7-day grace period for corrections

4. **Threshold Visibility:**
   - Companies see calculated threshold after Tier 2 verification
   - Regulatory basis displayed with threshold information

---

## Color Palette (From Design System)

### Primary Colors
- **Primary:** #3b82f6 (blue-500)
- **Success:** #10b981 (green-500)
- **Warning:** #fbbf24 (yellow-500)
- **Error:** #ef4444 (red-500)

### Text Colors
- **Primary:** #111827 (text-primary)
- **Secondary:** #6b7280 (text-secondary)
- **Tertiary:** #9ca3af (text-tertiary)

### Background Colors
- **Default:** #ffffff (white)
- **Secondary:** #f9fafb (bg-secondary)
- **Tertiary:** #f3f4f6 (bg-tertiary)

### Border Colors
- **Default:** #e5e7eb (border-default)

---

## Typography (From Design System)

- **Page Title:** 30px, font-weight: 700 (h1)
- **Section Title:** 24px, font-weight: 600 (h2)
- **Card Title:** 18px, font-weight: 600 (h3)
- **Body Text:** 16px, font-weight: 400
- **Table Header:** 12px, font-weight: 600, uppercase
- **Table Cell:** 14px, font-weight: 400
- **Label:** 14px, font-weight: 500
- **Caption:** 12px, font-weight: 400

---

## Spacing (8px Grid System)

- **Page Padding:** 24px (3 × 8px)
- **Section Spacing:** 16px (2 × 8px)
- **Card Padding:** 16px or 24px
- **Button Padding:** 12px horizontal, 8px vertical
- **Input Padding:** 12px horizontal, 8px vertical
- **Table Cell Padding:** 12px horizontal, 8px vertical
- **Row Height:** 48px (6 × 8px) minimum for touch targets

---

## Component Library (shadcn/ui)

### Standard Components
- **Table:** `shadcn/ui table`
- **Button:** `shadcn/ui button`
- **Input:** `shadcn/ui input`
- **Select:** `shadcn/ui select`
- **Badge:** `shadcn/ui badge`
- **Card:** `shadcn/ui card`
- **Dialog/Modal:** `shadcn/ui dialog`
- **Tabs:** `shadcn/ui tabs`
- **Tooltip:** `shadcn/ui tooltip`
- **Skeleton:** `shadcn/ui skeleton`
- **Empty State:** Custom pattern following shadcn/ui style

### Icons
- **Library:** Lucide React (via shadcn/ui)
- **Size:** 20px × 20px standard
- **Color:** Inherit from parent or use semantic colors

---

## Accessibility Requirements (WCAG 2.1 AA)

- **Color Contrast:** Minimum 4.5:1 for text, 3:1 for UI components
- **Focus Indicators:** 2px solid outline, #3b82f6, 2px offset
- **Keyboard Navigation:** Full support (Tab, Enter, Arrow keys, Escape)
- **Screen Reader Support:** ARIA labels, roles, descriptions
- **Touch Targets:** Minimum 40px × 40px
- **Skip Links:** "Skip to main content" for keyboard users

---

## Design Inspiration References

- **Stripe Dashboard:** https://dashboard.stripe.com
- **GitHub:** https://github.com
- **Linear App:** https://linear.app
- **shadcn/ui Components:** https://ui.shadcn.com

---

## Checklist for Priority 3 Wireframes

Before marking a wireframe as complete, verify:

- [ ] Header metadata complete (Status, Route, File, Priority, Design Approach)
- [ ] Wireframe layout ASCII art included
- [ ] Component specifications detailed
- [ ] Role-based access clearly defined
- [ ] State variations documented
- [ ] Responsive design considerations included
- [ ] Interactions documented
- [ ] Design System References section complete
- [ ] Industry Best Practices section included
- [ ] Regulatory Framework references included (3 links)
- [ ] Related Documents section complete
- [ ] Related Wireframes section included
- [ ] Colors match design system
- [ ] Typography matches design system
- [ ] Spacing follows 8px grid
- [ ] Accessibility requirements documented
- [ ] VCI-specific patterns followed (simplified submission structure, deadline indicators, etc.)

---

**Next Steps:**
1. Use this guide when creating each Priority 3 wireframe
2. Reference Priority 1 and Priority 2 wireframes for examples
3. Ensure consistency across all 12 Priority 3 wireframes
4. Update this guide if new patterns emerge

