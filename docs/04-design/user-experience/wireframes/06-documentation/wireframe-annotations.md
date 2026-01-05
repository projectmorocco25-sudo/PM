# Wireframe Annotations

**Purpose:** This document contains detailed annotations for all wireframes, including interactions, state transitions, validation rules, and responsive breakpoints.

**Last Updated:** 2025-12-31  
**Status:** Template ready - annotations pending wireframe completion  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)

## Overview

This document provides comprehensive annotations for all wireframes created during Phase 0.5. Annotations capture:
- User interactions and behaviors
- State transitions and workflows
- Validation rules and error handling
- Responsive breakpoints and mobile considerations
- Role-based variations
- Accessibility requirements

## Annotation Format

Each wireframe annotation follows this structure:

```markdown
## [Wireframe Name] (Task ID)

**File:** `path/to/wireframe.ext`
**Route:** `/route/path`
**Roles:** Company User, MOH Tier 1, etc.

### Interactions
- [Interaction description]

### State Transitions
- [State transition description]

### Validation Rules
- [Validation rule description]

### Responsive Breakpoints
- Desktop (>1024px): [Description]
- Tablet (768px-1024px): [Description]
- Mobile (<768px): [Description]

### Role-Based Variations
- Company User: [Variation]
- MOH Tier 1: [Variation]

### Accessibility Notes
- [Accessibility considerations]
```

## Core Foundation Annotations

### Public Homepage (Task 0.5.1.1)

**Status:** ⚪ Pending wireframe creation

**Planned Annotations:**
- Interactions: CTA buttons, navigation menu, scroll behavior
- Responsive: Mobile menu, hero section scaling
- Accessibility: Skip navigation link, ARIA landmarks

### Login Page (Task 0.5.1.11)

**Status:** ⚪ Pending wireframe creation

**Planned Annotations:**
- Interactions: Form submission, validation on blur, forgot password link
- Validation: Email format, password requirements, error messages
- State: Loading state during authentication
- Accessibility: Form labels, error announcements, focus management

### Dashboard Layout (Task 0.5.1.14)

**Status:** ⚪ Pending wireframe creation

**Planned Annotations:**
- Interactions: Sidebar collapse, header menu, notification badge
- Responsive: Hamburger menu on tablet, bottom navigation on mobile
- State: Active navigation item highlighting
- Accessibility: Keyboard navigation, skip links, ARIA labels

## RMM Module Annotations

### Companies List Page (Task 0.5.2.2)

**Status:** ⚪ Pending wireframe creation

**Planned Annotations:**
- Interactions: Table sorting, filtering, pagination, row selection
- State: Loading state, empty state, error state
- Responsive: Horizontal scroll on mobile, card view option
- Role-Based: Action buttons vary by role (create for companies, approve for MOH)

### Company Detail Page (Task 0.5.2.3)

**Status:** ⚪ Pending wireframe creation

**Planned Annotations:**
- Interactions: Tab navigation, edit button, action buttons
- State: Edit mode, view mode, loading state
- Tabs: Overview, Products, History (lazy loading for History tab)
- Workflow: Submit for approval workflow

### SKU Create/Edit Form (Task 0.5.2.10)

**Status:** ⚪ Pending wireframe creation

**Planned Annotations:**
- Interactions: Draft auto-save, form validation, pharmaceutical attribute inputs
- Validation: Required fields, dosage form dropdown, unit_of_measure validation
- State: Auto-save indicator, validation errors, success state
- Pharmaceutical Attributes:
  - dosage_strength: Text input with examples (e.g., "500mg", "10mg/ml")
  - dosage_form: Dropdown with standard forms (Tablet, Capsule, Syrup, etc.)
  - pack_size: Text input (e.g., "30 tablets", "100ml")
  - unit_of_measure: Dropdown with standard units (tablets, ml, etc.)

## VCI Module Annotations

### AAMS Submission Form (Task 0.5.3.2)

**Status:** ⚪ Pending wireframe creation

**Planned Annotations:**
- Interactions: SKU selector (autocomplete/dropdown), quantity input, add/remove rows
- Submission Structure: Array of `{sku_id, quantity}` objects (NOT monthly breakdown)
- Validation: Year selection, at least one SKU required, quantity must be positive
- SKU Display: Full description shown (name, dosage, form, pack size)
- Deadline: January 31 indicator with countdown if approaching

### WSL Submission Form (Task 0.5.3.12)

**Status:** ⚪ Pending wireframe creation

**Planned Annotations:**
- Interactions: Bulk entry table, all SKUs pre-populated, quantity input only
- Submission Structure: Array of `{sku_id, quantity, breach_reason?, replenishment_date?}` objects
- Validation: All SKUs required, Friday 5 PM deadline, deadline indicator
- Breach Indicators: Visual indicators when stock < threshold
- Responsive: Horizontal scroll on mobile, spreadsheet-like interface

### Breach Analysis Interface (Task 0.5.3.16)

**Status:** ⚪ Pending wireframe creation

**Planned Annotations:**
- Interactions: Action suggestions dropdown, comments input, batch selection
- State: Single breach analysis, batch analysis mode
- Workflow: Tier 2 analyzes → Tier 1 approves/rejects
- Batch: Select multiple breaches, apply batch actions

## ECS Module Annotations

### Export Request Form (Task 0.5.4.2)

**Status:** ⚪ Pending wireframe creation

**Planned Annotations:**
- Interactions: SKU selection, destination input, timeline picker, file upload
- File Upload: Drag-drop, progress indicator, validation (type, size)
- Validation: SKU required, destination required, timeline valid dates
- Threshold Display: Current stock vs VCI threshold vs ECS threshold (visual comparison)

### Export Authorization Detail (Task 0.5.4.6)

**Status:** ⚪ Pending wireframe creation

**Planned Annotations:**
- Interactions: Extension request, completion reporting
- Validity: 90-day countdown timer, expiration warnings (30, 15, 7 days)
- State: Active, expiring soon, expired
- Threshold: ECS threshold active indicator, 3-month reversion tracking

## CMC Module Annotations

### Compliance Score Detail (Task 0.5.5.2)

**Status:** ⚪ Pending wireframe creation

**Planned Annotations:**
- Interactions: Component breakdown expand/collapse, dispute button
- Visibility Rules:
  - Companies: See total score + category tips (formulas hidden)
  - MOH Tier 1: See full breakdown, formulas, weights
  - MOH Tier 2: See oversight view
- Components: 7 score components displayed with individual scores
- Dispute: 30-day window indicator

### Leaderboard (Task 0.5.5.3)

**Status:** ⚪ Pending wireframe creation

**Planned Annotations:**
- Interactions: Sorting, filtering, pagination
- Visibility Rules:
  - Companies: Anonymized (percentile/rank band only)
  - MOH Tier 1: Full leaderboard with company names
  - MOH Tier 2: Oversight view (anonymized or full based on permission)
- Display: Score, rank, percentile bands for companies

## Audit & Historical Annotations

### Audit Logs List (Task 0.5.6.1)

**Status:** ⚪ Pending wireframe creation

**Planned Annotations:**
- Interactions: Date range filter, table/user/action filters, search, virtual scrolling
- Performance: Virtual scrolling required (potentially thousands of entries)
- Filters: Date range, table name, user, action type
- Access: MOH Tier 1/2 and Auditors only, companies see own company's logs only
- Pagination: Infinite scroll or pagination for large datasets

## Common Patterns

### Loading States
- Skeleton screens for initial load
- Spinner for actions
- Progress bar for file uploads

### Error States
- Form-level errors displayed at top
- Field-level errors displayed inline
- Toast notifications for API errors
- Retry button for network errors

### Empty States
- First-time experience guidance
- No results message with clear action
- Filtered out indication

### Success States
- Toast notifications for actions
- Success messages on forms
- Visual confirmation (checkmarks)

## Responsive Breakpoints

### Desktop (>1024px)
- Full sidebar navigation
- Multi-column layouts
- Hover states for interactive elements

### Tablet (768px-1024px)
- Collapsible sidebar (hamburger menu)
- Stacked layouts where appropriate
- Touch-optimized targets

### Mobile (<768px)
- Bottom navigation
- Full-width forms
- Horizontal scroll for tables
- Card views instead of tables where appropriate

## Accessibility Requirements

- WCAG 2.1 AA compliance minimum
- Keyboard navigation for all interactive elements
- Screen reader announcements for state changes
- Color contrast meets AA standards
- Focus indicators visible
- ARIA labels for icon-only buttons
- Skip navigation links

## Related Documents

- [Wireframe Index](wireframe-index.md) - Complete wireframe list
- [Component Mapping](wireframe-to-component-mapping.md) - UI component mappings
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Component details
- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md) - Form patterns

---

**Next Steps:** Add annotations as wireframes are created and reviewed  
**Last Updated:** 2025-12-31

