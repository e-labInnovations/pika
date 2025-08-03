import type { Category, Account, Person, Tag } from '@/services/api';
import type { TransactionType } from '@/lib/transaction-utils';

export const queryUtils = {
  getCategoryById(categories: Category[], categoryId: string): Category | null {
    const allChildren = categories.flatMap((category) => category.children || []);
    return allChildren.find((child) => child.id === categoryId) || null;
  },

  getParentCategoryById(categories: Category[], categoryId: string): Category | null {
    const parent = categories.find((category) => category.children?.some((child) => child.id === categoryId));
    return parent || null;
  },

  getDefaultCategory(categories: Category[], type: TransactionType): Category | null {
    const allChildren = categories.flatMap((category) => category.children || []);
    return allChildren.find((category) => category.type === type) || null;
  },

  getAccountById(accounts: Account[], accountId: string): Account | null {
    return accounts.find((account) => account.id === accountId) || null;
  },

  getPersonById(people: Person[], personId: string): Person | null {
    return people.find((person) => person.id === personId) || null;
  },

  getTagById(tags: Tag[], tagId: string): Tag | null {
    return tags.find((tag) => tag.id === tagId) || null;
  },
};
