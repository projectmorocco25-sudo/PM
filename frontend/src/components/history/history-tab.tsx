'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Timeline, TimelineEvent } from './timeline'
import { DateRangePicker, DateRange } from './date-range-picker'
import { ExportButton, ExportFormat } from './export-button'
import { VirtualList } from './virtual-list'
import { useEntityHistory, useRelatedHistory, useCompanyFullHistory } from '@/hooks/use-history'
import { History, Filter, Download, ChevronDown, RefreshCw } from 'lucide-react'
import { isWithinInterval } from 'date-fns'

// Task 1.1.5.25-32: History Tab component for detail pages

interface HistoryTabProps {
  entityType: 'company' | 'product' | 'sku' | 'aams_submission' | 'msq_submission' | 'wsl_submission' | 'breach' | 'compliance_score' | 'enforcement_action'
  entityId: string
  entityName?: string
  showRelated?: boolean
  relatedConfig?: {
    childType: 'product' | 'sku' | 'aams_submission' | 'msq_submission' | 'wsl_submission'
    label: string
  }[]
}

export function HistoryTab({
  entityType,
  entityId,
  entityName,
  showRelated = false,
  relatedConfig,
}: HistoryTabProps) {
  const [dateRange, setDateRange] = React.useState<DateRange>({ from: undefined, to: undefined })
  const [activeTab, setActiveTab] = React.useState('all')

  // Fetch main entity history
  const { data: historyData, isLoading, refetch } = useEntityHistory({
    entityType,
    entityId,
  })

  const events = historyData?.events || []

  // Filter events by date range
  const filteredEvents = React.useMemo(() => {
    if (!dateRange.from || !dateRange.to) return events
    return events.filter((event) => {
      const eventDate = new Date(event.timestamp)
      return isWithinInterval(eventDate, { start: dateRange.from!, end: dateRange.to! })
    })
  }, [events, dateRange])

  // Export handler
  const handleExport = async (format: ExportFormat) => {
    // Generate export data
    const exportData = filteredEvents.map((event) => ({
      date: event.timestamp,
      type: event.type,
      title: event.title,
      description: event.description || '',
      user: event.user.name,
      role: event.user.role || '',
    }))

    if (format === 'csv') {
      const headers = ['Date', 'Type', 'Title', 'Description', 'User', 'Role']
      const csv = [
        headers.join(','),
        ...exportData.map((row) =>
          [row.date, row.type, `"${row.title}"`, `"${row.description}"`, row.user, row.role].join(',')
        ),
      ].join('\n')
      return new Blob([csv], { type: 'text/csv' })
    }

    // For other formats, return as JSON (would need server-side PDF/Excel generation)
    return new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
  }

  const hasRelated = showRelated && relatedConfig && relatedConfig.length > 0

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              History
            </CardTitle>
            <CardDescription>
              {entityName ? `Activity history for ${entityName}` : 'Activity history'}
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              placeholder="Filter by date"
              className="w-[240px]"
            />
            <ExportButton
              onExport={handleExport}
              formats={['csv']}
              config={{ filename: `${entityType}-${entityId}-history` }}
            />
            <Button variant="ghost" size="icon" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {hasRelated ? (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Activity</TabsTrigger>
              {relatedConfig!.map((config) => (
                <TabsTrigger key={config.childType} value={config.childType}>
                  {config.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all">
              <HistoryContent events={filteredEvents} loading={isLoading} />
            </TabsContent>

            {relatedConfig!.map((config) => (
              <TabsContent key={config.childType} value={config.childType}>
                <RelatedHistoryContent
                  parentType={entityType as 'company' | 'product'}
                  parentId={entityId}
                  childType={config.childType}
                  dateRange={dateRange}
                />
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <HistoryContent events={filteredEvents} loading={isLoading} />
        )}
      </CardContent>
    </Card>
  )
}

// Content component for timeline display
function HistoryContent({ events, loading }: { events: TimelineEvent[]; loading: boolean }) {
  if (events.length > 50) {
    // Use virtual scrolling for large lists
    return (
      <VirtualList
        items={events}
        height={400}
        estimateSize={100}
        renderItem={(event) => (
          <div className="pr-4 pb-4">
            <TimelineItemSimple event={event} />
          </div>
        )}
        loading={loading}
        emptyMessage="No history available"
        getItemKey={(item) => item.id}
      />
    )
  }

  return (
    <Timeline
      events={events}
      loading={loading}
      emptyMessage="No history available"
    />
  )
}

// Simplified timeline item for virtual list
function TimelineItemSimple({ event }: { event: TimelineEvent }) {
  return (
    <div className="flex gap-3 p-3 rounded-lg border">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm">{event.title}</span>
          <Badge variant="outline" className="text-xs">
            {event.type.replace('_', ' ')}
          </Badge>
        </div>
        {event.description && (
          <p className="text-sm text-muted-foreground mb-1">{event.description}</p>
        )}
        <div className="text-xs text-muted-foreground">
          {event.user.name} • {new Date(event.timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  )
}

// Related history content
function RelatedHistoryContent({
  parentType,
  parentId,
  childType,
  dateRange,
}: {
  parentType: 'company' | 'product'
  parentId: string
  childType: 'product' | 'sku' | 'aams_submission' | 'msq_submission' | 'wsl_submission'
  dateRange: DateRange
}) {
  const { data, isLoading } = useRelatedHistory({
    parentType,
    parentId,
    childType,
  })

  const events = React.useMemo(() => {
    let result = data?.events || []
    if (dateRange.from && dateRange.to) {
      result = result.filter((event) => {
        const eventDate = new Date(event.timestamp)
        return isWithinInterval(eventDate, { start: dateRange.from!, end: dateRange.to! })
      })
    }
    return result
  }, [data?.events, dateRange])

  return <HistoryContent events={events} loading={isLoading} />
}

// Company-specific full history tab
interface CompanyHistoryTabProps {
  companyId: string
  companyName?: string
}

export function CompanyHistoryTab({ companyId, companyName }: CompanyHistoryTabProps) {
  return (
    <HistoryTab
      entityType="company"
      entityId={companyId}
      entityName={companyName}
      showRelated
      relatedConfig={[
        { childType: 'product', label: 'Products' },
        { childType: 'sku', label: 'SKUs' },
        { childType: 'aams_submission', label: 'AAMS' },
        { childType: 'msq_submission', label: 'MSQ' },
        { childType: 'wsl_submission', label: 'WSL' },
      ]}
    />
  )
}

// Product-specific history tab
interface ProductHistoryTabProps {
  productId: string
  productName?: string
}

export function ProductHistoryTab({ productId, productName }: ProductHistoryTabProps) {
  return (
    <HistoryTab
      entityType="product"
      entityId={productId}
      entityName={productName}
      showRelated
      relatedConfig={[
        { childType: 'sku', label: 'SKUs' },
      ]}
    />
  )
}

// Simple history tab without related entities
interface SimpleHistoryTabProps {
  entityType: 'sku' | 'aams_submission' | 'msq_submission' | 'wsl_submission' | 'breach' | 'compliance_score' | 'enforcement_action'
  entityId: string
  entityName?: string
}

export function SimpleHistoryTab({ entityType, entityId, entityName }: SimpleHistoryTabProps) {
  return (
    <HistoryTab
      entityType={entityType}
      entityId={entityId}
      entityName={entityName}
    />
  )
}
