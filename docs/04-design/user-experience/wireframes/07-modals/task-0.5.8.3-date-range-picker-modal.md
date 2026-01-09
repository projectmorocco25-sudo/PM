# Task 0.5.8.3: Date Range Picker Modal Wireframe

**Status:** 🟡 In Progress  
**Route:** Modal overlay (reusable pattern, no specific route)  
**File:** `task-0.5.8.3-date-range-picker-modal.png`  
**Priority:** 🟢 Analytics & Historical Data (Reusable UI Patterns)

**Design Approach:** Reusable date range picker modal with calendar interface, quick filters, and timezone display. Professional, accessible, and optimized for filtering historical data and reports.

**Guidance:** Fatima (MOH Regulatory Requirements) - Date range picker critical for regulatory audit queries and 7-year retention compliance. Dr. Samir (Business Process Validation) - Efficient date selection improves data analysis workflow.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [Modal Overlay - Dark background overlay 80% opacity]     │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Select Date Range                                [✕]  │ │
│  │                                                       │ │
│  │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ Quick Filters                                     │ │ │
│  │ │                                                   │ │ │
│  │ │ [Last 7 Days] [Last 30 Days] [Last 3 Months]     │ │ │
│  │ │ [Last Year] [Last 3 Years] [Last 7 Years]        │ │ │
│  │ │ [Custom Range]                                    │ │ │
│  │ └───────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ Calendar Interface                                │ │ │
│  │ │                                                   │ │ │
│  │ │   December 2024          →  January 2025        │ │ │
│  │ │                                                   │ │ │
│  │ │   Sun Mon Tue Wed Thu Fri Sat                    │ │ │
│  │ │   ─── ─── ─── ─── ─── ─── ───                    │ │ │
│  │ │   1   2   3   4   5   6   7                      │ │ │
│  │ │   8   9   10  11  12  13  14                     │ │ │
│  │ │   15  16  17  18  19  20  21                     │ │ │
│  │ │   22  23  24  25  26  27  28                     │ │ │
│  │ │   29  30  31  1   2   3   4                      │ │ │
│  │ │                                                   │ │ │
│  │ │   Selected: Dec 1, 2024 - Dec 31, 2024           │ │ │
│  │ └───────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ Date Input Fields                                 │ │ │
│  │ │                                                   │ │ │
│  │ │ From: [2024-12-01]    To: [2024-12-31]            │ │ │
│  │ │                                                   │ │ │
│  │ │ Timezone: Africa/Casablanca (UTC+1)              │ │ │
│  │ └───────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │ [Clear]                                  [Apply]     │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Features

### Quick Filters
- **Preset Ranges:** Last 7 Days, 30 Days, 3 Months, Year, 3 Years, 7 Years
- **Custom Range:** Manual date selection
- **Active Filter:** Highlighted when selected
- **One-Click Apply:** Apply range with single click

### Calendar Interface
- **Dual Month View:** Show current and next month (optional)
- **Date Selection:** Click start date, then end date
- **Selected Range:** Highlighted range between start and end
- **Navigation:** Previous/Next month arrows
- **Today Indicator:** Highlight current date
- **Disabled Dates:** Gray out invalid dates (future, beyond 7 years)

### Date Input Fields
- **From/To Fields:** Manual date entry with format validation
- **Calendar Integration:** Click field to open calendar at that month
- **Format:** YYYY-MM-DD (ISO format)
- **Timezone Display:** Show Morocco timezone (Africa/Casablanca, UTC+1)

### Actions
- **Clear:** Reset to no selection
- **Apply:** Apply selected date range and close modal
- **Cancel (X):** Close modal without applying changes

---

## State Variations

### Date Range Selected
```
│  │ │   Selected: Dec 1, 2024 - Dec 31, 2024           │ │ │
│  │ │   [Range highlighted in calendar]                 │ │ │
│  │ │   From: [Dec 1, 2024]    To: [Dec 31, 2024]      │ │ │
```

### Quick Filter Applied
```
│  │ │ Quick Filters                                     │ │ │
│  │ │                                                   │ │ │
│  │ │ [Last 30 Days] ✓ (active)                        │ │ │
│  │ │ [Last 3 Months]                                  │ │ │
│  │ │                                                   │ │ │
│  │ │ [Auto-populated calendar selection]              │ │ │
```

### Invalid Range (End Before Start)
```
│  │ │ From: [2024-12-31]    To: [2024-12-01]            │ │ │
│  │ │                                                   │ │ │
│  │ │ ⚠️ End date must be after start date              │ │ │
│  │ │                                                   │ │ │
│  │ │ [Apply button disabled]                          │ │ │
```

### Loading State (Validating Range)
```
│  │ │ [⏳ Validating date range...]                     │ │ │
│  │ │                                                   │ │ │
│  │ │ [Apply button disabled]                          │ │ │
```

---

## Responsive Behavior

### Desktop (> 1024px)
- Full modal width (max 700px)
- Dual month calendar view
- Side-by-side date inputs

### Tablet (768px - 1024px)
- Modal width (90% viewport)
- Single month calendar view
- Stacked date inputs

### Mobile (< 768px)
- Modal width (95% viewport, full screen feel)
- Single month calendar view
- Touch-optimized date selection
- Stacked date inputs

---

## Interactions

1. **Click Quick Filter:** Apply preset range, update calendar
2. **Click Calendar Date:** Select start or end date
3. **Type in Input Field:** Manual date entry with validation
4. **Click Apply:** Apply date range and close modal
5. **Click Clear:** Reset date selection
6. **Click X/ESC:** Close modal without applying

---

## Accessibility

- **Keyboard Navigation:** Tab through elements, Arrow keys in calendar, Enter to select
- **Screen Reader:** Announce selected dates, range, timezone
- **Focus Management:** Focus on start date field on open
- **ARIA Labels:** Calendar role, date selection states, timezone information

---

## Related Wireframes

- **Usage:** Used in filters for historical data, reports, audit logs
- **Examples:** Submission history filters, export history, compliance scores history
- **Integration:** All pages with date range filtering

---

**Created:** 2025-01-15  
**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Reviewers:** Fatima (MOH Regulatory Requirements), Dr. Samir (Business Process Validation)

