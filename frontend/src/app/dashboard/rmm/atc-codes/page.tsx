'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useATCCodes, ATCCode } from '@/hooks/use-rmm'
import { Search, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// Task 1.1.2.29: ATC Codes list page

export default function ATCCodesPage() {
  const [search, setSearch] = React.useState('')
  const [selectedLevel1, setSelectedLevel1] = React.useState<string | null>(null)
  const [selectedLevel2, setSelectedLevel2] = React.useState<string | null>(null)
  const [selectedLevel3, setSelectedLevel3] = React.useState<string | null>(null)
  const [selectedLevel4, setSelectedLevel4] = React.useState<string | null>(null)

  // Fetch codes based on current selection
  const { data: level1Data, isLoading: l1Loading } = useATCCodes({ level: 1 })
  const { data: level2Data, isLoading: l2Loading } = useATCCodes({
    level: 2,
    parent_code: selectedLevel1 || undefined,
  })
  const { data: level3Data, isLoading: l3Loading } = useATCCodes({
    level: 3,
    parent_code: selectedLevel2 || undefined,
  })
  const { data: level4Data, isLoading: l4Loading } = useATCCodes({
    level: 4,
    parent_code: selectedLevel3 || undefined,
  })
  const { data: level5Data, isLoading: l5Loading } = useATCCodes({
    level: 5,
    parent_code: selectedLevel4 || undefined,
  })
  const { data: searchData, isLoading: searchLoading } = useATCCodes({
    search: search.length >= 2 ? search : undefined,
  })

  const level1Codes = level1Data?.atc_codes || []
  const level2Codes = level2Data?.atc_codes || []
  const level3Codes = level3Data?.atc_codes || []
  const level4Codes = level4Data?.atc_codes || []
  const level5Codes = level5Data?.atc_codes || []
  const searchResults = searchData?.atc_codes || []

  const handleLevel1Select = (code: string) => {
    setSelectedLevel1(code)
    setSelectedLevel2(null)
    setSelectedLevel3(null)
    setSelectedLevel4(null)
  }

  const handleLevel2Select = (code: string) => {
    setSelectedLevel2(code)
    setSelectedLevel3(null)
    setSelectedLevel4(null)
  }

  const handleLevel3Select = (code: string) => {
    setSelectedLevel3(code)
    setSelectedLevel4(null)
  }

  const handleLevel4Select = (code: string) => {
    setSelectedLevel4(code)
  }

  const ATCCodeItem = ({
    code,
    isSelected,
    onClick,
    hasChildren,
  }: {
    code: ATCCode
    isSelected?: boolean
    onClick?: () => void
    hasChildren?: boolean
  }) => (
    <div
      className={cn(
        'flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors',
        isSelected
          ? 'bg-primary text-primary-foreground'
          : 'hover:bg-muted'
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <Badge variant={isSelected ? 'secondary' : 'outline'} className="font-mono">
          {code.code}
        </Badge>
        <span className="text-sm">{code.name}</span>
      </div>
      {hasChildren && <ChevronRight className="h-4 w-4" />}
    </div>
  )

  const CodeColumn = ({
    title,
    codes,
    loading,
    selectedCode,
    onSelect,
    hasChildren,
  }: {
    title: string
    codes: ATCCode[]
    loading: boolean
    selectedCode: string | null
    onSelect: (code: string) => void
    hasChildren?: boolean
  }) => (
    <div className="flex-1 min-w-[250px] max-w-[300px]">
      <h3 className="text-sm font-medium mb-2">{title}</h3>
      <div className="border rounded-md h-[400px] overflow-y-auto">
        {loading ? (
          <div className="p-3 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : codes.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            No codes available
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {codes.map((code) => (
              <ATCCodeItem
                key={code.id}
                code={code}
                isSelected={selectedCode === code.code}
                onClick={() => onSelect(code.code)}
                hasChildren={hasChildren}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">ATC Codes</h2>
        <p className="text-sm text-muted-foreground">
          Anatomical Therapeutic Chemical (ATC) Classification System
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search ATC Codes</CardTitle>
          <CardDescription>
            Search by code or name to find specific ATC classifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search codes or names..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {search.length >= 2 && (
            <div className="mt-4">
              {searchLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : searchResults.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No results found for &quot;{search}&quot;
                </p>
              ) : (
                <div className="space-y-1">
                  {searchResults.slice(0, 20).map((code) => (
                    <div
                      key={code.id}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-muted"
                    >
                      <Badge variant="outline" className="font-mono">
                        {code.code}
                      </Badge>
                      <span className="text-sm">{code.name}</span>
                      <Badge variant="secondary" className="ml-auto">
                        Level {code.level}
                      </Badge>
                    </div>
                  ))}
                  {searchResults.length > 20 && (
                    <p className="text-sm text-muted-foreground pt-2">
                      Showing first 20 of {searchResults.length} results
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hierarchical Browser */}
      <Card>
        <CardHeader>
          <CardTitle>Browse ATC Hierarchy</CardTitle>
          <CardDescription>
            Navigate through the 5-level ATC classification hierarchy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-x-auto pb-4">
            <CodeColumn
              title="Level 1 - Anatomical"
              codes={level1Codes}
              loading={l1Loading}
              selectedCode={selectedLevel1}
              onSelect={handleLevel1Select}
              hasChildren
            />
            {selectedLevel1 && (
              <CodeColumn
                title="Level 2 - Therapeutic"
                codes={level2Codes}
                loading={l2Loading}
                selectedCode={selectedLevel2}
                onSelect={handleLevel2Select}
                hasChildren
              />
            )}
            {selectedLevel2 && (
              <CodeColumn
                title="Level 3 - Pharmacological"
                codes={level3Codes}
                loading={l3Loading}
                selectedCode={selectedLevel3}
                onSelect={handleLevel3Select}
                hasChildren
              />
            )}
            {selectedLevel3 && (
              <CodeColumn
                title="Level 4 - Chemical"
                codes={level4Codes}
                loading={l4Loading}
                selectedCode={selectedLevel4}
                onSelect={handleLevel4Select}
                hasChildren
              />
            )}
            {selectedLevel4 && (
              <CodeColumn
                title="Level 5 - Substance"
                codes={level5Codes}
                loading={l5Loading}
                selectedCode={null}
                onSelect={() => {}}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
