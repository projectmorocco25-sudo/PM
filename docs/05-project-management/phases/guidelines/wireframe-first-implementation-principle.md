# Wireframe-First Implementation Principle

**Purpose:** This document establishes wireframes as the PRIMARY design reference for all frontend implementation work in Phase 1.

**Status:** ✅ APPROVED  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Last Updated:** 2025-01-22

---

## Core Principle

**Wireframes are the PRIMARY design reference for all frontend implementation.**

Architecture documents, component specifications, and this implementation plan support wireframes, but **wireframes define the UI/UX**. If there is any conflict or ambiguity, the wireframe takes precedence.

---

## Why Wireframe-First?

### 1. Validated Design Decisions
- All 120 wireframes were created, reviewed, and approved by stakeholders
- Issues were identified and resolved during Phase 0.5
- Wireframes represent the agreed-upon user experience

### 2. Complete Specifications
- Wireframes include layout, interactions, states, and role-based variations
- Wireframe annotations document behavior, validation, and edge cases
- Component mapping links wireframe sections to UI components

### 3. Reduced Rework
- Following wireframes prevents design changes during implementation
- Clear specifications reduce ambiguity and questions
- Consistent implementation across the team

### 4. Stakeholder Alignment
- Wireframes were approved by MOH (Fatima), Business (Dr. Samir), and Technical (Emma, Oliver, Maya)
- Implementation matching wireframes ensures stakeholder satisfaction
- No surprises during development or UAT

---

## Implementation Workflow

### Before Starting ANY Frontend Task

1. **Locate the Wireframe**
   - Find the corresponding wireframe in `docs/04-design/user-experience/wireframes/`
   - Use the [Wireframe Index](../../04-design/user-experience/wireframes/06-documentation/wireframe-index.md) to find wireframes by route or task ID
   - If no wireframe exists, **STOP** and create it first

2. **Review Wireframe Specification**
   - Read the complete wireframe markdown file
   - Understand layout, components, interactions, states
   - Note role-based variations (Company, MOH Tier 1, MOH Tier 2)
   - Review responsive breakpoints

3. **Check Wireframe Annotations**
   - See `docs/04-design/user-experience/wireframes/06-documentation/wireframe-annotations.md`
   - Understand interactions (click, hover, keyboard, touch)
   - Review state transitions (loading, error, success, empty)
   - Check validation rules (client-side and server-side)
   - Note accessibility features (ARIA labels, keyboard navigation)

4. **Review Component Mapping**
   - See `docs/04-design/user-experience/wireframes/06-documentation/wireframe-to-component-mapping.md`
   - Identify which UI components to use
   - Check for reusable components
   - Note any custom component requirements

5. **Verify Design System Alignment**
   - Check `docs/02-architecture/frontend/design-system.md` for colors, typography, spacing
   - Verify component specifications in `docs/02-architecture/frontend/ui-component-specifications.md`
   - Ensure wireframe design matches design system

6. **Check Related Wireframes**
   - Review related pages in the same workflow
   - Check modal wireframes if modals are involved
   - Review state variations (loading, error, empty, success)

7. **Start Implementation**
   - Implement exactly as specified in the wireframe
   - If wireframe is unclear, consult Emma (UI/UX) before making assumptions
   - Document any deviations and get approval

---

## Wireframe Organization

All wireframes are stored in `docs/04-design/user-experience/wireframes/`:

### Core Foundation (`00-core-foundation/`)
- **Authentication:** Login, registration, password reset
- **Layout & Navigation:** Header, sidebar, dashboard layout
- **Dashboard:** Company, MOH Tier 1, MOH Tier 2 dashboards
- **Communications:** Inbox, conversation detail, compose, announcements
- **Global:** History, notifications, audit logs, system configuration
- **Public Pages:** Homepage, about, support, legal pages

### RMM Module (`01-rmm/`)
- **Companies:** List, detail, create/edit forms
- **Products:** List, detail, create/edit forms
- **SKUs:** List, detail, create/edit forms (with pharmaceutical attributes)
- **Enforcement:** Dashboard, actions list, detail, creation wizard, appeals
- **Workflow:** Registry submission list, detail, workflow states
- **MOH-Only:** ATC codes, critical medicines

### VCI Module (`02-vci/`)
- **AAMS:** Submissions list, form, detail, threshold management, reversions
- **MSQ:** Submissions list, form, detail, correction interface
- **WSL:** Submissions list, form, detail, breach indicators
- **Breaches:** List, detail, analysis interface, action approval
- **Analytics:** ATC treemap, products treemap, dosage/forms modal
- **Overview:** VCI overview, governance dashboard

### ECS Module (`03-ecs/`)
- **Export Requests:** List, form, detail, workflow actions
- **Authorizations:** List, detail, completion reporting
- **Replenishment:** Schedule tracking interface
- **Overview:** ECS overview

### CMC Module (`04-cmc/`)
- **Scores:** List, detail, leaderboard, review modals
- **Disputes:** List, detail, creation interface, review interface
- **Reports:** List, detail, review/approval interface
- **Overview:** CMC overview

### Historical Data (`05-audit-historical/`)
- **Historical Data:** Submission history, export history, compliance scores history, disputes history
- **Audit Logs:** List, detail, reports

### Modals (`07-modals/`)
- **Reusable Modals:** Confirmation, file upload, date range picker, user/company picker, export options, history preview, comparison, detail inspection, message attachment viewer, workflow status

---

## Wireframe Reference Format

When referencing wireframes in implementation tasks, use this format:

```
**Wireframe:** [Task 0.5.X.X - Page Name](../../04-design/user-experience/wireframes/[module]/[subdirectory]/task-0.5.X.X-[page-name].md)
```

**Example:**
```
**Wireframe:** [Task 0.5.1.18 - Company Dashboard](../../04-design/user-experience/wireframes/00-core-foundation/dashboard/task-0.5.1.18-company-dashboard.md)
```

---

## Wireframe Compliance Checklist

For every frontend implementation task, verify:

- [ ] Wireframe reviewed before starting implementation
- [ ] Layout matches wireframe (structure, spacing, positioning)
- [ ] Components match wireframe (buttons, inputs, tables, cards)
- [ ] Interactions match wireframe (click, hover, keyboard, touch)
- [ ] States implemented (loading, error, empty, success)
- [ ] Role-based variations implemented (Company, MOH Tier 1, MOH Tier 2)
- [ ] Responsive breakpoints match wireframe (mobile, tablet, desktop)
- [ ] Validation rules match wireframe annotations
- [ ] Accessibility features implemented (ARIA labels, keyboard navigation)
- [ ] Related wireframes reviewed (modals, state variations, workflow pages)

---

## Handling Wireframe Ambiguities

If a wireframe is unclear or missing information:

1. **Check Wireframe Annotations**
   - Annotations may clarify the requirement
   - See `docs/04-design/user-experience/wireframes/06-documentation/wireframe-annotations.md`

2. **Check Component Mapping**
   - Component mapping may specify component behavior
   - See `docs/04-design/user-experience/wireframes/06-documentation/wireframe-to-component-mapping.md`

3. **Check Related Documentation**
   - Design system (`docs/02-architecture/frontend/design-system.md`)
   - Component specifications (`docs/02-architecture/frontend/ui-component-specifications.md`)
   - Form patterns (`docs/02-architecture/frontend/form-design-patterns.md`)
   - State management patterns (`docs/02-architecture/frontend/state-management-ui-patterns.md`)

4. **Consult Emma (UI/UX)**
   - If still unclear, ask Emma for clarification
   - Document the clarification for future reference

5. **Document Deviations**
   - If implementation must deviate from wireframe, document why
   - Get approval from Emma before proceeding
   - Update wireframe if deviation is approved

---

## Wireframe Updates During Implementation

If implementation reveals wireframe issues:

1. **Document the Issue**
   - What's wrong with the wireframe?
   - Why does it need to change?
   - What's the proposed solution?

2. **Get Approval**
   - Consult Emma (UI/UX) for design approval
   - Consult Fatima (MOH) if regulatory impact
   - Consult Dr. Samir (Business) if process impact

3. **Update Wireframe**
   - Update the wireframe file
   - Update wireframe annotations if needed
   - Update component mapping if needed

4. **Continue Implementation**
   - Implement according to updated wireframe
   - Document the change in implementation notes

---

## Wireframe Priority Over Other Documentation

**Priority Order:**
1. **Wireframes** (PRIMARY - highest priority)
2. Wireframe annotations
3. Component mapping
4. Design system
5. Component specifications
6. Form patterns
7. State management patterns
8. Architecture documentation
9. This implementation plan

**If there's a conflict, wireframes win.**

---

## Examples

### Example 1: Implementing Company List Page

**Task:** Task 1.1.2.17 - Implement Companies list page

**Wireframe-First Process:**
1. ✅ Locate wireframe: `docs/04-design/user-experience/wireframes/01-rmm/companies/task-0.5.2.2-companies-list.md`
2. ✅ Review wireframe: Table view, filters, search, pagination, role-based actions
3. ✅ Check annotations: Sorting behavior, filter interactions, pagination logic
4. ✅ Check component mapping: DataTable component, SearchBar component, FilterDropdown component
5. ✅ Verify design system: Table styles, spacing, colors
6. ✅ Check related wireframes: Company detail page, Company create/edit form
7. ✅ Start implementation: Build exactly as wireframe specifies

### Example 2: Implementing AAMS Submission Form

**Task:** Task 1.1.3.13 - Implement AAMS submission create/edit form

**Wireframe-First Process:**
1. ✅ Locate wireframe: `docs/04-design/user-experience/wireframes/02-vci/aams/task-0.5.3.2-aams-submission-form.md`
2. ✅ Review wireframe: Year selection, monthly sales table (Jan-Dec columns), calculated AAMS, import/export CSV, validation
3. ✅ Check annotations: Validation rules, CSV import/export behavior, calculation display
4. ✅ Check component mapping: FormField, DataTable, FileUpload, DatePicker components
5. ✅ Verify design system: Form styles, table styles, button styles
6. ✅ Check related wireframes: AAMS submission detail, AAMS submissions list
7. ✅ Start implementation: Build exactly as wireframe specifies

---

## Integration with Phase 1 Implementation Plan

All frontend tasks in the Phase 1 Implementation Plan will:
- Reference the corresponding wireframe file
- Include wireframe compliance checklist
- Require wireframe review before starting
- Verify wireframe compliance in completion criteria

---

## Related Documents

- [Wireframe Index](../../04-design/user-experience/wireframes/06-documentation/wireframe-index.md) - Complete list of all wireframes
- [Wireframe Annotations](../../04-design/user-experience/wireframes/06-documentation/wireframe-annotations.md) - Detailed annotations and interactions
- [Wireframe-to-Component Mapping](../../04-design/user-experience/wireframes/06-documentation/wireframe-to-component-mapping.md) - Component mappings
- [Phase 0.5: UI/UX Wireframes](../../05-project-management/phases/phase-0-5-ui-ux-wireframes.md) - Wireframe creation process
- [Design System](../../02-architecture/frontend/design-system.md) - Design system specifications
- [UI Component Specifications](../../02-architecture/frontend/ui-component-specifications.md) - Component library specs

---

**Last Updated:** 2025-01-22  
**Status:** ✅ APPROVED - Ready for implementation

