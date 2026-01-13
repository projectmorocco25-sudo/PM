'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/providers/auth-provider'
import { useUserRole } from '@/hooks/use-user-role'
import { 
  Building2, 
  Package, 
  FileText, 
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react'

export default function DashboardPage() {
  const { profile } = useAuth()
  const { isMOH, isTier1, isTier2, isCompanyUser } = useUserRole()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {getGreeting()}, {profile?.full_name?.split(' ')[0] || 'User'}
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your platform today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isMOH ? (
          <>
            <StatCard
              title="Total Companies"
              value="75"
              description="15 IPCs, 60 Wholesalers"
              icon={Building2}
            />
            <StatCard
              title="Active SKUs"
              value="1,234"
              description="+12 this month"
              icon={Package}
            />
            <StatCard
              title="Pending Submissions"
              value="23"
              description="8 require review"
              icon={FileText}
              trend="warning"
            />
            <StatCard
              title="Active Breaches"
              value="5"
              description="2 critical"
              icon={AlertTriangle}
              trend="danger"
            />
          </>
        ) : (
          <>
            <StatCard
              title="Your Products"
              value="12"
              description="3 critical medicines"
              icon={Package}
            />
            <StatCard
              title="Active SKUs"
              value="48"
              description="All compliant"
              icon={Package}
            />
            <StatCard
              title="Pending Submissions"
              value="2"
              description="1 AAMS, 1 WSL"
              icon={FileText}
            />
            <StatCard
              title="Compliance Score"
              value="94%"
              description="+2% this month"
              icon={TrendingUp}
              trend="success"
            />
          </>
        )}
      </div>

      {/* Recent Activity & Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ActivityItem
                icon={CheckCircle2}
                iconColor="text-green-500"
                title="WSL Submission Accepted"
                description="Week ending Jan 10, 2026"
                time="2 hours ago"
              />
              <ActivityItem
                icon={Clock}
                iconColor="text-yellow-500"
                title="AAMS Submission Pending"
                description="2025 Annual Average Monthly Sales"
                time="1 day ago"
              />
              <ActivityItem
                icon={AlertTriangle}
                iconColor="text-red-500"
                title="Threshold Breach Detected"
                description="Paracetamol 500mg - Stock below threshold"
                time="2 days ago"
              />
              <ActivityItem
                icon={FileText}
                iconColor="text-blue-500"
                title="Registry Update Submitted"
                description="New product registration request"
                time="3 days ago"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {isCompanyUser && (
                <>
                  <QuickActionCard
                    title="Submit WSL"
                    description="Weekly Stock Levels"
                    href="/dashboard/vci/wsl/new"
                  />
                  <QuickActionCard
                    title="Submit MSQ"
                    description="Monthly Sales Quantities"
                    href="/dashboard/vci/msq/new"
                  />
                  <QuickActionCard
                    title="View Breaches"
                    description="Check compliance status"
                    href="/dashboard/vci/breaches"
                  />
                  <QuickActionCard
                    title="Registry Update"
                    description="Update company/products"
                    href="/dashboard/rmm/submissions/new"
                  />
                </>
              )}
              {isTier2 && (
                <>
                  <QuickActionCard
                    title="Review Submissions"
                    description="Pending verifications"
                    href="/dashboard/vci/submissions"
                  />
                  <QuickActionCard
                    title="Analyze Breaches"
                    description="Pending analyses"
                    href="/dashboard/vci/breaches"
                  />
                  <QuickActionCard
                    title="Companies"
                    description="View all companies"
                    href="/dashboard/rmm/companies"
                  />
                  <QuickActionCard
                    title="Registry Queue"
                    description="Implementation queue"
                    href="/dashboard/rmm/submissions"
                  />
                </>
              )}
              {isTier1 && (
                <>
                  <QuickActionCard
                    title="Approve Thresholds"
                    description="Pending approvals"
                    href="/dashboard/vci/thresholds"
                  />
                  <QuickActionCard
                    title="Review Breaches"
                    description="Escalated items"
                    href="/dashboard/vci/breaches"
                  />
                  <QuickActionCard
                    title="System Config"
                    description="Module activation"
                    href="/dashboard/admin/config"
                  />
                  <QuickActionCard
                    title="Compliance Reports"
                    description="CMC Dashboard"
                    href="/dashboard/cmc/reports"
                  />
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: {
  title: string
  value: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  trend?: 'success' | 'warning' | 'danger'
}) {
  const trendColors = {
    success: 'text-green-500',
    warning: 'text-yellow-500',
    danger: 'text-red-500',
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${trend ? trendColors[trend] : 'text-muted-foreground'}`}>
          {description}
        </p>
      </CardContent>
    </Card>
  )
}

function ActivityItem({
  icon: Icon,
  iconColor,
  title,
  description,
  time,
}: {
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  title: string
  description: string
  time: string
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className={`h-5 w-5 mt-0.5 ${iconColor}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm text-muted-foreground truncate">{description}</p>
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">{time}</span>
    </div>
  )
}

function QuickActionCard({
  title,
  description,
  href,
}: {
  title: string
  description: string
  href: string
}) {
  return (
    <a
      href={href}
      className="block p-4 border rounded-lg hover:bg-muted transition-colors"
    >
      <h4 className="font-medium text-sm">{title}</h4>
      <p className="text-xs text-muted-foreground">{description}</p>
    </a>
  )
}
