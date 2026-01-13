'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { DetailPage, DetailField, DetailGrid } from '@/components/ui/detail-page'
import { SimpleHistoryTab } from '@/components/history/history-tab'
import { format } from 'date-fns'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Building2,
  AlertCircle,
} from 'lucide-react'

// Task 1.1.5.32: Compliance Score detail page with History tab

// Placeholder types - would come from hooks when CMC module is implemented
interface ComplianceScore {
  id: string
  company_id: string
  company_name: string
  overall_score: number
  calculation_date: string
  components: {
    name: string
    score: number
    weight: number
    weighted_score: number
  }[]
  trend?: 'up' | 'down' | 'stable'
  previous_score?: number
}

export default function ComplianceScoreDetailPage() {
  const params = useParams()
  const router = useRouter()
  const scoreId = params.id as string

  // Placeholder - would use actual hook when CMC module is implemented
  const isLoading = false
  const score: ComplianceScore | null = null

  const getTrendIcon = (trend?: string) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-muted-foreground" />
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreVariant = (score: number): 'default' | 'secondary' | 'destructive' => {
    if (score >= 80) return 'default'
    if (score >= 60) return 'secondary'
    return 'destructive'
  }

  return (
    <DetailPage
      title={score ? `Compliance Score: ${score.company_name}` : 'Compliance Score'}
      subtitle={score?.calculation_date ? format(new Date(score.calculation_date), 'PPP') : undefined}
      status={
        score && (
          <Badge variant={getScoreVariant(score.overall_score)}>
            Score: {score.overall_score.toFixed(1)}%
          </Badge>
        )
      }
      onBack={() => router.push('/dashboard/cmc/scores')}
      backLabel="Back to Scores"
      loading={isLoading}
    >
      <div className="space-y-6">
        {score ? (
          <>
            {/* Overall Score Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Overall Compliance Score
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-5xl font-bold ${getScoreColor(score.overall_score)}`}>
                      {score.overall_score.toFixed(1)}%
                    </div>
                    {score.previous_score && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        {getTrendIcon(score.trend)}
                        Previous: {score.previous_score.toFixed(1)}%
                        {score.trend === 'up' && (
                          <span className="text-green-600">
                            +{(score.overall_score - score.previous_score).toFixed(1)}%
                          </span>
                        )}
                        {score.trend === 'down' && (
                          <span className="text-red-600">
                            {(score.overall_score - score.previous_score).toFixed(1)}%
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <Progress value={score.overall_score} className="w-1/2 h-4" />
                </div>
              </CardContent>
            </Card>

            {/* Score Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Score Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DetailGrid columns={2}>
                  <DetailField label="Company" value={score.company_name} />
                  <DetailField
                    label="Calculation Date"
                    value={
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {format(new Date(score.calculation_date), 'PPP')}
                      </div>
                    }
                  />
                </DetailGrid>
              </CardContent>
            </Card>

            {/* Component Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Score Components</CardTitle>
                <CardDescription>Breakdown of compliance score by component</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {score.components.map((component, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{component.name}</div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">
                            Weight: {(component.weight * 100).toFixed(0)}%
                          </span>
                          <Badge variant={getScoreVariant(component.score)}>
                            {component.score.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={component.score} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        Weighted contribution: {component.weighted_score.toFixed(2)}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Score Not Found</h3>
              <p className="text-muted-foreground">
                The compliance score you&apos;re looking for does not exist or hasn&apos;t been calculated yet.
              </p>
            </CardContent>
          </Card>
        )}

        {/* History Tab - Task 1.1.5.32 */}
        <SimpleHistoryTab
          entityType="compliance_score"
          entityId={scoreId}
          entityName={score?.company_name ? `${score.company_name} Compliance Score` : undefined}
        />
      </div>
    </DetailPage>
  )
}
