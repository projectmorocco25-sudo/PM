'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Threshold } from '@/hooks/use-vci'
import { cn } from '@/lib/utils'
import { TrendingUp, AlertTriangle, CheckCircle2, Clock } from 'lucide-react'

// Task 1.1.3.14a: ThresholdDisplay component

interface ThresholdDisplayProps {
  thresholds: Threshold[]
  showDetails?: boolean
  className?: string
}

export function ThresholdDisplay({ thresholds, showDetails = true, className }: ThresholdDisplayProps) {
  if (thresholds.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="py-8 text-center text-muted-foreground">
          No thresholds calculated yet
        </CardContent>
      </Card>
    )
  }

  const totalThresholdValue = thresholds.reduce((sum, t) => sum + t.threshold_value, 0)
  const totalAAMS = thresholds.reduce((sum, t) => sum + t.aams_value, 0)
  const avgMultiplier = thresholds.reduce((sum, t) => sum + t.multiplier_b, 0) / thresholds.length

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Calculated Thresholds
        </CardTitle>
        <CardDescription>
          Based on submitted AAMS values with B multiplier
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground">Total AAMS</div>
            <div className="text-2xl font-bold">{totalAAMS.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Monthly average</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground">Total Threshold</div>
            <div className="text-2xl font-bold">{totalThresholdValue.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">B × AAMS</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground">Avg Multiplier</div>
            <div className="text-2xl font-bold">{avgMultiplier.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">
              {avgMultiplier > 3.0 ? 'Includes critical medicines' : 'Standard products'}
            </div>
          </div>
        </div>

        {/* Detail Table */}
        {showDetails && (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">AAMS</TableHead>
                  <TableHead className="text-right">B</TableHead>
                  <TableHead className="text-right">Threshold</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {thresholds.map((threshold) => (
                  <TableRow key={threshold.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{threshold.sku_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {threshold.dosage_strength} • {threshold.dosage_form}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {threshold.aams_value.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={threshold.multiplier_b > 3.0 ? 'default' : 'secondary'}>
                        ×{threshold.multiplier_b}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium">
                      {threshold.threshold_value.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {threshold.is_current ? (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <Clock className="h-3 w-3" />
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Compact threshold badge for lists
interface ThresholdBadgeProps {
  threshold: Threshold
  className?: string
}

export function ThresholdBadge({ threshold, className }: ThresholdBadgeProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="font-mono text-sm">{threshold.threshold_value.toLocaleString()}</span>
      <Badge variant="outline" className="text-xs">
        ×{threshold.multiplier_b}
      </Badge>
      {threshold.is_current && (
        <Badge variant="default" className="text-xs">Active</Badge>
      )}
    </div>
  )
}
