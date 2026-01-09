# Task 0.5.1.1: Public Homepage Wireframe

**Status:** ✅ Complete  
**Route:** `/`  
**File:** `task-0.5.1.1-public-homepage.png`  
**Priority:** 🟢 Global & Help Pages (Priority 7)

**Design Approach:** Professional government platform homepage focused on MOH regulatory mission, governance framework, and partnership information. Accessible, clear, and regulatory-compliant.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ [MOH Logo]                    [About] [Support] [Status]   │
│                                        [Login] [Register]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│      Pharmaceutical Governance Value Chain Platform         │
│                                                             │
│         Ensuring Medicine Availability & Compliance         │
│                                                             │
│              [Get Started] [Learn More →]                   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ Registry     │  │ Compliance   │  │ Export       │    │
│  │ Management   │  │ Monitoring   │  │ Control      │    │
│  │              │  │              │  │              │    │
│  │ Manage       │  │ Monitor      │  │ Control      │    │
│  │ products,    │  │ stock levels │  │ exports to   │    │
│  │ companies,   │  │ and ensure   │  │ ensure       │    │
│  │ and          │  │ compliance   │  │ domestic     │    │
│  │ submissions  │  │ with         │  │ availability │    │
│  │              │  │ thresholds   │  │              │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐                       │
│  │ Enforcement  │  │ Analytics    │                       │
│  │ Actions      │  │ & Reporting  │                       │
│  │              │  │              │                       │
│  │ Manage       │  │ Track        │                       │
│  │ governance   │  │ compliance   │                       │
│  │ actions,     │  │ trends and   │                       │
│  │ warnings,    │  │ generate     │                       │
│  │ fines, and   │  │ regulatory   │                       │
│  │ suspensions  │  │ reports      │                       │
│  └──────────────┘  └──────────────┘                       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│         About MOH's Regulatory Mission                      │
│                                                             │
│  The Pharmaceutical Governance Value Chain Platform         │
│  supports the Ministry of Health's mission to ensure        │
│  medicine availability and regulatory compliance across     │
│  the pharmaceutical value chain.                            │
│                                                             │
│  [Learn More About MOH's Mission →]                         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│         Partnership Information                             │
│                                                             │
│  Developed in partnership with the Ministry of Health       │
│  to support regulatory governance and compliance            │
│  management.                                                │
│                                                             │
│  [Contact Us] [About] [Support]                            │
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

### Header/Navigation
- **MOH Logo:** Left side, ~120px width
- **Navigation Links:** Right side
  - About, Support, Status (public pages)
  - Login, Register (authentication)
- **Background:** White (#ffffff)
- **Border Bottom:** 1px solid #e5e7eb
- **Padding:** 16px vertical, 24px horizontal
- **Sticky:** Stays at top on scroll (desktop)

### Hero Section
- **Background:** Gradient or solid color (MOH brand colors)
- **Padding:** 80px vertical, 24px horizontal
- **Title:** "Pharmaceutical Governance Value Chain Platform"
  - **Typography:** 48px (desktop), 32px (mobile), font-weight: 700, color: white or primary
- **Subtitle:** "Ensuring Medicine Availability & Compliance"
  - **Typography:** 24px (desktop), 18px (mobile), font-weight: 400, color: white or secondary
- **CTA Buttons:**
  - **Get Started:** Primary button, links to `/register`
  - **Learn More:** Secondary button, links to `/about`
- **Alignment:** Centered

### Features Section
- **Title:** "Platform Features" (optional, can be implicit)
- **Grid:** 3 columns (desktop), 2 columns (tablet), 1 column (mobile)
- **Feature Cards:**
  - **Icon/Illustration:** Top of card
  - **Title:** Module name (Registry Management, Compliance Monitoring, etc.)
  - **Description:** 2-3 lines describing module purpose
  - **Background:** White (#ffffff)
  - **Border:** 1px solid #e5e7eb
  - **Border Radius:** 8px
  - **Padding:** 24px
  - **Hover:** Shadow elevation

### Mission Section
- **Title:** "About MOH's Regulatory Mission"
  - **Typography:** 32px, font-weight: 600, color: #111827
- **Content:** 2-3 paragraphs describing MOH mission and platform purpose
  - **Typography:** 16px, color: #4b5563, line-height: 1.6
- **CTA:** "Learn More About MOH's Mission" link to `/about`
  - **Background:** Light gray (#f9fafb)
  - **Padding:** 60px vertical, 24px horizontal

### Partnership Section
- **Title:** "Partnership Information"
  - **Typography:** 28px, font-weight: 600, color: #111827
- **Content:** Brief description of partnership with MOH
  - **Typography:** 16px, color: #4b5563
- **Links:** Contact Us, About, Support
- **Background:** White (#ffffff)
- **Padding:** 40px vertical, 24px horizontal

### Footer
- **MOH Logo:** Left side
- **Copyright:** "© 2025 Ministry of Health. All rights reserved."
- **Legal Links:** Terms, Privacy, Cookies
- **Background:** #111827 (dark)
- **Text Color:** #9ca3af (light gray)
- **Padding:** 32px vertical, 24px horizontal

---

## Annotations

### Blue (Interactions)
- **Click "Login"** → Navigate to `/login`
- **Click "Register"** → Navigate to `/register`
- **Click "Get Started"** → Navigate to `/register`
- **Click "Learn More"** → Navigate to `/about`
- **Click feature cards** → Navigate to `/about` (scroll to section or separate page)
- **Click navigation links** → Navigate to respective pages

### Green (States)
- **Hover state:** Links underline, buttons darken
- **Scroll state:** Header becomes sticky (desktop)
- **Loading state:** Skeleton loaders for images

---

## Responsive Behavior

### Desktop (1024px+)
- Header: Full navigation visible
- Hero: Large typography, centered
- Features: 3-column grid
- Mission/Partnership: Full width sections

### Tablet (768px - 1023px)
- Header: Full navigation visible
- Hero: Medium typography
- Features: 2-column grid
- Mission/Partnership: Full width sections

### Mobile (<768px)
- Header: Hamburger menu (navigation in drawer)
- Hero: Smaller typography, stacked buttons
- Features: 1-column stack
- Mission/Partnership: Full width, adjusted padding

---

## Design System References

### Components Used
- **Button Component:** From UI Component Specifications
  - Variant: Primary (Get Started), Secondary (Learn More)
  - Size: Large (48px height desktop, 40px mobile)
- **Navigation Component:** Header navigation pattern
- **Card Component:** Feature cards

### Colors
- **Background Primary:** #ffffff (white)
- **Background Secondary:** #f9fafb (gray-50)
- **Background Footer:** #111827 (gray-900)
- **Text Primary:** #111827 (gray-900)
- **Text Secondary:** #4b5563 (gray-600)
- **Text Light:** #9ca3af (gray-400)
- **Primary Accent:** MOH brand color (blue/green)

### Typography
- **Hero Title:** 48px (desktop), 32px (mobile), font-weight: 700
- **Hero Subtitle:** 24px (desktop), 18px (mobile), font-weight: 400
- **Section Title:** 32px, font-weight: 600
- **Body Text:** 16px, line-height: 1.6

### Spacing
- **Section Padding:** 60-80px vertical (desktop), 40px (mobile)
- **Card Padding:** 24px
- **Element Spacing:** 24px between major elements

---

## Accessibility

### Keyboard Navigation
- **Tab:** Move through all interactive elements
- **Enter/Space:** Activate links and buttons

### Screen Reader Support
- **Landmark Roles:** Navigation, Main, Footer
- **Alt Text:** All images have descriptive alt text
- **Semantic HTML:** Proper heading hierarchy (h1, h2, h3)

### Focus Management
- **Visible Focus:** Clear focus indicator (2px outline, primary blue)
- **Skip Links:** "Skip to main content" link for keyboard users

---

## Regulatory Compliance Notes

**Guidance from Fatima (MOH Regulatory Requirements):**
- MOH branding must be prominent and official
- Mission statement must align with regulatory framework (Law No. 09-08)
- **Critical:** Mission ownership must be clearly attributed to MOH, not the platform. The platform supports MOH's mission; it does not have its own mission.
- Partnership information must be clear and transparent
- Legal pages (Terms, Privacy, Cookies) must be accessible

**Guidance from Dr. Samir (Business Process Validation):**
- Features should clearly communicate platform value
- CTAs should guide users to appropriate entry points (register/login)
- Partnership section should emphasize MOH collaboration

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/`
- [Design System](../../../../02-architecture/frontend/design-system.md) - Colors, typography, spacing
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Law No. 09-08
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - CNDP requirements

---

**Last Updated:** 2025-01-15  
**Status:** ✅ Complete  
**Guidance:** Created with guidance from Fatima (MOH Regulatory Requirements) & Dr. Samir (Business Process Validation)

