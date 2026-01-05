# Wireframe to Component Mapping

**Purpose:** This document maps wireframe sections to UI components from `ui-component-specifications.md`, providing implementation guidance for Phase 1.1 development.

**Last Updated:** 2025-12-31  
**Status:** Template ready - mappings pending wireframe completion  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)

## Overview

This mapping document helps developers understand which UI components to use when implementing wireframes. Each wireframe section is mapped to:
- Base UI components (Button, Input, Select, etc.)
- Composite components (DataTable, FormField, etc.)
- Layout components (Sidebar, Header, Footer, etc.)
- Specialized components (Charts, Timelines, etc.)

## Mapping Format

```markdown
## [Wireframe Name] (Task ID)

### Component Mappings

| Wireframe Section | UI Component(s) | Reference |
|-------------------|-----------------|-----------|
| Header | Header, Logo, UserMenu | [Header Component](../../../../02-architecture/frontend/ui-component-specifications.md#header) |
| Form Fields | FormField, Input, Select | [Form Components](../../../../02-architecture/frontend/ui-component-specifications.md#form-components) |
```

## Core Foundation Mappings

### Public Homepage (Task 0.5.1.1)

**Status:** ⚪ Pending wireframe creation

**Planned Mappings:**
- Navigation: Header, NavigationMenu
- Hero Section: Heading, Button, Image
- CTA Sections: Card, Button
- Footer: Footer component

### Login Page (Task 0.5.1.11)

**Status:** ⚪ Pending wireframe creation

**Planned Mappings:**
- Form Container: Card
- Email Input: FormField + Input
- Password Input: FormField + Input (password type)
- Submit Button: Button (primary)
- Links: Link component
- Error Messages: Alert (error variant)
- Loading State: LoadingSpinner

### Dashboard Layout (Task 0.5.1.14)

**Status:** ⚪ Pending wireframe creation

**Planned Mappings:**
- Layout Container: DashboardLayout
- Header: Header component
- Sidebar: Sidebar, SidebarItem, SidebarGroup
- Main Content: MainContent
- Breadcrumbs: Breadcrumbs component
- Notification Badge: Badge (notification variant)

## RMM Module Mappings

### Companies List Page (Task 0.5.2.2)

**Status:** ⚪ Pending wireframe creation

**Planned Mappings:**
- Page Header: Heading, Button (create new)
- Search Bar: SearchBar component
- Filters: Select, DatePicker
- Table: DataTable component
- Pagination: Pagination component
- Empty State: EmptyState component
- Loading State: Skeleton component

### Company Detail Page (Task 0.5.2.3)

**Status:** ⚪ Pending wireframe creation

**Planned Mappings:**
- Page Header: Heading, Button group (edit, submit, etc.)
- Tabs: Tabs component (Overview, Products, History)
- Information Sections: Card, FieldGroup
- Action Buttons: Button (primary, secondary, danger variants)
- Workflow Status: StatusBadge, WorkflowStatusIndicator

### SKU Create/Edit Form (Task 0.5.2.10)

**Status:** ⚪ Pending wireframe creation

**Planned Mappings:**
- Form Container: Card
- Form Sections: FormGroup
- Text Inputs: FormField + Input (dosage_strength, pack_size)
- Dropdowns: FormField + Select (dosage_form, unit_of_measure)
- Validation Errors: FormError component
- Helper Text: FormHelperText component
- Submit Button: Button (primary)
- Auto-save Indicator: Badge or Toast

## VCI Module Mappings

### AAMS Submission Form (Task 0.5.3.2)

**Status:** ⚪ Pending wireframe creation

**Planned Mappings:**
- Year Selector: Select component
- SKU Selector: Autocomplete or Select with full SKU description
- Quantity Input: FormField + Input (number type)
- Data Entry Table: Table component (custom rows)
- Add/Remove Buttons: Button (icon variant)
- Deadline Indicator: Alert (warning variant) or Badge
- Submit Button: Button (primary)

### WSL Submission Form (Task 0.5.3.12)

**Status:** ⚪ Pending wireframe creation

**Planned Mappings:**
- Week Ending Date: DatePicker
- Bulk Entry Table: Table component (pre-populated with all SKUs)
- Quantity Inputs: Input (number type) for each row
- Breach Indicators: StatusBadge or visual indicator
- Optional Fields: FormField + Input/DatePicker (breach_reason, replenishment_date)
- Submit Button: Button (primary)

### Governance Dashboard (Task 0.5.3.18)

**Status:** ⚪ Pending wireframe creation

**Planned Mappings:**
- Widget Container: Grid layout
- Stock Sufficiency Chart: LineChart or BarChart component
- Breach Status Overview: Card with statistics
- Action Recommendations: Card with list
- Responsive Grid: Grid component (stacks on mobile)

## ECS Module Mappings

### Export Request Form (Task 0.5.4.2)

**Status:** ⚪ Pending wireframe creation

**Planned Mappings:**
- SKU Selection: MultiSelect or Autocomplete
- Destination Input: FormField + Input
- Timeline Picker: DatePicker (range)
- File Upload: FileUpload component (drag-drop, progress)
- Threshold Comparison: Card with visual comparison (charts)
- Submit Button: Button (primary)

### Export Authorization Detail (Task 0.5.4.6)

**Status:** ⚪ Pending wireframe creation

**Planned Mappings:**
- Validity Indicator: CountdownTimer component
- Expiration Warnings: Alert (warning variant)
- Threshold Status: StatusBadge
- Extension Request: Button + Modal
- Completion Reporting: Button (primary)

## CMC Module Mappings

### Compliance Score Detail (Task 0.5.5.2)

**Status:** ⚪ Pending wireframe creation

**Planned Mappings:**
- Score Visualization: Gauge or ProgressBar component
- Component Breakdown: ExpandableCard or Accordion
- Score Chart: BarChart or PieChart component
- Category Tips: Card or Alert (info variant)
- Dispute Button: Button (secondary)
- Score Override (MOH): Button + Modal

### Leaderboard (Task 0.5.5.3)

**Status:** ⚪ Pending wireframe creation

**Planned Mappings:**
- Table: DataTable component
- Score Column: Number formatting
- Rank Column: Number with ordinal suffix
- Percentile Band (Companies): Badge or text
- Company Name (MOH): Text (hidden for companies)
- Sorting: DataTable sorting
- Filters: Select, DatePicker

## Audit & Historical Mappings

### Audit Logs List (Task 0.5.6.1)

**Status:** ⚪ Pending wireframe creation

**Planned Mappings:**
- Date Range Filter: DateRangePicker component
- Filters: Select components (table, user, action)
- Search: SearchBar component
- Table: DataTable with virtual scrolling
- Pagination: Pagination or infinite scroll
- Export Button: Button (secondary) with dropdown

## Component Reference

All components referenced in this mapping are documented in:
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md)

Key component categories:
- **Base Components:** Button, Input, Select, Checkbox, Radio, Textarea, DatePicker
- **Form Components:** FormField, FormGroup, FormLabel, FormError, FormHelperText
- **Data Display:** Table, DataTable, Card, Badge, StatusBadge, Avatar
- **Feedback:** Alert, Toast, LoadingSpinner, Skeleton, ProgressBar
- **Navigation:** Breadcrumbs, Sidebar, SidebarItem, SidebarGroup, Header, Footer
- **Layout:** DashboardLayout, MainContent, Grid
- **Specialized:** Charts (LineChart, BarChart, PieChart), Timeline, CountdownTimer, FileUpload

## Implementation Notes

### Component Variants
- Buttons: Use appropriate variants (primary, secondary, danger, icon)
- Alerts: Use semantic variants (success, error, warning, info)
- Badges: Use status variants (pending, approved, rejected, etc.)

### Responsive Behavior
- Tables: Use horizontal scroll or card view on mobile
- Sidebar: Collapse to hamburger menu on tablet
- Grids: Stack on mobile devices

### State Management
- Loading: Use Skeleton for initial load, LoadingSpinner for actions
- Errors: Use Alert for form errors, Toast for API errors
- Success: Use Toast for successful actions

### Accessibility
- All interactive components must have ARIA labels
- Forms must have proper labels and error associations
- Tables must have proper headers and captions
- Keyboard navigation must be supported

## Related Documents

- [Wireframe Index](wireframe-index.md) - Complete wireframe list
- [Wireframe Annotations](wireframe-annotations.md) - Detailed annotations
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Component details
- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md) - Form implementation patterns

---

**Next Steps:** Complete mappings as wireframes are created and reviewed  
**Last Updated:** 2025-12-31

