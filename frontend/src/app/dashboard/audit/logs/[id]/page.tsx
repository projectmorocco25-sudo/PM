'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RoleGuard } from '@/components/guards/role-guard'
import { DetailPage, DetailField, DetailGrid } from '@/components/ui/detail-page'
import { format } from 'date-fns'
import { ArrowLeft, FileText, Clock, User, Globe, Database, GitCompare } from 'lucide-react'

// Task 1.1.5.40: /audit/logs/[id] route

export default function AuditLogDetailPage() {
  const params = useParams()
  const router = useRouter()
  const logId = params.id as string

  // Mock data - would be fetched from API
  const log = {
    id: logId,
    table_name: 'companies',
    record_id: 'company-123',
    action: 'UPDATE',
    old_data: {
      name: 'Old Company Name',
      contact_email: 'old@example.com',
      is_active: true,
    },
    new_data: {
      name: 'New Company Name',
      contact_email: 'new@example.com',
      is_active: true,
    },
    changed_by: 'user-123',
    changed_by_name: 'Dr. Fatima El Alaoui',
    changed_by_role: 'tier1',
    changed_at: new Date().toISOString(),
    ip_address: '192.168.1.100',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  }

  const changedFields = Object.keys(log.new_data || {}).filter(
    (key) => JSON.stringify(log.old_data?.[key as keyof typeof log.old_data]) !== 
             JSON.stringify(log.new_data[key as keyof typeof log.new_data])
  )

  return (
    <RoleGuard allowedRoles={['tier1', 'tier2_officer', 'tier2_registrar', 'auditor']}>
      <DetailPage
        title={`Audit Log: ${log.id}`}
        subtitle={log.table_name}
        status={
          <Badge variant={log.action === 'INSERT' ? 'default' : log.action === 'DELETE' ? 'destructive' : 'secondary'}>
            {log.action}
          </Badge>
        }
        onBack={() => router.push('/dashboard/audit/logs')}
        backLabel="Back to Audit Logs"
      >
        <div className="space-y-6">
          {/* Log Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Log Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DetailGrid columns={2}>
                <DetailField
                  label="Timestamp"
                  value={
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {format(new Date(log.changed_at), 'PPP p')}
                    </div>
                  }
                />
                <DetailField
                  label="Action"
                  value={
                    <Badge variant={log.action === 'INSERT' ? 'default' : log.action === 'DELETE' ? 'destructive' : 'secondary'}>
                      {log.action}
                    </Badge>
                  }
                />
                <DetailField
                  label="Table"
                  value={
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono">{log.table_name}</span>
                    </div>
                  }
                />
                <DetailField
                  label="Record ID"
                  value={<span className="font-mono">{log.record_id}</span>}
                />
              </DetailGrid>
            </CardContent>
          </Card>

          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DetailGrid columns={2}>
                <DetailField label="User" value={log.changed_by_name} />
                <DetailField
                  label="Role"
                  value={
                    <Badge variant="outline">{log.changed_by_role.replace('_', ' ')}</Badge>
                  }
                />
                <DetailField
                  label="IP Address"
                  value={
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono">{log.ip_address}</span>
                    </div>
                  }
                />
                <DetailField
                  label="User Agent"
                  value={
                    <span className="text-xs text-muted-foreground truncate block max-w-[300px]">
                      {log.user_agent}
                    </span>
                  }
                />
              </DetailGrid>
            </CardContent>
          </Card>

          {/* Data Changes */}
          {log.action === 'UPDATE' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitCompare className="h-5 w-5" />
                  Data Changes
                </CardTitle>
                <CardDescription>
                  {changedFields.length} field(s) modified
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-2 text-left text-sm font-medium">Field</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Old Value</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">New Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(log.new_data).map((key) => {
                        const oldValue = log.old_data?.[key as keyof typeof log.old_data]
                        const newValue = log.new_data[key as keyof typeof log.new_data]
                        const changed = JSON.stringify(oldValue) !== JSON.stringify(newValue)

                        return (
                          <tr key={key} className={changed ? 'bg-yellow-50' : ''}>
                            <td className="px-4 py-2 text-sm font-medium">{key}</td>
                            <td className="px-4 py-2 text-sm">
                              {changed ? (
                                <span className="text-red-600 line-through">
                                  {String(oldValue)}
                                </span>
                              ) : (
                                String(oldValue)
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              {changed ? (
                                <span className="text-green-600">{String(newValue)}</span>
                              ) : (
                                String(newValue)
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Raw Data */}
          <Card>
            <CardHeader>
              <CardTitle>Raw Data</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs overflow-auto max-h-60 p-4 bg-muted rounded-md">
                {JSON.stringify({ old_data: log.old_data, new_data: log.new_data }, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      </DetailPage>
    </RoleGuard>
  )
}
