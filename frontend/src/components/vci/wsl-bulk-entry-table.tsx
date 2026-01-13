'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useSKUs, SKU } from '@/hooks/use-rmm'
import { useThresholds, Threshold, WSLSubmissionItem } from '@/hooks/use-vci'
import { AlertTriangle, AlertCircle, Package } from 'lucide-react'
import { cn } from '@/lib/utils'

// Task 1.1.5.14a: WSLBulkEntryTable component

interface WSLEntry extends WSLSubmissionItem {
  sku?: SKU
  threshold?: Threshold
  is_breach?: boolean
}

interface WSLBulkEntryTableProps {
  entries: WSLEntry[]
  onChange: (entries: WSLEntry[]) => void
  companyId?: string
  disabled?: boolean
  showBreachFields?: boolean
}

export function WSLBulkEntryTable({
  entries,
  onChange,
  companyId,
  disabled,
  showBreachFields = true,
}: WSLBulkEntryTableProps) {
  const { data: skusData, isLoading: skusLoading } = useSKUs({
    company_id: companyId,
    is_active: true,
    limit: 500,
  })

  const { data: thresholdsData } = useThresholds({
    company_id: companyId,
    is_current: true,
    limit: 500,
  })

  const skus = skusData?.skus || []
  const thresholds = thresholdsData?.thresholds || []

  // Initialize entries with all SKUs when SKUs load
  React.useEffect(() => {
    if (skus.length > 0 && entries.length === 0) {
      const initialEntries = skus.map((sku) => {
        const threshold = thresholds.find((t) => t.sku_id === sku.id)
        return {
          sku_id: sku.id,
          stock_level: 0,
          sku,
          threshold,
          is_breach: false,
        }
      })
      onChange(initialEntries)
    }
  }, [skus, thresholds, entries.length, onChange])

  const handleStockChange = (index: number, value: string) => {
    const stockLevel = value === '' ? 0 : parseInt(value, 10)
    const newEntries = [...entries]
    const threshold = newEntries[index].threshold
    newEntries[index] = {
      ...newEntries[index],
      stock_level: isNaN(stockLevel) ? 0 : stockLevel,
      is_breach: threshold ? stockLevel < threshold.threshold_value : false,
    }
    onChange(newEntries)
  }

  const handleBreachReasonChange = (index: number, value: string) => {
    const newEntries = [...entries]
    newEntries[index] = {
      ...newEntries[index],
      breach_reason: value,
    }
    onChange(newEntries)
  }

  const handleReplenishmentDateChange = (index: number, value: string) => {
    const newEntries = [...entries]
    newEntries[index] = {
      ...newEntries[index],
      replenishment_date: value,
    }
    onChange(newEntries)
  }

  const breachCount = entries.filter((e) => e.is_breach).length

  if (skusLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Loading SKUs...
        </CardContent>
      </Card>
    )
  }

  if (skus.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <Package className="h-8 w-8 mx-auto mb-2" />
          No active SKUs found for this company
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Stock Levels</CardTitle>
            <CardDescription>Enter current stock levels for all SKUs</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">{entries.length} SKUs</Badge>
            {breachCount > 0 && (
              <Badge variant="destructive">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {breachCount} below threshold
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground border-b pb-2">
            <div className="col-span-4">SKU</div>
            <div className="col-span-2 text-right">Threshold</div>
            <div className="col-span-2 text-right">Stock Level</div>
            {showBreachFields && (
              <>
                <div className="col-span-2">Reason</div>
                <div className="col-span-2">Replenishment</div>
              </>
            )}
          </div>

          {/* Entries */}
          <div className="space-y-3 max-h-[500px] overflow-auto">
            {entries.map((entry, index) => (
              <div
                key={entry.sku_id}
                className={cn(
                  'grid grid-cols-12 gap-2 items-start p-2 rounded-md',
                  entry.is_breach && 'bg-destructive/10 border border-destructive/20'
                )}
              >
                {/* SKU Info */}
                <div className="col-span-4">
                  <div className="font-medium text-sm">{entry.sku?.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {entry.sku?.sku_code} • {entry.sku?.dosage_strength} {entry.sku?.dosage_form}
                  </div>
                </div>

                {/* Threshold */}
                <div className="col-span-2 text-right">
                  {entry.threshold ? (
                    <span className="font-mono text-sm">
                      {entry.threshold.threshold_value.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">No threshold</span>
                  )}
                </div>

                {/* Stock Level Input */}
                <div className="col-span-2">
                  <Input
                    type="number"
                    min="0"
                    value={entry.stock_level || ''}
                    onChange={(e) => handleStockChange(index, e.target.value)}
                    disabled={disabled}
                    className={cn(
                      'text-right h-8',
                      entry.is_breach && 'border-destructive'
                    )}
                    placeholder="0"
                  />
                </div>

                {/* Breach Fields */}
                {showBreachFields && (
                  <>
                    <div className="col-span-2">
                      {entry.is_breach && (
                        <Input
                          type="text"
                          value={entry.breach_reason || ''}
                          onChange={(e) => handleBreachReasonChange(index, e.target.value)}
                          disabled={disabled}
                          className="h-8 text-xs"
                          placeholder="Reason..."
                        />
                      )}
                    </div>
                    <div className="col-span-2">
                      {entry.is_breach && (
                        <Input
                          type="date"
                          value={entry.replenishment_date || ''}
                          onChange={(e) => handleReplenishmentDateChange(index, e.target.value)}
                          disabled={disabled}
                          className="h-8 text-xs"
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Summary */}
          {breachCount > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {breachCount} SKU(s) are below threshold. Please provide breach reasons and expected
                replenishment dates for affected items.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
