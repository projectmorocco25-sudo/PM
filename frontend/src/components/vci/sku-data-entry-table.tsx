'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SKUSelector, QuantityInput } from './sku-selector'
import { useSKUs, SKU } from '@/hooks/use-rmm'
import { Plus, Trash2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Task 1.1.3.13c: SKU data entry table

export interface SKUDataEntry {
  sku_id: string
  quantity: number | ''
  sku?: SKU
}

interface SKUDataEntryTableProps {
  entries: SKUDataEntry[]
  onChange: (entries: SKUDataEntry[]) => void
  companyId?: string
  disabled?: boolean
  errors?: Record<number, string>
}

export function SKUDataEntryTable({
  entries,
  onChange,
  companyId,
  disabled,
  errors = {},
}: SKUDataEntryTableProps) {
  const excludedIds = entries.map((e) => e.sku_id).filter(Boolean)

  const handleAddRow = () => {
    onChange([...entries, { sku_id: '', quantity: '' }])
  }

  const handleRemoveRow = (index: number) => {
    const newEntries = entries.filter((_, i) => i !== index)
    onChange(newEntries.length === 0 ? [{ sku_id: '', quantity: '' }] : newEntries)
  }

  const handleSKUSelect = (index: number, sku: SKU | null) => {
    const newEntries = [...entries]
    newEntries[index] = {
      ...newEntries[index],
      sku_id: sku?.id || '',
      sku,
    }
    onChange(newEntries)
  }

  const handleQuantityChange = (index: number, quantity: number | '') => {
    const newEntries = [...entries]
    newEntries[index] = {
      ...newEntries[index],
      quantity,
    }
    onChange(newEntries)
  }

  // Initialize with one empty row if empty
  React.useEffect(() => {
    if (entries.length === 0) {
      onChange([{ sku_id: '', quantity: '' }])
    }
  }, [entries.length, onChange])

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">SKU Quantities</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddRow}
            disabled={disabled}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add SKU
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
            <div className="col-span-6">SKU</div>
            <div className="col-span-4">Annual Quantity</div>
            <div className="col-span-2"></div>
          </div>

          {/* Entries */}
          {entries.map((entry, index) => (
            <div key={index} className="space-y-2">
              <div className="grid grid-cols-12 gap-4 items-start">
                <div className="col-span-6">
                  <SKUSelector
                    value={entry.sku_id}
                    onSelect={(sku) => handleSKUSelect(index, sku)}
                    companyId={companyId}
                    excludeIds={excludedIds.filter((id) => id !== entry.sku_id)}
                    disabled={disabled}
                    placeholder="Select SKU..."
                  />
                </div>
                <div className="col-span-4">
                  <QuantityInput
                    value={entry.quantity}
                    onChange={(q) => handleQuantityChange(index, q)}
                    unitOfMeasure={entry.sku?.unit_of_measure || 'units'}
                    disabled={disabled || !entry.sku_id}
                  />
                </div>
                <div className="col-span-2 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveRow(index)}
                    disabled={disabled || entries.length === 1}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* SKU Details */}
              {entry.sku && (
                <div className="ml-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-xs">
                    {entry.sku.sku_code}
                  </Badge>
                  <span>
                    {entry.sku.dosage_strength} • {entry.sku.dosage_form} • {entry.sku.pack_size}
                  </span>
                </div>
              )}

              {/* Error */}
              {errors[index] && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">{errors[index]}</AlertDescription>
                </Alert>
              )}
            </div>
          ))}

          {/* Summary */}
          {entries.some((e) => e.sku_id && typeof e.quantity === 'number' && e.quantity > 0) && (
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {entries.filter((e) => e.sku_id && e.quantity).length} SKU(s) added
                </span>
                <span className="font-medium">
                  Total Annual Quantity:{' '}
                  {entries
                    .reduce((sum, e) => sum + (typeof e.quantity === 'number' ? e.quantity : 0), 0)
                    .toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
