import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useConfirmDialog } from '@/store/useConfirmDialog';

const GlobalConfirmDialog = () => {
  const { isOpen, title, message, onConfirm, onCancel, close } = useConfirmDialog();

  const handleConfirm = () => {
    onConfirm?.();
    close();
  };

  const handleCancel = () => {
    onCancel?.();
    close();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(v) => !v && handleCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">{title}</AlertDialogTitle>
          {message && <AlertDialogDescription className="text-left text-[15px]">{message}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row gap-2">
          <AlertDialogCancel onClick={handleCancel} className="w-1/2">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className="w-1/2">
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GlobalConfirmDialog;
