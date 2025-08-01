import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useGlobalLoader } from '@/store/useGlobalLoader';
import Logo from './logo';

const GlobalDialogLoader = () => {
  const { isLoading, message } = useGlobalLoader();

  return (
    <Dialog open={isLoading}>
      <DialogContent
        showCloseButton={false}
        className="flex max-w-1/2 flex-col items-center justify-center gap-4 rounded-lg border-none py-8 text-center"
      >
        <Logo size={64} className="animate-pulse" />
        <div className="text-sm font-medium">{message || 'Loading...'}</div>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalDialogLoader;
