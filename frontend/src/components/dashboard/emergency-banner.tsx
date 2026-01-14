'use client'

import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { SubmissionCompliance } from '@/hooks/use-dashboard-data'

interface EmergencyBannerProps {
  compliance: SubmissionCompliance
  onScheduleMeeting: () => void
}

export function EmergencyBanner({ compliance, onScheduleMeeting }: EmergencyBannerProps) {
  if (!compliance.isEmergency) return null

  return (
    <div className="bg-red-600 text-white rounded-lg p-4 mb-6">
      <div className="flex items-start gap-4">
        <AlertTriangle className="h-6 w-6 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-lg font-bold">
            🚨 EMERGENCY: Submission Compliance Below Threshold
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <div>
              <span className="font-bold">%SC: {compliance.percentage}%</span>
            </div>
            <div>
              Threshold: {compliance.threshold}%
            </div>
            <div className="flex items-center gap-1">
              Status: <span className="inline-block w-3 h-3 rounded-full bg-red-300 animate-pulse" /> CRITICAL
            </div>
          </div>
          <p className="mt-2 text-red-100 text-sm">
            ⚠️ Data cannot be used for governance analysis until submission compliance improves.
          </p>
        </div>
        <Button 
          variant="secondary" 
          onClick={onScheduleMeeting}
          className="flex-shrink-0"
        >
          Schedule Emergency Meeting
        </Button>
      </div>
    </div>
  )
}
