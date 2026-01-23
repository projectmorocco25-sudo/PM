/**
 * Module Constants
 * 
 * Module names matching the database schema system_config.module_name CHECK constraint.
 * These constants must match the database enum values exactly.
 * 
 * Database Schema: system_config.module_name CHECK constraint
 * Values: rmm, vci, ecs, cmc
 */

export const MODULES = {
  RMM: "rmm",
  VCI: "vci",
  ECS: "ecs",
  CMC: "cmc",
} as const;

export type Module = typeof MODULES[keyof typeof MODULES];

/**
 * Module display names
 */
export const MODULE_NAMES: Record<Module, { full: string; abbr: string }> = {
  [MODULES.RMM]: {
    full: "Registry Management",
    abbr: "RMM",
  },
  [MODULES.VCI]: {
    full: "Value Chain Intelligence",
    abbr: "VCI",
  },
  [MODULES.ECS]: {
    full: "Export Control System",
    abbr: "ECS",
  },
  [MODULES.CMC]: {
    full: "Compliance Monitoring Center",
    abbr: "CMC",
  },
};

/**
 * Module colors (for badges/indicators)
 */
export const MODULE_COLORS: Record<Module, string> = {
  [MODULES.RMM]: "bg-primary-500", // Blue
  [MODULES.VCI]: "bg-success-500", // Green
  [MODULES.ECS]: "bg-warning-500", // Amber
  [MODULES.CMC]: "bg-purple-500", // Purple (to be added to tailwind config)
};
