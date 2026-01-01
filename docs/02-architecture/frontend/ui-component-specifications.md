# UI Component Specifications - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines the comprehensive UI component library specifications, including base components, form components, data display components, navigation components, and feedback components.

**Last Updated:** 2025-12-31  
**Status:** ✅ Complete (Phase 0, Frontend UI/UX Gap Resolution)  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)

## Overview

The PM platform uses shadcn/ui as the base component library, customized with our design system. All components are built with accessibility, consistency, and regulatory compliance in mind.

## Component Architecture

### Component Organization

```
components/
├── ui/                    # Base shadcn/ui components
│   ├── button.tsx
│   ├── input.tsx
│   ├── select.tsx
│   └── ...
├── forms/                 # Form-specific components
│   ├── form-field.tsx
│   ├── form-group.tsx
│   └── ...
├── data-display/          # Data presentation components
│   ├── table.tsx
│   ├── card.tsx
│   └── ...
├── navigation/            # Navigation components
│   ├── sidebar.tsx
│   ├── breadcrumbs.tsx
│   └── ...
├── feedback/             # User feedback components
│   ├── alert.tsx
│   ├── toast.tsx
│   └── ...
└── layout/               # Layout components
    ├── header.tsx
    ├── footer.tsx
    └── ...
```

## Base Components

### Button

**Purpose:** Primary interactive element for user actions.

**Variants:**
- `default` - Primary action (blue)
- `secondary` - Secondary action (gray)
- `destructive` - Destructive action (red)
- `outline` - Outlined button
- `ghost` - Minimal button
- `link` - Link-style button

**Sizes:**
- `sm` - Small (height: 32px)
- `md` - Medium (height: 40px) - Default
- `lg` - Large (height: 48px)
- `icon` - Icon-only button (40px × 40px)

**States:**
- Default
- Hover
- Active
- Focus
- Disabled
- Loading (with spinner)

**Accessibility:**
- Keyboard accessible (Enter/Space)
- Focus visible
- ARIA labels for icon-only buttons

**Usage:**
```tsx
<Button variant="default" size="md" onClick={handleClick}>
  Submit
</Button>
<Button variant="destructive" size="sm" disabled>
  Delete
</Button>
<Button variant="outline" size="lg" loading>
  Processing...
</Button>
```

### Input

**Purpose:** Text input field for user data entry.

**Types:**
- `text` - Standard text input
- `email` - Email input
- `password` - Password input (with show/hide toggle)
- `number` - Numeric input
- `tel` - Telephone input
- `url` - URL input
- `search` - Search input (with search icon)

**States:**
- Default
- Focus
- Error (with error message)
- Disabled
- Read-only

**Features:**
- Label (required/optional indicator)
- Helper text
- Error message
- Icon support (leading/trailing)
- Character counter (if max length)

**Accessibility:**
- Associated label (via `htmlFor`)
- Error announcement (ARIA)
- Required field indication

**Usage:**
```tsx
<Input
  type="text"
  label="Company Name"
  required
  placeholder="Enter company name"
  error={errors.name}
  helperText="Official registered name"
/>
```

### Select

**Purpose:** Dropdown selection component.

**Variants:**
- Single select
- Multi-select (with tags)
- Searchable select
- Grouped options

**States:**
- Default
- Open
- Focus
- Error
- Disabled

**Features:**
- Search/filter
- Option groups
- Custom option rendering
- Empty state message

**Accessibility:**
- Keyboard navigation (Arrow keys, Enter)
- Screen reader announcements
- Focus management

**Usage:**
```tsx
<Select
  label="User Role"
  options={roles}
  value={selectedRole}
  onChange={handleChange}
  error={errors.role}
/>
```

### Checkbox

**Purpose:** Binary selection (checked/unchecked).

**States:**
- Unchecked
- Checked
- Indeterminate (for parent checkboxes)
- Disabled

**Features:**
- Label support
- Helper text
- Error state

**Usage:**
```tsx
<Checkbox
  label="I agree to the terms"
  checked={agreed}
  onChange={handleChange}
/>
```

### Radio

**Purpose:** Single selection from a group.

**States:**
- Unselected
- Selected
- Disabled

**Features:**
- Radio group support
- Label support
- Error state

**Usage:**
```tsx
<RadioGroup
  label="Select Option"
  value={selected}
  onChange={handleChange}
>
  <Radio value="option1" label="Option 1" />
  <Radio value="option2" label="Option 2" />
</RadioGroup>
```

### Textarea

**Purpose:** Multi-line text input.

**Features:**
- Resizable (vertical)
- Character counter
- Auto-grow (optional)
- Min/max rows

**Usage:**
```tsx
<Textarea
  label="Justification"
  required
  minRows={3}
  maxRows={10}
  maxLength={500}
  value={justification}
  onChange={handleChange}
  error={errors.justification}
/>
```

### Switch

**Purpose:** Toggle on/off state.

**States:**
- Off
- On
- Disabled

**Usage:**
```tsx
<Switch
  label="Enable notifications"
  checked={enabled}
  onChange={handleChange}
/>
```

## Form Components

### FormField

**Purpose:** Wrapper component for form fields with label, error, and helper text.

**Features:**
- Label (with required indicator)
- Error message display
- Helper text
- Field grouping

**Usage:**
```tsx
<FormField
  label="Email Address"
  required
  error={errors.email}
  helperText="We'll never share your email"
>
  <Input type="email" {...register('email')} />
</FormField>
```

### FormGroup

**Purpose:** Groups related form fields.

**Features:**
- Visual grouping
- Shared error state
- Consistent spacing

**Usage:**
```tsx
<FormGroup label="Company Information">
  <FormField label="Name" required>
    <Input {...register('name')} />
  </FormField>
  <FormField label="Registration Number" required>
    <Input {...register('regNumber')} />
  </FormField>
</FormGroup>
```

### FormError

**Purpose:** Displays form-level or field-level errors.

**Variants:**
- Inline (below field)
- Summary (at top of form)
- Toast (for submission errors)

**Usage:**
```tsx
<FormError message={errors.root?.message} />
```

### DatePicker

**Purpose:** Date selection component.

**Features:**
- Calendar popup
- Date range selection
- Timezone support (Morocco timezone)
- Min/max date constraints
- Format: DD/MM/YYYY (Morocco standard)

**Usage:**
```tsx
<DatePicker
  label="Submission Date"
  value={date}
  onChange={handleChange}
  minDate={new Date()}
  timezone="Africa/Casablanca"
/>
```

### FileUpload

**Purpose:** File upload component with drag-and-drop.

**Features:**
- Drag-and-drop
- File preview
- Progress indicator
- File type validation
- Size validation
- Multiple files support

**Usage:**
```tsx
<FileUpload
  label="Upload Document"
  accept=".pdf,.doc,.docx"
  maxSize={5 * 1024 * 1024} // 5MB
  onUpload={handleUpload}
  onRemove={handleRemove}
/>
```

## Data Display Components

### Table

**Purpose:** Tabular data display.

**Features:**
- Sortable columns
- Filterable columns
- Pagination
- Row selection (single/multiple)
- Row actions
- Responsive (mobile cards)
- Empty state
- Loading state

**Usage:**
```tsx
<Table
  columns={columns}
  data={data}
  sortable
  filterable
  pagination
  onRowClick={handleRowClick}
/>
```

### Card

**Purpose:** Container for related content.

**Variants:**
- Default
- Elevated (with shadow)
- Outlined
- Interactive (hover effect)

**Features:**
- Header section
- Body section
- Footer section
- Actions area

**Usage:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Company Details</CardTitle>
  </CardHeader>
  <CardBody>
    {/* Content */}
  </CardBody>
  <CardFooter>
    <Button>View Details</Button>
  </CardFooter>
</Card>
```

### Badge

**Purpose:** Status indicator or label.

**Variants:**
- `default` - Gray
- `success` - Green
- `warning` - Amber
- `error` - Red
- `info` - Blue

**Sizes:**
- `sm` - Small
- `md` - Medium (default)
- `lg` - Large

**Usage:**
```tsx
<Badge variant="success">Approved</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Rejected</Badge>
```

### StatusIndicator

**Purpose:** Visual status indicator (dot + label).

**Statuses:**
- `pending` - Amber dot
- `approved` - Green dot
- `rejected` - Red dot
- `draft` - Gray dot
- `active` - Green dot
- `inactive` - Gray dot
- `suspended` - Red dot

**Usage:**
```tsx
<StatusIndicator status="approved">Approved</StatusIndicator>
```

### DataList

**Purpose:** Key-value pair list.

**Features:**
- Label-value pairs
- Grouped sections
- Responsive layout

**Usage:**
```tsx
<DataList>
  <DataListItem label="Company Name" value="ABC Pharmaceuticals" />
  <DataListItem label="Registration" value="REG-12345" />
  <DataListItem label="Status" value={<Badge>Active</Badge>} />
</DataList>
```

## Navigation Components

### Sidebar

**Purpose:** Main navigation sidebar.

**Features:**
- Collapsible
- Module grouping
- Active state indication
- Role-based menu items
- Icon + label
- Badge for notifications

**Usage:**
```tsx
<Sidebar>
  <SidebarGroup label="RMM">
    <SidebarItem icon={Building} href="/rmm" active>
      Companies
    </SidebarItem>
  </SidebarGroup>
</Sidebar>
```

### Breadcrumbs

**Purpose:** Navigation breadcrumb trail.

**Features:**
- Hierarchical navigation
- Clickable segments
- Current page indicator

**Usage:**
```tsx
<Breadcrumbs>
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem href="/rmm">RMM</BreadcrumbItem>
  <BreadcrumbItem>Companies</BreadcrumbItem>
</Breadcrumbs>
```

### Tabs

**Purpose:** Tabbed interface for content organization.

**Features:**
- Horizontal/vertical tabs
- Icon support
- Badge support
- Keyboard navigation

**Usage:**
```tsx
<Tabs>
  <TabList>
    <Tab value="overview">Overview</Tab>
    <Tab value="details">Details</Tab>
    <Tab value="history">History</Tab>
  </TabList>
  <TabPanels>
    <TabPanel value="overview">...</TabPanel>
    <TabPanel value="details">...</TabPanel>
  </TabPanels>
</Tabs>
```

## Feedback Components

### Alert

**Purpose:** Inline alert message.

**Variants:**
- `info` - Blue
- `success` - Green
- `warning` - Amber
- `error` - Red

**Features:**
- Dismissible
- Icon support
- Action buttons

**Usage:**
```tsx
<Alert variant="success" dismissible>
  Submission successful!
</Alert>
<Alert variant="error">
  Please correct the errors below.
</Alert>
```

### Toast

**Purpose:** Temporary notification message.

**Features:**
- Auto-dismiss (configurable duration)
- Manual dismiss
- Action buttons
- Stacking (multiple toasts)
- Position (top-right default)

**Usage:**
```tsx
toast.success('Submission successful!');
toast.error('An error occurred');
toast.info('Processing...', { duration: 3000 });
```

### Loading

**Purpose:** Loading state indicator.

**Variants:**
- Spinner
- Skeleton (for content placeholders)
- Progress bar
- Full-page loader

**Usage:**
```tsx
<Loading spinner />
<Loading skeleton rows={5} />
<Loading progress value={60} />
```

### EmptyState

**Purpose:** Empty state when no data is available.

**Features:**
- Icon
- Title
- Description
- Action button

**Usage:**
```tsx
<EmptyState
  icon={Inbox}
  title="No submissions yet"
  description="Get started by creating your first submission"
  action={<Button>Create Submission</Button>}
/>
```

## Overlay Components

### Modal

**Purpose:** Modal dialog overlay.

**Features:**
- Backdrop
- Focus trap
- Escape to close
- Size variants (sm, md, lg, xl, full)
- Header, body, footer sections

**Usage:**
```tsx
<Modal open={isOpen} onClose={handleClose} size="md">
  <ModalHeader>
    <ModalTitle>Confirm Action</ModalTitle>
  </ModalHeader>
  <ModalBody>
    Are you sure you want to proceed?
  </ModalBody>
  <ModalFooter>
    <Button variant="outline" onClick={handleClose}>Cancel</Button>
    <Button onClick={handleConfirm}>Confirm</Button>
  </ModalFooter>
</Modal>
```

### Dialog

**Purpose:** Confirmation dialog (simpler than Modal).

**Usage:**
```tsx
<Dialog
  open={isOpen}
  title="Delete Company?"
  description="This action cannot be undone."
  confirmLabel="Delete"
  cancelLabel="Cancel"
  onConfirm={handleDelete}
  onCancel={handleCancel}
  variant="destructive"
/>
```

### Popover

**Purpose:** Contextual popup.

**Features:**
- Position (top, bottom, left, right)
- Trigger (click, hover)
- Arrow indicator

**Usage:**
```tsx
<Popover>
  <PopoverTrigger>
    <Button>More Info</Button>
  </PopoverTrigger>
  <PopoverContent>
    Additional information here
  </PopoverContent>
</Popover>
```

### Tooltip

**Purpose:** Hover tooltip.

**Usage:**
```tsx
<Tooltip content="This is a tooltip">
  <Button>Hover me</Button>
</Tooltip>
```

## Layout Components

### Header

**Purpose:** Top navigation header.

**Features:**
- Logo
- User menu
- Notifications icon
- Module switcher (if applicable)

**Usage:**
```tsx
<Header>
  <Logo />
  <Navigation />
  <UserMenu user={user} />
  <Notifications />
</Header>
```

### Footer

**Purpose:** Page footer.

**Features:**
- Links
- Copyright
- Version info

**Usage:**
```tsx
<Footer>
  <FooterLinks />
  <Copyright />
</Footer>
```

## Component Guidelines

### Accessibility

1. **Keyboard Navigation:** All interactive components must be keyboard accessible
2. **ARIA Labels:** Proper ARIA labels for screen readers
3. **Focus Management:** Visible focus indicators
4. **Color Contrast:** Meet WCAG AA standards
5. **Semantic HTML:** Use appropriate HTML elements

### Performance

1. **Lazy Loading:** Load components on demand
2. **Memoization:** Use React.memo for expensive components
3. **Code Splitting:** Split large component libraries
4. **Optimized Rendering:** Minimize re-renders

### Consistency

1. **Design Tokens:** Use design system tokens
2. **Naming:** Consistent naming conventions
3. **Props:** Standardized prop interfaces
4. **Documentation:** Component documentation with examples

## Implementation

### shadcn/ui Base

All components are built on shadcn/ui, customized with our design system:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
# ... etc
```

### Customization

Components are customized via:
- CSS variables (design tokens)
- Tailwind CSS classes
- Component composition

### TypeScript

All components are fully typed:

```tsx
interface ButtonProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

## References

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [React Aria Components](https://react-spectrum.adobe.com/react-aria/)

---

**Next Steps:**
1. Install shadcn/ui components
2. Customize components with design system
3. Create component documentation site
4. Build component examples and tests

