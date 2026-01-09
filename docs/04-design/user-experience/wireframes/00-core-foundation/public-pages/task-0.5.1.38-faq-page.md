# Task 0.5.1.38: FAQ Page Wireframe

**Status:** ✅ Complete  
**Route:** `/support/faq`  
**File:** `task-0.5.1.38-faq-page.png`  
**Priority:** 🟢 Global & Help Pages (Priority 7)

**Design Approach:** Professional government platform FAQ page with searchable questions, categories, expandable answers, and search functionality. Accessible, organized, and user-friendly.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ [MOH Logo]                    [About] [Support] [Status]   │
│                                        [Login] [Register]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Home > Support > FAQ                                       │
│                                                             │
│  Frequently Asked Questions                                 │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Search FAQ...                           [🔍]        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────┐ ┌─────────────────────────────────────────┐ │
│  │Category  │ │ FAQ Questions                            │ │
│  │          │ │                                           │ │
│  │☐ All     │ │ ▼ Getting Started                        │ │
│  │☑ Getting │ │    What is the PM platform?             │ │
│  │  Started │ │    The PM platform is a regulatory       │ │
│  │☐ Account │ │    governance system that supports...   │ │
│  │  Mgmt    │ │                                           │ │
│  │☐         │ │    How do I register?                    │ │
│  │  Submissions│ To register, click "Register" on the   │ │
│  │☐         │ │    homepage and fill out the company... │ │
│  │  Compliance│                                           │ │
│  │☐ Export  │ │ ▼ Account Management                    │ │
│  │  Control │ │    How do I reset my password?          │ │
│  │☐ General │ │    Click "Forgot Password" on the login │ │
│  │          │ │    page and follow the instructions...  │ │
│  │          │ │                                           │ │
│  │          │ │    How do I update my company info?     │ │
│  │          │ │    Navigate to your company profile...  │ │
│  │          │ │                                           │ │
│  │          │ │ ▲ Submissions                            │ │
│  │          │ │    How do I submit a product?           │ │
│  │          │ │    To submit a product for registration...│ │
│  │          │ │                                           │ │
│  │          │ │ [Load More]                              │ │
│  └──────────┘ └─────────────────────────────────────────┘ │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Still have questions? [Contact Support →]                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > Support > FAQ"
- **Title:** "Frequently Asked Questions"
  - **Typography:** 36px (desktop), 28px (mobile), font-weight: 700, color: #111827
- **Spacing:** 24px below header navigation

### Search Bar
- **Input:** Full-width search input with placeholder "Search FAQ..."
- **Icon:** Search icon on right side
- **Functionality:** Real-time search as user types, filters questions
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
- **Checkboxes:** All, Getting Started, Account Management, Submissions, Compliance, Export Control, General
- **Default:** All selected
- **Click Action:** Filter questions by category

### FAQ List (Right)
- **Width:** Full width minus filters sidebar
- **Background:** White (#ffffff)
- **Padding:** 24px

**FAQ Item:**
- **Category Header:** Bold, 18px, color: #111827, expandable indicator (▼/▲)
- **Question:** 16px, font-weight: 500, color: #111827
- **Answer:** 14px, color: #4b5563, line-height: 1.6, expandable content
- **Spacing:** 24px between items
- **Expandable:** Click question to expand/collapse answer
- **Icon:** Chevron down (▼) when collapsed, chevron up (▲) when expanded

### Empty State
- **Message:** "No questions found matching your search."
- **Icon:** Search icon
- **Action:** "Clear filters" or "View all questions"

### Footer CTA
- **Text:** "Still have questions? [Contact Support →]"
- **Link:** Navigate to `/support/contact`
- **Typography:** 16px, color: #4b5563
- **Link Style:** Blue (#2563eb), underlined

---

## Annotations

### Blue (Interactions)
- **Type in search** → Real-time filtering of questions
- **Click category checkbox** → Filter questions by category
- **Click question** → Expand/collapse answer
- **Click "Contact Support"** → Navigate to `/support/contact`
- **Click "Load More"** → Load additional questions (if paginated)

### Orange (Validation)
- **Search results:** Show count of matching questions
- **No results:** Show empty state message

### Green (States)
- **Expanded state:** Answer visible, chevron up (▲)
- **Collapsed state:** Answer hidden, chevron down (▼)
- **Selected category:** Checkbox checked, questions filtered
- **Loading state:** Skeleton loaders for questions

---

## Responsive Behavior

### Desktop (1024px+)
- Filters sidebar: Always visible, 240px width
- FAQ list: Full width minus sidebar
- Search: Full width

### Tablet (768px - 1023px)
- Filters sidebar: Hidden by default, toggle with button (drawer)
- FAQ list: Full width when filters hidden
- Search: Full width

### Mobile (<768px)
- Filters sidebar: Hidden, accessible via drawer/modal
- FAQ list: Full width
- Search: Full width
- Categories: Can be shown as tabs above FAQ list

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
- **Accordion Component:** For expandable questions/answers
  - Variant: Default
  - States: Expanded, Collapsed

### Colors
- **Background:** #ffffff (white)
- **Border:** #e5e7eb (gray-200)
- **Text Primary:** #111827 (gray-900)
- **Text Secondary:** #4b5563 (gray-600)
- **Link Color:** #2563eb (blue-600)
- **Selected Category:** #eff6ff (blue-50)

### Typography
- **Page Title:** 36px (desktop), 28px (mobile), font-weight: 700
- **Category Header:** 18px, font-weight: 600
- **Question:** 16px, font-weight: 500
- **Answer:** 14px, line-height: 1.6

### Spacing
- **Item Spacing:** 24px between FAQ items
- **Section Spacing:** 32px between sections
- **Padding:** 24px (desktop), 16px (mobile)

---

## Accessibility

### Keyboard Navigation
- **Tab:** Move through search, filters, questions
- **Enter/Space:** Expand/collapse question
- **Arrow keys:** Navigate between questions (if applicable)

### Screen Reader Support
- **Question:** Announced as "Question: [text]"
- **Answer:** Announced when expanded: "Answer: [text]"
- **Category:** Announced as "Category: [name]"
- **Expand/Collapse:** Announced as "Expand" or "Collapse"

### Focus Management
- **Visible Focus:** Clear focus indicator (2px outline, primary blue)
- **Focus Order:** Search → Filters → Questions

---

## Regulatory Compliance Notes

**Guidance from Fatima (MOH Regulatory Requirements):**
- FAQ content must align with regulatory requirements
- Categories should reflect regulatory modules (RMM, VCI, ECS, CMC)
- Answers should reference official documentation when applicable

**Guidance from Dr. Samir (Business Process Validation):**
- FAQ should address common user workflow questions
- Categories should match user journey stages (Getting Started, Account Management, etc.)
- Search functionality should help users find answers quickly

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/support/faq`
- [Design System](../../../../02-architecture/frontend/design-system.md) - Colors, typography, spacing

---

**Last Updated:** 2025-01-15  
**Status:** ✅ Complete  
**Guidance:** Created with guidance from Fatima (MOH Regulatory Requirements) & Dr. Samir (Business Process Validation)

