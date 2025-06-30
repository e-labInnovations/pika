import type { TransactionType } from '@/lib/transaction-utils';
import { BaseService } from './base.service';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  description: string;
  isSystem: boolean;
  isParent: boolean;
  type: TransactionType;
  parentId: string | null;
  children: Category[];
}

export interface CategoryInput {
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  description: string;
  type: TransactionType;
  parentId: string | null;
}

class CategoryService extends BaseService<Category> {
  constructor() {
    super('/categories');
  }
}

export const categoryService = new CategoryService();
