import { create } from 'zustand';

interface GlobalErrorDialogState {
  isOpen: boolean;
  title?: string;
  message?: string;
  open: (message: string, title?: string) => void;
  close: () => void;
}

export const useGlobalErrorDialog = create<GlobalErrorDialogState>((set) => ({
  isOpen: false,
  title: 'Error',
  message: 'Something went wrong',
  open: (message, title) => set({ isOpen: true, message, title: title || 'Error' }),
  close: () => set({ isOpen: false, message: 'Something went wrong', title: 'Error' }),
}));
