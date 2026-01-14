'use client'

import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Bell, Users, Download, Filter, ChevronDown } from 'lucide-react'

interface QuickActionsBarProps {
  activeTab: string
  onAlertAll: () => void
  onBulkFollowUp: () => void
  onExport: () => void
  onFilter: () => void
}

export function QuickActionsBar({ 
  activeTab, 
  onAlertAll, 
  onBulkFollowUp, 
  onExport,
  onFilter 
}: QuickActionsBarProps) {
  // Different actions based on active tab
  const getTabActions = () => {
    switch (activeTab) {
      case 'compliance':
        return (
          <>
            <Button variant="default" size="sm" onClick={onAlertAll}>
              <Bell className="h-4 w-4 mr-2" />
              Alert Selected
            </Button>
            <Button variant="outline" size="sm" onClick={onBulkFollowUp}>
              <Users className="h-4 w-4 mr-2" />
              Assign Follow-up
            </Button>
            <Button variant="outline" size="sm">
              Create Enforcement
            </Button>
          </>
        )
      case 'enforcement':
        return (
          <>
            <Button variant="default" size="sm">
              Create Enforcement
            </Button>
            <Button variant="outline" size="sm">
              Approve Pending
            </Button>
          </>
        )
      default:
        return (
          <>
            <Button variant="outline" size="sm" onClick={onAlertAll}>
              <Bell className="h-4 w-4 mr-2" />
              Alert All
            </Button>
            <Button variant="outline" size="sm" onClick={onBulkFollowUp}>
              <Users className="h-4 w-4 mr-2" />
              Bulk Follow-up
            </Button>
          </>
        )
    }
  }

  return (
    <div className="sticky top-0 z-10 bg-background border-b py-3 mb-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Quick Actions</span>
          {getTabActions()}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>This Week</DropdownMenuItem>
              <DropdownMenuItem>This Month</DropdownMenuItem>
              <DropdownMenuItem>This Quarter</DropdownMenuItem>
              <DropdownMenuItem>Custom Range...</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
