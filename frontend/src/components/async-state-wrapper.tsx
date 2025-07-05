import React from 'react';
import GlobalLoader from './global-loader';
import GlobalError from './global-error';
import { getErrorMessage, isNetworkError } from '@/lib/error-utils';
import { ArrowLeft, Globe, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface AsyncStateWrapperProps {
  isLoading: boolean;
  error?: unknown | null;
  onRetry?: () => void;
  linkBackward?: string;
  children: React.ReactNode;
  className?: string;
}

const AsyncStateWrapper = ({
  isLoading,
  error = null,
  linkBackward,
  children,
  className,
  onRetry,
}: AsyncStateWrapperProps) => {
  const navigate = useNavigate();
  if (isLoading) {
    return <GlobalLoader className={cn('h-full flex-1', className)} />;
  }

  if (error) {
    const errorMessage = error ? getErrorMessage(error) : undefined;
    const errorIcon = isNetworkError(error) ? <Globe className="text-destructive h-16 w-16" /> : null;
    const errorTitle = isNetworkError(error) ? 'Network Error' : 'Error';
    const errorButtonText = isNetworkError(error) ? 'Retry' : 'Go Back';
    const goBack = () => navigate(linkBackward || '/', { replace: true });
    const errorButtonClick = isNetworkError(error) ? goBack : onRetry;
    const errorButtonIcon = isNetworkError(error) ? (
      <RefreshCw className="h-4 w-4" />
    ) : (
      <ArrowLeft className="h-4 w-4" />
    );

    return (
      <GlobalError
        title={errorTitle}
        message={errorMessage}
        icon={errorIcon}
        onButtonClick={errorButtonClick}
        buttonText={errorButtonText}
        buttonIcon={errorButtonIcon}
        className={cn('h-full flex-1', className)}
      />
    );
  }

  return <>{children}</>;
};

export default AsyncStateWrapper;
