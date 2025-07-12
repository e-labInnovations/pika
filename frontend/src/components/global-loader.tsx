import { cn } from '@/lib/utils';
import Logo from './logo';

interface GlobalLoaderProps {
  className?: string;
}

const GlobalLoader = ({ className }: GlobalLoaderProps) => {
  return (
    <div className={cn('flex h-full w-full items-center justify-center p-8', className)}>
      <div className="animate-bounce">
        <Logo size={64} className="animate-pulse" />
      </div>
    </div>
  );
};

export default GlobalLoader;
