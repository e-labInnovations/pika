import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useGlobalErrorDialog } from '@/store/useGlobalErrorDialog';
import { DynamicIcon } from '@/components/lucide';

const GlobalErrorDialog = () => {
  const { isOpen, title, message, close } = useGlobalErrorDialog();

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-sm rounded-lg border-none">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DynamicIcon name="alert-triangle" className="text-destructive h-5 w-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="text-muted-foreground text-sm">{message?.replace(/<[^>]*>/g, '')}</div>

        <DialogFooter>
          <Button onClick={close}>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalErrorDialog;
