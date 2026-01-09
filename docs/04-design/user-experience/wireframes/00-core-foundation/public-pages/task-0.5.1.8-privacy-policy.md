# Task 0.5.1.8: Privacy Policy Page Wireframe

**Status:** ✅ Complete  
**Route:** `/legal/privacy`  
**File:** `task-0.5.1.8-privacy-policy.png`  
**Priority:** 🟢 Global & Help Pages (Priority 7)

**Design Approach:** Professional government platform privacy policy page with privacy information, data handling sections, GDPR compliance, and CNDP compliance. Accessible, comprehensive, and regulatory-compliant.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ [MOH Logo]                    [About] [Support] [Status]   │
│                                        [Login] [Register]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Home > Legal > Privacy Policy                             │
│                                                             │
│  Privacy Policy                                            │
│                                                             │
│  Last updated: January 1, 2025                             │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Table of Contents                                  │   │
│  │                                                     │   │
│  │  1. Introduction                                    │   │
│  │  2. Data Controller                                 │   │
│  │  3. Information We Collect                          │   │
│  │  4. How We Use Your Information                     │   │
│  │  5. Data Sharing and Disclosure                     │   │
│  │  6. Data Security                                   │   │
│  │  7. Your Rights (GDPR & CNDP)                       │   │
│  │  8. Data Retention                                  │   │
│  │  9. Cookies and Tracking                            │   │
│  │  10. Changes to Privacy Policy                      │   │
│  │  11. Contact Information                            │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  1. Introduction                                    │   │
│  │                                                     │   │
│  │  The Ministry of Health ("MOH", "we", "us") is      │   │
│  │  committed to protecting your privacy and personal   │   │
│  │  data. This Privacy Policy explains how we collect, │   │
│  │  use, disclose, and protect your personal            │   │
│  │  information when you use the Pharmaceutical         │   │
│  │  Governance Value Chain Platform (PM).               │   │
│  │                                                     │   │
│  │  This policy complies with applicable data          │   │
│  │  protection laws, including the General Data         │   │
│  │  Protection Regulation (GDPR) and the Commission     │   │
│  │  Nationale de contrôle de la protection des          │   │
│  │  Données à caractère personnel (CNDP) requirements.  │   │
│  │                                                     │   │
│  │  2. Data Controller                                 │   │
│  │                                                     │   │
│  │  The Ministry of Health is the data controller for  │   │
│  │  personal data processed through the PM platform.    │   │
│  │  Contact information: [contact details]              │   │
│  │                                                     │   │
│  │  3. Information We Collect                          │   │
│  │                                                     │   │
│  │  We collect the following types of information:     │   │
│  │  • Account information (name, email, company)       │   │
│  │  • Submission data (products, compliance reports)   │   │
│  │  • Usage data (platform activity, logs)             │   │
│  │  • Communication data (messages, support requests)  │   │
│  │                                                     │   │
│  │  [Continue reading...]                              │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  7. Your Rights (GDPR & CNDP)                       │   │
│  │                                                     │   │
│  │  Under applicable data protection laws, you have    │   │
│  │  the following rights:                               │   │
│  │                                                     │   │
│  │  • Right to access your personal data               │   │
│  │  • Right to rectify inaccurate data                 │   │
│  │  • Right to erasure ("right to be forgotten")       │   │
│  │  • Right to restrict processing                     │   │
│  │  • Right to data portability                        │   │
│  │  • Right to object to processing                    │   │
│  │  • Right to withdraw consent                        │   │
│  │                                                     │   │
│  │  To exercise your rights, contact us at:            │   │
│  │  [privacy@moh.gov]                                   │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Contact Us                                         │   │
│  │                                                     │   │
│  │  For privacy-related inquiries, please contact:     │   │
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
- **Breadcrumbs:** "Home > Legal > Privacy Policy"
- **Title:** "Privacy Policy"
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

### Privacy Policy Content Section
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
  - **Bullet Points:** Unordered lists for information types, rights, etc.
  - **Typography:** 16px, color: #4b5563
  - **Indentation:** 24px left margin
- **Highlighted Sections:**
  - **GDPR & CNDP Compliance:** Emphasized with background color or border
  - **Background:** #eff6ff (blue-50)
  - **Border:** 1px solid #3b82f6 (blue-200)
  - **Padding:** 16px

### Contact Section
- **Background:** #eff6ff (blue-50)
- **Border:** 1px solid #3b82f6 (blue-200)
- **Border Radius:** 8px
- **Padding:** 32px
- **Title:** "Contact Us"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Content:** Privacy contact information
- **Contact Link:** "Contact Support →" links to `/support/contact`

---

## Annotations

### Blue (Interactions)
- **Click table of contents link** → Scroll to section or navigate to anchor
- **Click email address** → Open email client
- **Click "Contact Support →"** → Navigate to `/support/contact`
- **Click links in content** → Navigate to referenced documents (Cookie Policy, etc.)

### Green (States)
- **Highlighted sections:** GDPR & CNDP compliance sections emphasized
- **Contact section:** Highlighted for visibility

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
- **Link Component:** For table of contents and references
  - Variant: Default
  - Color: #2563eb (blue-600)
- **Card Component:** For highlighted sections (GDPR & CNDP compliance)

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
- **Body Text:** 16px, line-height: 1.7
- **Last Updated:** 14px, italic

### Spacing
- **Section Spacing:** 32px between sections
- **Paragraph Spacing:** 16px between paragraphs
- **Content Padding:** 48px (desktop), 32px (mobile)

---

## Accessibility

### Keyboard Navigation
- **Tab:** Move through table of contents links, contact links
- **Enter/Space:** Activate links

### Screen Reader Support
- **Semantic HTML:** Proper heading hierarchy (h1, h2, h3)
- **Table of Contents:** Announced as navigation menu
- **Section Headers:** Announced as headings with numbers
- **Highlighted Sections:** Announced with emphasis

### Focus Management
- **Visible Focus:** Clear focus indicator (2px outline, primary blue)
- **Focus Order:** Table of contents → Content → Contact section

---

## Regulatory Compliance Notes

**Guidance from Fatima (MOH Regulatory Requirements):**
- Privacy policy must comply with CNDP requirements
- GDPR compliance must be addressed for EU users
- Data controller information must be clearly stated
- User rights must be clearly explained (GDPR & CNDP)
- Data retention policies must align with regulatory requirements
- Contact information for privacy inquiries must be provided

**Guidance from Dr. Samir (Business Process Validation):**
- Privacy policy should clearly explain data collection and use
- User rights section should be accessible and understandable
- Contact section should make it easy to exercise privacy rights

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/legal/privacy`
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Law No. 09-08
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - CNDP requirements
- [Design System](../../../../02-architecture/frontend/design-system.md) - Colors, typography, spacing

---

**Last Updated:** 2025-01-15  
**Status:** ✅ Complete  
**Guidance:** Created with guidance from Fatima (MOH Regulatory Requirements) & Dr. Samir (Business Process Validation)

