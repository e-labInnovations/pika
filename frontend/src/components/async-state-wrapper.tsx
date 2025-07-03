import React from 'react';
import GlobalLoader from './global-loader';
import GlobalError from './global-error';
import { getErrorMessage, isNetworkError } from '@/lib/error-utils';
import { Globe } from 'lucide-react';

interface AsyncStateWrapperProps {
  isLoading: boolean;
  error?: unknown | null;
  onRetry?: () => void;
  children: React.ReactNode;
  className?: string;
}

const AsyncStateWrapper = ({ isLoading, error = null, onRetry, children, className }: AsyncStateWrapperProps) => {
  if (isLoading) {
    return <GlobalLoader className={className} />;
  }

  if (error) {
    const errorMessage = error ? getErrorMessage(error) : undefined;
    const errorIcon = isNetworkError(error) ? <Globe className="text-destructive h-16 w-16" /> : null;
    const errorTitle = isNetworkError(error) ? 'Network Error' : 'Error';

    return (
      <GlobalError
        title={errorTitle}
        message={errorMessage}
        icon={errorIcon}
        onReload={onRetry}
        className={className}
      />
    );
  }

  return <>{children}</>;
};

export default AsyncStateWrapper;
