'use client'

import * as React from 'react'
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
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { cn } from '@/lib/utils'

// Task 1.1.5.20e: Stock sufficiency charts

const COLORS = ['#22c55e', '#eab308', '#ef4444', '#3b82f6', '#8b5cf6']

interface StockLevelData {
  date: string
  stock: number
  threshold: number
}

interface StockSufficiencyChartProps {
  data: StockLevelData[]
  className?: string
}

export function StockSufficiencyLineChart({ data, className }: StockSufficiencyChartProps) {
  return (
    <div className={cn('w-full h-[300px]', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="date"
            className="text-xs"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis
            className="text-xs"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              borderColor: 'hsl(var(--border))',
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="stock"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            name="Stock Level"
          />
          <Line
            type="monotone"
            dataKey="threshold"
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Threshold"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

interface BreachDistributionData {
  name: string
  value: number
}

interface BreachDistributionChartProps {
  data: BreachDistributionData[]
  className?: string
}

export function BreachDistributionChart({ data, className }: BreachDistributionChartProps) {
  return (
    <div className={cn('w-full h-[300px]', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

interface CompanyComplianceData {
  company: string
  compliant: number
  breaches: number
}

interface CompanyComplianceChartProps {
  data: CompanyComplianceData[]
  className?: string
}

export function CompanyComplianceBarChart({ data, className }: CompanyComplianceChartProps) {
  return (
    <div className={cn('w-full h-[300px]', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="company"
            className="text-xs"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis
            className="text-xs"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              borderColor: 'hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Bar dataKey="compliant" name="Compliant SKUs" fill="#22c55e" />
          <Bar dataKey="breaches" name="Breaches" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

interface WeeklyTrendData {
  week: string
  submissions: number
  breaches: number
  resolved: number
}

interface WeeklyTrendChartProps {
  data: WeeklyTrendData[]
  className?: string
}

export function WeeklyTrendChart({ data, className }: WeeklyTrendChartProps) {
  return (
    <div className={cn('w-full h-[300px]', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="week"
            className="text-xs"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis
            className="text-xs"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              borderColor: 'hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="submissions"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Submissions"
          />
          <Line
            type="monotone"
            dataKey="breaches"
            stroke="#ef4444"
            strokeWidth={2}
            name="Breaches"
          />
          <Line
            type="monotone"
            dataKey="resolved"
            stroke="#22c55e"
            strokeWidth={2}
            name="Resolved"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
