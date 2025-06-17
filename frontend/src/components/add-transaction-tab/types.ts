import type { TransactionType } from '@/data/types';

export type Attachment = {
  id: string;
  name: string;
  type: 'image' | 'pdf';
  url: string;
  size: number;
};

export type TransactionFormData = {
  title: string;
  amount: number;
  date: string;
  type: TransactionType;
  category: string;
  account: string | null;
  toAccount: string | null;
  person: string | null;
  tags: string[];
  note: string;
};
