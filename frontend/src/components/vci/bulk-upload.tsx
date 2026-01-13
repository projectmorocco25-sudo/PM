'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useSKUs, SKU } from '@/hooks/use-rmm'
import { MSQSubmissionItem } from '@/hooks/use-vci'
import { Upload, Download, X, CheckCircle2, AlertCircle, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

// Task 1.1.4.9b: BulkUpload component

interface ParsedRow {
  sku_id: string
  quantity: number
  sku?: SKU
  valid: boolean
  error?: string
}

interface BulkUploadProps {
  onDataParsed: (data: MSQSubmissionItem[]) => void
  companyId?: string
  className?: string
}

export function BulkUpload({ onDataParsed, companyId, className }: BulkUploadProps) {
  const [file, setFile] = React.useState<File | null>(null)
  const [parsedRows, setParsedRows] = React.useState<ParsedRow[]>([])
  const [parseError, setParseError] = React.useState<string | null>(null)
  const [isValidating, setIsValidating] = React.useState(false)

  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const { data: skusData } = useSKUs({ company_id: companyId, limit: 1000 })
  const skuMap = React.useMemo(() => {
    const map = new Map<string, SKU>()
    skusData?.skus?.forEach((sku) => map.set(sku.id, sku))
    return map
  }, [skusData])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setParseError(null)
    setIsValidating(true)

    try {
      const text = await selectedFile.text()
      const rows = parseCSV(text)
      
      // Validate rows
      const validated = rows.map((row) => {
        const sku = skuMap.get(row.sku_id)
        if (!row.sku_id) {
          return { ...row, valid: false, error: 'Missing SKU ID' }
        }
        if (!sku) {
          return { ...row, valid: false, error: 'SKU not found' }
        }
        if (isNaN(row.quantity) || row.quantity < 0) {
          return { ...row, valid: false, error: 'Invalid quantity' }
        }
        return { ...row, sku, valid: true }
      })

      setParsedRows(validated)
    } catch (err) {
      setParseError(err instanceof Error ? err.message : 'Failed to parse file')
    } finally {
      setIsValidating(false)
    }
  }

  const parseCSV = (text: string): ParsedRow[] => {
    const lines = text.trim().split('\n')
    if (lines.length < 2) {
      throw new Error('File must have a header row and at least one data row')
    }

    // Parse header
    const header = lines[0].toLowerCase().split(',').map((h) => h.trim())
    const skuIdIndex = header.findIndex((h) => h === 'sku_id' || h === 'skuid')
    const quantityIndex = header.findIndex((h) => h === 'quantity' || h === 'qty')

    if (skuIdIndex === -1 || quantityIndex === -1) {
      throw new Error('CSV must have "sku_id" and "quantity" columns')
    }

    // Parse data rows
    return lines.slice(1).filter((line) => line.trim()).map((line) => {
      const values = line.split(',').map((v) => v.trim())
      return {
        sku_id: values[skuIdIndex] || '',
        quantity: parseInt(values[quantityIndex], 10) || 0,
        valid: true,
      }
    })
  }

  const handleConfirm = () => {
    const validRows = parsedRows.filter((row) => row.valid)
    onDataParsed(validRows.map((row) => ({
      sku_id: row.sku_id,
      quantity: row.quantity,
    })))
    handleClear()
  }

  const handleClear = () => {
    setFile(null)
    setParsedRows([])
    setParseError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const downloadTemplate = () => {
    const template = 'sku_id,quantity\n'
    const blob = new Blob([template], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'msq_template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const validCount = parsedRows.filter((r) => r.valid).length
  const invalidCount = parsedRows.filter((r) => !r.valid).length

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Bulk Upload
        </CardTitle>
        <CardDescription>
          Upload a CSV file with SKU quantities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        {!file && (
          <div className="space-y-4">
            <div
              className={cn(
                'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer',
                'hover:border-primary hover:bg-muted/50 transition-colors'
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm font-medium">Click to upload CSV file</p>
              <p className="text-xs text-muted-foreground mt-1">
                Format: sku_id, quantity
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />

            <Button variant="outline" size="sm" onClick={downloadTemplate}>
              <Download className="mr-2 h-4 w-4" />
              Download Template
            </Button>
          </div>
        )}

        {/* Error */}
        {parseError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{parseError}</AlertDescription>
          </Alert>
        )}

        {/* Parsed Results */}
        {file && parsedRows.length > 0 && (
          <div className="space-y-4">
            {/* File Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="text-sm font-medium">{file.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleClear}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Summary */}
            <div className="flex gap-2">
              <Badge variant="default" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {validCount} valid
              </Badge>
              {invalidCount > 0 && (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {invalidCount} invalid
                </Badge>
              )}
            </div>

            {/* Preview Table */}
            <div className="rounded-md border max-h-[300px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedRows.map((row, index) => (
                    <TableRow key={index} className={!row.valid ? 'bg-destructive/10' : ''}>
                      <TableCell>
                        {row.valid ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        )}
                      </TableCell>
                      <TableCell>
                        {row.sku ? (
                          <div>
                            <div className="font-medium">{row.sku.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {row.sku.sku_code}
                            </div>
                          </div>
                        ) : (
                          <span className="font-mono text-xs">{row.sku_id}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {row.quantity.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {row.error}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClear}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={validCount === 0}
              >
                Import {validCount} Row{validCount !== 1 ? 's' : ''}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
