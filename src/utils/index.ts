import { clsx, type ClassValue } from 'clsx';

// Utility function for combining class names
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
