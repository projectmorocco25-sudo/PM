-- Migration: add_notification_delivery_tracking
-- Description: Add delivery tracking fields to notifications (email sent status, attempts, last error)
-- Date: 2025-01-12
-- Author: Nadia
-- Phase: 1.1.1
-- Task: 1.1.1.4e (enable "mark as sent")
-- Depends on: 20250112120000_create_core_tables

BEGIN;

ALTER TABLE notifications
ADD COLUMN IF NOT EXISTS email_sent_at timestamptz NULL,
ADD COLUMN IF NOT EXISTS email_attempts integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS email_last_error text NULL;

COMMENT ON COLUMN notifications.email_sent_at IS 'Timestamp when email delivery succeeded for this notification (NULL = not sent yet)';
COMMENT ON COLUMN notifications.email_attempts IS 'Number of email delivery attempts for this notification';
COMMENT ON COLUMN notifications.email_last_error IS 'Last email delivery error (if any)';

-- Helpful index for scanning unsent notifications by type/time
CREATE INDEX IF NOT EXISTS idx_notifications_email_unsent
ON notifications(created_at)
WHERE email_sent_at IS NULL;

COMMIT;

-- Rollback (commented)
-- BEGIN;
-- DROP INDEX IF EXISTS idx_notifications_email_unsent;
-- ALTER TABLE notifications DROP COLUMN IF EXISTS email_last_error;
-- ALTER TABLE notifications DROP COLUMN IF EXISTS email_attempts;
-- ALTER TABLE notifications DROP COLUMN IF EXISTS email_sent_at;
-- COMMIT;

