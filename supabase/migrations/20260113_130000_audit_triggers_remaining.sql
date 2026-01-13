-- Task 1.1.1.5b: Apply audit triggers to all audited tables
-- This migration adds audit logging triggers to business-critical tables
-- that are not already covered by existing triggers.

-- ============================================================================
-- APPROVALS TABLE - Audit critical approval actions
-- ============================================================================
CREATE TRIGGER audit_approvals_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.approvals
  FOR EACH ROW EXECUTE FUNCTION public.audit_log_trigger();

-- ============================================================================
-- ATC_CODES TABLE - Audit regulatory reference data changes
-- ============================================================================
CREATE TRIGGER audit_atc_codes_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.atc_codes
  FOR EACH ROW EXECUTE FUNCTION public.audit_log_trigger();

-- ============================================================================
-- BREACH_ANALYSES TABLE - Audit compliance analysis changes
-- ============================================================================
CREATE TRIGGER audit_breach_analyses_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.breach_analyses
  FOR EACH ROW EXECUTE FUNCTION public.audit_log_trigger();

-- ============================================================================
-- FOLLOW_UPS TABLE - Audit governance action tracking
-- ============================================================================
CREATE TRIGGER audit_follow_ups_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.follow_ups
  FOR EACH ROW EXECUTE FUNCTION public.audit_log_trigger();

-- ============================================================================
-- MEETINGS TABLE - Audit governance meeting changes
-- ============================================================================
CREATE TRIGGER audit_meetings_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.meetings
  FOR EACH ROW EXECUTE FUNCTION public.audit_log_trigger();

-- ============================================================================
-- SYSTEM_CONFIG TABLE - Audit system configuration changes (critical)
-- ============================================================================
CREATE TRIGGER audit_system_config_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.system_config
  FOR EACH ROW EXECUTE FUNCTION public.audit_log_trigger();

-- ============================================================================
-- USERS TABLE - Audit user management changes
-- ============================================================================
CREATE TRIGGER audit_users_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.audit_log_trigger();

-- ============================================================================
-- Note: The following tables intentionally do NOT have audit triggers:
-- - audit_logs (would cause recursion)
-- - conversations, messages, message_attachments, message_read_receipts 
--   (high-volume communication data, would bloat audit log)
-- - conversation_participants (follows from conversations)
-- - notifications (transient data)
-- - meeting_attendees (follows from meetings trigger)
-- ============================================================================

COMMENT ON TRIGGER audit_approvals_trigger ON public.approvals IS 'Audit log for approval workflow changes';
COMMENT ON TRIGGER audit_atc_codes_trigger ON public.atc_codes IS 'Audit log for ATC code reference data changes';
COMMENT ON TRIGGER audit_breach_analyses_trigger ON public.breach_analyses IS 'Audit log for breach analysis changes';
COMMENT ON TRIGGER audit_follow_ups_trigger ON public.follow_ups IS 'Audit log for follow-up action tracking';
COMMENT ON TRIGGER audit_meetings_trigger ON public.meetings IS 'Audit log for governance meeting changes';
COMMENT ON TRIGGER audit_system_config_trigger ON public.system_config IS 'Audit log for system configuration changes (critical)';
COMMENT ON TRIGGER audit_users_trigger ON public.users IS 'Audit log for user management changes';
