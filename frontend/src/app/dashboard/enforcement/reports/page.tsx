'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useEnforcementStatistics, useEnforcementActions } from '@/hooks/use-enforcement'
import { RoleGuard } from '@/components/guards/role-guard'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertTriangle,
  Gavel,
  DollarSign,
  Ban,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
} from 'lucide-react'

// Task 1.1.2.42: Enforcement reports page

export default function EnforcementReportsPage() {
  const { data: statsData, isLoading: statsLoading } = useEnforcementStatistics()
  const stats = statsData?.statistics

  const statusBreakdown = [
    { label: 'Draft', count: stats?.by_status?.draft || 0, color: 'bg-gray-400' },
    { label: 'Pending Review', count: stats?.by_status?.pending_review || 0, color: 'bg-yellow-400' },
    { label: 'Pending Approval', count: stats?.by_status?.pending_approval || 0, color: 'bg-orange-400' },
    { label: 'Approved', count: stats?.by_status?.approved || 0, color: 'bg-blue-400' },
    { label: 'Executed', count: stats?.by_status?.executed || 0, color: 'bg-green-500' },
    { label: 'Appealed', count: stats?.by_status?.appealed || 0, color: 'bg-purple-400' },
    { label: 'Appeal Upheld', count: stats?.by_status?.appeal_upheld || 0, color: 'bg-green-300' },
    { label: 'Appeal Rejected', count: stats?.by_status?.appeal_rejected || 0, color: 'bg-red-400' },
  ].filter(s => s.count > 0)

  const typeBreakdown = [
    { label: 'Warnings', count: stats?.by_type?.warning || 0, icon: AlertTriangle, color: 'text-yellow-500' },
    { label: 'Fines', count: stats?.by_type?.fine || 0, icon: DollarSign, color: 'text-red-500' },
    { label: 'Suspensions', count: stats?.by_type?.suspension || 0, icon: Ban, color: 'text-red-600' },
    { label: 'License Revocations', count: stats?.by_type?.license_revocation || 0, icon: Gavel, color: 'text-red-700' },
  ]

  const totalActions = stats?.total || 0

  return (
    <RoleGuard allowedRoles={['tier1', 'tier2_officer', 'tier2_registrar']}>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Enforcement Reports
          </h2>
          <p className="text-sm text-muted-foreground">
            Analytics and trends for enforcement actions
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
              <Gavel className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats?.total || 0}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats?.this_month || 0}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Fines Collected</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold">
                  {(stats?.total_fines || 0).toLocaleString()} MAD
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">
                  {(stats?.pending_review || 0) + (stats?.pending_approval || 0)}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Breakdown Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* By Type */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                By Action Type
              </CardTitle>
              <CardDescription>
                Breakdown of enforcement actions by type
              </CardDescription>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {typeBreakdown.map((type) => {
                    const Icon = type.icon
                    const percentage = totalActions > 0 ? (type.count / totalActions * 100).toFixed(1) : 0
                    return (
                      <div key={type.label} className="flex items-center gap-4">
                        <Icon className={`h-5 w-5 ${type.color}`} />
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{type.label}</span>
                            <span className="text-sm text-muted-foreground">
                              {type.count} ({percentage}%)
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${type.color.replace('text-', 'bg-')}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* By Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                By Status
              </CardTitle>
              <CardDescription>
                Current status distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : statusBreakdown.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No enforcement actions yet
                </p>
              ) : (
                <div className="space-y-3">
                  {statusBreakdown.map((status) => {
                    const percentage = totalActions > 0 ? (status.count / totalActions * 100).toFixed(1) : 0
                    return (
                      <div key={status.label} className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${status.color}`} />
                        <div className="flex-1 flex justify-between">
                          <span className="text-sm">{status.label}</span>
                          <span className="text-sm font-medium">
                            {status.count} ({percentage}%)
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleGuard>
  )
}
