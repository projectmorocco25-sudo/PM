'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable, Column } from '@/components/ui/data-table'
import { RoleGuard } from '@/components/guards/role-guard'
import { YearFilter } from '@/components/filters/year-filter'
import { ExportButton } from '@/components/history/export-button'
import { format } from 'date-fns'
import { BarChart3, TrendingUp, TrendingDown, Minus, Building2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Task 1.1.5.37: Compliance Scores list page with year filter

interface ComplianceScore {
  id: string
  company_id: string
  company_name: string
  year: number
  score: number
  grade: string
  trend: 'up' | 'down' | 'stable'
  calculated_at: string
}

// Mock data
const MOCK_SCORES: ComplianceScore[] = Array.from({ length: 30 }, (_, i) => ({
  id: `score-${i}`,
  company_id: `company-${i % 10}`,
  company_name: ['Pharma Industries', 'MedLab Morocco', 'PharmaDist', 'MedSupply', 'BioMed'][i % 5],
  year: 2025 - (i % 3),
  score: 70 + Math.floor(Math.random() * 30),
  grade: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
  trend: (['up', 'down', 'stable'] as const)[i % 3],
  calculated_at: new Date(Date.now() - i * 86400000 * 30).toISOString(),
}))

const GRADE_COLORS: Record<string, string> = {
  A: 'bg-green-100 text-green-700 border-green-200',
  B: 'bg-blue-100 text-blue-700 border-blue-200',
  C: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  D: 'bg-red-100 text-red-700 border-red-200',
}

export default function ComplianceScoresPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentYear = new Date().getFullYear()

  // Task 1.1.5.37: Read year from URL query params
  const yearParam = searchParams.get('year')
  const [selectedYear, setSelectedYear] = React.useState(yearParam ? parseInt(yearParam) : currentYear)
  const [gradeFilter, setGradeFilter] = React.useState<string>('all')

  // Sync URL params when filter changes
  React.useEffect(() => {
    const params = new URLSearchParams()
    if (selectedYear !== currentYear) {
      params.set('year', selectedYear.toString())
    }
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname
    window.history.replaceState({}, '', newUrl)
  }, [selectedYear, currentYear])

  const filteredScores = React.useMemo(() => {
    return MOCK_SCORES.filter((score) => {
      if (score.year !== selectedYear) return false
      if (gradeFilter !== 'all' && score.grade !== gradeFilter) return false
      return true
    })
  }, [selectedYear, gradeFilter])

  const columns: Column<ComplianceScore>[] = [
    {
      key: 'company_name',
      header: 'Company',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.company_name}</span>
        </div>
      ),
    },
    {
      key: 'score',
      header: 'Score',
      render: (value) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-lg font-bold">{value}</span>
          <span className="text-sm text-muted-foreground">/ 100</span>
        </div>
      ),
    },
    {
      key: 'grade',
      header: 'Grade',
      render: (value) => (
        <Badge className={GRADE_COLORS[String(value)] || GRADE_COLORS.D}>
          {value}
        </Badge>
      ),
    },
    {
      key: 'trend',
      header: 'Trend',
      render: (value) => {
        const trend = String(value)
        const Icon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
        const color = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-muted-foreground'
        return (
          <div className={`flex items-center gap-1 ${color}`}>
            <Icon className="h-4 w-4" />
            <span className="capitalize">{trend}</span>
          </div>
        )
      },
    },
    {
      key: 'calculated_at',
      header: 'Calculated',
      render: (value) => format(new Date(String(value)), 'MMM d, yyyy'),
    },
  ]

  const handleExport = async () => {
    const csv = filteredScores.map((s) =>
      `${s.company_name},${s.year},${s.score},${s.grade},${s.trend}`
    ).join('\n')
    return new Blob([csv], { type: 'text/csv' })
  }

  // Summary stats
  const avgScore = filteredScores.length
    ? Math.round(filteredScores.reduce((acc, s) => acc + s.score, 0) / filteredScores.length)
    : 0
  const gradeDistribution = filteredScores.reduce((acc, s) => {
    acc[s.grade] = (acc[s.grade] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <RoleGuard allowedRoles={['tier1', 'tier2_officer', 'tier2_registrar']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              Compliance Scores
            </h1>
            <p className="text-muted-foreground">
              Company compliance monitoring and grading
            </p>
          </div>
          <ExportButton onExport={handleExport} formats={['csv', 'excel', 'pdf']} />
        </div>

        {/* Filters with quick year chips (Task 1.1.5.37) */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex gap-1">
                {[currentYear, currentYear - 1, currentYear - 2].map((year) => (
                  <Badge
                    key={year}
                    variant={selectedYear === year ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedYear(year)}
                  >
                    {year}
                  </Badge>
                ))}
              </div>

              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="All Grades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  <SelectItem value="A">Grade A</SelectItem>
                  <SelectItem value="B">Grade B</SelectItem>
                  <SelectItem value="C">Grade C</SelectItem>
                  <SelectItem value="D">Grade D</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Companies</div>
              <div className="text-2xl font-bold">{filteredScores.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Avg Score</div>
              <div className="text-2xl font-bold">{avgScore}</div>
            </CardContent>
          </Card>
          {Object.entries(gradeDistribution).slice(0, 2).map(([grade, count]) => (
            <Card key={grade}>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">Grade {grade}</div>
                <div className="text-2xl font-bold">{count}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={filteredScores}
          onRowClick={(score) => router.push(`/dashboard/cmc/scores/${score.id}`)}
          emptyMessage="No compliance scores found for this year"
        />
      </div>
    </RoleGuard>
  )
}
