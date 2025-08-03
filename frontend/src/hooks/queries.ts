import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  categoryService,
  accountService,
  peopleService,
  tagsService,
  type Category,
  type Account,
  type Person,
  type Tag,
  type CategoryInput,
} from '@/services/api';
import type { TransactionType } from '@/lib/transaction-utils';

// Query Keys
export const queryKeys = {
  categories: ['categories'] as const,
  accounts: ['accounts'] as const,
  people: ['people'] as const,
  tags: ['tags'] as const,
  // For future use
  transactions: ['transactions'] as const,
  analytics: ['analytics'] as const,
};

// Categories
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
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
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });

  const updateCategory = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryInput }) => categoryService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: (id: string) => categoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });

  return {
    createCategory,
    updateCategory,
    deleteCategory,
  };
}

// Accounts
export function useAccounts() {
  return useQuery({
    queryKey: queryKeys.accounts,
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
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
    },
  });

  const updateAccount = useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => accountService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
    },
  });

  const deleteAccount = useMutation({
    mutationFn: (id: string) => accountService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
    },
  });

  return {
    createAccount,
    updateAccount,
    deleteAccount,
  };
}

// People
export function usePeople() {
  return useQuery({
    queryKey: queryKeys.people,
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
      queryClient.invalidateQueries({ queryKey: queryKeys.people });
    },
  });

  const updatePerson = useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => peopleService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.people });
    },
  });

  const deletePerson = useMutation({
    mutationFn: (id: string) => peopleService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.people });
    },
  });

  return {
    createPerson,
    updatePerson,
    deletePerson,
  };
}

// Tags
export function useTags() {
  return useQuery({
    queryKey: queryKeys.tags,
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
      queryClient.invalidateQueries({ queryKey: queryKeys.tags });
    },
  });

  const updateTag = useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => tagsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tags });
    },
  });

  const deleteTag = useMutation({
    mutationFn: (id: string) => tagsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tags });
    },
  });

  return {
    createTag,
    updateTag,
    deleteTag,
  };
}

// Utility functions (similar to storeUtils from useLookupStore)
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
