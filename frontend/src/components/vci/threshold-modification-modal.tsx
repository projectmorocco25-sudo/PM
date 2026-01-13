'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useVCIMutations, useMultiplierAdvisory, Threshold } from '@/hooks/use-vci'
import { Loader2, AlertTriangle, Info, Lightbulb } from 'lucide-react'
import { format, addDays } from 'date-fns'

// Task 1.1.3.17 & 1.1.3.17a: Threshold modification form and modal

interface ThresholdModificationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  threshold?: Threshold | null // null for global modification
  onSuccess?: () => void
}

export function ThresholdModificationModal({
  open,
  onOpenChange,
  threshold,
  onSuccess,
}: ThresholdModificationModalProps) {
  const { modifyThreshold } = useVCIMutations()
  
  const [isGlobal, setIsGlobal] = React.useState(!threshold)
  const [newMultiplierB, setNewMultiplierB] = React.useState(threshold?.multiplier_b || 3.0)
  const [effectiveFrom, setEffectiveFrom] = React.useState(
    format(addDays(new Date(), 1), 'yyyy-MM-dd')
  )
  const [effectiveTo, setEffectiveTo] = React.useState('')
  const [justification, setJustification] = React.useState('')

  // Task 1.1.3.7a: Advisory suggestions
  const { data: advisoryData } = useMultiplierAdvisory(
    threshold?.sku_id || null,
    newMultiplierB,
    undefined
  )

  const advisory = advisoryData

  React.useEffect(() => {
    if (threshold) {
      setNewMultiplierB(threshold.multiplier_b)
      setIsGlobal(false)
    } else {
      setNewMultiplierB(3.0)
      setIsGlobal(true)
    }
  }, [threshold])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (justification.length < 50) return

    try {
      await modifyThreshold.mutateAsync({
        sku_id: isGlobal ? undefined : threshold?.sku_id,
        new_multiplier_b: newMultiplierB,
        effective_from: effectiveFrom,
        effective_to: effectiveTo || undefined,
        justification,
        is_global: isGlobal,
      })
      onOpenChange(false)
      resetForm()
      onSuccess?.()
    } catch {
      // Error handled by mutation
    }
  }

  const resetForm = () => {
    setNewMultiplierB(threshold?.multiplier_b || 3.0)
    setEffectiveFrom(format(addDays(new Date(), 1), 'yyyy-MM-dd'))
    setEffectiveTo('')
    setJustification('')
  }

  const minDate = format(addDays(new Date(), 1), 'yyyy-MM-dd')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isGlobal ? 'Global Threshold Modification' : 'Modify Threshold'}
            </DialogTitle>
            <DialogDescription>
              {isGlobal
                ? 'This will update the B multiplier for all active SKUs'
                : `Modify threshold for ${threshold?.sku_name || 'selected SKU'}`}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {/* Global/Local Toggle */}
            {!threshold && (
              <div className="flex items-center justify-between">
                <Label>Apply Globally</Label>
                <Switch checked={isGlobal} onCheckedChange={setIsGlobal} />
              </div>
            )}

            {/* Current Values */}
            {threshold && (
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <div className="text-sm font-medium">Current Values</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Multiplier:</span>{' '}
                    <Badge variant="outline">×{threshold.multiplier_b}</Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Threshold:</span>{' '}
                    <span className="font-mono">{threshold.threshold_value.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">AAMS:</span>{' '}
                    <span className="font-mono">{threshold.aams_value.toLocaleString()}</span>
                  </div>
                  {threshold.is_critical_medicine && (
                    <div>
                      <Badge variant="default">Critical Medicine</Badge>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* New Multiplier */}
            <div className="space-y-2">
              <Label>
                New B Multiplier <span className="text-destructive">*</span>
              </Label>
              <Input
                type="number"
                step="0.1"
                min="0.1"
                value={newMultiplierB}
                onChange={(e) => setNewMultiplierB(parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">
                Default: 3.0 (standard) / 3.5 (critical medicines)
              </p>
            </div>

            {/* Advisory Suggestions */}
            {advisory?.suggestions && advisory.suggestions.length > 0 && (
              <div className="space-y-2">
                {advisory.suggestions.map((suggestion, index) => (
                  <Alert
                    key={index}
                    variant={suggestion.type === 'warning' ? 'destructive' : 'default'}
                  >
                    {suggestion.type === 'warning' && <AlertTriangle className="h-4 w-4" />}
                    {suggestion.type === 'suggestion' && <Lightbulb className="h-4 w-4" />}
                    {suggestion.type === 'info' && <Info className="h-4 w-4" />}
                    <AlertDescription className="text-sm">{suggestion.message}</AlertDescription>
                  </Alert>
                ))}
              </div>
            )}

            {/* Effective From */}
            <div className="space-y-2">
              <Label>
                Effective From <span className="text-destructive">*</span>
              </Label>
              <Input
                type="date"
                min={minDate}
                value={effectiveFrom}
                onChange={(e) => setEffectiveFrom(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Must be in the future (non-retroactive)
              </p>
            </div>

            {/* Effective To (Optional for temporary) */}
            <div className="space-y-2">
              <Label>Effective To (Optional)</Label>
              <Input
                type="date"
                min={effectiveFrom}
                value={effectiveTo}
                onChange={(e) => setEffectiveTo(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty for permanent change. Set a date for temporary adjustment.
              </p>
            </div>

            {/* Justification */}
            <div className="space-y-2">
              <Label>
                Justification <span className="text-destructive">*</span>
              </Label>
              <Textarea
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="Provide detailed justification for this threshold modification (minimum 50 characters)..."
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                {justification.length}/50 characters minimum
              </p>
            </div>

            {/* Preview */}
            {threshold && newMultiplierB > 0 && (
              <div className="rounded-lg border border-dashed p-4">
                <div className="text-sm font-medium mb-2">New Threshold Preview</div>
                <div className="text-2xl font-mono font-bold">
                  {(newMultiplierB * threshold.aams_value).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  = {newMultiplierB} × {threshold.aams_value.toLocaleString()}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={justification.length < 50 || modifyThreshold.isPending}
            >
              {modifyThreshold.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Applying...
                </>
              ) : (
                'Apply Modification'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
