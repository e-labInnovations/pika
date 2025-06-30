import { format } from 'date-fns';
import type { IconName } from 'lucide-react/dynamic';
import type { Transaction, TransactionAccount, TransactionCategory, TransactionTag } from '@/data/dummy-data';

export type TransactionType = 'income' | 'expense' | 'transfer';

export type TransactionItemType = {
  id: TransactionType;
  name: string;
  description: string;
  color: string;
  bgColor: string;
  icon: IconName;
};

class TransactionUtils {
  amountColors = {
    income: 'text-emerald-600 dark:text-emerald-400',
    expense: 'text-red-600 dark:text-red-400',
    transfer: 'text-blue-600 dark:text-blue-400',
  };

  typesObject: Record<TransactionType, TransactionItemType> = Object.freeze({
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

  types: TransactionItemType[] = Object.values(this.typesObject);

  getBalanceColor = (balance: number) => {
    if (balance > 0) return 'text-emerald-600 dark:text-emerald-400';
    if (balance < 0) return 'text-red-500 dark:text-red-400';
    return 'text-slate-600 dark:text-slate-400';
  };

  getAmountColor = (type: string) => {
    return this.amountColors[type as keyof typeof this.amountColors] || 'text-slate-600 dark:text-slate-400';
  };

  formatDate = (date: string) => {
    return format(new Date(date), 'MMM d, yyyy');
  };

  formatTime = (date: string) => {
    return format(new Date(date), 'h:mm a');
  };

  formatDateTime = (date: string) => {
    return `${this.formatDate(date)} • ${this.formatTime(date)}`;
  };

  // Create initial balance transaction
  createInitialBalanceTransaction = (
    account: TransactionAccount,
    amount: number,
    initialBalanceCategory: TransactionCategory,
    initialBalanceTag: TransactionTag,
  ): Omit<Transaction, 'id'> => {
    const now = new Date().toISOString();

    return {
      title: `Initial Balance - ${account.name}`,
      amount: Math.abs(amount),
      date: now,
      type: amount >= 0 ? 'income' : 'expense',
      category: initialBalanceCategory,
      account: account,
      tags: [initialBalanceTag],
      note: `Initial balance for ${account.name}`,
    };
  };

  formatFileSize = (bytes: string) => {
    const bytesNumber = Number(bytes);
    if (bytesNumber === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytesNumber) / Math.log(k));
    return Number.parseFloat((bytesNumber / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
}

export default new TransactionUtils();
