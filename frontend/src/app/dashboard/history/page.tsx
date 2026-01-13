'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Timeline, TimelineEvent } from '@/components/history/timeline'
import { DateRangePicker, DateRange } from '@/components/history/date-range-picker'
import { ExportButton } from '@/components/history/export-button'
import { useUserRole } from '@/hooks/use-user-role'
import { useEntityHistory } from '@/hooks/use-history'
import { History, Building2, FileSpreadsheet, User } from 'lucide-react'
import { isWithinInterval } from 'date-fns'

// Task 1.1.5.38: /history route

export default function HistoryPage() {
  const { isMOH, userCompanyId, role } = useUserRole()
  const [dateRange, setDateRange] = React.useState<DateRange>({ from: undefined, to: undefined })
  const [activeTab, setActiveTab] = React.useState('all')

  // Placeholder data - would be fetched from hooks
  const mockEvents: TimelineEvent[] = [
    {
      id: '1',
      type: 'submitted',
      title: 'AAMS 2026 Submitted',
      description: 'Annual average monthly sales data submitted for review',
      user: { id: '1', name: 'John Doe', role: 'Company Admin' },
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'approved',
      title: 'MSQ December 2025 Approved',
      description: 'Monthly sales quantity approved by MOH',
      user: { id: '2', name: 'Dr. Fatima', role: 'Tier 1' },
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '3',
      type: 'updated',
      title: 'Company Profile Updated',
      description: 'Contact information updated',
      user: { id: '1', name: 'John Doe', role: 'Company Admin' },
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ]

  const filteredEvents = React.useMemo(() => {
    if (!dateRange.from || !dateRange.to) return mockEvents
    return mockEvents.filter((event) => {
      const eventDate = new Date(event.timestamp)
      return isWithinInterval(eventDate, { start: dateRange.from!, end: dateRange.to! })
    })
  }, [mockEvents, dateRange])

  const handleExport = async () => {
    const csv = filteredEvents.map((e) => `${e.timestamp},${e.type},${e.title}`).join('\n')
    return new Blob([csv], { type: 'text/csv' })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <History className="h-6 w-6" />
            History
          </h1>
          <p className="text-muted-foreground">
            {isMOH ? 'System-wide activity and changes' : 'Your activity and submissions'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <ExportButton onExport={handleExport} formats={['csv']} />
        </div>
      </div>

      {isMOH ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Activity</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="registry">Registry Changes</TabsTrigger>
            <TabsTrigger value="users">User Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <Timeline events={filteredEvents} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submissions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5" />
                  Submission Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Timeline 
                  events={filteredEvents.filter((e) => 
                    ['submitted', 'approved', 'rejected'].includes(e.type)
                  )} 
                  emptyMessage="No submission activity"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="registry" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Registry Changes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Timeline 
                  events={filteredEvents.filter((e) => 
                    ['created', 'updated', 'deleted'].includes(e.type)
                  )} 
                  emptyMessage="No registry changes"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  User Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Timeline 
                  events={filteredEvents.filter((e) => e.type === 'view')} 
                  emptyMessage="No user activity"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Your Activity</CardTitle>
            <CardDescription>
              Recent submissions and changes for your company
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Timeline events={filteredEvents} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
