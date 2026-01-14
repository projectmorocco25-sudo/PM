'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useSearchParams, useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'

interface DashboardTabsProps {
  children: React.ReactNode
  complianceCount?: number
  enforcementCount?: number
}

export function DashboardTabs({ children, complianceCount, enforcementCount }: DashboardTabsProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeTab = searchParams.get('tab') || 'overview'

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', value)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
        <TabsTrigger 
          value="overview"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
        >
          Overview
        </TabsTrigger>
        <TabsTrigger 
          value="compliance"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
        >
          Compliance
          {complianceCount !== undefined && complianceCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {complianceCount}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger 
          value="enforcement"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
        >
          Enforcement
          {enforcementCount !== undefined && enforcementCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {enforcementCount}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger 
          value="modules"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
        >
          Modules
        </TabsTrigger>
        <TabsTrigger 
          value="reports"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
        >
          Reports
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  )
}

export { TabsContent }
