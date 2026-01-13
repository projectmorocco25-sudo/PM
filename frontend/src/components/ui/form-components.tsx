'use client'

/**
 * Task 1.1.1.17g: Form Components
 * Task 1.1.1.18b: FormField wrapper component (label, error, helper text, required indicator)
 * Task 1.1.1.18c: FormGroup component (field grouping, sectioned forms)
 * 
 * Form components for building consistent forms across the application.
 * Works with react-hook-form and Zod validation.
 * 
 * @see docs/02-architecture/frontend/form-design-patterns.md
 * @see docs/02-architecture/frontend/ui-component-specifications.md
 */

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { AlertCircle, HelpCircle, CheckCircle2 } from 'lucide-react'

// ============================================================================
// FormField Component
// ============================================================================

interface FormFieldProps {
  /** Field label */
  label: string
  /** HTML for attribute (links label to input) */
  htmlFor?: string
  /** Error message */
  error?: string
  /** Helper text */
  helperText?: string
  /** Whether the field is required */
  required?: boolean
  /** Whether the field is optional (shows "(optional)" label) */
  optional?: boolean
  /** Whether the field is disabled */
  disabled?: boolean
  /** Success message */
  success?: string
  /** Children (input component) */
  children: React.ReactNode
  /** Additional className */
  className?: string
}

/**
 * Form field wrapper with label, error, and helper text
 * 
 * @example
 * <FormField label="Email" error={errors.email?.message} required>
 *   <Input id="email" {...register('email')} />
 * </FormField>
 */
export function FormField({
  label,
  htmlFor,
  error,
  helperText,
  required,
  optional,
  disabled,
  success,
  children,
  className,
}: FormFieldProps) {
  const id = htmlFor || React.useId()
  const errorId = `${id}-error`
  const helperId = `${id}-helper`
  
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <Label
          htmlFor={id}
          className={cn(
            disabled && 'text-muted-foreground cursor-not-allowed'
          )}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
          {optional && <span className="text-muted-foreground text-sm ml-1">(optional)</span>}
        </Label>
      </div>
      
      <div className="relative">
        {React.cloneElement(children as React.ReactElement, {
          id,
          'aria-invalid': !!error,
          'aria-describedby': error ? errorId : helperText ? helperId : undefined,
          disabled,
          className: cn(
            (children as React.ReactElement).props.className,
            error && 'border-destructive focus-visible:ring-destructive',
            success && 'border-green-500 focus-visible:ring-green-500'
          ),
        })}
      </div>
      
      {error && (
        <FormError id={errorId}>{error}</FormError>
      )}
      
      {success && !error && (
        <FormSuccess>{success}</FormSuccess>
      )}
      
      {helperText && !error && !success && (
        <FormHelperText id={helperId}>{helperText}</FormHelperText>
      )}
    </div>
  )
}

// ============================================================================
// FormGroup Component
// ============================================================================

interface FormGroupProps {
  /** Group title */
  title?: string
  /** Group description */
  description?: string
  /** Children */
  children: React.ReactNode
  /** Additional className */
  className?: string
}

/**
 * Form group for organizing related fields
 * 
 * @example
 * <FormGroup title="Contact Information" description="How can we reach you?">
 *   <FormField label="Email">...</FormField>
 *   <FormField label="Phone">...</FormField>
 * </FormGroup>
 */
export function FormGroup({
  title,
  description,
  children,
  className,
}: FormGroupProps) {
  return (
    <fieldset className={cn('space-y-4', className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <legend className="text-base font-semibold text-foreground">
              {title}
            </legend>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </fieldset>
  )
}

// ============================================================================
// FormError Component
// ============================================================================

interface FormErrorProps {
  id?: string
  children: React.ReactNode
  className?: string
}

/**
 * Form error message component
 * 
 * @example
 * <FormError>This field is required</FormError>
 */
export function FormError({ id, children, className }: FormErrorProps) {
  return (
    <div
      id={id}
      role="alert"
      className={cn('flex items-center gap-1.5 text-sm text-destructive', className)}
    >
      <AlertCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </div>
  )
}

// ============================================================================
// FormSuccess Component
// ============================================================================

interface FormSuccessProps {
  children: React.ReactNode
  className?: string
}

/**
 * Form success message component
 * 
 * @example
 * <FormSuccess>Email is available</FormSuccess>
 */
export function FormSuccess({ children, className }: FormSuccessProps) {
  return (
    <div
      role="status"
      className={cn('flex items-center gap-1.5 text-sm text-green-600', className)}
    >
      <CheckCircle2 className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </div>
  )
}

// ============================================================================
// FormHelperText Component
// ============================================================================

interface FormHelperTextProps {
  id?: string
  children: React.ReactNode
  className?: string
}

/**
 * Form helper text component
 * 
 * @example
 * <FormHelperText>We'll never share your email</FormHelperText>
 */
export function FormHelperText({ id, children, className }: FormHelperTextProps) {
  return (
    <div
      id={id}
      className={cn('flex items-start gap-1.5 text-sm text-muted-foreground', className)}
    >
      <HelpCircle className="h-4 w-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
      <span>{children}</span>
    </div>
  )
}

// ============================================================================
// FormActions Component
// ============================================================================

interface FormActionsProps {
  /** Alignment of buttons */
  align?: 'left' | 'right' | 'center' | 'between'
  /** Children (buttons) */
  children: React.ReactNode
  /** Additional className */
  className?: string
}

/**
 * Form actions container for form buttons
 * 
 * @example
 * <FormActions align="right">
 *   <Button variant="outline">Cancel</Button>
 *   <Button type="submit">Save</Button>
 * </FormActions>
 */
export function FormActions({ align = 'right', children, className }: FormActionsProps) {
  const alignmentClasses = {
    left: 'justify-start',
    right: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
  }
  
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-3 pt-4',
        alignmentClasses[align],
        className
      )}
    >
      {children}
    </div>
  )
}

// ============================================================================
// FormSection Component
// ============================================================================

interface FormSectionProps {
  /** Section title */
  title: string
  /** Section description */
  description?: string
  /** Children */
  children: React.ReactNode
  /** Additional className */
  className?: string
}

/**
 * Form section for multi-step or long forms
 * 
 * @example
 * <FormSection title="Company Details" description="Basic information about your company">
 *   <FormField label="Company Name">...</FormField>
 * </FormSection>
 */
export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <div className={cn('space-y-6 pb-6 border-b last:border-0 last:pb-0', className)}>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

// ============================================================================
// FormRow Component
// ============================================================================

interface FormRowProps {
  /** Number of columns */
  columns?: 1 | 2 | 3 | 4
  /** Children */
  children: React.ReactNode
  /** Additional className */
  className?: string
}

/**
 * Form row for horizontal field layout
 * 
 * @example
 * <FormRow columns={2}>
 *   <FormField label="First Name">...</FormField>
 *   <FormField label="Last Name">...</FormField>
 * </FormRow>
 */
export function FormRow({ columns = 2, children, className }: FormRowProps) {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }
  
  return (
    <div className={cn('grid gap-4', columnClasses[columns], className)}>
      {children}
    </div>
  )
}
