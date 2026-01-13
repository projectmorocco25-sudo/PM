'use client'

import * as React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DataTable, Column } from '@/components/ui/data-table'
import { EnforcementStatusBadge, EnforcementTypeBadge } from '@/components/enforcement/enforcement-status-badge'
import { useEnforcementActions, useEnforcementStatistics, EnforcementAction } from '@/hooks/use-enforcement'
import { useUserRole } from '@/hooks/use-user-role'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import {
  AlertTriangle,
  Gavel,
  DollarSign,
  Ban,
  TrendingUp,
  Clock,
  Plus,
} from 'lucide-react'

// Task 1.1.2.37: Enforcement dashboard page

export default function EnforcementDashboardPage() {
  const router = useRouter()
  const { isMOH } = useUserRole()
  const { data: statsData, isLoading: statsLoading } = useEnforcementStatistics()
  const { data: actionsData, isLoading: actionsLoading } = useEnforcementActions({ limit: 5 })

  const stats = statsData?.statistics
  const recentActions = actionsData?.actions || []

  const columns: Column<EnforcementAction>[] = [
    {
      key: 'action_type',
      header: 'Type',
      render: (_, row) => <EnforcementTypeBadge type={row.action_type} />,
    },
    {
      key: 'company_name',
      header: 'Company',
    },
    {
      key: 'violation_type',
      header: 'Violation',
    },
    {
      key: 'status',
      header: 'Status',
      render: (_, row) => <EnforcementStatusBadge status={row.status} />,
    },
    {
      key: 'created_at',
      header: 'Date',
      render: (value) => format(new Date(String(value)), 'MMM d, yyyy'),
    },
  ]

  const handleRowClick = (action: EnforcementAction) => {
    router.push(`/dashboard/enforcement/actions/${action.id}`)
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
            <Gavel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              All enforcement actions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.by_type?.warning || 0}</div>
            <p className="text-xs text-muted-foreground">
              Warning actions issued
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fines</CardTitle>
            <DollarSign className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.by_type?.fine || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total: {(stats?.total_fines || 0).toLocaleString()} MAD
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspensions</CardTitle>
            <Ban className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.by_type?.suspension || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active suspensions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Items (MOH) */}
      {isMOH && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-yellow-200 bg-yellow-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.pending_review || 0}</div>
              {(stats?.pending_review || 0) > 0 && (
                <Button variant="link" size="sm" className="p-0 mt-2" asChild>
                  <Link href="/dashboard/enforcement/pending?status=pending_review">
                    View all →
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending Approval
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.pending_approval || 0}</div>
              {(stats?.pending_approval || 0) > 0 && (
                <Button variant="link" size="sm" className="p-0 mt-2" asChild>
                  <Link href="/dashboard/enforcement/pending?status=pending_approval">
                    View all →
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending Appeals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.pending_appeals || 0}</div>
              {(stats?.pending_appeals || 0) > 0 && (
                <Button variant="link" size="sm" className="p-0 mt-2" asChild>
                  <Link href="/dashboard/enforcement/appeals">
                    View all →
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Actions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Actions</CardTitle>
            <CardDescription>Latest enforcement actions</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/enforcement/actions">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={recentActions}
            loading={actionsLoading}
            onRowClick={handleRowClick}
            emptyMessage="No enforcement actions"
          />
        </CardContent>
      </Card>
    </div>
  )
}
