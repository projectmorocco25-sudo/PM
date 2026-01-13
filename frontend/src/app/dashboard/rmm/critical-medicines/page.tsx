'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DataTable, Column } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useCriticalMedicines,
  useSKUs,
  useCriticalMedicineMutations,
  CriticalMedicine,
  SKU,
} from '@/hooks/use-rmm'
import { useUserRole } from '@/hooks/use-user-role'
import { RoleGuard } from '@/components/guards/role-guard'
import { format } from 'date-fns'
import { Plus, AlertTriangle, Loader2 } from 'lucide-react'

// Task 1.1.2.30: Critical Medicines list page

export default function CriticalMedicinesPage() {
  const { role } = useUserRole()
  const isTier1 = role === 'tier1'
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [selectedSKU, setSelectedSKU] = React.useState<string>('')
  const [reason, setReason] = React.useState('')
  const [skuSearch, setSKUSearch] = React.useState('')

  const { data: criticalMedicinesData, isLoading: cmLoading } =
    useCriticalMedicines(true)
  const { data: skusData } = useSKUs({ search: skuSearch, limit: 50 })
  const { designateCriticalMedicine } = useCriticalMedicineMutations()

  const criticalMedicines = criticalMedicinesData?.critical_medicines || []
  const availableSKUs = (skusData?.skus || []).filter(
    (sku) =>
      !criticalMedicines.some((cm) => cm.sku_id === sku.id)
  )

  const columns: Column<CriticalMedicine>[] = [
    {
      key: 'sku_code',
      header: 'SKU Code',
      sortable: true,
      render: (_, row) => (
        <span className="font-mono">{row.sku_code}</span>
      ),
    },
    {
      key: 'sku_name',
      header: 'SKU Name',
      sortable: true,
    },
    {
      key: 'product_name',
      header: 'Product',
    },
    {
      key: 'company_name',
      header: 'Company',
    },
    {
      key: 'designation_date',
      header: 'Designated',
      render: (value) =>
        value ? format(new Date(String(value)), 'MMM d, yyyy') : '—',
    },
    {
      key: 'designated_by_name',
      header: 'By',
    },
    {
      key: 'reason',
      header: 'Reason',
      render: (value) => (
        <span className="max-w-[200px] truncate block">
          {String(value || '—')}
        </span>
      ),
    },
  ]

  const handleDesignate = async () => {
    if (!selectedSKU || !reason) return

    try {
      await designateCriticalMedicine.mutateAsync({
        sku_id: selectedSKU,
        reason,
      })
      setIsDialogOpen(false)
      setSelectedSKU('')
      setReason('')
    } catch (error) {
      // Error handled by mutation
    }
  }

  const mobileCardRender = (cm: CriticalMedicine) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm">{cm.sku_code}</span>
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          Critical
        </Badge>
      </div>
      <div className="font-medium">{cm.sku_name}</div>
      <div className="text-sm text-muted-foreground">
        {cm.product_name} • {cm.company_name}
      </div>
      <div className="text-xs text-muted-foreground">
        Designated {format(new Date(cm.designation_date), 'PPP')}
      </div>
    </div>
  )

  return (
    <RoleGuard allowedRoles={['tier1', 'tier2_officer', 'tier2_registrar']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Critical Medicines
            </h2>
            <p className="text-sm text-muted-foreground">
              SKUs designated as critical medicines for supply monitoring
            </p>
          </div>

          {isTier1 && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Designate Critical Medicine
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Designate Critical Medicine</DialogTitle>
                  <DialogDescription>
                    Select an SKU to designate as a critical medicine. This will
                    enable enhanced supply monitoring.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Select value={selectedSKU} onValueChange={setSelectedSKU}>
                      <SelectTrigger>
                        <SelectValue placeholder="Search and select SKU" />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="p-2">
                          <Input
                            placeholder="Search SKUs..."
                            value={skuSearch}
                            onChange={(e) => setSKUSearch(e.target.value)}
                            className="mb-2"
                          />
                        </div>
                        {availableSKUs.map((sku) => (
                          <SelectItem key={sku.id} value={sku.id}>
                            {sku.sku_code} - {sku.name}
                          </SelectItem>
                        ))}
                        {availableSKUs.length === 0 && (
                          <div className="p-2 text-sm text-muted-foreground text-center">
                            No available SKUs
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">
                      Reason for Designation{' '}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Provide justification for critical medicine designation..."
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      This reason will be recorded in the audit trail.
                    </p>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDesignate}
                    disabled={
                      !selectedSKU ||
                      !reason ||
                      designateCriticalMedicine.isPending
                    }
                  >
                    {designateCriticalMedicine.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Designating...
                      </>
                    ) : (
                      'Designate'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Designated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {criticalMedicines.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={criticalMedicines}
          loading={cmLoading}
          emptyMessage="No critical medicines designated"
          mobileCardRender={mobileCardRender}
        />
      </div>
    </RoleGuard>
  )
}
