'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import type { SubmissionCompliance } from '@/hooks/use-dashboard-data'
import Link from 'next/link'

interface SCGaugeProps {
  compliance: SubmissionCompliance
  isCollapsed?: boolean
}

export function SCGauge({ compliance, isCollapsed: initialCollapsed = false }: SCGaugeProps) {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed)

  const getStatusColor = () => {
    if (compliance.percentage >= compliance.threshold) return 'text-green-500'
    if (compliance.percentage >= compliance.threshold - 10) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getGaugeColor = () => {
    if (compliance.percentage >= compliance.threshold) return 'bg-green-500'
    if (compliance.percentage >= compliance.threshold - 10) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  if (isCollapsed && !compliance.isEmergency) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-3">
          <div className="flex items-center gap-4">
            <CardTitle className="text-base">Submission Compliance (%SC)</CardTitle>
            <span className={`font-bold ${getStatusColor()}`}>
              {compliance.percentage}%
            </span>
            <span className="text-sm text-muted-foreground">
              🟢 Above Threshold ({compliance.threshold}%)
            </span>
            <span className="text-sm text-green-600">
              ✅ All Actions Taken: {compliance.onTime} on-time, {compliance.late} late
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsCollapsed(false)}
          >
            <ChevronDown className="h-4 w-4" />
            Expand
          </Button>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          Submission Compliance (%SC) - {compliance.isEmergency ? 'PRIORITY' : 'Status'}
        </CardTitle>
        {!compliance.isEmergency && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsCollapsed(true)}
          >
            <ChevronUp className="h-4 w-4" />
            Collapse
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-8">
          {/* Gauge */}
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-muted"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  strokeDasharray={`${(compliance.percentage / 100) * 352} 352`}
                  strokeLinecap="round"
                  className={getStatusColor()}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold ${getStatusColor()}`}>
                  {compliance.percentage}%
                </span>
                <span className="text-xs text-muted-foreground">%SC</span>
              </div>
            </div>
            <div className={`mt-2 text-sm font-medium ${getStatusColor()}`}>
              {compliance.isEmergency ? '🔴 Below Threshold' : '🟢 Above Threshold'}
            </div>
          </div>

          {/* Breakdown */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm">
                On-Time: {Math.round((compliance.onTime / compliance.total) * 100)}% ({compliance.onTime} companies)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-sm">
                Late: {Math.round((compliance.late / compliance.total) * 100)}% ({compliance.late} companies)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm">
                Unsubmitted: {Math.round((compliance.unsubmitted / compliance.total) * 100)}% ({compliance.unsubmitted} companies)
              </span>
            </div>
          </div>
        </div>

        {compliance.unsubmitted > 0 && (
          <div className="mt-4">
            <Link 
              href="/dashboard/vci/submissions?filter=unsubmitted"
              className="text-sm text-primary hover:underline"
            >
              View Unsubmitted Companies →
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
