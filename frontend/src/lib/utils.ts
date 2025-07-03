import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get initials from a name
 * @param name - The name to get initials from
 * @returns The initials
 */
export function getInitials(name: string): string {
  if (!name) return '?';
  const initials = name.split(' ').map((n) => n[0]);
  const initialsString =
    initials.length > 1 ? `${initials[0]}${initials[initials.length - 1]}`.toUpperCase() : initials[0].toUpperCase();
  return initialsString;
}

export * from './async-handler';
