/**
 * Validation Utilities for Edge Functions
 * 
 * This module provides common validation helpers for Edge Functions.
 * 
 * Usage:
 *   import { validateUUID, validateEmail, validateRequired } from '../_shared/validation.ts';
 */

/**
 * Validation error structure
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Validates a UUID string
 */
export function isValidUUID(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

/**
 * Validates an email address
 */
export function isValidEmail(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

/**
 * Validates a non-empty string
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validates a positive integer
 */
export function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0;
}

/**
 * Validates a non-negative integer
 */
export function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}

/**
 * Validates a date string (ISO 8601 format)
 */
export function isValidDateString(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  
  const date = new Date(value);
  return !isNaN(date.getTime());
}

/**
 * Validates a value is in an array of allowed values
 */
export function isOneOf<T>(value: unknown, allowedValues: readonly T[]): value is T {
  return allowedValues.includes(value as T);
}

/**
 * Schema validator for request body validation
 */
export interface FieldSchema {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'uuid' | 'email' | 'date';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  enum?: readonly unknown[];
  items?: FieldSchema;
  nullable?: boolean;
}

export type Schema = Record<string, FieldSchema>;

/**
 * Validates a value against a field schema
 */
function validateField(
  fieldName: string,
  value: unknown,
  schema: FieldSchema
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Handle null/undefined
  if (value === null || value === undefined) {
    if (schema.required) {
      errors.push({ field: fieldName, message: `${fieldName} is required` });
    }
    return errors;
  }

  // Type-specific validation
  switch (schema.type) {
    case 'string':
      if (typeof value !== 'string') {
        errors.push({ field: fieldName, message: `${fieldName} must be a string` });
      } else {
        if (schema.minLength && value.length < schema.minLength) {
          errors.push({
            field: fieldName,
            message: `${fieldName} must be at least ${schema.minLength} characters`,
          });
        }
        if (schema.maxLength && value.length > schema.maxLength) {
          errors.push({
            field: fieldName,
            message: `${fieldName} must be at most ${schema.maxLength} characters`,
          });
        }
      }
      break;

    case 'number':
      if (typeof value !== 'number' || isNaN(value)) {
        errors.push({ field: fieldName, message: `${fieldName} must be a number` });
      } else {
        if (schema.minimum !== undefined && value < schema.minimum) {
          errors.push({
            field: fieldName,
            message: `${fieldName} must be at least ${schema.minimum}`,
          });
        }
        if (schema.maximum !== undefined && value > schema.maximum) {
          errors.push({
            field: fieldName,
            message: `${fieldName} must be at most ${schema.maximum}`,
          });
        }
      }
      break;

    case 'boolean':
      if (typeof value !== 'boolean') {
        errors.push({ field: fieldName, message: `${fieldName} must be a boolean` });
      }
      break;

    case 'uuid':
      if (!isValidUUID(value)) {
        errors.push({ field: fieldName, message: `${fieldName} must be a valid UUID` });
      }
      break;

    case 'email':
      if (!isValidEmail(value)) {
        errors.push({ field: fieldName, message: `${fieldName} must be a valid email` });
      }
      break;

    case 'date':
      if (!isValidDateString(value)) {
        errors.push({ field: fieldName, message: `${fieldName} must be a valid date` });
      }
      break;

    case 'array':
      if (!Array.isArray(value)) {
        errors.push({ field: fieldName, message: `${fieldName} must be an array` });
      } else if (schema.items) {
        value.forEach((item, index) => {
          errors.push(
            ...validateField(`${fieldName}[${index}]`, item, schema.items!)
          );
        });
      }
      break;

    case 'object':
      if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        errors.push({ field: fieldName, message: `${fieldName} must be an object` });
      }
      break;
  }

  // Enum validation
  if (schema.enum && !schema.enum.includes(value)) {
    errors.push({
      field: fieldName,
      message: `${fieldName} must be one of: ${schema.enum.join(', ')}`,
    });
  }

  return errors;
}

/**
 * Validates a data object against a schema
 * 
 * @param data - The data object to validate
 * @param schema - The schema to validate against
 * @returns Validation result with errors if any
 */
export function validateSchema(
  data: Record<string, unknown>,
  schema: Schema
): ValidationResult {
  const errors: ValidationError[] = [];

  for (const [fieldName, fieldSchema] of Object.entries(schema)) {
    errors.push(...validateField(fieldName, data[fieldName], fieldSchema));
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Common validation schemas for reuse
 */
export const CommonSchemas = {
  uuid: { type: 'uuid' as const, required: true },
  optionalUuid: { type: 'uuid' as const, required: false, nullable: true },
  email: { type: 'email' as const, required: true },
  requiredString: { type: 'string' as const, required: true, minLength: 1 },
  optionalString: { type: 'string' as const, required: false, nullable: true },
  positiveNumber: { type: 'number' as const, required: true, minimum: 1 },
  nonNegativeNumber: { type: 'number' as const, required: true, minimum: 0 },
  date: { type: 'date' as const, required: true },
  optionalDate: { type: 'date' as const, required: false, nullable: true },
};
