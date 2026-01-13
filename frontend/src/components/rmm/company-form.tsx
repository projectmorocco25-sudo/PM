'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useCompanyMutations, Company } from '@/hooks/use-rmm'
import { useDebounce } from '@/hooks/use-api'
import { Loader2, Save, X, AlertCircle } from 'lucide-react'

// Task 1.1.2.19: Company create/edit forms
// Task 1.1.2.19a: Draft auto-save functionality
// Task 1.1.2.19b: Form sections
// Task 1.1.2.19c: Form error display

const companySchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters'),
  registration_number: z.string().min(3, 'Registration number is required'),
  company_type: z.enum(['ipc', 'wholesaler'], {
    required_error: 'Please select a company type',
  }),
  address: z.string().optional(),
  contact_email: z.string().email('Invalid email address').optional().or(z.literal('')),
  contact_phone: z.string().optional(),
})

type CompanyFormData = z.infer<typeof companySchema>

interface CompanyFormProps {
  company?: Company | null
  onSuccess?: () => void
}

export function CompanyForm({ company, onSuccess }: CompanyFormProps) {
  const router = useRouter()
  const { createCompany, updateCompany } = useCompanyMutations()
  const [autoSaveStatus, setAutoSaveStatus] = React.useState<'idle' | 'saving' | 'saved'>('idle')

  const isEdit = !!company

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: company?.name || '',
      registration_number: company?.registration_number || '',
      company_type: company?.company_type || undefined,
      address: company?.address || '',
      contact_email: company?.contact_email || '',
      contact_phone: company?.contact_phone || '',
    },
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty, isSubmitting },
  } = form

  // Task 1.1.2.19a: Auto-save draft functionality
  const formValues = watch()
  const debouncedValues = useDebounce(formValues, 2000)

  React.useEffect(() => {
    if (!isEdit && isDirty && debouncedValues.name) {
      setAutoSaveStatus('saving')
      // Save to localStorage as draft
      localStorage.setItem('rmm_company_draft', JSON.stringify(debouncedValues))
      setTimeout(() => setAutoSaveStatus('saved'), 500)
    }
  }, [debouncedValues, isEdit, isDirty])

  // Load draft on mount
  React.useEffect(() => {
    if (!isEdit) {
      const draft = localStorage.getItem('rmm_company_draft')
      if (draft) {
        try {
          const parsed = JSON.parse(draft)
          Object.entries(parsed).forEach(([key, value]) => {
            setValue(key as keyof CompanyFormData, value as string)
          })
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
  }, [isEdit, setValue])

  const onSubmit = async (data: CompanyFormData) => {
    try {
      if (isEdit && company) {
        await updateCompany.mutateAsync({
          id: company.id,
          ...data,
        })
      } else {
        await createCompany.mutateAsync(data)
        localStorage.removeItem('rmm_company_draft')
      }
      onSuccess?.()
      router.push('/dashboard/rmm/companies')
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleCancel = () => {
    if (!isEdit) {
      localStorage.removeItem('rmm_company_draft')
    }
    router.back()
  }

  // Task 1.1.2.19c: Form-level errors
  const hasErrors = Object.keys(errors).length > 0

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Form-level error display */}
      {hasErrors && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please correct the errors below before submitting.
          </AlertDescription>
        </Alert>
      )}

      {/* Auto-save indicator */}
      {!isEdit && autoSaveStatus !== 'idle' && (
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          {autoSaveStatus === 'saving' && (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Saving draft...
            </>
          )}
          {autoSaveStatus === 'saved' && (
            <>
              <Save className="h-3 w-3" />
              Draft saved
            </>
          )}
        </div>
      )}

      {/* Task 1.1.2.19b: Company Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>
            Basic information about the company
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                Company Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Enter company name"
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="registration_number">
                Registration Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="registration_number"
                {...register('registration_number')}
                placeholder="Enter registration number"
                disabled={isEdit}
                aria-invalid={!!errors.registration_number}
              />
              {errors.registration_number && (
                <p className="text-sm text-destructive">
                  {errors.registration_number.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_type">
                Company Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formValues.company_type}
                onValueChange={(value) =>
                  setValue('company_type', value as 'ipc' | 'wholesaler')
                }
                disabled={isEdit}
              >
                <SelectTrigger aria-invalid={!!errors.company_type}>
                  <SelectValue placeholder="Select company type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ipc">IPC (Industrial Pharmaceutical Company)</SelectItem>
                  <SelectItem value="wholesaler">Wholesaler</SelectItem>
                </SelectContent>
              </Select>
              {errors.company_type && (
                <p className="text-sm text-destructive">
                  {errors.company_type.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            Company contact details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              {...register('address')}
              placeholder="Enter company address"
              rows={3}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contact_email">Email</Label>
              <Input
                id="contact_email"
                type="email"
                {...register('contact_email')}
                placeholder="contact@company.com"
                aria-invalid={!!errors.contact_email}
              />
              {errors.contact_email && (
                <p className="text-sm text-destructive">
                  {errors.contact_email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_phone">Phone</Label>
              <Input
                id="contact_phone"
                {...register('contact_phone')}
                placeholder="+1 234 567 8900"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEdit ? 'Saving...' : 'Creating...'}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {isEdit ? 'Save Changes' : 'Create Company'}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
