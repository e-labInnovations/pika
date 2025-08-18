import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DynamicIcon } from '@/components/lucide';
import Logo from '@/components/logo';
import { useAuth } from '@/hooks/use-auth';
import { authKey, authService, type User } from '@/services/api';
import { useTitle } from '@/hooks/use-title';
import type { AxiosResponse } from 'axios';

export default function Authorize() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useTitle('Authorizing...');

  const userLogin = searchParams.get('user_login');
  const password = searchParams.get('password');

  useEffect(() => {
    const handleAuthorization = () => {
      // Check if we have user credentials
      if (!userLogin || !password) {
        setError('Missing user credentials. Please try logging in again.');
        return;
      }

      setLoading(true);

      // Store credentials in localStorage as base64 encoded user_login:password
      const token = btoa(`${userLogin}:${password}`);
      localStorage.setItem(authKey, token);

      // Fetch user data to verify credentials
      authService
        .getMe()
        .then((response: AxiosResponse<User>) => {
          const user = response.data;
          signIn(token, user);
          // Redirect to home page
          navigate('/', { replace: true });
        })
        .catch((error) => {
          console.error('Authorization failed:', error);
          setError('Authentication failed. Please check your credentials and try again.');
          // Clear invalid token
          localStorage.removeItem(authKey);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    if (userLogin && password) {
      handleAuthorization();
    }
  }, [userLogin, password, navigate, signIn]);

  const handleBackToLogin = () => {
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100 px-4 dark:from-slate-900 dark:via-slate-950 dark:to-emerald-900">
        <Card className="mx-auto w-full max-w-md border-emerald-100 bg-white/80 shadow-xl backdrop-blur-md dark:border-emerald-900/40 dark:bg-slate-900/80">
          <CardHeader className="flex flex-col items-center gap-2 pb-2">
            <Logo size={96} />
            <CardTitle className="text-center text-2xl font-bold tracking-tight">Authorizing...</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-500"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100 px-4 dark:from-slate-900 dark:via-slate-950 dark:to-emerald-900">
      <Card className="mx-auto w-full max-w-md border-emerald-100 bg-white/80 shadow-xl backdrop-blur-md dark:border-emerald-900/40 dark:bg-slate-900/80">
        <CardHeader className="flex flex-col items-center gap-2 pb-2">
          <Logo size={96} />
          <CardTitle className="text-center text-2xl font-bold tracking-tight">Authorization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-2">
          {error && (
            <Alert variant="destructive">
              <DynamicIcon name="alert-circle" className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2 pt-8">
          <Button
            onClick={handleBackToLogin}
            className="w-full bg-emerald-500 text-base font-semibold text-white shadow-md hover:bg-emerald-600"
            size="lg"
          >
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
