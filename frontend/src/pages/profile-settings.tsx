import TabsLayout from '@/layouts/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { authService, type Session } from '@/services/api/auth.service';
import { useQuery } from '@tanstack/react-query';
import AsyncStateWrapper from '@/components/async-state-wrapper';
import { DynamicIcon } from '@/components/lucide';
import { runWithLoaderAndError } from '@/lib/utils';
import { useConfirmDialog } from '@/store/useConfirmDialog';

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const {
    data: sessions,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['sessions'],
    queryFn: () => authService.getSessions(),
  });

  const handleLogout = () => {
    signOut().then(() => {
      navigate('/login');
    });
  };

  const handleRevokeSession = (uuid: string) => {
    useConfirmDialog.getState().open({
      title: 'Revoke Session',
      message: `Are you sure you want to revoke this session?`,
      onConfirm: () => {
        runWithLoaderAndError(
          async () => {
            await authService.revokeSession(uuid);
          },
          {
            loaderMessage: 'Revoking session...',
            successMessage: 'Session revoked successfully',
            onSuccess: () => refetch(),
          },
        );
      },
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <TabsLayout
      header={{
        title: 'Profile Settings',
        description: 'Manage your profile settings',
        linkBackward: '/settings',
      }}
    >
      <Card className="bg-white/50 dark:bg-slate-800/50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.display_name || user.username || 'Avatar'}
                  className="h-16 w-16 object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-white">🏔️</span>
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-900 dark:text-white">{user?.display_name}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
              {user?.username && (
                <p className="mt-1 text-xs text-slate-400">
                  <span className="font-semibold">Username:</span> {user.username}
                </p>
              )}
              {user?.settings?.currency && (
                <p className="mt-1 text-xs text-slate-400">
                  <span className="font-semibold">Currency:</span> {user.settings.currency}
                </p>
              )}
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="max-w-2xl">
        <CardContent className="p-4">
          <h4 className="mb-4 font-semibold text-slate-900 dark:text-white">Sessions</h4>
          <AsyncStateWrapper isLoading={isLoading} error={error} onRetry={() => refetch()} className="min-h-[200px]">
            {sessions && sessions.data && sessions.data.length > 0 ? (
              <div className="space-y-3">
                {sessions.data.map((session: Session) => (
                  <div
                    key={session.uuid}
                    className={`flex items-center justify-between rounded-lg border p-3 ${
                      session.is_currently_using
                        ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20'
                        : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                        <DynamicIcon name="shield" className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {session.name}
                          {session.is_currently_using && (
                            <span className="ml-2 inline-flex items-center rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200">
                              Current Session
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">IP: {session.last_ip}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          Last used: {formatDate(session.last_used)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        Created: {formatDate(session.created)}
                      </p>
                      {!session.is_currently_using && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 text-xs"
                          onClick={() => handleRevokeSession(session.uuid)}
                        >
                          Revoke
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <DynamicIcon name="shield" className="mx-auto mb-3 h-12 w-12 text-slate-400" />
                <p className="text-slate-500 dark:text-slate-400">No active sessions found</p>
              </div>
            )}
          </AsyncStateWrapper>
        </CardContent>
      </Card>
    </TabsLayout>
  );
};

export default ProfileSettings;
