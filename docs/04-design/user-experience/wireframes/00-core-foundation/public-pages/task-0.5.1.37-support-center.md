# Task 0.5.1.37: Support Center Page Wireframe

**Status:** ✅ Complete  
**Route:** `/support`  
**File:** `task-0.5.1.37-support-center.png`  
**Priority:** 🟢 Global & Help Pages (Priority 7)

**Design Approach:** Professional government platform support center providing support options, help sections, contact links, and support hours. Accessible, organized, and user-friendly.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ [MOH Logo]                    [About] [Support] [Status]   │
│                                        [Login] [Register]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Home > Support Center                                      │
│                                                             │
│  Support Center                                             │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ 📚 FAQ       │  │ 💬 Contact   │  │ 📖           │    │
│  │              │  │ Support      │  │ Documentation│    │
│  │              │  │              │  │              │    │
│  │ Browse       │  │ Get help     │  │ Access user  │    │
│  │ frequently   │  │ from our     │  │ guides,      │    │
│  │ asked        │  │ support team │  │ tutorials,   │    │
│  │ questions    │  │              │  │ and API      │    │
│  │              │  │              │  │ documentation│    │
│  │              │  │              │  │              │    │
│  │ [View FAQ →] │  │ [Contact →] │  │ [View Docs →]│    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Support Options                                    │   │
│  │                                                     │   │
│  │  ┌──────────────┐  ┌──────────────┐               │   │
│  │  │ Email        │  │ Phone        │               │   │
│  │  │ Support      │  │ Support      │               │   │
│  │  │              │  │              │               │   │
│  │  │ [Email]      │  │ [Phone]      │               │   │
│  │  │              │  │              │               │   │
│  │  │ Response:    │  │ Hours:       │               │   │
│  │  │ 24-48 hours  │  │ Mon-Fri      │               │   │
│  │  │              │  │ 9 AM-5 PM    │               │   │
│  │  └──────────────┘  └──────────────┘               │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Support Hours                                      │   │
│  │                                                     │   │
│  │  Monday - Friday: 9:00 AM - 5:00 PM                │   │
│  │  Saturday - Sunday: Closed                          │   │
│  │  Public Holidays: Closed                            │   │
│  │                                                     │   │
│  │  Response Times:                                    │   │
│  │  • Email: 24-48 hours                               │   │
│  │  • Phone: Immediate during support hours            │   │
│  │  • Urgent Issues: Contact support for escalation    │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Quick Links                                        │   │
│  │                                                     │   │
│  │  • [Getting Started Guide]                          │   │
│  │  • [Platform Features]                              │   │
│  │  • [Account Management]                             │   │
│  │  • [Submission Workflows]                           │   │
│  │  • [Compliance Reporting]                           │   │
│  │  • [System Status]                                  │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [MOH Logo]  © 2025 Ministry of Health. All rights         │
│              reserved. [Terms] [Privacy] [Cookies]          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > Support Center"
- **Title:** "Support Center"
  - **Typography:** 36px (desktop), 28px (mobile), font-weight: 700, color: #111827
- **Spacing:** 24px below header navigation

### Help Cards (Top Section)
- **Grid:** 3 columns (desktop), 2 columns (tablet), 1 column (mobile)
- **Card Structure:**
  - **Icon:** Top center, ~48px size
  - **Title:** 20px, font-weight: 600, color: #111827
  - **Description:** 14px, color: #6b7280, 2-3 lines
  - **CTA Button:** Links to respective pages
- **Background:** White (#ffffff)
- **Border:** 1px solid #e5e7eb
- **Border Radius:** 8px
- **Padding:** 32px
- **Hover:** Shadow elevation, border color change

### Support Options Section
- **Title:** "Support Options"
  - **Typography:** 28px, font-weight: 600, color: #111827
- **Grid:** 2 columns (desktop), 1 column (mobile)
- **Option Cards:**
  - **Title:** Email Support / Phone Support
  - **Contact Button:** Primary button with icon
  - **Response Info:** Response times or hours
  - **Background:** #f9fafb (light gray)
  - **Border:** 1px solid #e5e7eb
  - **Padding:** 24px

### Support Hours Section
- **Title:** "Support Hours"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Content:** List of hours and response times
  - **Typography:** 16px, line-height: 1.6, color: #4b5563
- **Background:** White (#ffffff)
- **Border:** 1px solid #e5e7eb
- **Border Radius:** 8px
- **Padding:** 32px

### Quick Links Section
- **Title:** "Quick Links"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Links:** List of common help topics
  - **Typography:** 16px, color: #2563eb (link color)
  - **Hover:** Underline
- **Background:** #eff6ff (blue-50)
- **Border:** 1px solid #3b82f6 (blue-200)
- **Border Radius:** 8px
- **Padding:** 32px

---

## Annotations

### Blue (Interactions)
- **Click "View FAQ →"** → Navigate to `/support/faq`
- **Click "Contact →"** → Navigate to `/support/contact`
- **Click "View Docs →"** → Navigate to `/support/documentation`
- **Click email/phone buttons** → Open email client or phone dialer
- **Click quick links** → Navigate to respective pages or scroll to sections

### Green (States)
- **Hover state:** Cards elevate, links underline
- **Loading state:** Skeleton loaders for dynamic content

---

## Responsive Behavior

### Desktop (1024px+)
- Help cards: 3-column grid
- Support options: 2-column grid
- Sections: Full width, max-width 1200px, centered

### Tablet (768px - 1023px)
- Help cards: 2-column grid
- Support options: 2-column grid
- Sections: Full width minus margins

### Mobile (<768px)
- Help cards: 1-column stack
- Support options: 1-column stack
- Sections: Full width minus 32px margins
- Typography: Smaller sizes

---

## Design System References

### Components Used
- **Button Component:** From UI Component Specifications
  - Variant: Primary (CTAs), Secondary (links)
  - Size: Medium (40px height)
- **Card Component:** Help cards and support options
- **Icon Component:** Support icons (FAQ, Contact, Documentation)

### Colors
- **Background Primary:** #ffffff (white)
- **Background Secondary:** #f9fafb (gray-50)
- **Background Links:** #eff6ff (blue-50)
- **Text Primary:** #111827 (gray-900)
- **Text Secondary:** #6b7280 (gray-500)
- **Link Color:** #2563eb (blue-600)
- **Border:** #e5e7eb (gray-200)

### Typography
- **Page Title:** 36px (desktop), 28px (mobile), font-weight: 700
- **Section Title:** 28px, font-weight: 600
- **Card Title:** 20px, font-weight: 600
- **Body Text:** 16px, line-height: 1.6

### Spacing
- **Section Spacing:** 48px between sections
- **Card Padding:** 32px
- **Element Spacing:** 16px between elements

---

## Accessibility

### Keyboard Navigation
- **Tab:** Move through all interactive elements
- **Enter/Space:** Activate links and buttons

### Screen Reader Support
- **Landmark Roles:** Navigation, Main, Footer
- **Semantic HTML:** Proper heading hierarchy
- **Icon Labels:** All icons have descriptive text labels

### Focus Management
- **Visible Focus:** Clear focus indicator (2px outline, primary blue)

---

## Regulatory Compliance Notes

**Guidance from Fatima (MOH Regulatory Requirements):**
- Support hours must align with MOH operational hours
- Contact information must be official MOH support channels
- Escalation procedures must be documented for urgent regulatory issues

**Guidance from Dr. Samir (Business Process Validation):**
- Support options should clearly communicate response times
- Quick links should guide users to most common help topics
- Support center should emphasize self-service options (FAQ, Documentation)

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/support`
- [Design System](../../../../02-architecture/frontend/design-system.md) - Colors, typography, spacing

---

**Last Updated:** 2025-01-15  
**Status:** ✅ Complete  
**Guidance:** Created with guidance from Fatima (MOH Regulatory Requirements) & Dr. Samir (Business Process Validation)

