# Task 0.5.1.40: Documentation Page Wireframe

**Status:** ✅ Complete  
**Route:** `/support/documentation`  
**File:** `task-0.5.1.40-documentation.png`  
**Priority:** 🟢 Global & Help Pages (Priority 7)

**Design Approach:** Professional government platform documentation page with user guides, documentation sections, search functionality, and API documentation links. Accessible, organized, and comprehensive.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ [MOH Logo]                    [About] [Support] [Status]   │
│                                        [Login] [Register]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Home > Support > Documentation                             │
│                                                             │
│  Documentation                                              │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Search documentation...                [🔍]         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────┐ ┌─────────────────────────────────────────┐ │
│  │Category  │ │ Documentation Sections                   │ │
│  │          │ │                                           │ │
│  │☐ All     │ │ ▼ Getting Started                        │ │
│  │☑ Getting │ │    • Platform Overview                   │ │
│  │  Started │ │    • Registration Guide                  │ │
│  │☐ User    │ │    • First Steps                         │ │
│  │  Guides  │ │                                           │ │
│  │☐         │ │ ▼ User Guides                            │ │
│  │  Workflow│ │    • Company Dashboard                   │ │
│  │  Guides  │ │    • Product Registration                │ │
│  │☐         │ │    • Submission Workflows                │ │
│  │  Compliance│ • Compliance Reporting                  │ │
│  │  Guides  │ │    • Export Control                      │ │
│  │☐ API     │ │                                           │ │
│  │  Docs    │ │ ▼ Workflow Guides                        │ │
│  │☐         │ │    • Registry Submission Process         │ │
│  │  Reference│ • AAMS Submission Guide                  │ │
│  │          │ │    • WSL Submission Guide                │ │
│  │          │ │    • MSQ Submission Guide                │ │
│  │          │ │                                           │ │
│  │          │ │ ▼ Compliance Guides                      │ │
│  │          │ │    • Compliance Scoring                  │ │
│  │          │ │    • Dispute Resolution                  │ │
│  │          │ │    • Enforcement Actions                 │ │
│  │          │ │                                           │ │
│  │          │ │ ▼ API Documentation                      │ │
│  │          │ │    • API Overview                        │ │
│  │          │ │    • Authentication                      │ │
│  │          │ │    • Endpoints Reference                 │ │
│  │          │ │    • Rate Limits                         │ │
│  │          │ │                                           │ │
│  │          │ │ [View Full API Docs →]                   │ │
│  │          │ │                                           │ │
│  └──────────┘ └─────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Quick Links                                        │   │
│  │                                                     │   │
│  │  • [Download PDF Guide]                             │   │
│  │  • [API Documentation]                              │   │
│  │  • [Video Tutorials]                                │   │
│  │  • [Release Notes]                                  │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Need more help? [Contact Support →]                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > Support > Documentation"
- **Title:** "Documentation"
  - **Typography:** 36px (desktop), 28px (mobile), font-weight: 700, color: #111827
- **Spacing:** 24px below header navigation

### Search Bar
- **Input:** Full-width search input with placeholder "Search documentation..."
- **Icon:** Search icon on right side
- **Functionality:** Real-time search as user types, filters documentation
- **Clear Button:** X button appears when text entered
- **Background:** White (#ffffff)
- **Border:** 1px solid #e5e7eb
- **Border Radius:** 6px
- **Padding:** 12px horizontal, 12px right (for icon)

### Filters Sidebar (Left)
- **Width:** 240px (desktop), hidden on mobile (drawer)
- **Background:** White (#ffffff)
- **Border Right:** 1px solid #e5e7eb
- **Padding:** 16px

**Category Filter:**
- **Checkboxes:** All, Getting Started, User Guides, Workflow Guides, Compliance Guides, API Docs, Reference
- **Default:** All selected
- **Click Action:** Filter documentation by category

### Documentation List (Right)
- **Width:** Full width minus filters sidebar
- **Background:** White (#ffffff)
- **Padding:** 24px

**Section Structure:**
- **Category Header:** Bold, 18px, color: #111827, expandable indicator (▼/▲)
- **Document Items:** List of documentation pages
  - **Title:** 16px, font-weight: 500, color: #111827, link color
  - **Click Action:** Navigate to documentation page or open PDF
- **Spacing:** 24px between sections, 16px between items

### Quick Links Section
- **Title:** "Quick Links"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Background:** #eff6ff (blue-50)
- **Border:** 1px solid #3b82f6 (blue-200)
- **Border Radius:** 8px
- **Padding:** 32px
- **Links:** Download PDF Guide, API Documentation, Video Tutorials, Release Notes

### Footer CTA
- **Text:** "Need more help? [Contact Support →]"
- **Link:** Navigate to `/support/contact`
- **Typography:** 16px, color: #4b5563
- **Link Style:** Blue (#2563eb), underlined

---

## Annotations

### Blue (Interactions)
- **Type in search** → Real-time filtering of documentation
- **Click category checkbox** → Filter documentation by category
- **Click category header** → Expand/collapse section
- **Click document item** → Navigate to documentation page or open PDF
- **Click "View Full API Docs →"** → Navigate to API documentation section
- **Click quick links** → Navigate to respective resources

### Orange (Validation)
- **Search results:** Show count of matching documents
- **No results:** Show empty state message

### Green (States)
- **Expanded state:** Section visible, chevron up (▲)
- **Collapsed state:** Section hidden, chevron down (▼)
- **Selected category:** Checkbox checked, documents filtered
- **Loading state:** Skeleton loaders for documentation

---

## Responsive Behavior

### Desktop (1024px+)
- Filters sidebar: Always visible, 240px width
- Documentation list: Full width minus sidebar
- Search: Full width

### Tablet (768px - 1023px)
- Filters sidebar: Hidden by default, toggle with button (drawer)
- Documentation list: Full width when filters hidden
- Search: Full width

### Mobile (<768px)
- Filters sidebar: Hidden, accessible via drawer/modal
- Documentation list: Full width
- Search: Full width
- Categories: Can be shown as tabs above documentation list

---

## Design System References

### Components Used
- **Search Input Component:** From UI Component Specifications
  - Variant: Default
  - Size: Medium (40px height)
  - Icon: Search icon on right
- **Checkbox Component:** From UI Component Specifications
  - Size: Medium
  - States: Unchecked, Checked
- **Accordion Component:** For expandable sections
  - Variant: Default
  - States: Expanded, Collapsed
- **Link Component:** For documentation links
  - Variant: Default
  - Color: #2563eb (blue-600)

### Colors
- **Background:** #ffffff (white)
- **Background Secondary:** #eff6ff (blue-50)
- **Border:** #e5e7eb (gray-200)
- **Text Primary:** #111827 (gray-900)
- **Text Secondary:** #4b5563 (gray-600)
- **Link Color:** #2563eb (blue-600)
- **Selected Category:** #eff6ff (blue-50)

### Typography
- **Page Title:** 36px (desktop), 28px (mobile), font-weight: 700
- **Category Header:** 18px, font-weight: 600
- **Document Title:** 16px, font-weight: 500
- **Body Text:** 16px, line-height: 1.6

### Spacing
- **Section Spacing:** 24px between sections
- **Item Spacing:** 16px between items
- **Padding:** 24px (desktop), 16px (mobile)

---

## Accessibility

### Keyboard Navigation
- **Tab:** Move through search, filters, documentation items
- **Enter/Space:** Expand/collapse section, navigate to document
- **Arrow keys:** Navigate between items (if applicable)

### Screen Reader Support
- **Section:** Announced as "Section: [name]"
- **Document:** Announced as "Document: [title]"
- **Expand/Collapse:** Announced as "Expand" or "Collapse"

### Focus Management
- **Visible Focus:** Clear focus indicator (2px outline, primary blue)
- **Focus Order:** Search → Filters → Documentation items

---

## Regulatory Compliance Notes

**Guidance from Fatima (MOH Regulatory Requirements):**
- Documentation must align with regulatory requirements (Law No. 09-08)
- User guides should reference regulatory compliance requirements
- API documentation should include compliance endpoints

**Guidance from Dr. Samir (Business Process Validation):**
- Documentation should cover all workflow stages
- User guides should match user journey stages
- API documentation should be clear for technical integration

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/support/documentation`
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Law No. 09-08
- [Design System](../../../../02-architecture/frontend/design-system.md) - Colors, typography, spacing

---

**Last Updated:** 2025-01-15  
**Status:** ✅ Complete  
**Guidance:** Created with guidance from Fatima (MOH Regulatory Requirements) & Dr. Samir (Business Process Validation)

