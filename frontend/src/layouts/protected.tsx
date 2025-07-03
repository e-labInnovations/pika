import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import Logo from '@/components/logo';
import { useLookupStore } from '@/store/useLookupStore';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const dataLoading = useLookupStore((state) => state.loading);
  const location = useLocation();

  useEffect(() => {
    console.log('user', user);
    if (user) {
      console.log('fetching data');
      useLookupStore.getState().fetchAll();
    }
  }, [user]);

  useEffect(() => {
    console.log('loading', loading);
    console.log('dataLoading', dataLoading);
  }, [loading, dataLoading]);

  if (loading || dataLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex items-center justify-center p-8">
          <div className="animate-bounce">
            <Logo size={96} className="animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
