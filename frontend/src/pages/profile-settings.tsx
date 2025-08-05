import TabsLayout from '@/layouts/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    signOut();
    navigate('/login');
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
            <div>
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
          </div>
        </CardContent>
      </Card>
      <Button variant="outline" className="w-full" onClick={handleLogout}>
        Logout
      </Button>
    </TabsLayout>
  );
};

export default ProfileSettings;
