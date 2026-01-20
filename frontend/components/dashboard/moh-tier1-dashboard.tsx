/**
 * MOH Tier 1 Dashboard Component
 * Task: 0.5.1.19 - MOH Tier 1 Dashboard
 * Wireframe: task-0.5.1.19-moh-tier1-dashboard.md
 * Reference: Fatima Wireframe Review - Regulatory Compliance Requirements
 * 
 * Implements MOH Tier 1 Dashboard with:
 * - Pending Approvals with Regulatory Context (legal basis verification, deadline countdown, checklist status)
 * - Enforcement Regulatory Compliance Metrics (% with proper legal basis, % within deadlines, compliance rate)
 * - Module Activation Regulatory Validation (regulatory authorization, prerequisites, stakeholder notification)
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePendingApprovals } from '@/lib/hooks/use-pending-approvals'
import { useRegulatoryComplianceMetrics } from '@/lib/hooks/use-regulatory-compliance-metrics'
import { useAllModuleStatus } from '@/lib/hooks/use-module-status'
import { AlertTriangle, CheckCircle2, Clock, ChevronRight, ExternalLink, TrendingUp, XCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export function MOHTier1Dashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'compliance' | 'enforcement' | 'modules' | 'reports'>('overview')

  // Fetch actual data using hooks
  const { data: approvals, isLoading: approvalsLoading } = usePendingApprovals()
  const { data: complianceMetrics, isLoading: metricsLoading } = useRegulatoryComplianceMetrics()
  const { data: moduleStatus, isLoading: moduleLoading } = useAllModuleStatus()

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">MOH Tier 1 Dashboard</h2>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'compliance', label: 'Compliance' },
            { id: 'enforcement', label: 'Enforcement' },
            { id: 'modules', label: 'Modules' },
            { id: 'reports', label: 'Reports' },
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
          {/* Emergency Banner - Submission Compliance Below Threshold */}
          <div className="rounded-lg border-2 border-red-500 bg-red-50 p-6" style={{ backgroundColor: '#fef2f2' }}>
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-900">🚨 EMERGENCY: Submission Compliance Below Threshold</h3>
                <p className="mt-1 text-sm text-red-800">
                  %SC: 68% Threshold: 75% Status: 🔴 CRITICAL
                </p>
                <p className="mt-1 text-sm text-red-800">
                  ⚠️ Data cannot be used for governance analysis
                </p>
              </div>
              <button className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
                Schedule Emergency Meeting
              </button>
            </div>
          </div>

          {/* Three Column Widgets */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* System Health Widget */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">System Health</h3>
              <div className="mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-700">🟢 Excellent</span>
              </div>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Companies:</span> 245
                </p>
                <p>
                  <span className="font-medium">Active Submissions:</span> 1,234
                </p>
              </div>
              <Link
                href="/system/health"
                className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Details <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            {/* Pending Approvals Widget with Regulatory Context */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Pending Approvals</h3>
              {approvalsLoading ? (
                <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
              ) : (
                <>
                  <p className="mb-4 text-3xl font-bold text-gray-900">{approvals?.length || 0}</p>
                  {approvals && approvals.length > 0 ? (
                    <>
                      <div className="space-y-3 text-sm">
                        {approvals.slice(0, 2).map((approval) => (
                          <div key={approval.id}>
                            <p className="font-medium text-gray-900">• {approval.reference}</p>
                            <p className="text-gray-600">
                              {approval.priority.charAt(0).toUpperCase() + approval.priority.slice(1)} • {approval.submittedAgo}
                            </p>
                            {approval.deadline && (
                              <>
                                <p className={`mt-1 font-semibold ${approval.isUrgent ? 'text-red-600' : approval.isWarning ? 'text-yellow-600' : 'text-green-600'}`}>
                                  {approval.isUrgent ? '🔴' : approval.isWarning ? '⚠️' : '🟢'} {approval.daysUntilDeadline}d deadline
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                  Legal Basis: {approval.legalBasisVerified ? '✓ Verified' : '✗ Not Verified'} | Regulatory Deadline: {approval.daysUntilDeadline} days | Regulatory Requirement Checklist: {approval.checklistCompleted}/{approval.checklistTotal} complete
                                </p>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                      <Link
                        href="/approvals"
                        className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                      >
                        View All <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </>
                  ) : (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
                      <CheckCircle2 className="mx-auto h-8 w-8 text-green-600" />
                      <p className="mt-2 text-sm font-medium text-gray-900">No pending approvals</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Critical Compliance Violations Widget */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Critical Compliance Violations</h3>
              <p className="mb-4 text-3xl font-bold text-gray-900">5</p>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="font-medium text-gray-900">• ABC Pharma</p>
                  <p className="text-gray-600">Critical • 2 SKUs</p>
                  <p className="text-gray-600">Legal: DMP Art.15</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">• XYZ Corp</p>
                  <p className="text-gray-600">5 SKUs</p>
                  <p className="text-gray-600">Legal: DMP Art.12</p>
                </div>
              </div>
              <Link
                href="/compliance/violations"
                className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Regulatory Compliance Metrics Widget */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Regulatory Compliance Metrics</h3>
            {metricsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 w-full animate-pulse rounded bg-gray-200" />
                ))}
              </div>
            ) : complianceMetrics ? (
              <>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Legal Basis Compliance</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {complianceMetrics.legalBasisCompliance}% ({complianceMetrics.legalBasisWithBasis}/{complianceMetrics.legalBasisTotal} actions)
                      </span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-green-600"
                        style={{ width: `${complianceMetrics.legalBasisCompliance}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Deadline Compliance</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {complianceMetrics.deadlineCompliance}% ({complianceMetrics.deadlineOnTime}/{complianceMetrics.deadlineTotal} actions)
                      </span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-blue-600"
                        style={{ width: `${complianceMetrics.deadlineCompliance}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Regulatory Requirements</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {complianceMetrics.regulatoryRequirements}% ({complianceMetrics.requirementsMet}/{complianceMetrics.requirementsTotal} actions)
                      </span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-purple-600"
                        style={{ width: `${complianceMetrics.regulatoryRequirements}%` }}
                      />
                    </div>
                  </div>
                </div>
                <Link
                  href="/compliance/details"
                  className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  View Compliance Details <ExternalLink className="ml-1 h-4 w-4" />
                </Link>
              </>
            ) : (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
                <p className="text-sm text-gray-600">Unable to load compliance metrics</p>
              </div>
            )}
          </div>

          {/* Module Activation Regulatory Validation Widget */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Module Activation Status</h3>
            {moduleLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-24 w-full animate-pulse rounded-lg bg-gray-200" />
                ))}
              </div>
            ) : moduleStatus ? (
              <>
                <div className="space-y-4">
                  {/* ECS Module */}
                  {moduleStatus.ecs && (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">ECS:</span>
                          {moduleStatus.ecs.status === 'on' ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-gray-400" />
                          )}
                          <span className={moduleStatus.ecs.status === 'on' ? 'text-green-700' : 'text-gray-600'}>
                            {moduleStatus.ecs.status === 'on' ? 'ON' : 'OFF'}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 space-y-1 text-sm text-gray-700">
                        <p>
                          <span className="font-medium">Regulatory:</span>{' '}
                          {moduleStatus.ecs.regulatory === 'authorized' ? (
                            <span className="text-green-700">✓ Authorized</span>
                          ) : (
                            <span className="text-yellow-600">⚠️ Verify</span>
                          )}
                        </p>
                        {moduleStatus.ecs.auth && (
                          <p>
                            <span className="font-medium">Auth:</span> {moduleStatus.ecs.auth}
                          </p>
                        )}
                        <p className="text-xs text-gray-600">
                          Prerequisites: {moduleStatus.ecs.prerequisitesMet ? '✓ Met' : '⚠️ In Progress'} | Stakeholder Notification: {moduleStatus.ecs.stakeholderNotified ? '✓ Sent' : '⚠️ Pending'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* CMC Module */}
                  {moduleStatus.cmc && (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">CMC:</span>
                          {moduleStatus.cmc.status === 'on' ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-gray-400" />
                          )}
                          <span className={moduleStatus.cmc.status === 'on' ? 'text-green-700' : 'text-gray-600'}>
                            {moduleStatus.cmc.status === 'on' ? 'ON' : 'OFF'}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 space-y-1 text-sm text-gray-700">
                        <p>
                          <span className="font-medium">Regulatory:</span>{' '}
                          {moduleStatus.cmc.regulatory === 'authorized' ? (
                            <span className="text-green-700">✓ Authorized</span>
                          ) : (
                            <span className="text-yellow-600">⚠️ Verify</span>
                          )}
                        </p>
                        {moduleStatus.cmc.auth && (
                          <p>
                            <span className="font-medium">Auth:</span> {moduleStatus.cmc.auth}
                          </p>
                        )}
                        <p className="text-xs text-gray-600">
                          Prerequisites: {moduleStatus.cmc.prerequisitesMet ? '✓ Met' : '⚠️ In Progress'} | Stakeholder Notification: {moduleStatus.cmc.stakeholderNotified ? '✓ Sent' : '⚠️ Pending'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <Link
                  href="/modules/config"
                  className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  View Config <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </>
            ) : (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
                <p className="text-sm text-gray-600">Unable to load module status</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Other tabs placeholder */}
      {activeTab !== 'overview' && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-gray-600">Tab content for {activeTab} - to be implemented per wireframe specifications</p>
        </div>
      )}
    </div>
  )
}
