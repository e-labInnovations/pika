import type { IconName } from 'lucide-react/dynamic';

export type TransactionType = 'income' | 'expense' | 'transfer';
export type SettingSection = {
  id: string;
  title: string;
  icon: IconName;
  description: string;
  link: string;
};
