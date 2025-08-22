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

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case 'desktop':
        return 'monitor';
      case 'mobile':
      case 'smartphone':
        return 'smartphone';
      case 'tablet':
        return 'tablet';
      case 'bot':
        return 'bot';
      default:
        return 'monitor';
    }
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
              <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-2">
                {sessions.data.map((session: Session) => (
                  <div
                    key={session.uuid}
                    className={`group relative overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-md ${
                      session.is_currently_using
                        ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:border-emerald-700 dark:from-emerald-900/20 dark:to-emerald-800/10'
                        : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/50'
                    }`}
                  >
                    {/* Current Session Badge */}
                    {session.is_currently_using && (
                      <div className="absolute -top-2 -right-2 z-10 rounded-full bg-emerald-500 px-2 py-1 pt-2 pr-4 text-xs font-semibold text-white shadow-lg">
                        Active
                      </div>
                    )}

                    {/* Header */}
                    <div className="flex items-start justify-between p-4 pb-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            session.is_currently_using
                              ? 'bg-emerald-100 dark:bg-emerald-800/30'
                              : 'bg-slate-100 dark:bg-slate-700'
                          }`}
                        >
                          <DynamicIcon
                            name={getDeviceIcon(session.device_info.device_type)}
                            className={`h-5 w-5 ${
                              session.is_currently_using
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-slate-600 dark:text-slate-400'
                            }`}
                          />
                        </div>
                        <div className="min-w-0">
                          <h5 className="truncate font-semibold text-slate-900 dark:text-white">{session.name}</h5>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {session.device_info.device_type} • {session.device_info.brand || 'Unknown'}
                          </p>
                        </div>
                      </div>

                      {/* Action Button */}
                      {!session.is_currently_using && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                          onClick={() => handleRevokeSession(session.uuid)}
                        >
                          <DynamicIcon name="x" className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {/* Device Details */}
                    <div className="px-4 pb-3">
                      <div className="space-y-2">
                        {/* Device Info Row */}
                        {(session.device_info.model || session.device_info.os_name) && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 dark:text-slate-400">Device</span>
                            <span className="text-slate-700 dark:text-slate-300">
                              {session.device_info.model && (
                                <span className="truncate">{session.device_info.model}</span>
                              )}
                              {session.device_info.model && session.device_info.os_name && (
                                <span className="mx-1">•</span>
                              )}
                              {session.device_info.os_name && (
                                <span className="truncate">{session.device_info.os_name}</span>
                              )}
                            </span>
                          </div>
                        )}

                        {/* Client Info Row */}
                        {(session.device_info.client_type || session.device_info.client_name) && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 dark:text-slate-400">Client</span>
                            <span className="text-slate-700 dark:text-slate-300">
                              {session.device_info.client_type && (
                                <span className="capitalize">{session.device_info.client_type}</span>
                              )}
                              {session.device_info.client_type && session.device_info.client_name && (
                                <span className="mx-1">•</span>
                              )}
                              {session.device_info.client_name && (
                                <span className="truncate">{session.device_info.client_name}</span>
                              )}
                            </span>
                          </div>
                        )}

                        {/* IP Address Row */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500 dark:text-slate-400">IP Address</span>
                          <span className="font-mono text-slate-700 dark:text-slate-300">{session.last_ip}</span>
                        </div>

                        {/* Last Used Row */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500 dark:text-slate-400">Last Used</span>
                          <span className="text-slate-700 dark:text-slate-300">
                            {session.last_used ? formatDate(session.last_used) : 'Never'}
                          </span>
                        </div>

                        {/* Created Date Row */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500 dark:text-slate-400">Created</span>
                          <span className="text-slate-700 dark:text-slate-300">{formatDate(session.created)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer with Revoke Button for Non-Current Sessions */}
                    {!session.is_currently_using && (
                      <div className="border-t border-slate-200 bg-slate-50/50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/30">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                          onClick={() => handleRevokeSession(session.uuid)}
                        >
                          <DynamicIcon name="shield-x" className="mr-2 h-3 w-3" />
                          Revoke Session
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                  <DynamicIcon name="shield" className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-slate-900 dark:text-white">No Active Sessions</h3>
                <p className="text-slate-500 dark:text-slate-400">You don't have any active sessions at the moment.</p>
              </div>
            )}
          </AsyncStateWrapper>
        </CardContent>
      </Card>
    </TabsLayout>
  );
};

export default ProfileSettings;
