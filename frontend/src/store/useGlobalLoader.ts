import { create } from 'zustand';

interface GlobalLoaderState {
  isLoading: boolean;
  message?: string;
  showLoader: (message?: string) => void;
  hideLoader: () => void;
}

export const useGlobalLoader = create<GlobalLoaderState>((set) => ({
  isLoading: false,
  message: '',
  showLoader: (message) => set({ isLoading: true, message }),
  hideLoader: () => set({ isLoading: false, message: '' }),
}));
