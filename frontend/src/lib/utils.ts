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
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0];
  return parts[0][0] + parts[1][0];
}

export function getColorFromName(name: string): string {
  const colors = [
    'bg-red-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-yellow-500',
    'bg-pink-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-emerald-500',
    'bg-sky-500',
    'bg-indigo-500',
  ];

  const hash = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

export * from './async-handler';
