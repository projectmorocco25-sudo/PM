# Task 0.5.1.2: About Page Wireframe

**Status:** ✅ Complete  
**Route:** `/about`  
**File:** `task-0.5.1.2-about-page.png`  
**Priority:** 🟢 Global & Help Pages (Priority 7)

**Design Approach:** Professional government platform about page focusing on MOH regulatory mission, framework overview, partnership information, and contact details. Accessible, comprehensive, and regulatory-compliant.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ [MOH Logo]                    [About] [Support] [Status]   │
│                                        [Login] [Register]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Home > About                                               │
│                                                             │
│  About the Platform                                         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  MOH Regulatory Mission                            │   │
│  │                                                     │   │
│  │  The Pharmaceutical Governance Value Chain          │   │
│  │  Platform (PM) supports the Ministry of Health's   │   │
│  │  mission to ensure medicine availability and       │   │
│  │  regulatory compliance across the pharmaceutical   │   │
│  │  value chain.                                       │   │
│  │                                                     │   │
│  │  The platform enables companies to manage their    │   │
│  │  pharmaceutical registrations, monitor compliance  │   │
│  │  with stock thresholds, and coordinate export      │   │
│  │  controls while providing MOH with comprehensive   │   │
│  │  oversight and governance tools.                   │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Regulatory Framework Overview                     │   │
│  │                                                     │   │
│  │  The platform implements the regulatory framework  │   │
│  │  established under Law No. 09-08 and related       │   │
│  │  regulations governing pharmaceutical governance.  │   │
│  │                                                     │   │
│  │  Key regulatory requirements:                      │   │
│  │                                                     │   │
│  │  • Registry Management (RMM)                       │   │
│  │    Product registration, company management,       │   │
│  │    and submission workflows                        │   │
│  │                                                     │   │
│  │  • Compliance Monitoring (VCI)                     │   │
│  │    Annual (AAMS), monthly (MSQ), and weekly       │   │
│  │    (WSL) stock level reporting                     │   │
│  │                                                     │   │
│  │  • Export Control (ECS)                            │   │
│  │    Export authorization and replenishment          │   │
│  │    tracking                                        │   │
│  │                                                     │   │
│  │  • Compliance Management (CMC)                     │   │
│  │    Compliance scoring, dispute resolution,         │   │
│  │    and reporting                                   │   │
│  │                                                     │   │
│  │  • Enforcement                                     │   │
│  │    Governance actions, warnings, fines, and        │   │
│  │    suspensions                                     │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Partnership Information                           │   │
│  │                                                     │   │
│  │  The PM platform is developed and maintained in    │   │
│  │  partnership with the Ministry of Health to        │   │
│  │  support regulatory governance and compliance      │   │
│  │  management across the pharmaceutical industry.    │   │
│  │                                                     │   │
│  │  The platform is designed to facilitate            │   │
│  │  collaboration between pharmaceutical companies    │   │
│  │  and regulatory authorities, ensuring transparent  │   │
│  │  communication and efficient compliance            │   │
│  │  workflows.                                        │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Contact Information                               │   │
│  │                                                     │   │
│  │  Ministry of Health                                │   │
│  │  [Address Line 1]                                  │   │
│  │  [Address Line 2]                                  │   │
│  │  [City, Country]                                   │   │
│  │                                                     │   │
│  │  Email: [contact@moh.gov]                          │   │
│  │  Phone: [Phone Number]                             │   │
│  │                                                     │   │
│  │  Support Hours: Monday - Friday, 9:00 AM - 5:00 PM│   │
│  │                                                     │   │
│  │  [Contact Support] [View Status]                   │   │
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
- **Breadcrumbs:** "Home > About"
- **Title:** "About the Platform"
  - **Typography:** 36px (desktop), 28px (mobile), font-weight: 700, color: #111827
- **Spacing:** 24px below header navigation

### Content Sections
- **Max Width:** 900px (desktop), full width (mobile)
- **Centered:** Yes
- **Padding:** 40px vertical, 24px horizontal (desktop), 32px (mobile)

**Section Structure:**
- **Section Title:** 28px, font-weight: 600, color: #111827, margin-bottom: 16px
- **Section Content:** 16px, line-height: 1.7, color: #4b5563
- **Section Spacing:** 48px between sections

### MOH Regulatory Mission Section
- **Background:** White (#ffffff)
- **Border:** 1px solid #e5e7eb
- **Border Radius:** 8px
- **Padding:** 32px
- **Content:** 2-3 paragraphs describing mission and platform purpose

### Regulatory Framework Overview Section
- **Background:** #f9fafb (light gray)
- **Border:** 1px solid #e5e7eb
- **Border Radius:** 8px
- **Padding:** 32px
- **List Items:**
  - Bullet points for each module
  - Indented descriptions under each module
  - **Typography:** 16px for items, 14px for descriptions

### Partnership Information Section
- **Background:** White (#ffffff)
- **Border:** 1px solid #e5e7eb
- **Border Radius:** 8px
- **Padding:** 32px
- **Content:** Description of partnership and collaboration

### Contact Information Section
- **Background:** #eff6ff (blue-50)
- **Border:** 1px solid #3b82f6 (blue-200)
- **Border Radius:** 8px
- **Padding:** 32px
- **Contact Details:**
  - Ministry name, address, email, phone
  - Support hours
- **Action Buttons:**
  - **Contact Support:** Links to `/support/contact`
  - **View Status:** Links to `/status`

---

## Annotations

### Blue (Interactions)
- **Click "Contact Support"** → Navigate to `/support/contact`
- **Click "View Status"** → Navigate to `/status`
- **Click navigation links** → Navigate to respective pages
- **Click email/phone** → Open email client or phone dialer

### Green (States)
- **Hover state:** Links underline, buttons darken
- **Print-friendly:** Sections maintain layout when printed

---

## Responsive Behavior

### Desktop (1024px+)
- Content max-width: 900px, centered
- Sections: Full width within container
- Typography: Large sizes

### Tablet (768px - 1023px)
- Content: Full width minus 48px margins
- Sections: Full width
- Typography: Medium sizes

### Mobile (<768px)
- Content: Full width minus 32px margins
- Sections: Full width
- Typography: Smaller sizes
- Spacing: Reduced padding

---

## Design System References

### Components Used
- **Button Component:** From UI Component Specifications
  - Variant: Primary (Contact Support), Secondary (View Status)
  - Size: Medium (40px height)
- **Card Component:** Content sections with borders and backgrounds

### Colors
- **Background Primary:** #ffffff (white)
- **Background Secondary:** #f9fafb (gray-50)
- **Background Contact:** #eff6ff (blue-50)
- **Text Primary:** #111827 (gray-900)
- **Text Secondary:** #4b5563 (gray-600)
- **Border:** #e5e7eb (gray-200)

### Typography
- **Page Title:** 36px (desktop), 28px (mobile), font-weight: 700
- **Section Title:** 28px, font-weight: 600
- **Body Text:** 16px, line-height: 1.7
- **List Items:** 16px for main items, 14px for descriptions

### Spacing
- **Section Spacing:** 48px between sections
- **Section Padding:** 32px
- **Element Spacing:** 16px between elements within sections

---

## Accessibility

### Keyboard Navigation
- **Tab:** Move through all interactive elements
- **Enter/Space:** Activate links and buttons

### Screen Reader Support
- **Landmark Roles:** Navigation, Main, Footer
- **Semantic HTML:** Proper heading hierarchy (h1, h2, h3)
- **List Structure:** Properly structured lists for framework modules

### Focus Management
- **Visible Focus:** Clear focus indicator (2px outline, primary blue)

---

## Regulatory Compliance Notes

**Guidance from Fatima (MOH Regulatory Requirements):**
- Mission statement must align with Law No. 09-08
- Regulatory framework must accurately reflect legal requirements
- Contact information must be official MOH contact details
- Partnership information must be transparent

**Guidance from Dr. Samir (Business Process Validation):**
- Framework overview should clearly explain each module's purpose
- Partnership section should emphasize collaboration value
- Contact information should guide users to appropriate support channels

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/about`
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Law No. 09-08
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - CNDP requirements
- [Design System](../../../../02-architecture/frontend/design-system.md) - Colors, typography, spacing

---

**Last Updated:** 2025-01-15  
**Status:** ✅ Complete  
**Guidance:** Created with guidance from Fatima (MOH Regulatory Requirements) & Dr. Samir (Business Process Validation)

