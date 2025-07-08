import api from './axios';
import type { AxiosResponse } from 'axios';
import type { Category } from './categories.service';
import type { Person } from './people.service';
import type { Tag } from './tags.service';
import type { TransactionType } from '@/lib/transaction-utils';
import type { Account } from './accounts.service';

export interface AiResponse {
  contents: {
    parts: {
      text: string;
    }[];
  }[];
}

export interface AnalyzedTransactionData {
  amount: number;
  category: Category;
  date: string;
  note: string;
  person: Person | null;
  tags: Tag[];
  title: string;
  toAccount: Account | null;
  type: TransactionType;
  account: Account | null;
}

export const mockTransactionData: AnalyzedTransactionData = {
  amount: 1200,
  category: {
    id: '2',
    name: 'Sports',
    icon: 'volleyball',
    color: '#FFFFFF',
    bgColor: '#F56500',
    description: 'Sports and fitness expenses',
    isSystem: true,
    isParent: false,
    type: 'expense',
    parentId: '21',
    children: [],
  },
  date: '2023-04-14 00:00:00',
  note: '',
  person: null,
  tags: [],
  title: 'Boxing Gloves',
  toAccount: null,
  type: 'expense',
  account: null,
};

class AiService {
  test(): Promise<AxiosResponse<AiResponse>> {
    return api.get('/ai/test');
  }

  analyzeText(text: string): Promise<AxiosResponse<AnalyzedTransactionData>> {
    return api.post('/ai/text-to-transaction', { text });
  }
}

export const aiService = new AiService();
