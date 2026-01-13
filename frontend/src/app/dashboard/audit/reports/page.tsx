'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RoleGuard } from '@/components/guards/role-guard'
import { DateRangePicker, DateRange } from '@/components/history/date-range-picker'
import { MetricWidget, ChartWidget } from '@/components/dashboard/dashboard-widget'
import { format, subDays } from 'date-fns'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { FileText, Download, BarChart3, PieChartIcon, Clock, Users } from 'lucide-react'

// Task 1.1.5.41: /audit/reports route

export default function AuditReportsPage() {
  const [dateRange, setDateRange] = React.useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })

  // Mock report data
  const activityByTable = [
    { table: 'companies', count: 45 },
    { table: 'products', count: 123 },
    { table: 'skus', count: 234 },
    { table: 'aams_submissions', count: 67 },
    { table: 'msq_submissions', count: 189 },
    { table: 'wsl_submissions', count: 456 },
  ]

  const activityByAction = [
    { name: 'INSERT', value: 234, color: '#22c55e' },
    { name: 'UPDATE', value: 567, color: '#3b82f6' },
    { name: 'DELETE', value: 23, color: '#ef4444' },
  ]

  const activityByRole = [
    { role: 'Tier 1', actions: 156 },
    { role: 'Tier 2 Officer', actions: 234 },
    { role: 'Tier 2 Registrar', actions: 89 },
    { role: 'Company Admin', actions: 345 },
    { role: 'Company User', actions: 456 },
  ]

  return (
    <RoleGuard allowedRoles={['tier1', 'tier2_officer', 'tier2_registrar', 'auditor']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              Audit Reports
            </h1>
            <p className="text-muted-foreground">
              Compliance and activity reports
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DateRangePicker value={dateRange} onChange={setDateRange} />
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricWidget
            title="Total Actions"
            value="1,280"
            subtitle="Last 30 days"
            icon={FileText}
          />
          <MetricWidget
            title="Active Users"
            value="47"
            subtitle="Performed actions"
            icon={Users}
          />
          <MetricWidget
            title="Tables Modified"
            value="12"
            subtitle="Unique tables"
            icon={BarChart3}
          />
          <MetricWidget
            title="Avg. Actions/Day"
            value="42.7"
            subtitle="Daily average"
            icon={Clock}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartWidget
            title="Activity by Table"
            description="Number of actions per database table"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityByTable} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis dataKey="table" type="category" width={120} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </ChartWidget>

          <ChartWidget
            title="Activity by Action Type"
            description="Distribution of INSERT, UPDATE, DELETE"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={activityByAction}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {activityByAction.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartWidget>
        </div>

        {/* Activity by Role */}
        <ChartWidget
          title="Activity by User Role"
          description="Actions performed by each role type"
          className="col-span-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityByRole}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="role" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip />
              <Bar dataKey="actions" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </ChartWidget>
      </div>
    </RoleGuard>
  )
}
