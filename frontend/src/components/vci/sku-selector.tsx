'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { useSKUs, SKU } from '@/hooks/use-rmm'
import { useDebounce } from '@/hooks/use-api'

// Task 1.1.3.13a: SKU selector component

interface SKUSelectorProps {
  value?: string
  onSelect: (sku: SKU | null) => void
  companyId?: string
  excludeIds?: string[]
  disabled?: boolean
  placeholder?: string
  className?: string
}

export function SKUSelector({
  value,
  onSelect,
  companyId,
  excludeIds = [],
  disabled,
  placeholder = 'Select SKU...',
  className,
}: SKUSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const debouncedSearch = useDebounce(search, 300)

  const { data: skusData, isLoading } = useSKUs({
    company_id: companyId,
    is_active: true,
    search: debouncedSearch,
    limit: 50,
  })

  const skus = (skusData?.skus || []).filter((sku) => !excludeIds.includes(sku.id))
  const selectedSKU = skus.find((s) => s.id === value)

  const formatSKULabel = (sku: SKU) => {
    return `${sku.name} - ${sku.dosage_strength} ${sku.dosage_form} (${sku.pack_size})`
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn('w-full justify-between font-normal', className)}
        >
          {selectedSKU ? (
            <span className="truncate">{formatSKULabel(selectedSKU)}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search SKUs..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? 'Loading...' : 'No SKU found.'}
            </CommandEmpty>
            <CommandGroup>
              {skus.map((sku) => (
                <CommandItem
                  key={sku.id}
                  value={sku.id}
                  onSelect={() => {
                    onSelect(sku.id === value ? null : sku)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === sku.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{sku.name}</span>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {sku.sku_code}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground truncate">
                      {sku.dosage_strength} • {sku.dosage_form} • {sku.pack_size}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// Task 1.1.3.13b: Quantity input with unit display
interface QuantityInputProps {
  value: number | ''
  onChange: (value: number | '') => void
  unitOfMeasure?: string
  disabled?: boolean
  min?: number
  className?: string
}

export function QuantityInput({
  value,
  onChange,
  unitOfMeasure = 'units',
  disabled,
  min = 0,
  className,
}: QuantityInputProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const val = e.target.value
          onChange(val === '' ? '' : parseInt(val, 10))
        }}
        min={min}
        disabled={disabled}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="0"
      />
      <span className="text-sm text-muted-foreground whitespace-nowrap min-w-[80px]">
        {unitOfMeasure}
      </span>
    </div>
  )
}
