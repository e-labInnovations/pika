import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-slate-900 dark:text-white">404</h1>
        <div className="mt-4 space-y-2">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Page Not Found</h2>
          <p className="text-slate-500 dark:text-slate-400">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button variant="outline" onClick={() => navigate(-1)} className="w-full sm:w-auto">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Button onClick={() => navigate('/')} className="w-full sm:w-auto">
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
