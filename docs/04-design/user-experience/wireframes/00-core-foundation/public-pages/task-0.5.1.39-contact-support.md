# Task 0.5.1.39: Contact Support Page Wireframe

**Status:** ✅ Complete  
**Route:** `/support/contact`  
**File:** `task-0.5.1.39-contact-support.png`  
**Priority:** 🟢 Global & Help Pages (Priority 7)

**Design Approach:** Professional government platform contact support page with contact form, support channels, response time info, and escalation procedures. Accessible, comprehensive, and regulatory-compliant.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ [MOH Logo]                    [About] [Support] [Status]   │
│                                        [Login] [Register]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Home > Support > Contact Support                           │
│                                                             │
│  Contact Support                                            │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Contact Form                                       │   │
│  │                                                     │   │
│  │  Name *                                             │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  │  Email *                                            │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  │  Company (Optional)                                 │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  │  Subject *                                          │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  │  Category *                                         │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ [Select category...]                ▼        │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  │  Message *                                          │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │                                               │   │   │
│  │  │                                               │   │   │
│  │  │                                               │   │   │
│  │  │                                               │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  │  Attachments (Optional, max 5MB)                    │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ [Choose File] No file chosen                │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  │  ☐ I agree to the Terms of Service                 │   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │             Submit Request                   │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Support Channels                                   │   │
│  │                                                     │   │
│  │  Email Support                                      │   │
│  │  [support@moh.gov]                                  │   │
│  │  Response time: 24-48 hours                         │   │
│  │                                                     │   │
│  │  Phone Support                                      │   │
│  │  [+123-456-7890]                                    │   │
│  │  Hours: Monday - Friday, 9:00 AM - 5:00 PM         │   │
│  │                                                     │   │
│  │  Office Address                                     │   │
│  │  Ministry of Health                                 │   │
│  │  [Address Line 1]                                   │   │
│  │  [Address Line 2]                                   │   │
│  │  [City, Country]                                    │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Escalation Procedures                              │   │
│  │                                                     │   │
│  │  For urgent regulatory issues, please contact      │   │
│  │  support immediately via phone during support       │   │
│  │  hours. After-hours emergencies should be reported  │   │
│  │  through the designated emergency contact channel.  │   │
│  │                                                     │   │
│  │  Regulatory compliance issues requiring immediate   │   │
│  │  attention will be prioritized and escalated        │   │
│  │  according to MOH protocols.                        │   │
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
- **Breadcrumbs:** "Home > Support > Contact Support"
- **Title:** "Contact Support"
  - **Typography:** 36px (desktop), 28px (mobile), font-weight: 700, color: #111827
- **Spacing:** 24px below header navigation

### Contact Form Section
- **Max Width:** 700px (desktop), full width (mobile)
- **Background:** White (#ffffff)
- **Border:** 1px solid #e5e7eb
- **Border Radius:** 8px
- **Padding:** 32px
- **Centered:** Yes

**Form Fields:**
- **Name:** Required, text input
- **Email:** Required, email input
- **Company:** Optional, text input
- **Subject:** Required, text input
- **Category:** Required, dropdown select
  - Options: General Inquiry, Technical Issue, Account Question, Submission Help, Compliance Question, Other
- **Message:** Required, textarea (min 5 rows)
- **Attachments:** Optional, file input (max 5MB, accepts: PDF, DOC, DOCX, XLS, XLSX, images)
- **Terms Checkbox:** Required, must agree to Terms of Service
- **Submit Button:** Primary button, full width

### Support Channels Section
- **Title:** "Support Channels"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Background:** #f9fafb (light gray)
- **Border:** 1px solid #e5e7eb
- **Border Radius:** 8px
- **Padding:** 32px
- **Content:**
  - Email address (clickable, opens email client)
  - Phone number (clickable, opens phone dialer)
  - Office address
  - Response times/hours

### Escalation Procedures Section
- **Title:** "Escalation Procedures"
  - **Typography:** 24px, font-weight: 600, color: #111827
- **Background:** #eff6ff (blue-50)
- **Border:** 1px solid #3b82f6 (blue-200)
- **Border Radius:** 8px
- **Padding:** 32px
- **Content:** Information about urgent issues and escalation protocols

---

## Annotations

### Blue (Interactions)
- **Fill form fields** → Real-time validation
- **Select category** → Dropdown opens with options
- **Click "Choose File"** → File picker opens
- **Click email/phone** → Open email client or phone dialer
- **Click "Submit Request"** → Submit form, show loading state, validate inputs
- **Check terms checkbox** → Enable submit button

### Orange (Validation)
- **Required field validation:** Show error if required field empty
- **Email format validation:** Show error if email format invalid
- **File size validation:** Show error if file > 5MB
- **File type validation:** Show error if file type not accepted
- **Terms acceptance:** Submit button disabled until checked

### Green (States)
- **Loading state:** Button shows spinner, form disabled, text "Submitting..."
- **Success state:** Show success message, form reset or redirect to confirmation
- **Error state:** Show error message, form remains visible
- **Focus state:** Input border changes to primary blue (#3b82f6)

---

## Responsive Behavior

### Desktop (1024px+)
- Form: Max-width 700px, centered
- Support channels: Full width, max-width 900px, centered
- Sections: Stacked vertically

### Tablet (768px - 1023px)
- Form: Full width minus 48px margins
- Support channels: Full width minus margins
- Sections: Stacked vertically

### Mobile (<768px)
- Form: Full width minus 32px margins
- Support channels: Full width minus 32px margins
- Sections: Stacked vertically
- Typography: Smaller sizes

---

## Design System References

### Components Used
- **Input Component:** From UI Component Specifications
  - Variant: Default
  - Size: Medium (40px height)
  - States: Default, Focus, Error
- **Textarea Component:** From UI Component Specifications
  - Variant: Default
  - Min rows: 5
  - States: Default, Focus, Error
- **Select Component:** From UI Component Specifications
  - Variant: Default
  - Size: Medium (40px height)
- **File Input Component:** From UI Component Specifications
  - Variant: Default
  - Max size: 5MB
- **Checkbox Component:** From UI Component Specifications
  - Size: Medium
  - States: Unchecked, Checked
- **Button Component:** From UI Component Specifications
  - Variant: Primary
  - Size: Medium (40px height)
  - States: Default, Hover, Loading, Disabled

### Colors
- **Background Primary:** #ffffff (white)
- **Background Secondary:** #f9fafb (gray-50)
- **Background Info:** #eff6ff (blue-50)
- **Text Primary:** #111827 (gray-900)
- **Text Secondary:** #4b5563 (gray-600)
- **Link Color:** #2563eb (blue-600)
- **Error Border:** #ef4444 (error-500)
- **Border:** #e5e7eb (gray-200)

### Typography
- **Page Title:** 36px (desktop), 28px (mobile), font-weight: 700
- **Section Title:** 24px, font-weight: 600
- **Label:** 14px, font-weight: 500
- **Input Text:** 16px
- **Body Text:** 16px, line-height: 1.6

### Spacing
- **Field Spacing:** 24px between fields
- **Section Spacing:** 48px between sections
- **Form Padding:** 32px

---

## Accessibility

### Keyboard Navigation
- **Tab:** Move through all form fields
- **Enter:** Submit form when on button
- **Space:** Toggle checkbox, open dropdown

### Screen Reader Support
- **Form Labels:** Associated with inputs via `htmlFor`
- **Required Indicator:** Announced as "required" by screen reader
- **Error Messages:** Announced via ARIA live region
- **File Input:** Descriptive label for file upload

### Focus Management
- **Visible Focus:** Clear focus indicator (2px outline, primary blue)
- **Focus Order:** Name → Email → Company → Subject → Category → Message → Attachments → Checkbox → Submit

---

## Regulatory Compliance Notes

**Guidance from Fatima (MOH Regulatory Requirements):**
- Contact information must be official MOH support channels
- Escalation procedures must align with MOH protocols
- Response times must be documented and transparent
- Privacy policy must be referenced for data handling

**Guidance from Dr. Samir (Business Process Validation):**
- Form categories should match common support request types
- Support channels should provide multiple contact options
- Escalation procedures should be clear for urgent business issues

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/support/contact`
- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md) - Form patterns and validation
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Input, Button, Checkbox components
- [Design System](../../../../02-architecture/frontend/design-system.md) - Colors, typography, spacing
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - CNDP privacy requirements

---

**Last Updated:** 2025-01-15  
**Status:** ✅ Complete  
**Guidance:** Created with guidance from Fatima (MOH Regulatory Requirements) & Dr. Samir (Business Process Validation)

