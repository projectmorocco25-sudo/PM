/**
 * Company Dashboard Component
 * Task: 0.5.1.18 - Company Dashboard
 * Wireframe: task-0.5.1.18-company-dashboard.md
 * Reference: Fatima Wireframe Review - Regulatory Compliance Requirements
 * 
 * Implements Company Dashboard with:
 * - Regulatory Compliance Status widget
 * - Active Enforcement Actions widget with legal basis and appeal deadlines
 * - Submission Deadlines with regulatory references
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useUserRole } from '@/lib/hooks/use-user-role'
import { useCompanyEnforcementActions, calculateAppealDeadlineRemaining } from '@/lib/hooks/use-enforcement-actions'
import { useSubmissionDeadlines } from '@/lib/hooks/use-submission-deadlines'
import { AlertTriangle, CheckCircle2, Clock, ChevronRight, ExternalLink, TrendingUp } from 'lucide-react'
import { formatDistanceToNow, format as formatDate } from 'date-fns'

export function CompanyDashboard() {
  const { data: userRole, isLoading: roleLoading } = useUserRole()
  const { data: enforcementData, isLoading: enforcementLoading } = useCompanyEnforcementActions(
    userRole?.companyId || null
  )
  const { data: deadlines, isLoading: deadlinesLoading } = useSubmissionDeadlines(userRole?.companyId || null)

  const [activeTab, setActiveTab] = useState<'overview' | 'submissions' | 'enforcement' | 'activity'>('overview')

  if (roleLoading || enforcementLoading || deadlinesLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
      </div>
    )
  }

  // Calculate compliance status
  const activeViolations = enforcementData?.activeActions.length || 0
  const actionsRequiringAppeal = enforcementData?.actionsRequiringAppeal || 0
  const complianceStatus = activeViolations === 0 ? 'compliant' : activeViolations < 3 ? 'under_review' : 'non_compliant'

  return (
    <div className="space-y-6">
      {/* Welcome Header with Quick Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Welcome, {userRole?.companyId ? 'Company' : 'User'}
          </h2>
        </div>
        <div className="relative">
          <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Quick Actions <ChevronRight className="ml-1 inline h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'submissions', label: 'Submissions' },
            { id: 'enforcement', label: 'Enforcement' },
            { id: 'activity', label: 'Activity' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Regulatory Compliance Status Widget */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Regulatory Compliance Status</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {complianceStatus === 'compliant' && (
                  <>
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                    <span className="text-lg font-medium text-green-700">✓ Compliant</span>
                  </>
                )}
                {complianceStatus === 'non_compliant' && (
                  <>
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                    <span className="text-lg font-medium text-red-700">
                      ⚠️ Non-Compliant ({activeViolations} {activeViolations === 1 ? 'violation' : 'violations'})
                    </span>
                  </>
                )}
                {complianceStatus === 'under_review' && (
                  <>
                    <Clock className="h-6 w-6 text-yellow-600" />
                    <span className="text-lg font-medium text-yellow-700">🟡 Under Review</span>
                  </>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-gray-600">Active Enforcement Actions</p>
                  <p className="text-2xl font-semibold text-gray-900">{enforcementData?.totalActions || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Required Actions</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {actionsRequiringAppeal} {actionsRequiringAppeal > 0 && '(Appeal deadline approaching)'}
                  </p>
                </div>
              </div>
              <Link
                href="/compliance/status"
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View Detailed Compliance Status <ExternalLink className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Three Column Widgets */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* My Submissions Widget */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">My Submissions</h3>
              <p className="mb-4 text-3xl font-bold text-gray-900">12</p>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">Recent:</p>
                <div className="space-y-1">
                  <div>
                    <p className="font-medium text-gray-900">Product XYZ</p>
                    <p className="text-gray-600">Submitted 1 day ago</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Product ABC</p>
                    <p className="text-gray-600">Approved 2 days ago</p>
                  </div>
                </div>
              </div>
              <Link
                href="/submissions"
                className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            {/* Pending Approvals Widget */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Pending Approvals</h3>
              <p className="mb-4 text-3xl font-bold text-gray-900">3</p>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="font-medium text-gray-900">Product ABC</p>
                  <p className="text-gray-600">High • 1h ago</p>
                  <p className="text-yellow-600">⚠️ 2d deadline</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Product DEF</p>
                  <p className="text-gray-600">Medium • 2h ago</p>
                  <p className="text-yellow-600">⚠️ 3d deadline</p>
                </div>
              </div>
              <Link
                href="/submissions?status=pending"
                className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            {/* Recent Activity Widget */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Recent Activity</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-900">• Submission #12345</p>
                  <p className="text-gray-600">Approved • 2h ago</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">• Submission #12346</p>
                  <p className="text-gray-600">Pending • 5h ago</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">• New Message from MOH</p>
                  <p className="text-gray-600">1 day ago</p>
                </div>
              </div>
              <Link
                href="/activity"
                className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Active Enforcement Actions Widget */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Active Enforcement Actions (My Company)</h3>
            </div>
            {enforcementData?.activeActions && enforcementData.activeActions.length > 0 ? (
              <div className="space-y-4">
                {enforcementData.activeActions.slice(0, 2).map((action) => {
                  const appealDeadline = calculateAppealDeadlineRemaining(action.executed_at)
                  const isAppealWindowOpen = appealDeadline.daysRemaining > 0

                  return (
                    <div
                      key={action.id}
                      className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                      style={{ backgroundColor: '#f9fafb' }}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        <span className="font-semibold text-gray-900">
                          {action.action_type.charAt(0).toUpperCase() + action.action_type.slice(1)} -{' '}
                          {action.violation_type
                            .split('_')
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-700">
                        <p>
                          <span className="font-medium">Status:</span> {action.status.charAt(0).toUpperCase() + action.status.slice(1)}
                          {action.executed_at && (
                            <>
                              {' • '}
                              <span className="font-medium">Date:</span>{' '}
                              {formatDistanceToNow(new Date(action.executed_at), { addSuffix: true })}
                            </>
                          )}
                        </p>
                        <p>
                          <span className="font-medium">Violation:</span> {action.justification}
                        </p>
                        <p>
                          <span className="font-medium">Legal Basis:</span> {action.legal_basis}
                        </p>
                        {isAppealWindowOpen && (
                          <div className="mt-2 rounded-md bg-red-50 p-2" style={{ backgroundColor: '#fef2f2' }}>
                            <p className="font-semibold text-red-900">
                              🔴 {appealDeadline.daysRemaining} days remaining (Due:{' '}
                              {appealDeadline.deadlineDate?.toLocaleDateString()})
                            </p>
                            <p className="text-sm text-red-700">
                              Regulatory: Law No. 09-08 - 30-day appeal window
                            </p>
                            <p className="mt-1 text-sm font-medium text-red-900">
                              Action Required: Submit appeal before deadline
                            </p>
                          </div>
                        )}
                        {!isAppealWindowOpen && action.status === 'executed' && (
                          <p className="text-sm text-gray-600">Appeal Window: Closed</p>
                        )}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Link
                          href={`/enforcement/actions/${action.id}`}
                          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          View Details
                        </Link>
                        {isAppealWindowOpen && (
                          <Link
                            href={`/enforcement/actions/${action.id}/appeal`}
                            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                          >
                            Appeal
                          </Link>
                        )}
                      </div>
                    </div>
                  )
                })}
                <Link
                  href="/enforcement/actions"
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  View All Enforcement Actions <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
                <p className="mt-2 text-sm font-medium text-gray-900">No active enforcement actions</p>
                <p className="mt-1 text-sm text-gray-600">Your company is currently compliant.</p>
              </div>
            )}
          </div>

          {/* Submission Deadlines Widget (Fatima Requirement) */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Submission Deadlines</h3>
            {deadlines && deadlines.length > 0 ? (
              <div className="space-y-4">
                {deadlines.slice(0, 2).map((deadline) => {
                  const urgencyClass = deadline.isCritical 
                    ? 'bg-red-100 text-red-700' 
                    : deadline.isUrgent 
                    ? 'bg-yellow-100 text-yellow-700' 
                    : 'bg-green-100 text-green-700'
                  const urgencyIcon = deadline.isCritical ? '🔴' : deadline.isUrgent ? '🟡' : '🟢'
                  
                  return (
                    <div key={deadline.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{deadline.typeLabel}</p>
                          <p className="mt-1 text-sm text-gray-600">
                            Due: {formatDate(deadline.deadline, 'PPp')} ({deadline.daysRemaining} days remaining)
                          </p>
                          <p className="mt-1 text-sm font-medium text-blue-700">Regulatory: {deadline.regulatoryReference}</p>
                        </div>
                        <div className="text-right">
                          <span className={`rounded-full px-2 py-1 text-xs font-semibold ${urgencyClass}`}>
                            {urgencyIcon} {deadline.daysRemaining}d {deadline.isCritical || deadline.isUrgent ? 'deadline' : 'remaining'}
                          </span>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        Grace period: {deadline.gracePeriodDays} day{deadline.gracePeriodDays !== 1 ? 's' : ''} after deadline • Late submission penalty: {deadline.latePenalty}
                      </p>
                    </div>
                  )
                })}
                <Link
                  href="/submissions?tab=deadlines"
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  View All Upcoming Deadlines <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
                <p className="mt-2 text-sm font-medium text-gray-900">No upcoming deadlines</p>
                <p className="mt-1 text-sm text-gray-600">All submissions are up to date.</p>
              </div>
            )}
          </div>

          {/* Key Metrics Widget */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Key Metrics</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-600">Compliance Score</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">85%</p>
                <div className="mt-1 flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>+5%</span>
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-600">Active Submissions</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">12</p>
                <Link href="/submissions" className="mt-1 text-sm text-blue-600 hover:text-blue-500">
                  → View
                </Link>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-600">Pending Actions</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">3</p>
                <Link href="/submissions?status=pending" className="mt-1 text-sm text-blue-600 hover:text-blue-500">
                  → View
                </Link>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-600">Completed This Month</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">24</p>
                <Link href="/activity" className="mt-1 text-sm text-blue-600 hover:text-blue-500">
                  → View
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submissions Tab Content */}
      {activeTab === 'submissions' && (
        <div className="space-y-6">
          {/* My Submissions Section */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">My Submissions (12)</h3>
            <div className="mb-4 flex flex-wrap gap-2">
              <button className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Filter: All
              </button>
              <button className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Pending
              </button>
              <button className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Approved
              </button>
              <button className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Rejected
              </button>
              <button className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Sort: Date <ChevronRight className="ml-1 inline h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              {/* Submission Item with Regulatory Deadline */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">Submission #12345</span>
                      <span className="font-medium text-gray-700">Product XYZ</span>
                      <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-700">Pending</span>
                    </div>
                    <div className="mt-2 space-y-1 text-sm text-gray-700">
                      <p>
                        <span className="font-medium">Type:</span> WSL • <span className="font-medium">Submitted:</span> 1 day ago
                      </p>
                      <p>
                        <span className="font-medium">Status:</span> Awaiting Verification
                      </p>
                      <p>
                        <span className="font-medium">Submission Deadline:</span> Due {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()} (3 days remaining)
                      </p>
                      <p className="font-medium text-blue-700">Regulatory: DMP Art. 12 - Weekly Submission</p>
                    </div>
                  </div>
                  <div className="ml-4 flex gap-2">
                    <Link
                      href="/submissions/12345"
                      className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      View Details
                    </Link>
                    <button className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                      Edit
                    </button>
                    <button className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                      Withdraw
                    </button>
                  </div>
                </div>
              </div>
              {/* Approved Submission */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">Submission #12344</span>
                      <span className="font-medium text-gray-700">Product ABC</span>
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">✓ Approved</span>
                    </div>
                    <div className="mt-2 space-y-1 text-sm text-gray-700">
                      <p>
                        <span className="font-medium">Type:</span> MSQ • <span className="font-medium">Submitted:</span> 2 days ago
                      </p>
                      <p>
                        <span className="font-medium">Status:</span> Approved by MOH Tier 2
                      </p>
                    </div>
                  </div>
                  <div className="ml-4 flex gap-2">
                    <Link
                      href="/submissions/12344"
                      className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      View Details
                    </Link>
                    <button className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                      Download Receipt
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Load More
              </button>
              <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Export List
              </button>
            </div>
          </div>

          {/* Three Column Widgets - This Week, This Month, Upcoming Deadlines */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">This Week</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Submitted:</span> 3
                </p>
                <p>
                  <span className="font-medium">Approved:</span> 2
                </p>
                <p>
                  <span className="font-medium">Pending:</span> 1
                </p>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">This Month</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Submitted:</span> 12
                </p>
                <p>
                  <span className="font-medium">Approved:</span> 10
                </p>
                <p>
                  <span className="font-medium">Pending:</span> 2
                </p>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="font-medium text-gray-900">• WSL Week 4</p>
                  <p className="text-gray-600">Due: 2 days</p>
                  <p className="text-xs text-blue-700">Regulatory: DMP Art. 12</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">• MSQ Jan</p>
                  <p className="text-gray-600">Due: 5 days</p>
                  <p className="text-xs text-blue-700">Regulatory: DMP Art. 15</p>
                </div>
              </div>
              <Link
                href="/submissions?tab=deadlines"
                className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Other tabs placeholder */}
      {activeTab !== 'overview' && activeTab !== 'submissions' && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-gray-600">Tab content for {activeTab} - to be implemented per wireframe specifications</p>
        </div>
      )}
    </div>
  )
}
