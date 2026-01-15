-- Migration: apply_audit_triggers_all_tables
-- Description: Attach audit_log_trigger() to all audited tables (core + comms + governance + RMM + VCI)
-- Date: 2025-01-12
-- Author: Nadia
-- Phase: 1.1.1
-- Task: 1.1.1.5b
-- Depends on: 20250112203000_audit_logging_trigger_infrastructure, 20250112204000_create_rmm_tables, 20250112205000_create_vci_tables

BEGIN;

-- Core tables
DROP TRIGGER IF EXISTS trg_audit_users ON users;
CREATE TRIGGER trg_audit_users
AFTER INSERT OR UPDATE OR DELETE ON users
FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

DROP TRIGGER IF EXISTS trg_audit_system_config ON system_config;
CREATE TRIGGER trg_audit_system_config
AFTER INSERT OR UPDATE OR DELETE ON system_config
FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

DROP TRIGGER IF EXISTS trg_audit_notifications ON notifications;
CREATE TRIGGER trg_audit_notifications
AFTER INSERT OR UPDATE OR DELETE ON notifications
FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

DROP TRIGGER IF EXISTS trg_audit_approvals ON approvals;
CREATE TRIGGER trg_audit_approvals
AFTER INSERT OR UPDATE OR DELETE ON approvals
FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

-- Communication tables
DROP TRIGGER IF EXISTS trg_audit_conversations ON conversations;
CREATE TRIGGER trg_audit_conversations
AFTER INSERT OR UPDATE OR DELETE ON conversations
FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

DROP TRIGGER IF EXISTS trg_audit_conversation_participants ON conversation_participants;
CREATE TRIGGER trg_audit_conversation_participants
AFTER INSERT OR UPDATE OR DELETE ON conversation_participants
FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

DROP TRIGGER IF EXISTS trg_audit_messages ON messages;
CREATE TRIGGER trg_audit_messages
AFTER INSERT OR UPDATE OR DELETE ON messages
FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

DROP TRIGGER IF EXISTS trg_audit_message_attachments ON message_attachments;
CREATE TRIGGER trg_audit_message_attachments
AFTER INSERT OR UPDATE OR DELETE ON message_attachments
FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

DROP TRIGGER IF EXISTS trg_audit_message_read_receipts ON message_read_receipts;
CREATE TRIGGER trg_audit_message_read_receipts
AFTER INSERT OR UPDATE OR DELETE ON message_read_receipts
FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

-- Governance tables
DROP TRIGGER IF EXISTS trg_audit_follow_ups ON follow_ups;
CREATE TRIGGER trg_audit_follow_ups
AFTER INSERT OR UPDATE OR DELETE ON follow_ups
FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

DROP TRIGGER IF EXISTS trg_audit_meetings ON meetings;
CREATE TRIGGER trg_audit_meetings
AFTER INSERT OR UPDATE OR DELETE ON meetings
FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

DROP TRIGGER IF EXISTS trg_audit_meeting_attendees ON meeting_attendees;
CREATE TRIGGER trg_audit_meeting_attendees
AFTER INSERT OR UPDATE OR DELETE ON meeting_attendees
FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

-- RMM tables
DROP TRIGGER IF EXISTS trg_audit_companies ON companies;
CREATE TRIGGER trg_audit_companies
AFTER INSERT OR UPDATE OR DELETE ON companies
FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

DROP TRIGGER IF EXISTS trg_audit_products ON products;
CREATE TRIGGER trg_audit_products
AFTER INSERT OR UPDATE OR DELETE ON products
FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

DROP TRIGGER IF EXISTS trg_audit_skus ON skus;
CREATE TRIGGER trg_audit_skus
AFTER INSERT OR UPDATE OR DELETE ON skus
FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

DROP TRIGGER IF EXISTS trg_audit_atc_codes ON atc_codes;
CREATE TRIGGER trg_audit_atc_codes
AFTER INSERT OR UPDATE OR DELETE ON atc_codes
FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

DROP TRIGGER IF EXISTS trg_audit_critical_medicines ON critical_medicines;
CREATE TRIGGER trg_audit_critical_medicines
AFTER INSERT OR UPDATE OR DELETE ON critical_medicines
FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

-- VCI tables
DROP TRIGGER IF EXISTS trg_audit_aams_submissions ON aams_submissions;
CREATE TRIGGER trg_audit_aams_submissions
AFTER INSERT OR UPDATE OR DELETE ON aams_submissions
FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

DROP TRIGGER IF EXISTS trg_audit_msq_submissions ON msq_submissions;
CREATE TRIGGER trg_audit_msq_submissions
AFTER INSERT OR UPDATE OR DELETE ON msq_submissions
FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

DROP TRIGGER IF EXISTS trg_audit_wsl_submissions ON wsl_submissions;
CREATE TRIGGER trg_audit_wsl_submissions
AFTER INSERT OR UPDATE OR DELETE ON wsl_submissions
FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

DROP TRIGGER IF EXISTS trg_audit_thresholds ON thresholds;
CREATE TRIGGER trg_audit_thresholds
AFTER INSERT OR UPDATE OR DELETE ON thresholds
FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

DROP TRIGGER IF EXISTS trg_audit_breaches ON breaches;
CREATE TRIGGER trg_audit_breaches
AFTER INSERT OR UPDATE OR DELETE ON breaches
FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

DROP TRIGGER IF EXISTS trg_audit_breach_analyses ON breach_analyses;
CREATE TRIGGER trg_audit_breach_analyses
AFTER INSERT OR UPDATE OR DELETE ON breach_analyses
FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

COMMIT;

