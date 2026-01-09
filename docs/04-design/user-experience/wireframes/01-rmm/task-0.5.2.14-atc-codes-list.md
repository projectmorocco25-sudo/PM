# Task 0.5.2.14: ATC Codes List Page Wireframe

**Status:** ✅ Complete  
**Route:** `/rmm/atc-codes`  
**File:** `task-0.5.2.14-atc-codes-list.png`  
**Priority:** 🟡 Supporting VCI & RMM

**Design Approach:** Read-only reference list for ATC codes (MOH-controlled). Professional, accessible, and optimized for lookup and reference with search and filtering capabilities. Companies can view but not edit.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > RMM > ATC Codes                                       │
│                                                             │
│ ATC Codes (MOH-Controlled Reference)                        │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Search ATC codes...                    [🔍] [Filters ▼]││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌──────────┐ ┌───────────────────────────────────────────┐│
│ │ Filters  │ │ ATC Codes Table                            ││
│ │          │ │                                             ││
│ │ Level    │ │ Code    Description              Level     ││
│ │ ☐ All    │ │ ─────   ────────────────        ─────     ││
│ │ ☑ Level 1│ │ A       Alimentary tract and    Level 1   ││
│ │ ☐ Level 2│ │         metabolism                (Anatomical)││
│ │ ☐ Level 3│ │                                 ││
│ │ ☐ Level 4│ │ A01     Stomatological          Level 2    ││
│ │          │ │         preparations            (Therapeutic)││
│ │ Category │ │                                 ││
│ │ ☐ All    │ │ A01A    Stomatological          Level 3    ││
│ │ ☐ A      │ │         preparations            (Pharmacological)││
│ │ ☐ B      │ │                                 ││
│ │ ☐ C      │ │ A01AA   Antiseptics and         Level 4    ││
│ │ ☐ D      │ │         disinfectants           (Chemical) ││
│ │ ☐ ...    │ │                                 ││
│ │          │ │ A02     Drugs for acid          Level 2    ││
│ │          │ │         related disorders                  ││
│ │ [Clear]  │ │                                 ││
│ └──────────┘ │ [Load More]                                ││
│              └───────────────────────────────────────────┘│
│                                                             │
│ ℹ️ ATC codes are MOH-controlled and read-only.            ││
│    These codes are used for product classification.       ││
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > RMM > ATC Codes"
- **Title:** "ATC Codes (MOH-Controlled Reference)"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Info Badge:** "Read-Only" badge (gray)
- **Actions (Right-aligned):** None (read-only for all users)

### Search Bar
- **Input:** Full-width search input with placeholder "Search ATC codes..."
- **Icon:** Search icon on right side
- **Functionality:** Real-time search as user types (searches code and description)
- **Clear Button:** X button appears when text entered

### Filters Sidebar (Left)
- **Width:** 240px (desktop), hidden on mobile (drawer)
- **Background:** White (#ffffff)
- **Border Right:** 1px solid #e5e7eb
- **Padding:** 16px

**Filter Sections:**
- **Level Filter:**
  - Checkboxes: All, Level 1 (Anatomical), Level 2 (Therapeutic), Level 3 (Pharmacological), Level 4 (Chemical)
  - Default: All selected
- **Category Filter:**
  - Checkboxes: All, A, B, C, D, E, G, H, J, L, M, N, P, R, S, V
  - Default: All selected
  - Organized by ATC first letter

**Clear Filters Button:**
- **Position:** Bottom of filters sidebar
- **Style:** Secondary button
- **Action:** Resets all filters to default

### ATC Codes Table
- **Layout:** Full-width table with horizontal scroll on mobile
- **Columns:**
  1. **Code:** ATC code (e.g., "A01AA")
  2. **Description:** ATC code description
  3. **Level:** ATC hierarchy level (Level 1-4)
- **Row Features:**
  - **Hover:** Background color change (#f9fafb)
  - **Click:** Navigate to ATC code detail (if detail page exists) or show tooltip
  - **Level Badge:** Color-coded by level
- **Sorting:**
  - Sortable by code (alphabetical)
  - Sortable by description (alphabetical)
  - Sortable by level (1-4)

### Level Badges
- **Level 1 (Anatomical):** Blue (#3b82f6)
- **Level 2 (Therapeutic):** Green (#10b981)
- **Level 3 (Pharmacological):** Yellow (#fbbf24)
- **Level 4 (Chemical):** Purple (#a855f7)

### Information Banner
- **Display:** Info banner below table (collapsible)
- **Content:**
  - ATC codes are MOH-controlled
  - Read-only for all users
  - Used for product classification
- **Styling:** Light blue background (#eff6ff), info icon, dismissible

---

## Role-Based Access

### All Users (Companies and MOH)
- **View:** Can view all ATC codes
- **Read-Only:** Cannot edit, create, or delete ATC codes
- **Search:** Can search and filter
- **Export:** Can export list (if feature available)

### MOH Users
- **Same Access:** Same read-only access as companies
- **Note:** ATC codes are managed outside the system (MOH-controlled)

---

## State Variations

### Empty State (No Results)
- **Message:** "No ATC codes found"
- **Subtext:** "Try adjusting your search or filters"
- **Action Button:** "Clear Filters"

### Loading State
- **Skeleton Loaders:** Table rows with skeleton placeholders
- **Filter Loading:** Skeleton for filter dropdowns

### Search Results State
- **Result Count:** "X ATC codes found" above table
- **Highlight:** Search terms highlighted in results

---

## ATC Code Hierarchy

### Level 1: Anatomical Main Group
- **Format:** Single letter (A, B, C, etc.)
- **Example:** A = Alimentary tract and metabolism

### Level 2: Therapeutic Subgroup
- **Format:** Two digits (A01, A02, etc.)
- **Example:** A01 = Stomatological preparations

### Level 3: Pharmacological Subgroup
- **Format:** Letter (A01A, A01B, etc.)
- **Example:** A01A = Stomatological preparations

### Level 4: Chemical Subgroup
- **Format:** Two letters (A01AA, A01AB, etc.)
- **Example:** A01AA = Antiseptics and disinfectants

### Level 5: Chemical Substance
- **Format:** Two digits (A01AA01, A01AA02, etc.)
- **Note:** May not be displayed in list view

---

## Business Rules

1. **MOH-Controlled:** ATC codes are managed by MOH outside the system
2. **Read-Only:** All users have read-only access
3. **Reference Data:** Used for product classification in RMM
4. **Hierarchy:** Supports 4-5 level hierarchy
5. **No Editing:** Cannot create, edit, or delete ATC codes in the system

---

## Related Documents

- [RMM Overview Wireframe](../overview/task-0.5.2.1-rmm-overview.md)
- [Companies List Wireframe](../companies/task-0.5.2.2-companies-list.md) - Reference for list patterns
- [Data Dictionary](../../../02-architecture/database/data-dictionary.md) - ATC codes table structure
- [System Architecture](../../../02-architecture/system-architecture.md) - ATC codes ownership

---

**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)

