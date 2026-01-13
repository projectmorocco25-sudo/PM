'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RoleGuard } from '@/components/guards/role-guard'
import { VirtualTable } from '@/components/history/virtual-list'
import { DateRangePicker, DateRange } from '@/components/history/date-range-picker'
import { ExportButton } from '@/components/history/export-button'
import { format } from 'date-fns'
import { Search, FileText, Filter, RefreshCw } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Task 1.1.5.39: /audit/logs route

interface AuditLogEntry {
  id: string
  table_name: string
  record_id: string
  action: string
  changed_by_name: string
  changed_by_role: string
  changed_at: string
  ip_address: string
}

// Mock data
const MOCK_LOGS: AuditLogEntry[] = Array.from({ length: 100 }, (_, i) => ({
  id: `log-${i}`,
  table_name: ['companies', 'products', 'skus', 'aams_submissions', 'msq_submissions'][i % 5],
  record_id: `record-${i}`,
  action: ['INSERT', 'UPDATE', 'DELETE'][i % 3],
  changed_by_name: ['Dr. Fatima', 'Ahmed', 'Khadija', 'Youssef'][i % 4],
  changed_by_role: ['tier1', 'tier2_officer', 'company_admin'][i % 3],
  changed_at: new Date(Date.now() - i * 3600000).toISOString(),
  ip_address: `192.168.1.${100 + (i % 50)}`,
}))

export default function AuditLogsPage() {
  const router = useRouter()
  const [search, setSearch] = React.useState('')
  const [dateRange, setDateRange] = React.useState<DateRange>({ from: undefined, to: undefined })
  const [tableFilter, setTableFilter] = React.useState<string>('all')
  const [actionFilter, setActionFilter] = React.useState<string>('all')

  const filteredLogs = React.useMemo(() => {
    return MOCK_LOGS.filter((log) => {
      if (search && !log.table_name.includes(search) && !log.changed_by_name.toLowerCase().includes(search.toLowerCase())) {
        return false
      }
      if (tableFilter !== 'all' && log.table_name !== tableFilter) return false
      if (actionFilter !== 'all' && log.action !== actionFilter) return false
      return true
    })
  }, [search, tableFilter, actionFilter])

  const columns = [
    {
      key: 'changed_at',
      header: 'Timestamp',
      width: 180,
      render: (value: unknown) => format(new Date(String(value)), 'MMM d, yyyy HH:mm:ss'),
    },
    {
      key: 'action',
      header: 'Action',
      width: 100,
      render: (value: unknown) => {
        const action = String(value)
        const variant = action === 'INSERT' ? 'default' : action === 'DELETE' ? 'destructive' : 'secondary'
        return <Badge variant={variant}>{action}</Badge>
      },
    },
    {
      key: 'table_name',
      header: 'Table',
      width: 150,
      render: (value: unknown) => (
        <span className="font-mono text-sm">{String(value)}</span>
      ),
    },
    {
      key: 'changed_by_name',
      header: 'User',
      width: 150,
    },
    {
      key: 'changed_by_role',
      header: 'Role',
      width: 120,
      render: (value: unknown) => (
        <Badge variant="outline">{String(value).replace('_', ' ')}</Badge>
      ),
    },
    {
      key: 'ip_address',
      header: 'IP Address',
      width: 130,
      render: (value: unknown) => <span className="font-mono text-sm">{String(value)}</span>,
    },
  ]

  const handleExport = async () => {
    const csv = filteredLogs.map((log) => 
      `${log.changed_at},${log.action},${log.table_name},${log.changed_by_name},${log.ip_address}`
    ).join('\n')
    return new Blob([csv], { type: 'text/csv' })
  }

  return (
    <RoleGuard allowedRoles={['tier1', 'tier2_officer', 'tier2_registrar', 'auditor']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Audit Logs
            </h1>
            <p className="text-muted-foreground">
              System-wide audit trail and activity monitoring
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ExportButton onExport={handleExport} formats={['csv', 'excel']} />
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <DateRangePicker value={dateRange} onChange={setDateRange} />
              <Select value={tableFilter} onValueChange={setTableFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Table" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tables</SelectItem>
                  <SelectItem value="companies">Companies</SelectItem>
                  <SelectItem value="products">Products</SelectItem>
                  <SelectItem value="skus">SKUs</SelectItem>
                  <SelectItem value="aams_submissions">AAMS</SelectItem>
                  <SelectItem value="msq_submissions">MSQ</SelectItem>
                </SelectContent>
              </Select>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="INSERT">Insert</SelectItem>
                  <SelectItem value="UPDATE">Update</SelectItem>
                  <SelectItem value="DELETE">Delete</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Logs Table with Virtual Scrolling */}
        <VirtualTable
          items={filteredLogs}
          columns={columns}
          height={500}
          rowHeight={48}
          onRowClick={(log) => router.push(`/dashboard/audit/logs/${log.id}`)}
          emptyMessage="No audit logs found"
        />
      </div>
    </RoleGuard>
  )
}
