import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { z } from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { authService, type User } from '@/services/api/auth.service';
// import { authService } from '@/services/api/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Clipboard } from 'lucide-react';
import Logo from '@/components/logo';
import type { AxiosResponse } from 'axios';
import { useTitle } from '@/hooks/use-title';

const loginSchema = z.object({
  username: z.string().min(3, 'Username is required'),
  appPassword: z
    .string()
    .regex(
      /^[a-zA-Z0-9]{4} [a-zA-Z0-9]{4} [a-zA-Z0-9]{4} [a-zA-Z0-9]{4} [a-zA-Z0-9]{4} [a-zA-Z0-9]{4}$/,
      'Invalid application password format',
    ),
});

export default function Login() {
  const [form, setForm] = useState({ username: '', appPassword: '' });
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  useTitle('Login');

  const result = loginSchema.safeParse(form);
  const errors = !result.success ? result.error.formErrors.fieldErrors : {};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handlePaste = () => {
    navigator.clipboard.readText().then((text) => {
      setForm((prev) => ({ ...prev, appPassword: text }));
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ username: true, appPassword: true });
    setError('');
    setSuccess(false);
    if (!loginSchema.safeParse(form).success) return;
    setLoading(true);
    const token = btoa(`${form.username}:${form.appPassword}`);
    localStorage.setItem('token', token);

    authService
      .getMe()
      .then((response: AxiosResponse<User>) => {
        const user = response.data;
        console.log(user);
        signIn(token, user);
        setSuccess(true);
        navigate(location.state?.from?.pathname || '/', { replace: true });
      })
      .catch((error) => {
        console.error(error);
        setError('Invalid username or password');
      })
      .finally(() => {
        setLoading(false);
      });

    // try {
    //   const userData = await authService.login(token);
    //   await signIn(token, userData);

    //   setSuccess(true);

    //   // Redirect to the page they tried to visit or home
    //   const from = location.state?.from?.pathname || '/';
    //   navigate(from, { replace: true });
    // } catch {
    //   setError('Invalid username or password');
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100 px-4 dark:from-slate-900 dark:via-slate-950 dark:to-emerald-900">
      <Card className="mx-auto w-full max-w-md border-emerald-100 bg-white/80 shadow-xl backdrop-blur-md dark:border-emerald-900/40 dark:bg-slate-900/80">
        <CardHeader className="flex flex-col items-center gap-2 pb-2">
          <Logo size={96} />
          <CardTitle className="text-center text-2xl font-bold tracking-tight">Sign in to Pika</CardTitle>
          <CardDescription className="text-muted-foreground text-center text-sm">
            Enter your credentials to continue
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} autoComplete="on">
          <CardContent className="space-y-6 pt-2">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={form.username}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your username"
                aria-invalid={!!errors.username && touched.username}
                required
              />
              {touched.username && errors.username && (
                <div className="mt-1 text-xs text-red-500">{errors.username}</div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="appPassword">Application Password</Label>
                <a
                  href="https://wordpress.com/support/application-passwords/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-600 hover:underline"
                >
                  What is this?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="appPassword"
                  name="appPassword"
                  type="password"
                  autoComplete="current-password"
                  value={form.appPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your application password"
                  aria-invalid={!!errors.appPassword && touched.appPassword}
                  required
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 p-0 duration-200"
                  onClick={handlePaste}
                >
                  <Clipboard className="h-4 w-4" />
                </Button>
              </div>
              {touched.appPassword && errors.appPassword && (
                <div className="mt-1 text-xs text-red-500">{errors.appPassword}</div>
              )}
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Badge variant="default" className="w-full justify-center bg-emerald-500 py-2 text-base text-white">
                Login successful!
              </Badge>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-2 pt-8">
            <Button
              type="submit"
              className="w-full bg-emerald-500 text-base font-semibold text-white shadow-md hover:bg-emerald-600"
              disabled={loading}
              size="lg"
            >
              {loading ? <span className="animate-pulse">Signing in...</span> : 'Sign in'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
