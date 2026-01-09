# Task 0.5.1.7: Terms of Service Page Wireframe

**Status:** ✅ Complete  
**Route:** `/legal/terms`  
**File:** `task-0.5.1.7-terms-of-service.png`  
**Priority:** 🟢 Global & Help Pages (Priority 7)

**Design Approach:** Professional government platform terms of service page with legal text, organized sections, and acceptance checkbox. Accessible, comprehensive, and regulatory-compliant (Law No. 09-08, CNDP).

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ [MOH Logo]                    [About] [Support] [Status]   │
│                                        [Login] [Register]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Home > Legal > Terms of Service                           │
│                                                             │
│  Terms of Service                                          │
│                                                             │
│  Last updated: January 1, 2025                             │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Table of Contents                                  │   │
│  │                                                     │   │
│  │  1. Acceptance of Terms                             │   │
│  │  2. Use of the Platform                             │   │
│  │  3. User Accounts                                   │   │
│  │  4. Regulatory Compliance                           │   │
│  │  5. Intellectual Property                           │   │
│  │  6. Privacy and Data Protection                     │   │
│  │  7. Limitation of Liability                         │   │
│  │  8. Termination                                     │   │
│  │  9. Governing Law                                   │   │
│  │  10. Changes to Terms                               │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  1. Acceptance of Terms                             │   │
│  │                                                     │   │
│  │  By accessing and using the Pharmaceutical          │   │
│  │  Governance Value Chain Platform (PM), you agree    │   │
│  │  to be bound by these Terms of Service and all      │   │
│  │  applicable laws and regulations. If you do not     │   │
│  │  agree with any part of these terms, you must not   │   │
│  │  use the platform.                                   │   │
│  │                                                     │   │
│  │  2. Use of the Platform                             │   │
│  │                                                     │   │
│  │  The PM platform is a regulatory governance system  │   │
│  │  operated by the Ministry of Health. Users must     │   │
│  │  comply with all applicable laws and regulations,   │   │
│  │  including Law No. 09-08 and related pharmaceutical │   │
│  │  governance requirements.                            │   │
│  │                                                     │   │
│  │  Users are prohibited from:                         │   │
│  │  • Attempting to gain unauthorized access           │   │
│  │  • Interfering with platform operations             │   │
│  │  • Submitting false or misleading information       │   │
│  │  • Violating regulatory requirements                │   │
│  │                                                     │   │
│  │  [Continue reading...]                              │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  ☐ I have read and agree to the Terms of Service   │   │
│  │                                                     │   │
│  │  [Accept Terms]                                     │   │
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
- **Breadcrumbs:** "Home > Legal > Terms of Service"
- **Title:** "Terms of Service"
  - **Typography:** 36px (desktop), 28px (mobile), font-weight: 700, color: #111827
- **Last Updated:** "Last updated: [date]"
  - **Typography:** 14px, color: #6b7280, italic
- **Spacing:** 24px below header navigation

### Table of Contents Section
- **Background:** #f9fafb (light gray)
- **Border:** 1px solid #e5e7eb
- **Border Radius:** 8px
- **Padding:** 24px
- **List:** Numbered list of sections
  - **Typography:** 16px, color: #4b5563
  - **Link Color:** #2563eb (blue-600)
  - **Hover:** Underline
- **Click Action:** Scroll to section or navigate to anchor

### Terms Content Section
- **Max Width:** 900px (desktop), full width (mobile)
- **Background:** White (#ffffff)
- **Border:** 1px solid #e5e7eb
- **Border Radius:** 8px
- **Padding:** 48px (desktop), 32px (mobile)
- **Centered:** Yes

**Content Structure:**
- **Section Headers:** Numbered sections (1., 2., 3., etc.)
  - **Typography:** 24px, font-weight: 600, color: #111827
  - **Spacing:** 32px above section, 16px below section header
- **Body Text:**
  - **Typography:** 16px, line-height: 1.7, color: #4b5563
  - **Spacing:** 16px between paragraphs
- **Lists:**
  - **Bullet Points:** Unordered lists for prohibited activities
  - **Typography:** 16px, color: #4b5563
  - **Indentation:** 24px left margin
- **Links:** References to other legal documents (Privacy Policy, etc.)
  - **Color:** #2563eb (blue-600)
  - **Hover:** Underline

### Acceptance Section
- **Background:** #eff6ff (blue-50)
- **Border:** 1px solid #3b82f6 (blue-200)
- **Border Radius:** 8px
- **Padding:** 24px
- **Checkbox:** "I have read and agree to the Terms of Service"
  - **Required:** Yes (for registration)
  - **Typography:** 16px, color: #111827
- **Accept Button:** Primary button
  - **Text:** "Accept Terms"
  - **Variant:** Primary
  - **Disabled:** Until checkbox checked
  - **Click Action:** Mark terms as accepted, redirect or close modal

---

## Annotations

### Blue (Interactions)
- **Click table of contents link** → Scroll to section or navigate to anchor
- **Click "Accept Terms" button** → Mark terms as accepted, redirect or close modal
- **Click checkbox** → Enable/disable accept button
- **Click links in content** → Navigate to referenced documents (Privacy Policy, etc.)

### Orange (Validation)
- **Checkbox required:** Accept button disabled until checkbox checked
- **Terms acceptance:** Required for registration and account creation

### Green (States)
- **Accepted state:** Terms marked as accepted, checkbox checked
- **Loading state:** Button shows spinner when processing acceptance
- **Success state:** Terms accepted, redirect or close modal

---

## Responsive Behavior

### Desktop (1024px+)
- Content max-width: 900px, centered
- Table of contents: Full width within container
- Sections: Full width within container
- Typography: Large sizes

### Tablet (768px - 1023px)
- Content: Full width minus 48px margins
- Table of contents: Full width within container
- Sections: Full width within container
- Typography: Medium sizes

### Mobile (<768px)
- Content: Full width minus 32px margins
- Table of contents: Hidden or simplified (dropdown)
- Sections: Full width within container
- Typography: Smaller sizes
- Spacing: Reduced padding

---

## Design System References

### Components Used
- **Checkbox Component:** From UI Component Specifications
  - Size: Medium
  - States: Unchecked, Checked
- **Button Component:** From UI Component Specifications
  - Variant: Primary
  - Size: Medium (40px height)
  - States: Default, Hover, Active, Loading, Disabled
- **Link Component:** For table of contents and references
  - Variant: Default
  - Color: #2563eb (blue-600)

### Colors
- **Background Primary:** #ffffff (white)
- **Background Secondary:** #f9fafb (gray-50)
- **Background Acceptance:** #eff6ff (blue-50)
- **Text Primary:** #111827 (gray-900)
- **Text Secondary:** #4b5563 (gray-600)
- **Link Color:** #2563eb (blue-600)
- **Border:** #e5e7eb (gray-200)

### Typography
- **Page Title:** 36px (desktop), 28px (mobile), font-weight: 700
- **Section Title:** 24px, font-weight: 600
- **Body Text:** 16px, line-height: 1.7
- **Last Updated:** 14px, italic

### Spacing
- **Section Spacing:** 32px between sections
- **Paragraph Spacing:** 16px between paragraphs
- **Content Padding:** 48px (desktop), 32px (mobile)

---

## Accessibility

### Keyboard Navigation
- **Tab:** Move through table of contents links, checkbox, button
- **Enter/Space:** Activate link, toggle checkbox, submit button

### Screen Reader Support
- **Semantic HTML:** Proper heading hierarchy (h1, h2, h3)
- **Table of Contents:** Announced as navigation menu
- **Section Headers:** Announced as headings with numbers
- **Checkbox:** Announced as "I have read and agree to the Terms of Service"

### Focus Management
- **Visible Focus:** Clear focus indicator (2px outline, primary blue)
- **Focus Order:** Table of contents → Content → Checkbox → Button

---

## Regulatory Compliance Notes

**Guidance from Fatima (MOH Regulatory Requirements):**
- Terms must align with Law No. 09-08 and regulatory framework
- Terms must reference regulatory compliance requirements
- Privacy and data protection must reference CNDP requirements
- Governing law must specify applicable jurisdiction

**Guidance from Dr. Samir (Business Process Validation):**
- Terms should clearly define user responsibilities
- Platform use restrictions should be clearly stated
- Acceptance process should be transparent and accessible

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/legal/terms`
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Law No. 09-08
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - CNDP requirements
- [Design System](../../../../02-architecture/frontend/design-system.md) - Colors, typography, spacing

---

**Last Updated:** 2025-01-15  
**Status:** ✅ Complete  
**Guidance:** Created with guidance from Fatima (MOH Regulatory Requirements) & Dr. Samir (Business Process Validation)

