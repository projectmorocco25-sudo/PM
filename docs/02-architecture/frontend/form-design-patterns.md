# Form Design Patterns - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines form design patterns, validation patterns, and user experience guidelines for all forms in the PM platform.

**Last Updated:** 2025-12-31  
**Status:** ✅ Complete (Phase 0, Frontend UI/UX Gap Resolution)  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)

## Overview

Forms are critical to the PM platform, handling submissions (AAMS, MSQ, WSL, export requests), registry updates, approvals, and configurations. This document defines consistent patterns for form design, validation, and user experience.

## Form Design Principles

1. **Clarity:** Clear labels, instructions, and error messages
2. **Efficiency:** Minimize steps, auto-save drafts, smart defaults
3. **Validation:** Real-time validation with helpful error messages
4. **Accessibility:** Keyboard navigation, screen reader support
5. **Security:** Client-side validation + server-side enforcement

## Form Layout Patterns

### Single Column Form

**Use Case:** Simple forms, mobile-first, focused workflows

**Layout:**
- Full-width fields
- Vertical stacking
- Consistent spacing (24px between fields)

**Example:**
```
┌─────────────────────────────┐
│ Company Name *              │
│ [________________________]  │
│                             │
│ Registration Number *       │
│ [________________________]  │
│                             │
│ [Submit] [Cancel]            │
└─────────────────────────────┘
```

### Multi-Column Form

**Use Case:** Complex forms, desktop optimization, related fields

**Layout:**
- 2-column grid (desktop)
- 1-column (tablet/mobile)
- Related fields grouped

**Example:**
```
┌─────────────────────────────────────┐
│ Company Name *    Registration *    │
│ [_____________]   [_____________]   │
│                                     │
│ Address Line 1 *  City *            │
│ [_____________]   [_____________]   │
│                                     │
│ [Submit] [Cancel]                   │
└─────────────────────────────────────┘
```

### Sectioned Form

**Use Case:** Long forms, logical grouping, multi-step workflows

**Layout:**
- Sections with headers
- Collapsible sections (optional)
- Progress indicator (for multi-step)

**Example:**
```
┌─────────────────────────────┐
│ Company Information         │
│ ─────────────────────────── │
│ Name *                      │
│ [________________________]  │
│                             │
│ Contact Information         │
│ ─────────────────────────── │
│ Email *                     │
│ [________________________]  │
│                             │
│ [Next] [Cancel]             │
└─────────────────────────────┘
```

## Field Patterns

### Required Field Indicator

**Pattern:** Asterisk (*) after label, red color

**Implementation:**
```tsx
<FormField
  label={
    <>
      Company Name <span className="text-error">*</span>
    </>
  }
  required
>
  <Input {...register('name')} />
</FormField>
```

### Optional Field Indicator

**Pattern:** "(Optional)" text in gray, after label

**Implementation:**
```tsx
<FormField
  label={
    <>
      Middle Name <span className="text-secondary-500">(Optional)</span>
    </>
  }
>
  <Input {...register('middleName')} />
</FormField>
```

### Field Grouping

**Pattern:** Related fields grouped visually

**Implementation:**
```tsx
<FormGroup label="Address">
  <FormField label="Street Address" required>
    <Input {...register('street')} />
  </FormField>
  <div className="grid grid-cols-2 gap-4">
    <FormField label="City" required>
      <Input {...register('city')} />
    </FormField>
    <FormField label="Postal Code" required>
      <Input {...register('postalCode')} />
    </FormField>
  </div>
</FormGroup>
```

### Duration Type Selection Pattern

**Use Case:** Threshold modifications with permanent vs temporary options

**Layout:**
- Radio button group for duration type selection
- Conditional fields appear based on selection
- Clear visual separation between options

**Example:**
```
┌─────────────────────────────────────────┐
│ Duration Type *                          │
│                                          │
│ ○ Permanent (Default)                   │
│   Threshold remains until manually modified.│
│                                          │
│ ○ Temporary (Time-Bound)                 │
│   Threshold will revert after specified period.│
│                                          │
│ [If Temporary Selected]                  │
│                                          │
│ Reversion Type *                         │
│ ○ Auto-Revert                            │
│   System automatically reverts on End Date.│
│ ○ Manual Review                          │
│   Requires Tier 1 confirmation on End Date.│
│                                          │
│ End Date *                               │
│ [Date Picker: DD/MM/YYYY]                │
│ Minimum: Tomorrow                        │
│                                          │
│ Revert To *                              │
│ ○ Previous Value (1.0x default)          │
│ ○ Custom Value: [1.0] x                  │
│                                          │
│ ⚠️ Warning: Reversion will occur on [End Date].│
│    Ensure companies are notified.        │
│    [Schedule Notification]                │
└─────────────────────────────────────────┘
```

**Implementation:**
- Radio buttons with descriptions
- Conditional field visibility (show/hide based on selection)
- Date picker validation (future date only)
- Real-time calculation of revert-to values
- Warning messages for approaching reversion dates

**Validation:**
- Duration type selection required
- If temporary: Reversion type, end date, and revert-to values required
- End date must be in the future
- Revert-to multiplier must be between 0.1x and 5.0x

**Accessibility:**
- Radio buttons keyboard navigable
- ARIA labels for conditional fields
- Screen reader announcements for field visibility changes

### Conditional Fields

**Pattern:** Show/hide fields based on other field values

**Implementation:**
```tsx
<FormField label="Company Type" required>
  <Select
    {...register('companyType')}
    onChange={(value) => setShowExportFields(value === 'IPC')}
  >
    <option value="IPC">IPC</option>
    <option value="Wholesaler">Wholesaler</option>
  </Select>
</FormField>

{showExportFields && (
  <FormField label="Export License Number">
    <Input {...register('exportLicense')} />
  </FormField>
)}
```

## Validation Patterns

### Validation Timing

**Patterns:**
1. **On Submit:** Validate all fields on form submission
2. **On Blur:** Validate field when user leaves (after interaction)
3. **On Change:** Real-time validation for critical fields (passwords, emails)

**Implementation:**
```tsx
const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const form = useForm({
  resolver: zodResolver(schema),
  mode: 'onBlur', // Validate on blur
});
```

### Error Display

**Pattern:** Inline error message below field, red text

**Implementation:**
```tsx
<FormField
  label="Email Address"
  error={errors.email?.message}
>
  <Input
    {...register('email')}
    aria-invalid={!!errors.email}
    aria-describedby={errors.email ? 'email-error' : undefined}
  />
  {errors.email && (
    <span id="email-error" className="text-error text-sm mt-1">
      {errors.email.message}
    </span>
  )}
</FormField>
```

### Success Feedback

**Pattern:** Green checkmark icon when field is valid (optional, for critical fields)

**Implementation:**
```tsx
<FormField label="Email Address">
  <div className="relative">
    <Input {...register('email')} />
    {isValid && (
      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-success" />
    )}
  </div>
</FormField>
```

### Validation Summary

**Pattern:** Error summary at top of form (for long forms)

**Implementation:**
```tsx
{Object.keys(errors).length > 0 && (
  <Alert variant="error">
    <AlertTitle>Please correct the following errors:</AlertTitle>
    <ul>
      {Object.entries(errors).map(([field, error]) => (
        <li key={field}>{error.message}</li>
      ))}
    </ul>
  </Alert>
)}
```

## Form Types

### Submission Forms (AAMS, MSQ, WSL)

**Characteristics:**
- File upload support
- Date range selection
- Bulk data entry (tables)
- Draft saving
- Submission confirmation

**Pattern:**
```tsx
<Form onSubmit={handleSubmit}>
  <FormGroup label="Submission Period">
    <FormField label="Year" required>
      <Select {...register('year')} options={years} />
    </FormField>
    <FormField label="Month" required>
      <Select {...register('month')} options={months} />
    </FormField>
  </FormGroup>

  <FormGroup label="Data Upload">
    <FormField label="Upload File" required>
      <FileUpload
        accept=".xlsx,.csv"
        onUpload={handleFileUpload}
      />
    </FormField>
    <Button variant="outline" onClick={handleDownloadTemplate}>
      Download Template
    </Button>
  </FormGroup>

  <FormGroup label="Data Preview">
    <Table data={previewData} />
  </FormGroup>

  <FormActions>
    <Button variant="outline" onClick={handleSaveDraft}>
      Save Draft
    </Button>
    <Button type="submit" loading={isSubmitting}>
      Submit
    </Button>
  </FormActions>
</Form>
```

### Approval Forms

**Characteristics:**
- Read-only data display
- Approval/reject actions
- Justification field (required for Tier 1)
- Two-person rule UI (if applicable)

**Pattern:**
```tsx
<Form onSubmit={handleSubmit}>
  <Card>
    <CardHeader>
      <CardTitle>Submission Review</CardTitle>
    </CardHeader>
    <CardBody>
      <DataList>
        <DataListItem label="Company" value={submission.company} />
        <DataListItem label="Type" value={submission.type} />
        <DataListItem label="Status" value={<Badge>{submission.status}</Badge>} />
      </DataList>
    </CardBody>
  </Card>

  <FormField
    label="Decision"
    required
    error={errors.decision}
  >
    <RadioGroup {...register('decision')}>
      <Radio value="approve" label="Approve" />
      <Radio value="reject" label="Reject" />
      <Radio value="request_changes" label="Request Changes" />
    </RadioGroup>
  </FormField>

  <FormField
    label="Justification"
    required
    error={errors.justification}
    helperText="Minimum 50 characters required"
  >
    <Textarea
      {...register('justification')}
      minRows={3}
      maxLength={1000}
    />
  </FormField>

  <FormActions>
    <Button variant="outline" onClick={handleCancel}>
      Cancel
    </Button>
    <Button type="submit" loading={isSubmitting}>
      Submit Decision
    </Button>
  </FormActions>
</Form>
```

### Registry Forms (Create/Edit)

**Characteristics:**
- CRUD operations
- Relationship fields (company → products → SKUs)
- Validation against existing data
- Cascade warnings

**Pattern:**
```tsx
<Form onSubmit={handleSubmit}>
  <FormGroup label="Basic Information">
    <FormField label="Name" required error={errors.name}>
      <Input {...register('name')} />
    </FormField>
    <FormField label="Registration Number" required>
      <Input {...register('regNumber')} />
    </FormField>
  </FormGroup>

  <FormGroup label="Relationships">
    <FormField label="Parent Company">
      <Select
        {...register('parentCompanyId')}
        options={companies}
        searchable
      />
    </FormField>
  </FormGroup>

  {isEdit && (
    <Alert variant="warning">
      Editing this record will require approval from MOH DMP Tier 2.
    </Alert>
  )}

  <FormActions>
    <Button variant="outline" onClick={handleCancel}>
      Cancel
    </Button>
    <Button type="submit" loading={isSubmitting}>
      {isEdit ? 'Update' : 'Create'}
    </Button>
  </FormActions>
</Form>
```

### Configuration Forms

**Characteristics:**
- System settings
- Threshold configurations
- Multiplier settings
- Validation with advisory suggestions

**Pattern:**
```tsx
<Form onSubmit={handleSubmit}>
  <FormGroup label="Threshold Multipliers">
    <FormField
      label="Standard Product Multiplier (B)"
      required
      helperText="Default: 3"
    >
      <Input
        type="number"
        {...register('multiplierB', { valueAsNumber: true })}
        min={1}
        max={10}
        step={0.1}
      />
    </FormField>
    <FormField
      label="Critical Medicine Multiplier (B)"
      required
      helperText="Default: 3.5"
    >
      <Input
        type="number"
        {...register('multiplierBCritical', { valueAsNumber: true })}
        min={1}
        max={10}
        step={0.1}
      />
    </FormField>
    {showAdvisory && (
      <Alert variant="info">
        Consider setting C multiplier to match B multiplier ({multiplierB}) for consistency.
      </Alert>
    )}
  </FormGroup>

  <FormActions>
    <Button variant="outline" onClick={handleReset}>
      Reset to Defaults
    </Button>
    <Button type="submit" loading={isSubmitting}>
      Save Configuration
    </Button>
  </FormActions>
</Form>
```

## Multi-Step Forms

### Pattern

**Use Case:** Complex workflows (export requests, company registration)

**Components:**
- Progress indicator
- Step navigation
- Step validation
- Draft saving between steps

**Implementation:**
```tsx
<MultiStepForm
  steps={[
    { id: 'basic', label: 'Basic Information' },
    { id: 'details', label: 'Details' },
    { id: 'review', label: 'Review' },
  ]}
  currentStep={currentStep}
  onStepChange={handleStepChange}
>
  {currentStep === 'basic' && <BasicInfoStep />}
  {currentStep === 'details' && <DetailsStep />}
  {currentStep === 'review' && <ReviewStep />}
</MultiStepForm>
```

## Form Actions

### Action Button Patterns

**Primary Action:** Submit button (right-aligned, primary variant)
**Secondary Actions:** Cancel, Save Draft (left-aligned, outline variant)
**Destructive Actions:** Delete (left-aligned, destructive variant)

**Layout:**
```
┌─────────────────────────────────────┐
│ [Cancel] [Save Draft]    [Submit]   │
└─────────────────────────────────────┘
```

**Implementation:**
```tsx
<FormActions>
  <div className="flex gap-2">
    <Button variant="outline" onClick={handleCancel}>
      Cancel
    </Button>
    <Button variant="outline" onClick={handleSaveDraft}>
      Save Draft
    </Button>
  </div>
  <Button type="submit" loading={isSubmitting}>
    Submit
  </Button>
</FormActions>
```

## Special Form Patterns

### File Upload Form

**Pattern:**
- Drag-and-drop area
- File list with preview
- Progress indicator
- Remove action
- Template download

**Implementation:**
```tsx
<FormField label="Upload Documents" required>
  <FileUpload
    accept=".pdf,.doc,.docx,.xlsx"
    maxSize={10 * 1024 * 1024} // 10MB
    multiple
    onUpload={handleUpload}
    onRemove={handleRemove}
  />
  <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
    Download Template
  </Button>
</FormField>
```

### Date Range Form

**Pattern:**
- Start date picker
- End date picker
- Validation (end >= start)
- Quick select (Last 7 days, Last 30 days, etc.)

**Implementation:**
```tsx
<FormGroup label="Date Range">
  <div className="grid grid-cols-2 gap-4">
    <FormField label="Start Date" required>
      <DatePicker
        {...register('startDate')}
        maxDate={endDate}
        timezone="Africa/Casablanca"
      />
    </FormField>
    <FormField label="End Date" required>
      <DatePicker
        {...register('endDate')}
        minDate={startDate}
        timezone="Africa/Casablanca"
      />
    </FormField>
  </div>
  <div className="flex gap-2 mt-2">
    <Button variant="ghost" size="sm" onClick={() => setQuickRange('7d')}>
      Last 7 days
    </Button>
    <Button variant="ghost" size="sm" onClick={() => setQuickRange('30d')}>
      Last 30 days
    </Button>
  </div>
</FormGroup>
```

### Bulk Edit Form

**Pattern:**
- Table with checkboxes
- Bulk actions dropdown
- Confirmation dialog

**Implementation:**
```tsx
<Form onSubmit={handleBulkSubmit}>
  <Table
    data={items}
    selectable
    onSelectionChange={setSelectedItems}
  />
  {selectedItems.length > 0 && (
    <div className="flex items-center gap-2 mt-4">
      <span>{selectedItems.length} items selected</span>
      <Select
        value={bulkAction}
        onChange={setBulkAction}
        options={bulkActions}
      />
      <Button onClick={handleBulkAction}>
        Apply
      </Button>
    </div>
  )}
</Form>
```

## Form Accessibility

### Keyboard Navigation

- **Tab:** Move between fields
- **Shift+Tab:** Move backwards
- **Enter:** Submit form (if valid)
- **Escape:** Cancel/close form

### Screen Reader Support

- **Labels:** All fields have associated labels
- **Error Announcements:** Errors announced when they occur
- **Required Fields:** "Required" announced for required fields
- **Field Descriptions:** Helper text associated with fields

### Focus Management

- **Focus on First Field:** When form opens
- **Focus on First Error:** After validation fails
- **Focus Trap:** In modal forms

## Form Performance

### Optimization Strategies

1. **Lazy Validation:** Validate only touched fields
2. **Debounced Input:** For search/filter fields
3. **Optimistic Updates:** Show success immediately
4. **Draft Auto-Save:** Save drafts periodically
5. **Code Splitting:** Lazy load complex form components

## Form Testing

### Test Scenarios

1. **Validation:** All validation rules
2. **Submission:** Successful submission flow
3. **Error Handling:** Error display and recovery
4. **Accessibility:** Keyboard navigation, screen readers
5. **Performance:** Large forms, many fields

## References

- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [WCAG Form Guidelines](https://www.w3.org/WAI/WCAG21/quickref/#input-assistance)

---

**Next Steps:**
1. Implement form components using React Hook Form + Zod
2. Create form templates for each form type
3. Build form validation library
4. Create form testing utilities

