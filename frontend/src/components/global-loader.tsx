import { cn } from '@/lib/utils';
import Logo from './logo';

interface GlobalLoaderProps {
  className?: string;
}

const GlobalLoader = ({ className }: GlobalLoaderProps) => {
  return (
    <div className={cn('flex w-full items-center justify-center', className)}>
      <div className="flex w-full items-center justify-center p-8">
        <div className="animate-bounce">
          <Logo size={64} className="animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default GlobalLoader;
