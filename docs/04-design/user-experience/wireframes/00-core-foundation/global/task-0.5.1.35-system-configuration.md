# Task 0.5.1.35: System Configuration Page Wireframe

**Status:** ✅ Complete  
**Route:** `/system-config` (MOH Tier 1 only)  
**File:** `task-0.5.1.35-system-configuration.png`  
**Priority:** 🔴 Critical Foundation

**Design Approach:** Modern enterprise system configuration pattern inspired by Stripe, GitHub, Linear, and shadcn/ui best practices. Professional, accessible, and optimized for regulatory compliance system administration.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Home > System Configuration                                 │
│                                                             │
│ System Configuration                                        │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Module Activation                                        ││
│ │                                                          ││
│ │ RMM (Registry Management)          ✓ Always Active     ││
│ │   Regulatory: ✓ Authorized per DMP Regulation Art. 5    ││
│ │                                                          ││
│ │ VCI (Value Chain Intelligence)      ✓ Always Active     ││
│ │   Regulatory: ✓ Authorized per DMP Regulation Art. 8    ││
│ │                                                          ││
│ │ ECS (Export Control System)        [Toggle: ON]        ││
│ │   Activation Period: [Start Date] to [End Date]         ││
│ │   Status: 🟢 Active                                    ││
│ │   Regulatory Authorization: ✓ Verified                  ││
│ │   Authorization: DMP Regulation Art. 10                  ││
│ │   Prerequisites: ✓ All regulatory requirements met      ││
│ │     ☑ Risk assessment completed                        ││
│ │     ☑ Stakeholder notification sent                    ││
│ │     ☑ Compliance verification passed                   ││
│ │   Notification Status: ✓ Stakeholders notified         ││
│ │                                                          ││
│ │ CMC (Compliance Monitoring)         [Toggle: OFF]       ││
│ │   Activation Period: Not set                            ││
│ │   Status: ⚪ Inactive                                   ││
│ │   Historical Data: 📜 Available                         ││
│ │   Regulatory Authorization: ⚠️ Verify before activation ││
│ │   Authorization: DMP Regulation Art. 12                  ││
│ │   Prerequisites: ⚠️ Incomplete                          ││
│ │     ☐ Risk assessment pending                          ││
│ │     ☐ Stakeholder notification required                 ││
│ │     ☐ Compliance verification required                  ││
│ │   [View Regulatory Requirements]                        ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ System Settings                                          ││
│ │                                                          ││
│ │ General Settings                                         ││
│ │ • System Name: [Pharmaceutical Management System]       ││
│ │ • Timezone: [UTC+3 ▼]                                  ││
│ │                                                          ││
│ │ Notification Settings                                    ││
│ │ • Email Notifications: [Toggle: ON]                     ││
│ │ • SMS Notifications: [Toggle: OFF]                      ││
│ │                                                          ││
│ │ Security Settings                                        ││
│ │ • Session Timeout: [30 minutes ▼]                      ││
│ │ • Password Policy: [View]                              ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Cloud Services Compliance (2024 Regulation)              ││
│ │                                                          ││
│ │ Provider: Supabase                                       ││
│ │ Qualification Level: [Level 2 ▼] (To be validated)    ││
│ │ Compliance Status: 🟡 In Progress                       ││
│ │                                                          ││
│ │ 🔴 Compliance Deadline: October 22, 2026                ││
│ │ Days Remaining: 290 days                                ││
│ │ Regulatory: 2024 Cloud Services Regulation Art. 15      ││
│ │                                                          ││
│ │ ⚠️ Non-Compliance Warning:                              ││
│ │   If deadline missed: System suspension, regulatory      ││
│ │   penalties, data migration required per Regulation      ││
│ │                                                          ││
│ │ Compliance Actions:                                      ││
│ │ ☑ Risk Assessment: [Status: Completed]                 ││
│ │   Regulatory Basis: 2024 Regulation Art. 12             ││
│ │   Assessment Date: 2025-01-01                           ││
│ │   Next Review: 2025-07-01                               ││
│ │                                                          ││
│ │ ☐ Qualification Validation: [Status: Pending]            ││
│ │   Regulatory Basis: 2024 Regulation Art. 10             ││
│ │   Deadline: 2025-06-01 (120 days before compliance)      ││
│ │                                                          ││
│ │ ☐ Data Residency: [Status: In Review]                   ││
│ │   Regulatory Basis: Law No. 09-08 Art. 45               ││
│ │   Requirement: All data must reside within Morocco       ││
│ │   Status: ✓ Verified (Supabase Morocco region)          ││
│ │                                                          ││
│ │ [View Compliance Details] [View Regulatory Framework]   ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Regulatory Compliance                                    ││
│ │                                                          ││
│ │ CNDP Compliance (Law No. 09-08):                        ││
│ │ Status: ✓ Compliant                                      ││
│ │ Regulatory Articles: Law No. 09-08 Art. 1-50            ││
│ │ Verification Method: External audit (CNDP)              ││
│ │ Last Compliance Review: 2024-12-01                      ││
│ │ Next Review: 2025-06-01 (6-month schedule)              ││
│ │ Compliance Details:                                      ││
│ │   • Data protection: ✓ Compliant                        ││
│ │   • Data retention: ✓ Compliant (7 years)               ││
│ │   • Data access rights: ✓ Implemented                   ││
│ │   • Consent management: ✓ Compliant                     ││
│ │                                                          ││
│ │ DMP Regulations:                                         ││
│ │ Status: ⚠️ Validation Pending                           ││
│ │ Regulatory Articles: DMP Art. 1-25                      ││
│ │ Verification Method: Internal review                    ││
│ │ Last Compliance Review: 2024-11-15                      ││
│ │ Next Review: 2025-02-15 (quarterly schedule)            ││
│ │ Non-Compliance Actions:                                  ││
│ │   ⚠️ Module activation validation pending               ││
│ │   Remediation Plan: Complete by 2025-02-01              ││
│ │                                                          ││
│ │ Regulatory Change Log:                                   ││
│ │ • 2025-01-01: DMP Regulation Art. 20 updated           ││
│ │   Effective: 2025-01-01                                 ││
│ │   Impact: Threshold reversion rules changed             ││
│ │   System Config Change: Threshold reversion updated     ││
│ │                                                          ││
│ │ • 2024-12-15: Cloud Services Regulation Art. 10 updated││
│ │   Effective: 2024-12-15                                 ││
│ │   Impact: Qualification requirements updated            ││
│ │   System Config Change: Compliance tracking updated     ││
│ │                                                          ││
│ │ [View Regulatory Framework] [View Full Change Log]     ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [Cancel]                                    [Save Changes] │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > System Configuration"
- **Title:** "System Configuration"

### Module Activation Section (Enhanced per Fatima's Requirements)
- **RMM:** Always active (no toggle)
  - **Regulatory Authorization (Fatima's Requirement):** "✓ Authorized per DMP Regulation Art. 5"
- **VCI:** Always active (no toggle)
  - **Regulatory Authorization (Fatima's Requirement):** "✓ Authorized per DMP Regulation Art. 8"
- **ECS:** Toggle switch, activation period, status indicator
  - **Regulatory Authorization Check (Fatima's Requirement):**
    - "✓ Authorized per [Regulation Article X]" or "⚠️ Verify before activation"
    - "Authorization: [Regulation Article]"
  - **Prerequisites Checklist (Fatima's Requirement):**
    - "✓ All regulatory requirements met" or "⚠️ Incomplete"
    - Checklist items:
      - ☑ Risk assessment completed
      - ☑ Stakeholder notification sent
      - ☑ Compliance verification passed
  - **Notification Status (Fatima's Requirement):** "✓ Stakeholders notified" or "⚠️ Notification required"
  - **Block Activation:** Cannot activate until all checks pass
- **CMC:** Toggle switch, activation period, status indicator, historical data badge
  - **Same regulatory authorization and prerequisites as ECS**
  - **Link:** "[View Regulatory Requirements]" if prerequisites incomplete

### System Settings Section
- **General Settings:** System name, timezone
- **Notification Settings:** Email, SMS toggles
- **Security Settings:** Session timeout, password policy

### Cloud Services Compliance Section (Enhanced per Fatima's Requirements)
- **Provider:** Supabase (cloud service provider)
- **Qualification Level:** Dropdown (Level 1 / Level 2) - To be validated
- **Compliance Status:** Status indicator (🟡 In Progress, ✓ Compliant, ⚠️ Pending)
- **Compliance Deadline (Fatima's Requirement):**
  - **Date:** October 22, 2026 (24 months from enactment)
  - **Days Remaining:** Countdown display with urgency indicator (🔴 if <90 days, 🟡 if 90-180 days, 🟢 if >180 days)
  - **Regulatory Basis:** "Regulatory: 2024 Cloud Services Regulation Art. 15"
- **Non-Compliance Warning (Fatima's Requirement):**
  - Display prominently with red border if <90 days remaining
  - "⚠️ Non-Compliance Warning: If deadline missed: [regulatory consequences]"
  - Shows consequences: System suspension, regulatory penalties, data migration required
- **Compliance Actions (Enhanced per Fatima's Requirements):**
  - **Risk Assessment:**
    - Checkbox with status
    - **Regulatory Basis:** "Regulatory Basis: 2024 Regulation Art. 12"
    - Assessment date and next review date displayed
  - **Qualification Validation:**
    - Checkbox with status
    - **Regulatory Basis:** "Regulatory Basis: 2024 Regulation Art. 10"
    - Deadline tracking: "[X] days before compliance deadline"
  - **Data Residency:**
    - Checkbox with status
    - **Regulatory Basis:** "Regulatory Basis: Law No. 09-08 Art. 45"
    - Requirement explanation: "All data must reside within Morocco"
    - Compliance verification status displayed
- **Actions:** Links to compliance details and regulatory framework
- **Display:** Card section with clear status indicators
- **Styling:** Status colors (green for complete, yellow for in progress, red for pending)

### Regulatory Compliance Section (Enhanced per Fatima's Requirements)
- **CNDP Compliance (Law No. 09-08):**
  - Status indicator (✓ Compliant / ⚠️ In Review)
  - **Regulatory Articles (Fatima's Requirement):** "Regulatory Articles: Law No. 09-08 Art. 1-50"
  - **Compliance Verification Method (Fatima's Requirement):** "Verification Method: External audit (CNDP)"
  - **Review Schedule (Fatima's Requirement):**
    - "Last Compliance Review: [date]"
    - "Next Review: [date] ([schedule])"
  - **Compliance Details (Fatima's Requirement):** Expandable section showing:
    - Data protection status
    - Data retention compliance (7 years)
    - Data access rights implementation
    - Consent management compliance
- **DMP Regulations:**
  - Status indicator (✓ Compliant / ⚠️ Validation Pending)
  - **Regulatory Articles (Fatima's Requirement):** "Regulatory Articles: DMP Art. 1-25"
  - **Compliance Verification Method (Fatima's Requirement):** "Verification Method: Internal review"
  - **Review Schedule (Fatima's Requirement):**
    - "Last Compliance Review: [date]"
    - "Next Review: [date] ([schedule])"
  - **Non-Compliance Actions (Fatima's Requirement):** If non-compliant, show:
    - ⚠️ Specific non-compliance items
    - Remediation plan with deadline
- **Regulatory Change Log (Fatima's Requirement):**
  - List of regulatory framework updates with:
    - Date of change
    - Regulation/article updated
    - Effective date
    - Impact description (how many records affected, what changed)
    - System configuration changes made in response
  - Link to "View Full Change Log" for complete history
- **Regulatory Framework Link:** Link to comprehensive regulatory framework document
- **Display:** Card section showing overall compliance status
- **Styling:** Status badges with color coding

### Action Buttons
- **Cancel:** Discard changes
- **Save Changes:** Save configuration

---

## Annotations

### Blue (Interactions)
- **Click toggle** → Activate/deactivate module
- **Click date picker** → Select activation period
- **Click "Save Changes"** → Save configuration

### Orange (Validation)
- **Date range:** End date must be after start date
- **Required fields:** System name required

### Green (States)
- **Module active:** Green indicator, toggle ON
- **Module inactive:** Gray indicator, toggle OFF
- **Changes saved:** Success notification

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/system-config`
- [Historical Data Routing Proposal](../../../../02-architecture/frontend/historical-data-routing-proposal.md)
- [Regulatory Framework](../../../../03-governance/regulatory-framework.md) - Comprehensive regulatory reference including Cloud Services Regulation (2024) and Law No. 09-08
- [Compliance Requirements](../../../../03-governance/compliance-requirements.md) - Detailed compliance requirements including CNDP and cloud services compliance
- [Regulatory Policies](../../../../03-governance/regulatory-policies.md) - Regulatory policies and guidelines

---

## Design System References

### Components Used
- **Card Component:** Configuration section cards (shadcn/ui card)
- **Form Component:** Configuration forms (shadcn/ui form)
- **Input Component:** Text inputs, number inputs (shadcn/ui input)
- **Select Component:** Dropdown selects (shadcn/ui select)
- **Switch Component:** Toggle switches (shadcn/ui switch)
- **Button Component:** Save, reset, cancel buttons (shadcn/ui button)
- **Badge Component:** Module status, feature badges (shadcn/ui badge)
- **Icon Component:** Section icons, status icons (Lucide React via shadcn/ui)
- **Skeleton Component:** Loading states (shadcn/ui skeleton)
- **Tooltip Component:** Hover tooltips, help text (shadcn/ui tooltip)
- **Alert Component:** Success, error, warning alerts (shadcn/ui alert)
- **Tabs Component:** Configuration tabs (shadcn/ui tabs)

### Design Inspiration References
- **Stripe Dashboard:** https://dashboard.stripe.com - Professional system configuration patterns
- **GitHub:** https://github.com - Clean settings, configuration management
- **Linear App:** https://linear.app - Modern settings, smooth interactions
- **shadcn/ui Components:** https://ui.shadcn.com - Component patterns
- **AWS Console/Azure Portal:** Enterprise system configuration patterns for reference

### Colors (From Design System)
- **Background:** #ffffff (white) - Clean, professional
- **Card Background:** #ffffff (white) - Card background
- **Card Border:** #e5e7eb (border-default) - Subtle separation
- **Section Border:** #e5e7eb (border-default) - Section separation
- **Text Primary:** #111827 (text-primary) - High contrast
- **Text Secondary:** #6b7280 (text-secondary)
- **Text Tertiary:** #9ca3af (text-tertiary)
- **Focus Ring:** #3b82f6 (primary-500), 2px outline
- **Module Status Colors:**
  - Active: #22c55e (success-500) - Green for active
  - Inactive: #9ca3af (text-tertiary) - Gray for inactive
  - Pending: #f59e0b (warning-500) - Orange for pending
- **Input States:**
  - Default: #e5e7eb (border-default)
  - Focus: #3b82f6 (primary-500)
  - Error: #ef4444 (error-500)
  - Success: #22c55e (success-500)

### Typography (From Design System)
- **Page Title:** 30px, font-weight: 700 (h1)
- **Section Title:** 18px, font-weight: 600 (h2)
- **Field Label:** 14px, font-weight: 600
- **Field Description:** 12px, font-weight: 400
- **Input Text:** 14px, font-weight: 400
- **Button Text:** 14px, font-weight: 500
- **Status Badge:** 11px, font-weight: 600

### Spacing (8px Grid System)
- **Page Padding:** 24px (3 × 8px) - Comfortable page edge spacing
- **Card Padding:** 24px (3 × 8px) - Card internal spacing
- **Section Padding:** 16px (2 × 8px) - Section internal spacing
- **Field Padding:** 12px vertical (1.5 × 8px) - Field spacing
- **Gap:** 16px (2 × 8px) between sections
- **Button Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)
- **Input Padding:** 12px horizontal (1.5 × 8px), 8px vertical (1 × 8px)

### Transitions & Animations
- **Card Hover:** 150ms ease-in-out
- **Input Focus:** 200ms ease-in-out
- **Switch Toggle:** 200ms ease-in-out
- **Button Hover:** 150ms ease-in-out
- **Tab Switch:** 200ms ease-in-out
- **Save Success:** 200ms fade-in

### Accessibility (WCAG 2.1 AA Compliance)
- **Color Contrast:** Minimum 4.5:1 for text, 3:1 for UI components
- **Focus Indicators:** 2px solid outline, #3b82f6 (primary-500), 2px offset
- **Keyboard Navigation:** Full keyboard support (Tab, Enter, Arrow keys, Escape)
- **Screen Reader Support:** ARIA labels, roles, and descriptions
- **Touch Targets:** Minimum 40px × 40px for all interactive elements
- **ARIA Labels:** Descriptive labels for all form fields and actions
- **Form Validation:** Clear error messages, required field indicators
- **Skip Links:** "Skip to main content" link for keyboard users

---

## Related Documents

- [Routing Structure](../../../../02-architecture/frontend/routing-structure.md) - Route: `/system-config`
- [UI Component Specifications](../../../../02-architecture/frontend/ui-component-specifications.md) - Form, Input, Switch components
- [Form Design Patterns](../../../../02-architecture/frontend/form-design-patterns.md) - Form validation and UX patterns

---

## Industry Best Practices Implementation

### Performance Optimizations
- **Lazy Loading:** Configuration sections load on demand (tabs)
- **Debounced Input:** Debounce input changes (500ms) before validation
- **CSS Containment:** Use `contain: layout style paint` for form sections
- **Will-Change:** Hint browser about animations (`will-change: transform, opacity`)
- **Data Fetching:** Single API call for configuration data
- **Caching:** Cache configuration data with appropriate TTL (5-10 minutes)

### Modern CSS Features
- **CSS Grid/Flexbox:** Use flexbox for form layout (flexible, responsive)
- **CSS Custom Properties:** Use design system tokens for colors/spacing
- **Backdrop Filter:** Subtle blur effects for modals/overlays (if supported, graceful degradation)
- **CSS Transitions:** Smooth animations for all state changes
- **Container Queries:** Consider for component-level responsive design (future enhancement)

### State Management
- **Configuration State:** Track form values, validation state, dirty state, save status
- **Real-time Updates:** Not applicable (admin-only configuration)
- **Local Storage:** Cache form draft state, user preferences
- **Optimistic Updates:** Show success state immediately, sync with server
- **Error Recovery:** Retry failed API calls with exponential backoff

### Error Handling
- **Loading States:** Skeleton loaders for configuration sections while loading
- **Error Boundaries:** Graceful degradation if configuration fails to load
- **Retry Logic:** Automatic retry with exponential backoff
- **Offline Support:** Cache configuration for offline access (read-only)
- **Fallback:** Default empty state if all else fails
- **Form Validation:** Client-side and server-side validation, clear error messages

### Browser Support
- **Modern Browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Progressive Enhancement:** Core functionality works without JS (basic form display)
- **Polyfills:** For older browsers if needed (Intersection Observer, ResizeObserver, etc.)

### Testing Considerations
- **Visual Regression:** Test configuration at different screen sizes
- **Responsive Testing:** Test at key breakpoints (768px, 1024px, 1920px)
- **Accessibility Testing:** Screen reader, keyboard navigation, color contrast
- **Performance Testing:** Lighthouse scores, Core Web Vitals, Time to Interactive
- **Cross-browser Testing:** Test forms, inputs, switches, validation
- **Data Loading Testing:** Test with slow network, empty states, error states
- **Form Validation Testing:** Test all validation rules, error messages, success states

### Security Considerations
- **XSS Prevention:** Sanitize all configuration input values
- **CSRF Protection:** For all state-changing actions (save, reset)
- **Data Isolation:** Ensure configuration data isolation (RLS)
- **Permission Checks:** Verify user permissions before displaying configuration (MOH Tier 1 only)
- **Input Validation:** Server-side validation for all inputs
- **Audit Logging:** Log all configuration changes to audit trail

### Real-time Features
- **Not Applicable:** Configuration is admin-only and does not require real-time updates

### System Configuration-Specific Optimizations
- **Form Rendering:** Efficient form rendering, conditional field display
- **Validation Optimization:** Client-side validation, server-side validation, debounced validation
- **Save Optimization:** Optimistic updates, error recovery, success feedback
- **Draft Management:** Auto-save drafts, restore on page reload
- **Code Splitting:** Split configuration code by section (modules, thresholds, notifications)

### User Experience Enhancements
- **Keyboard Shortcuts:** 
  - `s` - Save configuration
  - `r` - Reset to defaults
  - `Esc` - Cancel changes
  - `Tab` - Navigate between fields
  - `Enter` - Submit form (if valid)
- **Quick Actions:** Hover actions (reset, help, info)
- **Form Validation:** Real-time validation feedback, clear error messages
- **Success Feedback:** Toast notifications, success badges
- **Draft Indicators:** Visual indicators for unsaved changes
- **Help Text:** Tooltips, inline help, documentation links
- **Confirmation Dialogs:** Confirm destructive actions (reset, disable module)

---

**Last Updated:** 2025-01-01  
**Status:** 🟡 Ready for Review  
**Design Approach:** Modern enterprise system configuration pattern (Stripe/GitHub/Linear/shadcn/ui inspired)
