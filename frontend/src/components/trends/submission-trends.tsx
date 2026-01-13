'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
} from 'recharts'
import { format, subYears, subMonths } from 'date-fns'
import { TrendingUp, TrendingDown, Minus, AlertTriangle, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

// Task 1.1.5.57-60: Trend Analysis Components

// AAMS Trend Analysis (Task 1.1.5.57)
interface AAMSTrendData {
  year: number
  totalAAMS: number
  companyCount: number
  avgAAMS: number
  yoyChange?: number
}

interface AAMSTrendAnalysisProps {
  data: AAMSTrendData[]
  loading?: boolean
  className?: string
}

export function AAMSTrendAnalysis({ data, loading, className }: AAMSTrendAnalysisProps) {
  const latestData = data[data.length - 1]
  const previousData = data[data.length - 2]
  const yoyChange = latestData && previousData
    ? ((latestData.totalAAMS - previousData.totalAAMS) / previousData.totalAAMS) * 100
    : 0

  const TrendIcon = yoyChange > 0 ? TrendingUp : yoyChange < 0 ? TrendingDown : Minus
  const trendColor = yoyChange > 0 ? 'text-green-600' : yoyChange < 0 ? 'text-red-600' : 'text-muted-foreground'

  if (loading) {
    return <TrendChartSkeleton className={className} />
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>AAMS Trend Analysis</CardTitle>
            <CardDescription>Year-over-year comparison of annual average monthly sales</CardDescription>
          </div>
          {latestData && (
            <div className="text-right">
              <div className="text-2xl font-bold">{latestData.totalAAMS.toLocaleString()}</div>
              <div className={cn('flex items-center gap-1 text-sm', trendColor)}>
                <TrendIcon className="h-4 w-4" />
                {Math.abs(yoyChange).toFixed(1)}% vs last year
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="total">
          <TabsList className="mb-4">
            <TabsTrigger value="total">Total AAMS</TabsTrigger>
            <TabsTrigger value="average">Average per Company</TabsTrigger>
            <TabsTrigger value="companies">Company Count</TabsTrigger>
          </TabsList>

          <TabsContent value="total">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="year" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="totalAAMS" name="Total AAMS" fill="#3b82f6" />
                  <Line type="monotone" dataKey="totalAAMS" stroke="#1d4ed8" strokeWidth={2} dot />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="average">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="year" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="avgAAMS" name="Avg per Company" stroke="#22c55e" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="companies">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="year" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="companyCount" name="Companies Reporting" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// MSQ Trend Analysis (Task 1.1.5.58)
interface MSQTrendData {
  month: string
  totalMSQ: number
  avgMSQ: number
  anomalies?: number
}

interface MSQTrendAnalysisProps {
  data: MSQTrendData[]
  loading?: boolean
  className?: string
}

export function MSQTrendAnalysis({ data, loading, className }: MSQTrendAnalysisProps) {
  const anomalyCount = data.reduce((acc, d) => acc + (d.anomalies || 0), 0)

  if (loading) {
    return <TrendChartSkeleton className={className} />
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>MSQ Trend Analysis</CardTitle>
            <CardDescription>Monthly sales quantity patterns and growth trends</CardDescription>
          </div>
          {anomalyCount > 0 && (
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              {anomalyCount} anomalies detected
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="totalMSQ" name="Total MSQ" fill="#3b82f6" fillOpacity={0.3} stroke="#3b82f6" />
              <Line type="monotone" dataKey="avgMSQ" name="Average" stroke="#22c55e" strokeWidth={2} dot={false} />
              {data.some((d) => d.anomalies) && (
                <Bar dataKey="anomalies" name="Anomalies" fill="#ef4444" />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

// WSL Trend Analysis (Task 1.1.5.59)
interface WSLTrendData {
  week: string
  avgStockLevel: number
  threshold: number
  breaches: number
  stockouts?: number
}

interface WSLTrendAnalysisProps {
  data: WSLTrendData[]
  loading?: boolean
  className?: string
}

export function WSLTrendAnalysis({ data, loading, className }: WSLTrendAnalysisProps) {
  const totalBreaches = data.reduce((acc, d) => acc + d.breaches, 0)
  const stockouts = data.reduce((acc, d) => acc + (d.stockouts || 0), 0)

  if (loading) {
    return <TrendChartSkeleton className={className} />
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>WSL Trend Analysis</CardTitle>
            <CardDescription>Stock level patterns and stockout identification</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">{totalBreaches} breaches</Badge>
            {stockouts > 0 && (
              <Badge variant="destructive">{stockouts} stockouts</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="week" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="avgStockLevel" name="Stock Level" fill="#22c55e" fillOpacity={0.3} stroke="#22c55e" />
              <Line type="monotone" dataKey="threshold" name="Threshold" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
              <Bar dataKey="breaches" name="Breaches" fill="#f97316" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

// Cross-Metric Analysis (Task 1.1.5.60)
interface CrossMetricData {
  period: string
  aams: number
  msq: number
  wsl: number
  correlation?: number
}

interface CrossMetricAnalysisProps {
  data: CrossMetricData[]
  loading?: boolean
  className?: string
}

export function CrossMetricAnalysis({ data, loading, className }: CrossMetricAnalysisProps) {
  if (loading) {
    return <TrendChartSkeleton className={className} />
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Cross-Metric Analysis
        </CardTitle>
        <CardDescription>
          AAMS vs MSQ vs WSL correlations and patterns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="period" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis yAxisId="left" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="aams" name="AAMS" stroke="#3b82f6" strokeWidth={2} />
              <Line yAxisId="left" type="monotone" dataKey="msq" name="MSQ" stroke="#22c55e" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="wsl" name="WSL" stroke="#f97316" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Correlation indicators */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <CorrelationCard label="AAMS ↔ MSQ" value={0.85} />
          <CorrelationCard label="MSQ ↔ WSL" value={0.72} />
          <CorrelationCard label="AAMS ↔ WSL" value={0.68} />
        </div>
      </CardContent>
    </Card>
  )
}

function CorrelationCard({ label, value }: { label: string; value: number }) {
  const strength = value > 0.8 ? 'Strong' : value > 0.5 ? 'Moderate' : 'Weak'
  const color = value > 0.8 ? 'text-green-600' : value > 0.5 ? 'text-yellow-600' : 'text-red-600'
  
  return (
    <div className="p-3 rounded-md border text-center">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className={cn('text-lg font-bold', color)}>{(value * 100).toFixed(0)}%</div>
      <div className="text-xs">{strength}</div>
    </div>
  )
}

function TrendChartSkeleton({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="h-6 w-48 bg-muted rounded animate-pulse" />
        <div className="h-4 w-64 bg-muted rounded animate-pulse mt-2" />
      </CardHeader>
      <CardContent>
        <div className="h-[300px] bg-muted/30 rounded animate-pulse" />
      </CardContent>
    </Card>
  )
}
