import { create } from 'zustand';

interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  open: (options: { title: string; message: string; onConfirm: () => void; onCancel?: () => void }) => void;
  close: () => void;
}

export const useConfirmDialog = create<ConfirmDialogState>((set) => ({
  isOpen: false,
  title: '',
  message: '',
  onConfirm: undefined,
  onCancel: undefined,
  open: ({ title, message, onConfirm, onCancel }) =>
    set({
      isOpen: true,
      title,
      message,
      onConfirm,
      onCancel,
    }),
  close: () =>
    set({
      isOpen: false,
      title: '',
      message: '',
      onConfirm: undefined,
      onCancel: undefined,
    }),
}));
