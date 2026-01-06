# Task 0.5.1.35: System Configuration Page Wireframe

**Status:** 🟡 In Progress  
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
│ │                                                          ││
│ │ VCI (Value Chain Intelligence)      ✓ Always Active     ││
│ │                                                          ││
│ │ ECS (Export Control System)        [Toggle: ON]        ││
│ │   Activation Period: [Start Date] to [End Date]         ││
│ │   Status: 🟢 Active                                    ││
│ │                                                          ││
│ │ CMC (Compliance Monitoring)         [Toggle: OFF]       ││
│ │   Activation Period: Not set                            ││
│ │   Status: ⚪ Inactive                                   ││
│ │   Historical Data: 📜 Available                         ││
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
│ [Cancel]                                    [Save Changes] │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### Page Header
- **Breadcrumbs:** "Home > System Configuration"
- **Title:** "System Configuration"

### Module Activation Section
- **RMM:** Always active (no toggle)
- **VCI:** Always active (no toggle)
- **ECS:** Toggle switch, activation period, status indicator
- **CMC:** Toggle switch, activation period, status indicator, historical data badge

### System Settings Section
- **General Settings:** System name, timezone
- **Notification Settings:** Email, SMS toggles
- **Security Settings:** Session timeout, password policy

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
