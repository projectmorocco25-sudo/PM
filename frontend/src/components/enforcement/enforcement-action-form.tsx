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
import { useEnforcementMutations, ActionType } from '@/hooks/use-enforcement'
import { useCompanies } from '@/hooks/use-rmm'
import { Loader2, Send, X, AlertCircle, ChevronRight, ChevronLeft } from 'lucide-react'

// Task 1.1.2.40: Create enforcement action wizard

const VIOLATION_TYPES = [
  'Stock Threshold Breach',
  'Late WSL Submission',
  'Missing MSQ Submission',
  'Data Quality Violation',
  'Non-Compliance with Regulations',
  'Unauthorized Export',
  'Documentation Failure',
  'Other',
]

const LEGAL_BASIS_OPTIONS = [
  'Law 17-04 Article 12',
  'Law 17-04 Article 15',
  'Law 17-04 Article 18',
  'Decree 2-14-841',
  'Ministry Circular 2023-01',
  'Ministry Circular 2024-03',
  'Other',
]

const enforcementSchema = z.object({
  company_id: z.string().uuid('Please select a company'),
  action_type: z.enum(['warning', 'fine', 'suspension', 'license_revocation'], {
    required_error: 'Please select an action type',
  }),
  violation_type: z.string().min(1, 'Please select a violation type'),
  legal_basis: z.string().min(1, 'Please provide legal basis'),
  justification: z.string().min(50, 'Justification must be at least 50 characters'),
  fine_amount: z.number().positive().optional(),
  suspension_start_date: z.string().optional(),
  suspension_end_date: z.string().optional(),
}).refine(data => {
  if (data.action_type === 'fine' && !data.fine_amount) {
    return false
  }
  return true
}, { message: 'Fine amount is required', path: ['fine_amount'] })
.refine(data => {
  if (data.action_type === 'suspension' && (!data.suspension_start_date || !data.suspension_end_date)) {
    return false
  }
  return true
}, { message: 'Suspension dates are required', path: ['suspension_start_date'] })

type EnforcementFormData = z.infer<typeof enforcementSchema>

interface EnforcementActionFormProps {
  onSuccess?: () => void
}

export function EnforcementActionForm({ onSuccess }: EnforcementActionFormProps) {
  const router = useRouter()
  const { submitForReview } = useEnforcementMutations()
  const [step, setStep] = React.useState(1)

  const { data: companiesData } = useCompanies({ limit: 100 })
  const companies = companiesData?.companies || []

  const form = useForm<EnforcementFormData>({
    resolver: zodResolver(enforcementSchema),
    defaultValues: {
      company_id: '',
      action_type: undefined,
      violation_type: '',
      legal_basis: '',
      justification: '',
      fine_amount: undefined,
      suspension_start_date: '',
      suspension_end_date: '',
    },
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = form

  const formValues = watch()

  const onSubmit = async (data: EnforcementFormData) => {
    try {
      await submitForReview.mutateAsync({
        company_id: data.company_id,
        action_type: data.action_type as ActionType,
        violation_type: data.violation_type,
        legal_basis: data.legal_basis,
        justification: data.justification,
        fine_amount: data.fine_amount,
        suspension_start_date: data.suspension_start_date,
        suspension_end_date: data.suspension_end_date,
      })
      onSuccess?.()
      router.push('/dashboard/enforcement/actions')
    } catch (error) {
      // Error handled by mutation
    }
  }

  const nextStep = async () => {
    let fieldsToValidate: (keyof EnforcementFormData)[] = []
    if (step === 1) fieldsToValidate = ['company_id', 'action_type']
    if (step === 2) fieldsToValidate = ['violation_type', 'legal_basis']
    
    const valid = await trigger(fieldsToValidate)
    if (valid) setStep(step + 1)
  }

  const prevStep = () => setStep(step - 1)

  const hasErrors = Object.keys(errors).length > 0

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= s
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div className={`w-16 h-1 ${step > s ? 'bg-primary' : 'bg-muted'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {hasErrors && step === 3 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please correct the errors before submitting.
          </AlertDescription>
        </Alert>
      )}

      {/* Step 1: Action Type & Company */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Select Action Type & Company</CardTitle>
            <CardDescription>
              Choose the type of enforcement action and target company
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="action_type">
                Action Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formValues.action_type}
                onValueChange={(value) => setValue('action_type', value as ActionType)}
              >
                <SelectTrigger aria-invalid={!!errors.action_type}>
                  <SelectValue placeholder="Select action type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="fine">Fine</SelectItem>
                  <SelectItem value="suspension">Suspension</SelectItem>
                  <SelectItem value="license_revocation">License Revocation</SelectItem>
                </SelectContent>
              </Select>
              {errors.action_type && (
                <p className="text-sm text-destructive">{errors.action_type.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Note: Tier 2 can only submit warnings. Fines and suspensions require Tier 1.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_id">
                Company <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formValues.company_id}
                onValueChange={(value) => setValue('company_id', value)}
              >
                <SelectTrigger aria-invalid={!!errors.company_id}>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.company_id && (
                <p className="text-sm text-destructive">{errors.company_id.message}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Violation & Legal Basis */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Violation Details & Legal Basis</CardTitle>
            <CardDescription>
              Specify the violation and provide legal justification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="violation_type">
                Violation Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formValues.violation_type}
                onValueChange={(value) => setValue('violation_type', value)}
              >
                <SelectTrigger aria-invalid={!!errors.violation_type}>
                  <SelectValue placeholder="Select violation type" />
                </SelectTrigger>
                <SelectContent>
                  {VIOLATION_TYPES.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.violation_type && (
                <p className="text-sm text-destructive">{errors.violation_type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="legal_basis">
                Legal Basis <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formValues.legal_basis}
                onValueChange={(value) => setValue('legal_basis', value)}
              >
                <SelectTrigger aria-invalid={!!errors.legal_basis}>
                  <SelectValue placeholder="Select legal basis" />
                </SelectTrigger>
                <SelectContent>
                  {LEGAL_BASIS_OPTIONS.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.legal_basis && (
                <p className="text-sm text-destructive">{errors.legal_basis.message}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Details & Justification */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Action Details & Justification</CardTitle>
            <CardDescription>
              Provide specific details and comprehensive justification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formValues.action_type === 'fine' && (
              <div className="space-y-2">
                <Label htmlFor="fine_amount">
                  Fine Amount (MAD) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fine_amount"
                  type="number"
                  {...register('fine_amount', { valueAsNumber: true })}
                  placeholder="Enter fine amount"
                  aria-invalid={!!errors.fine_amount}
                />
                {errors.fine_amount && (
                  <p className="text-sm text-destructive">{errors.fine_amount.message}</p>
                )}
              </div>
            )}

            {formValues.action_type === 'suspension' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="suspension_start_date">
                    Start Date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="suspension_start_date"
                    type="date"
                    {...register('suspension_start_date')}
                    aria-invalid={!!errors.suspension_start_date}
                  />
                  {errors.suspension_start_date && (
                    <p className="text-sm text-destructive">{errors.suspension_start_date.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="suspension_end_date">
                    End Date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="suspension_end_date"
                    type="date"
                    {...register('suspension_end_date')}
                    aria-invalid={!!errors.suspension_end_date}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="justification">
                Justification <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="justification"
                {...register('justification')}
                placeholder="Provide comprehensive justification for this enforcement action (minimum 50 characters)..."
                rows={5}
                aria-invalid={!!errors.justification}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Minimum 50 characters required</span>
                <span>{formValues.justification?.length || 0} / 50</span>
              </div>
              {errors.justification && (
                <p className="text-sm text-destructive">{errors.justification.message}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div>
          {step > 1 && (
            <Button type="button" variant="outline" onClick={prevStep}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          {step < 3 ? (
            <Button type="button" onClick={nextStep}>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit for Review
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}
