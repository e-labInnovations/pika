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
