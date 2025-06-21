import type { IconName } from 'lucide-react/dynamic';

export type SettingSection = {
  id: string;
  title: string;
  icon: IconName;
  description: string;
  link: string;
  bgColor: string; // bg-emerald-900 dark:bg-emerald-950
  iconColor: string; // hex color
};

export const settingSections: SettingSection[] = [
  {
    id: 'categories',
    title: 'Categories',
    icon: 'folder',
    description: 'Manage income and expense categories',
    link: '/settings/categories',
    bgColor: '',
    iconColor: '#10b981',
  },
  {
    id: 'tags',
    title: 'Tags',
    icon: 'tag',
    description: 'Organize transactions with tags',
    link: '/settings/tags',
    bgColor: '',
    iconColor: '#3b82f6',
  },
  {
    id: 'accounts',
    title: 'Accounts',
    icon: 'wallet',
    description: 'Manage your bank accounts and wallets',
    link: '/settings/accounts',
    bgColor: '',
    iconColor: '#f59e0b',
  },
  {
    id: 'currency',
    title: 'Currency',
    icon: 'dollar-sign',
    description: 'Set your default currency',
    link: '/settings/currency',
    bgColor: '',
    iconColor: '#22c55e',
  },
  {
    id: 'general',
    title: 'General Settings',
    icon: 'settings',
    description: 'App preferences and behavior',
    link: '/settings/general',
    bgColor: '',
    iconColor: '#6b7280',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: 'bell',
    description: 'Manage notification preferences',
    link: '/settings/notifications',
    bgColor: '',
    iconColor: '#8b5cf6',
  },
  {
    id: 'security',
    title: 'Security & Privacy',
    icon: 'shield',
    description: 'Security settings and data privacy',
    link: '/settings/security',
    bgColor: '',
    iconColor: '#ef4444',
  },
  {
    id: 'profile',
    title: 'Profile',
    icon: 'user',
    description: 'Personal information and preferences',
    link: '/settings/profile',
    bgColor: '',
    iconColor: '#06b6d4',
  },
];
