'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Send, Loader2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SKUDataEntryTable, SKUDataEntry } from '@/components/vci/sku-data-entry-table'
import { BulkUpload } from '@/components/vci/bulk-upload'
import { useMSQMutations, getMonthName, MSQSubmissionItem } from '@/hooks/use-vci'
import { useUserRole } from '@/hooks/use-user-role'
import { RoleGuard } from '@/components/guards/role-guard'

// Task 1.1.4.9: MSQ submission form
// Task 1.1.4.9a: SKUDataEntryTable component (reused from vci/sku-data-entry-table.tsx)
// Task 1.1.4.9b: BulkUpload component

const currentYear = new Date().getFullYear()
const currentMonth = new Date().getMonth() + 1

export default function NewMSQPage() {
  const router = useRouter()
  const { userCompanyId } = useUserRole()
  const { submitMSQ } = useMSQMutations()

  const [year, setYear] = React.useState(currentYear)
  const [month, setMonth] = React.useState(currentMonth)
  const [entries, setEntries] = React.useState<SKUDataEntry[]>([{ sku_id: '', quantity: '' }])
  const [errors, setErrors] = React.useState<Record<number, string>>({})
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [inputMode, setInputMode] = React.useState<'manual' | 'bulk'>('manual')

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

  const handleBulkDataParsed = (data: MSQSubmissionItem[]) => {
    setEntries(
      data.map((item) => ({
        sku_id: item.sku_id,
        quantity: item.quantity,
      }))
    )
    setInputMode('manual') // Switch to manual to show imported data
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    if (!validateEntries()) return

    const submissionData = entries
      .filter((e) => e.sku_id && typeof e.quantity === 'number' && e.quantity >= 0)
      .map((e) => ({
        sku_id: e.sku_id,
        quantity: e.quantity as number,
      }))

    if (submissionData.length === 0) {
      setSubmitError('Please add at least one SKU with quantity')
      return
    }

    try {
      await submitMSQ.mutateAsync({
        year,
        month,
        submission_data: submissionData,
      })
      router.push('/dashboard/vci/msq')
    } catch {
      // Error handled by mutation
    }
  }

  return (
    <RoleGuard allowedRoles={['company_admin', 'company_manager']}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/vci/msq">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <h2 className="text-xl font-semibold">Submit MSQ</h2>
            <p className="text-sm text-muted-foreground">
              Monthly Sales Quantity Declaration
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Period Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Reporting Period</CardTitle>
              <CardDescription>
                Select the month and year for your MSQ submission
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                  <Label>Month</Label>
                  <Select
                    value={month.toString()}
                    onValueChange={(v) => setMonth(parseInt(v))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                        <SelectItem key={m} value={m.toString()}>
                          {getMonthName(m)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Entry Tabs */}
          <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as 'manual' | 'bulk')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              <TabsTrigger value="bulk" className="gap-2">
                <Upload className="h-4 w-4" />
                Bulk Upload
              </TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="mt-4">
              {/* Task 1.1.4.9a: SKUDataEntryTable component */}
              <SKUDataEntryTable
                entries={entries}
                onChange={setEntries}
                companyId={userCompanyId}
                errors={errors}
              />
            </TabsContent>

            <TabsContent value="bulk" className="mt-4">
              {/* Task 1.1.4.9b: BulkUpload component */}
              <BulkUpload
                onDataParsed={handleBulkDataParsed}
                companyId={userCompanyId}
              />
            </TabsContent>
          </Tabs>

          {/* Submit Error */}
          {submitError && (
            <Alert variant="destructive">
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/dashboard/vci/msq">Cancel</Link>
            </Button>
            <Button type="submit" disabled={submitMSQ.isPending}>
              {submitMSQ.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit MSQ
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </RoleGuard>
  )
}
