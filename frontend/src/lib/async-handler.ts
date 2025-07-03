import { useGlobalLoader } from '@/store/useGlobalLoader';
import { useGlobalErrorDialog } from '@/store/useGlobalErrorDialog';
import { toast } from 'sonner';
import { getErrorMessage } from './error-utils';

export async function runWithLoaderAndError(
  asyncTask: () => Promise<void>,
  options?: {
    loaderMessage?: string;
    successMessage?: string;
    onSuccess?: () => void;
    onError?: (errorMessage: string) => void;
    finally?: () => void;
  },
) {
  const { showLoader, hideLoader } = useGlobalLoader.getState();
  const { open } = useGlobalErrorDialog.getState();

  try {
    if (options?.loaderMessage) showLoader(options.loaderMessage);

    await asyncTask();

    if (options?.successMessage) {
      toast.success(options.successMessage);
    }

    options?.onSuccess?.();
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);

    options?.onError?.(errorMessage);
    open(errorMessage, 'Error');
  } finally {
    hideLoader();
    options?.finally?.();
  }
}
