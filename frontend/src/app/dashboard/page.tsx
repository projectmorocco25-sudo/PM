'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/providers/auth-provider'
import { useUserRole } from '@/hooks/use-user-role'
import {
  useDashboardMetrics,
  useSubmissionCompliance,
  usePendingApprovals,
  useActiveBreaches,
  usePendingReversions,
  useFollowUps,
  useEnforcementSummary,
  useUnsubmittedCompanies,
} from '@/hooks/use-dashboard-data'
import {
  EmergencyBanner,
  SCGauge,
  MetricCard,
  AlertCompanyModal,
  AssignFollowUpModal,
  ScheduleMeetingModal,
  QuickActionsBar,
  DashboardTabs,
  TabsContent,
} from '@/components/dashboard'
import {
  Building2,
  Package,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Shield,
  Users,
  Gavel,
  TrendingUp,
  Calendar,
  RefreshCw,
} from 'lucide-react'
import Link from 'next/link'

function DashboardContent() {
  const { profile } = useAuth()
  const { isMOH, isTier1, isTier2, isCompanyUser } = useUserRole()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab') || 'overview'

  // Data hooks
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics()
  const { data: compliance, isLoading: complianceLoading } = useSubmissionCompliance()
  const { data: pendingApprovals } = usePendingApprovals()
  const { data: activeBreaches } = useActiveBreaches()
  const { data: pendingReversions } = usePendingReversions()
  const { data: followUps } = useFollowUps()
  const { data: enforcement } = useEnforcementSummary()
  const { data: unsubmittedCompanies } = useUnsubmittedCompanies()

  // Modal states
  const [alertModalOpen, setAlertModalOpen] = useState(false)
  const [followUpModalOpen, setFollowUpModalOpen] = useState(false)
  const [meetingModalOpen, setMeetingModalOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<{ id: string; name: string } | undefined>()

  // Render different dashboards based on role
  if (isCompanyUser) {
    return <CompanyDashboard />
  }

  if (isTier2 && !isTier1) {
    return <Tier2Dashboard />
  }

  // MOH Tier 1 Dashboard (Full governance view)
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Governance Overview</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Emergency Banner */}
      {compliance && (
        <EmergencyBanner 
          compliance={compliance} 
          onScheduleMeeting={() => setMeetingModalOpen(true)} 
        />
      )}

      {/* Tabs */}
      <DashboardTabs
        complianceCount={unsubmittedCompanies?.length || 0}
        enforcementCount={enforcement?.pendingApprovals || 0}
      >
        {/* Quick Actions Bar */}
        <QuickActionsBar
          activeTab={activeTab}
          onAlertAll={() => setAlertModalOpen(true)}
          onBulkFollowUp={() => setFollowUpModalOpen(true)}
          onExport={() => {}}
          onFilter={() => {}}
        />

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* %SC Gauge */}
          {compliance && <SCGauge compliance={compliance} />}

          {/* Card Row 1: System Health, Pending Approvals, Critical Breaches */}
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard
              title="System Health"
              value={metrics?.totalCompanies || 0}
              subtitle={`${metrics?.ipcCount || 0} IPCs, ${metrics?.wholesalerCount || 0} Wholesalers`}
              icon={Building2}
              status="success"
              isLoading={metricsLoading}
              items={[
                { label: 'Companies', value: metrics?.totalCompanies || 0 },
                { label: 'Active Submissions', value: metrics?.pendingSubmissions || 0 },
              ]}
              action={{ label: 'Details', href: '/dashboard/rmm/companies' }}
            />
            <MetricCard
              title="Pending Approvals"
              value={pendingApprovals?.length || 0}
              icon={Clock}
              status={pendingApprovals && pendingApprovals.length > 5 ? 'warning' : 'info'}
              items={pendingApprovals?.slice(0, 3).map(a => ({
                label: `${a.title} - ${a.company}`,
                value: a.priority,
                status: a.priority === 'high' ? 'warning' : undefined,
                href: `/dashboard/vci/aams/${a.id}`,
              }))}
              action={{ label: 'View All', href: '/dashboard/approvals' }}
            />
            <MetricCard
              title="Critical Breaches"
              value={metrics?.activeBreaches || 0}
              subtitle={`${metrics?.criticalBreaches || 0} critical`}
              icon={AlertTriangle}
              status={metrics?.activeBreaches ? 'danger' : 'success'}
              isLoading={metricsLoading}
              items={activeBreaches?.slice(0, 3).map(b => ({
                label: b.companyName,
                value: `${b.skuCount} SKUs`,
                status: b.priority === 'extreme' ? 'danger' : b.priority === 'high' ? 'warning' : undefined,
                href: `/dashboard/vci/breaches?company=${b.id}`,
              }))}
              action={{ label: 'View All', href: '/dashboard/vci/breaches' }}
            />
          </div>

          {/* Card Row 2: Pending Reversions, Enforcement, Follow-ups */}
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard
              title="Pending Threshold Reversions"
              value={`${pendingReversions?.length || 0} Pending`}
              icon={RefreshCw}
              status={pendingReversions && pendingReversions.some(r => r.daysUntil <= 7) ? 'warning' : 'info'}
              items={pendingReversions?.slice(0, 3).map(r => ({
                label: r.skuName,
                value: `${r.daysUntil} days`,
                status: r.daysUntil <= 7 ? 'danger' : r.daysUntil <= 30 ? 'warning' : 'success',
              }))}
              action={{ label: 'Review All', href: '/dashboard/vci/thresholds?filter=pending_reversion' }}
            />
            <MetricCard
              title="Enforcement Actions"
              value={`This Month`}
              icon={Gavel}
              items={[
                { label: 'Warnings', value: enforcement?.warnings || 0 },
                { label: 'Fines', value: enforcement?.fines || 0 },
                { label: 'Suspensions', value: enforcement?.suspensions || 0 },
              ]}
              action={{ label: 'View All', href: '/dashboard/enforcement/actions' }}
            />
            <MetricCard
              title="Follow-up Tracking"
              value={`${followUps?.length || 0} Active`}
              icon={Users}
              status={followUps?.some(f => f.status === 'overdue') ? 'danger' : 'info'}
              items={followUps?.slice(0, 3).map(f => ({
                label: `${f.companyName} - ${f.assignedTo}`,
                value: f.status === 'overdue' ? 'Overdue' : new Date(f.dueDate).toLocaleDateString(),
                status: f.status === 'overdue' ? 'danger' : undefined,
              }))}
              action={{ label: 'View All', href: '/dashboard/follow-ups' }}
            />
          </div>

          {/* Card Row 3: Audit Trail */}
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard
              title="Audit Trail Verification"
              value="✅ All Actions Logged"
              icon={Shield}
              status="success"
              subtitle="Last verified: 2 min ago"
              items={[
                { label: 'Alerts Sent', value: 80 },
                { label: 'Follow-ups Created', value: followUps?.length || 0 },
              ]}
              action={{ label: 'View Logs', href: '/dashboard/audit/logs' }}
            />
          </div>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          {/* Critical Medicine Compliance */}
          <Card>
            <CardHeader>
              <CardTitle>Critical Medicine Compliance</CardTitle>
              <CardDescription>
                Companies with critical medicine threshold violations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeBreaches && activeBreaches.length > 0 ? (
                <div className="space-y-4">
                  {activeBreaches.filter(b => b.priority === 'extreme').map(breach => (
                    <div key={breach.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <input type="checkbox" className="mt-1" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{breach.companyName}</span>
                            <Badge variant="destructive">Extreme</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {breach.skuCount} critical SKUs below threshold
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Status: Not Alerted
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => {
                          setSelectedCompany({ id: breach.id, name: breach.companyName })
                          setAlertModalOpen(true)
                        }}>
                          Alert
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => {
                          setSelectedCompany({ id: breach.id, name: breach.companyName })
                          setFollowUpModalOpen(true)
                        }}>
                          Assign Follow-up
                        </Button>
                        <Button size="sm" variant="outline">
                          Create Enforcement
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No critical medicine violations</p>
              )}
            </CardContent>
          </Card>

          {/* Unsubmitted Companies */}
          <Card>
            <CardHeader>
              <CardTitle>Unsubmitted Companies ({unsubmittedCompanies?.length || 0})</CardTitle>
              <CardDescription>
                Companies that have not submitted their weekly stock levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              {unsubmittedCompanies && unsubmittedCompanies.length > 0 ? (
                <div className="space-y-4">
                  {unsubmittedCompanies.slice(0, 10).map(company => (
                    <div key={company.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <input type="checkbox" className="mt-1" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{company.name}</span>
                            <Badge variant={company.priority === 'extreme' ? 'destructive' : 'secondary'}>
                              {company.priority === 'extreme' ? 'Extreme' : 'Normal'}
                            </Badge>
                          </div>
                          {company.criticalMedicines > 0 && (
                            <p className="text-sm text-red-600 mt-1">
                              Critical medicines: {company.criticalMedicines}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            Enforcement: {company.warnings} warnings, {company.fines} fines
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => {
                          setSelectedCompany({ id: company.id, name: company.name })
                          setAlertModalOpen(true)
                        }}>
                          Alert
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => {
                          setSelectedCompany({ id: company.id, name: company.name })
                          setFollowUpModalOpen(true)
                        }}>
                          Assign Follow-up
                        </Button>
                      </div>
                    </div>
                  ))}
                  {unsubmittedCompanies.length > 10 && (
                    <Button variant="outline" className="w-full">
                      Load More ({unsubmittedCompanies.length - 10} more)
                    </Button>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">All companies have submitted</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enforcement Tab */}
        <TabsContent value="enforcement" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard
              title="This Month"
              value={`${(enforcement?.warnings || 0) + (enforcement?.fines || 0) + (enforcement?.suspensions || 0)} Total`}
              items={[
                { label: 'Warnings', value: enforcement?.warnings || 0 },
                { label: 'Fines', value: enforcement?.fines || 0 },
                { label: 'Suspensions', value: enforcement?.suspensions || 0 },
              ]}
            />
            <MetricCard
              title="Pending Approvals"
              value={enforcement?.pendingApprovals || 0}
              status={enforcement?.pendingApprovals ? 'warning' : 'success'}
              action={{ label: 'Review', href: '/dashboard/enforcement/pending' }}
            />
            <MetricCard
              title="Recent Executions"
              value="5 Actions"
              action={{ label: 'View All', href: '/dashboard/enforcement/actions' }}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Enforcement Actions List</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                <Link href="/dashboard/enforcement/actions" className="text-primary hover:underline">
                  View full enforcement actions list →
                </Link>
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Modules Tab */}
        <TabsContent value="modules" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <MetricCard
              title="RMM Issues"
              value="12 Issues"
              items={[
                { label: 'Company Reg. Incomplete', value: 5 },
                { label: 'Product Data Quality', value: 4 },
                { label: 'User Account Issues', value: 3 },
              ]}
              action={{ label: 'View All', href: '/dashboard/rmm' }}
            />
            <MetricCard
              title="VCI - SKUs"
              value="Action Required"
              items={[
                { label: 'Action Required', value: 8, status: 'danger' },
                { label: 'Under Monitor', value: 15, status: 'warning' },
              ]}
              action={{ label: 'View All', href: '/dashboard/vci/breaches' }}
            />
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Governance Dashboard</CardTitle>
              <CardDescription>
                {compliance?.isEmergency 
                  ? '⚠️ Data may not be reliable for governance analysis' 
                  : '✅ Data Usable for Governance Analysis'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Stock Sufficiency Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      Chart: Stock Levels by Product Category
                    </p>
                    <Link href="/dashboard/vci/governance" className="text-primary text-sm hover:underline">
                      View Full Dashboard →
                    </Link>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Breach Status Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm">Active Breaches: {metrics?.activeBreaches || 0}</p>
                      <p className="text-sm text-red-500">Critical: {metrics?.criticalBreaches || 0}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Action Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Review critical breaches ({metrics?.criticalBreaches || 0} items)</li>
                    <li>• Follow up with unsubmitted companies ({unsubmittedCompanies?.length || 0})</li>
                    <li>• Process pending threshold reversions ({pendingReversions?.length || 0})</li>
                  </ul>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/dashboard/vci/analytics/atc-treemap" className="block text-sm text-primary hover:underline">
                  • ATC Treemap
                </Link>
                <Link href="/dashboard/vci/governance" className="block text-sm text-primary hover:underline">
                  • Governance Analytics
                </Link>
                <Link href="/dashboard/cmc/reports" className="block text-sm text-primary hover:underline">
                  • CMC Reports
                </Link>
                <Link href="/dashboard/vci/thresholds" className="block text-sm text-primary hover:underline">
                  • Threshold Management
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Compliance Report - Jan 2026</span>
                  <Button variant="ghost" size="sm">Download</Button>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Activity Report - Dec 2025</span>
                  <Button variant="ghost" size="sm">Download</Button>
                </div>
                <Link href="/dashboard/cmc/reports" className="text-primary text-sm hover:underline">
                  View All →
                </Link>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </DashboardTabs>

      {/* Modals */}
      <AlertCompanyModal
        open={alertModalOpen}
        onOpenChange={setAlertModalOpen}
        company={selectedCompany}
      />
      <AssignFollowUpModal
        open={followUpModalOpen}
        onOpenChange={setFollowUpModalOpen}
        company={selectedCompany}
      />
      <ScheduleMeetingModal
        open={meetingModalOpen}
        onOpenChange={setMeetingModalOpen}
        isEmergency={compliance?.isEmergency}
        reason="Submission Compliance Below Threshold"
      />
    </div>
  )
}

// Company Dashboard (simpler view)
function CompanyDashboard() {
  const { profile } = useAuth()
  const { data: metrics, isLoading } = useDashboardMetrics()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Your Products"
          value={12}
          subtitle="3 critical medicines"
          icon={Package}
          isLoading={isLoading}
        />
        <MetricCard
          title="Active SKUs"
          value={48}
          subtitle="All compliant"
          icon={Package}
          status="success"
        />
        <MetricCard
          title="Pending Submissions"
          value={2}
          subtitle="1 AAMS, 1 WSL"
          icon={FileText}
        />
        <MetricCard
          title="Compliance Score"
          value="94%"
          trendValue="+2%"
          trend="up"
          icon={TrendingUp}
          status="success"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">WSL Submission</p>
                  <p className="text-sm text-muted-foreground">Week ending Jan 17</p>
                </div>
                <Badge>Due in 3 days</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">MSQ Submission</p>
                  <p className="text-sm text-muted-foreground">January 2026</p>
                </div>
                <Badge variant="secondary">Due in 17 days</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="h-auto py-4 flex-col" asChild>
                <Link href="/dashboard/vci/wsl/new">
                  <FileText className="h-5 w-5 mb-1" />
                  Submit WSL
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col" asChild>
                <Link href="/dashboard/vci/msq/new">
                  <FileText className="h-5 w-5 mb-1" />
                  Submit MSQ
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col" asChild>
                <Link href="/dashboard/vci/breaches">
                  <AlertTriangle className="h-5 w-5 mb-1" />
                  View Breaches
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col" asChild>
                <Link href="/dashboard/rmm/products">
                  <Package className="h-5 w-5 mb-1" />
                  Products
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Tier 2 Dashboard
function Tier2Dashboard() {
  const { profile } = useAuth()
  const { data: metrics, isLoading } = useDashboardMetrics()
  const { data: pendingApprovals } = usePendingApprovals()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Review Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Pending Verifications"
          value={metrics?.pendingSubmissions || 0}
          icon={FileText}
          status={metrics?.pendingSubmissions ? 'warning' : 'success'}
          action={{ label: 'Review', href: '/dashboard/vci/submissions' }}
        />
        <MetricCard
          title="Breaches to Analyze"
          value={metrics?.activeBreaches || 0}
          icon={AlertTriangle}
          status={metrics?.activeBreaches ? 'danger' : 'success'}
          action={{ label: 'Analyze', href: '/dashboard/vci/breaches' }}
        />
        <MetricCard
          title="Implementation Queue"
          value={5}
          icon={CheckCircle2}
          action={{ label: 'View', href: '/dashboard/rmm/submissions' }}
        />
        <MetricCard
          title="Total Companies"
          value={metrics?.totalCompanies || 0}
          icon={Building2}
          action={{ label: 'View', href: '/dashboard/rmm/companies' }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingApprovals?.slice(0, 5).map(approval => (
                <div key={approval.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{approval.title}</p>
                    <p className="text-sm text-muted-foreground">{approval.company}</p>
                  </div>
                  <Button size="sm" variant="outline">Review</Button>
                </div>
              ))}
              <Link href="/dashboard/approvals" className="text-primary text-sm hover:underline">
                View All Pending Tasks →
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="h-auto py-4 flex-col" asChild>
                <Link href="/dashboard/vci/submissions">
                  <FileText className="h-5 w-5 mb-1" />
                  Review Submissions
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col" asChild>
                <Link href="/dashboard/vci/breaches">
                  <AlertTriangle className="h-5 w-5 mb-1" />
                  Analyze Breaches
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col" asChild>
                <Link href="/dashboard/rmm/companies">
                  <Building2 className="h-5 w-5 mb-1" />
                  Companies
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col" asChild>
                <Link href="/dashboard/rmm/submissions">
                  <CheckCircle2 className="h-5 w-5 mb-1" />
                  Registry Queue
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32 mt-2" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
      <Skeleton className="h-10 w-full" />
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
    </div>
  )
}
