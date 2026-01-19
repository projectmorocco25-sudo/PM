/**
 * Utility Functions
 * Task: 1.1.1.12c
 * 
 * Common utility functions for class name merging and other helpers
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
