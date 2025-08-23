import type { Category, Account, Person, Tag, AppLists } from '@/services/api';
import type { TransactionType } from '@/lib/transaction-utils';
import type { QueryClient } from '@tanstack/react-query';

export const queryKeys = {
  appInfo: 'app-info',
  appLists: 'app-lists',
  categories: 'categories',
  accounts: 'accounts',
  people: 'people',
  tags: 'tags',
  transactions: 'transactions',
  tagActivity: 'tag-activity',
  categorySpending: 'category-spending',
  peopleActivity: 'people-activity',
  monthlySummary: 'monthly-summary',
  dailySummaries: 'daily-summaries',
  weeklyExpenses: 'weekly-expenses',
} as const;

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

export function hydrateLists(queryClient: QueryClient, data: AppLists) {
  queryClient.setQueryData([queryKeys.categories], data.categories);
  queryClient.setQueryData([queryKeys.accounts], data.accounts);
  queryClient.setQueryData([queryKeys.people], data.people);
  queryClient.setQueryData([queryKeys.tags], data.tags);
}

export const invalidateTxRelatedQueries = (queryClient: QueryClient) => {
  const date = new Date();
  const currentMonth = date.getMonth() + 1;
  const currentYear = date.getFullYear();

  const queriesWithMonth = [
    queryKeys.tagActivity,
    queryKeys.categorySpending,
    queryKeys.peopleActivity,
    queryKeys.monthlySummary,
    queryKeys.dailySummaries,
  ];

  const otherQueries = [queryKeys.transactions, queryKeys.weeklyExpenses];

  const queries = [...queriesWithMonth, ...otherQueries];

  // Optional: Invalidate active queries (for fast UI response)
  queries.forEach((query) => {
    queryClient.invalidateQueries({ queryKey: [query], refetchType: 'active' });
  });

  // Force refetch of specific queries with month/year immediately
  queriesWithMonth.forEach((key) => {
    queryClient.refetchQueries({
      queryKey: [key, currentMonth, currentYear],
      type: 'all', // active + inactive
    });
  });

  // Force refetch of some flat queries immediately
  otherQueries.forEach((key) => {
    queryClient.refetchQueries({
      queryKey: [key],
      type: 'all', // active + inactive
    });
  });
};

export const invalidatePeopleRelatedQueries = (queryClient: QueryClient) => {
  const queries = [queryKeys.peopleActivity, queryKeys.transactions];
  queries.forEach((query) => {
    queryClient.invalidateQueries({ queryKey: [query] });
  });

  queryClient.refetchQueries({
    queryKey: [queryKeys.people],
    type: 'all', // active + inactive
  });
};

export const invalidateCategoryRelatedQueries = (queryClient: QueryClient) => {
  const queries = [queryKeys.categorySpending, queryKeys.transactions];
  queries.forEach((query) => {
    queryClient.invalidateQueries({ queryKey: [query] });
  });

  queryClient.refetchQueries({
    queryKey: [queryKeys.categories],
    type: 'all', // active + inactive
  });
};

export const invalidateTagRelatedQueries = (queryClient: QueryClient) => {
  const queries = [queryKeys.tagActivity, queryKeys.transactions];
  queries.forEach((query) => {
    queryClient.invalidateQueries({ queryKey: [query] });
  });

  queryClient.refetchQueries({
    queryKey: [queryKeys.tags],
    type: 'all', // active + inactive
  });
};

export const invalidateAccountRelatedQueries = (queryClient: QueryClient) => {
  const queries = [queryKeys.transactions];
  queries.forEach((query) => {
    queryClient.invalidateQueries({ queryKey: [query] });
  });

  queryClient.refetchQueries({
    queryKey: [queryKeys.accounts],
    type: 'all', // active + inactive
  });
};
