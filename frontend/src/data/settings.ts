import type { SettingSection } from './types';

export const settingSections: SettingSection[] = [
  {
    id: 'categories',
    title: 'Categories',
    icon: 'folder',
    description: 'Manage income and expense categories',
    link: '/settings/categories',
  },
  {
    id: 'tags',
    title: 'Tags',
    icon: 'tag',
    description: 'Organize transactions with tags',
    link: '/settings/tags',
  },
  {
    id: 'accounts',
    title: 'Accounts',
    icon: 'wallet',
    description: 'Manage your bank accounts and wallets',
    link: '/settings/accounts',
  },
  {
    id: 'general',
    title: 'General Settings',
    icon: 'settings',
    description: 'App preferences and behavior',
    link: '/settings/general',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: 'bell',
    description: 'Manage notification preferences',
    link: '/settings/notifications',
  },
  {
    id: 'security',
    title: 'Security & Privacy',
    icon: 'shield',
    description: 'Security settings and data privacy',
    link: '/settings/security',
  },
  {
    id: 'profile',
    title: 'Profile',
    icon: 'user',
    description: 'Personal information and preferences',
    link: '/settings/profile',
  },
];
