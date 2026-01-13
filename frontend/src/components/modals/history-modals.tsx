'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DateRangePicker, DateRange } from '@/components/history/date-range-picker'
import { CompactTimeline, TimelineEvent } from '@/components/history/timeline'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import {
  History,
  ArrowRight,
  Download,
  ExternalLink,
  Loader2,
  FileText,
  FileSpreadsheet,
  FileType,
  Eye,
  GitCompare,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Task 1.1.5.44: Quick History Preview modal
interface QuickHistoryPreviewProps {
  trigger: React.ReactNode
  title: string
  events: TimelineEvent[]
  loading?: boolean
  fullHistoryLink?: string
}

export function QuickHistoryPreview({
  trigger,
  title,
  events,
  loading,
  fullHistoryLink,
}: QuickHistoryPreviewProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription>Recent changes and activity</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : events.length > 0 ? (
            <CompactTimeline events={events} limit={5} />
          ) : (
            <p className="text-center text-muted-foreground py-4">
              No recent activity
            </p>
          )}
        </div>
        {fullHistoryLink && (
          <DialogFooter>
            <Button variant="outline" asChild>
              <Link href={fullHistoryLink}>
                View Full History
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Task 1.1.5.45: Comparison modal
interface ComparisonData {
  label: string
  current: string | number | React.ReactNode
  historical: string | number | React.ReactNode
  changed?: boolean
}

interface ComparisonModalProps {
  trigger: React.ReactNode
  title: string
  currentLabel?: string
  historicalLabel?: string
  historicalDate?: string
  data: ComparisonData[]
  loading?: boolean
}

export function ComparisonModal({
  trigger,
  title,
  currentLabel = 'Current',
  historicalLabel = 'Historical',
  historicalDate,
  data,
  loading,
}: ComparisonModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription>
            Compare current state with historical version
            {historicalDate && ` from ${format(new Date(historicalDate), 'PPP')}`}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-2 text-left text-sm font-medium w-1/3">
                      Field
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium w-1/3">
                      {currentLabel}
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium w-1/3">
                      {historicalLabel}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr
                      key={index}
                      className={cn('border-b', item.changed && 'bg-yellow-50')}
                    >
                      <td className="px-4 py-2 text-sm font-medium">{item.label}</td>
                      <td className="px-4 py-2 text-sm">
                        {item.changed ? (
                          <span className="text-green-600">{item.current}</span>
                        ) : (
                          item.current
                        )}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {item.changed ? (
                          <span className="text-red-600 line-through">
                            {item.historical}
                          </span>
                        ) : (
                          item.historical
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Task 1.1.5.46: Export Options modal
export type ExportFormat = 'pdf' | 'excel' | 'csv'

interface ExportOptionsModalProps {
  trigger: React.ReactNode
  title?: string
  onExport: (format: ExportFormat, dateRange?: DateRange) => Promise<void>
  showDateRange?: boolean
}

export function ExportOptionsModal({
  trigger,
  title = 'Export Data',
  onExport,
  showDateRange = true,
}: ExportOptionsModalProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [format, setFormat] = React.useState<ExportFormat>('csv')
  const [dateRange, setDateRange] = React.useState<DateRange>({ from: undefined, to: undefined })
  const [isExporting, setIsExporting] = React.useState(false)
  const [progress, setProgress] = React.useState(0)

  const handleExport = async () => {
    setIsExporting(true)
    setProgress(0)
    
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 15, 90))
    }, 200)

    try {
      await onExport(format, showDateRange ? dateRange : undefined)
      setProgress(100)
      setTimeout(() => {
        setIsOpen(false)
        setIsExporting(false)
        setProgress(0)
      }, 500)
    } catch {
      setIsExporting(false)
      setProgress(0)
    } finally {
      clearInterval(progressInterval)
    }
  }

  const formatOptions = [
    { value: 'csv', label: 'CSV', icon: FileType, description: 'Comma-separated values' },
    { value: 'excel', label: 'Excel', icon: FileSpreadsheet, description: 'Microsoft Excel format' },
    { value: 'pdf', label: 'PDF', icon: FileText, description: 'Portable document format' },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription>
            Choose export format and options
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {/* Format Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Format</label>
            <div className="grid gap-2">
              {formatOptions.map((option) => {
                const Icon = option.icon
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormat(option.value as ExportFormat)}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-md border text-left transition-colors',
                      format === option.value
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    )}
                  >
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {option.description}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Date Range */}
          {showDateRange && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range (optional)</label>
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
                placeholder="All time"
                className="w-full"
              />
            </div>
          )}

          {/* Progress */}
          {isExporting && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-muted-foreground text-center">
                {progress < 100 ? 'Generating export...' : 'Complete!'}
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Task 1.1.5.47: Detail Inspection modal
interface DetailInspectionModalProps {
  trigger: React.ReactNode
  title: string
  subtitle?: string
  children: React.ReactNode
  fullPageLink?: string
  loading?: boolean
}

export function DetailInspectionModal({
  trigger,
  title,
  subtitle,
  children,
  fullPageLink,
  loading,
}: DetailInspectionModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            {title}
          </DialogTitle>
          {subtitle && <DialogDescription>{subtitle}</DialogDescription>}
        </DialogHeader>
        <div className="py-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : (
            children
          )}
        </div>
        {fullPageLink && (
          <DialogFooter>
            <Button variant="outline" asChild>
              <Link href={fullPageLink}>
                View Full Page
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
