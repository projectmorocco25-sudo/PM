# Task 0.5.1.9: Cookie Policy Page Wireframe

**Status:** ✅ Complete  
**Route:** `/legal/cookies`  
**File:** `task-0.5.1.9-cookie-policy.png`  
**Priority:** 🟢 Global & Help Pages (Priority 7)

**Design Approach:** Professional government platform cookie policy page with cookie information, consent management, organized sections, and opt-out options. Accessible, comprehensive, and GDPR/CNDP compliant.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ [MOH Logo]                    [About] [Support] [Status]   │
│                                        [Login] [Register]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Home > Legal > Cookie Policy                               │
│                                                             │
│  Cookie Policy                                             │
│                                                             │
│  Last updated: January 1, 2025                             │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Table of Contents                                  │   │
│  │                                                     │   │
│  │  1. What Are Cookies                                │   │
│  │  2. How We Use Cookies                              │   │
│  │  3. Types of Cookies                                │   │
│  │  4. Third-Party Cookies                             │   │
│  │  5. Managing Cookies                                │   │
│  │  6. Your Cookie Choices                             │   │
│  │  7. Changes to Cookie Policy                        │   │
│  │  8. Contact Information                             │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  1. What Are Cookies                                │   │
│  │                                                     │   │
│  │  Cookies are small text files that are stored on   │   │
│  │  your device when you visit a website. They help   │   │
│  │  websites remember your preferences and improve     │   │
│  │  your browsing experience.                          │   │
│  │                                                     │   │
│  │  2. How We Use Cookies                              │   │
│  │                                                     │   │
│  │  The PM platform uses cookies to:                   │   │
│  │  • Remember your login session                      │   │
│  │  • Maintain your preferences                        │   │
│  │  • Analyze platform usage                           │   │
│  │  • Ensure platform security                         │   │
│  │                                                     │   │
│  │  3. Types of Cookies                                │   │
│  │                                                     │   │
│  │  Essential Cookies (Required)                       │   │
│  │  These cookies are necessary for the platform to   │   │
│  │  function properly. They cannot be disabled.        │   │
│  │  • Session management                               │   │
│  │  • Authentication                                   │   │
│  │  • Security                                         │   │
│  │                                                     │   │
│  │  Functional Cookies (Optional)                      │   │
│  │  These cookies enhance functionality but are not   │   │
│  │  essential for platform operation.                  │   │
│  │  • Preferences                                      │   │
│  │  • Language settings                                │   │
│  │                                                     │   │
│  │  Analytics Cookies (Optional)                       │   │
│  │  These cookies help us understand how users         │   │
│  │  interact with the platform.                        │   │
│  │  • Usage statistics                                 │   │
│  │  • Performance monitoring                           │   │
│  │                                                     │   │
│  │  [Continue reading...]                              │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  5. Managing Cookies                                │   │
│  │                                                     │   │
│  │  You can manage your cookie preferences at any      │   │
│  │  time through:                                       │   │
│  │                                                     │   │
│  │  • Cookie settings in your account                  │   │
│  │  • Browser settings                                 │   │
│  │  • Cookie consent banner                            │   │
│  │                                                     │   │
│  │  [Manage Cookie Preferences]                        │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  6. Your Cookie Choices                             │   │
│  │                                                     │   │
│  │  Cookie Preferences                                 │   │
│  │                                                     │   │
│  │  ☑ Essential Cookies (Required)                    │   │
│  │     Cannot be disabled                              │   │
│  │                                                     │   │
│  │  ☐ Functional Cookies                               │   │
│  │     Enhance functionality                          │   │
│  │                                                     │   │
│  │  ☐ Analytics Cookies                                │   │
│  │     Help us improve the platform                   │   │
│  │                                                     │   │
│  │  [Save Preferences]                                 │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Contact Us                                         │   │
│  │                                                     │   │
│  │  For cookie-related inquiries, please contact:      │   │
│  │                                                     │   │
│  │  Email: [privacy@moh.gov]                            │   │
│  │  Address: [MOH Address]                             │   │
│  │                                                     │   │
│  │  [Contact Support →]                                │   │
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
- **Breadcrumbs:** "Home > Legal > Cookie Policy"
- **Title:** "Cookie Policy"
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

### Cookie Policy Content Section
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
- **Subsection Headers:** Cookie type headers (Essential, Functional, Analytics)
  - **Typography:** 20px, font-weight: 600, color: #111827
  - **Spacing:** 24px above subsection, 12px below subsection header
- **Body Text:**
  - **Typography:** 16px, line-height: 1.7, color: #4b5563
  - **Spacing:** 16px between paragraphs
- **Lists:**
  - **Bullet Points:** Unordered lists for cookie purposes
  - **Typography:** 16px, color: #4b5563
  - **Indentation:** 24px left margin

### Managing Cookies Section
- **Background:** #eff6ff (blue-50)
- **Border:** 1px solid #3b82f6 (blue-200)
- **Border Radius:** 8px
- **Padding:** 32px
- **Content:** Information about managing cookies
- **Manage Button:** "Manage Cookie Preferences"
  - **Variant:** Primary
  - **Click Action:** Open cookie preferences modal or navigate to settings

### Cookie Preferences Section
- **Background:** #f9fafb (light gray)
- **Border:** 1px solid #e5e7eb
- **Border Radius:** 8px
- **Padding:** 32px
- **Title:** "Cookie Preferences"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Cookie Options:**
  - **Essential Cookies:** Checkbox (checked, disabled) - Required
    - **Description:** "Cannot be disabled"
  - **Functional Cookies:** Checkbox (unchecked by default) - Optional
    - **Description:** "Enhance functionality"
  - **Analytics Cookies:** Checkbox (unchecked by default) - Optional
    - **Description:** "Help us improve the platform"
- **Save Button:** "Save Preferences"
  - **Variant:** Primary
  - **Click Action:** Save cookie preferences

### Contact Section
- **Background:** #eff6ff (blue-50)
- **Border:** 1px solid #3b82f6 (blue-200)
- **Border Radius:** 8px
- **Padding:** 32px
- **Title:** "Contact Us"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Content:** Cookie contact information
- **Contact Link:** "Contact Support →" links to `/support/contact`

---

## Annotations

### Blue (Interactions)
- **Click table of contents link** → Scroll to section or navigate to anchor
- **Click "Manage Cookie Preferences"** → Open cookie preferences modal or navigate to settings
- **Click cookie checkboxes** → Toggle cookie preference (except essential cookies)
- **Click "Save Preferences"** → Save cookie preferences, show success message
- **Click "Contact Support →"** → Navigate to `/support/contact`

### Orange (Validation)
- **Essential cookies:** Cannot be unchecked (disabled checkbox)
- **Cookie preferences:** Must save preferences to apply changes

### Green (States)
- **Saved state:** Preferences saved, success message shown
- **Loading state:** Button shows spinner when saving preferences

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
  - States: Unchecked, Checked, Disabled
- **Button Component:** From UI Component Specifications
  - Variant: Primary
  - Size: Medium (40px height)
  - States: Default, Hover, Active, Loading
- **Link Component:** For table of contents and references
  - Variant: Default
  - Color: #2563eb (blue-600)

### Colors
- **Background Primary:** #ffffff (white)
- **Background Secondary:** #f9fafb (gray-50)
- **Background Highlight:** #eff6ff (blue-50)
- **Text Primary:** #111827 (gray-900)
- **Text Secondary:** #4b5563 (gray-600)
- **Link Color:** #2563eb (blue-600)
- **Border:** #e5e7eb (gray-200)
- **Border Highlight:** #3b82f6 (blue-200)

### Typography
- **Page Title:** 36px (desktop), 28px (mobile), font-weight: 700
- **Section Title:** 24px, font-weight: 600
- **Subsection Title:** 20px, font-weight: 600
- **Body Text:** 16px, line-height: 1.7
- **Last Updated:** 14px, italic

### Spacing
- **Section Spacing:** 32px between sections
- **Subsection Spacing:** 24px between subsections
- **Paragraph Spacing:** 16px between paragraphs
- **Content Padding:** 48px (desktop), 32px (mobile)

---

## Accessibility

### Keyboard Navigation
- **Tab:** Move through table of contents links, checkboxes, buttons
- **Enter/Space:** Toggle checkboxes, activate buttons

### Screen Reader Support
- **Semantic HTML:** Proper heading hierarchy (h1, h2, h3)
- **Table of Contents:** Announced as navigation menu
- **Section Headers:** Announced as headings with numbers
- **Checkboxes:** Announced with descriptions and disabled state

### Focus Management
- **Visible Focus:** Clear focus indicator (2px outline, primary blue)
- **Focus Order:** Table of contents → Content → Preferences → Buttons

---

## Regulatory Compliance Notes

**Guidance from Fatima (MOH Regulatory Requirements):**
- Cookie policy must comply with GDPR and CNDP requirements
- Cookie consent must be obtained before setting non-essential cookies
- Essential cookies must be clearly identified and cannot be disabled
- Cookie preferences must be easy to manage and update
- Third-party cookies must be disclosed if used

**Guidance from Dr. Samir (Business Process Validation):**
- Cookie preferences should be clear and easy to understand
- Opt-out options should be accessible
- Cookie management should be integrated into account settings

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/legal/cookies`
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Law No. 09-08
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - CNDP requirements
- [Design System](../../../../02-architecture/frontend/design-system.md) - Colors, typography, spacing

---

**Last Updated:** 2025-01-15  
**Status:** ✅ Complete  
**Guidance:** Created with guidance from Fatima (MOH Regulatory Requirements) & Dr. Samir (Business Process Validation)

