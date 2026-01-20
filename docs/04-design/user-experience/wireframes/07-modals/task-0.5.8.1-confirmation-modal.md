# Task 0.5.8.1: Confirmation Modal Wireframe

**Status:** ✅ Complete  
**Route:** Modal overlay (reusable pattern, no specific route)  
**File:** `task-0.5.8.1-confirmation-modal.png`  
**Priority:** 🟢 Analytics & Historical Data (Reusable UI Patterns)

**Design Approach:** Reusable confirmation modal for delete, archive, approve, reject actions. Clear confirmation message with cancel/confirm buttons. Professional, accessible, and optimized for preventing accidental actions.

**Guidance:** Fatima (MOH Regulatory Requirements) - Confirmation modals critical for preventing accidental regulatory actions. Dr. Samir (Business Process Validation) - Clear confirmations reduce user errors and improve workflow reliability.

---

## Wireframe Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [Modal Overlay - Dark background overlay 80% opacity]     │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Confirm Action                                   [✕]  │ │
│  │                                                       │ │
│  │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ ⚠️ Warning Icon (for destructive actions)         │ │ │
│  │ └───────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │ [Confirmation Message Text]                          │ │
│  │                                                       │ │
│  │ Example messages:                                     │ │
│  │ • "Are you sure you want to delete this submission?" │ │
│  │ • "Are you sure you want to archive this conversation?"│ │
│  │ • "Do you want to approve this enforcement action?"  │ │
│  │ • "Do you want to reject this export request?"       │ │
│  │                                                       │ │
│  │ [Additional context or details if needed]            │ │
│  │                                                       │ │
│  │ ┌───────────────────────────────────────────────────┐ │ │
│  │ │ Action Details (Optional):                         │ │ │
│  │ │ • Item: Submission #2024-001                       │ │ │
│  │ │ • Status: Draft                                    │ │ │
│  │ │ • This action cannot be undone.                    │ │ │
│  │ │                                                     │ │ │
│  │ │ Regulatory Notice (for enforcement/approval actions):│ │ │
│  │ │ ⚠️ This action will be logged in the audit trail  │ │ │
│  │ │    and retained for 7 years per regulatory        │ │ │
│  │ │    requirements. Legal basis: DMP Art. [X]        │ │ │
│  │ └───────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │ [Cancel]                    [Confirm / Delete / ...]  │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Features

### Modal Overlay
- **Background:** Dark overlay (80% opacity) covering entire screen
- **Position:** Centered modal, responsive width (max 500px for confirmations)
- **Dismissible:** ESC key or click outside (for non-destructive actions)
- **Focus Trap:** Keyboard navigation trapped within modal

### Confirmation Message
- **Icon:** Warning icon (⚠️) for destructive actions, info icon (ℹ️) for informational
- **Message:** Clear, concise confirmation question
- **Context:** Additional details about the action (item name, status, etc.)
- **Irreversible Warning:** "This action cannot be undone" for destructive actions

### Action Buttons
- **Cancel Button:** Secondary button, left-aligned
- **Confirm Button:** Primary button (danger variant for destructive actions), right-aligned
- **Button Labels:** Context-specific (Delete, Archive, Approve, Reject, Confirm, etc.)
- **Loading State:** Disable buttons and show spinner during action

---

## State Variations

### Delete Confirmation
```
│  │ Delete Submission                              [✕]  │ │
│  │                                                       │ │
│  │ ⚠️ Are you sure you want to delete this submission?  │ │
│  │                                                       │ │
│  │ This will permanently delete:                         │ │
│  │ • Submission #2024-001                                │ │
│  │ • Status: Draft                                       │ │
│  │                                                       │ │
│  │ ⚠️ This action cannot be undone.                     │ │
│  │                                                       │ │
│  │ [Cancel]                               [Delete]      │ │
```

### Archive Confirmation
```
│  │ Archive Conversation                           [✕]  │ │
│  │                                                       │ │
│  │ Are you sure you want to archive this conversation?  │ │
│  │                                                       │ │
│  │ This will move the conversation to archived status.   │ │
│  │ You can restore it later.                             │ │
│  │                                                       │ │
│  │ [Cancel]                              [Archive]      │ │
```

### Approve Confirmation
```
│  │ Approve Enforcement Action                    [✕]  │ │
│  │                                                       │ │
│  │ ℹ️ Do you want to approve this enforcement action?    │ │
│  │                                                       │ │
│  │ Action: Warning                                       │ │
│  │ Company: ABC Pharmaceuticals                          │ │
│  │ Amount: $1,000                                        │ │
│  │                                                       │ │
│  │ [Cancel]                               [Approve]     │ │
```

### Loading State (During Action)
```
│  │ Delete Submission                              [✕]  │ │
│  │                                                       │ │
│  │ ⚠️ Are you sure you want to delete this submission?  │ │
│  │                                                       │ │
│  │ [Cancel]                      [⏳ Deleting...]        │ │
│  │                                                       │ │
│  │ [Buttons disabled during action]                     │ │
```

### Error State (Action Failed)
```
│  │ Delete Submission                              [✕]  │ │
│  │                                                       │ │
│  │ ⚠️ Error deleting submission                          │ │
│  │                                                       │ │
│  │ Unable to delete submission. Please try again.        │ │
│  │                                                       │ │
│  │ [Close]                          [Try Again]         │ │
```

---

## Responsive Behavior

### Desktop (> 1024px)
- Centered modal (max 500px width)
- Full message visible
- Side-by-side buttons

### Tablet (768px - 1024px)
- Modal width (90% viewport, max 500px)
- Stacked layout if needed

### Mobile (< 768px)
- Modal width (95% viewport)
- Stacked buttons (full width)
- Message text optimized for mobile

---

## Interactions

1. **Click Cancel:** Dismiss modal, return to previous state
2. **Click Confirm/Delete/etc.:** Execute action, show loading state
3. **ESC Key:** Dismiss modal (if allowed)
4. **Click Outside:** Dismiss modal (if allowed, for non-destructive actions)
5. **Tab Navigation:** Focus trap within modal

---

## Usage Patterns

### Destructive Actions (Delete, Remove)
- **Icon:** Warning (⚠️)
- **Button:** Danger variant (red)
- **Warning:** "This action cannot be undone"
- **Dismissible:** ESC only, click outside disabled

### Reversible Actions (Archive, Deactivate)
- **Icon:** Info (ℹ️)
- **Button:** Primary variant
- **Note:** "You can restore it later" or similar
- **Dismissible:** ESC and click outside allowed

### Approval Actions (Approve, Confirm)
- **Icon:** Info (ℹ️) or checkmark (✓)
- **Button:** Primary variant (green for approve)
- **Context:** Show what is being approved
- **Dismissible:** ESC and click outside allowed

### Rejection Actions (Reject, Decline)
- **Icon:** Warning (⚠️) or X (✕)
- **Button:** Secondary variant (red for reject)
- **Context:** Show what is being rejected
- **Dismissible:** ESC and click outside allowed

---

## Accessibility

- **Keyboard Navigation:** Tab to buttons, Enter to confirm, ESC to cancel
- **Screen Reader:** Announce modal title, confirmation message, action details
- **Focus Management:** Focus on confirm button on open (or cancel for destructive)
- **ARIA Labels:** Modal role, alert role for warnings, button labels

---

## Related Wireframes

- **Usage:** Used across all modules for confirmation dialogs
- **Examples:** Delete submission, archive conversation, approve action, reject request
- **Integration:** All detail pages and list pages that have actions

---

**Created:** 2025-01-15  
**Last Updated:** 2025-01-15  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)  
**Reviewers:** Fatima (MOH Regulatory Requirements), Dr. Samir (Business Process Validation)

