import { BaseService } from './base.service';
import type { Category } from './categories.service';
import type { Account } from './accounts.service';
import type { TransactionType } from '@/lib/transaction-utils';
import type { Person } from './people.service';
import type { UploadResponse } from './upload.service';
import type { Tag } from './tags.service';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  type: TransactionType;
  category: Category;
  account: Account;
  person: Person;
  toAccount: Account | null;
  note: string;
  attachments: UploadResponse[];
  tags: Tag[];
}

export interface TransactionInput {
  title: string;
  amount: number;
  date: string;
  type: TransactionType;
  categoryId: string;
  accountId: string;
  personId: string | null;
  toAccountId: string | null;
  note: string;
  tags: string[];
  attachments: string[];
}

class TransactionService extends BaseService<Transaction> {
  constructor() {
    super('/transactions');
  }
}

export const transactionService = new TransactionService();
