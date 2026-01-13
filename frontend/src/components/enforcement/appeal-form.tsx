'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
import { useEnforcementMutations } from '@/hooks/use-enforcement'
import { Loader2, Send, AlertCircle } from 'lucide-react'

// Task 1.1.2.44: Appeal submission form

const APPEAL_GROUNDS = [
  'Factual Error',
  'Procedural Violation',
  'Disproportionate Penalty',
  'Extenuating Circumstances',
  'New Evidence',
  'Regulatory Misinterpretation',
  'Other',
]

const appealSchema = z.object({
  appeal_grounds: z.string().min(1, 'Please select appeal grounds'),
  appeal_explanation: z.string().min(50, 'Explanation must be at least 50 characters'),
})

type AppealFormData = z.infer<typeof appealSchema>

interface AppealFormProps {
  actionId: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function AppealForm({ actionId, onSuccess, onCancel }: AppealFormProps) {
  const { appealAction } = useEnforcementMutations()

  const form = useForm<AppealFormData>({
    resolver: zodResolver(appealSchema),
    defaultValues: {
      appeal_grounds: '',
      appeal_explanation: '',
    },
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form

  const formValues = watch()

  const onSubmit = async (data: AppealFormData) => {
    try {
      await appealAction.mutateAsync({
        id: actionId,
        appeal_grounds: data.appeal_grounds,
        appeal_explanation: data.appeal_explanation,
      })
      onSuccess?.()
    } catch (error) {
      // Error handled by mutation
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You have 30 days from the execution date to submit an appeal. Appeals
          are reviewed by MOH Tier 1 and decisions are final.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Submit Appeal</CardTitle>
          <CardDescription>
            Provide grounds and detailed explanation for your appeal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="appeal_grounds">
              Appeal Grounds <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formValues.appeal_grounds}
              onValueChange={(value) => setValue('appeal_grounds', value)}
            >
              <SelectTrigger aria-invalid={!!errors.appeal_grounds}>
                <SelectValue placeholder="Select grounds for appeal" />
              </SelectTrigger>
              <SelectContent>
                {APPEAL_GROUNDS.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.appeal_grounds && (
              <p className="text-sm text-destructive">{errors.appeal_grounds.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="appeal_explanation">
              Detailed Explanation <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="appeal_explanation"
              {...register('appeal_explanation')}
              placeholder="Provide a comprehensive explanation supporting your appeal (minimum 50 characters)..."
              rows={6}
              aria-invalid={!!errors.appeal_explanation}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Minimum 50 characters required</span>
              <span>{formValues.appeal_explanation?.length || 0} / 50</span>
            </div>
            {errors.appeal_explanation && (
              <p className="text-sm text-destructive">{errors.appeal_explanation.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Submit Appeal
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

// Task 1.1.2.43: Appeal review interface
interface AppealReviewFormProps {
  actionId: string
  appealGrounds: string
  appealExplanation: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function AppealReviewForm({
  actionId,
  appealGrounds,
  appealExplanation,
  onSuccess,
  onCancel,
}: AppealReviewFormProps) {
  const { resolveAppeal } = useEnforcementMutations()
  const [resolution, setResolution] = React.useState<string>('')
  const [notes, setNotes] = React.useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resolution || notes.length < 50) return

    try {
      await resolveAppeal.mutateAsync({
        id: actionId,
        resolution,
        resolution_notes: notes,
      })
      onSuccess?.()
    } catch (error) {
      // Error handled by mutation
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Appeal details */}
      <Card>
        <CardHeader>
          <CardTitle>Appeal Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-muted-foreground">Appeal Grounds</Label>
            <p className="mt-1 font-medium">{appealGrounds}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Explanation</Label>
            <p className="mt-1 p-3 bg-muted rounded-md text-sm">{appealExplanation}</p>
          </div>
        </CardContent>
      </Card>

      {/* Resolution */}
      <Card>
        <CardHeader>
          <CardTitle>Resolution Decision</CardTitle>
          <CardDescription>
            Review the appeal and provide your decision
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>
              Resolution <span className="text-destructive">*</span>
            </Label>
            <Select value={resolution} onValueChange={setResolution}>
              <SelectTrigger>
                <SelectValue placeholder="Select resolution" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upheld">
                  Uphold Appeal - Reverse enforcement action
                </SelectItem>
                <SelectItem value="partially_upheld">
                  Partially Uphold - Modify enforcement action
                </SelectItem>
                <SelectItem value="rejected">
                  Reject Appeal - Maintain enforcement action
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>
              Resolution Notes <span className="text-destructive">*</span>
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide detailed reasoning for your decision (minimum 50 characters)..."
              rows={5}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Minimum 50 characters required</span>
              <span>{notes.length} / 50</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={!resolution || notes.length < 50 || resolveAppeal.isPending}
        >
          {resolveAppeal.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resolving...
            </>
          ) : (
            'Submit Resolution'
          )}
        </Button>
      </div>
    </form>
  )
}
