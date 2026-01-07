# Threshold Reversion API Integration Examples

**Purpose:** This document provides practical code examples for integrating threshold reversion functionality into the frontend application.

**Last Updated:** 2025-01-15  
**Status:** 🟡 In Progress  
**Owner:** Frontend Development Team

## Overview

This document provides TypeScript/JavaScript examples for calling RPC functions and Edge Functions related to threshold modifications and reversions.

## Prerequisites

- Supabase client initialized
- User authenticated with appropriate role (Tier 1 for modifications)
- TypeScript types generated from database schema

## RPC Function Examples

### 1. Modify Threshold (Permanent)

```typescript
import { supabase } from '@/lib/supabase';

async function modifyThresholdPermanent(
  skuId: string,
  multiplier: number,
  scope: 'local' | 'global',
  justification: string
) {
  const { data, error } = await supabase.rpc('vci_modify_threshold', {
    p_sku_id: skuId,
    p_multiplier_b: multiplier,
    p_scope: scope,
    p_justification: justification,
    p_duration_type: 'permanent',
    p_revert_date: null,
    p_revert_to_multiplier: null,
    p_requires_manual_review: false
  });

  if (error) {
    console.error('Error modifying threshold:', error);
    throw error;
  }

  return data;
}
```

### 2. Modify Threshold (Temporary Auto-Revert)

```typescript
async function modifyThresholdTemporaryAutoRevert(
  skuId: string,
  multiplier: number,
  scope: 'local' | 'global',
  justification: string,
  revertDate: Date,
  revertToMultiplier: number
) {
  // Validate revert date is in the future
  if (revertDate <= new Date()) {
    throw new Error('Revert date must be in the future');
  }

  const { data, error } = await supabase.rpc('vci_modify_threshold', {
    p_sku_id: skuId,
    p_multiplier_b: multiplier,
    p_scope: scope,
    p_justification: justification,
    p_duration_type: 'temporary_auto_revert',
    p_revert_date: revertDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
    p_revert_to_multiplier: revertToMultiplier,
    p_requires_manual_review: false
  });

  if (error) {
    console.error('Error modifying threshold:', error);
    throw error;
  }

  return data;
}
```

### 3. Modify Threshold (Temporary Manual Review)

```typescript
async function modifyThresholdTemporaryManualReview(
  skuId: string,
  multiplier: number,
  scope: 'local' | 'global',
  justification: string,
  revertDate: Date,
  revertToMultiplier: number
) {
  const { data, error } = await supabase.rpc('vci_modify_threshold', {
    p_sku_id: skuId,
    p_multiplier_b: multiplier,
    p_scope: scope,
    p_justification: justification,
    p_duration_type: 'temporary_manual_review',
    p_revert_date: revertDate.toISOString().split('T')[0],
    p_revert_to_multiplier: revertToMultiplier,
    p_requires_manual_review: true
  });

  if (error) {
    console.error('Error modifying threshold:', error);
    throw error;
  }

  return data;
}
```

### 4. Get Pending Reversions

```typescript
async function getPendingReversions(companyId?: string) {
  const { data, error } = await supabase.rpc('vci_get_pending_reversions', {
    p_company_id: companyId || null
  });

  if (error) {
    console.error('Error fetching pending reversions:', error);
    throw error;
  }

  return data;
}

// Usage examples:
// Get all pending reversions (MOH Tier 1)
const allPending = await getPendingReversions();

// Get company-specific pending reversions
const companyPending = await getPendingReversions(companyId);
```

### 5. Confirm Threshold Reversion (Manual Review)

```typescript
async function confirmThresholdReversion(
  thresholdId: string,
  confirmedByUserId: string,
  justification: string
) {
  const { data, error } = await supabase.rpc('vci_confirm_threshold_reversion', {
    p_threshold_id: thresholdId,
    p_confirmed_by_user_id: confirmedByUserId,
    p_justification: justification
  });

  if (error) {
    console.error('Error confirming reversion:', error);
    throw error;
  }

  return data;
}
```

### 6. Manually Revert Threshold (Early Reversion)

```typescript
async function manuallyRevertThreshold(
  thresholdId: string,
  revertByUserId: string,
  justification: string
) {
  const { data, error } = await supabase.rpc('vci_revert_threshold', {
    p_threshold_id: thresholdId,
    p_revert_by_user_id: revertByUserId,
    p_justification: justification
  });

  if (error) {
    console.error('Error reverting threshold:', error);
    throw error;
  }

  return data;
}
```

## React Hook Examples

### 1. Use Threshold Modification Hook

```typescript
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useModifyThreshold() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const modifyThreshold = useMutation({
    mutationFn: async (params: {
      skuId: string;
      multiplier: number;
      scope: 'local' | 'global';
      justification: string;
      durationType: 'permanent' | 'temporary_auto_revert' | 'temporary_manual_review';
      revertDate?: Date;
      revertToMultiplier?: number;
      requiresManualReview?: boolean;
    }) => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase.rpc('vci_modify_threshold', {
          p_sku_id: params.skuId,
          p_multiplier_b: params.multiplier,
          p_scope: params.scope,
          p_justification: params.justification,
          p_duration_type: params.durationType,
          p_revert_date: params.revertDate?.toISOString().split('T')[0] || null,
          p_revert_to_multiplier: params.revertToMultiplier || null,
          p_requires_manual_review: params.requiresManualReview || false
        });

        if (error) throw error;

        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ['thresholds'] });
        queryClient.invalidateQueries({ queryKey: ['pending-reversions'] });

        return data;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    }
  });

  return {
    modifyThreshold: modifyThreshold.mutate,
    isLoading,
    error
  };
}
```

### 2. Use Pending Reversions Hook

```typescript
import { useQuery } from '@tanstack/react-query';

export function usePendingReversions(companyId?: string) {
  return useQuery({
    queryKey: ['pending-reversions', companyId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('vci_get_pending_reversions', {
        p_company_id: companyId || null
      });

      if (error) throw error;
      return data;
    },
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000 // Consider data stale after 30 seconds
  });
}
```

### 3. Use Threshold Reversion Confirmation Hook

```typescript
export function useConfirmThresholdReversion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      thresholdId: string;
      confirmedByUserId: string;
      justification: string;
    }) => {
      const { data, error } = await supabase.rpc('vci_confirm_threshold_reversion', {
        p_threshold_id: params.thresholdId,
        p_confirmed_by_user_id: params.confirmedByUserId,
        p_justification: params.justification
      });

      if (error) throw error;

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['thresholds'] });
      queryClient.invalidateQueries({ queryKey: ['pending-reversions'] });

      return data;
    }
  });
}
```

## Form Validation Examples

### 1. Threshold Modification Form Validation

```typescript
import { z } from 'zod';

export const thresholdModificationSchema = z.object({
  multiplier: z.number()
    .min(0.1, 'Multiplier must be at least 0.1x')
    .max(5.0, 'Multiplier must be at most 5.0x'),
  scope: z.enum(['local', 'global']),
  justification: z.string()
    .min(50, 'Justification must be at least 50 characters')
    .max(1000, 'Justification must be at most 1000 characters'),
  durationType: z.enum(['permanent', 'temporary_auto_revert', 'temporary_manual_review']),
  revertDate: z.date().optional(),
  revertToMultiplier: z.number().optional(),
  requiresManualReview: z.boolean().optional()
}).refine((data) => {
  // If temporary, revertDate and revertToMultiplier are required
  if (data.durationType !== 'permanent') {
    return data.revertDate !== undefined && data.revertToMultiplier !== undefined;
  }
  return true;
}, {
  message: 'Revert date and revert to multiplier are required for temporary thresholds',
  path: ['revertDate']
}).refine((data) => {
  // Revert date must be in the future
  if (data.revertDate && data.revertDate <= new Date()) {
    return false;
  }
  return true;
}, {
  message: 'Revert date must be in the future',
  path: ['revertDate']
}).refine((data) => {
  // Revert to multiplier must be in valid range
  if (data.revertToMultiplier !== undefined) {
    return data.revertToMultiplier >= 0.1 && data.revertToMultiplier <= 5.0;
  }
  return true;
}, {
  message: 'Revert to multiplier must be between 0.1x and 5.0x',
  path: ['revertToMultiplier']
});
```

### 2. Reversion Review Form Validation

```typescript
export const reversionReviewSchema = z.object({
  decision: z.enum(['confirm', 'cancel', 'extend']),
  justification: z.string()
    .min(50, 'Justification must be at least 50 characters')
    .max(1000, 'Justification must be at most 1000 characters'),
  newRevertDate: z.date().optional()
}).refine((data) => {
  // If extending, new revert date is required
  if (data.decision === 'extend') {
    return data.newRevertDate !== undefined;
  }
  return true;
}, {
  message: 'New revert date is required when extending temporary period',
  path: ['newRevertDate']
});
```

## UI Component Examples

### 1. Threshold Modification Modal Component

```typescript
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { thresholdModificationSchema } from '@/lib/validation';
import { useModifyThreshold } from '@/hooks/useModifyThreshold';

export function ThresholdModificationModal({ skuId, onClose }: {
  skuId: string;
  onClose: () => void;
}) {
  const { modifyThreshold, isLoading } = useModifyThreshold();
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(thresholdModificationSchema),
    defaultValues: {
      durationType: 'permanent',
      scope: 'local'
    }
  });

  const durationType = watch('durationType');
  const isTemporary = durationType !== 'permanent';

  const onSubmit = async (data: any) => {
    try {
      await modifyThreshold({
        skuId,
        multiplier: data.multiplier,
        scope: data.scope,
        justification: data.justification,
        durationType: data.durationType,
        revertDate: data.revertDate,
        revertToMultiplier: data.revertToMultiplier,
        requiresManualReview: data.durationType === 'temporary_manual_review'
      });
      onClose();
    } catch (error) {
      console.error('Error modifying threshold:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Duration Type Selection */}
      <div>
        <label>Duration Type *</label>
        <input type="radio" value="permanent" {...register('durationType')} />
        <label>Permanent</label>
        <input type="radio" value="temporary_auto_revert" {...register('durationType')} />
        <label>Temporary (Auto-Revert)</label>
        <input type="radio" value="temporary_manual_review" {...register('durationType')} />
        <label>Temporary (Manual Review)</label>
      </div>

      {/* Conditional Fields for Temporary */}
      {isTemporary && (
        <>
          <div>
            <label>End Date *</label>
            <input type="date" {...register('revertDate', { valueAsDate: true })} />
            {errors.revertDate && <span>{errors.revertDate.message}</span>}
          </div>

          <div>
            <label>Revert To Multiplier *</label>
            <input type="number" step="0.1" min="0.1" max="5.0" {...register('revertToMultiplier', { valueAsNumber: true })} />
            {errors.revertToMultiplier && <span>{errors.revertToMultiplier.message}</span>}
          </div>
        </>
      )}

      {/* Other fields... */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Modifying...' : 'Modify Threshold'}
      </button>
    </form>
  );
}
```

### 2. Pending Reversions List Component

```typescript
'use client';

import { usePendingReversions } from '@/hooks/usePendingReversions';
import { formatDistanceToNow } from 'date-fns';

export function PendingReversionsList({ companyId }: { companyId?: string }) {
  const { data: pendingReversions, isLoading, error } = usePendingReversions(companyId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <table>
      <thead>
        <tr>
          <th>SKU</th>
          <th>Product</th>
          <th>Current Multiplier</th>
          <th>Revert To</th>
          <th>Revert Date</th>
          <th>Days Until</th>
          <th>Type</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {pendingReversions?.map((reversion: any) => (
          <tr key={reversion.threshold_id}>
            <td>{reversion.sku_code}</td>
            <td>{reversion.product_name}</td>
            <td>{reversion.current_multiplier}x</td>
            <td>{reversion.revert_to_multiplier}x</td>
            <td>{new Date(reversion.revert_date).toLocaleDateString()}</td>
            <td>
              {formatDistanceToNow(new Date(reversion.revert_date), { addSuffix: true })}
            </td>
            <td>
              <span className={`badge ${reversion.duration_type === 'temporary_auto_revert' ? 'auto' : 'manual'}`}>
                {reversion.duration_type === 'temporary_auto_revert' ? 'Auto-Revert' : 'Manual Review'}
              </span>
            </td>
            <td>
              {reversion.duration_type === 'temporary_manual_review' && (
                <button onClick={() => handleReview(reversion.threshold_id)}>
                  Review
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

## Error Handling Examples

### 1. Error Handling Utility

```typescript
export function handleThresholdError(error: any): string {
  if (error.code === 'P0001') {
    // Custom PostgreSQL error
    return error.message;
  }

  if (error.message?.includes('Unauthorized')) {
    return 'You do not have permission to perform this action. Only Tier 1 officers can modify thresholds.';
  }

  if (error.message?.includes('overlapping temporary threshold')) {
    return 'An overlapping temporary threshold already exists for this SKU. Please adjust the revert date.';
  }

  if (error.message?.includes('Justification must be at least 50 characters')) {
    return 'Please provide a more detailed justification (minimum 50 characters).';
  }

  return 'An error occurred while modifying the threshold. Please try again.';
}
```

## Real-time Updates (Optional)

### 1. Subscribe to Threshold Changes

```typescript
import { useEffect } from 'react';

export function useThresholdRealtimeUpdates(thresholdId: string) {
  useEffect(() => {
    const channel = supabase
      .channel(`threshold:${thresholdId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'thresholds',
          filter: `id=eq.${thresholdId}`
        },
        (payload) => {
          console.log('Threshold updated:', payload.new);
          // Update UI or refetch data
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [thresholdId]);
}
```

---

**Last Updated:** 2025-01-15  
**Owner:** Frontend Development Team

