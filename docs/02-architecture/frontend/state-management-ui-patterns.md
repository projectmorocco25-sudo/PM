# State Management UI Patterns - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This document defines UI patterns for different application states (loading, error, empty, success) and how to handle them consistently across the platform.

**Last Updated:** 2025-12-31  
**Status:** ✅ Complete (Phase 0, Frontend UI/UX Gap Resolution)  
**Owner:** Emma (UI/UX + Next.js Frontend Specialist)

## Overview

The PM platform handles various application states (loading, error, empty, success) consistently across all modules. This document defines patterns for each state type and implementation guidelines.

## State Types

### Loading States

**Purpose:** Indicate that data is being fetched or an action is in progress.

**Types:**
1. **Initial Load:** First time loading data
2. **Refresh:** Reloading existing data
3. **Action Loading:** Processing user action (submit, approve, etc.)
4. **Background Loading:** Loading in background (optimistic updates)

### Error States

**Purpose:** Display errors to users with actionable information.

**Types:**
1. **Network Errors:** Connection issues, timeouts
2. **Validation Errors:** Form validation failures
3. **Server Errors:** API errors, 4xx/5xx responses
4. **Permission Errors:** Unauthorized access attempts

### Empty States

**Purpose:** Show when no data is available.

**Types:**
1. **No Data:** No items exist yet
2. **No Results:** Search/filter returned no results
3. **First Time:** First-time user experience
4. **Filtered Out:** All data filtered out

### Success States

**Purpose:** Confirm successful actions.

**Types:**
1. **Action Success:** Form submission, approval, etc.
2. **Data Loaded:** Successful data fetch
3. **Operation Complete:** Background job complete

## Loading State Patterns

### Skeleton Loading

**Use Case:** Initial page load, replacing content area

**Pattern:**
- Skeleton shapes matching content layout
- Subtle animation (pulse)
- Maintains layout structure

**Implementation:**
```tsx
function CompanyListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4 p-4 border rounded">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function CompanyList() {
  const { data, isLoading } = useCompanies();
  
  if (isLoading) {
    return <CompanyListSkeleton />;
  }
  
  return <CompanyTable data={data} />;
}
```

### Spinner Loading

**Use Case:** Button actions, inline loading, small areas

**Pattern:**
- Centered spinner
- Loading text (optional)
- Disable interaction during load

**Implementation:**
```tsx
function SubmitButton({ onSubmit, loading }) {
  return (
    <Button
      onClick={onSubmit}
      disabled={loading}
      loading={loading}
    >
      {loading ? 'Submitting...' : 'Submit'}
    </Button>
  );
}

function InlineLoader() {
  return (
    <div className="flex items-center justify-center p-8">
      <Spinner size="md" />
      <span className="ml-2 text-secondary-600">Loading...</span>
    </div>
  );
}
```

### Progress Bar

**Use Case:** File uploads, long-running operations

**Pattern:**
- Progress percentage
- Estimated time remaining (optional)
- Cancel option (if applicable)

**Implementation:**
```tsx
function FileUpload({ onUpload }) {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  
  const handleUpload = async (file) => {
    setUploading(true);
    await uploadFile(file, {
      onProgress: (percent) => setProgress(percent),
    });
    setUploading(false);
  };
  
  return (
    <div>
      <FileInput onFileSelect={handleUpload} disabled={uploading} />
      {uploading && (
        <div className="mt-2">
          <ProgressBar value={progress} />
          <span className="text-sm text-secondary-600">
            {progress}% uploaded
          </span>
        </div>
      )}
    </div>
  );
}
```

### Table Loading State

**Use Case:** Data tables loading

**Pattern:**
- Skeleton rows
- Maintain column structure
- Show loading indicator

**Implementation:**
```tsx
function DataTable({ data, isLoading }) {
  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3, 4, 5].map((i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
  
  return <Table data={data} />;
}
```

## Error State Patterns

### Inline Error Messages

**Use Case:** Form field validation errors

**Pattern:**
- Red text below field
- Clear error message
- Associated with field (ARIA)

**Implementation:**
```tsx
function FormField({ label, error, children, ...props }) {
  return (
    <div>
      <Label htmlFor={props.id}>{label}</Label>
      <div className="relative">
        {children}
        {error && (
          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-error" />
        )}
      </div>
      {error && (
        <span className="text-error text-sm mt-1" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
```

### Error Alert

**Use Case:** Form-level errors, API errors

**Pattern:**
- Alert component (red variant)
- Error icon
- Error message
- Action buttons (retry, dismiss)

**Implementation:**
```tsx
function ErrorAlert({ error, onRetry, onDismiss }) {
  return (
    <Alert variant="error" dismissible={!!onDismiss} onDismiss={onDismiss}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {error.message || 'An error occurred. Please try again.'}
      </AlertDescription>
      {onRetry && (
        <AlertAction>
          <Button variant="outline" size="sm" onClick={onRetry}>
            Retry
          </Button>
        </AlertAction>
      )}
    </Alert>
  );
}

function SubmissionForm() {
  const { mutate, error } = useSubmitSubmission();
  
  return (
    <Form onSubmit={mutate}>
      {error && (
        <ErrorAlert
          error={error}
          onRetry={() => mutate()}
        />
      )}
      {/* Form fields */}
    </Form>
  );
}
```

### Error Page

**Use Case:** Page-level errors, 404, 500

**Pattern:**
- Full-page error display
- Error code/type
- Error message
- Action buttons (go back, retry, home)

**Implementation:**
```tsx
function ErrorPage({ error, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <AlertCircle className="h-16 w-16 text-error mb-4" />
      <h1 className="text-2xl font-bold mb-2">
        {error.status === 404 ? 'Page Not Found' : 'Something Went Wrong'}
      </h1>
      <p className="text-secondary-600 mb-6 text-center max-w-md">
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
        {onRetry && (
          <Button onClick={onRetry}>
            Retry
          </Button>
        )}
        <Button onClick={() => router.push('/')}>
          Go Home
        </Button>
      </div>
    </div>
  );
}
```

### Error Toast

**Use Case:** Non-blocking errors, background operations

**Pattern:**
- Toast notification
- Error icon
- Brief error message
- Auto-dismiss (5 seconds)

**Implementation:**
```tsx
function useErrorToast() {
  const toast = useToast();
  
  return (error: Error) => {
    toast.error({
      title: 'Error',
      description: error.message || 'An error occurred',
      duration: 5000,
    });
  };
}

function useSubmitAction() {
  const showError = useErrorToast();
  const { mutate } = useMutation({
    mutationFn: submitData,
    onError: (error) => {
      showError(error);
    },
  });
  
  return mutate;
}
```

## Empty State Patterns

### No Data Empty State

**Use Case:** List/table with no items

**Pattern:**
- Icon (large, muted)
- Title
- Description
- Primary action button

**Implementation:**
```tsx
function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action 
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <Icon className="h-16 w-16 text-secondary-400 mb-4" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-secondary-600 mb-6 max-w-md">{description}</p>
      {action && action}
    </div>
  );
}

function CompanyList({ companies }) {
  if (companies.length === 0) {
    return (
      <EmptyState
        icon={Building}
        title="No companies yet"
        description="Get started by creating your first company"
        action={
          <Button onClick={handleNewCompany}>
            <Plus /> Create Company
          </Button>
        }
      />
    );
  }
  
  return <CompanyTable data={companies} />;
}
```

### No Results Empty State

**Use Case:** Search/filter returned no results

**Pattern:**
- Search icon
- "No results found" message
- Suggestions (clear filters, adjust search)

**Implementation:**
```tsx
function SearchResults({ query, results, onClearFilters }) {
  if (results.length === 0 && query) {
    return (
      <EmptyState
        icon={Search}
        title="No results found"
        description={`No companies match "${query}". Try adjusting your search.`}
        action={
          <Button variant="outline" onClick={onClearFilters}>
            Clear Filters
          </Button>
        }
      />
    );
  }
  
  return <ResultsList results={results} />;
}
```

### First Time Empty State

**Use Case:** First-time user experience

**Pattern:**
- Welcome message
- Getting started guide
- Quick actions

**Implementation:**
```tsx
function FirstTimeDashboard({ isFirstTime }) {
  if (isFirstTime) {
    return (
      <EmptyState
        icon={Sparkles}
        title="Welcome to PM Platform"
        description="Get started by creating your first submission or exploring the dashboard"
        action={
          <div className="flex gap-2">
            <Button onClick={handleCreateSubmission}>
              Create Submission
            </Button>
            <Button variant="outline" onClick={handleViewGuide}>
              View Guide
            </Button>
          </div>
        }
      />
    );
  }
  
  return <DashboardContent />;
}
```

## Success State Patterns

### Success Toast

**Use Case:** Action confirmation (submit, approve, etc.)

**Pattern:**
- Toast notification (green)
- Success icon
- Success message
- Auto-dismiss (3 seconds)

**Implementation:**
```tsx
function useSuccessToast() {
  const toast = useToast();
  
  return (message: string) => {
    toast.success({
      title: 'Success',
      description: message,
      duration: 3000,
    });
  };
}

function SubmissionForm() {
  const showSuccess = useSuccessToast();
  const { mutate } = useMutation({
    mutationFn: submitData,
    onSuccess: () => {
      showSuccess('Submission created successfully');
      router.push('/submissions');
    },
  });
  
  return <Form onSubmit={mutate} />;
}
```

### Success Alert

**Use Case:** Important success messages, page-level

**Pattern:**
- Alert component (green variant)
- Success icon
- Success message
- Dismissible

**Implementation:**
```tsx
function SuccessAlert({ message, onDismiss }) {
  return (
    <Alert variant="success" dismissible onDismiss={onDismiss}>
      <CheckCircle className="h-4 w-4" />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
```

### Success Page

**Use Case:** Multi-step forms, important confirmations

**Pattern:**
- Full-page success display
- Success icon
- Confirmation message
- Next steps/actions

**Implementation:**
```tsx
function SuccessPage({ title, message, nextSteps }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <CheckCircle className="h-16 w-16 text-success mb-4" />
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-secondary-600 mb-6 text-center max-w-md">
        {message}
      </p>
      {nextSteps && (
        <div className="flex gap-2">
          {nextSteps}
        </div>
      )}
    </div>
  );
}
```

## State Management with TanStack Query

### Loading States

**Pattern:** Use `isLoading`, `isFetching`, `isRefetching`

```tsx
function useCompanies() {
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies,
  });
  
  return {
    companies: data,
    isLoading,        // Initial load
    isRefreshing: isFetching && !isLoading,  // Refresh
    error,
  };
}
```

### Error States

**Pattern:** Use `error` from query/mutation

```tsx
function useSubmitSubmission() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: submitSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries(['submissions']);
    },
    onError: (error) => {
      // Error handled by error boundary or toast
    },
  });
}
```

### Optimistic Updates

**Pattern:** Update UI immediately, rollback on error

```tsx
function useApproveSubmission() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: approveSubmission,
    onMutate: async (submissionId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['submissions']);
      
      // Snapshot previous value
      const previous = queryClient.getQueryData(['submissions']);
      
      // Optimistically update
      queryClient.setQueryData(['submissions'], (old) =>
        old.map((s) =>
          s.id === submissionId ? { ...s, status: 'approved' } : s
        )
      );
      
      return { previous };
    },
    onError: (err, submissionId, context) => {
      // Rollback on error
      queryClient.setQueryData(['submissions'], context.previous);
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries(['submissions']);
    },
  });
}
```

## State Pattern Guidelines

### Consistency

1. **Loading:** Always show loading state during async operations
2. **Errors:** Always display errors with actionable information
3. **Empty:** Always provide empty states with next steps
4. **Success:** Confirm successful actions with feedback

### User Experience

1. **Non-Blocking:** Use toasts for non-critical feedback
2. **Actionable:** Provide clear next steps in error/empty states
3. **Optimistic:** Use optimistic updates for better perceived performance
4. **Accessible:** Ensure all states are accessible (ARIA, keyboard)

### Performance

1. **Skeleton Loading:** Maintain layout during load
2. **Lazy Loading:** Load data on demand
3. **Caching:** Cache data to reduce loading states
4. **Debouncing:** Debounce search/filter inputs

## References

## Related Documents

### Primary References
- [ui-component-specifications.md](./ui-component-specifications.md) - Component library specifications (loading indicators, error alerts, empty states, toasts)
- [design-system.md](./design-system.md) - Design tokens (colors, typography, spacing used in state components)
- [form-design-patterns.md](./form-design-patterns.md) - Form patterns (form loading, validation error states)

### Supporting Documents
- [README.md](./README.md) - Frontend documentation overview and navigation guide
- [routing-structure.md](./routing-structure.md) - Route definitions (routes that use state patterns)
- [role-based-ui-patterns.md](./role-based-ui-patterns.md) - Role-based UI patterns (role-based error messages and empty states)

### External References
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [React Hook Form Error Handling](https://react-hook-form.com/get-started#Handleerrors)
- [shadcn/ui Components](https://ui.shadcn.com/)

---

**Next Steps:**
1. Create reusable state components (Loading, Error, Empty, Success)
2. Implement state management hooks
3. Build state pattern utilities
4. Test all state patterns

