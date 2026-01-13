'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RoleGuard } from '@/components/guards/role-guard'
import {
  DashboardWidget,
  MetricWidget,
  ChartWidget,
} from '@/components/dashboard/dashboard-widget'
import {
  StockSufficiencyLineChart,
  BreachDistributionChart,
  CompanyComplianceBarChart,
  WeeklyTrendChart,
} from '@/components/dashboard/stock-charts'
import { useBreaches, useWSLSubmissions } from '@/hooks/use-vci'
import { useCompanies } from '@/hooks/use-rmm'
import {
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Building2,
  TrendingUp,
  ExternalLink,
} from 'lucide-react'
import { format, subWeeks } from 'date-fns'

// Task 1.1.5.20: Governance Dashboard
// Task 1.1.5.20a: Recharts setup (done via npm install)
// Task 1.1.5.20b: DashboardWidget component (dashboard-widget.tsx)
// Task 1.1.5.20c: Responsive dashboard layout
// Task 1.1.5.20d: Dashboard data prefetching and caching (React Query)
// Task 1.1.5.20e: Stock sufficiency charts (stock-charts.tsx)

export default function GovernanceDashboardPage() {
  // Task 1.1.5.20d: Prefetch with React Query
  const { data: breachesData, isLoading: breachesLoading } = useBreaches({ limit: 100 })
  const { data: wslData, isLoading: wslLoading } = useWSLSubmissions({ limit: 50 })
  const { data: companiesData, isLoading: companiesLoading } = useCompanies({ limit: 100 })

  const breaches = breachesData?.breaches || []
  const wslSubmissions = wslData?.submissions || []
  const companies = companiesData?.companies || []

  const isLoading = breachesLoading || wslLoading || companiesLoading

  // Calculate metrics
  const activeBreaches = breaches.filter(
    (b) => !['action_taken', 'completed'].includes(b.status)
  )
  const criticalBreaches = activeBreaches.filter((b) => b.priority === 'critical')
  const awaitingApproval = activeBreaches.filter((b) => b.status === 'tier2_suggested')
  const resolvedThisWeek = breaches.filter(
    (b) => b.status === 'action_taken' && 
    new Date(b.updated_at) > subWeeks(new Date(), 1)
  )

  // Breach distribution data
  const breachDistribution = [
    { name: 'Critical', value: breaches.filter((b) => b.priority === 'critical').length },
    { name: 'High', value: breaches.filter((b) => b.priority === 'high').length },
    { name: 'Standard', value: breaches.filter((b) => b.priority === 'standard').length },
  ].filter((d) => d.value > 0)

  // Company compliance data (mock - would come from actual data)
  const companyCompliance = companies.slice(0, 5).map((c) => ({
    company: c.name.slice(0, 10),
    compliant: Math.floor(Math.random() * 50) + 30,
    breaches: breaches.filter((b) => b.company_id === c.id).length,
  }))

  // Weekly trend data (mock - would come from aggregated data)
  const weeklyTrend = Array.from({ length: 8 }, (_, i) => ({
    week: format(subWeeks(new Date(), 7 - i), 'MMM d'),
    submissions: Math.floor(Math.random() * 20) + 10,
    breaches: Math.floor(Math.random() * 8),
    resolved: Math.floor(Math.random() * 6),
  }))

  return (
    <RoleGuard allowedRoles={['tier1', 'tier2_officer', 'tier2_registrar']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Governance Dashboard
            </h2>
            <p className="text-sm text-muted-foreground">
              Real-time stock sufficiency and breach monitoring
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/dashboard/vci/breaches">
                View All Breaches
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Task 1.1.5.20c: Responsive dashboard layout */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricWidget
            title="Active Breaches"
            value={activeBreaches.length}
            subtitle="Requiring attention"
            icon={AlertTriangle}
            loading={isLoading}
          />
          <MetricWidget
            title="Critical"
            value={criticalBreaches.length}
            subtitle="High priority items"
            icon={AlertTriangle}
            loading={isLoading}
          />
          <MetricWidget
            title="Awaiting Approval"
            value={awaitingApproval.length}
            subtitle="Tier 1 review needed"
            icon={Clock}
            loading={isLoading}
          />
          <MetricWidget
            title="Resolved This Week"
            value={resolvedThisWeek.length}
            subtitle="Actions taken"
            icon={CheckCircle2}
            loading={isLoading}
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Task 1.1.5.20e: Stock sufficiency charts */}
          <ChartWidget
            title="Weekly Trend"
            description="Submissions, breaches, and resolutions over time"
            loading={isLoading}
          >
            <WeeklyTrendChart data={weeklyTrend} />
          </ChartWidget>

          <ChartWidget
            title="Breach Distribution"
            description="By priority level"
            loading={isLoading}
          >
            <BreachDistributionChart data={breachDistribution} />
          </ChartWidget>
        </div>

        {/* Company Compliance */}
        <ChartWidget
          title="Company Compliance Overview"
          description="SKU compliance vs breaches by company"
          loading={isLoading}
          className="col-span-full"
        >
          <CompanyComplianceBarChart data={companyCompliance} />
        </ChartWidget>

        {/* Recent Activity */}
        <div className="grid gap-4 lg:grid-cols-2">
          <DashboardWidget
            title="Recent Breaches"
            icon={AlertTriangle}
            loading={isLoading}
          >
            <div className="space-y-3">
              {activeBreaches.slice(0, 5).map((breach) => (
                <Link
                  key={breach.id}
                  href={`/dashboard/vci/breaches/${breach.id}`}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <div className="font-medium text-sm">{breach.sku_name}</div>
                    <div className="text-xs text-muted-foreground">{breach.company_name}</div>
                  </div>
                  <Badge
                    variant={breach.priority === 'critical' ? 'destructive' : 'secondary'}
                  >
                    {breach.priority}
                  </Badge>
                </Link>
              ))}
              {activeBreaches.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No active breaches
                </p>
              )}
            </div>
          </DashboardWidget>

          <DashboardWidget
            title="Recent WSL Submissions"
            icon={Building2}
            loading={isLoading}
          >
            <div className="space-y-3">
              {wslSubmissions.slice(0, 5).map((submission) => (
                <Link
                  key={submission.id}
                  href={`/dashboard/vci/wsl/${submission.id}`}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <div className="font-medium text-sm">{submission.company_name}</div>
                    <div className="text-xs text-muted-foreground">
                      Week ending {format(new Date(submission.week_ending_date), 'MMM d')}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {(submission.breach_count || 0) > 0 && (
                      <Badge variant="destructive">
                        {submission.breach_count} breach(es)
                      </Badge>
                    )}
                    <Badge variant={submission.is_late ? 'destructive' : 'outline'}>
                      {submission.is_late ? 'Late' : 'On Time'}
                    </Badge>
                  </div>
                </Link>
              ))}
              {wslSubmissions.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent submissions
                </p>
              )}
            </div>
          </DashboardWidget>
        </div>
      </div>
    </RoleGuard>
  )
}
