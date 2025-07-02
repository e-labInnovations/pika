import axios from 'axios';
import { useGlobalLoader } from '@/store/useGlobalLoader';
import { useGlobalErrorDialog } from '@/store/useGlobalErrorDialog';
import { toast } from 'sonner';

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
    let errorMessage = 'Something went wrong';

    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    options?.onError?.(errorMessage);
    open(errorMessage, 'Error');
  } finally {
    hideLoader();
    options?.finally?.();
  }
}
