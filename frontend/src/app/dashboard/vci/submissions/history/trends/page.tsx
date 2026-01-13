'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { RoleGuard } from '@/components/guards/role-guard'
import { YearFilter } from '@/components/filters/year-filter'
import { DateRangePicker, DateRange } from '@/components/history/date-range-picker'
import { ExportButton } from '@/components/history/export-button'
import {
  AAMSTrendAnalysis,
  MSQTrendAnalysis,
  WSLTrendAnalysis,
  CrossMetricAnalysis,
} from '@/components/trends/submission-trends'
import { subYears, subMonths, subWeeks, format } from 'date-fns'
import { TrendingUp, BarChart3, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

// Task 1.1.5.43: /vci/submissions/history/trends route

export default function SubmissionTrendsPage() {
  const [dateRange, setDateRange] = React.useState<DateRange>({ from: undefined, to: undefined })

  // Mock data for AAMS trends
  const aamsData = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - (4 - i)
    return {
      year,
      totalAAMS: 1000000 + Math.floor(Math.random() * 500000) + i * 100000,
      companyCount: 60 + i * 5,
      avgAAMS: 15000 + Math.floor(Math.random() * 5000),
    }
  })

  // Mock data for MSQ trends
  const msqData = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), 11 - i)
    return {
      month: format(date, 'MMM yyyy'),
      totalMSQ: 80000 + Math.floor(Math.random() * 40000),
      avgMSQ: 1200 + Math.floor(Math.random() * 500),
      anomalies: Math.random() > 0.8 ? Math.floor(Math.random() * 5) : 0,
    }
  })

  // Mock data for WSL trends
  const wslData = Array.from({ length: 12 }, (_, i) => {
    const date = subWeeks(new Date(), 11 - i)
    return {
      week: format(date, "'W'w yyyy"),
      avgStockLevel: 5000 + Math.floor(Math.random() * 2000),
      threshold: 4000,
      breaches: Math.floor(Math.random() * 10),
      stockouts: Math.random() > 0.9 ? 1 : 0,
    }
  })

  // Mock data for cross-metric analysis
  const crossMetricData = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), 11 - i)
    return {
      period: format(date, 'MMM'),
      aams: 100 + Math.floor(Math.random() * 20),
      msq: 90 + Math.floor(Math.random() * 30),
      wsl: 95 + Math.floor(Math.random() * 25),
    }
  })

  const handleExport = async () => {
    return new Blob(['Trend data export'], { type: 'text/csv' })
  }

  return (
    <RoleGuard allowedRoles={['tier1']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/vci/submissions/history">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                Submission Trends
              </h1>
              <p className="text-muted-foreground">
                Multi-year trend analysis and comparisons
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DateRangePicker value={dateRange} onChange={setDateRange} />
            <ExportButton onExport={handleExport} formats={['pdf', 'excel']} />
          </div>
        </div>

        {/* Task 1.1.5.57: AAMS Trend Analysis */}
        <AAMSTrendAnalysis data={aamsData} />

        {/* Task 1.1.5.58: MSQ Trend Analysis */}
        <MSQTrendAnalysis data={msqData} />

        {/* Task 1.1.5.59: WSL Trend Analysis */}
        <WSLTrendAnalysis data={wslData} />

        {/* Task 1.1.5.60: Cross-Metric Analysis */}
        <CrossMetricAnalysis data={crossMetricData} />
      </div>
    </RoleGuard>
  )
}
