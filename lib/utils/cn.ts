/**
 * Utility function to merge Tailwind CSS classes
 * 
 * Uses clsx and tailwind-merge to properly merge class names
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
