import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import { useTitle } from '@/hooks/use-title';
import { useAppInfo } from '@/hooks/queries';
import AsyncStateWrapper from '@/components/async-state-wrapper';
import { useAuth } from '@/hooks/use-auth';
import { Navigate } from 'react-router-dom';

export default function Login() {
  const [loading, setLoading] = useState(false);
  useTitle('Login');
  const appInfoQuery = useAppInfo();
  const { user } = useAuth();

  const handleWordPressLogin = () => {
    setLoading(true);

    // Determine the base URL based on environment
    const isDev = import.meta.env.DEV;
    const baseUrl = isDev ? 'http://localhost:8000' : appInfoQuery.data?.base_url || window.location.origin;

    // Construct the authorization URL
    const authUrl =
      `${baseUrl}/wp-admin/authorize-application.php?` +
      new URLSearchParams({
        app_name: appInfoQuery.data?.name || 'Pika',
        app_id: appInfoQuery.data?.app_id || '',
        success_url: `${window.location.origin}/pika/authorize`,
        reject_url: `${window.location.origin}/pika/reject-auth`,
      });

    // Redirect to WordPress authorization
    window.location.href = authUrl;
  };

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <AsyncStateWrapper
      isLoading={appInfoQuery.isLoading}
      error={appInfoQuery.error}
      onRetry={() => appInfoQuery.refetch()}
      className="min-h-screen"
    >
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100 px-4 dark:from-slate-900 dark:via-slate-950 dark:to-emerald-900">
        <Card className="mx-auto w-full max-w-md border-emerald-100 bg-white/80 shadow-xl backdrop-blur-md dark:border-emerald-900/40 dark:bg-slate-900/80">
          <CardHeader className="flex flex-col items-center gap-2 pb-2">
            <Logo size={96} />
            <CardTitle className="text-center text-2xl font-bold tracking-tight">Sign in to Pika</CardTitle>
            <CardDescription className="text-muted-foreground text-center text-sm">
              Authenticate with your WordPress site to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Click the button below to authenticate with your WordPress site. You'll be redirected to WordPress to
              authorize Pika access.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 pt-8">
            <Button
              onClick={handleWordPressLogin}
              className="w-full bg-emerald-500 text-base font-semibold text-white shadow-md hover:bg-emerald-600"
              disabled={loading}
              size="lg"
            >
              {loading ? <span className="animate-pulse">Redirecting...</span> : 'Login'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AsyncStateWrapper>
  );
}
