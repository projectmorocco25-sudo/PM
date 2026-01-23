/**
 * User Role Constants
 * 
 * Role constants matching the database schema users.role CHECK constraint.
 * These constants must match the database enum values exactly.
 * 
 * Database Schema: users.role CHECK constraint
 * Values: tier1, tier2_officer, tier2_registrar, company_admin, company_manager, company_user, auditor, system_admin, vendor
 */

export const ROLES = {
  // MOH Roles
  TIER1: "tier1",
  TIER2_OFFICER: "tier2_officer",
  TIER2_REGISTRAR: "tier2_registrar",
  AUDITOR: "auditor",
  
  // Company Roles
  COMPANY_ADMIN: "company_admin",
  COMPANY_MANAGER: "company_manager",
  COMPANY_USER: "company_user",
  
  // System Roles
  SYSTEM_ADMIN: "system_admin",
  
  // Other Roles
  VENDOR: "vendor",
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

/**
 * Check if role is MOH role
 */
export function isMohRole(role: Role | null | undefined): boolean {
  if (!role) return false;
  return [
    ROLES.TIER1,
    ROLES.TIER2_OFFICER,
    ROLES.TIER2_REGISTRAR,
    ROLES.AUDITOR,
  ].includes(role as Role);
}

/**
 * Check if role is company role
 */
export function isCompanyRole(role: Role | null | undefined): boolean {
  if (!role) return false;
  return [
    ROLES.COMPANY_ADMIN,
    ROLES.COMPANY_MANAGER,
    ROLES.COMPANY_USER,
  ].includes(role as Role);
}

/**
 * Check if role has enforcement access (MOH Tier 1 & Tier 2 only)
 */
export function hasEnforcementAccess(role: Role | null | undefined): boolean {
  if (!role) return false;
  return [
    ROLES.TIER1,
    ROLES.TIER2_OFFICER,
    ROLES.TIER2_REGISTRAR,
  ].includes(role as Role);
}
