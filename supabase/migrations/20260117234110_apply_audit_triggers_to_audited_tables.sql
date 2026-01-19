-- Migration: Apply audit triggers to all audited tables
-- Description: Apply audit logging triggers to all audited tables (RMM, VCI, Enforcement tables)
-- Date: 2026-01-17
-- Task: 1.1.1.5b
-- Author: Sami (Implementation Compliance Specialist)
-- Security Note: Triggers must be applied immediately after tables are created to ensure complete audit coverage from the first modification.

BEGIN;

-- ============================================
-- RMM TABLES - Audit Triggers
-- ============================================

-- Companies table
CREATE TRIGGER audit_companies_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.companies
FOR EACH ROW
EXECUTE FUNCTION public.audit_trigger_function();

-- Products table
CREATE TRIGGER audit_products_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.audit_trigger_function();

-- SKUs table
CREATE TRIGGER audit_skus_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.skus
FOR EACH ROW
EXECUTE FUNCTION public.audit_trigger_function();

-- Registry submissions table
CREATE TRIGGER audit_registry_submissions_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.registry_submissions
FOR EACH ROW
EXECUTE FUNCTION public.audit_trigger_function();

-- ============================================
-- VCI TABLES - Audit Triggers
-- ============================================

-- AAMS submissions table
CREATE TRIGGER audit_aams_submissions_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.aams_submissions
FOR EACH ROW
EXECUTE FUNCTION public.audit_trigger_function();

-- MSQ submissions table
CREATE TRIGGER audit_msq_submissions_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.msq_submissions
FOR EACH ROW
EXECUTE FUNCTION public.audit_trigger_function();

-- WSL submissions table
CREATE TRIGGER audit_wsl_submissions_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.wsl_submissions
FOR EACH ROW
EXECUTE FUNCTION public.audit_trigger_function();

-- Thresholds table
CREATE TRIGGER audit_thresholds_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.thresholds
FOR EACH ROW
EXECUTE FUNCTION public.audit_trigger_function();

-- Breaches table
CREATE TRIGGER audit_breaches_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.breaches
FOR EACH ROW
EXECUTE FUNCTION public.audit_trigger_function();

-- Breach analyses table
CREATE TRIGGER audit_breach_analyses_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.breach_analyses
FOR EACH ROW
EXECUTE FUNCTION public.audit_trigger_function();

-- ============================================
-- ENFORCEMENT TABLES - Audit Triggers
-- ============================================

-- Enforcement actions table
CREATE TRIGGER audit_enforcement_actions_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.enforcement_actions
FOR EACH ROW
EXECUTE FUNCTION public.audit_trigger_function();

COMMIT;
