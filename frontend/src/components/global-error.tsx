import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface GlobalErrorProps {
  className?: string;
  title?: string;
  message?: string;
  onButtonClick?: () => void;
  icon?: React.ReactNode;
  buttonText?: string;
  buttonIcon?: React.ReactNode;
}

const GlobalError = ({
  className,
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  icon,
  onButtonClick,
  buttonText = 'Retry',
  buttonIcon = <RefreshCw className="h-4 w-4" />,
}: GlobalErrorProps) => {
  return (
    <div className={cn('flex w-full items-center justify-center', className)}>
      <div className="flex w-full flex-col items-center justify-center p-4 text-center">
        <div className="mb-4 flex items-center justify-center">
          {icon || <AlertTriangle className="text-destructive h-16 w-16" />}
        </div>

        <div className="text-foreground mb-2 text-xl font-semibold">{title}</div>

        <div className="text-muted-foreground mb-6 max-w-md text-sm">{message.replace(/<[^>]*>/g, '')}</div>

        {onButtonClick && (
          <Button onClick={onButtonClick} variant="outline" size="lg" className="gap-2">
            {buttonIcon}
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default GlobalError;
