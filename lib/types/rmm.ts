/**
 * RMM Module - Shared Type Definitions
 * 
 * These types define the contracts between:
 * - Database Schema (PostgreSQL tables)
 * - Backend RPC Functions (PostgreSQL functions returning JSONB)
 * - Frontend Components (TypeScript/React)
 * 
 * IMPORTANT: These types MUST match the actual RPC function return structures.
 * When RPC functions change, these types MUST be updated accordingly.
 * 
 * Last Verified: 2026-01-25
 * Schema Version: migrations/20260122003829_create_rmm_tables.sql
 * RPC Version: migrations/20260125000000_create_rmm_overview_rpc_functions.sql
 */

// ============================================================================
// RMM Overview Page Types
// ============================================================================

/**
 * Statistics returned by rmm_get_statistics(user_id)
 * 
 * RPC Function: rmm_get_statistics
 * Database Tables: companies, products, skus
 * Role-based: Company users see own company only, MOH see all
 */
export interface RMMStatistics {
  companies: {
    total: number;
    active: number;
    inactive: number;
  };
  products: {
    total: number;
    active: number;
    inactive: number;
  };
  skus: {
    total: number;
    active: number;
    inactive: number;
  };
}

/**
 * Activity item returned by rmm_get_recent_activity(user_id, p_limit)
 * 
 * RPC Function: rmm_get_recent_activity
 * Database Tables: companies, products, skus, registry_submissions
 * Note: Returns array of activities, ordered by timestamp DESC
 */
export interface RMMActivity {
  type: string; // 'company_created' | 'product_created' | 'sku_created' | 'submission_approved' | 'submission_rejected' | 'submission_updated'
  description: string;
  entity_type: string; // 'company' | 'product' | 'sku'
  entity_id: string; // UUID as string
  timestamp: string; // ISO 8601 timestamp
  user_name: string | null; // Full name or email, or 'System' if no user found
}

/**
 * Enforcement action returned by rmm_get_enforcement_actions(user_id, company_id, p_limit)
 * 
 * RPC Function: rmm_get_enforcement_actions
 * Database Tables: enforcement_actions, companies
 * Role-based: Company users see own company only, MOH see all
 */
export interface RMMEnforcementAction {
  id: string; // UUID as string
  action_type: string; // 'warning' | 'fine' | 'suspension'
  violation_type: string;
  legal_basis: string;
  amount: number | null;
  currency: string;
  status: string; // 'executed' | 'appealed'
  required_action: string;
  executed_at: string | null; // ISO 8601 timestamp
  appeal_deadline: string | null; // ISO 8601 date (executed_at + 30 days)
  appeal_window_open: boolean;
  days_remaining: number | null; // Days until appeal deadline
  company_id: string; // UUID as string
  company_name: string;
}

/**
 * Submission deadline returned by rmm_get_submission_deadlines(user_id)
 * 
 * RPC Function: rmm_get_submission_deadlines
 * Database Tables: (calculated, not from direct table queries)
 * Role-based: Company users see own deadlines only
 */
export interface RMMSubmissionDeadline {
  submission_type: string; // 'Annual Registry' | 'Weekly Stock Report'
  due_date: string; // ISO 8601 date
  days_remaining: number;
  regulatory_reference: string; // e.g., 'DMP Art. 12'
  regulatory_description: string;
}

// ============================================================================
// RPC Function Parameter Types
// ============================================================================

/**
 * Parameters for rmm_get_statistics
 */
export interface RMMGetStatisticsParams {
  user_id: string; // UUID as string
}

/**
 * Parameters for rmm_get_recent_activity
 */
export interface RMMGetRecentActivityParams {
  user_id: string; // UUID as string
  p_limit?: number; // Default: 10, Min: 1, Max: 50
}

/**
 * Parameters for rmm_get_enforcement_actions
 */
export interface RMMGetEnforcementActionsParams {
  user_id: string; // UUID as string
  company_id?: string | null; // UUID as string, only used for MOH users
  p_limit?: number; // Default: 10, Min: 1, Max: 50
}

/**
 * Parameters for rmm_get_submission_deadlines
 */
export interface RMMGetSubmissionDeadlinesParams {
  user_id: string; // UUID as string
}

/**
 * Parameters for rmm_list_submissions
 * Note: This function uses auth.uid() internally, does NOT accept user_id parameter
 */
export interface RMMListSubmissionsParams {
  p_limit?: number; // Default: 100, Min: 1, Max: 1000
  p_offset?: number; // Default: 0, Min: 0
  p_status?: string | null; // Filter by status
  p_submission_type?: string | null; // Filter by submission_type
  p_entity_type?: string | null; // Filter by entity_type
  p_company_id?: string | null; // UUID as string, auto-set for company users
  p_search?: string | null; // Search term
  p_sort_by?: string; // Default: 'created_at', Options: 'created_at' | 'updated_at' | 'status' | 'submission_type' | 'entity_type'
  p_sort_order?: string; // Default: 'DESC', Options: 'ASC' | 'DESC'
}

/**
 * Response from rmm_list_submissions
 */
export interface RMMListSubmissionsResponse {
  data: any[]; // Array of submission objects (structure defined in rmm_list_submissions RPC)
  pagination: {
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
  };
}

// ============================================================================
// Database Schema Reference (for documentation)
// ============================================================================

/**
 * Database Schema Notes:
 * 
 * companies table:
 *   - Does NOT have created_by column
 *   - Has: id, name, registration_number, company_type, address, contact_email, contact_phone, is_active, created_at, updated_at
 * 
 * products table:
 *   - Does NOT have created_by column
 *   - Has: id, company_id, name, description, is_critical_medicine, is_active, created_at, updated_at
 * 
 * skus table:
 *   - Does NOT have created_by column
 *   - Has: id, product_id, sku_code, name, dosage_strength, dosage_form, pack_size, unit_of_measure, atc_code_id, is_active, created_at, updated_at
 * 
 * registry_submissions table:
 *   - Does NOT have company_id column directly
 *   - Company relationship determined through entity_type + entity_id:
 *     - entity_type = 'company' AND entity_id = company.id
 *     - entity_type = 'product' AND entity_id = product.id (then join through product.company_id)
 *     - entity_type = 'sku' AND entity_id = sku.id (then join through sku.product_id -> product.company_id)
 *   - Has: id, submission_type, entity_type, entity_id, submission_data, status, submitted_by, verified_by, approved_by, created_at, updated_at
 */
