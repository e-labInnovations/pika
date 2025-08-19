import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  categoryService,
  accountService,
  peopleService,
  tagsService,
  type CategoryInput,
  transactionsService,
  analyticsService,
  authService,
} from '@/services/api';
import {
  invalidateAccountRelatedQueries,
  invalidateCategoryRelatedQueries,
  invalidatePeopleRelatedQueries,
  invalidateTagRelatedQueries,
  queryKeys,
} from './query-utils';

/** ***************************************************************************
 *                                  Auth
 *************************************************************************** */
export function useAppInfo() {
  return useQuery({
    queryKey: [queryKeys.appInfo],
    queryFn: async () => {
      const response = await authService.getAppInfo();
      return response.data;
    },
  });
}

/** ***************************************************************************
 *                                  Categories
 *************************************************************************** */
export function useCategories() {
  return useQuery({
    queryKey: [queryKeys.categories],
    queryFn: async () => {
      const response = await categoryService.list();
      return response.data;
    },
  });
}

export function useCategoryMutations() {
  const queryClient = useQueryClient();

  const createCategory = useMutation({
    mutationFn: (data: CategoryInput) => categoryService.create(data),
    onSuccess: () => {
      invalidateCategoryRelatedQueries(queryClient);
    },
  });

  const updateCategory = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryInput }) => categoryService.update(id, data),
    onSuccess: () => {
      invalidateCategoryRelatedQueries(queryClient);
    },
  });

  const deleteCategory = useMutation({
    mutationFn: (id: string) => categoryService.delete(id),
    onSuccess: () => {
      invalidateCategoryRelatedQueries(queryClient);
    },
  });

  return {
    createCategory,
    updateCategory,
    deleteCategory,
  };
}

/** ***************************************************************************
 *                                  Accounts
 *************************************************************************** */
export function useAccounts() {
  return useQuery({
    queryKey: [queryKeys.accounts],
    queryFn: async () => {
      const response = await accountService.list();
      return response.data;
    },
  });
}

export function useAccountMutations() {
  const queryClient = useQueryClient();

  const createAccount = useMutation({
    mutationFn: (data: unknown) => accountService.create(data),
    onSuccess: () => {
      invalidateAccountRelatedQueries(queryClient);
    },
  });

  const updateAccount = useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => accountService.update(id, data),
    onSuccess: () => {
      invalidateAccountRelatedQueries(queryClient);
    },
  });

  const deleteAccount = useMutation({
    mutationFn: (id: string) => accountService.delete(id),
    onSuccess: () => {
      invalidateAccountRelatedQueries(queryClient);
    },
  });

  return {
    createAccount,
    updateAccount,
    deleteAccount,
  };
}

/** ***************************************************************************
 *                                  People
 *************************************************************************** */
export function usePeople() {
  return useQuery({
    queryKey: [queryKeys.people],
    queryFn: async () => {
      const response = await peopleService.list();
      return response.data;
    },
  });
}

export function usePeopleMutations() {
  const queryClient = useQueryClient();

  const createPerson = useMutation({
    mutationFn: (data: unknown) => peopleService.create(data),
    onSuccess: () => {
      invalidatePeopleRelatedQueries(queryClient);
    },
  });

  const updatePerson = useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => peopleService.update(id, data),
    onSuccess: () => {
      invalidatePeopleRelatedQueries(queryClient);
    },
  });

  const deletePerson = useMutation({
    mutationFn: (id: string) => peopleService.delete(id),
    onSuccess: () => {
      invalidatePeopleRelatedQueries(queryClient);
    },
  });

  return {
    createPerson,
    updatePerson,
    deletePerson,
  };
}

/** ***************************************************************************
 *                                  Tags
 *************************************************************************** */
export function useTags() {
  return useQuery({
    queryKey: [queryKeys.tags],
    queryFn: async () => {
      const response = await tagsService.list();
      return response.data;
    },
  });
}

export function useTagMutations() {
  const queryClient = useQueryClient();

  const createTag = useMutation({
    mutationFn: (data: unknown) => tagsService.create(data),
    onSuccess: () => {
      invalidateTagRelatedQueries(queryClient);
    },
  });

  const updateTag = useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => tagsService.update(id, data),
    onSuccess: () => {
      invalidateTagRelatedQueries(queryClient);
    },
  });

  const deleteTag = useMutation({
    mutationFn: (id: string) => tagsService.delete(id),
    onSuccess: () => {
      invalidateTagRelatedQueries(queryClient);
    },
  });

  return {
    createTag,
    updateTag,
    deleteTag,
  };
}

/** ***************************************************************************
 *                                  Transactions
 *************************************************************************** */
export function useTransactions() {
  return useQuery({
    queryKey: [queryKeys.transactions],
    queryFn: async () => {
      const response = await transactionsService.list();
      return response.data;
    },
  });
}

/** ***************************************************************************
 *                                  Analytics
 *************************************************************************** */
export const useCategorySpending = (month: number, year: number) => {
  return useQuery({
    queryKey: [queryKeys.categorySpending, month, year],
    queryFn: async () => {
      const response = await analyticsService.getCategorySpending(month, year);
      return response.data;
    },
    enabled: month > 0 && year > 2000 && month <= 12,
  });
};

export const usePeopleActivity = (month: number, year: number) => {
  return useQuery({
    queryKey: [queryKeys.peopleActivity, month, year],
    queryFn: async () => {
      const response = await analyticsService.getPeopleActivity(month, year);
      return response.data;
    },
    enabled: month > 0 && year > 2000 && month <= 12,
  });
};

export const useTagActivity = (month: number, year: number) => {
  return useQuery({
    queryKey: [queryKeys.tagActivity, month, year],
    queryFn: async () => {
      const response = await analyticsService.getTagActivity(month, year);
      return response.data;
    },
    enabled: month > 0 && year > 2000 && month <= 12,
  });
};

export const useMonthlySummary = (month: number, year: number) => {
  return useQuery({
    queryKey: [queryKeys.monthlySummary, month, year],
    queryFn: async () => {
      const response = await analyticsService.getMonthlySummary(month, year);
      return response.data;
    },
    enabled: month > 0 && year > 2000 && month <= 12,
  });
};

export const useDailySummaries = (month: number, year: number) => {
  return useQuery({
    queryKey: [queryKeys.dailySummaries, month, year],
    queryFn: async () => {
      const response = await analyticsService.getDailySummaries(month, year);
      return response.data;
    },
    enabled: month > 0 && year > 2000 && month <= 12,
  });
};

export const useWeeklyExpenses = () => {
  return useQuery({
    queryKey: [queryKeys.weeklyExpenses],
    queryFn: async () => {
      const response = await analyticsService.getWeeklyExpenses();
      return response.data;
    },
  });
};
