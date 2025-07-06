import { create } from 'zustand';
import {
  tagsService,
  categoryService,
  accountService,
  peopleService,
  type Tag,
  type Category,
  type Account,
  type Person,
} from '@/services/api';
import type { TransactionType } from '@/lib/transaction-utils';

interface LookupState {
  tags: Tag[];
  categories: Category[];
  accounts: Account[];
  people: Person[];
  loading: boolean;

  fetchTags: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchAccounts: () => Promise<void>;
  fetchPeople: () => Promise<void>;
  fetchAll: () => Promise<void>;
}

export const useLookupStore = create<LookupState>((set) => ({
  tags: [],
  categories: [],
  accounts: [],
  people: [],
  loading: false,

  async fetchTags() {
    const res = await tagsService.list();
    set({ tags: res.data });
  },

  async fetchCategories() {
    const res = await categoryService.list();
    set({ categories: res.data });
  },

  async fetchAccounts() {
    const res = await accountService.list();
    set({ accounts: res.data });
  },

  async fetchPeople() {
    const res = await peopleService.list();
    set({ people: res.data });
  },

  async fetchAll() {
    set({ loading: true });
    const [tagsRes, catRes, accRes, peopleRes] = await Promise.all([
      tagsService.list(),
      categoryService.list(),
      accountService.list(),
      peopleService.list(),
    ]);
    set({
      tags: tagsRes.data,
      categories: catRes.data,
      accounts: accRes.data,
      people: peopleRes.data,
    });
    set({ loading: false });
  },
}));

export const storeUtils = {
  getCategoryById(categoryId: string): Category | null {
    const categories = useLookupStore.getState().categories;
    const allChildren = categories.flatMap((category) => category.children || []);
    return allChildren.find((child) => child.id === categoryId) || null;
  },

  getParentCategoryById(categoryId: string): Category | null {
    const categories = useLookupStore.getState().categories;
    const parent = categories.find((category) => category.children?.some((child) => child.id === categoryId));
    return parent || null;
  },

  getDefaultCategory(type: TransactionType): Category | null {
    const categories = useLookupStore.getState().categories.flatMap((category) => category.children || []);
    return categories.find((category) => category.type === type) || null;
  },

  getAccountById(accountId: string): Account | null {
    const accounts = useLookupStore.getState().accounts;
    return accounts.find((account) => account.id === accountId) || null;
  },

  getPersonById(personId: string): Person | null {
    const people = useLookupStore.getState().people;
    return people.find((person) => person.id === personId) || null;
  },

  getTagById(tagId: string): Tag | null {
    const tags = useLookupStore.getState().tags;
    return tags.find((tag) => tag.id === tagId) || null;
  },
};
