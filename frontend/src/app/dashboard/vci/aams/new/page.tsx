'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ArrowLeft, Send, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { DeadlineIndicator, DeadlineProgress } from '@/components/vci/deadline-indicator'
import { SKUDataEntryTable, SKUDataEntry } from '@/components/vci/sku-data-entry-table'
import { useVCIMutations, getDaysUntilDeadline } from '@/hooks/use-vci'
import { useUserRole } from '@/hooks/use-user-role'
import { RoleGuard } from '@/components/guards/role-guard'

// Task 1.1.3.13: AAMS submission create/edit form

const currentYear = new Date().getFullYear()

export default function NewAAMSPage() {
  const router = useRouter()
  const { userCompanyId } = useUserRole()
  const { submitAAMS } = useVCIMutations()

  const [year, setYear] = React.useState(currentYear)
  const [entries, setEntries] = React.useState<SKUDataEntry[]>([{ sku_id: '', quantity: '' }])
  const [errors, setErrors] = React.useState<Record<number, string>>({})
  const [submitError, setSubmitError] = React.useState<string | null>(null)

  const validateEntries = (): boolean => {
    const newErrors: Record<number, string> = {}
    let isValid = true

    entries.forEach((entry, index) => {
      if (!entry.sku_id) {
        newErrors[index] = 'Please select a SKU'
        isValid = false
      } else if (typeof entry.quantity !== 'number' || entry.quantity <= 0) {
        newErrors[index] = 'Please enter a valid quantity'
        isValid = false
      }
    })

    // Check for duplicate SKUs
    const skuIds = entries.map((e) => e.sku_id).filter(Boolean)
    const uniqueSkuIds = new Set(skuIds)
    if (skuIds.length !== uniqueSkuIds.size) {
      setSubmitError('Each SKU can only be added once')
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    if (!validateEntries()) return

    const submissionData = entries
      .filter((e) => e.sku_id && typeof e.quantity === 'number' && e.quantity > 0)
      .map((e) => ({
        sku_id: e.sku_id,
        quantity: e.quantity as number,
      }))

    if (submissionData.length === 0) {
      setSubmitError('Please add at least one SKU with quantity')
      return
    }

    try {
      await submitAAMS.mutateAsync({
        year,
        submission_data: submissionData,
      })
      router.push('/dashboard/vci/aams')
    } catch (error) {
      // Error handled by mutation
    }
  }

  const daysUntilDeadline = getDaysUntilDeadline(year)
  const isUrgent = daysUntilDeadline <= 7 && daysUntilDeadline > 0

  return (
    <RoleGuard allowedRoles={['company_admin', 'company_manager']}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/vci/aams">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <h2 className="text-xl font-semibold">Submit AAMS</h2>
            <p className="text-sm text-muted-foreground">
              Annual Average Monthly Sales Declaration
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Year Selection & Deadline */}
          <Card>
            <CardHeader>
              <CardTitle>Submission Year</CardTitle>
              <CardDescription>
                Select the year for your AAMS submission
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Select
                    value={year.toString()}
                    onValueChange={(v) => setYear(parseInt(v))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={currentYear.toString()}>{currentYear}</SelectItem>
                      <SelectItem value={(currentYear - 1).toString()}>{currentYear - 1}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Deadline Status</Label>
                  <DeadlineIndicator year={year} variant="compact" />
                </div>
              </div>
              <DeadlineProgress year={year} />
            </CardContent>
          </Card>

          {/* Urgent Warning */}
          {isUrgent && (
            <Alert variant="destructive">
              <AlertDescription>
                <strong>Urgent:</strong> Only {daysUntilDeadline} day(s) remaining until the
                deadline. Submit your AAMS as soon as possible.
              </AlertDescription>
            </Alert>
          )}

          {/* SKU Data Entry */}
          <SKUDataEntryTable
            entries={entries}
            onChange={setEntries}
            companyId={userCompanyId}
            errors={errors}
          />

          {/* Submit Error */}
          {submitError && (
            <Alert variant="destructive">
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/dashboard/vci/aams">Cancel</Link>
            </Button>
            <Button type="submit" disabled={submitAAMS.isPending}>
              {submitAAMS.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit AAMS
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </RoleGuard>
  )
}
