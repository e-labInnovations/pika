import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DynamicIcon } from '@/components/lucide';
import Logo from '@/components/logo';
import { useNavigate } from 'react-router-dom';
import { useTitle } from '@/hooks/use-title';

export default function RejectAuth() {
  const navigate = useNavigate();
  useTitle('Authentication Rejected');

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100 px-4 dark:from-slate-900 dark:via-slate-950 dark:to-emerald-900">
      <Card className="mx-auto w-full max-w-md border-emerald-100 bg-white/80 shadow-xl backdrop-blur-md dark:border-emerald-900/40 dark:bg-slate-900/80">
        <CardHeader className="flex flex-col items-center gap-2 pb-2">
          <Logo size={96} />
          <CardTitle className="text-center text-2xl font-bold tracking-tight">Authentication Rejected</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-2">
          <Alert variant="destructive">
            <DynamicIcon name="x-circle" className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              Your request to access Pika has been rejected. This could be due to:
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>You cancelled the authorization process</li>
                <li>Your WordPress administrator denied the request</li>
                <li>There was an issue with the authorization</li>
              </ul>
            </AlertDescription>
          </Alert>
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
