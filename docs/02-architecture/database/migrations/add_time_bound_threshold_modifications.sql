-- Migration: Add Time-Bound Threshold Modifications
-- Description: Adds support for temporary threshold modifications with automatic and manual reversion
-- Date: 2025-01-15
-- Author: Development Team
-- Related: Phase 1 Foundation - Time-Bound Threshold Modifications

BEGIN;

-- Add new columns to thresholds table for time-bound modifications
ALTER TABLE thresholds
ADD COLUMN IF NOT EXISTS duration_type text NOT NULL DEFAULT 'permanent'
  CHECK (duration_type IN ('permanent', 'temporary_auto_revert', 'temporary_manual_review')),
ADD COLUMN IF NOT EXISTS revert_date date,
ADD COLUMN IF NOT EXISTS revert_to_multiplier numeric(5,2),
ADD COLUMN IF NOT EXISTS revert_to_threshold_value numeric(15,2),
ADD COLUMN IF NOT EXISTS revert_notification_sent_7d boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS revert_notification_sent_1d boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS revert_notification_sent_on_revert boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_manual_review boolean NOT NULL DEFAULT false;

-- Add indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_thresholds_revert_date 
  ON thresholds(revert_date) 
  WHERE revert_date IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_thresholds_duration_type 
  ON thresholds(duration_type) 
  WHERE duration_type <> 'permanent';

CREATE INDEX IF NOT EXISTS idx_thresholds_requires_manual_review 
  ON thresholds(requires_manual_review) 
  WHERE requires_manual_review = true;

-- Add constraint: revert_date must be in the future for temporary thresholds
ALTER TABLE thresholds
ADD CONSTRAINT check_temporary_revert_date 
  CHECK (
    (duration_type = 'permanent' AND revert_date IS NULL) OR
    (duration_type <> 'permanent' AND revert_date IS NOT NULL AND revert_date > effective_from)
  );

-- Add constraint: revert_to values required for temporary thresholds
ALTER TABLE thresholds
ADD CONSTRAINT check_temporary_revert_values 
  CHECK (
    (duration_type = 'permanent' AND revert_to_multiplier IS NULL AND revert_to_threshold_value IS NULL) OR
    (duration_type <> 'permanent' AND revert_to_multiplier IS NOT NULL AND revert_to_threshold_value IS NOT NULL)
  );

-- Add constraint: revert_to_multiplier must be in valid range
ALTER TABLE thresholds
ADD CONSTRAINT check_revert_to_multiplier_range 
  CHECK (
    revert_to_multiplier IS NULL OR 
    (revert_to_multiplier >= 0.1 AND revert_to_multiplier <= 5.0)
  );

-- Add comment to table
COMMENT ON COLUMN thresholds.duration_type IS 
  'Duration type: permanent (default), temporary_auto_revert (auto-reverts on revert_date), temporary_manual_review (requires Tier 1 confirmation)';

COMMENT ON COLUMN thresholds.revert_date IS 
  'Date when temporary threshold reverts. Must be in the future and after effective_from date.';

COMMENT ON COLUMN thresholds.revert_to_multiplier IS 
  'Multiplier to revert to when temporary threshold expires. Required for temporary thresholds.';

COMMENT ON COLUMN thresholds.revert_to_threshold_value IS 
  'Threshold value to revert to when temporary threshold expires. Calculated from revert_to_multiplier × AAMS.';

COMMENT ON COLUMN thresholds.revert_notification_sent_7d IS 
  'Flag indicating if 7-day advance warning notification has been sent.';

COMMENT ON COLUMN thresholds.revert_notification_sent_1d IS 
  'Flag indicating if 1-day advance warning notification has been sent.';

COMMENT ON COLUMN thresholds.revert_notification_sent_on_revert IS 
  'Flag indicating if reversion completion notification has been sent.';

COMMENT ON COLUMN thresholds.requires_manual_review IS 
  'Flag indicating if manual review is required before reversion (for temporary_manual_review type).';

COMMIT;

-- Post-migration validation
DO $$
BEGIN
  -- Verify all existing thresholds have duration_type = 'permanent'
  IF EXISTS (
    SELECT 1 FROM thresholds WHERE duration_type IS NULL
  ) THEN
    RAISE EXCEPTION 'Migration validation failed: Some thresholds have NULL duration_type';
  END IF;

  -- Verify no temporary thresholds exist without revert_date
  IF EXISTS (
    SELECT 1 FROM thresholds 
    WHERE duration_type <> 'permanent' AND revert_date IS NULL
  ) THEN
    RAISE EXCEPTION 'Migration validation failed: Temporary thresholds found without revert_date';
  END IF;

  RAISE NOTICE 'Migration validation passed: All thresholds have valid duration_type';
END $$;

