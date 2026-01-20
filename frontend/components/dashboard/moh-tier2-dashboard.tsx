/**
 * MOH Tier 2 Dashboard Component
 * Task: 0.5.1.20 - MOH Tier 2 Dashboard
 * Wireframe: task-0.5.1.20-moh-tier2-dashboard.md
 * Reference: Fatima Wireframe Review - Regulatory Compliance Requirements
 * 
 * Implements MOH Tier 2 Dashboard with:
 * - Pending Verifications with Regulatory Deadlines (deadline tracking, countdown timers, urgency indicators)
 * - Review Queue with Regulatory Prioritization (sorted by deadline urgency, priority indicators)
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePendingVerifications } from '@/lib/hooks/use-pending-verifications'
import { AlertTriangle, CheckCircle2, Clock, ChevronRight, ExternalLink, TrendingUp } from 'lucide-react'
import { formatDistanceToNow, format as formatDate } from 'date-fns'

export function MOHTier2Dashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'verification' | 'follow-ups' | 'analysis'>('overview')

  // Fetch actual data using hook
  const { data: verifications, isLoading: verificationsLoading } = usePendingVerifications()

  // Calculate urgency for each verification
  const getUrgencyIndicator = (verification: typeof verifications[0]) => {
    if (!verification) return { icon: '🟢', label: 'N/A', urgent: false, critical: false }
    if (verification.isCritical) {
      return { icon: '🔴', label: `${verification.daysRemaining}d deadline`, urgent: true, critical: true }
    } else if (verification.isUrgent) {
      return { icon: '🟡', label: `${verification.daysRemaining}d deadline`, urgent: true, critical: false }
    }
    return { icon: '🟢', label: `${verification.daysRemaining}d remaining`, urgent: false, critical: false }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Verification Overview</h2>
        <div className="flex gap-2">
          <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Filters <ChevronRight className="ml-1 inline h-4 w-4" />
          </button>
          <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Sort <ChevronRight className="ml-1 inline h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'verification', label: `Verification (${pendingVerifications.length})` },
            { id: 'follow-ups', label: 'Follow-ups' },
            { id: 'analysis', label: 'Analysis' },
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
          {/* Three Column Widgets */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Pending Verifications Widget with Regulatory Deadlines */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Pending Verifications</h3>
              {verificationsLoading ? (
                <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
              ) : (
                <>
                  <p className="mb-4 text-3xl font-bold text-gray-900">{verifications?.length || 0}</p>
                  {verifications && verifications.length > 0 ? (
                    <>
                      <div className="space-y-3 text-sm">
                        {verifications.slice(0, 2).map((verification) => {
                          const urgency = getUrgencyIndicator(verification)
                          return (
                            <div key={verification.id}>
                              <p className="font-medium text-gray-900">• {verification.submissionId}</p>
                              <p className="text-gray-600">{verification.companyName}</p>
                              <p className="text-gray-600">
                                {verification.priority.charAt(0).toUpperCase() + verification.priority.slice(1)} •{' '}
                                {verification.submittedAgo}
                              </p>
                              <div className={`mt-1 flex items-center gap-2 ${urgency.critical ? 'text-red-600' : urgency.urgent ? 'text-yellow-600' : 'text-green-600'}`}>
                                <Clock className="h-4 w-4" />
                                <span className="font-semibold">{urgency.icon} {urgency.label}</span>
                              </div>
                              <p className="mt-1 text-xs text-gray-500">{verification.regulatoryDeadline}</p>
                            </div>
                          )
                        })}
                      </div>
                      <Link
                        href="/verifications"
                        className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                      >
                        View All <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </>
                  ) : (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
                      <CheckCircle2 className="mx-auto h-8 w-8 text-green-600" />
                      <p className="mt-2 text-sm font-medium text-gray-900">No pending verifications</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Oversight Metrics Widget */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Oversight Metrics</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Verification Rate</p>
                  <p className="text-2xl font-bold text-gray-900">95%</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Avg. Time</p>
                  <p className="text-2xl font-bold text-gray-900">2.5 hours</p>
                </div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>Trend: ↗ +2%</span>
                </div>
              </div>
              <Link
                href="/oversight/details"
                className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Details <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            {/* Review Queue Widget with Regulatory Prioritization */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Review Queue (Sorted by Regulatory Deadline)</h3>
              {verificationsLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-24 w-full animate-pulse rounded-lg bg-gray-200" />
                  ))}
                </div>
              ) : verifications && verifications.length > 0 ? (
                <>
                  <div className="space-y-3 text-sm">
                    {verifications.slice(0, 2).map((verification) => {
                      const urgency = getUrgencyIndicator(verification)
                      return (
                        <div key={verification.id} className={`rounded-lg border p-3 ${urgency.critical ? 'border-red-300 bg-red-50' : urgency.urgent ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 bg-gray-50'}`}>
                          <p className="font-medium text-gray-900">• {verification.submissionId}</p>
                          <p className="text-gray-600">{verification.companyName}</p>
                          <div className={`mt-1 flex items-center gap-2 ${urgency.critical ? 'text-red-600' : urgency.urgent ? 'text-yellow-600' : 'text-green-600'}`}>
                            <span className="font-semibold">{urgency.icon} {urgency.label}</span>
                          </div>
                          <p className="mt-1 text-gray-600">
                            {verification.priority.charAt(0).toUpperCase() + verification.priority.slice(1)}
                          </p>
                          <button className="mt-2 rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700">
                            Verify
                          </button>
                        </div>
                      )
                    })}
                  </div>
                  <Link
                    href="/review-queue"
                    className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    View All <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </>
              ) : (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-green-600" />
                  <p className="mt-2 text-sm font-medium text-gray-900">No items in review queue</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Verification Tab Content */}
      {activeTab === 'verification' && (
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Pending Verifications with Regulatory Deadlines</h3>
            {verificationsLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-32 w-full animate-pulse rounded-lg bg-gray-200" />
                ))}
              </div>
            ) : verifications && verifications.length > 0 ? (
              <div className="space-y-4">
                {verifications.map((verification) => {
                  const urgency = getUrgencyIndicator(verification)
                  return (
                    <div
                      key={verification.id}
                      className={`rounded-lg border p-4 ${
                        urgency.critical ? 'border-red-300 bg-red-50' : urgency.urgent ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">{verification.submissionId}</span>
                            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                              urgency.critical ? 'bg-red-100 text-red-700' : urgency.urgent ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                            }`}>
                              {urgency.icon} {urgency.label}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-700">Company: {verification.companyName}</p>
                          <p className="text-sm text-gray-600">
                            Priority: {verification.priority.charAt(0).toUpperCase() + verification.priority.slice(1)} • Submitted:{' '}
                            {verification.submittedAgo}
                          </p>
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            Regulatory Deadline: {formatDate(verification.deadline, 'PPp')} ({formatDistanceToNow(verification.deadline, { addSuffix: true })})
                          </p>
                          <p className="mt-1 text-xs text-gray-600">{verification.regulatoryDeadline}</p>
                        </div>
                        <div className="ml-4">
                          <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                            Verify
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
                <p className="mt-2 text-sm font-medium text-gray-900">No pending verifications</p>
                <p className="mt-1 text-sm text-gray-600">All verifications are up to date.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Other tabs placeholder */}
      {activeTab !== 'overview' && activeTab !== 'verification' && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-gray-600">Tab content for {activeTab} - to be implemented per wireframe specifications</p>
        </div>
      )}
    </div>
  )
}
