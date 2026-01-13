'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Send, Loader2, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { WSLBulkEntryTable } from '@/components/vci/wsl-bulk-entry-table'
import { useWSLMutations, getWeekEndingFriday, WSLSubmissionItem } from '@/hooks/use-vci'
import { useUserRole } from '@/hooks/use-user-role'
import { RoleGuard } from '@/components/guards/role-guard'
import { format, isFriday, previousFriday } from 'date-fns'

// Task 1.1.5.14: WSL submission form

interface WSLEntry extends WSLSubmissionItem {
  is_breach?: boolean
}

export default function NewWSLPage() {
  const router = useRouter()
  const { userCompanyId } = useUserRole()
  const { submitWSL } = useWSLMutations()

  // Default to last Friday if today is not Friday
  const defaultDate = isFriday(new Date()) ? new Date() : previousFriday(new Date())
  const [weekEndingDate, setWeekEndingDate] = React.useState(
    format(defaultDate, 'yyyy-MM-dd')
  )
  const [entries, setEntries] = React.useState<WSLEntry[]>([])
  const [submitError, setSubmitError] = React.useState<string | null>(null)

  const validateDate = (dateStr: string): boolean => {
    const date = new Date(dateStr)
    if (!isFriday(date)) {
      setSubmitError('Week ending date must be a Friday')
      return false
    }
    if (date > new Date()) {
      setSubmitError('Cannot submit for future weeks')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    if (!validateDate(weekEndingDate)) return

    // Filter to entries with stock levels entered
    const submissionData = entries
      .filter((e) => e.sku_id)
      .map((e) => ({
        sku_id: e.sku_id,
        stock_level: e.stock_level || 0,
        breach_reason: e.breach_reason,
        replenishment_date: e.replenishment_date,
      }))

    if (submissionData.length === 0) {
      setSubmitError('No SKUs found. Please ensure your company has active SKUs.')
      return
    }

    try {
      await submitWSL.mutateAsync({
        week_ending_date: weekEndingDate,
        submission_data: submissionData,
      })
      router.push('/dashboard/vci/wsl')
    } catch {
      // Error handled by mutation
    }
  }

  const breachCount = entries.filter((e) => e.is_breach).length

  return (
    <RoleGuard allowedRoles={['company_admin', 'company_manager']}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/vci/wsl">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <h2 className="text-xl font-semibold">Submit WSL</h2>
            <p className="text-sm text-muted-foreground">
              Weekly Stock Level Declaration
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Week Ending Date */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Week Ending Date
              </CardTitle>
              <CardDescription>
                Select the Friday that ends the reporting week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-xs">
                <Label>Week Ending (Friday)</Label>
                <Input
                  type="date"
                  value={weekEndingDate}
                  onChange={(e) => {
                    setWeekEndingDate(e.target.value)
                    setSubmitError(null)
                  }}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Deadline: Friday 17:00 Morocco time
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Task 1.1.5.14a: WSLBulkEntryTable */}
          <WSLBulkEntryTable
            entries={entries}
            onChange={setEntries}
            companyId={userCompanyId}
            showBreachFields={true}
          />

          {/* Breach Warning */}
          {breachCount > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                <strong>{breachCount} SKU(s)</strong> are below their threshold. These will be
                flagged as breaches and require MOH review.
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Error */}
          {submitError && (
            <Alert variant="destructive">
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/dashboard/vci/wsl">Cancel</Link>
            </Button>
            <Button type="submit" disabled={submitWSL.isPending || entries.length === 0}>
              {submitWSL.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit WSL
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </RoleGuard>
  )
}
