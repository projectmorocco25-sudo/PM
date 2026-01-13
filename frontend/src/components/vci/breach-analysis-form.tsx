'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  useBreachMutations,
  useBreachSuggestions,
  Breach,
  BreachSuggestion,
} from '@/hooks/use-vci'
import { useUserRole } from '@/hooks/use-user-role'
import { Loader2, Lightbulb, AlertTriangle, CheckCircle2, XCircle, Gavel } from 'lucide-react'

// Task 1.1.5.18a: BreachAnalysisForm component
// Task 1.1.5.19: Breach action approval interface

const ACTION_OPTIONS = [
  { value: 'warning', label: 'Issue Warning', description: 'Formal warning to the company' },
  { value: 'fine', label: 'Impose Fine', description: 'Financial penalty' },
  { value: 'suspension', label: 'Suspend Operations', description: 'Temporary suspension' },
  { value: 'no_action', label: 'No Action', description: 'Close without action' },
  { value: 'refer_to_tier1', label: 'Refer to Tier 1', description: 'Escalate for review' },
]

interface BreachAnalysisFormProps {
  breach: Breach
  onSuccess?: () => void
}

export function BreachAnalysisForm({ breach, onSuccess }: BreachAnalysisFormProps) {
  const { analyzeBreach } = useBreachMutations()
  const { data: suggestionsData, isLoading: loadingSuggestions } = useBreachSuggestions(breach.id)

  const [selectedAction, setSelectedAction] = React.useState('')
  const [actionDetails, setActionDetails] = React.useState('')
  const [analysisNotes, setAnalysisNotes] = React.useState('')

  const suggestions = suggestionsData?.suggestions || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAction) return

    try {
      await analyzeBreach.mutateAsync({
        breach_id: breach.id,
        suggested_action: selectedAction,
        suggested_action_details: actionDetails || undefined,
        analysis_notes: analysisNotes || undefined,
      })
      onSuccess?.()
    } catch {
      // Error handled by mutation
    }
  }

  const applySuggestion = (suggestion: BreachSuggestion) => {
    setSelectedAction(suggestion.action)
    setActionDetails(suggestion.reason)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Breach Analysis</CardTitle>
        <CardDescription>
          Analyze this breach and suggest an action for Tier 1 approval
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* AI Suggestions */}
          {loadingSuggestions ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading suggestions...
            </div>
          ) : suggestions.length > 0 && (
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Suggested Actions
              </Label>
              <div className="grid gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => applySuggestion(suggestion)}
                    className="flex items-center justify-between p-3 rounded-md border hover:bg-muted/50 text-left transition-colors"
                  >
                    <div>
                      <div className="font-medium capitalize">{suggestion.action.replace('_', ' ')}</div>
                      <div className="text-sm text-muted-foreground">{suggestion.reason}</div>
                    </div>
                    <Badge variant={suggestion.confidence === 'high' ? 'default' : 'secondary'}>
                      {suggestion.confidence} confidence
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Context Info */}
          {suggestionsData && (
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                {suggestionsData.prior_breaches} prior breach(es)
              </Badge>
              <Badge variant="outline">
                {suggestionsData.shortage_percent.toFixed(0)}% shortage
              </Badge>
              {suggestionsData.is_critical && (
                <Badge variant="destructive">Critical Medicine</Badge>
              )}
            </div>
          )}

          {/* Action Selection */}
          <div className="space-y-2">
            <Label htmlFor="action">
              Suggested Action <span className="text-destructive">*</span>
            </Label>
            <Select value={selectedAction} onValueChange={setSelectedAction}>
              <SelectTrigger>
                <SelectValue placeholder="Select an action..." />
              </SelectTrigger>
              <SelectContent>
                {ACTION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Details */}
          <div className="space-y-2">
            <Label htmlFor="details">Action Details</Label>
            <Textarea
              id="details"
              value={actionDetails}
              onChange={(e) => setActionDetails(e.target.value)}
              placeholder="Provide additional details about the suggested action..."
              rows={3}
            />
          </div>

          {/* Analysis Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Analysis Notes</Label>
            <Textarea
              id="notes"
              value={analysisNotes}
              onChange={(e) => setAnalysisNotes(e.target.value)}
              placeholder="Add any notes about your analysis..."
              rows={3}
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button type="submit" disabled={!selectedAction || analyzeBreach.isPending}>
              {analyzeBreach.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Submit Analysis
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// Task 1.1.5.19: Breach action approval interface
interface BreachApprovalFormProps {
  breach: Breach
  suggestedAction?: string
  rejectionCount?: number
  onSuccess?: () => void
}

export function BreachApprovalForm({
  breach,
  suggestedAction,
  rejectionCount = 0,
  onSuccess,
}: BreachApprovalFormProps) {
  const { approveBreachAction, tier1DirectAction } = useBreachMutations()
  
  const [showRejectDialog, setShowRejectDialog] = React.useState(false)
  const [showDirectActionDialog, setShowDirectActionDialog] = React.useState(false)
  const [rejectNotes, setRejectNotes] = React.useState('')
  const [directAction, setDirectAction] = React.useState('')
  const [directActionDetails, setDirectActionDetails] = React.useState('')

  const requiresDirectAction = rejectionCount >= 2

  const handleApprove = async () => {
    try {
      await approveBreachAction.mutateAsync({
        breach_id: breach.id,
        approve: true,
        action_taken: suggestedAction,
      })
      onSuccess?.()
    } catch {
      // Error handled by mutation
    }
  }

  const handleReject = async () => {
    if (rejectNotes.length < 10) return
    try {
      await approveBreachAction.mutateAsync({
        breach_id: breach.id,
        approve: false,
        notes: rejectNotes,
      })
      setShowRejectDialog(false)
      setRejectNotes('')
      onSuccess?.()
    } catch {
      // Error handled by mutation
    }
  }

  const handleDirectAction = async () => {
    if (!directAction || !directActionDetails) return
    try {
      await tier1DirectAction.mutateAsync({
        breach_id: breach.id,
        action: directAction,
        action_details: directActionDetails,
      })
      setShowDirectActionDialog(false)
      onSuccess?.()
    } catch {
      // Error handled by mutation
    }
  }

  const isLoading = approveBreachAction.isPending || tier1DirectAction.isPending

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gavel className="h-5 w-5" />
            Tier 1 Approval
          </CardTitle>
          <CardDescription>
            Review the suggested action and approve or reject
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Suggested Action Display */}
          {suggestedAction && (
            <div className="p-4 rounded-md bg-muted">
              <div className="text-sm text-muted-foreground mb-1">Suggested Action</div>
              <div className="font-medium capitalize">
                {suggestedAction.replace('_', ' ')}
              </div>
            </div>
          )}

          {/* Rejection Warning */}
          {rejectionCount > 0 && (
            <Alert variant={requiresDirectAction ? 'destructive' : 'default'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {requiresDirectAction
                  ? 'Maximum rejections (2) reached. You must take direct action.'
                  : `This suggestion has been rejected ${rejectionCount} time(s).`}
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            {!requiresDirectAction ? (
              <>
                <Button onClick={handleApprove} disabled={isLoading}>
                  {approveBreachAction.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                  )}
                  Approve
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowRejectDialog(true)}
                  disabled={isLoading}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </>
            ) : (
              <Button
                variant="destructive"
                onClick={() => setShowDirectActionDialog(true)}
                disabled={isLoading}
              >
                <Gavel className="mr-2 h-4 w-4" />
                Take Direct Action
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Analysis</DialogTitle>
            <DialogDescription>
              Provide feedback for the Tier 2 analyst
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>Rejection Notes</Label>
            <Textarea
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              placeholder="Explain why this analysis is being rejected..."
              rows={4}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {rejectNotes.length}/10 minimum
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={rejectNotes.length < 10 || approveBreachAction.isPending}
            >
              {approveBreachAction.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Direct Action Dialog */}
      <Dialog open={showDirectActionDialog} onOpenChange={setShowDirectActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Take Direct Action</DialogTitle>
            <DialogDescription>
              Specify the action to take on this breach
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Action Type</Label>
              <Select value={directAction} onValueChange={setDirectAction}>
                <SelectTrigger>
                  <SelectValue placeholder="Select action..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warning">Issue Warning</SelectItem>
                  <SelectItem value="fine">Impose Fine</SelectItem>
                  <SelectItem value="suspension">Suspend Operations</SelectItem>
                  <SelectItem value="no_action">No Action</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Action Details</Label>
              <Textarea
                value={directActionDetails}
                onChange={(e) => setDirectActionDetails(e.target.value)}
                placeholder="Describe the action being taken..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDirectActionDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDirectAction}
              disabled={!directAction || !directActionDetails || tier1DirectAction.isPending}
            >
              {tier1DirectAction.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Action
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Task 1.1.5.18b: BatchBreachAnalysis interface
interface BatchBreachAnalysisProps {
  selectedBreaches: Breach[]
  onClear: () => void
  onSuccess?: () => void
}

export function BatchBreachAnalysis({
  selectedBreaches,
  onClear,
  onSuccess,
}: BatchBreachAnalysisProps) {
  const { analyzeBreachesBatch } = useBreachMutations()
  
  const [selectedAction, setSelectedAction] = React.useState('')
  const [actionDetails, setActionDetails] = React.useState('')
  const [analysisNotes, setAnalysisNotes] = React.useState('')

  if (selectedBreaches.length === 0) return null

  const handleSubmit = async () => {
    if (!selectedAction) return
    
    try {
      await analyzeBreachesBatch.mutateAsync({
        breach_ids: selectedBreaches.map((b) => b.id),
        suggested_action: selectedAction,
        suggested_action_details: actionDetails || undefined,
        analysis_notes: analysisNotes || undefined,
      })
      onClear()
      onSuccess?.()
    } catch {
      // Error handled by mutation
    }
  }

  return (
    <Card className="border-primary">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Batch Analysis</CardTitle>
            <CardDescription>
              Analyze {selectedBreaches.length} selected breach(es)
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear Selection
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Action for All</Label>
          <Select value={selectedAction} onValueChange={setSelectedAction}>
            <SelectTrigger>
              <SelectValue placeholder="Select action..." />
            </SelectTrigger>
            <SelectContent>
              {ACTION_OPTIONS.slice(0, -1).map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Details</Label>
          <Textarea
            value={actionDetails}
            onChange={(e) => setActionDetails(e.target.value)}
            placeholder="Action details..."
            rows={2}
          />
        </div>
        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={!selectedAction || analyzeBreachesBatch.isPending}
        >
          {analyzeBreachesBatch.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Analyze {selectedBreaches.length} Breach(es)
        </Button>
      </CardContent>
    </Card>
  )
}
