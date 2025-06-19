import type { TransactionType } from '@/data/types';
import type { IconName } from 'lucide-react/dynamic';

export type TransactionItemType = {
  id: TransactionType;
  name: string;
  description: string;
  color: string;
  bgColor: string;
  icon: IconName;
};

export const transactionTypesObject: Record<TransactionType, TransactionItemType> = Object.freeze({
  income: {
    id: 'income',
    name: 'Income',
    description: 'Money received',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900',
    icon: 'arrow-down-left',
  },
  expense: {
    id: 'expense',
    name: 'Expense',
    description: 'Money spent',
    color: 'text-red-600',
    bgColor: 'bg-red-100 dark:bg-red-900',
    icon: 'arrow-up-right',
  },
  transfer: {
    id: 'transfer',
    name: 'Transfer',
    description: 'Money moved between accounts',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900',
    icon: 'arrow-right-left',
  },
});

export const transactionTypes: TransactionItemType[] = [
  transactionTypesObject.income,
  transactionTypesObject.expense,
  transactionTypesObject.transfer,
];
