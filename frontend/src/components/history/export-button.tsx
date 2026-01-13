'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import {
  Download,
  FileSpreadsheet,
  FileText,
  FileType,
  Loader2,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { format } from 'date-fns'

// Task 1.1.5.23: ExportButton component

export type ExportFormat = 'pdf' | 'excel' | 'csv'

export interface ExportConfig {
  filename?: string
  title?: string
  filters?: Record<string, unknown>
}

interface ExportButtonProps {
  onExport: (format: ExportFormat, config?: ExportConfig) => Promise<Blob | void>
  formats?: ExportFormat[]
  disabled?: boolean
  className?: string
  config?: ExportConfig
  children?: React.ReactNode
}

const FORMAT_CONFIG: Record<ExportFormat, {
  label: string
  icon: React.ElementType
  mimeType: string
  extension: string
}> = {
  pdf: {
    label: 'PDF Document',
    icon: FileText,
    mimeType: 'application/pdf',
    extension: 'pdf',
  },
  excel: {
    label: 'Excel Spreadsheet',
    icon: FileSpreadsheet,
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    extension: 'xlsx',
  },
  csv: {
    label: 'CSV File',
    icon: FileType,
    mimeType: 'text/csv',
    extension: 'csv',
  },
}

export function ExportButton({
  onExport,
  formats = ['pdf', 'excel', 'csv'],
  disabled,
  className,
  config,
  children,
}: ExportButtonProps) {
  const { toast } = useToast()
  const [isExporting, setIsExporting] = React.useState(false)
  const [showProgress, setShowProgress] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [exportStatus, setExportStatus] = React.useState<'idle' | 'exporting' | 'success' | 'error'>('idle')
  const [currentFormat, setCurrentFormat] = React.useState<ExportFormat | null>(null)

  const handleExport = async (format: ExportFormat) => {
    setCurrentFormat(format)
    setIsExporting(true)
    setShowProgress(true)
    setProgress(0)
    setExportStatus('exporting')

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90))
    }, 200)

    try {
      const result = await onExport(format, config)
      
      clearInterval(progressInterval)
      setProgress(100)
      setExportStatus('success')

      // If a blob was returned, trigger download
      if (result instanceof Blob) {
        const formatConfig = FORMAT_CONFIG[format]
        const filename = config?.filename 
          ? `${config.filename}.${formatConfig.extension}`
          : `export-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.${formatConfig.extension}`
        
        const url = URL.createObjectURL(result)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }

      toast({
        title: 'Export Complete',
        description: `Your ${FORMAT_CONFIG[format].label} has been downloaded.`,
      })

      // Close after a short delay
      setTimeout(() => {
        setShowProgress(false)
        setIsExporting(false)
        setExportStatus('idle')
      }, 1500)
    } catch (error) {
      clearInterval(progressInterval)
      setExportStatus('error')
      
      toast({
        title: 'Export Failed',
        description: error instanceof Error ? error.message : 'An error occurred during export',
        variant: 'destructive',
      })

      setTimeout(() => {
        setShowProgress(false)
        setIsExporting(false)
        setExportStatus('idle')
      }, 2000)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={disabled || isExporting} className={className}>
            {isExporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            {children || 'Export'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {formats.map((format, index) => {
            const formatConfig = FORMAT_CONFIG[format]
            const Icon = formatConfig.icon
            
            return (
              <React.Fragment key={format}>
                {index > 0 && <DropdownMenuSeparator />}
                <DropdownMenuItem onClick={() => handleExport(format)}>
                  <Icon className="mr-2 h-4 w-4" />
                  {formatConfig.label}
                </DropdownMenuItem>
              </React.Fragment>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Progress Dialog */}
      <Dialog open={showProgress} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {exportStatus === 'exporting' && (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Exporting...
                </>
              )}
              {exportStatus === 'success' && (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Export Complete
                </>
              )}
              {exportStatus === 'error' && (
                <>
                  <XCircle className="h-5 w-5 text-red-600" />
                  Export Failed
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {currentFormat && (
                <>Generating {FORMAT_CONFIG[currentFormat].label}</>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground text-center">
              {progress}% complete
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Simple export link for direct downloads
interface ExportLinkProps {
  href: string
  format: ExportFormat
  filename?: string
  className?: string
}

export function ExportLink({ href, format, filename, className }: ExportLinkProps) {
  const formatConfig = FORMAT_CONFIG[format]
  const Icon = formatConfig.icon

  return (
    <a
      href={href}
      download={filename}
      className={cn(
        'inline-flex items-center gap-2 text-sm text-primary hover:underline',
        className
      )}
    >
      <Icon className="h-4 w-4" />
      Download {formatConfig.label}
    </a>
  )
}
