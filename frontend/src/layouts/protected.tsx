import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import Logo from '@/components/logo';
import { useCategories, useAccounts, usePeople, useTags, useAppInfo } from '@/hooks/queries';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Load all lookup data when user is authenticated
  const appInfoQuery = useAppInfo();
  const categoriesQuery = useCategories();
  const accountsQuery = useAccounts();
  const peopleQuery = usePeople();
  const tagsQuery = useTags();

  // Check if any of the critical data is still loading
  const dataLoading =
    user &&
    (categoriesQuery.isLoading ||
      accountsQuery.isLoading ||
      peopleQuery.isLoading ||
      tagsQuery.isLoading ||
      appInfoQuery.isLoading);

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
