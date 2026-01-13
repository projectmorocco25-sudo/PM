'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { SKUDataEntryTable, SKUDataEntry } from './sku-data-entry-table'
import {
  useMSQMutations,
  MSQSubmission,
  MSQSubmissionItem,
  getDaysRemainingInGracePeriod,
  isMSQWithinGracePeriod,
  getMSQGracePeriodEnd,
} from '@/hooks/use-vci'
import { format, differenceInDays, differenceInHours } from 'date-fns'
import { Clock, AlertTriangle, Edit, CheckCircle2, Loader2 } from 'lucide-react'

// Task 1.1.4.11 & 1.1.4.11a: MSQ correction interface and CorrectionInterface component

interface CorrectionInterfaceProps {
  submission: MSQSubmission
  onCorrectionSubmitted?: () => void
  className?: string
}

export function CorrectionInterface({
  submission,
  onCorrectionSubmitted,
  className,
}: CorrectionInterfaceProps) {
  const { correctMSQ } = useMSQMutations()
  
  const [isEditing, setIsEditing] = React.useState(false)
  const [entries, setEntries] = React.useState<SKUDataEntry[]>([])
  const [errors, setErrors] = React.useState<Record<number, string>>({})

  const withinGracePeriod = isMSQWithinGracePeriod(submission.submitted_at)
  const daysRemaining = getDaysRemainingInGracePeriod(submission.submitted_at)
  const graceEnd = getMSQGracePeriodEnd(submission.submitted_at)
  const hoursRemaining = Math.max(0, differenceInHours(graceEnd, new Date()))

  // Calculate progress (7 days total)
  const totalHours = 7 * 24
  const hoursPassed = totalHours - hoursRemaining
  const progress = Math.min(100, (hoursPassed / totalHours) * 100)

  // Initialize entries from submission data
  React.useEffect(() => {
    if (submission.submission_data) {
      setEntries(
        submission.submission_data.map((item) => ({
          sku_id: item.sku_id,
          quantity: item.quantity,
        }))
      )
    }
  }, [submission.submission_data])

  const validateEntries = (): boolean => {
    const newErrors: Record<number, string> = {}
    let isValid = true

    entries.forEach((entry, index) => {
      if (!entry.sku_id) {
        newErrors[index] = 'Please select a SKU'
        isValid = false
      } else if (typeof entry.quantity !== 'number' || entry.quantity < 0) {
        newErrors[index] = 'Please enter a valid quantity'
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleSubmitCorrection = async () => {
    if (!validateEntries()) return

    const correctedData = entries
      .filter((e) => e.sku_id && typeof e.quantity === 'number')
      .map((e) => ({
        sku_id: e.sku_id,
        quantity: e.quantity as number,
      }))

    try {
      await correctMSQ.mutateAsync({
        originalId: submission.id,
        correctedData,
      })
      setIsEditing(false)
      onCorrectionSubmitted?.()
    } catch {
      // Error handled by mutation
    }
  }

  // Cannot edit if outside grace period or already corrected
  const canEdit = withinGracePeriod && 
    submission.status !== 'rejected' && 
    !submission.correction_of

  // Check if this submission has been superseded
  const isSuperseded = submission.validation_flags?.some(
    (f) => f.type === 'superseded'
  )

  if (isSuperseded) {
    return (
      <Card className={className}>
        <CardContent className="py-6 text-center">
          <Badge variant="secondary">Superseded</Badge>
          <p className="text-sm text-muted-foreground mt-2">
            This submission has been corrected. View the correction for the latest data.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Correction Window
            </CardTitle>
            <CardDescription>
              Make corrections within 7 days of submission
            </CardDescription>
          </div>
          {canEdit && !isEditing && (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Submission
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Grace Period Status */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Grace period expires</span>
            <span className="font-medium">
              {format(graceEnd, 'PPP p')}
            </span>
          </div>
          
          <Progress 
            value={progress} 
            className="h-2"
          />
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Submitted {format(new Date(submission.submitted_at), 'PPP')}
            </span>
            <span className={withinGracePeriod ? 'text-green-600 font-medium' : 'text-destructive font-medium'}>
              {withinGracePeriod
                ? daysRemaining > 0
                  ? `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining`
                  : `${hoursRemaining} hour${hoursRemaining !== 1 ? 's' : ''} remaining`
                : 'Expired'}
            </span>
          </div>
        </div>

        {/* Status Alert */}
        {!withinGracePeriod && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Grace Period Expired</AlertTitle>
            <AlertDescription>
              The 7-day correction window has closed. You can no longer edit this submission.
            </AlertDescription>
          </Alert>
        )}

        {withinGracePeriod && daysRemaining <= 1 && !isEditing && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertTitle>Running Out of Time</AlertTitle>
            <AlertDescription>
              Only {hoursRemaining} hour{hoursRemaining !== 1 ? 's' : ''} remaining to make corrections.
            </AlertDescription>
          </Alert>
        )}

        {/* Edit Form */}
        {isEditing && (
          <div className="space-y-4">
            <SKUDataEntryTable
              entries={entries}
              onChange={setEntries}
              companyId={submission.company_id}
              errors={errors}
            />

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  // Reset entries to original
                  setEntries(
                    submission.submission_data.map((item) => ({
                      sku_id: item.sku_id,
                      quantity: item.quantity,
                    }))
                  )
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitCorrection}
                disabled={correctMSQ.isPending}
              >
                {correctMSQ.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Submit Correction
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Read-only Data Preview */}
        {!isEditing && (
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-2 text-left text-sm font-medium">SKU ID</th>
                  <th className="px-4 py-2 text-right text-sm font-medium">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {submission.submission_data?.map((item, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="px-4 py-2 font-mono text-sm">
                      {item.sku_id.slice(0, 8)}...
                    </td>
                    <td className="px-4 py-2 text-right font-mono">
                      {item.quantity.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Grace period indicator badge
export function GracePeriodBadge({ submittedAt }: { submittedAt: string }) {
  const withinGracePeriod = isMSQWithinGracePeriod(submittedAt)
  const daysRemaining = getDaysRemainingInGracePeriod(submittedAt)

  if (!withinGracePeriod) {
    return (
      <Badge variant="secondary" className="gap-1">
        <Clock className="h-3 w-3" />
        Expired
      </Badge>
    )
  }

  return (
    <Badge 
      variant={daysRemaining <= 2 ? 'destructive' : 'outline'} 
      className="gap-1"
    >
      <Clock className="h-3 w-3" />
      {daysRemaining}d left
    </Badge>
  )
}
