# Task 0.5.2.1: RMM Overview Page Wireframe

**Status:** ✅ Complete  
**Route:** `/rmm`  
**File:** `task-0.5.2.1-rmm-overview.png`  
**Priority:** 🟡 Supporting VCI & RMM

**Design Approach:** Module overview dashboard with summary statistics, quick links, recent activity, and key metrics. Professional, accessible, and optimized for quick navigation and module status overview.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > RMM                                                    │
│                                                             │
│ Registry Management Module (RMM)                            │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Module Summary                                           ││
│ │                                                          ││
│ │ RMM manages company registrations, products, SKUs, and  ││
│ │ registry submissions. This module is the foundation for ││
│ │ all other modules.                                       ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│ │ Companies    │ │ Products     │ │ SKUs         │        │
│ │              │ │              │ │              │        │
│ │ Total: 45    │ │ Total: 320   │ │ Total: 1,250 │        │
│ │ Active: 42   │ │ Active: 310  │ │ Active: 1,200│        │
│ │ Inactive: 3  │ │ Inactive: 10 │ │ Inactive: 50 │        │
│ │              │ │              │ │              │        │
│ │ [View All]   │ │ [View All]   │ │ [View All]   │        │
│ └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Quick Links                                              ││
│ │                                                          ││
│ │ [Companies] [Products] [SKUs] [Submissions]            ││
│ │ [ATC Codes] [Critical Medicines] [Enforcement]          ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Recent Activity                                          ││
│ │                                                          ││
│ │ • Company "ABC Pharma" registered (2 hours ago)         ││
│ │ • Product "Product X" created (5 hours ago)             ││
│ │ • Submission #123 approved (1 day ago)                 ││
│ │ • SKU "SKU001" updated (2 days ago)                     ││
│ │                                                          ││
│ │ [View Full History]                                     ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Registry Submissions Status                             ││
│ │                                                          ││
│ │ Pending: 12  |  Approved: 45  |  Rejected: 3           ││
│ │                                                          ││
│ │ [View All Submissions]                                  ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > RMM"
- **Title:** "Registry Management Module (RMM)"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Module Badge:** "Core Module" badge (blue)

### Module Summary Card
- **Content:** Brief description of RMM module purpose
- **Text:** Explains that RMM manages company registrations, products, SKUs, and submissions
- **Layout:** Card with descriptive text
- **Styling:** Light background (#f9fafb), padding 16px

### Statistics Cards (3-column grid)
- **Layout:** Responsive grid (3 columns desktop, 1 column mobile)
- **Cards:**
  1. **Companies Card:**
     - Total count
     - Active count
     - Inactive count
     - "View All" button
  2. **Products Card:**
     - Total count
     - Active count
     - Inactive count
     - "View All" button
  3. **SKUs Card:**
     - Total count
     - Active count
     - Inactive count
     - "View All" button
- **Styling:** White cards with border, hover effect

### Quick Links Section
- **Layout:** Horizontal button group
- **Links:**
  - Companies
  - Products
  - SKUs
  - Submissions
  - ATC Codes
  - Critical Medicines
  - Enforcement
- **Styling:** Button group with icons (optional)
- **Responsive:** Wraps on mobile

### Recent Activity Section
- **Layout:** Card with activity list
- **Content:** Chronological list of recent RMM activities
- **Each Entry Shows:**
  - Activity description
  - Timestamp (relative time)
- **Actions:**
  - "View Full History" link
- **Limit:** Show last 5-10 activities

### Registry Submissions Status Card
- **Layout:** Card with status summary
- **Metrics:**
  - Pending submissions count
  - Approved submissions count
  - Rejected submissions count
- **Actions:**
  - "View All Submissions" button
- **Styling:** Status badges with color coding

---

## Role-Based Access

### Company Users
- **View:** Own company statistics only
- **Statistics:**
  - Own company products/SKUs counts
  - Own submissions status
- **Quick Links:** Filtered to accessible pages
- **Recent Activity:** Own company activities only

### MOH Tier 1
- **View:** System-wide statistics
- **Statistics:**
  - All companies/products/SKUs counts
  - All submissions status
- **Quick Links:** All links available
- **Recent Activity:** System-wide activities
- **Additional:** Enforcement actions summary

### MOH Tier 2
- **View:** System-wide statistics (read-only)
- **Statistics:**
  - All companies/products/SKUs counts
  - All submissions status
- **Quick Links:** All links available (read-only where applicable)
- **Recent Activity:** System-wide activities

---

## State Variations

### Empty State (No Data)
- **Message:** "No RMM data available"
- **Subtext:** "Start by registering companies and products"
- **Action Button:** "Register Company" (if applicable)

### Loading State
- **Skeleton Loaders:** Cards with skeleton placeholders
- **Statistics:** Skeleton numbers
- **Activity:** Skeleton list items

### Error State
- **Message:** "Unable to load RMM overview"
- **Subtext:** Error message details
- **Action Button:** "Retry"

---

## Widgets and Metrics

### Company Statistics
- **Total Companies:** Count of all companies
- **Active Companies:** Count of active companies
- **Inactive Companies:** Count of inactive companies
- **Trend:** Optional trend indicator (up/down arrow)

### Product Statistics
- **Total Products:** Count of all products
- **Active Products:** Count of active products
- **Inactive Products:** Count of inactive products
- **Trend:** Optional trend indicator

### SKU Statistics
- **Total SKUs:** Count of all SKUs
- **Active SKUs:** Count of active SKUs
- **Inactive SKUs:** Count of inactive SKUs
- **Trend:** Optional trend indicator

### Submission Statistics
- **Pending:** Count of pending submissions
- **Approved:** Count of approved submissions
- **Rejected:** Count of rejected submissions
- **Total:** Total submission count

---

## Business Rules

1. **Module Status:** RMM is always active (core module)
2. **Statistics:** Real-time counts from database
3. **Activity Feed:** Shows last 5-10 activities
4. **Role-Based Filtering:** Statistics filtered by user role
5. **Quick Links:** Links to key RMM pages
6. **Navigation:** Overview page serves as RMM module landing page

---

## Related Documents

- [Companies List Wireframe](../companies/task-0.5.2.2-companies-list.md)
- [Products List Wireframe](../products/README.md)
- [Registry Submission List Wireframe](../workflow/task-0.5.2.11-registry-submission-list.md)
- [ATC Codes List Wireframe](../task-0.5.2.14-atc-codes-list.md)
- [Critical Medicines List Wireframe](../task-0.5.2.15-critical-medicines-list.md)
- [Routing Structure](../../../02-architecture/frontend/routing-structure.md) - RMM routes

---

**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)

